// --- Datei: src/components/dashboard/AdrenalinButton.jsx ---
import React, { useContext, useEffect, useRef } from 'react';
import { CprContext } from '../../context/CprContext.jsx';
import { CPR_CONFIG } from '../../config/cprConfig.js';

const playAdrAlarm = (isMuted) => {
  if (isMuted || !window.CPR_AudioCtx) return;
  try {
    const ctx = window.CPR_AudioCtx;
    if(ctx.state === 'suspended') ctx.resume();
    
    const playBeep = (startTime) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(880, startTime);
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.3, startTime + 0.05);
        gain.gain.setValueAtTime(0.3, startTime + 0.2);
        gain.gain.linearRampToValueAtTime(0, startTime + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.35);
    };

    playBeep(ctx.currentTime);
    playBeep(ctx.currentTime + 0.4);
  } catch (e) {
    console.warn("Audio Context failed:", e);
  }
};

export default function AdrenalinButton() {
  const { state, dispatch, logEvent } = useContext(CprContext);

  // KRITISCHER FIX: Eiserne Trennung zwischen Kind und Erwachsenen
  const dose = state.isPediatric 
    ? (state.patientWeight ? `${Math.round(state.patientWeight * 10)} µg` : '?? µg (Gewicht!)')
    : '1 mg';

  const isActive = state.adrSeconds > 0;
  const remaining = isActive ? 240 - state.adrSeconds : 0;
  const isWarning = isActive && remaining <= 30;

  const prevAdrRef = useRef(state.adrSeconds);
  useEffect(() => {
    if (prevAdrRef.current >= 239 && state.adrSeconds === 0) {
      if (navigator.vibrate) navigator.vibrate([200, 100, 200, 100, 200]);
      playAdrAlarm(state.isMuted);
    }
    prevAdrRef.current = state.adrSeconds;
  }, [state.adrSeconds, state.isMuted]);

  const handleClick = () => {
    if (isActive) return; 
    logEvent(CPR_CONFIG.EVENTS.DRUG, `Adrenalin ${dose} gegeben`);
    dispatch({ type: 'GIVE_ADRENALIN' });
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const strokeWidth = 5;
  const radius = 43 - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = isActive ? state.adrSeconds / 240 : 0;
  const strokeDasharray = `${circumference * progress} ${circumference}`;

  const hasWeightWarning = dose.includes('??');

  return (
    <div className="relative pointer-events-auto w-[86px] h-[86px]">
      <button
        onClick={handleClick}
        className={`w-full h-full rounded-full shadow-sm border-[3px] flex flex-col items-center justify-center gap-1 active:scale-95 transition-all overflow-hidden relative cursor-pointer ${isActive ? 'bg-white border-slate-100' : 'bg-white border-emerald-400 hover:bg-slate-50'}`}
      >
        {isActive && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 86 86">
            <circle cx="43" cy="43" r={radius} fill="none" stroke="#f1f5f9" strokeWidth={strokeWidth} transform="rotate(-90 43 43)" />
            <circle
              cx="43" cy="43" r={radius} fill="none" stroke="#E3000F" strokeWidth={strokeWidth}
              strokeDasharray={strokeDasharray} strokeLinecap="round" transform="rotate(-90 43 43)"
              className="transition-all duration-1000 ease-linear"
            />
          </svg>
        )}

        <div className={`absolute inset-0 flex flex-col items-center justify-center w-full h-full transition-opacity duration-200 pointer-events-none ${isActive ? 'opacity-0' : 'opacity-100'}`}>
          <i className={`fa-solid fa-syringe text-[24px] mb-0.5 ${hasWeightWarning ? 'text-red-500' : 'text-emerald-600'}`}></i>
          <span className={`text-[9px] font-black uppercase tracking-wider leading-none text-center px-1 ${hasWeightWarning ? 'text-red-500' : 'text-emerald-600'}`}>
            {hasWeightWarning ? '?? µg' : dose}
          </span>
        </div>

        {isActive && (
          <div className={`absolute inset-0 flex items-center justify-center w-full h-full z-30 rounded-full bg-white/60 backdrop-blur-[1px] text-[18px] font-black tracking-tighter pointer-events-none ${isWarning ? 'text-[#E3000F] animate-pulse' : 'text-slate-700'}`}>
            {formatTime(remaining)}
          </div>
        )}
      </button>

      {state.adrCount > 0 && (
        <div className="absolute -top-2 -right-2 bg-[#E3000F] text-white text-[12px] font-black px-2 min-w-[26px] h-7 flex items-center justify-center rounded-full shadow-md border-2 border-white z-40 pointer-events-none">
          {state.adrCount}
        </div>
      )}
    </div>
  );
}