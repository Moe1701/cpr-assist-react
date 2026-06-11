// --- Datei: src/hooks/useGlobalTimer.js ---
import { useEffect, useContext, useRef } from 'react';
import { CprContext } from '../context/CprContext.jsx';

export function useGlobalTimer() {
  const { state, dispatch } = useContext(CprContext);
  
  const phaseRef = useRef(state.appPhase);
  const compressingRef = useRef(state.isCompressing);

  useEffect(() => {
    phaseRef.current = state.appPhase;
    compressingRef.current = state.isCompressing;
  }, [state.appPhase, state.isCompressing]);

  useEffect(() => {
    const masterTick = setInterval(() => {
      // FIX: Die Einsatzuhr startet JETZT sofort, wenn der Patient gewählt wurde 
      // (also sobald wir nicht mehr im allerersten ONBOARDING Screen sind)
      if (phaseRef.current !== 'ONBOARDING') {
        dispatch({ type: 'TICK_MISSION' });
      }

      // Die CPR-Uhr (Mitte) läuft nur, wenn auch wirklich gedrückt wird
      if (compressingRef.current === true) {
        dispatch({ type: 'TICK_CPR' });
      }

    }, 1000);

    return () => clearInterval(masterTick);
  }, [dispatch]);
}