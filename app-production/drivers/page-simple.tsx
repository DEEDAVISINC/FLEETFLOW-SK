'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface Driver {
  id: string;
  name: string;
  email: string;
  phone: string;
  licenseNumber: string;
  carrierMC: string;
  status: 'Available' | 'On Duty' | 'Off Duty' | 'Driving' | 'Inactive';
  totalMiles: number;
  rating: number;
  joinDate: string;
  lastActivity: string;
  currentLocation?: string;
  assignedTruck?: string;
  eldStatus: 'Connected' | 'Disconnected' | 'Error';
}

const MOCK_DRIVERS: Driver[] = [
  {
    id: 'DRV-001',
    name: 'John Smith',
    email: 'john.smith@fleetflowapp.com',
    phone: '+1 (555) 123-4567',
    licenseNumber: 'CDL-TX-123456',
    carrierMC: 'MC-123456',
    status: 'Driving',
    totalMiles: 125000,
    rating: 4.8,
    joinDate: '2023-01-15',
    lastActivity: '2025-01-02T10:30:00Z',
    currentLocation: 'Dallas, TX',
    assignedTruck: 'TRK-001 (Freightliner Cascadia)',
    eldStatus: 'Connected'
  },
  {
    id: 'DRV-002',
    name: 'Sarah Wilson',
    email: 'sarah.wilson@fleetflowapp.com',
    phone: '+1 (555) 234-5678',
    licenseNumber: 'CDL-CA-234567',
    carrierMC: 'MC-234567',
    status: 'Available',
    totalMiles: 89000,
    rating: 4.9,
    joinDate: '2023-03-20',
    lastActivity: '2025-01-02T09:15:00Z',
    currentLocation: 'Los Angeles, CA',
    assignedTruck: 'TRK-002 (Volvo VNL)',
    eldStatus: 'Connected'
  },
  {
    id: 'DRV-003',
    name: 'Mike Johnson',
    email: 'mike.johnson@fleetflowapp.com',
    phone: '+1 (555) 345-6789',
    licenseNumber: 'CDL-FL-345678',
    carrierMC: 'MC-345678',
    status: 'Off Duty',
    totalMiles: 156000,
    rating: 4.6,
    joinDate: '2022-11-10',
    lastActivity: '2025-01-01T18:45:00Z',
    currentLocation: 'Miami, FL',
    assignedTruck: 'TRK-003 (Peterbilt 579)',
    eldStatus: 'Connected'
  }
];

export default function DriverManagementSimple() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    onDuty: 0,
    driving: 0,
    offDuty: 0,
    inactive: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API loading
    setTimeout(() => {
      setDrivers(MOCK_DRIVERS);
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    const stats = {
      total: MOCK_DRIVERS.length,
      available: MOCK_DRIVERS.filter(d => d.status === 'Available').length,
      onDuty: MOCK_DRIVERS.filter(d => d.status === 'On Duty').length,
      driving: MOCK_DRIVERS.filter(d => d.status === 'Driving').length,
      offDuty: MOCK_DRIVERS.filter(d => d.status === 'Off Duty').length,
      inactive: MOCK_DRIVERS.filter(d => d.status === 'Inactive').length
    };
    setStats(stats);
  }, []);

  const filteredDrivers = drivers.filter(driver => {
    return !searchTerm || 
      driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.phone.includes(searchTerm) ||
      (driver.currentLocation && driver.currentLocation.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  const getStatusColor = (status: Driver['status']) => {
    switch (status) {
      case 'Available': return { bg: '#dcfce7', text: '#166534' };
      case 'On Duty': return { bg: '#dbeafe', text: '#1e40af' };
      case 'Driving': return { bg: '#fed7aa', text: '#c2410c' };
      case 'Off Duty': return { bg: '#fef3c7', text: '#a16207' };
      case 'Inactive': return { bg: '#f3f4f6', text: '#374151' };
      default: return { bg: '#f3f4f6', text: '#374151' };
    }
  };

  const getEldStatusColor = (status: Driver['eldStatus']) => {
    switch (status) {
      case 'Connected': return { bg: '#dcfce7', text: '#166534' };
      case 'Disconnected': return { bg: '#fee2e2', text: '#dc2626' };
      case 'Error': return { bg: '#fef3c7', text: '#a16207' };
      default: return { bg: '#f3f4f6', text: '#374151' };
    }
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #1e3a8a, #1e40af, #3730a3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '24px'
      }}>
        Loading Driver Management...
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #1e3a8a, #1e40af, #3730a3)',
      padding: '80px 20px 20px 20px'
    }}>
      {/* Back Button */}
      <div style={{ padding: '0 0 24px 0', maxWidth: '1200px', margin: '0 auto' }}>
        <Link href="/" style={{ display: 'inline-block', textDecoration: 'none' }}>
          <button style={{
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '12px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}>
            ← Back to Dashboard
          </button>
        </Link>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
        }}>
          <h1 style={{
            fontSize: '28px',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '8px',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
          }}>
            👥 DRIVER MANAGEMENT
          </h1>
          <p style={{ fontSize: '16px', color: 'rgba(255, 255, 255, 0.8)', margin: 0 }}>
            Driver Fleet Operations & Performance Monitoring
          </p>
        </div>

        {/* Stats Dashboard */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '12px',
          marginBottom: '24px'
        }}>
          {[
            { label: 'Total Drivers', value: stats.total, color: '#3b82f6', icon: '👥' },
            { label: 'Available', value: stats.available, color: '#10b981', icon: '✅' },
            { label: 'On Duty', value: stats.onDuty, color: '#3b82f6', icon: '🔵' },
            { label: 'Driving', value: stats.driving, color: '#f59e0b', icon: '🚛' },
            { label: 'Off Duty', value: stats.offDuty, color: '#eab308', icon: '⏸️' },
            { label: 'Inactive', value: stats.inactive, color: '#6b7280', icon: '⚫' }
          ].map((stat, index) => (
            <div key={index} style={{
              background: 'white',
              borderRadius: '12px',
              padding: '16px',
              textAlign: 'center',
              boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
              transition: 'all 0.3s ease',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{
                background: stat.color,
                color: 'white',
                fontSize: '18px',
                fontWeight: 'bold',
                borderRadius: '6px',
                padding: '8px',
                marginBottom: '8px',
                boxShadow: '0 1px 4px rgba(0,0,0,0.1)'
              }}>
                <div style={{ fontSize: '10px', opacity: 0.9, marginBottom: '2px' }}>
                  {stat.icon}
                </div>
                <div>{stat.value}</div>
              </div>
              <div style={{ color: '#374151', fontSize: '12px', fontWeight: '600' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Search */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Search drivers by name, email, license, phone, location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px 12px 40px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '16px',
                outline: 'none',
                transition: 'all 0.3s ease'
              }}
            />
            <div style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#9ca3af',
              fontSize: '20px'
            }}>
              🔍
            </div>
          </div>
        </div>

        {/* Drivers List */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
          border: '1px solid #e5e7eb'
        }}>
          <h2 style={{ 
            fontSize: '20px', 
            fontWeight: 'bold', 
            color: '#111827', 
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            👥 Drivers ({filteredDrivers.length})
          </h2>

          <div style={{ display: 'grid', gap: '16px' }}>
            {filteredDrivers.map((driver) => {
              const statusColors = getStatusColor(driver.status);
              const eldColors = getEldStatusColor(driver.eldStatus);
              
              return (
                <div key={driver.id} style={{
                  background: '#f9fafb',
                  borderRadius: '12px',
                  padding: '20px',
                  border: '1px solid #e5e7eb',
                  transition: 'all 0.3s ease'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827', marginBottom: '4px' }}>
                        {driver.name}
                      </h3>
                      <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>
                        {driver.email} • {driver.phone}
                      </p>
                      <p style={{ fontSize: '14px', color: '#6b7280' }}>
                        License: {driver.licenseNumber} • MC: {driver.carrierMC}
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <span style={{
                        background: statusColors.bg,
                        color: statusColors.text,
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}>
                        {driver.status}
                      </span>
                      <span style={{
                        background: eldColors.bg,
                        color: eldColors.text,
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}>
                        ELD: {driver.eldStatus}
                      </span>
                    </div>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                    <div style={{ fontSize: '14px', color: '#6b7280' }}>
                      <strong>Location:</strong> {driver.currentLocation || 'Unknown'}
                    </div>
                    <div style={{ fontSize: '14px', color: '#6b7280' }}>
                      <strong>Truck:</strong> {driver.assignedTruck || 'Unassigned'}
                    </div>
                    <div style={{ fontSize: '14px', color: '#6b7280' }}>
                      <strong>Miles:</strong> {driver.totalMiles.toLocaleString()}
                    </div>
                    <div style={{ fontSize: '14px', color: '#6b7280' }}>
                      <strong>Rating:</strong> ⭐ {driver.rating}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredDrivers.length === 0 && (
            <div style={{ 
              textAlign: 'center', 
              padding: '40px', 
              color: '#6b7280',
              fontSize: '16px'
            }}>
              No drivers found matching your search criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 