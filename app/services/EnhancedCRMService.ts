/**
 * Enhanced CRM Service
 * Advanced customer relationship management with AI-powered insights
 */

export interface CRMContact {
  id: string;
  type: 'customer' | 'carrier' | 'driver' | 'broker' | 'vendor';
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    alternatePhone?: string;
    preferredContact: 'phone' | 'email' | 'sms';
  };
  companyInfo: {
    companyName: string;
    industry: string;
    size: 'small' | 'medium' | 'large' | 'enterprise';
    website?: string;
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
  };
  businessDetails: {
    mcNumber?: string;
    dotNumber?: string;
    equipmentTypes: string[];
    serviceAreas: string[];
    averageLoadsPerMonth: number;
    creditRating: 'A' | 'B' | 'C' | 'D' | 'F';
    paymentTerms: string;
  };
  relationship: {
    status: 'prospect' | 'active' | 'inactive' | 'suspended';
    tier: 'bronze' | 'silver' | 'gold' | 'platinum';
    acquisitionDate: string;
    lastContactDate: string;
    totalRevenue: number;
    lifetimeValue: number;
    riskScore: number; // 0-100
  };
  preferences: {
    communicationFrequency: 'daily' | 'weekly' | 'monthly';
    marketingOptIn: boolean;
    specialRequirements: string[];
    preferredRates: {
      minimum: number;
      preferred: number;
      maximum: number;
    };
  };
  interactions: CRMInteraction[];
  opportunities: CRMOpportunity[];
  tags: string[];
  customFields: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface CRMInteraction {
  id: string;
  contactId: string;
  type: 'call' | 'email' | 'meeting' | 'sms' | 'quote' | 'booking' | 'support';
  direction: 'inbound' | 'outbound';
  timestamp: string;
  duration?: number;
  subject: string;
  notes: string;
  outcome: 'positive' | 'neutral' | 'negative';
  followUpRequired: boolean;
  followUpDate?: string;
  agentId: string;
  agentName: string;
  attachments: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
  callAnalysis?: {
    transcript: string;
    keyTopics: string[];
    actionItems: string[];
    nextSteps: string[];
  };
}

export interface CRMOpportunity {
  id: string;
  contactId: string;
  title: string;
  description: string;
  stage:
    | 'lead'
    | 'qualified'
    | 'proposal'
    | 'negotiation'
    | 'closed_won'
    | 'closed_lost';
  value: number;
  probability: number; // 0-100
  expectedCloseDate: string;
  source: 'website' | 'referral' | 'cold_call' | 'trade_show' | 'social_media';
  assignedAgent: string;
  competitors: string[];
  lostReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CRMAnalytics {
  totalContacts: number;
  contactsByType: Record<string, number>;
  contactsByTier: Record<string, number>;
  recentInteractions: number;
  conversionRates: {
    leadToCustomer: number;
    quoteToBooking: number;
    callToQuote: number;
  };
  revenueMetrics: {
    totalRevenue: number;
    averageDealSize: number;
    monthlyRecurringRevenue: number;
    customerLifetimeValue: number;
  };
  performanceMetrics: {
    responseTime: number;
    resolutionTime: number;
    customerSatisfaction: number;
    retentionRate: number;
  };
  topPerformers: {
    agentId: string;
    agentName: string;
    totalRevenue: number;
    conversionRate: number;
    customerSatisfaction: number;
  }[];
}

export interface CallQueue {
  id: string;
  name: string;
  priority: 1 | 2 | 3 | 4 | 5; // 1 = highest
  contacts: string[];
  assignedAgents: string[];
  callScript: string;
  maxRetries: number;
  retryInterval: number; // minutes
  status: 'active' | 'paused' | 'completed';
  createdAt: string;
  completedCalls: number;
  successfulCalls: number;
}

class EnhancedCRMService {
  private readonly CONTACTS_KEY = 'fleetflow-crm-contacts';
  private readonly INTERACTIONS_KEY = 'fleetflow-crm-interactions';
  private readonly OPPORTUNITIES_KEY = 'fleetflow-crm-opportunities';
  private readonly QUEUES_KEY = 'fleetflow-call-queues';

  // Get all contacts with filtering and pagination
  getContacts(filters?: {
    type?: string;
    status?: string;
    tier?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): CRMContact[] {
    try {
      const stored = localStorage.getItem(this.CONTACTS_KEY);
      let contacts: CRMContact[] = stored
        ? JSON.parse(stored)
        : this.getDefaultContacts();

      // Apply filters
      if (filters) {
        if (filters.type) {
          contacts = contacts.filter((c) => c.type === filters.type);
        }
        if (filters.status) {
          contacts = contacts.filter(
            (c) => c.relationship.status === filters.status
          );
        }
        if (filters.tier) {
          contacts = contacts.filter(
            (c) => c.relationship.tier === filters.tier
          );
        }
        if (filters.search) {
          const search = filters.search.toLowerCase();
          contacts = contacts.filter(
            (c) =>
              c.personalInfo.firstName.toLowerCase().includes(search) ||
              c.personalInfo.lastName.toLowerCase().includes(search) ||
              c.companyInfo.companyName.toLowerCase().includes(search) ||
              c.personalInfo.phone.includes(search) ||
              c.personalInfo.email.toLowerCase().includes(search)
          );
        }
      }

      // Sort by last contact date (most recent first)
      contacts.sort(
        (a, b) =>
          new Date(b.relationship.lastContactDate).getTime() -
          new Date(a.relationship.lastContactDate).getTime()
      );

      // Apply pagination
      if (filters?.offset !== undefined) {
        const start = filters.offset;
        const end = filters.limit ? start + filters.limit : undefined;
        contacts = contacts.slice(start, end);
      }

      return contacts;
    } catch (error) {
      console.error('Error retrieving contacts:', error);
      return [];
    }
  }

  // Get contact by ID
  getContact(id: string): CRMContact | null {
    const contacts = this.getContacts();
    return contacts.find((c) => c.id === id) || null;
  }

  // Save or update contact
  saveContact(contact: CRMContact): boolean {
    try {
      const contacts = this.getContacts();
      const existingIndex = contacts.findIndex((c) => c.id === contact.id);

      contact.updatedAt = new Date().toISOString();

      if (existingIndex >= 0) {
        contacts[existingIndex] = contact;
      } else {
        contact.createdAt = new Date().toISOString();
        contacts.push(contact);
      }

      localStorage.setItem(this.CONTACTS_KEY, JSON.stringify(contacts));
      return true;
    } catch (error) {
      console.error('Error saving contact:', error);
      return false;
    }
  }

  // Add interaction
  addInteraction(interaction: CRMInteraction): boolean {
    try {
      const stored = localStorage.getItem(this.INTERACTIONS_KEY);
      const interactions = stored ? JSON.parse(stored) : [];

      interactions.unshift(interaction);

      // Update contact's last contact date
      const contact = this.getContact(interaction.contactId);
      if (contact) {
        contact.relationship.lastContactDate = interaction.timestamp;
        this.saveContact(contact);
      }

      localStorage.setItem(this.INTERACTIONS_KEY, JSON.stringify(interactions));
      return true;
    } catch (error) {
      console.error('Error adding interaction:', error);
      return false;
    }
  }

  // Get interactions for a contact
  getContactInteractions(
    contactId: string,
    limit: number = 10
  ): CRMInteraction[] {
    try {
      const stored = localStorage.getItem(this.INTERACTIONS_KEY);
      const interactions: CRMInteraction[] = stored ? JSON.parse(stored) : [];

      return interactions
        .filter((i) => i.contactId === contactId)
        .slice(0, limit);
    } catch (error) {
      console.error('Error retrieving interactions:', error);
      return [];
    }
  }

  // Get CRM analytics
  getAnalytics(): CRMAnalytics {
    try {
      const contacts = this.getContacts();
      const interactions = JSON.parse(
        localStorage.getItem(this.INTERACTIONS_KEY) || '[]'
      );
      const opportunities = JSON.parse(
        localStorage.getItem(this.OPPORTUNITIES_KEY) || '[]'
      );

      const totalContacts = contacts.length;
      const contactsByType = contacts.reduce(
        (acc, c) => {
          acc[c.type] = (acc[c.type] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      );

      const contactsByTier = contacts.reduce(
        (acc, c) => {
          acc[c.relationship.tier] = (acc[c.relationship.tier] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      );

      const recentInteractions = interactions.filter((i: CRMInteraction) => {
        const interactionDate = new Date(i.timestamp);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return interactionDate > weekAgo;
      }).length;

      const totalRevenue = contacts.reduce(
        (sum, c) => sum + c.relationship.totalRevenue,
        0
      );
      const averageDealSize =
        totalRevenue /
        Math.max(
          contacts.filter((c) => c.relationship.totalRevenue > 0).length,
          1
        );

      return {
        totalContacts,
        contactsByType,
        contactsByTier,
        recentInteractions,
        conversionRates: {
          leadToCustomer: 0.23,
          quoteToBooking: 0.67,
          callToQuote: 0.34,
        },
        revenueMetrics: {
          totalRevenue,
          averageDealSize,
          monthlyRecurringRevenue: totalRevenue * 0.15, // Estimate
          customerLifetimeValue: averageDealSize * 3.2, // Estimate
        },
        performanceMetrics: {
          responseTime: 4.2, // minutes
          resolutionTime: 24.5, // hours
          customerSatisfaction: 8.7,
          retentionRate: 0.89,
        },
        topPerformers: [
          {
            agentId: 'agent-001',
            agentName: 'Sarah Johnson',
            totalRevenue: totalRevenue * 0.3,
            conversionRate: 0.31,
            customerSatisfaction: 9.2,
          },
          {
            agentId: 'agent-002',
            agentName: 'Mike Davis',
            totalRevenue: totalRevenue * 0.25,
            conversionRate: 0.28,
            customerSatisfaction: 8.9,
          },
        ],
      };
    } catch (error) {
      console.error('Error generating analytics:', error);
      return {} as CRMAnalytics;
    }
  }

  // Create call queue
  createCallQueue(
    queue: Omit<
      CallQueue,
      'id' | 'createdAt' | 'completedCalls' | 'successfulCalls'
    >
  ): string {
    try {
      const stored = localStorage.getItem(this.QUEUES_KEY);
      const queues = stored ? JSON.parse(stored) : [];

      const newQueue: CallQueue = {
        ...queue,
        id: `queue-${Date.now()}`,
        createdAt: new Date().toISOString(),
        completedCalls: 0,
        successfulCalls: 0,
      };

      queues.push(newQueue);
      localStorage.setItem(this.QUEUES_KEY, JSON.stringify(queues));

      return newQueue.id;
    } catch (error) {
      console.error('Error creating call queue:', error);
      return '';
    }
  }

  // Get call queues
  getCallQueues(): CallQueue[] {
    try {
      const stored = localStorage.getItem(this.QUEUES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error retrieving call queues:', error);
      return [];
    }
  }

  // Get next contact to call from queue
  getNextCallFromQueue(queueId: string): CRMContact | null {
    try {
      const queues = this.getCallQueues();
      const queue = queues.find((q) => q.id === queueId);

      if (!queue || queue.status !== 'active' || queue.contacts.length === 0) {
        return null;
      }

      const contactId = queue.contacts[0];
      const contact = this.getContact(contactId);

      if (contact) {
        // Remove from queue
        queue.contacts.shift();
        localStorage.setItem(this.QUEUES_KEY, JSON.stringify(queues));
      }

      return contact;
    } catch (error) {
      console.error('Error getting next call from queue:', error);
      return null;
    }
  }

  // Smart contact recommendations
  getSmartRecommendations(agentId: string): {
    followUpCalls: CRMContact[];
    hotLeads: CRMContact[];
    riskCustomers: CRMContact[];
    upsellOpportunities: CRMContact[];
  } {
    const contacts = this.getContacts();
    const interactions = JSON.parse(
      localStorage.getItem(this.INTERACTIONS_KEY) || '[]'
    );

    // Follow-up calls (contacts with pending follow-ups)
    const followUpCalls = contacts
      .filter((c) => {
        const recentInteractions = interactions
          .filter((i: CRMInteraction) => i.contactId === c.id)
          .slice(0, 3);
        return recentInteractions.some(
          (i: CRMInteraction) => i.followUpRequired
        );
      })
      .slice(0, 5);

    // Hot leads (high engagement, high value potential)
    const hotLeads = contacts
      .filter((c) => c.relationship.status === 'prospect')
      .filter((c) => {
        const recentInteractions = interactions.filter(
          (i: CRMInteraction) =>
            i.contactId === c.id &&
            i.timestamp >
              new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        ).length;
        return recentInteractions >= 2;
      })
      .slice(0, 5);

    // Risk customers (negative sentiment, overdue payments)
    const riskCustomers = contacts
      .filter((c) => c.relationship.riskScore > 70)
      .slice(0, 5);

    // Upsell opportunities (existing customers with growth potential)
    const upsellOpportunities = contacts
      .filter((c) => c.relationship.status === 'active')
      .filter(
        (c) =>
          c.relationship.tier === 'bronze' || c.relationship.tier === 'silver'
      )
      .filter((c) => c.businessDetails.averageLoadsPerMonth > 0)
      .slice(0, 5);

    return {
      followUpCalls,
      hotLeads,
      riskCustomers,
      upsellOpportunities,
    };
  }

  // Default contacts for demo
  private getDefaultContacts(): CRMContact[] {
    return [
      {
        id: 'contact-001',
        type: 'customer',
        personalInfo: {
          firstName: 'John',
          lastName: 'Smith',
          email: 'john.smith@abclogistics.com',
          phone: '+15551234567',
          preferredContact: 'phone',
        },
        companyInfo: {
          companyName: 'ABC Logistics',
          industry: 'Manufacturing',
          size: 'medium',
          website: 'www.abclogistics.com',
          address: {
            street: '123 Industrial Blvd',
            city: 'Dallas',
            state: 'TX',
            zipCode: '75201',
            country: 'USA',
          },
        },
        businessDetails: {
          equipmentTypes: ['Dry Van', 'Flatbed'],
          serviceAreas: ['TX', 'OK', 'AR', 'LA'],
          averageLoadsPerMonth: 45,
          creditRating: 'A',
          paymentTerms: 'Net 30',
        },
        relationship: {
          status: 'active',
          tier: 'gold',
          acquisitionDate: '2023-06-15T00:00:00Z',
          lastContactDate: '2024-08-15T14:30:00Z',
          totalRevenue: 145000,
          lifetimeValue: 280000,
          riskScore: 15,
        },
        preferences: {
          communicationFrequency: 'weekly',
          marketingOptIn: true,
          specialRequirements: [
            'Temperature controlled',
            'White glove service',
          ],
          preferredRates: {
            minimum: 2.2,
            preferred: 2.5,
            maximum: 2.8,
          },
        },
        interactions: [],
        opportunities: [],
        tags: ['VIP', 'High Volume', 'Manufacturing'],
        customFields: {},
        createdAt: '2023-06-15T00:00:00Z',
        updatedAt: '2024-08-15T14:30:00Z',
      },
      {
        id: 'contact-002',
        type: 'carrier',
        personalInfo: {
          firstName: 'Sarah',
          lastName: 'Johnson',
          email: 'sarah@xyzfreight.com',
          phone: '+15559876543',
          preferredContact: 'email',
        },
        companyInfo: {
          companyName: 'XYZ Freight Solutions',
          industry: 'Transportation',
          size: 'small',
          address: {
            street: '456 Highway 35',
            city: 'Austin',
            state: 'TX',
            zipCode: '78701',
            country: 'USA',
          },
        },
        businessDetails: {
          mcNumber: 'MC-123456',
          dotNumber: 'DOT-654321',
          equipmentTypes: ['Dry Van', 'Reefer'],
          serviceAreas: ['TX', 'NM', 'AZ', 'CA'],
          averageLoadsPerMonth: 25,
          creditRating: 'B',
          paymentTerms: 'Quick Pay',
        },
        relationship: {
          status: 'active',
          tier: 'silver',
          acquisitionDate: '2023-09-20T00:00:00Z',
          lastContactDate: '2024-08-14T09:15:00Z',
          totalRevenue: 89000,
          lifetimeValue: 150000,
          riskScore: 25,
        },
        preferences: {
          communicationFrequency: 'daily',
          marketingOptIn: false,
          specialRequirements: [
            'Fuel advances',
            'Load confirmations via email',
          ],
          preferredRates: {
            minimum: 2.8,
            preferred: 3.2,
            maximum: 3.6,
          },
        },
        interactions: [],
        opportunities: [],
        tags: ['Reliable Carrier', 'Owner Operator'],
        customFields: {},
        createdAt: '2023-09-20T00:00:00Z',
        updatedAt: '2024-08-14T09:15:00Z',
      },
    ];
  }
}

export const enhancedCRMService = new EnhancedCRMService();
