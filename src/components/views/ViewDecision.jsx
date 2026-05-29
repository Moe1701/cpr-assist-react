import React, { useContext } from 'react';
import { CprContext } from '../../CprContext.jsx';

export default function ViewDecision() {
  const { dispatch } = useContext(CprContext);

  const handleShockable = () => {
    dispatch({ type: 'SET_PHASE', payload: 'JOULE' });
  };

  const handleNonShockable = () => {
    dispatch({ type: 'SET_PHASE', payload: 'WAITING_CPR_RESUME' });
  };

  return (
    <div className="absolute inset-0 w-full h-full bg-white flex flex-col items-center justify-center animate-in fade-in duration-300">
      <div className="absolute top-[45px] w-full flex justify-center">
        <span className="text-[16px] font-black text-slate-700 uppercase tracking-[0.25em] drop-shadow-sm">Rhythmus ist:</span>
      </div>
      <div className="absolute top-[105px] w-full flex justify-center">
        <button onClick={handleShockable} className="w-[85%] max-w-[260px] h-[60px] bg-red-50/50 text-[#E3000F] rounded-full font-black uppercase tracking-[0.2em] text-[15px] shadow-sm border border-red-200 active:scale-95 transition-all flex items-center justify-center gap-4 hover:bg-red-100/50">
          <i className="fa-solid fa-bolt text-2xl text-red-400"></i> 
          <span>Schockbar</span>
        </button>
      </div>
      <div className="absolute top-[185px] w-full flex justify-center">
        <button onClick={handleNonShockable} className="w-[85%] max-w-[260px] h-[60px] bg-white text-slate-600 rounded-full font-black uppercase tracking-[0.15em] text-[15px] shadow-[0_5px_15px_rgba(0,0,0,0.03)] border border-slate-200 active:scale-95 transition-all flex items-center justify-center gap-4 hover:bg-slate-50">
          <i className="fa-solid fa-wave-square text-2xl text-slate-400"></i> 
          <span>Nicht Schockbar</span>
        </button>
      </div>
      <div className="absolute top-[270px] w-full flex justify-center">
        <button onClick={() => dispatch({ type: 'SET_PHASE', payload: 'OB_ANALYZE' })} className="px-8 h-[40px] bg-white text-slate-400 rounded-full font-bold uppercase tracking-[0.2em] text-[11px] shadow-sm border border-slate-100 active:scale-95 transition-all flex items-center justify-center hover:bg-slate-50">
          Zurück
        </button>
      </div>
    </div>
  );
}