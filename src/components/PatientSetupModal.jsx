import React, { useContext } from 'react';
import { CprContext } from '../../context/CprContext.jsx';
import { usePatientLogic } from '../../hooks/usePatientLogic.js';

// NEU: Wir importieren die Farben jetzt direkt aus unserer neuen Daten-Datei!
import { BROSELOW_DATA } from '../../config/broselowData.js'; 

export default function PatientModal() {
  const { dispatch } = useContext(CprContext);
  const { setChild } = usePatientLogic();

  const handleClose = () => {
    dispatch({ type: 'TOGGLE_PATIENT_MODAL', payload: false });
  };

  const handleSelectWeight = (weight) => {
    setChild(weight);
  };

  return (
    <div className="absolute inset-0 z-50 flex items-end justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      
      {/* Modal Container gleitet von unten rein */}
      <div className="bg-white w-full max-w-[400px] h-[85%] rounded-t-[2rem] shadow-2xl flex flex-col animate-in slide-in-from-bottom-full duration-300">
        
        {/* Header & Schließen Button */}
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          <h2 className="text-xl font-black text-slate-800 uppercase tracking-widest">
            Pädiatrie
          </h2>
          <button 
            onClick={handleClose}
            className="w-10 h-10 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center active:scale-90 transition-all hover:bg-slate-200"
          >
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>

        {/* Scrollbarer Content: Broselow Liste */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          
          <button 
            onClick={() => handleSelectWeight(null)}
            className="w-full bg-slate-800 text-white py-4 rounded-2xl font-bold uppercase tracking-widest text-sm shadow-md active:scale-95 transition-all mb-2"
          >
            Gewicht später ermitteln
          </button>

          {/* HIER WAR DER FEHLER: Wir nutzen jetzt BROSELOW_DATA statt state.broselowData */}
          {BROSELOW_DATA.map((zone) => {
            // Farben-Mapping für Tailwind
            const colorClasses = {
              grau: 'bg-slate-500 text-white',
              rosa: 'bg-pink-400 text-white',
              rot: 'bg-red-500 text-white',
              lila: 'bg-purple-500 text-white',
              gelb: 'bg-yellow-400 text-yellow-900',
              weiss: 'bg-slate-100 text-slate-800 border-2 border-slate-200',
              blau: 'bg-blue-500 text-white',
              orange: 'bg-orange-500 text-white',
              gruen: 'bg-green-500 text-white'
            };

            return (
              <button 
                key={zone.color}
                onClick={() => handleSelectWeight(zone.avgKg)}
                className={`w-full flex items-center justify-between p-4 rounded-2xl shadow-sm active:scale-95 transition-all ${colorClasses[zone.color]}`}
              >
                <div className="flex flex-col items-start">
                  <span className="font-black text-lg uppercase tracking-wider">{zone.color}</span>
                  <span className="text-xs opacity-80 font-bold">{zone.ageStr}</span>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black">{zone.avgKg} <span className="text-sm">kg</span></span>
                  <div className="text-xs opacity-80 font-bold">{zone.cm} cm</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}