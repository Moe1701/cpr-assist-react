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
  
  const returnPhase = state.previousAppPhase || CPR_CONFIG.PHASES.RUNNING;

  const handleSave = () => {
    const finalSize = size || '?';
    const finalDepth = depth || '?';
    
    dispatch({ 
      type: 'SET_AIRWAY', 
      payload: { established: true, type: state.airwayType, size: finalSize, depth: finalDepth } 
    });
    
    dispatch({ type: 'SET_CPR_MODE', payload: 'continuous' });
    dispatch({ type: 'SET_COMPRESSION_COUNT', payload: 0 }); 
    
    logEvent(CPR_CONFIG.EVENTS.AIRWAY, `${state.airwayType} etabliert (Gr. ${finalSize}, Tiefe: ${finalDepth}cm)`);
    logEvent(CPR_CONFIG.EVENTS.PHASE_CHANGE, `Modus: continuous (Auto-Switch durch Invasiv)`);
    
    dispatch({ type: 'SET_PHASE', payload: returnPhase });
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-6 animate-in slide-in-from-right-8 duration-200">
      
      <button 
        onClick={() => dispatch({ type: 'SET_PHASE', payload: CPR_CONFIG.PHASES.AIRWAY_MENU })} 
        className="absolute top-4 left-4 w-8 h-8 bg-slate-50 rounded-full text-slate-400 flex items-center justify-center active:scale-95 transition-transform z-10 hover:bg-slate-100"
      >
        <i className="fa-solid fa-arrow-left pointer-events-none"></i>
      </button>

      <h2 className="text-[12px] font-black text-slate-700 uppercase tracking-widest text-center mt-1 mb-2">
        Doku: {state.airwayType || 'Invasiv'}
      </h2>

      {/* Subtiler, unaufdringlicher Hinweis statt blinkender Warnung */}
      <div className="flex items-center gap-1.5 text-slate-400 mb-5">
        <i className="fa-solid fa-circle-info text-[10px]"></i>
        <span className="text-[8px] font-bold uppercase tracking-widest">etCO2 & Cuffdruck prüfen</span>
      </div>

      <div className="w-[85%] max-w-[220px] flex flex-col gap-2.5 mb-5">
        <div>
          <label className="text-[8px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-0.5 block">
            Größe (mm)
          </label>
          <input 
            type="text" 
            value={size} 
            onChange={(e) => setSize(e.target.value)} 
            placeholder={activeZone?.airway?.tubus || "z.B. 7.5"} 
            className="w-full bg-slate-50 border border-slate-200 rounded-[14px] p-2.5 text-center font-black text-slate-600 text-sm placeholder:text-slate-300 placeholder:font-bold focus:outline-none focus:border-cyan-300 focus:bg-cyan-50 transition-colors" 
          />
        </div>
        <div>
          <label className="text-[8px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-0.5 block">
            Tiefe (cm)
          </label>
          <input 
            type="text" 
            value={depth} 
            onChange={(e) => setDepth(e.target.value)} 
            placeholder={activeZone?.airway?.tiefe || "z.B. 21"} 
            className="w-full bg-slate-50 border border-slate-200 rounded-[14px] p-2.5 text-center font-black text-slate-600 text-sm placeholder:text-slate-300 placeholder:font-bold focus:outline-none focus:border-cyan-300 focus:bg-cyan-50 transition-colors" 
          />
        </div>
      </div>

      <button 
        onClick={handleSave} 
        className="w-[85%] max-w-[220px] py-3 rounded-full font-black uppercase tracking-widest text-[11px] bg-emerald-500 text-white shadow-sm hover:bg-emerald-400 active:scale-95 transition-all flex items-center justify-center gap-2"
      >
        <i className="fa-solid fa-check pointer-events-none"></i> 
        <span className="pointer-events-none">Speichern</span>
      </button>
    </div>
  );
}