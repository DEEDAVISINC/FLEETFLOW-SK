'use client';

import { useState } from 'react';
import { DriverWorkflowService } from '../../services/driver-workflow';

// Workflow Step Modal Component
const WorkflowStepModal = ({
  step,
  onClose,
  onComplete,
  driver,
}: {
  step: any;
  onClose: () => void;
  onComplete: () => void;
  driver: any;
}) => {
  const [loading, setLoading] = useState(false);
  const [photosUploaded, setPhotosUploaded] = useState(false);
  const [signature, setSignature] = useState('');
  const [notes, setNotes] = useState('');

  const handleComplete = async () => {
    setLoading(true);
    try {
      await DriverWorkflowService.completeStep(driver.id, step.id, {
        photos: photosUploaded,
        signature,
        notes,
        timestamp: new Date().toISOString(),
      });
      onComplete();
    } catch (error) {
      console.error('Error completing step:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Drivers Dashboard</h1>
    </div>
  );
};
