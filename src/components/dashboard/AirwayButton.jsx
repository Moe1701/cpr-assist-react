// --- Datei: src/components/dashboard/AirwayButton.jsx ---
import React, { useContext } from 'react';
import { CprContext } from '../../context/CprContext.jsx';
import { useAirwayEngine } from '../../hooks/useAirwayEngine.js';

export default function AirwayButton() {
  const { state } = useContext(CprContext);
  
  const { 
    glowRef, iconRef, textRef, badgeRef, escalationBadgeRef, 
    handleClick, btnClass, icon, labelTop, labelBottom, isPill, staticBadge, iconClass, textClass 
  } = useAirwayEngine();

  return (
    <div className="relative pointer-events-auto z-50">
      
      {/* BASIS-BUTTON */}
      <button 
        onClick={handleClick} 
        className={`relative w-[100px] h-[100px] rounded-full border-[3px] flex flex-col items-center justify-center pt-1 pb-0 active:scale-95 transition-transform bg-white ${btnClass}`}
      >
        {/* DER GLOW-HINTERGRUND (Völlig entkoppelt von React) */}
        <div 
          ref={glowRef} 
          className="absolute inset-0 rounded-full" 
          style={{ opacity: 0, transform: 'scale(1)', pointerEvents: 'none' }}
        ></div>

        {/* ICON & TEXT (Z-Index über Glow) */}
        <div className="relative z-10 flex flex-col items-center justify-center pointer-events-none w-full px-1">
          <i ref={iconRef} className={`fa-solid ${icon} text-[28px] mb-0.5 transition-colors ${iconClass}`}></i>
          
          <span ref={textRef} className={`text-[9px] font-black uppercase tracking-wider leading-tight text-center transition-colors ${textClass}`}>
            {labelTop}
          </span>
          
          {/* Die farbige Pill / Box für die 2. Textzeile */}
          {labelBottom && (
            <span className={`text-[8px] font-black uppercase tracking-wider leading-none text-center px-1.5 py-0.5 mt-0.5 rounded-sm ${isPill ? (staticBadge?.bg === 'bg-[#E3000F]' ? 'bg-[#E3000F] text-white' : 'bg-amber-500 text-white') : ''}`}>
              {labelBottom}
            </span>
          )}
        </div>
      </button>

      {/* DYNAMISCHER COUNTDOWN BADGE */}
      <div 
        ref={badgeRef} 
        className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center shadow-lg border-[2px] border-white font-black text-white text-[15px] pointer-events-none opacity-0 z-20"
      ></div>
      
      {/* DAS STATISCHE AUSRUFEZEICHEN (Gelb oder Rot) */}
      {staticBadge && !state.airwayEstablished && (
        <div 
          ref={escalationBadgeRef} 
          className={`absolute -top-1 -right-1 text-white text-[12px] font-black w-7 h-7 rounded-full flex items-center justify-center shadow-md border-[2px] border-white pointer-events-none z-10 ${staticBadge.bg}`}
        >
          {staticBadge.text}
        </div>
      )}
    </div>
  );
}