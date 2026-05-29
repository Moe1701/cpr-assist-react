import React, { useRef } from 'react';

// Der Tresor mit allen Daten
import { CprProvider } from './context/CprContext.jsx';

// Unsere globalen Komponenten
import MedicalDisclaimer from './MedicalDisclaimer.jsx';
import CenterDisplay from './components/CenterDisplay.jsx';
import PatientSetupModal from './components/PatientSetupModal.jsx'; 

export default function App() {
  // --- HARD RESET LOGIK ---
  const clickCount = useRef(0);
  const clickTimer = useRef(null);

  const handleLogoClick = () => {
    clickCount.current += 1;
    clearTimeout(clickTimer.current);

    if (clickCount.current >= 3) {
      // 3 Klicks erreicht -> Hard Reset ausführen
      localStorage.clear(); // Löscht den Disclaimer-Status und zukünftige Speicherungen
      window.location.reload(); // Lädt die App komplett neu
    } else {
      // Timer starten: Wenn nicht innerhalb von 500ms weiter geklickt wird, setze Counter zurück
      clickTimer.current = setTimeout(() => {
        clickCount.current = 0;
      }, 500);
    }
  };

  return (
    <CprProvider>
      <div className="max-w-md mx-auto h-[100dvh] overflow-hidden bg-slate-50 relative flex flex-col select-none">
        
        {/* HEADER */}
        <header className="flex items-center justify-between bg-white px-4 py-3 border-b border-slate-200 shadow-sm z-[70] relative shrink-0">
          {/* Logo-Bereich mit Klick-Erkennung */}
          <div 
            className="flex items-center gap-3 p-1 cursor-pointer" 
            onClick={handleLogoClick}
          >
            <div className="w-10 h-10 flex items-center justify-center text-[#E3000F]">
              <i className="fa-solid fa-heart-pulse text-3xl"></i>
            </div>
            <div className="flex flex-col justify-center leading-none">
              <span className="text-lg font-black text-slate-900 uppercase tracking-tight">CPR Assist</span>
            </div>
          </div>
        </header>

        {/* OVERLAYS */}
        <MedicalDisclaimer />
        <PatientSetupModal /> 

        {/* INTERFACE (Der Kreis und später die Satelliten) */}
        <main className="flex-1 flex flex-col items-center justify-center p-4 relative z-10">
           <CenterDisplay />
        </main>
        
      </div>
    </CprProvider>
  );
}