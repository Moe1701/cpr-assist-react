// --- Datei: src/utils/pdfExport.js ---
import { jsPDF } from 'jspdf';
import { parseMissionData } from './pdf/pdfDataParser.js';
import { renderSbarPage, renderKpiPage } from './pdf/pdfRenderers.js';
import { generateTimelinePages } from './pdf/pdfCanvasTimeline.js';
import { formatRelative } from './pdf/pdfHelpers.js';

export const generatePDFExport = (state, type = 'übergabe') => {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const isSummary = type === 'übergabe';
  
  const now = new Date();
  const dateStr = now.toLocaleDateString('de-DE');
  const timeStr = now.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }).replace(':', '');
  
  // 1. Daten berechnen
  const parsedData = parseMissionData(state);

  // 2. SEITE 1: Übergabe rendern
  renderSbarPage(doc, state, parsedData, isSummary);

  // 3. DEBRIEFING MODUS (Seiten 2-4 anhängen)
  if (!isSummary) {
      renderKpiPage(doc, state, parsedData);
      
      // Native HTML5 Canvas Engine für die Grafik
      generateTimelinePages(doc, state.events || [], parsedData.pausesObj, parsedData.maxSec);
      
      // Letzte Seite: Chronologie Tabelle
      doc.addPage('a4', 'portrait');
      let listY = 20;
      doc.setFontSize(14); doc.setTextColor(100, 116, 139); doc.setFont("helvetica", "bold"); 
      doc.text("MINUTENGENAUE CHRONOLOGIE (LISTENPROTOKOLL)", 15, listY);
      
      (state.events || []).forEach(item => {
          doc.setFontSize(9); doc.setTextColor(100, 116, 139); doc.setFont("helvetica", "normal");
          doc.text(`[${formatRelative(item.missionTime)}] ${item.type}: ${item.detail || ''}`, 15, listY += 6);
      });
  }

  // 4. Download triggern
  const fileName = `CPR_${isSummary ? 'Uebergabe' : 'Debriefing'}_${dateStr.replace(/\./g, '-')}_${timeStr}.pdf`;
  doc.save(fileName);
};