/**
 * Freight Brain AI Dashboard
 * Centralized knowledge system inspired by Sintra.ai's Brain AI Profile
 * Specialized for freight brokerage intelligence
 */

'use client';

import {
  AlertTriangle,
  BarChart3,
  Brain,
  CheckCircle,
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
    { key: 'all', label: 'All Knowledge', icon: Brain },
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
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 text-white'>
      {/* Header */}
      <div className='mb-8'>
        <div className='mb-4 flex items-center gap-3'>
          <div className='rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 p-3'>
            <Brain className='h-8 w-8 text-white' />
          </div>
          <div>
            <h1 className='bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-3xl font-bold text-transparent'>
              Freight Brain AI
            </h1>
            <p className='text-slate-400'>
              {selectedStaff
                ? `Personalized insights for ${selectedStaff}`
                : 'Centralized Freight Intelligence System'}
            </p>
          </div>
        </div>

        {/* Stats Overview */}
        {stats && (
          <div className='mb-6 grid grid-cols-1 gap-4 md:grid-cols-4'>
            <div className='rounded-xl border border-slate-700 bg-slate-800/50 p-4'>
              <div className='flex items-center gap-3'>
                <div className='rounded-lg bg-blue-500/20 p-2'>
                  <Brain className='h-5 w-5 text-blue-400' />
                </div>
                <div>
                  <p className='text-2xl font-bold text-blue-400'>
                    {stats.totalKnowledge}
                  </p>
                  <p className='text-sm text-slate-400'>Knowledge Items</p>
                </div>
              </div>
            </div>

            <div className='rounded-xl border border-slate-700 bg-slate-800/50 p-4'>
              <div className='flex items-center gap-3'>
                <div className='rounded-lg bg-green-500/20 p-2'>
                  <BarChart3 className='h-5 w-5 text-green-400' />
                </div>
                <div>
                  <p className='text-2xl font-bold text-green-400'>
                    {stats.averageConfidence}%
                  </p>
                  <p className='text-sm text-slate-400'>Avg Confidence</p>
                </div>
              </div>
            </div>

            <div className='rounded-xl border border-slate-700 bg-slate-800/50 p-4'>
              <div className='flex items-center gap-3'>
                <div className='rounded-lg bg-purple-500/20 p-2'>
                  <MapPin className='h-5 w-5 text-purple-400' />
                </div>
                <div>
                  <p className='text-2xl font-bold text-purple-400'>
                    {stats.marketLanes}
                  </p>
                  <p className='text-sm text-slate-400'>Market Lanes</p>
                </div>
              </div>
            </div>

            <div className='rounded-xl border border-slate-700 bg-slate-800/50 p-4'>
              <div className='flex items-center gap-3'>
                <div className='rounded-lg bg-orange-500/20 p-2'>
                  <Truck className='h-5 w-5 text-orange-400' />
                </div>
                <div>
                  <p className='text-2xl font-bold text-orange-400'>
                    {stats.carrierProfiles}
                  </p>
                  <p className='text-sm text-slate-400'>Carrier Profiles</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
        {/* Left Column - Search & Knowledge */}
        <div className='space-y-6 lg:col-span-2'>
          {/* Search */}
          <div className='rounded-xl border border-slate-700 bg-slate-800/50 p-6'>
            <div className='mb-4 flex items-center gap-3'>
              <Search className='h-5 w-5 text-slate-400' />
              <input
                type='text'
                placeholder='Search freight knowledge...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='flex-1 rounded-lg border border-slate-600 bg-slate-700/50 px-4 py-2 text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none'
              />
            </div>

            {/* Category Filter */}
            <div className='flex flex-wrap gap-2'>
              {categories.map((category) => {
                const Icon = category.icon;
                const isSelected = selectedCategory === category.key;

                return (
                  <button
                    key={category.key}
                    onClick={() => setSelectedCategory(category.key)}
                    className={`flex items-center gap-2 rounded-lg px-3 py-1 text-sm transition-all ${
                      isSelected
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
                    }`}
                  >
                    <Icon className='h-4 w-4' />
                    {category.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Knowledge Results */}
          <div className='space-y-4'>
            {knowledgeResults.map((knowledge) => {
              const CategoryIcon = getCategoryIcon(knowledge.category);

              return (
                <div
                  key={knowledge.id}
                  onClick={() => setSelectedKnowledge(knowledge)}
                  className='cursor-pointer rounded-xl border border-slate-700 bg-slate-800/50 p-4 transition-all hover:border-slate-600'
                >
                  <div className='mb-3 flex items-start justify-between'>
                    <div className='flex items-center gap-3'>
                      <div
                        className={`rounded-lg p-2 ${getCategoryColor(knowledge.category)}/20`}
                      >
                        <CategoryIcon
                          className='h-4 w-4'
                          style={{
                            color:
                              getCategoryColor(knowledge.category)
                                .replace('bg-', '')
                                .replace('-500', '') + '400',
                          }}
                        />
                      </div>
                      <div>
                        <h3 className='font-semibold text-white'>
                          {knowledge.title}
                        </h3>
                        <p className='text-sm text-slate-400 capitalize'>
                          {knowledge.category.replace('_', ' ')}
                        </p>
                      </div>
                    </div>

                    <div className='flex items-center gap-2'>
                      <div className='flex items-center gap-1'>
                        <Star className='h-4 w-4 text-yellow-400' />
                        <span className='text-sm text-yellow-400'>
                          {knowledge.confidence}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className='flex items-center gap-4 text-sm text-slate-400'>
                    <span>Source: {knowledge.source}</span>
                    <span>•</span>
                    <span>
                      Updated: {knowledge.lastUpdated.toLocaleDateString()}
                    </span>
                  </div>

                  <div className='mt-2 flex flex-wrap gap-1'>
                    {knowledge.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className='rounded bg-slate-700/50 px-2 py-1 text-xs text-slate-300'
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
        <div className='space-y-6'>
          {/* AI Recommendations */}
          {recommendations && (
            <div className='rounded-xl border border-slate-700 bg-slate-800/50 p-6'>
              <div className='mb-4 flex items-center gap-3'>
                <div className='rounded-lg bg-purple-500/20 p-2'>
                  <Lightbulb className='h-5 w-5 text-purple-400' />
                </div>
                <h3 className='font-semibold text-white'>AI Recommendations</h3>
              </div>

              <div className='space-y-3'>
                {recommendations.recommendations.map(
                  (rec: any, index: number) => (
                    <div
                      key={index}
                      className={`rounded-lg border p-3 ${
                        rec.priority === 'high'
                          ? 'border-red-500/30 bg-red-900/20'
                          : 'border-blue-500/30 bg-blue-900/20'
                      }`}
                    >
                      <div className='mb-2 flex items-center gap-2'>
                        {rec.priority === 'high' ? (
                          <AlertTriangle className='h-4 w-4 text-red-400' />
                        ) : (
                          <CheckCircle className='h-4 w-4 text-blue-400' />
                        )}
                        <h4 className='text-sm font-semibold text-white'>
                          {rec.title}
                        </h4>
                      </div>
                      <p className='mb-2 text-sm text-slate-300'>
                        {rec.content}
                      </p>
                      <p className='text-xs text-slate-400'>{rec.action}</p>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {/* Market Intelligence */}
          {marketIntel && (
            <div className='rounded-xl border border-slate-700 bg-slate-800/50 p-6'>
              <div className='mb-4 flex items-center gap-3'>
                <div className='rounded-lg bg-green-500/20 p-2'>
                  <TrendingUp className='h-5 w-5 text-green-400' />
                </div>
                <h3 className='font-semibold text-white'>
                  Market Intelligence
                </h3>
              </div>

              <div className='space-y-4'>
                {Object.entries(marketIntel).map(
                  ([lane, intel]: [string, any]) => (
                    <div key={lane} className='rounded-lg bg-slate-700/30 p-3'>
                      <div className='mb-2 flex items-center justify-between'>
                        <h4 className='font-semibold text-white'>{lane}</h4>
                        <span
                          className={`rounded px-2 py-1 text-xs ${
                            intel.demandLevel === 'high'
                              ? 'bg-red-500/20 text-red-400'
                              : intel.demandLevel === 'medium'
                                ? 'bg-yellow-500/20 text-yellow-400'
                                : 'bg-green-500/20 text-green-400'
                          }`}
                        >
                          {intel.demandLevel} demand
                        </span>
                      </div>

                      <div className='text-sm text-slate-300'>
                        <p>
                          Avg Rate:{' '}
                          <span className='font-semibold text-green-400'>
                            ${intel.averageRate}/mi
                          </span>
                        </p>
                        <p>
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
          <div className='rounded-xl border border-slate-700 bg-slate-800/50 p-6'>
            <div className='mb-4 flex items-center gap-3'>
              <div className='rounded-lg bg-blue-500/20 p-2'>
                <BarChart3 className='h-5 w-5 text-blue-400' />
              </div>
              <h3 className='font-semibold text-white'>Knowledge Stats</h3>
            </div>

            {stats && (
              <div className='space-y-3'>
                {Object.entries(stats.categoryCounts).map(
                  ([category, count]: [string, any]) => (
                    <div
                      key={category}
                      className='flex items-center justify-between'
                    >
                      <span className='text-sm text-slate-300 capitalize'>
                        {category.replace('_', ' ')}
                      </span>
                      <span className='text-sm font-semibold text-white'>
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
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
          <div className='max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-slate-800 p-6'>
            <div className='mb-4 flex items-center justify-between'>
              <h2 className='text-xl font-bold text-white'>
                {selectedKnowledge.title}
              </h2>
              <button
                onClick={() => setSelectedKnowledge(null)}
                className='rounded-lg p-2 transition-colors hover:bg-slate-700'
              >
                ✕
              </button>
            </div>

            <div className='space-y-4'>
              <div className='flex items-center gap-4 text-sm text-slate-400'>
                <span>
                  Category: {selectedKnowledge.category.replace('_', ' ')}
                </span>
                <span>•</span>
                <span>Confidence: {selectedKnowledge.confidence}%</span>
                <span>•</span>
                <span>Source: {selectedKnowledge.source}</span>
              </div>

              <div className='rounded-lg bg-slate-700/30 p-4'>
                <pre className='text-sm whitespace-pre-wrap text-slate-300'>
                  {JSON.stringify(selectedKnowledge.content, null, 2)}
                </pre>
              </div>

              <div className='flex flex-wrap gap-2'>
                {selectedKnowledge.tags.map((tag) => (
                  <span
                    key={tag}
                    className='rounded bg-slate-700/50 px-2 py-1 text-xs text-slate-300'
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
