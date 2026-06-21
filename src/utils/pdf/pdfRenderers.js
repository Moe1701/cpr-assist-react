// --- Datei: src/utils/pdf/pdfRenderers.js ---
import { formatTime } from './pdfHelpers.js';

export const renderSbarPage = (doc, state, parsed, isSummary) => {
    let ageStr = state.isPediatric ? (state.patientWeight ? `Kind (${state.patientWeight} kg)` : 'Kind') : 'Erwachsener';
    let adrTotal = state.adrCount > 0 ? ((state.isPediatric && state.patientWeight) ? (state.adrCount * Math.round(state.patientWeight * 10)) + " µg" : state.adrCount + " mg") : "0 mg";
    let amioTotal = state.amioCount > 0 ? ((state.isPediatric && state.patientWeight) ? (state.amioCount * Math.round(state.patientWeight * 5)) + " mg" : (state.amioCount === 1 ? '300 mg' : '450 mg')) : "0 mg";
    const activeHits = Object.entries(state.hitsStatus).filter(([_, isActive]) => isActive).map(([key]) => key);

    doc.setFontSize(22); doc.setTextColor(15, 23, 42); doc.setFont("helvetica", "bold"); doc.text("REANIMATIONSPROTOKOLL", 15, 20);
    doc.setFontSize(10); doc.setTextColor(100, 116, 139); doc.setFont("helvetica", "normal"); doc.text(`MODUS: ${isSummary ? 'SCHOCKRAUM ÜBERGABE' : 'DEBRIEFING & AUDIT'}`, 15, 26);
    doc.text(`Datum: ${new Date().toLocaleDateString('de-DE')}`, 195, 20, {align: 'right'}); doc.text(`Einsatzbeginn: ${state.startTime || '--:--'} Uhr`, 195, 26, {align: 'right'});
    doc.setDrawColor(227, 0, 15); doc.setLineWidth(1); doc.line(15, 30, 195, 30);
  
    let y = 45; doc.setFontSize(14); doc.setTextColor(227, 0, 15); doc.setFont("helvetica", "bold"); doc.text("S - SITUATION", 15, y); doc.setDrawColor(241, 245, 249); doc.setLineWidth(0.5); doc.line(15, y+2, 195, y+2); y+=10;
    doc.setFillColor(248, 250, 252); doc.setDrawColor(226, 232, 240); doc.setLineWidth(0.2);
    doc.roundedRect(15, y, 65, 24, 2, 2, 'FD'); doc.roundedRect(85, y, 35, 24, 2, 2, 'FD'); doc.roundedRect(125, y, 70, 24, 2, 2, 'FD');
    doc.setFontSize(8); doc.setTextColor(100, 116, 139); doc.setFont("helvetica", "normal");
    doc.text("PATIENT", 47.5, y+6, {align: 'center'}); doc.text("GESAMTDAUER", 102.5, y+6, {align: 'center'}); doc.text("AKTUELLER STATUS", 160, y+6, {align: 'center'});
    doc.setFontSize(11); doc.setTextColor(15, 23, 42); doc.setFont("helvetica", "bold"); doc.text(ageStr, 47.5, y+14, {align: 'center'});
    doc.setFontSize(12); doc.text(`${formatTime(state.missionSeconds)} Min`, 102.5, y+14, {align: 'center'});
    if(parsed.endStatus === 'ROSC') doc.setTextColor(16, 185, 129); else if(parsed.endStatus === 'Abbruch') doc.setTextColor(15, 23, 42);
    doc.text(parsed.endStatus.toUpperCase(), 160, y+14, {align: 'center'});
  
    y += 35; doc.setFontSize(14); doc.setTextColor(227, 0, 15); doc.setFont("helvetica", "bold"); doc.text("B - BACKGROUND (ANAMNESE)", 15, y); doc.setDrawColor(241, 245, 249); doc.setLineWidth(0.5); doc.line(15, y+2, 195, y+2); y+=8;
    doc.roundedRect(15, y, 180, 40, 2, 2, 'S'); doc.setFontSize(10); doc.setTextColor(15, 23, 42); doc.setFont("helvetica", "bold"); doc.text("Beobachtet:", 20, y+8);
    doc.setFont("helvetica", "normal"); doc.text(state.anamneseData.beobachtet || '?', 45, y+8); doc.setFont("helvetica", "bold"); doc.text("Laien-REA:", 80, y+8);
    doc.setFont("helvetica", "normal"); doc.text(state.anamneseData.laienrea || '?', 105, y+8);
    doc.setDrawColor(203, 213, 225); doc.setLineDashPattern([2, 2], 0); doc.line(20, y+14, 190, y+14); doc.setLineDashPattern([], 0);
    
    y += 50; doc.setFontSize(14); doc.setTextColor(227, 0, 15); doc.setFont("helvetica", "bold"); doc.text("A - ASSESSMENT (DIAGNOSTIK)", 15, y); doc.setDrawColor(241, 245, 249); doc.setLineWidth(0.5); doc.line(15, y+2, 195, y+2); y+=8;
    doc.roundedRect(15, y, 180, 35, 2, 2, 'S'); doc.setFontSize(9); doc.setTextColor(100, 116, 139); doc.setFont("helvetica", "bold"); doc.text("Reversible Ursachen (HITS):", 20, y+8);
    doc.setFontSize(10); doc.setTextColor(15, 23, 42); doc.setFont("helvetica", "normal");
    if(activeHits.length > 0) { let hy = y+14; activeHits.forEach(h => { doc.text(`- ${h.toUpperCase()}`, 20, hy); hy += 6; }); } 
    else { doc.setFont("helvetica", "italic"); doc.setTextColor(148, 163, 184); doc.text("Keine Ursachen (HITS) erfasst.", 20, y+14); }
    doc.setDrawColor(226, 232, 240); doc.setLineWidth(0.2); doc.line(135, y+2, 135, y+33); doc.setFontSize(9); doc.setTextColor(100, 116, 139); doc.setFont("helvetica", "bold"); doc.text("CPR Qualität (CCF):", 165, y+10, {align: 'center'});
    doc.setFontSize(24); doc.setFont("helvetica", "bold"); if (state.currentCcfPercent >= 80) doc.setTextColor(16, 185, 129); else doc.setTextColor(227, 0, 15); doc.text(`${state.currentCcfPercent || 100}%`, 165, y+22, {align: 'center'});
  
    y += 45; doc.setFontSize(14); doc.setTextColor(227, 0, 15); doc.setFont("helvetica", "bold"); doc.text("R - RESPONSE (MASSNAHMEN)", 15, y); doc.setDrawColor(241, 245, 249); doc.setLineWidth(0.5); doc.line(15, y+2, 195, y+2); y+=8;
    const drawRow = (yPos, label, val, isRed=false) => {
        doc.setFillColor(isRed ? 254 : 248, isRed ? 242 : 250, isRed ? 242 : 252); doc.rect(15, yPos, 60, 8, 'FD'); doc.rect(75, yPos, 120, 8, 'S');
        doc.setFontSize(10); doc.setFont("helvetica", "bold"); doc.setTextColor(isRed ? 227 : 100, isRed ? 0 : 116, isRed ? 15 : 139); doc.text(label, 20, yPos+5.5);
        doc.setTextColor(isRed ? 227 : 15, isRed ? 0 : 23, isRed ? 15 : 42); doc.text(val, 80, yPos+5.5);
    };
    drawRow(y, "Atemweg", state.airwayType || 'Nicht dokumentiert'); drawRow(y+8, "Zugang", state.zugang || 'Nicht dokumentiert');
    drawRow(y+16, "Defibrillationen", `${state.shockCount || 0}x Schocks abgegeben`); drawRow(y+24, "Adrenalin", `Gesamt: ${adrTotal}`, true);
    doc.setFontSize(8); doc.setTextColor(148, 163, 184); doc.setFont("helvetica", "normal"); doc.text("Generiert durch CPR Assist.", 105, 285, {align: 'center'});
};

export const renderKpiPage = (doc, state, parsed) => {
    doc.addPage('a4', 'portrait'); let py = 20;
    doc.setFontSize(22); doc.setTextColor(15, 23, 42); doc.setFont("helvetica", "bold"); doc.text("PERFORMANCE INSIGHTS", 15, py);
    doc.setFontSize(10); doc.setTextColor(100, 116, 139); doc.setFont("helvetica", "normal"); doc.text("DETAILLIERTE KPI-AUSWERTUNG FÜR DAS DEBRIEFING", 15, py+6);
    py+=10; doc.setDrawColor(227, 0, 15); doc.setLineWidth(1); doc.line(15, py, 195, py); py+=10;
    
    doc.setFontSize(12); doc.setTextColor(227, 0, 15); doc.setFont("helvetica", "bold"); doc.text("1. CPR QUALITÄT & PAUSEN", 15, py); py+=4;
    doc.setFillColor(248, 250, 252); doc.setDrawColor(226, 232, 240); doc.setLineWidth(0.2);
    doc.roundedRect(15, py, 56, 18, 2, 2, 'FD'); doc.roundedRect(77, py, 56, 18, 2, 2, 'FD'); doc.roundedRect(139, py, 56, 18, 2, 2, 'FD');
    doc.setFontSize(7); doc.setTextColor(100, 116, 139); doc.setFont("helvetica", "bold");
    doc.text("CCF (CPR-ANTEIL)", 43, py+5, {align: 'center'}); doc.text("HANDS-OFF GESAMT", 105, py+5, {align: 'center'}); doc.text("LÄNGSTE PAUSE", 167, py+5, {align: 'center'});
    doc.setFontSize(14); doc.setFont("helvetica", "bold");
    if (state.currentCcfPercent >= 80) doc.setTextColor(16, 185, 129); else doc.setTextColor(227, 0, 15); doc.text(`${state.currentCcfPercent || 100}%`, 43, py+14, {align: 'center'});
    doc.setTextColor(15, 23, 42); doc.text(`${formatTime(parsed.totalHandsOff)} Min`, 105, py+14, {align: 'center'});
    if (parsed.maxPause > 10) doc.setTextColor(227, 0, 15); else doc.setTextColor(16, 185, 129); doc.text(`${parsed.maxPause} s`, 167, py+14, {align: 'center'});
};
