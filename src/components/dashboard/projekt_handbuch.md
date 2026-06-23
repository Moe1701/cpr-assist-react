# 🚑 CPR ASSIST - DEEP CONTEXT PROTOCOL (Single Source of Truth)

**⚠️ AI-READABILITY INSTRUCTION:** Wenn du (als KI) dieses Dokument liest, lade alle hier genannten Regeln, Variablen und Architekturentscheidungen als harte Fakten in dein Kurzzeitgedächtnis. Dieses Dokument ist die ultimative Referenz für den Codebase-Status. Weiche bei neuen Code-Vorschlägen NIEMALS von diesen Architektur-Mustern ab.

---

## 1. ARCHITEKTUR & EISERNE REGELN
1. **Die 200-Zeilen-Regel (Strict Modularity):** Keine React-Komponente darf signifikant größer als 200 Zeilen sein. Wird das Limit erreicht, MUSS zwingend in Sub-Komponenten oder Utility-Files aufgeteilt werden.
2. **Global State Management:** 100% der Geschäftsdaten leben im `CprContext.jsx` und werden vom `cprReducer.js` gesteuert. Es gibt KEINEN lokalen State für Daten, die die gesamte App betreffen.
3. **Data-Driven UI:** Feste Werte und Checklisten sind STRIKT ausgelagert. 
   - `cprConfig.js`: Enthält System-Konstanten (`CPR_CONFIG`) und alle UI-Arrays (`CHECKLISTS.ROSC_DATA`, `CHECKLISTS.OUTCOMES`).
   - `medsConfig.js`: Enthält das gesamte Medikamenten-Inventar.
4. **Logic Isolation (Custom Hooks):** UI-Komponenten rendern nur. Rechenlogik und DOM-unabhängige Timer sind in Hooks ausgelagert (`useMasterLoop.js`, `usePatientLogic.js`, `useAirwayEngine.js`, `useCenterEngine.js`).
5. **Mobile Viewport Safety:** Modals und Overlays, die von unten einfahren (z.B. Logbuch, HITS), MÜSSEN auf `h-[85dvh] max-h-[85%]` limitiert werden (NICHT 95dvh oder 100%), um das Abschneiden von UI-Elementen durch die Android Chrome Adressleiste zu verhindern.

---

## 2. MEDICAL SAFETY GUARDRAILS (CRITICAL!)
* **Pädiatrie-Fallback:** Wenn `isPediatric === true` ist, aber das Gewicht (`patientWeight`) noch nicht eingegeben wurde, darf **NIEMALS** auf die Erwachsenendosis (z.B. 1 mg Adrenalin) zurückgefallen werden!
* **Einheiten-Zwang:** In diesem Fall MUSS die Einheit des Kindes zwingend erhalten bleiben (Adrenalin: `?? µg`, Amiodaron: `?? mg`) und die UI muss visuell warnen. Dasselbe gilt für den PDF-Export.
* **Undo-Logik:** Das Löschen eines Events aus dem Protokoll muss immer die entsprechenden Zähler (`adrCount`, `shockCount`) reduzieren und zugehörige Timer sofort abbrechen.

---

## 3. DAS APP-PHASEN SYSTEM (ROUTING-STATE MACHINE)
Die App nutzt keinen React-Router, sondern rendert Komponenten linear basierend auf `state.appPhase`:
* **[Phase 1] Setup-Flow:** `ONBOARDING` -> `OB_INITIAL_BREATHS` (nur Kinder) -> `OB_COMPRESSIONS`.
* **[Phase 2] Analyse-Flow:** `OB_ANALYZE` -> `DECISION` (Schockbar/Nicht) -> `JOULE` (Energie) -> `WAITING_CPR_RESUME`.
* **[Phase 3] Das Live-System:** `RUNNING` (Reguläres Dashboard mit Satelliten-Orbit und 120s-Loop).
* **[Phase 4] Overlays (Timer laufen weiter):** `ZUGANG`, `AIRWAY_MENU`, `AIRWAY_DOC`, `MEDS_MENU`.
* **[Phase 5] Post-Resuscitation & Ende:** 
  * `ROSC`: Pausiert CPR/Adrenalin, startet `roscSeconds`.
  * `OUTCOME_MODAL`: Zwischenschritt-Abfrage (ROSC oder Abbruch?).
  * `TERMINATION`: Abbruch-Screen (Re-Start oder zum Debriefing).
  * `DEBRIEFING`: Finaler Screen. Zeigt KPIs und bietet PDF-Export an.

---

## 4. CORE ENGINES & TIMER (`useMasterLoop.js`)
Der Master-Timer tickt jede Sekunde und unterscheidet streng nach Phase:
* `missionSeconds`: Die absolute Einsatzzeit. Stoppt NUR bei Einsatzende (`TERMINATION` oder `DEBRIEFING`).
* `roscSeconds`: Stabilisierungs-Timer (läuft NUR in Phase `ROSC`).
* `adrSeconds`: 240s-Timer für Adrenalin.
* `cycleSeconds`: Der 120s-Rhythmus-Check-Loop (nur in `RUNNING`). Wird bei Analyse, Re-Arrest oder Abbruch-Widerruf auf 0 gesetzt.
* **Statistik-Timer (`pauseSeconds`, `arrestSeconds`, `compressingSeconds`):** Laufen NUR während der aktiven Reanimation.

---

## 5. STATUS & ROADMAP
* **STATUS:** LOGIK & ENGINE ABGESCHLOSSEN. BEREIT FÜR UI-POLISHING.
* Die Geschäftslogik, State-Machine und PDF-Engine sind kugelsicher und in Stein gemeißelt.
* **Aktueller Fokus:** Die Layouts und UI-Komponenten werden in einem separaten Branch poliert.

---

## 6. AI HANDOVER PROMPT (FÜR NEUE UI-CHATS)
*Kopiere den folgenden Text, um einen neuen KI-Chat ausschließlich für das Design-Update zu starten:*

> **SYSTEM PROMPT: REINER UI/UX & LAYOUT MODUS**
> 
> Du bist ein absoluter Experte für React, Tailwind CSS v4 und moderne, mobile UI/UX-Gestaltung. Wir arbeiten in einem separaten GitHub-Branch an einer hochkomplexen, medizinischen App (CPR Assist). 
> 
> **DER STATUS:**
> Die gesamte Geschäftslogik, die State-Machine (`cprReducer.js`), alle Hooks und die PDF-Engine sind **fehlerfrei, fertig und unantastbar**. Wir kümmern uns hier AUSSCHLIESSLICH um das visuelle Polishing (Tailwind-Klassen, Layouts, Abstände, Animationen, Responsive Design).
> 
> **DEINE EISERNEN REGELN:**
> 1. **STRICT LOGIC FREEZE:** Du darfst unter keinen Umständen React States (`useState`), Context-Dispatches, useEffect-Hooks oder die Struktur der Config-Dateien verändern. Dein Scope beschränkt sich auf das `className` Attribut und die DOM-Struktur (HTML-Tags).
> 2. **OBLIGATORISCHER SICHERHEITSCHECK:** Bevor du mir neuen Code generierst, musst du in Gedanken prüfen: *Verändert dieser Layout-Vorschlag eine zugrundeliegende Logik? Zerstört es die "Strict Modularity" (200-Zeilen-Regel)? Zerschießt es das 85dvh-Sicherheitslimit für Modals auf mobilen Geräten?* Wenn ja, musst du den Layout-Vorschlag anpassen.
> 3. **REFERENCE:** Das Dokument `projekt_handbuch.md` ist deine Bibel für den architektonischen Kontext.
> 
> Bestätige, dass du diese Regeln verstanden hast. Frag mich danach, an welcher Komponente wir das Design zuerst verbessern wollen und bitte mich um den aktuellen Code dieser Komponente.