// --- Datei: src/utils/pdf/pdfHelpers.js ---
export const FOOTER_TEXT = "Dieses Protokoll wurde maschinell durch CPR Assist erstellt. Alle Angaben sind fachlich zu prüfen.";

export const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds === null) return "00:00";
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
};

export const formatRelative = (seconds) => {
    if (isNaN(seconds) || seconds === null) return "+00:00";
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `+${m}:${s}`;
};

export const drawSafeRoundRect = (ctx, x, y, w, h, r) => {
    if (ctx.roundRect) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); } else {
      ctx.beginPath(); ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y); ctx.quadraticCurveTo(x + w, y, x + w, y + r); ctx.lineTo(x + w, y + h - r);
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h); ctx.lineTo(x + r, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - r);
      ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y);
    }
};

export const drawFooter = (doc) => {
    doc.setFontSize(8); 
    doc.setTextColor(148, 163, 184); 
    doc.setFont("helvetica", "normal"); 
    doc.text(FOOTER_TEXT, 105, 285, {align: 'center'});
};

export const getIconData = (txt) => {
    if (!txt) return null; const t = txt.toLowerCase();
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
    if (t.includes('zugang')) return { icon: '💧', type: 'access' };
    if (t.includes('start') || t.includes('fortgesetzt') || t.includes('weiter')) return { icon: '▶', type: 'start' };
    if (t.includes('rosc')) return { icon: '❤️', type: 'rosc' };
    if (t.includes('abbruch') || t.includes('beendet')) return { icon: '⏹', type: 'end' };
    return null;
};
