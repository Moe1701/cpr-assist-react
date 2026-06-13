// ==========================================
  // 5. METRONOM ZÄHLER (Das Herzstück für den Flash)
  // ==========================================
  useEffect(() => {
    if (!state.isCompressing) return;

    const metronome = setInterval(() => {
      const currentCount = stateRef.current.compressionCount;
      
      // Im KONT-Modus zählen wir unsichtbar hoch, damit der Flash-Effekt im Button getriggert wird!
      if (stateRef.current.cprMode === 'continuous') {
         dispatch({ type: 'SET_COMPRESSION_COUNT', payload: currentCount === 99 ? 1 : currentCount + 1 });
         return;
      }

      // Im Verhältnis-Modus zählen wir normal hoch
      const limit = stateRef.current.isPediatric ? 15 : 30;
      const nextCount = currentCount + 1;
      
      dispatch({ type: 'SET_COMPRESSION_COUNT', payload: nextCount });

      if (nextCount >= limit) {
         // Wir geben der Benutzeroberfläche 200ms Zeit, die finale "15" oder "30" rot aufblitzen zu lassen,
         // bevor wir die App hart in die blaue Beatmungsphase reißen!
         setTimeout(() => {
            triggerVentilationPhase();
         }, 200);
      }
      
    }, 600); // 600ms = exakt 100 Schläge pro Minute

    return () => clearInterval(metronome);
  }, [state.isCompressing, triggerVentilationPhase, dispatch]);