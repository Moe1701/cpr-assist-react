// --- Datei: src/hooks/useCenterEngine.js ---
import { useContext, useEffect } from 'react';
import { CprContext } from '../context/CprContext.jsx';
import { CPR_CONFIG } from '../config/cprConfig.js';

// NEU: Audio-Generator für den Eskalations-Alarm
const playAlarmSound = (isMuted) => {
  if (isMuted || !window.CPR_AudioCtx) return;
  try {
    const ctx = window.CPR_AudioCtx;
    if(ctx.state === 'suspended') ctx.resume();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sawtooth';
    // Durchdringender Doppelton (A5 zu C#6)
    osc.frequency.setValueAtTime(880, ctx.currentTime); 
    osc.frequency.setValueAtTime(1108.73, ctx.currentTime + 0.1); 
    
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 0.05);
    gain.gain.setValueAtTime(0.25, ctx.currentTime + 0.2);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.35);
  } catch (e) {
    console.warn("Audio Context failed:", e);
  }
};

export function useCenterEngine() {
  const { state, dispatch, logEvent } = useContext(CprContext);

  const isSmallCircle = state.appPhase === CPR_CONFIG.PHASES.RUNNING;
  const circleSize = isSmallCircle ? '224px' : '340px';

  const formatCprTime = (seconds) => {
    if (isNaN(seconds) || seconds === null) return "00:00";
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleManualAnalyze = () => {
    dispatch({ type: 'TOGGLE_COMPRESSION', payload: false });
    logEvent(CPR_CONFIG.EVENTS.PAUSE, "Rhythmusanalyse gestartet");
    dispatch({ type: 'SET_PHASE', payload: CPR_CONFIG.PHASES.DECISION });
  };

  const remaining = Math.max(0, 120 - (state.cycleSeconds || 0));
  
  let ringColor = "text-cyan-500";
  let warningText = "BEI ANALYSE DRÜCKEN"; // Umbenannt, da es jetzt unten steht
  let textColor = "text-slate-400";
  let isPulsing = false;
  let isEscalated = false; 

  if (remaining === 0) {
    ringColor = "text-[#E3000F]"; 
    warningText = "ANALYSE FÄLLIG!"; 
    textColor = "text-red-600"; 
    isEscalated = true; 
  } else if (remaining <= 15) {
    ringColor = "text-amber-500"; 
    warningText = "PULS TASTEN, DEFI LADEN";
    textColor = "text-amber-600";
    isPulsing = true;
  } else if (remaining <= 30) {
    ringColor = "text-emerald-500"; 
    warningText = "ANALYSE VORBEREITEN";
    textColor = "text-emerald-600";
  }

  // NEU: Der akustische Alarm-Loop
  useEffect(() => {
    let alarmInterval;
    // Wenn 0 Sekunden erreicht sind und wir im aktiven Dashboard sind
    if (remaining === 0 && state.appPhase === CPR_CONFIG.PHASES.RUNNING && !state.isMuted) {
      playAlarmSound(state.isMuted); // Sofort 1x piepen
      alarmInterval = setInterval(() => {
        playAlarmSound(state.isMuted); // Dann jede Sekunde wiederholen
      }, 1000);
    }
    return () => clearInterval(alarmInterval); // Stoppt, sobald Analyse gedrückt wird!
  }, [remaining, state.appPhase, state.isMuted]);

  const strokeWidth = 4;
  const radius = 50 - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;
  const elapsed = 120 - remaining; 
  const progress = elapsed / 120; 
  const strokeDasharray = `${circumference * progress} ${circumference}`;

  const defaultJoule = state.isPediatric && state.patientWeight ? Math.round(state.patientWeight * 4) : 150;
  const displayJoule = state.lastJoule || defaultJoule;

  return {
    state, circleSize, formatCprTime, handleManualAnalyze, remaining, ringColor, warningText, textColor, 
    isPulsing, isEscalated, radius, strokeDasharray, strokeWidth, displayJoule
  };
}
