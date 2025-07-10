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
            Driver login and access center
          </p>
        </div>

        {/* Login Content */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          padding: '32px',
          position: 'relative',
          zIndex: 2
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#2d3748', margin: '0 0 24px 0', textAlign: 'center' }}>
              Driver Login
            </h2>
            
            {/* Login Form */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.4)',
              border: '1px solid rgba(255, 255, 255, 0.5)',
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
                      border: '1px solid rgba(255, 255, 255, 0.5)',
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
                      border: '1px solid rgba(255, 255, 255, 0.5)',
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

            {/* Additional Info */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.3)',
              borderRadius: '16px',
              padding: '24px',
              margin: '32px 0 0 0',
              textAlign: 'center'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#2d3748', margin: '0 0 12px 0' }}>
                Need Help?
              </h3>
              <p style={{ color: 'rgba(45, 55, 72, 0.8)', fontSize: '14px', margin: '0 0 16px 0' }}>
                Contact your dispatcher or fleet manager for login assistance.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', flexWrap: 'wrap' }}>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: '12px', color: 'rgba(45, 55, 72, 0.6)', margin: '0 0 4px 0' }}>Emergency Dispatch</p>
                  <p style={{ fontSize: '16px', fontWeight: '600', color: '#2d3748', margin: 0 }}>(555) 123-4567</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: '12px', color: 'rgba(45, 55, 72, 0.6)', margin: '0 0 4px 0' }}>IT Support</p>
                  <p style={{ fontSize: '16px', fontWeight: '600', color: '#2d3748', margin: 0 }}>(555) 123-4568</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
