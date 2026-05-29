import React, { useContext } from 'react';
import { CprContext } from '../../context/CprContext.jsx';

export default function ViewObPatient() {
  const { dispatch } = useContext(CprContext);

  const handleAdultSelect = () => {
    dispatch({ type: 'SET_PEDIATRIC_DATA', payload: { isPediatric: false, patientWeight: null } });
    dispatch({ type: 'SET_PHASE', payload: 'OB_COMPRESSIONS' });
  };

  return (
    <div className="absolute inset-0 w-full h-full bg-white flex flex-col items-center justify-center animate-in fade-in duration-300">
      <div className="absolute top-[45px] w-full flex justify-center">
        <span className="text-[16px] font-black text-slate-700 uppercase tracking-[0.25em] drop-shadow-sm">Patient wählen</span>
      </div>
      <div className="absolute top-[115px] w-full flex justify-center">
        <button onClick={handleAdultSelect} className="w-[85%] max-w-[260px] h-[60px] bg-white text-slate-700 rounded-full font-black uppercase tracking-[0.2em] text-[15px] shadow-[0_8px_25px_rgba(0,0,0,0.04)] border border-slate-200 active:scale-95 transition-all flex items-center justify-center gap-4 hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
          <i className="fa-solid fa-person text-3xl text-slate-400"></i> 
          <span>Erwachsener</span>
        </button>
      </div>
      <div className="absolute top-[205px] w-full flex justify-center">
        <button onClick={() => dispatch({ type: 'TOGGLE_PATIENT_MODAL', payload: true })} className="w-[85%] max-w-[260px] h-[60px] bg-indigo-50/80 text-indigo-700 rounded-full font-black uppercase tracking-[0.2em] text-[15px] shadow-[0_8px_25px_rgba(79,70,229,0.05)] border border-indigo-200 active:scale-95 transition-all flex items-center justify-center gap-4 hover:shadow-[0_10px_30px_rgba(79,70,229,0.09)]">
          <i className="fa-solid fa-child text-3xl text-indigo-400"></i> 
          <span>Kind</span>
        </button>
      </div>
    </div>
  );
}


Datei: src/components/views/ViewObInitialBreaths.jsx

import React, { useContext } from 'react';
import { CprContext } from '../../context/CprContext.jsx';

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
