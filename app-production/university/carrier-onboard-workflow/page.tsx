'use client';

import React from 'react';
import { CarrierOnboardWorkflowTraining } from '../../training/CarrierOnboardWorkflowTraining';

export default function CarrierOnboardWorkflowPage() {
  // In a real app, these would come from authentication context
  const userRole = 'dispatcher' as 'dispatcher' | 'broker';
  const userName = 'Demo User';

  const handleTrainingComplete = (certification: any) => {
    console.log('Training completed:', certification);
    // In a real app, save certification to database and redirect
    alert(`Congratulations! You've earned your Carrier Onboard Workflow certification with a score of ${certification.score}%`);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1e293b, #0f172a)', padding: '20px' }}>
      <CarrierOnboardWorkflowTraining
        userRole={userRole}
        userName={userName}
        onTrainingComplete={handleTrainingComplete}
      />
    </div>
  );
}
