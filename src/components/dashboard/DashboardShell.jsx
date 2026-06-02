// --- Datei: src/components/dashboard/DashboardShell.jsx ---
import React, { useContext } from 'react';
import { CprContext } from '../../context/CprContext.jsx';
import CenterDisplay from '../CenterDisplay.jsx';

export default function DashboardShell() {
  const { state } = useContext(CprContext);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const ccfValue = state.arrestSeconds > 0 
    ? Math.round((state.compressingSeconds / state.arrestSeconds) * 100) 
    : 100;
  
  const ccfColorClass = ccfValue >= 80 ? 'text-slate-800' : 'text-red-600';
  const patientLabel = state.isPediatric ? `${state.patientWeight} KG` : 'ERW.';
  const modeLabel = state.cprMode === 'continuous' ? 'KONT' : state.cprMode;

  // Wir nutzen jetzt 'positionClasses' (Tailwind) statt wackeliger style-Attribute
  const SatelliteBtn = ({ positionClasses, icon, label, colorClass = "bg-white text-slate-500 border-slate-200" }) => (
    <button 
      className={`absolute w-[75px] h-[75px] rounded-full shadow-sm border flex flex-col items-center justify-center gap-1 hover:bg-slate-50 active:scale-95 transition-all z-20 ${colorClass} ${positionClasses}`}
    >
      <i className={`fa-solid ${icon} text-[22px] mb-0.5`}></i>
      <span className="text-[7.5px] font-black uppercase tracking-wider leading-none text-center px-1">
        {label}
      </span>
    </button>
  );

  return (
    <div className="absolute inset-0 w-full h-full flex flex-col bg-slate-50 animate-in fade-in duration-500">
      
      {/* TOP STATS */}
      <div className="flex items-stretch justify-between gap-2 p-4 shrink-0 z-30 relative">
        <div className="bg-white rounded-2xl p-2.5 shadow-sm border border-slate-200 flex-1 flex flex-col justify-between">
          <div className="flex justify-between items-center w-full">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Zeit</span>
          </div>
          <div className="text-3xl font-black text-slate-800 leading-none mt-1 font-mono tracking-tighter">
            {formatTime(state.totalSeconds)}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-2.5 shadow-sm border border-slate-200 flex-1 flex flex-col items-center justify-center gap-1.5">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest w-full text-left">Patient/Modus</span>
          <div className="flex gap-1 w-full">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase flex items-center gap-1 ${state.isPediatric ? 'bg-pink-100 text-pink-600' : 'bg-slate-100 text-slate-600'}`}>
              {state.isPediatric && <i className="fa-solid fa-weight-scale"></i>} {patientLabel}
            </span>
            <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
              {modeLabel}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-2.5 shadow-sm border border-slate-200 flex-1 flex flex-col justify-between items-end">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">CCF</span>
          <div className={`text-3xl font-black leading-none mt-1 ${ccfColorClass}`}>
            {ccfValue}<span className="text-lg">%</span>
          </div>
        </div>
      </div>

      {/* ORBIT BÜHNE - Feste Maximalbreite für eine stabile Darstellung */}
      <div className="flex-1 relative flex items-center justify-center w-full max-w-[360px] mx-auto pb-4">
        
        {/* Die absolute Spielfläche (400px hoch) */}
        <div className="relative w-full h-[400px]">
          
          {/* ======================================= */}
          {/* 1. DAS ZENTRUM (Eingesperrt in einen fixen Käfig) */}
          {/* ======================================= */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[240px] h-[240px] z-10 flex items-center justify-center pointer-events-none">
            <div className="relative w-full h-full pointer-events-auto flex items-center justify-center">
              <CenterDisplay />
            </div>
          </div>

          {/* ======================================= */}
          {/* 2. DIE UNTERE REIHE (Deine Haupt-Buttons) */}
          {/* ======================================= */}
          <SatelliteBtn 
            positionClasses="bottom-0 left-2" 
            icon="fa-lungs" label="Atemweg" 
            colorClass="bg-amber-50 text-amber-600 border-amber-400 ring-4 ring-amber-100 shadow-md" 
          />
          
          <SatelliteBtn 
            positionClasses="bottom-0 right-2" 
            icon="fa-pause" label="CPR Pausieren" 
          />
          
          <SatelliteBtn 
            positionClasses="bottom-[-10px] left-1/2 -translate-x-1/2" 
            icon="fa-flag-checkered" label="Ende ROSC" 
          />

          {/* ======================================= */}
          {/* 3. DIE OBERE REIHE (Medikamente) */}
          {/* ======================================= */}
          <SatelliteBtn 
            positionClasses="top-0 left-1/2 -translate-x-1/2" 
            icon="fa-syringe" label="40 µg" 
          />
          
          <SatelliteBtn 
            positionClasses="top-6 right-2" 
            icon="fa-syringe" label="Amio. 20 MG" 
            colorClass="bg-purple-50 text-purple-600 border-purple-200" 
          />
          
          <SatelliteBtn 
            positionClasses="top-6 left-2" 
            icon="fa-droplet" label="Zugang" 
            colorClass="bg-blue-50 text-blue-600 border-blue-200" 
          />

          {/* ======================================= */}
          {/* 4. DIE MITTLERE REIHE (Doku) */}
          {/* ======================================= */}
          <SatelliteBtn 
            positionClasses="top-1/2 -translate-y-1/2 left-[-10px]" 
            icon="fa-file-lines" label="Log" 
          />
          
          <SatelliteBtn 
            positionClasses="top-1/2 -translate-y-1/2 right-[-10px]" 
            icon="fa-heart-circle-check" label="Hits Anamnese" 
          />

        </div>
      </div>
    </div>
  );
}