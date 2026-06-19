# 🚑 CPR ASSIST - PROJEKT HANDBUCH (Single Source of Truth)

Dieses Dokument dient als "externes Gedächtnis" für die KI. Es enthält alle festgelegten Regeln, Architekturentscheidungen und Abläufe, damit bei neuen Chat-Sitzungen der Kontext sofort wiederhergestellt werden kann.

## 1. ARCHITEKTUR & STRICT MODULARIZATION ⚠️
* **Global State:** Die App nutzt die React Context API (`CprContext.jsx` & `cprReducer.js`).
* **Konstanten:** Alle festen Werte (Phasen, Timer, Medikamenten-Dosierungen) liegen streng getrennt in der `src/config/cprConfig.js`. 
* **Logik-Auslagerung (Hooks):** Die Geschäftslogik ist in Custom Hooks getrennt (`useMasterLoop`, `useCenterEngine`, `useAirwayEngine`, `usePatientLogic`).
* **⚠️ Dateigrößen-Limit (200 Zeilen):** Um Spaghetti-Code und Monolithen zu vermeiden, dürfen Komponenten nicht zu groß werden. Sobald Dateien (wie `DashboardShell.jsx`) die 200-Zeilen-Marke erreichen, **müssen** Inline-Komponenten (wie `SatelliteBtn`, `MainBtn` oder `OrbitPosition`) zwingend in einen separaten Ordner (z. B. `src/components/dashboard/ui/`) ausgelagert werden.

## 2. APP-PHASEN & ROUTING
Der Ablauf folgt einer strikten Reihenfolge:
1.  `ONBOARDING`: Patient wählen (Erwachsener oder Kind).
2.  `OB_INITIAL_BREATHS`: Nur bei Kindern (5 initiale Beatmungen).
3.  `OB_COMPRESSIONS`: Die Frage "Kompression gestartet?". **Ab hier starten UI-Timer und Metronom.**
4.  `OB_ANALYZE`: "Initiale Analyse" -> Hier drücken (Pausiert CPR automatisch).
5.  `DECISION`: Schockbar / Nicht Schockbar.
6.  `JOULE`: Energieauswahl (wird bei Pädiatrie nach Gewicht ausgerechnet: 4 J/kg oder 8 J/kg).
7.  `WAITING_CPR_RESUME`: "CPR Fortsetzen".
8.  `RUNNING`: Das eigentliche Live-Dashboard mit 120s-Loop.
9.  `ZUGANG`, `AIRWAY_MENU`, `AIRWAY_DOC`: Overlay-Menüs, die das Center-Display temporär überlagern.

## 3. UI-LOGIK: PÄDIATRIE & BROSELOW-SETUP
* **Broselow-Schnellwahl:** Große Farb-Kacheln für sofortige Gewichts-Auswahl.
* **Synchrone Slider:** Schieberegler für Alter und Gewicht berechnen sich bidirektional (`calculatePediatricVitals`).
* **Globaler Impact:** Das gewählte Gewicht (`state.patientWeight`) ist die "Single Source of Truth" für die restliche App (Joule, Tubusgröße, Med-Dosierung wie 10 µg/kg Adrenalin).

## 4. UI-LOGIK: CENTER DISPLAY & SATELLITEN
* **Morphing:** Center-Display ist ein perfekter Kreis (Dashboard: `224px`).
* **Der 120s-Timer (SVG):** SVG-Rendering, das visuell/akustisch eskaliert (Cyan -> Grün -> Gelb -> Rot + Audio-Alarm).
* **Satelliten-Menüs:** Das Center-Display morpht zum Eingabe-Menü, während der 120s-Timer im Hintergrund weiterläuft.

## 5. UI-LOGIK: SATELLITEN-FUNKTIONEN
### Zugang & Protokollierung
* **Smartes Auto-Mapping:** "i.o." wählt automatisch die korrekten IO-Werte (z.B. "Tibia prox." & "EZ-IO Pink"). "i.v." springt auf "Grün 18G" & "Handrücken".
* **Sleek UI:** Native Select-Styles werden durch `appearance-none` unterdrückt und durch cleane, weiße Dropdowns mit FontAwesome-Chevrons ersetzt.
* **Das Einsatz-Logbuch:** Jede Aktion feuert ein `logEvent` an den Context, das exakte System-Uhrzeit, Laufzeit der Reanimation und Aktion (z. B. `[17:04:22] (03:15) ZUGANG: Zugang i.v. Rosa 20G Handrücken`) erfasst.

### Medikamente (Adrenalin)
* **Smart Dosing:** Zeigt bei Erwachsenen "1 mg", bei Kindern dynamisch die berechnete Mikrogramm-Dosis.
* **4-Minuten-Timer:** Startet **nur** bei manuellem Klick auf die Gabe. Zeigt einen SVG-Progress-Ring, warnt ab 30s und löst bei 0s einen Vibrations- und Doppel-Beep-Alarm aus, bevor er sich auf den Ausgangszustand zurücksetzt.

## 6. UI-LOGIK: ATEMWEG & CPR-BUTTON
* **Atemweg:** Modal-Auswahl. "Beutel-Maske" führt zu `30:2`/`15:2`. "Invasiv" führt zur Doku und schaltet dann in den `KONT`-Modus.
* **CPR-Button:** Weiß (laufende CPR mit Flash), Cyan (Beatmung blockiert), Weiß/Grün (Manuelle Pause, die zeitlich eskaliert).

## 7. AUDIO ENGINE & METRONOM
* **Technologie:** 100% Web Audio API (`OscillatorNode` mit Lookahead-Scheduler).
* **Mute-Logik:** Greift als Guard *direkt vor* der Tonausgabe, wodurch das visuelle UI synchron im Takt weiterläuft.

## 8. AKTUELLER STATUS
* **Erreicht:** Center-Display, Broselow-Pädiatrie, MasterLoop, Audio-Engine, Sleek-UI Zugangs-Menü und Adrenalin-Timer sind implementiert.
* **Nächste Schritte:** 
  1. Auslagerung von Micro-Komponenten (Strict Modularization) aus `DashboardShell.jsx`.
  2. Implementierung der restlichen Satelliten (Amiodaron, Anamnese, ROSC).