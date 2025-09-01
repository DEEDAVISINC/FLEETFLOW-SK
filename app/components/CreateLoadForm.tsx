'use client';

import { useState } from 'react';
import { getAvailableDispatchers, getCurrentUser } from '../config/access';
import { Load, createLoad } from '../services/loadService';

interface LoadFormData {
  origin: string;
  destination: string;
  rate: number;
  distance: string;
  weight: string;
  equipment: string;
  pickupDate: string;
  deliveryDate: string;
  dispatcherId: string;
  specialInstructions: string;
}

interface CreateLoadFormProps {
  onLoadCreated?: (load: Load) => void;
  onCancel?: () => void;
}

export default function CreateLoadForm({
  onLoadCreated,
  onCancel,
}: CreateLoadFormProps) {
  const [formData, setFormData] = useState<LoadFormData>({
    origin: '',
    destination: '',
    rate: 0,
    distance: '',
    weight: '',
    equipment: 'Dry Van',
    pickupDate: '',
    deliveryDate: '',
    dispatcherId: '',
    specialInstructions: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    'idle' | 'success' | 'error'
  >('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const { user } = getCurrentUser();
  const availableDispatchers = getAvailableDispatchers();

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'rate' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      // Validate required fields
      if (
        !formData.origin ||
        !formData.destination ||
        !formData.rate ||
        !formData.pickupDate ||
        !formData.deliveryDate
      ) {
        throw new Error('Please fill in all required fields');
      }

      if (!formData.dispatcherId) {
        throw new Error('Please select a dispatcher for this load');
      }

      // Create the load
      const newLoad = createLoad({
        brokerId: user.brokerId || user.id,
        origin: formData.origin,
        destination: formData.destination,
        rate: formData.rate,
        distance: formData.distance,
        weight: formData.weight,
        equipment: formData.equipment,
        pickupDate: formData.pickupDate,
        deliveryDate: formData.deliveryDate,
        dispatcherId: formData.dispatcherId,
        specialInstructions: formData.specialInstructions,
        status: 'Available',
      });

      setSubmitStatus('success');

      // Reset form
      setFormData({
        origin: '',
        destination: '',
        rate: 0,
        distance: '',
        weight: '',
        equipment: 'Dry Van',
        pickupDate: '',
        deliveryDate: '',
        dispatcherId: '',
        specialInstructions: '',
      });

      // Notify parent component
      if (onLoadCreated) {
        onLoadCreated(newLoad);
      }

      // Show success message
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 3000);
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage(
        error instanceof Error ? error.message : 'Failed to create load'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h1>Create Load Form</h1>
    </div>
  );
}
