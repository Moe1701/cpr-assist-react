// --- Datei: src/config/cprConfig.js ---
export const CPR_CONFIG = {
  PHASES: {
    ONBOARDING: 'onboarding',
    OB_INITIAL_BREATHS: 'ob_initial_breaths',
    OB_COMPRESSIONS: 'ob_compressions',
    OB_ANALYZE: 'ob_analyze',
    DECISION: 'decision',
    JOULE: 'joule',
    WAITING_CPR_RESUME: 'waiting_cpr_resume',
    RUNNING: 'running',
    ZUGANG: 'zugang',
    AIRWAY_MENU: 'airway_menu',
    AIRWAY_DOC: 'airway_doc',
    MEDS_MENU: 'meds_menu',
    ROSC: 'rosc',
    DEBRIEFING: 'debriefing'
  },
  EVENTS: {
    DRUG: 'Medikament',
    SHOCK: 'Schock',
    AIRWAY: 'Atemweg',
    ACCESS: 'Zugang',
    INFO: 'Info',
    HITS: 'HITS'
  }
};

export const CHECKLISTS = {
  ROSC_DATA: [
    { cat: 'A', title: 'Airway', items: [{ label: 'Atemweg & Cuffdruck (20-30 cmH2O)' }, { label: 'Magensonde (Dekompressions)' }] },
    { cat: 'B', title: 'Breathing', items: [{ label: 'Auskultation (Seitengleich?)' }, { label: 'Oxygenierung', sub: 'SpO2 Ziel: 94-98%' }, { label: 'Normoventilation', sub: 'etCO2 Ziel: 35-45 mmHg' }, { label: 'Oberkörper 30° hochlagern' }] },
    { cat: 'C', title: 'Circulation', items: [{ label: '12-Kanal EKG', sub: 'Suche nach STEMI / Ischämie' }, { label: 'Blutdruck stabilisieren', sub: 'Ziel: MAP > 65 mmHg | syst > 100' }, { label: 'Rekap-Zeit prüfen (< 2 Sek.)' }, { label: 'Zugänge prüfen & Katecholamine' }] },
    { cat: 'D', title: 'Disability (Neuro)', items: [{ label: 'Pupillen kontrollieren' }, { label: 'GCS ermitteln' }, { label: 'Analgosedierung sichern' }, { label: 'Blutzucker messen', sub: 'Ziel: 140 - 180 mg/dl' }] },
    { cat: 'E', title: 'Exposure & Environment', items: [{ label: 'Bodycheck', sub: 'Keine Diagnose durch die Hose!' }, { label: 'Temperaturmanagement', sub: 'Ziel: 36 °C (Fieber strikt meiden!)' }, { label: 'Ursachenforschung (HITS) re-evaluieren' }, { label: 'Zielklinik / CAC anmelden', sub: 'Vorab-Info über EKG & Status' }, { label: 'Angehörige informieren / betreuen' }] }
  ],
  ABBRUCH_REASONS: [
    { id: 'erfolglos', label: 'Erfolglose Reanimation', icon: 'fa-heart-crack', color: 'text-red-500' },
    { id: 'dnr', label: 'Patientenverfügung / DNR', icon: 'fa-file-signature', color: 'text-indigo-500' },
    { id: 'angehoerige', label: 'Wunsch der Angehörigen', icon: 'fa-users', color: 'text-amber-500' },
    { id: 'todeszeichen', label: 'Sichere Todeszeichen', icon: 'fa-book-skull', color: 'text-slate-800' }
  ]
};
