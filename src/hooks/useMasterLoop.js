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

  // --- ATEMWEGS-WEICHE (Pfad A, B, C) ---
  const selectAirway = useCallback((type) => {
    dispatch({ type: 'SET_AIRWAY', payload: { established: true, type } });
    logEvent(CPR_CONFIG.EVENTS.AIRWAY, `Atemweg gesichert: ${type}`);
    dispatch({ type: 'SET_COMPRESSION_COUNT', payload: 0 }); 

    if (type === 'Beutel-Maske') {
      const mode = stateRef.current.isPediatric ? '15:2' : '30:2';
      dispatch({ type: 'SET_CPR_MODE', payload: mode });
      logEvent(CPR_CONFIG.EVENTS.PHASE_CHANGE, `Modus: ${mode} (Beutel-Maske)`);
    } else {
      dispatch({ type: 'SET_CPR_MODE', payload: 'continuous' });
      logEvent(CPR_CONFIG.EVENTS.PHASE_CHANGE, `Modus gewechselt auf: KONT (Invasiv)`);
    }
  }, [dispatch, logEvent]);

  const removeAirway = useCallback(() => {
    dispatch({ type: 'SET_AIRWAY', payload: { established: false, type: null } });
    logEvent(CPR_CONFIG.EVENTS.AIRWAY, "Atemweg: entfernt");
    if (stateRef.current.cprMode === 'continuous') {
      const mode = stateRef.current.isPediatric ? '15:2' : '30:2';
      dispatch({ type: 'SET_CPR_MODE', payload: mode });
      logEvent(CPR_CONFIG.EVENTS.PHASE_CHANGE, `Modus: ${mode} (Auto-Switch)`);
    }
  }, [dispatch, logEvent]);

  // --- PING-PONG (30:2) ---
  const triggerVentilationPhase = useCallback(() => {
    dispatch({ type: 'SET_VENTILATION_PHASE', payload: true });
    dispatch({ type: 'TOGGLE_COMPRESSION', payload: false });
    dispatch({ type: 'SET_COMPRESSION_COUNT', payload: 0 });

    setTimeout(() => {
      setTimeout(() => {
        if (stateRef.current.appPhase === CPR_CONFIG.PHASES.RUNNING) {
           dispatch({ type: 'SET_VENTILATION_PHASE', payload: false });
           dispatch({ type: 'TOGGLE_COMPRESSION', payload: true });
        }
      }, 1500);
    }, 1500);
  }, [dispatch]);

  // --- DER GLOBALE TICKER ---
  useEffect(() => {
    let lastTick = Date.now();
    let cycleStartTime = Date.now();
    let hasPlayedSound = false;

    const masterTimer = setInterval(() => {
      if (stateRef.current.appPhase === 'ONBOARDING') return;
      const now = Date.now();
      const deltaMs = now - lastTick;

      if (deltaMs >= 1000) {
        lastTick += 1000;
        dispatch({ type: 'TICK_MISSION' });

        if (stateRef.current.appPhase === CPR_CONFIG.PHASES.RUNNING) {
          dispatch({ type: 'TICK_CYCLE' });
          dispatch({ type: 'TICK_CCF_ARREST' });
          if (stateRef.current.isCompressing) {
              dispatch({ type: 'TICK_CCF_COMPRESSING' });
          } else if (!stateRef.current.isVentilationPhase) {
              // Pausen-Warnung hochzählen, wenn nicht gerade beatmet wird!
              dispatch({ type: 'TICK_PAUSE' });
          }
        }
      }

      // KONT-TIMER
      if (stateRef.current.appPhase === CPR_CONFIG.PHASES.RUNNING && stateRef.current.cprMode === 'continuous' && stateRef.current.airwayEstablished) {
          const cycleDuration = stateRef.current.isPediatric ? 2400 : 6000; 
          const fillDuration = cycleDuration - 1000;
          let elapsed = now - cycleStartTime;

          if (elapsed >= cycleDuration) { cycleStartTime = now; elapsed = 0; hasPlayedSound = false; }

          if (elapsed < fillDuration) {
              const remaining = Math.ceil((fillDuration - elapsed) / 1000);
              if (stateRef.current.breathCountdown !== remaining) {
                  dispatch({ type: 'SET_BREATH_COUNTDOWN', payload: remaining });
              }
          } else if (!hasPlayedSound) {
              dispatch({ type: 'SET_BREATH_COUNTDOWN', payload: "HUB" });
              hasPlayedSound = true;
          }
      } else if (stateRef.current.breathCountdown !== null) {
          dispatch({ type: 'SET_BREATH_COUNTDOWN', payload: null });
          cycleStartTime = Date.now();
      }
    }, 100);
    return () => clearInterval(masterTimer);
  }, [dispatch]);

  // --- METRONOM ZÄHLER ---
  useEffect(() => {
    if (!state.isCompressing || state.cprMode === 'continuous') return;
    const metronome = setInterval(() => {
      const currentCount = stateRef.current.compressionCount;
      const limit = stateRef.current.isPediatric ? 15 : 30;
      if (currentCount >= limit - 1) {
        triggerVentilationPhase();
      } else {
        dispatch({ type: 'SET_COMPRESSION_COUNT', payload: currentCount + 1 });
      }
    }, 600);
    return () => clearInterval(metronome);
  }, [state.isCompressing, state.cprMode, triggerVentilationPhase, dispatch]);

  return { toggleCpr, selectAirway, removeAirway };
}