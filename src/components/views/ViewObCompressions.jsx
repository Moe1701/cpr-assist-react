import React, { useContext } from 'react';
import { CprContext } from '../../context/CprContext.jsx';

export default function ViewObCompressions() {
  const { dispatch } = useContext(CprContext);

  const handleConfirmCompressions = () => {
    dispatch({ type: 'START_REA_LOGIC' }); 
    dispatch({ type: 'SET_PHASE', payload: 'OB_ANALYZE' });
  };

  return (
    <div className="absolute inset-0 w-full h-full bg-white flex flex-col items-center justify-center animate-in fade-in duration-300">
      <div className="absolute top-[45px] w-full flex justify-center">
        <span className="text-[15px] font-black text-slate-700 uppercase tracking-[0.25em] text-center leading-tight drop-shadow-sm">Kompression<br/>gestartet?</span>
      </div>
      <div className="absolute top-[115px] w-full flex justify-center">
        <div className="text-[64px] font-mono font-black text-slate-700 tracking-tighter leading-none">00:00</div>
      </div>
      <div className="absolute top-[215px] w-full flex justify-center">
        <button onClick={handleConfirmCompressions} className="w-[85%] max-w-[260px] h-[60px] bg-red-50 text-[#E3000F] rounded-full font-black uppercase tracking-[0.15em] text-[15px] shadow-[0_8px_25px_rgba(227,0,15,0.05)] border border-red-200 active:scale-95 transition-all flex items-center justify-center gap-3 animate-pulse">
          <i className="fa-solid fa-check-double text-2xl text-red-400"></i>
          <span>Bestätigen</span>
        </button>
      </div>
    </div>
  );
}


--- Datei: src/components/views/ViewObAnalyze.jsx ---

import React, { useContext } from 'react';
import { CprContext } from '../../context/CprContext.jsx';

export default function ViewObAnalyze() {
  const { dispatch } = useContext(CprContext);

  const handleAnalyseClick = () => {
    dispatch({ type: 'SET_PHASE', payload: 'DECISION' });
  };

  return (
    <div className="absolute inset-0 w-full h-full bg-white flex flex-col items-center justify-center overflow-hidden animate-in fade-in duration-300">
      <div className="absolute inset-0 w-full h-full z-0 opacity-70" style={{clipPath:'polygon(70% 0%, 15% 55%, 45% 55%, 30% 100%, 85% 45%, 55% 45%)', background:'repeating-linear-gradient(-45deg, rgba(227,0,15,0.1) 0px, rgba(227,0,15,0.1) 6px, transparent 6px, transparent 12px)', transform:'scale(1.5)'}}></div>
      <div className="absolute top-[50px] w-full flex justify-center z-10">
        <span className="text-[15px] font-black text-slate-800 uppercase tracking-[0.25em] bg-white/95 px-5 py-2 rounded-full drop-shadow-sm">Initiale Analyse</span>
      </div>
      <div className="absolute top-[205px] w-full flex justify-center z-10">
        <button onClick={handleAnalyseClick} className="w-[85%] max-w-[260px] h-[60px] bg-white text-[#E3000F] rounded-full font-black uppercase tracking-[0.15em] text-[15px] shadow-[0_8px_25px_rgba(227,0,15,0.08)] border border-red-100 transition-all flex items-center justify-center gap-3 animate-pulse active:scale-95 hover:bg-red-50">
          <i className="fa-solid fa-bolt text-2xl text-red-300"></i> 
          <span>Hier drücken</span>
        </button>
      </div>
    </div>
  );
}