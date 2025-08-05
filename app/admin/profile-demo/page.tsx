'use client';

import EnhancedNavigation from '../../components/EnhancedNavigation';

export default function ProfileDemoPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <EnhancedNavigation />
      
      <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            padding: '40px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
          }}
        >
          <h1
            style={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: '20px',
              textAlign: 'center',
            }}
          >
            🎯 Enhanced Admin Profile System
          </h1>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginTop: '40px' }}>
            {/* Role-Based Access Control */}
            <div
              style={{
                background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                borderRadius: '16px',
                padding: '30px',
                color: 'white',
                boxShadow: '0 10px 30px rgba(59, 130, 246, 0.3)',
              }}
            >
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                🔐 Role-Based Access Control
              </h2>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, lineHeight: '1.8' }}>
                <li>✅ Fleet Manager: Full Admin Access</li>
                <li>✅ Manager: Management Tools</li>
                <li>✅ Dispatcher: Operations Only</li>
                <li>✅ Driver: Basic Profile</li>
                <li>✅ Dynamic Menu Generation</li>
              </ul>
            </div>

            {/* Profile Features */}
            <div
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                borderRadius: '16px',
                padding: '30px',
                color: 'white',
                boxShadow: '0 10px 30px rgba(16, 185, 129, 0.3)',
              }}
            >
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                👤 Profile Management
              </h2>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, lineHeight: '1.8' }}>
                <li>✅ User Information Display</li>
                <li>✅ Role & Department Badges</li>
                <li>✅ Last Login Tracking</li>
                <li>✅ Profile Settings Access</li>
                <li>✅ Notification Preferences</li>
              </ul>
            </div>

            {/* Management Tools */}
            <div
              style={{
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                borderRadius: '16px',
                padding: '30px',
                color: 'white',
                boxShadow: '0 10px 30px rgba(245, 158, 11, 0.3)',
              }}
            >
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                🏢 Management Hub
              </h2>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, lineHeight: '1.8' }}>
                <li>✅ Portal Management</li>
                <li>✅ Billing & Subscriptions</li>
                <li>✅ User Management</li>
                <li>✅ System Analytics</li>
                <li>✅ Admin Dashboard</li>
              </ul>
            </div>

            {/* Admin Tools */}
            <div
              style={{
                background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                borderRadius: '16px',
                padding: '30px',
                color: 'white',
                boxShadow: '0 10px 30px rgba(139, 92, 246, 0.3)',
              }}
            >
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                ⚙️ Admin Tools
              </h2>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, lineHeight: '1.8' }}>
                <li>✅ System Settings</li>
                <li>✅ Feature Flags</li>
                <li>✅ API Management</li>
                <li>✅ Audit Logs</li>
                <li>✅ Security Center</li>
              </ul>
            </div>

            {/* Quick Actions */}
            <div
              style={{
                background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                borderRadius: '16px',
                padding: '30px',
                color: 'white',
                boxShadow: '0 10px 30px rgba(239, 68, 68, 0.3)',
              }}
            >
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                🎯 Quick Actions
              </h2>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, lineHeight: '1.8' }}>
                <li>✅ FleetFlow University℠</li>
                <li>✅ Notification Settings</li>
                <li>✅ Profile Updates</li>
                <li>✅ Security Settings</li>
                <li>✅ Logout Functionality</li>
              </ul>
            </div>

            {/* Integration Features */}
            <div
              style={{
                background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
                borderRadius: '16px',
                padding: '30px',
                color: 'white',
                boxShadow: '0 10px 30px rgba(6, 182, 212, 0.3)',
              }}
            >
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                🔗 Integration
              </h2>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, lineHeight: '1.8' }}>
                <li>✅ Existing RBAC System</li>
                <li>✅ Manager Access Control</li>
                <li>✅ Permission Validation</li>
                <li>✅ Seamless Navigation</li>
                <li>✅ Professional UI/UX</li>
              </ul>
            </div>
          </div>

          {/* Instructions */}
          <div
            style={{
              marginTop: '40px',
              padding: '30px',
              background: 'linear-gradient(135deg, #f3f4f6, #e5e7eb)',
              borderRadius: '16px',
              border: '1px solid #d1d5db',
            }}
          >
            <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#374151', marginBottom: '15px', textAlign: 'center' }}>
              🎯 How to Test the Admin Profile Dropdown
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', color: '#4b5563' }}>
              <div>
                <strong>1. Click the "FM" Avatar</strong>
                <p style={{ margin: '5px 0', fontSize: '0.9rem' }}>Click the circular avatar in the top-right corner to open the profile dropdown.</p>
              </div>
              <div>
                <strong>2. Explore Role-Based Menu</strong>
                <p style={{ margin: '5px 0', fontSize: '0.9rem' }}>Notice different sections: Profile, Management, and Administration based on user role.</p>
              </div>
              <div>
                <strong>3. Test Navigation</strong>
                <p style={{ margin: '5px 0', fontSize: '0.9rem' }}>Click any menu item to navigate to that section (some may not exist yet).</p>
              </div>
              <div>
                <strong>4. Try Logout</strong>
                <p style={{ margin: '5px 0', fontSize: '0.9rem' }}>Click "Sign Out" to test the logout functionality (currently shows alert).</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}