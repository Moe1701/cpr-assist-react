// --- Datei: src/components/views/ViewDebriefing.jsx ---
import React, { useContext, useState } from 'react';
import { CprContext } from '../../context/CprContext.jsx';
import { CPR_CONFIG } from '../../config/cprConfig.js';
import ExportModal from './ExportModal.jsx';

export default function ViewDebriefing() {
  const { state, dispatch, logEvent } = useContext(CprContext);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  if (state.appPhase !== CPR_CONFIG.PHASES.DEBRIEFING) return null;

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleUndo = () => {
    logEvent("SYSTEM", "Einsatzende widerrufen. Rückkehr zum Dashboard.");
    dispatch({ type: 'SET_PHASE', payload: CPR_CONFIG.PHASES.RUNNING });
  };

  const handleReset = () => {
    if(window.confirm("Achtung: Alle Daten dieses Einsatzes werden unwiderruflich gelöscht. Fortfahren?")) {
        dispatch({ type: 'RESET_ALL' });
    }
  };

  return (
    <div className="absolute inset-0 z-[70] bg-slate-800 flex flex-col justify-center items-center p-5 animate-in fade-in duration-500">
      <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl flex flex-col items-center relative overflow-hidden">
        <div className={`absolute top-0 left-0 w-full h-2 ${state.abbruchReason ? 'bg-[#E3000F]' : 'bg-emerald-500'}`}></div>
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4 mt-2 shadow-inner"><i className={`fa-solid fa-flag-checkered text-3xl ${state.abbruchReason ? 'text-slate-400' : 'text-emerald-500'}`}></i></div>
        <h2 className="text-2xl font-black text-slate-800 tracking-tighter mb-1 uppercase">Einsatz Beendet</h2>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center mb-6">{state.abbruchReason ? `Grund: ${state.abbruchReason}` : 'Erfolgreicher ROSC'}</p>
        <div className="w-full grid grid-cols-2 gap-2 mb-8">
            <div className="bg-slate-50 border border-slate-100 p-3 rounded-2xl flex flex-col items-center"><span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Dauer</span><span className="text-xl font-black text-slate-700">{formatTime(state.missionSeconds)}</span></div>
            <div className="bg-slate-50 border border-slate-100 p-3 rounded-2xl flex flex-col items-center"><span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">CCF Ratio</span><span className={`text-xl font-black ${state.currentCcfPercent >= 80 ? 'text-emerald-500' : 'text-red-500'}`}>{state.currentCcfPercent}%</span></div>
            <div className="bg-slate-50 border border-slate-100 p-3 rounded-2xl flex flex-col items-center"><span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Schocks</span><span className="text-xl font-black text-amber-500">{state.shockCount}</span></div>
            <div className="bg-slate-50 border border-slate-100 p-3 rounded-2xl flex flex-col items-center"><span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Adrenalin</span><span className="text-xl font-black text-[#E3000F]">{state.adrCount}</span></div>
        </div>
        <button onClick={() => setIsExportModalOpen(true)} className="w-full bg-[#E3000F] text-white py-3.5 rounded-xl font-black uppercase tracking-widest text-[11px] mb-3 flex items-center justify-center gap-2 shadow-[0_4px_15px_rgba(227,0,15,0.3)] active:scale-95 transition-transform cursor-pointer hover:bg-red-700"><i className="fa-solid fa-file-pdf"></i> Protokoll / Export</button>
        <div className="flex w-full gap-2">
            <button onClick={handleUndo} className="flex-1 bg-white border border-slate-200 text-slate-500 py-3 rounded-xl font-bold uppercase tracking-widest text-[9px] active:scale-95 transition-transform cursor-pointer hover:bg-slate-50">Zurück zum Einsatz</button>
            <button onClick={handleReset} className="flex-1 bg-slate-100 text-slate-600 py-3 rounded-xl font-bold uppercase tracking-widest text-[9px] active:scale-95 transition-transform cursor-pointer hover:bg-slate-200">Neuer Patient</button>
        </div>
      </div>
      {isExportModalOpen && <ExportModal onClose={() => setIsExportModalOpen(false)} />}
    </div>
  );
}