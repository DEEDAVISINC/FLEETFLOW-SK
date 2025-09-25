'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function ResourcesPage() {
  const [selectedCategory, setSelectedCategory] = useState<'drivers' | 'dispatch' | 'broker' | 'heavyhaul'>('drivers')

  // Driver Resources Data
  const truckerHotels = [
    {
      name: 'TA Travel Centers',
      description: 'Nationwide truck stops with hotels, parking, and amenities',
      website: 'https://ta-petro.com',
      features: ['Truck Parking', 'Shower Facilities', 'Restaurants', 'Fuel', 'Maintenance']
    },
    {
      name: 'Pilot Flying J',
      description: 'Premier truck stop chain with comprehensive services',
      website: 'https://pilotflyingj.com',
      features: ['myRewards Program', 'Reserve Parking', 'Showers', 'Laundry', 'CAT Scales']
    },
    {
      name: 'Loves Travel Stops',
      description: 'Family-owned travel stops with trucker amenities',
      website: 'https://loves.com',
      features: ['Truck Parking', 'Fresh Food', 'Showers', 'Dog Parks', 'WiFi']
    },
    {
      name: 'Motel 6',
      description: 'Budget-friendly motels with truck parking',
      website: 'https://motel6.com',
      features: ['Truck Parking', 'Pet Friendly', 'WiFi', 'Easy Access']
    },
    {
      name: 'Red Roof Inn',
      description: 'Extended truck parking and driver discounts',
      website: 'https://redroof.com',
      features: ['Truck Parking', 'Driver Rates', 'Pet Friendly', 'Continental Breakfast']
    }
  ]

  const restStops = [
    {
      name: 'Trucker Path App',
      description: 'Find truck stops, parking, and amenities nationwide',
      website: 'https://truckerpath.com',
      type: 'Mobile App'
    },
    {
      name: 'Park My Truck',
      description: 'Real-time truck parking availability tracker',
      website: 'https://parkmytruck.com',
      type: 'Web Platform'
    },
    {
      name: 'Truck Smart Parking',
      description: 'Verified safe parking locations for professional drivers',
      website: 'https://trucksmartparking.com',
      type: 'Directory'
    }
  ]

  const driverServices = [
    {
      name: 'OOIDA',
      description: 'Owner-Operator Independent Drivers Association - advocacy and support',
      website: 'https://ooida.com',
      category: 'Advocacy'
    },
    {
      name: 'FMCSA',
      description: 'Federal Motor Carrier Safety Administration - regulations and compliance',
      website: 'https://fmcsa.dot.gov',
      category: 'Compliance'
    },
    {
      name: 'DAT Load Board',
      description: 'Premium load matching platform for owner-operators',
      website: 'https://dat.com',
      category: 'Load Boards'
    }
  ]

  // Dispatch Resources Data
  const dispatchTools = [
    {
      name: 'McLeod Software',
      description: 'Comprehensive transportation management system',
      website: 'https://mcleodsoft.com',
      category: 'TMS'
    },
    {
      name: 'Sylectus',
      description: 'Real-time dispatch and tracking platform',
      website: 'https://sylectus.com',
      category: 'Dispatch'
    },
    {
      name: 'LoadDex',
      description: 'Load board and freight matching system',
      website: 'https://loaddex.com',
      category: 'Load Board'
    }
  ]

  // Broker Resources Data
  const brokerPlatforms = [
    {
      name: 'Carrier411',
      description: 'Carrier verification and monitoring platform',
      website: 'https://carrier411.com',
      category: 'Verification'
    },
    {
      name: 'RMIS',
      description: 'Risk Management Information System for freight brokers',
      website: 'https://rmis.com',
      category: 'Risk Management'
    },
    {
      name: 'FreightPath',
      description: 'Modern TMS built for freight brokers',
      website: 'https://freightpath.com',
      category: 'TMS'
    }
  ]

  // Heavy Haul Resources Data
  const heavyHaulServices = [
    {
      name: 'Heavy Haul Pro',
      description: 'Specialized routing and permitting for oversized loads',
      website: 'https://heavyhaulpro.com',
      category: 'Routing'
    },
    {
      name: 'Permit Service Inc',
      description: 'Nationwide permit processing and route planning',
      website: 'https://permitservice.com',
      category: 'Permits'
    },
    {
      name: 'Pilot Car Services',
      description: 'Directory of certified pilot car operators nationwide',
      website: 'https://pilotcarservices.com',
      category: 'Pilot Cars'
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
        <Link href='/fleetflowdash' style={{ textDecoration: 'none' }}>
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
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.2)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
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
              📚 Resource Library
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
              Comprehensive tools and resources for drivers, dispatchers, brokers, and heavy haul specialists
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

        {/* Content Sections */}
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
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.2)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
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
                    <a href={hotel.website} target=""_blank"" rel=""noopener noreferrer"" style={{
                      color: '#60a5fa',
                      textDecoration: 'none',
                      fontSize: '14px',
                      fontWeight: '500',
                      borderBottom: '1px solid transparent',
                      transition: 'border-color 0.3s ease'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.borderBottomColor = '#60a5fa'}
                    onMouseOut={(e) => e.currentTarget.style.borderBottomColor = 'transparent'}>
                      Visit Website →
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Rest Stops & Truck Stops */}
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
                ⛽ Rest Stops & Truck Stop Finders
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '20px'
              }}>
                {restStops.map((stop, index) => (
                  <div key={index} style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '12px',
                    padding: '20px',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.2)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '12px'
                    }}>
                      <h4 style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: 'white',
                        margin: '0'
                      }}>
                        {stop.name}
                      </h4>
                      <span style={{
                        padding: '4px 12px',
                        background: 'rgba(34, 197, 94, 0.3)',
                        color: '#86efac',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '500',
                        border: '1px solid rgba(34, 197, 94, 0.2)'
                      }}>
                        {stop.type}
                      </span>
                    </div>
                    <p style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.8)',
                      margin: '0 0 16px 0',
                      lineHeight: '1.5'
                    }}>
                      {stop.description}
                    </p>
                    <a href={stop.website} target=""_blank"" rel=""noopener noreferrer"" style={{
                      color: '#60a5fa',
                      textDecoration: 'none',
                      fontSize: '14px',
                      fontWeight: '500',
                      borderBottom: '1px solid transparent',
                      transition: 'border-color 0.3s ease'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.borderBottomColor = '#60a5fa'}
                    onMouseOut={(e) => e.currentTarget.style.borderBottomColor = 'transparent'}>
                      Access Tool →
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Driver Services */}
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
                🛠️ Driver Services & Support
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '20px'
              }}>
                {driverServices.map((service, index) => (
                  <div key={index} style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '12px',
                    padding: '20px',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.2)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '12px'
                    }}>
                      <h4 style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: 'white',
                        margin: '0'
                      }}>
                        {service.name}
                      </h4>
                      <span style={{
                        padding: '4px 12px',
                        background: 'rgba(147, 51, 234, 0.3)',
                        color: '#c4b5fd',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '500',
                        border: '1px solid rgba(147, 51, 234, 0.2)'
                      }}>
                        {service.category}
                      </span>
                    </div>
                    <p style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.8)',
                      margin: '0 0 16px 0',
                      lineHeight: '1.5'
                    }}>
                      {service.description}
                    </p>
                    <a href={service.website} target=""_blank"" rel=""noopener noreferrer"" style={{
                      color: '#60a5fa',
                      textDecoration: 'none',
                      fontSize: '14px',
                      fontWeight: '500',
                      borderBottom: '1px solid transparent',
                      transition: 'border-color 0.3s ease'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.borderBottomColor = '#60a5fa'}
                    onMouseOut={(e) => e.currentTarget.style.borderBottomColor = 'transparent'}>
                      Learn More →
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Dispatch Resources */}
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
                margin: '0 0 24px 0',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                📋 Dispatch Management Tools
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '20px'
              }}>
                {dispatchTools.map((tool, index) => (
                  <div key={index} style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '12px',
                    padding: '20px',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.2)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '12px'
                    }}>
                      <h4 style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: 'white',
                        margin: '0'
                      }}>
                        {tool.name}
                      </h4>
                      <span style={{
                        padding: '4px 12px',
                        background: 'rgba(34, 197, 94, 0.3)',
                        color: '#86efac',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '500',
                        border: '1px solid rgba(34, 197, 94, 0.2)'
                      }}>
                        {tool.category}
                      </span>
                    </div>
                    <p style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.8)',
                      margin: '0 0 16px 0',
                      lineHeight: '1.5'
                    }}>
                      {tool.description}
                    </p>
                    <a href={tool.website} target=""_blank"" rel=""noopener noreferrer"" style={{
                      color: '#60a5fa',
                      textDecoration: 'none',
                      fontSize: '14px',
                      fontWeight: '500',
                      borderBottom: '1px solid transparent',
                      transition: 'border-color 0.3s ease'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.borderBottomColor = '#60a5fa'}
                    onMouseOut={(e) => e.currentTarget.style.borderBottomColor = 'transparent'}>
                      Learn More →
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Access Banner */}
            <div style={{
              background: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)',
              borderRadius: '16px',
              padding: '24px',
              color: 'white'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div>
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    margin: '0 0 8px 0'
                  }}>
                    📊 Dispatch Central Hub
                  </h3>
                  <p style={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    margin: '0'
                  }}>
                    Access your main dispatch dashboard for real-time load management and driver coordination.
                  </p>
                </div>
                <div style={{ marginLeft: '24px' }}>
                  <Link href="/dispatch"" style={{ textDecoration: 'none' }}>
                    <button style={{
                      background: 'white',
                      color: '#10b981',
                      padding: '12px 24px',
                      borderRadius: '12px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      border: 'none',
                      transition: 'all 0.3s ease'
                    }}>
                      Go to Dispatch
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Broker Resources */}
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
                margin: '0 0 24px 0',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                🏢 Broker Platforms & Tools
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '20px'
              }}>
                {brokerPlatforms.map((platform, index) => (
                  <div key={index} style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '12px',
                    padding: '20px',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.2)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '12px'
                    }}>
                      <h4 style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: 'white',
                        margin: '0'
                      }}>
                        {platform.name}
                      </h4>
                      <span style={{
                        padding: '4px 12px',
                        background: 'rgba(59, 130, 246, 0.3)',
                        color: '#93c5fd',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '500',
                        border: '1px solid rgba(59, 130, 246, 0.2)'
                      }}>
                        {platform.category}
                      </span>
                    </div>
                    <p style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.8)',
                      margin: '0 0 16px 0',
                      lineHeight: '1.5'
                    }}>
                      {platform.description}
                    </p>
                    <a href={platform.website} target=""_blank"" rel=""noopener noreferrer"" style={{
                      color: '#60a5fa',
                      textDecoration: 'none',
                      fontSize: '14px',
                      fontWeight: '500',
                      borderBottom: '1px solid transparent',
                      transition: 'border-color 0.3s ease'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.borderBottomColor = '#60a5fa'}
                    onMouseOut={(e) => e.currentTarget.style.borderBottomColor = 'transparent'}>
                      Learn More →
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Access Banner */}
            <div style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              borderRadius: '16px',
              padding: '24px',
              color: 'white'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div>
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    margin: '0 0 8px 0'
                  }}>
                    🤝 Broker Network Hub
                  </h3>
                  <p style={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    margin: '0'
                  }}>
                    Connect with our broker dashboard for load posting, carrier management, and rate negotiations.
                  </p>
                </div>
                <div style={{ marginLeft: '24px' }}>
                  <button style={{
                    background: 'white',
                    color: '#1d4ed8',
                    padding: '12px 24px',
                    borderRadius: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    border: 'none',
                    transition: 'all 0.3s ease'
                  }}>
                    Broker Portal
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Heavy Haul Resources */}
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
                margin: '0 0 24px 0',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                🏗️ Heavy Haul Specialized Services
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '20px'
              }}>
                {heavyHaulServices.map((service, index) => (
                  <div key={index} style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '12px',
                    padding: '20px',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.2)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '12px'
                    }}>
                      <h4 style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: 'white',
                        margin: '0'
                      }}>
                        {service.name}
                      </h4>
                      <span style={{
                        padding: '4px 12px',
                        background: 'rgba(245, 158, 11, 0.3)',
                        color: '#fbbf24',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '500',
                        border: '1px solid rgba(245, 158, 11, 0.2)'
                      }}>
                        {service.category}
                      </span>
                    </div>
                    <p style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.8)',
                      margin: '0 0 16px 0',
                      lineHeight: '1.5'
                    }}>
                      {service.description}
                    </p>
                    <a href={service.website} target=""_blank"" rel=""noopener noreferrer"" style={{
                      color: '#60a5fa',
                      textDecoration: 'none',
                      fontSize: '14px',
                      fontWeight: '500',
                      borderBottom: '1px solid transparent',
                      transition: 'border-color 0.3s ease'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.borderBottomColor = '#60a5fa'}
                    onMouseOut={(e) => e.currentTarget.style.borderBottomColor = 'transparent'}>
                      Learn More →
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Access Banner */}
            <div style={{
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              borderRadius: '16px',
              padding: '24px',
              color: 'white'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div>
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    margin: '0 0 8px 0'
                  }}>
                    🚨 Heavy Haul Emergency Services
                  </h3>
                  <p style={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    margin: '0'
                  }}>
                    Need immediate permit processing or pilot car services? Access our emergency contact directory for 24/7 heavy haul support.
                  </p>
                </div>
                <div style={{ marginLeft: '24px' }}>
                  <button style={{
                    background: 'white',
                    color: '#d97706',
                    padding: '12px 24px',
                    borderRadius: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    border: 'none',
                    transition: 'all 0.3s ease'
                  }}>
                    Emergency Contacts
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
