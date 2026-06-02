import React, { useContext } from 'react';
import { CprContext } from '../../context/CprContext.jsx';
import CenterDisplay from '../CenterDisplay.jsx';

export default function DashboardShell() {
  const { state } = useContext(CprContext);

  const SatelliteBtn = ({ top, left, right, bottom, icon, label, colorClass = "bg-white text-slate-500 border-slate-200" }) => (
    <button 
      className={`absolute w-[75px] h-[75px] rounded-full shadow-sm border flex flex-col items-center justify-center gap-1 hover:bg-slate-50 active:scale-95 transition-all z-20 ${colorClass}`}
      style={{ top, left, right, bottom }}
    >
      <i className={`fa-solid ${icon} text-2xl mb-0.5`}></i>
      <span className="text-[8px] font-black uppercase tracking-wider leading-none text-center">{label}</span>
    </button>
  );

  return (
    <div className="absolute inset-0 w-full h-full flex flex-col bg-slate-50 animate-in fade-in duration-500">
      <div className="flex items-stretch justify-between gap-2 p-4 shrink-0 z-30">
        <div className="bg-white rounded-2xl p-2.5 shadow-sm border border-slate-200 flex-1 flex flex-col justify-between">
          <div className="flex justify-between items-center w-full">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Zeit</span>
            <span className="text-[9px] font-bold text-slate-400">Start: 14:06</span>
          </div>
          <div className="text-3xl font-black text-slate-800 leading-none mt-1">00:00</div>
        </div>
        <div className="bg-white rounded-2xl p-2.5 shadow-sm border border-slate-200 flex-1 flex flex-col items-center justify-center gap-1.5">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest w-full text-left">Patient/Modus</span>
          <div className="flex gap-1 w-full">
            <span className="bg-pink-100 text-pink-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase flex items-center gap-1">
              <i className="fa-solid fa-weight-scale"></i> 4 KG
            </span>
            <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase">KONT</span>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-2.5 shadow-sm border border-slate-200 flex-1 flex flex-col justify-between items-end">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">CCF</span>
          <div className="text-3xl font-black text-slate-800 leading-none mt-1">100<span className="text-lg">%</span></div>
        </div>
      </div>

      <div className="flex-1 relative flex items-center justify-center w-full max-w-[380px] mx-auto">
        <div className="relative w-full h-[450px]">
          <SatelliteBtn top="10%" right="5%" icon="fa-syringe" label="Amio. 20 MG" colorClass="bg-purple-50 text-purple-600 border-purple-200" />
          <SatelliteBtn top="-2%" left="40%" icon="fa-syringe" label="40 µg" colorClass="bg-white text-slate-500 border-slate-200" />
          <SatelliteBtn top="45%" right="-2%" icon="fa-heart-circle-check" label="Hits Anamnese" colorClass="bg-white text-slate-500 border-slate-200" />
          <SatelliteBtn top="15%" left="5%" icon="fa-droplet" label="Zugang" colorClass="bg-blue-50 text-blue-600 border-blue-200" />
          <SatelliteBtn top="45%" left="-2%" icon="fa-file-lines" label="Log" colorClass="bg-white text-slate-500 border-slate-200" />
          <SatelliteBtn bottom="-5%" left="40%" icon="fa-flag-checkered" label="Ende ROSC" colorClass="bg-white text-slate-500 border-slate-200" />
          <SatelliteBtn bottom="5%" left="5%" icon="fa-lungs" label="Atemweg" colorClass="bg-amber-50 text-amber-600 border-amber-400 ring-4 ring-amber-100 shadow-[0_0_15px_rgba(251,191,36,0.5)]" />
          <SatelliteBtn bottom="5%" right="5%" icon="fa-pause" label="CPR Pausieren" colorClass="bg-white text-slate-500 border-slate-200" />
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
            <div className="pointer-events-auto">
              <CenterDisplay />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}