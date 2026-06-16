// --- Datei: src/hooks/useGlobalTimer.js ---
import { useEffect, useContext } from 'react';
import { CprContext } from '../context/CprContext.jsx';
import { CPR_CONFIG } from '../config/cprConfig.js';

export function useGlobalTimer() {
  const { state, dispatch } = useContext(CprContext);

  useEffect(() => {
    // DIE HANDBREMSE: Wenn wir noch im Startbildschirm (Onboarding) sind,
    // darf die Einsatzzeit auf gar keinen Fall loslaufen!
    if (state.appPhase === CPR_CONFIG.PHASES.ONBOARDING) {
      return; // Bricht hier ab und startet keinen Timer
    }

    // Sobald die Phase wechselt (Patient ausgewählt), startet der 1-Sekunden-Takt
    const timerId = setInterval(() => {
      dispatch({ type: 'TICK_MISSION' });
    }, 1000);

    // Aufräumen, falls die Komponente unmountet wird
    return () => clearInterval(timerId);
    
  }, [state.appPhase, dispatch]); 
}
