/**
 * Predictive Lead Scoring Seeding Service
 * Seeds the lead scoring service with sample lead data for demonstration
 */

import { predictiveLeadScoringService } from './PredictiveLeadScoringService';

export class PredictiveLeadScoringSeedingService {
  /**
   * Seed the lead scoring service with sample data
   */
  static async seedLeadScoringData(): Promise<void> {
    console.info('🎯 Seeding Predictive Lead Scoring...');

    // Check if already seeded
    const existingLeads = predictiveLeadScoringService.getAllLeadsWithScores();
    if (existingLeads.length > 0) {
      console.info('📊 Lead scoring already seeded, skipping...');
      return;
    }

    // Seed sample leads
    await this.seedSampleLeads();

    console.info('✅ Predictive Lead Scoring seeded successfully!');
  }

  private static async seedSampleLeads(): Promise<void> {
    const sampleLeads = [
      {
        id: 'lead-001',
        companyName: 'ABC Manufacturing Corp',
        contactName: 'Sarah Johnson',
        email: 'sarah.johnson@abcmanufacturing.com',
        phone: '(555) 123-4567',
        industry: 'Manufacturing',
        companySize: 'large' as const,
        location: {
          city: 'Detroit',
          state: 'MI',
          zipCode: '48201',
        },
        freightProfile: {
          shipmentVolume: 'high' as const,
          serviceTypes: ['TL Shipping', 'LTL Shipping', 'Expedited'],
          painPoints: [
            'Rising fuel costs',
            'Carrier reliability',
            'Capacity shortages',
          ],
          budgetRange: { min: 50000, max: 150000 },
        },
        engagementHistory: {
          source: 'FMCSA_database',
          firstContact: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
          lastContact: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
          contactCount: 8,
          responseRate: 75,
          openedEmails: 6,
          clickedLinks: 3,
          websiteVisits: 12,
          documentsDownloaded: [
            'capacity_solutions.pdf',
            'fuel_surcharge_guide.pdf',
          ],
        },
        behavioralSignals: {
          urgencyLevel: 'high' as const,
          decisionTimeframe: '1-3_months' as const,
          budgetAuthority: true,
          technicalRequirements: ['Temperature controlled', 'GPS tracking'],
          competitorMentions: ['CompetitorX Logistics', 'ShipFast Inc'],
        },
        qualificationStatus: 'qualified' as const,
        lastUpdated: new Date(),
      },
      {
        id: 'lead-002',
        companyName: 'TechCorp Solutions',
        contactName: 'Mike Chen',
        email: 'm.chen@techcorp.com',
        phone: '(555) 987-6543',
        industry: 'Technology',
        companySize: 'medium' as const,
        location: {
          city: 'Austin',
          state: 'TX',
          zipCode: '78701',
        },
        freightProfile: {
          shipmentVolume: 'medium' as const,
          serviceTypes: ['Electronics shipping', 'Expedited delivery'],
          painPoints: [
            'Equipment damage',
            'Delivery delays',
            'Cost predictability',
          ],
          budgetRange: { min: 25000, max: 75000 },
        },
        engagementHistory: {
          source: 'linkedin_campaign',
          firstContact: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000), // 45 days ago
          lastContact: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
          contactCount: 12,
          responseRate: 92,
          openedEmails: 10,
          clickedLinks: 8,
          websiteVisits: 25,
          documentsDownloaded: [
            'electronics_shipping_guide.pdf',
            'insurance_options.pdf',
            'quote_calculator.xlsx',
          ],
        },
        behavioralSignals: {
          urgencyLevel: 'medium' as const,
          decisionTimeframe: 'immediate' as const,
          budgetAuthority: false,
          technicalRequirements: [
            'Anti-static packaging',
            'Climate controlled',
          ],
          competitorMentions: [],
        },
        qualificationStatus: 'qualified' as const,
        lastUpdated: new Date(),
      },
      {
        id: 'lead-003',
        companyName: 'Fresh Foods Distribution',
        contactName: 'Jennifer Martinez',
        email: 'j.martinez@freshfoods.com',
        phone: '(555) 456-7890',
        industry: 'Food & Beverage',
        companySize: 'large' as const,
        location: {
          city: 'Los Angeles',
          state: 'CA',
          zipCode: '90210',
        },
        freightProfile: {
          shipmentVolume: 'very_high' as const,
          serviceTypes: [
            'Refrigerated shipping',
            'Temperature controlled',
            'Time-critical',
          ],
          painPoints: [
            'Temperature fluctuations',
            'Route optimization',
            'Fuel efficiency',
          ],
          budgetRange: { min: 100000, max: 300000 },
        },
        engagementHistory: {
          source: 'website_inquiry',
          firstContact: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
          lastContact: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
          contactCount: 5,
          responseRate: 100,
          openedEmails: 5,
          clickedLinks: 4,
          websiteVisits: 18,
          documentsDownloaded: [
            'cold_chain_solutions.pdf',
            'route_optimization.pdf',
          ],
        },
        behavioralSignals: {
          urgencyLevel: 'critical' as const,
          decisionTimeframe: 'immediate' as const,
          budgetAuthority: true,
          technicalRequirements: [
            'Refrigerated trailers',
            'Real-time temperature monitoring',
          ],
          competitorMentions: ['ColdChain Express'],
        },
        qualificationStatus: 'qualified' as const,
        lastUpdated: new Date(),
      },
      {
        id: 'lead-004',
        companyName: 'Global Retail Chain',
        contactName: 'David Wilson',
        email: 'd.wilson@globalretail.com',
        phone: '(555) 234-5678',
        industry: 'Retail',
        companySize: 'enterprise' as const,
        location: {
          city: 'Chicago',
          state: 'IL',
          zipCode: '60601',
        },
        freightProfile: {
          shipmentVolume: 'very_high' as const,
          serviceTypes: [
            'Nationwide distribution',
            'Last-mile delivery',
            'E-commerce',
          ],
          painPoints: [
            'Last-mile costs',
            'Peak season capacity',
            'Returns logistics',
          ],
          budgetRange: { min: 500000, max: 2000000 },
        },
        engagementHistory: {
          source: 'sales_referral',
          firstContact: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 days ago
          lastContact: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
          contactCount: 15,
          responseRate: 67,
          openedEmails: 8,
          clickedLinks: 5,
          websiteVisits: 8,
          documentsDownloaded: [
            'enterprise_solutions.pdf',
            'capacity_planning.pdf',
          ],
        },
        behavioralSignals: {
          urgencyLevel: 'medium' as const,
          decisionTimeframe: '3-6_months' as const,
          budgetAuthority: true,
          technicalRequirements: [
            'Multi-modal transport',
            'API integration',
            'Real-time tracking',
          ],
          competitorMentions: ['LogisticsPro', 'ShipNation'],
        },
        qualificationStatus: 'qualified' as const,
        lastUpdated: new Date(),
      },
      {
        id: 'lead-005',
        companyName: 'Regional Construction LLC',
        contactName: 'Tom Anderson',
        email: 't.anderson@regionalconstruction.com',
        phone: '(555) 345-6789',
        industry: 'Construction',
        companySize: 'medium' as const,
        location: {
          city: 'Phoenix',
          state: 'AZ',
          zipCode: '85001',
        },
        freightProfile: {
          shipmentVolume: 'medium' as const,
          serviceTypes: [
            'Heavy equipment transport',
            'Building materials',
            'Oversized loads',
          ],
          painPoints: [
            'Equipment damage',
            'Permit coordination',
            'Route restrictions',
          ],
          budgetRange: { min: 15000, max: 45000 },
        },
        engagementHistory: {
          source: 'google_ads',
          firstContact: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), // 20 days ago
          lastContact: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
          contactCount: 3,
          responseRate: 33,
          openedEmails: 1,
          clickedLinks: 0,
          websiteVisits: 2,
          documentsDownloaded: [],
        },
        behavioralSignals: {
          urgencyLevel: 'low' as const,
          decisionTimeframe: '6+_months' as const,
          budgetAuthority: false,
          technicalRequirements: [
            'Heavy haul permits',
            'Oversized load handling',
          ],
          competitorMentions: ['HeavyHaul Inc'],
        },
        qualificationStatus: 'nurturing' as const,
        lastUpdated: new Date(),
      },
      {
        id: 'lead-006',
        companyName: 'Startup Logistics Co',
        contactName: 'Lisa Park',
        email: 'lisa@startuplogistics.co',
        phone: '(555) 567-8901',
        industry: 'Logistics',
        companySize: 'small' as const,
        location: {
          city: 'Seattle',
          state: 'WA',
          zipCode: '98101',
        },
        freightProfile: {
          shipmentVolume: 'low' as const,
          serviceTypes: ['LTL Shipping', 'Local delivery'],
          painPoints: [
            'Scaling operations',
            'Finding carriers',
            'Cost management',
          ],
          budgetRange: { min: 5000, max: 15000 },
        },
        engagementHistory: {
          source: 'trucking_planet',
          firstContact: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
          lastContact: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
          contactCount: 2,
          responseRate: 100,
          openedEmails: 2,
          clickedLinks: 1,
          websiteVisits: 8,
          documentsDownloaded: ['startup_guide.pdf', 'carrier_network.pdf'],
        },
        behavioralSignals: {
          urgencyLevel: 'high' as const,
          decisionTimeframe: 'immediate' as const,
          budgetAuthority: true,
          technicalRequirements: ['Simple API integration', 'Basic tracking'],
          competitorMentions: [],
        },
        qualificationStatus: 'contacted' as const,
        lastUpdated: new Date(),
      },
      {
        id: 'lead-007',
        companyName: 'Medical Supplies Inc',
        contactName: 'Dr. Robert Kim',
        email: 'r.kim@medsupplies.com',
        phone: '(555) 678-9012',
        industry: 'Healthcare',
        companySize: 'medium' as const,
        location: {
          city: 'Boston',
          state: 'MA',
          zipCode: '02101',
        },
        freightProfile: {
          shipmentVolume: 'high' as const,
          serviceTypes: [
            'Medical supplies',
            'Temperature sensitive',
            'Urgent delivery',
          ],
          painPoints: [
            'Regulatory compliance',
            'Cold chain maintenance',
            'Emergency delivery',
          ],
          budgetRange: { min: 75000, max: 200000 },
        },
        engagementHistory: {
          source: 'thomas_net',
          firstContact: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000), // 25 days ago
          lastContact: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
          contactCount: 6,
          responseRate: 83,
          openedEmails: 5,
          clickedLinks: 4,
          websiteVisits: 15,
          documentsDownloaded: [
            'healthcare_compliance.pdf',
            'cold_chain_certification.pdf',
            'emergency_delivery.pdf',
          ],
        },
        behavioralSignals: {
          urgencyLevel: 'high' as const,
          decisionTimeframe: '1-3_months' as const,
          budgetAuthority: true,
          technicalRequirements: [
            'HIPAA compliance',
            'Temperature monitoring',
            'Chain of custody',
          ],
          competitorMentions: ['MediShip Logistics'],
        },
        qualificationStatus: 'qualified' as const,
        lastUpdated: new Date(),
      },
      {
        id: 'lead-008',
        companyName: 'Auto Parts Warehouse',
        contactName: 'Steve Rodriguez',
        email: 's.rodriguez@autoparts.com',
        phone: '(555) 789-0123',
        industry: 'Automotive',
        companySize: 'large' as const,
        location: {
          city: 'Atlanta',
          state: 'GA',
          zipCode: '30301',
        },
        freightProfile: {
          shipmentVolume: 'high' as const,
          serviceTypes: [
            'Auto parts distribution',
            'JIT delivery',
            'Regional distribution',
          ],
          painPoints: ['Inventory accuracy', 'Delivery timing', 'Parts damage'],
          budgetRange: { min: 80000, max: 180000 },
        },
        engagementHistory: {
          source: 'FMCSA_database',
          firstContact: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000), // 35 days ago
          lastContact: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
          contactCount: 9,
          responseRate: 78,
          openedEmails: 7,
          clickedLinks: 5,
          websiteVisits: 11,
          documentsDownloaded: [
            'automotive_logistics.pdf',
            'damage_prevention.pdf',
          ],
        },
        behavioralSignals: {
          urgencyLevel: 'medium' as const,
          decisionTimeframe: '1-3_months' as const,
          budgetAuthority: true,
          technicalRequirements: [
            'Parts-specific packaging',
            'Inventory integration',
          ],
          competitorMentions: ['AutoHaul Solutions'],
        },
        qualificationStatus: 'qualified' as const,
        lastUpdated: new Date(),
      },
    ];

    for (const lead of sampleLeads) {
      await predictiveLeadScoringService.addOrUpdateLead(lead);
    }
  }
}

// Auto-seed when module is loaded in browser
if (typeof window !== 'undefined') {
  // Delay seeding to ensure service is initialized
  setTimeout(() => {
    PredictiveLeadScoringSeedingService.seedLeadScoringData();
  }, 3000);
}

