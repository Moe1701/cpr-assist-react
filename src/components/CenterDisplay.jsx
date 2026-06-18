// --- Datei: src/components/CenterDisplay.jsx ---
import React from 'react';
import { CPR_CONFIG } from '../config/cprConfig.js';
import { useCenterEngine } from '../hooks/useCenterEngine.js';

import PatientSelection from './PatientSelection.jsx';
import ViewAirwayMenu from './views/ViewAirwayMenu.jsx';
import ViewAirwayDoc from './views/ViewAirwayDoc.jsx';

// NEU IMPORTIERT: Die fehlenden Analyse-Ansichten
import ViewDecision from './views/ViewDecision.jsx';
import ViewJoule from './views/ViewJoule.jsx';
import ViewCprResume from './views/ViewCprResume.jsx';

export default function CenterDisplay() {
  
  const { 
    state, circleSize, formatCprTime, handleManualAnalyze, 
    remaining, ringColor, topText, textColor, isPulsing, 
    radius, strokeDasharray, strokeWidth, displayJoule 
  } = useCenterEngine();

  const renderPhase = () => {
    switch (state.appPhase) {
      
      case CPR_CONFIG.PHASES.RUNNING: 
        return (
          <button 
            onClick={handleManualAnalyze}
            className="w-full h-full flex flex-col items-center justify-center p-6 bg-white rounded-full shadow-[inset_0_0_20px_rgba(0,0,0,0.02)] hover:bg-slate-50 active:scale-95 transition-all relative overflow-hidden cursor-pointer"
          >
            <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r={radius} fill="none" stroke="#f8fafc" strokeWidth={strokeWidth} />
              {/* BUGFIX SVG: Nur noch strokeDasharray, kein Offset mehr! */}
              <circle
                  cx="50" cy="50" r={radius}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeLinecap="round"
                  className={`transition-all duration-1000 ease-linear ${ringColor}`}
              />
            </svg>

            <div className={`text-[10px] font-black uppercase tracking-widest mb-1 z-10 transition-colors ${textColor} ${isPulsing ? 'animate-pulse' : ''} text-center leading-tight`}>
              {topText}
            </div>
            
            <div className="text-[64px] font-black text-[#1e293b] tracking-tighter leading-none mb-3 font-mono z-10">
               {formatCprTime(remaining)}
            </div>
            
            <div className="flex items-center justify-center gap-3 text-[14px] font-black tracking-widest mt-1 z-10 w-full">
              <span className="text-amber-500 flex items-center gap-1.5">
                <i className="fa-solid fa-bolt"></i> {state.shockCount || 0}
              </span>
              <span className="text-slate-200">|</span>
              <span className="text-[#E3000F]">
                {displayJoule} J
              </span>
            </div>
          </button>
        );
      
      case CPR_CONFIG.PHASES.AIRWAY_MENU: return <ViewAirwayMenu />;
      case CPR_CONFIG.PHASES.AIRWAY_DOC: return <ViewAirwayDoc />;
      
      // NEU HINZUGEFÜGT: Der App sagen, was sie rendern soll!
      case CPR_CONFIG.PHASES.DECISION: return <ViewDecision />;
      case CPR_CONFIG.PHASES.JOULE: return <ViewJoule />;
      case CPR_CONFIG.PHASES.WAITING_CPR_RESUME: return <ViewCprResume />;
      
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
        className="rounded-full shadow-[0_15px_40px_rgba(0,0,0,0.08)] border-4 border-slate-100 flex items-center justify-center relative overflow-hidden bg-white shrink-0 transition-all duration-500 mx-auto z-20"
      >
        {renderPhase()}
      </div>
    </div>
  );
}
