// --- Datei: src/components/views/ViewObPatient.jsx ---
import React, { useContext } from 'react';
import { CprContext } from '../../context/CprContext.jsx';
import { usePatientLogic } from '../../hooks/usePatientLogic.js';

export default function ViewObPatient() {
  const { dispatch } = useContext(CprContext); // WICHTIG: dispatch importiert!
  const { setAdult } = usePatientLogic();

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-4 animate-in fade-in zoom-in-95 duration-300">
      
      <div className="w-20 h-20 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mb-6">
        <i className="fa-solid fa-user-injured text-4xl"></i>
      </div>
      
      <h2 className="text-xl font-black text-slate-800 uppercase tracking-wider text-center leading-tight mb-8">
        Patienten<br/>Auswählen
      </h2>

      <div className="flex flex-col gap-4 w-full max-w-[250px]">
        {/* Erwachsener-Button: Ruft die Logik aus dem Hook auf */}
        <button 
          onClick={setAdult}
          className="w-full bg-slate-800 text-white py-5 rounded-3xl font-black uppercase tracking-widest text-sm shadow-[0_10px_20px_rgba(30,41,59,0.3)] active:scale-95 transition-all"
        >
          Erwachsener
        </button>
        
        {/* Kind-Button: Öffnet ab jetzt das Modal! */}
        <button 
          onClick={() => dispatch({ type: 'TOGGLE_PATIENT_MODAL', payload: true })}
          className="w-full bg-blue-500 text-white py-5 rounded-3xl font-black uppercase tracking-widest text-sm shadow-[0_10px_20px_rgba(59,130,246,0.3)] active:scale-95 transition-all"
        >
          Kind (Pädiatrie)
        </button>
      </div>

    </div>
  );
}