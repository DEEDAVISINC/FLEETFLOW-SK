'use client';

import { useEffect, useState } from 'react';
import {
  AnalyticsData,
  PerformanceReport,
  reportsAnalyticsService,
} from '../services/ReportsAnalyticsService';

interface ReportsPanelProps {
  clientId: string;
  userRole?: string;
}

export default function ReportsPanel({
  clientId,
  userRole,
}: ReportsPanelProps) {
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState<PerformanceReport | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setMonth(new Date().getMonth() - 6)),
    end: new Date(),
  });

  useEffect(() => {
    loadReports();
  }, [clientId, dateRange]);

  const loadReports = async () => {
    try {
      setLoading(true);
      const [reportData, analyticsData] = await Promise.all([
        reportsAnalyticsService.getClientPerformanceReport(
          clientId,
          dateRange.start,
          dateRange.end
        ),
        reportsAnalyticsService.getClientAnalytics(
          clientId,
          dateRange.start,
          dateRange.end
        ),
      ]);
      setReport(reportData);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Error loading reports:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '60px 20px',
          color: 'rgba(255,255,255,0.6)',
        }}
      >
        Loading reports...
      </div>
    );
  }

  if (!report || !analytics) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '60px 20px',
          color: 'rgba(255,255,255,0.6)',
        }}
      >
        No report data available
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gap: '32px' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <h2
            style={{
              fontSize: '24px',
              fontWeight: '700',
              margin: '0 0 8px 0',
              color: '#06b6d4',
            }}
          >
            📊 Reports & Analytics
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', margin: '0' }}>
            Performance insights and analytics for {report.clientName}
          </p>
        </div>
        <button
          onClick={() => reportsAnalyticsService.exportReportToCSV(report)}
          style={{
            padding: '10px 20px',
            background: 'rgba(16, 185, 129, 0.2)',
            border: '1px solid #10b981',
            borderRadius: '8px',
            color: '#10b981',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          📊 Export Report
        </button>
      </div>

      {/* Shipment Metrics */}
      <div>
        <h3
          style={{
            fontSize: '18px',
            fontWeight: '600',
            margin: '0 0 16px 0',
            color: 'rgba(255,255,255,0.9)',
          }}
        >
          Shipment Performance
        </h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
          }}
        >
          <div
            style={{
              padding: '20px',
              background: 'rgba(6, 182, 212, 0.1)',
              border: '1px solid rgba(6, 182, 212, 0.3)',
              borderRadius: '12px',
            }}
          >
            <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)' }}>
              Total Shipments
            </div>
            <div
              style={{
                fontSize: '32px',
                fontWeight: '700',
                color: '#06b6d4',
                margin: '8px 0',
              }}
            >
              {report.shipments.totalShipments}
            </div>
          </div>

          <div
            style={{
              padding: '20px',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '12px',
            }}
          >
            <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)' }}>
              On-Time Delivery
            </div>
            <div
              style={{
                fontSize: '32px',
                fontWeight: '700',
                color: '#10b981',
                margin: '8px 0',
              }}
            >
              {report.shipments.onTimeDeliveryRate}%
            </div>
          </div>

          <div
            style={{
              padding: '20px',
              background: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              borderRadius: '12px',
            }}
          >
            <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)' }}>
              Avg Transit Time
            </div>
            <div
              style={{
                fontSize: '32px',
                fontWeight: '700',
                color: '#f59e0b',
                margin: '8px 0',
              }}
            >
              {report.shipments.averageTransitTime}
              <span style={{ fontSize: '14px', marginLeft: '4px' }}>days</span>
            </div>
          </div>

          <div
            style={{
              padding: '20px',
              background: 'rgba(139, 92, 246, 0.1)',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              borderRadius: '12px',
            }}
          >
            <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)' }}>
              Total Value
            </div>
            <div
              style={{
                fontSize: '28px',
                fontWeight: '700',
                color: '#8b5cf6',
                margin: '8px 0',
              }}
            >
              {report.shipments.currency}{' '}
              {report.shipments.totalValue.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Shipments by Status */}
      <div>
        <h3
          style={{
            fontSize: '18px',
            fontWeight: '600',
            margin: '0 0 16px 0',
            color: 'rgba(255,255,255,0.9)',
          }}
        >
          Shipments by Status
        </h3>
        <div style={{ display: 'grid', gap: '12px' }}>
          {analytics.shipmentsByStatus.map((status) => (
            <div
              key={status.status}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '16px',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    marginBottom: '8px',
                  }}
                >
                  {status.status}
                </div>
                <div
                  style={{
                    height: '8px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '4px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${status.percentage}%`,
                      background: '#06b6d4',
                      borderRadius: '4px',
                    }}
                  />
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div
                  style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: '#06b6d4',
                  }}
                >
                  {status.count}
                </div>
                <div
                  style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}
                >
                  {status.percentage}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Routes */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
        }}
      >
        <div>
          <h3
            style={{
              fontSize: '18px',
              fontWeight: '600',
              margin: '0 0 16px 0',
              color: 'rgba(255,255,255,0.9)',
            }}
          >
            Top Origins
          </h3>
          <div style={{ display: 'grid', gap: '8px' }}>
            {analytics.topOrigins.map((origin, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '12px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '8px',
                }}
              >
                <div style={{ fontSize: '14px' }}>{origin.location}</div>
                <div
                  style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#06b6d4',
                  }}
                >
                  {origin.count}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3
            style={{
              fontSize: '18px',
              fontWeight: '600',
              margin: '0 0 16px 0',
              color: 'rgba(255,255,255,0.9)',
            }}
          >
            Top Destinations
          </h3>
          <div style={{ display: 'grid', gap: '8px' }}>
            {analytics.topDestinations.map((dest, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '12px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '8px',
                }}
              >
                <div style={{ fontSize: '14px' }}>{dest.location}</div>
                <div
                  style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#10b981',
                  }}
                >
                  {dest.count}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Document Stats */}
      <div>
        <h3
          style={{
            fontSize: '18px',
            fontWeight: '600',
            margin: '0 0 16px 0',
            color: 'rgba(255,255,255,0.9)',
          }}
        >
          Document Management
        </h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '16px',
          }}
        >
          <div
            style={{
              padding: '16px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              textAlign: 'center',
            }}
          >
            <div
              style={{ fontSize: '24px', fontWeight: '700', color: '#06b6d4' }}
            >
              {report.documents.totalDocuments}
            </div>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>
              Total Documents
            </div>
          </div>

          <div
            style={{
              padding: '16px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              textAlign: 'center',
            }}
          >
            <div
              style={{ fontSize: '24px', fontWeight: '700', color: '#f59e0b' }}
            >
              {report.documents.pendingDocuments}
            </div>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>
              Pending
            </div>
          </div>

          <div
            style={{
              padding: '16px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              textAlign: 'center',
            }}
          >
            <div
              style={{ fontSize: '24px', fontWeight: '700', color: '#10b981' }}
            >
              {report.documents.approvedDocuments}
            </div>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>
              Approved
            </div>
          </div>

          <div
            style={{
              padding: '16px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              textAlign: 'center',
            }}
          >
            <div
              style={{ fontSize: '24px', fontWeight: '700', color: '#8b5cf6' }}
            >
              {report.documents.averageApprovalTime}h
            </div>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>
              Avg Approval
            </div>
          </div>
        </div>
      </div>

      {/* Cost Breakdown */}
      <div>
        <h3
          style={{
            fontSize: '18px',
            fontWeight: '600',
            margin: '0 0 16px 0',
            color: 'rgba(255,255,255,0.9)',
          }}
        >
          Cost Breakdown
        </h3>
        <div
          style={{
            padding: '24px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <div style={{ marginBottom: '24px' }}>
            <div
              style={{
                fontSize: '32px',
                fontWeight: '700',
                color: '#06b6d4',
                marginBottom: '4px',
              }}
            >
              {report.costs.currency} {report.costs.totalCosts.toLocaleString()}
            </div>
            <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)' }}>
              Total Costs
            </div>
          </div>

          <div style={{ display: 'grid', gap: '12px' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '12px',
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '8px',
              }}
            >
              <div style={{ fontSize: '14px' }}>Freight Costs</div>
              <div style={{ fontSize: '14px', fontWeight: '600' }}>
                {report.costs.currency}{' '}
                {report.costs.freightCosts.toLocaleString()}
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '12px',
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '8px',
              }}
            >
              <div style={{ fontSize: '14px' }}>Customs Duties</div>
              <div style={{ fontSize: '14px', fontWeight: '600' }}>
                {report.costs.currency}{' '}
                {report.costs.customsDuties.toLocaleString()}
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '12px',
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '8px',
              }}
            >
              <div style={{ fontSize: '14px' }}>Additional Charges</div>
              <div style={{ fontSize: '14px', fontWeight: '600' }}>
                {report.costs.currency}{' '}
                {report.costs.additionalCharges.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
