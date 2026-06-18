// --- Datei: src/components/dashboard/AirwayButton.jsx ---
import React, { useContext } from 'react';
import { CprContext } from '../../context/CprContext.jsx';
import { CPR_CONFIG } from '../../config/cprConfig.js';
import { useAirwayTimer } from '../../hooks/useAirwayTimer.js';

export default function AirwayButton() {
  const { state, dispatch } = useContext(CprContext);
  const { isFlashingHub } = useAirwayTimer();

  const handleClick = () => {
    dispatch({ type: 'SET_PHASE', payload: CPR_CONFIG.PHASES.AIRWAY_MENU });
  };

  // ==========================================
  // LOGIK 1: ESKALATIONS-AMPEL & NAMEN
  // ==========================================
  let btnClass = "bg-white text-slate-600 border-slate-200 shadow-sm"; 
  let iconClass = "text-slate-400";
  let icon = "fa-lungs";
  let label = "Atemweg";
  
  if (state.airwayEstablished) {
    // Wenn etabliert -> Grau/Neutral und passender Text
    if (state.airwayType === 'Beutel-Maske') { label = "BVM"; icon = "fa-mask-ventilator"; }
    else if (state.airwayType === 'ET-Tubus') { label = "Tubus"; icon = "fa-lungs"; }
    else if (state.airwayType === 'Larynxmaske') { label = "LAMA"; icon = "fa-lungs"; }
    else if (state.airwayType === 'Larynxtubus') { label = "LTS"; icon = "fa-lungs"; }
    else { label = state.airwayType || "Atemweg"; icon = "fa-lungs"; }
  } else {
    // Wenn NICHT etabliert -> Ampel Eskalation
    if (state.missionSeconds >= 60) {
      btnClass = "bg-red-50 text-red-600 border-red-500 shadow-[0_0_20px_rgba(227,0,15,0.4)] animate-pulse";
      iconClass = "text-red-500";
    } else {
      btnClass = "bg-amber-50 text-amber-600 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)] animate-pulse";
      iconClass = "text-amber-500";
    }
  }

  // ==========================================
  // LOGIK 2: KONT-MODUS ("HUB!" Flashen)
  // ==========================================
  if (isFlashingHub) {
    btnClass = "bg-cyan-500 text-white border-cyan-400 shadow-[0_0_40px_rgba(6,182,212,0.8)] scale-105 transition-all duration-75";
    iconClass = "text-white";
    label = "HUB!";
  }

  // ==========================================
  // LOGIK 3: BVM-COUNTDOWN (Die letzten 5 Kompressionen)
  // ==========================================
  let bvmCountdown = null;
  if (state.cprMode !== 'continuous' && state.isCompressing && !state.isVentilationPhase) {
    const limit = state.isPediatric ? 15 : 30;
    const remaining = limit - state.compressionCount;
    if (remaining > 0 && remaining <= 5) {
      bvmCountdown = remaining;
    }
  }

  return (
    <div className="relative pointer-events-auto z-50">
      <button 
        onClick={handleClick} 
        className={`w-[100px] h-[100px] rounded-full border-[3px] flex flex-col items-center justify-center gap-1.5 active:scale-95 transition-all ${btnClass}`}
      >
        <i className={`fa-solid ${icon} text-[32px] pointer-events-none transition-colors ${iconClass}`}></i>
        <span className="text-[10px] font-black uppercase tracking-widest leading-none text-center px-1 pointer-events-none">{label}</span>
      </button>

      {/* BVM Countdown Badge (Pulsierend) */}
      {bvmCountdown !== null && (
        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-[16px] font-black w-8 h-8 rounded-full flex items-center justify-center shadow-lg border-[2px] border-white animate-bounce pointer-events-none">
          {bvmCountdown}
        </div>
      )}
      
      {/* Das Ausrufezeichen-Badge */}
      {!state.airwayEstablished && state.missionSeconds >= 60 && bvmCountdown === null && (
        <div className="absolute -top-1 -right-1 bg-red-600 text-white text-[12px] font-black w-7 h-7 rounded-full flex items-center justify-center shadow-md border-[2px] border-white pointer-events-none">
          !!!
        </div>
      )}
    </div>
  );
}