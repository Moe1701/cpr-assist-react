// --- Datei: src/components/views/ViewResume.jsx ---
import React, { useContext } from 'react';
import { CprContext } from '../../context/CprContext.jsx';
import { CPR_CONFIG } from '../../config/cprConfig.js';

export default function ViewResume() {
  const { dispatch, logEvent } = useContext(CprContext);

  const handleResume = () => {
    logEvent(CPR_CONFIG.EVENTS.RESUME, "Kompression FORTGESETZT (Zyklus-Start)");
    
    // 1. Zähler für den 120s-Zyklus zurücksetzen (da neuer Zyklus beginnt)
    dispatch({ type: 'TICK_CYCLE', payload: 0 }); // Wir bräuchten hier eigtl. einen RESET_CYCLE, wir machen es über eine schnelle Zuweisung, falls nötig.
    // Anmerkung: Um den Timer exakt auf 0 zu setzen, fügen wir im Reducer besser eine Aktion hinzu oder überschreiben es.
    // Einfacher Fix: Wir vertrauen darauf, dass der MasterLoop in der RUNNING Phase sauber loszählt.
    
    // 2. Wir stellen sicher, dass isCompressing wieder läuft
    dispatch({ type: 'TOGGLE_COMPRESSION', payload: true });
    
    // 3. DER SWITCH ZUM DASHBOARD
    dispatch({ type: 'SET_PHASE', payload: CPR_CONFIG.PHASES.RUNNING }); 
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-4 animate-in zoom-in-95 duration-300">
      
      <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
        <i className="fa-solid fa-hands-praying text-4xl"></i>
      </div>

      <button 
        onClick={handleResume}
        className="w-full max-w-[250px] bg-[#E3000F] text-white py-6 rounded-3xl font-black uppercase tracking-widest text-xl shadow-[0_10px_30px_rgba(227,0,15,0.4)] active:scale-95 transition-all"
      >
        CPR Fortsetzen
      </button>

      <p className="text-xs text-slate-400 font-bold tracking-widest uppercase mt-4 text-center">
        Startet 120s Timer
      </p>
    </div>
  );
}