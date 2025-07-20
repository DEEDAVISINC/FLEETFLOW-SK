// DriverWorkflowService for managing driver workflow steps
interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  type: 'pre_trip' | 'pickup' | 'transit' | 'delivery' | 'post_trip';
  status: 'pending' | 'current' | 'completed' | 'skipped';
  current: boolean;
  completed: boolean;
  requiresPhotos: boolean;
  requiresSignature: boolean;
  estimatedTime: string;
  completedAt?: string;
  notes?: string;
  photos?: string[];
  signature?: string;
}

interface Load {
  id: string;
  status: 'assigned' | 'in_transit' | 'delivered' | 'completed';
  pickupLocation: string;
  deliveryLocation: string;
  commodity: string;
  weight: number;
  distance: number;
  estimatedRevenue: number;
  pickupDate: string;
  deliveryDate: string;
  customerName: string;
  specialInstructions?: string;
}

interface StepCompletion {
  photos: boolean;
  signature: string;
  notes: string;
  timestamp: string;
}

class DriverWorkflowServiceClass {
  private loads: { [driverId: string]: Load } = {
    'DRV-001': {
      id: 'LOAD-2024-001',
      status: 'assigned',
      pickupLocation: 'Dallas, TX',
      deliveryLocation: 'Atlanta, GA',
      commodity: 'Electronics',
      weight: 45000,
      distance: 925,
      estimatedRevenue: 2850,
      pickupDate: '2024-12-23T08:00:00Z',
      deliveryDate: '2024-12-24T16:00:00Z',
      customerName: 'TechCorp Industries',
      specialInstructions: 'Temperature sensitive cargo - maintain 65-70°F'
    },
    'DRV-002': {
      id: 'LOAD-2024-002',
      status: 'in_transit',
      pickupLocation: 'Los Angeles, CA',
      deliveryLocation: 'Phoenix, AZ',
      commodity: 'Automotive Parts',
      weight: 38000,
      distance: 370,
      estimatedRevenue: 1450,
      pickupDate: '2024-12-22T14:00:00Z',
      deliveryDate: '2024-12-23T10:00:00Z',
      customerName: 'AutoParts Plus',
      specialInstructions: 'Fragile items - handle with care'
    }
  };

  private workflowSteps: { [driverId: string]: WorkflowStep[] } = {
    'DRV-001': [
      {
        id: 'pre-trip-001',
        title: 'Pre-Trip Inspection',
        description: 'Complete vehicle safety inspection before departure',
        type: 'pre_trip',
        status: 'completed',
        current: false,
        completed: true,
        requiresPhotos: true,
        requiresSignature: true,
        estimatedTime: '15 min',
        completedAt: '2024-12-23T07:30:00Z'
      },
      {
        id: 'pickup-001',
        title: 'Pickup at Dallas, TX',
        description: 'Arrive at pickup location and load cargo',
        type: 'pickup',
        status: 'current',
        current: true,
        completed: false,
        requiresPhotos: true,
        requiresSignature: true,
        estimatedTime: '45 min'
      },
      {
        id: 'transit-001',
        title: 'Transit to Atlanta, GA',
        description: 'Transport cargo safely to destination',
        type: 'transit',
        status: 'pending',
        current: false,
        completed: false,
        requiresPhotos: false,
        requiresSignature: false,
        estimatedTime: '12 hours'
      },
      {
        id: 'delivery-001',
        title: 'Delivery at Atlanta, GA',
        description: 'Unload cargo and obtain delivery confirmation',
        type: 'delivery',
        status: 'pending',
        current: false,
        completed: false,
        requiresPhotos: true,
        requiresSignature: true,
        estimatedTime: '30 min'
      },
      {
        id: 'post-trip-001',
        title: 'Post-Trip Inspection',
        description: 'Complete final vehicle inspection and report',
        type: 'post_trip',
        status: 'pending',
        current: false,
        completed: false,
        requiresPhotos: true,
        requiresSignature: true,
        estimatedTime: '15 min'
      }
    ],
    'DRV-002': [
      {
        id: 'pre-trip-002',
        title: 'Pre-Trip Inspection',
        description: 'Complete vehicle safety inspection before departure',
        type: 'pre_trip',
        status: 'completed',
        current: false,
        completed: true,
        requiresPhotos: true,
        requiresSignature: true,
        estimatedTime: '15 min',
        completedAt: '2024-12-22T13:30:00Z'
      },
      {
        id: 'pickup-002',
        title: 'Pickup at Los Angeles, CA',
        description: 'Arrive at pickup location and load cargo',
        type: 'pickup',
        status: 'completed',
        current: false,
        completed: true,
        requiresPhotos: true,
        requiresSignature: true,
        estimatedTime: '45 min',
        completedAt: '2024-12-22T14:30:00Z'
      },
      {
        id: 'transit-002',
        title: 'Transit to Phoenix, AZ',
        description: 'Transport cargo safely to destination',
        type: 'transit',
        status: 'current',
        current: true,
        completed: false,
        requiresPhotos: false,
        requiresSignature: false,
        estimatedTime: '5 hours'
      },
      {
        id: 'delivery-002',
        title: 'Delivery at Phoenix, AZ',
        description: 'Unload cargo and obtain delivery confirmation',
        type: 'delivery',
        status: 'pending',
        current: false,
        completed: false,
        requiresPhotos: true,
        requiresSignature: true,
        estimatedTime: '30 min'
      },
      {
        id: 'post-trip-002',
        title: 'Post-Trip Inspection',
        description: 'Complete final vehicle inspection and report',
        type: 'post_trip',
        status: 'pending',
        current: false,
        completed: false,
        requiresPhotos: true,
        requiresSignature: true,
        estimatedTime: '15 min'
      }
    ]
  };

  async getCurrentLoad(driverId: string): Promise<Load | null> {
    try {
      return this.loads[driverId] || null;
    } catch (error) {
      console.error('Error getting current load:', error);
      return null;
    }
  }

  async getWorkflowSteps(driverId: string): Promise<WorkflowStep[]> {
    try {
      return this.workflowSteps[driverId] || [];
    } catch (error) {
      console.error('Error getting workflow steps:', error);
      return [];
    }
  }

  async completeStep(driverId: string, stepId: string, completion: StepCompletion): Promise<boolean> {
    try {
      const steps = this.workflowSteps[driverId];
      if (!steps) {
        return false;
      }

      const stepIndex = steps.findIndex(s => s.id === stepId);
      if (stepIndex === -1) {
        return false;
      }

      const step = steps[stepIndex];
      
      // Update step completion
      step.completed = true;
      step.current = false;
      step.status = 'completed';
      step.completedAt = completion.timestamp;
      step.notes = completion.notes;
      step.signature = completion.signature;

      // Move to next step
      const nextStepIndex = stepIndex + 1;
      if (nextStepIndex < steps.length) {
        const nextStep = steps[nextStepIndex];
        nextStep.current = true;
        nextStep.status = 'current';
      }

      // Update load status based on completed steps
      const load = this.loads[driverId];
      if (load) {
        if (step.type === 'pickup') {
          load.status = 'in_transit';
        } else if (step.type === 'delivery') {
          load.status = 'delivered';
        } else if (step.type === 'post_trip') {
          load.status = 'completed';
        }
      }

      return true;
    } catch (error) {
      console.error('Error completing step:', error);
      return false;
    }
  }

  async skipStep(driverId: string, stepId: string, reason: string): Promise<boolean> {
    try {
      const steps = this.workflowSteps[driverId];
      if (!steps) {
        return false;
      }

      const stepIndex = steps.findIndex(s => s.id === stepId);
      if (stepIndex === -1) {
        return false;
      }

      const step = steps[stepIndex];
      step.status = 'skipped';
      step.current = false;
      step.notes = `Skipped: ${reason}`;

      // Move to next step
      const nextStepIndex = stepIndex + 1;
      if (nextStepIndex < steps.length) {
        const nextStep = steps[nextStepIndex];
        nextStep.current = true;
        nextStep.status = 'current';
      }

      return true;
    } catch (error) {
      console.error('Error skipping step:', error);
      return false;
    }
  }

  async updateStepNotes(driverId: string, stepId: string, notes: string): Promise<boolean> {
    try {
      const steps = this.workflowSteps[driverId];
      if (!steps) {
        return false;
      }

      const step = steps.find(s => s.id === stepId);
      if (!step) {
        return false;
      }

      step.notes = notes;
      return true;
    } catch (error) {
      console.error('Error updating step notes:', error);
      return false;
    }
  }

  async getStepProgress(driverId: string): Promise<{ completed: number; total: number; percentage: number }> {
    try {
      const steps = this.workflowSteps[driverId] || [];
      const completed = steps.filter(s => s.completed).length;
      const total = steps.length;
      const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

      return { completed, total, percentage };
    } catch (error) {
      console.error('Error getting step progress:', error);
      return { completed: 0, total: 0, percentage: 0 };
    }
  }

  async assignLoad(driverId: string, load: Load): Promise<boolean> {
    try {
      this.loads[driverId] = load;
      
      // Create workflow steps for the new load
      const steps: WorkflowStep[] = [
        {
          id: `pre-trip-${Date.now()}`,
          title: 'Pre-Trip Inspection',
          description: 'Complete vehicle safety inspection before departure',
          type: 'pre_trip',
          status: 'current',
          current: true,
          completed: false,
          requiresPhotos: true,
          requiresSignature: true,
          estimatedTime: '15 min'
        },
        {
          id: `pickup-${Date.now()}`,
          title: `Pickup at ${load.pickupLocation}`,
          description: 'Arrive at pickup location and load cargo',
          type: 'pickup',
          status: 'pending',
          current: false,
          completed: false,
          requiresPhotos: true,
          requiresSignature: true,
          estimatedTime: '45 min'
        },
        {
          id: `transit-${Date.now()}`,
          title: `Transit to ${load.deliveryLocation}`,
          description: 'Transport cargo safely to destination',
          type: 'transit',
          status: 'pending',
          current: false,
          completed: false,
          requiresPhotos: false,
          requiresSignature: false,
          estimatedTime: '8 hours'
        },
        {
          id: `delivery-${Date.now()}`,
          title: `Delivery at ${load.deliveryLocation}`,
          description: 'Unload cargo and obtain delivery confirmation',
          type: 'delivery',
          status: 'pending',
          current: false,
          completed: false,
          requiresPhotos: true,
          requiresSignature: true,
          estimatedTime: '30 min'
        },
        {
          id: `post-trip-${Date.now()}`,
          title: 'Post-Trip Inspection',
          description: 'Complete final vehicle inspection and report',
          type: 'post_trip',
          status: 'pending',
          current: false,
          completed: false,
          requiresPhotos: true,
          requiresSignature: true,
          estimatedTime: '15 min'
        }
      ];

      this.workflowSteps[driverId] = steps;
      return true;
    } catch (error) {
      console.error('Error assigning load:', error);
      return false;
    }
  }

  async getLoadHistory(driverId: string): Promise<Load[]> {
    try {
      // In a real implementation, this would fetch from a database
      // For now, return mock data
      return [
        {
          id: 'LOAD-2024-001',
          status: 'completed',
          pickupLocation: 'Houston, TX',
          deliveryLocation: 'Miami, FL',
          commodity: 'Food Products',
          weight: 42000,
          distance: 1200,
          estimatedRevenue: 3200,
          pickupDate: '2024-12-20T08:00:00Z',
          deliveryDate: '2024-12-21T16:00:00Z',
          customerName: 'FoodCorp'
        }
      ];
    } catch (error) {
      console.error('Error getting load history:', error);
      return [];
    }
  }
}

export const DriverWorkflowService = new DriverWorkflowServiceClass(); 