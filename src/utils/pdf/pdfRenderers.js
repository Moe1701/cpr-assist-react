// --- Datei: src/utils/pdf/pdfRenderers.js ---
import { formatTime, drawFooter } from './pdfHelpers.js';

export const renderSbarPage = (doc, state, parsed, isSummary) => {
    let ageStr = state.isPediatric ? (state.patientWeight ? `Kind (${state.patientWeight} kg)` : 'Kind') : 'Erwachsener';
    let adrTotal = state.adrCount > 0 ? ((state.isPediatric && state.patientWeight) ? (state.adrCount * Math.round(state.patientWeight * 10)) + " µg" : state.adrCount + " mg") : "0 mg";
    let amioTotal = state.amioCount > 0 ? ((state.isPediatric && state.patientWeight) ? (state.amioCount * Math.round(state.patientWeight * 5)) + " mg" : (state.amioCount === 1 ? '300 mg' : '450 mg')) : "0 mg";
    
    const aData = state.anamneseData;
    const activeHits = Object.entries(state.hitsStatus).filter(([_, isActive]) => isActive).map(([key]) => key);
    const samplerCount = Object.values(aData.sampler).filter(v => v !== '').length;

    doc.setFontSize(22); doc.setTextColor(15, 23, 42); doc.setFont("helvetica", "bold"); doc.text("REANIMATIONSPROTOKOLL", 15, 20);
    // HIER WIRD DER TITEL DYNAMISCH ANGEPASST
    doc.setFontSize(10); doc.setTextColor(100, 116, 139); doc.setFont("helvetica", "normal"); doc.text(`MODUS: ${isSummary ? 'SCHOCKRAUM ÜBERGABE' : 'DEBRIEFING & AUDIT'}`, 15, 26);
    doc.text(`Datum: ${new Date().toLocaleDateString('de-DE')}`, 195, 20, {align: 'right'}); doc.text(`Einsatzbeginn: ${state.startTime || '--:--'} Uhr`, 195, 26, {align: 'right'});
    doc.setDrawColor(227, 0, 15); doc.setLineWidth(1); doc.line(15, 30, 195, 30);
  
    // S - SITUATION
    let y = 40; doc.setFontSize(14); doc.setTextColor(227, 0, 15); doc.setFont("helvetica", "bold"); doc.text("S - SITUATION", 15, y); doc.setDrawColor(241, 245, 249); doc.setLineWidth(0.5); doc.line(15, y+2, 195, y+2); y+=8;
    doc.setFontSize(9); doc.setTextColor(100, 116, 139); doc.setFont("helvetica", "bold"); doc.text("PATIENT", 15, y); doc.text("GESAMTDAUER", 75, y); doc.text("AKTUELLER STATUS", 135, y);
    y+=6; doc.setFontSize(12); doc.setTextColor(15, 23, 42); doc.text(ageStr, 15, y); doc.text(`${formatTime(state.missionSeconds)} Min`, 75, y); 
    const lines = doc.splitTextToSize(parsed.endStatus.toUpperCase(), 60); doc.text(lines, 135, y);
  
    // B - BACKGROUND
    y += 20; doc.setFontSize(14); doc.setTextColor(227, 0, 15); doc.setFont("helvetica", "bold"); doc.text("B - BACKGROUND (ANAMNESE)", 15, y); doc.setDrawColor(241, 245, 249); doc.setLineWidth(0.5); doc.line(15, y+2, 195, y+2); y+=8;
    doc.setFontSize(10); doc.setTextColor(100, 116, 139); doc.text("Beobachtet:", 15, y); doc.setTextColor(15, 23, 42); doc.text(aData.beobachtet || '?', 40, y);
    doc.setTextColor(100, 116, 139); doc.text("Laien-REA:", 75, y); doc.setTextColor(15, 23, 42); doc.text(aData.laienrea || '?', 100, y);
    doc.setTextColor(100, 116, 139); doc.text("Brustschmerz:", 135, y); doc.setTextColor(15, 23, 42); doc.text(aData.brustschmerz || '?', 165, y);
    y+=8; doc.setTextColor(100, 116, 139); doc.text("SAMPLER:", 15, y); y+=6; doc.setFont("helvetica", "normal"); doc.setTextColor(15, 23, 42);
    if(samplerCount > 0) { Object.entries(aData.sampler).filter(([_,v])=>v).forEach(([k,v]) => { doc.text(`${k.toUpperCase()}: ${v}`, 15, y); y+=5; }); } 
    else { doc.text("Keine SAMPLER-Daten erfasst.", 15, y); y+=5; }
    
    // A - ASSESSMENT
    y += 10; doc.setFontSize(14); doc.setTextColor(227, 0, 15); doc.setFont("helvetica", "bold"); doc.text("A - ASSESSMENT (DIAGNOSTIK)", 15, y); doc.setDrawColor(241, 245, 249); doc.setLineWidth(0.5); doc.line(15, y+2, 195, y+2); y+=8;
    doc.setFontSize(10); doc.setTextColor(100, 116, 139); doc.text("Reversible Ursachen (HITS):", 15, y); doc.text("CPR Qualität (CCF):", 135, y);
    y+=6; doc.setTextColor(15, 23, 42); doc.setFont("helvetica", "normal");
    if(activeHits.length > 0) { activeHits.forEach(h => { doc.text(`- ${h.toUpperCase()} gecheckt/behandelt`, 15, y); y += 5; }); } 
    else { doc.text("Keine Ursachen (HITS) erfasst.", 15, y); }
    doc.setFontSize(22); doc.setFont("helvetica", "bold"); doc.setTextColor(state.currentCcfPercent >= 80 ? 16 : 227, state.currentCcfPercent >= 80 ? 185 : 0, state.currentCcfPercent >= 80 ? 129 : 15); doc.text(`${state.currentCcfPercent || 100}%`, 135, y);
    doc.setFontSize(9); doc.setTextColor(100, 116, 139); doc.setFont("helvetica", "normal"); doc.text("Zielwert: > 80%", 135, y+5);
  
    // R - RESPONSE
    y += 20; doc.setFontSize(14); doc.setTextColor(227, 0, 15); doc.setFont("helvetica", "bold"); doc.text("R - RESPONSE (MASSNAHMEN)", 15, y); doc.setDrawColor(241, 245, 249); doc.setLineWidth(0.5); doc.line(15, y+2, 195, y+2); y+=8;
    const dR = (l, v) => { doc.setFontSize(10); doc.setFont("helvetica", "bold"); doc.setTextColor(100, 116, 139); doc.text(l, 15, y); doc.setTextColor(15, 23, 42); doc.setFont("helvetica", "normal"); doc.text(`|  ${v}`, 60, y); y+=8; };
    dR("Atemweg", state.airwayType || 'Nicht dokumentiert'); dR("Zugang", state.zugang || 'Nicht dokumentiert');
    dR("Defibrillationen", `${state.shockCount || 0}x Schocks abgegeben`); dR("Adrenalin", `Gesamt: ${adrTotal} (${state.adrCount} Gaben)`); dR("Amiodaron", `Gesamt: ${amioTotal} (${state.amioCount} Gaben)`);
    drawFooter(doc);
};

export const renderKpiPage = (doc, state, parsed) => {
    doc.addPage('a4', 'portrait'); let y = 20;
    doc.setFontSize(22); doc.setTextColor(15, 23, 42); doc.setFont("helvetica", "bold"); doc.text("PERFORMANCE INSIGHTS", 15, y);
    doc.setFontSize(10); doc.setTextColor(100, 116, 139); doc.setFont("helvetica", "normal"); doc.text("DETAILLIERTE KPI-AUSWERTUNG FÜR DAS DEBRIEFING", 15, y+6);
    y+=12; doc.setDrawColor(227, 0, 15); doc.setLineWidth(1); doc.line(15, y, 195, y); y+=10;
    
    const h3 = (t) => { doc.setFontSize(12); doc.setTextColor(227, 0, 15); doc.setFont("helvetica", "bold"); doc.text(t, 15, y); y+=6; };
    const kv = (x, l, v, sub) => { doc.setFontSize(8); doc.setTextColor(100, 116, 139); doc.setFont("helvetica", "bold"); doc.text(l, x, y); doc.setFontSize(14); doc.setTextColor(15, 23, 42); doc.text(v, x, y+6); if(sub) { doc.setFontSize(8); doc.setFont("helvetica", "normal"); doc.text(sub, x, y+10); } };
    
    h3("1. CPR QUALITÄT & PAUSEN");
    kv(15, "CCF (CPR-ANTEIL)", `${state.currentCcfPercent || 100}%`); kv(75, "HANDS-OFF GESAMT", `${formatTime(parsed.totalHandsOff)} Min`); kv(135, "LÄNGSTE PAUSE", `${parsed.maxPause} s`); y+=20;
    
    h3("2. SCHOCK-THERAPIE & RHYTHMUS");
    kv(15, "DEFIBRILLATIONEN", `${state.shockCount}x (${parsed.totalJoule} J)`); kv(75, "PRE-SHOCK PAUSE", `${parsed.maxPreShock > 0 ? parsed.maxPreShock + ' s' : '-- s'}`, `Min: ${parsed.minPreShock} Max: ${parsed.maxPreShock}`); y+=20;
    
    h3("3. MEDIKAMENTE & INTERVALLE");
    kv(15, "Ø ADRENALIN-INTERVALL", parsed.avgAdr ? formatTime(parsed.avgAdr) : '--:--'); kv(75, "Ø AMIODARON-INTERVALL", parsed.avgAmio ? formatTime(parsed.avgAmio) : '--:--'); kv(135, "ZEIT BIS ROSC", parsed.timeToRosc ? formatTime(parsed.timeToRosc) : '--:--'); y+=20;
    
    h3("4. ATEMWEGS-MANAGEMENT");
    kv(15, `1. MASSNAHME (${parsed.firstAirway?.type?.toUpperCase() || '-'})`, parsed.firstAirway ? formatTime(parsed.firstAirway.time) : '--:--'); kv(75, `SICHERUNG (${state.airwayType ? state.airwayType.toUpperCase() : '-'})`, state.airwayType ? 'Erfolgt' : '--:--'); y+=20;
    
    h3("5. REAKTIONSZEITEN (AB START REA)");
    kv(15, "1. KOMPRESSION", parsed.firstCPR ? formatTime(parsed.firstCPR) : '--:--'); kv(60, "1. SCHOCK", parsed.firstShock ? formatTime(parsed.firstShock) : '--:--'); kv(105, "1. SUPRA", parsed.firstAdr ? formatTime(parsed.firstAdr) : '--:--'); kv(150, "1. ZUGANG", parsed.firstAccess ? formatTime(parsed.firstAccess) : '--:--');
    drawFooter(doc);
};
