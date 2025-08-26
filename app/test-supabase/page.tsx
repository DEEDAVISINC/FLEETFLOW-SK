'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function TestSupabasePage() {
  const [connectionStatus, setConnectionStatus] =
    useState<string>('Testing...');
  const [loads, setLoads] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      setConnectionStatus('Connecting to Supabase...');

      // Test basic connection
      const { data, error } = await supabase.from('loads').select('*').limit(5);

      if (error) {
        throw error;
      }

      setConnectionStatus('✅ Connected to Supabase!');
      setLoads(data || []);

      // Test drivers table
      const { data: driverData, error: driverError } = await supabase
        .from('drivers')
        .select('*')
        .limit(5);

      if (driverError) {
        console.warn('Driver table error:', driverError);
      } else {
        setDrivers(driverData || []);
      }
    } catch (err: any) {
      setConnectionStatus('❌ Connection Failed');
      setError(err.message);
      console.error('Supabase connection error:', err);
    }
  };

  const createSampleData = async () => {
    try {
      setConnectionStatus('Creating sample data...');

      // Insert a test load
      const { data, error } = await supabase
        .from('loads')
        .insert([
          {
            load_id: 'TEST-' + Date.now(),
            origin: 'Test Origin',
            destination: 'Test Destination',
            weight: '40,000 lbs',
            rate: '$3,000',
            status: 'Available',
            driver: 'Test Driver',
            pickup_date: '2025-07-20',
            delivery_date: '2025-07-21',
            customer: 'Test Customer',
            miles: '500',
            profit: '$1,500',
          },
        ])
        .select();

      if (error) {
        throw error;
      }

      setConnectionStatus('✅ Sample data created!');
      testConnection(); // Refresh the data
    } catch (err: any) {
      setError(err.message);
      console.error('Error creating sample data:', err);
    }
  };

  return (
    <div
      style={{
        padding: '40px',
        maxWidth: '1200px',
        margin: '0 auto',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <h1
        style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          marginBottom: '20px',
          color: '#1e293b',
        }}
      >
        🗄️ Supabase Connection Test
      </h1>

      <div
        style={{
          background: '#f8fafc',
          padding: '20px',
          borderRadius: '12px',
          marginBottom: '30px',
          border: '1px solid #e2e8f0',
        }}
      >
        <h2
          style={{ fontSize: '1.2rem', marginBottom: '10px', color: '#374151' }}
        >
          Connection Status
        </h2>
        <p
          style={{
            fontSize: '1rem',
            fontWeight: '600',
            color: connectionStatus.includes('✅')
              ? '#059669'
              : connectionStatus.includes('❌')
                ? '#dc2626'
                : '#f59e0b',
          }}
        >
          {connectionStatus}
        </p>

        {error && (
          <div
            style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              padding: '15px',
              borderRadius: '8px',
              marginTop: '15px',
            }}
          >
            <h3 style={{ color: '#dc2626', marginBottom: '10px' }}>
              Error Details:
            </h3>
            <p style={{ color: '#991b1b', fontSize: '0.9rem' }}>{error}</p>
          </div>
        )}
      </div>

      <div
        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}
      >
        {/* Loads Section */}
        <div
          style={{
            background: 'white',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          }}
        >
          <h2
            style={{
              fontSize: '1.2rem',
              marginBottom: '15px',
              color: '#374151',
            }}
          >
            📦 Loads Table ({loads.length} records)
          </h2>

          {loads.length > 0 ? (
            <div style={{ fontSize: '0.9rem' }}>
              {loads.map((load, index) => (
                <div
                  key={load.id || index}
                  style={{
                    padding: '10px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    marginBottom: '10px',
                    background: '#f9fafb',
                  }}
                >
                  <div style={{ fontWeight: '600', color: '#374151' }}>
                    {load.load_id}
                  </div>
                  <div style={{ color: '#6b7280', fontSize: '0.8rem' }}>
                    {load.origin} → {load.destination}
                  </div>
                  <div style={{ color: '#6b7280', fontSize: '0.8rem' }}>
                    Status: {load.status} | Rate: {load.rate}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#6b7280', fontStyle: 'italic' }}>
              No loads found. The table might be empty or not exist.
            </p>
          )}
        </div>

        {/* Drivers Section */}
        <div
          style={{
            background: 'white',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          }}
        >
          <h2
            style={{
              fontSize: '1.2rem',
              marginBottom: '15px',
              color: '#374151',
            }}
          >
            👨‍💼 Drivers Table ({drivers.length} records)
          </h2>

          {drivers.length > 0 ? (
            <div style={{ fontSize: '0.9rem' }}>
              {drivers.map((driver, index) => (
                <div
                  key={driver.id || index}
                  style={{
                    padding: '10px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    marginBottom: '10px',
                    background: '#f9fafb',
                  }}
                >
                  <div style={{ fontWeight: '600', color: '#374151' }}>
                    {driver.name}
                  </div>
                  <div style={{ color: '#6b7280', fontSize: '0.8rem' }}>
                    {driver.email}
                  </div>
                  <div style={{ color: '#6b7280', fontSize: '0.8rem' }}>
                    Status: {driver.status} | License: {driver.license_number}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#6b7280', fontStyle: 'italic' }}>
              No drivers found. The table might be empty or not exist.
            </p>
          )}
        </div>
      </div>

      <div
        style={{
          background: '#f0f9ff',
          padding: '20px',
          borderRadius: '12px',
          marginTop: '30px',
          border: '1px solid #0ea5e9',
        }}
      >
        <h2
          style={{ fontSize: '1.2rem', marginBottom: '15px', color: '#0c4a6e' }}
        >
          🔧 Actions
        </h2>

        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <button
            onClick={testConnection}
            style={{
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: '600',
            }}
          >
            🔄 Test Connection
          </button>

          <button
            onClick={createSampleData}
            style={{
              background: '#10b981',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: '600',
            }}
          >
            ➕ Create Sample Data
          </button>
        </div>

        <div
          style={{ marginTop: '20px', fontSize: '0.9rem', color: '#0c4a6e' }}
        >
          <h3 style={{ marginBottom: '10px' }}>Next Steps:</h3>
          <ul style={{ marginLeft: '20px' }}>
            <li>
              If connection fails, check your API keys in{' '}
              <code>.env.local</code>
            </li>
            <li>
              If tables are empty, run the SQL schema in Supabase SQL Editor
            </li>
            <li>
              If everything works, your FleetFlow is ready for production!
            </li>
          </ul>
        </div>
      </div>

      <div
        style={{
          background: '#fef3c7',
          padding: '15px',
          borderRadius: '8px',
          marginTop: '20px',
          border: '1px solid #f59e0b',
        }}
      >
        <h3 style={{ color: '#92400e', marginBottom: '8px' }}>💡 Tip:</h3>
        <p style={{ color: '#92400e', fontSize: '0.9rem', margin: 0 }}>
          Visit{' '}
          <Link
            href='/'
            style={{ color: '#92400e', textDecoration: 'underline' }}
          >
            http://localhost:3000
          </Link>{' '}
          to see your main dashboard with real data!
        </p>
      </div>
    </div>
  );
}
