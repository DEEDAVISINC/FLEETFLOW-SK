'use client';

import { getCurrentUser } from '../config/access';

export interface BrokerContract {
  id: string;
  contractNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  loadId?: string;
  services: string[];
  totalValue: number;
  margin: number;
  marginPercent: number;
  status:
    | 'draft'
    | 'pending_approval'
    | 'approved'
    | 'signed'
    | 'active'
    | 'completed'
    | 'cancelled';
  createdAt: string;
  updatedAt: string;
  approvalRequiredFrom: string[];
  approvalReceivedFrom: string[];
  signedAt?: string;
  completedAt?: string;
  paymentStatus: 'pending' | 'invoiced' | 'paid' | 'overdue';
  invoiceId?: string;
  squareInvoiceUrl?: string;
  notes?: string;
}

export interface ContractApprovalRequest {
  contractId: string;
  requestedBy: string;
  requestedAt: string;
  approvalEmails: string[];
  contractSummary: {
    customer: string;
    value: number;
    margin: number;
    services: string[];
  };
}

class BrokerContractService {
  private readonly APPROVAL_EMAILS = [
    'ddavis@freight1stdirect.com',
    'invoice@freight1stdirect.com',
  ];

  // Get all contracts for current broker
  getBrokerContracts(): BrokerContract[] {
    const currentUser = getCurrentUser();

    // Production-ready contract data (cleared for production)
    return [];
  }

  // Request approval for a contract
  async requestContractApproval(
    contractId: string
  ): Promise<{ success: boolean; message: string }> {
    const contract = this.getBrokerContracts().find((c) => c.id === contractId);
    if (!contract) {
      return { success: false, message: 'Contract not found' };
    }

    try {
      // Send approval request email
      const approvalRequest: ContractApprovalRequest = {
        contractId,
        requestedBy: getCurrentUser()?.user?.name || 'Unknown Broker',
        requestedAt: new Date().toISOString(),
        approvalEmails: this.APPROVAL_EMAILS,
        contractSummary: {
          customer: contract.customerName,
          value: contract.totalValue,
          margin: contract.margin,
          services: contract.services,
        },
      };

      // Mock email notification - in production would use email service
      console.log('Sending approval request:', approvalRequest);

      // Simulate email sending delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return {
        success: true,
        message: `Approval request sent to ${this.APPROVAL_EMAILS.join(' and ')}`,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to send approval request',
      };
    }
  }

  // Generate Square invoice after approval
  async generateSquareInvoice(
    contractId: string
  ): Promise<{ success: boolean; invoiceUrl?: string; message: string }> {
    const contract = this.getBrokerContracts().find((c) => c.id === contractId);
    if (!contract) {
      return { success: false, message: 'Contract not found' };
    }

    if (contract.status !== 'approved') {
      return {
        success: false,
        message: 'Contract must be approved before invoicing',
      };
    }

    try {
      // Mock Square invoice generation
      const invoiceId = `SQ-INV-${Date.now()}`;
      const invoiceUrl = `https://squareup.com/invoice/${invoiceId}`;

      // Simulate Square API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      return {
        success: true,
        invoiceUrl,
        message: `Square invoice generated: ${invoiceId}`,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to generate Square invoice',
      };
    }
  }

  // Get contract workflow status
  getContractWorkflowStatus(contractId: string) {
    const contract = this.getBrokerContracts().find((c) => c.id === contractId);
    if (!contract) return null;

    const workflow = [
      {
        step: 'Contract Creation',
        status: 'completed',
        completedAt: contract.createdAt,
        description: 'Contract drafted and submitted',
      },
      {
        step: 'Approval Request',
        status: contract.status === 'draft' ? 'pending' : 'completed',
        completedAt:
          contract.status !== 'draft' ? contract.updatedAt : undefined,
        description: `Approval required from ${this.APPROVAL_EMAILS.join(' and ')}`,
      },
      {
        step: 'Management Approval',
        status:
          contract.status === 'approved' ||
          contract.status === 'signed' ||
          contract.status === 'active' ||
          contract.status === 'completed'
            ? 'completed'
            : 'pending',
        completedAt:
          contract.status === 'approved' ? contract.updatedAt : undefined,
        description: 'Management review and approval',
      },
      {
        step: 'Customer Signature',
        status:
          contract.status === 'signed' ||
          contract.status === 'active' ||
          contract.status === 'completed'
            ? 'completed'
            : 'pending',
        completedAt: contract.signedAt,
        description: 'Customer signature required',
      },
      {
        step: 'Square Invoicing',
        status:
          contract.paymentStatus === 'invoiced' ||
          contract.paymentStatus === 'paid'
            ? 'completed'
            : 'pending',
        completedAt:
          contract.paymentStatus === 'invoiced'
            ? contract.updatedAt
            : undefined,
        description: 'Invoice generated and sent via Square',
      },
      {
        step: 'Payment Processing',
        status: contract.paymentStatus === 'paid' ? 'completed' : 'pending',
        completedAt:
          contract.paymentStatus === 'paid' ? contract.completedAt : undefined,
        description: 'Payment received and processed',
      },
    ];

    return {
      contract,
      workflow,
      currentStep:
        workflow.find((step) => step.status === 'pending')?.step || 'Completed',
      progress:
        (workflow.filter((step) => step.status === 'completed').length /
          workflow.length) *
        100,
    };
  }

  // Calculate recommended bid amount based on market rates
  calculateRecommendedBid(
    route: string,
    equipment: string,
    weight: number,
    urgency: 'standard' | 'expedited' | 'urgent' = 'standard'
  ) {
    // Mock market rate calculation
    const baseRates = {
      Van: 2.5,
      Reefer: 3.0,
      Flatbed: 2.75,
      'Step Deck': 3.25,
      Lowboy: 4.0,
    };

    const urgencyMultipliers = {
      standard: 1.0,
      expedited: 1.15,
      urgent: 1.3,
    };

    const baseRate = baseRates[equipment as keyof typeof baseRates] || 2.5;
    const urgencyMultiplier = urgencyMultipliers[urgency];
    const weightFactor = weight > 40000 ? 1.1 : 1.0;

    // Calculate distance (mock - in production would use mapping API)
    const mockDistance = Math.floor(Math.random() * 800) + 200;

    const recommendedRate = Math.round(
      baseRate * mockDistance * urgencyMultiplier * weightFactor
    );
    const minMargin = recommendedRate * 0.2; // 20% minimum
    const targetMargin = recommendedRate * 0.225; // 22.5% target
    const maxMargin = recommendedRate * 0.25; // 25% maximum

    return {
      recommendedBid: recommendedRate,
      minBid: recommendedRate - minMargin,
      targetBid: recommendedRate,
      maxBid: recommendedRate + maxMargin,
      marketTrend: ['up', 'down', 'stable'][Math.floor(Math.random() * 3)],
      confidence: Math.floor(Math.random() * 20) + 80, // 80-100% confidence
      factors: [
        `Base rate: $${baseRate}/mile`,
        `Distance: ${mockDistance} miles`,
        `Urgency: ${urgency} (+${Math.round((urgencyMultiplier - 1) * 100)}%)`,
        `Weight factor: +${Math.round((weightFactor - 1) * 100)}%`,
      ],
    };
  }
}

export const brokerContractService = new BrokerContractService();
