'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import GoogleMaps from '../components/GoogleMaps';
import StickyNote from '../components/StickyNote-Enhanced';
import VehicleInspectionChecklist from '../components/VehicleInspectionChecklist';

interface Vehicle {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'inactive' | 'maintenance';
  driver: string;
  location: string;
  fuelLevel: number;
  mileage: number;
  lastMaintenance: string;
  nextMaintenance: string;
  vin?: string;
  lastInspection?: string;
  inspectionStatus?: 'pass' | 'fail' | 'overdue' | 'pending';
  safeToOperate?: boolean;
}

interface DOTInspectionData {
  vehicleId: string;
  dotInspectionNumber: string;
  inspectionDate: string;
  nextInspectionDue: string;
  inspectionType: 'annual' | 'random' | 'targeted' | 'accident';
  inspectionResult: 'pass' | 'fail' | 'conditional' | 'out_of_service';
  violations: DOTViolation[];
  inspector: string;
  location: string;
  complianceScore: number;
  correctedViolations: DOTViolation[];
  outOfServiceStatus: boolean;
  reinspectionRequired: boolean;
}

interface DOTViolation {
  id: string;
  violationCode: string;
  description: string;
  severity: 'minor' | 'major' | 'out_of_service';
  category:
    | 'brakes'
    | 'tires'
    | 'lighting'
    | 'cargo_securement'
    | 'driver'
    | 'vehicle_maintenance';
  corrected: boolean;
  correctionDate?: string;
  fineAmount?: number;
}

interface MaintenanceComplianceData {
  vehicleId: string;
  preventiveMaintenance: {
    lastService: string;
    nextServiceDue: string;
    overdueDays: number;
    serviceType: 'routine' | 'major' | 'inspection';
    compliant: boolean;
  };
  safetyEquipment: {
    brakeSystem: {
      status: 'good' | 'warning' | 'critical';
      lastChecked: string;
    };
    tires: { status: 'good' | 'warning' | 'critical'; lastChecked: string };
    lights: { status: 'good' | 'warning' | 'critical'; lastChecked: string };
    emergencyEquipment: {
      status: 'good' | 'warning' | 'critical';
      lastChecked: string;
    };
  };
  emissionsCompliance: {
    lastTest: string;
    nextTestDue: string;
    status: 'compliant' | 'non_compliant' | 'overdue';
    certificate: string;
  };
}

interface MaintenanceTask {
  id: string;
  vehicleId: string;
  vehicleName: string;
  task: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  cost: string;
}

interface RecentWork {
  id: string;
  vehicleId: string;
  vehicleName: string;
  work: string;
  completedDate: string;
  cost: string;
  provider: string;
}

// DOT inspection data (cleared for production)
const mockDOTInspections: DOTInspectionData[] = [];

// Maintenance compliance data (cleared for production)
const mockMaintenanceCompliance: MaintenanceComplianceData[] = [];

export default function VehiclesPage() {
  // Vehicle data (cleared for production)
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  // Compliance state management
  const [dotInspections, setDotInspections] =
    useState<DOTInspectionData[]>(mockDOTInspections);
  const [maintenanceCompliance, setMaintenanceCompliance] = useState<
    MaintenanceComplianceData[]
  >(mockMaintenanceCompliance);
  const [selectedVehicleCompliance, setSelectedVehicleCompliance] = useState<
    string | null
  >(null);
  const [showComplianceModal, setShowComplianceModal] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState<
    'name' | 'fuelLevel' | 'mileage' | 'nextMaintenance' | 'driver'
  >('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVehicles, setSelectedVehicles] = useState<Set<string>>(
    new Set()
  );
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [activeTab, setActiveTab] = useState<
    'fleet' | 'maintenance' | 'inspections' | 'compliance'
  >('fleet');
  const [maintenanceView, setMaintenanceView] = useState<
    'dashboard' | 'schedule' | 'history'
  >('dashboard');
  const [inspectionView, setInspectionView] = useState<
    'dashboard' | 'history' | 'create'
  >('dashboard');
  const [showInspectionModal, setShowInspectionModal] = useState(false);
  const [selectedVehicleForInspection, setSelectedVehicleForInspection] =
    useState<Vehicle | null>(null);
  const [inspectionType, setInspectionType] = useState<
    | 'pre_trip'
    | 'post_trip'
    | 'damage_assessment'
    | 'maintenance'
    | 'dot_inspection'
  >('pre_trip');

  // Compliance functions
  const getDOTInspectionForVehicle = (
    vehicleId: string
  ): DOTInspectionData | null => {
    return (
      dotInspections.find((inspection) => inspection.vehicleId === vehicleId) ||
      null
    );
  };

  const getMaintenanceComplianceForVehicle = (
    vehicleId: string
  ): MaintenanceComplianceData | null => {
    return (
      maintenanceCompliance.find(
        (compliance) => compliance.vehicleId === vehicleId
      ) || null
    );
  };

  const getComplianceStatusColor = (
    result: DOTInspectionData['inspectionResult']
  ) => {
    switch (result) {
      case 'pass':
        return '#10b981'; // green
      case 'conditional':
        return '#f59e0b'; // amber
      case 'fail':
        return '#ef4444'; // red
      case 'out_of_service':
        return '#dc2626'; // dark red
      default:
        return '#6b7280'; // gray
    }
  };

  const getSafetyEquipmentColor = (status: 'good' | 'warning' | 'critical') => {
    switch (status) {
      case 'good':
        return '#10b981'; // green
      case 'warning':
        return '#f59e0b'; // amber
      case 'critical':
        return '#ef4444'; // red
      default:
        return '#6b7280'; // gray
    }
  };

  const handleScheduleDOTInspection = (vehicleId: string) => {
    console.info(`Scheduling DOT inspection for vehicle ${vehicleId}`);
    // TODO: Integrate with DOT inspection scheduling API
  };

  const handleViewComplianceDetails = (vehicleId: string) => {
    setSelectedVehicleCompliance(vehicleId);
    setShowComplianceModal(true);
  };

  // Production-ready maintenance data (cleared for production)
  const maintenanceData = {
    upcomingTasks: [] as MaintenanceTask[],
    recentWork: [] as RecentWork[],
    monthlySpending: 0,
    averageCostPerVehicle: 0,
    scheduledThisWeek: 0,
    overdueItems: 0,
  };

  // Initialize auto-refresh functionality
  useEffect(() => {
    // Remove demo data initialization for production

    const interval = setInterval(() => {
      // Simulate real-time data updates
      setVehicles((prevVehicles) =>
        prevVehicles.map((vehicle) => ({
          ...vehicle,
          fuelLevel: Math.max(
            10,
            Math.min(100, vehicle.fuelLevel + (Math.random() - 0.5) * 2)
          ), // Simulate fuel changes
          location:
            vehicle.status === 'active' ? vehicle.location : vehicle.location, // Keep location for active vehicles
        }))
      );
      setLastUpdated(new Date());
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Update bulk actions visibility when selection changes
  useEffect(() => {
    setShowBulkActions(selectedVehicles.size > 0);
  }, [selectedVehicles]);

  // Close modal when clicking outside
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsModalOpen(false);
        setSelectedVehicle(null);
      }
    };

    if (isModalOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  // Manual refresh function
  const handleManualRefresh = () => {
    setVehicles((prevVehicles) =>
      prevVehicles.map((vehicle) => ({
        ...vehicle,
        fuelLevel: Math.max(
          10,
          Math.min(100, vehicle.fuelLevel + (Math.random() - 0.5) * 5)
        ),
      }))
    );
    setLastUpdated(new Date());
  };

  // Open vehicle details modal
  const handleVehicleClick = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsModalOpen(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedVehicle(null);
  };

  // Handle vehicle selection
  const handleVehicleSelect = (vehicleId: string, isSelected: boolean) => {
    const newSelectedVehicles = new Set(selectedVehicles);
    if (isSelected) {
      newSelectedVehicles.add(vehicleId);
    } else {
      newSelectedVehicles.delete(vehicleId);
    }
    setSelectedVehicles(newSelectedVehicles);
  };

  // Select all vehicles
  const handleSelectAll = () => {
    if (selectedVehicles.size === filteredVehicles.length) {
      setSelectedVehicles(new Set());
    } else {
      setSelectedVehicles(new Set(filteredVehicles.map((v) => v.id)));
    }
  };

  // Clear selection
  const handleClearSelection = () => {
    setSelectedVehicles(new Set());
  };

  // Bulk actions handlers
  const handleBulkMaintenance = () => {
    const selectedVehiclesList = Array.from(selectedVehicles)
      .map((id) => filteredVehicles.find((v) => v.id === id)?.name)
      .join(', ');

    alert(
      `🔧 Bulk Maintenance Scheduled\n\nThe following vehicles have been scheduled for maintenance:\n${selectedVehiclesList}\n\nThis would normally:\n• Update vehicle status to 'maintenance'\n• Notify drivers\n• Schedule maintenance appointments\n• Update fleet availability`
    );
    handleClearSelection();
  };

  const handleBulkDriverReassignment = () => {
    const selectedVehiclesList = Array.from(selectedVehicles)
      .map((id) => filteredVehicles.find((v) => v.id === id)?.name)
      .join(', ');

    alert(
      `👥 Bulk Driver Reassignment\n\nReassigning drivers for vehicles:\n${selectedVehiclesList}\n\nThis would normally:\n• Show available drivers list\n• Allow bulk reassignment\n• Update driver schedules\n• Send notifications`
    );
    handleClearSelection();
  };

  const handleBulkExport = () => {
    const selectedVehiclesData = Array.from(selectedVehicles).map((id) =>
      filteredVehicles.find((v) => v.id === id)
    );

    const csvData = selectedVehiclesData
      .map(
        (vehicle) =>
          `${vehicle?.id},${vehicle?.name},${vehicle?.type},${vehicle?.status},${vehicle?.driver},${vehicle?.location},${vehicle?.fuelLevel},${vehicle?.mileage},${vehicle?.lastMaintenance},${vehicle?.nextMaintenance}`
      )
      .join('\n');

    const headers =
      'ID,Name,Type,Status,Driver,Location,Fuel Level,Mileage,Last Maintenance,Next Maintenance\n';
    const fullCsvData = headers + csvData;

    const blob = new Blob([fullCsvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fleet-vehicles-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    handleClearSelection();
  };

  // Generate mock maintenance history
  const generateMaintenanceHistory = (vehicle: Vehicle) => {
    const history = [
      {
        date: vehicle.lastMaintenance,
        type: 'Oil Change & Filter',
        cost: '$89.99',
        mileage: vehicle.mileage - 5000,
        notes: 'Routine maintenance completed',
      },
      {
        date: '2024-04-01',
        type: 'Tire Rotation',
        cost: '$45.00',
        mileage: vehicle.mileage - 8000,
        notes: 'All tires rotated and balanced',
      },
      {
        date: '2024-02-15',
        type: 'Brake Inspection',
        cost: '$125.50',
        mileage: vehicle.mileage - 12000,
        notes: 'Brake pads replaced - front axle',
      },
      {
        date: '2024-01-10',
        type: 'Annual DOT Inspection',
        cost: '$275.00',
        mileage: vehicle.mileage - 15000,
        notes: 'Passed DOT inspection with minor repairs',
      },
    ];
    return history;
  };

  // Generate mock performance metrics
  const generatePerformanceMetrics = (vehicle: Vehicle) => {
    return {
      avgFuelEfficiency: (6.2 + Math.random() * 2).toFixed(1),
      totalMilesDriven: (vehicle.mileage * 0.8).toLocaleString(),
      averageSpeed: (55 + Math.random() * 10).toFixed(1),
      idleTime: (8 + Math.random() * 4).toFixed(1),
      deliveriesCompleted: Math.floor(200 + Math.random() * 100),
      onTimeDeliveries: (92 + Math.random() * 6).toFixed(1),
    };
  };

  // Check if maintenance is overdue or approaching
  const getMaintenanceStatus = (nextMaintenance: string) => {
    const today = new Date();
    const maintenanceDate = new Date(nextMaintenance);
    const diffTime = maintenanceDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'overdue';
    if (diffDays <= 7) return 'approaching';
    return 'normal';
  };

  // Enhanced sorting function
  const sortedVehicles = [...vehicles].sort((a, b) => {
    let aValue: any = a[sortBy];
    let bValue: any = b[sortBy];

    if (sortBy === 'nextMaintenance') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }

    if (sortBy === 'fuelLevel' || sortBy === 'mileage') {
      aValue = Number(aValue);
      bValue = Number(bValue);
    }

    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const filteredVehicles = sortedVehicles.filter((vehicle) => {
    const matchesSearch =
      vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.driver.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || vehicle.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getFuelLevelColor = (level: number) => {
    if (level < 25) return '#ef4444';
    if (level < 50) return '#f59e0b';
    return '#10b981';
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'active':
        return {
          background: 'rgba(74, 222, 128, 0.2)',
          color: '#4ade80',
          border: '1px solid #4ade80',
        };
      case 'inactive':
        return {
          background: 'rgba(156, 163, 175, 0.2)',
          color: '#9ca3af',
          border: '1px solid #9ca3af',
        };
      case 'maintenance':
        return {
          background: 'rgba(251, 191, 36, 0.2)',
          color: '#fbbf24',
          border: '1px solid #fbbf24',
        };
      default:
        return {
          background: 'rgba(156, 163, 175, 0.2)',
          color: '#9ca3af',
          border: '1px solid #9ca3af',
        };
    }
  };

  const handleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
          input::placeholder {
            color: rgba(255, 255, 255, 0.8) !important;
            opacity: 1 !important;
          }
          input::-webkit-input-placeholder {
            color: rgba(255, 255, 255, 0.8) !important;
          }
          input::-moz-placeholder {
            color: rgba(255, 255, 255, 0.8) !important;
          }
          input:-ms-input-placeholder {
            color: rgba(255, 255, 255, 0.8) !important;
          }

          select option {
            background: #1e3a8a !important;
            color: white !important;
            padding: 8px !important;
          }

          @keyframes pulse {
            0% {
              transform: scale(1);
              opacity: 1;
            }
            50% {
              transform: scale(1.1);
              opacity: 0.8;
            }
            100% {
              transform: scale(1);
              opacity: 1;
            }
          }

          .maintenance-alert {
            animation: pulse 2s infinite;
          }

          .sort-button {
            background: none;
            border: none;
            color: rgba(255, 255, 255, 0.8);
            cursor: pointer;
            font-size: 14px;
            padding: 4px 8px;
            border-radius: 4px;
            transition: all 0.2s ease;
          }

          .sort-button:hover {
            background: rgba(255, 255, 255, 0.1);
            color: white;
          }

                     .sort-button.active {
             background: rgba(255, 255, 255, 0.2);
             color: white;
           }

           @keyframes slideUp {
             from {
               transform: translateX(-50%) translateY(20px);
               opacity: 0;
             }
             to {
               transform: translateX(-50%) translateY(0);
               opacity: 1;
             }
          }
        `,
        }}
      />

      <div
        style={{
          minHeight: '100vh',
          background:
            'linear-gradient(135deg, #022c22 0%, #032e2a 25%, #044e46 50%, #042f2e 75%, #0a1612 100%)',
          backgroundAttachment: 'fixed',
          paddingTop: '80px',
          position: 'relative',
        }}
      >
        {/* Back Button */}
        <div style={{ padding: '24px' }}>
          <Link href='/fleetflowdash' style={{ textDecoration: 'none' }}>
            <button
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontSize: '16px',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow =
                  '0 8px 25px rgba(0, 0, 0, 0.2)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <span style={{ marginRight: '8px' }}>←</span>
              Back to Dashboard
            </button>
          </Link>
        </div>

        {/* Main Container */}
        <div
          style={{
            maxWidth: '1400px',
            margin: '0 auto',
            padding: '0 24px 32px',
          }}
        >
          {/* Header */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
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
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '24px' }}
              >
                <div
                  style={{
                    padding: '16px',
                    background: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px',
                  }}
                >
                  <span style={{ fontSize: '32px' }}>🚛</span>
                </div>
                <div>
                  <h1
                    style={{
                      fontSize: '36px',
                      fontWeight: 'bold',
                      color: 'white',
                      margin: '0 0 8px 0',
                      textShadow: '0 4px 8px rgba(0,0,0,0.3)',
                    }}
                  >
                    Fleet Management
                  </h1>
                  <p
                    style={{
                      fontSize: '18px',
                      color: 'rgba(255, 255, 255, 0.9)',
                      margin: '0 0 8px 0',
                    }}
                  >
                    Monitor and manage your entire fleet in real-time
                  </p>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '24px',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <div
                        style={{
                          width: '12px',
                          height: '12px',
                          background: '#4ade80',
                          borderRadius: '50%',
                          animation: 'pulse 2s infinite',
                        }}
                      />
                      <span
                        style={{
                          fontSize: '14px',
                          color: 'rgba(255, 255, 255, 0.8)',
                        }}
                      >
                        Live Load Tracking
                      </span>
                    </div>
                    <span
                      style={{
                        fontSize: '14px',
                        color: 'rgba(255, 255, 255, 0.7)',
                      }}
                    >
                      {vehicles.length} Vehicles Active
                    </span>
                    <span
                      style={{
                        fontSize: '14px',
                        color: 'rgba(255, 255, 255, 0.6)',
                      }}
                    >
                      Last Updated: {lastUpdated.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={handleManualRefresh}
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    color: 'white',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    fontSize: '14px',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background =
                      'rgba(255, 255, 255, 0.3)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background =
                      'rgba(255, 255, 255, 0.2)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  🔄 Refresh
                </button>
                <button
                  style={{
                    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                    color: 'white',
                    padding: '12px 24px',
                    borderRadius: '12px',
                    border: 'none',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow =
                      '0 8px 25px rgba(0, 0, 0, 0.2)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  + Add Vehicle
                </button>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '8px',
              marginBottom: '32px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              display: 'flex',
              gap: '8px',
            }}
          >
            <button
              onClick={() => setActiveTab('fleet')}
              style={{
                background:
                  activeTab === 'fleet'
                    ? 'rgba(255, 255, 255, 0.3)'
                    : 'transparent',
                color: 'white',
                border: 'none',
                padding: '16px 32px',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                flex: 1,
                textAlign: 'center',
              }}
              onMouseOver={(e) => {
                if (activeTab !== 'fleet') {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                }
              }}
              onMouseOut={(e) => {
                if (activeTab !== 'fleet') {
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              🚛 Fleet Overview
            </button>
            <button
              onClick={() => setActiveTab('maintenance')}
              style={{
                background:
                  activeTab === 'maintenance'
                    ? 'rgba(255, 255, 255, 0.3)'
                    : 'transparent',
                color: 'white',
                border: 'none',
                padding: '16px 32px',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                flex: 1,
                textAlign: 'center',
              }}
              onMouseOver={(e) => {
                if (activeTab !== 'maintenance') {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                }
              }}
              onMouseOut={(e) => {
                if (activeTab !== 'maintenance') {
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              🔧 Maintenance Management
            </button>
            <button
              onClick={() => setActiveTab('inspections')}
              style={{
                background:
                  activeTab === 'inspections'
                    ? 'rgba(255, 255, 255, 0.15)'
                    : 'transparent',
                color: 'white',
                border: 'none',
                padding: '16px 32px',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                flex: 1,
                textAlign: 'center',
              }}
              onMouseOver={(e) => {
                if (activeTab !== 'inspections') {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                }
              }}
              onMouseOut={(e) => {
                if (activeTab !== 'inspections') {
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              🔍 Vehicle Inspections
            </button>
            <button
              onClick={() => setActiveTab('compliance')}
              style={{
                background:
                  activeTab === 'compliance'
                    ? 'rgba(255, 255, 255, 0.15)'
                    : 'transparent',
                color: 'white',
                border: 'none',
                padding: '16px 32px',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                flex: 1,
                textAlign: 'center',
              }}
              onMouseOver={(e) => {
                if (activeTab !== 'compliance') {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                }
              }}
              onMouseOut={(e) => {
                if (activeTab !== 'compliance') {
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              🛡️ DOT Compliance
            </button>
          </div>

          {/* MAINTENANCE MANAGEMENT SECTION */}
          {activeTab === 'maintenance' && (
            <div>
              {/* Maintenance Sub-Navigation */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  padding: '16px',
                  marginBottom: '32px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    gap: '12px',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                  }}
                >
                  <button
                    onClick={() => setMaintenanceView('dashboard')}
                    style={{
                      background:
                        maintenanceView === 'dashboard'
                          ? 'rgba(34, 197, 94, 0.3)'
                          : 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      padding: '12px 20px',
                      borderRadius: '12px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    📊 Dashboard
                  </button>
                  <button
                    onClick={() => setMaintenanceView('schedule')}
                    style={{
                      background:
                        maintenanceView === 'schedule'
                          ? 'rgba(34, 197, 94, 0.3)'
                          : 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      padding: '12px 20px',
                      borderRadius: '12px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    📅 Schedule
                  </button>
                  <button
                    onClick={() => setMaintenanceView('history')}
                    style={{
                      background:
                        maintenanceView === 'history'
                          ? 'rgba(34, 197, 94, 0.3)'
                          : 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      padding: '12px 20px',
                      borderRadius: '12px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    📋 History
                  </button>
                  <button
                    style={{
                      background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                      color: 'white',
                      border: 'none',
                      padding: '12px 20px',
                      borderRadius: '12px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      marginLeft: 'auto',
                    }}
                  >
                    ➕ Schedule Maintenance
                  </button>
                </div>
              </div>

              {/* Maintenance Dashboard */}
              {maintenanceView === 'dashboard' && (
                <div>
                  {/* Maintenance KPIs */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(280px, 1fr))',
                      gap: '24px',
                      marginBottom: '32px',
                    }}
                  >
                    <div
                      style={{
                        background: 'rgba(239, 68, 68, 0.15)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '16px',
                        padding: '24px',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: '16px',
                        }}
                      >
                        <h3
                          style={{
                            color: 'white',
                            fontSize: '18px',
                            fontWeight: '600',
                            margin: 0,
                          }}
                        >
                          Overdue Items
                        </h3>
                        <span style={{ fontSize: '24px' }}>⚠️</span>
                      </div>
                      <div
                        style={{
                          fontSize: '36px',
                          fontWeight: 'bold',
                          color: '#ef4444',
                          marginBottom: '8px',
                        }}
                      >
                        {maintenanceData.overdueItems}
                      </div>
                      <div
                        style={{
                          fontSize: '14px',
                          color: 'rgba(255, 255, 255, 0.8)',
                        }}
                      >
                        Requires immediate attention
                      </div>
                    </div>

                    <div
                      style={{
                        background: 'rgba(251, 191, 36, 0.15)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '16px',
                        padding: '24px',
                        border: '1px solid rgba(251, 191, 36, 0.3)',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: '16px',
                        }}
                      >
                        <h3
                          style={{
                            color: 'white',
                            fontSize: '18px',
                            fontWeight: '600',
                            margin: 0,
                          }}
                        >
                          This Week
                        </h3>
                        <span style={{ fontSize: '24px' }}>📅</span>
                      </div>
                      <div
                        style={{
                          fontSize: '36px',
                          fontWeight: 'bold',
                          color: '#fbbf24',
                          marginBottom: '8px',
                        }}
                      >
                        {maintenanceData.scheduledThisWeek}
                      </div>
                      <div
                        style={{
                          fontSize: '14px',
                          color: 'rgba(255, 255, 255, 0.8)',
                        }}
                      >
                        Scheduled maintenance tasks
                      </div>
                    </div>

                    <div
                      style={{
                        background: 'rgba(34, 197, 94, 0.15)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '16px',
                        padding: '24px',
                        border: '1px solid rgba(34, 197, 94, 0.3)',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: '16px',
                        }}
                      >
                        <h3
                          style={{
                            color: 'white',
                            fontSize: '18px',
                            fontWeight: '600',
                            margin: 0,
                          }}
                        >
                          Monthly Spending
                        </h3>
                        <span style={{ fontSize: '24px' }}>💰</span>
                      </div>
                      <div
                        style={{
                          fontSize: '36px',
                          fontWeight: 'bold',
                          color: '#22c55e',
                          marginBottom: '8px',
                        }}
                      >
                        ${maintenanceData.monthlySpending.toLocaleString()}
                      </div>
                      <div
                        style={{
                          fontSize: '14px',
                          color: 'rgba(255, 255, 255, 0.8)',
                        }}
                      >
                        Average: ${maintenanceData.averageCostPerVehicle}
                        /vehicle
                      </div>
                    </div>
                  </div>

                  {/* Upcoming Tasks */}
                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.15)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '16px',
                      padding: '24px',
                      marginBottom: '32px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    <h3
                      style={{
                        color: 'white',
                        fontSize: '20px',
                        fontWeight: '600',
                        marginBottom: '20px',
                      }}
                    >
                      🔧 Upcoming Maintenance Tasks
                    </h3>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px',
                      }}
                    >
                      {maintenanceData.upcomingTasks.map((task) => (
                        <div
                          key={task.id}
                          style={{
                            background: 'rgba(255, 255, 255, 0.1)',
                            borderRadius: '12px',
                            padding: '20px',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}
                        >
                          <div style={{ flex: 1 }}>
                            <div
                              style={{
                                fontSize: '16px',
                                fontWeight: '600',
                                color: 'white',
                                marginBottom: '4px',
                              }}
                            >
                              {task.vehicleName} - {task.task}
                            </div>
                            <div
                              style={{
                                fontSize: '14px',
                                color: 'rgba(255, 255, 255, 0.7)',
                              }}
                            >
                              Due: {new Date(task.dueDate).toLocaleDateString()}{' '}
                              • Estimated Cost: {task.cost}
                            </div>
                          </div>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                            }}
                          >
                            <span
                              style={{
                                background:
                                  task.priority === 'critical'
                                    ? 'rgba(239, 68, 68, 0.3)'
                                    : task.priority === 'high'
                                      ? 'rgba(251, 191, 36, 0.3)'
                                      : 'rgba(34, 197, 94, 0.3)',
                                color:
                                  task.priority === 'critical'
                                    ? '#ef4444'
                                    : task.priority === 'high'
                                      ? '#fbbf24'
                                      : '#22c55e',
                                padding: '6px 12px',
                                borderRadius: '8px',
                                fontSize: '12px',
                                fontWeight: '600',
                                textTransform: 'uppercase',
                              }}
                            >
                              {task.priority}
                            </span>
                            <button
                              style={{
                                background:
                                  'linear-gradient(135deg, #3b82f6, #2563eb)',
                                color: 'white',
                                border: 'none',
                                padding: '8px 16px',
                                borderRadius: '8px',
                                fontSize: '14px',
                                fontWeight: '600',
                                cursor: 'pointer',
                              }}
                            >
                              Schedule
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent Work */}
                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.15)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '16px',
                      padding: '24px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    <h3
                      style={{
                        color: 'white',
                        fontSize: '20px',
                        fontWeight: '600',
                        marginBottom: '20px',
                      }}
                    >
                      ✅ Recent Completed Work
                    </h3>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px',
                      }}
                    >
                      {maintenanceData.recentWork.map((work) => (
                        <div
                          key={work.id}
                          style={{
                            background: 'rgba(255, 255, 255, 0.1)',
                            borderRadius: '12px',
                            padding: '20px',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}
                        >
                          <div style={{ flex: 1 }}>
                            <div
                              style={{
                                fontSize: '16px',
                                fontWeight: '600',
                                color: 'white',
                                marginBottom: '4px',
                              }}
                            >
                              {work.vehicleName} - {work.work}
                            </div>
                            <div
                              style={{
                                fontSize: '14px',
                                color: 'rgba(255, 255, 255, 0.7)',
                              }}
                            >
                              Completed:{' '}
                              {new Date(
                                work.completedDate
                              ).toLocaleDateString()}{' '}
                              • Provider: {work.provider}
                            </div>
                          </div>
                          <div
                            style={{
                              fontSize: '16px',
                              fontWeight: '600',
                              color: '#22c55e',
                            }}
                          >
                            {work.cost}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Maintenance Schedule View */}
              {maintenanceView === 'schedule' && (
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '16px',
                    padding: '32px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>
                    📅
                  </div>
                  <h3
                    style={{
                      color: 'white',
                      fontSize: '24px',
                      fontWeight: '600',
                      marginBottom: '16px',
                    }}
                  >
                    Maintenance Schedule
                  </h3>
                  <p
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '16px',
                      marginBottom: '24px',
                    }}
                  >
                    Interactive calendar view for scheduling and managing
                    maintenance appointments coming soon.
                  </p>
                  <button
                    style={{
                      background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                      color: 'white',
                      border: 'none',
                      padding: '12px 24px',
                      borderRadius: '12px',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: 'pointer',
                    }}
                  >
                    Open Full Calendar
                  </button>
                </div>
              )}

              {/* Maintenance History View */}
              {maintenanceView === 'history' && (
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '16px',
                    padding: '32px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>
                    📋
                  </div>
                  <h3
                    style={{
                      color: 'white',
                      fontSize: '24px',
                      fontWeight: '600',
                      marginBottom: '16px',
                    }}
                  >
                    Maintenance History
                  </h3>
                  <p
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '16px',
                      marginBottom: '24px',
                    }}
                  >
                    Comprehensive maintenance records, reports, and analytics
                    for your entire fleet.
                  </p>
                  <div
                    style={{
                      display: 'flex',
                      gap: '16px',
                      justifyContent: 'center',
                    }}
                  >
                    <button
                      style={{
                        background: 'rgba(255, 255, 255, 0.2)',
                        color: 'white',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        padding: '12px 24px',
                        borderRadius: '12px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                      }}
                    >
                      📊 Generate Report
                    </button>
                    <button
                      style={{
                        background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                        color: 'white',
                        border: 'none',
                        padding: '12px 24px',
                        borderRadius: '12px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                      }}
                    >
                      📥 Export Data
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* VEHICLE INSPECTIONS SECTION */}
          {activeTab === 'inspections' && (
            <div>
              {/* Inspections Sub-Navigation */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  padding: '20px',
                  marginBottom: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    gap: '16px',
                    alignItems: 'center',
                  }}
                >
                  <button
                    onClick={() => setInspectionView('dashboard')}
                    style={{
                      background:
                        inspectionView === 'dashboard'
                          ? 'rgba(255, 255, 255, 0.2)'
                          : 'transparent',
                      color: 'white',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      padding: '12px 24px',
                      borderRadius: '12px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                    }}
                  >
                    📊 Dashboard
                  </button>
                  <button
                    onClick={() => setInspectionView('history')}
                    style={{
                      background:
                        inspectionView === 'history'
                          ? 'rgba(255, 255, 255, 0.2)'
                          : 'transparent',
                      color: 'white',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      padding: '12px 24px',
                      borderRadius: '12px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                    }}
                  >
                    📋 History
                  </button>
                  <button
                    onClick={() => setInspectionView('create')}
                    style={{
                      background:
                        inspectionView === 'create'
                          ? 'rgba(255, 255, 255, 0.2)'
                          : 'transparent',
                      color: 'white',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      padding: '12px 24px',
                      borderRadius: '12px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                    }}
                  >
                    ➕ New Inspection
                  </button>
                  <button
                    onClick={() => {
                      setSelectedVehicleForInspection(null);
                      setInspectionType('pre_trip');
                      setShowInspectionModal(true);
                    }}
                    style={{
                      background: 'linear-gradient(135deg, #10b981, #059669)',
                      color: 'white',
                      border: 'none',
                      padding: '12px 24px',
                      borderRadius: '12px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      marginLeft: 'auto',
                    }}
                  >
                    🔍 Quick Inspection
                  </button>
                </div>
              </div>

              {/* Inspections Dashboard */}
              {inspectionView === 'dashboard' && (
                <div>
                  {/* Inspection KPIs */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: '20px',
                      marginBottom: '32px',
                    }}
                  >
                    {/* Vehicles Needing Inspection */}
                    <div
                      style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        borderRadius: '16px',
                        padding: '24px',
                        textAlign: 'center',
                      }}
                    >
                      <div style={{ fontSize: '32px', marginBottom: '8px' }}>
                        ⚠️
                      </div>
                      <h3
                        style={{
                          color: '#ef4444',
                          margin: '0 0 8px 0',
                          fontSize: '28px',
                          fontWeight: '700',
                        }}
                      >
                        {
                          vehicles.filter(
                            (v) =>
                              v.inspectionStatus === 'pending' ||
                              v.inspectionStatus === 'overdue'
                          ).length
                        }
                      </h3>
                      <p
                        style={{
                          color: 'rgba(239, 68, 68, 0.8)',
                          margin: 0,
                          fontSize: '14px',
                        }}
                      >
                        Need Inspection
                      </p>
                    </div>

                    {/* Failed Inspections */}
                    <div
                      style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        borderRadius: '16px',
                        padding: '24px',
                        textAlign: 'center',
                      }}
                    >
                      <div style={{ fontSize: '32px', marginBottom: '8px' }}>
                        ❌
                      </div>
                      <h3
                        style={{
                          color: '#ef4444',
                          margin: '0 0 8px 0',
                          fontSize: '28px',
                          fontWeight: '700',
                        }}
                      >
                        {
                          vehicles.filter((v) => v.inspectionStatus === 'fail')
                            .length
                        }
                      </h3>
                      <p
                        style={{
                          color: 'rgba(239, 68, 68, 0.8)',
                          margin: 0,
                          fontSize: '14px',
                        }}
                      >
                        Failed Inspections
                      </p>
                    </div>

                    {/* Passed Inspections */}
                    <div
                      style={{
                        background: 'rgba(16, 185, 129, 0.1)',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        borderRadius: '16px',
                        padding: '24px',
                        textAlign: 'center',
                      }}
                    >
                      <div style={{ fontSize: '32px', marginBottom: '8px' }}>
                        ✅
                      </div>
                      <h3
                        style={{
                          color: '#10b981',
                          margin: '0 0 8px 0',
                          fontSize: '28px',
                          fontWeight: '700',
                        }}
                      >
                        {
                          vehicles.filter((v) => v.inspectionStatus === 'pass')
                            .length
                        }
                      </h3>
                      <p
                        style={{
                          color: 'rgba(16, 185, 129, 0.8)',
                          margin: 0,
                          fontSize: '14px',
                        }}
                      >
                        Passed Inspections
                      </p>
                    </div>

                    {/* Safe to Operate */}
                    <div
                      style={{
                        background: 'rgba(59, 130, 246, 0.1)',
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                        borderRadius: '16px',
                        padding: '24px',
                        textAlign: 'center',
                      }}
                    >
                      <div style={{ fontSize: '32px', marginBottom: '8px' }}>
                        🚛
                      </div>
                      <h3
                        style={{
                          color: '#3b82f6',
                          margin: '0 0 8px 0',
                          fontSize: '28px',
                          fontWeight: '700',
                        }}
                      >
                        {vehicles.filter((v) => v.safeToOperate).length}
                      </h3>
                      <p
                        style={{
                          color: 'rgba(59, 130, 246, 0.8)',
                          margin: 0,
                          fontSize: '14px',
                        }}
                      >
                        Safe to Operate
                      </p>
                    </div>
                  </div>

                  {/* Vehicle Inspection Status Table */}
                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.15)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '16px',
                      padding: '24px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                      marginBottom: '24px',
                    }}
                  >
                    <h3
                      style={{
                        color: 'white',
                        fontSize: '20px',
                        fontWeight: '600',
                        marginBottom: '20px',
                      }}
                    >
                      🔍 Vehicle Inspection Status
                    </h3>

                    <div style={{ overflowX: 'auto' }}>
                      <table
                        style={{ width: '100%', borderCollapse: 'collapse' }}
                      >
                        <thead>
                          <tr
                            style={{
                              borderBottom:
                                '2px solid rgba(255, 255, 255, 0.2)',
                            }}
                          >
                            <th
                              style={{
                                color: 'white',
                                padding: '12px',
                                textAlign: 'left',
                                fontSize: '14px',
                                fontWeight: '600',
                              }}
                            >
                              Vehicle
                            </th>
                            <th
                              style={{
                                color: 'white',
                                padding: '12px',
                                textAlign: 'left',
                                fontSize: '14px',
                                fontWeight: '600',
                              }}
                            >
                              VIN
                            </th>
                            <th
                              style={{
                                color: 'white',
                                padding: '12px',
                                textAlign: 'center',
                                fontSize: '14px',
                                fontWeight: '600',
                              }}
                            >
                              Last Inspection
                            </th>
                            <th
                              style={{
                                color: 'white',
                                padding: '12px',
                                textAlign: 'center',
                                fontSize: '14px',
                                fontWeight: '600',
                              }}
                            >
                              Status
                            </th>
                            <th
                              style={{
                                color: 'white',
                                padding: '12px',
                                textAlign: 'center',
                                fontSize: '14px',
                                fontWeight: '600',
                              }}
                            >
                              Safe to Operate
                            </th>
                            <th
                              style={{
                                color: 'white',
                                padding: '12px',
                                textAlign: 'center',
                                fontSize: '14px',
                                fontWeight: '600',
                              }}
                            >
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {vehicles.map((vehicle) => (
                            <tr
                              key={vehicle.id}
                              style={{
                                borderBottom:
                                  '1px solid rgba(255, 255, 255, 0.1)',
                                transition: 'background-color 0.2s ease',
                              }}
                              onMouseOver={(e) => {
                                e.currentTarget.style.backgroundColor =
                                  'rgba(255, 255, 255, 0.05)';
                              }}
                              onMouseOut={(e) => {
                                e.currentTarget.style.backgroundColor =
                                  'transparent';
                              }}
                            >
                              <td style={{ padding: '12px', color: 'white' }}>
                                <div>
                                  <div
                                    style={{
                                      fontWeight: '600',
                                      fontSize: '14px',
                                    }}
                                  >
                                    {vehicle.name}
                                  </div>
                                  <div
                                    style={{ fontSize: '12px', opacity: 0.7 }}
                                  >
                                    {vehicle.type}
                                  </div>
                                </div>
                              </td>
                              <td
                                style={{
                                  padding: '12px',
                                  color: 'rgba(255, 255, 255, 0.8)',
                                  fontSize: '12px',
                                  fontFamily: 'monospace',
                                }}
                              >
                                {vehicle.vin || 'N/A'}
                              </td>
                              <td
                                style={{
                                  padding: '12px',
                                  textAlign: 'center',
                                  color: 'rgba(255, 255, 255, 0.8)',
                                  fontSize: '14px',
                                }}
                              >
                                {vehicle.lastInspection || 'Never'}
                              </td>
                              <td
                                style={{ padding: '12px', textAlign: 'center' }}
                              >
                                <span
                                  style={{
                                    background:
                                      vehicle.inspectionStatus === 'pass'
                                        ? 'rgba(16, 185, 129, 0.2)'
                                        : vehicle.inspectionStatus === 'fail'
                                          ? 'rgba(239, 68, 68, 0.2)'
                                          : vehicle.inspectionStatus ===
                                              'overdue'
                                            ? 'rgba(245, 158, 11, 0.2)'
                                            : 'rgba(107, 114, 128, 0.2)',
                                    color:
                                      vehicle.inspectionStatus === 'pass'
                                        ? '#10b981'
                                        : vehicle.inspectionStatus === 'fail'
                                          ? '#ef4444'
                                          : vehicle.inspectionStatus ===
                                              'overdue'
                                            ? '#f59e0b'
                                            : '#6b7280',
                                    padding: '4px 12px',
                                    borderRadius: '20px',
                                    fontSize: '12px',
                                    fontWeight: '600',
                                    textTransform: 'uppercase',
                                  }}
                                >
                                  {vehicle.inspectionStatus || 'Unknown'}
                                </span>
                              </td>
                              <td
                                style={{ padding: '12px', textAlign: 'center' }}
                              >
                                <span style={{ fontSize: '20px' }}>
                                  {vehicle.safeToOperate ? '✅' : '❌'}
                                </span>
                              </td>
                              <td
                                style={{ padding: '12px', textAlign: 'center' }}
                              >
                                <div
                                  style={{
                                    display: 'flex',
                                    gap: '8px',
                                    justifyContent: 'center',
                                  }}
                                >
                                  <button
                                    onClick={() => {
                                      setSelectedVehicleForInspection(vehicle);
                                      setInspectionType('pre_trip');
                                      setShowInspectionModal(true);
                                    }}
                                    style={{
                                      background:
                                        'linear-gradient(135deg, #10b981, #059669)',
                                      color: 'white',
                                      border: 'none',
                                      padding: '6px 12px',
                                      borderRadius: '8px',
                                      fontSize: '12px',
                                      fontWeight: '600',
                                      cursor: 'pointer',
                                    }}
                                  >
                                    🔍 Inspect
                                  </button>
                                  <button
                                    onClick={() => {
                                      alert(
                                        `📋 Inspection History for ${vehicle.name}\n\nThis would show:\n• Complete inspection history\n• Photos and documentation\n• Deficiency tracking\n• Compliance reports`
                                      );
                                    }}
                                    style={{
                                      background: 'rgba(59, 130, 246, 0.2)',
                                      color: '#3b82f6',
                                      border:
                                        '1px solid rgba(59, 130, 246, 0.3)',
                                      padding: '6px 12px',
                                      borderRadius: '8px',
                                      fontSize: '12px',
                                      fontWeight: '600',
                                      cursor: 'pointer',
                                    }}
                                  >
                                    📋 History
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Inspections History View */}
              {inspectionView === 'history' && (
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '16px',
                    padding: '32px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>
                    📋
                  </div>
                  <h3
                    style={{
                      color: 'white',
                      fontSize: '24px',
                      fontWeight: '600',
                      marginBottom: '16px',
                    }}
                  >
                    Inspection History
                  </h3>
                  <p
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '16px',
                      marginBottom: '24px',
                    }}
                  >
                    Complete inspection records, compliance reports, and audit
                    trails for your entire fleet.
                  </p>
                  <div
                    style={{
                      display: 'flex',
                      gap: '16px',
                      justifyContent: 'center',
                    }}
                  >
                    <button
                      style={{
                        background: 'rgba(255, 255, 255, 0.2)',
                        color: 'white',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        padding: '12px 24px',
                        borderRadius: '12px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                      }}
                    >
                      📊 Generate Report
                    </button>
                    <button
                      style={{
                        background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                        color: 'white',
                        border: 'none',
                        padding: '12px 24px',
                        borderRadius: '12px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                      }}
                    >
                      📥 Export Data
                    </button>
                  </div>
                </div>
              )}

              {/* New Inspection View */}
              {inspectionView === 'create' && (
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '16px',
                    padding: '32px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <h3
                    style={{
                      color: 'white',
                      fontSize: '24px',
                      fontWeight: '600',
                      marginBottom: '24px',
                      textAlign: 'center',
                    }}
                  >
                    🔍 Create New Inspection
                  </h3>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(250px, 1fr))',
                      gap: '16px',
                      marginBottom: '24px',
                    }}
                  >
                    {/* Vehicle Selection */}
                    <div>
                      <label
                        style={{
                          color: 'white',
                          fontSize: '14px',
                          fontWeight: '600',
                          marginBottom: '8px',
                          display: 'block',
                        }}
                      >
                        Select Vehicle:
                      </label>
                      <select
                        value={selectedVehicleForInspection?.id || ''}
                        onChange={(e) => {
                          const vehicle = vehicles.find(
                            (v) => v.id === e.target.value
                          );
                          setSelectedVehicleForInspection(vehicle || null);
                        }}
                        style={{
                          width: '100%',
                          padding: '12px',
                          borderRadius: '8px',
                          border: '1px solid rgba(255, 255, 255, 0.3)',
                          background: 'rgba(255, 255, 255, 0.1)',
                          color: 'white',
                          fontSize: '14px',
                        }}
                      >
                        <option
                          value=''
                          style={{ background: '#1e3a8a', color: 'white' }}
                        >
                          Select a vehicle...
                        </option>
                        {vehicles.map((vehicle) => (
                          <option
                            key={vehicle.id}
                            value={vehicle.id}
                            style={{ background: '#1e3a8a', color: 'white' }}
                          >
                            {vehicle.name} - {vehicle.type} ({vehicle.vin})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Inspection Type */}
                    <div>
                      <label
                        style={{
                          color: 'white',
                          fontSize: '14px',
                          fontWeight: '600',
                          marginBottom: '8px',
                          display: 'block',
                        }}
                      >
                        Inspection Type:
                      </label>
                      <select
                        value={inspectionType}
                        onChange={(e) =>
                          setInspectionType(e.target.value as any)
                        }
                        style={{
                          width: '100%',
                          padding: '12px',
                          borderRadius: '8px',
                          border: '1px solid rgba(255, 255, 255, 0.3)',
                          background: 'rgba(255, 255, 255, 0.1)',
                          color: 'white',
                          fontSize: '14px',
                        }}
                      >
                        <option
                          value='pre_trip'
                          style={{ background: '#1e3a8a', color: 'white' }}
                        >
                          Pre-Trip Inspection
                        </option>
                        <option
                          value='post_trip'
                          style={{ background: '#1e3a8a', color: 'white' }}
                        >
                          Post-Trip Inspection
                        </option>
                        <option
                          value='damage_assessment'
                          style={{ background: '#1e3a8a', color: 'white' }}
                        >
                          Damage Assessment
                        </option>
                        <option
                          value='maintenance'
                          style={{ background: '#1e3a8a', color: 'white' }}
                        >
                          Maintenance Inspection
                        </option>
                        <option
                          value='dot_inspection'
                          style={{ background: '#1e3a8a', color: 'white' }}
                        >
                          DOT Inspection
                        </option>
                      </select>
                    </div>
                  </div>

                  <div style={{ textAlign: 'center' }}>
                    <button
                      onClick={() => {
                        if (selectedVehicleForInspection) {
                          setShowInspectionModal(true);
                        } else {
                          alert('Please select a vehicle first');
                        }
                      }}
                      disabled={!selectedVehicleForInspection}
                      style={{
                        background: selectedVehicleForInspection
                          ? 'linear-gradient(135deg, #10b981, #059669)'
                          : 'rgba(107, 114, 128, 0.5)',
                        color: 'white',
                        border: 'none',
                        padding: '16px 32px',
                        borderRadius: '12px',
                        fontSize: '16px',
                        fontWeight: '600',
                        cursor: selectedVehicleForInspection
                          ? 'pointer'
                          : 'not-allowed',
                      }}
                    >
                      🚀 Start Inspection
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* DOT COMPLIANCE SECTION */}
          {activeTab === 'compliance' && (
            <div>
              {/* Compliance Overview Cards */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '20px',
                  marginBottom: '30px',
                }}
              >
                {/* Overall Compliance Score */}
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '20px',
                    padding: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    textAlign: 'center',
                  }}
                >
                  <h3
                    style={{
                      color: 'white',
                      fontSize: '18px',
                      fontWeight: '600',
                      margin: '0 0 16px 0',
                    }}
                  >
                    📊 Fleet Compliance Score
                  </h3>
                  <div
                    style={{
                      fontSize: '48px',
                      fontWeight: '700',
                      color: '#10b981',
                      marginBottom: '8px',
                    }}
                  >
                    {Math.round(
                      dotInspections.reduce(
                        (acc, insp) => acc + insp.complianceScore,
                        0
                      ) / dotInspections.length
                    )}
                    %
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '14px',
                    }}
                  >
                    Average across all vehicles
                  </div>
                </div>

                {/* DOT Inspections Status */}
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '20px',
                    padding: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                >
                  <h3
                    style={{
                      color: 'white',
                      fontSize: '18px',
                      fontWeight: '600',
                      margin: '0 0 16px 0',
                    }}
                  >
                    🔍 DOT Inspections
                  </h3>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '12px',
                    }}
                  >
                    <div style={{ textAlign: 'center' }}>
                      <div
                        style={{
                          fontSize: '24px',
                          fontWeight: '700',
                          color: '#10b981',
                        }}
                      >
                        {
                          dotInspections.filter(
                            (i) => i.inspectionResult === 'pass'
                          ).length
                        }
                      </div>
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.8)',
                          fontSize: '12px',
                        }}
                      >
                        Passed
                      </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div
                        style={{
                          fontSize: '24px',
                          fontWeight: '700',
                          color: '#ef4444',
                        }}
                      >
                        {
                          dotInspections.filter(
                            (i) => i.inspectionResult === 'fail'
                          ).length
                        }
                      </div>
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.8)',
                          fontSize: '12px',
                        }}
                      >
                        Failed
                      </div>
                    </div>
                  </div>
                </div>

                {/* Violations Summary */}
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '20px',
                    padding: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                >
                  <h3
                    style={{
                      color: 'white',
                      fontSize: '18px',
                      fontWeight: '600',
                      margin: '0 0 16px 0',
                    }}
                  >
                    ⚠️ Active Violations
                  </h3>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '12px',
                    }}
                  >
                    <div style={{ textAlign: 'center' }}>
                      <div
                        style={{
                          fontSize: '24px',
                          fontWeight: '700',
                          color: '#f59e0b',
                        }}
                      >
                        {dotInspections.reduce(
                          (acc, insp) =>
                            acc +
                            insp.violations.filter((v) => !v.corrected).length,
                          0
                        )}
                      </div>
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.8)',
                          fontSize: '12px',
                        }}
                      >
                        Open
                      </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div
                        style={{
                          fontSize: '24px',
                          fontWeight: '700',
                          color: '#10b981',
                        }}
                      >
                        {dotInspections.reduce(
                          (acc, insp) => acc + insp.correctedViolations.length,
                          0
                        )}
                      </div>
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.8)',
                          fontSize: '12px',
                        }}
                      >
                        Corrected
                      </div>
                    </div>
                  </div>
                </div>

                {/* Out of Service Status */}
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '20px',
                    padding: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                >
                  <h3
                    style={{
                      color: 'white',
                      fontSize: '18px',
                      fontWeight: '600',
                      margin: '0 0 16px 0',
                    }}
                  >
                    🚫 Out of Service
                  </h3>
                  <div style={{ textAlign: 'center' }}>
                    <div
                      style={{
                        fontSize: '24px',
                        fontWeight: '700',
                        color:
                          dotInspections.filter((i) => i.outOfServiceStatus)
                            .length > 0
                            ? '#ef4444'
                            : '#10b981',
                      }}
                    >
                      {
                        dotInspections.filter((i) => i.outOfServiceStatus)
                          .length
                      }
                    </div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: '12px',
                      }}
                    >
                      Vehicles affected
                    </div>
                  </div>
                </div>
              </div>

              {/* Vehicle Compliance Details */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '20px',
                  padding: '24px',
                  marginBottom: '30px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '20px',
                  }}
                >
                  <h2
                    style={{
                      color: 'white',
                      fontSize: '24px',
                      fontWeight: '700',
                      margin: 0,
                    }}
                  >
                    🛡️ Vehicle Compliance Status
                  </h2>
                  <Link href='/compliance' style={{ textDecoration: 'none' }}>
                    <button
                      style={{
                        background: 'rgba(16, 185, 129, 0.8)',
                        color: 'white',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '14px',
                      }}
                    >
                      📋 Full Compliance Dashboard
                    </button>
                  </Link>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns:
                      'repeat(auto-fill, minmax(400px, 1fr))',
                    gap: '20px',
                  }}
                >
                  {vehicles.map((vehicle) => {
                    const dotInspection = getDOTInspectionForVehicle(
                      vehicle.id
                    );
                    const maintenanceComp = getMaintenanceComplianceForVehicle(
                      vehicle.id
                    );

                    return (
                      <div
                        key={vehicle.id}
                        style={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          borderRadius: '16px',
                          padding: '20px',
                          border: dotInspection
                            ? `2px solid ${getComplianceStatusColor(dotInspection.inspectionResult)}40`
                            : '2px solid rgba(107, 114, 128, 0.4)',
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
                              color: 'white',
                              fontSize: '18px',
                              fontWeight: '600',
                              margin: 0,
                            }}
                          >
                            {vehicle.name}
                          </h3>
                          {dotInspection && (
                            <div
                              style={{
                                background: getComplianceStatusColor(
                                  dotInspection.inspectionResult
                                ),
                                color: 'white',
                                padding: '6px 12px',
                                borderRadius: '8px',
                                fontSize: '12px',
                                fontWeight: '600',
                                textTransform: 'uppercase',
                              }}
                            >
                              {dotInspection.inspectionResult}
                            </div>
                          )}
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                          <div
                            style={{
                              color: 'rgba(255, 255, 255, 0.8)',
                              fontSize: '14px',
                              marginBottom: '4px',
                            }}
                          >
                            <strong>VIN:</strong>{' '}
                            {vehicle.vin || 'Not available'}
                          </div>
                          <div
                            style={{
                              color: 'rgba(255, 255, 255, 0.8)',
                              fontSize: '14px',
                              marginBottom: '4px',
                            }}
                          >
                            <strong>Type:</strong> {vehicle.type}
                          </div>
                          {dotInspection && (
                            <div
                              style={{
                                color: 'rgba(255, 255, 255, 0.8)',
                                fontSize: '14px',
                                marginBottom: '4px',
                              }}
                            >
                              <strong>Last DOT Inspection:</strong>{' '}
                              {new Date(
                                dotInspection.inspectionDate
                              ).toLocaleDateString()}
                            </div>
                          )}
                        </div>

                        {/* DOT Inspection Details */}
                        {dotInspection ? (
                          <div style={{ marginBottom: '16px' }}>
                            <h4
                              style={{
                                color: 'white',
                                fontSize: '16px',
                                fontWeight: '600',
                                margin: '0 0 8px 0',
                              }}
                            >
                              DOT Inspection Details
                            </h4>
                            <div
                              style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: '8px',
                                fontSize: '14px',
                              }}
                            >
                              <div
                                style={{ color: 'rgba(255, 255, 255, 0.9)' }}
                              >
                                <strong>Score:</strong>{' '}
                                {dotInspection.complianceScore}/100
                              </div>
                              <div
                                style={{ color: 'rgba(255, 255, 255, 0.9)' }}
                              >
                                <strong>Inspector:</strong>{' '}
                                {dotInspection.inspector}
                              </div>
                              <div
                                style={{ color: 'rgba(255, 255, 255, 0.9)' }}
                              >
                                <strong>Violations:</strong>{' '}
                                {dotInspection.violations.length}
                              </div>
                              <div
                                style={{ color: 'rgba(255, 255, 255, 0.9)' }}
                              >
                                <strong>Next Due:</strong>{' '}
                                {new Date(
                                  dotInspection.nextInspectionDue
                                ).toLocaleDateString()}
                              </div>
                            </div>

                            {dotInspection.violations.length > 0 && (
                              <div style={{ marginTop: '12px' }}>
                                <div
                                  style={{
                                    color: 'rgba(255, 255, 255, 0.9)',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    marginBottom: '8px',
                                  }}
                                >
                                  Active Violations:
                                </div>
                                {dotInspection.violations
                                  .filter((v) => !v.corrected)
                                  .map((violation) => (
                                    <div
                                      key={violation.id}
                                      style={{
                                        background: 'rgba(239, 68, 68, 0.2)',
                                        padding: '8px',
                                        borderRadius: '6px',
                                        marginBottom: '4px',
                                        fontSize: '12px',
                                      }}
                                    >
                                      <div
                                        style={{
                                          color: 'white',
                                          fontWeight: '600',
                                        }}
                                      >
                                        {violation.violationCode}:{' '}
                                        {violation.description}
                                      </div>
                                      <div
                                        style={{
                                          color: 'rgba(255, 255, 255, 0.8)',
                                        }}
                                      >
                                        Severity: {violation.severity} | Fine: $
                                        {violation.fineAmount || 'TBD'}
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div
                            style={{
                              background: 'rgba(245, 158, 11, 0.2)',
                              padding: '12px',
                              borderRadius: '8px',
                              marginBottom: '16px',
                              textAlign: 'center',
                            }}
                          >
                            <div
                              style={{
                                color: '#f59e0b',
                                fontWeight: '600',
                                fontSize: '14px',
                              }}
                            >
                              ⚠️ No DOT Inspection Data Available
                            </div>
                            <div
                              style={{
                                color: 'rgba(255, 255, 255, 0.8)',
                                fontSize: '12px',
                                marginTop: '4px',
                              }}
                            >
                              Schedule DOT inspection for compliance
                            </div>
                          </div>
                        )}

                        {/* Safety Equipment Status */}
                        {maintenanceComp && (
                          <div style={{ marginBottom: '16px' }}>
                            <h4
                              style={{
                                color: 'white',
                                fontSize: '16px',
                                fontWeight: '600',
                                margin: '0 0 8px 0',
                              }}
                            >
                              Safety Equipment Status
                            </h4>
                            <div
                              style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: '6px',
                                fontSize: '12px',
                              }}
                            >
                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                }}
                              >
                                <span
                                  style={{ color: 'rgba(255, 255, 255, 0.9)' }}
                                >
                                  Brakes:
                                </span>
                                <span
                                  style={{
                                    color: getSafetyEquipmentColor(
                                      maintenanceComp.safetyEquipment
                                        .brakeSystem.status
                                    ),
                                  }}
                                >
                                  {
                                    maintenanceComp.safetyEquipment.brakeSystem
                                      .status
                                  }
                                </span>
                              </div>
                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                }}
                              >
                                <span
                                  style={{ color: 'rgba(255, 255, 255, 0.9)' }}
                                >
                                  Tires:
                                </span>
                                <span
                                  style={{
                                    color: getSafetyEquipmentColor(
                                      maintenanceComp.safetyEquipment.tires
                                        .status
                                    ),
                                  }}
                                >
                                  {maintenanceComp.safetyEquipment.tires.status}
                                </span>
                              </div>
                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                }}
                              >
                                <span
                                  style={{ color: 'rgba(255, 255, 255, 0.9)' }}
                                >
                                  Lights:
                                </span>
                                <span
                                  style={{
                                    color: getSafetyEquipmentColor(
                                      maintenanceComp.safetyEquipment.lights
                                        .status
                                    ),
                                  }}
                                >
                                  {
                                    maintenanceComp.safetyEquipment.lights
                                      .status
                                  }
                                </span>
                              </div>
                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                }}
                              >
                                <span
                                  style={{ color: 'rgba(255, 255, 255, 0.9)' }}
                                >
                                  Emergency:
                                </span>
                                <span
                                  style={{
                                    color: getSafetyEquipmentColor(
                                      maintenanceComp.safetyEquipment
                                        .emergencyEquipment.status
                                    ),
                                  }}
                                >
                                  {
                                    maintenanceComp.safetyEquipment
                                      .emergencyEquipment.status
                                  }
                                </span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div
                          style={{
                            display: 'flex',
                            gap: '8px',
                            marginTop: '16px',
                          }}
                        >
                          <button
                            onClick={() =>
                              handleViewComplianceDetails(vehicle.id)
                            }
                            style={{
                              background: 'rgba(59, 130, 246, 0.8)',
                              color: 'white',
                              border: 'none',
                              padding: '8px 12px',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '12px',
                              fontWeight: '600',
                              flex: 1,
                            }}
                          >
                            📋 View Details
                          </button>
                          <button
                            onClick={() =>
                              handleScheduleDOTInspection(vehicle.id)
                            }
                            style={{
                              background: 'rgba(16, 185, 129, 0.8)',
                              color: 'white',
                              border: 'none',
                              padding: '8px 12px',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '12px',
                              fontWeight: '600',
                              flex: 1,
                            }}
                          >
                            📅 Schedule Inspection
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* FLEET OVERVIEW SECTION - Only show when activeTab is 'fleet' */}
          {activeTab === 'fleet' && (
            <>
              {/* Enhanced Search and Filter Controls */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  padding: '24px',
                  marginBottom: '32px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                  }}
                >
                  {/* Search and Filter Row */}
                  <div
                    style={{
                      display: 'flex',
                      gap: '16px',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                    }}
                  >
                    <input
                      type='text'
                      placeholder='Search vehicles or drivers...'
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{
                        padding: '12px 16px',
                        border: '2px solid rgba(255, 255, 255, 0.6)',
                        borderRadius: '12px',
                        outline: 'none',
                        background: 'rgba(255, 255, 255, 0.25)',
                        backdropFilter: 'blur(10px)',
                        color: 'white',
                        fontSize: '16px',
                        flex: '1',
                        minWidth: '200px',
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.border =
                          '2px solid rgba(255, 255, 255, 0.9)';
                        e.currentTarget.style.background =
                          'rgba(255, 255, 255, 0.3)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.border =
                          '2px solid rgba(255, 255, 255, 0.6)';
                        e.currentTarget.style.background =
                          'rgba(255, 255, 255, 0.25)';
                      }}
                    />

                    {/* Filter by Status */}
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      style={{
                        padding: '12px 16px',
                        border: '2px solid rgba(255, 255, 255, 0.6)',
                        borderRadius: '12px',
                        outline: 'none',
                        background: 'rgba(255, 255, 255, 0.25)',
                        backdropFilter: 'blur(10px)',
                        color: 'white',
                        fontSize: '16px',
                        minWidth: '150px',
                      }}
                    >
                      <option
                        value='all'
                        style={{ background: '#1e3a8a', color: 'white' }}
                      >
                        All Status
                      </option>
                      <option
                        value='active'
                        style={{ background: '#1e3a8a', color: 'white' }}
                      >
                        Active
                      </option>
                      <option
                        value='maintenance'
                        style={{ background: '#1e3a8a', color: 'white' }}
                      >
                        Maintenance
                      </option>
                      <option
                        value='inactive'
                        style={{ background: '#1e3a8a', color: 'white' }}
                      >
                        Inactive
                      </option>
                    </select>

                    {/* Sort Options */}
                    <select
                      value={`${sortBy}-${sortOrder}`}
                      onChange={(e) => {
                        const [field, order] = e.target.value.split('-') as [
                          typeof sortBy,
                          typeof sortOrder,
                        ];
                        setSortBy(field);
                        setSortOrder(order);
                      }}
                      style={{
                        padding: '12px 16px',
                        border: '2px solid rgba(255, 255, 255, 0.6)',
                        borderRadius: '12px',
                        outline: 'none',
                        background: 'rgba(255, 255, 255, 0.25)',
                        backdropFilter: 'blur(10px)',
                        color: 'white',
                        fontSize: '16px',
                        minWidth: '180px',
                      }}
                    >
                      <option
                        value='name-asc'
                        style={{ background: '#1e3a8a', color: 'white' }}
                      >
                        Name (A-Z)
                      </option>
                      <option
                        value='name-desc'
                        style={{ background: '#1e3a8a', color: 'white' }}
                      >
                        Name (Z-A)
                      </option>
                      <option
                        value='fuelLevel-desc'
                        style={{ background: '#1e3a8a', color: 'white' }}
                      >
                        Fuel (High-Low)
                      </option>
                      <option
                        value='fuelLevel-asc'
                        style={{ background: '#1e3a8a', color: 'white' }}
                      >
                        Fuel (Low-High)
                      </option>
                      <option
                        value='mileage-desc'
                        style={{ background: '#1e3a8a', color: 'white' }}
                      >
                        Mileage (High-Low)
                      </option>
                      <option
                        value='mileage-asc'
                        style={{ background: '#1e3a8a', color: 'white' }}
                      >
                        Mileage (Low-High)
                      </option>
                      <option
                        value='nextMaintenance-asc'
                        style={{ background: '#1e3a8a', color: 'white' }}
                      >
                        Maintenance (Due Soon)
                      </option>
                      <option
                        value='nextMaintenance-desc'
                        style={{ background: '#1e3a8a', color: 'white' }}
                      >
                        Maintenance (Due Later)
                      </option>
                    </select>
                  </div>

                  {/* Quick Stats Row */}
                  <div
                    style={{
                      display: 'flex',
                      gap: '24px',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '16px',
                          color: 'rgba(255, 255, 255, 0.8)',
                        }}
                      >
                        Total Vehicles:
                      </span>
                      <span
                        style={{
                          fontSize: '18px',
                          fontWeight: '600',
                          color: 'white',
                        }}
                      >
                        {vehicles.length}
                      </span>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '16px',
                          color: 'rgba(255, 255, 255, 0.8)',
                        }}
                      >
                        Active:
                      </span>
                      <span
                        style={{
                          fontSize: '18px',
                          fontWeight: '600',
                          color: '#4ade80',
                        }}
                      >
                        {vehicles.filter((v) => v.status === 'active').length}
                      </span>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '16px',
                          color: 'rgba(255, 255, 255, 0.8)',
                        }}
                      >
                        Maintenance:
                      </span>
                      <span
                        style={{
                          fontSize: '18px',
                          fontWeight: '600',
                          color: '#fbbf24',
                        }}
                      >
                        {
                          vehicles.filter((v) => v.status === 'maintenance')
                            .length
                        }
                      </span>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '16px',
                          color: 'rgba(255, 255, 255, 0.8)',
                        }}
                      >
                        Filtered Results:
                      </span>
                      <span
                        style={{
                          fontSize: '18px',
                          fontWeight: '600',
                          color: 'white',
                        }}
                      >
                        {filteredVehicles.length}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bulk Actions Bar */}
              {showBulkActions && (
                <div
                  style={{
                    position: 'fixed',
                    bottom: '24px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '16px',
                    padding: '16px 24px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                    zIndex: 1000,
                    animation: 'slideUp 0.3s ease-out',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                  }}
                >
                  <span
                    style={{
                      color: '#1f2937',
                      fontWeight: '600',
                      fontSize: '14px',
                    }}
                  >
                    {selectedVehicles.size} vehicle
                    {selectedVehicles.size !== 1 ? 's' : ''} selected
                  </span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={handleSelectAll}
                      style={{
                        background: 'rgba(59, 130, 246, 0.1)',
                        color: '#3b82f6',
                        border: '1px solid #3b82f6',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                      }}
                    >
                      {selectedVehicles.size === filteredVehicles.length
                        ? 'Deselect All'
                        : 'Select All'}
                    </button>
                    <button
                      onClick={handleBulkMaintenance}
                      style={{
                        background: 'rgba(251, 191, 36, 0.1)',
                        color: '#fbbf24',
                        border: '1px solid #fbbf24',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                      }}
                    >
                      🔧 Schedule Maintenance
                    </button>
                    <button
                      onClick={handleBulkDriverReassignment}
                      style={{
                        background: 'rgba(34, 197, 94, 0.1)',
                        color: '#22c55e',
                        border: '1px solid #22c55e',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                      }}
                    >
                      👥 Reassign Drivers
                    </button>
                    <button
                      onClick={handleBulkExport}
                      style={{
                        background: 'rgba(139, 92, 246, 0.1)',
                        color: '#8b5cf6',
                        border: '1px solid #8b5cf6',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                      }}
                    >
                      📊 Export Data
                    </button>
                    <button
                      onClick={handleClearSelection}
                      style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        color: '#ef4444',
                        border: '1px solid #ef4444',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                      }}
                    >
                      ✕ Clear
                    </button>
                  </div>
                </div>
              )}

              {/* Vehicle Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
                  gap: '24px',
                  marginBottom: '32px',
                }}
              >
                {filteredVehicles.map((vehicle) => (
                  <div
                    key={vehicle.id}
                    style={{
                      background: 'rgba(255, 255, 255, 0.15)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '16px',
                      padding: '24px',
                      border: selectedVehicles.has(vehicle.id)
                        ? '2px solid #3b82f6'
                        : '1px solid rgba(255, 255, 255, 0.2)',
                      boxShadow: selectedVehicles.has(vehicle.id)
                        ? '0 8px 32px rgba(59, 130, 246, 0.3)'
                        : '0 8px 32px rgba(0, 0, 0, 0.1)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                    }}
                    onClick={() => handleVehicleClick(vehicle)}
                    onMouseOver={(e) => {
                      if (!selectedVehicles.has(vehicle.id)) {
                        e.currentTarget.style.transform = 'translateY(-4px)';
                        e.currentTarget.style.boxShadow =
                          '0 12px 40px rgba(0, 0, 0, 0.2)';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (!selectedVehicles.has(vehicle.id)) {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow =
                          '0 8px 32px rgba(0, 0, 0, 0.1)';
                      }
                    }}
                  >
                    {/* Vehicle Selection Checkbox */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '16px',
                        right: '16px',
                        zIndex: 10,
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleVehicleSelect(
                          vehicle.id,
                          !selectedVehicles.has(vehicle.id)
                        );
                      }}
                    >
                      <input
                        type='checkbox'
                        checked={selectedVehicles.has(vehicle.id)}
                        onChange={() => {}} // Handled by onClick above
                        style={{
                          width: '18px',
                          height: '18px',
                          cursor: 'pointer',
                          accentColor: '#3b82f6',
                        }}
                      />
                    </div>

                    {/* Rest of vehicle card content... */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '16px',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                        }}
                      >
                        <div
                          style={{
                            padding: '12px',
                            background: 'rgba(255, 255, 255, 0.2)',
                            borderRadius: '12px',
                          }}
                        >
                          <span style={{ fontSize: '24px' }}>🚛</span>
                        </div>
                        <div>
                          <h3
                            style={{
                              fontSize: '20px',
                              fontWeight: 'bold',
                              color: 'white',
                              margin: '0 0 4px 0',
                            }}
                          >
                            {vehicle.name}
                          </h3>
                          <p
                            style={{
                              fontSize: '14px',
                              color: 'rgba(255, 255, 255, 0.8)',
                              margin: 0,
                            }}
                          >
                            {vehicle.type}
                          </p>
                        </div>
                      </div>
                      <span
                        style={{
                          ...getStatusStyle(vehicle.status),
                          padding: '6px 12px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '600',
                          textTransform: 'uppercase',
                        }}
                      >
                        {vehicle.status}
                      </span>
                    </div>

                    {/* Vehicle details grid */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '16px',
                        marginBottom: '16px',
                      }}
                    >
                      <div>
                        <p
                          style={{
                            fontSize: '12px',
                            color: 'rgba(255, 255, 255, 0.6)',
                            margin: '0 0 4px 0',
                          }}
                        >
                          Driver
                        </p>
                        <p
                          style={{
                            fontSize: '14px',
                            color: 'white',
                            margin: 0,
                            fontWeight: '500',
                          }}
                        >
                          {vehicle.driver}
                        </p>
                      </div>
                      <div>
                        <p
                          style={{
                            fontSize: '12px',
                            color: 'rgba(255, 255, 255, 0.6)',
                            margin: '0 0 4px 0',
                          }}
                        >
                          Location
                        </p>
                        <p
                          style={{
                            fontSize: '14px',
                            color: 'white',
                            margin: 0,
                            fontWeight: '500',
                          }}
                        >
                          {vehicle.location}
                        </p>
                      </div>
                      <div>
                        <p
                          style={{
                            fontSize: '12px',
                            color: 'rgba(255, 255, 255, 0.6)',
                            margin: '0 0 4px 0',
                          }}
                        >
                          Fuel Level
                        </p>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                          }}
                        >
                          <div
                            style={{
                              width: '60px',
                              height: '6px',
                              background: 'rgba(255, 255, 255, 0.2)',
                              borderRadius: '3px',
                              overflow: 'hidden',
                            }}
                          >
                            <div
                              style={{
                                width: `${vehicle.fuelLevel}%`,
                                height: '100%',
                                background:
                                  vehicle.fuelLevel > 50
                                    ? '#4ade80'
                                    : vehicle.fuelLevel > 25
                                      ? '#fbbf24'
                                      : '#ef4444',
                                borderRadius: '3px',
                                transition: 'all 0.3s ease',
                              }}
                            />
                          </div>
                          <span
                            style={{
                              fontSize: '14px',
                              color: 'white',
                              fontWeight: '500',
                            }}
                          >
                            {Math.round(vehicle.fuelLevel)}%
                          </span>
                        </div>
                      </div>
                      <div>
                        <p
                          style={{
                            fontSize: '12px',
                            color: 'rgba(255, 255, 255, 0.6)',
                            margin: '0 0 4px 0',
                          }}
                        >
                          Mileage
                        </p>
                        <p
                          style={{
                            fontSize: '14px',
                            color: 'white',
                            margin: 0,
                            fontWeight: '500',
                          }}
                        >
                          {vehicle.mileage.toLocaleString()} mi
                        </p>
                      </div>
                    </div>

                    {/* Maintenance status */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div>
                        <p
                          style={{
                            fontSize: '12px',
                            color: 'rgba(255, 255, 255, 0.6)',
                            margin: '0 0 4px 0',
                          }}
                        >
                          Next Maintenance
                        </p>
                        <p
                          style={{
                            fontSize: '14px',
                            color:
                              getMaintenanceStatus(vehicle.nextMaintenance) ===
                              'overdue'
                                ? '#ef4444'
                                : getMaintenanceStatus(
                                      vehicle.nextMaintenance
                                    ) === 'approaching'
                                  ? '#fbbf24'
                                  : 'white',
                            margin: 0,
                            fontWeight: '500',
                          }}
                          className={
                            getMaintenanceStatus(vehicle.nextMaintenance) ===
                            'overdue'
                              ? 'maintenance-alert'
                              : ''
                          }
                        >
                          {new Date(
                            vehicle.nextMaintenance
                          ).toLocaleDateString()}
                          {getMaintenanceStatus(vehicle.nextMaintenance) ===
                            'overdue' && ' ⚠️'}
                          {getMaintenanceStatus(vehicle.nextMaintenance) ===
                            'approaching' && ' 🔄'}
                        </p>
                      </div>
                      <button
                        style={{
                          background:
                            'linear-gradient(135deg, #3b82f6, #2563eb)',
                          color: 'white',
                          border: 'none',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle view details
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.transform = 'scale(1.05)';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Map and Additional Components */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr',
                  gap: '32px',
                }}
              >
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '16px',
                    padding: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '16px',
                    }}
                  >
                    <h3
                      style={{
                        color: 'white',
                        fontSize: '18px',
                        fontWeight: '600',
                        margin: '0',
                      }}
                    >
                      🗺️ Live Fleet Tracking
                    </h3>
                    <Link
                      href='/tracking'
                      style={{
                        background: 'rgba(20, 184, 166, 0.2)',
                        border: '1px solid #14b8a6',
                        color: '#14b8a6',
                        padding: '6px 12px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: '600',
                        textDecoration: 'none',
                        transition: 'all 0.3s ease',
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.background =
                          'rgba(20, 184, 166, 0.3)';
                        e.currentTarget.style.color = 'white';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background =
                          'rgba(20, 184, 166, 0.2)';
                        e.currentTarget.style.color = '#14b8a6';
                      }}
                    >
                      📍 Full Tracking
                    </Link>
                  </div>
                  <GoogleMaps
                    addresses={
                      vehicles
                        .filter((v) => v.status === 'active')
                        .map((v) => v.location)
                        .slice(0, 5) // Limit to first 5 active vehicles
                    }
                    height='400px'
                    zoom={8}
                  />
                </div>
                <div>
                  <StickyNote
                    section='vehicles'
                    entityId='fleet'
                    entityName='Fleet Management'
                    entityType='vehicle'
                    showUnreadCount={true}
                    isNotificationHub={true}
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Vehicle Details Modal */}
        {isModalOpen && selectedVehicle && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(10px)',
              zIndex: 2000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px',
            }}
            onClick={handleCloseModal}
          >
            <div
              style={{
                background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
                borderRadius: '20px',
                padding: '32px',
                maxWidth: '800px',
                width: '100%',
                maxHeight: '80vh',
                overflowY: 'auto',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '24px',
                }}
              >
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '16px' }}
                >
                  <div
                    style={{
                      padding: '16px',
                      background: 'rgba(255, 255, 255, 0.2)',
                      borderRadius: '12px',
                    }}
                  >
                    <span style={{ fontSize: '32px' }}>🚛</span>
                  </div>
                  <div>
                    <h2
                      style={{
                        fontSize: '28px',
                        fontWeight: 'bold',
                        color: 'white',
                        margin: '0 0 4px 0',
                      }}
                    >
                      {selectedVehicle.name}
                    </h2>
                    <p
                      style={{
                        fontSize: '16px',
                        color: 'rgba(255, 255, 255, 0.8)',
                        margin: 0,
                      }}
                    >
                      {selectedVehicle.type}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleCloseModal}
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    color: 'white',
                    padding: '12px',
                    borderRadius: '12px',
                    fontSize: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background =
                      'rgba(255, 255, 255, 0.3)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background =
                      'rgba(255, 255, 255, 0.2)';
                  }}
                >
                  ✕
                </button>
              </div>

              {/* Modal Content Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '24px',
                }}
              >
                {/* Vehicle Information */}
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
                      fontSize: '20px',
                      fontWeight: '600',
                      margin: '0 0 16px 0',
                    }}
                  >
                    Vehicle Information
                  </h3>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '12px',
                    }}
                  >
                    <span
                      style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '14px',
                      }}
                    >
                      Status:
                    </span>
                    <span
                      style={{
                        ...getStatusStyle(selectedVehicle.status),
                        padding: '4px 8px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                      }}
                    >
                      {selectedVehicle.status}
                    </span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '12px',
                    }}
                  >
                    <span
                      style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '14px',
                      }}
                    >
                      Driver:
                    </span>
                    <span
                      style={{
                        color: 'white',
                        fontWeight: '500',
                        fontSize: '14px',
                      }}
                    >
                      {selectedVehicle.driver}
                    </span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '12px',
                    }}
                  >
                    <span
                      style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '14px',
                      }}
                    >
                      Location:
                    </span>
                    <span
                      style={{
                        color: 'white',
                        fontWeight: '500',
                        fontSize: '14px',
                      }}
                    >
                      {selectedVehicle.location}
                    </span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '12px',
                    }}
                  >
                    <span
                      style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '14px',
                      }}
                    >
                      Fuel Level:
                    </span>
                    <span
                      style={{
                        color: 'white',
                        fontWeight: '500',
                        fontSize: '14px',
                      }}
                    >
                      {Math.round(selectedVehicle.fuelLevel)}%
                    </span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '12px',
                    }}
                  >
                    <span
                      style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '14px',
                      }}
                    >
                      Mileage:
                    </span>
                    <span
                      style={{
                        color: 'white',
                        fontWeight: '500',
                        fontSize: '14px',
                      }}
                    >
                      {selectedVehicle.mileage.toLocaleString()} mi
                    </span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '12px',
                    }}
                  >
                    <span
                      style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '14px',
                      }}
                    >
                      Next Maintenance:
                    </span>
                    <span
                      style={{
                        color:
                          getMaintenanceStatus(
                            selectedVehicle.nextMaintenance
                          ) === 'overdue'
                            ? '#ef4444'
                            : getMaintenanceStatus(
                                  selectedVehicle.nextMaintenance
                                ) === 'approaching'
                              ? '#f59e0b'
                              : 'white',
                        fontWeight: '500',
                        fontSize: '14px',
                      }}
                    >
                      {new Date(
                        selectedVehicle.nextMaintenance
                      ).toLocaleDateString()}
                      {getMaintenanceStatus(selectedVehicle.nextMaintenance) ===
                        'overdue' && ' ⚠️'}
                      {getMaintenanceStatus(selectedVehicle.nextMaintenance) ===
                        'approaching' && ' 🔄'}
                    </span>
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
                  <h3
                    style={{
                      color: 'white',
                      fontSize: '20px',
                      fontWeight: '600',
                      margin: '0 0 16px 0',
                    }}
                  >
                    Performance Metrics
                  </h3>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '12px',
                      marginBottom: '12px',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span
                        style={{
                          color: 'rgba(255, 255, 255, 0.7)',
                          fontSize: '14px',
                        }}
                      >
                        Avg Fuel Efficiency:
                      </span>
                      <span
                        style={{
                          color: 'white',
                          fontWeight: '500',
                          fontSize: '14px',
                        }}
                      >
                        {
                          generatePerformanceMetrics(selectedVehicle)
                            .avgFuelEfficiency
                        }{' '}
                        MPG
                      </span>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span
                        style={{
                          color: 'rgba(255, 255, 255, 0.7)',
                          fontSize: '14px',
                        }}
                      >
                        Total Miles Driven:
                      </span>
                      <span
                        style={{
                          color: 'white',
                          fontWeight: '500',
                          fontSize: '14px',
                        }}
                      >
                        {
                          generatePerformanceMetrics(selectedVehicle)
                            .totalMilesDriven
                        }
                      </span>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span
                        style={{
                          color: 'rgba(255, 255, 255, 0.7)',
                          fontSize: '14px',
                        }}
                      >
                        Average Speed:
                      </span>
                      <span
                        style={{
                          color: 'white',
                          fontWeight: '500',
                          fontSize: '14px',
                        }}
                      >
                        {
                          generatePerformanceMetrics(selectedVehicle)
                            .averageSpeed
                        }{' '}
                        MPH
                      </span>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span
                        style={{
                          color: 'rgba(255, 255, 255, 0.7)',
                          fontSize: '14px',
                        }}
                      >
                        Idle Time:
                      </span>
                      <span
                        style={{
                          color: 'white',
                          fontWeight: '500',
                          fontSize: '14px',
                        }}
                      >
                        {generatePerformanceMetrics(selectedVehicle).idleTime}{' '}
                        Hours
                      </span>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span
                        style={{
                          color: 'rgba(255, 255, 255, 0.7)',
                          fontSize: '14px',
                        }}
                      >
                        Deliveries Completed:
                      </span>
                      <span
                        style={{
                          color: 'white',
                          fontWeight: '500',
                          fontSize: '14px',
                        }}
                      >
                        {
                          generatePerformanceMetrics(selectedVehicle)
                            .deliveriesCompleted
                        }
                      </span>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span
                        style={{
                          color: 'rgba(255, 255, 255, 0.7)',
                          fontSize: '14px',
                        }}
                      >
                        On-Time Deliveries:
                      </span>
                      <span
                        style={{
                          color: 'white',
                          fontWeight: '500',
                          fontSize: '14px',
                        }}
                      >
                        {
                          generatePerformanceMetrics(selectedVehicle)
                            .onTimeDeliveries
                        }
                        %
                      </span>
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    gridColumn: '1 / -1',
                  }}
                >
                  <h3
                    style={{
                      color: 'white',
                      fontSize: '20px',
                      fontWeight: '600',
                      margin: '0 0 16px 0',
                    }}
                  >
                    Maintenance History
                  </h3>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                    }}
                  >
                    {generateMaintenanceHistory(selectedVehicle).map(
                      (item, index) => (
                        <div
                          key={index}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <div style={{ flex: 1 }}>
                            <div
                              style={{
                                fontSize: '14px',
                                fontWeight: '500',
                                color: 'white',
                              }}
                            >
                              {item.type}
                            </div>
                            <div
                              style={{
                                fontSize: '12px',
                                color: 'rgba(255, 255, 255, 0.7)',
                              }}
                            >
                              {item.date}
                            </div>
                          </div>
                          <div style={{ textAlign: 'right', flex: 1 }}>
                            <div
                              style={{
                                fontSize: '14px',
                                fontWeight: '500',
                                color: 'white',
                              }}
                            >
                              {item.cost}
                            </div>
                            <div
                              style={{
                                fontSize: '12px',
                                color: 'rgba(255, 255, 255, 0.7)',
                              }}
                            >
                              Mileage: {item.mileage}
                            </div>
                          </div>
                          <div style={{ flex: 1, textAlign: 'right' }}>
                            <div
                              style={{
                                fontSize: '12px',
                                color: 'rgba(255, 255, 255, 0.7)',
                              }}
                            >
                              {item.notes}
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Vehicle Inspection Modal */}
        {showInspectionModal && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '20px',
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowInspectionModal(false);
              }
            }}
          >
            <div
              style={{
                width: '90%',
                maxWidth: '1200px',
                maxHeight: '90vh',
                overflow: 'auto',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {selectedVehicleForInspection ? (
                <VehicleInspectionChecklist
                  vehicleId={selectedVehicleForInspection.id}
                  vehicleVin={selectedVehicleForInspection.vin || 'N/A'}
                  driverId='FLEET-MANAGER' // This would come from user context
                  inspectionType={inspectionType}
                  location={{
                    address: selectedVehicleForInspection.location,
                  }}
                  onComplete={(inspection) => {
                    console.info('✅ Inspection completed:', inspection);

                    // Update vehicle inspection status
                    setVehicles((prev) =>
                      prev.map((v) =>
                        v.id === selectedVehicleForInspection.id
                          ? {
                              ...v,
                              lastInspection: new Date()
                                .toISOString()
                                .split('T')[0],
                              inspectionStatus: inspection.overallStatus as any,
                              safeToOperate: inspection.safeToOperate,
                            }
                          : v
                      )
                    );

                    setShowInspectionModal(false);
                    setSelectedVehicleForInspection(null);

                    // Show completion message
                    alert(
                      `🔍 Inspection Complete!\n\n` +
                        `Vehicle: ${selectedVehicleForInspection.name}\n` +
                        `Status: ${inspection.overallStatus.toUpperCase()}\n` +
                        `Safe to Operate: ${inspection.safeToOperate ? 'YES' : 'NO'}\n\n` +
                        `${inspection.overallStatus === 'fail' ? 'Vehicle requires maintenance before operation.' : 'Vehicle cleared for operation.'}`
                    );
                  }}
                  onCancel={() => {
                    setShowInspectionModal(false);
                    setSelectedVehicleForInspection(null);
                  }}
                />
              ) : (
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '16px',
                    padding: '32px',
                    color: 'white',
                    textAlign: 'center',
                  }}
                >
                  <h3>Quick Inspection</h3>
                  <p>
                    Please select a vehicle from the fleet to begin inspection.
                  </p>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: '16px',
                      marginTop: '24px',
                    }}
                  >
                    {vehicles.map((vehicle) => (
                      <button
                        key={vehicle.id}
                        onClick={() => {
                          setSelectedVehicleForInspection(vehicle);
                        }}
                        style={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          border: '1px solid rgba(255, 255, 255, 0.3)',
                          borderRadius: '12px',
                          padding: '16px',
                          color: 'white',
                          cursor: 'pointer',
                          textAlign: 'left',
                        }}
                      >
                        <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                          {vehicle.name}
                        </div>
                        <div style={{ fontSize: '12px', opacity: 0.8 }}>
                          {vehicle.type}
                        </div>
                        <div style={{ fontSize: '12px', opacity: 0.8 }}>
                          Status: {vehicle.inspectionStatus || 'Unknown'}
                        </div>
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setShowInspectionModal(false)}
                    style={{
                      background: 'rgba(107, 114, 128, 0.5)',
                      color: 'white',
                      border: 'none',
                      padding: '12px 24px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      marginTop: '24px',
                    }}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
