import React, { useContext } from 'react';
import { CprContext } from '../../context/CprContext.jsx';
import { CPR_CONFIG } from '../../config/cprConfig.js';

export default function ViewObCompressions() {
  const { dispatch, logEvent } = useContext(CprContext);

  const handleConfirmCompressions = () => {
    logEvent(CPR_CONFIG.EVENTS.PHASE_CHANGE, "Reanimation offiziell gestartet");
    dispatch({ type: 'SET_PHASE', payload: CPR_CONFIG.PHASES.OB_ANALYZE });
  };

  return (
    <div className="absolute inset-0 w-full h-full bg-white flex flex-col items-center justify-center animate-in fade-in duration-300">
      <div className="absolute top-[45px] w-full flex justify-center">
        {/* HIER IST DER FIX: Echter HTML-Umbruch mit <br/> */}
        <span className="text-[15px] font-black text-slate-700 uppercase tracking-[0.25em] text-center leading-tight drop-shadow-sm">
          Kompression<br/>gestartet?
        </span>
      </div>
      
      <div className="absolute top-[115px] w-full flex justify-center">
        <div className="text-[64px] font-mono font-black text-slate-700 tracking-tighter leading-none">00:00</div>
      </div>
      
      <div className="absolute top-[215px] w-full flex justify-center">
        <button 
          onClick={handleConfirmCompressions} 
          className="w-[85%] max-w-[260px] h-[60px] bg-red-50 text-[#E3000F] rounded-full font-black uppercase tracking-[0.15em] text-[15px] shadow-[0_8px_25px_rgba(227,0,15,0.05)] border border-red-200 active:scale-95 transition-all flex items-center justify-center gap-3 animate-pulse"
        >
          <i className="fa-solid fa-check-double text-2xl text-red-400"></i>
          <span>Bestätigen</span>
        </button>
      </div>
    </div>
  );
}