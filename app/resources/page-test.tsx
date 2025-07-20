'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function ResourcesPageTest() {
  const [selectedCategory, setSelectedCategory] = useState<'drivers' | 'dispatch' | 'broker' | 'heavyhaul'>('drivers')

  // Simple test data
  const truckerHotels = [
    {
      name: 'TA Travel Centers',
      description: 'Nationwide truck stops with hotels, parking, and amenities',
      website: 'https://ta-petro.com',
      features: ['Truck Parking', 'Shower Facilities', 'Restaurants', 'Fuel', 'Maintenance']
    }
  ]

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0891b2 0%, #155e75 100%)',
      paddingTop: '80px'
    }}>
      {/* Back Button */}
      <div style={{ padding: '24px' }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <button style={{
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '12px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            fontSize: '16px'
          }}>
            ← Back to Dashboard
          </button>
        </Link>
      </div>

      {/* Main Content Container */}
      <div style={{ 
        maxWidth: '1400px', 
        margin: '0 auto', 
        padding: '0 24px 80px 24px' 
      }}>
        {/* Header */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          padding: '40px',
          marginBottom: '40px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{
            textAlign: 'center',
            marginBottom: '32px'
          }}>
            <h1 style={{
              fontSize: '48px',
              fontWeight: '700',
              background: 'linear-gradient(45deg, #ffffff, #e0f2fe)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              margin: '0 0 16px 0'
            }}>
              📚 Resource Library - Test Version
            </h1>
            <p style={{
              fontSize: '20px',
              color: 'rgba(255, 255, 255, 0.9)',
              margin: '0',
              maxWidth: '600px',
              marginLeft: 'auto',
              marginRight: 'auto',
              lineHeight: '1.6'
            }}>
              Testing with minimal content to identify the issue
            </p>
          </div>

          {/* Navigation Tabs */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              {(['drivers', 'dispatch', 'broker', 'heavyhaul'] as const).map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  style={{
                    padding: '12px 20px',
                    borderRadius: '12px',
                    fontWeight: '600',
                    transition: 'all 0.3s ease',
                    border: 'none',
                    cursor: 'pointer',
                    background: selectedCategory === category 
                      ? 'rgba(255, 255, 255, 0.25)' 
                      : 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    backdropFilter: 'blur(10px)',
                    fontSize: '14px'
                  }}
                >
                  {category === 'drivers' && '🚛 Drivers'}
                  {category === 'dispatch' && '📋 Dispatch'}
                  {category === 'broker' && '🏢 Brokers'}
                  {category === 'heavyhaul' && '🏗️ Heavy Haul'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Sections - Simplified */}
        {selectedCategory === 'drivers' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            
            {/* Trucker-Friendly Hotels & Motels */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '32px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}>
              <h3 style={{
                fontSize: '24px',
                fontWeight: '600',
                color: 'white',
                margin: '0 0 24px 0',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                🏨 Trucker-Friendly Hotels & Motels
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '20px'
              }}>
                {truckerHotels.map((hotel, index) => (
                  <div key={index} style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '12px',
                    padding: '20px',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}>
                    <h4 style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      color: 'white',
                      margin: '0 0 12px 0'
                    }}>
                      {hotel.name}
                    </h4>
                    <p style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.8)',
                      margin: '0 0 16px 0',
                      lineHeight: '1.5'
                    }}>
                      {hotel.description}
                    </p>
                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '6px',
                      marginBottom: '16px'
                    }}>
                      {hotel.features.map((feature, idx) => (
                        <span key={idx} style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '500',
                          background: 'rgba(59, 130, 246, 0.3)',
                          color: '#93c5fd',
                          border: '1px solid rgba(59, 130, 246, 0.2)'
                        }}>
                          {feature}
                        </span>
                      ))}
                    </div>
                    <a href={hotel.website} target="_blank" rel="noopener noreferrer" style={{
                      color: '#ffffff',
                      background: 'rgba(59, 130, 246, 0.6)',
                      textDecoration: 'none',
                      fontSize: '14px',
                      fontWeight: '600',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      display: 'inline-block',
                      transition: 'all 0.3s ease',
                      border: '1px solid rgba(59, 130, 246, 0.8)'
                    }}>
                      Visit Website →
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedCategory === 'dispatch' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '32px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}>
              <h3 style={{
                fontSize: '24px',
                fontWeight: '600',
                color: 'white',
                margin: '0 0 24px 0'
              }}>
                📋 Dispatch Tools (Testing)
              </h3>
              <p style={{ color: 'white' }}>Dispatch content will be here.</p>
            </div>
          </div>
        )}

        {selectedCategory === 'broker' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '32px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}>
              <h3 style={{
                fontSize: '24px',
                fontWeight: '600',
                color: 'white',
                margin: '0 0 24px 0'
              }}>
                🏢 Broker Tools (Testing)
              </h3>
              <p style={{ color: 'white' }}>Broker content will be here.</p>
            </div>
          </div>
        )}

        {selectedCategory === 'heavyhaul' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '32px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}>
              <h3 style={{
                fontSize: '24px',
                fontWeight: '600',
                color: 'white',
                margin: '0 0 24px 0'
              }}>
                🏗️ Heavy Haul Tools (Testing)
              </h3>
              <p style={{ color: 'white' }}>Heavy haul content will be here.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
