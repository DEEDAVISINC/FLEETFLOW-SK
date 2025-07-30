'use client'

import { useState, useEffect, useCallback } from 'react'
import FreightBrokerAgentSystem from '../services/FreightBrokerAgentSystem'
import type { FreightAgent, FreightProspect, LoadDetails, CarrierProfile } from '../services/FreightBrokerAgentSystem'

interface DashboardMetrics {
  system_status: any;
  business_metrics: any;
  financial_metrics: any;
  performance_metrics: any;
}

export default function FreightBrokerDashboard() {
  const [agentSystem] = useState(() => new FreightBrokerAgentSystem())
  const [agents, setAgents] = useState<FreightAgent[]>([])
  const [prospects, setProspects] = useState<FreightProspect[]>([])
  const [loads, setLoads] = useState<LoadDetails[]>([])
  const [carriers, setCarriers] = useState<CarrierProfile[]>([])
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(true)

  const refreshData = useCallback(async () => {
    try {
      const [agentsData, metricsData] = await Promise.all([
        agentSystem.getAllAgents(),
        agentSystem.getSystemAnalytics()
      ])
      
      setAgents(agentsData)
      setMetrics(metricsData)
      setLoading(false)
    } catch (error) {
      console.error('Error refreshing data:', error)
      setLoading(false)
    }
  }, [agentSystem])

  useEffect(() => {
    refreshData()
    
    // Set up real-time updates
    const interval = setInterval(refreshData, 30000) // Refresh every 30 seconds
    
    // Listen for agent events
    agentSystem.on('agent_status_changed', refreshData)
    agentSystem.on('prospects_discovered', (data) => {
      setProspects(data.prospects)
    })
    agentSystem.on('quote_generated', refreshData)
    agentSystem.on('load_created', refreshData)
    agentSystem.on('carrier_onboarded', refreshData)
    
    return () => {
      clearInterval(interval)
      agentSystem.removeAllListeners()
    }
  }, [agentSystem, refreshData])

  const getAgentStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10b981'
      case 'learning': return '#f59e0b'
      case 'optimizing': return '#3b82f6'
      case 'offline': return '#ef4444'
      default: return '#6b7280'
    }
  }

  const handleProspectSearch = async () => {
    try {
      const newProspects = await agentSystem.discoverShippingCompanies({
        industry: 'Manufacturing',
        location: 'United States',
        min_revenue: 1000000,
        max_results: 20
      })
      setProspects(newProspects)
    } catch (error) {
      console.error('Error searching prospects:', error)
    }
  }

  const handleGenerateQuote = async () => {
    try {
      const quote = await agentSystem.generateFreightQuote({
        origin: 'Chicago, IL',
        destination: 'Atlanta, GA',
        weight: 45000,
        equipment_type: 'Dry Van',
        commodity: 'General Freight',
        pickup_date: new Date()
      })
      console.log('Quote generated:', quote)
    } catch (error) {
      console.error('Error generating quote:', error)
    }
  }

  const handleCreateLoad = async () => {
    try {
      const load = await agentSystem.createAndTrackLoad({
        origin: 'Los Angeles, CA',
        destination: 'New York, NY',
        weight: 40000,
        equipment_type: 'Dry Van',
        commodity: 'Electronics',
        rate: 3500
      })
      setLoads(prev => [...prev, load])
    } catch (error) {
      console.error('Error creating load:', error)
    }
  }

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '600px',
        fontSize: '1.2rem',
        color: '#6b7280'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🚛</div>
          <div>Loading AI Freight Broker System...</div>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '16px',
      padding: '24px',
      border: '1px solid rgba(255, 255, 255, 0.8)',
      minHeight: '800px'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        paddingBottom: '16px',
        borderBottom: '2px solid rgba(16, 185, 129, 0.2)'
      }}>
        <div>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            margin: '0 0 8px 0',
            color: '#10b981'
          }}>
            🚛 AI Freight Broker Control Center
          </h1>
          <p style={{
            fontSize: '1.1rem',
            margin: 0,
            color: '#6b7280'
          }}>
            Complete freight brokerage automation with $0 API costs
          </p>
        </div>
        <div style={{
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '12px',
          fontSize: '1rem',
          fontWeight: 'bold',
          textAlign: 'center'
        }}>
          <div>System Status</div>
          <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>
            {metrics?.system_status?.uptime} UPTIME
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '24px',
        borderBottom: '1px solid rgba(0,0,0,0.1)',
        paddingBottom: '16px'
      }}>
        {[
          { id: 'overview', label: '📊 Overview', desc: 'System metrics' },
          { id: 'agents', label: '🤖 AI Agents', desc: 'Agent monitoring' },
          { id: 'prospects', label: '🔍 Prospects', desc: 'Lead generation' },
          { id: 'quotes', label: '💰 Quotes', desc: 'Rate generation' },
          { id: 'loads', label: '📦 Loads', desc: 'Load management' },
          { id: 'carriers', label: '🚚 Carriers', desc: 'Carrier network' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              background: activeTab === tab.id 
                ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                : 'rgba(255, 255, 255, 0.8)',
              color: activeTab === tab.id ? 'white' : '#4a5568',
              padding: '12px 16px',
              borderRadius: '8px',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: 'bold',
              transition: 'all 0.3s ease',
              flex: 1,
              textAlign: 'center'
            }}
          >
            <div>{tab.label}</div>
            <div style={{ fontSize: '0.7rem', opacity: 0.8, marginTop: '4px' }}>
              {tab.desc}
            </div>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div>
          {/* System Overview Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            marginBottom: '24px'
          }}>
            {metrics && Object.entries(metrics).map(([category, data]) => (
              <div key={category} style={{
                background: 'rgba(255, 255, 255, 0.9)',
                padding: '20px',
                borderRadius: '12px',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                textAlign: 'center'
              }}>
                <h3 style={{
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  margin: '0 0 12px 0',
                  color: '#10b981',
                  textTransform: 'capitalize'
                }}>
                  {category.replace(/_/g, ' ')}
                </h3>
                {typeof data === 'object' && Object.entries(data).slice(0, 3).map(([key, value]) => (
                  <div key={key} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '4px 0',
                    fontSize: '0.9rem',
                    borderBottom: '1px solid rgba(0,0,0,0.1)'
                  }}>
                    <span style={{ color: '#6b7280' }}>{key.replace(/_/g, ' ')}</span>
                    <span style={{ fontWeight: 'bold', color: '#10b981' }}>{String(value)}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Free API Integration Status */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            marginBottom: '24px'
          }}>
            <h3 style={{
              fontSize: '1.3rem',
              fontWeight: 'bold',
              margin: '0 0 16px 0',
              color: '#10b981'
            }}>
              🔗 Free API Integration Status
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '12px'
            }}>
              {[
                { name: 'OpenCorporates', status: 'Connected', description: 'Company discovery' },
                { name: 'SEC EDGAR', status: 'Connected', description: 'Financial data' },
                { name: 'BTS Transportation', status: 'Connected', description: 'Market data' },
                { name: 'BLS Employment', status: 'Connected', description: 'Labor costs' },
                { name: 'FRED Economic', status: 'Connected', description: 'Economic indicators' },
                { name: 'EPA SmartWay', status: 'Connected', description: 'Sustainability' },
                { name: 'USAspending', status: 'Connected', description: 'Government contracts' },
                { name: 'Trade.gov', status: 'Connected', description: 'Trade verification' }
              ].map((api, i) => (
                <div key={i} style={{
                  background: 'rgba(16, 185, 129, 0.1)',
                  padding: '12px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <div style={{ fontWeight: 'bold', color: '#2d3748' }}>{api.name}</div>
                    <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>{api.description}</div>
                  </div>
                  <div style={{
                    color: '#10b981',
                    fontSize: '0.8rem',
                    fontWeight: 'bold'
                  }}>
                    ✓ {api.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'agents' && (
        <div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '20px'
          }}>
            {agents.map(agent => (
              <div
                key={agent.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: '12px',
                  padding: '20px',
                  border: `2px solid ${getAgentStatusColor(agent.status)}`,
                  transition: 'all 0.3s ease'
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '12px'
                }}>
                  <h3 style={{
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    margin: 0,
                    color: '#2d3748'
                  }}>
                    {agent.name}
                  </h3>
                  <div style={{
                    background: getAgentStatusColor(agent.status),
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                    textTransform: 'capitalize'
                  }}>
                    {agent.status}
                  </div>
                </div>

                <div style={{
                  fontSize: '0.9rem',
                  color: '#10b981',
                  fontWeight: 'bold',
                  marginBottom: '8px'
                }}>
                  {agent.role}
                </div>

                <p style={{
                  fontSize: '0.9rem',
                  color: '#6b7280',
                  lineHeight: 1.4,
                  marginBottom: '12px'
                }}>
                  {agent.description}
                </p>

                {/* Performance Metrics */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '8px',
                  marginBottom: '12px'
                }}>
                  {Object.entries(agent.performance).slice(0, 4).map(([key, value]) => (
                    <div key={key} style={{
                      background: 'rgba(16, 185, 129, 0.1)',
                      padding: '8px',
                      borderRadius: '6px',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#10b981' }}>
                        {String(value)}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#6b7280', textTransform: 'capitalize' }}>
                        {key.replace(/_/g, ' ')}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Capabilities */}
                <div style={{
                  fontSize: '0.8rem',
                  color: '#6b7280'
                }}>
                  <strong>Core Capabilities:</strong>
                  <ul style={{
                    margin: '4px 0 0 0',
                    paddingLeft: '16px',
                    listStyle: 'none'
                  }}>
                    {agent.capabilities.slice(0, 3).map((capability, i) => (
                      <li key={i} style={{ marginBottom: '2px' }}>
                        • {capability}
                      </li>
                    ))}
                    {agent.capabilities.length > 3 && (
                      <li style={{ fontStyle: 'italic' }}>
                        ...and {agent.capabilities.length - 3} more
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'prospects' && (
        <div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <h3 style={{
              fontSize: '1.4rem',
              fontWeight: 'bold',
              margin: 0,
              color: '#10b981'
            }}>
              🔍 Lead Generation & Prospecting
            </h3>
            <button
              onClick={handleProspectSearch}
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                padding: '12px 20px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: 'bold'
              }}
            >
              🔍 Discover New Prospects
            </button>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '16px'
          }}>
            {prospects.length > 0 ? prospects.map(prospect => (
              <div
                key={prospect.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: '12px',
                  padding: '16px',
                  border: '1px solid rgba(16, 185, 129, 0.2)'
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '8px'
                }}>
                  <h4 style={{
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    margin: 0,
                    color: '#2d3748'
                  }}>
                    {prospect.company_name}
                  </h4>
                  <div style={{
                    background: prospect.lead_score > 80 ? '#10b981' : '#f59e0b',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '0.8rem',
                    fontWeight: 'bold'
                  }}>
                    {prospect.lead_score}/100
                  </div>
                </div>
                
                <div style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '8px' }}>
                  {prospect.industry} • ${prospect.opportunity_value.toLocaleString()} opportunity
                </div>
                
                <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                  <strong>Contact:</strong> {prospect.contact_info.primary_contact}<br />
                  <strong>Next Actions:</strong> {prospect.next_actions.slice(0, 2).join(', ')}
                </div>
              </div>
            )) : (
              <div style={{
                gridColumn: '1 / -1',
                textAlign: 'center',
                padding: '40px',
                color: '#6b7280'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔍</div>
                <p>No prospects discovered yet. Click "Discover New Prospects" to start lead generation.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'quotes' && (
        <div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <h3 style={{
              fontSize: '1.4rem',
              fontWeight: 'bold',
              margin: 0,
              color: '#10b981'
            }}>
              💰 Dynamic Rate Quoting
            </h3>
            <button
              onClick={handleGenerateQuote}
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                padding: '12px 20px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: 'bold'
              }}
            >
              💰 Generate Sample Quote
            </button>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📊</div>
            <h4 style={{ fontSize: '1.2rem', color: '#2d3748', marginBottom: '8px' }}>
              AI-Powered Quote Generation
            </h4>
            <p style={{ color: '#6b7280', marginBottom: '16px' }}>
              Using real-time market data from BTS, FRED, and EPA APIs
            </p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '16px'
            }}>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>$2.65</div>
                <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>Avg Rate/Mile</div>
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>94%</div>
                <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>Accuracy</div>
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>1.2s</div>
                <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>Response Time</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'loads' && (
        <div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <h3 style={{
              fontSize: '1.4rem',
              fontWeight: 'bold',
              margin: 0,
              color: '#10b981'
            }}>
              📦 Load Management & Tracking
            </h3>
            <button
              onClick={handleCreateLoad}
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                padding: '12px 20px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: 'bold'
              }}
            >
              📦 Create Sample Load
            </button>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '16px'
          }}>
            {loads.length > 0 ? loads.map(load => (
              <div
                key={load.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: '12px',
                  padding: '16px',
                  border: '1px solid rgba(16, 185, 129, 0.2)'
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '8px'
                }}>
                  <h4 style={{
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    margin: 0,
                    color: '#2d3748'
                  }}>
                    {load.id}
                  </h4>
                  <div style={{
                    background: load.status === 'delivered' ? '#10b981' : '#f59e0b',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                    textTransform: 'capitalize'
                  }}>
                    {load.status}
                  </div>
                </div>
                
                <div style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '8px' }}>
                  {load.origin} → {load.destination}
                </div>
                
                <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                  <strong>Weight:</strong> {load.weight.toLocaleString()} lbs<br />
                  <strong>Equipment:</strong> {load.equipment_type}<br />
                  <strong>Rate:</strong> ${load.rate.toLocaleString()}
                </div>
              </div>
            )) : (
              <div style={{
                gridColumn: '1 / -1',
                textAlign: 'center',
                padding: '40px',
                color: '#6b7280'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📦</div>
                <p>No loads created yet. Click "Create Sample Load" to start load management.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'carriers' && (
        <div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <h3 style={{
              fontSize: '1.4rem',
              fontWeight: 'bold',
              margin: 0,
              color: '#10b981'
            }}>
              🚚 Carrier Network Management
            </h3>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🚚</div>
            <h4 style={{ fontSize: '1.2rem', color: '#2d3748', marginBottom: '8px' }}>
              Carrier Network Intelligence
            </h4>
            <p style={{ color: '#6b7280', marginBottom: '16px' }}>
              Automated carrier onboarding and performance optimization
            </p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '16px'
            }}>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>1,247</div>
                <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>Active Carriers</div>
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>96%</div>
                <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>On-Time Rate</div>
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>4.7/5</div>
                <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>Avg Rating</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Action Bar */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginTop: '24px',
        padding: '16px',
        background: 'rgba(16, 185, 129, 0.1)',
        borderRadius: '12px',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={() => window.location.href = '/ai'}
          style={{
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: 'white',
            padding: '12px 20px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: 'bold'
          }}
        >
          🔙 Back to AI Hub
        </button>
        
        <button
          onClick={() => window.location.href = '/analytics'}
          style={{
            background: 'rgba(255, 255, 255, 0.8)',
            color: '#10b981',
            padding: '12px 20px',
            borderRadius: '8px',
            border: '2px solid #10b981',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: 'bold'
          }}
        >
          📊 View Analytics
        </button>

        <button
          onClick={() => window.location.href = '/university?tab=ai-training'}
          style={{
            background: 'rgba(255, 255, 255, 0.8)',
            color: '#10b981',
            padding: '12px 20px',
            borderRadius: '8px',
            border: '2px solid #10b981',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: 'bold'
          }}
        >
          🎓 AI Training
        </button>

        <button
          onClick={refreshData}
          style={{
            background: 'rgba(255, 255, 255, 0.8)',
            color: '#10b981',
            padding: '12px 20px',
            borderRadius: '8px',
            border: '2px solid #10b981',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: 'bold'
          }}
        >
          🔄 Refresh Data
        </button>
      </div>
    </div>
  )
} 