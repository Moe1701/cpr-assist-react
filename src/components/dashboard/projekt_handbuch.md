// --- Datei: src/components/dashboard/projekt_handbuch.md ---
# 🚑 CPR ASSIST - PROJEKT HANDBUCH (Single Source of Truth)

Dieses Dokument dient als "externes Gedächtnis" für die KI. Es enthält alle festgelegten Regeln, Architekturentscheidungen und Abläufe, damit bei neuen Chat-Sitzungen der Kontext sofort wiederhergestellt werden kann.

## 1. ARCHITEKTUR & STATE-MANAGEMENT
* **Global State:** Die App nutzt die React Context API (`CprContext.jsx` & `cprReducer.js`).
* **Konstanten:** Alle festen Werte (Phasen, Timer, Medikamenten-Dosierungen) liegen streng getrennt in der `src/config/cprConfig.js`. 
* **Logik-Auslagerung (Hooks):** Die Geschäftslogik ist strikt vom UI getrennt:
    * `useMasterLoop.js`: Die "Single Source of Truth" für Zeit. Steuert die 120s-Zyklen, die globale Einsatzzeit, das hochpräzise Web-Audio Metronom und automatische 30:2/15:2 Pausen.
    * `useAirwayEngine.js`: Die dedizierte 60-FPS Animations-Engine. Steuert das visuelle Füllen der Lunge (requestAnimationFrame) und die Warn-Eskalation, ohne React-Rerenders zu triggern.
    * `usePatientLogic.js`: Behandelt Broselow-Berechnungen und den Wechsel zwischen Erwachsenen/Kindern.

## 2. APP-PHASEN & ROUTING
Der Ablauf folgt einer strikten Reihenfolge. Das zentrale Center-Display morpht dabei passend zur Phase:
1.  `ONBOARDING`: Patient wählen. *Uhr steht auf 0. UI ist still.*
2.  `OB_INITIAL_BREATHS`: Nur bei Kindern (5 initiale Beatmungen). *UI ist still.*
3.  `OB_COMPRESSIONS`: Die Frage "Kompression gestartet?". *UI ist still.*
4.  `OB_ANALYZE`: "Initiale Analyse" -> Hier drücken. **Ab hier laufen alle Timer, Warnungen und Metronome!**
5.  `DECISION`: Schockbar / Nicht Schockbar.
6.  `JOULE`: Energieauswahl.
7.  `WAITING_CPR_RESUME`: "CPR Fortsetzen".
8.  `RUNNING`: Das eigentliche Live-Dashboard mit 120s-Loop.
9.  `AIRWAY_MENU` & `AIRWAY_DOC`: Dynamische Center-Display Views für die Atemwegs-Auswahl.

## 3. UI & LAYOUT REGELN
* **CenterDisplay Morphing:** Das zentrale Display ist ein perfekter Kreis (`rounded-full`). Im Onboarding hat es eine Größe von `340px`. Im Dashboard (`RUNNING`) verkleinert es sich fließend auf `224px`.
* **Mobile Klick-Sicherheit:** Alle Buttons, die Icons (`<i>`) oder Text (`<span>`) enthalten, müssen zwingend `pointer-events-none` auf diesen inneren Elementen haben.
* **Minimalismus:** Keine massiven, klobigen Farbblöcke. Buttons nutzen feine Border (`border-2`), abgerundete Ecken (`rounded-2xl` oder `rounded-full`) und pastellige Hover-States.

## 4. UI-LOGIK: DER ATEMWEG-BUTTON (Deep Dive)
Der Button besitzt drei fundamentale Zustände, die von `useAirwayEngine.js` gesteuert werden:

**A. Vor dem Start (`hasStartedCpr = false`):**
Der Button ist komplett inaktiv (grau). Es gibt keine Animationen und keine gelben/roten Warnungen, bis der Einsatz offiziell bestätigt wurde.

**B. Eskalations-Ampel (Einsatz läuft, aber keine Doku):**
Sobald der Einsatz läuft, triggert die Warnung:
* 0-59 Sekunden: Gelbes Pulsieren ("DOKU FEHLT").
* Ab 60 Sekunden: Rotes Pulsieren ("BEATMUNG ETABLIEREN!!!").

**C. Die Animations-Zyklen (Nach der Doku):**
Sobald ein Atemweg dokumentiert ist, greift die Animation. **WICHTIG:** Die Engine hört hierbei *ausschließlich* auf den Schalter `state.cprMode` (Top-Right Toggle), nicht auf den Atemwegstyp!
* **KONT-Modus (`cprMode === 'continuous'`):** Ein `requestAnimationFrame`-Loop füllt den Hintergrund-Halo stufenlos mit Cyan (10% -> 70%). Im Moment der Beatmung knallt der Halo auf 100% Cyan und 1.15 Scale hoch. Text wird weiß ("BEATMEN"). Das kleine dunkelblaue Badge zählt den Countdown.
* **30:2 / 15:2 Modus (`cprMode !== 'continuous'`):** In den letzten 5 Kompressionen erscheint ein pulsierendes Badge. Bei Erreichen der Pause triggert ein CSS-gesteuerter Doppelflash (Cyan Halo, 1.15 Scale) synchron zur Audio-Engine des MasterLoops.

*(Der manuelle Modus-Toggle überschreibt die Menü-Automatik jederzeit. Ein Tubus kann somit durch manuelles Umschalten temporär mit dem 30:2-Feedback gefahren werden, z.B. bei Leckage).*