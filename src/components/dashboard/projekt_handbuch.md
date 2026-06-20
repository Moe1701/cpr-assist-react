# 🚑 CPR ASSIST - DEEP CONTEXT PROTOCOL (Single Source of Truth)

**⚠️ AI-READABILITY INSTRUCTION:** 
Wenn du (als KI) dieses Dokument liest, lade alle hier genannten Regeln, Variablen und Architekturentscheidungen als harte Fakten in dein Kurzzeitgedächtnis. Dieses Dokument ist die ultimative Referenz für den Codebase-Status. Weiche bei neuen Code-Vorschlägen NIEMALS von diesen Architektur-Mustern ab.

---

## 1. ARCHITEKTUR & EISERNE REGELN
1. **Die 200-Zeilen-Regel (Strict Modularity):** Keine React-Komponente darf signifikant größer als 200 Zeilen sein. Wird das Limit erreicht, MUSS in Sub-Komponenten (z.B. List-Items, Header-Bars, kleine Overlays) aufgeteilt werden.
2. **Global State Management:** 100% der Geschäftsdaten leben im `CprContext.jsx` und werden vom `cprReducer.js` gesteuert. Es gibt KEINEN lokalen State für Daten, die die gesamte App betreffen (Ausnahme: Formular-Eingaben während des Tippens, UI-Toggles wie Tab-Wechsel).
3. **Data-Driven UI:** Feste Werte und Checklisten sind in Config-Dateien ausgelagert. `cprConfig.js` enthält System-Konstanten. `medsConfig.js` enthält das gesamte Medikamenten-Inventar inkl. Pädiatrie-Dosierungsformeln.
4. **Logic Isolation (Custom Hooks):** UI-Komponenten rendern nur. Rechenlogik und DOM-unabhängige Timer sind in Hooks ausgelagert (`useMasterLoop.js`, `useCenterEngine.js`, `usePatientLogic.js`, `useAirwayEngine.js`).
5. **Performance-Guardrail:** Funktionen, die Arrays mappen, filtern oder reduzieren (z.B. SBAR-Übergabe, KPI-Statistiken aus dem Logbuch, Zeitlinien-Rendering), MÜSSEN in `useMemo` oder `useCallback` gewrappt werden, da die App durch das Metronom im Millisekunden-Takt re-rendert.

---

## 2. DAS APP-PHASEN SYSTEM (ROUTING-STATE MACHINE)
Die App nutzt keinen React-Router, sondern rendert Komponenten basierend auf `state.appPhase`. Der Flow ist strikt linear:

* **[Phase 1] Setup-Flow:**
  * `ONBOARDING`: Startbildschirm (Auswahl: Erwachsener oder Kind).
  * `OB_INITIAL_BREATHS`: (Nur bei Kindern) Checkbox für 5 initiale Beatmungen.
  * `OB_COMPRESSIONS`: Wartebildschirm "Kompression gestartet?". Erst nach Bestätigung beginnt die Zeit zu laufen.
* **[Phase 2] Analyse-Flow (Der Master-Zyklus):**
  * `OB_ANALYZE`: 120s-Zyklus abgelaufen -> Aufforderung zur Erstanalyse.
  * `DECISION`: Abfrage "Schockbar" oder "Nicht Schockbar".
  * `JOULE`: Energie-Auswahl (bei Kindern adaptiv, z.B. 4 J/kg).
  * `WAITING_CPR_RESUME`: Aufforderung zur Fortsetzung der CPR.
* **[Phase 3] Das Live-System:**
  * `RUNNING`: Das reguläre Dashboard. Hier läuft der 120s-Loop (`cycleSeconds`) visuell ab.
* **[Phase 4] Overlay-Modi (Background-Timer laufen weiter!):**
  * `ZUGANG`, `AIRWAY_MENU`, `AIRWAY_DOC`, `MEDS_MENU`: Kleine Views, die das Center-Display überlagern. Das Metronom und die Zeit ticken währenddessen unsichtbar weiter.
* **[Phase 5] Post-Resuscitation & Ende:**
  * `ROSC`: Fullscreen-Modus. Pausiert CPR-Timer und Metronom, startet den `roscSeconds` Stabilisierungs-Timer. Zeigt das ABCDE-Checklisten-Array.
  * `DEBRIEFING`: Finaler Screen. Zeigt KPIs und bietet PDF-Export an.

---

## 3. CORE ENGINES & VARIABLEN
### A) Timer-Variablen im Reducer
* `missionSeconds`: Die absolute Einsatzzeit. Startet bei 0 nach `OB_COMPRESSIONS` und stoppt NIEMALS (auch nicht bei Pausen oder im ROSC).
* `cycleSeconds`: Der 120s-Rhythmus-Check-Loop. Wird bei jeder Analyse (`RESET_CYCLE`) auf 0 gesetzt.
* `pauseSeconds`: Zählt hoch, sobald `state.isCompressing` false ist (außer im ROSC). Steuert die eskalierende Warnung im CPR-Button (Grün -> Gelb -> Rot).
* `adrSeconds`: Der 240s (4 Min) Timer für Adrenalin. Rennt nach Button-Klick los.
* `roscSeconds`: Startet bei 0, wenn Phase `ROSC` aktiviert wird.

### B) Audio Engine (Web Audio API)
Audio wird nativ über `AudioContext` generiert (Synthese von Oszillatoren), um Verzögerungen durch HTML5 `<audio>` Tags auf mobilen Browsern zu umgehen. 
* Das Metronom feuert bei laufender Kompression exakt auf den BPM-Wert.
* Der "Mute"-Button setzt `state.isMuted`. Die Web Audio API prüft diesen Wert *vor* der Tongenerierung. **Das visuelle Metronom (Button-Flashes) läuft auch stummgeschaltet weiter!**

---

## 4. PÄDIATRIE & BROSELOW-LOGIK (CRITICAL DATA)
* Wird das "Kind" Setup gewählt (`isPediatric: true`), wird nach dem Gewicht gefragt.
* **Die Synchronisation (`calculatePediatricVitals`):** Alter, Gewicht und Länge sind aneinandergekoppelt. Ändert man einen Slider, berechnen sich die anderen neu (z.B. `Alter = (kg / 2) - 4`).
* **Single Source of Truth:** `state.patientWeight` ist der heilige Gral der App. Fehlt das Gewicht ("Gewicht später"), warnen Medikamenten-Buttons vor ungenauen Dosen.
* **Broselow-Zonen:** Werden live über das Gewicht gemappt und diktieren in der Folge die Tubusgrößen, Defibrillations-Energie (4 J/kg) und die Pedi-Safe-Limits (Normwerte für RR, HF, Tidalvolumen) im ROSC-Screen.

---

## 5. UI-KOMPONENTEN & SATELLITEN
1. **Center Display:** Morphing-Kreis (SVG-Render). Der Fortschrittsbalken (`strokeDasharray`) füllt sich über 120 Sekunden. Eskaliert farblich bei 15s vor Ablauf (Gelb) und bei 0s (Rot, pulsierend + Audio-Alarm).
2. **Medikamente:**
   * Adrenalin: Visueller Ring (240s) legt sich über den Button. Automatischer Vibrations/Ton-Alarm bei Ablauf. Zähler summiert sich.
   * Amiodaron: Zeigt 1. Dosis (300mg/5mg pro kg), 2. Dosis (150mg) an. **Verwandelt sich nach der 2. Gabe in den "Weitere Meds" Koffer.**
3. **Anamnese (HITS & SAMPLER):**
   * Die Checkliste "HITS" schreibt jeden Klick sofort ins Logbuch (`state.hitsStatus`).
   * "SAMPLER" nutzt lokalen Formular-State, bis auf "Speichern" geklickt wird (`state.anamneseData`).
4. **Logbuch & Export:** 
   * Speichert ein Array aus Objekten (`state.events`) mit relativer Zeit (ab `missionSeconds`).
   * SBAR-Übergabe wird aus Kontext-Daten dynamisch interpoliert.
   * KPI-Statistik (CCF-Ratio, Pausenzeiten, Zeit-bis-Intervention) wird hochperformant per `useMemo` berechnet.
   * `jsPDF` Engine generiert aus den Log-Daten strukturierte PDF-Dokumente für die Klinik oder Qualitätskontrolle.
5. **ROSC (Post-Resuscitation):**
   * Legt sich als Fullscreen-Ebene (`z-[60]`) über die Dashboard-Shell.
   * Beendet alle Action-Intervalle (CPR, Adrenalin), hält aber die `missionSeconds` am Laufen.
   * Besitzt bei Kindern eine dedizierte Rechenlogik für Normwerte (`PediSafeLimits.jsx`).

---

## 6. STATUS & ROADMAP
* **ABGESCHLOSSEN:** Vollständige App-Infrastruktur, Reducer-Architektur, Pediatric/Broselow-System, Audio-Engine, komplettes Logbuch mit grafischer Zeitlinie und PDF-Export, sowie der ROSC-Vollbildschirm.
* **CURRENT FOCUS:** Die App befindet sich in der Test- und Validierungsphase. Code ist bereit für Bugfixes und feingranulares UI-Polishing.
