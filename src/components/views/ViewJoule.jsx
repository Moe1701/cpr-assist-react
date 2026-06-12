// --- Datei: src/components/views/ViewJoule.jsx ---
import React, { useContext, useMemo } from 'react';
import { CprContext } from '../../context/CprContext.jsx';
import { CPR_CONFIG } from '../../config/cprConfig.js';

export default function ViewJoule() {
  const { state, dispatch, logEvent } = useContext(CprContext);

  // Dynamische Joule-Berechnung (4 J/kg und 8 J/kg bei Kindern)
  const jouleOptions = useMemo(() => {
    if (state.isPediatric) {
      // Fallback auf 10kg, falls kein Gewicht gewählt wurde, aber isPediatric true ist
      const kg = state.patientWeight || 10; 
      return [
        { label: 'Standard (4 J/kg)', value: Math.round(kg * 4) },
        { label: 'Eskalation (8 J/kg)', value: Math.round(kg * 8) }
      ];
    }
    // Standard-Werte für Erwachsene
    return [
      { label: 'Standard', value: 150 },
      { label: 'Eskalation', value: 200 },
      { label: 'Max', value: 360 }
    ];
  }, [state.isPediatric, state.patientWeight]);

  const handleShock = (value) => {
    logEvent(CPR_CONFIG.EVENTS.SHOCK, `Schock abgegeben: ${value}J`);
    // Nach der Schockabgabe geht es zum "CPR Fortsetzen" Screen
    dispatch({ type: 'SET_PHASE', payload: CPR_CONFIG.PHASES.WAITING_CPR_RESUME });
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-4 animate-in fade-in duration-300">
      <div className="w-12 h-12 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center mb-2">
        <i className="fa-solid fa-bolt text-2xl"></i>
      </div>
      <h2 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-6">Energie wählen</h2>
      
      <div className="grid grid-cols-1 gap-3 w-full max-w-[250px]">
        {jouleOptions.map((opt) => (
          <button 
            key={opt.value}
            onClick={() => handleShock(opt.value)}
            className="bg-white border-2 border-amber-400 text-amber-600 py-4 rounded-2xl font-black text-xl shadow-lg active:scale-95 transition-all flex flex-col items-center justify-center"
          >
            {opt.value} J
            <span className="text-[10px] font-bold uppercase opacity-70 mt-1">{opt.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}