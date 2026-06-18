// --- Datei: src/components/views/ViewAirwayMenu.jsx ---
import React, { useContext } from 'react';
import { CprContext } from '../../context/CprContext.jsx';
import { CPR_CONFIG } from '../../config/cprConfig.js';
import { getBroselowZone } from '../../config/broselowData.js';

export default function ViewAirwayMenu() {
  const { state, dispatch, logEvent } = useContext(CprContext);
  
  const activeZone = state.isPediatric ? getBroselowZone(state.patientWeight || 10) : null;
  const returnPhase = state.previousAppPhase || CPR_CONFIG.PHASES.RUNNING;

  const handleBvm = () => {
    const mode = state.isPediatric ? '15:2' : '30:2';
    
    dispatch({ type: 'SET_AIRWAY', payload: { established: true, type: 'Beutel-Maske', size: null, depth: null } });
    dispatch({ type: 'SET_CPR_MODE', payload: mode });
    dispatch({ type: 'SET_COMPRESSION_COUNT', payload: 0 });
    
    logEvent(CPR_CONFIG.EVENTS.AIRWAY, 'Beutel-Maske etabliert');
    logEvent(CPR_CONFIG.EVENTS.PHASE_CHANGE, `Modus: ${mode} (Beutel-Maske)`);
    
    dispatch({ type: 'SET_PHASE', payload: returnPhase });
  };

  const handleInvasive = (type) => {
    dispatch({ type: 'SET_AIRWAY_TYPE', payload: type });
    dispatch({ type: 'SET_PHASE', payload: CPR_CONFIG.PHASES.AIRWAY_DOC });
  };

  const handleRemove = () => {
    const mode = state.isPediatric ? '15:2' : '30:2';
    
    dispatch({ type: 'SET_AIRWAY', payload: { established: false, type: null, size: null, depth: null } });
    dispatch({ type: 'SET_CPR_MODE', payload: mode });
    dispatch({ type: 'SET_COMPRESSION_COUNT', payload: 0 });
    
    logEvent(CPR_CONFIG.EVENTS.AIRWAY, 'Atemweg entfernt');
    logEvent(CPR_CONFIG.EVENTS.PHASE_CHANGE, `Modus: ${mode} (Auto-Switch)`);
    
    dispatch({ type: 'SET_PHASE', payload: returnPhase });
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-6 animate-in zoom-in-95 duration-200">
      
      <button 
        onClick={() => dispatch({ type: 'SET_PHASE', payload: returnPhase })} 
        className="absolute top-4 right-4 w-8 h-8 bg-slate-50 rounded-full text-slate-400 flex items-center justify-center active:scale-95 transition-transform z-10 hover:bg-slate-100"
      >
        <i className="fa-solid fa-xmark pointer-events-none"></i>
      </button>

      <h2 className="text-[11px] font-black text-slate-700 uppercase tracking-widest text-center mt-1 mb-3">
        Atemweg sichern
      </h2>

      {activeZone && (
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-1.5 w-[85%] max-w-[220px] mb-3 text-center">
          <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Broselow Info</span>
          <span className="text-[10px] font-black text-slate-600">
            Tubus: {activeZone.airway?.tubus || '?'} mm | Tiefe: {activeZone.airway?.tiefe || '?'} cm
          </span>
        </div>
      )}

      {/* Die Container-Breite sorgt dafür, dass nichts den Kreis berührt */}
      <div className="w-[85%] max-w-[220px] flex flex-col gap-2">
        
        {/* BEUTEL-MASKE: Weiß mit Cyan Rahmen */}
        <button 
          onClick={handleBvm} 
          className="w-full py-3 rounded-[16px] font-black uppercase tracking-widest flex items-center justify-center gap-2.5 active:scale-95 transition-transform bg-white border-2 border-cyan-200 text-cyan-600 shadow-sm hover:bg-cyan-50"
        >
          <i className="fa-solid fa-mask-ventilator text-lg pointer-events-none"></i> 
          <span className="pointer-events-none text-[11px]">Beutel-Maske</span>
        </button>

        {/* INVASIV GRID: Weiß mit Indigo Rahmen */}
        <div className="grid grid-cols-2 gap-2 mt-0.5">
          {['ET-Tubus', 'i-gel', 'Larynxmaske', 'Larynxtubus'].map((aw) => (
            <button 
              key={aw} 
              onClick={() => handleInvasive(aw)} 
              className="py-3 rounded-[16px] font-bold uppercase tracking-wider text-[9px] active:scale-95 transition-transform bg-white border-2 border-indigo-100 text-indigo-500 shadow-sm flex flex-col items-center justify-center gap-1.5 hover:bg-indigo-50"
            >
              <i className="fa-solid fa-lungs text-lg pointer-events-none opacity-80"></i>
              <span className="pointer-events-none">{aw}</span>
            </button>
          ))}
        </div>
      </div>

      {state.airwayEstablished && (
        <button 
          onClick={handleRemove} 
          className="mt-4 w-[85%] max-w-[220px] py-2 font-bold uppercase tracking-widest text-[9px] text-red-500 bg-red-50 rounded-xl border border-red-100 active:scale-95 transition-transform"
        >
          <span className="pointer-events-none">Atemweg entfernen</span>
        </button>
      )}
    </div>
  );
}