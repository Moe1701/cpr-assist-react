// --- Datei: src/components/dashboard/DashboardShell.jsx ---
import React, { useContext } from 'react';

// 1. KORREKTE PFADE ZU CONTEXT UND CONFIG (2 Ebenen hoch)
import { CprContext } from '../../context/CprContext.jsx';
import { CPR_CONFIG } from '../../config/cprConfig.js';

// 2. KORREKTE PFADE ZU DEN VIEWS (1 Ebene hoch, dann in views)
import ViewObPatient from '../views/ViewObPatient.jsx';
import ViewObInitialBreaths from '../views/ViewObInitialBreaths.jsx';
import ViewObCompressions from '../views/ViewObCompressions.jsx';
import ViewObAnalyze from '../views/ViewObAnalyze.jsx';
import ViewJoule from '../views/ViewJoule.jsx';
// KORREKTER DATEINAME:
import ViewCprResume from '../views/ViewCprResume.jsx'; 

// 3. KORREKTER PFAD ZUM MODAL (liegt direkt im components Ordner)
import PatientSetupModal from '../PatientSetupModal.jsx'; 

// Ein kleiner Platzhalter für den Running-Modus, damit wir ihn sauber laden können
const DummyRunningView = () => (
  <div className="flex flex-col items-center text-center animate-in zoom-in-95">
    <i className="fa-solid fa-heart-pulse text-red-500 text-6xl mb-4 animate-pulse"></i>
    <h2 className="text-2xl font-black text-slate-800">120s LOOP LÄUFT</h2>
    <p className="text-slate-400">Hier kommt später das echte Dashboard hin.</p>
  </div>
);

export default function DashboardShell() {
  const { state } = useContext(CprContext);

  // SAUBERER ROUTER: Wir weisen die Komponente einer Variable zu!
  let CurrentView;
  
  switch (state.appPhase) {
    case CPR_CONFIG.PHASES.ONBOARDING:
      CurrentView = ViewObPatient;
      break;
    case CPR_CONFIG.PHASES.OB_INITIAL_BREATHS:
      CurrentView = ViewObInitialBreaths;
      break;
    case CPR_CONFIG.PHASES.OB_COMPRESSIONS:
      CurrentView = ViewObCompressions;
      break;
    case CPR_CONFIG.PHASES.OB_ANALYZE:
      CurrentView = ViewObAnalyze;
      break;
    case CPR_CONFIG.PHASES.JOULE:
      CurrentView = ViewJoule;
      break;
    case CPR_CONFIG.PHASES.WAITING_CPR_RESUME:
      CurrentView = ViewCprResume; // Korrekter Name zugewiesen
      break;
    case CPR_CONFIG.PHASES.RUNNING:
      CurrentView = DummyRunningView;
      break;
    default:
      CurrentView = ViewObPatient;
  }

  return (
    <div className="relative w-full h-screen bg-slate-50 flex flex-col items-center justify-center overflow-hidden">
      
      <div className="absolute top-0 w-full p-4 text-center z-10">
        <h1 className="text-sm font-bold text-slate-400 tracking-widest uppercase">CPR Assist</h1>
      </div>

      <div className="relative w-[320px] h-[450px] bg-white rounded-[3rem] shadow-xl border-4 border-slate-100 flex items-center justify-center p-4">
        {/* HIER IST DIE MAGIE: Wir rendern es als waschechte React-Komponente */}
        <CurrentView />
      </div>

      {state.isPatientModalOpen && <PatientSetupModal />}
      
    </div>
  );
}