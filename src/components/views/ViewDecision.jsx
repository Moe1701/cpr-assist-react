// --- Datei: src/components/views/ViewDecision.jsx ---
import React, { useContext } from 'react';
import { CprContext } from '../../context/CprContext.jsx';
import { CPR_CONFIG } from '../../config/cprConfig.js';

export default function ViewDecision() {
  const { dispatch, logEvent } = useContext(CprContext);

  const handleShockable = () => {
    logEvent(CPR_CONFIG.EVENTS.PHASE_CHANGE, "Analyse: Schockbar gewählt");
    dispatch({ type: 'SET_PHASE', payload: CPR_CONFIG.PHASES.JOULE });
  };

  const handleNonShockable = () => {
    logEvent(CPR_CONFIG.EVENTS.PHASE_CHANGE, "Analyse: Nicht Schockbar gewählt");
    // Bei Nicht-Schockbar überspringen wir das Joule-Menü!
    dispatch({ type: 'SET_PHASE', payload: CPR_CONFIG.PHASES.WAITING_CPR_RESUME });
  };

  // BUGFIX: Zurück-Button setzt CPR fort und geht zurück ins Dashboard
  const handleBack = () => {
    logEvent(CPR_CONFIG.EVENTS.PAUSE, "Analyse abgebrochen");
    dispatch({ type: 'TOGGLE_COMPRESSION', payload: true }); // Metronom wieder an
    dispatch({ type: 'SET_PHASE', payload: CPR_CONFIG.PHASES.RUNNING }); // Zurück zum Ring
  };

  return (
    <div className="absolute inset-0 w-full h-full bg-white flex flex-col items-center justify-center animate-in fade-in duration-300">
      <div className="absolute top-[45px] w-full flex justify-center">
        <span className="text-[14px] font-black text-slate-700 uppercase tracking-[0.25em] drop-shadow-sm text-center leading-tight">
          Rhythmus ist:
        </span>
      </div>
      
      <div className="absolute top-[100px] w-full flex flex-col items-center gap-3">
        <button 
          onClick={handleShockable} 
          className="w-[85%] max-w-[240px] py-4 bg-[#E3000F] text-white rounded-2xl font-black uppercase tracking-widest text-[14px] shadow-[0_5px_15px_rgba(227,0,15,0.3)] active:scale-95 transition-all flex items-center justify-center gap-3"
        >
          <i className="fa-solid fa-bolt text-lg"></i>
          <span>Schockbar</span>
        </button>
        
        <button 
          onClick={handleNonShockable} 
          className="w-[85%] max-w-[240px] py-4 bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-widest text-[14px] shadow-[0_5px_15px_rgba(16,185,129,0.3)] active:scale-95 transition-all flex items-center justify-center gap-3"
        >
          <i className="fa-solid fa-heart-pulse text-lg"></i>
          <span>Nicht Schockbar</span>
        </button>
      </div>
      
      <div className="absolute bottom-[30px] w-full flex justify-center">
        <button 
          onClick={handleBack} 
          className="px-8 py-2.5 bg-white text-slate-500 rounded-full font-bold uppercase tracking-widest text-[10px] shadow-sm border border-slate-200 active:scale-95 transition-all"
        >
          Zurück
        </button>
      </div>
    </div>
  );
}
