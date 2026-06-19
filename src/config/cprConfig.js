// --- Datei: src/config/cprConfig.js ---

export const CPR_CONFIG = {
  // 1. ZYKLUS & TIMER (Alle Angaben in exakten Sekunden)
  TIMERS: {
    MASTER_LOOP: 120,          
    DEFI_WARNING: 105,         
    ADRENALIN_INTERVAL: 240,   
    VENTILATION_CONT: 6,       
  },

  // 2. STANDARD-MEDIKAMENTE (Erwachsene)
  DRUGS_ADULT: {
    ADRENALIN: "1 mg",
    AMIO_D1: "300 mg",         
    AMIO_D2: "150 mg",         
  },

  // 3. PÄDIATRIE-BERECHNUNG (Gewichtsadaptiert)
  DRUGS_PEDS_FACTORS: {
    ADRENALIN_MCG_PER_KG: 10,  
    AMIO_MG_PER_KG: 5,         
    JOULE_PER_KG: 4,           
  },

  // 4. EVENT-TYPEN FÜR DIE DATENBANK
  EVENTS: {
    PHASE_CHANGE: "PHASE_CHANGE", 
    DRUG: "DRUG",                 
    SHOCK: "SHOCK",               
    AIRWAY: "AIRWAY",             
    PAUSE: "PAUSE",               
    RESUME: "RESUME",             
    WARNING: "WARNING",           
    ZUGANG: "ZUGANG", // <--- NEU
  },

  // 5. PHASEN ALS KONSTANTEN (Verhindert Tippfehler im Code)
  PHASES: {
    ONBOARDING: 'ONBOARDING',
    OB_INITIAL_BREATHS: 'OB_INITIAL_BREATHS',
    OB_COMPRESSIONS: 'OB_COMPRESSIONS',
    OB_ANALYZE: 'OB_ANALYZE',
    DECISION: 'DECISION',
    JOULE: 'JOULE',
    WAITING_CPR_RESUME: 'WAITING_CPR_RESUME',
    RUNNING: 'RUNNING',
    AIRWAY_MENU: 'AIRWAY_MENU', 
    AIRWAY_DOC: 'AIRWAY_DOC',
    ZUGANG: 'ZUGANG' // <--- NEU
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