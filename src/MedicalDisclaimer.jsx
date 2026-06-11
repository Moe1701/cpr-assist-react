// --- Datei: src/components/MedicalDisclaimer.jsx ---
import React, { useState } from 'react';

export default function MedicalDisclaimer() {
  // Lokaler State: Wurde der Disclaimer in dieser Sitzung schon bestätigt?
  const [isAccepted, setIsAccepted] = useState(false);

  // Wenn er bestätigt wurde, verschwindet die Komponente komplett aus dem DOM
  if (isAccepted) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl flex flex-col text-center border-2 border-red-500">
        
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center text-3xl shadow-sm border border-red-100">
            <i className="fa-solid fa-triangle-exclamation"></i>
          </div>
        </div>
        
        <h3 className="text-lg font-black text-slate-800 uppercase tracking-wide mb-2">
          Wichtiger Hinweis
        </h3>
        
        <p className="text-sm font-bold text-slate-600 mb-6 text-left p-3 bg-slate-50 rounded-lg border border-slate-100 leading-relaxed">
          Diese App dient ausschließlich der Überwachung von <span className="text-[#E3000F] font-black">Trainingsszenarien</span>. Sie ist für den klinischen Live-Einsatz nicht validiert oder zugelassen. Alle Dosierungen sind eigenverantwortlich zu prüfen. Nutzung auf eigene Gefahr.
        </p>
        
        <button 
          onClick={() => setIsAccepted(true)}
          className="w-full bg-[#E3000F] text-white py-4 rounded-xl font-black uppercase tracking-widest text-sm active:scale-95 shadow-md transition-transform"
        >
          Ich verstehe
        </button>
        
      </div>
    </div>
  );
}