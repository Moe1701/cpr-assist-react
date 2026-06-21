# 🚑 CPR ASSIST - DEEP CONTEXT PROTOCOL (Single Source of Truth)

**⚠️ AI-READABILITY INSTRUCTION:** 
Wenn du (als KI) dieses Dokument liest, lade alle hier genannten Regeln, Variablen und Architekturentscheidungen als harte Fakten in dein Kurzzeitgedächtnis. Dieses Dokument ist die ultimative Referenz für den Codebase-Status. Weiche bei neuen Code-Vorschlägen NIEMALS von diesen Architektur-Mustern ab.

---

## 1. ARCHITEKTUR & EISERNE REGELN
1. **Die 200-Zeilen-Regel (Strict Modularity):** Keine React-Komponente darf signifikant größer als 200 Zeilen sein[cite: 9]. Wird das Limit erreicht, MUSS zwingend in Sub-Komponenten oder Utility-Files aufgeteilt werden.
2. **Global State Management:** 100% der Geschäftsdaten leben im `CprContext.jsx` und werden vom `cprReducer.js` gesteuert[cite: 9]. Es gibt KEINEN lokalen State für Daten, die die gesamte App betreffen.
3. **Data-Driven UI:** Feste Werte und Checklisten sind STRIKT ausgelagert[cite: 9]. 
   - `cprConfig.js`: Enthält System-Konstanten (`CPR_CONFIG`) und alle UI-Arrays (`CHECKLISTS.ROSC_DATA`, `CHECKLISTS.ABBRUCH_REASONS`)[cite: 9].
   - `medsConfig.js`: Enthält das gesamte Medikamenten-Inventar inkl. Pädiatrie-Dosierungsformeln[cite: 9].
4. **Logic Isolation (Custom Hooks):** UI-Komponenten rendern nur. Rechenlogik und DOM-unabhängige Timer sind in Hooks ausgelagert (`useMasterLoop.js`, `useCenterEngine.js`, `usePatientLogic.js`, `useAirwayEngine.js`)[cite: 9].
5. **Mobile Viewport Safety:** Modals und Overlays, die von unten einfahren (z.B. Logbuch, HITS), MÜSSEN auf `h-[85dvh] max-h-[85%]` limitiert werden (NICHT 95dvh oder 100%), um das Abschneiden von UI-Elementen durch die Android Chrome Adressleiste zu verhindern[cite: 9].

---

## 2. DAS APP-PHASEN SYSTEM (ROUTING-STATE MACHINE)
Die App nutzt keinen React-Router, sondern rendert Komponenten basierend auf `state.appPhase`[cite: 9]. Der Flow ist strikt linear:

* **[Phase 1] Setup-Flow:** `ONBOARDING` -> `OB_INITIAL_BREATHS` (nur Kinder) -> `OB_COMPRESSIONS`[cite: 9].
* **[Phase 2] Analyse-Flow:** `OB_ANALYZE` -> `DECISION` (Schockbar/Nicht) -> `JOULE` (Energie) -> `WAITING_CPR_RESUME`[cite: 9].
* **[Phase 3] Das Live-System:** `RUNNING` (Reguläres Dashboard mit Satelliten-Orbit und 120s-Loop)[cite: 9].
* **[Phase 4] Overlays (Background-Timer laufen weiter):** `ZUGANG`, `AIRWAY_MENU`, `AIRWAY_DOC`, `MEDS_MENU`[cite: 9].
* **[Phase 5] Post-Resuscitation & Ende:** 
  * `ROSC`: Pausiert CPR/Adrenalin, startet `roscSeconds`, zeigt Pädiatrie-Zielwerte (`PediSafeLimits.jsx`) und die ABCDE-Checkliste[cite: 9].
  * `DEBRIEFING`: Finaler Screen (nach ROSC-Ende oder AbbruchModal). Zeigt KPIs und bietet PDF-Export an[cite: 9].

---

## 3. CORE ENGINES & VARIABLEN
### A) Timer-Variablen im Reducer
* `missionSeconds`: Die absolute Einsatzzeit. Stoppt NIEMALS[cite: 9].
* `cycleSeconds`: Der 120s-Rhythmus-Check-Loop. Wird bei Analyse resettet[cite: 9].
* `pauseSeconds`: Zählt hoch, wenn `isCompressing === false`[cite: 9]. Steuert die Eskalationswarnung (Grün -> Gelb -> Rot).
* `adrSeconds`: 240s-Timer für Adrenalin[cite: 9].
* `roscSeconds`: Stabilisierungs-Timer (ab Phase ROSC)[cite: 9].

### B) Audio Engine (Web Audio API)
Audio wird 100% nativ über `AudioContext` generiert (Synthese von Oszillatoren), um Latenzen auf mobilen Browsern zu vermeiden[cite: 9]. Der `isMuted`-State unterdrückt *nur* die Tonausgabe – das visuelle Metronom und Timer-Eskalationen laufen stummgeschaltet weiter[cite: 9].

---

## 4. PÄDIATRIE & BROSELOW-LOGIK (CRITICAL DATA)
* **Single Source of Truth:** `state.patientWeight` diktiert die gesamte App (Joule, Tubusgrößen, Pedi-Safe-Limits für Blutdruck/Beatmung, Medikamentendosen)[cite: 9].
* **Synchronisation:** Alter, Gewicht und Länge sind aneinandergekoppelt (`calculatePediatricVitals`)[cite: 9].

---

## 5. DAS DASHBOARD & DER SATELLITEN-ORBIT
Das Center-Display (SVG-Morphing-Kreis) wird von exakt 6 Satelliten flankiert[cite: 9]:
1. **12 Uhr (Adrenalin):** Ring-Timer (240s) mit Auto-Alarm[cite: 9].
2. **2 Uhr (Amiodaron/Meds):** Transformiert sich nach der 2. Gabe in den Koffer (`MEDS_MENU`).
3. **4 Uhr (HITS/SAMPLER):** Trigger für das Anamnese-Modal[cite: 9].
4. **6 Uhr (Ende ROSC):** Trigger für den Post-Resuscitation-Pfad[cite: 9].
5. **8 Uhr (Logbuch):** Modal-Trigger für SBAR, Statistik und Timeline[cite: 9].
6. **10 Uhr (Zugang):** Legt Zugang fest und färbt sich dynamisch blau[cite: 9].

*Hinweis: Der CPR-Button und der Atemweg-Button liegen fixiert in der unteren Leiste[cite: 9].*

---

## 6. LOGBUCH, SMART-UNDO & NATIVE PDF ENGINE
Jede Aktion feuert ein `logEvent` an den Context[cite: 9].

### A) Smart Undo-Logik
Wird der Undo-Button betätigt (`UNDO_LAST_EVENT`), löscht der Reducer nicht nur das Event aus der Zeitlinie, sondern **zählt auch dynamisch die entsprechenden Tracker (`adrCount`, `amioCount`, `shockCount`) wieder herunter**, um Desynchronisationen im PDF-Export zu vermeiden.

### B) Clean Re-Arrest Logik
Bei einem Re-Arrest aus der ROSC-Phase wird der Befehl `CLEANUP_RE_ARREST` genutzt. Dieser setzt den ROSC-Timer auf 0 und leert die abgehakte ROSC-Checkliste, damit bei einem erneuten ROSC keine fehlerhaften (alten) Daten übernommen werden.

### C) Die PDF-Export Architektur (`src/utils/pdf/`)
Um die 200-Zeilen-Regel einzuhalten, ist der PDF-Export (jsPDF) radikal modularisiert[cite: 9]:
1. `pdfHelpers.js`: Formatierungs-Tools, Canvas-Rundungen und Icon-Mapping[cite: 9].
2. `pdfDataParser.js`: Analysiert die `state.events` und berechnet KPIs, Pausen und CCF-Ratios[cite: 9].
3. `pdfRenderers.js`: Zeichnet Seite 1 (SBAR-Übergabe) und Seite 2 (Performance Insights)[cite: 9].
4. `pdfCanvasTimeline.js`: **Das Meisterstück.** Rendert die 120s-Zeitlinien-Tracks über die *native HTML5 Canvas 2D API* im Hintergrund (ohne `html2canvas`) und fügt sie als hochauflösendes JPEG in Seite 3 ein[cite: 9].
5. `pdfExport.js`: Der reine Orchestrator, der die Module zusammenführt und das Dokument je nach Modus (`übergabe` vs. `debriefing`) generiert und speichert[cite: 9].

---

## 7. STATUS & ROADMAP
* **STATUS:** ORBIT COMPLETE, FEATURE COMPLETE & SYNCED.
* Alle Module (Engine, Pädiatrie, UI-Flows, ROSC/Abbruch, Smart-Undo, Native PDF-Generierung) sind vollständig integriert und halten sich strikt an die Clean-Architecture-Vorgaben.
* Die App ist nun bereit für den produktionsnahen Usability-Test.