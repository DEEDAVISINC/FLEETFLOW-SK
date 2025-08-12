'use client';

import { useEffect, useState } from 'react';

export default function SimpleCRMDashboard() {
  console.log('🚀 SimpleCRMDashboard LOADED - BASIC HTML/CSS APPROACH');
  const [leads, setLeads] = useState([
    {
      id: 'SL-001',
      companyName: 'Midwest Manufacturing Corp',
      serviceCategory: 'Logistics',
      priority: 'hot',
      estimatedValue: 480000,
      status: 'proposal_sent',
      urgency: 'high',
    },
    {
      id: 'SL-002',
      companyName: 'Pacific Coast Imports LLC',
      serviceCategory: 'Warehousing',
      priority: 'urgent',
      estimatedValue: 360000,
      status: 'demo_scheduled',
      urgency: 'urgent',
    },
    {
      id: 'SL-003',
      companyName: 'Thunder Trucking LLC',
      serviceCategory: 'Dispatching',
      priority: 'high',
      estimatedValue: 72000,
      status: 'qualified',
      urgency: 'medium',
    },
    {
      id: 'SL-004',
      companyName: 'Urban Retail Solutions Inc',
      serviceCategory: 'Freight_Brokerage',
      priority: 'hot',
      estimatedValue: 750000,
      status: 'negotiating',
      urgency: 'high',
    },
    {
      id: 'SL-005',
      companyName: 'Southwest Food Distributors',
      serviceCategory: 'Supply_Chain_Consulting',
      priority: 'high',
      estimatedValue: 180000,
      status: 'contacted',
      urgency: 'medium',
    },
  ]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log(
      '✅ SimpleCRMDashboard: Component mounted with',
      leads.length,
      'leads'
    );
  }, []);

  const totalPipeline = leads.reduce(
    (sum, lead) => sum + lead.estimatedValue,
    0
  );
  const hotLeads = leads.filter((lead) => lead.priority === 'hot').length;
  const avgDealSize = leads.length > 0 ? totalPipeline / leads.length : 0;

  return (
    <div>
      <style jsx>{`
        .crm-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f1f5f9 0%, #dbeafe 100%);
          padding: 24px;
        }

        .crm-wrapper {
          max-width: 1280px;
          margin: 0 auto;
        }

        .crm-header {
          margin-bottom: 32px;
        }

        .crm-title {
          background: linear-gradient(to right, #2563eb, #9333ea);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-size: 36px;
          font-weight: bold;
          margin: 0 0 8px 0;
        }

        .crm-subtitle {
          font-size: 20px;
          color: #4b5563;
          margin: 0;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 16px;
          margin-bottom: 32px;
        }

        .metric-card {
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 24px;
          color: white;
          box-shadow:
            0 20px 25px -5px rgba(0, 0, 0, 0.1),
            0 10px 10px -5px rgba(0, 0, 0, 0.04);
          backdrop-filter: blur(8px);
        }

        .metric-card.blue {
          background: linear-gradient(to right, #3b82f6, #2563eb);
        }

        .metric-card.purple {
          background: linear-gradient(to right, #8b5cf6, #7c3aed);
        }

        .metric-card.orange {
          background: linear-gradient(to right, #f97316, #ea580c);
        }

        .metric-card.green {
          background: linear-gradient(to right, #10b981, #059669);
        }

        .metric-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .metric-text {
          font-size: 14px;
          font-weight: 500;
          margin: 0 0 4px 0;
          opacity: 0.8;
        }

        .metric-value {
          font-size: 24px;
          font-weight: bold;
          margin: 0;
        }

        .metric-icon {
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          padding: 12px;
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
        }

        .leads-section {
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          background: rgba(255, 255, 255, 0.8);
          padding: 24px;
          box-shadow:
            0 20px 25px -5px rgba(0, 0, 0, 0.1),
            0 10px 10px -5px rgba(0, 0, 0, 0.04);
          backdrop-filter: blur(8px);
          margin-bottom: 24px;
        }

        .leads-title {
          font-size: 24px;
          font-weight: bold;
          color: #111827;
          margin: 0 0 24px 0;
        }

        .leads-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .lead-card {
          border-radius: 8px;
          border: 1px solid #e5e7eb;
          background: white;
          padding: 16px;
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
        }

        .lead-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .lead-info {
          flex: 1;
        }

        .lead-company {
          font-size: 18px;
          font-weight: 600;
          color: #111827;
          margin: 0 0 4px 0;
        }

        .lead-category {
          font-size: 14px;
          color: #6b7280;
          margin: 0;
        }

        .lead-details {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .lead-value {
          text-align: right;
        }

        .value-amount {
          font-size: 18px;
          font-weight: bold;
          color: #059669;
          margin: 0 0 2px 0;
        }

        .value-label {
          font-size: 12px;
          color: #6b7280;
          margin: 0;
        }

        .lead-badges {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .badge {
          display: inline-flex;
          border-radius: 9999px;
          padding: 4px 8px;
          font-size: 12px;
          font-weight: 500;
        }

        .badge.hot {
          background: #fee2e2;
          color: #991b1b;
        }

        .badge.urgent {
          background: #fed7aa;
          color: #9a3412;
        }

        .badge.high {
          background: #fef3c7;
          color: #92400e;
        }

        .badge.standard {
          background: #f3f4f6;
          color: #374151;
        }

        .badge.negotiating {
          background: #dbeafe;
          color: #1e40af;
        }

        .badge.proposal_sent {
          background: #e9d5ff;
          color: #7c2d12;
        }

        .badge.demo_scheduled {
          background: #dcfce7;
          color: #166534;
        }

        .badge.status-default {
          background: #f3f4f6;
          color: #374151;
        }

        .ai-recommendations {
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          background: linear-gradient(to right, #6366f1, #8b5cf6);
          padding: 24px;
          color: white;
          box-shadow:
            0 20px 25px -5px rgba(0, 0, 0, 0.1),
            0 10px 10px -5px rgba(0, 0, 0, 0.04);
          backdrop-filter: blur(8px);
        }

        .ai-title {
          font-size: 20px;
          font-weight: bold;
          margin: 0 0 16px 0;
        }

        .ai-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          font-size: 14px;
        }

        .ai-item {
          margin: 0;
        }
      `}</style>

      <div className='crm-container'>
        <div className='crm-wrapper'>
          {/* Header */}
          <div className='crm-header'>
            <h1 className='crm-title'>CRM Lead Intelligence Dashboard</h1>
            <p className='crm-subtitle'>
              AI-Powered Service Lead Management & Pipeline Analytics
            </p>
          </div>

          {/* Metrics Cards */}
          <div className='metrics-grid'>
            <div className='metric-card blue'>
              <div className='metric-content'>
                <div>
                  <p className='metric-text'>Total Pipeline</p>
                  <p className='metric-value'>
                    ${(totalPipeline / 1000000).toFixed(1)}M
                  </p>
                </div>
                <div className='metric-icon'>💰</div>
              </div>
            </div>

            <div className='metric-card purple'>
              <div className='metric-content'>
                <div>
                  <p className='metric-text'>Active Leads</p>
                  <p className='metric-value'>{leads.length}</p>
                </div>
                <div className='metric-icon'>👥</div>
              </div>
            </div>

            <div className='metric-card orange'>
              <div className='metric-content'>
                <div>
                  <p className='metric-text'>Hot Leads</p>
                  <p className='metric-value'>{hotLeads}</p>
                </div>
                <div className='metric-icon'>🔥</div>
              </div>
            </div>

            <div className='metric-card green'>
              <div className='metric-content'>
                <div>
                  <p className='metric-text'>Avg Deal Size</p>
                  <p className='metric-value'>
                    ${(avgDealSize / 1000).toFixed(0)}K
                  </p>
                </div>
                <div className='metric-icon'>📊</div>
              </div>
            </div>
          </div>

          {/* Leads List */}
          <div className='leads-section'>
            <h2 className='leads-title'>Service Leads Pipeline</h2>

            <div className='leads-list'>
              {leads.map((lead) => (
                <div key={lead.id} className='lead-card'>
                  <div className='lead-content'>
                    <div className='lead-info'>
                      <h3 className='lead-company'>{lead.companyName}</h3>
                      <p className='lead-category'>{lead.serviceCategory}</p>
                    </div>

                    <div className='lead-details'>
                      <div className='lead-value'>
                        <p className='value-amount'>
                          ${(lead.estimatedValue / 1000).toFixed(0)}K
                        </p>
                        <p className='value-label'>Estimated Value</p>
                      </div>

                      <div className='lead-badges'>
                        <span
                          className={`badge ${lead.priority || 'standard'}`}
                        >
                          {(lead.priority || 'standard').toUpperCase()}
                        </span>

                        <span
                          className={`badge ${lead.status || 'status-default'}`}
                        >
                          {(lead.status || 'unknown')
                            .replace('_', ' ')
                            .toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Recommendations */}
          <div className='ai-recommendations'>
            <h3 className='ai-title'>🤖 AI Recommendations</h3>
            <div className='ai-list'>
              <p className='ai-item'>
                • Focus on closing Urban Retail Solutions ($750K) - 90% win
                probability
              </p>
              <p className='ai-item'>
                • Schedule follow-up with Midwest Manufacturing - proposal
                expires Dec 31st
              </p>
              <p className='ai-item'>
                • Prioritize Pacific Coast Imports demo - decision timeline is
                30 days
              </p>
              <p className='ai-item'>
                • Total pipeline value: ${(totalPipeline / 1000000).toFixed(1)}M
                across {leads.length} active opportunities
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
