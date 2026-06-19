// --- Datei: src/utils/pdfExport.js ---
import { jsPDF } from 'jspdf';

export const generatePDFExport = (state, type = 'übergabe') => {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  
  const isSummary = type === 'übergabe';
  const dateStr = new Date().toLocaleDateString('de-DE');
  
  const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds === null) return "00:00";
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // HEADER
  doc.setFontSize(22); doc.setTextColor(15, 23, 42); doc.setFont("helvetica", "bold");
  doc.text("REANIMATIONSPROTOKOLL", 15, 20);
  
  doc.setFontSize(10); doc.setTextColor(100, 116, 139); doc.setFont("helvetica", "normal");
  doc.text(`MODUS: ${isSummary ? 'SCHOCKRAUM ÜBERGABE' : 'DEBRIEFING & AUDIT'}`, 15, 26);
  
  doc.text(`Datum: ${dateStr}`, 195, 20, {align: 'right'});
  doc.text(`Einsatzbeginn: ${state.startTime || '--:--'} Uhr`, 195, 26, {align: 'right'});
  
  doc.setDrawColor(227, 0, 15); doc.setLineWidth(1); doc.line(15, 30, 195, 30);

  // S - SITUATION
  let currentY = 40;
  doc.setFontSize(12); doc.setTextColor(227, 0, 15); doc.setFont("helvetica", "bold");
  doc.text("S - SITUATION", 15, currentY);
  
  doc.setFontSize(9); doc.setTextColor(100, 116, 139); doc.setFont("helvetica", "bold");
  doc.text("PATIENT", 15, currentY + 8);
  doc.text("DAUER", 100, currentY + 8);
  
  doc.setFontSize(11); doc.setTextColor(15, 23, 42);
  let ageStr = state.isPediatric ? (state.patientWeight ? `Kind (${state.patientWeight} kg)` : 'Kind') : 'Erwachsener';
  doc.text(ageStr, 15, currentY + 14);
  doc.text(`${formatTime(state.missionSeconds)} Min`, 100, currentY + 14);

  // B - BACKGROUND
  currentY += 28;
  doc.setFontSize(12); doc.setTextColor(100, 116, 139); doc.setFont("helvetica", "bold");
  doc.text("B - BACKGROUND (ANAMNESE)", 15, currentY);
  
  doc.setFontSize(10); doc.setTextColor(15, 23, 42); doc.setFont("helvetica", "normal");
  doc.text(`Beobachtet: ${state.anamneseData?.beobachtet?.toUpperCase() || '?'}`, 15, currentY + 8);
  doc.text(`Laien-REA: ${state.anamneseData?.laienrea?.toUpperCase() || '?'}`, 100, currentY + 8);

  // A - ASSESSMENT
  currentY += 25;
  doc.setFontSize(12); doc.setTextColor(245, 158, 11); doc.setFont("helvetica", "bold");
  doc.text("A - ASSESSMENT (DIAGNOSTIK)", 15, currentY);
  
  doc.setFontSize(10); doc.setTextColor(15, 23, 42); doc.setFont("helvetica", "normal");
  doc.text(`CPR Qualität (CCF): ${state.currentCcfPercent || 100}%`, 15, currentY + 8);
  
  doc.setFontSize(9); doc.setTextColor(100, 116, 139); doc.setFont("helvetica", "bold");
  doc.text("Erfasste Ursachen (HITS):", 15, currentY + 16);
  
  doc.setFontSize(10); doc.setTextColor(15, 23, 42); doc.setFont("helvetica", "normal");
  let hitsY = currentY + 22;
  const activeHits = Object.entries(state.hitsStatus).filter(([_, isActive]) => isActive);
  if (activeHits.length === 0) {
      doc.text("- Keine HITS erfasst.", 15, hitsY);
      hitsY += 6;
  } else {
      activeHits.forEach(([key]) => {
          doc.text(`- ${key.toUpperCase()} gecheckt/behandelt`, 15, hitsY);
          hitsY += 6;
      });
  }

  // R - RESPONSE
  currentY = hitsY + 10;
  doc.setFontSize(12); doc.setTextColor(16, 185, 129); doc.setFont("helvetica", "bold");
  doc.text("R - RESPONSE (MASSNAHMEN)", 15, currentY);
  
  doc.setFontSize(10); doc.setTextColor(15, 23, 42); doc.setFont("helvetica", "normal");
  doc.text(`Atemweg: ${state.airwayType || 'Nicht dokumentiert'}`, 15, currentY + 8);
  doc.text(`Zugang: ${state.zugang || 'Nicht dokumentiert'}`, 15, currentY + 14);
  doc.text(`Defibrillationen: ${state.shockCount || 0}x Schocks abgegeben`, 15, currentY + 20);
  doc.text(`Adrenalin: ${state.adrCount || 0} Gaben`, 15, currentY + 26);
  doc.text(`Amiodaron: ${state.amioCount || 0} Gaben`, 15, currentY + 32);

  // FOOTER
  doc.setFontSize(8); doc.setTextColor(148, 163, 184); doc.setFont("helvetica", "normal");
  doc.text("Dieses Protokoll wurde maschinell durch CPR Assist erstellt. Alle Angaben sind fachlich zu prüfen.", 105, 285, {align: 'center'});

  // Speichern
  doc.save(`CPR_Protokoll_${dateStr.replace(/\./g, '-')}.pdf`);
};