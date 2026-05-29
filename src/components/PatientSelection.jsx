import React, { useContext } from 'react';
import { CprContext } from '../context/CprContext.jsx';

export default function PatientSelection() {
  const { state, dispatch } = useContext(CprContext);

  // --- HANDLER FUNKTIONEN ---
  const handleAdultSelect = () => {
    dispatch({ type: 'SET_PEDIATRIC_DATA', payload: { isPediatric: false, patientWeight: null } });
    dispatch({ type: 'SET_PHASE', payload: 'OB_COMPRESSIONS' });
  };

  const handleBreathsDone = (skipped = false) => {
    dispatch({ type: 'SET_PHASE', payload: 'OB_COMPRESSIONS' });
  };

  const handleConfirmCompressions = () => {
    // startMainTimer, WakeLock, etc. kommen später in den Context
    dispatch({ type: 'START_REA_LOGIC' }); 
    dispatch({ type: 'SET_PHASE', payload: 'OB_ANALYZE' });
  };

  const handleAnalyseClick = () => {
    // isCompressing muss auf false (Metronom stoppt), das bauen wir später in den Context ein
    dispatch({ type: 'SET_PHASE', payload: 'DECISION' });
  };

  const handleShockable = () => {
    dispatch({ type: 'SET_PHASE', payload: 'JOULE' });
  };

  const handleNonShockable = () => {
    dispatch({ type: 'SET_PHASE', payload: 'WAITING_CPR_RESUME' });
  };

  const handleJouleSelect = (joule) => {
    // shockCount erhöhen kommt später in den Context
    dispatch({ type: 'SET_PHASE', payload: 'WAITING_CPR_RESUME' });
  };

  const handleResumeCpr = () => {
    // HIER PASSIERT DIE MAGIE: Onboarding beendet, Dashboard startet!
    dispatch({ type: 'SET_PHASE', payload: 'RUNNING' });
  };

  // --- RENDER WEICHE ---
  switch (state.appPhase) {
    
    case 'ONBOARDING':
      return (
        <div className="absolute inset-0 w-full h-full bg-white flex flex-col items-center justify-center animate-in fade-in duration-300">
          <div className="absolute top-[45px] w-full flex justify-center">
            <span className="text-[16px] font-black text-slate-700 uppercase tracking-[0.25em] drop-shadow-sm">Patient wählen</span>
          </div>
          <div className="absolute top-[115px] w-full flex justify-center">
            <button onClick={handleAdultSelect} className="w-[85%] max-w-[260px] h-[60px] bg-white text-slate-700 rounded-full font-black uppercase tracking-[0.2em] text-[15px] shadow-[0_8px_25px_rgba(0,0,0,0.04)] border border-slate-200 active:scale-95 transition-all flex items-center justify-center gap-4 hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
              <i className="fa-solid fa-person text-3xl text-slate-400"></i> 
              <span>Erwachsener</span>
            </button>
          </div>
          <div className="absolute top-[205px] w-full flex justify-center">
            <button onClick={() => dispatch({ type: 'TOGGLE_PATIENT_MODAL', payload: true })} className="w-[85%] max-w-[260px] h-[60px] bg-indigo-50/80 text-indigo-700 rounded-full font-black uppercase tracking-[0.2em] text-[15px] shadow-[0_8px_25px_rgba(79,70,229,0.05)] border border-indigo-200 active:scale-95 transition-all flex items-center justify-center gap-4 hover:shadow-[0_10px_30px_rgba(79,70,229,0.09)]">
              <i className="fa-solid fa-child text-3xl text-indigo-400"></i> 
              <span>Kind</span>
            </button>
          </div>
        </div>
      );

    case 'OB_COMPRESSIONS':
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

    case 'OB_ANALYZE':
      return (
        <div className="absolute inset-0 w-full h-full bg-white flex flex-col items-center justify-center overflow-hidden animate-in fade-in duration-300">
          <div className="absolute inset-0 w-full h-full z-0 opacity-70" style={{clipPath:'polygon(70% 0%, 15% 55%, 45% 55%, 30% 100%, 85% 45%, 55% 45%)', background:'repeating-linear-gradient(-45deg, rgba(227,0,15,0.1) 0px, rgba(227,0,15,0.1) 6px, transparent 6px, transparent 12px)', transform:'scale(1.5)'}}></div>
          <div className="absolute top-[50px] w-full flex justify-center z-10">
            <span className="text-[15px] font-black text-slate-800 uppercase tracking-[0.25em] bg-white/95 px-5 py-2 rounded-full drop-shadow-sm">Initiale Analyse</span>
          </div>
          <div className="absolute top-[205px] w-full flex justify-center z-10">
            <button onClick={handleAnalyseClick} className="w-[85%] max-w-[260px] h-[60px] bg-white text-[#E3000F] rounded-full font-black uppercase tracking-[0.15em] text-[15px] shadow-[0_8px_25px_rgba(227,0,15,0.08)] border border-red-100 transition-all flex items-center justify-center gap-3 animate-pulse active:scale-95">
              <i className="fa-solid fa-bolt text-2xl text-red-300"></i> 
              <span>Hier drücken</span>
            </button>
          </div>
        </div>
      );

    case 'DECISION':
      return (
        <div className="absolute inset-0 w-full h-full bg-white flex flex-col items-center justify-center animate-in fade-in duration-300">
          <div className="absolute top-[45px] w-full flex justify-center">
            <span className="text-[16px] font-black text-slate-700 uppercase tracking-[0.25em] drop-shadow-sm">Rhythmus ist:</span>
          </div>
          <div className="absolute top-[105px] w-full flex justify-center">
            <button onClick={handleShockable} className="w-[85%] max-w-[260px] h-[60px] bg-red-50/50 text-[#E3000F] rounded-full font-black uppercase tracking-[0.2em] text-[15px] shadow-sm border border-red-200 active:scale-95 transition-all flex items-center justify-center gap-4">
              <i className="fa-solid fa-bolt text-2xl text-red-400"></i> 
              <span>Schockbar</span>
            </button>
          </div>
          <div className="absolute top-[185px] w-full flex justify-center">
            <button onClick={handleNonShockable} className="w-[85%] max-w-[260px] h-[60px] bg-white text-slate-600 rounded-full font-black uppercase tracking-[0.15em] text-[15px] shadow-[0_5px_15px_rgba(0,0,0,0.03)] border border-slate-200 active:scale-95 transition-all flex items-center justify-center gap-4">
              <i className="fa-solid fa-wave-square text-2xl text-slate-400"></i> 
              <span>Nicht Schockbar</span>
            </button>
          </div>
          <div className="absolute top-[270px] w-full flex justify-center">
            <button onClick={() => dispatch({ type: 'SET_PHASE', payload: 'OB_ANALYZE' })} className="px-8 h-[40px] bg-white text-slate-400 rounded-full font-bold uppercase tracking-[0.2em] text-[11px] shadow-sm border border-slate-100 active:scale-95 transition-all flex items-center justify-center">
              Zurück
            </button>
          </div>
        </div>
      );

    case 'JOULE':
      return (
        <div className="absolute inset-0 w-full h-full bg-white flex flex-col items-center justify-center animate-in fade-in duration-300">
          <div className="absolute top-[40px] w-full flex justify-center">
            <span className="text-[16px] font-black text-slate-700 uppercase tracking-[0.25em] drop-shadow-sm">Energie wählen</span>
          </div>
          <div className="absolute top-[95px] w-full flex justify-center">
            <button onClick={() => handleJouleSelect(150)} className="w-[85%] max-w-[260px] h-[60px] bg-yellow-50/30 text-yellow-600 rounded-[20px] font-black uppercase tracking-wider text-[22px] shadow-sm border-2 border-yellow-400 active:scale-95 transition-all flex items-center justify-center">
              150 J
            </button>
          </div>
          <div className="absolute top-[170px] w-full flex justify-center gap-4 px-6">
            <button onClick={() => handleJouleSelect(200)} className="flex-1 h-[60px] bg-yellow-50/30 text-yellow-600 rounded-[20px] font-black uppercase tracking-wider text-[22px] shadow-sm border-2 border-yellow-400 active:scale-95 transition-all flex items-center justify-center">
              200 J
            </button>
            <button onClick={() => handleJouleSelect(360)} className="flex-1 h-[60px] bg-yellow-50/30 text-yellow-600 rounded-[20px] font-black uppercase tracking-wider text-[22px] shadow-sm border-2 border-yellow-400 active:scale-95 transition-all flex items-center justify-center">
              360 J
            </button>
          </div>
          <div className="absolute top-[245px] w-full flex justify-center">
            <span className="text-[10px] font-bold text-[#E3000F] uppercase tracking-widest flex items-center gap-2">
               <i className="fa-solid fa-bolt"></i> Nach Schock bestätigen
            </span>
          </div>
          <div className="absolute top-[275px] w-full flex justify-center">
            <button onClick={() => dispatch({ type: 'SET_PHASE', payload: 'DECISION' })} className="px-8 h-[40px] bg-white text-slate-400 rounded-full font-bold uppercase tracking-[0.2em] text-[11px] shadow-sm border border-slate-100 active:scale-95 transition-all flex items-center justify-center">
              Zurück
            </button>
          </div>
        </div>
      );

    case 'WAITING_CPR_RESUME':
      return (
        <div className="absolute inset-0 w-full h-full bg-white flex flex-col items-center justify-center animate-in fade-in duration-300">
          <div className="absolute top-[45px] w-full flex justify-center">
            <span className="text-[16px] font-black text-slate-700 uppercase tracking-[0.25em] drop-shadow-sm">CPR Fortsetzen</span>
          </div>
          <div className="absolute top-[125px] w-full flex justify-center">
             <i className="fa-solid fa-heart-pulse text-6xl text-red-100"></i>
          </div>
          <div className="absolute top-[215px] w-full flex justify-center">
            <button onClick={handleResumeCpr} className="w-[85%] max-w-[260px] h-[60px] bg-[#E3000F] text-white rounded-full font-black uppercase tracking-[0.15em] text-[15px] shadow-[0_8px_25px_rgba(227,0,15,0.25)] active:scale-95 transition-all flex items-center justify-center gap-3">
              <i className="fa-solid fa-play text-xl"></i>
              <span>Bestätigen</span>
            </button>
          </div>
        </div>
      );

    default:
      return null;
  }
}