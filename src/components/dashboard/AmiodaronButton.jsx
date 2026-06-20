// --- Datei: src/components/dashboard/AmiodaronButton.jsx ---
import React, { useContext } from 'react';
import { CprContext } from '../../context/CprContext.jsx';
import { CPR_CONFIG } from '../../config/cprConfig.js';

export default function AmiodaronButton() {
  const { state, dispatch, logEvent } = useContext(CprContext);

  const handleUndo = (e) => {
    e.stopPropagation();
    dispatch({ type: 'UNDO_AMIODARON' });
  };

  // ==========================================
  // PHASE 2: Der "Weitere Meds" Koffer (ab 2 Klicks)
  // ==========================================
  if (state.amioCount >= 2) {
    return (
      <div className="relative pointer-events-auto w-[86px] h-[86px]">
        <button 
          onClick={() => dispatch({ type: 'SET_PHASE', payload: CPR_CONFIG.PHASES.MEDS_MENU })} 
          className="w-full h-full rounded-full shadow-sm border-[3px] flex flex-col items-center justify-center gap-1 hover:bg-slate-50 active:scale-95 transition-all cursor-pointer bg-white text-indigo-600 border-indigo-400"
        >
          <i className="fa-solid fa-suitcase-medical text-[24px] mb-0.5 pointer-events-none"></i>
          <span className="text-[9px] font-black uppercase tracking-wider leading-none text-center px-1 pointer-events-none">
            Weitere Meds
          </span>
        </button>

        {/* Undo-Button (Rückgängig) */}
        <button 
          onClick={handleUndo} 
          className="absolute -top-1 -left-1 bg-slate-100 text-slate-500 w-7 h-7 flex items-center justify-center rounded-full shadow-sm border-2 border-white z-40 active:scale-90 hover:bg-slate-200 cursor-pointer"
        >
          <i className="fa-solid fa-rotate-left text-[10px] pointer-events-none"></i>
        </button>
      </div>
    );
  }

  // ==========================================
  // PHASE 1: Der normale Amiodaron Button
  // ==========================================
  
  // Dosis-Berechnung (Kind: 5mg/kg starr | Erwachsener: 300mg -> 150mg)
  const dose = state.isPediatric && state.patientWeight
    ? `${Math.round(state.patientWeight * 5)} mg`
    : (state.amioCount === 0 ? '300 mg' : '150 mg');

  const handleClick = () => {
    logEvent(CPR_CONFIG.EVENTS.DRUG, `Amiodaron ${dose} gegeben`);
    dispatch({ type: 'GIVE_AMIODARON' });
  };

  return (
    <div className="relative pointer-events-auto w-[86px] h-[86px]">
      <button
        onClick={handleClick}
        className="w-full h-full rounded-full shadow-sm border-[3px] flex flex-col items-center justify-center gap-1 active:scale-95 transition-all cursor-pointer bg-white border-purple-400 hover:bg-slate-50"
      >
        <i className="fa-solid fa-syringe text-[24px] mb-0.5 text-purple-600 pointer-events-none"></i>
        <span className="text-[9px] font-black uppercase tracking-wider leading-none text-center px-1 text-purple-600 pointer-events-none">
          Amio. {dose}
        </span>
      </button>

      {/* Undo-Button (Rückgängig) - Erscheint nach dem 1. Klick */}
      {state.amioCount > 0 && (
        <button 
          onClick={handleUndo} 
          className="absolute -top-1 -left-1 bg-slate-100 text-slate-500 w-7 h-7 flex items-center justify-center rounded-full shadow-sm border-2 border-white z-40 active:scale-90 hover:bg-slate-200 cursor-pointer"
        >
          <i className="fa-solid fa-rotate-left text-[10px] pointer-events-none"></i>
        </button>
      )}

      {/* Rotes Zähler-Badge */}
      {state.amioCount > 0 && (
        <div className="absolute -top-2 -right-2 bg-[#E3000F] text-white text-[12px] font-black px-2 min-w-[26px] h-7 flex items-center justify-center rounded-full shadow-md border-2 border-white z-40 pointer-events-none">
          {state.amioCount}
        </div>
      )}
    </div>
  );
}