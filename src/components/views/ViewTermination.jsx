// --- Datei: src/components/views/ViewTermination.jsx ---
import React, { useContext } from 'react';
import { CprContext } from '../../context/CprContext.jsx';
import { CPR_CONFIG } from '../../config/cprConfig.js';

export default function ViewTermination() {
  const { state, dispatch, logEvent } = useContext(CprContext);

  if (state.appPhase !== CPR_CONFIG.PHASES.TERMINATION) return null;

  const handleRevoke = () => {
    logEvent("SYSTEM", "Abbruch widerrufen! CPR fortgesetzt.");
    dispatch({ type: 'SET_ABBRUCH_REASON', payload: null });
    dispatch({ type: 'RESET_CYCLE' }); // <--- KRITISCHER FIX: 120s Loop beginnt von vorn!
    dispatch({ type: 'SET_PHASE', payload: CPR_CONFIG.PHASES.RUNNING });
  };

  const handleFinalize = () => {
    dispatch({ type: 'SET_PHASE', payload: CPR_CONFIG.PHASES.DEBRIEFING });
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds === null) return "00:00";
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="absolute inset-0 z-[60] bg-red-50 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-300">
      <div className="flex items-stretch justify-center gap-2 px-3 py-4 shrink-0 bg-white border-b border-red-100 shadow-sm z-40 relative">
        <div className="flex flex-col items-center justify-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-tight">Reanimationsdauer gesamt</span>
          <div className="text-[32px] font-black text-slate-800 leading-none font-mono tracking-tighter mt-1">{formatTime(state.missionSeconds)}</div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar px-4 pt-6 pb-28 flex flex-col items-center">
        <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mb-4 shadow-inner">
            <i className="fa-solid fa-bed-pulse text-4xl text-red-500"></i>
        </div>

        <h2 className="text-xl font-black text-slate-800 tracking-tighter mb-1 uppercase">Einsatz Beendet</h2>
        <p className="text-[12px] font-bold text-red-500 uppercase tracking-widest text-center mb-8 bg-red-100 px-4 py-1.5 rounded-full">
            {state.abbruchReason}
        </p>

        <div className="w-full max-w-sm bg-white p-5 rounded-2xl shadow-sm border border-red-100 mb-6">
            <p className="text-[11px] font-bold text-slate-500 text-center mb-4 leading-relaxed">
                Die Reanimation wurde beendet. Du kannst jetzt in Ruhe die <b>Dokumentation vervollständigen</b>, bevor du das finale PDF-Protokoll generierst.
            </p>

            <div className="flex gap-2 w-full">
                <button onClick={() => dispatch({ type: 'TOGGLE_HITS_MODAL', payload: true })} className="flex-1 bg-slate-50 border border-slate-200 text-slate-700 py-3 rounded-xl shadow-sm font-bold uppercase text-[10px] tracking-widest active:scale-95 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100">
                    <i className="fa-solid fa-clipboard-list mb-1.5 text-slate-400 text-lg"></i> HITS / SAMPLER
                </button>
                <button onClick={() => dispatch({ type: 'TOGGLE_LOG_MODAL', payload: true })} className="flex-1 bg-slate-50 border border-slate-200 text-slate-700 py-3 rounded-xl shadow-sm font-bold uppercase text-[10px] tracking-widest active:scale-95 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100">
                    <i className="fa-solid fa-clock-rotate-left mb-1.5 text-slate-400 text-lg"></i> LOGBUCH
                </button>
            </div>
        </div>

        <div className="w-full max-w-sm flex flex-col gap-3">
            <button onClick={handleFinalize} className="w-full bg-[#E3000F] text-white py-4 rounded-xl shadow-md font-black uppercase text-xs tracking-widest active:scale-95 flex items-center justify-center cursor-pointer hover:bg-red-700">
                <i className="fa-solid fa-flag-checkered mr-2"></i> PROTOKOLL ABSCHLIESSEN
            </button>
            <button onClick={handleRevoke} className="w-full bg-transparent text-slate-400 py-3 rounded-xl font-bold uppercase text-[10px] tracking-widest active:scale-95 flex items-center justify-center cursor-pointer hover:text-slate-600">
                <i className="fa-solid fa-rotate-left mr-2"></i> Abbruch widerrufen
            </button>
        </div>
      </div>
    </div>
  );
}