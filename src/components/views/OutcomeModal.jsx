// --- Datei: src/components/views/OutcomeModal.jsx ---
import React, { useContext } from 'react';
import { CprContext } from '../../context/CprContext.jsx';
import { CPR_CONFIG, CHECKLISTS } from '../../config/cprConfig.js';

export default function OutcomeModal() {
  const { state, dispatch, logEvent } = useContext(CprContext);

  if (!state.isOutcomeModalOpen) return null;

  const handleSelect = (outcome) => {
    dispatch({ type: 'TOGGLE_OUTCOME_MODAL', payload: false });

    if (outcome.id === 'rosc') {
      dispatch({ type: 'SET_ABBRUCH_REASON', payload: null });
      dispatch({ type: 'RESET_ROSC_TIMER' });
      dispatch({ type: 'SET_PHASE', payload: CPR_CONFIG.PHASES.ROSC });
      logEvent('ROSC', 'ROSC eingetreten');
    } else {
      dispatch({ type: 'SET_ABBRUCH_REASON', payload: outcome.label });
      dispatch({ type: 'SET_PHASE', payload: CPR_CONFIG.PHASES.TERMINATION });
      logEvent('EINSATZ BEENDET', `Abbruchgrund: ${outcome.label}`);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200 px-4">
      <div className="bg-white w-full max-w-[340px] rounded-3xl p-6 shadow-2xl flex flex-col animate-in zoom-in-95 duration-200">
        
        <div className="text-center mb-5">
            <h2 className="text-lg font-black text-slate-800 tracking-wider">ROSC ODER ABBRUCH</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Wie wurde der Einsatz beendet?</p>
        </div>

        <div className="flex flex-col gap-2 mb-6">
            {CHECKLISTS.OUTCOMES.map((o, idx) => (
                <button 
                    key={o.id} 
                    onClick={() => handleSelect(o)}
                    className={`w-full bg-slate-50 border p-3 rounded-xl flex items-center gap-3 active:scale-95 transition-transform hover:bg-slate-100 cursor-pointer ${idx === 0 ? 'border-emerald-200 mb-2 shadow-sm' : 'border-slate-200'}`}
                >
                    <div className={`w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0 ${o.color}`}>
                        <i className={`fa-solid ${o.icon}`}></i>
                    </div>
                    <span className="text-[11px] font-black text-slate-700 tracking-wide text-left">{o.label}</span>
                </button>
            ))}
        </div>

        <button 
            onClick={() => dispatch({ type: 'TOGGLE_OUTCOME_MODAL', payload: false })}
            className="w-full bg-white border-2 border-slate-200 text-slate-500 py-3 rounded-xl font-black uppercase tracking-widest text-[11px] active:scale-95 transition-transform cursor-pointer hover:bg-slate-50"
        >
            Zurück zur CPR
        </button>

      </div>
    </div>
  );
}
