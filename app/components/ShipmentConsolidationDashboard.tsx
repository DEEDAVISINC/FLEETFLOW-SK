'use client';

import React, { useState, useEffect } from 'react';
import { shipmentConsolidationService, type ConsolidationOpportunity } from '../services/ShipmentConsolidationService';

interface ConsolidationDashboardProps {
  tenantId?: string;
}

const ShipmentConsolidationDashboard: React.FC<ConsolidationDashboardProps> = ({ tenantId }) => {
  const [opportunities, setOpportunities] = useState<ConsolidationOpportunity[]>([]);
  const [selectedOpportunity, setSelectedOpportunity] = useState<ConsolidationOpportunity | null>(null);
  const [loading, setLoading] = useState(true);
  const [executing, setExecuting] = useState(false);
  const [analytics, setAnalytics] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'opportunities' | 'analytics'>('opportunities');

  useEffect(() => {
    loadConsolidationData();
  }, []);

  const loadConsolidationData = async () => {
    try {
      setLoading(true);

      // Load consolidation opportunities
      const criteria = {
        originPort: 'CNSHA', // Shanghai - can be made configurable
        destinationPort: 'USLAX', // Los Angeles - can be made configurable
        departureWindowDays: 7,
        minShipments: 2,
        maxShipments: 20,
        minWeightUtilization: 70,
        minVolumeUtilization: 70,
      };

      const opps = await shipmentConsolidationService.findConsolidationOpportunities(criteria);
      setOpportunities(opps);

      // Load analytics
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 1);
      const endDate = new Date();

      const analyticsData = await shipmentConsolidationService.getConsolidationAnalytics(startDate, endDate);
      setAnalytics(analyticsData);

    } catch (error) {
      console.error('Error loading consolidation data:', error);
      // In production, show error toast
    } finally {
      setLoading(false);
    }
  };

  const executeConsolidation = async (opportunity: ConsolidationOpportunity) => {
    try {
      setExecuting(true);

      // Execute consolidation with default settings
      const consolidatedShipment = await shipmentConsolidationService.executeConsolidation(
        opportunity.id,
        opportunity.containerType,
        'MSC' // Default carrier
      );

      console.log('Consolidation executed:', consolidatedShipment);

      // Refresh data
      await loadConsolidationData();

      // Close modal
      setSelectedOpportunity(null);

      // In production, show success toast
      alert(`Consolidation executed successfully! Saved $${consolidatedShipment.savingsAmount.toLocaleString()}`);

    } catch (error) {
      console.error('Error executing consolidation:', error);
      alert('Failed to execute consolidation. Please try again.');
    } finally {
      setExecuting(false);
    }
  };

  if (loading) {
    return (
      <div className="consolidation-dashboard">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading consolidation opportunities...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="consolidation-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1>🚛 Shipment Consolidation Center</h1>
          <p className="subtitle">Optimize shipping costs by combining LCL shipments into FCL containers</p>
        </div>

        <div className="header-stats">
          <div className="stat-card">
            <div className="stat-value">{opportunities.length}</div>
            <div className="stat-label">Active Opportunities</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">
              ${opportunities.reduce((sum, opp) => sum + opp.costSavings, 0).toLocaleString()}
            </div>
            <div className="stat-label">Potential Savings</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">
              {analytics ? Math.round(analytics.averageContainerUtilization) : 0}%
            </div>
            <div className="stat-label">Avg Utilization</div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button
          className={`tab-button ${activeTab === 'opportunities' ? 'active' : ''}`}
          onClick={() => setActiveTab('opportunities')}
        >
          📦 Consolidation Opportunities
        </button>
        <button
          className={`tab-button ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          📊 Performance Analytics
        </button>
      </div>

      {/* Opportunities Tab */}
      {activeTab === 'opportunities' && (
        <div className="opportunities-content">
          {opportunities.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📦</div>
              <h3>No Consolidation Opportunities Found</h3>
              <p>We'll automatically identify opportunities as shipments are booked.</p>
            </div>
          ) : (
            <div className="opportunities-grid">
              {opportunities.map((opportunity) => (
                <div key={opportunity.id} className="opportunity-card">
                  <div className="card-header">
                    <div className="route-info">
                      <span className="route">
                        {opportunity.originPort} → {opportunity.destinationPort}
                      </span>
                      <span className="date">
                        {opportunity.etd.toLocaleDateString()}
                      </span>
                    </div>
                    <div className="savings-badge">
                      ${opportunity.costSavings.toLocaleString()} savings
                    </div>
                  </div>

                  <div className="card-content">
                    <div className="shipment-summary">
                      <div className="summary-item">
                        <span className="label">Shipments:</span>
                        <span className="value">{opportunity.shipments.length}</span>
                      </div>
                      <div className="summary-item">
                        <span className="label">Total Weight:</span>
                        <span className="value">{opportunity.totalWeight.toLocaleString()} lbs</span>
                      </div>
                      <div className="summary-item">
                        <span className="label">Container:</span>
                        <span className="value">{opportunity.containerType}</span>
                      </div>
                    </div>

                    <div className="utilization-bars">
                      <div className="utilization-item">
                        <div className="utilization-label">
                          <span>Weight Utilization</span>
                          <span className="percentage">
                            {opportunity.containerUtilization.weight.toFixed(1)}%
                          </span>
                        </div>
                        <div className="progress-bar">
                          <div
                            className="progress-fill"
                            style={{ width: `${opportunity.containerUtilization.weight}%` }}
                          />
                        </div>
                      </div>
                      <div className="utilization-item">
                        <div className="utilization-label">
                          <span>Volume Utilization</span>
                          <span className="percentage">
                            {opportunity.containerUtilization.volume.toFixed(1)}%
                          </span>
                        </div>
                        <div className="progress-bar">
                          <div
                            className="progress-fill"
                            style={{ width: `${opportunity.containerUtilization.volume}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="customer-list">
                      <h4>Included Customers:</h4>
                      <div className="customer-tags">
                        {opportunity.shipments.slice(0, 3).map((shipment, index) => (
                          <span key={index} className="customer-tag">
                            {shipment.customerName}
                          </span>
                        ))}
                        {opportunity.shipments.length > 3 && (
                          <span className="customer-tag more">
                            +{opportunity.shipments.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="card-actions">
                    <button
                      className="view-details-btn"
                      onClick={() => setSelectedOpportunity(opportunity)}
                    >
                      View Details
                    </button>
                    <button
                      className="execute-btn"
                      onClick={() => executeConsolidation(opportunity)}
                      disabled={executing}
                    >
                      {executing ? 'Executing...' : 'Execute Consolidation'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && analytics && (
        <div className="analytics-content">
          <div className="analytics-grid">
            <div className="analytics-card">
              <h3>📈 Consolidation Performance</h3>
              <div className="metrics-grid">
                <div className="metric">
                  <div className="metric-value">{analytics.totalConsolidations}</div>
                  <div className="metric-label">Total Consolidations</div>
                </div>
                <div className="metric">
                  <div className="metric-value">{analytics.totalShipmentsConsolidated}</div>
                  <div className="metric-label">Shipments Consolidated</div>
                </div>
                <div className="metric">
                  <div className="metric-value">${analytics.totalSavings.toLocaleString()}</div>
                  <div className="metric-label">Total Savings</div>
                </div>
                <div className="metric">
                  <div className="metric-value">{analytics.averageContainerUtilization}%</div>
                  <div className="metric-label">Avg Utilization</div>
                </div>
              </div>
            </div>

            <div className="analytics-card">
              <h3>🛣️ Top Consolidation Routes</h3>
              <div className="routes-list">
                {analytics.topRoutes.map((route: any, index: number) => (
                  <div key={index} className="route-item">
                    <div className="route-info">
                      <span className="route-name">{route.route}</span>
                      <span className="route-stats">
                        {route.consolidations} consolidations
                      </span>
                    </div>
                    <div className="route-savings">
                      ${route.savings.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Consolidation Details Modal */}
      {selectedOpportunity && (
        <div className="modal-overlay" onClick={() => setSelectedOpportunity(null)}>
          <div className="consolidation-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>📦 Consolidation Opportunity Details</h2>
              <button
                className="close-btn"
                onClick={() => setSelectedOpportunity(null)}
              >
                ×
              </button>
            </div>

            <div className="modal-content">
              <div className="opportunity-summary">
                <div className="summary-grid">
                  <div className="summary-item">
                    <span className="label">Route:</span>
                    <span className="value">
                      {selectedOpportunity.originPort} → {selectedOpportunity.destinationPort}
                    </span>
                  </div>
                  <div className="summary-item">
                    <span className="label">Departure:</span>
                    <span className="value">
                      {selectedOpportunity.etd.toLocaleDateString()}
                    </span>
                  </div>
                  <div className="summary-item">
                    <span className="label">Shipments:</span>
                    <span className="value">{selectedOpportunity.shipments.length}</span>
                  </div>
                  <div className="summary-item">
                    <span className="label">Container:</span>
                    <span className="value">{selectedOpportunity.containerType}</span>
                  </div>
                  <div className="summary-item">
                    <span className="label">Total Savings:</span>
                    <span className="value savings">
                      ${selectedOpportunity.costSavings.toLocaleString()}
                    </span>
                  </div>
                  <div className="summary-item">
                    <span className="label">Avg Savings/Shipment:</span>
                    <span className="value">
                      ${(selectedOpportunity.costSavings / selectedOpportunity.shipments.length).toFixed(0)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="shipments-table">
                <h3>Included Shipments</h3>
                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>Customer</th>
                        <th>Commodity</th>
                        <th>Weight</th>
                        <th>Volume</th>
                        <th>Cost</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOpportunity.shipments.map((shipment, index) => (
                        <tr key={index}>
                          <td>{shipment.customerName}</td>
                          <td>{shipment.commodity}</td>
                          <td>{shipment.weight.toLocaleString()} lbs</td>
                          <td>{shipment.volume.toFixed(2)} cbm</td>
                          <td>${shipment.shippingCost.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="totals-row">
                        <td colSpan={2}><strong>Totals:</strong></td>
                        <td><strong>{selectedOpportunity.totalWeight.toLocaleString()} lbs</strong></td>
                        <td><strong>{selectedOpportunity.totalVolume.toFixed(2)} cbm</strong></td>
                        <td><strong>
                          ${selectedOpportunity.shipments.reduce((sum, s) => sum + s.shippingCost, 0).toLocaleString()}
                        </strong></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button
                className="cancel-btn"
                onClick={() => setSelectedOpportunity(null)}
              >
                Cancel
              </button>
              <button
                className="execute-btn"
                onClick={() => executeConsolidation(selectedOpportunity)}
                disabled={executing}
              >
                {executing ? 'Executing Consolidation...' : 'Execute Consolidation'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .consolidation-dashboard {
          padding: 24px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .dashboard-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 32px;
          border-radius: 16px;
          margin-bottom: 32px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }

        .header-content h1 {
          margin: 0 0 8px 0;
          font-size: 2.5rem;
          font-weight: 700;
        }

        .subtitle {
          margin: 0;
          opacity: 0.9;
          font-size: 1.1rem;
        }

        .header-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 24px;
          margin-top: 24px;
        }

        .stat-card {
          background: rgba(255,255,255,0.1);
          padding: 20px;
          border-radius: 12px;
          text-align: center;
          backdrop-filter: blur(10px);
        }

        .stat-value {
          font-size: 2rem;
          font-weight: 700;
          display: block;
          margin-bottom: 4px;
        }

        .stat-label {
          font-size: 0.9rem;
          opacity: 0.8;
        }

        .tab-navigation {
          display: flex;
          background: #f8f9fa;
          border-radius: 12px;
          padding: 4px;
          margin-bottom: 32px;
        }

        .tab-button {
          flex: 1;
          padding: 12px 24px;
          border: none;
          background: transparent;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .tab-button.active {
          background: white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          color: #667eea;
        }

        .opportunities-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
          gap: 24px;
        }

        .opportunity-card {
          background: white;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          border: 1px solid #e1e5e9;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .opportunity-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(0,0,0,0.12);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
        }

        .route-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .route {
          font-size: 1.1rem;
          font-weight: 600;
          color: #1a202c;
        }

        .date {
          font-size: 0.9rem;
          color: #718096;
        }

        .savings-badge {
          background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
          color: white;
          padding: 6px 12px;
          border-radius: 20px;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .card-content {
          margin-bottom: 24px;
        }

        .shipment-summary {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-bottom: 20px;
        }

        .summary-item {
          text-align: center;
        }

        .summary-item .label {
          display: block;
          font-size: 0.8rem;
          color: #718096;
          margin-bottom: 4px;
        }

        .summary-item .value {
          display: block;
          font-size: 1.1rem;
          font-weight: 600;
          color: #1a202c;
        }

        .utilization-bars {
          margin-bottom: 20px;
        }

        .utilization-item {
          margin-bottom: 12px;
        }

        .utilization-label {
          display: flex;
          justify-content: space-between;
          margin-bottom: 6px;
          font-size: 0.9rem;
          color: #4a5568;
        }

        .percentage {
          font-weight: 600;
        }

        .progress-bar {
          height: 8px;
          background: #e2e8f0;
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 4px;
          transition: width 0.3s ease;
        }

        .customer-list h4 {
          margin: 0 0 12px 0;
          font-size: 0.9rem;
          color: #4a5568;
        }

        .customer-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .customer-tag {
          background: #edf2f7;
          color: #4a5568;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 0.8rem;
        }

        .customer-tag.more {
          background: #667eea;
          color: white;
        }

        .card-actions {
          display: flex;
          gap: 12px;
        }

        .view-details-btn, .execute-btn {
          flex: 1;
          padding: 10px 16px;
          border: none;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .view-details-btn {
          background: #e2e8f0;
          color: #4a5568;
        }

        .view-details-btn:hover {
          background: #cbd5e0;
        }

        .execute-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .execute-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .execute-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .analytics-content {
          background: white;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        }

        .analytics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 24px;
        }

        .analytics-card {
          padding: 24px;
          border: 1px solid #e1e5e9;
          border-radius: 12px;
        }

        .analytics-card h3 {
          margin: 0 0 20px 0;
          color: #1a202c;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }

        .metric {
          text-align: center;
        }

        .metric-value {
          font-size: 2rem;
          font-weight: 700;
          color: #667eea;
          display: block;
          margin-bottom: 4px;
        }

        .metric-label {
          font-size: 0.9rem;
          color: #718096;
        }

        .routes-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .route-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px;
          background: #f7fafc;
          border-radius: 8px;
        }

        .route-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .route-name {
          font-weight: 600;
          color: #1a202c;
        }

        .route-stats {
          font-size: 0.8rem;
          color: #718096;
        }

        .route-savings {
          font-weight: 600;
          color: #48bb78;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .consolidation-modal {
          background: white;
          border-radius: 16px;
          max-width: 800px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 60px rgba(0,0,0,0.2);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px;
          border-bottom: 1px solid #e1e5e9;
        }

        .modal-header h2 {
          margin: 0;
          color: #1a202c;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #718096;
          padding: 0;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .modal-content {
          padding: 24px;
        }

        .opportunity-summary {
          margin-bottom: 24px;
        }

        .summary-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }

        .summary-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .summary-item .label {
          font-size: 0.8rem;
          color: #718096;
          font-weight: 500;
        }

        .summary-item .value {
          font-size: 1.1rem;
          font-weight: 600;
          color: #1a202c;
        }

        .summary-item .value.savings {
          color: #48bb78;
        }

        .shipments-table h3 {
          margin: 0 0 16px 0;
          color: #1a202c;
        }

        .table-container {
          border: 1px solid #e1e5e9;
          border-radius: 8px;
          overflow: hidden;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        thead {
          background: #f7fafc;
        }

        th, td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #e1e5e9;
        }

        th {
          font-weight: 600;
          color: #4a5568;
          font-size: 0.9rem;
        }

        tbody tr:hover {
          background: #f7fafc;
        }

        .totals-row {
          background: #edf2f7;
          font-weight: 600;
        }

        .modal-actions {
          display: flex;
          gap: 12px;
          padding: 24px;
          border-top: 1px solid #e1e5e9;
          background: #f7fafc;
        }

        .cancel-btn, .modal-actions .execute-btn {
          flex: 1;
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .cancel-btn {
          background: #e2e8f0;
          color: #4a5568;
        }

        .cancel-btn:hover {
          background: #cbd5e0;
        }

        .modal-actions .execute-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .modal-actions .execute-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .modal-actions .execute-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .empty-state {
          text-align: center;
          padding: 80px 20px;
          color: #718096;
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: 24px;
          opacity: 0.5;
        }

        .empty-state h3 {
          margin: 0 0 8px 0;
          color: #4a5568;
        }

        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 80px 20px;
          color: #718096;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #e2e8f0;
          border-top: 4px solid #667eea;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 16px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .consolidation-dashboard {
            padding: 16px;
          }

          .dashboard-header {
            padding: 24px;
          }

          .header-content h1 {
            font-size: 2rem;
          }

          .header-stats {
            grid-template-columns: 1fr;
          }

          .opportunities-grid {
            grid-template-columns: 1fr;
          }

          .analytics-grid {
            grid-template-columns: 1fr;
          }

          .summary-grid {
            grid-template-columns: 1fr;
          }

          .modal-overlay {
            padding: 10px;
          }

          .consolidation-modal {
            max-height: 95vh;
          }
        }
      `}</style>
    </div>
  );
};

export default ShipmentConsolidationDashboard;


