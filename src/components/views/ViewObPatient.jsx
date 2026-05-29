import React, { useContext } from 'react';
// Korrekter Pfad: Zwei Ebenen zurück (aus /views in /components in /src), dann in context
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
