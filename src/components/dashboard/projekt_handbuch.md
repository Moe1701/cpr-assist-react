# 🚑 CPR ASSIST - PROJEKT HANDBUCH (Single Source of Truth)

Dieses Dokument dient als "externes Gedächtnis" für die KI. Es enthält alle festgelegten Regeln, Architekturentscheidungen und Abläufe, damit bei neuen Chat-Sitzungen der Kontext sofort wiederhergestellt werden kann.

## 1. ARCHITEKTUR & STATE-MANAGEMENT
* **Global State:** Die App nutzt die React Context API (`CprContext.jsx` & `cprReducer.js`).
* **Konstanten:** Alle festen Werte (Phasen, Timer, Medikamenten-Dosierungen) liegen streng getrennt in der `src/config/cprConfig.js`. 
* **Logik-Auslagerung:** Die Geschäftslogik ist in Custom Hooks getrennt:
    * `useMasterLoop.js`: Die "Single Source of Truth" für Zeit. Steuert die 120s-Zyklen, die globale Einsatzzeit (`missionSeconds`), das hochpräzise Web-Audio Metronom und automatische 30:2 / 15:2 Pausen.
    * `usePatientLogic.js`: Behandelt Broselow-Berechnungen und den Wechsel zwischen Erwachsenen/Kindern.
* **Datensicherung & Protokoll:** `localStorage` speichert den kompletten Einsatz-State in Echtzeit. Jeder Log-Eintrag wird zentral und rechtssicher im Format `[Uhrzeit] (Einsatzzeit) Aktion` gestempelt. Ein "Hard Reset" Button (oder Triple-Click auf das Logo) löscht diesen Cache.

## 2. APP-PHASEN & ROUTING
Der Ablauf folgt einer strikten Reihenfolge. Das zentrale Center-Display morpht dabei passend zur Phase:
1.  `ONBOARDING`: Patient wählen (Erwachsener oder Kind). *Uhr steht auf 0.*
2.  `OB_INITIAL_BREATHS`: Nur bei Kindern (5 initiale Beatmungen).
3.  `OB_COMPRESSIONS`: Die Frage "Kompression gestartet?". **Ab hier starten die UI-Timer und das Metronom.**
4.  `OB_ANALYZE`: "Initiale Analyse" -> Hier drücken (Pausiert CPR automatisch).
5.  `DECISION`: Schockbar / Nicht Schockbar.
6.  `JOULE`: Energieauswahl (wird bei Pädiatrie nach Gewicht ausgerechnet: 4 J/kg oder 8 J/kg).
7.  `WAITING_CPR_RESUME`: "CPR Fortsetzen".
8.  `RUNNING`: Das eigentliche Live-Dashboard mit 120s-Loop.
9.  `AIRWAY_MENU` & `AIRWAY_DOC`: Dynamische Center-Display Views für die Atemwegs-Auswahl.

## 3. UI & LAYOUT REGELN
* **CenterDisplay Morphing:** Das zentrale Display ist ein perfekter Kreis (`rounded-full`). Im Onboarding hat es eine Größe von `340px`. Im Dashboard (`RUNNING`) verkleinert es sich fließend auf `224px`. Bei Aufruf des Atemwegsmenüs vergrößert es sich wieder.
* **Mobile Klick-Sicherheit:** Alle Buttons, die Icons (`<i>`) oder Text (`<span>`) enthalten, müssen zwingend `pointer-events-none` auf diesen inneren Elementen haben, damit Touch-Events (iOS/Android) den React-Klick nicht blockieren.

## 4. AKTUELLER STATUS (Stand: Timer-Zentralisierung & Atemweg-Routing)
* **Erreicht:** 
  * Der alte `useGlobalTimer` wurde deaktiviert. Die Einsatzzeit wird nun absolut synchron und ohne "Aufhol-Bug" direkt über `useMasterLoop.js` gesteuert.
  * Das alte Atemwegs-Modal wurde entfernt. Die Auswahl (Beutel-Maske vs. Invasiv) inklusive Broselow-Daten-Anzeige passiert nun fließend im morphing Center-Display.
  * **Settings-Menü ist live:** BPM lassen sich in Echtzeit umschalten. Der Mute-Button kappt den Ton sofort, ohne die visuelle Animation des CPR-Buttons zu stoppen.

## 5. UI-LOGIK: ATEMWEG & CPR-BUTTON (Deep Dive)
### Der smarte Atemweg-Button (Baustelle 1 - Nächster Schritt)
* **Die Eskalations-Ampel:** Der Button-Rand pulsiert zeitbasiert: Gelb (0-59s) -> Rot (>60s) -> Weiß/Grau (Sobald Atemweg etabliert).
* **Der BVM-Countdown:** Im Modus `30:2` / `15:2` zeigt der Button in den letzten 5 Kompressionen einen "5-4-3-2-1" Badge als Vorwarnung an.
* **Der KONT-Countdown:** Liegt ein invasiver Atemweg (KONT-Modus), blitzt der Button über einen autarken Hook (`useAirwayTimer.js`) alle 6s (bzw. 2.4s) blau auf und meldet "HUB!".

### Der dynamische CPR-Button (Abgeschlossen)
Der Play/Pause-Knopf unten rechts ist eine State-Machine mit 3 Phasen:
1. **Laufende CPR (Weiß):** Metronom-Zähler blitzt synchron zum Audio feuerrot auf.
2. **Beatmungs-Phase (Cyan):** Button blockiert kurzzeitig und signalisiert die Beatmung (wird künftig auf den Atemweg-Button verschoben).
3. **Manuelle Pause (Weiß/Grün):** Zählt die Pausen-Sekunden hoch. Eskaliert ab 5 Sekunden zu Gelb (Warnung) und ab 10 Sekunden zu pulsierendem Rot (Kritisch).