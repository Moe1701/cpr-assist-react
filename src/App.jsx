import React from 'react';

// Wir importieren den ECHTEN Tresor aus deinem context-Ordner
import { CprProvider } from './context/CprContext.jsx';

// Wir importieren die Komponenten
import MedicalDisclaimer from './MedicalDisclaimer.jsx'; 
import CenterDisplay from './components/CenterDisplay.jsx'; 

export default function App() {
  return (
    <CprProvider>
      <div className="max-w-md mx-auto h-[100dvh] overflow-hidden bg-slate-50 relative flex flex-col select-none">
        
        {/* HEADER */}
        <header className="flex items-center justify-between bg-white px-4 py-3 border-b border-slate-200 shadow-sm z-[70] relative shrink-0">
          <div className="flex items-center gap-3 p-1">
            <div className="w-10 h-10 flex items-center justify-center text-[#E3000F]">
              <i className="fa-solid fa-heart-pulse text-3xl"></i>
            </div>
            <div className="flex flex-col justify-center leading-none">
              <span className="text-lg font-black text-slate-900 uppercase tracking-tight">CPR Assist</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-0.5">React Beta</span>
            </div>
          </div>
        </header>

        {/* Disclaimer */}
        <MedicalDisclaimer />

        {/* Interface - Hier wird dein großer Kreis geladen */}
        <main className="flex-1 flex flex-col items-center justify-center p-4 relative z-10">
           <CenterDisplay />
        </main>
        
      </div>
    </CprProvider>
  );
}