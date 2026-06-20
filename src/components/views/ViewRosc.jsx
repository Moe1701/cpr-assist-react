// --- Datei: src/components/views/ViewRosc.jsx ---
import React, { useContext } from 'react';
import { CprContext } from '../../context/CprContext.jsx';
import { CPR_CONFIG, CHECKLISTS } from '../../config/cprConfig.js';
import PediSafeLimits from './PediSafeLimits.jsx';

export default function ViewRosc() {
  const { state, dispatch, logEvent } = useContext(CprContext);

  if (state.appPhase !== CPR_CONFIG.PHASES.ROSC) return null;

  const handleReArrest = () => {
    logEvent("ROSC", "RE-ARREST! CPR fortgesetzt.");
    dispatch({ type: 'TOGGLE_COMPRESSION', payload: false }); 
    dispatch({ type: 'SET_PHASE', payload: CPR_CONFIG.PHASES.RUNNING });
  };

  const handleEnd = () => {
    dispatch({ type: 'TOGGLE_ABBRUCH_MODAL', payload: true });
  };

  const toggleItem = (label) => {
    const isChecked = !state.roscChecklist?.[label];
    dispatch({ type: 'TOGGLE_ROSC_ITEM', payload: label });
    logEvent("ROSC", `${label} ${isChecked ? '(erledigt)' : '(widerrufen)'}`);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const checklist = state.roscChecklist || {};

  return (
    <div className="absolute inset-0 z-[60] bg-emerald-50 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-300">
      <div className="flex items-stretch justify-between gap-2 px-3 py-2 shrink-0 bg-white border-b border-emerald-100 shadow-sm z-40 relative">
        <div className="flex-[1] flex flex-col justify-between items-start px-2 py-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-tight">Gesamtzeit</span>
          <div className="text-[26px] font-black text-slate-800 leading-none font-mono tracking-tighter mt-1">{formatTime(state.missionSeconds)}</div>
        </div>
        <div className="w-px bg-slate-200 my-2"></div>
        <div className="flex-[1] flex flex-col justify-between items-end px-2 py-1">
          <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest leading-tight">Stabilisierung</span>
          <div className="text-[26px] font-black text-emerald-600 leading-none font-mono tracking-tighter mt-1">{formatTime(state.roscSeconds)}</div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar px-3 pt-3 pb-28 relative">
        <div className="flex gap-2 mb-3 shrink-0">
            <button onClick={handleReArrest} className="flex-1 bg-[#E3000F] text-white py-3 rounded-xl shadow-md font-black uppercase text-xs tracking-widest active:scale-95 flex flex-col items-center justify-center cursor-pointer hover:bg-red-700">RE-ARREST</button>
            <button onClick={handleEnd} className="flex-1 bg-slate-800 text-white py-3 rounded-xl shadow-md font-black uppercase text-xs tracking-widest active:scale-95 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-700">EINSATZ ENDE</button>
        </div>
        <div className="flex gap-2 mb-3 shrink-0">
            <button onClick={() => dispatch({ type: 'TOGGLE_HITS_MODAL', payload: true })} className="flex-1 bg-white border border-slate-200 text-slate-700 py-2.5 rounded-xl shadow-sm font-bold uppercase text-[10px] tracking-widest active:scale-95 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50"><i className="fa-solid fa-clipboard-list mb-1 text-slate-400"></i> SAMPLER / HITS</button>
            <button onClick={() => dispatch({ type: 'TOGGLE_LOG_MODAL', payload: true })} className="flex-1 bg-white border border-slate-200 text-slate-700 py-2.5 rounded-xl shadow-sm font-bold uppercase text-[10px] tracking-widest active:scale-95 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50"><i className="fa-solid fa-clock-rotate-left mb-1 text-slate-400"></i> LOGBUCH</button>
        </div>

        <PediSafeLimits />

        <div className="bg-white rounded-2xl shadow-sm px-4 py-4 mb-2 border border-emerald-100 shrink-0">
            <h3 className="font-black text-emerald-700 uppercase tracking-wider mb-2 text-sm text-center border-b border-emerald-50 pb-2">Post-ROSC Bündel</h3>
            <div className="flex flex-col gap-1.5 mt-2">
                {CHECKLISTS.ROSC_DATA.map((block) => (
                    <div key={block.cat} className="mb-3">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-700 font-black flex items-center justify-center text-[10px]">{block.cat}</span>
                            <h4 className="text-[11px] font-black text-slate-700 uppercase tracking-wider">{block.title}</h4>
                        </div>
                        <div className="flex flex-col gap-1.5 pl-2">
                            {block.items.map((item) => {
                                const isActive = checklist[item.label];
                                return (
                                    <button key={item.label} onClick={() => toggleItem(item.label)} className={`w-full text-left p-3 rounded-xl border flex items-center justify-between active:scale-[0.98] transition-all cursor-pointer ${isActive ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-slate-200 shadow-sm hover:bg-slate-50'}`}>
                                        <div className="flex flex-col pr-2">
                                            <span className={`text-[11px] font-black transition-colors ${isActive ? 'text-emerald-700' : 'text-slate-700'}`}>{item.label}</span>
                                            {item.sub && <span className={`text-[9px] font-bold mt-0.5 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`}>{item.sub}</span>}
                                        </div>
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${isActive ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-slate-300 bg-slate-50'}`}>
                                            {isActive && <i className="fa-solid fa-check text-[10px]"></i>}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}