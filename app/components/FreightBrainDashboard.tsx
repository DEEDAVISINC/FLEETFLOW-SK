/**
 * Freight Brain AI Dashboard
 * Centralized knowledge system inspired by Sintra.ai's Brain AI Profile
 * Specialized for freight brokerage intelligence
 */

'use client';

import {
  AlertTriangle,
  BarChart3,
  CheckCircle,
  Database,
  DollarSign,
  Lightbulb,
  MapPin,
  Search,
  Shield,
  Star,
  TrendingUp,
  Truck,
  Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { FreightKnowledge, freightBrainAI } from '../services/FreightBrainAI';

interface FreightBrainDashboardProps {
  selectedStaff?: string;
}

export default function FreightBrainDashboard({
  selectedStaff,
}: FreightBrainDashboardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [knowledgeResults, setKnowledgeResults] = useState<FreightKnowledge[]>(
    []
  );
  const [recommendations, setRecommendations] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [marketIntel, setMarketIntel] = useState<any>(null);
  const [selectedKnowledge, setSelectedKnowledge] =
    useState<FreightKnowledge | null>(null);

  useEffect(() => {
    loadInitialData();
    if (selectedStaff) {
      loadRecommendations();
    }
  }, [selectedStaff]);

  useEffect(() => {
    if (searchQuery) {
      searchKnowledge();
    } else {
      loadKnowledgeByCategory();
    }
  }, [searchQuery, selectedCategory, selectedStaff]);

  const loadInitialData = () => {
    const brainStats = freightBrainAI.getBrainStats();
    setStats(brainStats);

    // Load sample market intelligence
    const chiAtlIntel = freightBrainAI.getMarketIntelligence('CHI-ATL');
    const laxDalIntel = freightBrainAI.getMarketIntelligence('LAX-DAL');
    setMarketIntel({ 'CHI-ATL': chiAtlIntel, 'LAX-DAL': laxDalIntel });
  };

  const loadRecommendations = () => {
    if (selectedStaff) {
      const recs = freightBrainAI.getRecommendationsForStaff(selectedStaff);
      setRecommendations(recs);
    }
  };

  const searchKnowledge = () => {
    const results = freightBrainAI.searchKnowledge(searchQuery, selectedStaff);
    setKnowledgeResults(results);
  };

  const loadKnowledgeByCategory = () => {
    if (selectedCategory === 'all') {
      const allKnowledge = [
        ...freightBrainAI.getKnowledgeByCategory('market_data'),
        ...freightBrainAI.getKnowledgeByCategory('carrier_intel'),
        ...freightBrainAI.getKnowledgeByCategory('customer_profiles'),
        ...freightBrainAI.getKnowledgeByCategory('lane_analytics'),
        ...freightBrainAI.getKnowledgeByCategory('compliance_rules'),
        ...freightBrainAI.getKnowledgeByCategory('pricing_strategies'),
      ];
      setKnowledgeResults(allKnowledge);
    } else {
      const results = freightBrainAI.getKnowledgeByCategory(
        selectedCategory as any
      );
      setKnowledgeResults(results);
    }
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      market_data: TrendingUp,
      carrier_intel: Truck,
      customer_profiles: Users,
      lane_analytics: MapPin,
      compliance_rules: Shield,
      pricing_strategies: DollarSign,
    };
    return icons[category as keyof typeof icons] || Brain;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      market_data: 'bg-green-500',
      carrier_intel: 'bg-blue-500',
      customer_profiles: 'bg-purple-500',
      lane_analytics: 'bg-orange-500',
      compliance_rules: 'bg-red-500',
      pricing_strategies: 'bg-yellow-500',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-500';
  };

  const categories = [
    { key: 'all', label: 'All Knowledge', icon: Database },
    { key: 'market_data', label: 'Market Data', icon: TrendingUp },
    { key: 'carrier_intel', label: 'Carrier Intel', icon: Truck },
    { key: 'customer_profiles', label: 'Customer Profiles', icon: Users },
    { key: 'lane_analytics', label: 'Lane Analytics', icon: MapPin },
    { key: 'compliance_rules', label: 'Compliance Rules', icon: Shield },
    {
      key: 'pricing_strategies',
      label: 'Pricing Strategies',
      icon: DollarSign,
    },
  ];

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'rgba(15, 23, 42, 0.8)',
        padding: '20px',
        borderRadius: '12px',
        border: '1px solid rgba(148, 163, 184, 0.2)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        margin: '20px',
        color: 'white',
      }}
    >
      {/* Header */}
      <div
        style={{
          marginBottom: '30px',
        }}
      >
        <div
          style={{
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
          }}
        >
          <div
            style={{
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
              padding: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
            }}
          >
            🧠
          </div>
          <div>
            <h1
              style={{
                background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontSize: '28px',
                fontWeight: 'bold',
                margin: '0 0 8px 0',
              }}
            >
              Freight Brain AI
            </h1>
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.7)',
                margin: 0,
                fontSize: '16px',
              }}
            >
              {selectedStaff
                ? `Personalized insights for ${selectedStaff}`
                : 'Centralized Freight Intelligence System'}
            </p>
          </div>
        </div>

        {/* Stats Overview */}
        {stats && (
          <div
            style={{
              marginBottom: '24px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '16px',
            }}
          >
            <div
              style={{
                background: 'rgba(30, 41, 59, 0.5)',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                borderRadius: '12px',
                padding: '16px',
              }}
            >
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
              >
                <div
                  style={{
                    borderRadius: '8px',
                    background: 'rgba(59, 130, 246, 0.2)',
                    padding: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                  }}
                >
                  🧠
                </div>
                <div>
                  <p
                    style={{
                      fontSize: '24px',
                      fontWeight: 'bold',
                      color: '#3b82f6',
                      margin: '0 0 4px 0',
                    }}
                  >
                    {stats.totalKnowledge}
                  </p>
                  <p
                    style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.6)',
                      margin: 0,
                    }}
                  >
                    Knowledge Items
                  </p>
                </div>
              </div>
            </div>

            <div
              style={{
                background: 'rgba(30, 41, 59, 0.5)',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                borderRadius: '12px',
                padding: '16px',
              }}
            >
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
              >
                <div
                  style={{
                    borderRadius: '8px',
                    background: 'rgba(34, 197, 94, 0.2)',
                    padding: '8px',
                  }}
                >
                  <BarChart3
                    style={{ height: '20px', width: '20px', color: '#22c55e' }}
                  />
                </div>
                <div>
                  <p
                    style={{
                      fontSize: '24px',
                      fontWeight: 'bold',
                      color: '#22c55e',
                      margin: '0 0 4px 0',
                    }}
                  >
                    {stats.averageConfidence}%
                  </p>
                  <p
                    style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.6)',
                      margin: 0,
                    }}
                  >
                    Avg Confidence
                  </p>
                </div>
              </div>
            </div>

            <div
              style={{
                background: 'rgba(30, 41, 59, 0.5)',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                borderRadius: '12px',
                padding: '16px',
              }}
            >
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
              >
                <div
                  style={{
                    borderRadius: '8px',
                    background: 'rgba(139, 92, 246, 0.2)',
                    padding: '8px',
                  }}
                >
                  <MapPin
                    style={{ height: '20px', width: '20px', color: '#8b5cf6' }}
                  />
                </div>
                <div>
                  <p
                    style={{
                      fontSize: '24px',
                      fontWeight: 'bold',
                      color: '#8b5cf6',
                      margin: '0 0 4px 0',
                    }}
                  >
                    {stats.marketLanes}
                  </p>
                  <p
                    style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.6)',
                      margin: 0,
                    }}
                  >
                    Market Lanes
                  </p>
                </div>
              </div>
            </div>

            <div
              style={{
                background: 'rgba(30, 41, 59, 0.5)',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                borderRadius: '12px',
                padding: '16px',
              }}
            >
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
              >
                <div
                  style={{
                    borderRadius: '8px',
                    background: 'rgba(245, 158, 11, 0.2)',
                    padding: '8px',
                  }}
                >
                  <Truck
                    style={{ height: '20px', width: '20px', color: '#f59e0b' }}
                  />
                </div>
                <div>
                  <p
                    style={{
                      fontSize: '24px',
                      fontWeight: 'bold',
                      color: '#f59e0b',
                      margin: '0 0 4px 0',
                    }}
                  >
                    {stats.carrierProfiles}
                  </p>
                  <p
                    style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.6)',
                      margin: 0,
                    }}
                  >
                    Carrier Profiles
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '24px',
        }}
      >
        {/* Left Column - Search & Knowledge */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
          }}
        >
          {/* Search */}
          <div
            style={{
              background: 'rgba(30, 41, 59, 0.5)',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              borderRadius: '12px',
              padding: '24px',
            }}
          >
            <div
              style={{
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <Search
                style={{
                  height: '20px',
                  width: '20px',
                  color: 'rgba(255, 255, 255, 0.6)',
                }}
              />
              <input
                type='text'
                placeholder='Search freight knowledge...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  flex: 1,
                  borderRadius: '8px',
                  border: '1px solid rgba(148, 163, 184, 0.3)',
                  background: 'rgba(30, 41, 59, 0.3)',
                  padding: '8px 16px',
                  color: 'white',
                  fontSize: '14px',
                  outline: 'none',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#3b82f6')}
                onBlur={(e) =>
                  (e.target.style.borderColor = 'rgba(148, 163, 184, 0.3)')
                }
              />
            </div>

            {/* Category Filter */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
              }}
            >
              {categories.map((category) => {
                const Icon = category.icon;
                const isSelected = selectedCategory === category.key;

                return (
                  <button
                    key={category.key}
                    onClick={() => setSelectedCategory(category.key)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      borderRadius: '8px',
                      padding: '6px 12px',
                      fontSize: '14px',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      background: isSelected
                        ? 'linear-gradient(135deg, #3b82f6, #2563eb)'
                        : 'rgba(30, 41, 59, 0.5)',
                      color: isSelected ? 'white' : 'rgba(255, 255, 255, 0.7)',
                      border: isSelected
                        ? 'none'
                        : '1px solid rgba(148, 163, 184, 0.2)',
                    }}
                  >
                    <Icon style={{ height: '16px', width: '16px' }} />
                    {category.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Knowledge Results */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            {knowledgeResults.map((knowledge) => {
              const CategoryIcon = getCategoryIcon(knowledge.category);

              return (
                <div
                  key={knowledge.id}
                  onClick={() => setSelectedKnowledge(knowledge)}
                  style={{
                    cursor: 'pointer',
                    borderRadius: '12px',
                    border: '1px solid rgba(148, 163, 184, 0.2)',
                    background: 'rgba(30, 41, 59, 0.5)',
                    padding: '16px',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.borderColor = 'rgba(59, 130, 246, 0.5)')
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.borderColor = 'rgba(148, 163, 184, 0.2)')
                  }
                >
                  <div
                    style={{
                      marginBottom: '12px',
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                      }}
                    >
                      <div
                        style={{
                          borderRadius: '8px',
                          padding: '8px',
                          background:
                            knowledge.category === 'market_data'
                              ? 'rgba(34, 197, 94, 0.2)'
                              : knowledge.category === 'carrier_intel'
                                ? 'rgba(59, 130, 246, 0.2)'
                                : knowledge.category === 'customer_profiles'
                                  ? 'rgba(139, 92, 246, 0.2)'
                                  : knowledge.category === 'lane_analytics'
                                    ? 'rgba(245, 158, 11, 0.2)'
                                    : knowledge.category === 'compliance_rules'
                                      ? 'rgba(239, 68, 68, 0.2)'
                                      : 'rgba(107, 114, 128, 0.2)',
                        }}
                      >
                        <CategoryIcon
                          style={{
                            height: '16px',
                            width: '16px',
                            color:
                              knowledge.category === 'market_data'
                                ? '#22c55e'
                                : knowledge.category === 'carrier_intel'
                                  ? '#3b82f6'
                                  : knowledge.category === 'customer_profiles'
                                    ? '#8b5cf6'
                                    : knowledge.category === 'lane_analytics'
                                      ? '#f59e0b'
                                      : knowledge.category ===
                                          'compliance_rules'
                                        ? '#ef4444'
                                        : '#6b7280',
                          }}
                        />
                      </div>
                      <div>
                        <h3
                          style={{
                            fontWeight: '600',
                            color: 'white',
                            margin: '0 0 4px 0',
                            fontSize: '16px',
                          }}
                        >
                          {knowledge.title}
                        </h3>
                        <p
                          style={{
                            fontSize: '14px',
                            color: 'rgba(255, 255, 255, 0.6)',
                            margin: 0,
                            textTransform: 'capitalize',
                          }}
                        >
                          {knowledge.category.replace('_', ' ')}
                        </p>
                      </div>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <Star
                          style={{
                            height: '16px',
                            width: '16px',
                            color: '#fbbf24',
                          }}
                        />
                        <span
                          style={{
                            fontSize: '14px',
                            color: '#fbbf24',
                          }}
                        >
                          {knowledge.confidence}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.6)',
                      marginBottom: '8px',
                    }}
                  >
                    <span>Source: {knowledge.source}</span>
                    <span>•</span>
                    <span>
                      Updated: {knowledge.lastUpdated.toLocaleDateString()}
                    </span>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '4px',
                    }}
                  >
                    {knowledge.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        style={{
                          borderRadius: '4px',
                          background: 'rgba(30, 41, 59, 0.5)',
                          padding: '4px 8px',
                          fontSize: '12px',
                          color: 'rgba(255, 255, 255, 0.7)',
                        }}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column - Recommendations & Market Intel */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
          }}
        >
          {/* AI Recommendations */}
          {recommendations && (
            <div
              style={{
                background: 'rgba(30, 41, 59, 0.5)',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                borderRadius: '12px',
                padding: '24px',
              }}
            >
              <div
                style={{
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <div
                  style={{
                    borderRadius: '8px',
                    background: 'rgba(139, 92, 246, 0.2)',
                    padding: '8px',
                  }}
                >
                  <Lightbulb
                    style={{ height: '20px', width: '20px', color: '#8b5cf6' }}
                  />
                </div>
                <h3
                  style={{
                    fontWeight: '600',
                    color: 'white',
                    fontSize: '18px',
                    margin: 0,
                  }}
                >
                  AI Recommendations
                </h3>
              </div>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                {recommendations.recommendations.map(
                  (rec: any, index: number) => (
                    <div
                      key={index}
                      style={{
                        borderRadius: '8px',
                        padding: '12px',
                        border:
                          rec.priority === 'high'
                            ? '1px solid rgba(239, 68, 68, 0.3)'
                            : '1px solid rgba(59, 130, 246, 0.3)',
                        background:
                          rec.priority === 'high'
                            ? 'rgba(239, 68, 68, 0.1)'
                            : 'rgba(59, 130, 246, 0.1)',
                      }}
                    >
                      <div
                        style={{
                          marginBottom: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        {rec.priority === 'high' ? (
                          <AlertTriangle
                            style={{
                              height: '16px',
                              width: '16px',
                              color: '#ef4444',
                            }}
                          />
                        ) : (
                          <CheckCircle
                            style={{
                              height: '16px',
                              width: '16px',
                              color: '#3b82f6',
                            }}
                          />
                        )}
                        <h4
                          style={{
                            fontSize: '14px',
                            fontWeight: '600',
                            color: 'white',
                            margin: 0,
                          }}
                        >
                          {rec.title}
                        </h4>
                      </div>
                      <p
                        style={{
                          marginBottom: '8px',
                          fontSize: '14px',
                          color: 'rgba(255, 255, 255, 0.8)',
                          margin: '0 0 8px 0',
                        }}
                      >
                        {rec.content}
                      </p>
                      <p
                        style={{
                          fontSize: '12px',
                          color: 'rgba(255, 255, 255, 0.6)',
                          margin: 0,
                        }}
                      >
                        {rec.action}
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {/* Market Intelligence */}
          {marketIntel && (
            <div
              style={{
                background: 'rgba(30, 41, 59, 0.5)',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                borderRadius: '12px',
                padding: '24px',
              }}
            >
              <div
                style={{
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <div
                  style={{
                    borderRadius: '8px',
                    background: 'rgba(34, 197, 94, 0.2)',
                    padding: '8px',
                  }}
                >
                  <TrendingUp
                    style={{ height: '20px', width: '20px', color: '#22c55e' }}
                  />
                </div>
                <h3
                  style={{
                    fontWeight: '600',
                    color: 'white',
                    fontSize: '18px',
                    margin: 0,
                  }}
                >
                  Market Intelligence
                </h3>
              </div>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                }}
              >
                {Object.entries(marketIntel).map(
                  ([lane, intel]: [string, any]) => (
                    <div
                      key={lane}
                      style={{
                        borderRadius: '8px',
                        background: 'rgba(30, 41, 59, 0.3)',
                        padding: '12px',
                      }}
                    >
                      <div
                        style={{
                          marginBottom: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <h4
                          style={{
                            fontWeight: '600',
                            color: 'white',
                            margin: 0,
                            fontSize: '16px',
                          }}
                        >
                          {lane}
                        </h4>
                        <span
                          style={{
                            borderRadius: '4px',
                            padding: '4px 8px',
                            fontSize: '12px',
                            background:
                              intel.demandLevel === 'high'
                                ? 'rgba(239, 68, 68, 0.2)'
                                : intel.demandLevel === 'medium'
                                  ? 'rgba(245, 158, 11, 0.2)'
                                  : 'rgba(34, 197, 94, 0.2)',
                            color:
                              intel.demandLevel === 'high'
                                ? '#ef4444'
                                : intel.demandLevel === 'medium'
                                  ? '#f59e0b'
                                  : '#22c55e',
                          }}
                        >
                          {intel.demandLevel} demand
                        </span>
                      </div>

                      <div
                        style={{
                          fontSize: '14px',
                          color: 'rgba(255, 255, 255, 0.8)',
                        }}
                      >
                        <p style={{ margin: '0 0 4px 0' }}>
                          Avg Rate:{' '}
                          <span
                            style={{
                              fontWeight: '600',
                              color: '#22c55e',
                            }}
                          >
                            ${intel.averageRate}/mi
                          </span>
                        </p>
                        <p style={{ margin: 0 }}>
                          Top Competitor:{' '}
                          {intel.competitorActivity[0]?.competitor}
                        </p>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {/* Quick Stats */}
          <div
            style={{
              background: 'rgba(30, 41, 59, 0.5)',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              borderRadius: '12px',
              padding: '24px',
            }}
          >
            <div
              style={{
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <div
                style={{
                  borderRadius: '8px',
                  background: 'rgba(59, 130, 246, 0.2)',
                  padding: '8px',
                }}
              >
                <BarChart3
                  style={{ height: '20px', width: '20px', color: '#3b82f6' }}
                />
              </div>
              <h3
                style={{
                  fontWeight: '600',
                  color: 'white',
                  fontSize: '18px',
                  margin: 0,
                }}
              >
                Knowledge Stats
              </h3>
            </div>

            {stats && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                {Object.entries(stats.categoryCounts).map(
                  ([category, count]: [string, any]) => (
                    <div
                      key={category}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '14px',
                          color: 'rgba(255, 255, 255, 0.7)',
                          textTransform: 'capitalize',
                        }}
                      >
                        {category.replace('_', ' ')}
                      </span>
                      <span
                        style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          color: 'white',
                        }}
                      >
                        {count}
                      </span>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Knowledge Detail Modal */}
      {selectedKnowledge && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0, 0, 0, 0.5)',
            padding: '16px',
          }}
        >
          <div
            style={{
              maxHeight: '80vh',
              width: '100%',
              maxWidth: '512px',
              overflowY: 'auto',
              borderRadius: '12px',
              background: 'rgba(30, 41, 59, 0.95)',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              padding: '24px',
            }}
          >
            <div
              style={{
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <h2
                style={{
                  fontSize: '20px',
                  fontWeight: 'bold',
                  color: 'white',
                  margin: 0,
                }}
              >
                {selectedKnowledge.title}
              </h2>
              <button
                onClick={() => setSelectedKnowledge(null)}
                style={{
                  borderRadius: '8px',
                  padding: '8px',
                  border: 'none',
                  background: 'transparent',
                  color: 'white',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={(e) =>
                  (e.target.style.background = 'rgba(30, 41, 59, 0.5)')
                }
                onMouseLeave={(e) =>
                  (e.target.style.background = 'transparent')
                }
              >
                ✕
              </button>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.6)',
                }}
              >
                <span>
                  Category: {selectedKnowledge.category.replace('_', ' ')}
                </span>
                <span>•</span>
                <span>Confidence: {selectedKnowledge.confidence}%</span>
                <span>•</span>
                <span>Source: {selectedKnowledge.source}</span>
              </div>

              <div
                style={{
                  borderRadius: '8px',
                  background: 'rgba(30, 41, 59, 0.3)',
                  padding: '16px',
                }}
              >
                <pre
                  style={{
                    fontSize: '14px',
                    whiteSpace: 'pre-wrap',
                    color: 'rgba(255, 255, 255, 0.8)',
                    margin: 0,
                    fontFamily: 'monospace',
                  }}
                >
                  {JSON.stringify(selectedKnowledge.content, null, 2)}
                </pre>
              </div>

              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '8px',
                }}
              >
                {selectedKnowledge.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      borderRadius: '4px',
                      background: 'rgba(30, 41, 59, 0.5)',
                      padding: '4px 8px',
                      fontSize: '12px',
                      color: 'rgba(255, 255, 255, 0.7)',
                    }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
