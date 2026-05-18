import React, { useContext } from 'react';
import { CprContext } from '../context/CprContext.jsx'; // Ein Ordner hoch, dann in context
import PatientSelection from './PatientSelection.jsx'; // Liegt direkt daneben

const CenterDisplay = () => {
  const { state } = useContext(CprContext);

  const isRunning = state.appPhase === 'RUNNING';
  const sizeClasses = isRunning
    ? 'w-[224px] h-[224px] sm:w-[244px] sm:h-[244px] p-6'
    : 'w-[330px] h-[330px] sm:w-[400px] sm:h-[400px] p-12 sm:p-14';

  const renderPhase = () => {
    switch (state.appPhase) {
      case 'ONBOARDING':
        return <PatientSelection />;
      default:
        return (
          <div className="text-center w-full">
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-2">Work in Progress</p>
            <div className="text-xl font-black text-slate-700">{state.appPhase}</div>
          </div>
        );
    }
  };

  return (
    <div className={`${sizeClasses} rounded-full bg-white shadow-xl border border-slate-100 flex items-center justify-center mx-auto my-auto relative overflow-hidden pointer-events-auto z-30 transition-all duration-500`}>
      {renderPhase()}
    </div>
  );
};

export default CenterDisplay;