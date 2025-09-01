'use client';

import React, { useState, useEffect } from 'react';
import { rfxResponseService } from '../services/RFxResponseService';

interface MarketConditions {
  lane: string;
  currentRate: number;
  marketAverage: number;
  demandLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  capacityTightness: number;
  trendDirection: 'INCREASING' | 'DECREASING' | 'STABLE';
  equipmentType: string;
  lastUpdated: Date;
}

interface HotLane {
  lane: string;
  demandScore: number;
  rateIncrease: number;
  capacityTightness: number;
  equipmentType: string;
  seasonalFactor: number;
}

const LiveMarketIntelligence: React.FC = () => {
  const [marketConditions, setMarketConditions] = useState<MarketConditions[]>([]);
  const [hotLanes, setHotLanes] = useState<HotLane[]>([]);
  const [selectedLane, setSelectedLane] = useState<string>('');
  const [equipmentFilter, setEquipmentFilter] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadMarketData();
    // Set up real-time updates every 5 minutes
    const interval = setInterval(loadMarketData, 300000);
    return () => clearInterval(interval);
  }, [equipmentFilter]);

  const loadMarketData = async () => {
    setLoading(true);
    try {
      // Load market conditions and hot lanes
      await Promise.all([
        loadMarketConditions(),
        loadHotLanes(),
      ]);
    } catch (error) {
      console.error('Error loading market data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMarketConditions = async () => {
    // Mock data - in real implementation, this would call the market intelligence API
    const mockConditions: MarketConditions[] = [
      {
        lane: 'Dallas, TX → Atlanta, GA',
        currentRate: 2.45,
        marketAverage: 2.38,
        demandLevel: 'HIGH',
        capacityTightness: 85,
        trendDirection: 'INCREASING',
        equipmentType: 'Dry Van',
        lastUpdated: new Date(),
      },
      {
        lane: 'Los Angeles, CA → Chicago, IL',
        currentRate: 2.78,
        marketAverage: 2.65,
        demandLevel: 'CRITICAL',
        capacityTightness: 92,
        trendDirection: 'INCREASING',
        equipmentType: 'Refrigerated',
        lastUpdated: new Date(),
      },
      {
        lane: 'Houston, TX → Denver, CO',
        currentRate: 2.15,
        marketAverage: 2.25,
        demandLevel: 'MEDIUM',
        capacityTightness: 65,
        trendDirection: 'DECREASING',
        equipmentType: 'Flatbed',
        lastUpdated: new Date(),
      },
      {
        lane: 'Seattle, WA → Phoenix, AZ',
        currentRate: 2.62,
        marketAverage: 2.48,
        demandLevel: 'HIGH',
        capacityTightness: 78,
        trendDirection: 'STABLE',
        equipmentType: 'Dry Van',
        lastUpdated: new Date(),
      },
      {
        lane: 'Miami, FL → New York, NY',
        currentRate: 2.89,
        marketAverage: 2.75,
        demandLevel: 'HIGH',
        capacityTightness: 88,
        trendDirection: 'INCREASING',
        equipmentType: 'Refrigerated',
        lastUpdated: new Date(),
      },
    ];

    setMarketConditions(
      equipmentFilter 
        ? mockConditions.filter(c => c.equipmentType === equipmentFilter)
        : mockConditions
    );
  };

  const loadHotLanes = async () => {
    // Mock data for hot lanes
    const mockHotLanes: HotLane[] = [
      {
        lane: 'Los Angeles, CA → Chicago, IL',
        demandScore: 94,
        rateIncrease: 18.5,
        capacityTightness: 92,
        equipmentType: 'Refrigerated',
        seasonalFactor: 1.25,
      },
      {
        lane: 'Dallas, TX → Atlanta, GA',
        demandScore: 88,
        rateIncrease: 12.3,
        capacityTightness: 85,
        equipmentType: 'Dry Van',
        seasonalFactor: 1.15,
      },
      {
        lane: 'Miami, FL → Boston, MA',
        demandScore: 91,
        rateIncrease: 22.1,
        capacityTightness: 89,
        equipmentType: 'Refrigerated',
        seasonalFactor: 1.35,
      },
      {
        lane: 'Chicago, IL → Phoenix, AZ',
        demandScore: 82,
        rateIncrease: 8.7,
        capacityTightness: 74,
        equipmentType: 'Flatbed',
        seasonalFactor: 1.08,
      },
    ];

    setHotLanes(
      equipmentFilter 
        ? mockHotLanes.filter(l => l.equipmentType === equipmentFilter)
        : mockHotLanes
    );
  };

  const getDemandColor = (level: string) => {
    const colors = {
      LOW: 'text-green-600 bg-green-50 border-green-200',
      MEDIUM: 'text-yellow-600 bg-yellow-50 border-yellow-200',
      HIGH: 'text-orange-600 bg-orange-50 border-orange-200',
      CRITICAL: 'text-red-600 bg-red-50 border-red-200',
    };
    return colors[level as keyof typeof colors] || 'text-gray-600 bg-gray-50 border-gray-200';
  };

  const getTrendIcon = (direction: string) => {
    const icons = {
      INCREASING: '📈',
      DECREASING: '📉',
      STABLE: '➡️',
    };
    return icons[direction as keyof typeof icons] || '➡️';
  };

  const getTrendColor = (direction: string) => {
    const colors = {
      INCREASING: 'text-green-600',
      DECREASING: 'text-red-600',
      STABLE: 'text-blue-600',
    };
    return colors[direction as keyof typeof colors] || 'text-gray-600';
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  return (
    <div className="space-y-6"">
      {/* Header */}
      <div className="flex justify-between items-center"">
        <div>
          <h2 className="text-2xl font-bold text-gray-900"">🔥 Live Market Intelligence</h2>
          <p className="text-gray-600"">Real-time freight market conditions and opportunities</p>
        </div>
        <div className="flex items-center space-x-4"">
          <select
            value={equipmentFilter}
            onChange={(e) => setEquipmentFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent""
          >
            <option value=">All Equipment</option>
            <option value="Dry Van"">Dry Van</option>
            <option value="Refrigerated"">Refrigerated</option>
            <option value="Flatbed"">Flatbed</option>
            <option value="Step Deck"">Step Deck</option>
          </select>
          <button
            onClick={loadMarketData}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50""
          >
            {loading ? '⟳' : '🔄'} Refresh
          </button>
        </div>
      </div>

      {/* Market Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6"">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"">
          <div className="flex items-center justify-between"">
            <div>
              <p className="text-sm text-gray-600"">Average Rate</p>
              <p className="text-2xl font-bold text-gray-900"">$2.52/mi</p>
            </div>
            <div className="text-3xl"">💰</div>
          </div>
          <p className="text-sm text-green-600 mt-2"">↗️ +5.2% vs last week</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"">
          <div className="flex items-center justify-between"">
            <div>
              <p className="text-sm text-gray-600"">Capacity Tightness</p>
              <p className="text-2xl font-bold text-orange-600"">82%</p>
            </div>
            <div className="text-3xl"">🚛</div>
          </div>
          <p className="text-sm text-orange-600 mt-2"">🔥 High demand market</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"">
          <div className="flex items-center justify-between"">
            <div>
              <p className="text-sm text-gray-600"">Hot Lanes</p>
              <p className="text-2xl font-bold text-red-600"">{hotLanes.length}</p>
            </div>
            <div className="text-3xl"">🔥</div>
          </div>
          <p className="text-sm text-red-600 mt-2"">🎯 Bid opportunities</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"">
          <div className="flex items-center justify-between"">
            <div>
              <p className="text-sm text-gray-600"">Win Rate Potential</p>
              <p className="text-2xl font-bold text-green-600"">78%</p>
            </div>
            <div className="text-3xl"">🏆</div>
          </div>
          <p className="text-sm text-green-600 mt-2"">📈 Above market avg</p>
        </div>
      </div>

      {/* Hot Lanes Section */}
      <div className="bg-white rounded-xl shadow-sm"">
        <div className="p-6 border-b border-gray-100"">
          <h3 className="text-lg font-semibold text-gray-900"">🔥 Hot Lanes - High Opportunity</h3>
          <p className="text-gray-600"">Lanes with highest demand and rate increases</p>
        </div>
        <div className="overflow-x-auto"">
          <table className="w-full"">
            <thead className="bg-gray-50"">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"">Lane</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"">Equipment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"">Demand Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"">Rate Increase</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"">Capacity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"">Season Factor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200"">
              {hotLanes.map((lane, index) => (
                <tr key={index} className="hover:bg-gray-50"">
                  <td className="px-6 py-4 whitespace-nowrap"">
                    <div className="text-sm font-medium text-gray-900"">{lane.lane}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap"">
                    <div className="text-sm text-gray-600"">{lane.equipmentType}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap"">
                    <div className="flex items-center"">
                      <div className="text-sm font-medium text-gray-900"">{lane.demandScore}/100</div>
                      <div className="ml-2 w-16 bg-gray-200 rounded-full h-2"">
                        <div 
                          className="bg-red-500 h-2 rounded-full""
                          style={{ width: `${lane.demandScore}%` }}
                         />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap"">
                    <span className="text-sm font-medium text-green-600"">
                      +{formatPercentage(lane.rateIncrease)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap"">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      lane.capacityTightness > 85 ? 'bg-red-100 text-red-800' :
                      lane.capacityTightness > 70 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {formatPercentage(lane.capacityTightness)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap"">
                    <span className="text-sm text-gray-900"">{lane.seasonalFactor}x</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap"">
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium"">
                      Get Quote →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Market Conditions Table */}
      <div className="bg-white rounded-xl shadow-sm"">
        <div className="p-6 border-b border-gray-100"">
          <h3 className="text-lg font-semibold text-gray-900"">📊 Current Market Conditions</h3>
          <p className="text-gray-600"">Real-time rates and demand levels by lane</p>
        </div>
        <div className="overflow-x-auto"">
          <table className="w-full"">
            <thead className="bg-gray-50"">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"">Lane</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"">Equipment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"">Current Rate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"">Market Avg</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"">Demand</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"">Capacity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"">Trend</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"">Updated</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200"">
              {marketConditions.map((condition, index) => (
                <tr key={index} className="hover:bg-gray-50"">
                  <td className="px-6 py-4 whitespace-nowrap"">
                    <div className="text-sm font-medium text-gray-900"">{condition.lane}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap"">
                    <div className="text-sm text-gray-600"">{condition.equipmentType}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap"">
                    <div className="text-sm font-medium text-gray-900"">{formatCurrency(condition.currentRate)}/mi</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap"">
                    <div className="text-sm text-gray-600"">{formatCurrency(condition.marketAverage)}/mi</div>
                    <div className={`text-xs ${
                      condition.currentRate > condition.marketAverage ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {condition.currentRate > condition.marketAverage ? '+' : ''}
                      {formatCurrency(condition.currentRate - condition.marketAverage)} vs avg
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap"">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getDemandColor(condition.demandLevel)}`}>
                      {condition.demandLevel}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap"">
                    <div className="flex items-center"">
                      <div className="text-sm text-gray-900"">{formatPercentage(condition.capacityTightness)}</div>
                      <div className="ml-2 w-12 bg-gray-200 rounded-full h-2"">
                        <div 
                          className={`h-2 rounded-full ${
                            condition.capacityTightness > 85 ? 'bg-red-500' :
                            condition.capacityTightness > 70 ? 'bg-yellow-500' :
                            'bg-green-500'
                          }`}
                          style={{ width: `${condition.capacityTightness}%` }}
                         />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap"">
                    <div className={`flex items-center space-x-1 ${getTrendColor(condition.trendDirection)}`}>
                      <span>{getTrendIcon(condition.trendDirection)}</span>
                      <span className="text-sm font-medium"">{condition.trendDirection}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap"">
                    <div className="text-xs text-gray-500"">
                      {condition.lastUpdated.toLocaleTimeString()}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Market Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6"">
        <div className="bg-white rounded-xl shadow-sm p-6"">
          <h3 className="text-lg font-semibold text-gray-900 mb-4"">💡 Market Insights</h3>
          <div className="space-y-4"">
            <div className="flex items-start space-x-3"">
              <span className="text-yellow-500 text-xl"">⚠️</span>
              <div>
                <p className="text-sm font-medium text-gray-900"">Capacity Shortage Alert</p>
                <p className="text-xs text-gray-600"">Refrigerated equipment showing 90%+ tightness in key lanes</p>
              </div>
            </div>
            <div className="flex items-start space-x-3"">
              <span className="text-green-500 text-xl"">📈</span>
              <div>
                <p className="text-sm font-medium text-gray-900"">Rate Opportunity</p>
                <p className="text-xs text-gray-600"">West Coast to Midwest rates up 15% this week</p>
              </div>
            </div>
            <div className="flex items-start space-x-3"">
              <span className="text-blue-500 text-xl"">🎯</span>
              <div>
                <p className="text-sm font-medium text-gray-900"">Seasonal Peak</p>
                <p className="text-xs text-gray-600"">Q4 retail freight driving increased demand</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6"">
          <h3 className="text-lg font-semibold text-gray-900 mb-4"">🎯 Bidding Recommendations</h3>
          <div className="space-y-4"">
            <div className="bg-green-50 rounded-lg p-4"">
              <p className="text-sm font-medium text-green-800"">Aggressive Bidding</p>
              <p className="text-xs text-green-600"">Target 5-10% above market on hot lanes</p>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4"">
              <p className="text-sm font-medium text-yellow-800"">Competitive Positioning</p>
              <p className="text-xs text-yellow-600"">Match market rates on balanced lanes</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4"">
              <p className="text-sm font-medium text-blue-800"">Value Proposition</p>
              <p className="text-xs text-blue-600"">Emphasize reliability and service quality</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveMarketIntelligence;
