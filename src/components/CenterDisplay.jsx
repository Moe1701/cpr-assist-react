// --- Datei: src/components/CenterDisplay.jsx ---
import React, { useContext } from 'react';
import { CprContext } from '../context/CprContext.jsx';
import { CPR_CONFIG } from '../config/cprConfig.js';

// Importiere alle unsere Views
import ViewObPatient from './views/ViewObPatient.jsx';
import ViewObInitialBreaths from './views/ViewObInitialBreaths.jsx';
import ViewObCompressions from './views/ViewObCompressions.jsx';
import ViewObAnalyze from './views/ViewObAnalyze.jsx';
import ViewJoule from './views/ViewJoule.jsx';
import ViewCprResume from './views/ViewCprResume.jsx';

export default function CenterDisplay() {
  const { state } = useContext(CprContext);

  const isDashboard = state.appPhase === CPR_CONFIG.PHASES.RUNNING;
  
  // Die Magie: Das Fenster wird im Dashboard-Modus kleiner und rund!
  const circleSize = isDashboard ? '224px' : '320px'; 
  const circleHeight = isDashboard ? '224px' : '450px';
  const radius = isDashboard ? '9999px' : '3rem';

  const formatCprTime = (seconds) => {
    if (isNaN(seconds) || seconds === null) return "00:00";
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Unser alter Router ist jetzt hier drinnen!
  const renderPhase = () => {
    let CurrentView;
    switch (state.appPhase) {
      case CPR_CONFIG.PHASES.ONBOARDING:
        CurrentView = ViewObPatient; break;
      case CPR_CONFIG.PHASES.OB_INITIAL_BREATHS:
        CurrentView = ViewObInitialBreaths; break;
      case CPR_CONFIG.PHASES.OB_COMPRESSIONS:
        CurrentView = ViewObCompressions; break;
      case CPR_CONFIG.PHASES.OB_ANALYZE:
        CurrentView = ViewObAnalyze; break;
      case CPR_CONFIG.PHASES.JOULE:
        CurrentView = ViewJoule; break;
      case CPR_CONFIG.PHASES.WAITING_CPR_RESUME:
        CurrentView = ViewCprResume; break;
      case CPR_CONFIG.PHASES.RUNNING:
        // DAS IST DAS ECHTE ZENTRUM DES DASHBOARDS (Runder Timer)
        return (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-white rounded-full shadow-[inset_0_0_20px_rgba(0,0,0,0.02)] animate-in zoom-in-95 duration-500">
            <div className="absolute top-5 w-10 h-1.5 bg-cyan-500 rounded-full"></div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em] mb-1">
               Nächste Analyse
            </div>
            
            {/* Wir zählen die 120 Sekunden rückwärts! */}
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
      default:
        CurrentView = ViewObPatient;
    }
    return <CurrentView />;
  };

  return (
    <div className="relative flex flex-col items-center justify-center transition-all duration-500">
      
      {/* Überschrift beim Onboarding */}
      {state.appPhase === CPR_CONFIG.PHASES.ONBOARDING && (
        <div className="absolute -top-[70px] w-full flex flex-col items-center justify-center text-center animate-in fade-in slide-in-from-bottom-4 duration-500 z-10">
           <h1 className="text-[26px] font-black text-slate-800 uppercase tracking-[0.2em] drop-shadow-sm leading-none mb-1">
             Einsatz Starten
           </h1>
           <div className="w-12 h-[3px] bg-[#E3000F] rounded-full opacity-80 mt-2"></div>
        </div>
      )}

      {/* Die Box/Der Kreis */}
      <div 
        style={{ width: circleSize, height: circleHeight, borderRadius: radius }}
        className="shadow-xl border-4 border-slate-100 flex items-center justify-center relative overflow-hidden bg-white shrink-0 transition-all duration-500 mx-auto z-20"
      >
        {renderPhase()}
      </div>
    </div>
  );
}