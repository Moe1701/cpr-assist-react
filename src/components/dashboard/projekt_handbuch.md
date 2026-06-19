# 🚑 CPR ASSIST - PROJEKT HANDBUCH (Single Source of Truth)

Dieses Dokument dient als "externes Gedächtnis" für die KI. Es enthält alle festgelegten Regeln, Architekturentscheidungen und Abläufe, damit bei neuen Chat-Sitzungen der Kontext sofort wiederhergestellt werden kann.

## 1. ARCHITEKTUR & STRICT MODULARIZATION ⚠️
* **Global State:** Die App nutzt die React Context API (`CprContext.jsx` & `cprReducer.js`).
* **Konstanten & Datenbanken:** Feste Werte liegen in `src/config/cprConfig.js`. Erweiterte Medikamente liegen als strukturierte Datenbank in `src/config/medsConfig.js`.
* **Logik-Auslagerung (Hooks):** Die Geschäftslogik ist in Custom Hooks getrennt (`useMasterLoop`, `useCenterEngine`, `useAirwayEngine`, `usePatientLogic`).
* **⚠️ Dateigrößen-Limit (200 Zeilen):** Um Spaghetti-Code zu vermeiden, dürfen Komponenten nicht zu groß werden. Inline-Komponenten werden konsequent ausgelagert. Das UI wird wo immer möglich *datengetrieben* (Data-Driven) aufgebaut.

## 2. APP-PHASEN & ROUTING
Der Ablauf folgt einer strikten Reihenfolge:
1.  `ONBOARDING`: Patient wählen (Erwachsener oder Kind).
2.  `OB_INITIAL_BREATHS`: Nur bei Kindern (5 initiale Beatmungen).
3.  `OB_COMPRESSIONS`: "Kompression gestartet?". **Ab hier starten UI-Timer und Metronom.**
4.  `OB_ANALYZE`: "Initiale Analyse" -> Pausiert CPR automatisch.
5.  `DECISION`: Schockbar / Nicht Schockbar.
6.  `JOULE`: Energieauswahl (Kinder: automatisch 4 J/kg oder 8 J/kg).
7.  `WAITING_CPR_RESUME`: "CPR Fortsetzen".
8.  `RUNNING`: Das Live-Dashboard mit 120s-Loop.
9.  `ZUGANG`, `AIRWAY_MENU`, `AIRWAY_DOC`, `MEDS_MENU`: Overlay-Menüs, die das Center-Display temporär überlagern, während Hintergrund-Timer (Metronom, 120s, Adrenalin) ungestört weiterlaufen.

## 3. UI-LOGIK: PÄDIATRIE & BROSELOW-SETUP
* **Broselow-Schnellwahl:** Große Farb-Kacheln für sofortige Gewichts-Auswahl.
* **Synchrone Slider:** Schieberegler für Alter und Gewicht berechnen sich bidirektional (`calculatePediatricVitals`).
* **Globaler Impact:** Das gewählte Gewicht (`state.patientWeight`) ist die "Single Source of Truth" für die restliche App (Joule, Tubusgröße, Dosis-Berechnung bei Adrenalin, Amiodaron und erweiterten Medikamenten).

## 4. UI-LOGIK: CENTER DISPLAY
* **Morphing:** Center-Display ist ein perfekter Kreis (Dashboard: `224px`).
* **Der 120s-Timer (SVG):** SVG-Rendering, das visuell/akustisch eskaliert (Cyan -> Grün -> Gelb -> Rot + Audio-Alarm).

## 5. UI-LOGIK: SATELLITEN-FUNKTIONEN
### Zugang & Protokollierung
* **Smartes Auto-Mapping:** "i.o." wählt automatisch "Tibia prox." & "EZ-IO". "i.v." springt auf "Grün 18G" & "Handrücken".
* **Das Einsatz-Logbuch:** Jede Aktion feuert ein `logEvent` an den Context, das System-Uhrzeit, Laufzeit der Reanimation und Aktion (z. B. `[17:04:22] (03:15) DRUG: Adrenalin 1 mg gegeben`) rechtssicher erfasst.

### Medikamente (Adrenalin & Amiodaron)
* **Adrenalin:** 4-Minuten-Timer. Startet manuell bei Klick, eskaliert bei 30s und 0s. 
* **Amiodaron & Transformation:** Zählt die Gaben mit. Berechnet bei Kindern 5 mg/kg, bei Erwachsenen 300 mg -> 150 mg. Nach der 2. Gabe verwandelt sich der Button auf dem Dashboard in einen Koffer ("Weitere Meds"), um Platz für das `MEDS_MENU` zu machen.
* **Data-Driven Meds Menu:** Das Menü für weitere Medikamente (Calcium, Atropin etc.) wird vollautomatisch aus der `medsConfig.js` gerendert.

## 6. UI-LOGIK: ATEMWEG & CPR-BUTTON
* **Atemweg:** "Beutel-Maske" schaltet auf `30:2`/`15:2`. "Invasiv" schaltet nach Doku-Eingabe auf `KONT`.
* **CPR-Button:** Weiß (laufende CPR mit synchronem Flash), Cyan (Beatmungsphase blockiert), Weiß/Grün (Manuelle Pause, die zeitlich eskaliert).

## 7. AUDIO ENGINE & METRONOM
* **Technologie:** 100% Web Audio API (`OscillatorNode` mit Lookahead-Scheduler).
* **Mute-Logik:** Greift als Guard *direkt vor* der Tonausgabe, wodurch das visuelle UI im Takt weiterläuft.

## 8. AKTUELLER STATUS
* **Erreicht:** Adrenalin-Timer, Amiodaron-Transformation und die `medsConfig.js` Datenbank sind aufgebaut.
* **Nächster Schritt:** Programmierung der `ViewMedsMenu.jsx`, um den Koffer-Button funktionsfähig zu machen und die Medikamenten-Liste dynamisch im Center-Display anzuzeigen.