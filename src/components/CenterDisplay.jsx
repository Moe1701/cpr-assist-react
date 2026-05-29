import React, { useContext } from 'react';
import { CprContext } from '../context/CprContext.jsx';
import PatientSelection from './PatientSelection.jsx'; 

export default function CenterDisplay() {
  const { state } = useContext(CprContext);

  // KORREKTUR: Der Kreis schrumpft ERST im finalen Dashboard,
  // nicht schon während des Onboardings!
  const isDashboard = state.appPhase === 'RUNNING'; 
  const circleSize = isDashboard ? 224 : 330;

  const renderPhase = () => {
    switch (state.appPhase) {
      case 'ONBOARDING':
      case 'OB_INITIAL_BREATHS':
      case 'OB_COMPRESSIONS':
      case 'OB_ANALYZE':
      case 'DECISION':
      case 'JOULE':
      case 'WAITING_CPR_RESUME':
        // All diese Phasen gehören zum großen Onboarding/Menü-Kreis
        return <PatientSelection />;
      
      case 'RUNNING':
        return (
          <div className="text-center w-full z-10 p-6 flex flex-col items-center justify-center">
            <div className="text-4xl font-black text-slate-700">120</div>
          </div>
        );

      default:
        return (
          <div className="text-center w-full z-10 p-6">
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-2">Work in Progress</p>
            <div className="text-xl font-black text-slate-700">{state.appPhase}</div>
          </div>
        );
    }
  };

  return (
    <div 
      style={{ width: `${circleSize}px`, height: `${circleSize}px` }}
      className="rounded-full bg-white shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-slate-100 flex items-center justify-center mx-auto my-auto relative overflow-hidden pointer-events-auto z-30 transition-all duration-500 shrink-0"
    >
      {renderPhase()}
    </div>
  );
}