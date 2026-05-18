import React, { useContext } from 'react';
import { CprContext } from '../../context/CprContext.jsx';

const CenterDisplay = () => {
  const { state } = useContext(CprContext);

  return (
    <div className="w-64 h-64 sm:w-[330px] sm:h-[330px] rounded-full bg-white shadow-xl border border-slate-100 flex items-center justify-center mx-auto my-auto relative overflow-hidden pointer-events-auto z-30 transition-all duration-500">
      
      {/* Vorerst nur ein Dummy, der uns zeigt, in welcher Phase die App ist */}
      <div className="text-center">
        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-2">Aktuelle Phase</p>
        <div className="text-2xl font-black text-slate-700">{state.appPhase}</div>
      </div>
      
    </div>
  );
};

export default CenterDisplay;