import React, { useContext } from 'react';
import { CprContext } from '../../context/CprContext.jsx';
import { useMasterLoop } from '../../hooks/useMasterLoop.js';

export default function CprButton() {
  const { state } = useContext(CprContext);
  const { toggleCpr } = useMasterLoop();

  // ==========================================
  // STATE 1: BEATMUNGSPHASE (Blau & Lunge)
  // ==========================================
  if (state.isVentilationPhase) {
    return (
      <div className="relative pointer-events-auto">
        <button
          onClick={toggleCpr} // Klick bricht die Beatmung ab und setzt CPR fort
          className="w-[100px] h-[100px] rounded-full border-2 flex flex-col items-center justify-center gap-1.5 transition-all bg-cyan-500 text-white border-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.6)] active:scale-95"
        >
          <i className="fa-solid fa-lungs text-[32px] animate-pulse"></i>
          <span className="text-[10px] font-black uppercase tracking-widest leading-none text-center px-1">Beatmen</span>
        </button>
      </div>
    );
  }

  // ==========================================
  // STATE 2: PAUSIERT (Eskalations-Warnung)
  // ==========================================
  if (!state.isCompressing) {
    const isWarning = state.pauseSeconds >= 5 && state.pauseSeconds < 10;
    const isCritical = state.pauseSeconds >= 10;

    let colorClass = "bg-white text-slate-500 border-slate-200 shadow-[0_10px_25px_rgba(0,0,0,0.05)]";
    let badgeClass = "bg-slate-600 text-white border-slate-100"; // Standard Badge

    // Die Eskalations-Stufen
    if (isCritical) {
      colorClass = "bg-red-50 text-red-600 border-red-600 shadow-[0_0_40px_rgba(227,0,15,0.8)] animate-pulse scale-105";
      badgeClass = "bg-red-600 text-white border-white";
    } else if (isWarning) {
      colorClass = "bg-amber-50 text-amber-500 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.5)]";
      badgeClass = "bg-amber-500 text-white border-white";
    }

    return (
      <div className="relative pointer-events-auto">
        <button
          onClick={toggleCpr}
          className={`w-[100px] h-[100px] rounded-full border-2 flex flex-col items-center justify-center gap-1.5 transition-all active:scale-95 ${colorClass}`}
        >
          <i className="fa-solid fa-play text-[32px]"></i>
          <span className="text-[10px] font-black uppercase tracking-widest leading-none text-center px-1">CPR Starten</span>
        </button>
        
        {/* Der rote Pausen-Sekunden-Zähler (oben rechts) */}
        {state.pauseSeconds > 0 && (
          <div className={`absolute -top-2 -right-3 text-[11px] font-black px-2.5 h-7 rounded-full flex items-center justify-center shadow-md border-[3px] z-10 ${badgeClass}`}>
            {state.pauseSeconds}s
          </div>
        )}
      </div>
    );
  }

  // ==========================================
  // STATE 3: LÄUFT (Grün + Live Metronom-Zähler)
  // ==========================================
  return (
    <div className="relative pointer-events-auto">
      <button
        onClick={toggleCpr}
        className="w-[100px] h-[100px] rounded-full border-2 flex flex-col items-center justify-center gap-1.5 transition-all active:scale-95 bg-emerald-500 text-white border-emerald-600 shadow-[0_10px_25px_rgba(16,185,129,0.3)] hover:bg-emerald-400"
      >
        <i className="fa-solid fa-pause text-[32px]"></i>
        <span className="text-[10px] font-black uppercase tracking-widest leading-none text-center px-1">CPR Pausieren</span>
      </button>
      
      {/* Das sichtbare Metronom (Zählt z.B. 1 bis 15, verschwindet im KONT Modus) */}
      {state.cprMode !== 'continuous' && state.compressionCount > 0 && (
        <div className="absolute -top-1 -right-1 w-[30px] h-[30px] text-[13px] font-black bg-white text-emerald-600 rounded-full flex items-center justify-center shadow-md border-[3px] border-emerald-500 z-10">
          {state.compressionCount}
        </div>
      )}
    </div>
  );
}