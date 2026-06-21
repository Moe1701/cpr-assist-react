// --- Datei: src/utils/pdfExport.js ---
import { jsPDF } from 'jspdf';
import { parseMissionData } from './pdf/pdfDataParser.js';
import { renderSbarPage, renderKpiPage } from './pdf/pdfRenderers.js';
import { generateTimelinePages } from './pdf/pdfCanvasTimeline.js';
import { formatRelative, drawFooter } from './pdf/pdfHelpers.js';

export const generatePDFExport = (state, type) => {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const safeType = String(type).toLowerCase().trim();
  const isSummary = safeType === 'übergabe';
  
  const now = new Date();
  const dateStr = now.toLocaleDateString('de-DE');
  const timeStr = now.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }).replace(':', '');
  
  const parsedData = parseMissionData(state);

  // SEITE 1: Wird IMMER gezeichnet (SBAR Report)
  renderSbarPage(doc, state, parsedData, isSummary);

  // SEITE 2 - X: Wird NUR IM DEBRIEFING gezeichnet!
  if (!isSummary) {
      renderKpiPage(doc, state, parsedData);
      generateTimelinePages(doc, state.events || [], parsedData.pausesObj, parsedData.maxSec);
      
      // Letzte Seite: ECHTE TABELLE
      doc.addPage('a4', 'portrait');
      let y = 20;
      doc.setFontSize(14); doc.setTextColor(15, 23, 42); doc.setFont("helvetica", "bold"); 
      doc.text("MINUTENGENAUE CHRONOLOGIE (LISTENPROTOKOLL)", 15, y); y+=10;
      
      // Tabellen-Kopf
      doc.setFillColor(241, 245, 249); doc.rect(15, y, 180, 8, 'F');
      doc.setFontSize(9); doc.setTextColor(100, 116, 139); doc.setFont("helvetica", "bold");
      doc.text("Uhrzeit", 20, y+5.5); doc.text("|  Dauer", 40, y+5.5); doc.text("|  Aktion / Maßnahme", 65, y+5.5); y+=12;
      
      (state.events || []).forEach(item => {
          if (y > 270) {
              drawFooter(doc); doc.addPage('a4', 'portrait'); y = 20;
              doc.setFillColor(241, 245, 249); doc.rect(15, y, 180, 8, 'F');
              doc.setFontSize(9); doc.setTextColor(100, 116, 139); doc.setFont("helvetica", "bold");
              doc.text("Uhrzeit", 20, y+5.5); doc.text("|  Dauer", 40, y+5.5); doc.text("|  Aktion / Maßnahme", 65, y+5.5); y+=12;
          }
          doc.setFontSize(9); doc.setTextColor(15, 23, 42); doc.setFont("helvetica", "normal");
          doc.text(item.realTime, 20, y); 
          doc.text(`|  ${formatRelative(item.missionTime)}`, 40, y); 
          
          // Splitte sehr lange Texte (z.B. komplettes SAMPLER), damit sie nicht aus der Seite laufen
          const lines = doc.splitTextToSize(`|  ${item.type}: ${item.detail || ''}`, 130);
          doc.text(lines, 65, y);
          y += (lines.length * 5) + 3;
          
          // Dezente Trennlinie zwischen den Zeilen
          doc.setDrawColor(241, 245, 249); doc.setLineWidth(0.2); doc.line(15, y-2, 195, y-2);
      });
      drawFooter(doc);
  }

  const fileName = `CPR_${isSummary ? 'Uebergabe' : 'Debriefing'}_${dateStr.replace(/\./g, '-')}_${timeStr}.pdf`;
  doc.save(fileName);
};
