/**
 * DEPOINTE Power-Ups Dashboard
 * Inspired by Sintra.ai's Power-Ups interface
 * Freight-specific micro-AI tools management
 */

'use client';

import {
  AlertTriangle,
  BarChart3,
  CheckCircle,
  Clock,
  Cog,
  MessageSquare,
  Pause,
  Play,
  Shield,
  Target,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  PowerUp,
  PowerUpResult,
  depointePowerUpsService,
} from '../services/DEPOINTEPowerUpsService';
import { freightBrainAI } from '../services/FreightBrainAI';

interface PowerUpsDashboardProps {
  selectedStaff?: string;
}

export default function PowerUpsDashboard({
  selectedStaff,
}: PowerUpsDashboardProps) {
  const [powerUps, setPowerUps] = useState<PowerUp[]>([]);
  const [filteredPowerUps, setFilteredPowerUps] = useState<PowerUp[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [executingPowerUp, setExecutingPowerUp] = useState<string | null>(null);
  const [executionResult, setExecutionResult] = useState<PowerUpResult | null>(
    null
  );
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    loadPowerUps();
    loadStats();
  }, []);

  useEffect(() => {
    filterPowerUps();
  }, [powerUps, selectedCategory, selectedStaff]);

  const loadPowerUps = () => {
    const allPowerUps = depointePowerUpsService.getAllPowerUps();
    setPowerUps(allPowerUps);
  };

  const loadStats = () => {
    const powerUpStats = depointePowerUpsService.getPowerUpStats();
    const brainStats = freightBrainAI.getBrainStats();
    setStats({ powerUps: powerUpStats, brain: brainStats });
  };

  const filterPowerUps = () => {
    let filtered = powerUps;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    // Filter by staff member
    if (selectedStaff) {
      filtered = filtered.filter((p) => p.aiStaff.includes(selectedStaff));
    }

    setFilteredPowerUps(filtered);
  };

  const executePowerUp = async (powerUpId: string) => {
    setExecutingPowerUp(powerUpId);
    setExecutionResult(null);

    try {
      const result = await depointePowerUpsService.executePowerUp(powerUpId, {
        staffMember: selectedStaff,
        timestamp: new Date(),
      });
      setExecutionResult(result);
      loadPowerUps(); // Refresh to update usage counts
    } catch (error) {
      setExecutionResult({
        success: false,
        message: 'Failed to execute Power-Up',
      });
    } finally {
      setExecutingPowerUp(null);
    }
  };

  const togglePowerUp = (powerUpId: string) => {
    depointePowerUpsService.togglePowerUp(powerUpId);
    loadPowerUps();
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      lead_generation: Target,
      operations: Cog,
      compliance: Shield,
      analytics: BarChart3,
      communication: MessageSquare,
      automation: Zap,
    };
    return icons[category as keyof typeof icons] || Zap;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      lead_generation: 'bg-red-500',
      operations: 'bg-green-500',
      compliance: 'bg-blue-500',
      analytics: 'bg-purple-500',
      communication: 'bg-yellow-500',
      automation: 'bg-indigo-500',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-500';
  };

  const categories = [
    { key: 'all', label: 'All Power-Ups', icon: Zap },
    { key: 'lead_generation', label: 'Lead Generation', icon: Target },
    { key: 'operations', label: 'Operations', icon: Cog },
    { key: 'compliance', label: 'Compliance', icon: Shield },
    { key: 'analytics', label: 'Analytics', icon: BarChart3 },
    { key: 'communication', label: 'Communication', icon: MessageSquare },
    { key: 'automation', label: 'Automation', icon: Zap },
  ];

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 text-white'>
      {/* Header */}
      <div className='mb-8'>
        <div className='mb-4 flex items-center gap-3'>
          <div className='rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 p-3'>
            <Zap className='h-8 w-8 text-white' />
          </div>
          <div>
            <h1 className='bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-3xl font-bold text-transparent'>
              DEPOINTE Power-Ups
            </h1>
            <p className='text-slate-400'>
              {selectedStaff
                ? `Power-Ups for ${selectedStaff}`
                : 'Freight-Specific Micro-AI Tools'}
            </p>
          </div>
        </div>

        {/* Stats Overview */}
        {stats && (
          <div className='mb-6 grid grid-cols-1 gap-4 md:grid-cols-4'>
            <div className='rounded-xl border border-slate-700 bg-slate-800/50 p-4'>
              <div className='flex items-center gap-3'>
                <div className='rounded-lg bg-green-500/20 p-2'>
                  <CheckCircle className='h-5 w-5 text-green-400' />
                </div>
                <div>
                  <p className='text-2xl font-bold text-green-400'>
                    {stats.powerUps.activePowerUps}
                  </p>
                  <p className='text-sm text-slate-400'>Active Power-Ups</p>
                </div>
              </div>
            </div>

            <div className='rounded-xl border border-slate-700 bg-slate-800/50 p-4'>
              <div className='flex items-center gap-3'>
                <div className='rounded-lg bg-blue-500/20 p-2'>
                  <TrendingUp className='h-5 w-5 text-blue-400' />
                </div>
                <div>
                  <p className='text-2xl font-bold text-blue-400'>
                    {stats.powerUps.totalUsage.toLocaleString()}
                  </p>
                  <p className='text-sm text-slate-400'>Total Executions</p>
                </div>
              </div>
            </div>

            <div className='rounded-xl border border-slate-700 bg-slate-800/50 p-4'>
              <div className='flex items-center gap-3'>
                <div className='rounded-lg bg-purple-500/20 p-2'>
                  <BarChart3 className='h-5 w-5 text-purple-400' />
                </div>
                <div>
                  <p className='text-2xl font-bold text-purple-400'>
                    {stats.powerUps.averageSuccessRate}%
                  </p>
                  <p className='text-sm text-slate-400'>Success Rate</p>
                </div>
              </div>
            </div>

            <div className='rounded-xl border border-slate-700 bg-slate-800/50 p-4'>
              <div className='flex items-center gap-3'>
                <div className='rounded-lg bg-yellow-500/20 p-2'>
                  <Clock className='h-5 w-5 text-yellow-400' />
                </div>
                <div>
                  <p className='text-2xl font-bold text-yellow-400'>2,400+</p>
                  <p className='text-sm text-slate-400'>Hours Saved</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Category Filter */}
      <div className='mb-6'>
        <div className='flex flex-wrap gap-2'>
          {categories.map((category) => {
            const Icon = category.icon;
            const isSelected = selectedCategory === category.key;

            return (
              <button
                key={category.key}
                onClick={() => setSelectedCategory(category.key)}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 transition-all ${
                  isSelected
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50'
                }`}
              >
                <Icon className='h-4 w-4' />
                {category.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Execution Result */}
      {executionResult && (
        <div
          className={`mb-6 rounded-xl border p-4 ${
            executionResult.success
              ? 'border-green-500/30 bg-green-900/20 text-green-100'
              : 'border-red-500/30 bg-red-900/20 text-red-100'
          }`}
        >
          <div className='mb-2 flex items-center gap-3'>
            {executionResult.success ? (
              <CheckCircle className='h-5 w-5 text-green-400' />
            ) : (
              <AlertTriangle className='h-5 w-5 text-red-400' />
            )}
            <h3 className='font-semibold'>
              {executionResult.success
                ? 'Power-Up Executed Successfully!'
                : 'Execution Failed'}
            </h3>
          </div>

          <p className='mb-3'>{executionResult.message}</p>

          {executionResult.success && executionResult.data && (
            <div className='mb-3 rounded-lg bg-slate-800/30 p-3'>
              <pre className='text-sm whitespace-pre-wrap text-slate-300'>
                {JSON.stringify(executionResult.data, null, 2)}
              </pre>
            </div>
          )}

          {executionResult.timesSaved && (
            <p className='mb-2 text-sm text-slate-300'>
              ⏱️ Time Saved: {Math.floor(executionResult.timesSaved / 60)} hours{' '}
              {executionResult.timesSaved % 60} minutes
            </p>
          )}

          {executionResult.nextSteps && (
            <div>
              <p className='mb-1 text-sm font-semibold'>Next Steps:</p>
              <ul className='list-inside list-disc text-sm text-slate-300'>
                {executionResult.nextSteps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Power-Ups Grid */}
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {filteredPowerUps.map((powerUp) => {
          const CategoryIcon = getCategoryIcon(powerUp.category);
          const isExecuting = executingPowerUp === powerUp.id;

          return (
            <div
              key={powerUp.id}
              className='rounded-xl border border-slate-700 bg-slate-800/50 p-6 transition-all hover:border-slate-600'
            >
              {/* Header */}
              <div className='mb-4 flex items-start justify-between'>
                <div className='flex items-center gap-3'>
                  <div
                    className={`rounded-lg p-2 ${getCategoryColor(powerUp.category)}/20`}
                  >
                    <span className='text-2xl'>{powerUp.icon}</span>
                  </div>
                  <div>
                    <h3 className='font-semibold text-white'>{powerUp.name}</h3>
                    <p className='text-sm text-slate-400 capitalize'>
                      {powerUp.category.replace('_', ' ')}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => togglePowerUp(powerUp.id)}
                  className={`rounded-lg p-2 transition-all ${
                    powerUp.isActive
                      ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                      : 'bg-slate-600/20 text-slate-400 hover:bg-slate-600/30'
                  }`}
                >
                  {powerUp.isActive ? (
                    <Play className='h-4 w-4' />
                  ) : (
                    <Pause className='h-4 w-4' />
                  )}
                </button>
              </div>

              {/* Description */}
              <p className='mb-4 line-clamp-3 text-sm text-slate-300'>
                {powerUp.description}
              </p>

              {/* Stats */}
              <div className='mb-4 grid grid-cols-2 gap-4'>
                <div>
                  <p className='text-xs text-slate-400'>Usage Count</p>
                  <p className='font-semibold text-white'>
                    {powerUp.usageCount.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className='text-xs text-slate-400'>Success Rate</p>
                  <p className='font-semibold text-green-400'>
                    {powerUp.successRate}%
                  </p>
                </div>
              </div>

              {/* Time Saved */}
              <div className='mb-4'>
                <p className='text-xs text-slate-400'>Time Saved</p>
                <p className='font-semibold text-blue-400'>
                  {powerUp.timesSaved}
                </p>
              </div>

              {/* AI Staff */}
              <div className='mb-4'>
                <p className='mb-1 text-xs text-slate-400'>AI Staff</p>
                <div className='flex flex-wrap gap-1'>
                  {powerUp.aiStaff.slice(0, 3).map((staff) => (
                    <span
                      key={staff}
                      className='rounded bg-slate-700/50 px-2 py-1 text-xs text-slate-300'
                    >
                      {staff}
                    </span>
                  ))}
                  {powerUp.aiStaff.length > 3 && (
                    <span className='rounded bg-slate-700/50 px-2 py-1 text-xs text-slate-300'>
                      +{powerUp.aiStaff.length - 3}
                    </span>
                  )}
                </div>
              </div>

              {/* Execute Button */}
              <button
                onClick={() => executePowerUp(powerUp.id)}
                disabled={!powerUp.isActive || isExecuting}
                className={`w-full rounded-lg px-4 py-2 font-semibold transition-all ${
                  powerUp.isActive && !isExecuting
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700'
                    : 'cursor-not-allowed bg-slate-700/50 text-slate-400'
                }`}
              >
                {isExecuting ? (
                  <div className='flex items-center justify-center gap-2'>
                    <div className='h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white'></div>
                    Executing...
                  </div>
                ) : (
                  'Execute Power-Up'
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredPowerUps.length === 0 && (
        <div className='py-12 text-center'>
          <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-800/30 p-4'>
            <Zap className='h-8 w-8 text-slate-400' />
          </div>
          <h3 className='mb-2 text-xl font-semibold text-slate-300'>
            No Power-Ups Found
          </h3>
          <p className='text-slate-400'>
            {selectedStaff
              ? `No Power-Ups available for ${selectedStaff} in the ${selectedCategory} category.`
              : `No Power-Ups found in the ${selectedCategory} category.`}
          </p>
        </div>
      )}
    </div>
  );
}
