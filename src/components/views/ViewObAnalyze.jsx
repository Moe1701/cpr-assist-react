import React, { useContext } from 'react';
import { CprContext } from '../../context/CprContext.jsx';

export default function ViewObAnalyze() {
  const { dispatch } = useContext(CprContext);

  const handleAnalyseClick = () => {
    dispatch({ type: 'SET_PHASE', payload: 'DECISION' });
  };

  return (
    <div className="absolute inset-0 w-full h-full bg-white flex flex-col items-center justify-center overflow-hidden animate-in fade-in duration-300">
      <div className="absolute inset-0 w-full h-full z-0 opacity-80" style={{clipPath:'polygon(70% 0%, 15% 55%, 45% 55%, 30% 100%, 85% 45%, 55% 45%)', background:'repeating-linear-gradient(-45deg, rgba(227,0,15,0.08) 0px, rgba(227,0,15,0.08) 4px, transparent 4px, transparent 8px)', transform:'scale(1.5)'}}></div>
      
      <div className="z-10 flex flex-col items-center justify-center gap-5 w-full h-full">
        <span className="text-[13px] font-black text-slate-700 uppercase tracking-[0.2em] bg-white/95 px-4 py-1.5 rounded-full drop-shadow-sm text-center leading-tight">
          Initiale Analyse
        </span>
        
        <button onClick={handleAnalyseClick} className="w-[85%] max-w-[190px] h-[55px] bg-white text-[#E3000F] rounded-full font-black uppercase tracking-[0.1em] text-[13px] shadow-[0_8px_25px_rgba(227,0,15,0.08)] border border-red-100 transition-all flex items-center justify-center gap-3 animate-pulse active:scale-95 hover:bg-red-50">
          <i className="fa-solid fa-bolt text-xl text-red-300"></i> 
          <span>Hier drücken</span>
        </button>
      </div>
    </div>
  );
}