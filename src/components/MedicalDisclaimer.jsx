import React, { useContext } from 'react';
import { CprContext } from '../../context/CprContext.jsx';

const MedicalDisclaimer = () => {
  const { hasAcceptedDisclaimer, acceptDisclaimer } = useContext(CprContext);

  // Wenn noch nicht akzeptiert -> Bildfüllendes Overlay (Blur)
  if (!hasAcceptedDisclaimer) {
    return (
      <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl">
          <h2 className="text-red-600 font-black uppercase text-lg mb-2">
            <i className="fa-solid fa-triangle-exclamation mr-2"></i>
            Nur für Training
          </h2>
          <p className="text-slate-600 text-sm font-bold mb-6">
            Diese App dient ausschließlich der Überwachung von Trainingsszenarien. Sie ist für den klinischen Live-Einsatz nicht validiert oder zugelassen. Nutzung auf eigene Gefahr.
          </p>
          <button
            onClick={acceptDisclaimer}
            className="w-full bg-blue-50 text-blue-600 border border-blue-200 py-3 rounded-xl font-black uppercase text-sm shadow-sm active:scale-95 transition-transform"
          >
            Ich verstehe & akzeptiere
          </button>
        </div>
      </div>
    );
  }

  // Wenn akzeptiert -> Kleines, rotes Banner ganz oben
  return (
    <div className="absolute top-4 left-0 right-0 w-full px-4 z-[65] pointer-events-none">
      <div className="w-full max-w-sm mx-auto bg-red-50/95 backdrop-blur-sm border-2 border-red-500 rounded-2xl p-2 shadow-sm text-center pointer-events-auto">
        <h2 className="text-red-700 font-black uppercase tracking-widest text-[10px] mb-0.5">
          <i className="fa-solid fa-triangle-exclamation mr-1.5"></i>Nur für Training
        </h2>
        <p className="text-red-800 text-[9px] font-bold leading-tight">
          Assistenz- & Trainingswerkzeug. Nicht validiert.
        </p>
      </div>
    </div>
  );
};

export default MedicalDisclaimer;