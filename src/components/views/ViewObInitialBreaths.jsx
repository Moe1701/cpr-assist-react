// --- Datei: src/components/views/ViewObInitialBreaths.jsx ---
import React, { useContext } from 'react';
import { CprContext } from '../../context/CprContext.jsx';
import { CPR_CONFIG } from '../../config/cprConfig.js';

export default function ViewObInitialBreaths() {
  const { dispatch, logEvent } = useContext(CprContext);

  const handleAction = (performed) => {
    // 1. Ab ins Protokoll!
    const detail = performed ? "5 Initiale Beatmungen DURCHGEFÜHRT" : "5 Initiale Beatmungen ÜBERSPRUNGEN";
    logEvent(CPR_CONFIG.EVENTS.PHASE_CHANGE, detail);
    
    // 2. Weiter zum nächsten Screen
    dispatch({ type: 'SET_PHASE', payload: CPR_CONFIG.PHASES.OB_COMPRESSIONS });
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-4 animate-in fade-in zoom-in-95 duration-300">
      <div className="w-16 h-16 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center mb-3">
        <i className="fa-solid fa-lungs text-3xl"></i>
      </div>
      
      <h2 className="text-xl font-black text-slate-800 uppercase tracking-wider text-center leading-tight mb-6">
        5 Initiale<br/>Beatmungen
      </h2>

      <div className="flex flex-col gap-3 w-full px-4">
        <button 
          onClick={() => handleAction(true)}
          className="w-full bg-blue-500 text-white py-3 rounded-2xl font-black uppercase tracking-widest text-sm shadow-[0_5px_15px_rgba(59,130,246,0.3)] active:scale-95 transition-all"
        >
          Durchgeführt
        </button>
        
        <button 
          onClick={() => handleAction(false)}
          className="w-full bg-white text-slate-400 border-2 border-slate-200 py-3 rounded-2xl font-bold uppercase tracking-widest text-sm active:scale-95 transition-all hover:bg-slate-50"
        >
          Überspringen
        </button>
      </div>
    </div>
  );
}