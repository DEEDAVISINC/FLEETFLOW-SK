'use client';

import {
  BarChart3,
  Building2,
  Calendar,
  DollarSign,
  Package,
  ShoppingCart,
  Target,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';
import { useState } from 'react';

interface ProcurementForecast {
  id: string;
  category: string;
  description: string;
  currentDemand: number;
  forecastedDemand: number;
  demandChange: number;
  averageCost: number;
  estimatedSpend: number;
  suppliers: number;
  riskLevel: 'low' | 'medium' | 'high';
  confidence: number;
  timeline: string;
}

interface ProcurementMetrics {
  totalForecastedSpend: number;
  activeCampaigns: number;
  supplierReach: number;
  costSavings: number;
  demandAccuracy: number;
  leadsGenerated: number;
}

export default function ProcurementForecastCampaign() {
  const [metrics] = useState<ProcurementMetrics>({
    totalForecastedSpend: 2847000,
    activeCampaigns: 12,
    supplierReach: 847,
    costSavings: 247500,
    demandAccuracy: 94.8,
    leadsGenerated: 156,
  });

  const [selectedTimeframe, setSelectedTimeframe] = useState<
    'Q1' | 'Q2' | 'Q3' | 'Q4'
  >('Q1');

  const procurementForecasts: ProcurementForecast[] = [
    {
      id: 'transportation_services',
      category: 'Transportation Services',
      description: 'Freight and logistics services demand forecast',
      currentDemand: 1500,
      forecastedDemand: 2100,
      demandChange: 40,
      averageCost: 2850,
      estimatedSpend: 850000,
      suppliers: 247,
      riskLevel: 'medium',
      confidence: 96.2,
      timeline: '2025 Q1',
    },
    {
      id: 'fuel_procurement',
      category: 'Fuel & Energy',
      description: 'Diesel fuel and energy supply forecasting',
      currentDemand: 2200,
      forecastedDemand: 2650,
      demandChange: 20.5,
      averageCost: 1250,
      estimatedSpend: 547000,
      suppliers: 89,
      riskLevel: 'high',
      confidence: 91.8,
      timeline: '2025 Q1',
    },
    {
      id: 'equipment_maintenance',
      category: 'Equipment & Maintenance',
      description: 'Fleet maintenance and equipment procurement',
      currentDemand: 850,
      forecastedDemand: 1200,
      demandChange: 41.2,
      averageCost: 3200,
      estimatedSpend: 684000,
      suppliers: 156,
      riskLevel: 'low',
      confidence: 98.1,
      timeline: '2025 Q1',
    },
    {
      id: 'technology_services',
      category: 'Technology Services',
      description: 'Software, hardware, and IT infrastructure',
      currentDemand: 320,
      forecastedDemand: 480,
      demandChange: 50,
      averageCost: 1800,
      estimatedSpend: 264000,
      suppliers: 67,
      riskLevel: 'medium',
      confidence: 89.7,
      timeline: '2025 Q1',
    },
    {
      id: 'compliance_safety',
      category: 'Compliance & Safety',
      description: 'DOT compliance, safety equipment, training',
      currentDemand: 180,
      forecastedDemand: 240,
      demandChange: 33.3,
      averageCost: 2100,
      estimatedSpend: 156000,
      suppliers: 94,
      riskLevel: 'low',
      confidence: 94.5,
      timeline: '2025 Q1',
    },
  ];

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getChangeColor = (change: number) => {
    return change > 0 ? 'text-green-400' : 'text-red-400';
  };

  const activateSupplierOutreach = (forecastId: string) => {
    const forecast = procurementForecasts.find((f) => f.id === forecastId);
    if (forecast) {
      alert(
        `🚀 Supplier Outreach Campaign Activated!\n\n` +
          `Campaign: ${forecast.category}\n` +
          `Target Suppliers: ${forecast.suppliers}\n` +
          `Budget: $${forecast.estimatedSpend.toLocaleString()}\n\n` +
          `AI staff are now contacting suppliers for quotes and partnerships.`
      );
    }
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='flex items-center gap-3 text-3xl font-bold text-white'>
            <ShoppingCart className='h-8 w-8 text-blue-400' />
            Procurement Forecast Campaign
            <span className='rounded-full bg-purple-600 px-3 py-1 text-sm font-normal'>
              AI-Powered Demand Prediction
            </span>
          </h2>
          <p className='mt-2 text-slate-300'>
            AI-driven procurement forecasting and supplier engagement campaigns
          </p>
        </div>
        <div className='text-right'>
          <div className='text-2xl font-bold text-green-400'>
            ${metrics.totalForecastedSpend.toLocaleString()}
          </div>
          <div className='text-sm text-slate-400'>
            Forecasted Spend (Q1 2025)
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-6'>
        <div className='rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm text-blue-100'>Active Campaigns</p>
              <p className='text-3xl font-bold'>{metrics.activeCampaigns}</p>
              <p className='text-xs text-blue-200'>Running forecasts</p>
            </div>
            <Target className='h-8 w-8 text-blue-200' />
          </div>
        </div>

        <div className='rounded-xl bg-gradient-to-r from-green-600 to-green-700 p-6 text-white'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm text-green-100'>Supplier Reach</p>
              <p className='text-3xl font-bold'>{metrics.supplierReach}</p>
              <p className='text-xs text-green-200'>Potential suppliers</p>
            </div>
            <Building2 className='h-8 w-8 text-green-200' />
          </div>
        </div>

        <div className='rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 p-6 text-white'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm text-purple-100'>Cost Savings</p>
              <p className='text-3xl font-bold'>
                ${Math.round(metrics.costSavings / 1000)}K
              </p>
              <p className='text-xs text-purple-200'>Projected savings</p>
            </div>
            <DollarSign className='h-8 w-8 text-purple-200' />
          </div>
        </div>

        <div className='rounded-xl bg-gradient-to-r from-orange-600 to-orange-700 p-6 text-white'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm text-orange-100'>Forecast Accuracy</p>
              <p className='text-3xl font-bold'>{metrics.demandAccuracy}%</p>
              <p className='text-xs text-orange-200'>AI prediction accuracy</p>
            </div>
            <BarChart3 className='h-8 w-8 text-orange-200' />
          </div>
        </div>

        <div className='rounded-xl bg-gradient-to-r from-pink-600 to-pink-700 p-6 text-white'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm text-pink-100'>Leads Generated</p>
              <p className='text-3xl font-bold'>{metrics.leadsGenerated}</p>
              <p className='text-xs text-pink-200'>Supplier prospects</p>
            </div>
            <Users className='h-8 w-8 text-pink-200' />
          </div>
        </div>

        <div className='rounded-xl bg-gradient-to-r from-teal-600 to-teal-700 p-6 text-white'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm text-teal-100'>Demand Growth</p>
              <p className='text-3xl font-bold'>+32%</p>
              <p className='text-xs text-teal-200'>Average increase</p>
            </div>
            <TrendingUp className='h-8 w-8 text-teal-200' />
          </div>
        </div>
      </div>

      {/* Timeframe Selector */}
      <div className='rounded-xl bg-slate-800 p-4'>
        <div className='flex items-center gap-4'>
          <h3 className='text-lg font-semibold text-white'>
            Forecast Timeframe:
          </h3>
          <div className='flex gap-2'>
            {(['Q1', 'Q2', 'Q3', 'Q4'] as const).map((quarter) => (
              <button
                key={quarter}
                onClick={() => setSelectedTimeframe(quarter)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  selectedTimeframe === quarter
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                2025 {quarter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Procurement Forecasts */}
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
        {procurementForecasts.map((forecast) => (
          <div
            key={forecast.id}
            className='rounded-xl bg-slate-800 p-6 transition-colors hover:bg-slate-700'
          >
            <div className='mb-4 flex items-start justify-between'>
              <div className='flex items-center gap-3'>
                <Package className='h-6 w-6 text-blue-400' />
                <div>
                  <h3 className='text-xl font-bold text-white'>
                    {forecast.category}
                  </h3>
                  <p className='text-sm text-slate-300'>
                    {forecast.description}
                  </p>
                </div>
              </div>
              <span
                className={`rounded-full px-2 py-1 text-xs font-medium ${getRiskColor(forecast.riskLevel)}`}
              >
                {forecast.riskLevel} risk
              </span>
            </div>

            {/* Demand Metrics */}
            <div className='mb-4 grid grid-cols-2 gap-4'>
              <div className='rounded-lg bg-slate-900/50 p-3'>
                <p className='text-sm text-slate-400'>Current Demand</p>
                <p className='text-lg font-bold text-white'>
                  {forecast.currentDemand.toLocaleString()}
                </p>
              </div>
              <div className='rounded-lg bg-slate-900/50 p-3'>
                <p className='text-sm text-slate-400'>Forecasted Demand</p>
                <p className='text-lg font-bold text-white'>
                  {forecast.forecastedDemand.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Change Indicator */}
            <div className='mb-4 flex items-center gap-2'>
              <TrendingUp
                className={`h-4 w-4 ${getChangeColor(forecast.demandChange)}`}
              />
              <span
                className={`text-sm font-medium ${getChangeColor(forecast.demandChange)}`}
              >
                +{forecast.demandChange}% increase expected
              </span>
            </div>

            {/* Financial Metrics */}
            <div className='mb-4 grid grid-cols-3 gap-3 text-sm'>
              <div>
                <p className='text-slate-400'>Avg Cost</p>
                <p className='font-bold text-white'>
                  ${forecast.averageCost.toLocaleString()}
                </p>
              </div>
              <div>
                <p className='text-slate-400'>Est. Spend</p>
                <p className='font-bold text-green-400'>
                  ${Math.round(forecast.estimatedSpend / 1000)}K
                </p>
              </div>
              <div>
                <p className='text-slate-400'>Suppliers</p>
                <p className='font-bold text-blue-400'>{forecast.suppliers}</p>
              </div>
            </div>

            {/* Confidence & Timeline */}
            <div className='mb-4 flex items-center justify-between text-sm'>
              <div className='flex items-center gap-2'>
                <Zap className='h-4 w-4 text-yellow-400' />
                <span className='text-slate-300'>
                  {forecast.confidence}% confidence
                </span>
              </div>
              <div className='flex items-center gap-2'>
                <Calendar className='h-4 w-4 text-blue-400' />
                <span className='text-slate-300'>{forecast.timeline}</span>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={() => activateSupplierOutreach(forecast.id)}
              className='w-full rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-3 font-medium text-white transition-all hover:from-purple-700 hover:to-blue-700'
            >
              <Target className='mr-2 inline h-4 w-4' />
              Activate Supplier Outreach Campaign
            </button>
          </div>
        ))}
      </div>

      {/* AI Procurement Staff Assignment */}
      <div className='rounded-xl bg-gradient-to-r from-purple-900/50 to-blue-900/50 p-6'>
        <div className='mb-6'>
          <h3 className='flex items-center gap-3 text-2xl font-bold text-white'>
            <Users className='h-6 w-6 text-purple-400' />
            AI Procurement Specialists
          </h3>
          <p className='mt-2 text-slate-300'>
            Specialized AI staff for procurement forecasting and supplier
            management
          </p>
        </div>

        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
          {[
            {
              name: 'Preston',
              role: 'Procurement Forecast Analyst',
              specialty: 'Demand prediction and market analysis',
              avatar: '📊',
              status: 'Active',
            },
            {
              name: 'Samantha',
              role: 'Supplier Relations Specialist',
              specialty: 'Vendor outreach and negotiation',
              avatar: '🤝',
              status: 'Active',
            },
            {
              name: 'Quincy',
              role: 'Cost Optimization Analyst',
              specialty: 'Budget analysis and savings identification',
              avatar: '💰',
              status: 'Active',
            },
            {
              name: 'Riley',
              role: 'Risk Assessment Specialist',
              specialty: 'Supply chain risk evaluation',
              avatar: '⚠️',
              status: 'Active',
            },
          ].map((staff, index) => (
            <div key={index} className='rounded-lg bg-slate-800/50 p-4'>
              <div className='mb-3 flex items-center gap-3'>
                <span className='text-2xl'>{staff.avatar}</span>
                <div>
                  <h4 className='font-bold text-white'>{staff.name}</h4>
                  <p className='text-sm text-slate-300'>{staff.role}</p>
                </div>
              </div>
              <p className='mb-2 text-xs text-slate-400'>{staff.specialty}</p>
              <div className='flex items-center gap-2'>
                <div className='h-2 w-2 rounded-full bg-green-500'></div>
                <span className='text-xs text-green-400'>{staff.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Live Activity Feed */}
      <div className='rounded-xl bg-slate-800 p-6'>
        <h3 className='mb-6 text-2xl font-bold text-white'>
          🔥 Live Procurement Activity
        </h3>
        <div className='space-y-4'>
          {[
            {
              time: '3 min ago',
              message:
                'Preston analyzed Q1 transportation demand - 40% increase predicted',
              type: 'success',
              agent: 'Preston (Procurement Forecast)',
            },
            {
              time: '7 min ago',
              message: 'Sam contacted 23 fuel suppliers for competitive quotes',
              type: 'info',
              agent: 'Samantha (Supplier Relations)',
            },
            {
              time: '12 min ago',
              message:
                'Quinn identified $45K potential savings in equipment procurement',
              type: 'success',
              agent: 'Quincy (Cost Optimization)',
            },
            {
              time: '18 min ago',
              message:
                'Riley flagged high risk in fuel supply chain - alternative suppliers recommended',
              type: 'warning',
              agent: 'Riley (Risk Assessment)',
            },
            {
              time: '25 min ago',
              message:
                'Preston updated demand forecasts based on market trends',
              type: 'info',
              agent: 'Preston (Procurement Forecast)',
            },
          ].map((activity, index) => (
            <div
              key={index}
              className='flex items-start gap-3 rounded-lg bg-slate-700 p-4'
            >
              <div
                className={`mt-2 h-2 w-2 rounded-full ${
                  activity.type === 'success'
                    ? 'bg-green-500'
                    : activity.type === 'warning'
                      ? 'bg-yellow-500'
                      : 'bg-blue-500'
                }`}
              />
              <div className='flex-1'>
                <p className='text-white'>{activity.message}</p>
                <div className='mt-1 flex items-center gap-2 text-sm text-slate-400'>
                  <span>{activity.time}</span>
                  <span>•</span>
                  <span>{activity.agent}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
