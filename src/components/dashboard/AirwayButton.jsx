// --- Datei: src/components/dashboard/AirwayButton.jsx ---
import React, { useContext, useEffect, useRef } from 'react';
import { CprContext } from '../../context/CprContext.jsx';
import { CPR_CONFIG } from '../../config/cprConfig.js';

// Synthetisches Atemgeräusch (Rauschen)
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

export default function AirwayButton() {
  const { state, dispatch } = useContext(CprContext);

  // DOM-Referenzen für die direkte 60FPS Manipulation ohne React-Rerender
  const glowRef = useRef(null);
  const iconRef = useRef(null);
  const textRef = useRef(null);
  const badgeRef = useRef(null);
  const escalationBadgeRef = useRef(null);

  const handleClick = () => {
    dispatch({ type: 'SET_PHASE', payload: CPR_CONFIG.PHASES.AIRWAY_MENU });
  };

  // ==========================================
  // BASIS-LAYOUT (Wird angewandt, wenn keine Animation läuft)
  // ==========================================
  let btnClass = "bg-white border-slate-200 shadow-sm"; 
  let iconClass = "text-slate-400";
  let textClass = "text-slate-400";
  let icon = "fa-lungs";
  let label = "Atemweg";
  
  if (state.airwayEstablished) {
    iconClass = "text-slate-600";
    textClass = "text-slate-600";
    if (state.airwayType === 'Beutel-Maske') { label = "BVM"; icon = "fa-mask-ventilator"; }
    else if (state.airwayType === 'ET-Tubus') { label = "Tubus"; icon = "fa-lungs"; }
    else if (state.airwayType === 'Larynxmaske') { label = "LAMA"; icon = "fa-lungs"; }
    else if (state.airwayType === 'Larynxtubus') { label = "LTS"; icon = "fa-lungs"; }
    else { label = state.airwayType || "Atemweg"; }
  } else {
    // Eskalations-Ampel
    if (state.missionSeconds >= 60) {
      btnClass = "bg-red-50 border-red-500 shadow-[0_0_20px_rgba(227,0,15,0.4)] animate-pulse";
      iconClass = "text-red-500";
      textClass = "text-red-600";
    } else {
      btnClass = "bg-amber-50 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)] animate-pulse";
      iconClass = "text-amber-500";
      textClass = "text-amber-600";
    }
  }

  // ==========================================
  // ANIMATION 1: KONT-MODUS (requestAnimationFrame Loop)
  // ==========================================
  useEffect(() => {
    const isInvasive = state.airwayEstablished && state.airwayType !== 'Beutel-Maske';
    const isContinuous = state.cprMode === 'continuous';

    const resetVisuals = () => {
      if (glowRef.current) {
        glowRef.current.style.opacity = '0';
        glowRef.current.style.transform = 'scale(1)';
        glowRef.current.style.boxShadow = 'none';
      }
      if (iconRef.current) iconRef.current.className = `fa-solid ${icon} text-[32px] transition-colors ${iconClass}`;
      if (textRef.current) {
        textRef.current.innerText = label;
        textRef.current.className = `text-[10px] font-black uppercase tracking-widest leading-none text-center px-1 mt-1 transition-colors ${textClass}`;
      }
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
    let cycleStart = Date.now() - fillDuration; // Knall-Effekt sofort beim ersten Start
    let rafId;
    let hasBreathed = false;

    const loop = () => {
      const now = Date.now();
      const elapsed = now - cycleStart;

      if (elapsed >= intervalMs) {
        cycleStart = now;
        hasBreathed = false;
      }

      const timeInCycle = now - cycleStart;

      // Transitions hart abschalten für Frame-perfekte Animation
      glowRef.current.style.transitionDuration = '0ms';
      iconRef.current.style.transitionDuration = '0ms';
      textRef.current.style.transitionDuration = '0ms';

      if (timeInCycle < fillDuration) {
        // --- PHASE 1: FÜLLEN ---
        const progress = timeInCycle / fillDuration; // 0.0 bis 1.0
        const opacity = 0.1 + (0.6 * progress);
        const scale = 1.0 + (0.05 * progress);

        glowRef.current.style.backgroundColor = '#67e8f9';
        glowRef.current.style.opacity = opacity.toString();
        glowRef.current.style.transform = `scale(${scale})`;
        glowRef.current.style.boxShadow = 'none';

        iconRef.current.className = `fa-solid ${icon} text-[32px] text-cyan-500`;
        textRef.current.innerText = label;
        textRef.current.className = "text-[10px] font-black uppercase tracking-widest leading-none text-center px-1 mt-1 text-cyan-500";

        const remainingSecs = Math.ceil((fillDuration - timeInCycle) / 1000);
        badgeRef.current.innerText = remainingSecs;
        badgeRef.current.className = "absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center shadow-lg border-[2px] border-white font-black text-white text-[16px] pointer-events-none bg-slate-800 opacity-100 z-20";
        
        hasBreathed = false;
      } else {
        // --- PHASE 2: KNALL-EFFEKT (BEATMUNG) ---
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

    return () => {
      cancelAnimationFrame(rafId);
      resetVisuals();
    };
  }, [state.airwayEstablished, state.airwayType, state.cprMode, state.isCompressing, state.isPediatric, state.isMuted, icon, label, iconClass, textClass]);

  // ==========================================
  // ANIMATION 2: 30:2 / 15:2 MODUS (Warnung & CSS Transitions)
  // ==========================================
  
  // A) Vorwarnung & Countdown
  useEffect(() => {
    if (state.cprMode === 'continuous') return;

    const limit = state.isPediatric ? 15 : 30;
    const remaining = limit - state.compressionCount;

    if (state.isCompressing && !state.isVentilationPhase && remaining > 0 && remaining <= 5) {
      badgeRef.current.innerText = remaining;
      badgeRef.current.className = "absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center shadow-lg border-[2px] border-white font-black text-white text-[16px] pointer-events-none bg-amber-500 animate-pulse opacity-100 z-20";

      // Haptisches Feedback in den letzten 3 Kompressionen
      if (remaining <= 3 && navigator.vibrate) navigator.vibrate(20);
    } else if (!state.isVentilationPhase) {
      if (badgeRef.current) badgeRef.current.style.opacity = '0';
    }
  }, [state.compressionCount, state.cprMode, state.isCompressing, state.isVentilationPhase, state.isPediatric]);

  // B) Der Doppel-Flash
  useEffect(() => {
    if (state.cprMode === 'continuous' || !state.isVentilationPhase) return;

    if (badgeRef.current) badgeRef.current.style.opacity = '0';
    if (escalationBadgeRef.current) escalationBadgeRef.current.style.opacity = '0';

    // CSS-Transitions wieder einschalten
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
      if (glowRef.current) {
        glowRef.current.style.opacity = '0.1';
        glowRef.current.style.transform = 'scale(1)';
        glowRef.current.style.boxShadow = 'none';
      }
      if (iconRef.current) iconRef.current.className = `fa-solid ${icon} text-[32px] text-cyan-500 transition-colors duration-500`;
      if (textRef.current) {
        textRef.current.innerText = label;
        textRef.current.className = "text-[10px] font-black uppercase tracking-widest leading-none text-center px-1 mt-1 text-cyan-500 transition-colors duration-500";
      }
    };

    // Die Zeitlinie der zwei Atemzüge
    triggerFlash(); // Sekunde 0
    const t1 = setTimeout(resetFlash, 1000); // Exhalation 1
    const t2 = setTimeout(triggerFlash, 1500); // Sekunde 1.5
    const t3 = setTimeout(resetFlash, 2500); // Exhalation 2

    return () => {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3);
      if (glowRef.current) {
        glowRef.current.style.opacity = '0';
        glowRef.current.style.transitionDuration = '0ms';
      }
    };
  }, [state.isVentilationPhase, state.cprMode, state.isMuted, icon, label]);

  return (
    <div className="relative pointer-events-auto z-50">
      
      {/* BASIS-BUTTON */}
      <button 
        onClick={handleClick} 
        className={`relative w-[100px] h-[100px] rounded-full border-[3px] flex flex-col items-center justify-center gap-1.5 active:scale-95 transition-transform ${btnClass}`}
      >
        {/* DER GLOW-HINTERGRUND (Völlig entkoppelt von React) */}
        <div 
          ref={glowRef} 
          className="absolute inset-0 rounded-full" 
          style={{ opacity: 0, transform: 'scale(1)', pointerEvents: 'none' }}
        ></div>

        {/* ICON & TEXT (Z-Index über Glow) */}
        <div className="relative z-10 flex flex-col items-center justify-center pointer-events-none">
          <i ref={iconRef} className={`fa-solid ${icon} text-[32px] transition-colors ${iconClass}`}></i>
          <span ref={textRef} className={`text-[10px] font-black uppercase tracking-widest leading-none text-center px-1 mt-1 transition-colors ${textClass}`}>
            {label}
          </span>
        </div>
      </button>

      {/* DYNAMISCHER COUNTDOWN BADGE */}
      <div 
        ref={badgeRef} 
        className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center shadow-lg border-[2px] border-white font-black text-white text-[16px] pointer-events-none opacity-0 z-20"
      ></div>
      
      {/* DAS ROTE AUSRUFEZEICHEN */}
      {!state.airwayEstablished && state.missionSeconds >= 60 && (
        <div 
          ref={escalationBadgeRef} 
          className="absolute -top-1 -right-1 bg-red-600 text-white text-[12px] font-black w-7 h-7 rounded-full flex items-center justify-center shadow-md border-[2px] border-white pointer-events-none z-10"
        >
          !!!
        </div>
      )}
    </div>
  );
}