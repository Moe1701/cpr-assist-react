// --- Datei: src/components/dashboard/AirwayButton.jsx ---
import React, { useContext } from 'react';
import { CprContext } from '../../context/CprContext.jsx';
import { useAirwayEngine } from '../../hooks/useAirwayEngine.js';

export default function AirwayButton() {
  const { state } = useContext(CprContext);
  
  // Der Hook liefert alle DOM-Referenzen und das berechnete Basis-Layout
  const { 
    glowRef, iconRef, textRef, badgeRef, escalationBadgeRef, 
    handleClick, btnClass, icon, label, iconClass, textClass 
  } = useAirwayEngine();

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