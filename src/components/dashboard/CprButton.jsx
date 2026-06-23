// --- Datei: src/components/dashboard/CprButton.jsx ---
import React, { useContext, useEffect, useState } from 'react';
import { CprContext } from '../../context/CprContext.jsx';

export default function CprButton({ toggleCpr }) {
  const { state } = useContext(CprContext);
  const [isFlashing, setIsFlashing] = useState(false);

  useEffect(() => {
    if (state?.isCompressing && state?.compressionCount > 0) {
      setIsFlashing(true);
      const timer = setTimeout(() => setIsFlashing(false), 150); 
      return () => clearTimeout(timer);
    }
  }, [state?.compressionCount, state?.isCompressing]);

  if (!state) return null;
  const pauseSecs = state.pauseSeconds || 0;

  // ==========================================
  // STATE 1: BEATMUNGSPHASE (Blau & Lunge)
  // ==========================================
  if (state.isVentilationPhase) {
    return (
      <div className="relative pointer-events-auto">
        <button
          onClick={toggleCpr} 
          className="w-[85px] h-[85px] rounded-full border-2 flex flex-col items-center justify-center gap-1.5 transition-all bg-cyan-500 text-white border-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.6)] active:scale-95 cursor-pointer"
        >
          <i className="fa-solid fa-lungs text-[28px] animate-pulse"></i>
          <span className="text-[10px] font-black uppercase tracking-widest leading-none text-center px-1">Beatmen</span>
        </button>
      </div>
    );
  }

  // ==========================================
  // STATE 2: PAUSIERT (Eskalations-Warnung)
  // ==========================================
  if (!state.isCompressing) {
    const isWarning = pauseSecs >= 5 && pauseSecs < 10;
    const isCritical = pauseSecs >= 10;

    let btnClass = "bg-white border-slate-100 shadow-[0_10px_25px_rgba(0,0,0,0.05)] text-slate-600";
    let iconClass = "text-emerald-500"; 
    let badgeClass = "bg-slate-700 text-white border-slate-100";

    if (isCritical) {
      btnClass = "bg-red-50 border-red-600 text-red-600 shadow-[0_0_40px_rgba(227,0,15,0.8)] animate-pulse scale-105";
      iconClass = "text-red-600 drop-shadow-[0_0_20px_rgba(227,0,15,1)]";
      badgeClass = "bg-red-600 text-white border-white";
    } else if (isWarning) {
      btnClass = "bg-amber-50 border-amber-400 text-amber-600 shadow-[0_0_20px_rgba(245,158,11,0.5)]";
      iconClass = "text-amber-500";
      badgeClass = "bg-amber-500 text-white border-white";
    }

    return (
      <div className="relative pointer-events-auto">
        <button
          onClick={toggleCpr}
          className={`w-[85px] h-[85px] rounded-full border-2 flex flex-col items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer ${btnClass}`}
        >
          <i className={`fa-solid fa-play text-[28px] ${iconClass}`}></i>
          <span className="text-[10px] font-black uppercase tracking-widest leading-none text-center px-1">CPR Fortsetzen</span>
        </button>
        
        {pauseSecs > 0 && (
          <div className={`absolute -top-2 -right-3 text-[11px] font-black px-2.5 h-7 rounded-full flex items-center justify-center shadow-md border-[3px] z-10 ${badgeClass}`}>
            {pauseSecs}s
          </div>
        )}
      </div>
    );
  }

  // ==========================================
  // STATE 3: LÄUFT (Der Metronom-Modus)
  // ==========================================
  
  const flashClass = isFlashing 
    ? "bg-red-50 border-red-500 shadow-[0_0_50px_rgba(227,0,15,0.85)]" 
    : "bg-white border-slate-100 shadow-[0_10px_25px_rgba(0,0,0,0.05)]";

  return (
    <div className="relative pointer-events-auto">
      <button
        onClick={toggleCpr}
        className={`w-[85px] h-[85px] rounded-full border-2 flex flex-col items-center justify-center gap-1.5 transition-all active:scale-95 text-slate-600 cursor-pointer ${flashClass}`}
      >
        <i className="fa-solid fa-pause text-[28px] text-slate-400"></i>
        <span className="text-[10px] font-black uppercase tracking-widest leading-none text-center px-1">CPR Pausieren</span>
      </button>
      
      {state.cprMode !== 'continuous' && state.compressionCount > 0 && (
        <div className="absolute -top-1 -right-1 w-[28px] h-[28px] text-[12px] font-black bg-slate-700 text-white rounded-full flex items-center justify-center shadow-md border-[2px] border-white z-10">
          {state.compressionCount}
        </div>
      )}
    </div>
  );
}