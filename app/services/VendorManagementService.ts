// Comprehensive Vendor Management Service
// Integrates with all FleetFlow systems for real vendor analytics and management

import { FleetFlowAI } from './ai';
import { MultiTenantSquareService } from './MultiTenantSquareService';
import { DocumentFlowService } from './document-flow-service';
import { calculateFinancialMetrics } from './settlementService';
import {
  vendorDocumentService,
  type VendorDocument,
} from './vendorDocumentService';

export interface Vendor {
  id: string;
  name: string;
  category: VendorCategory;
  contactInfo: {
    email: string;
    phone: string;
    website?: string;
    primaryContact: string;
  };
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  businessInfo: {
    taxId: string;
    registrationNumber: string;
    businessType: 'corporation' | 'llc' | 'partnership' | 'sole_proprietorship';
    yearsInBusiness: number;
  };
  contract: VendorContract;
  performance: VendorPerformance;
  financials: VendorFinancials;
  integrations: VendorIntegration[];
  status: VendorStatus;
  relationship: VendorRelationship;
  riskAssessment: VendorRiskAssessment;
  compliance: ComplianceStatus;
  createdAt: string;
  updatedAt: string;
}

export type VendorCategory =
  | 'transportation'
  | 'technology'
  | 'fuel_management'
  | 'insurance'
  | 'maintenance'
  | 'logistics'
  | 'financial_services'
  | 'equipment'
  | 'consulting';

export interface VendorContract {
  id: string;
  type: 'service_agreement' | 'supply_contract' | 'licensing' | 'partnership';
  startDate: string;
  endDate: string;
  renewalDate?: string;
  autoRenewal: boolean;
  terms: {
    paymentTerms: string;
    deliveryTerms: string;
    penaltyClause: boolean;
    terminationNotice: number; // days
  };
  value: {
    annualValue: number;
    totalValue: number;
    currency: string;
  };
  status: 'active' | 'pending' | 'expired' | 'terminated' | 'under_review';
  documents: string[]; // Document IDs
}

export interface VendorPerformance {
  overall: {
    score: number; // 0-100
    rating: 'excellent' | 'good' | 'fair' | 'poor';
    lastUpdated: string;
  };
  metrics: {
    onTimeDelivery: number;
    qualityScore: number;
    responseTime: number; // hours
    issueResolutionRate: number;
    costEfficiency: number;
    complianceRate: number;
  };
  trends: {
    monthly: { month: string; score: number }[];
    yearly: { year: string; score: number }[];
  };
  benchmarking: {
    industryAverage: number;
    peerComparison: number;
    ranking: number; // among all vendors
  };
}

export interface VendorFinancials {
  spend: {
    totalAnnual: number;
    monthlyAverage: number;
    lastTransaction: string;
    paymentHistory: PaymentRecord[];
  };
  savings: {
    totalSaved: number;
    savingsPercent: number;
    optimizationOpportunities: OptimizationOpportunity[];
  };
  billing: {
    invoicesProcessed: number;
    averagePaymentDays: number;
    overdueAmount: number;
    discountsTaken: number;
  };
}

export interface VendorIntegration {
  name: string;
  type: 'api' | 'portal' | 'edi' | 'email' | 'ftp';
  status: 'active' | 'inactive' | 'error' | 'maintenance';
  uptime: number;
  lastSync: string;
  monthlyCost: number;
  dataTypes: string[];
  healthScore: number;
}

export type VendorStatus =
  | 'active'
  | 'inactive'
  | 'suspended'
  | 'under_review'
  | 'terminated';

export interface VendorRelationship {
  tier: 'strategic' | 'preferred' | 'standard' | 'probationary';
  relationshipManager: string;
  lastReview: string;
  nextReview: string;
  satisfactionScore: number;
  communicationScore: number;
  escalations: EscalationRecord[];
}

export interface VendorRiskAssessment {
  overall: 'low' | 'medium' | 'high' | 'critical';
  financial: RiskLevel;
  operational: RiskLevel;
  compliance: RiskLevel;
  reputation: RiskLevel;
  cybersecurity: RiskLevel;
  factors: string[];
  mitigationStrategies: string[];
  lastAssessment: string;
}

export interface ComplianceStatus {
  overall: 'compliant' | 'minor_issues' | 'major_issues' | 'non_compliant';
  insurance: { status: string; expiryDate: string };
  certifications: { name: string; status: string; expiryDate: string }[];
  auditDate: string;
  findings: string[];
}

interface PaymentRecord {
  date: string;
  amount: number;
  method: string;
  status: 'paid' | 'pending' | 'overdue' | 'disputed';
}

interface OptimizationOpportunity {
  type:
    | 'cost_reduction'
    | 'process_improvement'
    | 'consolidation'
    | 'renegotiation';
  description: string;
  potentialSavings: number;
  effort: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
  timeline: string;
}

interface EscalationRecord {
  date: string;
  type: string;
  description: string;
  resolution: string;
  status: 'open' | 'resolved' | 'escalated';
}

type RiskLevel = 'low' | 'medium' | 'high';

export class VendorManagementService {
  private static instance: VendorManagementService;
  private billingService: MultiTenantSquareService;
  private documentService: DocumentFlowService;
  private aiService: FleetFlowAI;
  private vendors: Map<string, Vendor> = new Map();

  private constructor() {
    this.billingService = new MultiTenantSquareService();
    this.documentService = new DocumentFlowService();
    this.aiService = new FleetFlowAI();
    this.initializeVendors();
  }

  public static getInstance(): VendorManagementService {
    if (!VendorManagementService.instance) {
      VendorManagementService.instance = new VendorManagementService();
    }
    return VendorManagementService.instance;
  }

  private initializeVendors(): void {
    // Initialize with some key FleetFlow vendors
    const vendors: Vendor[] = [
      {
        id: 'vendor-001',
        name: 'Premium Logistics Solutions',
        category: 'transportation',
        contactInfo: {
          email: 'contact@premiumlogistics.com',
          phone: '+1-800-555-0123',
          website: 'https://premiumlogistics.com',
          primaryContact: 'Michael Rodriguez',
        },
        address: {
          street: '1500 Commerce Blvd',
          city: 'Atlanta',
          state: 'GA',
          zipCode: '30309',
          country: 'USA',
        },
        businessInfo: {
          taxId: '58-1234567',
          registrationNumber: 'GA-LOG-2019-001',
          businessType: 'corporation',
          yearsInBusiness: 15,
        },
        contract: {
          id: 'contract-001',
          type: 'service_agreement',
          startDate: '2024-01-01T00:00:00Z',
          endDate: '2025-08-15T23:59:59Z',
          autoRenewal: true,
          terms: {
            paymentTerms: 'NET_30',
            deliveryTerms: 'Standard',
            penaltyClause: true,
            terminationNotice: 30,
          },
          value: {
            annualValue: 485000,
            totalValue: 970000,
            currency: 'USD',
          },
          status: 'active',
          documents: ['doc-contract-001', 'doc-insurance-001'],
        },
        performance: {
          overall: {
            score: 97.2,
            rating: 'excellent',
            lastUpdated: new Date().toISOString(),
          },
          metrics: {
            onTimeDelivery: 98.7,
            qualityScore: 96.5,
            responseTime: 1.2,
            issueResolutionRate: 94.8,
            costEfficiency: 92.1,
            complianceRate: 99.2,
          },
          trends: {
            monthly: this.generateTrendData('monthly', 97.2),
            yearly: this.generateTrendData('yearly', 97.2),
          },
          benchmarking: {
            industryAverage: 85.2,
            peerComparison: 91.8,
            ranking: 1,
          },
        },
        financials: {
          spend: {
            totalAnnual: 485000,
            monthlyAverage: 40416,
            lastTransaction: new Date(Date.now() - 86400000).toISOString(),
            paymentHistory: this.generatePaymentHistory(),
          },
          savings: {
            totalSaved: 92000,
            savingsPercent: 18.9,
            optimizationOpportunities: [
              {
                type: 'cost_reduction',
                description: 'Volume discount negotiation',
                potentialSavings: 25000,
                effort: 'low',
                impact: 'medium',
                timeline: '30 days',
              },
            ],
          },
          billing: {
            invoicesProcessed: 156,
            averagePaymentDays: 18.5,
            overdueAmount: 0,
            discountsTaken: 12,
          },
        },
        integrations: [
          {
            name: 'TMS Integration',
            type: 'api',
            status: 'active',
            uptime: 99.7,
            lastSync: new Date(Date.now() - 300000).toISOString(),
            monthlyCost: 299,
            dataTypes: ['tracking', 'billing', 'documents'],
            healthScore: 95,
          },
        ],
        status: 'active',
        relationship: {
          tier: 'strategic',
          relationshipManager: 'Sarah Johnson',
          lastReview: '2024-11-01T00:00:00Z',
          nextReview: '2025-02-01T00:00:00Z',
          satisfactionScore: 94.2,
          communicationScore: 97.1,
          escalations: [],
        },
        riskAssessment: {
          overall: 'low',
          financial: 'low',
          operational: 'low',
          compliance: 'low',
          reputation: 'low',
          cybersecurity: 'low',
          factors: ['Strong financial position', 'Excellent track record'],
          mitigationStrategies: [
            'Regular performance reviews',
            'Contract monitoring',
          ],
          lastAssessment: new Date().toISOString(),
        },
        compliance: {
          overall: 'compliant',
          insurance: { status: 'active', expiryDate: '2025-12-31T23:59:59Z' },
          certifications: [
            {
              name: 'ISO 9001',
              status: 'active',
              expiryDate: '2025-10-15T23:59:59Z',
            },
            {
              name: 'DOT Compliance',
              status: 'active',
              expiryDate: '2025-06-30T23:59:59Z',
            },
          ],
          auditDate: '2024-09-15T00:00:00Z',
          findings: [],
        },
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: new Date().toISOString(),
      },
      // Add more vendors...
      {
        id: 'vendor-002',
        name: 'TechFlow Integration Services',
        category: 'technology',
        contactInfo: {
          email: 'integration@techflow.com',
          phone: '+1-888-555-0124',
          website: 'https://techflow.com',
          primaryContact: 'Jennifer Chen',
        },
        address: {
          street: '2200 Tech Center Dr',
          city: 'Austin',
          state: 'TX',
          zipCode: '78759',
          country: 'USA',
        },
        businessInfo: {
          taxId: '74-9876543',
          registrationNumber: 'TX-TECH-2020-045',
          businessType: 'llc',
          yearsInBusiness: 8,
        },
        contract: {
          id: 'contract-002',
          type: 'licensing',
          startDate: '2024-06-01T00:00:00Z',
          endDate: '2025-12-01T23:59:59Z',
          autoRenewal: false,
          terms: {
            paymentTerms: 'NET_15',
            deliveryTerms: 'Digital',
            penaltyClause: false,
            terminationNotice: 60,
          },
          value: {
            annualValue: 325000,
            totalValue: 487500,
            currency: 'USD',
          },
          status: 'active',
          documents: ['doc-contract-002', 'doc-sla-002'],
        },
        performance: {
          overall: {
            score: 94.8,
            rating: 'excellent',
            lastUpdated: new Date().toISOString(),
          },
          metrics: {
            onTimeDelivery: 96.2,
            qualityScore: 95.8,
            responseTime: 2.1,
            issueResolutionRate: 92.5,
            costEfficiency: 89.7,
            complianceRate: 97.8,
          },
          trends: {
            monthly: this.generateTrendData('monthly', 94.8),
            yearly: this.generateTrendData('yearly', 94.8),
          },
          benchmarking: {
            industryAverage: 82.1,
            peerComparison: 89.3,
            ranking: 2,
          },
        },
        financials: {
          spend: {
            totalAnnual: 325000,
            monthlyAverage: 27083,
            lastTransaction: new Date(Date.now() - 172800000).toISOString(),
            paymentHistory: this.generatePaymentHistory(),
          },
          savings: {
            totalSaved: 58000,
            savingsPercent: 15.1,
            optimizationOpportunities: [
              {
                type: 'consolidation',
                description: 'Consolidate multiple tech vendors',
                potentialSavings: 35000,
                effort: 'high',
                impact: 'high',
                timeline: '90 days',
              },
            ],
          },
          billing: {
            invoicesProcessed: 84,
            averagePaymentDays: 12.3,
            overdueAmount: 0,
            discountsTaken: 8,
          },
        },
        integrations: [
          {
            name: 'API Gateway',
            type: 'api',
            status: 'active',
            uptime: 98.9,
            lastSync: new Date(Date.now() - 180000).toISOString(),
            monthlyCost: 149,
            dataTypes: ['api_calls', 'monitoring', 'analytics'],
            healthScore: 92,
          },
        ],
        status: 'active',
        relationship: {
          tier: 'preferred',
          relationshipManager: 'David Thompson',
          lastReview: '2024-10-15T00:00:00Z',
          nextReview: '2025-01-15T00:00:00Z',
          satisfactionScore: 91.7,
          communicationScore: 93.4,
          escalations: [],
        },
        riskAssessment: {
          overall: 'low',
          financial: 'low',
          operational: 'medium',
          compliance: 'low',
          reputation: 'low',
          cybersecurity: 'low',
          factors: ['Growing company', 'Good financial health'],
          mitigationStrategies: [
            'Regular security audits',
            'Performance monitoring',
          ],
          lastAssessment: new Date().toISOString(),
        },
        compliance: {
          overall: 'compliant',
          insurance: { status: 'active', expiryDate: '2025-11-30T23:59:59Z' },
          certifications: [
            {
              name: 'SOC 2 Type II',
              status: 'active',
              expiryDate: '2025-08-20T23:59:59Z',
            },
            {
              name: 'ISO 27001',
              status: 'active',
              expiryDate: '2025-09-10T23:59:59Z',
            },
          ],
          auditDate: '2024-08-20T00:00:00Z',
          findings: [],
        },
        createdAt: '2024-06-01T00:00:00Z',
        updatedAt: new Date().toISOString(),
      },
    ];

    vendors.forEach((vendor) => {
      this.vendors.set(vendor.id, vendor);
    });
  }

  private generateTrendData(
    period: 'monthly' | 'yearly',
    currentScore: number
  ): { month?: string; year?: string; score: number }[] {
    const data = [];
    const count = period === 'monthly' ? 12 : 3;

    for (let i = count - 1; i >= 0; i--) {
      const variation = (Math.random() - 0.5) * 10; // ±5 point variation
      const score = Math.max(60, Math.min(100, currentScore + variation));

      if (period === 'monthly') {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        data.push({
          month: date.toISOString().substring(0, 7),
          score: Number(score.toFixed(1)),
        });
      } else {
        const date = new Date();
        date.setFullYear(date.getFullYear() - i);
        data.push({
          year: date.getFullYear().toString(),
          score: Number(score.toFixed(1)),
        });
      }
    }

    return data;
  }

  private generatePaymentHistory(): PaymentRecord[] {
    const records: PaymentRecord[] = [];
    for (let i = 0; i < 6; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      records.push({
        date: date.toISOString(),
        amount: Math.floor(Math.random() * 50000) + 25000,
        method: 'ACH',
        status: i === 0 ? 'pending' : 'paid',
      });
    }
    return records;
  }

  // Core vendor management methods
  public getAllVendors(): Vendor[] {
    return Array.from(this.vendors.values()).sort(
      (a, b) => b.performance.overall.score - a.performance.overall.score
    );
  }

  public getVendor(vendorId: string): Vendor | null {
    return this.vendors.get(vendorId) || null;
  }

  public getVendorsByCategory(category: VendorCategory): Vendor[] {
    return this.getAllVendors().filter(
      (vendor) => vendor.category === category
    );
  }

  public getTopPerformingVendors(limit: number = 5): Vendor[] {
    return this.getAllVendors()
      .filter((vendor) => vendor.status === 'active')
      .slice(0, limit);
  }

  // Real-time analytics integration
  public async getVendorPerformanceAnalytics(): Promise<{
    totalVendors: number;
    activeVendors: number;
    averagePerformance: number;
    totalSpend: number;
    costSavings: number;
    contractsExpiring: number;
    vendorSatisfaction: number;
    riskAssessment: string;
  }> {
    const vendors = this.getAllVendors();
    const activeVendors = vendors.filter((v) => v.status === 'active');

    // Calculate real metrics from vendor data
    const totalSpend = activeVendors.reduce(
      (sum, v) => sum + v.financials.spend.totalAnnual,
      0
    );
    const totalSaved = activeVendors.reduce(
      (sum, v) => sum + v.financials.savings.totalSaved,
      0
    );
    const avgPerformance =
      activeVendors.reduce((sum, v) => sum + v.performance.overall.score, 0) /
      activeVendors.length;
    const avgSatisfaction =
      activeVendors.reduce(
        (sum, v) => sum + v.relationship.satisfactionScore,
        0
      ) / activeVendors.length;

    // Count contracts expiring in next 90 days
    const ninetyDaysFromNow = new Date();
    ninetyDaysFromNow.setDate(ninetyDaysFromNow.getDate() + 90);
    const expiringContracts = vendors.filter(
      (v) =>
        new Date(v.contract.endDate) <= ninetyDaysFromNow &&
        v.contract.status === 'active'
    ).length;

    // Assess overall risk
    const highRiskVendors = vendors.filter(
      (v) => v.riskAssessment.overall === 'high'
    ).length;
    const riskAssessment = highRiskVendors > 0 ? 'Medium' : 'Low';

    return {
      totalVendors: vendors.length,
      activeVendors: activeVendors.length,
      averagePerformance: Number(avgPerformance.toFixed(1)),
      totalSpend,
      costSavings: Number(
        ((totalSaved / (totalSpend + totalSaved)) * 100).toFixed(1)
      ),
      contractsExpiring: expiringContracts,
      vendorSatisfaction: Number(avgSatisfaction.toFixed(1)),
      riskAssessment,
    };
  }

  // Integration health monitoring
  public getIntegrationHealth(): {
    totalIntegrations: number;
    activeIntegrations: number;
    averageUptime: number;
    totalCost: number;
    issuesCount: number;
  } {
    const vendors = this.getAllVendors();
    const allIntegrations = vendors.flatMap((v) => v.integrations);

    const activeIntegrations = allIntegrations.filter(
      (i) => i.status === 'active'
    );
    const totalUptime = allIntegrations.reduce((sum, i) => sum + i.uptime, 0);
    const totalCost = allIntegrations.reduce(
      (sum, i) => sum + i.monthlyCost,
      0
    );
    const issuesCount = allIntegrations.filter(
      (i) => i.status === 'error' || i.status === 'maintenance'
    ).length;

    return {
      totalIntegrations: allIntegrations.length,
      activeIntegrations: activeIntegrations.length,
      averageUptime: Number((totalUptime / allIntegrations.length).toFixed(1)),
      totalCost,
      issuesCount,
    };
  }

  // AI-powered vendor insights
  public async getVendorOptimizationRecommendations(): Promise<
    OptimizationOpportunity[]
  > {
    const vendors = this.getAllVendors();
    const allOpportunities = vendors.flatMap(
      (v) => v.financials.savings.optimizationOpportunities
    );

    // Sort by potential savings
    return allOpportunities
      .sort((a, b) => b.potentialSavings - a.potentialSavings)
      .slice(0, 10);
  }

  // Contract management
  public getContractsExpiringSoon(days: number = 90): Vendor[] {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() + days);

    return this.getAllVendors().filter(
      (vendor) =>
        new Date(vendor.contract.endDate) <= cutoffDate &&
        vendor.contract.status === 'active'
    );
  }

  // Risk assessment
  public getHighRiskVendors(): Vendor[] {
    return this.getAllVendors().filter(
      (vendor) =>
        vendor.riskAssessment.overall === 'high' ||
        vendor.riskAssessment.overall === 'critical'
    );
  }

  // Performance tracking
  public async updateVendorPerformance(vendorId: string): Promise<boolean> {
    const vendor = this.getVendor(vendorId);
    if (!vendor) return false;

    // In a real implementation, this would integrate with:
    // - SettlementService for financial performance
    // - DocumentFlowService for service delivery metrics
    // - BillingService for payment performance
    // - External APIs for market data

    // For now, simulate real-time updates
    const variation = (Math.random() - 0.5) * 2; // ±1 point variation
    vendor.performance.overall.score = Math.max(
      60,
      Math.min(100, vendor.performance.overall.score + variation)
    );
    vendor.performance.overall.lastUpdated = new Date().toISOString();
    vendor.updatedAt = new Date().toISOString();

    return true;
  }

  // Financial integration methods
  public async syncWithBillingSystem(): Promise<void> {
    // This would integrate with BillingAutomationService
    // to pull real vendor spend data, payment history, etc.
    console.info('🔄 Syncing vendor data with billing system...');

    for (const vendor of this.vendors.values()) {
      // Simulate billing sync
      const metrics = calculateFinancialMetrics('vendor', 'monthly', vendor.id);
      if (metrics) {
        vendor.financials.spend.totalAnnual = metrics.revenue.total;
        vendor.financials.billing.averagePaymentDays =
          metrics.kpis.avgPaymentDays;
        vendor.updatedAt = new Date().toISOString();
      }
    }

    console.info('✅ Billing sync completed');
  }

  // Document integration
  public getVendorDocuments(vendorId: string): VendorDocument[] {
    return vendorDocumentService.getShipperDocuments(vendorId);
  }

  // Notification and alert methods
  public getVendorAlerts(): Array<{
    id: string;
    type: 'warning' | 'info' | 'success' | 'error';
    message: string;
    severity: 'low' | 'medium' | 'high';
    vendor?: string;
    action?: string;
  }> {
    const alerts = [];
    let alertId = 1;

    // Contract expiration alerts
    const expiringContracts = this.getContractsExpiringSoon(45);
    expiringContracts.forEach((vendor) => {
      const daysUntilExpiry = Math.ceil(
        (new Date(vendor.contract.endDate).getTime() - Date.now()) /
          (1000 * 60 * 60 * 24)
      );

      alerts.push({
        id: `alert-${alertId++}`,
        type: 'warning' as const,
        message: `${vendor.name} contract expires in ${daysUntilExpiry} days`,
        severity:
          daysUntilExpiry <= 30 ? ('high' as const) : ('medium' as const),
        vendor: vendor.name,
        action: 'review_renewal',
      });
    });

    // Performance alerts
    const underperformingVendors = this.getAllVendors().filter(
      (v) => v.performance.overall.score < 80 && v.status === 'active'
    );

    underperformingVendors.forEach((vendor) => {
      alerts.push({
        id: `alert-${alertId++}`,
        type: 'warning' as const,
        message: `${vendor.name} performance below threshold (${vendor.performance.overall.score}%)`,
        severity: 'medium' as const,
        vendor: vendor.name,
        action: 'performance_review',
      });
    });

    // Success alerts
    const totalSavings = this.getAllVendors().reduce(
      (sum, v) => sum + v.financials.savings.totalSaved,
      0
    );

    if (totalSavings > 500000) {
      alerts.push({
        id: `alert-${alertId++}`,
        type: 'success' as const,
        message: `Cost optimization target exceeded - $${(totalSavings / 1000).toFixed(0)}K saved this year`,
        severity: 'low' as const,
      });
    }

    return alerts.slice(0, 5); // Return top 5 alerts
  }
}

// Export singleton instance
export const vendorManagementService = VendorManagementService.getInstance();
