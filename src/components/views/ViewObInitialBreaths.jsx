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
    <div className="absolute inset-0 w-full h-full bg-white flex flex-col items-center justify-center animate-in fade-in duration-300">
      <div className="absolute top-[35px] w-full flex justify-center">
        {/* HIER IST DER FIX: Echter HTML-Umbruch mit <br/> */}
        <span className="text-[16px] font-black text-slate-700 uppercase tracking-[0.25em] text-center leading-tight drop-shadow-sm">
          5 Initiale<br/>Beatmungen
        </span>
      </div>

      <div className="absolute top-[95px] w-full flex justify-center">
        <div className="w-12 h-12 bg-cyan-50 border border-cyan-100 text-cyan-600 rounded-full flex items-center justify-center shadow-sm">
          <i className="fa-solid fa-lungs text-xl"></i>
        </div>
      </div>

      <div className="absolute top-[160px] w-full flex justify-center">
        <button 
          onClick={() => handleAction(true)}
          className="w-[85%] max-w-[260px] h-[55px] rounded-full bg-cyan-50/80 border border-cyan-200 text-cyan-700 shadow-[0_8px_25px_rgba(6,182,212,0.04)] font-black uppercase tracking-[0.15em] text-[14px] active:scale-95 transition-all flex items-center justify-center gap-3"
        >
          <i className="fa-solid fa-lungs text-xl text-cyan-400"></i>
          <span>Durchgeführt</span>
        </button>
      </div>

      <div className="absolute top-[225px] w-full flex justify-center">
        <button 
          onClick={() => handleAction(false)}
          className="w-[85%] max-w-[260px] h-[55px] rounded-full bg-white border border-slate-100 text-slate-400 shadow-[0_5px_15px_rgba(0,0,0,0.03)] font-bold uppercase tracking-[0.2em] text-[12px] active:scale-95 transition-all"
        >
          Überspringen
        </button>
      </div>
    </div>
  );
}