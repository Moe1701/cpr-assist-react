// --- Datei: src/components/views/ViewAirwayMenu.jsx ---
import React, { useContext } from 'react';
import { CprContext } from '../../context/CprContext.jsx';
import { CPR_CONFIG } from '../../config/cprConfig.js';
import { getBroselowZone } from '../../config/broselowData.js';

export default function ViewAirwayMenu() {
  const { state, dispatch, logEvent } = useContext(CprContext);
  
  // Lädt Broselow-Daten, wenn es ein Kind ist
  const activeZone = state.isPediatric ? getBroselowZone(state.patientWeight || 10) : null;

  // Pfad A: Beutel-Maske (Keine Doku nötig)
  const handleBvm = () => {
    const mode = state.isPediatric ? '15:2' : '30:2';
    
    dispatch({ type: 'SET_AIRWAY', payload: { established: true, type: 'Beutel-Maske', size: null, depth: null } });
    dispatch({ type: 'SET_CPR_MODE', payload: mode });
    dispatch({ type: 'SET_COMPRESSION_COUNT', payload: 0 }); // Zyklus-Reset
    
    logEvent(CPR_CONFIG.EVENTS.AIRWAY, 'Beutel-Maske etabliert');
    logEvent(CPR_CONFIG.EVENTS.PHASE_CHANGE, `Modus: ${mode} (Beutel-Maske)`);
    
    // Zurück zum Dashboard
    dispatch({ type: 'SET_PHASE', payload: CPR_CONFIG.PHASES.RUNNING });
  };

  // Pfad B: Invasiv (Leitet weiter in die Doku)
  const handleInvasive = (type) => {
    dispatch({ type: 'SET_AIRWAY_TYPE', payload: type });
    dispatch({ type: 'SET_PHASE', payload: CPR_CONFIG.PHASES.AIRWAY_DOC });
  };

  // Atemweg wieder entfernen
  const handleRemove = () => {
    const mode = state.isPediatric ? '15:2' : '30:2';
    
    dispatch({ type: 'SET_AIRWAY', payload: { established: false, type: null, size: null, depth: null } });
    dispatch({ type: 'SET_CPR_MODE', payload: mode });
    dispatch({ type: 'SET_COMPRESSION_COUNT', payload: 0 });
    
    logEvent(CPR_CONFIG.EVENTS.AIRWAY, 'Atemweg entfernt');
    logEvent(CPR_CONFIG.EVENTS.PHASE_CHANGE, `Modus: ${mode} (Auto-Switch)`);
    
    dispatch({ type: 'SET_PHASE', payload: CPR_CONFIG.PHASES.RUNNING });
  };

  const handleCancel = () => {
    dispatch({ type: 'SET_PHASE', payload: CPR_CONFIG.PHASES.RUNNING });
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-4 animate-in zoom-in-95 duration-200">
      <button onClick={handleCancel} className="absolute top-4 right-4 w-8 h-8 bg-slate-100 rounded-full text-slate-500 flex items-center justify-center active:scale-95 transition-transform z-10">
        <i className="fa-solid fa-xmark pointer-events-none"></i>
      </button>

      <h2 className="text-xs font-black text-slate-800 uppercase tracking-widest text-center mt-2 mb-3">
        Atemweg sichern
      </h2>

      {/* Broselow Tipp (Nur bei Pädiatrie) */}
      {activeZone && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-2 w-[90%] mb-3 text-center shadow-sm">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Broselow Empfehlung</span>
          <span className="text-[11px] font-black text-slate-700">
            Tubus: {activeZone.airway?.tubus || '?'} mm | Tiefe: {activeZone.airway?.tiefe || '?'} cm
          </span>
        </div>
      )}

      <div className="w-[90%] flex flex-col gap-2">
        {/* Der große Beutel-Maske Button */}
        <button onClick={handleBvm} className="w-full py-2.5 rounded-xl font-black uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-transform bg-white border border-slate-200 text-slate-600 shadow-sm">
          <i className="fa-solid fa-mask-ventilator text-base pointer-events-none"></i> <span className="pointer-events-none">Beutel-Maske</span>
        </button>

        {/* Das 4er Grid für invasive Atemwege */}
        <div className="grid grid-cols-2 gap-2 mt-1">
          {['ET-Tubus', 'i-gel', 'Larynxmaske', 'Larynxtubus'].map((aw) => (
            <button key={aw} onClick={() => handleInvasive(aw)} className="py-2.5 rounded-xl font-bold uppercase tracking-wider text-[9px] active:scale-95 transition-transform bg-white border border-slate-200 text-slate-600 shadow-sm">
              <span className="pointer-events-none">{aw}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Der rote Entfernen-Button (nur wenn was liegt) */}
      {state.airwayEstablished && (
        <button onClick={handleRemove} className="mt-4 w-[90%] py-2 rounded-xl font-bold uppercase tracking-widest text-[9px] bg-red-50 text-red-600 border border-red-200 active:scale-95 transition-transform">
          <span className="pointer-events-none">Atemweg entfernen</span>
        </button>
      )}
    </div>
  );
}
