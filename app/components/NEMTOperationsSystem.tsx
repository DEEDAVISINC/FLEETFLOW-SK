'use client';

import { useState } from 'react';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  medicaidId: string;
  phone: string;
  email?: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  medicalNeeds: {
    wheelchair: boolean;
    oxygen: boolean;
    walker: boolean;
    serviceAnimal: boolean;
    other: string;
  };
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  mco: string; // Managed Care Organization
  eligibilityStatus: 'active' | 'pending' | 'expired';
  eligibilityEndDate: string;
  createdAt: string;
}

export interface Ride {
  id: string;
  patientId: string;
  patientName: string;
  appointmentType: string;
  pickupAddress: string;
  dropoffAddress: string;
  pickupTime: string;
  appointmentTime: string;
  status: 'scheduled' | 'driver-assigned' | 'en-route' | 'picked-up' | 'completed' | 'cancelled' | 'no-show';
  uberRideId?: string;
  driverName?: string;
  driverPhone?: string;
  vehicleInfo?: string;
  estimatedCost: number;
  actualCost?: number;
  mileage: number;
  specialInstructions?: string;
  createdAt: string;
  completedAt?: string;
}

export interface Claim {
  id: string;
  rideId: string;
  patientId: string;
  patientName: string;
  serviceDate: string;
  mco: string;
  origin: string;
  destination: string;
  mileage: number;
  billedAmount: number;
  status: 'draft' | 'submitted' | 'paid' | 'denied' | 'appealed';
  submittedAt?: string;
  paidAt?: string;
  paidAmount?: number;
  denialReason?: string;
  claimNumber?: string;
}

export interface Provider {
  id: string;
  name: string;
  type: 'dialysis-center' | 'hospital' | 'clinic' | 'specialist' | 'pharmacy' | 'other';
  address: string;
  phone: string;
  contactName: string;
  contactEmail: string;
  active: boolean;
  totalRides: number;
  createdAt: string;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function NEMTOperationsSystem() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'patients' | 'rides' | 'billing' | 'providers'>('dashboard');
  const [showPatientForm, setShowPatientForm] = useState(false);
  const [showRideForm, setShowRideForm] = useState(false);

  // Mock data for demonstration
  const [patients] = useState<Patient[]>([
    {
      id: 'PAT-001',
      firstName: 'John',
      lastName: 'Smith',
      dateOfBirth: '1965-03-15',
      medicaidId: 'MI-12345678',
      phone: '(313) 555-0100',
      email: 'john.smith@email.com',
      address: {
        street: '123 Main St',
        city: 'Detroit',
        state: 'MI',
        zip: '48201',
      },
      medicalNeeds: {
        wheelchair: true,
        oxygen: false,
        walker: false,
        serviceAnimal: false,
        other: '',
      },
      emergencyContact: {
        name: 'Jane Smith',
        phone: '(313) 555-0101',
        relationship: 'Spouse',
      },
      mco: 'Meridian Health Plan',
      eligibilityStatus: 'active',
      eligibilityEndDate: '2025-12-31',
      createdAt: '2025-01-15',
    },
  ]);

  const [rides] = useState<Ride[]>([
    {
      id: 'RIDE-001',
      patientId: 'PAT-001',
      patientName: 'John Smith',
      appointmentType: 'Dialysis',
      pickupAddress: '123 Main St, Detroit, MI 48201',
      dropoffAddress: '456 Medical Center Dr, Detroit, MI 48202',
      pickupTime: '2025-10-03T08:00:00',
      appointmentTime: '2025-10-03T09:00:00',
      status: 'scheduled',
      estimatedCost: 45.00,
      mileage: 8.5,
      specialInstructions: 'Patient requires wheelchair accessible vehicle',
      createdAt: '2025-10-02',
    },
  ]);

  const [claims] = useState<Claim[]>([
    {
      id: 'CLM-001',
      rideId: 'RIDE-001',
      patientId: 'PAT-001',
      patientName: 'John Smith',
      serviceDate: '2025-09-30',
      mco: 'Meridian Health Plan',
      origin: '123 Main St, Detroit, MI',
      destination: '456 Medical Center Dr, Detroit, MI',
      mileage: 8.5,
      billedAmount: 45.00,
      status: 'submitted',
      submittedAt: '2025-10-01',
      claimNumber: 'CLM2025-001',
    },
  ]);

  const [providers] = useState<Provider[]>([
    {
      id: 'PROV-001',
      name: 'Detroit Dialysis Center',
      type: 'dialysis-center',
      address: '456 Medical Center Dr, Detroit, MI 48202',
      phone: '(313) 555-0200',
      contactName: 'Dr. Sarah Johnson',
      contactEmail: 'sarah.j@detroitdialysis.com',
      active: true,
      totalRides: 45,
      createdAt: '2025-01-10',
    },
  ]);

  // Stats calculations
  const stats = {
    totalPatients: patients.length,
    activePatients: patients.filter(p => p.eligibilityStatus === 'active').length,
    scheduledRides: rides.filter(r => r.status === 'scheduled').length,
    completedRides: rides.filter(r => r.status === 'completed').length,
    totalClaims: claims.length,
    pendingClaims: claims.filter(c => c.status === 'submitted').length,
    paidClaims: claims.filter(c => c.status === 'paid').length,
    revenue: claims.filter(c => c.status === 'paid').reduce((sum, c) => sum + (c.paidAmount || 0), 0),
    activeProviders: providers.filter(p => p.active).length,
  };

  return (
    <div style={{ padding: '20px' }}>
      {/* Header */}
      <div style={{
        marginBottom: '30px',
        padding: '24px',
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        borderRadius: '12px',
      }}>
        <h1 style={{
          color: 'white',
          fontSize: '2rem',
          fontWeight: '700',
          margin: '0 0 8px 0',
        }}>
          🏥 NEMT Operations System
        </h1>
        <p style={{ color: 'rgba(255, 255, 255, 0.9)', margin: 0, fontSize: '1rem' }}>
          DEE DAVIS INC dba DEPOINTE | NPI: 1538939111 | Powered by Uber Health
        </p>
      </div>

      {/* Navigation Tabs */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '24px',
        borderBottom: '2px solid rgba(148, 163, 184, 0.2)',
        paddingBottom: '12px',
      }}>
        {[
          { id: 'dashboard', label: '📊 Dashboard', icon: '📊' },
          { id: 'patients', label: '👥 Patients', icon: '👥' },
          { id: 'rides', label: '🚗 Rides', icon: '🚗' },
          { id: 'billing', label: '💰 Billing', icon: '💰' },
          { id: 'providers', label: '🏥 Providers', icon: '🏥' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              background: activeTab === tab.id 
                ? 'linear-gradient(135deg, #10b981, #059669)'
                : 'rgba(255, 255, 255, 0.05)',
              border: activeTab === tab.id ? 'none' : '1px solid rgba(148, 163, 184, 0.3)',
              borderRadius: '8px',
              padding: '12px 24px',
              color: 'white',
              fontSize: '0.95rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Dashboard View */}
      {activeTab === 'dashboard' && (
        <div>
          {/* Stats Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '16px',
            marginBottom: '24px',
          }}>
            <StatCard
              title="Total Patients"
              value={stats.totalPatients}
              subtitle={`${stats.activePatients} active`}
              icon="👥"
              color="#10b981"
            />
            <StatCard
              title="Scheduled Rides"
              value={stats.scheduledRides}
              subtitle={`${stats.completedRides} completed today`}
              icon="🚗"
              color="#3b82f6"
            />
            <StatCard
              title="Pending Claims"
              value={stats.pendingClaims}
              subtitle={`${stats.paidClaims} paid this month`}
              icon="💰"
              color="#f59e0b"
            />
            <StatCard
              title="Monthly Revenue"
              value={`$${stats.revenue.toFixed(2)}`}
              subtitle={`${stats.totalClaims} total claims`}
              icon="📈"
              color="#8b5cf6"
            />
          </div>

          {/* Quick Actions */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.6)',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '24px',
          }}>
            <h3 style={{ color: 'white', marginBottom: '16px', fontSize: '1.2rem' }}>
              ⚡ Quick Actions
            </h3>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <ActionButton
                label="➕ Add New Patient"
                onClick={() => setShowPatientForm(true)}
              />
              <ActionButton
                label="🚗 Schedule Ride"
                onClick={() => setShowRideForm(true)}
              />
              <ActionButton
                label="📄 Generate Claim"
                onClick={() => alert('Generate claim functionality')}
              />
              <ActionButton
                label="📊 View Reports"
                onClick={() => alert('Reports functionality')}
              />
            </div>
          </div>

          {/* Recent Activity */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.6)',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            borderRadius: '12px',
            padding: '20px',
          }}>
            <h3 style={{ color: 'white', marginBottom: '16px', fontSize: '1.2rem' }}>
              📋 Recent Activity
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <ActivityItem
                icon="🚗"
                title="Ride scheduled for John Smith"
                time="10 minutes ago"
                type="ride"
              />
              <ActivityItem
                icon="💰"
                title="Claim submitted to Meridian Health Plan"
                time="2 hours ago"
                type="claim"
              />
              <ActivityItem
                icon="👥"
                title="New patient registered: John Smith"
                time="1 day ago"
                type="patient"
              />
            </div>
          </div>
        </div>
      )}

      {/* Patients View */}
      {activeTab === 'patients' && (
        <div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
          }}>
            <h2 style={{ color: 'white', fontSize: '1.5rem', fontWeight: '600' }}>
              Patient Management
            </h2>
            <button
              onClick={() => setShowPatientForm(true)}
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 24px',
                color: 'white',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              ➕ Add New Patient
            </button>
          </div>

          {/* Patient List */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.6)',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            borderRadius: '12px',
            overflow: 'hidden',
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
                  <th style={tableHeaderStyle}>Patient ID</th>
                  <th style={tableHeaderStyle}>Name</th>
                  <th style={tableHeaderStyle}>Medicaid ID</th>
                  <th style={tableHeaderStyle}>MCO</th>
                  <th style={tableHeaderStyle}>Status</th>
                  <th style={tableHeaderStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((patient) => (
                  <tr key={patient.id} style={{ borderBottom: '1px solid rgba(148, 163, 184, 0.1)' }}>
                    <td style={tableCellStyle}>{patient.id}</td>
                    <td style={tableCellStyle}>{patient.firstName} {patient.lastName}</td>
                    <td style={tableCellStyle}>{patient.medicaidId}</td>
                    <td style={tableCellStyle}>{patient.mco}</td>
                    <td style={tableCellStyle}>
                      <span style={{
                        background: patient.eligibilityStatus === 'active' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                        color: patient.eligibilityStatus === 'active' ? '#22c55e' : '#f59e0b',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                      }}>
                        {patient.eligibilityStatus}
                      </span>
                    </td>
                    <td style={tableCellStyle}>
                      <button style={actionButtonStyle}>View</button>
                      <button style={actionButtonStyle}>Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Patient Form Modal */}
          {showPatientForm && (
            <PatientFormModal onClose={() => setShowPatientForm(false)} />
          )}
        </div>
      )}

      {/* Rides View */}
      {activeTab === 'rides' && (
        <div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
          }}>
            <h2 style={{ color: 'white', fontSize: '1.5rem', fontWeight: '600' }}>
              Ride Management
            </h2>
            <button
              onClick={() => setShowRideForm(true)}
              style={{
                background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 24px',
                color: 'white',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              🚗 Schedule New Ride
            </button>
          </div>

          {/* Ride List */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.6)',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            borderRadius: '12px',
            overflow: 'hidden',
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
                  <th style={tableHeaderStyle}>Ride ID</th>
                  <th style={tableHeaderStyle}>Patient</th>
                  <th style={tableHeaderStyle}>Pickup Time</th>
                  <th style={tableHeaderStyle}>Destination</th>
                  <th style={tableHeaderStyle}>Status</th>
                  <th style={tableHeaderStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rides.map((ride) => (
                  <tr key={ride.id} style={{ borderBottom: '1px solid rgba(148, 163, 184, 0.1)' }}>
                    <td style={tableCellStyle}>{ride.id}</td>
                    <td style={tableCellStyle}>{ride.patientName}</td>
                    <td style={tableCellStyle}>{new Date(ride.pickupTime).toLocaleString()}</td>
                    <td style={tableCellStyle}>{ride.dropoffAddress}</td>
                    <td style={tableCellStyle}>
                      <span style={{
                        background: getStatusColor(ride.status),
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                      }}>
                        {ride.status}
                      </span>
                    </td>
                    <td style={tableCellStyle}>
                      <button style={actionButtonStyle}>View</button>
                      <button style={actionButtonStyle}>Track</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Ride Form Modal */}
          {showRideForm && (
            <RideFormModal onClose={() => setShowRideForm(false)} patients={patients} />
          )}
        </div>
      )}

      {/* Billing View */}
      {activeTab === 'billing' && (
        <div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
          }}>
            <h2 style={{ color: 'white', fontSize: '1.5rem', fontWeight: '600' }}>
              Billing & Claims Management
            </h2>
            <button
              style={{
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 24px',
                color: 'white',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              📄 Generate New Claim
            </button>
          </div>

          {/* Claims Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            marginBottom: '24px',
          }}>
            <MiniStatCard title="Total Claims" value={stats.totalClaims} color="#f59e0b" />
            <MiniStatCard title="Submitted" value={stats.pendingClaims} color="#3b82f6" />
            <MiniStatCard title="Paid" value={stats.paidClaims} color="#22c55e" />
            <MiniStatCard title="Revenue" value={`$${stats.revenue}`} color="#8b5cf6" />
          </div>

          {/* Claims List */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.6)',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            borderRadius: '12px',
            overflow: 'hidden',
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(245, 158, 11, 0.1)' }}>
                  <th style={tableHeaderStyle}>Claim #</th>
                  <th style={tableHeaderStyle}>Patient</th>
                  <th style={tableHeaderStyle}>Service Date</th>
                  <th style={tableHeaderStyle}>MCO</th>
                  <th style={tableHeaderStyle}>Amount</th>
                  <th style={tableHeaderStyle}>Status</th>
                  <th style={tableHeaderStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {claims.map((claim) => (
                  <tr key={claim.id} style={{ borderBottom: '1px solid rgba(148, 163, 184, 0.1)' }}>
                    <td style={tableCellStyle}>{claim.claimNumber}</td>
                    <td style={tableCellStyle}>{claim.patientName}</td>
                    <td style={tableCellStyle}>{new Date(claim.serviceDate).toLocaleDateString()}</td>
                    <td style={tableCellStyle}>{claim.mco}</td>
                    <td style={tableCellStyle}>${claim.billedAmount.toFixed(2)}</td>
                    <td style={tableCellStyle}>
                      <span style={{
                        background: getClaimStatusColor(claim.status),
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                      }}>
                        {claim.status}
                      </span>
                    </td>
                    <td style={tableCellStyle}>
                      <button style={actionButtonStyle}>View</button>
                      <button style={actionButtonStyle}>Export</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Providers View */}
      {activeTab === 'providers' && (
        <div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
          }}>
            <h2 style={{ color: 'white', fontSize: '1.5rem', fontWeight: '600' }}>
              Healthcare Provider Network
            </h2>
            <button
              style={{
                background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 24px',
                color: 'white',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              ➕ Add Provider
            </button>
          </div>

          {/* Provider List */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.6)',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            borderRadius: '12px',
            overflow: 'hidden',
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(139, 92, 246, 0.1)' }}>
                  <th style={tableHeaderStyle}>Provider Name</th>
                  <th style={tableHeaderStyle}>Type</th>
                  <th style={tableHeaderStyle}>Contact</th>
                  <th style={tableHeaderStyle}>Total Rides</th>
                  <th style={tableHeaderStyle}>Status</th>
                  <th style={tableHeaderStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {providers.map((provider) => (
                  <tr key={provider.id} style={{ borderBottom: '1px solid rgba(148, 163, 184, 0.1)' }}>
                    <td style={tableCellStyle}>{provider.name}</td>
                    <td style={tableCellStyle}>{provider.type}</td>
                    <td style={tableCellStyle}>{provider.contactName}<br/>{provider.phone}</td>
                    <td style={tableCellStyle}>{provider.totalRides}</td>
                    <td style={tableCellStyle}>
                      <span style={{
                        background: provider.active ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                        color: provider.active ? '#22c55e' : '#ef4444',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                      }}>
                        {provider.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td style={tableCellStyle}>
                      <button style={actionButtonStyle}>View</button>
                      <button style={actionButtonStyle}>Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

function StatCard({ title, value, subtitle, icon, color }: any) {
  return (
    <div style={{
      background: 'rgba(15, 23, 42, 0.6)',
      border: `2px solid ${color}`,
      borderRadius: '12px',
      padding: '20px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h3 style={{ color: 'white', fontSize: '0.9rem', fontWeight: '600', margin: 0 }}>
          {title}
        </h3>
        <span style={{ fontSize: '2rem' }}>{icon}</span>
      </div>
      <div style={{ color: color, fontSize: '2rem', fontWeight: '700', marginBottom: '4px' }}>
        {value}
      </div>
      <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.85rem' }}>
        {subtitle}
      </div>
    </div>
  );
}

function MiniStatCard({ title, value, color }: any) {
  return (
    <div style={{
      background: `${color}20`,
      border: `1px solid ${color}`,
      borderRadius: '8px',
      padding: '16px',
      textAlign: 'center',
    }}>
      <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.85rem', marginBottom: '8px' }}>
        {title}
      </div>
      <div style={{ color: color, fontSize: '1.5rem', fontWeight: '700' }}>
        {value}
      </div>
    </div>
  );
}

function ActionButton({ label, onClick }: any) {
  return (
    <button
      onClick={onClick}
      style={{
        background: 'rgba(16, 185, 129, 0.1)',
        border: '1px solid rgba(16, 185, 129, 0.3)',
        borderRadius: '8px',
        padding: '12px 24px',
        color: '#10b981',
        fontSize: '0.9rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
      }}
    >
      {label}
    </button>
  );
}

function ActivityItem({ icon, title, time, type }: any) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px',
      background: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '8px',
    }}>
      <span style={{ fontSize: '1.5rem' }}>{icon}</span>
      <div style={{ flex: 1 }}>
        <div style={{ color: 'white', fontSize: '0.9rem', fontWeight: '500' }}>{title}</div>
        <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.8rem' }}>{time}</div>
      </div>
    </div>
  );
}

function PatientFormModal({ onClose }: any) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        background: '#1e293b',
        borderRadius: '12px',
        padding: '24px',
        maxWidth: '600px',
        width: '90%',
        maxHeight: '80vh',
        overflow: 'auto',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ color: 'white', fontSize: '1.5rem', fontWeight: '600', margin: 0 }}>
            Add New Patient
          </h2>
          <button onClick={onClose} style={{ color: 'white', fontSize: '1.5rem', background: 'none', border: 'none', cursor: 'pointer' }}>
            ✕
          </button>
        </div>
        <p style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '20px' }}>
          Patient intake form will be implemented here with all HIPAA-compliant fields.
        </p>
        <button
          onClick={onClose}
          style={{
            background: 'linear-gradient(135deg, #10b981, #059669)',
            border: 'none',
            borderRadius: '8px',
            padding: '12px 24px',
            color: 'white',
            fontSize: '0.9rem',
            fontWeight: '600',
            cursor: 'pointer',
            width: '100%',
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}

function RideFormModal({ onClose, patients }: any) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        background: '#1e293b',
        borderRadius: '12px',
        padding: '24px',
        maxWidth: '600px',
        width: '90%',
        maxHeight: '80vh',
        overflow: 'auto',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ color: 'white', fontSize: '1.5rem', fontWeight: '600', margin: 0 }}>
            Schedule New Ride
          </h2>
          <button onClick={onClose} style={{ color: 'white', fontSize: '1.5rem', background: 'none', border: 'none', cursor: 'pointer' }}>
            ✕
          </button>
        </div>
        <p style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '20px' }}>
          Ride scheduling form with Uber Health integration will be implemented here.
        </p>
        <button
          onClick={onClose}
          style={{
            background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
            border: 'none',
            borderRadius: '8px',
            padding: '12px 24px',
            color: 'white',
            fontSize: '0.9rem',
            fontWeight: '600',
            cursor: 'pointer',
            width: '100%',
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getStatusColor(status: string): string {
  const colors: any = {
    'scheduled': 'rgba(59, 130, 246, 0.2)',
    'driver-assigned': 'rgba(245, 158, 11, 0.2)',
    'en-route': 'rgba(139, 92, 246, 0.2)',
    'picked-up': 'rgba(16, 185, 129, 0.2)',
    'completed': 'rgba(34, 197, 94, 0.2)',
    'cancelled': 'rgba(239, 68, 68, 0.2)',
    'no-show': 'rgba(239, 68, 68, 0.2)',
  };
  return colors[status] || 'rgba(148, 163, 184, 0.2)';
}

function getClaimStatusColor(status: string): string {
  const colors: any = {
    'draft': 'rgba(148, 163, 184, 0.2)',
    'submitted': 'rgba(59, 130, 246, 0.2)',
    'paid': 'rgba(34, 197, 94, 0.2)',
    'denied': 'rgba(239, 68, 68, 0.2)',
    'appealed': 'rgba(245, 158, 11, 0.2)',
  };
  return colors[status] || 'rgba(148, 163, 184, 0.2)';
}

// ============================================================================
// STYLES
// ============================================================================

const tableHeaderStyle = {
  padding: '16px',
  textAlign: 'left' as const,
  color: 'white',
  fontSize: '0.85rem',
  fontWeight: '600',
  borderBottom: '2px solid rgba(148, 163, 184, 0.2)',
};

const tableCellStyle = {
  padding: '16px',
  color: 'rgba(255, 255, 255, 0.9)',
  fontSize: '0.85rem',
};

const actionButtonStyle = {
  background: 'rgba(59, 130, 246, 0.1)',
  border: '1px solid rgba(59, 130, 246, 0.3)',
  borderRadius: '4px',
  padding: '6px 12px',
  color: '#3b82f6',
  fontSize: '0.8rem',
  fontWeight: '500',
  cursor: 'pointer',
  marginRight: '8px',
};
