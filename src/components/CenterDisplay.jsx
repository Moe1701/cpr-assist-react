import React, { useContext } from 'react';
import { CprContext } from '../context/CprContext.jsx';
import { CPR_CONFIG } from '../config/cprConfig.js';
import PatientSelection from './PatientSelection.jsx';

export default function CenterDisplay() {
  const { state } = useContext(CprContext);

  const isDashboard = state.appPhase === CPR_CONFIG.PHASES.RUNNING;
  // Perfekter Kreis-Morpheffekt: 340px beim Onboarding, 224px im Dashboard
  const circleSize = isDashboard ? '224px' : '340px';

  const formatCprTime = (seconds) => {
    if (isNaN(seconds) || seconds === null) return "00:00";
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const renderPhase = () => {
    if (state.appPhase === CPR_CONFIG.PHASES.RUNNING) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-white rounded-full shadow-[inset_0_0_20px_rgba(0,0,0,0.02)] animate-in zoom-in-95 duration-500 relative">
          <div className="absolute top-5 w-10 h-1.5 bg-cyan-500 rounded-full"></div>
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em] mb-1">
            Nächste Analyse
          </div>
          
          {/* 120s Countdown im Dashboard */}
          <div className="text-[64px] font-black text-slate-800 tracking-tighter leading-none mb-3 font-mono">
             {formatCprTime(120 - (state.cycleSeconds || 0))}
          </div>
          
          <div className="flex items-center gap-3 text-[13px] font-black tracking-widest mt-1">
            <span className="text-amber-500 flex items-center gap-1.5">
              <i className="fa-solid fa-bolt"></i> {state.shockCount || 0}
            </span>
            <span className="text-slate-200">|</span>
            <span className="text-[#E3000F]">
              {state.isPediatric && state.patientWeight ? Math.round(state.patientWeight * 4) : 150} J
            </span>
          </div>
        </div>
      );
    }

    // Leitet alle anderen Phasen an den Onboarding-Router weiter
    return <PatientSelection />;
  };

  return (
    <div className="relative flex flex-col items-center justify-center transition-all duration-500">
      
      {/* Überschrift beim Onboarding über dem Kreis schwebend */}
      {state.appPhase === CPR_CONFIG.PHASES.ONBOARDING && (
        <div className="absolute -top-[75px] w-full flex flex-col items-center justify-center text-center animate-in fade-in slide-in-from-bottom-4 duration-500 z-10">
           <h1 className="text-[26px] font-black text-slate-800 uppercase tracking-[0.2em] drop-shadow-sm leading-none mb-1">
             Einsatz Starten
           </h1>
           <div className="w-12 h-[3px] bg-[#E3000F] rounded-full opacity-80 mt-2"></div>
        </div>
      )}

      {/* Das absolut runde, sich anpassende Hauptfenster */}
      <div 
        style={{ width: circleSize, height: circleSize }}
        className="rounded-full shadow-[0_15px_40px_rgba(0,0,0,0.08)] border-4 border-slate-100 flex items-center justify-center relative overflow-hidden bg-white shrink-0 transition-all duration-500 mx-auto z-20"
      >
        {renderPhase()}
      </div>
    </div>
  );
}