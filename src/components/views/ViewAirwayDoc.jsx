// --- Datei: src/components/views/ViewAirwayDoc.jsx ---
import React, { useContext, useState } from 'react';
import { CprContext } from '../../context/CprContext.jsx';
import { CPR_CONFIG } from '../../config/cprConfig.js';
import { getBroselowZone } from '../../config/broselowData.js';

export default function ViewAirwayDoc() {
  const { state, dispatch, logEvent } = useContext(CprContext);
  const activeZone = state.isPediatric ? getBroselowZone(state.patientWeight || 10) : null;
  
  const [size, setSize] = useState('');
  const [depth, setDepth] = useState('');

  const handleSave = () => {
    const finalSize = size || '?';
    const finalDepth = depth || '?';
    
    // Speichert den Atemweg in den globalen State
    dispatch({ 
      type: 'SET_AIRWAY', 
      payload: { established: true, type: state.airwayType, size: finalSize, depth: finalDepth } 
    });
    
    // Erzwingt den KONT-Modus
    dispatch({ type: 'SET_CPR_MODE', payload: 'continuous' });
    dispatch({ type: 'SET_COMPRESSION_COUNT', payload: 0 }); // Reset Loop
    
    // Rechtssicheres Protokoll
    logEvent(CPR_CONFIG.EVENTS.AIRWAY, `${state.airwayType} etabliert (Gr. ${finalSize}, Tiefe: ${finalDepth}cm)`);
    logEvent(CPR_CONFIG.EVENTS.PHASE_CHANGE, `Modus: continuous (Auto-Switch durch Invasiv)`);
    
    // Zurück zum Dashboard
    dispatch({ type: 'SET_PHASE', payload: CPR_CONFIG.PHASES.RUNNING });
  };

  const handleCancel = () => {
    // Zurück zur vorherigen Auswahl
    dispatch({ type: 'SET_PHASE', payload: CPR_CONFIG.PHASES.AIRWAY_MENU });
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-4 animate-in slide-in-from-right-8 duration-200">
      <button onClick={handleCancel} className="absolute top-4 left-4 w-8 h-8 bg-slate-100 rounded-full text-slate-500 flex items-center justify-center active:scale-95 transition-transform z-10">
        <i className="fa-solid fa-arrow-left pointer-events-none"></i>
      </button>

      <h2 className="text-[11px] font-black text-slate-800 uppercase tracking-widest text-center mt-2 mb-4">
        Doku: {state.airwayType || 'Invasiv'}
      </h2>

      <div className="w-[85%] flex flex-col gap-3 mb-5">
        <div>
          <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Größe (mm)</label>
          <input 
            type="text" 
            value={size} 
            onChange={(e) => setSize(e.target.value)} 
            placeholder={activeZone?.airway?.tubus || "z.B. 7.5"} 
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-center font-bold text-slate-700 focus:outline-none focus:border-cyan-400 focus:bg-cyan-50" 
          />
        </div>
        <div>
          <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Tiefe (cm ab Zahnreihe)</label>
          <input 
            type="text" 
            value={depth} 
            onChange={(e) => setDepth(e.target.value)} 
            placeholder={activeZone?.airway?.tiefe || "z.B. 21"} 
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-center font-bold text-slate-700 focus:outline-none focus:border-cyan-400 focus:bg-cyan-50" 
          />
        </div>
      </div>

      <button onClick={handleSave} className="w-[85%] py-3 rounded-xl font-black uppercase tracking-widest text-[11px] bg-cyan-500 text-white shadow-[0_5px_15px_rgba(6,182,212,0.4)] active:scale-95 transition-transform flex items-center justify-center gap-2">
        <i className="fa-solid fa-check pointer-events-none"></i> <span className="pointer-events-none">Speichern</span>
      </button>
    </div>
  );
}
