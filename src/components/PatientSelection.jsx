import React, { useContext } from 'react';
import { CprContext } from '../context/CprContext.jsx';
import { CPR_CONFIG } from '../config/cprConfig.js';

import ViewObPatient from './views/ViewObPatient.jsx';
import ViewObInitialBreaths from './views/ViewObInitialBreaths.jsx';
import ViewObCompressions from './views/ViewObCompressions.jsx';
import ViewObAnalyze from './views/ViewObAnalyze.jsx';
import ViewDecision from './views/ViewDecision.jsx';
import ViewJoule from './views/ViewJoule.jsx';
import ViewCprResume from './views/ViewCprResume.jsx';

export default function PatientSelection() {
  const { state } = useContext(CprContext);

  switch (state.appPhase) {
    case CPR_CONFIG.PHASES.ONBOARDING:         
      return <ViewObPatient />;
    case CPR_CONFIG.PHASES.OB_INITIAL_BREATHS: 
      return <ViewObInitialBreaths />;
    case CPR_CONFIG.PHASES.OB_COMPRESSIONS:    
      return <ViewObCompressions />;
    case CPR_CONFIG.PHASES.OB_ANALYZE:         
      return <ViewObAnalyze />;
    case CPR_CONFIG.PHASES.DECISION:           
      return <ViewDecision />;
    case CPR_CONFIG.PHASES.JOULE:              
      return <ViewJoule />;
    case CPR_CONFIG.PHASES.WAITING_CPR_RESUME: 
      return <ViewCprResume />;
    default:                   
      return null;
  }
}