// --- Datei: src/hooks/useAirwayEngine.js ---
import { useContext, useEffect, useRef } from 'react';
import { CprContext } from '../context/CprContext.jsx';
import { CPR_CONFIG } from '../config/cprConfig.js';

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

  const glowRef = useRef(null);
  const iconRef = useRef(null);
  const textRef = useRef(null);
  const badgeRef = useRef(null);
  const escalationBadgeRef = useRef(null);

  const handleClick = () => {
    dispatch({ type: 'SET_PHASE', payload: CPR_CONFIG.PHASES.AIRWAY_MENU });
  };

  // ========================================================
  // 1. BASIS LAYOUT (Static)
  // ========================================================
  let btnClass = "border-slate-200 shadow-sm"; 
  let iconClass = "text-slate-400";
  let textClass = "text-slate-500";
  let icon = "fa-lungs";
  let labelTop = "ATEMWEG";
  let labelBottom = null;
  let isPill = false;
  let staticBadge = null;
  
  if (state.airwayEstablished) {
    iconClass = "text-slate-500"; 
    textClass = "text-slate-600";
    if (state.airwayType === 'Beutel-Maske') { labelTop = "BEUTEL-MASKE"; icon = "fa-mask-ventilator"; }
    else if (state.airwayType === 'ET-Tubus') { labelTop = "TUBUS"; icon = "fa-lungs"; }
    else if (state.airwayType === 'Larynxmaske') { labelTop = "LAMA"; icon = "fa-lungs"; }
    else if (state.airwayType === 'Larynxtubus') { labelTop = "LTS"; icon = "fa-lungs"; }
    else { labelTop = state.airwayType ? state.airwayType.toUpperCase() : "ATEMWEG"; }
  } else {
    isPill = true;
    if (state.missionSeconds >= 60) {
      btnClass = "border-red-500 shadow-[0_0_25px_rgba(227,0,15,0.35)] animate-pulse";
      iconClass = "text-[#E3000F]"; textClass = "text-[#E3000F]";
      labelTop = "BEATMUNG"; labelBottom = "ETABLIEREN!!!";
      staticBadge = { text: "!!!", bg: "bg-[#E3000F]" };
    } else {
      btnClass = "border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.25)] animate-pulse";
      iconClass = "text-amber-500"; textClass = "text-amber-500";
      labelTop = "ATEMWEG"; labelBottom = "DOKU FEHLT";
      staticBadge = { text: "!", bg: "bg-amber-500" };
    }
  }

  // ========================================================
  // 2. ANIMATION 1: KONT-MODUS (RAF Loop)
  // ========================================================
  useEffect(() => {
    const resetVisuals = () => {
      if (glowRef.current) { glowRef.current.style.opacity = '0'; glowRef.current.style.transform = 'scale(1)'; glowRef.current.style.boxShadow = 'none'; }
      if (iconRef.current) iconRef.current.className = `fa-solid ${icon} text-[28px] mb-0.5 transition-colors ${iconClass}`;
      if (textRef.current) { textRef.current.innerText = labelTop; textRef.current.className = `text-[9px] font-black uppercase tracking-wider leading-tight text-center transition-colors ${textClass}`; }
      if (badgeRef.current) badgeRef.current.style.opacity = '0';
      if (escalationBadgeRef.current && !state.airwayEstablished) escalationBadgeRef.current.style.opacity = '1';
    };

    if (!state.airwayEstablished || state.cprMode !== 'continuous' || !state.isCompressing) {
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
        // Füll-Phase
        const progress = timeInCycle / fillDuration;
        glowRef.current.style.backgroundColor = '#67e8f9';
        glowRef.current.style.opacity = (0.1 + (0.6 * progress)).toString();
        glowRef.current.style.transform = `scale(${1.0 + (0.05 * progress)})`;
        glowRef.current.style.boxShadow = 'none';

        iconRef.current.className = `fa-solid ${icon} text-[28px] mb-0.5 text-cyan-500`;
        textRef.current.innerText = labelTop;
        textRef.current.className = "text-[9px] font-black uppercase tracking-wider leading-tight text-center text-cyan-500";

        // FIX: Der dunkelblaue Badge für den KONT Modus
        const remainingSecs = Math.ceil((fillDuration - timeInCycle) / 1000);
        if (badgeRef.current) {
          badgeRef.current.innerText = remainingSecs;
          badgeRef.current.className = "absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center shadow-lg border-[2px] border-white font-black text-white text-[15px] pointer-events-none bg-slate-800 z-20";
          badgeRef.current.style.opacity = '1'; 
        }
        hasBreathed = false;
      } else {
        // Knall-Effekt (Beatmung)
        if (!hasBreathed) {
          playBreathSound(state.isMuted);
          if (navigator.vibrate) navigator.vibrate(30);
          hasBreathed = true;
        }
        glowRef.current.style.backgroundColor = '#06b6d4'; 
        glowRef.current.style.opacity = '1';
        glowRef.current.style.transform = 'scale(1.15)';
        glowRef.current.style.boxShadow = '0 0 25px rgba(6,182,212,0.6)';

        iconRef.current.className = `fa-solid fa-lungs text-[28px] mb-0.5 text-white`;
        textRef.current.innerText = "BEATMEN";
        textRef.current.className = "text-[10px] font-black uppercase tracking-widest leading-tight text-center text-white";
        if (badgeRef.current) badgeRef.current.style.opacity = '0';
      }
      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(rafId); resetVisuals(); };
  }, [state.airwayEstablished, state.airwayType, state.cprMode, state.isCompressing, state.isPediatric, state.isMuted, icon, labelTop, iconClass, textClass]);

  // ========================================================
  // 3. ANIMATION 2A: 30:2 / 15:2 VORWARNUNG
  // ========================================================
  useEffect(() => {
    // Wenn nicht etabliert oder in KONT, blende das Badge SOFORT aus!
    if (!state.airwayEstablished || state.cprMode === 'continuous') {
      if (badgeRef.current) {
        badgeRef.current.style.opacity = '0';
        badgeRef.current.innerText = '';
      }
      return;
    }
    
    const limit = state.isPediatric ? 15 : 30;
    const remaining = limit - state.compressionCount;

    // Countdown läuft nur in den letzten 5 Schlägen
    if (state.isCompressing && !state.isVentilationPhase && remaining > 0 && remaining <= 5) {
      if (badgeRef.current) {
        badgeRef.current.innerText = remaining;
        badgeRef.current.className = "absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center shadow-lg border-[2px] border-amber-400 font-black text-amber-600 text-[15px] pointer-events-none bg-amber-100 animate-pulse z-20";
        badgeRef.current.style.opacity = '1';
      }
      if (remaining <= 3 && navigator.vibrate) navigator.vibrate(20);
    } else {
      // FIX FÜR DIE HÄNGENDE "1": Sobald wir nicht mehr in der 1-5 Range sind,
      // MUSS das Badge gnadenlos unsichtbar gemacht und geleert werden!
      if (badgeRef.current) {
        badgeRef.current.style.opacity = '0';
        badgeRef.current.innerText = '';
      }
    }
  }, [state.compressionCount, state.cprMode, state.isCompressing, state.isVentilationPhase, state.isPediatric, state.airwayEstablished]);

  // ========================================================
  // 4. ANIMATION 2B: 30:2 / 15:2 DOPPELFLASH
  // ========================================================
  useEffect(() => {
    if (!state.airwayEstablished || state.cprMode === 'continuous' || !state.isVentilationPhase) return;
    
    if (badgeRef.current) badgeRef.current.style.opacity = '0';
    if (escalationBadgeRef.current) escalationBadgeRef.current.style.opacity = '0';
    
    if (glowRef.current) glowRef.current.style.transitionDuration = '300ms';

    const triggerFlash = () => {
      if (navigator.vibrate) navigator.vibrate(30);
      if (glowRef.current) {
        glowRef.current.style.backgroundColor = '#06b6d4'; 
        glowRef.current.style.opacity = '1'; 
        glowRef.current.style.transform = 'scale(1.15)';
        glowRef.current.style.boxShadow = '0 0 30px rgba(6,182,212,0.6)';
      }
      if (iconRef.current) iconRef.current.className = `fa-solid fa-lungs text-[28px] mb-0.5 text-white transition-colors duration-200`;
      if (textRef.current) {
        textRef.current.innerText = "BEATMEN";
        textRef.current.className = "text-[10px] font-black uppercase tracking-widest leading-none text-center px-1 mt-1 text-white transition-colors duration-200";
      }
    };

    const resetFlash = () => {
      if (glowRef.current) { 
        glowRef.current.style.transform = 'scale(1)'; 
        glowRef.current.style.boxShadow = '0 0 10px rgba(6,182,212,0.3)'; 
      }
    };

    const endVentilation = () => {
      if (glowRef.current) { glowRef.current.style.opacity = '0'; glowRef.current.style.transform = 'scale(1)'; glowRef.current.style.boxShadow = 'none'; }
      if (iconRef.current) iconRef.current.className = `fa-solid ${icon} text-[28px] mb-0.5 transition-colors duration-500 ${iconClass}`;
      if (textRef.current) {
        textRef.current.innerText = labelTop;
        textRef.current.className = `text-[9px] font-black uppercase tracking-wider leading-tight text-center transition-colors duration-500 ${textClass}`;
      }
    };

    triggerFlash(); 
    const t1 = setTimeout(resetFlash, 1000); 
    const t2 = setTimeout(triggerFlash, 1500); 
    const t3 = setTimeout(endVentilation, 2500); 

    return () => {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3);
      if (glowRef.current) { glowRef.current.style.opacity = '0'; glowRef.current.style.transitionDuration = '0ms'; }
      if (iconRef.current) iconRef.current.className = `fa-solid ${icon} text-[28px] mb-0.5 ${iconClass}`;
      if (textRef.current) {
        textRef.current.innerText = labelTop;
        textRef.current.className = `text-[9px] font-black uppercase tracking-wider leading-tight text-center ${textClass}`;
      }
    };
  }, [state.isVentilationPhase, state.cprMode, state.airwayEstablished, icon, labelTop, iconClass, textClass]);

  return { glowRef, iconRef, textRef, badgeRef, escalationBadgeRef, handleClick, btnClass, icon, labelTop, labelBottom, isPill, staticBadge, iconClass, textClass };
}