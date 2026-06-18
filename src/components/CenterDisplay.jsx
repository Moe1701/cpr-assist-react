// --- Datei: src/components/CenterDisplay.jsx ---
import React, { useContext } from 'react';
import { CprContext } from '../context/CprContext.jsx';
import { CPR_CONFIG } from '../config/cprConfig.js';

import PatientSelection from './PatientSelection.jsx';
import ViewAirwayMenu from './views/ViewAirwayMenu.jsx';
import ViewAirwayDoc from './views/ViewAirwayDoc.jsx';

export default function CenterDisplay() {
  const { state, dispatch, logEvent } = useContext(CprContext);

  const isSmallCircle = state.appPhase === CPR_CONFIG.PHASES.RUNNING;
  const circleSize = isSmallCircle ? '224px' : '340px';

  const formatCprTime = (seconds) => {
    if (isNaN(seconds) || seconds === null) return "00:00";
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Löst zu jedem Zeitpunkt die Analyse-Sequenz aus
  const handleManualAnalyze = () => {
    // 1. CPR (Metronom) sofort stoppen!
    dispatch({ type: 'TOGGLE_COMPRESSION', payload: false });
    logEvent(CPR_CONFIG.EVENTS.PAUSE, "Rhythmusanalyse gestartet");
    
    // 2. Direkt in die Auswahl (Schockbar/Nicht schockbar) springen
    dispatch({ type: 'SET_PHASE', payload: CPR_CONFIG.PHASES.DECISION });
  };

  const renderPhase = () => {
    switch (state.appPhase) {
      
      // 1. Das Live-Dashboard (120s Loop)
      case CPR_CONFIG.PHASES.RUNNING: {
        const remaining = Math.max(0, 120 - (state.cycleSeconds || 0));

        // Dynamische Farb- und Textlogik nach deinen Vorgaben!
        let ringColor = "text-cyan-500";
        let topText = "BEI ANALYSE DRÜCKEN";
        let textColor = "text-slate-400";
        let isPulsing = false;

        if (remaining === 0) {
          ringColor = "text-red-600";
          topText = "ANALYSE FÄLLIG!";
          textColor = "text-red-600";
          isPulsing = true;
        } else if (remaining <= 15) {
          ringColor = "text-amber-500"; // Gelb
          topText = "PULS TASTEN, DEFI LADEN";
          textColor = "text-amber-600";
          isPulsing = true;
        } else if (remaining <= 30) {
          ringColor = "text-emerald-500"; // Grün
          topText = "ANALYSE VORBEREITEN";
          textColor = "text-emerald-600";
        }

        // SVG Kreis-Mathematik für den Ring
        const strokeWidth = 4;
        const radius = 50 - strokeWidth / 2;
        const circumference = 2 * Math.PI * radius;
        const progress = remaining / 120; 
        const strokeDashoffset = circumference * (1 - progress);

        // Default Joule-Wert falls noch kein Schock abgegeben wurde
        const defaultJoule = state.isPediatric && state.patientWeight ? Math.round(state.patientWeight * 4) : 150;
        const displayJoule = state.lastJoule || defaultJoule;

        return (
          <button 
            onClick={handleManualAnalyze}
            className="w-full h-full flex flex-col items-center justify-center p-6 bg-white rounded-full shadow-[inset_0_0_20px_rgba(0,0,0,0.02)] hover:bg-slate-50 active:scale-95 transition-all relative overflow-hidden cursor-pointer"
          >
            {/* SVG Timer Ring (liegt unter dem Text) */}
            <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r={radius} fill="none" stroke="#f8fafc" strokeWidth={strokeWidth} />
              <circle
                  cx="50" cy="50" r={radius}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={strokeWidth}
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className={`transition-all duration-1000 ease-linear ${ringColor}`}
              />
            </svg>

            {/* Dynamischer Warn-Text oben */}
            <div className={`text-[10px] font-black uppercase tracking-widest mb-1 z-10 transition-colors ${textColor} ${isPulsing ? 'animate-pulse' : ''} text-center leading-tight`}>
              {topText}
            </div>
            
            {/* 120s Countdown in der Mitte */}
            <div className="text-[64px] font-black text-[#1e293b] tracking-tighter leading-none mb-3 font-mono z-10">
               {formatCprTime(remaining)}
            </div>
            
            {/* Schocks & Joule unten */}
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
      }
      
      // 2. Das Atemwegs-Auswahlmenü
      case CPR_CONFIG.PHASES.AIRWAY_MENU:
        return <ViewAirwayMenu />;
      
      // 3. Die Doku für den invasiven Atemweg
      case CPR_CONFIG.PHASES.AIRWAY_DOC:
        return <ViewAirwayDoc />;
        
      // 4. Alle anderen Phasen (Onboarding, Analyse etc.) gehen an den Unter-Router
      default:
        return <PatientSelection />;
    }
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
