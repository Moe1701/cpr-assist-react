import React, { useContext } from 'react';
import { CprContext } from '../../context/CprContext.jsx';
import { CPR_CONFIG } from '../../config/cprConfig.js';

export default function ViewObCompressions() {
  const { dispatch } = useContext(CprContext);

  const handleConfirmCompressions = () => {
    dispatch({ type: 'START_REA_LOGIC' }); 
    dispatch({ type: 'SET_PHASE', payload: 'OB_ANALYZE' });
  };

  return (
    <div className="absolute inset-0 w-full h-full z-20 bg-white animate-in fade-in duration-300 rounded-full">
      
      {/* Titel (zweizeilig) */}
      <div className="absolute top-[35px] w-full flex justify-center">
        <span className="text-[16px] font-black text-slate-700 uppercase tracking-[0.25em] text-center leading-tight drop-shadow-sm pointer-events-none whitespace-pre-line">
          {"Kompression\ngestartet?"}
        </span>
      </div>

      {/* Button: Bestätigen */}
      <div className="absolute top-[195px] w-full flex justify-center pointer-events-auto">
        <button 
          onClick={handleConfirmCompressions} 
          className="w-[85%] max-w-[300px] h-[60px] rounded-full bg-red-50 border border-red-200 text-[#E3000F] shadow-[0_8px_25px_rgba(227,0,15,0.05)] font-black uppercase tracking-[0.15em] text-[15px] animate-pulse active:scale-95 transition-all duration-300 flex items-center justify-center gap-3"
        >
          <i className="fa-solid fa-check-double text-2xl text-red-400"></i>
          <span>Bestätigen</span>
        </button>
      </div>

    </div>
  );
}