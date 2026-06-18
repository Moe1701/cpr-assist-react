// --- Datei: src/hooks/useCenterEngine.js ---
import { useContext } from 'react';
import { CprContext } from '../context/CprContext.jsx';
import { CPR_CONFIG } from '../config/cprConfig.js';

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
  let topText = "BEI ANALYSE DRÜCKEN";
  let textColor = "text-slate-400";
  let isPulsing = false;

  if (remaining === 0) {
    ringColor = "text-red-600";
    topText = "ANALYSE FÄLLIG!";
    textColor = "text-red-600";
    isPulsing = true;
  } else if (remaining <= 15) {
    ringColor = "text-amber-500";
    topText = "PULS TASTEN, DEFI LADEN";
    textColor = "text-amber-600";
    isPulsing = true;
  } else if (remaining <= 30) {
    ringColor = "text-emerald-500";
    topText = "ANALYSE VORBEREITEN";
    textColor = "text-emerald-600";
  }

  // BUGFIX: SVG Render-Mathematik (Zwingt das SVG auf 12 Uhr + Uhrzeigersinn!)
  const strokeWidth = 4;
  const radius = 50 - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;
  
  const elapsed = 120 - remaining; 
  const progress = elapsed / 120; 
  
  // Hier ist die Magie: Wir malen einen Strich exakt so lang wie der Progress, gefolgt von einer Lücke, die den Rest ausfüllt!
  const strokeDasharray = `${circumference * progress} ${circumference}`;

  const defaultJoule = state.isPediatric && state.patientWeight ? Math.round(state.patientWeight * 4) : 150;
  const displayJoule = state.lastJoule || defaultJoule;

  return {
    state, circleSize, formatCprTime, handleManualAnalyze, remaining, ringColor, topText, textColor, 
    isPulsing, radius, strokeDasharray, strokeWidth, displayJoule
  };
}
