/**
 * DEPOINTE AI Adaptive Learning Integration Component
 * Integrates adaptive learning capabilities with existing DEPOINTE systems
 */

'use client';

import { useEffect, useState } from 'react';
import { useAdaptiveLearning } from '../hooks/useAdaptiveLearning';
import { LearningStatusIndicator } from './AdaptiveLearningDashboard';
import { depointeStaffRoster } from './DEPOINTEStaffRoster';
import StaffLearningCard, {
  CompactStaffLearningCard,
} from './StaffLearningCard';

interface AdaptiveLearningIntegrationProps {
  showFullDashboard?: boolean;
  compactView?: boolean;
  selectedStaffId?: string;
}

export default function DEPOINTEAdaptiveLearningIntegration({
  showFullDashboard = false,
  compactView = false,
  selectedStaffId,
}: AdaptiveLearningIntegrationProps) {
  // Call hook unconditionally - React hooks must be called at top level
  const hookData = useAdaptiveLearning();

  const { systemStats, isLearning, isRecording } = hookData;
  const [activeStaffCount, setActiveStaffCount] = useState(0);

  useEffect(() => {
    try {
      // Count staff with adaptive learning enabled
      const enabledCount = depointeStaffRoster.filter(
        (staff) => staff.adaptiveLearning?.enabled
      ).length;
      setActiveStaffCount(enabledCount);
    } catch (error) {
      console.error('Error counting staff:', error);
      setActiveStaffCount(0);
    }
  }, []);

  if (compactView) {
    return (
      <div className='space-y-4'>
        {/* Compact System Overview */}
        <div className='rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 p-4 text-white'>
          <div className='flex items-center justify-between'>
            <div>
              <h3 className='text-lg font-semibold'>
                🧠 DEPOINTE Adaptive Learning Active
              </h3>
              <p className='text-sm opacity-90'>
                {activeStaffCount} AI staff learning •{' '}
                {systemStats.totalInteractions} interactions
              </p>
            </div>
            <div className='text-right'>
              <div className='text-2xl font-bold'>
                {Math.round(systemStats.averageSuccessRate)}%
              </div>
              <div className='text-sm opacity-90'>Success Rate</div>
            </div>
          </div>
          <div className='mt-3'>
            <LearningStatusIndicator
              isLearning={isLearning}
              isRecording={isRecording}
            />
          </div>
        </div>

        {/* Compact Staff Grid */}
        <div className='grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6'>
          {depointeStaffRoster
            .filter((staff) => staff.adaptiveLearning?.enabled)
            .slice(0, 12)
            .map((staff) => (
              <CompactStaffLearningCard key={staff.id} staff={staff} />
            ))}
        </div>
      </div>
    );
  }

  if (showFullDashboard) {
    return (
      <div className='space-y-6'>
        {/* Temporary simplified dashboard */}
        <div className='rounded-lg border border-gray-200/20 bg-white/5 p-6 backdrop-blur-sm'>
          <h3 className='mb-4 text-xl font-semibold text-white'>
            🧠 DEPOINTE Adaptive Learning Dashboard
          </h3>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
            <div className='rounded-lg bg-white/10 p-4'>
              <div className='text-2xl font-bold text-blue-400'>
                {systemStats.totalInteractions}
              </div>
              <div className='text-sm text-white/70'>Total Interactions</div>
            </div>
            <div className='rounded-lg bg-white/10 p-4'>
              <div className='text-2xl font-bold text-green-400'>
                {Math.round(systemStats.averageSuccessRate)}%
              </div>
              <div className='text-sm text-white/70'>Success Rate</div>
            </div>
            <div className='rounded-lg bg-white/10 p-4'>
              <div className='text-2xl font-bold text-purple-400'>
                {systemStats.staffProfiles}
              </div>
              <div className='text-sm text-white/70'>Learning Staff</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* System Overview Header */}
      <div className='rounded-xl border border-gray-200 bg-white p-6'>
        <div className='mb-4 flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-purple-500 to-blue-500'>
              <span className='text-2xl'>🧠</span>
            </div>
            <div>
              <h2 className='text-xl font-bold text-gray-800'>
                DEPOINTE AI Adaptive Learning
              </h2>
              <p className='text-gray-600'>
                AI staff continuously learning and improving
              </p>
            </div>
          </div>
          <LearningStatusIndicator
            isLearning={isLearning}
            isRecording={isRecording}
          />
        </div>

        {/* Key Metrics */}
        <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
          <div className='rounded-lg bg-blue-50 p-3 text-center'>
            <div className='text-2xl font-bold text-blue-600'>
              {activeStaffCount}
            </div>
            <div className='text-sm text-blue-600'>Learning-Enabled Staff</div>
          </div>

          <div className='rounded-lg bg-green-50 p-3 text-center'>
            <div className='text-2xl font-bold text-green-600'>
              {systemStats.totalInteractions.toLocaleString()}
            </div>
            <div className='text-sm text-green-600'>Total Interactions</div>
          </div>

          <div className='rounded-lg bg-purple-50 p-3 text-center'>
            <div className='text-2xl font-bold text-purple-600'>
              {Math.round(systemStats.averageSuccessRate)}%
            </div>
            <div className='text-sm text-purple-600'>Average Success Rate</div>
          </div>

          <div className='rounded-lg bg-orange-50 p-3 text-center'>
            <div className='text-2xl font-bold text-orange-600'>
              {systemStats.patterns}
            </div>
            <div className='text-sm text-orange-600'>Learning Patterns</div>
          </div>
        </div>
      </div>

      {/* Featured Staff Learning Cards */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {depointeStaffRoster
          .filter((staff) => staff.adaptiveLearning?.enabled)
          .filter(
            (staff) =>
              staff.adaptiveLearning.learningLevel === 'expert' ||
              staff.adaptiveLearning.learningLevel === 'advanced'
          )
          .slice(0, 6)
          .map((staff) => (
            <StaffLearningCard
              key={staff.id}
              staff={staff}
              showDetailedMetrics={true}
            />
          ))}
      </div>

      {/* Quick Actions */}
      <div className='rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50 p-6'>
        <h3 className='mb-4 text-lg font-semibold text-gray-800'>
          🚀 Adaptive Learning Features
        </h3>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
          <div className='flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3'>
            <span className='text-2xl'>🔄</span>
            <div>
              <div className='font-medium text-gray-800'>
                Continuous Learning
              </div>
              <div className='text-sm text-gray-600'>Real-time adaptation</div>
            </div>
          </div>

          <div className='flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3'>
            <span className='text-2xl'>🎯</span>
            <div>
              <div className='font-medium text-gray-800'>Personalization</div>
              <div className='text-sm text-gray-600'>
                User-specific responses
              </div>
            </div>
          </div>

          <div className='flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3'>
            <span className='text-2xl'>🧩</span>
            <div>
              <div className='font-medium text-gray-800'>
                Pattern Recognition
              </div>
              <div className='text-sm text-gray-600'>
                Success/failure analysis
              </div>
            </div>
          </div>

          <div className='flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3'>
            <span className='text-2xl'>📊</span>
            <div>
              <div className='font-medium text-gray-800'>
                Performance Tracking
              </div>
              <div className='text-sm text-gray-600'>Metrics & improvement</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Hook to simulate recording interactions for demonstration
export function useLearningDemo() {
  const { recordInteraction } = useAdaptiveLearning();

  const recordDemoInteraction = async (
    staffId: string,
    isSuccessful = true
  ) => {
    const demoInteraction = {
      staffId,
      staffName:
        depointeStaffRoster.find((s) => s.id === staffId)?.fullName ||
        'Demo Staff',
      interactionType: 'email' as const,
      userContext: {
        companyType: 'logistics_company',
        communicationStyle: 'professional' as const,
        industryKnowledge: 'intermediate' as const,
        urgencyLevel: 'normal' as const,
      },
      content: {
        input: 'Demo interaction for learning system',
        response: isSuccessful
          ? 'Professional and helpful response'
          : 'Suboptimal response',
        tone: 'professional',
        approach: isSuccessful ? 'solution-focused' : 'generic',
      },
      outcome: {
        success: isSuccessful,
        userSatisfaction: isSuccessful
          ? Math.random() * 3 + 7
          : Math.random() * 4 + 2, // 7-10 for success, 2-6 for failure
        goalAchieved: isSuccessful,
        followUpRequired: !isSuccessful,
        userFeedback: isSuccessful ? 'Great service!' : 'Could be improved',
      },
      metrics: {
        responseTime: Math.random() * 2000 + 1000,
        accuracy: isSuccessful
          ? Math.random() * 20 + 80
          : Math.random() * 30 + 40,
        appropriateness: isSuccessful
          ? Math.random() * 20 + 80
          : Math.random() * 30 + 50,
        effectiveness: isSuccessful
          ? Math.random() * 20 + 80
          : Math.random() * 30 + 45,
      },
    };

    await recordInteraction(demoInteraction);
    console.info(
      `📚 Demo interaction recorded for ${demoInteraction.staffName}: ${isSuccessful ? 'SUCCESS' : 'FAILURE'}`
    );
  };

  const generateRandomLearningData = async (count = 5) => {
    const staffIds = depointeStaffRoster
      .filter((s) => s.adaptiveLearning?.enabled)
      .map((s) => s.id);

    for (let i = 0; i < count; i++) {
      const randomStaffId =
        staffIds[Math.floor(Math.random() * staffIds.length)];
      const isSuccessful = Math.random() > 0.2; // 80% success rate

      await recordDemoInteraction(randomStaffId, isSuccessful);

      // Small delay to prevent overwhelming the system
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  };

  return {
    recordDemoInteraction,
    generateRandomLearningData,
  };
}
