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

## 3. UI-LOGIK: PÄDIATRIE & BROSELOW-SETUP
Das Setup für Kinder (`PatientSetupModal.jsx`) ist auf extrem schnelle Bedienbarkeit unter Stress (UX "Fat-Finger") optimiert.
* **Broselow-Schnellwahl:** Große Farb-Kacheln ermöglichen die sofortige Auswahl des passenden Gewichts nach dem Broselow-Maßband.
* **Synchrone Slider:** Die Schieberegler für Alter und Gewicht berechnen sich über `calculatePediatricVitals` bidirektional. Wird das Alter geändert, passt sich das Gewicht an (und umgekehrt). Die Größe (cm) ist ein reiner Read-Only-Wert, der mathematisch abgeleitet wird.
* **Globaler Impact:** Das hier gewählte Gewicht (`state.patientWeight`) ist die "Single Source of Truth" für die restliche App. Es steuert automatisch:
    * Die Joule-Vorschläge im Defi-Menü (`calculatePedsDose`).
    * Die Tubus- und Tiefe-Vorschläge im Atemwegs-Doku-Modal (`getBroselowZone`).
    * Die Medikamenten-Dosierungen (Adrenalin/Amiodaron) für die Satelliten-Buttons.

## 4. UI-LOGIK: CENTER DISPLAY (Das Herzstück)
* **Morphing:** Das zentrale Display ist ein perfekter Kreis. Im Onboarding hat es eine Größe von `340px`. Im Dashboard (`RUNNING`) verkleinert es sich fließend auf `224px`.
* **Der 120s-Timer (SVG):** Wird performant als SVG gerendert. Der Fortschritt wächst synchron zur Zeit ab 12 Uhr im Uhrzeigersinn.
* **Eskalations-Stufen:**
  * > 30s: Cyan (Normal)
  * <= 30s: Grün ("ANALYSE VORBEREITEN")
  * <= 15s: Gelb pulsierend ("PULS TASTEN, DEFI LADEN")
  * == 0s: Rot glühend, roter Button-Hintergrund, rote pulsierende Warn-Pille + durchdringender Web-Audio-Alarm (Doppel-Piepton) im Sekundentakt.

## 5. UI-LOGIK: ATEMWEG & CPR-BUTTON
### Der smarte Atemweg-Button
* **Kein einfacher Toggle:** Der Button öffnet immer zuerst ein Modal.
* **Pfad A (Beutel-Maske):** Führt zum Modus `30:2` oder `15:2`. Zeigt in den letzten 5 Kompressionen einen eigenen Countdown.
* **Pfad B (Invasiv):** Führt in einen sekundären Doku-Screen im Modal. Wechselt erst nach dem Speichern in den `KONT`-Modus (inklusive superschnellem Beatmungs-Countdown).

### Der dynamische CPR-Button
Der Play/Pause-Knopf unten rechts ist eine State-Machine mit 3 Phasen:
1. **Laufende CPR (Weiß):** Metronom-Zähler blitzt synchron zum Audio feuerrot auf.
2. **Beatmungs-Phase (Cyan):** Button blockiert kurzzeitig und signalisiert die Beatmung.
3. **Manuelle Pause (Weiß/Grün):** Zählt die Pausen-Sekunden hoch. Eskaliert ab 5 Sekunden zu Gelb (Warnung) und ab 10 Sekunden zu pulsierendem Rot (Kritisch).

## 6. AUDIO ENGINE & METRONOM (Technisches Setup)
* **Technologie:** 100% Web Audio API. Keine MP3/WAV-Dateien.
* **Metronom:** Nutzt einen `OscillatorNode` (800 Hz Sine Wave). Gesteuert über Lookahead-Scheduler (`setTimeout` alle 25ms + `AudioContext.currentTime`).
* **Beatmungston:** White-Noise-Buffer mit BandPass-Filter (400 Hz) und Volume-Envelopes (1 Sekunde).
* **Mute-Logik:** Greift als Guard (`if (stateRef.current.isMuted)`) *direkt vor* der Tonausgabe, wodurch das visuelle UI im Takt weiterläuft.

## 7. ALLGEMEINE UI & LAYOUT REGELN
* **Mobile Klick-Sicherheit:** Alle Buttons, die Icons (`<i>`) oder Text (`<span>`) enthalten, müssen zwingend `pointer-events-none` auf diesen inneren Elementen haben, damit Touch-Events (iOS/Android) den React-`onClick` nicht blockieren.
* **Text-Umbrüche im Kreis:** Innerhalb des kreisrunden Displays zwingend echte HTML-Tags (`<br/>`) für Zeilenumbrüche nutzen. Standard-`\n` wird vom Kreis-Overflow abgeschnitten.

## 8. AKTUELLER STATUS (Stand: Core-Dashboard & Pädiatrie abgeschlossen)
* **Erreicht:** Das Center-Display-Metronom eskaliert visuell und akustisch korrekt. Das komplexe Broselow-Tape-Modal wurde im Original-Design restauriert und an den globalen Context gekoppelt. Der CPR-Button und die MasterLoop-Engine laufen fehlerfrei.
* **Nächste Schritte:** Fokus auf die Satelliten-Buttons (Medikamenten-Logik, Zugang, Anamnese, ROSC-Ende).