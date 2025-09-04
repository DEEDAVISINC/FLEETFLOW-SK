export interface Organization {
  id: string;
  name: string;
  type: 'brokerage' | 'dispatch_agency' | 'carrier' | 'shipper';
  subscription: {
    plan: string;
    seats: {
      total: number;
      used: number;
      available: number;
    };
    billingCycle: 'monthly' | 'annual';
    price: number;
    nextBillingDate: Date;
  };
  billing: {
    contactName: string;
    contactEmail: string;
    squareCustomerId: string;
  };
  mcNumber?: string; // For brokerages
  dispatchFeePercentage?: number; // For dispatch agencies
  createdAt: Date;
  updatedAt: Date;
}

export interface OrganizationCreationParams {
  name: string;
  type: Organization['type'];
  billing: {
    contactName: string;
    contactEmail: string;
  };
  mcNumber?: string;
  dispatchFeePercentage?: number;
}

export interface OrganizationUpdateParams {
  name?: string;
  billing?: {
    contactName?: string;
    contactEmail?: string;
  };
  mcNumber?: string;
  dispatchFeePercentage?: number;
}

export interface OrganizationSubscriptionUpdate {
  plan?: string;
  seats?: {
    total: number;
    used: number;
    available: number;
  };
  billingCycle?: 'monthly' | 'annual';
  price?: number;
  nextBillingDate?: Date;
}


