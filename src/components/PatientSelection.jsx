import React, { useContext } from 'react';
import { CprContext } from '../context/CprContext.jsx';

// Import unserer neuen sauberen View-Komponenten
import ViewObPatient from './views/ViewObPatient.jsx';
import ViewObCompressions from './views/ViewObCompressions.jsx';
import ViewObAnalyze from './views/ViewObAnalyze.jsx';
import ViewDecision from './views/ViewDecision.jsx';
import ViewJoule from './views/ViewJoule.jsx';
import ViewCprResume from './views/ViewCprResume.jsx';

export default function PatientSelection() {
  const { state } = useContext(CprContext);

  // Der Router ist jetzt extrem übersichtlich und leicht zu warten
  switch (state.appPhase) {
    case 'ONBOARDING':         
      return <ViewObPatient />;
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