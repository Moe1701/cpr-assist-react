// --- Datei: src/components/views/ViewObAnalyze.jsx ---
import React, { useContext } from 'react';
import { CprContext } from '../../context/CprContext.jsx';
import { CPR_CONFIG } from '../../config/cprConfig.js';

export default function ViewObAnalyze() {
  const { dispatch, logEvent } = useContext(CprContext);

  const handleShockable = () => {
    logEvent(CPR_CONFIG.EVENTS.PHASE_CHANGE, "Analyse: Schockbar");
    // Bei "Schockbar" müssen wir als Nächstes die Joule-Zahl wählen
    dispatch({ type: 'SET_PHASE', payload: CPR_CONFIG.PHASES.JOULE });
  };

  const handleNonShockable = () => {
    logEvent(CPR_CONFIG.EVENTS.PHASE_CHANGE, "Analyse: Nicht Schockbar");
    // Bei "Nicht Schockbar" überspringen wir die Joule-Wahl und gehen direkt zum "CPR Fortsetzen" Screen
    dispatch({ type: 'SET_PHASE', payload: CPR_CONFIG.PHASES.WAITING_CPR_RESUME });
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-4 animate-in fade-in zoom-in-95 duration-300">
      <div className="w-16 h-16 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center mb-4">
        <i className="fa-solid fa-heart-crack text-3xl"></i>
      </div>
      
      <h2 className="text-xl font-black text-slate-800 uppercase tracking-wider text-center leading-tight mb-6">
        Rhythmus-<br/>Analyse
      </h2>

      <div className="flex flex-col gap-3 w-full max-w-[250px]">
        <button 
          onClick={handleShockable}
          className="w-full bg-[#E3000F] text-white py-4 rounded-2xl font-black uppercase tracking-widest text-sm shadow-[0_5px_15px_rgba(227,0,15,0.3)] active:scale-95 transition-all"
        >
          Schockbar
        </button>
        
        <button 
          onClick={handleNonShockable}
          className="w-full bg-slate-800 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-sm shadow-[0_5px_15px_rgba(30,41,59,0.3)] active:scale-95 transition-all"
        >
          Nicht Schockbar
        </button>
      </div>
    </div>
  );
}