// --- Datei: src/components/CenterDisplay.jsx ---
import React, { useContext } from 'react';
import { CprContext } from '../context/CprContext.jsx';
import PatientSelection from './PatientSelection.jsx'; 

export default function CenterDisplay() {
  const { state } = useContext(CprContext);

  const isDashboard = state.appPhase === 'RUNNING';
  
  // Neue Größe: 224px im Dashboard, 340px im Onboarding
  const circleSize = isDashboard ? '224px' : '340px';

  const formatCprTime = (seconds) => {
    if (isNaN(seconds) || seconds === null) return "00:00";
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const renderPhase = () => {
    switch (state.appPhase) {
      case 'ONBOARDING':
      case 'OB_INITIAL_BREATHS':
      case 'OB_COMPRESSIONS':
      case 'OB_ANALYZE':
      case 'DECISION':
      case 'JOULE':
      case 'WAITING_CPR_RESUME':
        return <PatientSelection />;
      
      case 'RUNNING':
        return (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-white rounded-full shadow-[inset_0_0_20px_rgba(0,0,0,0.02)]">
            
            <div className="absolute top-5 w-10 h-1.5 bg-cyan-500 rounded-full"></div>

            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em] mb-1">
               Bei Analyse Drücken
            </div>
            
            <div className="text-[64px] font-black text-slate-800 tracking-tighter leading-none mb-3 font-mono">
               {formatCprTime(state.cprSeconds)}
            </div>

            <div className="flex items-center gap-3 text-[13px] font-black tracking-widest mt-1">
              <span className="text-amber-500 flex items-center gap-1.5">
                <i className="fa-solid fa-bolt"></i> 1
              </span>
              <span className="text-slate-200">|</span>
              <span className="text-[#E3000F]">150 J</span>
            </div>

          </div>
        );

      default:
        return (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-white rounded-full text-center">
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-2">Work in Progress</p>
            <div className="text-xl font-black text-slate-700">{state.appPhase}</div>
          </div>
        );
    }
  };

  return (
    <div 
      style={{ width: circleSize, height: circleSize }}
      className="rounded-full shadow-[0_15px_40px_rgba(0,0,0,0.08)] border-4 border-slate-50 flex items-center justify-center relative overflow-hidden bg-white shrink-0 transition-all duration-500 mx-auto"
    >
      {renderPhase()}
    </div>
  );
}