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

  // DER SYNTHETISCHE BEATMUNGSTON (White Noise + BandPass Filter aus deinem alten Code)
  const playVentSound = useCallback(() => {
    if (stateRef.current.isMuted || !window.CPR_AudioCtx) return;
    const ctx = window.CPR_AudioCtx;
    const bufferSize = ctx.sampleRate * 1.0;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 400;
    filter.Q.value = 0.8;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.6, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.6, ctx.currentTime + 0.7);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.0);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    source.start();
    source.stop(ctx.currentTime + 1.0);
  }, []);

  const triggerVentilationPhase = useCallback(() => {
    dispatch({ type: 'SET_VENTILATION_PHASE', payload: true });
    dispatch({ type: 'TOGGLE_COMPRESSION', payload: false });
    dispatch({ type: 'SET_COMPRESSION_COUNT', payload: 0 });

    // Ping-Pong Beatmung mit 1.5s Pause
    playVentSound();
    setTimeout(() => {
      playVentSound();
      setTimeout(() => {
        const validPhases = [CPR_CONFIG.PHASES.RUNNING, CPR_CONFIG.PHASES.OB_ANALYZE, CPR_CONFIG.PHASES.DECISION, CPR_CONFIG.PHASES.JOULE, CPR_CONFIG.PHASES.WAITING_CPR_RESUME];
        if (validPhases.includes(stateRef.current.appPhase)) {
           dispatch({ type: 'SET_VENTILATION_PHASE', payload: false });
           dispatch({ type: 'TOGGLE_COMPRESSION', payload: true });
        }
      }, 1500);
    }, 1500);
  }, [dispatch, playVentSound]);

  // DER GLOBALE TICKER (Für Einsatzzeit und Pausen)
  useEffect(() => {
    let lastTick = Date.now();
    const masterTimer = setInterval(() => {
      if (stateRef.current.appPhase === 'ONBOARDING') return;
      const now = Date.now();
      if (now - lastTick >= 1000) {
        lastTick += 1000;
        dispatch({ type: 'TICK_MISSION' });

        const isPastSetup = !['ONBOARDING', 'OB_INITIAL_BREATHS'].includes(stateRef.current.appPhase);
        if (isPastSetup) {
          dispatch({ type: 'TICK_CCF_ARREST' });
          if (stateRef.current.isCompressing) dispatch({ type: 'TICK_CCF_COMPRESSING' });
          else if (!stateRef.current.isVentilationPhase) dispatch({ type: 'TICK_PAUSE' });
        }
        if (stateRef.current.appPhase === CPR_CONFIG.PHASES.RUNNING) dispatch({ type: 'TICK_CYCLE' });
      }
    }, 100);
    return () => clearInterval(masterTimer);
  }, [dispatch]);

  // =======================================================
  // DIE WEB-AUDIO LOOKAHEAD ENGINE (Metronom + UI Sync)
  // =======================================================
  useEffect(() => {
    if (!state.isCompressing) return;

    // Audio Context zünden (erlaubt, da isCompressing durch Button-Klick kam!)
    if (!window.CPR_AudioCtx) {
        window.CPR_AudioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (window.CPR_AudioCtx.state === 'suspended') window.CPR_AudioCtx.resume();

    const ctx = window.CPR_AudioCtx;
    let nextNoteTime = ctx.currentTime + 0.05;
    let timerID;

    const scheduler = () => {
        // Lookahead Loop
        while (nextNoteTime < ctx.currentTime + 0.1) {
            
            // 1. AUDIO SPIELEN (Falls nicht stumm)
            if (!stateRef.current.isMuted) {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(800, nextNoteTime);
                gain.gain.setValueAtTime(0, nextNoteTime);
                gain.gain.linearRampToValueAtTime(1.0, nextNoteTime + 0.01);
                gain.gain.exponentialRampToValueAtTime(0.001, nextNoteTime + 0.05);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(nextNoteTime);
                osc.stop(nextNoteTime + 0.05);
            }

            // 2. UI-STATE UPDATEN (Exakt getimt mit der Ton-Ausgabe!)
            const timeUntilNote = Math.max(0, (nextNoteTime - ctx.currentTime) * 1000);
            setTimeout(() => {
                const currentCount = stateRef.current.compressionCount;
                if (stateRef.current.cprMode === 'continuous') {
                    dispatch({ type: 'SET_COMPRESSION_COUNT', payload: currentCount === 99 ? 1 : currentCount + 1 });
                } else {
                    const limit = stateRef.current.isPediatric ? 15 : 30;
                    const nextCount = currentCount + 1;
                    dispatch({ type: 'SET_COMPRESSION_COUNT', payload: nextCount });

                    if (nextCount >= limit) {
                        setTimeout(() => triggerVentilationPhase(), 200);
                    }
                }
            }, timeUntilNote);

            // Nächsten Takt berechnen (mit der flexiblen BPM Einstellung!)
            const secondsPerBeat = 60.0 / stateRef.current.bpm;
            nextNoteTime += secondsPerBeat;
        }
        
        // Loop fortsetzen alle 25ms
        timerID = setTimeout(scheduler, 25);
    };

    scheduler();

    return () => clearTimeout(timerID);
  }, [state.isCompressing, triggerVentilationPhase, dispatch]);

  return { toggleCpr };
}
