// --- Datei: src/utils/pdfExport.js ---
import { jsPDF } from 'jspdf';
import { parseMissionData } from './pdf/pdfDataParser.js';
import { renderSbarPage, renderKpiPage } from './pdf/pdfRenderers.js';
import { generateTimelinePages } from './pdf/pdfCanvasTimeline.js';
import { formatRelative } from './pdf/pdfHelpers.js';

export const generatePDFExport = (state, type) => {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  
  // KUGELSICHERER CHECK: Egal ob 'Übergabe', 'übergabe ' oder 'debriefing' reinkommt
  const safeType = String(type).toLowerCase().trim();
  const isSummary = safeType === 'übergabe';
  
  const now = new Date();
  const dateStr = now.toLocaleDateString('de-DE');
  const timeStr = now.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }).replace(':', '');
  
  // 1. Daten berechnen
  const parsedData = parseMissionData(state);

  // 2. SEITE 1: SBAR Übergabe rendern (Die 1. Seite ist IMMER dabei)
  renderSbarPage(doc, state, parsedData, isSummary);

  // 3. SEITEN 2-4: DEBRIEFING MODUS ANHÄNGEN (Nur wenn NICHT Übergabe)
  if (!isSummary) {
      renderKpiPage(doc, state, parsedData);
      
      generateTimelinePages(doc, state.events || [], parsedData.pausesObj, parsedData.maxSec);
      
      doc.addPage('a4', 'portrait');
      let listY = 20;
      doc.setFontSize(14); doc.setTextColor(100, 116, 139); doc.setFont("helvetica", "bold"); 
      doc.text("MINUTENGENAUE CHRONOLOGIE (LISTENPROTOKOLL)", 15, listY);
      
      (state.events || []).forEach(item => {
          // Falls die Seite voll ist, neue Seite hinzufügen
          if (listY > 270) {
              doc.addPage('a4', 'portrait');
              listY = 20;
          }
          doc.setFontSize(9); doc.setTextColor(100, 116, 139); doc.setFont("helvetica", "normal");
          doc.text(`[${formatRelative(item.missionTime)}] ${item.type}: ${item.detail || ''}`, 15, listY += 6);
      });
  }

  // 4. Download triggern (mit dem richtigen Dateinamen)
  const fileName = `CPR_${isSummary ? 'Uebergabe' : 'Debriefing'}_${dateStr.replace(/\./g, '-')}_${timeStr}.pdf`;
  doc.save(fileName);
};
