# 🚑 CPR ASSIST - PROJEKT HANDBUCH (Single Source of Truth)

Dieses Dokument dient als "externes Gedächtnis" für die KI. Es enthält alle festgelegten Regeln, Architekturentscheidungen und Abläufe.

## 1. ARCHITEKTUR & STRICT MODULARIZATION ⚠️
* **Absolute Dateigröße (Die 200-Zeilen-Regel):** Keine Datei darf signifikant größer als 200 Zeilen werden. Alles muss maximal modularisiert und in kleine, fokussierte Sub-Komponenten (z. B. eigene Dateien für Header, Listen, Modals) ausgelagert werden.
* **Global State:** Die App nutzt die React Context API (`CprContext.jsx` & `cprReducer.js`).
* **Konstanten & Datenbanken:** Feste Werte in `cprConfig.js`, Medikamente in `medsConfig.js`.
* **Logik-Auslagerung (Hooks):** Geschäftslogik ist in Custom Hooks isoliert (`useMasterLoop`, `usePatientLogic` etc.).
* **⚠️ Performance-Regel:** Umfangreiche Berechnungen (SBAR, Zeitlinie, KPIs) werden konsequent über `useMemo` Hooks gekapselt.

## 2. APP-PHASEN & ROUTING
Der Ablauf folgt einer strikten Reihenfolge:
1.  `ONBOARDING` -> `OB_INITIAL_BREATHS` -> `OB_COMPRESSIONS` -> `OB_ANALYZE` -> `DECISION` -> `JOULE` -> `WAITING_CPR_RESUME`.
2.  `RUNNING`: Das Live-Dashboard mit 120s-Loop.
3.  **Overlay-Menüs:** `ZUGANG`, `AIRWAY_MENU`, `MEDS_MENU`, `HITS_MODAL`, `LOG_MODAL`.
4.  `ROSC`: Post-Resuscitation Care (pausiert Timer, blendet Checklisten ein).

## 3. UI-LOGIK: PÄDIATRIE & BROSELOW-SETUP
* **Broselow-Schnellwahl:** Synchrone Slider berechnen Alter, Gewicht und Größe bidirektional. 
* **Globaler Impact:** Das gewählte Gewicht ist die "Single Source of Truth" für Joule, Tubus, Meds und Pedi-Safe-Limits.

## 4. UI-LOGIK: CENTER DISPLAY & METRONOM
* Das Center-Display ist ein morphing-fähiger Kreis (`224px` im Dashboard).
* **Audio Engine:** 100% Web Audio API. Der Mute-Button unterdrückt nur die Tonausgabe, blockiert aber nicht das visuelle UI.

## 5. SATELLITEN & ZUSATZFUNKTIONEN
* **Medikamente:** Adrenalin (4-Minuten-Timer), Amiodaron (Transformer-Button ab 2. Gabe zu Koffer).
* **Anamnese:** HITS (Echtzeit-Logbuch) & SAMPLER (Speichern-Logik).
* **Protokoll & Export:** 4 Tabs (Liste, Übergabe/SBAR, Statistik, Zeitlinie). PDF-Export via `jsPDF`.

## 6. AKTUELLER STATUS & NÄCHSTE SCHRITTE
* **Erreicht:** Fundament, CPR-Engine, Pädiatrie, Medikamente, HITS/SAMPLER, komplettes Logbuch + PDF-Export funktionsfähig.
* **Nächster Schritt:** Implementierung des ROSC-Screens (inkl. Checklisten und Pedi-Safe-Limits) unter strikter Einhaltung der 200-Zeilen-Regel.