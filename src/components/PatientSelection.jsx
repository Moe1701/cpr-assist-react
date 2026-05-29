import React, { useContext } from 'react';
// Pfad korrigiert
import { CprContext } from '../CprContext.jsx';

// Import-Pfade korrigiert (flache Struktur für die Vorschau)
import ViewObPatient from './views/ViewObPatient.jsx';
import ViewObCompressions from './views/ViewObCompressions.jsx';
import ViewObAnalyze from './views/ViewObAnalyze.jsx';
import ViewDecision from './views/ViewDecision.jsx';
import ViewJoule from './views/ViewJoule.jsx';
import ViewCprResume from './views/ViewCprResume.jsx';
import ViewObInitialBreaths from './views/ViewObInitialBreaths.jsx';

export default function PatientSelection() {
  const { state } = useContext(CprContext);

  switch (state.appPhase) {
    case 'ONBOARDING':         
      return <ViewObPatient />;
    case 'OB_INITIAL_BREATHS': 
      return <ViewObInitialBreaths />;
    case 'OB_COMPRESSIONS':    
      return <ViewObCompressions />;
    case 'OB_ANALYZE':         
      return <ViewObAnalyze />;
    case 'DECISION':           
      return <ViewDecision />;
    case 'JOULE':              
      return <ViewJoule />;
    case 'WAITING_CPR_RESUME': 
      return <ViewCprResume />;
    default:                   
      return null;
  }
}