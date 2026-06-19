// --- Datei: src/components/CenterDisplay.jsx ---
import React from 'react';
import { CPR_CONFIG } from '../config/cprConfig.js';
import { useCenterEngine } from '../hooks/useCenterEngine.js';

import PatientSelection from './PatientSelection.jsx';
import ViewAirwayMenu from './views/ViewAirwayMenu.jsx';
import ViewAirwayDoc from './views/ViewAirwayDoc.jsx';
import ViewDecision from './views/ViewDecision.jsx';
import ViewJoule from './views/ViewJoule.jsx';
import ViewCprResume from './views/ViewCprResume.jsx';
import ViewZugang from './views/ViewZugang.jsx';
import ViewMedsMenu from './views/ViewMedsMenu.jsx';

export default function CenterDisplay() {
  
  const { 
    state, circleSize, formatCprTime, handleManualAnalyze, 
    remaining, ringColor, warningText, textColor, isPulsing, isEscalated,
    radius, strokeDasharray, strokeWidth, displayJoule 
  } = useCenterEngine();

  const renderPhase = () => {
    switch (state.appPhase) {
      
      case CPR_CONFIG.PHASES.RUNNING: 
        return (
          <button 
            onClick={handleManualAnalyze}
            className={`w-full h-full flex flex-col items-center justify-center p-6 rounded-full transition-all relative overflow-hidden cursor-pointer ${isEscalated ? 'bg-red-50 shadow-[inset_0_0_40px_rgba(227,0,15,0.15)]' : 'bg-white shadow-[inset_0_0_20px_rgba(0,0,0,0.02)] hover:bg-slate-50 active:scale-95'}`}
          >
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r={radius} fill="none" stroke={isEscalated ? "#fee2e2" : "#f8fafc"} strokeWidth={strokeWidth} transform="rotate(-90 50 50)" className="transition-colors duration-500" />
              <circle
                  cx="50" cy="50" r={radius}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                  className={`transition-all duration-1000 ease-linear ${ringColor}`}
              />
            </svg>
            
            <div className={`text-[66px] font-black tracking-tighter leading-none font-mono z-10 transition-colors duration-500 ${isEscalated ? 'text-[#E3000F]' : 'text-[#1e293b]'}`}>
               {formatCprTime(remaining)}
            </div>

            <div className="h-[28px] mt-2 mb-1 flex items-center justify-center z-10 w-full">
              {isEscalated ? (
                <div className="bg-[#E3000F] text-white px-4 py-1.5 rounded-full text-[12px] font-black tracking-widest animate-pulse shadow-lg scale-110">
                  {warningText}
                </div>
              ) : (
                <div className={`text-[11px] font-black uppercase tracking-widest transition-all duration-300 ${textColor} ${isPulsing ? 'animate-pulse scale-105' : ''} text-center leading-tight`}>
                  {warningText}
                </div>
              )}
            </div>
            
            <div className={`flex items-center justify-center gap-3 text-[15px] font-black tracking-widest z-10 w-full mt-1 ${isEscalated ? 'opacity-50' : 'opacity-100'} transition-opacity`}>
              <span className="text-amber-500 flex items-center gap-1.5">
                <i className="fa-solid fa-bolt"></i> {state.shockCount || 0}
              </span>
              <span className="text-slate-300">|</span>
              <span className="text-[#E3000F]">
                {displayJoule} J
              </span>
            </div>
          </button>
        );
      
      case CPR_CONFIG.PHASES.AIRWAY_MENU: return <ViewAirwayMenu />;
      case CPR_CONFIG.PHASES.AIRWAY_DOC: return <ViewAirwayDoc />;
      case CPR_CONFIG.PHASES.DECISION: return <ViewDecision />;
      case CPR_CONFIG.PHASES.JOULE: return <ViewJoule />;
      case CPR_CONFIG.PHASES.WAITING_CPR_RESUME: return <ViewCprResume />;
      case CPR_CONFIG.PHASES.ZUGANG: return <ViewZugang />; // <--- NEU
      case CPR_CONFIG.PHASES.MEDS_MENU: return <ViewMedsMenu />; // <--- NEU HINZUFÜGEN
      default: return <PatientSelection />;
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center transition-all duration-500">
      {state.appPhase === CPR_CONFIG.PHASES.ONBOARDING && (
        <div className="absolute -top-[75px] w-full flex flex-col items-center justify-center text-center animate-in fade-in slide-in-from-bottom-4 duration-500 z-10">
           <h1 className="text-[26px] font-black text-slate-800 uppercase tracking-[0.2em] drop-shadow-sm leading-none mb-1">
             Einsatz Starten
           </h1>
           <div className="w-12 h-[3px] bg-[#E3000F] rounded-full opacity-80 mt-2"></div>
        </div>
      )}

      <div 
        style={{ width: circleSize, height: circleSize }}
        className={`rounded-full border-4 flex items-center justify-center relative overflow-hidden shrink-0 transition-all duration-500 mx-auto z-20 ${state.appPhase === CPR_CONFIG.PHASES.RUNNING && isEscalated ? 'shadow-[0_0_50px_rgba(227,0,15,0.4)] border-red-200 bg-red-50' : 'shadow-[0_15px_40px_rgba(0,0,0,0.08)] border-slate-100 bg-white'}`}
      >
        {renderPhase()}
      </div>
    </div>
  );
}