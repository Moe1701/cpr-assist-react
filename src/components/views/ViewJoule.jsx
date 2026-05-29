import React, { useContext } from 'react';
import { CprContext } from '../CprContext.jsx'; // KORRIGIERTER PFAD

export default function ViewJoule() {
  const { state, dispatch } = useContext(CprContext);

  const handleJouleSelect = (joule) => {
    dispatch({ type: 'SET_PHASE', payload: 'WAITING_CPR_RESUME' });
  };

  // Dummy-Werte für das Layout (das echte Gewicht holen wir in Schritt 3)
  const weight = state.patientWeight || 4; // Fallback auf 4kg
  const jouleLow = weight * 4;
  const jouleHigh = weight * 8;

  return (
    <div className="absolute inset-0 w-full h-full bg-white flex flex-col items-center justify-center animate-in fade-in duration-300">
      <div className="absolute top-[40px] w-full flex justify-center">
        <span className="text-[16px] font-black text-slate-700 uppercase tracking-[0.25em] drop-shadow-sm">Energie wählen</span>
      </div>
      
      {state.isPediatric ? (
        /* --- PÄDIATRIE LAYOUT --- */
        <div className="absolute top-[130px] w-full flex justify-center gap-4 px-6">
          <button onClick={() => handleJouleSelect(jouleLow)} className="flex-1 h-[80px] bg-yellow-50/30 text-yellow-600 rounded-[20px] shadow-sm border-2 border-yellow-400 active:scale-95 transition-all flex flex-col items-center justify-center hover:bg-yellow-100/50">
            <span className="font-black uppercase tracking-wider text-[26px] leading-none">{jouleLow} J</span>
            <span className="text-[10px] font-bold text-yellow-600/60 uppercase tracking-widest mt-1">4 J/kg</span>
          </button>
          <button onClick={() => handleJouleSelect(jouleHigh)} className="flex-1 h-[80px] bg-yellow-50/30 text-yellow-600 rounded-[20px] shadow-sm border-2 border-yellow-400 active:scale-95 transition-all flex flex-col items-center justify-center hover:bg-yellow-100/50">
            <span className="font-black uppercase tracking-wider text-[26px] leading-none">{jouleHigh} J</span>
            <span className="text-[10px] font-bold text-yellow-600/60 uppercase tracking-widest mt-1">8 J/kg</span>
          </button>
        </div>
      ) : (
        /* --- ERWACHSENEN LAYOUT --- */
        <>
          <div className="absolute top-[95px] w-full flex justify-center">
            <button onClick={() => handleJouleSelect(150)} className="w-[85%] max-w-[260px] h-[60px] bg-yellow-50/30 text-yellow-600 rounded-[20px] font-black uppercase tracking-wider text-[22px] shadow-sm border-2 border-yellow-400 active:scale-95 transition-all flex items-center justify-center hover:bg-yellow-100/50">
              150 J
            </button>
          </div>
          <div className="absolute top-[170px] w-full flex justify-center gap-4 px-6">
            <button onClick={() => handleJouleSelect(200)} className="flex-1 h-[60px] bg-yellow-50/30 text-yellow-600 rounded-[20px] font-black uppercase tracking-wider text-[22px] shadow-sm border-2 border-yellow-400 active:scale-95 transition-all flex items-center justify-center hover:bg-yellow-100/50">
              200 J
            </button>
            <button onClick={() => handleJouleSelect(360)} className="flex-1 h-[60px] bg-yellow-50/30 text-yellow-600 rounded-[20px] font-black uppercase tracking-wider text-[22px] shadow-sm border-2 border-yellow-400 active:scale-95 transition-all flex items-center justify-center hover:bg-yellow-100/50">
              360 J
            </button>
          </div>
        </>
      )}

      <div className="absolute top-[245px] w-full flex justify-center">
        <span className="text-[10px] font-bold text-[#E3000F] uppercase tracking-widest flex items-center gap-2">
           <i className="fa-solid fa-bolt"></i> Nach Schock bestätigen
        </span>
      </div>
      <div className="absolute top-[275px] w-full flex justify-center">
        <button onClick={() => dispatch({ type: 'SET_PHASE', payload: 'DECISION' })} className="px-8 h-[40px] bg-white text-slate-400 rounded-full font-bold uppercase tracking-[0.2em] text-[11px] shadow-sm border border-slate-100 active:scale-95 transition-all flex items-center justify-center hover:bg-slate-50">
          Zurück
        </button>
      </div>
    </div>
  );
}