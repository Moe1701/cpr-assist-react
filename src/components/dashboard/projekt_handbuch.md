# 🚑 CPR ASSIST - PROJEKT HANDBUCH (Single Source of Truth)

Dieses Dokument dient als "externes Gedächtnis" für die KI. Es enthält alle festgelegten Regeln, Architekturentscheidungen und Abläufe, damit bei neuen Chat-Sitzungen der Kontext sofort wiederhergestellt werden kann.

## 1. ARCHITEKTUR & STATE-MANAGEMENT
* **Global State:** Die App nutzt die React Context API (`CprContext.jsx` & `cprReducer.js`).
* **Konstanten:** Alle festen Werte (Phasen, Timer, Medikamenten-Dosierungen) liegen streng getrennt in der `src/config/cprConfig.js`. 
* **Logik-Auslagerung:** Die Geschäftslogik ist in Custom Hooks getrennt:
    * `useGlobalTimer.js`: Steuert die fortlaufende Einsatzzeit (missionSeconds). 
    * `useMasterLoop.js`: Steuert die 120s-Zyklen, das 100-BPM Metronom und automatische 30:2 / 15:2 Pausen.
    * `usePatientLogic.js`: Behandelt Broselow-Berechnungen und den Wechsel zwischen Erwachsenen/Kindern.

## 2. APP-PHASEN & ROUTING (ONBOARDING)
Der Ablauf vom Start bis zur eigentlichen Reanimation folgt einer strikten Reihenfolge, gesteuert durch `PatientSelection.jsx`:
1.  `ONBOARDING`: Patient wählen (Erwachsener oder Kind).
2.  `OB_INITIAL_BREATHS`: Nur bei Kindern (5 initiale Beatmungen).
3.  `OB_COMPRESSIONS`: Die Frage "Kompression gestartet?". **Ab hier starten die UI-Elemente der Reanimation.**
4.  `OB_ANALYZE`: "Initiale Analyse" -> Hier drücken.
5.  `DECISION`: Schockbar / Nicht Schockbar.
6.  `JOULE`: Energieauswahl (wird bei Pädiatrie nach Gewicht ausgerechnet: 4 J/kg oder 8 J/kg).
7.  `WAITING_CPR_RESUME`: "CPR Fortsetzen".
8.  `RUNNING`: Das eigentliche Live-Dashboard mit 120s-Loop.

## 3. UI & LAYOUT REGELN
* **CenterDisplay Morphing:** Das zentrale Display ist ein perfekter Kreis (`rounded-full`). Im Onboarding hat es eine Größe von `340px`. Im Dashboard (`RUNNING`) verkleinert es sich fließend auf `224px`.
* **Sichtbarkeit "Bottom Buttons":** Die Knöpfe für *Atemweg* und *CPR Play/Pause* werden exakt ab der Phase `OB_COMPRESSIONS` eingeblendet.
* **Text-Umbrüche im Kreis:** Innerhalb des kreisrunden Displays zwingend echte HTML-Tags (`<br/>`) für Zeilenumbrüche nutzen. Standard-`\n` wird vom Kreis-Overflow abgeschnitten.

## 4. AKTUELLER STATUS (Stand: Layout-Merge abgeschlossen)
* **Erreicht:** Die neue, performante Hook-Logik wurde zu 100 % in das gewünschte, fließende UI-Design (Kreis-Morphing) integriert. Das Routing im Onboarding läuft schleifenfrei durch.
* **Nächste Schritte:** Fokus auf das Dashboard (`RUNNING` Phase) verlagern (Aktivierung der Satelliten-Buttons, Medikamenten-Logik).
## 5. UI-LOGIK: ATEMWEG & CPR-BUTTON (Deep Dive)
Basierend auf der Video-Analyse des Original-Verhaltens wurden folgende komplexe UI-Zustände für das Dashboard (`RUNNING`) definiert:

### Der smarte Atemweg-Button & das Modal
* **Kein einfacher Toggle:** Der Button öffnet immer zuerst ein Modal.
* **Pädiatrie-Integration:** Bei Kindern zeigt das Modal automatisch die material- und größenspezifischen Broselow-Werte (z.B. Tubus-Größe, Tiefe) passend zum Gewicht an.
* **Pfad A (Beutel-Maske):** Führt sofort zum Modus `30:2` (Erwachsene) oder `15:2` (Kinder). In diesem Modus zeigt der Atemweg-Button bei den letzten 5 Kompressionen einen eigenen kleinen Countdown (z.B. "4, 3, 2, 1") als Vorwarnung an.
* **Pfad B (Invasiv - Tubus/SGA):** Führt in einen sekundären Doku-Screen im Modal. **Erst nach dem Speichern** dieser Doku wechselt das System in den durchgehenden `KONT`-Modus.
* **Der KONT-Countdown:** Im KONT-Modus läuft am Atemweg-Button ein superschneller Countdown (alle 6s bei Erwachsenen, alle 2.4s bei Kindern), der bei Ablauf "HUB!" anzeigt und blau aufblitzt.

### Der dynamische CPR-Button (Das Herzstück)
Der große Play/Pause-Knopf unten rechts ist eine State-Machine mit 3 visuellen Phasen:
1. **Laufende CPR (15:2 / 30:2):** Der Button ist grün/weiß und zeigt einen Live-Badge, der jeden Metronom-Schlag mitzählt (1 bis 15 bzw. 30).
2. **Beatmungs-Phase:** Sobald das Limit erreicht ist, stoppt das Metronom. Der komplette Button färbt sich cyan/blau, das Icon wird zu einer Lunge und der Text lautet **"BEATMEN"**. Nach dem automatischen Ping-Pong-Timer springt er von selbst zurück auf CPR.
3. **Manuelle Pause (Eskalation):** Wird der Button manuell pausiert (Text: "CPR FORTSETZEN"), erscheint ein roter Badge, der die Sekunden hochzählt. Ab 5 Sekunden wird der Button gelb (Warnung), ab 10 Sekunden rot und pulsierend (Kritisch).