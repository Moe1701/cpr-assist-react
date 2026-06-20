// --- Datei: src/utils/pdfExport.js ---
import { jsPDF } from 'jspdf';

// Hilfsfunktion für sichere abgerundete Ecken im Canvas
const drawSafeRoundRect = (ctx, x, y, w, h, r) => {
  if (ctx.roundRect) {
    ctx.beginPath(); ctx.roundRect(x, y, w, h, r);
  } else {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
  }
};

const formatTime = (seconds) => {
  if (isNaN(seconds) || seconds === null) return "00:00";
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};

const formatRelative = (seconds) => {
  if (isNaN(seconds) || seconds === null) return "+00:00";
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `+${m}:${s}`;
};

const getIconData = (txt) => {
  if (!txt) return null;
  const t = txt.toLowerCase();
  if (t.includes('schock') && !t.includes('schockbar')) {
    const match = t.match(/(\d+)\s*[jJ]/);
    if (match) return { icon: match[1] + 'J', isText: true, type: 'shock' };
    return { icon: '⚡', type: 'shock' };
  }
  if (t.includes('nicht schockbar')) return { icon: '🚫⚡', type: 'analysis-no' };
  if (t.includes('schockbar')) return { icon: '⚡', type: 'analysis-yes' };
  if (t.includes('hits') || t.includes('sampler') || t.includes('anamnese')) return { icon: '📋', type: 'info' };
  if (t.includes('adrenalin')) return { icon: '💉', type: 'adr' };
  if (t.includes('amiodaron') || t.includes('amio')) return { icon: '💊', type: 'amio' };
  if (t.includes('atemweg') || t.includes('beatmung')) return { icon: '🫁', type: 'airway' };
  if (t.includes('zugang:')) return { icon: '💧', type: 'access' };
  if (t.includes('start rea') || t.includes('kompression gestartet') || t.includes('fortgesetzt')) return { icon: '▶', type: 'start' };
  if (t.includes('rosc')) return { icon: '❤️', type: 'rosc' };
  if (t.includes('re-arrest')) return { icon: '💔', type: 'arrest' };
  if (t.includes('abbruch') || t.includes('beendet')) return { icon: '⏹', type: 'end' };
  if (t.includes('kompression pause') || t.includes('analyse')) return null;
  return { icon: '📌', type: 'default' };
};

export const generatePDFExport = (state, type = 'übergabe') => {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const isSummary = type === 'übergabe';
  
  const now = new Date();
  const dateStr = now.toLocaleDateString('de-DE');
  const timeStr = now.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }).replace(':', '');
  const data = state.events || [];
  
  // --- FACTS BERECHNEN ---
  const totalSec = state.missionSeconds || 0;
  const maxSec = data.length > 0 ? Math.max(totalSec, data[data.length - 1].missionTime) : totalSec;
  
  let ageStr = state.isPediatric ? (state.patientWeight ? `Kind (${state.patientWeight} kg)` : 'Kind') : 'Erwachsener';
  if (state.anamneseData.alter || state.anamneseData.gewicht) {
      let zusatz = [];
      if (state.anamneseData.alter) zusatz.push(`${state.anamneseData.alter} J.`);
      if (state.anamneseData.gewicht) zusatz.push(`${state.anamneseData.gewicht} kg`);
      ageStr += ` (${zusatz.join(' | ')})`;
  }

  let adrTotal = "0 mg";
  if (state.adrCount > 0) adrTotal = (state.isPediatric && state.patientWeight) ? (state.adrCount * Math.round(state.patientWeight * 10)) + " µg" : state.adrCount + " mg";
  let amioTotal = "0 mg";
  if (state.amioCount > 0) amioTotal = (state.isPediatric && state.patientWeight) ? (state.amioCount * Math.round(state.patientWeight * 5)) + " mg" : (state.amioCount === 1 ? '300 mg' : '450 mg');

  let endStatus = 'Laufende CPR';
  if (state.appPhase === 'rosc') endStatus = 'ROSC';
  if (state.abbruchReason) endStatus = 'Abbruch';

  const activeHits = Object.entries(state.hitsStatus).filter(([_, isActive]) => isActive).map(([key]) => key);

  // KPIs
  let firstCPR = null, firstShock = null, firstAdr = null, firstAccess = null, firstAirway = null, definitiveAirway = null, timeToRosc = null;
  let adrTimes = [], amioTimes = [], analyses = [], anaToShockIntervals = [];
  let lastAnalysisTime = null;
  let totalJoule = 0;

  let pausesObj = [];
  let currentStart = null;

  data.forEach(d => {
    const t = d.fullEntry.toLowerCase();
    const sec = d.missionTime;

    // Pausen
    if (t.includes('pause') || t.includes('analyse') || t.includes('schockbar')) {
        if (currentStart === null) currentStart = sec;
    } else if (t.includes('fortgesetzt') || t.includes('gestartet') || t.includes('rosc')) {
        if (currentStart !== null) {
            pausesObj.push({ start: currentStart, end: sec, duration: sec - currentStart });
            currentStart = null;
        }
    }

    if (t.includes('rosc') && timeToRosc === null) timeToRosc = sec;
    if (!firstCPR && (t.includes('start rea') || t.includes('kompression gestartet'))) firstCPR = sec;
    if (!firstShock && t.includes('schock abgegeben')) firstShock = sec;
    if (!firstAdr && t.includes('adrenalin')) firstAdr = sec;
    if (!firstAccess && t.includes('zugang:')) firstAccess = sec;
    
    if (t.includes('atemweg:')) {
        const awType = d.detail || 'Erfasst';
        if (!firstAirway) firstAirway = { time: sec, type: awType };
        if (!t.includes('beutel') && !definitiveAirway) definitiveAirway = { time: sec, type: awType };
    }

    if (t.includes('adrenalin')) adrTimes.push(sec);
    if (t.includes('amiodaron')) amioTimes.push(sec);
    
    if (t.includes('analyse') || t.includes('schockbar')) {
        analyses.push(sec);
        lastAnalysisTime = sec;
    }

    if (t.includes('schock abgegeben')) {
        const match = t.match(/(\d+)\s*j/i);
        if (match) totalJoule += parseInt(match[1], 10);
        if (lastAnalysisTime !== null) {
            anaToShockIntervals.push(sec - lastAnalysisTime);
            lastAnalysisTime = null;
        }
    }
  });

  if (currentStart !== null) pausesObj.push({ start: currentStart, end: maxSec, duration: maxSec - currentStart });

  const maxPause = pausesObj.length > 0 ? Math.max(...pausesObj.map(p => p.duration)) : 0;
  const totalHandsOff = Math.max(0, state.arrestSeconds - state.compressingSeconds);
  
  let adrIntervals = []; for (let i = 1; i < adrTimes.length; i++) adrIntervals.push(adrTimes[i] - adrTimes[i-1]);
  const avgAdrInt = adrIntervals.length > 0 ? Math.round(adrIntervals.reduce((a, b) => a + b, 0) / adrIntervals.length) : 0;
  
  let amioIntervals = []; for (let i = 1; i < amioTimes.length; i++) amioIntervals.push(amioTimes[i] - amioTimes[i-1]);
  const avgAmioInt = amioIntervals.length > 0 ? Math.round(amioIntervals.reduce((a, b) => a + b, 0) / amioIntervals.length) : 0;
  
  let anaIntervals = []; for (let i = 1; i < analyses.length; i++) anaIntervals.push(analyses[i] - analyses[i-1]);
  const avgAnaInt = anaIntervals.length > 0 ? Math.round(anaIntervals.reduce((a, b) => a + b, 0) / anaIntervals.length) : 0;
  
  const avgAnaToShock = anaToShockIntervals.length > 0 ? Math.round(anaToShockIntervals.reduce((a,b)=>a+b,0)/anaToShockIntervals.length) : 0;
  const minAnaToShock = anaToShockIntervals.length > 0 ? Math.min(...anaToShockIntervals) : 0;
  const maxAnaToShock = anaToShockIntervals.length > 0 ? Math.max(...anaToShockIntervals) : 0;


  // ==========================================
  // SEITE 1: SBAR & ÜBERGABE
  // ==========================================
  doc.setFontSize(22); doc.setTextColor(15, 23, 42); doc.setFont("helvetica", "bold");
  doc.text("REANIMATIONSPROTOKOLL", 15, 20);
  
  doc.setFontSize(10); doc.setTextColor(100, 116, 139); doc.setFont("helvetica", "normal");
  doc.text(`MODUS: ${isSummary ? 'SCHOCKRAUM ÜBERGABE' : 'DEBRIEFING & AUDIT'}`, 15, 26);
  
  doc.text(`Datum: ${dateStr}`, 195, 20, {align: 'right'});
  doc.text(`Einsatzbeginn: ${state.startTime || '--:--'} Uhr`, 195, 26, {align: 'right'});
  
  doc.setDrawColor(227, 0, 15); doc.setLineWidth(1); doc.line(15, 30, 195, 30);

  let y = 45;
  doc.setFontSize(14); doc.setTextColor(227, 0, 15); doc.setFont("helvetica", "bold"); doc.text("S - SITUATION", 15, y);
  doc.setDrawColor(241, 245, 249); doc.setLineWidth(0.5); doc.line(15, y+2, 195, y+2); y+=10;
  
  doc.setFillColor(248, 250, 252); doc.setDrawColor(226, 232, 240); doc.setLineWidth(0.2);
  doc.roundedRect(15, y, 65, 24, 2, 2, 'FD');
  doc.roundedRect(85, y, 35, 24, 2, 2, 'FD');
  doc.roundedRect(125, y, 70, 24, 2, 2, 'FD');
  
  doc.setFontSize(8); doc.setTextColor(100, 116, 139); doc.setFont("helvetica", "normal");
  doc.text("PATIENT", 47.5, y+6, {align: 'center'});
  doc.text("GESAMTDAUER", 102.5, y+6, {align: 'center'});
  doc.text("AKTUELLER STATUS", 160, y+6, {align: 'center'});
  
  doc.setFontSize(11); doc.setTextColor(15, 23, 42); doc.setFont("helvetica", "bold");
  doc.text(ageStr, 47.5, y+14, {align: 'center'});
  doc.setFontSize(12); doc.text(`${formatTime(totalSec)} Min`, 102.5, y+14, {align: 'center'});
  
  if(endStatus === 'ROSC') doc.setTextColor(16, 185, 129); else if(endStatus === 'Abbruch') doc.setTextColor(15, 23, 42);
  doc.text(endStatus.toUpperCase(), 160, y+14, {align: 'center'});
  
  if (endStatus === 'ROSC' && timeToRosc !== null) {
      doc.setFontSize(9); doc.setTextColor(4, 120, 87); doc.setFont("helvetica", "normal");
      doc.text(`Zeit bis ROSC: ${formatTime(timeToRosc)} Min`, 160, y+20, {align: 'center'});
  } else if (endStatus === 'Abbruch' && state.abbruchReason) {
      doc.setFontSize(8); doc.setTextColor(71, 85, 105); doc.setFont("helvetica", "normal");
      const splitReason = doc.splitTextToSize(`Grund: ${state.abbruchReason}`, 65);
      doc.text(splitReason, 160, y+20, {align: 'center'});
  }

  y += 35;
  doc.setFontSize(14); doc.setTextColor(227, 0, 15); doc.setFont("helvetica", "bold"); doc.text("B - BACKGROUND (ANAMNESE)", 15, y);
  doc.setDrawColor(241, 245, 249); doc.setLineWidth(0.5); doc.line(15, y+2, 195, y+2); y+=8;
  
  doc.roundedRect(15, y, 180, 40, 2, 2, 'S');
  doc.setFontSize(10); doc.setTextColor(15, 23, 42); doc.setFont("helvetica", "bold"); doc.text("Beobachtet:", 20, y+8);
  doc.setFont("helvetica", "normal"); doc.text(state.anamneseData.beobachtet || '?', 45, y+8);
  doc.setFont("helvetica", "bold"); doc.text("Laien-REA:", 80, y+8);
  doc.setFont("helvetica", "normal"); doc.text(state.anamneseData.laienrea || '?', 105, y+8);
  
  doc.setDrawColor(203, 213, 225); doc.setLineDashPattern([2, 2], 0); doc.line(20, y+14, 190, y+14); doc.setLineDashPattern([], 0);
  doc.setFontSize(9); doc.setTextColor(100, 116, 139); doc.setFont("helvetica", "bold"); doc.text("SAMPLER:", 20, y+20);
  
  doc.setFontSize(10); doc.setTextColor(15, 23, 42); doc.setFont("helvetica", "normal");
  let sampStr = [];
  const sMap = {s:'Symptome', a:'Allergien', m:'Medikamente', p:'Vorerkrankungen', l:'Letzte Mahlzeit', e:'Ereignis', r:'Risikofaktoren'};
  Object.keys(sMap).forEach(k => { if (state.anamneseData.sampler[k]) sampStr.push(`${sMap[k]}: ${state.anamneseData.sampler[k]}`); });
  
  if(sampStr.length > 0) {
      let sy = y+25;
      sampStr.forEach(s => { doc.text(s, 20, sy); sy += 5; });
  } else {
      doc.setFont("helvetica", "italic"); doc.setTextColor(148, 163, 184); doc.text("Keine SAMPLER-Daten erfasst.", 20, y+25);
  }

  y += 50;
  doc.setFontSize(14); doc.setTextColor(227, 0, 15); doc.setFont("helvetica", "bold"); doc.text("A - ASSESSMENT (DIAGNOSTIK)", 15, y);
  doc.setDrawColor(241, 245, 249); doc.setLineWidth(0.5); doc.line(15, y+2, 195, y+2); y+=8;
  
  doc.roundedRect(15, y, 180, 35, 2, 2, 'S');
  doc.setFontSize(9); doc.setTextColor(100, 116, 139); doc.setFont("helvetica", "bold"); doc.text("Reversible Ursachen (HITS):", 20, y+8);
  
  doc.setFontSize(10); doc.setTextColor(15, 23, 42); doc.setFont("helvetica", "normal");
  if(activeHits.length > 0) {
      let hy = y+14;
      activeHits.forEach(h => { doc.text(`- ${h.toUpperCase()}`, 20, hy); hy += 6; });
  } else {
      doc.setFont("helvetica", "italic"); doc.setTextColor(148, 163, 184); doc.text("Keine Ursachen (HITS) erfasst.", 20, y+14);
  }
  
  doc.setDrawColor(226, 232, 240); doc.setLineWidth(0.2); doc.line(135, y+2, 135, y+33);
  doc.setFontSize(9); doc.setTextColor(100, 116, 139); doc.setFont("helvetica", "bold"); doc.text("CPR Qualität (CCF):", 165, y+10, {align: 'center'});
  doc.setFontSize(24); doc.setFont("helvetica", "bold");
  if (state.currentCcfPercent >= 80) doc.setTextColor(16, 185, 129); else doc.setTextColor(227, 0, 15);
  doc.text(`${state.currentCcfPercent || 100}%`, 165, y+22, {align: 'center'});
  doc.setFontSize(8); doc.setTextColor(148, 163, 184); doc.text("Zielwert: > 80%", 165, y+28, {align: 'center'});

  y += 45;
  doc.setFontSize(14); doc.setTextColor(227, 0, 15); doc.setFont("helvetica", "bold"); doc.text("R - RESPONSE (MASSNAHMEN)", 15, y);
  doc.setDrawColor(241, 245, 249); doc.setLineWidth(0.5); doc.line(15, y+2, 195, y+2); y+=8;
  
  const drawRow = (yPos, label, val, isRed=false, isPurp=false) => {
      doc.setFillColor(isRed ? 254 : (isPurp ? 250 : 248), isRed ? 242 : (isPurp ? 245 : 250), isRed ? 242 : (isPurp ? 255 : 252));
      doc.rect(15, yPos, 60, 8, 'FD'); doc.rect(75, yPos, 120, 8, 'S');
      doc.setFontSize(10); doc.setFont("helvetica", "bold");
      doc.setTextColor(100, 116, 139); if(isRed) doc.setTextColor(227, 0, 15); if(isPurp) doc.setTextColor(126, 34, 206);
      doc.text(label, 20, yPos+5.5);
      doc.setTextColor(15, 23, 42); if(isRed) doc.setTextColor(227, 0, 15); if(isPurp) doc.setTextColor(126, 34, 206);
      doc.text(val, 80, yPos+5.5);
  };
  
  doc.setDrawColor(226, 232, 240); doc.setLineWidth(0.2);
  drawRow(y, "Atemweg", state.airwayType || 'Nicht dokumentiert');
  drawRow(y+8, "Zugang", state.zugang || 'Nicht dokumentiert');
  drawRow(y+16, "Defibrillationen", `${state.shockCount || 0}x Schocks abgegeben`);
  drawRow(y+24, "Adrenalin", `Gesamt: ${adrTotal} (${state.adrCount} Gaben)`, true, false);
  drawRow(y+32, "Amiodaron", `Gesamt: ${amioTotal} (${state.amioCount} Gaben)`, false, true);

  doc.setFontSize(8); doc.setTextColor(148, 163, 184); doc.setFont("helvetica", "normal");
  doc.text("Dieses Protokoll wurde maschinell durch CPR Assist erstellt. Alle Angaben sind fachlich zu prüfen.", 105, 285, {align: 'center'});

  // ==========================================
  // SEITEN 2-4: NUR BEIM DEBRIEFING EXPORT
  // ==========================================
  if (!isSummary) {
      
      // SEITE 2: KPIs
      doc.addPage('a4', 'portrait');
      let py = 20;
      doc.setFontSize(22); doc.setTextColor(15, 23, 42); doc.setFont("helvetica", "bold"); doc.text("PERFORMANCE INSIGHTS", 15, py);
      doc.setFontSize(10); doc.setTextColor(100, 116, 139); doc.setFont("helvetica", "normal"); doc.text("DETAILLIERTE KPI-AUSWERTUNG FÜR DAS DEBRIEFING", 15, py+6);
      py+=10; doc.setDrawColor(227, 0, 15); doc.setLineWidth(1); doc.line(15, py, 195, py); py+=10;

      doc.setFontSize(12); doc.setTextColor(227, 0, 15); doc.setFont("helvetica", "bold"); doc.text("1. CPR QUALITÄT & PAUSEN", 15, py); py+=4;
      doc.setFillColor(248, 250, 252); doc.setDrawColor(226, 232, 240); doc.setLineWidth(0.2);
      doc.roundedRect(15, py, 56, 18, 2, 2, 'FD'); doc.roundedRect(77, py, 56, 18, 2, 2, 'FD'); doc.roundedRect(139, py, 56, 18, 2, 2, 'FD');
      doc.setFontSize(7); doc.setTextColor(100, 116, 139); doc.setFont("helvetica", "bold");
      doc.text("CCF (CPR-ANTEIL)", 43, py+5, {align: 'center'}); doc.text("HANDS-OFF GESAMT", 105, py+5, {align: 'center'}); doc.text("LÄNGSTE PAUSE", 167, py+5, {align: 'center'});
      doc.setFontSize(14); doc.setFont("helvetica", "bold");
      if (state.currentCcfPercent >= 80) doc.setTextColor(16, 185, 129); else doc.setTextColor(227, 0, 15);
      doc.text(`${state.currentCcfPercent || 100}%`, 43, py+14, {align: 'center'});
      doc.setTextColor(15, 23, 42); doc.text(`${formatTime(totalHandsOff)} Min`, 105, py+14, {align: 'center'});
      if (maxPause > 10) doc.setTextColor(227, 0, 15); else doc.setTextColor(16, 185, 129);
      doc.text(`${maxPause} s`, 167, py+14, {align: 'center'});
      
      py += 26;
      doc.setFontSize(12); doc.setTextColor(227, 0, 15); doc.setFont("helvetica", "bold"); doc.text("2. SCHOCK-THERAPIE & RHYTHMUS", 15, py); py+=4;
      doc.setFillColor(248, 250, 252); doc.roundedRect(15, py, 56, 18, 2, 2, 'FD'); doc.roundedRect(77, py, 56, 18, 2, 2, 'FD'); doc.roundedRect(139, py, 56, 18, 2, 2, 'FD');
      doc.setFontSize(7); doc.setTextColor(100, 116, 139);
      doc.text("DEFIBRILLATIONEN", 43, py+5, {align: 'center'}); doc.text("PRE-SHOCK PAUSE", 105, py+5, {align: 'center'}); doc.text("ZEIT BIS ROSC", 167, py+5, {align: 'center'});
      doc.setFontSize(12); doc.setTextColor(15, 23, 42);
      doc.text(state.shockCount > 0 ? `${state.shockCount}x (${totalJoule} J)` : '0x', 43, py+12, {align: 'center'});
      doc.setTextColor(227, 0, 15); doc.text(avgAnaToShock > 0 ? `${avgAnaToShock} s` : '--', 105, py+11, {align: 'center'});
      doc.setFontSize(6); doc.setFont("helvetica", "normal"); doc.setTextColor(100, 116, 139);
      if (avgAnaToShock > 0) doc.text(`Min: ${minAnaToShock}s | Max: ${maxAnaToShock}s`, 105, py+16, {align: 'center'});
      doc.setFontSize(14); doc.setFont("helvetica", "bold"); doc.setTextColor(16, 185, 129);
      doc.text(timeToRosc !== null ? formatTime(timeToRosc) : '--:--', 167, py+14, {align: 'center'});

      py += 26;
      doc.setFontSize(12); doc.setTextColor(227, 0, 15); doc.setFont("helvetica", "bold"); doc.text("3. MEDIKAMENTE & INTERVALLE", 15, py); py+=4;
      doc.setFillColor(248, 250, 252); doc.roundedRect(15, py, 56, 18, 2, 2, 'FD'); doc.roundedRect(77, py, 56, 18, 2, 2, 'FD'); doc.roundedRect(139, py, 56, 18, 2, 2, 'FD');
      doc.setFontSize(7); doc.setTextColor(100, 116, 139);
      doc.text("Ø ADRENALIN-INTERVALL", 43, py+5, {align: 'center'}); doc.text("Ø AMIODARON-INTERVALL", 105, py+5, {align: 'center'}); doc.text("Ø RHYTHMUS-ANALYSE", 167, py+5, {align: 'center'});
      doc.setFontSize(14); doc.setTextColor(15, 23, 42);
      doc.text(avgAdrInt > 0 ? formatTime(avgAdrInt) : '--:--', 43, py+14, {align: 'center'});
      doc.text(avgAmioInt > 0 ? formatTime(avgAmioInt) : '--:--', 105, py+14, {align: 'center'});
      doc.text(avgAnaInt > 0 ? formatTime(avgAnaInt) : '--:--', 167, py+14, {align: 'center'});

      py += 26;
      doc.setFontSize(12); doc.setTextColor(227, 0, 15); doc.setFont("helvetica", "bold"); doc.text("4. ATEMWEGS-MANAGEMENT", 15, py); py+=4;
      doc.setFillColor(248, 250, 252); doc.roundedRect(15, py, 87, 18, 2, 2, 'FD'); doc.roundedRect(108, py, 87, 18, 2, 2, 'FD');
      doc.setFontSize(7); doc.setTextColor(100, 116, 139);
      doc.text(`1. MASSNAHME (${firstAirway ? firstAirway.type.toUpperCase() : '-'})`, 58.5, py+5, {align: 'center'});
      doc.text(`SICHERUNG (${definitiveAirway ? definitiveAirway.type.toUpperCase() : '-'})`, 151.5, py+5, {align: 'center'});
      doc.setFontSize(14); doc.setTextColor(15, 23, 42);
      doc.text(firstAirway ? formatTime(firstAirway.time) : '--:--', 58.5, py+14, {align: 'center'});
      doc.text(definitiveAirway ? formatTime(definitiveAirway.time) : '--:--', 151.5, py+14, {align: 'center'});

      py += 26;
      doc.setFontSize(12); doc.setTextColor(227, 0, 15); doc.setFont("helvetica", "bold"); doc.text("5. REAKTIONSZEITEN (AB START REA)", 15, py); py+=4;
      doc.setFillColor(248, 250, 252); doc.roundedRect(15, py, 42, 18, 2, 2, 'FD'); doc.roundedRect(61, py, 42, 18, 2, 2, 'FD'); doc.roundedRect(107, py, 42, 18, 2, 2, 'FD'); doc.roundedRect(153, py, 42, 18, 2, 2, 'FD');
      doc.setFontSize(7); doc.setTextColor(100, 116, 139);
      doc.text("1. KOMPRESSION", 36, py+5, {align: 'center'}); doc.text("1. SCHOCK", 82, py+5, {align: 'center'}); doc.text("1. SUPRA", 128, py+5, {align: 'center'}); doc.text("1. ZUGANG", 174, py+5, {align: 'center'});
      doc.setFontSize(14); doc.setTextColor(15, 23, 42);
      doc.text(firstCPR !== null ? formatTime(firstCPR) : '--:--', 36, py+14, {align: 'center'});
      doc.text(firstShock !== null ? formatTime(firstShock) : '--:--', 82, py+14, {align: 'center'});
      doc.text(firstAdr !== null ? formatTime(firstAdr) : '--:--', 128, py+14, {align: 'center'});
      doc.text(firstAccess !== null ? formatTime(firstAccess) : '--:--', 174, py+14, {align: 'center'});

      doc.setFontSize(8); doc.setTextColor(148, 163, 184); doc.setFont("helvetica", "normal");
      doc.text("Dieses Protokoll wurde maschinell durch CPR Assist erstellt. Alle Angaben sind fachlich zu prüfen.", 105, 285, {align: 'center'});

      // SEITE 3: GRAFISCHE ZEITLINIE (NATIVE CANVAS API)
      const cycleDuration = 240;
      const totalPagesTimeline = Math.max(1, Math.ceil(maxSec / (4 * cycleDuration)));
      
      for (let p = 0; p < totalPagesTimeline; p++) {
          doc.addPage('a4', 'landscape');
          
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const scale = 2;
          const baseWidth = 1400;
          const baseHeight = 1000;
          
          canvas.width = baseWidth * scale;
          canvas.height = baseHeight * scale;
          ctx.scale(scale, scale);
          
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, baseWidth, baseHeight);
          
          ctx.fillStyle = '#64748b'; ctx.font = 'bold 20px Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText(`GRAFISCHES ZEITLINIEN-GRID (Seite ${p + 1})`, baseWidth / 2, 40);
          
          ctx.fillStyle = '#334155'; ctx.font = 'bold 12px Arial';
          const legendText = "▶ START | ❤️ ROSC | ⚡ SCHOCKBAR | 🚫⚡ NICHT SCHOCKBAR | SCHOCK (Joule in Rot) | 💉 ADRENALIN | 💊 AMIODARON | 🫁 ATEMWEG | 💧 ZUGANG | CPR PAUSE (Roter Balken)";
          ctx.fillText(legendText, baseWidth / 2, 70);
          
          const paddingX = 80;
          const usableWidth = baseWidth - (paddingX * 2);
          const startSecForPage = p * 4 * cycleDuration;
          
          for (let i = 0; i < 4; i++) {
              const currentDrawSec = startSecForPage + (i * cycleDuration);
              if (currentDrawSec > maxSec && i > 0) break;
              
              const cycleEndSec = currentDrawSec + cycleDuration;
              const lineY = 170 + (i * 230);
              
              ctx.beginPath(); ctx.moveTo(paddingX, lineY); ctx.lineTo(baseWidth - paddingX, lineY);
              ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.stroke();
              
              for (let t = 15; t < cycleDuration; t += 15) {
                  const tickSec = currentDrawSec + t;
                  const pct = t / cycleDuration;
                  const xTick = paddingX + pct * usableWidth;
                  let tickH = (t % 60 === 0) ? 14 : 6;
                  
                  ctx.beginPath(); ctx.moveTo(xTick, lineY - tickH/2); ctx.lineTo(xTick, lineY + tickH/2);
                  ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.5; ctx.stroke();
                  
                  if (t % 60 === 0) {
                      ctx.fillStyle = '#94a3b8'; ctx.font = 'bold 10px Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                      ctx.fillText(formatTime(tickSec), xTick, lineY + 10);
                  }
              }
              
              pausesObj.forEach(ps => {
                  const pStart = Math.max(ps.start, currentDrawSec);
                  const pEnd = Math.min(ps.end, cycleEndSec);
                  if (pStart < pEnd) {
                      const pctStart = (pStart - currentDrawSec) / cycleDuration;
                      const pctEnd = (pEnd - currentDrawSec) / cycleDuration;
                      const xStart = paddingX + pctStart * usableWidth;
                      const pWidth = (paddingX + pctEnd * usableWidth) - xStart;
                      
                      ctx.fillStyle = '#ef4444'; ctx.fillRect(xStart, lineY - 5, pWidth, 10);
                      if (pWidth > 20) {
                          ctx.fillStyle = '#ffffff'; ctx.font = 'bold 10px Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                          ctx.fillText(ps.duration + 's', xStart + pWidth/2, lineY);
                      }
                  }
              });
              
              ctx.fillStyle = '#94a3b8'; ctx.font = 'bold 14px Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
              ctx.fillRect(paddingX - 1, lineY - 8, 2, 16);
              ctx.fillText(formatTime(currentDrawSec), paddingX, lineY - 12);
              ctx.fillRect(paddingX + usableWidth - 1, lineY - 8, 2, 16);
              ctx.fillText(formatTime(cycleEndSec), paddingX + usableWidth, lineY - 12);
              
              const cycleEvents = data.filter(e => e.missionTime >= currentDrawSec && e.missionTime < cycleEndSec);
              
              cycleEvents.forEach((ev, index) => {
                  const iconData = getIconData(ev.fullEntry);
                  if (!iconData) return;
                  
                  const secInCycle = ev.missionTime - currentDrawSec;
                  const x = paddingX + ((secInCycle / cycleDuration) * usableWidth);
                  
                  const yOffsets = [25, -25, 55, -55, 85, -85, 115, -115];
                  const yOff = yOffsets[index % yOffsets.length];
                  
                  const boxHeight = 26;
                  const boxY = lineY + yOff - boxHeight/2;
                  
                  let actionText = `${ev.type}${ev.detail ? ': ' + ev.detail : ''}`;
                  if (actionText.length > 30) actionText = actionText.substring(0, 30) + '...';
                  
                  const textWidth = ctx.measureText(actionText).width;
                  const timeWidth = ctx.measureText(`[${formatRelative(ev.missionTime)}]`).width;
                  const boxWidth = textWidth + timeWidth + 40;
                  const boxHalf = boxWidth / 2;
                  
                  ctx.beginPath(); ctx.moveTo(x, lineY); ctx.lineTo(x, lineY + yOff);
                  ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.0; ctx.stroke();
                  
                  ctx.shadowColor = 'rgba(0,0,0,0.05)'; ctx.shadowBlur = 4; ctx.shadowOffsetY = 2;
                  ctx.fillStyle = '#ffffff';
                  drawSafeRoundRect(ctx, x - boxHalf, boxY, boxWidth, boxHeight, 6);
                  ctx.fill(); ctx.shadowColor = 'transparent';
                  
                  let borderColor = '#e2e8f0';
                  if (iconData.type === 'adr' || iconData.type === 'shock') borderColor = '#fca5a5';
                  if (iconData.type === 'amio') borderColor = '#d8b4fe';
                  if (iconData.type === 'analysis-yes') borderColor = '#fde047';
                  
                  ctx.strokeStyle = borderColor; ctx.lineWidth = 2; ctx.stroke();
                  
                  ctx.fillStyle = '#E3000F'; ctx.font = 'bold 12px monospace'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
                  ctx.fillText(`[${formatRelative(ev.missionTime)}]`, x - boxHalf + 10, boxY + boxHeight/2);
                  
                  ctx.fillStyle = '#334155'; ctx.font = 'bold 12px Arial';
                  ctx.fillText(`${iconData.icon} ${actionText}`, x - boxHalf + 10 + timeWidth + 5, boxY + boxHeight/2);
                  
                  ctx.beginPath(); ctx.arc(x, lineY, 3, 0, 2 * Math.PI); ctx.fillStyle = '#475569'; ctx.fill();
              });
          }
          
          const imgData = canvas.toDataURL('image/jpeg', 0.8);
          doc.addImage(imgData, 'JPEG', 10, 10, 277, 190, undefined, 'FAST');
          doc.setFontSize(8); doc.setTextColor(148, 163, 184); doc.setFont("helvetica", "normal");
          doc.text("Generiert durch CPR Assist", 148.5, 205, {align: 'center'});
      }

      // SEITE 4: CHRONOLOGIE (LISTENPROTOKOLL)
      doc.addPage('a4', 'portrait');
      let listY = 20;
      doc.setFontSize(14); doc.setTextColor(100, 116, 139); doc.setFont("helvetica", "bold"); doc.text("MINUTENGENAUE CHRONOLOGIE (LISTENPROTOKOLL)", 15, listY); listY += 4;
      doc.setDrawColor(226, 232, 240); doc.setLineWidth(0.5); doc.line(15, listY, 195, listY); listY += 8;
      
      doc.setFillColor(241, 245, 249); doc.rect(15, listY-6, 180, 10, 'F');
      doc.setFontSize(10); doc.setTextColor(15, 23, 42); doc.setFont("helvetica", "bold");
      doc.text("Uhrzeit", 20, listY); doc.text("Dauer", 50, listY); doc.text("Aktion / Maßnahme", 80, listY);
      doc.line(15, listY+4, 195, listY+4); listY += 10;
      
      data.forEach(item => {
          const textStr = `${item.type}${item.detail ? ': ' + item.detail : ''}`;
          const splitText = doc.splitTextToSize(textStr, 110);
          const rowHeight = splitText.length * 5;
          
          if (listY + rowHeight > 275) {
              doc.addPage('a4', 'portrait'); listY = 20;
              doc.setFillColor(241, 245, 249); doc.rect(15, listY-6, 180, 10, 'F');
              doc.setFontSize(10); doc.setTextColor(15, 23, 42); doc.setFont("helvetica", "bold");
              doc.text("Uhrzeit", 20, listY); doc.text("Dauer", 50, listY); doc.text("Aktion/ Maßnahme", 80, listY);
              doc.line(15, listY+4, 195, listY+4); listY += 10;
          }
          
          doc.setFontSize(9); doc.setFont("helvetica", "normal");
          doc.setTextColor(100, 116, 139); doc.text(item.realTime, 20, listY);
          doc.setTextColor(227, 0, 15); doc.setFont("helvetica", "bold"); doc.text(formatRelative(item.missionTime), 50, listY);
          doc.setTextColor(51, 65, 85); doc.text(splitText, 80, listY);
          
          listY += rowHeight + 3;
          doc.setDrawColor(241, 245, 249); doc.setLineWidth(0.2); doc.line(15, listY-2, 195, listY-2);
      });
      
      doc.setFontSize(8); doc.setTextColor(148, 163, 184); doc.setFont("helvetica", "normal");
      doc.text("Dieses Protokoll wurde maschinell durch CPR Assist erstellt. Alle Angaben sind fachlich zu prüfen.", 105, 285, {align: 'center'});
  }

  const fileName = `CPR_${isSummary ? 'Uebergabe' : 'Debriefing'}_${dateStr.replace(/\./g, '-')}_${timeStr}.pdf`;
  doc.save(fileName);
};
