// --- Datei: src/components/views/TabZeitlinie.jsx ---
import React, { useContext, useMemo } from 'react';
import { CprContext } from '../../context/CprContext.jsx';

export default function TabZeitlinie() {
  const { state } = useContext(CprContext);

  const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds === null) return "00:00";
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // --- ICON & PARSER ENGINE ---
  const getIconData = (action) => {
    const t = action.toLowerCase();
    if (t.includes("schock") && !t.includes("schockbar")) {
        const match = t.match(/(\d+)\s*j/i);
        if (match) return { content: match[1] + "J", isJoule: true };
        return { content: <i className="fa-solid fa-bolt"></i> };
    }
    if (t.includes("nicht schockbar")) return { content: <i className="fa-solid fa-wave-square text-slate-500"></i> };
    if (t.includes("schockbar")) return { content: <i className="fa-solid fa-heart-circle-bolt text-amber-500"></i> };
    if (t.includes("adrenalin")) return { content: <i className="fa-solid fa-syringe text-[#E3000F]"></i> };
    if (t.includes("amio")) return { content: <i className="fa-solid fa-capsules text-purple-600"></i> };
    if (t.includes("atemweg") || t.includes("beatmung")) return { content: <i className="fa-solid fa-lungs text-cyan-600"></i> };
    if (t.includes("zugang")) return { content: <i className="fa-solid fa-droplet text-indigo-500"></i> };
    if (t.includes("start rea") || t.includes("kompression begonnen")) return { content: <i className="fa-solid fa-play text-emerald-500"></i> };
    if (t.includes("rosc")) return { content: <i className="fa-solid fa-heart-pulse text-emerald-500"></i> };
    if (t.includes("abbruch") || t.includes("beendet")) return { content: <i className="fa-solid fa-stop text-slate-800"></i> };
    if (t.includes("hits") || t.includes("sampler")) return { content: <i className="fa-solid fa-clipboard-list text-slate-400"></i> };
    return null; // Events ohne spezielles Icon filtern wir raus
  };

  // --- DATEN-VERARBEITUNG (Läuft nur neu, wenn Events sich ändern) ---
  const { cycles, pauses, currentAppSec } = useMemo(() => {
    const data = state.events || [];
    let currentAppSec = state.missionSeconds || 0;
    
    // Falls wir ein altes Protokoll ansehen, nimm die Zeit des letzten Events
    if (data.length > 0 && data[data.length - 1].missionTime > currentAppSec) {
        currentAppSec = data[data.length - 1].missionTime;
    }

    // 1. Pausen berechnen
    let pausesArr = [];
    let currentPauseStart = null;
    data.forEach(d => {
        const t = d.fullEntry.toLowerCase();
        const sec = d.missionTime;
        if ((t.includes('kompression') || t.includes('cpr')) && (t.includes('paus') || t.includes('stop') || t.includes('unterbroch'))) {
            if (currentPauseStart === null) currentPauseStart = sec;
        } else if ((t.includes('kompression') || t.includes('cpr')) && (t.includes('fortgesetzt') || t.includes('start') || t.includes('weiter'))) {
            if (currentPauseStart !== null) {
                pausesArr.push({ start: currentPauseStart, end: sec, duration: sec - currentPauseStart });
                currentPauseStart = null;
            }
        }
    });
    // Laufende Pause am Ende mitnehmen
    if (currentPauseStart !== null && currentAppSec > currentPauseStart) {
        pausesArr.push({ start: currentPauseStart, end: currentAppSec, duration: currentAppSec - currentPauseStart });
    }

    // 2. Events filtern & formatieren
    const filteredEvents = data
        .map(d => ({ ...d, iconData: getIconData(d.fullEntry) }))
        .filter(d => d.iconData !== null);

    // 3. In 120-Sekunden Blöcke aufteilen
    const cycleDuration = 120;
    const totalCycles = Math.max(4, Math.ceil(currentAppSec / cycleDuration));
    let cyclesArr = [];

    for (let i = 0; i < totalCycles; i++) {
        const startSec = i * cycleDuration;
        const endSec = startSec + cycleDuration;
        const cycleEvents = filteredEvents.filter(e => e.missionTime >= startSec && e.missionTime < endSec);
        cyclesArr.push({ startSec, endSec, cycleEvents });
    }

    return { cycles: cyclesArr, pauses: pausesArr, currentAppSec };
  }, [state.events, state.missionSeconds]);

  if (state.events.length === 0) {
    return <div className="p-4 text-center text-slate-400 text-xs font-bold mt-10">Warte auf Ereignisse...</div>;
  }

  const cycleDuration = 120;
  const yOffsets = [12, -12, 26, -26, 40, -40];

  return (
    <div className="flex flex-col h-full overflow-hidden relative w-full animate-in fade-in slide-in-from-bottom-2 duration-300">
      
      {/* HEADER / LEGENDE */}
      <div className="sticky top-0 z-50 bg-slate-50 border-b border-slate-200 px-2 py-2 shrink-0 shadow-sm">
          <div className="bg-white p-1.5 rounded-xl border border-slate-100 flex flex-wrap justify-center items-center gap-x-2 gap-y-1.5">
              <div className="flex items-center gap-1"><span className="text-[13px] drop-shadow-sm text-emerald-500"><i className="fa-solid fa-play"></i></span><span className="text-[7.5px] font-bold text-slate-600 uppercase tracking-widest">Start</span></div>
              <div className="flex items-center gap-1"><span className="text-[13px] drop-shadow-sm text-amber-500"><i className="fa-solid fa-heart-circle-bolt"></i></span><span className="text-[7.5px] font-bold text-slate-600 uppercase tracking-widest">Schockbar</span></div>
              <div className="flex items-center gap-1"><span className="text-[10px] font-black text-[#E3000F] drop-shadow-sm">150J</span><span className="text-[7.5px] font-bold text-slate-600 uppercase tracking-widest">Schock</span></div>
              <div className="flex items-center gap-1"><span className="text-[13px] drop-shadow-sm text-[#E3000F]"><i className="fa-solid fa-syringe"></i></span><span className="text-[7.5px] font-bold text-slate-600 uppercase tracking-widest">Adr.</span></div>
              <div className="flex items-center gap-1"><span className="text-[13px] drop-shadow-sm text-purple-600"><i className="fa-solid fa-capsules"></i></span><span className="text-[7.5px] font-bold text-slate-600 uppercase tracking-widest">Amio.</span></div>
              <div className="flex items-center gap-1"><span className="text-[13px] drop-shadow-sm text-cyan-600"><i className="fa-solid fa-lungs"></i></span><span className="text-[7.5px] font-bold text-slate-600 uppercase tracking-widest">Atemweg</span></div>
              <div className="flex items-center gap-1"><div className="w-4 h-1 bg-red-500 rounded"></div><span className="text-[7.5px] font-bold text-slate-600 uppercase tracking-widest">Pause</span></div>
          </div>
      </div>

      {/* TIMELINE BLÖCKE */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar bg-slate-50 relative pb-24 pt-3 px-3">
        {cycles.map((block, cycleIdx) => {
          const isActiveBlock = currentAppSec >= block.startSec && currentAppSec <= block.endSec;

          return (
            <div key={cycleIdx} className="relative w-full h-[110px] mb-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden shrink-0">
              
              {/* Labels Links/Rechts */}
              <div className="absolute top-1/2 left-1 -translate-y-1/2 text-[8px] font-black text-slate-400 bg-white/80 px-1 z-10">{formatTime(block.startSec)}</div>
              <div className="absolute top-1/2 right-1 -translate-y-1/2 text-[8px] font-black text-slate-400 bg-white/80 px-1 z-10">{formatTime(block.endSec)}</div>
              
              <div className="absolute inset-y-0 left-7 right-7 pointer-events-none">
                  {/* Mittellinie */}
                  <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-slate-100 rounded-full -translate-y-1/2 shadow-inner z-0"></div>
                  
                  {/* 15s Ticks */}
                  {[15, 30, 45, 60, 75, 90, 105].map(t => {
                      const pct = (t / 120) * 100;
                      const isCenter = t === 60;
                      return (
                        <React.Fragment key={t}>
                          <div className={`absolute top-1/2 w-px ${isCenter ? 'h-3 bg-slate-400' : 'h-1.5 bg-slate-300'} -translate-y-1/2 -translate-x-1/2 z-10`} style={{ left: `${pct}%` }}></div>
                          <div className="absolute top-1/2 mt-3 text-[6px] font-black text-slate-400 -translate-y-1/2 -translate-x-1/2 z-10" style={{ left: `${pct}%` }}>
                            {formatTime(block.startSec + t)}
                          </div>
                        </React.Fragment>
                      );
                  })}

                  {/* CPR Pausen (Rote Balken) */}
                  {pauses.map((p, pIdx) => {
                      const pStart = Math.max(p.start, block.startSec);
                      const pEnd = Math.min(p.end, block.endSec);
                      if (pStart >= pEnd) return null;
                      
                      const pctStart = ((pStart - block.startSec) / cycleDuration) * 100;
                      const pctEnd = ((pEnd - block.startSec) / cycleDuration) * 100;
                      const widthPct = pctEnd - pctStart;
                      
                      return (
                        <div key={pIdx} className="absolute top-1/2 h-2.5 bg-red-500/90 rounded-sm flex items-center justify-center -translate-y-1/2 z-[5]" style={{ left: `${pctStart}%`, width: `${widthPct}%` }}>
                             {widthPct > 4 && <span className="text-[6px] font-black text-white shadow-sm">{p.duration}s</span>}
                        </div>
                      );
                  })}

                  {/* Live-Marker (Roter Strich der mitläuft) */}
                  {isActiveBlock && (
                      <div className="live-time-marker absolute top-0 bottom-0 w-[2px] bg-red-500 z-[15] shadow-[0_0_8px_rgba(239,68,68,0.8)]" 
                           style={{ left: `${((currentAppSec - block.startSec) / cycleDuration) * 100}%` }}>
                           <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-red-500 shadow-sm"></div>
                           <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-red-500 shadow-sm"></div>
                      </div>
                  )}

                  {/* Events als Icons einzeichnen */}
                  {block.cycleEvents.map((ev, idx) => {
                      const pct = ((ev.missionTime - block.startSec) / cycleDuration) * 100;
                      const yOff = yOffsets[idx % yOffsets.length];
                      const isTop = yOff < 0; 
                      const lineH = Math.abs(yOff);
                      const linePosClass = isTop ? 'bottom-1/2 mb-[1px]' : 'top-1/2 mt-[1px]';
                      const anchorTransform = isTop ? '-translate-y-full pb-[1px]' : 'pt-[1px]';

                      return (
                        <React.Fragment key={ev.id}>
                          {/* Anchor Dot */}
                          <div className="absolute top-1/2 w-1 h-1 rounded-full bg-slate-400 -translate-x-1/2 -translate-y-1/2 z-[11]" style={{ left: `${pct}%` }}></div>
                          {/* Linie nach oben/unten */}
                          <div className={`absolute w-px bg-slate-300 -translate-x-1/2 ${linePosClass} z-10`} style={{ left: `${pct}%`, height: `${lineH}px` }}></div>
                          {/* Das eigentliche Icon */}
                          <div className={`absolute -translate-x-1/2 flex flex-col items-center justify-center z-20 ${anchorTransform}`} 
                               style={{ left: `${pct}%`, top: `calc(50% ${isTop ? '-' : '+'} ${lineH}px)`, zIndex: 20 + idx }}>
                              {ev.iconData.isJoule 
                                ? <span className="text-[10px] font-black text-[#E3000F] drop-shadow-[0_0_2px_rgba(255,255,255,1)] tracking-tighter">{ev.iconData.content}</span>
                                : <span className="text-[14px] drop-shadow-sm leading-none block">{ev.iconData.content}</span>
                              }
                          </div>
                        </React.Fragment>
                      );
                  })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}