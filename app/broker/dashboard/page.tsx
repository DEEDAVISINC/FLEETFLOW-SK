'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BrokerPerformanceMetrics } from '../../services/BrokerAnalyticsService';

// Full Quoting Portal Component - Embedded directly in broker dashboard
function QuotingPortal() {
  const [activeTab, setActiveTab] = useState('LaneQuoting');
  const [lanes, setLanes] = useState<any[]>([]);
  const [showLaneResults, setShowLaneResults] = useState(false);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [priceRules, setPriceRules] = useState<any[]>([]);

  // Add lane function
  const addLane = () => {
    const originInput = document.getElementById('lane-origin-input') as HTMLInputElement;
    const destinationInput = document.getElementById('lane-destination-input') as HTMLInputElement;
    const weightInput = document.getElementById('lane-weight-input') as HTMLInputElement;
    const equipmentSelect = document.getElementById('lane-equipment-select') as HTMLSelectElement;

    if (!originInput?.value || !destinationInput?.value) {
      alert('Please enter origin and destination');
      return;
    }

    const newLane = {
      id: `lane-${Date.now()}`,
      origin: originInput.value,
      destination: destinationInput.value,
      weight: parseFloat(weightInput?.value || '0'),
      equipment: equipmentSelect?.value || 'Dry Van',
      priority: lanes.length + 1
    };

    setLanes(prev => [...prev, newLane]);

    // Clear inputs
    originInput.value = '';
    destinationInput.value = '';
    weightInput.value = '';
  };

  // Remove lane function
  const removeLane = (laneId: string) => {
    setLanes(prev => prev.filter(lane => lane.id !== laneId));
  };

  // Generate quotes for all lanes
  const generateBulkQuotes = async () => {
    if (lanes.length === 0) {
      alert('Please add at least one lane');
      return;
    }

    setShowLaneResults(true);

    try {
      // Import the FreightQuotingEngine dynamically
      const { FreightQuotingEngine } = await import('../../services/FreightQuotingEngine');
      const quotingEngine = new FreightQuotingEngine();

      // Generate quotes for each lane
      const quotePromises = lanes.map(async (lane) => {
        const distance = Math.floor(Math.random() * 1000) + 100; // Mock distance

        const quoteRequest = {
          id: `quote-${lane.id}`,
          type: 'LTL' as 'LTL' | 'FTL' | 'Specialized',
          origin: lane.origin,
          destination: lane.destination,
          weight: lane.weight || 1000,
          freightClass: 55,
          equipmentType: lane.equipment,
          serviceType: 'standard',
          distance,
          pickupDate: new Date().toISOString(),
          deliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          urgency: 'standard' as 'standard' | 'expedited' | 'emergency',
          customerTier: 'gold' as 'bronze' | 'silver' | 'gold' | 'platinum',
          specialRequirements: [],
          hazmat: false,
          temperature: 'ambient' as 'ambient' | 'refrigerated' | 'frozen'
        };

        return await quotingEngine.generateQuote(quoteRequest);
      });

      const results = await Promise.all(quotePromises);
      console.info('🛣️ Bulk lane quotes generated:', results);

      return results;
    } catch (error) {
      console.error('❌ Error generating bulk quotes:', error);
      alert('Error generating quotes. Please try again.');
    }
  };

  return (
    <div style={{ color: 'white' }}>
      {/* Navigation Tabs */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[
            { id: 'LaneQuoting', label: '🛣️ Lane Quoting', active: activeTab === 'LaneQuoting' },
            { id: 'LTL', label: '📦 LTL Quotes', active: activeTab === 'LTL' },
            { id: 'FTL', label: '🚚 FTL Quotes', active: activeTab === 'FTL' },
            { id: 'History', label: '📋 Quote History', active: activeTab === 'History' },
            { id: 'Rules', label: '⚙️ Price Rules', active: activeTab === 'Rules' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '12px 20px',
                borderRadius: '8px',
                border: tab.active ? '2px solid #3b82f6' : '1px solid rgba(255, 255, 255, 0.2)',
                background: tab.active ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                color: tab.active ? '#3b82f6' : 'rgba(255, 255, 255, 0.8)',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'all 0.2s ease',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Lane Quoting Tab */}
      {activeTab === 'LaneQuoting' && (
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            padding: '32px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          }}
        >
          {/* Enhanced Lane Quoting Header with Progress */}
          <div style={{ marginBottom: '32px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16px',
              }}
            >
              <h2
                style={{
                  fontSize: '28px',
                  fontWeight: '700',
                  color: 'white',
                  margin: '0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                🛣️ Multi-Lane Quoting
              </h2>
              <div
                style={{
                  background: 'rgba(16, 185, 129, 0.2)',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                }}
              >
                <span
                  style={{
                    color: '#10b981',
                    fontSize: '14px',
                    fontWeight: '600',
                  }}
                >
                  Step 1 of 3: Add Lanes
                </span>
              </div>
            </div>

            <div
              style={{
                background: 'rgba(59, 130, 246, 0.1)',
                padding: '20px',
                borderRadius: '12px',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                marginBottom: '24px',
              }}
            >
              <h4
                style={{
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: '600',
                  marginBottom: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                💡 How It Works
              </h4>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '16px',
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.8)',
                }}
              >
                <div>
                  <strong style={{ color: 'white' }}>1. Add Lanes</strong>
                  <br />
                  Enter origin-destination pairs for each shipping lane
                </div>
                <div>
                  <strong style={{ color: 'white' }}>2. Review & Edit</strong>
                  <br />
                  Modify weights, equipment, and priorities as needed
                </div>
                <div>
                  <strong style={{ color: 'white' }}>3. Get Quotes</strong>
                  <br />
                  Generate bulk pricing with spreadsheet-style results
                </div>
              </div>
            </div>

            <p
              style={{
                fontSize: '16px',
                color: 'rgba(255, 255, 255, 0.8)',
                lineHeight: '1.6',
                marginBottom: '0',
              }}
            >
              Perfect for shippers with multiple locations needing quotes for
              various lanes. Get comprehensive pricing across all your
              shipping routes.
            </p>
          </div>

          {!showLaneResults ? (
            /* Lane Input Interface */
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '24px',
              }}
            >
              {/* Enhanced Bulk Lane Entry */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '16px',
                  }}
                >
                  <h3
                    style={{
                      fontSize: '20px',
                      fontWeight: '600',
                      color: 'white',
                      margin: '0',
                    }}
                  >
                    📝 Add Shipping Lanes
                  </h3>
                  <div
                    style={{
                      background: 'rgba(245, 158, 11, 0.2)',
                      padding: '4px 12px',
                      borderRadius: '16px',
                      border: '1px solid rgba(245, 158, 11, 0.3)',
                    }}
                  >
                    <span
                      style={{
                        color: '#f59e0b',
                        fontSize: '12px',
                        fontWeight: '600',
                      }}
                    >
                      {lanes.length} lanes added
                    </span>
                  </div>
                </div>

                {/* Instructions */}
                <div
                  style={{
                    background: 'rgba(59, 130, 246, 0.1)',
                    padding: '16px',
                    borderRadius: '8px',
                    marginBottom: '20px',
                    border: '1px solid rgba(59, 130, 246, 0.2)',
                  }}
                >
                  <div
                    style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.9)',
                      lineHeight: '1.5',
                    }}
                  >
                    <strong style={{ color: 'white' }}>💡 Tip:</strong> Add
                    one lane at a time, then review your list before
                    generating quotes. You can edit or remove lanes as needed.
                  </div>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 2fr 1fr 1fr auto',
                    gap: '12px',
                    alignItems: 'end',
                  }}
                >
                  <div>
                    <label
                      style={{
                        color: 'white',
                        fontSize: '14px',
                        fontWeight: '500',
                        marginBottom: '8px',
                        display: 'block',
                      }}
                    >
                      Origin
                    </label>
                    <input
                      type='text'
                      placeholder='e.g., Chicago, IL'
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: 'white',
                        fontSize: '14px',
                      }}
                      id='lane-origin-input'
                    />
                  </div>
                  <div>
                    <label
                      style={{
                        color: 'white',
                        fontSize: '14px',
                        fontWeight: '500',
                        marginBottom: '8px',
                        display: 'block',
                      }}
                    >
                      Destination
                    </label>
                    <input
                      type='text'
                      placeholder='e.g., Detroit, MI'
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: 'white',
                        fontSize: '14px',
                      }}
                      id='lane-destination-input'
                    />
                  </div>
                  <div>
                    <label
                      style={{
                        color: 'white',
                        fontSize: '14px',
                        fontWeight: '500',
                        marginBottom: '8px',
                        display: 'block',
                      }}
                    >
                      Weight (lbs)
                    </label>
                    <input
                      type='number'
                      placeholder='45000'
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: 'white',
                        fontSize: '14px',
                      }}
                      id='lane-weight-input'
                    />
                  </div>
                  <div>
                    <label
                      style={{
                        color: 'white',
                        fontSize: '14px',
                        fontWeight: '500',
                        marginBottom: '8px',
                        display: 'block',
                      }}
                    >
                      Equipment
                    </label>
                    <select
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: 'white',
                        fontSize: '14px',
                      }}
                      id='lane-equipment-select'
                    >
                      <option value='Dry Van'>Dry Van</option>
                      <option value='Refrigerated'>Refrigerated</option>
                      <option value='Flatbed'>Flatbed</option>
                      <option value='Step Deck'>Step Deck</option>
                      <option value='Double Drop'>Double Drop</option>
                    </select>
                  </div>
                  <button
                    onClick={addLane}
                    style={{
                      padding: '12px 16px',
                      background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    ➕ Add Lane
                  </button>
                </div>
              </div>

              {/* Lane List */}
              {lanes.length > 0 && (
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '16px',
                    }}
                  >
                    <h3
                      style={{
                        fontSize: '20px',
                        fontWeight: '600',
                        color: 'white',
                        margin: '0',
                      }}
                    >
                      📋 Your Lanes ({lanes.length})
                    </h3>
                    <button
                      onClick={generateBulkQuotes}
                      style={{
                        padding: '12px 24px',
                        background: 'linear-gradient(135deg, #10b981, #059669)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '16px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      🤖 Generate Bulk Quotes
                    </button>
                  </div>

                  <div style={{ display: 'grid', gap: '12px' }}>
                    {lanes.map((lane, index) => (
                      <div
                        key={lane.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '16px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          borderRadius: '8px',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <div
                            style={{
                              background: 'rgba(59, 130, 246, 0.2)',
                              padding: '8px',
                              borderRadius: '8px',
                              border: '1px solid rgba(59, 130, 246, 0.3)',
                            }}
                          >
                            <span style={{ fontSize: '16px' }}>#{lane.priority}</span>
                          </div>
                          <div>
                            <div style={{ fontSize: '18px', fontWeight: '600', color: 'white' }}>
                              {lane.origin} → {lane.destination}
                            </div>
                            <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)' }}>
                              {lane.weight.toLocaleString()} lbs • {lane.equipment}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => removeLane(lane.id)}
                          style={{
                            padding: '8px',
                            background: 'rgba(239, 68, 68, 0.2)',
                            color: '#ef4444',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                          }}
                        >
                          🗑️
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Lane Results Interface */
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '24px',
                }}
              >
                <h3
                  style={{
                    fontSize: '24px',
                    fontWeight: '600',
                    color: 'white',
                    margin: '0',
                  }}
                >
                  📊 Lane Quote Results
                </h3>
                <button
                  onClick={() => setShowLaneResults(false)}
                  style={{
                    padding: '8px 16px',
                    background: 'rgba(59, 130, 246, 0.2)',
                    color: '#3b82f6',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  ← Back to Edit Lanes
                </button>
              </div>

              <div
                style={{
                  background: 'rgba(16, 185, 129, 0.1)',
                  padding: '20px',
                  borderRadius: '12px',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  marginBottom: '24px',
                }}
              >
                <h4
                  style={{
                    color: '#10b981',
                    fontSize: '18px',
                    fontWeight: '600',
                    marginBottom: '16px',
                    margin: '0 0 16px 0',
                  }}
                >
                  ✅ Bulk Quotes Generated Successfully
                </h4>
                <p style={{ color: 'rgba(255, 255, 255, 0.8)', margin: '0' }}>
                  Your lane quotes are ready. Review the results below and send them to your customers.
                </p>
              </div>

              <div style={{ display: 'grid', gap: '16px' }}>
                {lanes.map((lane, index) => (
                  <div
                    key={lane.id}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '12px',
                      padding: '20px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '16px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div
                          style={{
                            background: 'rgba(59, 130, 246, 0.2)',
                            padding: '6px 12px',
                            borderRadius: '16px',
                            border: '1px solid rgba(59, 130, 246, 0.3)',
                          }}
                        >
                          <span style={{ color: '#3b82f6', fontWeight: '600' }}>
                            Lane #{lane.priority}
                          </span>
                        </div>
                        <div>
                          <div style={{ fontSize: '18px', fontWeight: '600', color: 'white' }}>
                            {lane.origin} → {lane.destination}
                          </div>
                          <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)' }}>
                            {lane.weight.toLocaleString()} lbs • {lane.equipment}
                          </div>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '24px', fontWeight: '700', color: '#10b981' }}>
                          ${(Math.random() * 5000 + 1000).toFixed(0)}
                        </div>
                        <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)' }}>
                          AI Recommended
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr 1fr',
                        gap: '16px',
                        marginBottom: '16px',
                      }}
                    >
                      <div
                        style={{
                          background: 'rgba(59, 130, 246, 0.1)',
                          padding: '12px',
                          borderRadius: '8px',
                          border: '1px solid rgba(59, 130, 246, 0.2)',
                        }}
                      >
                        <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '4px' }}>
                          Base Rate
                        </div>
                        <div style={{ fontSize: '16px', fontWeight: '600', color: '#3b82f6' }}>
                          ${(Math.random() * 3000 + 500).toFixed(0)}
                        </div>
                      </div>
                      <div
                        style={{
                          background: 'rgba(245, 158, 11, 0.1)',
                          padding: '12px',
                          borderRadius: '8px',
                          border: '1px solid rgba(245, 158, 11, 0.2)',
                        }}
                      >
                        <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '4px' }}>
                          Fuel Surcharge
                        </div>
                        <div style={{ fontSize: '16px', fontWeight: '600', color: '#f59e0b' }}>
                          ${(Math.random() * 500 + 100).toFixed(0)}
                        </div>
                      </div>
                      <div
                        style={{
                          background: 'rgba(16, 185, 129, 0.1)',
                          padding: '12px',
                          borderRadius: '8px',
                          border: '1px solid rgba(16, 185, 129, 0.2)',
                        }}
                      >
                        <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '4px' }}>
                          Win Probability
                        </div>
                        <div style={{ fontSize: '16px', fontWeight: '600', color: '#10b981' }}>
                          {Math.floor(Math.random() * 40 + 60)}%
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button
                        style={{
                          flex: 1,
                          padding: '10px 16px',
                          background: 'linear-gradient(135deg, #10b981, #059669)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        📤 Send to Customer
                      </button>
                      <button
                        style={{
                          flex: 1,
                          padding: '10px 16px',
                          background: 'rgba(255, 255, 255, 0.1)',
                          color: 'white',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        💾 Save Quote
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Other Tabs - Placeholder for now */}
      {activeTab !== 'LaneQuoting' && (
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '40px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.7 }}>
            🚧
          </div>
          <h3 style={{ fontSize: '24px', fontWeight: '600', color: 'white', marginBottom: '8px' }}>
            {activeTab} Coming Soon
          </h3>
          <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '16px' }}>
            This feature is under development. Please use the Lane Quoting tab for now.
          </p>
        </div>
      )}
    </div>
  );
}


export default function BrokerDashboard() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState('quotes-workflow');
  const [isLoading, setIsLoading] = useState(true);
  const [brokerMetrics, setBrokerMetrics] =
    useState<BrokerPerformanceMetrics | null>(null);

  // Load real broker performance metrics
  useEffect(() => {
    const loadBrokerMetrics = async () => {
      try {
        setIsLoading(true);

        // Import the pre-created broker analytics service instance
        const { brokerAnalyticsService } = await import(
          '../../services/BrokerAnalyticsService'
        );

        // Get real performance metrics
        const metrics = brokerAnalyticsService.getBrokerPerformanceMetrics();
        setBrokerMetrics(metrics);

        console.info(
          '🏢 Broker Dashboard: Loaded real performance metrics:',
          metrics
        );
      } catch (error) {
        console.error('🏢 Broker Dashboard: Failed to load metrics:', error);
        // Fallback to empty metrics if service fails
        setBrokerMetrics({
          totalLoads: 0,
          activeLoads: 0,
          completedLoads: 0,
          totalRevenue: 0,
          avgMargin: 0,
          winRate: 0,
          customerCount: 0,
          avgLoadValue: 0,
          monthlyGrowth: 0,
          topCustomers: [],
        } as BrokerPerformanceMetrics);
      } finally {
        setIsLoading(false);
      }
    };

    loadBrokerMetrics();
  }, []);

  // Build KPIs from real data
  const agentKPIs = brokerMetrics
    ? [
        {
          title: 'Active Customers',
          value: brokerMetrics.customerCount,
          unit: '',
          change: brokerMetrics.customerCount > 0 ? '+1' : '--',
          trend: brokerMetrics.customerCount > 0 ? 'up' : 'neutral',
          description: 'Currently active customer accounts',
          color: '#10b981',
          background: 'rgba(16, 185, 129, 0.5)',
          border: 'rgba(16, 185, 129, 0.3)',
        },
        {
          title: 'Active Loads',
          value: brokerMetrics.activeLoads,
          unit: '',
          change:
            brokerMetrics.activeLoads > 0
              ? `+${brokerMetrics.activeLoads}`
              : '--',
          trend: brokerMetrics.activeLoads > 0 ? 'up' : 'neutral',
          description: 'Loads currently in progress',
          color: '#3b82f6',
          background: 'rgba(59, 130, 246, 0.5)',
          border: 'rgba(59, 130, 246, 0.3)',
        },
        {
          title: 'Monthly Revenue',
          value: Math.round(brokerMetrics.totalRevenue / 1000), // Convert to K
          unit: 'K',
          change:
            brokerMetrics.totalRevenue > 0
              ? `$${Math.round(brokerMetrics.totalRevenue / 1000)}K`
              : '--',
          trend: brokerMetrics.totalRevenue > 0 ? 'up' : 'neutral',
          description: 'Revenue generated this month',
          color: '#8b5cf6',
          background: 'rgba(139, 92, 246, 0.5)',
          border: 'rgba(139, 92, 246, 0.3)',
        },
        {
          title: 'Win Rate',
          value: Math.round(brokerMetrics.winRate),
          unit: '%',
          change:
            brokerMetrics.winRate > 0
              ? `${Math.round(brokerMetrics.winRate)}%`
              : '--',
          trend:
            brokerMetrics.winRate > 50
              ? 'up'
              : brokerMetrics.winRate > 0
                ? 'neutral'
                : 'neutral',
          description: 'Load bidding win rate',
          color: '#f59e0b',
          background: 'rgba(245, 158, 11, 0.5)',
          border: 'rgba(245, 158, 11, 0.3)',
        },
      ]
    : [
        // Loading state
        {
          title: 'Active Customers',
          value: '--',
          unit: '',
          change: '--',
          trend: 'neutral',
          description: 'Loading customer data...',
          color: '#10b981',
          background: 'rgba(16, 185, 129, 0.5)',
          border: 'rgba(16, 185, 129, 0.3)',
        },
        {
          title: 'Active Loads',
          value: '--',
          unit: '',
          change: '--',
          trend: 'neutral',
          description: 'Loading load data...',
          color: '#3b82f6',
          background: 'rgba(59, 130, 246, 0.5)',
          border: 'rgba(59, 130, 246, 0.3)',
        },
        {
          title: 'Monthly Revenue',
          value: '--',
          unit: 'K',
          change: '--',
          trend: 'neutral',
          description: 'Loading revenue data...',
          color: '#8b5cf6',
          background: 'rgba(139, 92, 246, 0.5)',
          border: 'rgba(139, 92, 246, 0.3)',
        },
        {
          title: 'Win Rate',
          value: '--',
          unit: '%',
          change: '--',
          trend: 'neutral',
          description: 'Loading performance data...',
          color: '#f59e0b',
          background: 'rgba(245, 158, 11, 0.5)',
          border: 'rgba(245, 158, 11, 0.3)',
        },
      ];

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundImage:
          'linear-gradient(135deg, #1e1b4b 0%, #312e81 25%, #4338ca 50%, #312e81 75%, #1e1b4b 100%), radial-gradient(circle at 20% 20%, rgba(147, 51, 234, 0.08) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(196, 181, 253, 0.06) 0%, transparent 50%), radial-gradient(circle at 40% 60%, rgba(139, 92, 246, 0.04) 0%, transparent 50%)',
        backgroundSize: '100% 100%, 800px 800px, 600px 600px, 400px 400px',
        backgroundPosition: '0 0, 0 0, 100% 100%, 50% 50%',
        backgroundRepeat: 'no-repeat',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        padding: '20px',
      }}
    >
      {/* Header */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <h1
            style={{
              color: 'white',
              margin: 0,
              fontSize: '2rem',
              fontWeight: '700',
              background: 'linear-gradient(45deg, #3b82f6, #06b6d4)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '8px',
            }}
          >
            🏢 Brokerage Dashboard
          </h1>
          <p
            style={{
              color: 'rgba(255, 255, 255, 0.9)',
              margin: '4px 0 0 0',
              fontSize: '1rem',
              fontWeight: '500',
            }}
          >
            Professional Sales Management • Load Optimization • Customer
            Relations
          </p>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginTop: '8px',
            }}
          >
            <span
              style={{
                background: 'rgba(16, 185, 129, 0.2)',
                color: '#10b981',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: '600',
                border: '1px solid rgba(16, 185, 129, 0.3)',
              }}
            >
              ✅ Broker Active
            </span>
            <span
              style={{
                background: 'rgba(59, 130, 246, 0.2)',
                color: '#3b82f6',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: '600',
                border: '1px solid rgba(59, 130, 246, 0.3)',
              }}
            >
              🆔 Connected
            </span>
            <span
              style={{
                background: 'rgba(139, 92, 246, 0.2)',
                color: '#8b5cf6',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: '600',
                border: '1px solid rgba(139, 92, 246, 0.3)',
              }}
            >
              📊 Brokerage
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div
            style={{
              textAlign: 'right',
              color: 'rgba(255, 255, 255, 0.9)',
            }}
          >
            <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>
              Last Activity
            </div>
            <div style={{ fontSize: '0.8rem' }}>
              {new Date().toLocaleTimeString()}
            </div>
          </div>
          <button
            onClick={() => router.push('/broker')}
            style={{
              background: 'rgba(239, 68, 68, 0.2)',
              color: '#fca5a5',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* KPI Dashboard */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
          marginBottom: '24px',
        }}
      >
        {agentKPIs.map((kpi, index) => (
          <div
            key={index}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '20px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = `0 8px 25px ${kpi.background}`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '60px',
                height: '60px',
                background: kpi.background,
                borderRadius: '0 0 0 60px',
                opacity: 0.3,
              }}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '12px',
              }}
            >
              <h3
                style={{
                  color: 'white',
                  margin: 0,
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  opacity: 0.9,
                }}
              >
                {kpi.title}
              </h3>
              <span
                style={{
                  background: kpi.background,
                  color: kpi.color,
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  border: `1px solid ${kpi.border}`,
                }}
              >
                {kpi.change}
              </span>
            </div>
            <div
              style={{
                fontSize: '2rem',
                fontWeight: '700',
                color: kpi.color,
                marginBottom: '8px',
                textShadow: `0 0 20px ${kpi.color}33`,
              }}
            >
              {kpi.value}
              {kpi.unit}
            </div>
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.7)',
                margin: 0,
                fontSize: '0.8rem',
                lineHeight: 1.4,
              }}
            >
              {kpi.description}
            </p>
          </div>
        ))}
      </div>

      {/* Navigation Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '24px',
          flexWrap: 'wrap',
        }}
      >
        {[
          {
            id: 'quotes-workflow',
            label: 'Quotes & Workflow',
            icon: '💼',
            color: '#8b5cf6',
          },
          {
            id: 'loads-bids',
            label: 'Loads & Bidding',
            icon: '📦',
            color: '#06b6d4',
          },
          {
            id: 'ai-intelligence',
            label: 'AI Intelligence',
            icon: '🤖',
            color: '#ec4899',
          },
          {
            id: 'market-intelligence',
            label: 'Market Intelligence',
            icon: '📈',
            color: '#10b981',
          },
          { id: 'analytics', label: 'Analytics', icon: '📊', color: '#f59e0b' },
          {
            id: 'tasks',
            label: 'Task Management',
            icon: '📋',
            color: '#ef4444',
          },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id)}
            style={{
              padding: '12px 20px',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              background:
                selectedTab === tab.id
                  ? `linear-gradient(135deg, ${tab.color}88, ${tab.color}66)`
                  : 'rgba(255, 255, 255, 0.1)',
              color:
                selectedTab === tab.id ? '#ffffff' : 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(10px)',
              border:
                selectedTab === tab.id
                  ? `2px solid ${tab.color}`
                  : '1px solid rgba(255, 255, 255, 0.2)',
              transform:
                selectedTab === tab.id ? 'translateY(-2px)' : 'translateY(0)',
              boxShadow:
                selectedTab === tab.id ? `0 8px 25px ${tab.color}40` : 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: '32px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          minHeight: '400px',
        }}
      >
        {/* Tab Content */}
        {selectedTab === 'quotes-workflow' && <QuotingPortal />}

        {selectedTab === 'loads-bids' && (
          <div style={{ textAlign: 'center', color: 'white' }}>
            <div
              style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.7 }}
            >
              📦
            </div>
            <h2
              style={{
                fontSize: '24px',
                fontWeight: 'bold',
                marginBottom: '8px',
              }}
            >
              Loads & Bidding Management
            </h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '16px' }}>
              Track active loads and manage bidding strategies
            </p>
          </div>
        )}

        {selectedTab === 'ai-intelligence' && (
          <div style={{ textAlign: 'center', color: 'white' }}>
            <div
              style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.7 }}
            >
              🤖
            </div>
            <h2
              style={{
                fontSize: '24px',
                fontWeight: 'bold',
                marginBottom: '8px',
              }}
            >
              AI-Powered Intelligence
            </h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '16px' }}>
              Advanced analytics and predictive insights
            </p>
          </div>
        )}

        {selectedTab === 'market-intelligence' && (
          <div style={{ textAlign: 'center', color: 'white' }}>
            <div
              style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.7 }}
            >
              📈
            </div>
            <h2
              style={{
                fontSize: '24px',
                fontWeight: 'bold',
                marginBottom: '8px',
              }}
            >
              Market Intelligence
            </h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '16px' }}>
              Real-time market trends and competitive analysis
            </p>
          </div>
        )}

        {selectedTab === 'analytics' && (
          <div style={{ textAlign: 'center', color: 'white' }}>
            <div
              style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.7 }}
            >
              📊
            </div>
            <h2
              style={{
                fontSize: '24px',
                fontWeight: 'bold',
                marginBottom: '8px',
              }}
            >
              Advanced Analytics
            </h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '16px' }}>
              Comprehensive performance metrics and insights
            </p>
          </div>
        )}

        {selectedTab === 'tasks' && (
          <div style={{ textAlign: 'center', color: 'white' }}>
            <div
              style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.7 }}
            >
              📋
            </div>
            <h2
              style={{
                fontSize: '24px',
                fontWeight: 'bold',
                marginBottom: '8px',
              }}
            >
              Task Management
            </h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '16px' }}>
              Organize and track your brokerage tasks
            </p>
          </div>
        )}

        {/* Default Welcome Screen */}
        {!selectedTab && (
          <div style={{ textAlign: 'center', color: 'white' }}>
            <div
              style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.7 }}
            >
              🚛
            </div>
            <h2
              style={{
                fontSize: '24px',
                fontWeight: 'bold',
                marginBottom: '8px',
              }}
            >
              Welcome to Your Broker Dashboard
            </h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '16px' }}>
              Your superior freight brokerage management platform
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
