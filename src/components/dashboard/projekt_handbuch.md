# 🚑 CPR ASSIST - PROJEKT HANDBUCH (Single Source of Truth)

Dieses Dokument dient als "externes Gedächtnis" für die KI. Es enthält alle festgelegten Regeln, Architekturentscheidungen und Abläufe, damit bei neuen Chat-Sitzungen der Kontext sofort wiederhergestellt werden kann.

## 1. ARCHITEKTUR & STATE-MANAGEMENT
* **Global State:** Die App nutzt die React Context API (`CprContext.jsx` & `cprReducer.js`).
* **Konstanten:** Alle festen Werte (Phasen, Timer, Medikamenten-Dosierungen) liegen streng getrennt in der `src/config/cprConfig.js`. 
* **Logik-Auslagerung:** Die Geschäftslogik ist in Custom Hooks getrennt:
    * `useMasterLoop.js`: Steuert die 120s-Zyklen, das hochpräzise Web-Audio Metronom und automatische 30:2 / 15:2 Pausen.
    * `useCenterEngine.js`: Steuert das zentrale Display (SVG-Timer, Farb-Eskalation, Audio-Alarm bei 0s).
    * `useAirwayEngine.js`: Die dedizierte 60-FPS Animations-Engine für den Atemwegs-Button.
    * `usePatientLogic.js`: Behandelt Broselow-Berechnungen und den Wechsel zwischen Erwachsenen/Kindern.

## 2. APP-PHASEN & ROUTING (ONBOARDING)
Der Ablauf vom Start bis zur eigentlichen Reanimation folgt einer strikten Reihenfolge:
1.  `ONBOARDING`: Patient wählen (Erwachsener oder Kind).
2.  `OB_INITIAL_BREATHS`: Nur bei Kindern (5 initiale Beatmungen).
3.  `OB_COMPRESSIONS`: Die Frage "Kompression gestartet?". **Ab hier starten die UI-Timer und das Metronom.**
4.  `OB_ANALYZE`: "Initiale Analyse" -> Hier drücken (Pausiert CPR automatisch).
5.  `DECISION`: Schockbar / Nicht Schockbar.
6.  `JOULE`: Energieauswahl (wird bei Pädiatrie nach Gewicht ausgerechnet: 4 J/kg oder 8 J/kg).
7.  `WAITING_CPR_RESUME`: "CPR Fortsetzen".
8.  `RUNNING`: Das eigentliche Live-Dashboard mit 120s-Loop.
9.  `ZUGANG`: Overlay-Menü für i.v./i.o. Anlage.

## 3. UI-LOGIK: PÄDIATRIE & BROSELOW-SETUP
Das Setup für Kinder (`PatientSetupModal.jsx`) ist auf extrem schnelle Bedienbarkeit unter Stress (UX "Fat-Finger") optimiert.
* **Broselow-Schnellwahl:** Große Farb-Kacheln ermöglichen die sofortige Auswahl des passenden Gewichts nach dem Broselow-Maßband.
* **Synchrone Slider:** Die Schieberegler für Alter und Gewicht berechnen sich über `calculatePediatricVitals` bidirektional. Wird das Alter geändert, passt sich das Gewicht an (und umgekehrt).
* **Globaler Impact:** Das hier gewählte Gewicht (`state.patientWeight`) ist die "Single Source of Truth" für die restliche App (Joule, Tubusgröße, Med-Dosierung).

## 4. UI-LOGIK: CENTER DISPLAY & SATELLITEN
* **Morphing:** Das zentrale Display ist ein perfekter Kreis. Im Dashboard (`RUNNING`) verkleinert es sich fließend auf `224px`.
* **Der 120s-Timer (SVG):** Wird performant als SVG gerendert und eskaliert visuell/akustisch (Cyan -> Grün -> Gelb -> Rot + Audio-Alarm).
* **Satelliten-Menüs (Overlays):** Klickt man auf einen Satelliten (z.B. Zugang), morpht das Center-Display kurzzeitig zum Eingabe-Menü. Der 120s-Timer und das Metronom laufen im Hintergrund unsichtbar weiter.

## 5. UI-LOGIK: ZUGANG & PROTOKOLLIERUNG
* **Smartes Auto-Mapping:** Wählt der Nutzer "i.o.", springen Größe und Ort automatisch auf die korrekten IO-Werte (z.B. "Tibia prox." und "EZ-IO Pink/Blau" je nach Alter). Bei "i.v." springt es auf "Grün 18G" und "Handrücken".
* **State-Feedback:** Nach dem Speichern ändert der Satelliten-Button auf dem Dashboard seine Farbe (Cyan) und zeigt den gelegten Zugangstyp an.
* **Das Einsatz-Logbuch:** Jede Aktion feuert ein `logEvent` an den Context, das exakte System-Uhrzeit, Laufzeit der Reanimation und Aktion (z.B. `[17:04:22] (03:15) ZUGANG: Zugang i.v. Rosa 20G Handrücken`) rechtssicher erfasst.

## 6. UI-LOGIK: ATEMWEG & CPR-BUTTON
### Der smarte Atemweg-Button
* **Pfad A (Beutel-Maske):** Führt zum Modus `30:2` oder `15:2`. Zeigt in den letzten 5 Kompressionen einen eigenen Countdown.
* **Pfad B (Invasiv):** Führt in einen sekundären Doku-Screen im Modal. Wechselt erst nach dem Speichern in den `KONT`-Modus (inklusive superschnellem Beatmungs-Countdown).

### Der dynamische CPR-Button
Der Play/Pause-Knopf ist eine State-Machine:
1. **Laufende CPR (Weiß):** Metronom-Zähler blitzt synchron zum Audio feuerrot auf.
2. **Beatmungs-Phase (Cyan):** Button blockiert kurzzeitig und signalisiert die Beatmung.
3. **Manuelle Pause (Weiß/Grün):** Zählt Pausen-Sekunden hoch. Eskaliert ab 5s zu Gelb, ab 10s zu Rot.

## 7. AUDIO ENGINE & METRONOM (Technisches Setup)
* **Technologie:** 100% Web Audio API. Keine MP3/WAV-Dateien.
* **Metronom:** Nutzt einen `OscillatorNode` (800 Hz Sine Wave). Gesteuert über Lookahead-Scheduler (`setTimeout` alle 25ms + `AudioContext.currentTime`).
* **Mute-Logik:** Greift als Guard (`if (stateRef.current.isMuted)`) *direkt vor* der Tonausgabe, wodurch das visuelle UI im Takt weiterläuft.

## 8. AKTUELLER STATUS
* **Erreicht:** Center-Display, Pädiatrie-Modal, MasterLoop, Audio-Engine und das Zugangs-Menü (inkl. Auto-Mapping & Logging) sind vollständig und fehlerfrei in React implementiert. Das "Sleek-Design" (ohne native Browser-Styles) ist als Standard gesetzt.
* **Nächste Schritte:** Implementierung der Medikamenten-Satelliten (Adrenalin mit 4-Minuten-Timer & gewichtsadaptierter Kinderdosis sowie Amiodaron).