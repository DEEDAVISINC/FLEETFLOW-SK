'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { checkPermission } from '../config/access';
import {
  ensureUniqueKey,
  forceCleanupDuplicates,
  initializeGlobalRegistry,
  resetInvoiceSystem,
  ultimateCleanup,
} from '../services/invoiceService';
import { shipperService } from '../services/shipperService';

// Access Control Component
const AccessRestricted = () => (
  <div className='flex min-h-screen items-center justify-center bg-gray-50'>
    <div className='mx-auto max-w-md rounded-lg bg-white p-8 text-center shadow-lg'>
      <div className='mb-4 text-6xl'>🔒</div>
      <h1 className='mb-4 text-2xl font-bold text-gray-800'>
        Access Restricted
      </h1>
      <p className='mb-4 text-gray-600'>
        You need appropriate permissions to access the financials section.
      </p>
      <p className='mb-6 text-sm text-gray-500'>
        Contact your administrator for access to financial data.
      </p>
      <button
        onClick={() => window.history.back()}
        className='mt-6 rounded-lg bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700'
      >
        Go Back
      </button>
    </div>
  </div>
);

// Enterprise Invoice Interfaces
interface EnterpriseInvoice {
  id: string;
  invoiceNumber: string; // Format: {TenantCode}-{ShipperCode}-{Year}-{Sequence}

  // Tenant & Multi-tenant Architecture
  tenantId: string;
  tenantName: string;
  tenantCode: string; // "FF", "ABC", etc.

  // Shipper Integration (from existing shipper management)
  shipperId: string;
  shipperCode: string; // "ABC-204-070"
  shipperCompanyName: string;
  shipperContactName: string;
  shipperEmail: string;
  shipperPaymentTerms: string;
  shipperCreditRating: 'A+' | 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C' | 'D';
  shipperBusinessType: string;

  // Load & Service Details
  loadId?: string;
  serviceType: 'freight' | 'warehousing' | '3pl' | 'dispatch' | 'brokerage';

  // Financial Details
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  totalAmount: number;
  currency: 'USD' | 'CAD' | 'MXN';

  // Payment & Status
  status:
    | 'draft'
    | 'sent'
    | 'viewed'
    | 'paid'
    | 'overdue'
    | 'disputed'
    | 'cancelled';
  paymentStatus: 'pending' | 'partial' | 'paid' | 'failed' | 'refunded';
  paymentMethod?: 'ach' | 'wire' | 'check' | 'credit_card' | 'factoring';

  // Aging & Collections
  agingBucket: 'current' | '1-30' | '31-60' | '61-90' | '90+';
  daysOutstanding: number;

  // Line Items
  lineItems: EnterpriseLineItem[];

  // Integration Points
  billComInvoiceId?: string;
  quickBooksId?: string;

  // Audit Trail
  createdBy: string;
  approvedBy?: string;
  sentBy?: string;
  createdAt: string;
  approvedAt?: string;
  sentAt?: string;
  dueDate: string;

  // Collections & Disputes
  collectionNotes?: string[];
  disputeReason?: string;
  lastContactDate?: string;
}

interface EnterpriseLineItem {
  id: string;
  description: string;
  serviceCode: string; // "FRT-001", "WHS-002", etc.
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  taxRate: number;
  taxAmount: number;

  // Load-specific details
  origin?: string;
  destination?: string;
  miles?: number;
  weight?: number;
  commodity?: string;
  equipmentType?: string;

  // Cost tracking
  carrierCost?: number;
  margin?: number;
  marginPercent?: number;
}

interface ShipperFinancialSummary {
  shipperId: string;
  shipperName: string;
  totalInvoices: number;
  totalRevenue: number;
  averageInvoiceAmount: number;
  averagePaymentDays: number;
  creditRating: string;
  paymentTerms: string;
  outstandingBalance: number;
  overdueAmount: number;
  disputedAmount: number;
  lastPaymentDate: string;
  riskScore: 'Low' | 'Medium' | 'High';
}

interface TenantFinancialMetrics {
  tenantId: string;
  tenantName: string;
  totalRevenue: number;
  monthlyRecurringRevenue: number;
  averageMargin: number;
  totalInvoices: number;
  paidInvoices: number;
  overdueInvoices: number;
  collectionEfficiency: number;
  daysOutstanding: number;
}

// Enterprise Invoice Service
class EnterpriseInvoiceService {
  private static instance: EnterpriseInvoiceService;

  static getInstance(): EnterpriseInvoiceService {
    if (!EnterpriseInvoiceService.instance) {
      EnterpriseInvoiceService.instance = new EnterpriseInvoiceService();
    }
    return EnterpriseInvoiceService.instance;
  }

  // Generate enterprise invoice number
  generateInvoiceNumber(tenantCode: string, shipperCode: string): string {
    const year = new Date().getFullYear();
    const sequence = Math.floor(Math.random() * 999999) + 1;
    return `${tenantCode}-${shipperCode}-${year}-${sequence.toString().padStart(6, '0')}`;
  }

  // Calculate aging bucket
  calculateAgingBucket(
    dueDate: string
  ): 'current' | '1-30' | '31-60' | '61-90' | '90+' {
    const today = new Date();
    const due = new Date(dueDate);
    const daysOverdue = Math.floor(
      (today.getTime() - due.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysOverdue <= 0) return 'current';
    if (daysOverdue <= 30) return '1-30';
    if (daysOverdue <= 60) return '31-60';
    if (daysOverdue <= 90) return '61-90';
    return '90+';
  }

  // Calculate days outstanding
  calculateDaysOutstanding(createdDate: string): number {
    const today = new Date();
    const created = new Date(createdDate);
    return Math.floor(
      (today.getTime() - created.getTime()) / (1000 * 60 * 60 * 24)
    );
  }

  // Generate enterprise invoice from shipper data
  async generateInvoiceFromShipper(
    shipperId: string,
    loadDetails: any
  ): Promise<EnterpriseInvoice> {
    const shipper = shipperService.getShipperById(shipperId);
    if (!shipper) throw new Error('Shipper not found');

    const tenantCode = 'FF'; // FleetFlow default tenant
    const invoiceNumber = this.generateInvoiceNumber(
      tenantCode,
      shipper.id || ''
    );
    const createdDate = new Date().toISOString();
    const dueDate = this.calculateDueDate(shipper.paymentTerms || 'Net 30');

    return {
      id: `INV-${Date.now()}`,
      invoiceNumber,
      tenantId: 'tenant-fleetflow-001',
      tenantName: 'FleetFlow Enterprise',
      tenantCode,

      // Shipper integration
      shipperId: shipper.id,
      shipperCode: shipper.id,
      shipperCompanyName: shipper.companyName,
      shipperContactName: shipper.contactName || '',
      shipperEmail: shipper.email || '',
      shipperPaymentTerms: shipper.paymentTerms || 'Net 30',
      shipperCreditRating: (shipper.creditRating || 'B') as any,
      shipperBusinessType: shipper.businessType || 'General',

      // Load details
      loadId: loadDetails?.loadId,
      serviceType: 'freight',

      // Financial calculations
      subtotal: loadDetails?.amount || 0,
      taxRate: 0.08, // 8% tax rate
      taxAmount: (loadDetails?.amount || 0) * 0.08,
      totalAmount: (loadDetails?.amount || 0) * 1.08,
      currency: 'USD',

      // Status
      status: 'draft',
      paymentStatus: 'pending',
      agingBucket: 'current',
      daysOutstanding: 0,

      // Line items
      lineItems: [
        {
          id: `LI-${Date.now()}`,
          description:
            loadDetails?.description || 'Freight Transportation Services',
          serviceCode: 'FRT-001',
          quantity: 1,
          unitPrice: loadDetails?.amount || 0,
          totalPrice: loadDetails?.amount || 0,
          taxRate: 0.08,
          taxAmount: (loadDetails?.amount || 0) * 0.08,
          origin: loadDetails?.origin,
          destination: loadDetails?.destination,
          miles: loadDetails?.miles,
          weight: loadDetails?.weight,
          commodity: loadDetails?.commodity,
          equipmentType: loadDetails?.equipmentType,
          carrierCost: loadDetails?.carrierCost,
          margin: (loadDetails?.amount || 0) - (loadDetails?.carrierCost || 0),
          marginPercent: loadDetails?.carrierCost
            ? ((loadDetails.amount - loadDetails.carrierCost) /
                loadDetails.amount) *
              100
            : 0,
        },
      ],

      // Audit trail
      createdBy: 'system',
      createdAt: createdDate,
      dueDate,
    };
  }

  private calculateDueDate(paymentTerms: string): string {
    const today = new Date();
    const daysToAdd = this.parsePaymentTerms(paymentTerms);
    today.setDate(today.getDate() + daysToAdd);
    return today.toISOString().split('T')[0];
  }

  private parsePaymentTerms(terms: string): number {
    if (terms.includes('Net 30')) return 30;
    if (terms.includes('Net 21')) return 21;
    if (terms.includes('Net 15')) return 15;
    if (terms.includes('Net 45')) return 45;
    return 30; // Default
  }
}

export default function EnterpriseFinancialsPage() {
  // Check permissions
  const hasAccess = checkPermission('financial');
  if (!hasAccess) {
    return <AccessRestricted />;
  }

  // State management
  const [selectedTab, setSelectedTab] = useState('overview');
  const [cleanedInvoices, setCleanedInvoices] = useState<any[]>([]);

  const [viewMode, setViewMode] = useState<'broker' | 'dispatcher'>('broker');
  const [selectedShipper, setSelectedShipper] = useState<string>('all');
  const [dateRange, setDateRange] = useState<'30d' | '90d' | '1y' | 'all'>(
    '30d'
  );

  // Enterprise data with proper defaults
  const [enterpriseInvoices, setEnterpriseInvoices] = useState<
    EnterpriseInvoice[]
  >([]);
  const [shipperSummaries, setShipperSummaries] = useState<
    ShipperFinancialSummary[]
  >([]);
  const [tenantMetrics, setTenantMetrics] =
    useState<TenantFinancialMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  // Debug function accessible from browser console
  if (typeof window !== 'undefined') {
    (window as any).resetFleetFlowInvoices = () => {
      resetInvoiceSystem();
      const cleaned = ultimateCleanup();
      setCleanedInvoices(cleaned);
      initializeGlobalRegistry();
      console.log(
        '🔧 FleetFlow invoice system completely reset and cleaned with ultimate cleanup'
      );
    };
  }

  // Clean up duplicate invoices on component mount
  useEffect(() => {
    // Initialize global registry first
    initializeGlobalRegistry();
    // Run ultimate cleanup for maximum effectiveness
    const cleaned = ultimateCleanup();
    setCleanedInvoices(cleaned);
  }, []);

  // Refresh cleaned invoices when tab changes
  useEffect(() => {
    if (selectedTab === 'dispatcher-invoices') {
      initializeGlobalRegistry();
      const cleaned = ultimateCleanup();
      setCleanedInvoices(cleaned);
    }
  }, [selectedTab]);

  // Initialize enterprise data
  useEffect(() => {
    const initializeEnterpriseData = async () => {
      setLoading(true);

      try {
        // Get all shippers from existing shipper management
        const shippers = shipperService.getAllShippers();
        const invoiceService = EnterpriseInvoiceService.getInstance();

        // Generate sample enterprise invoices for each shipper
        const sampleInvoices: EnterpriseInvoice[] = [];
        const summaries: ShipperFinancialSummary[] = [];

        for (const shipper of shippers) {
          // Generate 2-5 invoices per shipper
          const invoiceCount = Math.floor(Math.random() * 4) + 2;
          const shipperInvoices: EnterpriseInvoice[] = [];

          for (let i = 0; i < invoiceCount; i++) {
            const loadDetails = {
              loadId: `LD-${Date.now()}-${i}`,
              amount: Math.floor(Math.random() * 5000) + 1500,
              description: `Freight: ${getRandomOrigin()} to ${getRandomDestination()}`,
              origin: getRandomOrigin(),
              destination: getRandomDestination(),
              miles: Math.floor(Math.random() * 1000) + 100,
              weight: Math.floor(Math.random() * 40000) + 10000,
              commodity: getRandomCommodity(),
              equipmentType: getRandomEquipment(),
              carrierCost: Math.floor(Math.random() * 3000) + 1000,
            };

            const invoice = await invoiceService.generateInvoiceFromShipper(
              shipper.id,
              loadDetails
            );

            // Randomize status and dates for demo
            const statuses: EnterpriseInvoice['status'][] = [
              'paid',
              'sent',
              'overdue',
              'draft',
            ];
            invoice.status =
              statuses[Math.floor(Math.random() * statuses.length)];

            if (invoice.status === 'paid') {
              invoice.paymentStatus = 'paid';
              invoice.agingBucket = 'current';
            } else if (invoice.status === 'overdue') {
              invoice.agingBucket = ['1-30', '31-60', '61-90'][
                Math.floor(Math.random() * 3)
              ] as any;
              invoice.daysOutstanding = Math.floor(Math.random() * 60) + 30;
            }

            // Adjust dates for realism
            const daysAgo = Math.floor(Math.random() * 90);
            const createdDate = new Date();
            createdDate.setDate(createdDate.getDate() - daysAgo);
            invoice.createdAt = createdDate.toISOString();
            invoice.daysOutstanding = invoiceService.calculateDaysOutstanding(
              invoice.createdAt
            );

            shipperInvoices.push(invoice);
            sampleInvoices.push(invoice);
          }

          // Calculate shipper summary
          const totalRevenue = shipperInvoices.reduce(
            (sum, inv) => sum + inv.totalAmount,
            0
          );
          const paidInvoices = shipperInvoices.filter(
            (inv) => inv.status === 'paid'
          );
          const overdueInvoices = shipperInvoices.filter(
            (inv) => inv.status === 'overdue'
          );
          const averagePaymentDays =
            paidInvoices.length > 0
              ? paidInvoices.reduce(
                  (sum, inv) => sum + inv.daysOutstanding,
                  0
                ) / paidInvoices.length
              : 0;

          summaries.push({
            shipperId: shipper.id,
            shipperName: shipper.companyName,
            totalInvoices: shipperInvoices.length,
            totalRevenue,
            averageInvoiceAmount: totalRevenue / shipperInvoices.length,
            averagePaymentDays,
            creditRating: shipper.creditRating || 'B',
            paymentTerms: shipper.paymentTerms || 'Net 30',
            outstandingBalance: shipperInvoices
              .filter((inv) => inv.status !== 'paid')
              .reduce((sum, inv) => sum + inv.totalAmount, 0),
            overdueAmount: overdueInvoices.reduce(
              (sum, inv) => sum + inv.totalAmount,
              0
            ),
            disputedAmount: shipperInvoices
              .filter((inv) => inv.status === 'disputed')
              .reduce((sum, inv) => sum + inv.totalAmount, 0),
            lastPaymentDate:
              paidInvoices.length > 0
                ? paidInvoices[paidInvoices.length - 1].createdAt.split('T')[0]
                : 'N/A',
            riskScore: calculateRiskScore(
              shipper.creditRating || 'B',
              averagePaymentDays,
              overdueInvoices.length
            ),
          });
        }

        // Calculate tenant metrics
        const totalRevenue = sampleInvoices.reduce(
          (sum, inv) => sum + inv.totalAmount,
          0
        );
        const paidInvoices = sampleInvoices.filter(
          (inv) => inv.status === 'paid'
        );
        const overdueInvoices = sampleInvoices.filter(
          (inv) => inv.status === 'overdue'
        );

        const metrics: TenantFinancialMetrics = {
          tenantId: 'tenant-fleetflow-001',
          tenantName: 'FleetFlow Enterprise',
          totalRevenue,
          monthlyRecurringRevenue: totalRevenue / 3, // Approximate MRR
          averageMargin:
            sampleInvoices.reduce((sum, inv) => {
              const margin = inv.lineItems.reduce(
                (lineSum, item) => lineSum + (item.marginPercent || 0),
                0
              );
              return sum + margin / inv.lineItems.length;
            }, 0) / sampleInvoices.length,
          totalInvoices: sampleInvoices.length,
          paidInvoices: paidInvoices.length,
          overdueInvoices: overdueInvoices.length,
          collectionEfficiency:
            (paidInvoices.length / sampleInvoices.length) * 100,
          daysOutstanding:
            sampleInvoices.reduce((sum, inv) => sum + inv.daysOutstanding, 0) /
            sampleInvoices.length,
        };

        setEnterpriseInvoices(sampleInvoices);
        setShipperSummaries(summaries);
        setTenantMetrics(metrics);
      } catch (error) {
        console.error('Error initializing enterprise data:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeEnterpriseData();
  }, []);

  // Helper functions
  const getRandomOrigin = () => {
    const origins = [
      'Atlanta, GA',
      'Chicago, IL',
      'Los Angeles, CA',
      'Houston, TX',
      'Phoenix, AZ',
      'Detroit, MI',
    ];
    return origins[Math.floor(Math.random() * origins.length)];
  };

  const getRandomDestination = () => {
    const destinations = [
      'Miami, FL',
      'New York, NY',
      'Seattle, WA',
      'Denver, CO',
      'Dallas, TX',
      'Boston, MA',
    ];
    return destinations[Math.floor(Math.random() * destinations.length)];
  };

  const getRandomCommodity = () => {
    const commodities = [
      'Steel Products',
      'Electronics',
      'Food Products',
      'Auto Parts',
      'Chemicals',
      'Machinery',
    ];
    return commodities[Math.floor(Math.random() * commodities.length)];
  };

  const getRandomEquipment = () => {
    const equipment = [
      'Dry Van',
      'Flatbed',
      'Refrigerated',
      'Tanker',
      'Lowboy',
      'Step Deck',
    ];
    return equipment[Math.floor(Math.random() * equipment.length)];
  };

  const calculateRiskScore = (
    creditRating: string,
    avgPaymentDays: number,
    overdueCount: number
  ): 'Low' | 'Medium' | 'High' => {
    let score = 0;

    // Credit rating scoring
    if (creditRating.includes('A')) score += 1;
    else if (creditRating.includes('B')) score += 2;
    else score += 3;

    // Payment days scoring
    if (avgPaymentDays > 45) score += 2;
    else if (avgPaymentDays > 30) score += 1;

    // Overdue count scoring
    if (overdueCount > 2) score += 2;
    else if (overdueCount > 0) score += 1;

    if (score <= 2) return 'Low';
    if (score <= 4) return 'Medium';
    return 'High';
  };

  // Filter invoices based on current selections
  const getFilteredInvoices = () => {
    // Use cleaned invoices from localStorage for dispatcher fees, fallback to enterprise invoices for other data
    let filtered =
      selectedTab === 'dispatcher-invoices'
        ? getCleanedInvoices()
        : enterpriseInvoices || [];

    if (selectedShipper !== 'all') {
      filtered = filtered.filter((inv) => inv.shipperId === selectedShipper);
    }

    if (dateRange !== 'all') {
      const now = new Date();
      const cutoffDate = new Date();

      switch (dateRange) {
        case '30d':
          cutoffDate.setDate(now.getDate() - 30);
          break;
        case '90d':
          cutoffDate.setDate(now.getDate() - 90);
          break;
        case '1y':
          cutoffDate.setFullYear(now.getFullYear() - 1);
          break;
      }

      filtered = filtered.filter(
        (inv) => new Date(inv.createdAt) >= cutoffDate
      );
    }

    return filtered;
  };

  // Get status badge styling
  const getStatusBadge = (status: string) => {
    const baseClasses = 'px-3 py-1 rounded-full text-sm font-medium';
    switch (status) {
      case 'paid':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'sent':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'overdue':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'draft':
        return `${baseClasses} bg-gray-100 text-gray-800`;
      case 'disputed':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  // Get risk score styling
  const getRiskScoreBadge = (riskScore: string) => {
    const baseClasses = 'px-2 py-1 rounded text-xs font-medium';
    switch (riskScore) {
      case 'Low':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'Medium':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'High':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  // Helper function to get cleaned invoices
  const getCleanedInvoices = () => {
    if (cleanedInvoices.length > 0) {
      return cleanedInvoices;
    }
    // Fallback to force cleanup if state is empty
    return forceCleanupDuplicates();
  };

  // Helper function to safely get invoice count by status
  const getInvoiceCountByStatus = (status: string) => {
    try {
      return getCleanedInvoices().filter((inv: any) => inv.status === status)
        .length;
    } catch {
      return 0;
    }
  };

  if (loading) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <div className='text-center'>
          <div className='mx-auto h-32 w-32 animate-spin rounded-full border-b-2 border-blue-600'></div>
          <p className='mt-4 text-lg text-gray-600'>
            Loading Enterprise Financial Data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: `
          linear-gradient(135deg, #022c22 0%, #032e2a 25%, #044e46 50%, #042f2e 75%, #0a1612 100%),
          radial-gradient(circle at 20% 20%, rgba(34, 197, 94, 0.06) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.04) 0%, transparent 50%)
        `,
        backgroundAttachment: 'fixed',
        color: 'white',
        padding: '20px',
      }}
    >
      {/* Header */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          padding: '32px',
          marginBottom: '32px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div
              style={{
                padding: '16px',
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
              }}
            >
              <span style={{ fontSize: '32px' }}>💰</span>
            </div>
            <div>
              <h1
                style={{
                  fontSize: '36px',
                  fontWeight: 'bold',
                  margin: '0 0 8px 0',
                  background:
                    'linear-gradient(135deg, #ffffff 0%, #e5e7eb 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Enterprise Financial Management
              </h1>
              <p style={{ fontSize: '18px', opacity: 0.8, margin: 0 }}>
                Comprehensive accounting system with shipper integration &
                multi-tenant architecture
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            {/* View Mode Toggle */}
            <div
              style={{
                display: 'flex',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '4px',
              }}
            >
              <button
                onClick={() => setViewMode('broker')}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  background:
                    viewMode === 'broker'
                      ? 'rgba(255, 255, 255, 0.2)'
                      : 'transparent',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                }}
              >
                🏢 Broker View
              </button>
              <button
                onClick={() => setViewMode('dispatcher')}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  background:
                    viewMode === 'dispatcher'
                      ? 'rgba(255, 255, 255, 0.2)'
                      : 'transparent',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                }}
              >
                📋 Dispatcher View
              </button>
            </div>

            <Link href='/'>
              <button
                style={{
                  padding: '12px 24px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                }}
              >
                ← Back to Dashboard
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Enterprise Metrics Dashboard */}
      {tenantMetrics && (
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            padding: '24px',
            marginBottom: '32px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <h2
            style={{
              fontSize: '24px',
              fontWeight: 'bold',
              marginBottom: '20px',
              color: 'white',
            }}
          >
            📊 Enterprise Performance Metrics
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '20px',
            }}
          >
            <div
              style={{
                background: 'rgba(34, 197, 94, 0.1)',
                padding: '20px',
                borderRadius: '16px',
                border: '1px solid rgba(34, 197, 94, 0.2)',
              }}
            >
              <div
                style={{ fontSize: '14px', opacity: 0.8, marginBottom: '8px' }}
              >
                Total Revenue
              </div>
              <div
                style={{
                  fontSize: '28px',
                  fontWeight: 'bold',
                  color: '#22c55e',
                }}
              >
                ${tenantMetrics.totalRevenue.toLocaleString()}
              </div>
            </div>

            <div
              style={{
                background: 'rgba(59, 130, 246, 0.1)',
                padding: '20px',
                borderRadius: '16px',
                border: '1px solid rgba(59, 130, 246, 0.2)',
              }}
            >
              <div
                style={{ fontSize: '14px', opacity: 0.8, marginBottom: '8px' }}
              >
                Monthly Recurring Revenue
              </div>
              <div
                style={{
                  fontSize: '28px',
                  fontWeight: 'bold',
                  color: '#3b82f6',
                }}
              >
                ${tenantMetrics.monthlyRecurringRevenue.toLocaleString()}
              </div>
            </div>

            <div
              style={{
                background: 'rgba(168, 85, 247, 0.1)',
                padding: '20px',
                borderRadius: '16px',
                border: '1px solid rgba(168, 85, 247, 0.2)',
              }}
            >
              <div
                style={{ fontSize: '14px', opacity: 0.8, marginBottom: '8px' }}
              >
                Average Margin
              </div>
              <div
                style={{
                  fontSize: '28px',
                  fontWeight: 'bold',
                  color: '#a855f7',
                }}
              >
                {tenantMetrics.averageMargin.toFixed(1)}%
              </div>
            </div>

            <div
              style={{
                background: 'rgba(245, 158, 11, 0.1)',
                padding: '20px',
                borderRadius: '16px',
                border: '1px solid rgba(245, 158, 11, 0.2)',
              }}
            >
              <div
                style={{ fontSize: '14px', opacity: 0.8, marginBottom: '8px' }}
              >
                Collection Efficiency
              </div>
              <div
                style={{
                  fontSize: '28px',
                  fontWeight: 'bold',
                  color: '#f59e0b',
                }}
              >
                {tenantMetrics.collectionEfficiency.toFixed(1)}%
              </div>
            </div>

            <div
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                padding: '20px',
                borderRadius: '16px',
                border: '1px solid rgba(239, 68, 68, 0.2)',
              }}
            >
              <div
                style={{ fontSize: '14px', opacity: 0.8, marginBottom: '8px' }}
              >
                Overdue Invoices
              </div>
              <div
                style={{
                  fontSize: '28px',
                  fontWeight: 'bold',
                  color: '#ef4444',
                }}
              >
                {tenantMetrics.overdueInvoices}
              </div>
            </div>

            <div
              style={{
                background: 'rgba(20, 184, 166, 0.1)',
                padding: '20px',
                borderRadius: '16px',
                border: '1px solid rgba(20, 184, 166, 0.2)',
              }}
            >
              <div
                style={{ fontSize: '14px', opacity: 0.8, marginBottom: '8px' }}
              >
                Avg Days Outstanding
              </div>
              <div
                style={{
                  fontSize: '28px',
                  fontWeight: 'bold',
                  color: '#14b8a6',
                }}
              >
                {tenantMetrics.daysOutstanding.toFixed(0)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          padding: '8px',
          marginBottom: '32px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap',
        }}
      >
        {[
          { id: 'overview', label: '📊 Overview', icon: '📊' },
          { id: 'invoices', label: '📄 Enterprise Invoices', icon: '📄' },
          { id: 'analytics', label: '📈 Shipper Analytics', icon: '📈' },
          { id: 'expenses', label: '💸 Expenses', icon: '💸' },
          { id: 'payroll', label: '👥 Payroll', icon: '👥' },
          { id: 'factoring', label: '💰 Factoring', icon: '💰' },
          {
            id: 'dispatcher-invoices',
            label: '🚛 Dispatcher Invoices',
            icon: '🚛',
          },
          { id: 'contracts', label: '📋 Contracts', icon: '📋' },
          { id: 'reports', label: '📊 Reports', icon: '📊' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id as any)}
            style={{
              padding: '12px 20px',
              borderRadius: '16px',
              border: 'none',
              background:
                selectedTab === tab.id
                  ? 'rgba(255, 255, 255, 0.2)'
                  : 'transparent',
              color: 'white',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
            onMouseOver={(e) => {
              if (selectedTab !== tab.id) {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              }
            }}
            onMouseOut={(e) => {
              if (selectedTab !== tab.id) {
                e.currentTarget.style.background = 'transparent';
              }
            }}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          padding: '32px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          minHeight: '600px',
        }}
      >
        {/* Overview Tab */}
        {selectedTab === 'overview' && (
          <div>
            <h2
              style={{
                fontSize: '28px',
                fontWeight: 'bold',
                marginBottom: '24px',
                color: 'white',
              }}
            >
              📊 Financial Overview
            </h2>

            {/* Quick Actions */}
            <div style={{ marginBottom: '32px' }}>
              <h3
                style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  marginBottom: '16px',
                  color: 'white',
                }}
              >
                Quick Actions
              </h3>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <button
                  style={{
                    padding: '16px 24px',
                    background:
                      'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                    border: 'none',
                    borderRadius: '12px',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  📄 Create Invoice
                </button>
                <button
                  style={{
                    padding: '16px 24px',
                    background:
                      'linear-gradient(135deg, #10b981 0%, #047857 100%)',
                    border: 'none',
                    borderRadius: '12px',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  💸 Add Expense
                </button>
                <button
                  style={{
                    padding: '16px 24px',
                    background:
                      'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                    border: 'none',
                    borderRadius: '12px',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  👥 Process Payroll
                </button>
                <button
                  style={{
                    padding: '16px 24px',
                    background:
                      'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    border: 'none',
                    borderRadius: '12px',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  💰 Submit Factoring
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <h3
                style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  marginBottom: '16px',
                  color: 'white',
                }}
              >
                Recent Financial Activity
              </h3>
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '16px',
                  padding: '24px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                  }}
                >
                  {getFilteredInvoices()
                    ?.slice(0, 5)
                    ?.map((invoice, index) => (
                      <div
                        key={ensureUniqueKey(invoice, index)}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '16px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          borderRadius: '12px',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                        }}
                      >
                        <div>
                          <div
                            style={{ fontWeight: '600', marginBottom: '4px' }}
                          >
                            {invoice.invoiceNumber}
                          </div>
                          <div style={{ fontSize: '14px', opacity: 0.8 }}>
                            {invoice.shipperCompanyName}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div
                            style={{ fontWeight: '600', marginBottom: '4px' }}
                          >
                            ${invoice.totalAmount.toLocaleString()}
                          </div>
                          <span className={getStatusBadge(invoice.status)}>
                            {invoice.status.charAt(0).toUpperCase() +
                              invoice.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Enterprise Invoices Tab */}
        {selectedTab === 'invoices' && (
          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '24px',
              }}
            >
              <h2
                style={{
                  fontSize: '28px',
                  fontWeight: 'bold',
                  color: 'white',
                  margin: 0,
                }}
              >
                📄 Enterprise Invoices
              </h2>

              {/* Filters */}
              <div
                style={{ display: 'flex', gap: '16px', alignItems: 'center' }}
              >
                <select
                  value={selectedShipper}
                  onChange={(e) => setSelectedShipper(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    fontSize: '14px',
                  }}
                >
                  <option value='all'>All Shippers</option>
                  {shipperSummaries?.map((shipper) => (
                    <option
                      key={shipper.shipperId}
                      value={shipper.shipperId}
                      style={{ color: 'black' }}
                    >
                      {shipper.shipperName}
                    </option>
                  )) || []}
                </select>

                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value as any)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    fontSize: '14px',
                  }}
                >
                  <option value='30d' style={{ color: 'black' }}>
                    Last 30 Days
                  </option>
                  <option value='90d' style={{ color: 'black' }}>
                    Last 90 Days
                  </option>
                  <option value='1y' style={{ color: 'black' }}>
                    Last Year
                  </option>
                  <option value='all' style={{ color: 'black' }}>
                    All Time
                  </option>
                </select>
              </div>
            </div>

            {/* Invoices Table */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '16px',
                overflow: 'hidden',
              }}
            >
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'rgba(255, 255, 255, 0.1)' }}>
                      <th
                        style={{
                          padding: '16px',
                          textAlign: 'left',
                          fontWeight: '600',
                          color: 'white',
                        }}
                      >
                        Invoice #
                      </th>
                      <th
                        style={{
                          padding: '16px',
                          textAlign: 'left',
                          fontWeight: '600',
                          color: 'white',
                        }}
                      >
                        Shipper
                      </th>
                      <th
                        style={{
                          padding: '16px',
                          textAlign: 'left',
                          fontWeight: '600',
                          color: 'white',
                        }}
                      >
                        Service
                      </th>
                      <th
                        style={{
                          padding: '16px',
                          textAlign: 'right',
                          fontWeight: '600',
                          color: 'white',
                        }}
                      >
                        Amount
                      </th>
                      <th
                        style={{
                          padding: '16px',
                          textAlign: 'center',
                          fontWeight: '600',
                          color: 'white',
                        }}
                      >
                        Status
                      </th>
                      <th
                        style={{
                          padding: '16px',
                          textAlign: 'center',
                          fontWeight: '600',
                          color: 'white',
                        }}
                      >
                        Aging
                      </th>
                      <th
                        style={{
                          padding: '16px',
                          textAlign: 'right',
                          fontWeight: '600',
                          color: 'white',
                        }}
                      >
                        Days Out
                      </th>
                      <th
                        style={{
                          padding: '16px',
                          textAlign: 'left',
                          fontWeight: '600',
                          color: 'white',
                        }}
                      >
                        Due Date
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {getFilteredInvoices()?.map((invoice, index) => (
                      <tr
                        key={ensureUniqueKey(invoice, index)}
                        style={{
                          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                          background:
                            index % 2 === 0
                              ? 'rgba(255, 255, 255, 0.02)'
                              : 'transparent',
                        }}
                      >
                        <td
                          style={{
                            padding: '16px',
                            color: 'white',
                            fontWeight: '500',
                          }}
                        >
                          {invoice.invoiceNumber}
                        </td>
                        <td style={{ padding: '16px', color: 'white' }}>
                          <div>
                            <div
                              style={{ fontWeight: '500', marginBottom: '2px' }}
                            >
                              {invoice.shipperCompanyName}
                            </div>
                            <div style={{ fontSize: '12px', opacity: 0.7 }}>
                              {invoice.shipperContactName}
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '16px', color: 'white' }}>
                          <div>
                            <div
                              style={{ fontWeight: '500', marginBottom: '2px' }}
                            >
                              {invoice.serviceType.charAt(0).toUpperCase() +
                                invoice.serviceType.slice(1)}
                            </div>
                            <div style={{ fontSize: '12px', opacity: 0.7 }}>
                              {invoice.lineItems[0]?.description}
                            </div>
                          </div>
                        </td>
                        <td
                          style={{
                            padding: '16px',
                            textAlign: 'right',
                            color: 'white',
                            fontWeight: '600',
                          }}
                        >
                          ${invoice.totalAmount.toLocaleString()}
                        </td>
                        <td style={{ padding: '16px', textAlign: 'center' }}>
                          <span className={getStatusBadge(invoice.status)}>
                            {invoice.status.charAt(0).toUpperCase() +
                              invoice.status.slice(1)}
                          </span>
                        </td>
                        <td style={{ padding: '16px', textAlign: 'center' }}>
                          <span className={getStatusBadge(invoice.agingBucket)}>
                            {invoice.agingBucket === 'current'
                              ? 'Current'
                              : invoice.agingBucket + ' Days'}
                          </span>
                        </td>
                        <td
                          style={{
                            padding: '16px',
                            textAlign: 'right',
                            color: 'white',
                          }}
                        >
                          {invoice.daysOutstanding}
                        </td>
                        <td style={{ padding: '16px', color: 'white' }}>
                          {new Date(invoice.dueDate).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Shipper Analytics Tab */}
        {selectedTab === 'analytics' && (
          <div>
            <h2
              style={{
                fontSize: '28px',
                fontWeight: 'bold',
                marginBottom: '24px',
                color: 'white',
              }}
            >
              📈 Shipper Financial Analytics
            </h2>

            {/* Shipper Summary Cards */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                gap: '24px',
              }}
            >
              {shipperSummaries?.map((shipper) => (
                <div
                  key={shipper.shipperId}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '16px',
                    padding: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'start',
                      marginBottom: '16px',
                    }}
                  >
                    <div>
                      <h3
                        style={{
                          fontSize: '20px',
                          fontWeight: 'bold',
                          color: 'white',
                          margin: '0 0 4px 0',
                        }}
                      >
                        {shipper.shipperName}
                      </h3>
                      <div
                        style={{
                          fontSize: '14px',
                          opacity: 0.7,
                          color: 'white',
                        }}
                      >
                        {shipper.paymentTerms} • Credit: {shipper.creditRating}
                      </div>
                    </div>
                    <span className={getRiskScoreBadge(shipper.riskScore)}>
                      {shipper.riskScore} Risk
                    </span>
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '16px',
                      marginBottom: '16px',
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: '12px',
                          opacity: 0.7,
                          marginBottom: '4px',
                          color: 'white',
                        }}
                      >
                        Total Revenue
                      </div>
                      <div
                        style={{
                          fontSize: '20px',
                          fontWeight: 'bold',
                          color: '#22c55e',
                        }}
                      >
                        ${shipper.totalRevenue.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: '12px',
                          opacity: 0.7,
                          marginBottom: '4px',
                          color: 'white',
                        }}
                      >
                        Outstanding
                      </div>
                      <div
                        style={{
                          fontSize: '20px',
                          fontWeight: 'bold',
                          color: '#f59e0b',
                        }}
                      >
                        ${shipper.outstandingBalance.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: '12px',
                          opacity: 0.7,
                          marginBottom: '4px',
                          color: 'white',
                        }}
                      >
                        Avg Invoice
                      </div>
                      <div
                        style={{
                          fontSize: '16px',
                          fontWeight: '600',
                          color: 'white',
                        }}
                      >
                        ${shipper.averageInvoiceAmount.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: '12px',
                          opacity: 0.7,
                          marginBottom: '4px',
                          color: 'white',
                        }}
                      >
                        Avg Payment Days
                      </div>
                      <div
                        style={{
                          fontSize: '16px',
                          fontWeight: '600',
                          color: 'white',
                        }}
                      >
                        {shipper.averagePaymentDays.toFixed(0)} days
                      </div>
                    </div>
                  </div>

                  {shipper.overdueAmount > 0 && (
                    <div
                      style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        borderRadius: '8px',
                        padding: '12px',
                        marginTop: '12px',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '12px',
                          opacity: 0.8,
                          marginBottom: '4px',
                          color: '#ef4444',
                        }}
                      >
                        ⚠️ Overdue Amount
                      </div>
                      <div
                        style={{
                          fontSize: '18px',
                          fontWeight: 'bold',
                          color: '#ef4444',
                        }}
                      >
                        ${shipper.overdueAmount.toLocaleString()}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Other tabs would be implemented similarly with proper enterprise features */}
        {selectedTab === 'expenses' && (
          <div>
            <h2
              style={{
                fontSize: '28px',
                fontWeight: 'bold',
                marginBottom: '24px',
                color: 'white',
              }}
            >
              💸 Expense Management
            </h2>
            <p style={{ color: 'white', opacity: 0.8 }}>
              Enterprise expense tracking and approval workflows coming soon...
            </p>
          </div>
        )}

        {selectedTab === 'payroll' && (
          <div>
            <h2
              style={{
                fontSize: '28px',
                fontWeight: 'bold',
                marginBottom: '24px',
                color: 'white',
              }}
            >
              👥 Payroll Management
            </h2>
            <p style={{ color: 'white', opacity: 0.8 }}>
              Comprehensive payroll processing with driver settlements coming
              soon...
            </p>
          </div>
        )}

        {selectedTab === 'factoring' && (
          <div>
            <h2
              style={{
                fontSize: '28px',
                fontWeight: 'bold',
                marginBottom: '24px',
                color: 'white',
              }}
            >
              💰 Factoring Management
            </h2>
            <p style={{ color: 'white', opacity: 0.8 }}>
              Integrated factoring with Bill.com processing coming soon...
            </p>
          </div>
        )}

        {selectedTab === 'dispatcher-invoices' && (
          <div>
            <h2
              style={{
                fontSize: '28px',
                fontWeight: 'bold',
                marginBottom: '24px',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              🚛 Dispatcher Fee Management
            </h2>

            {/* Management Settings Toggle */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '16px',
                padding: '24px',
                marginBottom: '24px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '16px',
                }}
              >
                <h3
                  style={{
                    fontSize: '20px',
                    fontWeight: 'bold',
                    color: 'white',
                    margin: 0,
                  }}
                >
                  ⚙️ Management Settings
                </h3>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '20px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: 'white',
                      marginBottom: '8px',
                    }}
                  >
                    🔒 Require Management Approval for Dispatcher Fees
                  </div>
                  <div
                    style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.7)',
                      lineHeight: '1.5',
                    }}
                  >
                    When enabled, all dispatcher fee submissions require
                    management approval before being sent to carriers.
                    <br />
                    When disabled, dispatcher fees are automatically approved
                    and processed immediately.
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                >
                  <label
                    style={{
                      position: 'relative',
                      display: 'inline-block',
                      width: '60px',
                      height: '34px',
                    }}
                  >
                    <input
                      type='checkbox'
                      checked={JSON.parse(
                        localStorage.getItem('requireManagementApproval') ||
                          'true'
                      )}
                      onChange={(e) => {
                        localStorage.setItem(
                          'requireManagementApproval',
                          JSON.stringify(e.target.checked)
                        );
                        window.location.reload(); // Refresh to update UI
                      }}
                      style={{
                        opacity: 0,
                        width: 0,
                        height: 0,
                      }}
                    />
                    <span
                      style={{
                        position: 'absolute',
                        cursor: 'pointer',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: JSON.parse(
                          localStorage.getItem('requireManagementApproval') ||
                            'true'
                        )
                          ? '#22c55e'
                          : '#6b7280',
                        transition: '0.4s',
                        borderRadius: '34px',
                      }}
                    >
                      <span
                        style={{
                          position: 'absolute',
                          content: '',
                          height: '26px',
                          width: '26px',
                          left: JSON.parse(
                            localStorage.getItem('requireManagementApproval') ||
                              'true'
                          )
                            ? '30px'
                            : '4px',
                          bottom: '4px',
                          backgroundColor: 'white',
                          transition: '0.4s',
                          borderRadius: '50%',
                        }}
                      />
                    </span>
                  </label>

                  <div
                    style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: JSON.parse(
                        localStorage.getItem('requireManagementApproval') ||
                          'true'
                      )
                        ? '#22c55e'
                        : '#f59e0b',
                      minWidth: '80px',
                    }}
                  >
                    {JSON.parse(
                      localStorage.getItem('requireManagementApproval') ||
                        'true'
                    )
                      ? '🔒 ENABLED'
                      : '🔓 DISABLED'}
                  </div>
                </div>
              </div>

              {!JSON.parse(
                localStorage.getItem('requireManagementApproval') || 'true'
              ) && (
                <div
                  style={{
                    marginTop: '16px',
                    padding: '16px',
                    background: 'rgba(251, 191, 36, 0.1)',
                    border: '2px solid #fbbf24',
                    borderRadius: '12px',
                    color: '#fbbf24',
                    fontSize: '14px',
                    fontWeight: '600',
                    textAlign: 'center',
                  }}
                >
                  ⚠️ <strong>AUTO-APPROVAL ENABLED:</strong> Dispatcher fees
                  will be automatically approved and sent to carriers without
                  management review.
                </div>
              )}
            </div>

            {/* Conditional Rendering Based on Setting */}
            {JSON.parse(
              localStorage.getItem('requireManagementApproval') || 'true'
            ) ? (
              <>
                {/* Management Controls */}
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '16px',
                    padding: '24px',
                    marginBottom: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '16px',
                    }}
                  >
                    <h3
                      style={{
                        fontSize: '20px',
                        fontWeight: 'bold',
                        color: 'white',
                        margin: 0,
                      }}
                    >
                      📋 Pending Management Review
                    </h3>
                    <div
                      style={{
                        background: 'rgba(251, 191, 36, 0.2)',
                        border: '1px solid #fbbf24',
                        borderRadius: '12px',
                        padding: '8px 16px',
                        color: '#fbbf24',
                        fontSize: '14px',
                        fontWeight: '600',
                      }}
                    >
                      ⏳{' '}
                      {
                        JSON.parse(
                          localStorage.getItem('invoices') || '[]'
                        ).filter(
                          (inv: any) =>
                            inv.status === 'pending_management_review'
                        ).length
                      }{' '}
                      Awaiting Review
                    </div>
                  </div>

                  <p
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '14px',
                      margin: '0 0 20px 0',
                      lineHeight: '1.5',
                    }}
                  >
                    Review and approve dispatcher fee submissions. All
                    dispatcher fees require management approval before being
                    sent to carriers for payment.
                  </p>

                  {/* Auto-Approved Invoices Table */}
                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.02)',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      maxHeight: '500px',
                      overflowY: 'auto',
                    }}
                  >
                    {/* Table Header */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns:
                          '120px 140px 120px 140px 120px 160px 120px',
                        gap: '12px',
                        padding: '16px',
                        background: 'rgba(34, 197, 94, 0.1)',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                        fontSize: '12px',
                        fontWeight: '600',
                        color: '#22c55e',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      <div>Load ID</div>
                      <div>Dispatcher</div>
                      <div>Load Amount</div>
                      <div>Dispatcher Fee</div>
                      <div>Fee %</div>
                      <div>Auto-Approved</div>
                      <div>Status</div>
                    </div>

                    {/* Table Body */}
                    {getCleanedInvoices()
                      .filter(
                        (invoice: any) =>
                          invoice.status === 'auto_approved' ||
                          invoice.status === 'approved'
                      )
                      .map((invoice: any, index: number) => (
                        <div
                          key={ensureUniqueKey(invoice, index)}
                          style={{
                            display: 'grid',
                            gridTemplateColumns:
                              '120px 140px 120px 140px 120px 160px 120px',
                            gap: '12px',
                            padding: '12px 16px',
                            borderBottom:
                              index <
                              JSON.parse(
                                localStorage.getItem('invoices') || '[]'
                              ).filter(
                                (inv: any) =>
                                  inv.status === 'auto_approved' ||
                                  inv.status === 'approved'
                              ).length -
                                1
                                ? '1px solid rgba(255, 255, 255, 0.05)'
                                : 'none',
                            color: 'white',
                            fontSize: '13px',
                            alignItems: 'center',
                          }}
                        >
                          <div style={{ fontWeight: '600' }}>
                            {invoice.loadId}
                          </div>
                          <div>{invoice.dispatcherName || 'N/A'}</div>
                          <div style={{ fontWeight: '600', color: '#60a5fa' }}>
                            ${invoice.loadAmount?.toLocaleString() || '0'}
                          </div>
                          <div style={{ fontWeight: '700', color: '#22c55e' }}>
                            ${invoice.dispatchFee?.toFixed(2) || '0.00'}
                          </div>
                          <div style={{ color: '#fbbf24' }}>
                            {invoice.feePercentage || 10}%
                          </div>
                          <div
                            style={{
                              fontSize: '12px',
                              color: 'rgba(255, 255, 255, 0.7)',
                            }}
                          >
                            {new Date(
                              invoice.approvedAt ||
                                invoice.invoiceDate ||
                                Date.now()
                            ).toLocaleDateString()}
                          </div>
                          <div
                            style={{
                              background: 'rgba(34, 197, 94, 0.2)',
                              border: '1px solid #22c55e',
                              borderRadius: '8px',
                              padding: '4px 8px',
                              color: '#22c55e',
                              fontSize: '11px',
                              fontWeight: '600',
                              textAlign: 'center',
                            }}
                          >
                            ⚡ AUTO
                          </div>
                        </div>
                      ))}

                    {JSON.parse(
                      localStorage.getItem('invoices') || '[]'
                    ).filter(
                      (inv: any) =>
                        inv.status === 'auto_approved' ||
                        inv.status === 'approved'
                    ).length === 0 && (
                      <div
                        style={{
                          padding: '40px',
                          textAlign: 'center',
                          color: 'rgba(255, 255, 255, 0.6)',
                        }}
                      >
                        ⚡ No auto-approved dispatcher fees yet
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Auto-Approved Invoices Section */}
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '16px',
                    padding: '24px',
                    marginBottom: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '16px',
                    }}
                  >
                    <h3
                      style={{
                        fontSize: '20px',
                        fontWeight: 'bold',
                        color: 'white',
                        margin: 0,
                      }}
                    >
                      🔓 Auto-Approved Dispatcher Fees
                    </h3>
                    <div
                      style={{
                        background: 'rgba(34, 197, 94, 0.2)',
                        border: '1px solid #22c55e',
                        borderRadius: '12px',
                        padding: '8px 16px',
                        color: '#22c55e',
                        fontSize: '14px',
                        fontWeight: '600',
                      }}
                    >
                      ⚡{' '}
                      {getInvoiceCountByStatus('auto_approved') +
                        getInvoiceCountByStatus('approved')}{' '}
                      Auto-Processed
                    </div>
                  </div>

                  <p
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '14px',
                      margin: '0 0 20px 0',
                      lineHeight: '1.5',
                    }}
                  >
                    All dispatcher fees are automatically approved and sent to
                    carriers immediately. Management oversight is currently
                    disabled.
                  </p>

                  {/* Dispatcher Fee Invoices Table */}
                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.02)',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    {/* Table Header */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns:
                          '150px 120px 140px 120px 140px 120px 200px 150px',
                        gap: '12px',
                        padding: '16px',
                        background: 'rgba(59, 130, 246, 0.1)',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                        fontSize: '12px',
                        fontWeight: '600',
                        color: '#60a5fa',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      <div>Submission ID</div>
                      <div>Load ID</div>
                      <div>Dispatcher</div>
                      <div>Load Amount</div>
                      <div>Dispatcher Fee</div>
                      <div>Fee %</div>
                      <div>Submitted</div>
                      <div>Actions</div>
                    </div>

                    {/* Table Body */}
                    {getCleanedInvoices()
                      .filter(
                        (invoice: any) =>
                          invoice.status === 'pending_management_review'
                      )
                      .map((invoice: any, index: number) => (
                        <div
                          key={ensureUniqueKey(invoice, index)}
                          style={{
                            display: 'grid',
                            gridTemplateColumns:
                              '150px 120px 140px 120px 140px 120px 200px 150px',
                            gap: '12px',
                            padding: '16px',
                            borderBottom:
                              index <
                              JSON.parse(
                                localStorage.getItem('invoices') || '[]'
                              ).filter(
                                (inv: any) =>
                                  inv.status === 'pending_management_review'
                              ).length -
                                1
                                ? '1px solid rgba(255, 255, 255, 0.05)'
                                : 'none',
                            color: 'white',
                            fontSize: '14px',
                            alignItems: 'center',
                          }}
                        >
                          <div
                            style={{
                              fontFamily: 'monospace',
                              fontSize: '12px',
                              color: '#22c55e',
                              fontWeight: '600',
                            }}
                          >
                            {invoice.managementSubmissionId || 'N/A'}
                          </div>
                          <div style={{ fontWeight: '600' }}>
                            {invoice.loadId}
                          </div>
                          <div>{invoice.dispatcherName || 'N/A'}</div>
                          <div style={{ fontWeight: '600', color: '#60a5fa' }}>
                            ${invoice.loadAmount?.toLocaleString() || '0'}
                          </div>
                          <div style={{ fontWeight: '700', color: '#22c55e' }}>
                            ${invoice.dispatchFee?.toFixed(2) || '0.00'}
                          </div>
                          <div style={{ color: '#fbbf24' }}>
                            {invoice.feePercentage || 10}%
                          </div>
                          <div
                            style={{
                              fontSize: '12px',
                              color: 'rgba(255, 255, 255, 0.7)',
                            }}
                          >
                            {new Date(
                              invoice.invoiceDate || Date.now()
                            ).toLocaleDateString()}{' '}
                            {new Date(
                              invoice.invoiceDate || Date.now()
                            ).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              onClick={() => {
                                // Approve invoice
                                const invoices = JSON.parse(
                                  localStorage.getItem('invoices') || '[]'
                                );
                                const updatedInvoices = invoices.map(
                                  (inv: any) =>
                                    inv.id === invoice.id
                                      ? {
                                          ...inv,
                                          status: 'approved',
                                          approvedAt: new Date().toISOString(),
                                          approvedBy: 'Management',
                                        }
                                      : inv
                                );
                                localStorage.setItem(
                                  'invoices',
                                  JSON.stringify(updatedInvoices)
                                );
                                window.location.reload(); // Refresh to show changes
                              }}
                              style={{
                                background:
                                  'linear-gradient(135deg, #22c55e, #16a34a)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                padding: '6px 12px',
                                fontSize: '12px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.transform =
                                  'translateY(-1px)';
                                e.currentTarget.style.boxShadow =
                                  '0 4px 8px rgba(34, 197, 94, 0.3)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.transform =
                                  'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                              }}
                            >
                              ✅ Approve
                            </button>
                            <button
                              onClick={() => {
                                // Reject invoice
                                const reason = prompt(
                                  'Enter rejection reason:'
                                );
                                if (reason) {
                                  const invoices = JSON.parse(
                                    localStorage.getItem('invoices') || '[]'
                                  );
                                  const updatedInvoices = invoices.map(
                                    (inv: any) =>
                                      inv.id === invoice.id
                                        ? {
                                            ...inv,
                                            status: 'rejected',
                                            rejectedAt:
                                              new Date().toISOString(),
                                            rejectedBy: 'Management',
                                            rejectionReason: reason,
                                          }
                                        : inv
                                  );
                                  localStorage.setItem(
                                    'invoices',
                                    JSON.stringify(updatedInvoices)
                                  );
                                  window.location.reload(); // Refresh to show changes
                                }
                              }}
                              style={{
                                background:
                                  'linear-gradient(135deg, #ef4444, #dc2626)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                padding: '6px 12px',
                                fontSize: '12px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.transform =
                                  'translateY(-1px)';
                                e.currentTarget.style.boxShadow =
                                  '0 4px 8px rgba(239, 68, 68, 0.3)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.transform =
                                  'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                              }}
                            >
                              ❌ Reject
                            </button>
                          </div>
                        </div>
                      ))}

                    {JSON.parse(
                      localStorage.getItem('invoices') || '[]'
                    ).filter(
                      (inv: any) => inv.status === 'pending_management_review'
                    ).length === 0 && (
                      <div
                        style={{
                          padding: '40px',
                          textAlign: 'center',
                          color: 'rgba(255, 255, 255, 0.6)',
                        }}
                      >
                        📋 No dispatcher fee submissions pending review
                      </div>
                    )}
                  </div>
                </div>

                {/* Approved Invoices Section */}
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '16px',
                    padding: '24px',
                    marginBottom: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <h3
                    style={{
                      fontSize: '20px',
                      fontWeight: 'bold',
                      color: 'white',
                      margin: '0 0 16px 0',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    ✅ Approved Dispatcher Fees
                    <span
                      style={{
                        background: 'rgba(34, 197, 94, 0.2)',
                        border: '1px solid #22c55e',
                        borderRadius: '12px',
                        padding: '4px 12px',
                        color: '#22c55e',
                        fontSize: '12px',
                        fontWeight: '600',
                      }}
                    >
                      {
                        JSON.parse(
                          localStorage.getItem('invoices') || '[]'
                        ).filter((inv: any) => inv.status === 'approved').length
                      }{' '}
                      Approved
                    </span>
                  </h3>

                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.02)',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      maxHeight: '400px',
                      overflowY: 'auto',
                    }}
                  >
                    {getCleanedInvoices()
                      .filter((invoice: any) => invoice.status === 'approved')
                      .map((invoice: any, index: number) => (
                        <div
                          key={ensureUniqueKey(invoice, index)}
                          style={{
                            display: 'grid',
                            gridTemplateColumns:
                              '120px 120px 140px 120px 140px 160px 120px',
                            gap: '12px',
                            padding: '12px 16px',
                            borderBottom:
                              index <
                              JSON.parse(
                                localStorage.getItem('invoices') || '[]'
                              ).filter((inv: any) => inv.status === 'approved')
                                .length -
                                1
                                ? '1px solid rgba(255, 255, 255, 0.05)'
                                : 'none',
                            color: 'white',
                            fontSize: '13px',
                            alignItems: 'center',
                          }}
                        >
                          <div style={{ fontWeight: '600' }}>
                            {invoice.loadId}
                          </div>
                          <div>{invoice.dispatcherName || 'N/A'}</div>
                          <div style={{ fontWeight: '600', color: '#60a5fa' }}>
                            ${invoice.loadAmount?.toLocaleString() || '0'}
                          </div>
                          <div style={{ fontWeight: '700', color: '#22c55e' }}>
                            ${invoice.dispatchFee?.toFixed(2) || '0.00'}
                          </div>
                          <div style={{ color: '#fbbf24' }}>
                            {invoice.feePercentage || 10}%
                          </div>
                          <div
                            style={{
                              fontSize: '12px',
                              color: 'rgba(255, 255, 255, 0.7)',
                            }}
                          >
                            {new Date(
                              invoice.approvedAt || Date.now()
                            ).toLocaleDateString()}
                          </div>
                          <div
                            style={{
                              background: 'rgba(34, 197, 94, 0.2)',
                              border: '1px solid #22c55e',
                              borderRadius: '8px',
                              padding: '4px 8px',
                              color: '#22c55e',
                              fontSize: '11px',
                              fontWeight: '600',
                              textAlign: 'center',
                            }}
                          >
                            ✅ APPROVED
                          </div>
                        </div>
                      ))}

                    {JSON.parse(
                      localStorage.getItem('invoices') || '[]'
                    ).filter((inv: any) => inv.status === 'approved').length ===
                      0 && (
                      <div
                        style={{
                          padding: '30px',
                          textAlign: 'center',
                          color: 'rgba(255, 255, 255, 0.6)',
                        }}
                      >
                        ✅ No approved dispatcher fees yet
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {selectedTab === 'contracts' && (
          <div>
            <h2
              style={{
                fontSize: '28px',
                fontWeight: 'bold',
                marginBottom: '24px',
                color: 'white',
              }}
            >
              📋 Contract Management
            </h2>
            <p style={{ color: 'white', opacity: 0.8 }}>
              Shipper contracts and rate agreements coming soon...
            </p>
          </div>
        )}

        {selectedTab === 'reports' && (
          <div>
            <h2
              style={{
                fontSize: '28px',
                fontWeight: 'bold',
                marginBottom: '24px',
                color: 'white',
              }}
            >
              📊 Financial Reports
            </h2>
            <p style={{ color: 'white', opacity: 0.8 }}>
              Advanced financial reporting and analytics coming soon...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
