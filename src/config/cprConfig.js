// --- Datei: src/config/cprConfig.js ---

export const CPR_CONFIG = {
  // 1. ZYKLUS & TIMER (Alle Angaben in exakten Sekunden)
  TIMERS: {
    MASTER_LOOP: 120,          // 2 Minuten Rhythmus-Check
    DEFI_WARNING: 105,         // 15 Sekunden VOR der Analyse: "Defi laden!" (bei Sekunde 105)
    ADRENALIN_INTERVAL: 240,   // 4 Minuten (3-5 Min laut Guidelines) ab Erstgabe
    VENTILATION_CONT: 6,       // Kontinuierliche Beatmung: 1 Atemhub alle 6 Sekunden
  },

  // 2. STANDARD-MEDIKAMENTE (Erwachsene)
  DRUGS_ADULT: {
    ADRENALIN: "1 mg",
    AMIO_D1: "300 mg",         // 1. Dosis nach 3. Schock
    AMIO_D2: "150 mg",         // 2. Dosis nach 5. Schock
  },

  // 3. PÄDIATRIE-BERECHNUNG (Gewichtsadaptiert)
  // Hier hinterlegen wir die Formeln/Faktoren pro KG Körpergewicht
  DRUGS_PEDS_FACTORS: {
    ADRENALIN_MCG_PER_KG: 10,  // 10 µg pro kg Körpergewicht
    AMIO_MG_PER_KG: 5,         // 5 mg pro kg Körpergewicht
    JOULE_PER_KG: 4,           // 4 Joule pro kg (für Defibrillation)
  },

  // 4. EVENT-TYPEN FÜR DIE DATENBANK (Verhindert Tippfehler im Code)
  // Nutze IMMER diese Konstanten, wenn du logEvent() aufrufst!
  EVENTS: {
    PHASE_CHANGE: "PHASE_CHANGE", // z.B. "Start Kompression", "ROSC"
    DRUG: "DRUG",                 // z.B. "Adrenalin gegeben"
    SHOCK: "SHOCK",               // z.B. "150J geschockt", "Kein Schock"
    AIRWAY: "AIRWAY",             // z.B. "Intubiert", "Larynxtubus"
    PAUSE: "PAUSE",               // Unterbrechung der CPR
    RESUME: "RESUME",             // Fortsetzen der CPR
    WARNING: "WARNING",           // Vom System generierte Alarme (z.B. "Pausen-Warnung")
  }
};

// Hilfsfunktion: Berechnet Pädiatrie-Dosierungen blitzschnell
export const calculatePedsDose = (weightKg) => {
  return {
    adrenalinMcg: weightKg * CPR_CONFIG.DRUGS_PEDS_FACTORS.ADRENALIN_MCG_PER_KG,
    amioMg: weightKg * CPR_CONFIG.DRUGS_PEDS_FACTORS.AMIO_MG_PER_KG,
    joule: weightKg * CPR_CONFIG.DRUGS_PEDS_FACTORS.JOULE_PER_KG
  };
};