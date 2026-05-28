import React, { useContext } from 'react';
import { CprContext } from '../context/CprContext.jsx';
import PatientSelection from './PatientSelection.jsx'; 

export default function CenterDisplay() {
  const { state } = useContext(CprContext);

  // Der Kreis wird kleiner, sobald der CPR-Timer läuft
  const isRunning = state.appPhase === 'CPR_RUNNING'; 
  const sizeClasses = isRunning
    ? 'w-[224px] h-[224px] sm:w-[244px] sm:h-[244px]'
    : 'w-[330px] h-[330px] sm:w-[400px] sm:h-[400px]';

  // Die Routing-Zentrale: Was soll im Kreis angezeigt werden?
  const renderPhase = () => {
    switch (state.appPhase) {
      case 'ONBOARDING':
      case 'OB_INITIAL_BREATHS':
      case 'OB_COMPRESSIONS':
      case 'OB_ANALYZE':
        // Unsere Onboarding-State-Machine übernimmt all diese Phasen
        return <PatientSelection />;
      
      default:
        // Ein Platzhalter für alle Phasen, die wir noch nicht gebaut haben
        return (
          <div className="text-center w-full z-10 p-6">
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-2">Work in Progress</p>
            <div className="text-xl font-black text-slate-700">{state.appPhase}</div>
          </div>
        );
    }
  };

  return (
    <div className={`${sizeClasses} rounded-full bg-white shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-slate-100 flex items-center justify-center mx-auto my-auto relative overflow-hidden pointer-events-auto z-30 transition-all duration-500`}>
      {renderPhase()}
    </div>
  );
}