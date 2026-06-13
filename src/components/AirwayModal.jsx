import React, { useContext } from 'react';
import { CprContext } from '../context/CprContext.jsx';
import { useMasterLoop } from '../hooks/useMasterLoop.js';

export default function AirwayModal() {
  const { state, dispatch } = useContext(CprContext);
  const { selectAirway, removeAirway } = useMasterLoop();

  if (!state.isAirwayModalOpen) return null;

  const handleSelect = (type) => {
    selectAirway(type);
    dispatch({ type: 'TOGGLE_AIRWAY_MODAL', payload: false });
  };

  const handleRemove = () => {
    removeAirway();
    dispatch({ type: 'TOGGLE_AIRWAY_MODAL', payload: false });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200 p-4">
      <div className="relative bg-white w-full max-w-[340px] rounded-[2rem] p-6 border border-slate-100 shadow-2xl flex flex-col animate-in zoom-in-95 duration-300">
        
        <button 
          onClick={() => dispatch({ type: 'TOGGLE_AIRWAY_MODAL', payload: false })} 
          className="absolute top-4 right-4 w-8 h-8 bg-slate-100 rounded-full text-slate-500 flex items-center justify-center active:scale-95"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>

        <h2 className="text-lg font-black text-slate-800 uppercase tracking-widest text-center mt-2 mb-6">
          Atemweg sichern
        </h2>

        <div className="flex flex-col gap-3 mb-6">
          <button 
            onClick={() => handleSelect('Beutel-Maske')}
            className={`w-full h-[70px] rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 active:scale-95 transition-all border-2 ${state.airwayType === 'Beutel-Maske' ? 'bg-cyan-50 border-cyan-400 text-cyan-700' : 'bg-white border-slate-200 text-slate-600 shadow-sm'}`}
          >
            <i className="fa-solid fa-mask-ventilator text-2xl"></i>
            Beutel-Maske
          </button>
          
          <button 
            onClick={() => handleSelect('Invasiv')}
            className={`w-full h-[70px] rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 active:scale-95 transition-all border-2 ${state.airwayType === 'Invasiv' ? 'bg-cyan-50 border-cyan-400 text-cyan-700' : 'bg-white border-slate-200 text-slate-600 shadow-sm'}`}
          >
            <i className="fa-solid fa-virus-covid text-2xl"></i>
            Tubus / SGA
          </button>
        </div>

        {state.airwayEstablished && (
          <button 
            onClick={handleRemove}
            className="w-full h-[50px] rounded-2xl font-bold uppercase tracking-widest text-[11px] bg-red-50 text-red-600 border border-red-200 active:scale-95 transition-all"
          >
            Atemweg entfernen
          </button>
        )}
      </div>
    </div>
  );
}