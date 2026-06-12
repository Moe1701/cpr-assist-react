import React, { useContext } from 'react';
import { CprContext } from '../../context/CprContext.jsx';

export default function ViewObAnalyze() {
  const { dispatch } = useContext(CprContext);

  const handleConfirm = () => {
    // Leitet nach Bestätigung zur Entscheidung (Schockbar / Nicht Schockbar) weiter
    dispatch({ type: 'SET_PHASE', payload: 'DECISION' });
  };

  return (
    <div className="absolute inset-0 w-full h-full z-20 bg-white animate-in fade-in duration-300 rounded-full overflow-hidden">
      
      {/* Dekorative Blitz-Grafik als Hintergrund */}
      <div 
        className="absolute inset-0 pointer-events-none z-0 opacity-80"
        style={{ 
          clipPath: 'polygon(70% 0, 15% 55%, 45% 55%, 30% 100%, 85% 45%, 55% 45%)',
          backgroundImage: 'repeating-linear-gradient(-45deg, rgba(227,0,15,0.08) 0px, rgba(227,0,15,0.08) 4px, transparent 4px, transparent 8px)',
          transform: 'scale(1.5)'
        }}
      ></div>

      {/* Titel-Pille */}
      <div className="absolute top-[35px] w-full flex justify-center z-10">
        <span className="text-[16px] font-black text-slate-700 uppercase tracking-[0.25em] bg-white/90 px-4 py-1 rounded-full pointer-events-none drop-shadow-sm">
          Initiale Analyse
        </span>
      </div>

      {/* Button: Bestätigen */}
      <div className="absolute top-[195px] w-full flex justify-center z-10 pointer-events-auto">
        <button 
          onClick={handleConfirm}
          className="w-[85%] max-w-[300px] h-[60px] rounded-full bg-red-50 border border-red-200 text-[#E3000F] shadow-[0_8px_25px_rgba(227,0,15,0.05)] font-black uppercase tracking-[0.15em] text-[15px] active:scale-95 transition-all duration-300 flex items-center justify-center gap-3"
        >
          <i className="fa-solid fa-check-double text-2xl text-red-400"></i>
          <span>Bestätigen</span>
        </button>
      </div>

    </div>
  );
}