// ==========================================
  // 4. DER GLOBALE TICKER (100ms Auflösung)
  // ==========================================
  useEffect(() => {
    let lastTick = Date.now();

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
              // HIER IST DIE MAGIE: Wenn pausiert und keine Beatmung -> Zähle Pause hoch!
              dispatch({ type: 'TICK_PAUSE' });
          }
        }
      }
    }, 100);

    return () => clearInterval(masterTimer);
  }, [dispatch]);