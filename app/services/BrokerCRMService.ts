'use client';

import { getCurrentUser } from '../config/access';

export interface ShipperProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  industry: string;
  creditRating: 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D';
  paymentTerms: number; // days
  avgPaymentTime: number; // actual days
  totalVolume: number; // annual revenue
  loadCount: number;
  reliability: number; // 0-100 score
  communicationScore: number; // 0-100 score
  overallScore: number; // 0-100 composite score
  riskLevel: 'low' | 'medium' | 'high';
  preferredEquipment: string[];
  commonRoutes: string[];
  seasonalPatterns: string[];
  lastActivity: string;
  accountManager: string;
  notes: string[];
  tags: string[];
}

export interface InteractionHistory {
  id: string;
  shipperId: string;
  type:
    | 'call'
    | 'email'
    | 'meeting'
    | 'quote'
    | 'contract'
    | 'issue'
    | 'follow_up';
  subject: string;
  description: string;
  outcome: 'positive' | 'neutral' | 'negative';
  followUpRequired: boolean;
  followUpDate?: string;
  createdBy: string;
  createdAt: string;
  attachments?: string[];
}

export interface UpsellOpportunity {
  shipperId: string;
  shipperName: string;
  opportunityType:
    | 'volume_increase'
    | 'new_service'
    | 'route_expansion'
    | 'contract_upgrade';
  description: string;
  potentialValue: number;
  probability: number; // 0-100
  timeframe: 'immediate' | '30_days' | '90_days' | '6_months';
  requiredActions: string[];
  lastUpdated: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

class BrokerCRMService {
  // Get all shipper profiles for current broker
  getShipperProfiles(): ShipperProfile[] {
    const currentUser = getCurrentUser();

    // Mock shipper data - in production would come from database
    return [
      {
        id: 'shipper-001',
        name: 'Walmart Distribution Center',
        email: 'logistics@walmart.com',
        phone: '(555) 123-4567',
        address: '1234 Distribution Blvd, Atlanta, GA 30309',
        industry: 'Retail',
        creditRating: 'A+',
        paymentTerms: 30,
        avgPaymentTime: 28,
        totalVolume: 125000,
        loadCount: 23,
        reliability: 95,
        communicationScore: 92,
        overallScore: 94,
        riskLevel: 'low',
        preferredEquipment: ['Dry Van', 'Reefer'],
        commonRoutes: [
          'Atlanta-Miami',
          'Atlanta-Jacksonville',
          'Atlanta-Tampa',
        ],
        seasonalPatterns: ['Q4 volume increase (+40%)', 'Summer produce peak'],
        lastActivity: '2025-01-19T08:30:00Z',
        accountManager: currentUser?.user?.name || 'Current Broker',
        notes: [
          'Preferred customer - always pays on time',
          'Requires 48hr advance notice for scheduling',
          'Has dedicated loading dock #7',
        ],
        tags: ['VIP', 'High Volume', 'Reliable'],
      },
      {
        id: 'shipper-002',
        name: 'Amazon Logistics',
        email: 'freight@amazon.com',
        phone: '(555) 987-6543',
        address: '5678 Fulfillment Way, Chicago, IL 60601',
        industry: 'E-commerce',
        creditRating: 'A+',
        paymentTerms: 15,
        avgPaymentTime: 14,
        totalVolume: 98000,
        loadCount: 18,
        reliability: 98,
        communicationScore: 88,
        overallScore: 93,
        riskLevel: 'low',
        preferredEquipment: ['Dry Van', 'Reefer', 'Expedited'],
        commonRoutes: ['Chicago-Houston', 'Chicago-Dallas', 'Chicago-Phoenix'],
        seasonalPatterns: ['Prime Day surge (July)', 'Holiday peak (Nov-Dec)'],
        lastActivity: '2025-01-18T16:45:00Z',
        accountManager: currentUser?.user?.name || 'Current Broker',
        notes: [
          'Expedited specialist - premium rates',
          'Requires real-time tracking updates',
          'Fast payment processing',
        ],
        tags: ['Premium', 'Expedited', 'Tech-Forward'],
      },
      {
        id: 'shipper-003',
        name: 'Home Depot Supply Chain',
        email: 'logistics@homedepot.com',
        phone: '(555) 345-6789',
        address: '9012 Supply Chain Dr, Dallas, TX 75201',
        industry: 'Home Improvement',
        creditRating: 'A',
        paymentTerms: 45,
        avgPaymentTime: 42,
        totalVolume: 76000,
        loadCount: 14,
        reliability: 87,
        communicationScore: 85,
        overallScore: 86,
        riskLevel: 'low',
        preferredEquipment: ['Flatbed', 'Step Deck', 'Dry Van'],
        commonRoutes: ['Dallas-Denver', 'Dallas-Phoenix', 'Dallas-Las Vegas'],
        seasonalPatterns: [
          'Spring construction surge',
          'Hurricane season prep',
        ],
        lastActivity: '2025-01-17T14:20:00Z',
        accountManager: currentUser?.user?.name || 'Current Broker',
        notes: [
          'Construction materials specialist',
          'Requires flatbed/step deck equipment',
          'Seasonal volume fluctuations',
        ],
        tags: ['Construction', 'Seasonal', 'Flatbed'],
      },
    ];
  }

  // Get interaction history for a shipper
  getInteractionHistory(shipperId: string): InteractionHistory[] {
    return [
      {
        id: 'interaction-001',
        shipperId,
        type: 'call',
        subject: 'Weekly check-in call',
        description:
          'Discussed upcoming Q1 shipping needs and potential volume increase',
        outcome: 'positive',
        followUpRequired: true,
        followUpDate: '2025-01-26T10:00:00Z',
        createdBy: getCurrentUser()?.user?.name || 'Current Broker',
        createdAt: '2025-01-19T10:15:00Z',
      },
      {
        id: 'interaction-002',
        shipperId,
        type: 'quote',
        subject: 'Rate quote for Atlanta-Miami route',
        description: 'Provided competitive quote for regular FTL service',
        outcome: 'positive',
        followUpRequired: false,
        createdBy: getCurrentUser()?.user?.name || 'Current Broker',
        createdAt: '2025-01-18T14:30:00Z',
      },
      {
        id: 'interaction-003',
        shipperId,
        type: 'contract',
        subject: 'Contract renewal discussion',
        description: 'Negotiated terms for 2025 annual contract renewal',
        outcome: 'positive',
        followUpRequired: true,
        followUpDate: '2025-02-01T09:00:00Z',
        createdBy: getCurrentUser()?.user?.name || 'Current Broker',
        createdAt: '2025-01-15T11:45:00Z',
      },
    ];
  }

  // Get upselling opportunities
  getUpsellOpportunities(): UpsellOpportunity[] {
    return [
      {
        shipperId: 'shipper-001',
        shipperName: 'Walmart Distribution Center',
        opportunityType: 'volume_increase',
        description:
          'Customer mentioned 25% volume increase for Q2 due to new store openings',
        potentialValue: 31250,
        probability: 85,
        timeframe: '30_days',
        requiredActions: [
          'Schedule capacity planning meeting',
          'Prepare volume discount proposal',
          'Secure additional carrier capacity',
        ],
        lastUpdated: '2025-01-19T08:30:00Z',
        priority: 'high',
      },
      {
        shipperId: 'shipper-002',
        shipperName: 'Amazon Logistics',
        opportunityType: 'new_service',
        description:
          'Interest in white glove delivery services for high-value electronics',
        potentialValue: 15000,
        probability: 70,
        timeframe: '90_days',
        requiredActions: [
          'Research white glove carriers',
          'Prepare service capability presentation',
          'Calculate pricing structure',
        ],
        lastUpdated: '2025-01-18T16:45:00Z',
        priority: 'medium',
      },
      {
        shipperId: 'shipper-003',
        shipperName: 'Home Depot Supply Chain',
        opportunityType: 'route_expansion',
        description:
          'Expanding to West Coast markets, needs California delivery network',
        potentialValue: 22000,
        probability: 60,
        timeframe: '6_months',
        requiredActions: [
          'Map California carrier network',
          'Research West Coast regulations',
          'Prepare market entry proposal',
        ],
        lastUpdated: '2025-01-17T14:20:00Z',
        priority: 'medium',
      },
    ];
  }

  // Add new interaction
  async addInteraction(
    interaction: Omit<InteractionHistory, 'id' | 'createdAt' | 'createdBy'>
  ): Promise<{ success: boolean; message: string }> {
    try {
      // Mock interaction creation
      const newInteraction: InteractionHistory = {
        ...interaction,
        id: `interaction-${Date.now()}`,
        createdBy: getCurrentUser()?.user?.name || 'Current Broker',
        createdAt: new Date().toISOString(),
      };

      console.log('Adding interaction:', newInteraction);

      return {
        success: true,
        message: 'Interaction logged successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to log interaction',
      };
    }
  }

  // Update shipper score based on recent performance
  updateShipperScore(
    shipperId: string,
    paymentDays: number,
    communicationRating: number,
    reliabilityRating: number
  ) {
    // Mock scoring algorithm
    const paymentScore = Math.max(0, 100 - (paymentDays - 30) * 2); // Penalty for late payment
    const overallScore =
      (paymentScore + communicationRating + reliabilityRating) / 3;

    let riskLevel: 'low' | 'medium' | 'high';
    if (overallScore >= 85) riskLevel = 'low';
    else if (overallScore >= 70) riskLevel = 'medium';
    else riskLevel = 'high';

    return {
      overallScore: Math.round(overallScore),
      riskLevel,
      recommendation:
        overallScore >= 85
          ? 'Preferred Customer'
          : overallScore >= 70
            ? 'Standard Terms'
            : 'Requires Monitoring',
    };
  }
}

export const brokerCRMService = new BrokerCRMService();



