// --- Datei: src/components/CenterDisplay.jsx ---
import React, { useContext } from 'react';
import { CprContext } from '../context/CprContext.jsx';
import PatientSelection from './PatientSelection.jsx'; 

export default function CenterDisplay() {
  const { state } = useContext(CprContext);

  // KORREKTUR DER PROPORTIONEN: 210px für das kompakte Dashboard
  const isDashboard = state.appPhase === 'RUNNING';
  const circleSize = isDashboard ? '210px' : '330px';

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
          <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-white rounded-full">
             <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">
               Bei Analyse Drücken
             </div>
             {/* Textgröße leicht angepasst für den 210px Kreis */}
             <div className="text-[60px] font-black text-slate-800 tracking-tighter leading-none">
               119
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
      className="rounded-full shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-slate-100 flex items-center justify-center relative overflow-hidden bg-white shrink-0 transition-all duration-300 mx-auto"
    >
      {renderPhase()}
    </div>
  );
}