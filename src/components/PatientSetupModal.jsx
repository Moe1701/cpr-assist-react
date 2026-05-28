import React, { useContext } from 'react';
import { CprContext } from '../context/CprContext.jsx';

export default function PatientSelection() {
  const { state, dispatch } = useContext(CprContext);

  const handleAdultSelect = () => {
    dispatch({ type: 'SET_PEDIATRIC_DATA', payload: { isPediatric: false, patientWeight: null } });
    dispatch({ type: 'SET_PHASE', payload: 'OB_COMPRESSIONS' });
  };

  const handleBreathsDone = (skipped = false) => {
    dispatch({ type: 'SET_PHASE', payload: 'OB_COMPRESSIONS' });
  };

  const handleConfirmCompressions = () => {
    dispatch({ type: 'START_REA_LOGIC' });
    dispatch({ type: 'SET_PHASE', payload: 'OB_ANALYZE' });
  };

  const handleAnalyseClick = () => {
    dispatch({ type: 'SET_PHASE', payload: 'DECISION' });
  };

  // Render-Weiche für die Onboarding-Phasen
  switch (state.appPhase) {
    case 'ONBOARDING':
      return (
        <div className="absolute inset-0 w-full h-full bg-white flex flex-col items-center justify-center animate-in fade-in duration-300">
          <div className="absolute top-[35px] w-full flex justify-center">
            <span className="text-[16px] font-black text-slate-700 uppercase tracking-[0.25em] drop-shadow-sm">Patient wählen</span>
          </div>
          <div className="absolute top-[105px] w-full flex justify-center">
            <button onClick={handleAdultSelect} className="w-[85%] max-w-[300px] h-[60px] bg-white text-slate-700 rounded-full font-black uppercase tracking-[0.2em] text-[15px] shadow-[0_8px_25px_rgba(0,0,0,0.04)] border border-slate-200 active:scale-95 transition-all flex items-center justify-center gap-4 hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
              <i className="fa-solid fa-person text-3xl text-slate-400"></i> 
              <span>Erwachsener</span>
            </button>
          </div>
          <div className="absolute top-[195px] w-full flex justify-center">
            <button onClick={() => dispatch({ type: 'TOGGLE_PATIENT_MODAL', payload: true })} className="w-[85%] max-w-[300px] h-[60px] bg-indigo-50/80 text-indigo-700 rounded-full font-black uppercase tracking-[0.2em] text-[15px] shadow-[0_8px_25px_rgba(79,70,229,0.05)] border border-indigo-200 active:scale-95 transition-all flex items-center justify-center gap-4 hover:shadow-[0_10px_30px_rgba(79,70,229,0.09)]">
              <i className="fa-solid fa-child text-3xl text-indigo-400"></i> 
              <span>Kind</span>
            </button>
          </div>
        </div>
      );

    case 'OB_INITIAL_BREATHS':
      return (
        <div className="absolute inset-0 w-full h-full bg-white flex flex-col items-center justify-center animate-in scale-in duration-300">
          <div className="absolute top-[25px] w-full flex justify-center">
            <span className="text-[16px] font-black text-slate-700 uppercase tracking-[0.25em] text-center leading-tight drop-shadow-sm">5 Initiale<br/>Beatmungen</span>
          </div>
          <div className="absolute top-[75px] w-full flex justify-center">
            <div className="w-12 h-12 bg-cyan-50 border border-cyan-100 text-cyan-600 rounded-full flex items-center justify-center shadow-sm"><i className="fa-solid fa-lungs text-xl"></i></div>
          </div>
          <div className="absolute top-[135px] w-full flex justify-center">
            <button onClick={() => handleBreathsDone(false)} className="w-[85%] max-w-[300px] h-[60px] bg-cyan-50/80 text-cyan-700 rounded-full font-black uppercase tracking-[0.15em] text-[15px] shadow-[0_8px_25px_rgba(6,182,212,0.04)] border border-cyan-200 active:scale-95 transition-all flex items-center justify-center gap-3">
              <i className="fa-solid fa-lungs text-2xl text-cyan-400"></i>
              <span>Durchgeführt</span>
            </button>
          </div>
          <div className="absolute top-[205px] w-full flex justify-center">
            <button onClick={() => handleBreathsDone(true)} className="w-[85%] max-w-[300px] h-[60px] bg-white text-slate-400 rounded-full font-bold uppercase tracking-[0.25em] text-[13px] shadow-[0_5px_15px_rgba(0,0,0,0.03)] border border-slate-100 active:scale-95 transition-all flex items-center justify-center gap-2">
              <span>Überspringen</span>
            </button>
          </div>
        </div>
      );

    case 'OB_COMPRESSIONS':
      return (
        <div className="absolute inset-0 w-full h-full bg-white flex flex-col items-center justify-center animate-in fade-in duration-300">
          <div className="absolute top-[35px] w-full flex justify-center">
            <span className="text-[16px] font-black text-slate-700 uppercase tracking-[0.25em] text-center leading-tight drop-shadow-sm">Kompression<br/>gestartet?</span>
          </div>
          <div className="absolute top-[105px] w-full flex justify-center">
            <div className="text-[56px] font-mono font-black text-slate-700 tracking-tighter leading-none">00:00</div>
          </div>
          <div className="absolute top-[195px] w-full flex justify-center">
            <button onClick={handleConfirmCompressions} className="w-[85%] max-w-[300px] h-[60px] bg-red-50 text-[#E3000F] rounded-full font-black uppercase tracking-[0.15em] text-[15px] shadow-[0_8px_25px_rgba(227,0,15,0.05)] border border-red-200 active:scale-95 transition-all flex items-center justify-center gap-3 animate-pulse">
              <i className="fa-solid fa-check-double text-2xl text-red-400"></i>
              <span>Bestätigen</span>
            </button>
          </div>
        </div>
      );

    case 'OB_ANALYZE':
      return (
        <div className="absolute inset-0 w-full h-full bg-white flex flex-col items-center justify-center overflow-hidden animate-in fade-in duration-300">
          <div className="absolute inset-0 w-full h-full z-0" style={{clipPath:'polygon(70% 0%, 15% 55%, 45% 55%, 30% 100%, 85% 45%, 55% 45%)', background:'repeating-linear-gradient(-45deg, rgba(227,0,15,0.08) 0px, rgba(227,0,15,0.08) 4px, transparent 4px, transparent 8px)', transform:'scale(1.5)'}}></div>
          <div className="absolute top-[35px] w-full flex justify-center z-10">
            <span className="text-[16px] font-black text-slate-700 uppercase tracking-[0.25em] bg-white/90 px-4 py-1 rounded-full drop-shadow-sm">Initiale Analyse</span>
          </div>
          <div className="absolute top-[195px] w-full flex justify-center z-10">
            <button onClick={handleAnalyseClick} className="w-[85%] max-w-[300px] h-[60px] bg-white text-[#E3000F] rounded-full font-black uppercase tracking-[0.15em] text-[15px] shadow-[0_8px_25px_rgba(227,0,15,0.06)] border border-red-100 transition-all flex items-center justify-center gap-3 animate-pulse active:scale-95">
              <i className="fa-solid fa-bolt text-2xl text-red-300"></i> 
              <span>Hier drücken</span>
            </button>
          </div>
        </div>
      );

    default:
      return null;
  }
}