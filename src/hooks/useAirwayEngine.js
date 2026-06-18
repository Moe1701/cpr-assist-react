// --- Datei: src/hooks/useAirwayEngine.js ---
import { useContext, useEffect, useRef } from 'react';
import { CprContext } from '../context/CprContext.jsx';
import { CPR_CONFIG } from '../config/cprConfig.js';

// Synthetisches Atemgeräusch
const playBreathSound = (isMuted) => {
  if (isMuted || !window.CPR_AudioCtx) return;
  try {
    const ctx = window.CPR_AudioCtx;
    if(ctx.state === 'suspended') ctx.resume();
    const bufferSize = ctx.sampleRate * 1.0;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 800;
    
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.4, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.4, ctx.currentTime + 0.8);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.0);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    source.start();
  } catch (e) {
    console.warn("Audio Context failed:", e);
  }
};

export function useAirwayEngine() {
  const { state, dispatch } = useContext(CprContext);

  // DOM-Referenzen für 60FPS-Manipulation
  const glowRef = useRef(null);
  const iconRef = useRef(null);
  const textRef = useRef(null);
  const badgeRef = useRef(null);
  const escalationBadgeRef = useRef(null);

  const handleClick = () => {
    dispatch({ type: 'SET_PHASE', payload: CPR_CONFIG.PHASES.AIRWAY_MENU });
  };

  // --- BASIS LAYOUT BERECHNEN ---
  let btnClass = "bg-white border-slate-200 shadow-sm"; 
  let iconClass = "text-slate-400";
  let textClass = "text-slate-400";
  let icon = "fa-lungs";
  let label = "Atemweg";
  
  if (state.airwayEstablished) {
    iconClass = "text-slate-600"; textClass = "text-slate-600";
    if (state.airwayType === 'Beutel-Maske') { label = "BVM"; icon = "fa-mask-ventilator"; }
    else if (state.airwayType === 'ET-Tubus') { label = "Tubus"; icon = "fa-lungs"; }
    else if (state.airwayType === 'Larynxmaske') { label = "LAMA"; icon = "fa-lungs"; }
    else if (state.airwayType === 'Larynxtubus') { label = "LTS"; icon = "fa-lungs"; }
    else { label = state.airwayType || "Atemweg"; }
  } else {
    if (state.missionSeconds >= 60) {
      btnClass = "bg-red-50 border-red-500 shadow-[0_0_20px_rgba(227,0,15,0.4)] animate-pulse";
      iconClass = "text-red-500"; textClass = "text-red-600";
    } else {
      btnClass = "bg-amber-50 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)] animate-pulse";
      iconClass = "text-amber-500"; textClass = "text-amber-600";
    }
  }

  // --- ANIMATION 1: KONT-MODUS (RAF Loop) ---
  useEffect(() => {
    const isInvasive = state.airwayEstablished && state.airwayType !== 'Beutel-Maske';
    const isContinuous = state.cprMode === 'continuous';

    const resetVisuals = () => {
      if (glowRef.current) { glowRef.current.style.opacity = '0'; glowRef.current.style.transform = 'scale(1)'; glowRef.current.style.boxShadow = 'none'; }
      if (iconRef.current) iconRef.current.className = `fa-solid ${icon} text-[32px] transition-colors ${iconClass}`;
      if (textRef.current) { textRef.current.innerText = label; textRef.current.className = `text-[10px] font-black uppercase tracking-widest leading-none text-center px-1 mt-1 transition-colors ${textClass}`; }
      if (badgeRef.current) badgeRef.current.style.opacity = '0';
      if (escalationBadgeRef.current && !state.airwayEstablished) escalationBadgeRef.current.style.opacity = '1';
    };

    if (!isInvasive || !isContinuous || !state.isCompressing) {
      resetVisuals();
      return;
    }

    if (escalationBadgeRef.current) escalationBadgeRef.current.style.opacity = '0';

    const intervalMs = state.isPediatric ? 2400 : 6000;
    const fillDuration = intervalMs - 1000; 
    let cycleStart = Date.now() - fillDuration; 
    let rafId;
    let hasBreathed = false;

    const loop = () => {
      const now = Date.now();
      const elapsed = now - cycleStart;
      if (elapsed >= intervalMs) { cycleStart = now; hasBreathed = false; }
      const timeInCycle = now - cycleStart;

      glowRef.current.style.transitionDuration = '0ms';
      iconRef.current.style.transitionDuration = '0ms';
      textRef.current.style.transitionDuration = '0ms';

      if (timeInCycle < fillDuration) {
        const progress = timeInCycle / fillDuration;
        glowRef.current.style.backgroundColor = '#67e8f9';
        glowRef.current.style.opacity = (0.1 + (0.6 * progress)).toString();
        glowRef.current.style.transform = `scale(${1.0 + (0.05 * progress)})`;
        glowRef.current.style.boxShadow = 'none';

        iconRef.current.className = `fa-solid ${icon} text-[32px] text-cyan-500`;
        textRef.current.innerText = label;
        textRef.current.className = "text-[10px] font-black uppercase tracking-widest leading-none text-center px-1 mt-1 text-cyan-500";

        const remainingSecs = Math.ceil((fillDuration - timeInCycle) / 1000);
        badgeRef.current.innerText = remainingSecs;
        badgeRef.current.className = "absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center shadow-lg border-[2px] border-white font-black text-white text-[16px] pointer-events-none bg-slate-800 opacity-100 z-20";
        hasBreathed = false;
      } else {
        if (!hasBreathed) {
          playBreathSound(state.isMuted);
          if (navigator.vibrate) navigator.vibrate(30);
          hasBreathed = true;
        }
        glowRef.current.style.backgroundColor = '#22d3ee';
        glowRef.current.style.opacity = '0.85';
        glowRef.current.style.transform = 'scale(1.15)';
        glowRef.current.style.boxShadow = '0 0 20px rgba(34,211,238,0.6)';

        iconRef.current.className = `fa-solid ${icon} text-[32px] text-[#E3000F]`;
        textRef.current.innerText = "BEATMEN";
        textRef.current.className = "text-[10px] font-black uppercase tracking-widest leading-none text-center px-1 mt-1 text-[#E3000F]";
        badgeRef.current.style.opacity = '0';
      }
      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(rafId); resetVisuals(); };
  }, [state.airwayEstablished, state.airwayType, state.cprMode, state.isCompressing, state.isPediatric, state.isMuted, icon, label, iconClass, textClass]);

  // --- ANIMATION 2A: 30:2 Vorwarnung ---
  useEffect(() => {
    if (state.cprMode === 'continuous') return;
    const limit = state.isPediatric ? 15 : 30;
    const remaining = limit - state.compressionCount;

    if (state.isCompressing && !state.isVentilationPhase && remaining > 0 && remaining <= 5) {
      badgeRef.current.innerText = remaining;
      badgeRef.current.className = "absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center shadow-lg border-[2px] border-white font-black text-white text-[16px] pointer-events-none bg-amber-500 animate-pulse opacity-100 z-20";
      if (remaining <= 3 && navigator.vibrate) navigator.vibrate(20);
    } else if (!state.isVentilationPhase) {
      if (badgeRef.current) badgeRef.current.style.opacity = '0';
    }
  }, [state.compressionCount, state.cprMode, state.isCompressing, state.isVentilationPhase, state.isPediatric]);

  // --- ANIMATION 2B: 30:2 Doppelflash ---
  useEffect(() => {
    if (state.cprMode === 'continuous' || !state.isVentilationPhase) return;
    if (badgeRef.current) badgeRef.current.style.opacity = '0';
    if (escalationBadgeRef.current) escalationBadgeRef.current.style.opacity = '0';
    if (glowRef.current) glowRef.current.style.transitionDuration = '500ms';

    const triggerFlash = () => {
      playBreathSound(state.isMuted);
      if (navigator.vibrate) navigator.vibrate(30);
      if (glowRef.current) {
        glowRef.current.style.backgroundColor = '#22d3ee';
        glowRef.current.style.opacity = '0.85';
        glowRef.current.style.transform = 'scale(1.15)';
        glowRef.current.style.boxShadow = '0 0 30px rgba(34,211,238,0.7)';
      }
      if (iconRef.current) iconRef.current.className = `fa-solid ${icon} text-[32px] text-[#E3000F] transition-colors duration-200`;
      if (textRef.current) {
        textRef.current.innerText = "BEATMEN";
        textRef.current.className = "text-[10px] font-black uppercase tracking-widest leading-none text-center px-1 mt-1 text-[#E3000F] transition-colors duration-200";
      }
    };

    const resetFlash = () => {
      if (glowRef.current) { glowRef.current.style.opacity = '0.1'; glowRef.current.style.transform = 'scale(1)'; glowRef.current.style.boxShadow = 'none'; }
      if (iconRef.current) iconRef.current.className = `fa-solid ${icon} text-[32px] text-cyan-500 transition-colors duration-500`;
      if (textRef.current) {
        textRef.current.innerText = label;
        textRef.current.className = "text-[10px] font-black uppercase tracking-widest leading-none text-center px-1 mt-1 text-cyan-500 transition-colors duration-500";
      }
    };

    triggerFlash(); 
    const t1 = setTimeout(resetFlash, 1000); 
    const t2 = setTimeout(triggerFlash, 1500); 
    const t3 = setTimeout(resetFlash, 2500); 

    return () => {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3);
      if (glowRef.current) { glowRef.current.style.opacity = '0'; glowRef.current.style.transitionDuration = '0ms'; }
    };
  }, [state.isVentilationPhase, state.cprMode, state.isMuted, icon, label]);

  return { glowRef, iconRef, textRef, badgeRef, escalationBadgeRef, handleClick, btnClass, icon, label, iconClass, textClass };
}