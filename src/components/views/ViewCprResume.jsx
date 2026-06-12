import React, { useContext } from 'react';
import { CprContext } from '../../context/CprContext.jsx';
import { CPR_CONFIG } from '../../config/cprConfig.js';

export default function ViewCprResume() {
  const { dispatch, logEvent } = useContext(CprContext);

  const handleResumeCpr = () => {
    logEvent(CPR_CONFIG.EVENTS.RESUME, "Reanimation gestartet / fortgesetzt");
    dispatch({ type: 'TICK_CYCLE', payload: 0 }); // Zyklustimer auf Null
    dispatch({ type: 'TOGGLE_COMPRESSION', payload: true }); // Startet Drücken & Metronom
    dispatch({ type: 'SET_PHASE', payload: CPR_CONFIG.PHASES.RUNNING }); // Switch zum Live-Dashboard
  };

  return (
    <div className="absolute inset-0 w-full h-full bg-white flex flex-col items-center justify-center animate-in fade-in duration-300">
      <div className="absolute top-[45px] w-full flex justify-center">
        <span className="text-[16px] font-black text-slate-700 uppercase tracking-[0.25em] drop-shadow-sm">CPR Fortsetzen</span>
      </div>
      
      <div className="absolute top-[125px] w-full flex justify-center">
         <i className="fa-solid fa-heart-pulse text-6xl text-red-100 animate-bounce"></i>
      </div>
      
      <div className="absolute top-[215px] w-full flex justify-center">
        <button 
          onClick={handleResumeCpr} 
          className="w-[85%] max-w-[260px] h-[60px] bg-[#E3000F] text-white rounded-full font-black uppercase tracking-[0.15em] text-[15px] shadow-[0_8px_25px_rgba(227,0,15,0.25)] active:scale-95 transition-all flex items-center justify-center gap-3"
        >
          <i className="fa-solid fa-play text-xl"></i>
          <span>Bestätigen</span>
        </button>
      </div>
    </div>
  );
}