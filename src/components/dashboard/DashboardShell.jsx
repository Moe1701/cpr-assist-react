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
      className="absolute pointer-events-auto"
      style={{ 
        top: '50%', 
        left: '50%', 
        marginLeft: `${x}px`,
        marginTop: `${y}px`,
        transform: 'translate(-50%, -50%)',
        zIndex: zIndex
      }}
    >
      {children}
    </div>
  );

  // Diese Prüfung gilt jetzt NUR NOCH für die 6 Satelliten
  const isRunningPhase = state.appPhase === 'RUNNING';

  const orbitShiftClass = state.isCompressing ? '-translate-y-[20px]' : 'translate-y-[0px]';

  return (
    <div className="absolute inset-0 w-full h-full flex flex-col bg-slate-50 animate-in fade-in duration-500 overflow-hidden">
      
      {/* 1. DIE DECKE */}
      <div className="flex items-stretch justify-between gap-2 p-4 shrink-0 z-40 relative">
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

      {/* 2. DAS SONNENSYSTEM */}
      <div className={`flex-1 relative w-full transition-transform duration-500 ${orbitShiftClass}`}>
        
        {/* Das Zentrum */}
        <OrbitPosition x={0} y={0} zIndex={10}>
          <CenterDisplay />
        </OrbitPosition>

        {/* Die 6 Satelliten (Bleiben versteckt bis das Onboarding durch ist!) */}
        {isRunningPhase && (
          <>
            <OrbitPosition x={0} y={-150}>
              <SatelliteBtn icon="fa-syringe" label="40 µg" />
            </OrbitPosition>
            <OrbitPosition x={130} y={-75}>
              <SatelliteBtn icon="fa-syringe" label="Amio. 20 MG" colorClass="bg-purple-50 text-purple-600 border-purple-200" />
            </OrbitPosition>
            <OrbitPosition x={130} y={75}>
              <SatelliteBtn icon="fa-heart-circle-check" label="Hits Anamnese" />
            </OrbitPosition>
            <OrbitPosition x={0} y={150}>
              <SatelliteBtn icon="fa-flag-checkered" label="Ende ROSC" />
            </OrbitPosition>
            <OrbitPosition x={-130} y={75}>
              <SatelliteBtn icon="fa-file-lines" label="Log" />
            </OrbitPosition>
            <OrbitPosition x={-130} y={-75}>
              <SatelliteBtn icon="fa-droplet" label="Zugang" colorClass="bg-blue-50 text-blue-600 border-blue-200" />
            </OrbitPosition>
          </>
        )}
      </div>

      {/* 3. DER BODEN (Ist jetzt IMMER da, sobald das Dashboard lädt!) */}
      <div className="absolute bottom-6 left-5 z-50 pointer-events-auto">
        <MainBtn 
          icon="fa-lungs" label="Atemweg" 
          colorClass="bg-amber-50 text-amber-600 border-amber-400 ring-4 ring-amber-100 shadow-[0_0_15px_rgba(251,191,36,0.5)]" 
        />
      </div>

      <div className="absolute bottom-6 right-5 z-50 pointer-events-auto">
        <MainBtn 
          icon="fa-pause" label="CPR Pausieren" 
        />
      </div>

    </div>
  );
}