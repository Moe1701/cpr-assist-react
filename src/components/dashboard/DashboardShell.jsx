// --- Datei: src/components/DashboardShell.jsx ---
import React, { useContext } from 'react';
import { CprContext } from '../context/CprContext.jsx';
import { CPR_CONFIG } from '../config/cprConfig.js';

// --- Views importieren ---
import ViewObPatient from './views/ViewObPatient.jsx';
import ViewObInitialBreaths from './views/ViewObInitialBreaths.jsx';
import ViewObCompressions from './views/ViewObCompressions.jsx';
import ViewObAnalyze from './views/ViewObAnalyze.jsx';
import ViewJoule from './views/ViewJoule.jsx';
import ViewResume from './views/ViewResume.jsx';

// --- Modals importieren ---
// WICHTIG: Prüfe, ob der Pfad zu deinem PatientModal stimmt!
import PatientModal from './modals/PatientModal.jsx'; 

export default function DashboardShell() {
  const { state } = useContext(CprContext);

  // Der "Router": Welcher Screen wird gerade im Center-Kreis angezeigt?
  const renderCenterView = () => {
    switch (state.appPhase) {
      case CPR_CONFIG.PHASES.ONBOARDING:
        return <ViewObPatient />;
      case CPR_CONFIG.PHASES.OB_INITIAL_BREATHS:
        return <ViewObInitialBreaths />;
      case CPR_CONFIG.PHASES.OB_COMPRESSIONS:
        return <ViewObCompressions />;
      case CPR_CONFIG.PHASES.OB_ANALYZE:
        return <ViewObAnalyze />;
      case CPR_CONFIG.PHASES.JOULE:
        return <ViewJoule />;
      case CPR_CONFIG.PHASES.WAITING_CPR_RESUME:
        return <ViewResume />;
      case CPR_CONFIG.PHASES.RUNNING:
        return (
          <div className="flex flex-col items-center text-center animate-in zoom-in-95">
            <i className="fa-solid fa-heart-pulse text-red-500 text-6xl mb-4 animate-pulse"></i>
            <h2 className="text-2xl font-black text-slate-800">120s LOOP LÄUFT</h2>
            <p className="text-slate-400">Hier kommt später das echte Dashboard hin.</p>
          </div>
        );
      default:
        return <ViewObPatient />;
    }
  };

  return (
    <div className="relative w-full h-screen bg-slate-50 flex flex-col items-center justify-center overflow-hidden">
      
      {/* Header Platzhalter (kann später durch echte Nav-Leiste ersetzt werden) */}
      <div className="absolute top-0 w-full p-4 text-center z-10">
        <h1 className="text-sm font-bold text-slate-400 tracking-widest uppercase">CPR Assist</h1>
      </div>

      {/* Center Area - Hier laden die einzelnen Screens */}
      <div className="relative w-[320px] h-[450px] bg-white rounded-[3rem] shadow-xl border-4 border-slate-100 flex items-center justify-center p-4">
        {renderCenterView()}
      </div>

      {/* --- DAS OVERLAY MODAL --- */}
      {/* Wenn isPatientModalOpen true ist, legt sich das Modal über die gesamte App */}
      {state.isPatientModalOpen && <PatientModal />}
      
    </div>
  );
}