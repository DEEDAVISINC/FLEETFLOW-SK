/**
 * FLEETFLOW REPORTS & ANALYTICS SERVICE
 * Client-specific and freight forwarder reports
 */

export interface ShipmentReport {
  totalShipments: number;
  activeShipments: number;
  completedShipments: number;
  cancelledShipments: number;
  onTimeDeliveryRate: number;
  averageTransitTime: number; // in days
  totalValue: number;
  currency: string;
}

export interface DocumentReport {
  totalDocuments: number;
  pendingDocuments: number;
  approvedDocuments: number;
  rejectedDocuments: number;
  averageApprovalTime: number; // in hours
  documentsByType: Record<string, number>;
}

export interface PerformanceReport {
  clientId: string;
  clientName: string;
  period: { start: Date; end: Date };
  shipments: ShipmentReport;
  documents: DocumentReport;
  customsClearance: {
    totalClearances: number;
    averageClearanceTime: number; // in days
    delayedClearances: number;
  };
  costs: {
    totalCosts: number;
    freightCosts: number;
    customsDuties: number;
    additionalCharges: number;
    currency: string;
  };
}

export interface AnalyticsData {
  shipmentsByMonth: Array<{ month: string; count: number }>;
  shipmentsByStatus: Array<{
    status: string;
    count: number;
    percentage: number;
  }>;
  topOrigins: Array<{ location: string; count: number }>;
  topDestinations: Array<{ location: string; count: number }>;
  costTrends: Array<{ month: string; cost: number }>;
}

class ReportsAnalyticsService {
  private static instance: ReportsAnalyticsService;

  private constructor() {}

  public static getInstance(): ReportsAnalyticsService {
    if (!ReportsAnalyticsService.instance) {
      ReportsAnalyticsService.instance = new ReportsAnalyticsService();
    }
    return ReportsAnalyticsService.instance;
  }

  /**
   * Get performance report for a specific client
   */
  public async getClientPerformanceReport(
    clientId: string,
    startDate: Date,
    endDate: Date
  ): Promise<PerformanceReport> {
    try {
      // In production: Query database for client-specific data
      // For now: Return mock data
      return {
        clientId,
        clientName: 'ABC Shipping Corporation',
        period: { start: startDate, end: endDate },
        shipments: {
          totalShipments: 45,
          activeShipments: 12,
          completedShipments: 30,
          cancelledShipments: 3,
          onTimeDeliveryRate: 94.2,
          averageTransitTime: 21.5,
          totalValue: 2500000,
          currency: 'USD',
        },
        documents: {
          totalDocuments: 180,
          pendingDocuments: 8,
          approvedDocuments: 165,
          rejectedDocuments: 7,
          averageApprovalTime: 4.2,
          documentsByType: {
            'Commercial Invoice': 45,
            'Packing List': 45,
            'Bill of Lading': 45,
            'Certificate of Origin': 30,
            'Customs Declaration': 15,
          },
        },
        customsClearance: {
          totalClearances: 42,
          averageClearanceTime: 2.8,
          delayedClearances: 5,
        },
        costs: {
          totalCosts: 487500,
          freightCosts: 350000,
          customsDuties: 112500,
          additionalCharges: 25000,
          currency: 'USD',
        },
      };
    } catch (error) {
      console.error('Error getting client performance report:', error);
      throw new Error('Failed to generate performance report');
    }
  }

  /**
   * Get analytics data for a client
   */
  public async getClientAnalytics(
    clientId: string,
    startDate: Date,
    endDate: Date
  ): Promise<AnalyticsData> {
    try {
      // In production: Calculate from database
      return {
        shipmentsByMonth: [
          { month: 'Jan', count: 12 },
          { month: 'Feb', count: 15 },
          { month: 'Mar', count: 18 },
          { month: 'Apr', count: 22 },
          { month: 'May', count: 20 },
          { month: 'Jun', count: 25 },
        ],
        shipmentsByStatus: [
          { status: 'In Transit', count: 12, percentage: 26.7 },
          { status: 'At Port', count: 5, percentage: 11.1 },
          { status: 'Customs Clearance', count: 3, percentage: 6.7 },
          { status: 'Delivered', count: 25, percentage: 55.6 },
        ],
        topOrigins: [
          { location: 'Shanghai, China', count: 20 },
          { location: 'Hong Kong', count: 12 },
          { location: 'Singapore', count: 8 },
          { location: 'Rotterdam, Netherlands', count: 5 },
        ],
        topDestinations: [
          { location: 'Long Beach, USA', count: 18 },
          { location: 'New York, USA', count: 15 },
          { location: 'Houston, USA', count: 8 },
          { location: 'Savannah, USA', count: 4 },
        ],
        costTrends: [
          { month: 'Jan', cost: 65000 },
          { month: 'Feb', cost: 72000 },
          { month: 'Mar', cost: 78000 },
          { month: 'Apr', cost: 85000 },
          { month: 'May', cost: 80000 },
          { month: 'Jun', cost: 92000 },
        ],
      };
    } catch (error) {
      console.error('Error getting client analytics:', error);
      throw new Error('Failed to generate analytics');
    }
  }

  /**
   * Get all clients performance (Freight Forwarder only)
   */
  public async getAllClientsPerformance(
    freightForwarderId: string,
    startDate: Date,
    endDate: Date
  ): Promise<PerformanceReport[]> {
    try {
      // In production: Query all clients for freight forwarder
      // For now: Return mock data for multiple clients
      return [
        await this.getClientPerformanceReport('CLIENT-001', startDate, endDate),
        await this.getClientPerformanceReport('CLIENT-002', startDate, endDate),
        await this.getClientPerformanceReport('CLIENT-003', startDate, endDate),
      ];
    } catch (error) {
      console.error('Error getting all clients performance:', error);
      throw new Error('Failed to generate reports');
    }
  }

  /**
   * Export report to CSV
   */
  public exportReportToCSV(report: PerformanceReport): void {
    const rows = [
      ['Performance Report'],
      ['Client', report.clientName],
      [
        'Period',
        `${report.period.start.toLocaleDateString()} - ${report.period.end.toLocaleDateString()}`,
      ],
      [],
      ['Shipments'],
      ['Total Shipments', report.shipments.totalShipments],
      ['Active Shipments', report.shipments.activeShipments],
      ['Completed Shipments', report.shipments.completedShipments],
      ['On-Time Delivery Rate', `${report.shipments.onTimeDeliveryRate}%`],
      ['Average Transit Time', `${report.shipments.averageTransitTime} days`],
      [
        'Total Value',
        `${report.shipments.currency} ${report.shipments.totalValue.toLocaleString()}`,
      ],
      [],
      ['Documents'],
      ['Total Documents', report.documents.totalDocuments],
      ['Pending Documents', report.documents.pendingDocuments],
      ['Approved Documents', report.documents.approvedDocuments],
      [
        'Average Approval Time',
        `${report.documents.averageApprovalTime} hours`,
      ],
      [],
      ['Customs Clearance'],
      ['Total Clearances', report.customsClearance.totalClearances],
      [
        'Average Clearance Time',
        `${report.customsClearance.averageClearanceTime} days`,
      ],
      ['Delayed Clearances', report.customsClearance.delayedClearances],
      [],
      ['Costs'],
      [
        'Total Costs',
        `${report.costs.currency} ${report.costs.totalCosts.toLocaleString()}`,
      ],
      [
        'Freight Costs',
        `${report.costs.currency} ${report.costs.freightCosts.toLocaleString()}`,
      ],
      [
        'Customs Duties',
        `${report.costs.currency} ${report.costs.customsDuties.toLocaleString()}`,
      ],
      [
        'Additional Charges',
        `${report.costs.currency} ${report.costs.additionalCharges.toLocaleString()}`,
      ],
    ];

    const csvContent = rows.map((row) => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `performance_report_${report.clientId}_${Date.now()}.csv`
    );
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

export const reportsAnalyticsService = ReportsAnalyticsService.getInstance();
export default reportsAnalyticsService;
