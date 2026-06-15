// --- Datei: src/components/SettingsModal.jsx ---
import React, { useContext } from 'react';
import { CprContext } from '../context/CprContext.jsx';

export default function SettingsModal({ isOpen, onClose }) {
  const { state, dispatch } = useContext(CprContext);

  if (!isOpen) return null;

  // DER NEUE HARD RESET HANDLER
  const handleHardReset = () => {
    if (window.confirm("WARNUNG: Möchtest du wirklich alle Einsatzdaten löschen und die App zurücksetzen?")) {
      localStorage.removeItem('cprAssist_db'); // Speicher putzen
      window.location.reload(); // App komplett frisch neu laden
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col justify-end bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      
      <div className="bg-white w-full rounded-t-3xl p-6 shadow-2xl animate-in slide-in-from-bottom-8 duration-300">
        
        <div className="flex items-center justify-center gap-2 mb-8">
          <i className="fa-solid fa-sliders text-slate-400"></i>
          <h2 className="text-sm font-black text-slate-800 tracking-widest uppercase">
            Einstellungen
          </h2>
        </div>

        <div className="mb-8">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center mb-3">
            Metronom Geschwindigkeit
          </p>
          <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
            <button 
              onClick={() => dispatch({ type: 'SET_BPM', payload: 100 })}
              className={`flex-1 py-3 font-bold text-lg rounded-xl transition-all ${state.bpm === 100 ? 'bg-white text-slate-800 font-black shadow-sm border border-slate-200' : 'text-slate-400 hover:bg-slate-100'}`}
            >100</button>
            <button 
              onClick={() => dispatch({ type: 'SET_BPM', payload: 110 })}
              className={`flex-1 py-3 font-bold text-lg rounded-xl transition-all ${state.bpm === 110 ? 'bg-white text-slate-800 font-black shadow-sm border border-slate-200' : 'text-slate-400 hover:bg-slate-100'}`}
            >110</button>
            <button 
              onClick={() => dispatch({ type: 'SET_BPM', payload: 120 })}
              className={`flex-1 py-3 font-bold text-lg rounded-xl transition-all ${state.bpm === 120 ? 'bg-white text-slate-800 font-black shadow-sm border border-slate-200' : 'text-slate-400 hover:bg-slate-100'}`}
            >120</button>
          </div>
        </div>

        <div className="mb-8">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center mb-3">
            System Diagnose
          </p>
          <div className="flex flex-col gap-3 p-4 bg-slate-50/50 border border-slate-100 rounded-2xl">
            
            <button className="w-full bg-white border border-slate-200 py-3.5 rounded-xl font-bold text-slate-700 shadow-sm flex items-center justify-center gap-2 hover:bg-slate-50 transition-all">
              <i className="fa-solid fa-bug text-slate-400"></i> Fehlerprotokoll einsehen
            </button>
            
            <button 
              onClick={() => dispatch({ type: 'TOGGLE_GRID' })}
              className={`w-full border py-3.5 rounded-xl font-bold shadow-sm flex items-center justify-center gap-2 transition-all uppercase text-[12px] tracking-wider mt-2 ${state.isGridVisible ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'}`}
            >
              <i className="fa-solid fa-border-all text-slate-400"></i> Layout Grid ({state.isGridVisible ? 'An' : 'Aus'})
            </button>

            {/* DER SCHARFE HARD RESET BUTTON */}
            <button 
              onClick={handleHardReset}
              className="w-full bg-red-600 border border-red-700 py-3.5 rounded-xl font-bold text-white shadow-md shadow-red-600/20 flex items-center justify-center gap-2 active:scale-95 transition-all mt-6 cursor-pointer"
            >
              <i className="fa-solid fa-triangle-exclamation pointer-events-none"></i> 
              <span className="pointer-events-none">Hard Reset (Daten löschen)</span>
            </button>
          </div>
        </div>

        <div className="text-center mb-6">
          <p className="font-bold text-slate-800 tracking-widest text-xs">
            CPR ASSIST <span className="text-red-600">VFINAL</span>
          </p>
        </div>

        <button 
          onClick={onClose}
          className="w-full bg-slate-100 border border-slate-200 py-4 rounded-2xl font-bold text-slate-600 uppercase tracking-wider shadow-sm flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
        >
          <i className="fa-solid fa-rotate-left pointer-events-none"></i> 
          <span className="pointer-events-none">Zurück zum Einsatz</span>
        </button>

      </div>
    </div>
  );
}