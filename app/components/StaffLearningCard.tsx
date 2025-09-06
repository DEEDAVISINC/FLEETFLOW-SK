/**
 * Staff Learning Card Component
 * Shows individual staff member's adaptive learning capabilities and progress
 */

'use client';

import { useEffect, useState } from 'react';
import { useAdaptiveLearning } from '../hooks/useAdaptiveLearning';
import {
  calculateLearningMaturity,
  getLearningLevelDescription,
  getRecommendedLearningLevel,
} from '../utils/enhanceStaffWithAdaptiveLearning';
import { DEPOINTEStaffMember } from './DEPOINTEStaffRoster';

interface StaffLearningCardProps {
  staff: DEPOINTEStaffMember;
  showDetailedMetrics?: boolean;
  className?: string;
}

export default function StaffLearningCard({
  staff,
  showDetailedMetrics = false,
  className = '',
}: StaffLearningCardProps) {
  const { getStaffAnalytics, getImprovementSuggestions } =
    useAdaptiveLearning();
  const [analytics, setAnalytics] = useState(getStaffAnalytics(staff.id));
  const [suggestions, setSuggestions] = useState(
    getImprovementSuggestions(staff.id)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setAnalytics(getStaffAnalytics(staff.id));
      setSuggestions(getImprovementSuggestions(staff.id));
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, [staff.id, getStaffAnalytics, getImprovementSuggestions]);

  const maturityScore = analytics
    ? calculateLearningMaturity(
        analytics.learningMetrics.totalInteractions,
        analytics.learningMetrics.successRate,
        analytics.learningMetrics.averageUserSatisfaction
      )
    : 0;

  const recommendedLevel = getRecommendedLearningLevel(maturityScore);
  const isLevelOptimal =
    recommendedLevel === staff.adaptiveLearning.learningLevel;

  const getLearningStatusColor = (level: string) => {
    switch (level) {
      case 'expert':
        return 'text-purple-600 bg-purple-100';
      case 'advanced':
        return 'text-blue-600 bg-blue-100';
      case 'intermediate':
        return 'text-green-600 bg-green-100';
      case 'beginner':
        return 'text-orange-600 bg-orange-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getMaturityBarColor = (score: number) => {
    if (score >= 85) return 'bg-purple-500';
    if (score >= 70) return 'bg-blue-500';
    if (score >= 50) return 'bg-green-500';
    return 'bg-orange-500';
  };

  return (
    <div
      className={`rounded-xl border border-gray-200/20 bg-white/5 backdrop-blur-sm transition-all hover:bg-white/10 ${className}`}
    >
      {/* Header */}
      <div className='border-b border-gray-200/20 p-4'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div className='text-2xl'>{staff.avatar}</div>
            <div>
              <h3 className='font-semibold text-white'>{staff.fullName}</h3>
              <p className='text-sm text-white/70'>{staff.department}</p>
            </div>
          </div>

          {/* Learning Status Badge */}
          <div
            className={`rounded-full px-3 py-1 text-xs font-medium ${getLearningStatusColor(staff.adaptiveLearning.learningLevel)}`}
          >
            🧠 {staff.adaptiveLearning.learningLevel}
          </div>
        </div>
      </div>

      {/* Learning Capabilities */}
      <div className='p-4'>
        {/* Adaptive Features */}
        <div className='mb-4 grid grid-cols-3 gap-3'>
          <div className='text-center'>
            <div
              className={`mx-auto mb-1 flex h-8 w-8 items-center justify-center rounded-full ${
                staff.adaptiveLearning.continuousImprovement
                  ? 'bg-green-100 text-green-600'
                  : 'bg-gray-100 text-gray-400'
              }`}
            >
              {staff.adaptiveLearning.continuousImprovement ? '✅' : '❌'}
            </div>
            <div className='text-xs text-gray-600'>Continuous</div>
          </div>

          <div className='text-center'>
            <div
              className={`mx-auto mb-1 flex h-8 w-8 items-center justify-center rounded-full ${
                staff.adaptiveLearning.personalizedResponses
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-gray-100 text-gray-400'
              }`}
            >
              {staff.adaptiveLearning.personalizedResponses ? '🎯' : '❌'}
            </div>
            <div className='text-xs text-gray-600'>Personalized</div>
          </div>

          <div className='text-center'>
            <div
              className={`mx-auto mb-1 flex h-8 w-8 items-center justify-center rounded-full ${
                staff.adaptiveLearning.contextAwareness
                  ? 'bg-purple-100 text-purple-600'
                  : 'bg-gray-100 text-gray-400'
              }`}
            >
              {staff.adaptiveLearning.contextAwareness ? '🔍' : '❌'}
            </div>
            <div className='text-xs text-gray-600'>Context-Aware</div>
          </div>
        </div>

        {/* Learning Description */}
        <div className='mb-4 text-sm text-white/70'>
          {getLearningLevelDescription(staff.adaptiveLearning.learningLevel)}
        </div>

        {/* Adaptation Strengths */}
        <div className='mb-4'>
          <h4 className='mb-2 text-sm font-medium text-white/70'>
            Key Adaptations
          </h4>
          <div className='flex flex-wrap gap-1'>
            {staff.adaptiveLearning.adaptationStrengths
              .slice(0, 2)
              .map((strength, index) => (
                <span
                  key={index}
                  className='rounded bg-white/10 px-2 py-1 text-xs text-white/80'
                >
                  {strength}
                </span>
              ))}
            {staff.adaptiveLearning.adaptationStrengths.length > 2 && (
              <span className='rounded bg-white/10 px-2 py-1 text-xs text-white/60'>
                +{staff.adaptiveLearning.adaptationStrengths.length - 2} more
              </span>
            )}
          </div>
        </div>

        {/* Learning Maturity Progress */}
        {analytics && (
          <div className='mb-4'>
            <div className='mb-2 flex justify-between text-sm'>
              <span className='text-white/70'>Learning Maturity</span>
              <span className='font-medium text-white'>{maturityScore}%</span>
            </div>
            <div className='h-2 w-full rounded-full bg-gray-600/30'>
              <div
                className={`h-2 rounded-full transition-all duration-500 ${getMaturityBarColor(maturityScore)}`}
                style={{ width: `${maturityScore}%` }}
              ></div>
            </div>

            {/* Level Recommendation */}
            {!isLevelOptimal && (
              <div className='mt-2 rounded bg-amber-500/20 p-2 text-xs text-amber-300'>
                💡 Recommended level: <strong>{recommendedLevel}</strong>
              </div>
            )}
          </div>
        )}

        {/* Detailed Metrics */}
        {showDetailedMetrics && analytics && (
          <div className='mt-4 border-t border-gray-200/20 pt-4'>
            <div className='grid grid-cols-3 gap-4 text-center'>
              <div>
                <div className='text-lg font-semibold text-blue-400'>
                  {analytics.learningMetrics.totalInteractions}
                </div>
                <div className='text-xs text-white/70'>Interactions</div>
              </div>

              <div>
                <div className='text-lg font-semibold text-green-400'>
                  {Math.round(analytics.learningMetrics.successRate)}%
                </div>
                <div className='text-xs text-white/70'>Success Rate</div>
              </div>

              <div>
                <div className='text-lg font-semibold text-purple-400'>
                  {Math.round(
                    analytics.learningMetrics.averageUserSatisfaction * 10
                  ) / 10}
                  /10
                </div>
                <div className='text-xs text-white/70'>Satisfaction</div>
              </div>
            </div>

            {/* Improvement Suggestions */}
            {suggestions.length > 0 && (
              <div className='mt-4 rounded-lg bg-blue-500/10 p-3'>
                <h5 className='mb-2 text-xs font-medium text-blue-300'>
                  💡 Improvement Areas
                </h5>
                <div className='text-xs text-blue-200'>
                  {suggestions.slice(0, 1).map((suggestion, index) => (
                    <div key={index} className='flex items-start gap-1'>
                      <span className='mt-1.5 h-1 w-1 rounded-full bg-blue-400'></span>
                      <span>{suggestion}</span>
                    </div>
                  ))}
                  {suggestions.length > 1 && (
                    <div className='mt-1 text-blue-300'>
                      +{suggestions.length - 1} more areas
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Specialty Areas */}
            {analytics.learningMetrics.specialtyAreas.length > 0 && (
              <div className='mt-3 rounded-lg bg-green-500/10 p-3'>
                <h5 className='mb-2 text-xs font-medium text-green-300'>
                  ⭐ Specialties
                </h5>
                <div className='flex flex-wrap gap-1'>
                  {analytics.learningMetrics.specialtyAreas
                    .slice(0, 2)
                    .map((area, index) => (
                      <span
                        key={index}
                        className='rounded bg-green-500/20 px-2 py-1 text-xs text-green-300'
                      >
                        {area.replace('_', ' ')}
                      </span>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Compact version for dashboard grids
export function CompactStaffLearningCard({
  staff,
}: {
  staff: DEPOINTEStaffMember;
}) {
  const { getStaffAnalytics } = useAdaptiveLearning();
  const analytics = getStaffAnalytics(staff.id);

  const maturityScore = analytics
    ? calculateLearningMaturity(
        analytics.learningMetrics.totalInteractions,
        analytics.learningMetrics.successRate,
        analytics.learningMetrics.averageUserSatisfaction
      )
    : 0;

  return (
    <div className='rounded-lg border border-gray-200/20 bg-white/5 p-3 backdrop-blur-sm transition-all hover:bg-white/10'>
      <div className='mb-2 flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <span className='text-lg'>{staff.avatar}</span>
          <div>
            <div className='text-sm font-medium text-white'>
              {staff.firstName}
            </div>
            <div className='text-xs text-white/70'>{staff.department}</div>
          </div>
        </div>

        {/* Learning Level Indicator */}
        <div
          className={`h-2 w-2 rounded-full ${
            staff.adaptiveLearning.learningLevel === 'expert'
              ? 'bg-purple-400'
              : staff.adaptiveLearning.learningLevel === 'advanced'
                ? 'bg-blue-400'
                : staff.adaptiveLearning.learningLevel === 'intermediate'
                  ? 'bg-green-400'
                  : 'bg-orange-400'
          }`}
        ></div>
      </div>

      {/* Maturity Progress */}
      {analytics && (
        <div className='mb-2'>
          <div className='h-1 w-full rounded-full bg-gray-600/30'>
            <div
              className={`h-1 rounded-full transition-all ${
                maturityScore >= 85
                  ? 'bg-purple-500'
                  : maturityScore >= 70
                    ? 'bg-blue-500'
                    : maturityScore >= 50
                      ? 'bg-green-500'
                      : 'bg-orange-500'
              }`}
              style={{ width: `${maturityScore}%` }}
            ></div>
          </div>
          <div className='mt-1 text-xs text-white/70'>
            {maturityScore}% maturity
          </div>
        </div>
      )}

      {/* Status Indicators */}
      <div className='flex justify-center gap-3'>
        <div
          className={`flex h-4 w-4 items-center justify-center rounded-full text-xs ${
            staff.adaptiveLearning.enabled
              ? 'bg-green-500/20 text-green-400'
              : 'bg-gray-600/30 text-gray-400'
          }`}
        >
          🧠
        </div>
        <div
          className={`flex h-4 w-4 items-center justify-center rounded-full text-xs ${
            staff.adaptiveLearning.personalizedResponses
              ? 'bg-blue-500/20 text-blue-400'
              : 'bg-gray-600/30 text-gray-400'
          }`}
        >
          🎯
        </div>
        <div
          className={`flex h-4 w-4 items-center justify-center rounded-full text-xs ${
            staff.adaptiveLearning.contextAwareness
              ? 'bg-purple-500/20 text-purple-400'
              : 'bg-gray-600/30 text-gray-400'
          }`}
        >
          🔍
        </div>
      </div>
    </div>
  );
}
