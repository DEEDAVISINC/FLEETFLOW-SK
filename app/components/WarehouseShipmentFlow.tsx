'use client';

import { useEffect, useState } from 'react';

// ========================================
// 🏭 COMPREHENSIVE WAREHOUSE TO SHIPMENT FLOW MONITORING
// ========================================

// Import existing services for data integration
import { ShipperInfo } from '../services/loadService';
import { shipperService } from '../services/shipperService';

// Vendor Portal Session Interface
interface VendorSession {
  shipperId: string;
  companyName: string;
  loginTime: string;
  email?: string;
  contactName?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  businessType?: string;
}

interface WarehouseItem {
  id: string;
  itemCode: string;
  description: string;
  quantity: number;
  unitType: string;
  weight: number;
  dimensions: string;
  value: number;
  location: string;
  status: 'received' | 'stored' | 'picked' | 'packed' | 'shipped';
  receivedDate: string;
  shippedDate?: string;
  shipmentId?: string;
  customerId: string;
  customerName: string;
  palletId?: string;
  labelRequired: boolean;
  labelStatus?: 'pending' | 'printed' | 'applied';
  specialInstructions?: string;
}

interface ShipmentFlow {
  id: string;
  shipmentNumber: string;
  customerId: string;
  customerName: string;
  status: 'warehouse_processing' | 'ready_to_ship' | 'in_transit' | 'delivered';
  items: WarehouseItem[];
  totalWeight: number;
  totalValue: number;
  pickingStarted: string;
  pickingCompleted?: string;
  packingStarted?: string;
  packingCompleted?: string;
  shippingDate?: string;
  deliveryDate?: string;
  carrier: string;
  trackingNumber?: string;
  origin: string;
  destination: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  notes?: string;
}

interface WarehouseActivity {
  id: string;
  timestamp: string;
  type: 'receive' | 'move' | 'pick' | 'pack' | 'ship' | 'label';
  itemId?: string;
  shipmentId?: string;
  description: string;
  performedBy: string;
  location?: string;
  quantity?: number;
}

interface WarehouseShipmentFlowProps {
  brokerId?: string;
  brokerName?: string;
  selectedShipperId?: string;
}

export default function WarehouseShipmentFlow({
  brokerId,
  brokerName,
  selectedShipperId,
}: WarehouseShipmentFlowProps = {}) {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'inventory' | 'shipments' | 'activities' | 'analytics'
  >('overview');
  const [selectedShipment, setSelectedShipment] = useState<ShipmentFlow | null>(
    null
  );
  const [showShipmentDetails, setShowShipmentDetails] = useState(false);

  // Real shipper data integration
  const [shippers, setShippers] = useState<ShipperInfo[]>([]);
  const [vendorSessions, setVendorSessions] = useState<VendorSession[]>([]);
  const [loading, setLoading] = useState(true);

  // Load real shipper data and create vendor sessions
  useEffect(() => {
    const loadShipperData = async () => {
      try {
        const shipperData = shipperService.getAllShippers();
        setShippers(shipperData);

        // Create vendor sessions from shipper data
        const sessions: VendorSession[] = shipperData.map((shipper) => ({
          shipperId: shipper.id,
          companyName: shipper.companyName,
          loginTime: new Date().toISOString(),
          email: shipper.email,
          contactName: shipper.contactName,
          phone: shipper.phone,
          address: shipper.address,
          city: shipper.city,
          state: shipper.state,
          zipCode: shipper.zipCode,
          businessType: shipper.businessType,
        }));

        setVendorSessions(sessions);
        setLoading(false);
      } catch (error) {
        console.error('Error loading shipper data:', error);
        setLoading(false);
      }
    };

    loadShipperData();
  }, []);

  // Get current shipper info for filtering
  const getCurrentShipper = () => {
    if (selectedShipperId) {
      return shippers.find((s) => s.id === selectedShipperId);
    }
    return shippers[0]; // Default to first shipper if none selected
  };

  const currentShipper = getCurrentShipper();

  // Generate warehouse items based on real shipper data
  const getWarehouseItems = (): WarehouseItem[] => {
    if (!currentShipper) return [];

    return [
      {
        id: 'WH-001',
        itemCode: `${currentShipper.id.split('-')[0]}-WIDGET-001`,
        description: `${currentShipper.businessType} Widget Assembly`,
        quantity: 150,
        unitType: 'EA',
        weight: 2.5,
        dimensions: '12x8x4 inches',
        value: 45.99,
        location: 'A-12-B',
        status: 'stored',
        receivedDate: '2024-01-15T08:30:00Z',
        customerId: currentShipper.id,
        customerName: currentShipper.companyName,
        palletId: 'PLT-001',
        labelRequired: true,
        labelStatus: 'applied',
        specialInstructions:
          currentShipper.specialInstructions ||
          'Handle with care - fragile components',
      },
      {
        id: 'WH-002',
        itemCode: `${currentShipper.id.split('-')[0]}-COMP-002`,
        description: `${currentShipper.businessType} Components Kit`,
        quantity: 75,
        unitType: 'KIT',
        weight: 1.8,
        dimensions: '10x6x3 inches',
        value: 89.5,
        location: 'B-05-C',
        status: 'picked',
        receivedDate: '2024-01-16T10:15:00Z',
        customerId: currentShipper.id,
        customerName: currentShipper.companyName,
        palletId: 'PLT-002',
        labelRequired: true,
        labelStatus: 'printed',
        shipmentId: 'SHP-001',
      },
      {
        id: 'WH-003',
        itemCode: `${currentShipper.id.split('-')[0]}-SUPPLY-003`,
        description: `${currentShipper.businessType} Supply Box`,
        quantity: 200,
        unitType: 'BOX',
        weight: 5.2,
        dimensions: '16x12x8 inches',
        value: 125.0,
        location: 'C-08-A',
        status: 'received',
        receivedDate: '2024-01-17T14:45:00Z',
        customerId: currentShipper.id,
        customerName: currentShipper.companyName,
        labelRequired: false,
      },
    ];
  };

  const warehouseItems = getWarehouseItems();

  // Generate shipment flows based on real shipper data
  const getShipmentFlows = (): ShipmentFlow[] => {
    if (!currentShipper || warehouseItems.length === 0) return [];

    return [
      {
        id: 'SHP-001',
        shipmentNumber: `SF-${currentShipper.id.split('-')[0]}-001`,
        customerId: currentShipper.id,
        customerName: currentShipper.companyName,
        status: 'warehouse_processing',
        items: [warehouseItems[1]],
        totalWeight: 135.0,
        totalValue: 6712.5,
        pickingStarted: '2024-01-17T09:00:00Z',
        pickingCompleted: '2024-01-17T11:30:00Z',
        packingStarted: '2024-01-17T13:00:00Z',
        carrier: 'FedEx Ground',
        origin: `${currentShipper.city}, ${currentShipper.state}`,
        destination: 'Dallas, TX',
        priority: 'high',
        notes: `Rush order for ${currentShipper.companyName} - customer needs by Friday`,
      },
      {
        id: 'SHP-002',
        shipmentNumber: `SF-${currentShipper.id.split('-')[0]}-002`,
        customerId: currentShipper.id,
        customerName: currentShipper.companyName,
        status: 'ready_to_ship',
        items: [warehouseItems[0]],
        totalWeight: 375.0,
        totalValue: 6898.5,
        pickingStarted: '2024-01-16T08:00:00Z',
        pickingCompleted: '2024-01-16T10:15:00Z',
        packingStarted: '2024-01-16T14:00:00Z',
        packingCompleted: '2024-01-16T16:30:00Z',
        shippingDate: '2024-01-18T08:00:00Z',
        carrier: 'UPS Ground',
        trackingNumber: '1Z999AA1234567890',
        origin: `${currentShipper.city}, ${currentShipper.state}`,
        destination: 'Phoenix, AZ',
        priority: 'medium',
      },
    ];
  };

  const shipmentFlows = getShipmentFlows();

  const [recentActivities] = useState<WarehouseActivity[]>([
    {
      id: 'ACT-001',
      timestamp: '2024-01-17T15:30:00Z',
      type: 'receive',
      itemId: 'WH-003',
      description: 'Received 200 units of Industrial Supply Box',
      performedBy: 'John Martinez',
      location: 'C-08-A',
      quantity: 200,
    },
    {
      id: 'ACT-002',
      timestamp: '2024-01-17T13:15:00Z',
      type: 'pack',
      shipmentId: 'SHP-001',
      description: 'Started packing shipment SF-2024-001',
      performedBy: 'Sarah Chen',
      location: 'Pack Station 3',
    },
    {
      id: 'ACT-003',
      timestamp: '2024-01-17T11:45:00Z',
      type: 'pick',
      itemId: 'WH-002',
      shipmentId: 'SHP-001',
      description: 'Picked 75 units of Electronic Components Kit',
      performedBy: 'Mike Johnson',
      location: 'B-05-C',
      quantity: 75,
    },
    {
      id: 'ACT-004',
      timestamp: '2024-01-17T10:00:00Z',
      type: 'label',
      itemId: 'WH-002',
      description: 'Printed shipping labels for Electronic Components Kit',
      performedBy: 'Lisa Rodriguez',
      location: 'Label Station 1',
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'received':
        return '#3b82f6';
      case 'stored':
        return '#10b981';
      case 'picked':
        return '#f59e0b';
      case 'packed':
        return '#8b5cf6';
      case 'shipped':
        return '#06b6d4';
      case 'warehouse_processing':
        return '#f59e0b';
      case 'ready_to_ship':
        return '#10b981';
      case 'in_transit':
        return '#3b82f6';
      case 'delivered':
        return '#059669';
      default:
        return '#6b7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'received':
        return '📥';
      case 'stored':
        return '📦';
      case 'picked':
        return '🔍';
      case 'packed':
        return '📋';
      case 'shipped':
        return '🚚';
      case 'warehouse_processing':
        return '⚙️';
      case 'ready_to_ship':
        return '✅';
      case 'in_transit':
        return '🚛';
      case 'delivered':
        return '🎯';
      default:
        return '❓';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return '#dc2626';
      case 'high':
        return '#f59e0b';
      case 'medium':
        return '#3b82f6';
      case 'low':
        return '#6b7280';
      default:
        return '#6b7280';
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '400px',
          color: 'white',
          fontSize: '18px',
        }}
      >
        <div>
          <div
            style={{
              fontSize: '48px',
              marginBottom: '16px',
              textAlign: 'center',
            }}
          >
            🔄
          </div>
          Loading warehouse data...
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Shipper Information Header */}
      {currentShipper && (
        <div
          style={{
            background: 'rgba(16, 185, 129, 0.1)',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '24px',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <h3
              style={{
                color: 'white',
                fontSize: '18px',
                fontWeight: '600',
                margin: '0 0 4px 0',
              }}
            >
              📋 Active Shipper: {currentShipper.companyName}
            </h3>
            <div
              style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px' }}
            >
              ID: {currentShipper.id} | Type: {currentShipper.businessType} |
              Contact: {currentShipper.contactName}
            </div>
            <div
              style={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '12px',
                marginTop: '4px',
              }}
            >
              📍 {currentShipper.address}, {currentShipper.city},{' '}
              {currentShipper.state} {currentShipper.zipCode}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div
              style={{ color: '#10b981', fontSize: '14px', fontWeight: '600' }}
            >
              Credit Rating: {currentShipper.creditRating}
            </div>
            <div
              style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px' }}
            >
              Terms: {currentShipper.paymentTerms}
            </div>
          </div>
        </div>
      )}

      {/* Shipper Selector */}
      {shippers.length > 1 && (
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '24px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <label
            style={{
              color: 'white',
              fontSize: '14px',
              fontWeight: '600',
              marginBottom: '8px',
              display: 'block',
            }}
          >
            🏢 Select Shipper for Warehouse Operations:
          </label>
          <select
            value={currentShipper?.id || ''}
            onChange={(e) => {
              // This would be handled by parent component in real implementation
              console.log('Selected shipper:', e.target.value);
            }}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              fontSize: '14px',
            }}
          >
            {shippers.map((shipper) => (
              <option
                key={shipper.id}
                value={shipper.id}
                style={{ background: '#1f2937', color: 'white' }}
              >
                {shipper.companyName} ({shipper.id}) - {shipper.businessType}
              </option>
            ))}
          </select>
        </div>
      )}

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
            color: 'white',
            fontSize: '24px',
            fontWeight: 'bold',
            margin: 0,
          }}
        >
          🏭 Warehouse to Shipment Flow
        </h2>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            style={{
              background: 'linear-gradient(135deg, #f97316, #ea580c)', // Orange - Resources color
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow =
                '0 6px 12px rgba(0, 0, 0, 0.15)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
            }}
          >
            📊 Export Report
          </button>
          <button
            style={{
              background: 'linear-gradient(135deg, #14b8a6, #0d9488)', // Teal - FleetFlow color
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow =
                '0 6px 12px rgba(0, 0, 0, 0.15)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
            }}
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        {[
          { id: 'overview', label: 'Overview', icon: '📊' },
          { id: 'inventory', label: 'Inventory', icon: '📦' },
          { id: 'shipments', label: 'Shipments', icon: '🚚' },
          { id: 'activities', label: 'Activities', icon: '📋' },
          { id: 'analytics', label: 'Analytics', icon: '📈' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              padding: '12px 20px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              backgroundColor:
                activeTab === tab.id
                  ? 'rgba(16, 185, 129, 0.2)'
                  : 'rgba(255, 255, 255, 0.1)',
              color:
                activeTab === tab.id ? '#10b981' : 'rgba(255, 255, 255, 0.8)',
              border:
                activeTab === tab.id
                  ? '1px solid rgba(16, 185, 129, 0.3)'
                  : '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <span style={{ marginRight: '6px' }}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div>
          {/* KPI Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '16px',
              marginBottom: '24px',
            }}
          >
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '20px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '8px',
                }}
              >
                <div style={{ fontSize: '24px' }}>📦</div>
                <div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '14px',
                    }}
                  >
                    Items in Warehouse
                  </div>
                  <div
                    style={{
                      color: 'white',
                      fontSize: '24px',
                      fontWeight: 'bold',
                    }}
                  >
                    425
                  </div>
                </div>
              </div>
            </div>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '20px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '8px',
                }}
              >
                <div style={{ fontSize: '24px' }}>🚚</div>
                <div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '14px',
                    }}
                  >
                    Active Shipments
                  </div>
                  <div
                    style={{
                      color: 'white',
                      fontSize: '24px',
                      fontWeight: 'bold',
                    }}
                  >
                    12
                  </div>
                </div>
              </div>
            </div>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '20px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '8px',
                }}
              >
                <div style={{ fontSize: '24px' }}>⚙️</div>
                <div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '14px',
                    }}
                  >
                    Processing
                  </div>
                  <div
                    style={{
                      color: 'white',
                      fontSize: '24px',
                      fontWeight: 'bold',
                    }}
                  >
                    8
                  </div>
                </div>
              </div>
            </div>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '20px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '8px',
                }}
              >
                <div style={{ fontSize: '24px' }}>✅</div>
                <div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '14px',
                    }}
                  >
                    Ready to Ship
                  </div>
                  <div
                    style={{
                      color: 'white',
                      fontSize: '24px',
                      fontWeight: 'bold',
                    }}
                  >
                    4
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Flow Timeline */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '24px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <h3
              style={{
                color: 'white',
                fontSize: '18px',
                fontWeight: '600',
                marginBottom: '20px',
              }}
            >
              📋 Warehouse Process Flow
            </h3>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                overflowX: 'auto',
              }}
            >
              {[
                { step: 'Receive', icon: '📥', count: 3, color: '#3b82f6' },
                { step: 'Store', icon: '📦', count: 150, color: '#10b981' },
                { step: 'Pick', icon: '🔍', count: 25, color: '#f59e0b' },
                { step: 'Pack', icon: '📋', count: 8, color: '#8b5cf6' },
                { step: 'Ship', icon: '🚚', count: 4, color: '#06b6d4' },
              ].map((stage, index) => (
                <div
                  key={stage.step}
                  style={{ display: 'flex', alignItems: 'center', gap: '16px' }}
                >
                  <div style={{ textAlign: 'center', minWidth: '80px' }}>
                    <div
                      style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        background: `rgba(${stage.color === '#3b82f6' ? '59, 130, 246' : stage.color === '#10b981' ? '16, 185, 129' : stage.color === '#f59e0b' ? '245, 158, 11' : stage.color === '#8b5cf6' ? '139, 92, 246' : '6, 182, 212'}, 0.2)`,
                        border: `2px solid ${stage.color}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '24px',
                        margin: '0 auto 8px',
                      }}
                    >
                      {stage.icon}
                    </div>
                    <div
                      style={{
                        color: 'white',
                        fontSize: '14px',
                        fontWeight: '600',
                        marginBottom: '4px',
                      }}
                    >
                      {stage.step}
                    </div>
                    <div
                      style={{
                        color: stage.color,
                        fontSize: '18px',
                        fontWeight: 'bold',
                      }}
                    >
                      {stage.count}
                    </div>
                  </div>
                  {index < 4 && (
                    <div
                      style={{
                        width: '40px',
                        height: '2px',
                        background: 'rgba(255, 255, 255, 0.3)',
                        position: 'relative',
                      }}
                    >
                      <div
                        style={{
                          position: 'absolute',
                          right: '-6px',
                          top: '-4px',
                          width: '0',
                          height: '0',
                          borderLeft: '6px solid rgba(255, 255, 255, 0.3)',
                          borderTop: '5px solid transparent',
                          borderBottom: '5px solid transparent',
                        }}
                      ></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Inventory Tab */}
      {activeTab === 'inventory' && (
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            padding: '24px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <h3
            style={{
              color: 'white',
              fontSize: '18px',
              fontWeight: '600',
              marginBottom: '20px',
            }}
          >
            📦 Warehouse Inventory
          </h3>
          <div style={{ display: 'grid', gap: '12px' }}>
            {warehouseItems.map((item) => (
              <div
                key={item.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '8px',
                  padding: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  display: 'grid',
                  gridTemplateColumns: '1fr 120px 100px 80px',
                  gap: '16px',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      marginBottom: '8px',
                    }}
                  >
                    <div
                      style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        background: getStatusColor(item.status) + '20',
                        color: getStatusColor(item.status),
                        fontSize: '12px',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      {getStatusIcon(item.status)} {item.status.toUpperCase()}
                    </div>
                    {item.labelRequired && (
                      <div
                        style={{
                          padding: '4px 8px',
                          borderRadius: '4px',
                          background:
                            item.labelStatus === 'applied'
                              ? '#10b98120'
                              : '#f59e0b20',
                          color:
                            item.labelStatus === 'applied'
                              ? '#10b981'
                              : '#f59e0b',
                          fontSize: '12px',
                          fontWeight: '600',
                        }}
                      >
                        🏷️ {item.labelStatus?.toUpperCase()}
                      </div>
                    )}
                  </div>
                  <h4
                    style={{
                      color: 'white',
                      fontSize: '16px',
                      fontWeight: '600',
                      margin: '0 0 4px 0',
                    }}
                  >
                    {item.itemCode}
                  </h4>
                  <p
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '14px',
                      margin: '0 0 4px 0',
                    }}
                  >
                    {item.description}
                  </p>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.5)',
                      fontSize: '12px',
                    }}
                  >
                    Location: {item.location} | Customer: {item.customerName}
                  </div>
                  {/* Vendor Portal Connection Indicator */}
                  {vendorSessions.find(
                    (session) => session.shipperId === item.customerId
                  ) && (
                    <div
                      style={{
                        marginTop: '6px',
                        padding: '4px 8px',
                        background: 'rgba(59, 130, 246, 0.2)',
                        borderRadius: '4px',
                        display: 'inline-block',
                      }}
                    >
                      <span
                        style={{
                          color: '#60a5fa',
                          fontSize: '11px',
                          fontWeight: '600',
                        }}
                      >
                        🔗 Vendor Portal Active
                      </span>
                    </div>
                  )}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div
                    style={{
                      color: 'white',
                      fontSize: '18px',
                      fontWeight: 'bold',
                    }}
                  >
                    {item.quantity} {item.unitType}
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '12px',
                    }}
                  >
                    {item.weight} lbs each
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div
                    style={{
                      color: '#10b981',
                      fontSize: '16px',
                      fontWeight: '600',
                    }}
                  >
                    ${(item.value * item.quantity).toLocaleString()}
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '12px',
                    }}
                  >
                    ${item.value}/unit
                  </div>
                </div>
                <div>
                  <button
                    style={{
                      background: 'linear-gradient(135deg, #6366f1, #4f46e5)', // Purple - Analytics color
                      color: 'white',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      width: '100%',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'translateY(-1px)';
                      e.currentTarget.style.boxShadow =
                        '0 4px 8px rgba(0, 0, 0, 0.15)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow =
                        '0 2px 4px rgba(0, 0, 0, 0.1)';
                    }}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Shipments Tab */}
      {activeTab === 'shipments' && (
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            padding: '24px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <h3
            style={{
              color: 'white',
              fontSize: '18px',
              fontWeight: '600',
              marginBottom: '20px',
            }}
          >
            🚚 Active Shipments
          </h3>
          <div style={{ display: 'grid', gap: '16px' }}>
            {shipmentFlows.map((shipment) => (
              <div
                key={shipment.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '12px',
                  padding: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onClick={() => {
                  setSelectedShipment(shipment);
                  setShowShipmentDetails(true);
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background =
                    'rgba(255, 255, 255, 0.05)';
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '16px',
                  }}
                >
                  <div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        marginBottom: '8px',
                      }}
                    >
                      <h4
                        style={{
                          color: 'white',
                          fontSize: '18px',
                          fontWeight: '600',
                          margin: 0,
                        }}
                      >
                        {shipment.shipmentNumber}
                      </h4>
                      <div
                        style={{
                          padding: '4px 12px',
                          borderRadius: '6px',
                          background: getStatusColor(shipment.status) + '20',
                          color: getStatusColor(shipment.status),
                          fontSize: '12px',
                          fontWeight: '600',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        {getStatusIcon(shipment.status)}{' '}
                        {shipment.status.replace('_', ' ').toUpperCase()}
                      </div>
                      <div
                        style={{
                          padding: '4px 8px',
                          borderRadius: '4px',
                          background:
                            getPriorityColor(shipment.priority) + '20',
                          color: getPriorityColor(shipment.priority),
                          fontSize: '12px',
                          fontWeight: '600',
                        }}
                      >
                        {shipment.priority.toUpperCase()} PRIORITY
                      </div>
                    </div>
                    <p
                      style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '14px',
                        margin: '0 0 8px 0',
                      }}
                    >
                      {shipment.customerName}
                    </p>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.5)',
                        fontSize: '12px',
                      }}
                    >
                      {shipment.origin} → {shipment.destination} |{' '}
                      {shipment.carrier}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div
                      style={{
                        color: 'white',
                        fontSize: '16px',
                        fontWeight: '600',
                        marginBottom: '4px',
                      }}
                    >
                      {shipment.items.length} items
                    </div>
                    <div
                      style={{
                        color: '#10b981',
                        fontSize: '14px',
                        fontWeight: '600',
                        marginBottom: '4px',
                      }}
                    >
                      ${shipment.totalValue.toLocaleString()}
                    </div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '12px',
                      }}
                    >
                      {shipment.totalWeight} lbs
                    </div>
                  </div>
                </div>

                {/* Progress Timeline */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginTop: '16px',
                  }}
                >
                  {[
                    { step: 'Pick', completed: !!shipment.pickingCompleted },
                    { step: 'Pack', completed: !!shipment.packingCompleted },
                    { step: 'Ship', completed: !!shipment.shippingDate },
                    { step: 'Deliver', completed: !!shipment.deliveryDate },
                  ].map((step, index) => (
                    <div
                      key={step.step}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        flex: 1,
                      }}
                    >
                      <div
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          background: step.completed
                            ? '#10b981'
                            : 'rgba(255, 255, 255, 0.2)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '12px',
                          color: step.completed
                            ? 'white'
                            : 'rgba(255, 255, 255, 0.5)',
                        }}
                      >
                        {step.completed ? '✓' : index + 1}
                      </div>
                      <span
                        style={{
                          color: step.completed
                            ? '#10b981'
                            : 'rgba(255, 255, 255, 0.5)',
                          fontSize: '12px',
                          fontWeight: '600',
                        }}
                      >
                        {step.step}
                      </span>
                      {index < 3 && (
                        <div
                          style={{
                            flex: 1,
                            height: '2px',
                            background: step.completed
                              ? '#10b981'
                              : 'rgba(255, 255, 255, 0.2)',
                            marginLeft: '8px',
                          }}
                        ></div>
                      )}
                    </div>
                  ))}
                </div>

                {shipment.notes && (
                  <div
                    style={{
                      marginTop: '12px',
                      padding: '8px 12px',
                      background: 'rgba(245, 158, 11, 0.1)',
                      borderRadius: '6px',
                      border: '1px solid rgba(245, 158, 11, 0.2)',
                    }}
                  >
                    <div
                      style={{
                        color: '#f59e0b',
                        fontSize: '12px',
                        fontWeight: '600',
                        marginBottom: '4px',
                      }}
                    >
                      📝 Notes:
                    </div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: '12px',
                      }}
                    >
                      {shipment.notes}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Activities Tab */}
      {activeTab === 'activities' && (
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            padding: '24px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <h3
            style={{
              color: 'white',
              fontSize: '18px',
              fontWeight: '600',
              marginBottom: '20px',
            }}
          >
            📋 Recent Warehouse Activities
          </h3>
          <div style={{ display: 'grid', gap: '12px' }}>
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '8px',
                  padding: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                }}
              >
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: getStatusColor(activity.type) + '20',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                  }}
                >
                  {getStatusIcon(activity.type)}
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      color: 'white',
                      fontSize: '14px',
                      fontWeight: '600',
                      marginBottom: '4px',
                    }}
                  >
                    {activity.description}
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '12px',
                      marginBottom: '2px',
                    }}
                  >
                    Performed by: {activity.performedBy}
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.5)',
                      fontSize: '12px',
                    }}
                  >
                    {new Date(activity.timestamp).toLocaleString()}
                    {activity.location && ` | Location: ${activity.location}`}
                  </div>
                </div>
                {activity.quantity && (
                  <div style={{ textAlign: 'right' }}>
                    <div
                      style={{
                        color: getStatusColor(activity.type),
                        fontSize: '16px',
                        fontWeight: '600',
                      }}
                    >
                      {activity.quantity}
                    </div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.5)',
                        fontSize: '12px',
                      }}
                    >
                      units
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '16px',
              marginBottom: '24px',
            }}
          >
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '20px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <h4
                style={{
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: '600',
                  marginBottom: '16px',
                }}
              >
                📊 Processing Times
              </h4>
              <div style={{ display: 'grid', gap: '8px' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '14px',
                    }}
                  >
                    Avg. Pick Time:
                  </span>
                  <span
                    style={{
                      color: '#10b981',
                      fontSize: '14px',
                      fontWeight: '600',
                    }}
                  >
                    2.5 hours
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '14px',
                    }}
                  >
                    Avg. Pack Time:
                  </span>
                  <span
                    style={{
                      color: '#10b981',
                      fontSize: '14px',
                      fontWeight: '600',
                    }}
                  >
                    1.8 hours
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '14px',
                    }}
                  >
                    Total Cycle Time:
                  </span>
                  <span
                    style={{
                      color: '#10b981',
                      fontSize: '14px',
                      fontWeight: '600',
                    }}
                  >
                    4.3 hours
                  </span>
                </div>
              </div>
            </div>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '20px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <h4
                style={{
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: '600',
                  marginBottom: '16px',
                }}
              >
                🎯 Efficiency Metrics
              </h4>
              <div style={{ display: 'grid', gap: '8px' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '14px',
                    }}
                  >
                    Order Accuracy:
                  </span>
                  <span
                    style={{
                      color: '#10b981',
                      fontSize: '14px',
                      fontWeight: '600',
                    }}
                  >
                    99.2%
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '14px',
                    }}
                  >
                    On-Time Shipping:
                  </span>
                  <span
                    style={{
                      color: '#10b981',
                      fontSize: '14px',
                      fontWeight: '600',
                    }}
                  >
                    96.8%
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '14px',
                    }}
                  >
                    Damage Rate:
                  </span>
                  <span
                    style={{
                      color: '#f59e0b',
                      fontSize: '14px',
                      fontWeight: '600',
                    }}
                  >
                    0.3%
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '24px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <h4
              style={{
                color: 'white',
                fontSize: '16px',
                fontWeight: '600',
                marginBottom: '16px',
              }}
            >
              📈 Daily Throughput Trends
            </h4>
            <div
              style={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '14px',
                textAlign: 'center',
                padding: '40px',
              }}
            >
              📊 Interactive charts and detailed analytics would be displayed
              here in the full implementation
            </div>
          </div>

          {/* Vendor Portal Integration Analytics */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '24px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              marginTop: '16px',
            }}
          >
            <h4
              style={{
                color: 'white',
                fontSize: '16px',
                fontWeight: '600',
                marginBottom: '16px',
              }}
            >
              🔗 Vendor Portal Integration Status
            </h4>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '12px',
              }}
            >
              <div style={{ textAlign: 'center', padding: '12px' }}>
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>👥</div>
                <div
                  style={{
                    color: 'white',
                    fontSize: '18px',
                    fontWeight: 'bold',
                  }}
                >
                  {vendorSessions.length}
                </div>
                <div
                  style={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '12px',
                  }}
                >
                  Active Vendor Sessions
                </div>
              </div>
              <div style={{ textAlign: 'center', padding: '12px' }}>
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>🏢</div>
                <div
                  style={{
                    color: 'white',
                    fontSize: '18px',
                    fontWeight: 'bold',
                  }}
                >
                  {shippers.length}
                </div>
                <div
                  style={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '12px',
                  }}
                >
                  Connected Shippers
                </div>
              </div>
              <div style={{ textAlign: 'center', padding: '12px' }}>
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>📦</div>
                <div
                  style={{
                    color: 'white',
                    fontSize: '18px',
                    fontWeight: 'bold',
                  }}
                >
                  {
                    warehouseItems.filter((item) =>
                      vendorSessions.find(
                        (s) => s.shipperId === item.customerId
                      )
                    ).length
                  }
                </div>
                <div
                  style={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '12px',
                  }}
                >
                  Portal-Linked Items
                </div>
              </div>
              <div style={{ textAlign: 'center', padding: '12px' }}>
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>🚚</div>
                <div
                  style={{
                    color: 'white',
                    fontSize: '18px',
                    fontWeight: 'bold',
                  }}
                >
                  {
                    shipmentFlows.filter((shipment) =>
                      vendorSessions.find(
                        (s) => s.shipperId === shipment.customerId
                      )
                    ).length
                  }
                </div>
                <div
                  style={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '12px',
                  }}
                >
                  Portal-Tracked Shipments
                </div>
              </div>
            </div>

            {/* Active Vendor Sessions List */}
            {vendorSessions.length > 0 && (
              <div style={{ marginTop: '20px' }}>
                <h5
                  style={{
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '600',
                    marginBottom: '12px',
                  }}
                >
                  🔗 Active Vendor Portal Sessions:
                </h5>
                <div style={{ display: 'grid', gap: '8px' }}>
                  {vendorSessions.slice(0, 3).map((session) => (
                    <div
                      key={session.shipperId}
                      style={{
                        background: 'rgba(59, 130, 246, 0.1)',
                        borderRadius: '6px',
                        padding: '8px 12px',
                        border: '1px solid rgba(59, 130, 246, 0.2)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div>
                        <div
                          style={{
                            color: 'white',
                            fontSize: '13px',
                            fontWeight: '600',
                          }}
                        >
                          {session.companyName}
                        </div>
                        <div
                          style={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            fontSize: '11px',
                          }}
                        >
                          ID: {session.shipperId} | {session.businessType}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div
                          style={{
                            color: '#10b981',
                            fontSize: '11px',
                            fontWeight: '600',
                          }}
                        >
                          🟢 Active
                        </div>
                        <div
                          style={{
                            color: 'rgba(255, 255, 255, 0.5)',
                            fontSize: '10px',
                          }}
                        >
                          {new Date(session.loginTime).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))}
                  {vendorSessions.length > 3 && (
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.5)',
                        fontSize: '12px',
                        textAlign: 'center',
                        padding: '8px',
                      }}
                    >
                      ... and {vendorSessions.length - 3} more active sessions
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Shipment Details Modal */}
      {showShipmentDetails && selectedShipment && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
        >
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '16px',
              padding: '32px',
              maxWidth: '800px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '24px',
              }}
            >
              <h3
                style={{
                  color: '#1e40af',
                  fontSize: '24px',
                  fontWeight: 'bold',
                  margin: 0,
                }}
              >
                Shipment Details: {selectedShipment.shipmentNumber}
              </h3>
              <button
                onClick={() => {
                  setShowShipmentDetails(false);
                  setSelectedShipment(null);
                }}
                style={{
                  background: 'linear-gradient(135deg, #6b7280, #4b5563)', // Gray gradient
                  color: 'white',
                  border: 'none',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow =
                    '0 4px 8px rgba(0, 0, 0, 0.15)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow =
                    '0 2px 4px rgba(0, 0, 0, 0.1)';
                }}
              >
                ✕ Close
              </button>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '24px',
                marginBottom: '24px',
              }}
            >
              <div>
                <h4
                  style={{
                    color: '#374151',
                    fontSize: '16px',
                    fontWeight: '600',
                    marginBottom: '12px',
                  }}
                >
                  Customer Information
                </h4>
                <div
                  style={{
                    background: '#f9fafb',
                    padding: '16px',
                    borderRadius: '8px',
                  }}
                >
                  <div style={{ marginBottom: '8px' }}>
                    <strong>Customer:</strong> {selectedShipment.customerName}
                  </div>
                  <div style={{ marginBottom: '8px' }}>
                    <strong>Customer ID:</strong> {selectedShipment.customerId}
                  </div>
                  <div style={{ marginBottom: '8px' }}>
                    <strong>Origin:</strong> {selectedShipment.origin}
                  </div>
                  <div>
                    <strong>Destination:</strong> {selectedShipment.destination}
                  </div>
                </div>
              </div>

              <div>
                <h4
                  style={{
                    color: '#374151',
                    fontSize: '16px',
                    fontWeight: '600',
                    marginBottom: '12px',
                  }}
                >
                  Shipment Details
                </h4>
                <div
                  style={{
                    background: '#f9fafb',
                    padding: '16px',
                    borderRadius: '8px',
                  }}
                >
                  <div style={{ marginBottom: '8px' }}>
                    <strong>Carrier:</strong> {selectedShipment.carrier}
                  </div>
                  {selectedShipment.trackingNumber && (
                    <div style={{ marginBottom: '8px' }}>
                      <strong>Tracking:</strong>{' '}
                      {selectedShipment.trackingNumber}
                    </div>
                  )}
                  <div style={{ marginBottom: '8px' }}>
                    <strong>Total Weight:</strong>{' '}
                    {selectedShipment.totalWeight} lbs
                  </div>
                  <div>
                    <strong>Total Value:</strong> $
                    {selectedShipment.totalValue.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            <h4
              style={{
                color: '#374151',
                fontSize: '16px',
                fontWeight: '600',
                marginBottom: '12px',
              }}
            >
              Items in Shipment
            </h4>
            <div style={{ display: 'grid', gap: '8px', marginBottom: '24px' }}>
              {selectedShipment.items.map((item) => (
                <div
                  key={item.id}
                  style={{
                    background: '#f9fafb',
                    borderRadius: '8px',
                    padding: '12px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                      {item.itemCode}
                    </div>
                    <div style={{ color: '#6b7280', fontSize: '14px' }}>
                      {item.description}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: '600' }}>
                      {item.quantity} {item.unitType}
                    </div>
                    <div style={{ color: '#10b981', fontSize: '14px' }}>
                      ${(item.value * item.quantity).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div
              style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'flex-end',
              }}
            >
              <button
                style={{
                  background: 'linear-gradient(135deg, #f7c52d, #f4a832)', // Yellow - Driver Management color
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow =
                    '0 6px 12px rgba(0, 0, 0, 0.15)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow =
                    '0 4px 6px rgba(0, 0, 0, 0.1)';
                }}
              >
                📋 Print BOL
              </button>
              <button
                style={{
                  background: 'linear-gradient(135deg, #dc2626, #b91c1c)', // Red - Compliance color
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow =
                    '0 6px 12px rgba(0, 0, 0, 0.15)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow =
                    '0 4px 6px rgba(0, 0, 0, 0.1)';
                }}
              >
                🚚 Update Status
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
