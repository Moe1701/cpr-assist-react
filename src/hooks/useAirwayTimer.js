// --- Datei: src/hooks/useAirwayTimer.js ---
import { useState, useEffect, useContext } from 'react';
import { CprContext } from '../context/CprContext.jsx';

export function useAirwayTimer() {
  const { state } = useContext(CprContext);
  const [isFlashingHub, setIsFlashingHub] = useState(false);

  useEffect(() => {
    // Der Timer läuft nur im Invasiv-Modus (KONT) und wenn CPR aktiv ist!
    if (!state.airwayEstablished || state.airwayType !== 'Invasiv' || !state.isCompressing) {
      setIsFlashingHub(false);
      return;
    }

    // Erwachsene = 10 Beatmungen/Min (alle 6000ms)
    // Pädiatrie = 25 Beatmungen/Min (alle 2400ms)
    const intervalMs = state.isPediatric ? 2400 : 6000;
    
    const timer = setInterval(() => {
      // 1. Zünde den Flash-State
      setIsFlashingHub(true);
      
      // 2. Beende den Flash nach 250 Millisekunden wieder (visuelles Blitzen)
      setTimeout(() => {
        setIsFlashingHub(false);
      }, 250);
      
    }, intervalMs);

    return () => clearInterval(timer);
  }, [state.airwayEstablished, state.airwayType, state.isCompressing, state.isPediatric]);

  return { isFlashingHub };
}