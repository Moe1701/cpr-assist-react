import React, { useRef, useContext } from 'react';
import { CprProvider, CprContext } from './context/CprContext.jsx';
import MedicalDisclaimer from './MedicalDisclaimer.jsx';
import CenterDisplay from './components/CenterDisplay.jsx';
import PatientSetupModal from './components/PatientSetupModal.jsx'; 
import DashboardShell from './components/dashboard/DashboardShell.jsx';

function MainApp() {
  const { state } = useContext(CprContext);
  const clickCount = useRef(0);
  const clickTimer = useRef(null);

  const handleLogoClick = () => {
    clickCount.current += 1;
    clearTimeout(clickTimer.current);
    if (clickCount.current >= 3) {
      localStorage.clear();
      window.location.reload();
    } else {
      clickTimer.current = setTimeout(() => {
        clickCount.current = 0;
      }, 500);
    }
  };

  return (
    <div className="max-w-md mx-auto h-[100dvh] overflow-hidden bg-slate-50 relative flex flex-col select-none">
      <header className="flex items-center justify-between bg-white px-4 py-3 border-b border-slate-200 shadow-sm z-[70] relative shrink-0">
        <div className="flex items-center gap-3 p-1 cursor-pointer" onClick={handleLogoClick}>
          <div className="w-10 h-10 flex items-center justify-center text-[#E3000F]">
            <i className="fa-solid fa-heart-pulse text-3xl"></i>
          </div>
          <div className="flex flex-col justify-center leading-none">
            <span className="text-lg font-black text-slate-900 uppercase tracking-tight">CPR Assist</span>
          </div>
        </div>
      </header>

      <MedicalDisclaimer />
      <PatientSetupModal /> 

      <main className="flex-1 flex flex-col items-center justify-center relative z-10 w-full h-full">
         {state.isRunning ? <DashboardShell /> : <CenterDisplay />}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <CprProvider>
      <MainApp />
    </CprProvider>
  );
}