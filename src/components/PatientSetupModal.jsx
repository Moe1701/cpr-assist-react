// --- Datei: src/components/PatientSetupModal.jsx ---
import React, { useContext, useState } from 'react';
import { CprContext } from '../context/CprContext.jsx';
import { usePatientLogic } from '../hooks/usePatientLogic.js';

export default function PatientSetupModal() {
  const { dispatch } = useContext(CprContext);
  
  // Wir holen uns die smarte Berechnungs-Logik aus unserem Hook
  const { setChild, calculateVitals, getBroselowZone } = usePatientLogic();

  const [vitals, setVitals] = useState({ age: '', kg: '', cm: '' });
  const [activeZone, setActiveZone] = useState(null);

  const handleInput = (source, value) => {
    if (value === '' || value <= 0) {
      setVitals({ age: '', kg: '', cm: '' });
      setActiveZone(null);
      return;
    }

    // Automatische Berechnung der fehlenden Werte
    const calc = calculateVitals(source, value);

    setVitals({
      age: calc.age === 0 ? '< 1' : calc.age,
      kg: calc.kg,
      cm: calc.cm
    });

    // Bestimmt die Broselow-Farbe anhand des Gewichts
    setActiveZone(getBroselowZone(calc.kg));
  };

  const handleConfirm = () => {
    // Schließt das Modal und startet den Pädiatrie-Einsatz mit dem Gewicht
    setChild(vitals.kg ? parseFloat(vitals.kg) : null);
  };

  const handleClose = () => {
    dispatch({ type: 'TOGGLE_PATIENT_MODAL', payload: false });
  };

  // Tailwind-Klassen für die Broselow-Farben
  const colorMap = {
    grau: 'bg-slate-400',
    rosa: 'bg-pink-400',
    rot: 'bg-red-500',
    lila: 'bg-purple-500',
    gelb: 'bg-yellow-400',
    weiss: 'bg-white border-[3px] border-slate-200',
    blau: 'bg-blue-500',
    orange: 'bg-orange-500',
    gruen: 'bg-green-500'
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col justify-end bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full rounded-t-3xl p-6 shadow-2xl animate-in slide-in-from-bottom-8 duration-300">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3 text-indigo-600">
            <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center">
               <i className="fa-solid fa-child text-xl"></i>
            </div>
            <h2 className="text-sm font-black tracking-widest uppercase">Kind Setup</h2>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 bg-slate-100 rounded-full text-slate-500 flex items-center justify-center active:scale-95 transition-transform"
          >
            <i className="fa-solid fa-xmark pointer-events-none"></i>
          </button>
        </div>

        {/* INFO TEXT */}
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 leading-relaxed text-center">
          Trage EINEN Wert ein.<br/>Der Rest wird berechnet.
        </p>

        {/* INPUT GRID */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div>
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block text-center">Alter (J)</label>
            <input
              type="number"
              value={vitals.age === '< 1' ? 0 : vitals.age}
              onChange={(e) => handleInput('age', e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-[14px] p-3 text-center font-black text-indigo-700 text-lg focus:border-indigo-400 focus:bg-indigo-50 outline-none transition-colors"
              placeholder="z.B. 4"
            />
          </div>
          <div>
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block text-center">Gewicht (kg)</label>
            <input
              type="number"
              value={vitals.kg}
              onChange={(e) => handleInput('kg', e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-[14px] p-3 text-center font-black text-indigo-700 text-lg focus:border-indigo-400 focus:bg-indigo-50 outline-none transition-colors"
              placeholder="z.B. 16"
            />
          </div>
          <div>
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block text-center">Größe (cm)</label>
            <input
              type="number"
              value={vitals.cm}
              onChange={(e) => handleInput('cm', e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-[14px] p-3 text-center font-black text-indigo-700 text-lg focus:border-indigo-400 focus:bg-indigo-50 outline-none transition-colors"
              placeholder="z.B. 100"
            />
          </div>
        </div>

        {/* BROSELOW ANZEIGE (Wird nur gezeigt, wenn Werte vorhanden sind) */}
        {activeZone && (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between mb-6 shadow-sm">
            <div className="flex items-center gap-3.5">
              <div className={`w-10 h-10 rounded-full shadow-sm ${colorMap[activeZone.color]}`}></div>
              <div className="flex flex-col">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Broselow Zone</span>
                <span className="text-[14px] font-black text-slate-700 uppercase tracking-wider">{activeZone.color}</span>
              </div>
            </div>
            <div className="text-right border-l border-slate-200 pl-4">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Tubus (Empf.)</span>
              <span className="text-[15px] font-black text-indigo-600">{activeZone.airway.tubus} mm</span>
            </div>
          </div>
        )}

        {/* BESTÄTIGEN BUTTON */}
        <button
          onClick={handleConfirm}
          className={`w-full py-4 rounded-full font-black uppercase tracking-widest text-[11px] shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 mb-2 ${
            vitals.kg ? 'bg-indigo-600 text-white shadow-indigo-600/30 hover:bg-indigo-500' : 'bg-slate-800 text-white shadow-slate-800/30 hover:bg-slate-700'
          }`}
        >
          <i className={`fa-solid ${vitals.kg ? 'fa-check' : 'fa-forward-step'} pointer-events-none text-lg`}></i>
          <span className="pointer-events-none">
            {vitals.kg ? 'Kind übernehmen' : 'Ohne Werte starten'}
          </span>
        </button>

      </div>
    </div>
  );
}