// --- Datei: src/components/PatientSetupModal.jsx ---
import React, { useContext, useState, useEffect } from 'react';
import { CprContext } from '../context/CprContext.jsx';
import { usePatientLogic } from '../hooks/usePatientLogic.js';

export default function PatientSetupModal() {
  const { state, dispatch } = useContext(CprContext);
  
  // WIR SAUGEN UNS DIE LOGIK AUS DEM HOOK!
  const { setChild, calculateVitals, getBroselowZone } = usePatientLogic();
  
  // Der State für die Schieberegler
  const [vitals, setVitals] = useState({ age: 0, kg: 4, cm: 55 });

  if (!state.isPatientModalOpen) return null;

  const activeZone = getBroselowZone(vitals.kg);

  const colorStyles = {
    grau:   'bg-slate-400 text-white border-slate-500',
    rosa:   'bg-pink-400 text-white border-pink-500',
    rot:    'bg-red-500 text-white border-red-600',
    lila:   'bg-purple-500 text-white border-purple-600',
    gelb:   'bg-yellow-400 text-white border-yellow-500',
    weiss:  'bg-white text-slate-700 border-slate-200',
    blau:   'bg-blue-400 text-white border-blue-500',
    orange: 'bg-orange-400 text-white border-orange-500',
    gruen:  'bg-emerald-500 text-white border-emerald-600'
  };

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-sm rounded-[32px] p-6 shadow-2xl relative animate-in zoom-in-95 duration-300 flex flex-col">
        
        <button 
          onClick={() => dispatch({ type: 'TOGGLE_PATIENT_MODAL', payload: false })}
          className="absolute top-4 right-4 w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-200 active:scale-95 transition-all"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>

        <div className="text-center mb-6 mt-2">
          <h2 className="text-lg font-black text-slate-800 uppercase tracking-widest">Pädiatrie Setup</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Alter | Gewicht | Größe</p>
        </div>

        {/* BROSELOW FARB-BUTTONS */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          {state.broselowData.map((zone) => {
            const isActive = activeZone && activeZone.color === zone.color;
            return (
              <button 
                key={zone.color}
                onClick={() => setVitals(calculateVitals('kg', zone.avgKg))}
                className={`py-2 rounded-xl text-xs font-black uppercase shadow-sm border-b-[3px] transition-all flex flex-col items-center justify-center ${colorStyles[zone.color]} ${isActive ? 'ring-2 ring-offset-2 ring-slate-800 scale-105 opacity-100' : 'opacity-40 hover:opacity-70'}`}
              >
                <span>{zone.color}</span>
              </button>
            );
          })}
        </div>

        {/* DIE SCHIEBEREGLER */}
        <div className="space-y-5 mb-6 px-1">
          <div className="flex items-center gap-4">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest w-16">Alter</span>
            <input 
              type="range" min="0" max="12" step="1" 
              value={vitals.age} 
              onChange={(e) => setVitals(calculateVitals('age', e.target.value))}
              className="flex-1 accent-[#E3000F] h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer" 
            />
            <span className="text-sm font-black text-slate-700 w-16 text-right">
              {vitals.age < 1 ? 'Säugling' : `${vitals.age} J.`}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest w-16">Gewicht</span>
            <input 
              type="range" min="3" max="36" step="0.5" 
              value={vitals.kg} 
              onChange={(e) => setVitals(calculateVitals('kg', e.target.value))}
              className="flex-1 accent-[#E3000F] h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer" 
            />
            <span className="text-lg font-black text-[#E3000F] w-16 text-right">
              {vitals.kg} <span className="text-xs">kg</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest w-16">Größe</span>
            <input 
              type="range" min="55" max="135" step="1" 
              value={vitals.cm} 
              onChange={(e) => setVitals(calculateVitals('cm', e.target.value))}
              className="flex-1 accent-[#E3000F] h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer" 
            />
            <span className="text-sm font-black text-slate-700 w-16 text-right">
              {vitals.cm} <span className="text-xs">cm</span>
            </span>
          </div>
        </div>

        <div className="text-center mb-6 bg-slate-50 py-2 rounded-xl border border-slate-100">
          <span className="text-[11px] font-bold text-slate-600 uppercase tracking-widest">
            <span className="font-black text-slate-800">{activeZone?.color || '---'}</span> | ~{activeZone?.avgKg || 0}kg | {activeZone?.ageStr || ''}
          </span>
        </div>

        <div className="flex items-center gap-3 mt-auto">
          <button onClick={() => setChild(null)} className="flex flex-col items-center justify-center w-[100px] h-[55px] text-slate-400 active:scale-95 transition-all hover:bg-slate-50 rounded-xl border border-slate-200">
            <i className="fa-solid fa-weight-scale text-lg mb-1"></i>
            <span className="text-[9px] font-bold uppercase tracking-widest text-center leading-tight">Gewicht<br/>Später</span>
          </button>
          
          <button onClick={() => setChild(vitals.kg)} className="flex-1 h-[55px] bg-[#E3000F] text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[15px] shadow-[0_8px_25px_rgba(227,0,15,0.25)] active:scale-95 transition-all flex items-center justify-center gap-2 hover:bg-red-700">
            <span>Starten</span>
            <i className="fa-solid fa-play text-sm"></i>
          </button>
        </div>
      </div>
    </div>
  );
}