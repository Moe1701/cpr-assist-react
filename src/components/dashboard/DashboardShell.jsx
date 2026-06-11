// --- Datei: src/components/dashboard/DashboardShell.jsx ---
import React, { useContext } from 'react';
import { CprContext } from '../../context/CprContext.jsx';
import CenterDisplay from '../CenterDisplay.jsx';
import { usePatientLogic } from '../../hooks/usePatientLogic.js';

export default function DashboardShell() {
  const { state } = useContext(CprContext);
  
  // WIR HOLEN DEN UMSCHALTER AUS UNSEREM HOOK
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
      <span className="text-[9px] font-black uppercase tracking-wider leading-none text-center px-1">
        {label}
      </span>
    </button>
  );

  const MainBtn = ({ icon, label, colorClass = "bg-white text-slate-500 border-slate-200", badge }) => (
    <div className="relative">
      <button className={`w-[100px] h-[100px] rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.1)] border-2 flex flex-col items-center justify-center gap-1.5 hover:bg-slate-50 active:scale-95 transition-all ${colorClass}`}>
        <i className={`fa-solid ${icon} text-[32px]`}></i>
        <span className="text-[10px] font-black uppercase tracking-widest leading-none text-center px-1">
          {label}
        </span>
      </button>
      {badge && (
        <div className="absolute -top-1 -right-1 bg-[#E3000F] text-white text-[12px] font-black w-7 h-7 rounded-full flex items-center justify-center shadow-md border-[3px] border-white">
          !!!
        </div>
      )}
    </div>
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

  const showTopStats = state.appPhase !== 'ONBOARDING' && state.appPhase !== 'OB_INITIAL_BREATHS';
  const showBottomButtons = state.appPhase !== 'ONBOARDING' && state.appPhase !== 'OB_INITIAL_BREATHS' && state.appPhase !== 'OB_COMPRESSIONS';
  const showSatellites = state.appPhase === 'RUNNING';
  
  const orbitShiftClass = state.isCompressing ? '-translate-y-[20px]' : 'translate-y-[0px]';

  return (
    <div className="absolute inset-0 w-full h-full flex flex-col bg-slate-50 animate-in fade-in duration-500 overflow-hidden">
        
      <div className={`flex items-stretch justify-between gap-2 px-3 py-2 shrink-0 z-40 relative transition-opacity duration-300 ${!showTopStats ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        
        <div className="bg-white rounded-[14px] px-3 py-2 shadow-sm border border-slate-200 flex-1 flex flex-col justify-between">
          <div className="flex justify-between items-center w-full mb-0.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Zeit</span>
            {state.startTime && (
              <span className="text-[10px] font-bold text-slate-500">
                Start: {state.startTime}
              </span>
            )}
          </div>
          <div className="text-[30px] font-black text-slate-800 leading-none font-mono tracking-tighter mt-0.5">
            {formatTime(state.missionSeconds)}
          </div>
        </div>

        <div className="bg-white rounded-[14px] p-2 shadow-sm border border-slate-200 flex-[1.2] flex justify-between items-center">
          <div className="flex flex-col items-start justify-center h-full">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Patient/Modus</span>
            
            {/* HIER IST DEIN NEUER DYNAMISCHER BUTTON */}
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
            <div className="text-[28px] font-black leading-none text-emerald-500 tracking-tighter mt-1">
              99<span className="text-sm">%</span>
            </div>
          </div>
        </div>
      </div>

      <div className={`flex-1 relative w-full flex items-center justify-center transition-transform duration-500 z-30 overflow-visible ${orbitShiftClass}`}>
        
        {state.isGridVisible && (
          <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[100] opacity-50">
            <div className="absolute top-0 left-1/2 w-[2px] h-full bg-[#ff00ff] -translate-x-1/2"></div>
            <div className="absolute top-1/2 left-0 w-full h-[2px] bg-[#ff00ff] -translate-y-1/2"></div>
            <div className="absolute top-1/2 left-1/2 w-[326px] h-[326px] border-[2px] border-blue-500 border-dashed rounded-full -translate-x-1/2 -translate-y-1/2"></div>
            {Array.from({ length: 17 }).map((_, i) => {
              const val = (i - 8) * 50;
              if (val === 0) return null;
              return (
                <React.Fragment key={i}>
                  <div className="absolute top-1/2 w-[8px] h-[2px] bg-[#ff00ff] -translate-y-1/2" style={{ left: `calc(50% + ${val}px - 4px)` }}></div>
                  <div className="absolute top-1/2 text-[10px] font-bold text-[#ff00ff] -translate-y-[14px]" style={{ left: `calc(50% + ${val}px + 2px)` }}>{val > 0 ? `+${val}` : val}</div>
                  <div className="absolute left-1/2 w-[2px] h-[8px] bg-[#ff00ff] -translate-x-1/2" style={{ top: `calc(50% + ${val}px - 4px)` }}></div>
                  <div className="absolute left-1/2 text-[10px] font-bold text-[#ff00ff] translate-x-[6px]" style={{ top: `calc(50% + ${val}px - 6px)` }}>{val > 0 ? `+${val}` : val}</div>
                </React.Fragment>
              );
            })}
          </div>
        )}

        <OrbitPosition x={0} y={0} zIndex={10}>
          <CenterDisplay />
        </OrbitPosition>

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

      <div className={`shrink-0 w-full flex justify-between items-end px-5 pb-8 pt-2 z-50 transition-opacity duration-300 pointer-events-none ${!showBottomButtons ? 'opacity-0' : 'opacity-100'}`}>
        <div className="pointer-events-auto">
          <MainBtn icon="fa-lungs" label="Atemweg" badge={true} colorClass="bg-white text-[#E3000F] border-[#E3000F] shadow-[0_0_25px_rgba(227,0,15,0.3)]" />
        </div>
        <div className="pointer-events-auto">
          <MainBtn icon="fa-pause" label="CPR Pausieren" colorClass="bg-white text-slate-500 border-slate-200 shadow-[0_10px_25px_rgba(0,0,0,0.05)]" />
        </div>
      </div>

    </div>
  );
}