// --- Datei: src/hooks/useMasterLoop.js ---
import { useEffect, useContext, useRef, useCallback } from 'react';
import { CprContext } from '../context/CprContext.jsx';
import { CPR_CONFIG } from '../config/cprConfig.js';

export function useMasterLoop() {
  const { state, dispatch, logEvent } = useContext(CprContext);

  // Ref auf den State, damit Intervalle keine Re-Renders auslösen, 
  // aber trotzdem immer den aktuellsten Wert kennen.
  const stateRef = useRef(state);
  useEffect(() => { stateRef.current = state; }, [state]);

  // ==========================================
  // 1. CPR BUTTON (Play / Pause)
  // ==========================================
  const toggleCpr = useCallback(() => {
    const isComp = !stateRef.current.isCompressing;
    dispatch({ type: 'TOGGLE_COMPRESSION', payload: isComp });
    dispatch({ type: 'SET_COMPRESSION_COUNT', payload: 0 }); 
    
    logEvent(CPR_CONFIG.EVENTS.PAUSE, isComp ? "Kompression FORTGESETZT" : "Kompression PAUSE");
  }, [dispatch, logEvent]);

  // ==========================================
  // 2. ATEMWEG SICHERN
  // ==========================================
  const setAirway = useCallback((airwayType) => {
    dispatch({ type: 'SET_AIRWAY', payload: airwayType });
    logEvent(CPR_CONFIG.EVENTS.AIRWAY, `Atemweg gesichert: ${airwayType}`);

    if (airwayType === 'Beutel-Maske') {
      const mode = stateRef.current.isPediatric ? '15:2' : '30:2';
      dispatch({ type: 'SET_CPR_MODE', payload: mode });
      logEvent(CPR_CONFIG.EVENTS.PHASE_CHANGE, `Modus: ${mode} (Beutel-Maske)`);
    } else {
      dispatch({ type: 'SET_CPR_MODE', payload: 'continuous' });
      logEvent(CPR_CONFIG.EVENTS.PHASE_CHANGE, `Modus gewechselt auf: KONT (Invasiv)`);
    }
  }, [dispatch, logEvent]);

  // ==========================================
  // 3. AUTOMATISCHES PING-PONG (30:2 Beatmung)
  // ==========================================
  const triggerVentilationPhase = useCallback(() => {
    dispatch({ type: 'SET_VENTILATION_PHASE', payload: true });
    dispatch({ type: 'TOGGLE_COMPRESSION', payload: false });
    dispatch({ type: 'SET_COMPRESSION_COUNT', payload: 0 });

    logEvent(CPR_CONFIG.EVENTS.PAUSE, "Automatische Beatmungspause (2x)");

    // 2.5 Sekunden warten (2x Beatmen a 1s + 0.5s Puffer)
    setTimeout(() => {
      // Nur automatisch fortsetzen, wenn nicht gerade manuell pausiert oder analysiert wird
      if (stateRef.current.appPhase === CPR_CONFIG.PHASES.RUNNING) {
        dispatch({ type: 'SET_VENTILATION_PHASE', payload: false });
        dispatch({ type: 'TOGGLE_COMPRESSION', payload: true });
        logEvent(CPR_CONFIG.EVENTS.RESUME, "Kompression nach Beatmung automatisch fortgesetzt");
      }
    }, 2500);
  }, [dispatch, logEvent]);

  // ==========================================
  // 4. DER GLOBALE TICKER (100ms Auflösung)
  // ==========================================
  useEffect(() => {
    let lastTick = Date.now();

    const masterTimer = setInterval(() => {
      // Timer tickt nur in der aktiven Reanimationsphase oder nach dem ersten Onboarding
      if (stateRef.current.appPhase === 'ONBOARDING') return;

      const now = Date.now();
      const deltaMs = now - lastTick;

      if (deltaMs >= 1000) {
        lastTick += 1000;
        
        // 1. Gesamteinsatzzeit (läuft ab Patientenwahl)
        dispatch({ type: 'TICK_MISSION' });

        // 2. Ticks nur während echter CPR (nicht im Onboarding-Menü)
        if (stateRef.current.appPhase === CPR_CONFIG.PHASES.RUNNING) {
          // 120s Loop Timer
          dispatch({ type: 'TICK_CYCLE' });

          // CCF Logik (Leitliniengetreu: Jede Pause senkt den Wert)
          dispatch({ type: 'TICK_CCF_ARREST' });
          if (stateRef.current.isCompressing) {
              dispatch({ type: 'TICK_CCF_COMPRESSING' });
          }
        }
      }
    }, 100);

    return () => clearInterval(masterTimer);
  }, [dispatch]);

  // ==========================================
  // 5. DAS 100 BPM METRONOM (Zähler für 30:2)
  // ==========================================
  useEffect(() => {
    // Nur aktiv, wenn gedrückt wird UND wir nicht im KONT-Modus sind
    if (!state.isCompressing || state.cprMode === 'continuous') return;

    // 100 Kompressionen pro Minute = alle 600ms ein Tick
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

  return { toggleCpr, setAirway };
}