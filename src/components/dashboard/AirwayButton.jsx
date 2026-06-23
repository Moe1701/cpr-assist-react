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
    <div className="relative pointer-events-auto z-50 w-[85px] h-[85px]">
      
      {/* 1. WEISSER BASIS-HINTERGRUND */}
      <div className={`absolute inset-0 rounded-full bg-white border-[3px] transition-colors ${btnClass}`}></div>

      {/* 2. DER GLOW / BEATMUNGS-KREIS */}
      <div 
        ref={glowRef} 
        className="absolute inset-0 rounded-full" 
        style={{ opacity: 0, transform: 'scale(1)', pointerEvents: 'none', zIndex: 10 }}
      ></div>

      {/* 3. DER KLICKBARE BUTTON (Text & Icon) */}
      <button 
        onClick={handleClick} 
        className="absolute inset-0 w-full h-full rounded-full flex flex-col items-center justify-center pt-1 pb-0 active:scale-95 transition-transform z-20 bg-transparent cursor-pointer"
      >
        <div className="flex flex-col items-center justify-center pointer-events-none w-full px-1">
          {/* Beachte: useAirwayEngine liefert die iconClass, in der text-[28px] steht! */}
          <i ref={iconRef} className={`fa-solid ${icon} mb-0.5 transition-colors ${iconClass}`}></i>
          
          <span ref={textRef} className={`text-[9px] font-black uppercase tracking-wider leading-tight text-center transition-colors ${textClass}`}>
            {labelTop}
          </span>
          
          {labelBottom && (
            <span className={`text-[8px] font-black uppercase tracking-wider leading-none text-center px-1.5 py-0.5 mt-0.5 rounded-sm ${isPill ? (staticBadge?.bg === 'bg-[#E3000F]' ? 'bg-[#E3000F] text-white' : 'bg-amber-500 text-white') : ''}`}>
              {labelBottom}
            </span>
          )}
        </div>
      </button>

      {/* 4. DYNAMISCHER COUNTDOWN BADGE */}
      <div 
        ref={badgeRef} 
        className="absolute -top-1 -right-1 w-[28px] h-[28px] text-[12px] font-black bg-slate-700 text-white rounded-full flex items-center justify-center shadow-md border-[2px] border-white pointer-events-none z-30"
        style={{ opacity: 0, display: 'none' }}
      ></div>
      
      {/* 5. DAS STATISCHE AUSRUFEZEICHEN */}
      {staticBadge && !state.airwayEstablished && (
        <div 
          ref={escalationBadgeRef} 
          className={`absolute -top-1 -right-1 text-white text-[12px] font-black w-7 h-7 rounded-full flex items-center justify-center shadow-md border-[2px] border-white pointer-events-none z-30 ${staticBadge.bg}`}
        >
          {staticBadge.text}
        </div>
      )}
    </div>
  );
}