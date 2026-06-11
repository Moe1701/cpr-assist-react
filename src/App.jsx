// --- Datei: src/App.jsx ---
import React, { useContext, useState } from 'react';
import { CprProvider, CprContext } from './context/CprContext.jsx';
import { useGlobalTimer } from './hooks/useGlobalTimer.js';

import MedicalDisclaimer from './MedicalDisclaimer.jsx';
import DashboardShell from './components/dashboard/DashboardShell.jsx';
import PatientSetupModal from './components/PatientSetupModal.jsx';
import SettingsModal from './components/SettingsModal.jsx';
import HelpOverlay from './components/HelpOverlay.jsx';

import './App.css';

function MainApp() {
  const { state } = useContext(CprContext);
  
  // 1. NEU: Der State für das Einstellungsmenü
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  useGlobalTimer();

  // 2. NEU: Die "Brechstange" (Triple-Click Hard Reset)
  // Löscht den gesamten fehlerhaften Browser-Speicher und lädt die App frisch
  const handleTripleClick = (e) => {
    if (e.detail === 3) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="bg-slate-200/50 w-full h-[100dvh] flex justify-center items-center overflow-hidden relative">
      <div className="w-full max-w-[430px] h-full bg-slate-50 flex flex-col relative shadow-2xl overflow-hidden text-slate-900 select-none">
        
        {/* HEADER */}
        <header className="flex items-center justify-between bg-white px-4 py-3 border-b border-slate-200 shadow-sm z-[70] relative shrink-0">
          
          {/* HIER LIEGT DER TRIPLE-CLICK: Einfach 3x schnell auf das Logo/den Namen tippen! */}
          <div className="flex items-center gap-3 p-1 cursor-pointer" onClick={handleTripleClick}>
            <div className="w-10 h-10 flex items-center justify-center shrink-0 text-[#E3000F]">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"/></svg>
            </div>
            <div className="flex flex-col justify-center leading-none pointer-events-none">
              <span className="text-lg font-black text-slate-900 uppercase tracking-tight">CPR Assist</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-0.5">by Moe</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="text-slate-400 text-xl p-2 active:scale-90 transition-transform"><i className="fa-solid fa-circle-question"></i></button>
            <button className="text-slate-400 text-xl p-2 active:scale-90 transition-transform"><i className="fa-solid fa-volume-high"></i></button>
            
            {/* 3. NEU: Der Settings-Button ist jetzt scharf geschaltet! */}
            <button 
              onClick={() => setIsSettingsOpen(true)} 
              className="text-slate-600 text-xl p-2 active:scale-90 transition-transform ml-1"
            >
              <i className="fa-solid fa-gear"></i>
            </button>
          </div>
        </header>

        <MedicalDisclaimer />

        {/* HAUPTBEREICH */}
        <main className="flex-1 relative z-20 w-full flex flex-col">
          <DashboardShell />
        </main>

        <PatientSetupModal />
        
        {/* 4. NEU: Das Modal bekommt mitgeteilt, ob es offen sein soll */}
        <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
        
        <HelpOverlay />

      </div>
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