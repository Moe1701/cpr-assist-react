import React, { useContext } from 'react';
import { CprContext } from '../../context/CprContext.jsx';

const PatientSelection = () => {
  const { dispatch } = useContext(CprContext);

  const handleAdult = () => {
    dispatch({ type: 'SET_PHASE', payload: 'COMPRESSION_CHECK' });
  };

  const handleChild = () => {
    dispatch({ type: 'SET_PHASE', payload: 'PEDIATRIC_SETUP' });
  };

  const handleChildUnknown = () => {
    dispatch({ type: 'SET_PHASE', payload: 'INITIAL_BREATHS' });
  };

  return (
    <div className="flex flex-col items-center justify-center w-full gap-3">
      <div className="text-slate-400 font-black uppercase tracking-widest text-[10px] mb-2">
        Patient wählen
      </div>

      <button
        onClick={handleAdult}
        className="w-full h-14 bg-slate-50 border border-slate-200 text-slate-700 rounded-full font-black text-xs uppercase tracking-widest shadow-sm active:scale-95 transition-all flex items-center justify-center gap-2"
      >
        <i className="fa-solid fa-person text-lg"></i> Erwachsener
      </button>

      <button
        onClick={handleChild}
        className="w-full h-14 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-full font-black text-xs uppercase tracking-widest shadow-sm active:scale-95 transition-all flex items-center justify-center gap-2"
      >
        <i className="fa-solid fa-child text-lg"></i> Kind (Gewicht)
      </button>

      <button
        onClick={handleChildUnknown}
        className="w-full h-14 bg-purple-50 border border-purple-200 text-purple-700 rounded-full font-black text-xs uppercase tracking-widest shadow-sm active:scale-95 transition-all flex items-center justify-center gap-2"
      >
        <i className="fa-solid fa-question text-lg"></i> Kind (Unbek.)
      </button>
    </div>
  );
};

export default PatientSelection;