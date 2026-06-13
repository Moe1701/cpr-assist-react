import React, { useContext } from 'react';
import { CprContext } from '../../context/CprContext.jsx';
import { CPR_CONFIG } from '../../config/cprConfig.js';

import CenterDisplay from '../CenterDisplay.jsx';
import PatientSetupModal from '../PatientSetupModal.jsx'; 
import AirwayModal from '../AirwayModal.jsx'; 
// NEU: Wir importieren unser Modul!
import CprButton from './CprButton.jsx'; 

import { usePatientLogic } from '../../hooks/usePatientLogic.js';

export default function DashboardShell() {
  const { state, dispatch } = useContext(CprContext);
  const { toggleCprMode } = usePatientLogic();

  const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds === null) return "00:00";
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const SatelliteBtn = ({ icon, label, colorClass = "bg-white text-slate-500 border-slate-200" }) => (
    <button className={`w-[86px] h-[86px] rounded-full shadow-sm border-[3px] flex flex-col items-center justify-center gap-1 hover:bg-slate-50 active:scale-95 transition-all ${colorClass}`}>
      <i className={`fa-solid ${icon} text-[24px] mb-0.5`}></i>
      <span className="text-[9px] font-black uppercase tracking-wider leading-none text-center px-1">{label}</span>
    </button>
  );

  const MainBtn = ({ icon, label, colorClass, badge, onClick, customContent }) => (
    <div className="relative pointer-events-auto">
      <button onClick={onClick} className={`w-[100px] h-[100px] rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.1)] border-2 flex flex-col items-center justify-center gap-1.5 hover:bg-slate-50 active:scale-95 transition-all ${colorClass}`}>
        {customContent ? customContent : (
           <>
             <i className={`fa-solid ${icon} text-[32px]`}></i>
             <span className="text-[10px] font-black uppercase tracking-widest leading-none text-center px-1">{label}</span>
           </>
        )}
      </button>
      {badge && !customContent && (
        <div className="absolute -top-1 -right-1 bg-[#E3000F] text-white text-[12px] font-black w-7 h-7 rounded-full flex items-center justify-center shadow-md border-[3px] border-white">
          !!!
        </div>
      )}
    </div>
  );

  const OrbitPosition = ({ x, y, children, zIndex = 20 }) => (
    <div className="absolute pointer-events-none" style={{ zIndex, top: '50%', left: '50%', marginLeft: `${x}px`, marginTop: `${y}px`, transform: 'translate(-50%, -50%)' }}>
      <div className="pointer-events-auto">{children}</div>
    </div>
  );

  const isRunning = state.appPhase === CPR_CONFIG.PHASES.RUNNING;
  const isSetup = state.appPhase === CPR_CONFIG.PHASES.ONBOARDING || state.appPhase === CPR_CONFIG.PHASES.OB_INITIAL_BREATHS;
  
  const showTopStats = !isSetup;
  const showSatellites = isRunning;
  const showBottomButtons = !isSetup; 
  const orbitShiftClass = state.isCompressing ? '-translate-y-[20px]' : 'translate-y-[0px]';

  // UI für den Atemweg-Kreis
  const airwayContent = (state.airwayEstablished && state.cprMode === 'continuous') ? (
    <div className="flex flex-col items-center justify-center w-full h-full">
        {state.breathCountdown === "HUB" ? (
            <span className="text-[26px] font-black text-cyan-600 animate-ping">HUB!</span>
        ) : (
            <>
              <span className="text-[36px] font-black text-cyan-600 leading-none mb-0.5">{state.breathCountdown || "-"}</span>
              <span className="text-[9px] font-black text-cyan-500 uppercase tracking-widest leading-none text-center">
                {state.airwayType === 'Beutel-Maske' ? 'Maske' : 'Tubus'}
              </span>
            </>
        )}
    </div>
  ) : null;

  return (
    <div className="absolute inset-0 w-full h-full flex flex-col bg-slate-50 animate-in fade-in duration-500 overflow-hidden">
        
      {/* 1. OBERE LEISTE */}
      <div className={`flex items-stretch justify-between gap-2 px-3 py-2 shrink-0 z-40 relative transition-opacity duration-300 ${!showTopStats ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <div className="bg-white rounded-[14px] px-3 py-2 shadow-sm border border-slate-200 flex-1 flex flex-col justify-between">
          <div className="flex justify-between items-center w-full mb-0.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Zeit</span>
          </div>
          <div className="text-[30px] font-black text-slate-800 leading-none font-mono tracking-tighter mt-0.5">
            {formatTime(state.missionSeconds)}
          </div>
        </div>

        <div className="bg-white rounded-[14px] p-2 shadow-sm border border-slate-200 flex-[1.2] flex justify-between items-center">
          <div className="flex flex-col items-start justify-center h-full">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Modus</span>
            <button onClick={toggleCprMode} className="flex rounded-full border border-amber-300 overflow-hidden shadow-sm active:scale-95 transition-transform cursor-pointer">
              <span className={`text-[10px] font-black px-2.5 py-0.5 uppercase ${state.cprMode !== 'continuous' ? 'bg-amber-100 text-amber-700' : 'bg-white text-slate-400'}`}>
                {state.isPediatric ? '15:2' : '30:2'}
              </span>
              <span className={`text-[10px] font-black px-2.5 py-0.5 uppercase border-l border-amber-200 ${state.cprMode === 'continuous' ? 'bg-amber-100 text-amber-700' : 'bg-white text-slate-400'}`}>
                KONT
              </span>
            </button>
          </div>
          <div className="flex flex-col items-end justify-center h-full pl-2 border-l border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">CCF</span>
            <div className={`text-[28px] font-black leading-none tracking-tighter mt-1 ${state.currentCcfPercent < 80 ? 'text-red-500' : 'text-emerald-500'}`}>
              {state.currentCcfPercent || 100}<span className="text-sm">%</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MITTLERER BEREICH */}
      <div className={`flex-1 relative w-full flex items-center justify-center transition-transform duration-500 z-30 overflow-visible ${orbitShiftClass}`}>
        <OrbitPosition x={0} y={0} zIndex={10}><CenterDisplay /></OrbitPosition>

        {showSatellites && (
          <>
            <OrbitPosition x={0} y={-163}><SatelliteBtn icon="fa-syringe" label="1 mg" colorClass="bg-white text-emerald-600 border-emerald-400" /></OrbitPosition>
            <OrbitPosition x={141} y={-81.5}><SatelliteBtn icon="fa-syringe" label="Amio. 300 mg" colorClass="bg-white text-purple-600 border-purple-400" /></OrbitPosition>
            <OrbitPosition x={141} y={81.5}><SatelliteBtn icon="fa-clipboard-list" label="Hits Anamnese" colorClass="bg-white text-slate-600 border-slate-300" /></OrbitPosition>
            <OrbitPosition x={0} y={163}><SatelliteBtn icon="fa-flag-checkered" label="Ende ROSC" colorClass="bg-white text-slate-700 border-slate-300" /></OrbitPosition>
            <OrbitPosition x={-141} y={81.5}><SatelliteBtn icon="fa-file-lines" label="Log" colorClass="bg-white text-slate-500 border-slate-300" /></OrbitPosition>
            <OrbitPosition x={-141} y={-81.5}><SatelliteBtn icon="fa-droplet" label="Zugang" colorClass="bg-white text-slate-500 border-slate-300" /></OrbitPosition>
          </>
        )}
      </div>

      <div className="absolute bottom-0 w-full h-40 bg-gradient-to-t from-slate-200/90 to-transparent z-10 pointer-events-none"></div>

      {/* 3. UNTERE LEISTE (Atemweg & CPR Pause) */}
      <div className={`shrink-0 w-full flex justify-between items-end px-5 pb-8 pt-2 z-50 transition-opacity duration-300 pointer-events-none ${!showBottomButtons ? 'opacity-0' : 'opacity-100'}`}>
        
        {/* Der Atemweg Button nutzt weiterhin die lokale MainBtn Komponente */}
        <MainBtn 
            onClick={() => dispatch({ type: 'TOGGLE_AIRWAY_MODAL', payload: true })}
            icon="fa-lungs" 
            label={state.airwayType || "Atemweg"} 
            badge={!state.airwayEstablished} 
            colorClass={state.airwayEstablished ? "bg-cyan-50 border-cyan-400 text-cyan-600 shadow-[0_0_20px_rgba(6,182,212,0.3)]" : "bg-white text-[#E3000F] border-[#E3000F] shadow-[0_0_25px_rgba(227,0,15,0.3)]"} 
            customContent={airwayContent}
        />
        
        {/* HIER WIRD UNSER NEUER, INTELLIGENTER CPR-BUTTON EINGEBUNDEN */}
        <CprButton />
        
      </div>

      {/* MODALS */}
      {state.isPatientModalOpen && <PatientSetupModal />}
      <AirwayModal />
      
    </div>
  );
}