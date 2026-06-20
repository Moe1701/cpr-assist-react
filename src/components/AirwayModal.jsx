import React, { useContext } from 'react';
import { CprContext } from '../context/CprContext.jsx';
import { useMasterLoop } from '../hooks/useMasterLoop.js';
import { getBroselowZone } from '../config/broselowData.js';

export default function AirwayModal() {
  const { state, dispatch } = useContext(CprContext);
  const { setAirway } = useMasterLoop();

  if (!state.isAirwayModalOpen) return null;

  const handleSelect = (type) => {
    setAirway(type);
    dispatch({ type: 'TOGGLE_AIRWAY_MODAL', payload: false });
  };

  const handleRemove = () => {
    setAirway(null);
    dispatch({ type: 'TOGGLE_AIRWAY_MODAL', payload: false });
  };

  // Broselow-Daten laden, falls das Kind-Setup aktiv ist
  const activeZone = state.isPediatric ? getBroselowZone(state.patientWeight || 10) : null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200 p-4">
      <div className="relative bg-white w-full max-w-[340px] rounded-[2rem] p-6 border border-slate-100 shadow-2xl flex flex-col animate-in zoom-in-95 duration-300">
        
        <button 
          onClick={() => dispatch({ type: 'TOGGLE_AIRWAY_MODAL', payload: false })} 
          className="absolute top-4 right-4 w-8 h-8 bg-slate-100 rounded-full text-slate-500 flex items-center justify-center active:scale-95 cursor-pointer"
        >
          <i className="fa-solid fa-xmark pointer-events-none"></i>
        </button>

        <h2 className="text-lg font-black text-slate-800 uppercase tracking-widest text-center mt-2 mb-6">
          Atemweg sichern
        </h2>

        {/* BESI-ANZEIGE: Pädiatrie Tubus-Größen! */}
        {state.isPediatric && activeZone && (
          <div className="mb-6 p-4 bg-indigo-50 border border-indigo-100 rounded-2xl shadow-inner">
            <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2 text-center">Broselow Info ({activeZone.color})</div>
            <div className="flex justify-between items-center px-2">
                <div className="flex flex-col items-center">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Tubus</span>
                    <span className="font-black text-indigo-700 text-lg">{activeZone.airway.tubus}</span>
                </div>
                <div className="w-px h-8 bg-indigo-200"></div>
                <div className="flex flex-col items-center">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Tiefe</span>
                    <span className="font-black text-indigo-700 text-lg">{activeZone.airway.tiefe} cm</span>
                </div>
                <div className="w-px h-8 bg-indigo-200"></div>
                <div className="flex flex-col items-center">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">SGA</span>
                    <span className="font-black text-indigo-700 text-lg">{activeZone.airway.sga}</span>
                </div>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3 mb-6">
          <button 
            onClick={() => handleSelect('Beutel-Maske')}
            className={`w-full h-[70px] rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 active:scale-95 transition-all border-2 cursor-pointer ${state.airwayType === 'Beutel-Maske' ? 'bg-cyan-50 border-cyan-400 text-cyan-700' : 'bg-white border-slate-200 text-slate-600 shadow-sm'}`}
          >
            <i className="fa-solid fa-mask-ventilator text-2xl pointer-events-none"></i>
            <span className="pointer-events-none">Beutel-Maske</span>
          </button>
          
          <button 
            onClick={() => handleSelect('Invasiv')}
            className={`w-full h-[70px] rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 active:scale-95 transition-all border-2 cursor-pointer ${state.airwayType === 'Invasiv' ? 'bg-cyan-50 border-cyan-400 text-cyan-700' : 'bg-white border-slate-200 text-slate-600 shadow-sm'}`}
          >
            <i className="fa-solid fa-virus-covid text-2xl pointer-events-none"></i>
            <span className="pointer-events-none">Tubus / SGA</span>
          </button>
        </div>

        {state.airwayEstablished && (
          <button 
            onClick={handleRemove}
            className="w-full h-[50px] rounded-2xl font-bold uppercase tracking-widest text-[11px] bg-red-50 text-red-600 border border-red-200 active:scale-95 transition-all cursor-pointer"
          >
            Atemweg entfernen
          </button>
        )}
      </div>
    </div>
  );
}