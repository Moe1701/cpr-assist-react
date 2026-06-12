import React, { useContext } from 'react';
import { CprContext } from '../../context/CprContext.jsx';
import { usePatientLogic } from '../../hooks/usePatientLogic.js';

export default function ViewObPatient() {
  const { dispatch } = useContext(CprContext);
  const { setAdult } = usePatientLogic();

  const handleChildClick = () => {
    dispatch({ type: 'TOGGLE_PATIENT_MODAL', payload: true });
  };

  return (
    <div className="absolute inset-0 w-full h-full z-20 bg-white animate-in fade-in duration-300 rounded-full">
      
      {/* Titel */}
      <div className="absolute top-[35px] w-full flex justify-center">
        <span className="text-[16px] font-black text-slate-700 uppercase tracking-[0.25em] drop-shadow-sm pointer-events-none">
          Patient wählen
        </span>
      </div>

      {/* Button 1: Erwachsener */}
      <div className="absolute top-[105px] w-full flex justify-center">
        <button 
          onClick={setAdult}
          className="w-[85%] max-w-[300px] h-[60px] rounded-full bg-white border border-slate-200 text-slate-700 shadow-[0_8px_25px_rgba(0,0,0,0.04)] font-black uppercase tracking-[0.2em] text-[15px] active:scale-95 transition-all duration-300 flex items-center justify-center gap-3"
        >
          <i className="fa-solid fa-person text-3xl text-slate-400"></i>
          <span>Erwachsener</span>
        </button>
      </div>

      {/* Button 2: Kind */}
      <div className="absolute top-[195px] w-full flex justify-center">
        <button 
          onClick={handleChildClick}
          className="w-[85%] max-w-[300px] h-[60px] rounded-full bg-indigo-50/80 border border-indigo-200 text-indigo-700 shadow-[0_8px_25px_rgba(79,70,229,0.05)] font-black uppercase tracking-[0.2em] text-[15px] active:scale-95 transition-all duration-300 flex items-center justify-center gap-3"
        >
          <i className="fa-solid fa-child text-3xl text-indigo-400"></i>
          <span>Kind</span>
        </button>
      </div>

    </div>
  );
}