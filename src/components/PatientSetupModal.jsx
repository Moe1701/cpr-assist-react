import React, { useContext } from 'react';
import { CprContext } from '../context/CprContext.jsx';

export default function PatientSetupModal() {
  const { state, dispatch } = useContext(CprContext);

  // Modal komplett ausblenden, wenn der State false ist
  if (!state.isPatientModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
      
      <div className="bg-white w-full max-w-sm rounded-[32px] p-6 shadow-2xl relative animate-in zoom-in-95 duration-300">
        
        <button 
          onClick={() => dispatch({ type: 'TOGGLE_PATIENT_MODAL', payload: false })}
          className="absolute top-5 right-5 w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 active:scale-95 transition-all"
        >
          <i className="fa-solid fa-xmark text-xl"></i>
        </button>

        <h2 className="text-xl font-black text-slate-700 text-center uppercase tracking-widest mb-6 mt-2">
          Kind / Baby
        </h2>

        <div className="h-40 border-2 border-dashed border-slate-100 rounded-2xl flex items-center justify-center">
           <p className="text-slate-400 font-bold text-sm uppercase tracking-wider">
             Setup in Arbeit...
           </p>
        </div>

      </div>
      
    </div>
  );
}