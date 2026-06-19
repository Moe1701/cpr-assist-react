// --- Datei: src/components/views/TabList.jsx ---
import React, { useContext } from 'react';
import { CprContext } from '../../context/CprContext.jsx';

export default function TabList() {
  const { state } = useContext(CprContext);
  const data = state.events || [];

  if (data.length === 0) {
    return (
      <div className="p-4 text-center text-slate-400 text-xs font-bold mt-10">
        Das Protokoll ist noch leer.
      </div>
    );
  }

  const formatRelative = (seconds) => {
    if (isNaN(seconds) || seconds === null) return "+00:00";
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `+${m}:${s}`;
  };

  return (
    <div className="flex flex-col p-4 gap-2 pb-10">
      {data.map((item) => (
        <div 
          key={item.id} 
          className="flex items-start gap-3 bg-white p-3 rounded-xl border border-slate-100 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300"
        >
          <div className="flex flex-col items-center shrink-0 min-w-[45px]">
            <span className="text-[9px] font-bold text-slate-400 leading-tight">{item.realTime}</span>
            <span className="text-[11px] font-black text-[#E3000F]">{formatRelative(item.missionTime)}</span>
          </div>
          
          <div className="w-px bg-slate-200 self-stretch"></div>
          
          <span className="text-[11px] font-bold text-slate-700 pt-0.5 leading-snug">
            {item.type}{item.detail ? `: ${item.detail}` : ''}
          </span>
        </div>
      ))}
    </div>
  );
}