'use client';

import { useEffect, useState } from 'react';
import { DocumentFlowService, DocumentPackage } from '../services/document-flow-service';
import { EnhancedCarrierService } from '../services/enhanced-carrier-service';

interface DocumentFlowControlPanelProps {
  onClose?: () => void;
}

export default function DocumentFlowControlPanel({ onClose }: DocumentFlowControlPanelProps) {
  const [activePackages, setActivePackages] = useState<DocumentPackage[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<DocumentPackage | null>(null);
  const [bulkOperations, setBulkOperations] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'packages' | 'tracking' | 'settings'>('overview');

  const documentFlowService = new DocumentFlowService();
  const carrierService = new EnhancedCarrierService();

  // Mock data for demonstration
  useEffect(() => {
    // In a real app, this would fetch from a database
    const mockPackages: DocumentPackage[] = [
      {
        loadId: 'LD001',
        routeDocument: 'Generated',
        rateConfirmation: 'Generated',
        billOfLading: 'Generated',
        invoice: 'Pending',
        documentsGenerated: {
          route: true,
          rateConfirmation: true,
          billOfLading: true,
          invoice: false
        },
        sentTo: {
          driver: { phone: '+1234567890', timestamp: new Date().toISOString(), status: 'delivered' },
          carrier: { phone: '+0987654321', timestamp: new Date().toISOString(), status: 'sent' }
        }
      },
      {
        loadId: 'LD002',
        documentsGenerated: {
          route: true,
          rateConfirmation: false,
          billOfLading: false,
          invoice: false
        },
        sentTo: {}
      }
    ];
    setActivePackages(mockPackages);
  }, []);

  const handleSendDocumentPackage = async (loadId: string) => {
    setLoading(true);
    try {
      // Mock contact information - in a real app, this would come from the load data
      const contacts = {
        driverPhone: '+1234567890',
        carrierPhone: '+0987654321',
        carrierEmail: 'carrier@example.com',
        shipperEmail: 'shipper@example.com',
        brokerEmail: 'broker@fleetflowapp.com'
      };

      const result = await documentFlowService.sendCompleteDocumentPackage(loadId, contacts);

      if (result.success) {
        alert('✅ Complete document package sent successfully!');
        // Refresh packages
      } else {
        alert('⚠️ Some documents failed to send. Check individual statuses.');
      }
    } catch (error) {
      console.error('Error sending document package:', error);
      alert('❌ Error sending documents. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBulkOperation = async (operation: 'send' | 'regenerate' | 'track') => {
    if (bulkOperations.length === 0) {
      alert('Please select packages to perform bulk operations');
      return;
    }

    setLoading(true);
    try {
      for (const loadId of bulkOperations) {
        switch (operation) {
          case 'send':
            await handleSendDocumentPackage(loadId);
            break;
          case 'regenerate':
            // Regenerate documents
            console.info(`Regenerating documents for ${loadId}`);
            break;
          case 'track':
            // Enable tracking
            console.info(`Enabling tracking for ${loadId}`);
            break;
        }
      }
      setBulkOperations([]);
      alert(`✅ Bulk ${operation} operation completed!`);
    } catch (error) {
      console.error('Bulk operation error:', error);
      alert('❌ Bulk operation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getDocumentStatus = (pkg: DocumentPackage) => {
    const generated = Object.values(pkg.documentsGenerated).filter(Boolean).length;
    const total = Object.keys(pkg.documentsGenerated).length;
    return `${generated}/${total}`;
  };

  const getDeliveryStatus = (pkg: DocumentPackage) => {
    const sent = Object.keys(pkg.sentTo).length;
    const delivered = Object.values(pkg.sentTo).filter(contact => contact?.status === 'delivered').length;
    return { sent, delivered };
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">📋 Document Flow Control Center</h2>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-2 mb-6"">
        {[
          { id: 'overview', label: 'Overview', icon: '📊' },
          { id: 'packages', label: 'Document Packages', icon: '📄' },
          { id: 'tracking', label: 'Carrier Tracking', icon: '📍' },
          { id: 'settings', label: 'Settings', icon: '⚙️' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6"">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4"">
            <div className="bg-blue-50 rounded-lg p-4"">
              <div className="text-2xl font-bold text-blue-600"">{activePackages.length}</div>
              <div className="text-sm text-blue-800"">Active Packages</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4"">
              <div className="text-2xl font-bold text-green-600"">
                {activePackages.filter(pkg => Object.values(pkg.documentsGenerated).every(Boolean)).length}
              </div>
              <div className="text-sm text-green-800"">Complete Packages</div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4"">
              <div className="text-2xl font-bold text-yellow-600"">
                {activePackages.filter(pkg => Object.keys(pkg.sentTo).length > 0).length}
              </div>
              <div className="text-sm text-yellow-800"">Packages Sent</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4"">
              <div className="text-2xl font-bold text-purple-600"">
                {activePackages.reduce((acc, pkg) =>
                  acc + Object.values(pkg.sentTo).filter(contact => contact?.status === 'delivered').length, 0
                )}
              </div>
              <div className="text-sm text-purple-800"">Delivered</div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-gray-50 rounded-lg p-4"">
            <h3 className="text-lg font-semibold text-gray-900 mb-4"">📈 Recent Activity</h3>
            <div className="space-y-2 text-sm"">
              <div className="flex items-center gap-2"">
                <span className="text-green-600"">✅</span>
                <span>Document package for LD001 delivered successfully</span>
                <span className="text-gray-500 text-xs ml-auto"">2 min ago</span>
              </div>
              <div className="flex items-center gap-2"">
                <span className="text-blue-600"">📄</span>
                <span>Rate confirmation generated for LD003</span>
                <span className="text-gray-500 text-xs ml-auto"">5 min ago</span>
              </div>
              <div className="flex items-center gap-2"">
                <span className="text-purple-600"">📍</span>
                <span>Carrier tracking enabled for MC123456</span>
                <span className="text-gray-500 text-xs ml-auto"">10 min ago</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Document Packages Tab */}
      {activeTab === 'packages' && (
        <div className="space-y-6"">
          {/* Bulk Operations */}
          <div className="bg-gray-50 rounded-lg p-4"">
            <div className="flex items-center justify-between mb-4"">
              <h3 className="text-lg font-semibold text-gray-900"">Bulk Operations</h3>
              <div className="text-sm text-gray-600"">
                {bulkOperations.length} packages selected
              </div>
            </div>
            <div className="flex gap-2"">
              <button
                onClick={() => handleBulkOperation('send')}
                disabled={loading || bulkOperations.length === 0}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50""
              >
                📤 Bulk Send
              </button>
              <button
                onClick={() => handleBulkOperation('regenerate')}
                disabled={loading || bulkOperations.length === 0}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50""
              >
                🔄 Regenerate
              </button>
              <button
                onClick={() => handleBulkOperation('track')}
                disabled={loading || bulkOperations.length === 0}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50""
              >
                📍 Enable Tracking
              </button>
            </div>
          </div>

          {/* Packages Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden"">
            <table className="w-full"">
              <thead className="bg-gray-50"">
                <tr>
                  <th className="px-4 py-3 text-left"">
                    <input
                      type="checkbox""
                      onChange={(e) => {
                        if (e.target.checked) {
                          setBulkOperations(activePackages.map(pkg => pkg.loadId));
                        } else {
                          setBulkOperations([]);
                        }
                      }}
                      checked={bulkOperations.length === activePackages.length}
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"">Load ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"">Documents</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"">Sent Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"">Delivery Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200"">
                {activePackages.map((pkg) => {
                  const deliveryStatus = getDeliveryStatus(pkg);
                  return (
                    <tr key={pkg.loadId} className="hover:bg-gray-50"">
                      <td className="px-4 py-3"">
                        <input
                          type="checkbox""
                          checked={bulkOperations.includes(pkg.loadId)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setBulkOperations([...bulkOperations, pkg.loadId]);
                            } else {
                              setBulkOperations(bulkOperations.filter(id => id !== pkg.loadId));
                            }
                          }}
                        />
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900"">{pkg.loadId}</td>
                      <td className="px-4 py-3 text-sm text-gray-500"">{getDocumentStatus(pkg)}</td>
                      <td className="px-4 py-3 text-sm text-gray-500"">{deliveryStatus.sent} sent</td>
                      <td className="px-4 py-3 text-sm text-gray-500"">{deliveryStatus.delivered} delivered</td>
                      <td className="px-4 py-3 text-sm"">
                        <div className="flex gap-2"">
                          <button
                            onClick={() => setSelectedPackage(pkg)}
                            className="text-blue-600 hover:text-blue-900""
                          >
                            👁️ View
                          </button>
                          <button
                            onClick={() => handleSendDocumentPackage(pkg.loadId)}
                            disabled={loading}
                            className="text-green-600 hover:text-green-900""
                          >
                            📤 Send
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Carrier Tracking Tab */}
      {activeTab === 'tracking' && (
        <div className="space-y-6"">
          <div className="bg-gray-50 rounded-lg p-4"">
            <h3 className="text-lg font-semibold text-gray-900 mb-4"">📍 Live Carrier Tracking</h3>
            <div className="text-sm text-gray-600 mb-4"">
              Manage real-time tracking for carriers and monitor their locations during transit.
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"">
              <div className="bg-white rounded-lg p-3 text-center"">
                <div className="text-lg font-bold text-green-600"">12</div>
                <div className="text-xs text-gray-500"">Active Tracking</div>
              </div>
              <div className="bg-white rounded-lg p-3 text-center"">
                <div className="text-lg font-bold text-blue-600"">34</div>
                <div className="text-xs text-gray-500"">Verified Carriers</div>
              </div>
              <div className="bg-white rounded-lg p-3 text-center"">
                <div className="text-lg font-bold text-purple-600"">89%</div>
                <div className="text-xs text-gray-500"">On-time Rate</div>
              </div>
            </div>

            {/* Carrier List */}
            <div className="space-y-2"">
              {['MC123456', 'MC789012', 'MC345678'].map((mcNumber) => (
                <div key={mcNumber} className="bg-white rounded-lg p-3 flex items-center justify-between"">
                  <div className="flex items-center gap-3"">
                    <div className="w-3 h-3 bg-green-500 rounded-full"" />
                    <div>
                      <div className="font-medium text-gray-900"">{mcNumber}</div>
                      <div className="text-xs text-gray-500"">Last update: 2 minutes ago</div>
                    </div>
                  </div>
                  <div className="flex gap-2"">
                    <button className="text-blue-600 hover:text-blue-900 text-sm"">📍 View Location</button>
                    <button className="text-red-600 hover:text-red-900 text-sm"">🔴 Disable</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-6"">
          <div className="bg-gray-50 rounded-lg p-4"">
            <h3 className="text-lg font-semibold text-gray-900 mb-4"">⚙️ Document Flow Settings</h3>

            <div className="space-y-4"">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2"">
                  Auto-send documents when load is assigned
                </label>
                <input type="checkbox"" className="rounded"" defaultChecked />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2"">
                  Enable automatic carrier verification
                </label>
                <input type="checkbox"" className="rounded"" defaultChecked />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2"">
                  SMS notification preferences
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg"">
                  <option>Send to drivers and carriers</option>
                  <option>Send to drivers only</option>
                  <option>Send to carriers only</option>
                  <option>Disable SMS notifications</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2"">
                  Document retention period (days)
                </label>
                <input
                  type="number""
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg""
                  defaultValue={365}
                />
              </div>
            </div>

            <div className="mt-6"">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"">
                💾 Save Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Package Detail Modal */}
      {selectedPackage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-screen overflow-y-auto"">
            <div className="flex items-center justify-between mb-4"">
              <h3 className="text-lg font-bold text-gray-900"">📄 Package Details: {selectedPackage.loadId}</h3>
              <button
                onClick={() => setSelectedPackage(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl""
              >
                ×
              </button>
            </div>

            {/* Document Status */}
            <div className="space-y-4"">
              <div>
                <h4 className="font-medium text-gray-900 mb-2"">Generated Documents</h4>
                <div className="grid grid-cols-2 gap-2 text-sm"">
                  {Object.entries(selectedPackage.documentsGenerated).map(([doc, generated]) => (
                    <div key={doc} className="flex items-center gap-2"">
                      <span className={generated ? 'text-green-600' : 'text-red-600'}>
                        {generated ? '✅' : '❌'}
                      </span>
                      <span className="capitalize"">{doc.replace(/([A-Z])/g, ' $1')}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2"">Delivery Status</h4>
                <div className="space-y-2 text-sm"">
                  {Object.entries(selectedPackage.sentTo).map(([recipient, info]) => (
                    <div key={recipient} className="flex items-center justify-between"">
                      <span className="capitalize"">{recipient}</span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        info?.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        info?.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {info?.status || 'Not sent'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
