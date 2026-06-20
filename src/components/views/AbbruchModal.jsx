// --- Datei: src/components/views/AbbruchModal.jsx ---
import React, { useContext } from 'react';
import { CprContext } from '../../context/CprContext.jsx';
import { CPR_CONFIG, CHECKLISTS } from '../../config/cprConfig.js';

export default function AbbruchModal() {
  const { state, dispatch, logEvent } = useContext(CprContext);

  if (!state.isAbbruchModalOpen) return null;

  const handleReasonSelect = (reason) => {
    logEvent("EINSATZ BEENDET", `Abbruchgrund: ${reason}`);
    dispatch({ type: 'SET_ABBRUCH_REASON', payload: reason });
    dispatch({ type: 'TOGGLE_ABBRUCH_MODAL', payload: false });
    dispatch({ type: 'SET_PHASE', payload: CPR_CONFIG.PHASES.DEBRIEFING });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200 px-4">
      <div className="bg-white w-full max-w-[340px] rounded-3xl p-6 shadow-2xl flex flex-col animate-in zoom-in-95 duration-200">
        <div className="text-center mb-5">
            <h2 className="text-lg font-black text-slate-800 tracking-wider">EINSATZ ABBRECHEN</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Grund für Beendigung wählen</p>
        </div>
        <div className="flex flex-col gap-2 mb-6">
            {CHECKLISTS.ABBRUCH_REASONS.map(r => (
                <button key={r.id} onClick={() => handleReasonSelect(r.label)} className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl flex items-center gap-3 active:scale-95 transition-transform hover:bg-slate-100 cursor-pointer">
                    <div className={`w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0 ${r.color}`}><i className={`fa-solid ${r.icon}`}></i></div>
                    <span className="text-[11px] font-black text-slate-700 tracking-wide text-left">{r.label}</span>
                </button>
            ))}
        </div>
        <button onClick={() => dispatch({ type: 'TOGGLE_ABBRUCH_MODAL', payload: false })} className="w-full bg-white border-2 border-slate-200 text-slate-500 py-3 rounded-xl font-black uppercase tracking-widest text-[11px] active:scale-95 transition-transform cursor-pointer hover:bg-slate-50">Zurück</button>
      </div>
    </div>
  );
}