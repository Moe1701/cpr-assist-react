// --- Datei: src/hooks/useAirwayTimer.js ---
import { useState, useEffect, useContext } from 'react';
import { CprContext } from '../context/CprContext.jsx';

export function useAirwayTimer() {
  const { state } = useContext(CprContext);
  const [isFlashingHub, setIsFlashingHub] = useState(false);

  useEffect(() => {
    // smarte Prüfung: Wenn etabliert und NICHT Beutel-Maske, dann ist es invasiv!
    const isInvasive = state.airwayEstablished && state.airwayType !== 'Beutel-Maske';

    // Wenn kein invasiver Atemweg liegt ODER die Kompression pausiert ist -> kein Blitzen
    if (!isInvasive || !state.isCompressing) {
      setIsFlashingHub(false);
      return;
    }

    // Erwachsene = alle 6000ms | Pädiatrie = alle 2400ms
    const intervalMs = state.isPediatric ? 2400 : 6000;
    
    // Die Blitz-Funktion
    const triggerFlash = () => {
      setIsFlashingHub(true);
      setTimeout(() => {
        setIsFlashingHub(false);
      }, 250); // Flash-Dauer (250 Millisekunden)
    };

    // DEEP DIVE FIX: Zünde den ersten Flash SOFORT! 
    // Dadurch weiß der User sofort: "Aha, der Timer läuft!"
    triggerFlash();

    // Danach den normalen Rhythmus fortsetzen
    const timer = setInterval(triggerFlash, intervalMs);

    // Aufräumen, wenn pausiert wird oder der Atemweg entfernt wird
    return () => clearInterval(timer);
    
  }, [state.airwayEstablished, state.airwayType, state.isCompressing, state.isPediatric]);

  return { isFlashingHub };
}