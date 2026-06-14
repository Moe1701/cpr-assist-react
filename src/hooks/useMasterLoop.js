import { useEffect, useContext, useRef, useCallback } from 'react';
import { CprContext } from '../context/CprContext.jsx';
import { CPR_CONFIG } from '../config/cprConfig.js';

export function useMasterLoop() {
  const { state, dispatch, logEvent } = useContext(CprContext);
  const stateRef = useRef(state);
  
  useEffect(() => { stateRef.current = state; }, [state]);

  const toggleCpr = useCallback(() => {
    const isComp = !stateRef.current.isCompressing;
    dispatch({ type: 'TOGGLE_COMPRESSION', payload: isComp });
    dispatch({ type: 'SET_COMPRESSION_COUNT', payload: 0 }); 
    logEvent(CPR_CONFIG.EVENTS.PAUSE, isComp ? "Kompression FORTGESETZT" : "Kompression PAUSE");
  }, [dispatch, logEvent]);

  const triggerVentilationPhase = useCallback(() => {
    dispatch({ type: 'SET_VENTILATION_PHASE', payload: true });
    dispatch({ type: 'TOGGLE_COMPRESSION', payload: false });
    dispatch({ type: 'SET_COMPRESSION_COUNT', payload: 0 });

    setTimeout(() => {
      setTimeout(() => {
        const validPhases = [
            CPR_CONFIG.PHASES.RUNNING, 
            CPR_CONFIG.PHASES.OB_ANALYZE, 
            CPR_CONFIG.PHASES.DECISION, 
            CPR_CONFIG.PHASES.JOULE, 
            CPR_CONFIG.PHASES.WAITING_CPR_RESUME
        ];
        if (validPhases.includes(stateRef.current.appPhase)) {
           dispatch({ type: 'SET_VENTILATION_PHASE', payload: false });
           dispatch({ type: 'TOGGLE_COMPRESSION', payload: true });
        }
      }, 1500);
    }, 1500);
  }, [dispatch]);

  // DER GLOBALE TICKER
  useEffect(() => {
    let lastTick = Date.now();

    const masterTimer = setInterval(() => {
      if (stateRef.current.appPhase === 'ONBOARDING') return;

      const now = Date.now();
      const deltaMs = now - lastTick;

      if (deltaMs >= 1000) {
        lastTick += 1000;
        
        dispatch({ type: 'TICK_MISSION' });

        const isPastSetup = !['ONBOARDING', 'OB_INITIAL_BREATHS'].includes(stateRef.current.appPhase);

        if (isPastSetup) {
          dispatch({ type: 'TICK_CCF_ARREST' });
          
          if (stateRef.current.isCompressing) {
              dispatch({ type: 'TICK_CCF_COMPRESSING' });
          } else if (!stateRef.current.isVentilationPhase) {
              dispatch({ type: 'TICK_PAUSE' });
          }
        }

        if (stateRef.current.appPhase === CPR_CONFIG.PHASES.RUNNING) {
          dispatch({ type: 'TICK_CYCLE' });
        }
      }
    }, 100);

    return () => clearInterval(masterTimer);
  }, [dispatch]);

  // METRONOM ZÄHLER (Jetzt mit dynamischen BPM!)
  useEffect(() => {
    if (!state.isCompressing) return;

    // MAGIE: Wir berechnen die Dauer eines Schlags in Millisekunden!
    // Bei 100 BPM = 600ms. Bei 120 BPM = 500ms.
    const intervalMs = Math.round(60000 / state.bpm);

    const metronome = setInterval(() => {
      const currentCount = stateRef.current.compressionCount;
      
      if (stateRef.current.cprMode === 'continuous') {
         dispatch({ type: 'SET_COMPRESSION_COUNT', payload: currentCount === 99 ? 1 : currentCount + 1 });
         return;
      }

      const limit = stateRef.current.isPediatric ? 15 : 30;
      const nextCount = currentCount + 1;
      
      dispatch({ type: 'SET_COMPRESSION_COUNT', payload: nextCount });

      if (nextCount >= limit) {
         setTimeout(() => {
            triggerVentilationPhase();
         }, 200);
      }
      
    }, intervalMs);

    return () => clearInterval(metronome);
  }, [state.isCompressing, state.bpm, triggerVentilationPhase, dispatch]);

  return { toggleCpr };
}
