// --- Datei: src/utils/pdf/pdfCanvasTimeline.js ---
import { formatTime, formatRelative, drawSafeRoundRect, getIconData } from './pdfHelpers.js';

export const generateTimelinePages = (doc, data, pausesObj, maxSec) => {
    const cycleDuration = 240;
    const totalPagesTimeline = Math.max(1, Math.ceil(maxSec / (4 * cycleDuration)));
    
    for (let p = 0; p < totalPagesTimeline; p++) {
        doc.addPage('a4', 'landscape');
        const canvas = document.createElement('canvas'); const ctx = canvas.getContext('2d');
        const scale = 2; const baseWidth = 1400; const baseHeight = 1000;
        
        canvas.width = baseWidth * scale; canvas.height = baseHeight * scale; ctx.scale(scale, scale);
        ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, baseWidth, baseHeight);
        ctx.fillStyle = '#64748b'; ctx.font = 'bold 20px Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(`GRAFISCHES ZEITLINIEN-GRID (Seite ${p + 1})`, baseWidth / 2, 40);
        
        const paddingX = 80; const usableWidth = baseWidth - (paddingX * 2);
        const startSecForPage = p * 4 * cycleDuration;
        
        for (let i = 0; i < 4; i++) {
            const currentDrawSec = startSecForPage + (i * cycleDuration);
            if (currentDrawSec > maxSec && i > 0) break;
            const cycleEndSec = currentDrawSec + cycleDuration; const lineY = 170 + (i * 230);
            
            ctx.beginPath(); ctx.moveTo(paddingX, lineY); ctx.lineTo(baseWidth - paddingX, lineY);
            ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.stroke();
            
            for (let t = 15; t < cycleDuration; t += 15) {
                const tickSec = currentDrawSec + t; const xTick = paddingX + (t / cycleDuration) * usableWidth;
                let tickH = (t % 60 === 0) ? 14 : 6;
                ctx.beginPath(); ctx.moveTo(xTick, lineY - tickH/2); ctx.lineTo(xTick, lineY + tickH/2);
                ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.5; ctx.stroke();
            }
            
            pausesObj.forEach(ps => {
                const pStart = Math.max(ps.start, currentDrawSec); const pEnd = Math.min(ps.end, cycleEndSec);
                if (pStart < pEnd) {
                    const xStart = paddingX + ((pStart - currentDrawSec) / cycleDuration) * usableWidth;
                    const pWidth = (paddingX + ((pEnd - currentDrawSec) / cycleDuration) * usableWidth) - xStart;
                    ctx.fillStyle = '#ef4444'; ctx.fillRect(xStart, lineY - 5, pWidth, 10);
                }
            });
            
            const cycleEvents = data.filter(e => e.missionTime >= currentDrawSec && e.missionTime < cycleEndSec);
            cycleEvents.forEach((ev, index) => {
                const iconData = getIconData(ev.fullEntry);
                if (!iconData) return;
                const x = paddingX + (((ev.missionTime - currentDrawSec) / cycleDuration) * usableWidth);
                const yOff = [25, -25, 55, -55, 85, -85, 115, -115][index % 8];
                const boxY = lineY + yOff - 13;
                
                ctx.beginPath(); ctx.moveTo(x, lineY); ctx.lineTo(x, lineY + yOff); ctx.strokeStyle = '#94a3b8'; ctx.stroke();
                ctx.fillStyle = '#ffffff'; drawSafeRoundRect(ctx, x - 50, boxY, 100, 26, 6); ctx.fill();
                ctx.fillStyle = '#334155'; ctx.font = 'bold 12px Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                ctx.fillText(`${iconData.icon}`, x, boxY + 13);
            });
        }
        doc.addImage(canvas.toDataURL('image/jpeg', 0.8), 'JPEG', 10, 10, 277, 190, undefined, 'FAST');
    }
};