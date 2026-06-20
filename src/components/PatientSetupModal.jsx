// --- Datei: src/components/PatientSetupModal.jsx ---
import React, { useContext, useState } from 'react';
import { CprContext } from '../context/CprContext.jsx';
import { usePatientLogic } from '../hooks/usePatientLogic.js';
import { BROSELOW_DATA, calculatePediatricVitals, getBroselowZone } from '../config/broselowData.js';

// ==========================================
// HILFS-KOMPONENTEN
// ==========================================

const VitalSliderBlock = ({ label, valueText, min, max, value, step = 1, readOnly = false, onChange }) => (
  <div className="flex flex-col mb-3 px-3 py-2 bg-white rounded-[1.5rem] shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-slate-100">
    <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1 pb-1 border-b border-dashed border-slate-100 mb-2 pointer-events-none">
      {label}
    </div>
    <div className="flex items-center gap-3">
      <input 
        type="range" 
        min={min} 
        max={max} 
        step={step} 
        value={value} 
        readOnly={readOnly}
        onChange={(e) => !readOnly && onChange(e.target.value)} 
        className={`flex-1 h-2 bg-slate-200 rounded-full accent-[#E3000F] ${readOnly ? 'pointer-events-none opacity-60' : 'cursor-pointer'}`} 
      />
      <div className="bg-slate-50 text-slate-600 border border-slate-200 font-bold text-[9px] uppercase tracking-wider rounded-xl w-[110px] h-9 shadow-sm shrink-0 flex items-center justify-center pointer-events-none">
        {valueText}
      </div>
    </div>
  </div>
);

// ==========================================
// HAUPT-KOMPONENTE
// ==========================================

export default function PatientSetupModal() {
  const { dispatch } = useContext(CprContext);
  const { setChild } = usePatientLogic();
  
  // State für die synchronisierten Vitals (Startwert 4kg laut Vorgabe)
  const [vitals, setVitals] = useState({ age: 0, kg: 4, cm: 55 });

  const handleSync = (source, value) => {
    setVitals(prev => ({ ...prev, ...calculatePediatricVitals(source, parseFloat(value)) }));
  };

  const handleStart = (withWeight) => {
    setChild(withWeight ? vitals.kg : null);
  };

  const handleClose = () => {
    dispatch({ type: 'TOGGLE_PATIENT_MODAL', payload: false });
  };

  const activeZone = getBroselowZone(vitals.kg);

  // Farbschema exakt nach deinen Vorgaben
  const broselowStyles = {
    grau: { bg: '#9ca3af', text: '#ffffff' },
    rosa: { bg: '#f472b6', text: '#ffffff' },
    rot: { bg: '#ef4444', text: '#ffffff' },
    lila: { bg: '#a855f7', text: '#ffffff' },
    gelb: { bg: '#eab308', text: '#ffffff' },
    weiss: { bg: '#ffffff', text: '#334155', extraClass: 'border border-slate-200' },
    blau: { bg: '#3b82f6', text: '#ffffff' },
    orange: { bg: '#f97316', text: '#ffffff' },
    gruen: { bg: '#22c55e', text: '#ffffff' }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200 p-4">
      
      {/* Modal Container */}
      <div className="relative bg-white w-full max-w-[420px] max-h-[98vh] rounded-[2rem] border border-slate-100 shadow-2xl flex flex-col animate-in zoom-in-95 duration-300">
        
        {/* Schließen Button */}
        <button 
          onClick={handleClose} 
          className="absolute top-3 right-3 w-8 h-8 bg-slate-100 rounded-full text-slate-500 flex items-center justify-center active:scale-90 transition-transform z-10 cursor-pointer"
        >
          <i className="fa-solid fa-xmark pointer-events-none"></i>
        </button>

        <div className="overflow-y-auto flex-1 p-5 pb-6 custom-scrollbar">
          
          {/* Überschrift */}
          <h2 className="text-lg font-black text-slate-800 uppercase tracking-widest text-center mt-2 mb-6 pointer-events-none">
            Pädiatrie Setup
          </h2>

          {/* Sektion 1: Broselow-Farb-Schnellwahl */}
          <div className="mb-6">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-center block mb-3 pointer-events-none">
              Maßband-Farbe Schnellwahl
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              {BROSELOW_DATA.map((zone) => {
                const styleDef = broselowStyles[zone.color] || broselowStyles.weiss;
                const isActive = activeZone?.color === zone.color;
                
                return (
                  <button 
                    key={zone.color} 
                    onClick={() => handleSync('kg', zone.avgKg)}
                    style={{ backgroundColor: styleDef.bg, color: styleDef.text }}
                    className={`flex flex-col items-center justify-center py-2 rounded-xl shadow-sm transition-all duration-200 cursor-pointer
                      ${styleDef.extraClass || ''} 
                      ${isActive ? 'opacity-100 scale-105 border-[3px] border-slate-800' : 'opacity-40 scale-100 border-none'}`
                    }
                  >
                    <span className="text-[13px] font-black tracking-wider drop-shadow-md uppercase pointer-events-none">{zone.color}</span>
                    <span className="text-[9px] font-extrabold tracking-wide drop-shadow-md pointer-events-none">{zone.avgKg} kg • {zone.cm} cm</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sektion 2: Synchronisierte Slider */}
          <div className="mb-4">
            <VitalSliderBlock 
              label="Alter" 
              value={vitals.age} 
              min="0" max="12" 
              onChange={(val) => handleSync('age', val)}
              valueText={vitals.age === 0 ? 'Säugling' : `${vitals.age} J.`} 
            />
            <VitalSliderBlock 
              label="Gewicht" 
              value={vitals.kg} 
              min="3" max="36" 
              onChange={(val) => handleSync('kg', val)}
              valueText={`${vitals.kg} kg`} 
            />
            <VitalSliderBlock 
              label="Größe (Berechnet)" 
              value={vitals.cm} 
              min="50" max="140" 
              readOnly 
              valueText={`${vitals.cm} cm`} 
            />
          </div>

          {/* Sektion 3: Zusammenfassungs-Badge */}
          <div className="h-8 flex justify-center mb-4 pointer-events-none">
            {activeZone && (
              <div id="summary-badge" className="bg-slate-100 text-slate-600 border border-slate-200 text-[10px] font-black uppercase tracking-widest px-5 py-2 rounded-full shadow-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: broselowStyles[activeZone.color]?.bg }}></span>
                {activeZone.color} • {activeZone.avgKg} kg • {vitals.age === 0 ? 'Säugling' : `${vitals.age} J.`}
              </div>
            )}
          </div>

          {/* Sektion 4: Aktions-Buttons */}
          <div className="flex gap-3">
            <button 
              onClick={() => handleStart(false)} 
              className="flex-1 bg-slate-50 border border-slate-200 text-slate-500 rounded-2xl py-3 font-bold uppercase text-[9px] tracking-widest flex flex-col items-center justify-center active:scale-95 transition-transform hover:bg-slate-100 cursor-pointer"
            >
              <i className="fa-solid fa-scale-unbalanced text-slate-400 text-sm mb-1 pointer-events-none"></i>
              <span className="pointer-events-none">Gewicht später</span>
            </button>
            <button 
              onClick={() => handleStart(true)} 
              className="flex-[1.5] bg-[#E3000F] text-white rounded-2xl py-3 font-black uppercase text-[11px] tracking-widest shadow-[0_8px_20px_rgba(227,0,15,0.25)] active:scale-95 transition-transform flex items-center justify-center gap-2 hover:bg-red-700 cursor-pointer"
            >
              <span className="pointer-events-none">Starten</span>
              <i className="fa-solid fa-play text-[10px] pointer-events-none"></i>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}