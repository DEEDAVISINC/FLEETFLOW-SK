'use client';

import React from 'react';

export default function DriversPortalPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: `
        linear-gradient(rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1)),
        linear-gradient(135deg, #f7c52d 0%, #f4a832 100%)
      `,
      paddingTop: '80px',
      position: 'relative'
    }}>
      {/* Black Road Lines */}
      <div style={{
        position: 'absolute',
        top: '40%',
        left: '0',
        right: '0',
        height: '4px',
        background: 'repeating-linear-gradient(90deg, #000000 0px, #000000 60px, transparent 60px, transparent 120px)',
        opacity: 0.3,
        zIndex: 1
      }}></div>
      <div style={{
        position: 'absolute',
        top: 'calc(40% + 30px)',
        left: '0',
        right: '0',
        height: '4px',
        background: 'repeating-linear-gradient(90deg, #000000 0px, #000000 60px, transparent 60px, transparent 120px)',
        opacity: 0.3,
        zIndex: 1
      }}></div>
      <div style={{
        position: 'absolute',
        top: '60%',
        left: '0',
        right: '0',
        height: '4px',
        background: 'repeating-linear-gradient(90deg, #000000 0px, #000000 60px, transparent 60px, transparent 120px)',
        opacity: 0.3,
        zIndex: 1
      }}></div>
      <div style={{
        position: 'absolute',
        top: 'calc(60% + 30px)',
        left: '0',
        right: '0',
        height: '4px',
        background: 'repeating-linear-gradient(90deg, #000000 0px, #000000 60px, transparent 60px, transparent 120px)',
        opacity: 0.3,
        zIndex: 1
      }}></div>

      <main style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 24px 32px'
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '48px',
          background: 'rgba(255, 255, 255, 0.3)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.4)',
          padding: '32px',
          position: 'relative',
          zIndex: 2
        }}>
          <h1 style={{
            fontSize: '48px',
            fontWeight: 'bold',
            color: '#2d3748',
            margin: '0 0 12px 0',
            textShadow: '2px 2px 4px rgba(255,255,255,0.5)'
          }}>
            🚛 Driver Portal
          </h1>
          <p style={{
            fontSize: '20px',
            color: 'rgba(45, 55, 72, 0.8)',
            margin: 0,
            fontWeight: '500'
          }}>
            Welcome to your driver dashboard and login center
          </p>
        </div>

        {/* Tabs */}
        <div style={{
          background: 'rgba(255, 193, 45, 0.3)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px 20px 0 0',
          border: '1px solid rgba(255, 193, 45, 0.4)',
          padding: '0 24px',
          position: 'relative',
          zIndex: 2
        }}>
          <nav style={{ display: 'flex', gap: '32px', borderBottom: '1px solid rgba(255, 193, 45, 0.4)', flexWrap: 'wrap' }}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '16px 0',
                  borderBottom: activeTab === tab.id ? '3px solid #2d3748' : '3px solid transparent',
                  fontWeight: '600',
                  fontSize: '14px',
                  color: activeTab === tab.id ? '#2d3748' : 'rgba(45, 55, 72, 0.8)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  if (activeTab !== tab.id) {
                    e.currentTarget.style.color = '#2d3748';
                    e.currentTarget.style.background = 'rgba(255, 193, 45, 0.2)';
                    e.currentTarget.style.borderRadius = '8px';
                    e.currentTarget.style.padding = '12px 16px';
                  }
                }}
                onMouseOut={(e) => {
                  if (activeTab !== tab.id) {
                    e.currentTarget.style.color = 'rgba(45, 55, 72, 0.8)';
                    e.currentTarget.style.background = 'none';
                    e.currentTarget.style.borderRadius = '0';
                    e.currentTarget.style.padding = '16px 0';
                  }
                }}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div style={{
          background: 'rgba(255, 193, 45, 0.25)',
          backdropFilter: 'blur(20px)',
          borderRadius: '0 0 20px 20px',
          border: '1px solid rgba(255, 193, 45, 0.4)',
          padding: '32px',
          minHeight: '400px',
          position: 'relative',
          zIndex: 2
        }}>
          {activeTab === 'login' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#2d3748', margin: '0 0 24px 0', textAlign: 'center' }}>
                Driver Login
              </h2>
              
              {/* Login Form */}
              <div style={{
                background: 'rgba(255, 193, 45, 0.4)',
                border: '1px solid rgba(255, 193, 45, 0.6)',
                borderRadius: '16px',
                padding: '32px',
                maxWidth: '500px',
                margin: '0 auto',
                width: '100%',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <label style={{ 
                      display: 'block', 
                      fontSize: '14px', 
                      fontWeight: '600', 
                      color: '#374151', 
                      marginBottom: '8px' 
                    }}>
                      Driver ID / Email
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your driver ID or email"
                      style={{
                        width: '100%',
                        padding: '14px 16px',
                        borderRadius: '12px',
                        border: '1px solid rgba(255, 193, 45, 0.6)',
                        fontSize: '16px',
                        outline: 'none',
                        transition: 'all 0.3s ease',
                        background: 'rgba(255, 255, 255, 0.9)'
                      }}
                    />
                  </div>
                  
                  <div>
                    <label style={{ 
                      display: 'block', 
                      fontSize: '14px', 
                      fontWeight: '600', 
                      color: '#374151', 
                      marginBottom: '8px' 
                    }}>
                      Password
                    </label>
                    <input
                      type="password"
                      placeholder="Enter your password"
                      style={{
                        width: '100%',
                        padding: '14px 16px',
                        borderRadius: '12px',
                        border: '1px solid rgba(255, 193, 45, 0.6)',
                        fontSize: '16px',
                        outline: 'none',
                        transition: 'all 0.3s ease',
                        background: 'rgba(255, 255, 255, 0.9)'
                      }}
                    />
                  </div>
                  
                  <div>
                    <label style={{ 
                      display: 'block', 
                      fontSize: '14px', 
                      fontWeight: '600', 
                      color: '#374151', 
                      marginBottom: '8px' 
                    }}>
                      Password
                    </label>
                    <input
                      type="password"
                      placeholder="Enter your password"
                      style={{
                        width: '100%',
                        padding: '14px 16px',
                        borderRadius: '12px',
                        border: '1px solid rgba(255, 193, 45, 0.6)',
                        fontSize: '16px',
                        outline: 'none',
                        transition: 'all 0.3s ease',
                        background: 'rgba(255, 255, 255, 0.9)'
                      }}
                    />
                  </div>
                  
                  <button style={{
                    background: 'linear-gradient(135deg, #2d3748, #1a202c)',
                    color: 'white',
                    padding: '16px 24px',
                    borderRadius: '12px',
                    border: 'none',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.2)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                  }}>
                    Sign In
                  </button>
                  
                  <div style={{ textAlign: 'center', marginTop: '16px' }}>
                    <a href="#" style={{ color: '#2d3748', fontSize: '14px', textDecoration: 'none' }}>
                      Forgot your password?
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'dashboard' && (
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#2d3748', margin: '0 0 24px 0' }}>
                Driver Dashboard
              </h2>
              <p style={{ color: '#4a5568', fontSize: '16px' }}>
                Welcome to your personal driver dashboard. Here you can view your current assignments, track your performance, and manage your schedule.
              </p>
            </div>
          )}

          {activeTab === 'routes' && (
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#2d3748', margin: '0 0 24px 0' }}>
                Assigned Routes
              </h2>
              <p style={{ color: '#4a5568', fontSize: '16px' }}>
                View your current and upcoming route assignments, including pickup and delivery locations, times, and special instructions.
              </p>
            </div>
          )}

          {activeTab === 'schedule' && (
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#2d3748', margin: '0 0 24px 0' }}>
                Schedule
              </h2>
              <p style={{ color: '#4a5568', fontSize: '16px' }}>
                Manage your driving schedule, view upcoming shifts, and request time off.
              </p>
            </div>
          )}

          {activeTab === 'documents' && (
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#2d3748', margin: '0 0 24px 0' }}>
                Documents
              </h2>
              <p style={{ color: '#4a5568', fontSize: '16px' }}>
                Access important documents including your license, certifications, safety records, and company policies.
              </p>
            </div>
          )}

          {activeTab === 'performance' && (
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#2d3748', margin: '0 0 24px 0' }}>
                Performance
              </h2>
              <p style={{ color: '#4a5568', fontSize: '16px' }}>
                Track your driving performance, safety scores, fuel efficiency, and delivery metrics.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
