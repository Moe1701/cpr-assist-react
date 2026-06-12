import React, { useContext } from 'react';
import { CprContext } from '../../context/CprContext.jsx';
import { CPR_CONFIG } from '../../config/cprConfig.js';

export default function ViewObInitialBreaths() {
  const { dispatch, logEvent } = useContext(CprContext);

  const handleAction = (performed) => {
    const detail = performed ? "5 Initiale Beatmungen DURCHGEFÜHRT" : "5 Initiale Beatmungen ÜBERSPRUNGEN";
    logEvent(CPR_CONFIG.EVENTS.PHASE_CHANGE, detail);
    dispatch({ type: 'SET_PHASE', payload: CPR_CONFIG.PHASES.OB_COMPRESSIONS });
  };

  return (
    <div className="absolute inset-0 w-full h-full z-20 bg-white animate-in fade-in duration-300 rounded-full">
      
      {/* Titel (zweizeilig) */}
      <div className="absolute top-[25px] w-full flex justify-center">
        <span className="text-[16px] font-black text-slate-700 uppercase tracking-[0.25em] text-center leading-tight drop-shadow-sm pointer-events-none whitespace-pre-line">
          {"5 Initiale\nBeatmungen"}
        </span>
      </div>

      {/* Icon-Badge */}
      <div className="absolute top-[75px] w-full flex justify-center pointer-events-none">
        <div className="w-12 h-12 bg-cyan-50 border border-cyan-100 text-cyan-600 rounded-full flex items-center justify-center shadow-sm">
          <i className="fa-solid fa-lungs text-xl"></i>
        </div>
      </div>

      {/* Button: Durchgeführt */}
      <div className="absolute top-[135px] w-full flex justify-center pointer-events-auto">
        <button 
          onClick={() => handleAction(true)}
          className="w-[85%] max-w-[300px] h-[60px] rounded-full bg-cyan-50/80 border border-cyan-200 text-cyan-700 shadow-[0_8px_25px_rgba(6,182,212,0.04)] font-black uppercase tracking-[0.15em] text-[15px] active:scale-95 transition-all duration-300 flex items-center justify-center gap-3"
        >
          <i className="fa-solid fa-lungs text-2xl text-cyan-400"></i>
          <span>Durchgeführt</span>
        </button>
      </div>

      {/* Button: Überspringen */}
      <div className="absolute top-[205px] w-full flex justify-center">
        <button 
          onClick={() => handleAction(false)}
          className="w-[85%] max-w-[300px] h-[60px] rounded-full bg-white border border-slate-100 text-slate-400 shadow-[0_5px_15px_rgba(0,0,0,0.03)] font-bold uppercase tracking-[0.25em] text-[13px] active:scale-95 transition-all duration-300 flex items-center justify-center"
        >
          Überspringen
        </button>
      </div>

    </div>
  );
}