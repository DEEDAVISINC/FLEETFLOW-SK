// Accessorial Fee Types and Interfaces for FleetFlow System

export interface DetentionFee {
  hours: number;
  ratePerHour: number;
  freeTimeHours: number; // Usually 2 hours free time
  total: number;
  startTime: string;
  endTime: string;
  location: 'pickup' | 'delivery';
  reason?: string;
  approved: boolean;
  approvedBy?: string;
  approvedAt?: string;
  receiptNumber?: string;
}

export interface LumperFee {
  amount: number;
  receiptNumber?: string;
  vendorName?: string;
  location: 'pickup' | 'delivery';
  description?: string;
  approved: boolean;
  approvedBy?: string;
  approvedAt?: string;
}

export interface AccessorialFee {
  id: string;
  type:
    | 'liftgate'
    | 'residential'
    | 'inside_delivery'
    | 'limited_access'
    | 'layover'
    | 'tarp'
    | 'hazmat'
    | 'oversize'
    | 'team_driver'
    | 'expedited'
    | 'weekend_delivery'
    | 'appointment'
    | 'fuel_surcharge'
    | 'other';
  description: string;
  amount: number;
  quantity?: number;
  ratePerUnit?: number;
  approved: boolean;
  approvedBy?: string;
  approvedAt?: string;
  receiptRequired: boolean;
  receiptNumber?: string;
}

export interface AccessorialSummary {
  detention: DetentionFee[];
  lumper: LumperFee[];
  additional: AccessorialFee[];
  totalAmount: number;
  totalApproved: number;
  totalPending: number;
}

export interface AccessorialApprovalWorkflow {
  loadId: string;
  accessorialId: string;
  requestedBy: string;
  requestedAt: string;
  amount: number;
  type: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected' | 'requires_receipt';
  approverComments?: string;
  attachments?: string[]; // File paths for receipts/documentation
}






















