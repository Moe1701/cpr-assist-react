// --- Datei: src/components/HelpOverlay.jsx ---
import React, { useContext } from 'react';
import { CprContext } from '../context/CprContext.jsx';

export default function HelpOverlay({ isActive }) {
  const { state } = useContext(CprContext);

  if (!isActive) return null;

  // Hier können wir später je nach Phase (z.B. ONBOARDING vs. RUNNING) 
  // andere Hilfetexte anzeigen.
  const isDashboard = state.appPhase === 'RUNNING';

  // Kleine Hilfs-Komponente für die dunklen Info-Boxen
  const InfoBox = ({ children, className = "" }) => (
    <div className={`bg-slate-800 border border-slate-600 rounded-xl p-3 text-slate-100 text-[11px] font-bold text-center shadow-lg leading-tight flex items-center justify-center ${className}`}>
      {children}
    </div>
  );

  return (
    <div className="fixed inset-0 z-[200] bg-slate-900/90 backdrop-blur-sm flex flex-col animate-in fade-in duration-150 pointer-events-none">
      
      {/* Hinweis zum Loslassen - Oben zentriert */}
      <div className="pt-24 w-full text-center">
        <span className="text-slate-400 font-bold tracking-widest text-xs uppercase">
          Loslassen zum Schliessen
        </span>
      </div>

      {/* Das Flowchart / Cheat-Sheet in der Mitte */}
      {isDashboard ? (
        <div className="flex-1 relative flex items-center justify-center w-full max-w-[400px] mx-auto">
          
          {/* Zentrum: Red Box & ROSC */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-3">
            <i className="fa-solid fa-arrow-up text-slate-400 text-xl"></i>
            <InfoBox>Adrenalin<br/>(3-5 Min)</InfoBox>
            
            <div className="bg-red-600 text-white font-black text-sm text-center p-4 rounded-2xl shadow-[0_0_20px_rgba(220,38,38,0.4)] my-1 w-[220px]">
              MASTER-ZYKLUS<br/>& RHYTHMUS-CHECK
            </div>
            
            <InfoBox>ROSC-Bündel<br/>& Ende</InfoBox>
            <i className="fa-solid fa-arrow-down text-slate-400 text-xl"></i>
          </div>

          {/* Links (Protokoll & Zugang) */}
          <div className="absolute top-1/2 left-4 -translate-y-1/2 flex flex-col gap-3 w-[100px]">
            <InfoBox>Protokoll<br/>& Zeitstrahl</InfoBox>
            <div className="flex justify-center -my-2 z-10 relative">
               <i className="fa-solid fa-arrow-up text-slate-400 text-lg"></i>
            </div>
            <InfoBox>Zugang<br/>i.v. / i.o.</InfoBox>
          </div>

          {/* Rechts (Sampler & Amio) */}
          <div className="absolute top-1/2 right-4 -translate-y-1/2 flex flex-col gap-3 w-[100px]">
            <InfoBox>Ursachen<br/>(SAMPLER)</InfoBox>
            <div className="flex justify-center -my-2 z-10 relative">
               <i className="fa-solid fa-arrow-down text-slate-400 text-lg"></i>
            </div>
            <InfoBox>Amiodaron<br/>& Co.</InfoBox>
          </div>

          {/* Unten Links (Atemweg) */}
          <div className="absolute bottom-24 left-4 flex flex-col items-center gap-3 w-[120px]">
            <InfoBox>Atemweg-Doku<br/>& Beatmung</InfoBox>
            <i className="fa-solid fa-arrow-down text-slate-400 text-xl"></i>
          </div>

          {/* Unten Rechts (Kompression) */}
          <div className="absolute bottom-24 right-4 flex flex-col items-center gap-3 w-[120px]">
            <InfoBox>Kompression<br/>& Pausen-Warnung</InfoBox>
            <i className="fa-solid fa-arrow-down text-slate-400 text-xl"></i>
          </div>

        </div>
      ) : (
        /* Falls man im Onboarding drückt */
        <div className="flex-1 flex items-center justify-center">
          <InfoBox className="w-[200px]">
            Bitte wähle zuerst den<br/>Patienten aus, um die<br/>Reanimation zu starten.
          </InfoBox>
        </div>
      )}

    </div>
  );
}