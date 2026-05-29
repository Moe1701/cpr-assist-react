import React, { useContext } from 'react';
// Pfad korrigiert
import { CprContext } from '../../CprContext.jsx';

export default function ViewObInitialBreaths() {
  const { dispatch } = useContext(CprContext);

  const handleBreathsDone = (skipped = false) => {
    dispatch({ type: 'SET_PHASE', payload: 'OB_COMPRESSIONS' });
  };

  return (
    <div className="absolute inset-0 w-full h-full bg-white flex flex-col items-center justify-center animate-in scale-in duration-300">
      <div className="absolute top-[25px] w-full flex justify-center">
        <span className="text-[16px] font-black text-slate-700 uppercase tracking-[0.25em] text-center leading-tight drop-shadow-sm">
          5 Initiale<br/>Beatmungen
        </span>
      </div>
      <div className="absolute top-[75px] w-full flex justify-center">
        <div className="w-12 h-12 bg-cyan-50 border border-cyan-100 text-cyan-600 rounded-full flex items-center justify-center shadow-sm">
          <i className="fa-solid fa-lungs text-xl"></i>
        </div>
      </div>
      <div className="absolute top-[135px] w-full flex justify-center">
        <button onClick={() => handleBreathsDone(false)} className="w-[85%] max-w-[300px] h-[60px] bg-cyan-50/80 text-cyan-700 rounded-full font-black uppercase tracking-[0.15em] text-[15px] shadow-[0_8px_25px_rgba(6,182,212,0.04)] border border-cyan-200 active:scale-95 transition-all flex items-center justify-center gap-3">
          <i className="fa-solid fa-lungs text-2xl text-cyan-400"></i>
          <span>Durchgeführt</span>
        </button>
      </div>
      <div className="absolute top-[205px] w-full flex justify-center">
        <button onClick={() => handleBreathsDone(true)} className="w-[85%] max-w-[300px] h-[60px] bg-white text-slate-400 rounded-full font-bold uppercase tracking-[0.25em] text-[13px] shadow-[0_5px_15px_rgba(0,0,0,0.03)] border border-slate-100 active:scale-95 transition-all flex items-center justify-center gap-2">
          <span>Überspringen</span>
        </button>
      </div>
    </div>
  );
}