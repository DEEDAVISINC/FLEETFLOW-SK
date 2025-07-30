'use client'

import { useState, useEffect } from 'react'
import { EDIStatusMonitor } from '../../components/EDIStatusMonitor'

interface AIInsight {
  type: 'route_optimization' | 'maintenance_prediction' | 'cost_optimization' | 'driver_analysis' | 'dispatch_optimization' | 'carrier_matching' | 'rate_optimization';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  data: any;
  timestamp: string;
}

interface AutomationStatus {
  isRunning: boolean;
  lastUpdate: string | null;
  tasksRunning: string[];
}

export default function AIAutomationDashboard() {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'dispatch' | 'freight' | 'intelligence' | 'optimization' | 'insights'>('overview');
  const [automationStatus, setAutomationStatus] = useState<AutomationStatus>({
    isRunning: false,
    lastUpdate: null,
    tasksRunning: []
  });
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [loading, setLoading] = useState(false);
  const [dispatchRecommendation, setDispatchRecommendation] = useState<any>(null);
  const [testingDispatch, setTestingDispatch] = useState(false);
  const [showSetupGuide, setShowSetupGuide] = useState(false);

  useEffect(() => {
    loadAIInsights();
    loadAutomationStatus();
  }, []);

  const loadAutomationStatus = async () => {
    try {
      const response = await fetch('/api/ai/automation');
      const data = await response.json();
      if (data.success) {
        setAutomationStatus(data.status);
      }
    } catch (error) {
      console.error('Failed to load automation status:', error);
    }
  };

  const loadAIInsights = async () => {
    setLoading(true);
    try {
      // Generate sample insights (in production, these would come from your database)
      const sampleInsights: AIInsight[] = [
        {
          type: 'dispatch_optimization',
          title: 'Smart Dispatch Recommendation',
          description: 'AI identified optimal carrier for Load #FL-2024-0892 with 95% confidence',
          priority: 'high',
          data: { loadId: 'FL-2024-0892', recommendedCarrier: 'Premium Transport LLC', confidence: 95, savings: 180 },
          timestamp: new Date().toISOString()
        },
        {
          type: 'carrier_matching',
          title: 'Carrier Performance Alert',
          description: 'Swift Logistics showing improved on-time performance (+12% this month)',
          priority: 'medium',
          data: { carrierId: 'CAR-001', improvement: 12, newRating: 92 },
          timestamp: new Date().toISOString()
        },
        {
          type: 'rate_optimization',
          title: 'Rate Optimization Opportunity',
          description: 'Current market rates 8% above our pricing on Atlanta-Miami lane',
          priority: 'medium',
          data: { lane: 'Atlanta-Miami', marketRate: 2850, currentRate: 2640, opportunity: 210 },
          timestamp: new Date().toISOString()
        },
        {
          type: 'maintenance_prediction',
          title: 'Predictive Maintenance Alert',
          description: 'Vehicle Truck-045 showing early signs of potential brake system issues',
          priority: 'high',
          data: { vehicleId: 'V001', estimatedCost: 850, daysUntilService: 7 },
          timestamp: new Date().toISOString()
        },
        {
          type: 'route_optimization',
          title: 'Route Efficiency Opportunity',
          description: 'AI identified 15% fuel savings potential on current routes',
          priority: 'medium',
          data: { potentialSavings: 1250, affectedRoutes: 5 },
          timestamp: new Date().toISOString()
        },
        {
          type: 'cost_optimization',
          title: 'Cost Reduction Opportunity',
          description: 'Maintenance scheduling optimization could save $3,200/month',
          priority: 'medium',
          data: { monthlySavings: 3200, implementationTime: '2 weeks' },
          timestamp: new Date().toISOString()
        }
      ];
      
      setInsights(sampleInsights);
    } catch (error) {
      console.error('Failed to load AI insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAutomation = async () => {
    try {
      const action = automationStatus.isRunning ? 'stop' : 'start';
      const response = await fetch('/api/ai/automation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });
      
      const data = await response.json();
      if (data.success) {
        setAutomationStatus(data.status);
      }
    } catch (error) {
      console.error('Failed to toggle automation:', error);
    }
  };

  const testAIDispatch = async () => {
    setTestingDispatch(true);
    try {
      // Sample load and carriers for testing
      const testLoad = {
        id: 'FL-TEST-001',
        origin: 'Atlanta, GA',
        destination: 'Miami, FL',
        weight: 35000,
        freightClass: 'Class 70',
        specialRequirements: ['refrigerated'],
        urgency: 'medium',
        value: 45000,
        pickupDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        deliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        distance: 650
      };

      const testCarriers = [
        {
          id: 'CAR-001',
          name: 'Premium Transport LLC',
          currentLocation: 'Atlanta, GA',
          capacity: 40000,
          specializations: ['refrigerated', 'general_freight'],
          performanceScore: 92,
          rateHistory: [2.45, 2.52, 2.48],
          availability: {
            earliestPickup: new Date().toISOString(),
            preferredLanes: ['Southeast']
          },
          equipmentType: 'refrigerated_trailer',
          safetyRating: 88,
          onTimePercentage: 94,
          customerSatisfaction: 4.3
        },
        {
          id: 'CAR-002',
          name: 'Swift Logistics Inc',
          currentLocation: 'Jacksonville, FL',
          capacity: 45000,
          specializations: ['general_freight'],
          performanceScore: 85,
          rateHistory: [2.35, 2.41, 2.38],
          availability: {
            earliestPickup: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
            preferredLanes: ['Southeast', 'Northeast']
          },
          equipmentType: 'dry_van',
          safetyRating: 91,
          onTimePercentage: 87,
          customerSatisfaction: 4.1
        },
        {
          id: 'CAR-003',
          name: 'Reliable Freight Co',
          currentLocation: 'Tampa, FL',
          capacity: 38000,
          specializations: ['refrigerated', 'hazmat'],
          performanceScore: 89,
          rateHistory: [2.55, 2.48, 2.62],
          availability: {
            earliestPickup: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
            preferredLanes: ['Southeast']
          },
          equipmentType: 'refrigerated_trailer',
          safetyRating: 93,
          onTimePercentage: 91,
          customerSatisfaction: 4.5
        }
      ];

      const response = await fetch('/api/ai/dispatch-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ load: testLoad, carriers: testCarriers })
      });

      const result = await response.json();
      setDispatchRecommendation(result.recommendation);
      
    } catch (error) {
      console.error('AI dispatch test failed:', error);
    } finally {
      setTestingDispatch(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return { 
          backgroundColor: '#dc2626', 
          color: 'white', 
          borderColor: '#dc2626' 
        };
      case 'high':
        return { 
          backgroundColor: '#ea580c', 
          color: 'white', 
          borderColor: '#ea580c' 
        };
      case 'medium':
        return { 
          backgroundColor: '#d97706', 
          color: 'white', 
          borderColor: '#d97706' 
        };
      case 'low':
        return { 
          backgroundColor: '#2563eb', 
          color: 'white', 
          borderColor: '#2563eb' 
        };
      default:
        return { 
          backgroundColor: '#4b5563', 
          color: 'white', 
          borderColor: '#4b5563' 
        };
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'maintenance_prediction':
        return '🔧';
      case 'route_optimization':
        return '🗺️';
      case 'cost_optimization':
        return '💰';
      case 'driver_analysis':
        return '👨‍💼';
      case 'dispatch_optimization':
        return '🚛';
      case 'carrier_matching':
        return '🤝';
      case 'rate_optimization':
        return '📈';
      default:
        return '🤖';
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      paddingTop: '80px'
    }}>
      {/* Main Container */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 24px 32px'
      }}>
        {/* Header */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '32px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div style={{
              padding: '16px',
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '12px'
            }}>
              <span style={{ fontSize: '32px' }}>🤖</span>
            </div>
            <div>
              <h1 style={{
                fontSize: '36px',
                fontWeight: 'bold',
                color: 'white',
                margin: '0 0 8px 0',
                textShadow: '0 4px 8px rgba(0,0,0,0.3)'
              }}>
                AI Flow
              </h1>
              <p style={{
                fontSize: '18px',
                color: 'rgba(255, 255, 255, 0.9)',
                margin: '0'
              }}>
                Complete AI-powered freight intelligence and automation system
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ 
          display: 'flex', 
          gap: '8px', 
          marginBottom: '32px',
          flexWrap: 'wrap'
        }}>
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'dispatch', label: 'AI Dispatch', icon: '🚛' },
            { id: 'freight', label: 'Freight AI', icon: '🤖' },
            { id: 'intelligence', label: 'Market Intel', icon: '�' },
            { id: 'optimization', label: 'Route Optimizer', icon: '🗺️' },
            { id: 'insights', label: 'Insights', icon: '💡' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id as any)}
              style={{
                padding: '12px 20px',
                borderRadius: '12px',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                border: 'none',
                cursor: 'pointer',
                background: selectedTab === tab.id 
                  ? 'rgba(255, 255, 255, 0.25)' 
                  : 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                backdropFilter: 'blur(10px)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span style={{ fontSize: '14px' }}>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {selectedTab === 'overview' && (
          <div>
            {/* Automation Controls */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
              gap: '24px',
              marginBottom: '32px'
            }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
              }}>
                <h3 style={{
                  color: 'white',
                  fontSize: '20px',
                  fontWeight: '600',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <span style={{ marginRight: '12px' }}>⚙️</span>
                  Automation Engine
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        backgroundColor: automationStatus.isRunning ? '#10b981' : '#6b7280'
                      }}></div>
                      <span style={{
                        fontWeight: '600',
                        color: 'white'
                      }}>
                        {automationStatus.isRunning ? 'Running' : 'Stopped'}
                      </span>
                    </div>
                    <button
                      onClick={toggleAutomation}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '8px',
                        fontWeight: '600',
                        transition: 'all 0.3s ease',
                        border: 'none',
                        cursor: 'pointer',
                        backgroundColor: automationStatus.isRunning ? '#dc2626' : '#10b981',
                        color: 'white'
                      }}
                    >
                      {automationStatus.isRunning ? 'Stop' : 'Start'}
                    </button>
                  </div>

                  {automationStatus.lastUpdate && (
                    <div style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.7)'
                    }}>
                      Last update: {new Date(automationStatus.lastUpdate).toLocaleString()}
                    </div>
                  )}

                  {automationStatus.tasksRunning.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <h4 style={{
                        fontWeight: '600',
                        color: 'white'
                      }}>Active Tasks:</h4>
                      {automationStatus.tasksRunning.map((task, index) => (
                        <div key={index} style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          fontSize: '14px',
                          color: 'rgba(255, 255, 255, 0.8)'
                        }}>
                          <div style={{
                            width: '8px',
                            height: '8px',
                            backgroundColor: '#3b82f6',
                            borderRadius: '50%',
                            animation: 'pulse 2s infinite'
                          }}></div>
                          <span>{task}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
              }}>
                <h3 style={{
                  color: 'white',
                  fontSize: '20px',
                  fontWeight: '600',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <span style={{ marginRight: '8px' }}>⚡</span>
                  Quick Actions
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

                  {/* EDI Integration Status */}
                  <div 
                    style={{
                      background: 'rgba(34, 197, 94, 0.15)',
                      border: '1px solid rgba(34, 197, 94, 0.3)',
                      borderRadius: '12px',
                      padding: '16px',
                      marginBottom: '16px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                      <span style={{ fontSize: '20px', marginRight: '8px' }}>📡</span>
                      <h4 style={{ color: 'white', margin: 0, fontSize: '14px', fontWeight: '600' }}>
                        EDI Integration Status
                      </h4>
                    </div>
                    <div style={{ fontSize: '12px', color: '#d1d5db', lineHeight: '1.4' }}>
                      <div style={{ marginBottom: '8px' }}>
                        <span style={{ color: '#22c55e' }}>✅ Service Layer Complete</span> - EDI 214, 204, 210, 997, 990, 820
                      </div>
                      <div style={{ marginBottom: '8px' }}>
                        <span style={{ color: '#22c55e' }}>✅ Workflow Integration</span> - Auto-triggered EDI messages
                      </div>
                      <div style={{ marginBottom: '8px' }}>
                        <span style={{ color: '#3b82f6' }}>📊 Monitor Below</span> - Full EDI status in main dashboard
                      </div>
                      <div style={{ fontSize: '11px', color: '#9ca3af' }}>
                        See EDI Status Monitor in Overview tab for real-time updates
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => loadAIInsights()}
                    disabled={loading}
                    style={{
                      width: '100%',
                      padding: '16px',
                      background: 'rgba(59, 130, 246, 0.2)',
                      color: 'white',
                      borderRadius: '12px',
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      fontWeight: '600',
                      opacity: loading ? 0.5 : 1
                    }}
                  >
                    <span>🔄</span>
                    <span>{loading ? 'Refreshing...' : 'Refresh Insights'}</span>
                  </button>
                  
                  <button 
                    onClick={testAIDispatch}
                    disabled={testingDispatch}
                    style={{
                      width: '100%',
                      padding: '16px',
                      background: 'rgba(16, 185, 129, 0.2)',
                      color: 'white',
                      borderRadius: '12px',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      cursor: testingDispatch ? 'not-allowed' : 'pointer',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      fontWeight: '600',
                      opacity: testingDispatch ? 0.5 : 1
                    }}
                  >
                    <span>🚛</span>
                    <span>{testingDispatch ? 'Testing...' : 'Test AI Dispatch'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Documentation & Guides */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}>
              <h3 style={{
                color: 'white',
                fontSize: '20px',
                fontWeight: '600',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center'
              }}>
                <span style={{ marginRight: '8px' }}>📚</span>
                Documentation & Guides
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
                <button 
                  onClick={() => setShowSetupGuide(true)}
                  style={{
                    width: '100%',
                    padding: '16px',
                    background: 'rgba(139, 69, 19, 0.2)',
                    color: 'white',
                    borderRadius: '12px',
                    border: '1px solid rgba(139, 69, 19, 0.3)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    gap: '12px',
                    fontWeight: '600',
                    textAlign: 'left'
                  }}
                >
                  <span>🤖</span>
                  <div>
                    <div>AI System Setup Guide</div>
                    <div style={{ fontSize: '12px', fontWeight: '400', opacity: 0.8 }}>
                      Complete guide to AI features and configuration
                    </div>
                  </div>
                </button>
                
                <button 
                  onClick={() => window.open('/docs/edi-integration', '_blank')}
                  style={{
                    width: '100%',
                    padding: '16px',
                    background: 'rgba(34, 197, 94, 0.2)',
                    color: 'white',
                    borderRadius: '12px',
                    border: '1px solid rgba(34, 197, 94, 0.3)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    gap: '12px',
                    fontWeight: '600',
                    textAlign: 'left'
                  }}
                >
                  <span>📡</span>
                  <div>
                    <div>EDI Integration Guide</div>
                    <div style={{ fontSize: '12px', fontWeight: '400', opacity: 0.8 }}>
                      Electronic Data Interchange setup and configuration
                    </div>
                  </div>
                </button>
                
                <button 
                  onClick={() => window.open('/docs/user-guide', '_blank')}
                  style={{
                    width: '100%',
                    padding: '16px',
                    background: 'rgba(59, 130, 246, 0.2)',
                    color: 'white',
                    borderRadius: '12px',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    gap: '12px',
                    fontWeight: '600',
                    textAlign: 'left'
                  }}
                >
                  <span>📖</span>
                  <div>
                    <div>User Guide</div>
                    <div style={{ fontSize: '12px', fontWeight: '400', opacity: 0.8 }}>
                      Complete FleetFlow system user documentation
                    </div>
                  </div>
                </button>
                
                <button 
                  onClick={() => window.open('/docs/quick-start', '_blank')}
                  style={{
                    width: '100%',
                    padding: '16px',
                    background: 'rgba(168, 85, 247, 0.2)',
                    color: 'white',
                    borderRadius: '12px',
                    border: '1px solid rgba(168, 85, 247, 0.3)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    gap: '12px',
                    fontWeight: '600',
                    textAlign: 'left'
                  }}
                >
                  <span>⚡</span>
                  <div>
                    <div>Quick Start Guide</div>
                    <div style={{ fontSize: '12px', fontWeight: '400', opacity: 0.8 }}>
                      Get started with FleetFlow in minutes
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'dispatch' && (
          <div className="space-y-6">
            {/* AI Dispatch Test Results */}
            {dispatchRecommendation && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="mr-2">🚛</span>
                  AI Dispatch Recommendation
                </h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                      <h4 className="font-semibold text-green-900 mb-2">Primary Recommendation</h4>
                      <p className="text-green-800">Carrier: {dispatchRecommendation.primaryRecommendation?.carrierId}</p>
                      <p className="text-green-700">Match Score: {dispatchRecommendation.primaryRecommendation?.matchScore}%</p>
                      <p className="text-sm text-green-600 mt-2">{dispatchRecommendation.primaryRecommendation?.reasoning}</p>
                    </div>
                    
                    {dispatchRecommendation.rateRecommendation && (
                      <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                        <h4 className="font-semibold text-blue-900 mb-2">Rate Recommendation</h4>
                        <p className="text-blue-800">Suggested Rate: ${dispatchRecommendation.rateRecommendation.suggestedRate.toLocaleString()}</p>
                        <p className="text-blue-700">Competitiveness: {dispatchRecommendation.rateRecommendation.competitivenessScore}%</p>
                        <p className="text-sm text-blue-600 mt-2">{dispatchRecommendation.rateRecommendation.rateJustification}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    {dispatchRecommendation.expectedOutcome && (
                      <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                        <h4 className="font-semibold text-purple-900 mb-2">Expected Outcome</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-purple-700">On-Time Delivery:</span>
                            <span className="text-purple-800 font-medium">{dispatchRecommendation.expectedOutcome.onTimeDeliveryProbability}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-purple-700">Cost Efficiency:</span>
                            <span className="text-purple-800 font-medium">{dispatchRecommendation.expectedOutcome.costEfficiency}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-purple-700">Customer Satisfaction:</span>
                            <span className="text-purple-800 font-medium">{dispatchRecommendation.expectedOutcome.customerSatisfactionPrediction}/5.0</span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {dispatchRecommendation.riskFactors && dispatchRecommendation.riskFactors.length > 0 && (
                      <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                        <h4 className="font-semibold text-yellow-900 mb-2">Risk Factors</h4>
                        <ul className="space-y-1">
                          {dispatchRecommendation.riskFactors.map((risk: string, index: number) => (
                            <li key={index} className="text-sm text-yellow-700 flex items-start">
                              <span className="mr-2">⚠️</span>
                              <span>{risk}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    <strong>Confidence Score:</strong> {dispatchRecommendation.confidenceScore}% 
                    {dispatchRecommendation.warning && (
                      <span className="ml-4 text-orange-600">⚠️ {dispatchRecommendation.warning}</span>
                    )}
                  </p>
                </div>
              </div>
            )}
            
            {/* Dispatch Analytics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 text-center">
                <div className="text-3xl mb-3">🎯</div>
                <h4 className="font-semibold text-gray-900 mb-2">Match Accuracy</h4>
                <p className="text-2xl font-bold text-blue-600">94.2%</p>
                <p className="text-sm text-gray-600">AI recommendation accuracy</p>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 text-center">
                <div className="text-3xl mb-3">💰</div>
                <h4 className="font-semibold text-gray-900 mb-2">Cost Savings</h4>
                <p className="text-2xl font-bold text-green-600">$18,420</p>
                <p className="text-sm text-gray-600">This month</p>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 text-center">
                <div className="text-3xl mb-3">⚡</div>
                <h4 className="font-semibold text-gray-900 mb-2">Response Time</h4>
                <p className="text-2xl font-bold text-purple-600">1.2s</p>
                <p className="text-sm text-gray-600">Average AI decision time</p>
              </div>
            </div>

            {/* EDI Integration Status Monitor */}
            <div className="mt-8">
              <EDIStatusMonitor className="bg-white/80 backdrop-blur-sm border-gray-200/50" />
            </div>
          </div>
        )}

        {/* AI Insights */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          marginTop: '32px'
        }}>
          <h3 style={{
            color: 'white',
            fontSize: '20px',
            fontWeight: '600',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center'
          }}>
            <span style={{ marginRight: '8px' }}>💡</span>
            Recent AI Insights
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {loading && (
              <div style={{
                textAlign: 'center',
                padding: '32px',
                color: 'rgba(255, 255, 255, 0.7)'
              }}>
                Loading AI insights...
              </div>
            )}
            {!loading && insights.length === 0 && (
              <div style={{
                textAlign: 'center',
                padding: '32px',
                color: 'rgba(255, 255, 255, 0.7)'
              }}>
                No AI insights available. Generating insights...
              </div>
            )}
            {insights.map((insight, index) => (
              <div key={index} style={{
                padding: '20px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                transition: 'all 0.3s ease'
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', gap: '16px', flex: 1 }}>
                    <div style={{ fontSize: '24px' }}>{getInsightIcon(insight.type)}</div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{
                        fontWeight: '600',
                        color: 'white',
                        marginBottom: '8px',
                        fontSize: '16px'
                      }}>{insight.title}</h4>
                      <p style={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        marginBottom: '12px',
                        lineHeight: '1.5'
                      }}>{insight.description}</p>
                      <div style={{
                        fontSize: '14px',
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontWeight: '500'
                      }}>
                        {new Date(insight.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <span 
                    style={{
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      border: '1px solid',
                      ...getPriorityColor(insight.priority)
                    }}
                  >
                    {insight.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {selectedTab === 'dispatch' && (
          <div style={{ marginTop: '32px' }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              textAlign: 'center'
            }}>
              <h3 style={{
                color: 'white',
                fontSize: '20px',
                fontWeight: '600',
                marginBottom: '16px'
              }}>
                AI Dispatch Features Coming Soon
              </h3>
              <p style={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '16px'
              }}>
                Advanced dispatch functionality will be available in the next update.
              </p>
            </div>
          </div>
        )}
      </div> {/* End Main Container */}

      {/* AI System Setup Guide Modal */}
      {showSetupGuide && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold flex items-center">
                  <span className="mr-3 text-3xl">🤖</span>
                  Freight AI System Setup Guide
                </h2>
                <button 
                  onClick={() => setShowSetupGuide(false)}
                  className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
                >
                  <span className="text-2xl">×</span>
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[75vh]">
              <div className="space-y-8">
                {/* System Overview */}
                <section>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="mr-2">🌟</span>
                    AI System Overview
                  </h3>
                  <div className="bg-blue-50 rounded-xl p-4 mb-4">
                    <p className="text-gray-800 leading-relaxed">
                      FleetFlow's AI system integrates multiple services to provide intelligent freight management, 
                      automated dispatch optimization, and real-time insights. Your system is already configured 
                      with FMCSA and Google Maps APIs for comprehensive functionality.
                    </p>
                  </div>
                </section>

                {/* API Integration Status */}
                <section>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="mr-2">🔗</span>
                    API Integration Status
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                      <div className="flex items-center mb-2">
                        <span className="text-2xl mr-2">✅</span>
                        <h4 className="font-semibold text-green-800">FMCSA API</h4>
                      </div>
                      <p className="text-green-700 text-sm">
                        Carrier verification and safety ratings - Fully operational
                      </p>
                    </div>
                    
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                      <div className="flex items-center mb-2">
                        <span className="text-2xl mr-2">✅</span>
                        <h4 className="font-semibold text-green-800">Google Maps API</h4>
                      </div>
                      <p className="text-green-700 text-sm">
                        Route optimization and real-time tracking - Fully operational
                      </p>
                    </div>
                  </div>
                </section>

                {/* AI Features */}
                <section>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="mr-2">🚀</span>
                    AI-Powered Features
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white border border-gray-200 rounded-xl p-4">
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                        <span className="mr-2">🚛</span>
                        Smart Dispatch
                      </h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• AI-powered load-carrier matching</li>
                        <li>• 95% accuracy in recommendations</li>
                        <li>• Real-time optimization</li>
                        <li>• Cost and efficiency analysis</li>
                      </ul>
                    </div>
                    
                    <div className="bg-white border border-gray-200 rounded-xl p-4">
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                        <span className="mr-2">🗺️</span>
                        Route Intelligence
                      </h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Dynamic route optimization</li>
                        <li>• Traffic and weather integration</li>
                        <li>• Fuel efficiency calculations</li>
                        <li>• ETA predictions</li>
                      </ul>
                    </div>
                    
                    <div className="bg-white border border-gray-200 rounded-xl p-4">
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                        <span className="mr-2">📊</span>
                        Predictive Analytics
                      </h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Market rate predictions</li>
                        <li>• Demand forecasting</li>
                        <li>• Carrier performance analysis</li>
                        <li>• Risk assessment</li>
                      </ul>
                    </div>
                    
                    <div className="bg-white border border-gray-200 rounded-xl p-4">
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                        <span className="mr-2">🔧</span>
                        Automation
                      </h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Automated load posting</li>
                        <li>• Smart carrier selection</li>
                        <li>• Real-time monitoring</li>
                        <li>• Alert systems</li>
                      </ul>
                    </div>
                  </div>
                </section>

                {/* Quick Start Guide */}
                <section>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="mr-2">⚡</span>
                    Quick Start Guide
                  </h3>
                  <div className="space-y-4">
                    <div className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded-r-xl">
                      <h4 className="font-semibold text-blue-900 mb-2">Step 1: Dashboard Overview</h4>
                      <p className="text-blue-800 text-sm">
                        Familiarize yourself with the AI Flow dashboard. Monitor automation status, 
                        view real-time insights, and access quick actions.
                      </p>
                    </div>
                    
                    <div className="border-l-4 border-green-500 bg-green-50 p-4 rounded-r-xl">
                      <h4 className="font-semibold text-green-900 mb-2">Step 2: Enable Automation</h4>
                      <p className="text-green-800 text-sm">
                        Toggle the automation switch to start AI-powered dispatch and optimization. 
                        Monitor active tasks in real-time.
                      </p>
                    </div>
                    
                    <div className="border-l-4 border-purple-500 bg-purple-50 p-4 rounded-r-xl">
                      <h4 className="font-semibold text-purple-900 mb-2">Step 3: Test AI Dispatch</h4>
                      <p className="text-purple-800 text-sm">
                        Use the "Test AI Dispatch" quick action to see AI recommendations 
                        for load-carrier matching with confidence scores.
                      </p>
                    </div>
                    
                    <div className="border-l-4 border-orange-500 bg-orange-50 p-4 rounded-r-xl">
                      <h4 className="font-semibold text-orange-900 mb-2">Step 4: Monitor Insights</h4>
                      <p className="text-orange-800 text-sm">
                        Review AI-generated insights for optimization opportunities, 
                        carrier performance alerts, and predictive maintenance recommendations.
                      </p>
                    </div>
                  </div>
                </section>

                {/* System Requirements */}
                <section>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="mr-2">⚙️</span>
                    System Requirements & Configuration
                  </h3>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Required APIs (Active)</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>✅ FMCSA API - Carrier verification</li>
                          <li>✅ Google Maps API - Route optimization</li>
                          <li>🔄 Weather API - Traffic conditions</li>
                          <li>🔄 Market Data API - Rate optimization</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">System Features</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>✅ Real-time data processing</li>
                          <li>✅ Machine learning models</li>
                          <li>✅ Automated workflows</li>
                          <li>✅ Performance monitoring</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Best Practices */}
                <section>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="mr-2">💡</span>
                    Best Practices
                  </h3>
                  <div className="space-y-3">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                      <h4 className="font-semibold text-yellow-800 mb-2">Data Quality</h4>
                      <p className="text-yellow-700 text-sm">
                        Ensure accurate load and carrier data entry for optimal AI recommendations. 
                        The system learns from historical data patterns.
                      </p>
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <h4 className="font-semibold text-blue-800 mb-2">Regular Monitoring</h4>
                      <p className="text-blue-700 text-sm">
                        Check the automation status daily and review AI insights for actionable 
                        recommendations and system performance.
                      </p>
                    </div>
                    
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                      <h4 className="font-semibold text-green-800 mb-2">Continuous Learning</h4>
                      <p className="text-green-700 text-sm">
                        The AI system improves over time. Provide feedback on recommendations 
                        and monitor performance metrics for optimal results.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Support & Resources */}
                <section>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="mr-2">🔧</span>
                    Support & Resources
                  </h3>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-gray-700 mb-3">
                      Need help with AI system configuration or experiencing issues?
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                        📚 Documentation
                      </button>
                      <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
                        💬 Support Chat
                      </button>
                      <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm">
                        📧 Contact Support
                      </button>
                    </div>
                  </div>
                </section>
              </div>
            </div>
            
            <div className="bg-gray-50 px-6 py-4 flex justify-end">
              <button 
                onClick={() => setShowSetupGuide(false)}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
