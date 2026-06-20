// --- Datei: src/components/views/ViewJoule.jsx ---
import React, { useContext } from 'react';
import { CprContext } from '../../context/CprContext.jsx';
import { CPR_CONFIG } from '../../config/cprConfig.js';

export default function ViewJoule() {
  const { state, dispatch, logEvent } = useContext(CprContext);

  const handleJouleSelect = (joule) => {
    logEvent(CPR_CONFIG.EVENTS.SHOCK, `Schock abgegeben: ${joule}J`);
    
    // NEU: Triggert den neuen Befehl im Reducer!
    dispatch({ type: 'RECORD_SHOCK', payload: joule }); 
    dispatch({ type: 'SET_PHASE', payload: CPR_CONFIG.PHASES.WAITING_CPR_RESUME });
  };

  const weight = state.patientWeight || 4;
  const jouleLow = Math.round(weight * 4);
  const jouleHigh = Math.round(weight * 8);

  return (
    <div className="absolute inset-0 w-full h-full bg-white flex flex-col items-center justify-center animate-in fade-in duration-300">
      <div className="absolute top-[35px] w-full flex justify-center">
        <span className="text-[16px] font-black text-slate-700 uppercase tracking-[0.25em] drop-shadow-sm">Energie wählen</span>
      </div>
      
      {state.isPediatric ? (
        <div className="absolute top-[110px] w-full flex justify-center gap-3 px-4">
          <button 
            onClick={() => handleJouleSelect(jouleLow)} 
            className="flex-1 h-[75px] bg-yellow-50/30 text-yellow-600 rounded-[20px] shadow-sm border-2 border-yellow-400 active:scale-95 transition-all flex flex-col items-center justify-center"
          >
            <span className="font-black uppercase tracking-wider text-[24px] leading-none">{jouleLow} J</span>
            <span className="text-[9px] font-bold text-yellow-600/60 uppercase tracking-widest mt-1">4 J/kg</span>
          </button>
          <button 
            onClick={() => handleJouleSelect(jouleHigh)} 
            className="flex-1 h-[75px] bg-yellow-50/30 text-yellow-600 rounded-[20px] shadow-sm border-2 border-yellow-400 active:scale-95 transition-all flex flex-col items-center justify-center"
          >
            <span className="font-black uppercase tracking-wider text-[24px] leading-none">{jouleHigh} J</span>
            <span className="text-[9px] font-bold text-yellow-600/60 uppercase tracking-widest mt-1">8 J/kg</span>
          </button>
        </div>
      ) : (
        <div className="absolute top-[90px] w-full flex flex-col items-center gap-2.5">
          <button 
            onClick={() => handleJouleSelect(150)} 
            className="w-[85%] max-w-[220px] h-[50px] bg-yellow-50/30 text-yellow-600 rounded-[16px] font-black uppercase tracking-wider text-[20px] shadow-sm border-2 border-yellow-400 active:scale-95 transition-all flex items-center justify-center"
          >
            150 J
          </button>
          <div className="flex gap-2.5 w-[85%] max-w-[220px]">
            <button 
              onClick={() => handleJouleSelect(200)} 
              className="flex-1 h-[50px] bg-yellow-50/30 text-yellow-600 rounded-[16px] font-black uppercase tracking-wider text-[18px] shadow-sm border-2 border-yellow-400 active:scale-95 transition-all flex items-center justify-center"
            >
              200 J
            </button>
            <button 
              onClick={() => handleJouleSelect(360)} 
              className="flex-1 h-[50px] bg-yellow-50/30 text-yellow-600 rounded-[16px] font-black uppercase tracking-wider text-[18px] shadow-sm border-2 border-yellow-400 active:scale-95 transition-all flex items-center justify-center"
            >
              360 J
            </button>
          </div>
        </div>
      )}

      <div className="absolute top-[230px] w-full flex justify-center">
        <span className="text-[10px] font-bold text-[#E3000F] uppercase tracking-widest flex items-center gap-2 animate-pulse">
           <i className="fa-solid fa-bolt"></i> Nach Schock bestätigen
        </span>
      </div>
      
      <div className="absolute top-[270px] w-full flex justify-center">
        <button 
          onClick={() => dispatch({ type: 'SET_PHASE', payload: CPR_CONFIG.PHASES.DECISION })} 
          className="px-8 h-[36px] bg-white text-slate-400 rounded-full font-bold uppercase tracking-[0.2em] text-[10px] shadow-sm border border-slate-100 active:scale-95 transition-all"
        >
          Zurück
        </button>
      </div>
    </div>
  );
}
