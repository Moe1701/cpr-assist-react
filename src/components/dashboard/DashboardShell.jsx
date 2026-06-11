// --- Datei: src/components/dashboard/DashboardShell.jsx ---
import React, { useContext } from 'react';
import { CprContext } from '../../context/CprContext.jsx';
import CenterDisplay from '../CenterDisplay.jsx';

export default function DashboardShell() {
  const { state } = useContext(CprContext);

  const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds === null) return "00:00";
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const ccfValue = "--"; 
  const ccfColorClass = 'text-slate-800';
  const patientLabel = state.isPediatric ? `${state.patientWeight || '?'} KG` : 'ERW.';
  const modeLabel = state.cprMode === 'continuous' ? 'KONT' : state.cprMode;

  const SatelliteBtn = ({ icon, label, colorClass = "bg-white text-slate-500 border-slate-200" }) => (
    <button className={`w-[78px] h-[78px] rounded-full shadow-sm border flex flex-col items-center justify-center gap-1 hover:bg-slate-50 active:scale-95 transition-all ${colorClass}`}>
      <i className={`fa-solid ${icon} text-[21px] mb-0.5`}></i>
      <span className="text-[8px] font-black uppercase tracking-wider leading-none text-center px-1">
        {label}
      </span>
    </button>
  );

  const MainBtn = ({ icon, label, colorClass = "bg-white text-slate-500 border-slate-200" }) => (
    <button className={`w-[85px] h-[85px] rounded-full shadow-md border flex flex-col items-center justify-center gap-1 hover:bg-slate-50 active:scale-95 transition-all ${colorClass}`}>
      <i className={`fa-solid ${icon} text-[26px] mb-1`}></i>
      <span className="text-[8.5px] font-black uppercase tracking-wider leading-none text-center px-1">
        {label}
      </span>
    </button>
  );

  const OrbitPosition = ({ x, y, children, zIndex = 20 }) => (
    <div 
      className="absolute pointer-events-none"
      style={{ top: '50%', left: '50%', marginLeft: `${x}px`, marginTop: `${y}px`, transform: 'translate(-50%, -50%)', zIndex: zIndex }}
    >
      <div className="pointer-events-auto">
        {children}
      </div>
    </div>
  );

  const isRunningPhase = state.appPhase === 'RUNNING';
  const orbitShiftClass = state.isCompressing ? '-translate-y-[20px]' : 'translate-y-[0px]';

  return (
    <div className="absolute inset-0 w-full h-full flex flex-col bg-slate-50 animate-in fade-in duration-500 overflow-hidden">
        
      {/* 1. DIE DECKE */}
      <div className={`flex items-stretch justify-between gap-2 p-4 shrink-0 z-40 relative transition-opacity duration-300 ${!isRunningPhase ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        
        {/* ZEIT KASTEN */}
        <div className="bg-white rounded-2xl p-2.5 shadow-sm border border-slate-200 flex-1 flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Zeit</span>
          
          <div className="flex flex-col justify-end mt-1">
            <div className="text-3xl font-black text-slate-800 leading-none font-mono tracking-tighter">
              {formatTime(state.missionSeconds)}
            </div>
            {/* Startzeit jetzt klein unter der laufenden Zeit */}
            {state.startTime && (
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-1">
                Start: {state.startTime}
              </span>
            )}
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

      {/* 2. DAS SONNENSYSTEM (Der flex-1 Container berechnet exakt die Mitte) */}
      <div className={`flex-1 relative w-full transition-transform duration-500 ${orbitShiftClass}`}>
        
        {/* --- LAYOUT DIAGNOSE GRID --- */}
        {state.isGridVisible && (
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            <div className="absolute top-1/2 left-0 w-full border-t border-cyan-400/60 border-dashed"></div>
            <div className="absolute top-0 left-1/2 h-full border-l border-cyan-400/60 border-dashed"></div>
            <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-red-500 rounded-full -translate-x-1/2 -translate-y-1/2 shadow-[0_0_10px_red]"></div>
            <div className="absolute top-1/2 left-1/2 w-[330px] h-[330px] border border-cyan-400/40 border-dashed rounded-full -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[175px] text-[10px] font-bold text-cyan-500 bg-white/80 px-2 rounded">Radius 330px</div>
            <div className="absolute top-[5px] left-1/2 translate-x-2 text-[10px] font-bold text-cyan-500 bg-white/80 px-2 rounded">Achse Y</div>
            <div className="absolute top-1/2 left-[5px] -translate-y-4 text-[10px] font-bold text-cyan-500 bg-white/80 px-2 rounded">Achse X</div>
          </div>
        )}

        {/* Das Zentrum */}
        <OrbitPosition x={0} y={0} zIndex={10}>
          <CenterDisplay />
        </OrbitPosition>

        {isRunningPhase && (
          <>
            <OrbitPosition x={0} y={-150}><SatelliteBtn icon="fa-syringe" label="40 µg" /></OrbitPosition>
            <OrbitPosition x={130} y={-75}><SatelliteBtn icon="fa-syringe" label="Amio. 20 MG" colorClass="bg-purple-50 text-purple-600 border-purple-200" /></OrbitPosition>
            <OrbitPosition x={130} y={75}><SatelliteBtn icon="fa-heart-circle-check" label="Hits Anamnese" /></OrbitPosition>
            <OrbitPosition x={0} y={150}><SatelliteBtn icon="fa-flag-checkered" label="Ende ROSC" /></OrbitPosition>
            <OrbitPosition x={-130} y={75}><SatelliteBtn icon="fa-file-lines" label="Log" /></OrbitPosition>
            <OrbitPosition x={-130} y={-75}><SatelliteBtn icon="fa-droplet" label="Zugang" colorClass="bg-blue-50 text-blue-600 border-blue-200" /></OrbitPosition>
          </>
        )}
      </div>

      {/* 3. DER BODEN */}
      <div className={`absolute bottom-6 left-5 z-50 transition-opacity duration-300 ${!isRunningPhase ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'}`}>
        <MainBtn icon="fa-lungs" label="Atemweg" colorClass="bg-amber-50 text-amber-600 border-amber-400 ring-4 ring-amber-100 shadow-[0_0_15px_rgba(251,191,36,0.5)]" />
      </div>

      <div className={`absolute bottom-6 right-5 z-50 transition-opacity duration-300 ${!isRunningPhase ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'}`}>
        <MainBtn icon="fa-pause" label="CPR Pausieren" />
      </div>

    </div>
  );
}