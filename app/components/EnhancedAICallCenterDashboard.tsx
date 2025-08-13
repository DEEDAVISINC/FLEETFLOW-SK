'use client';

import {
  Activity,
  AlertTriangle,
  Brain,
  CheckCircle,
  Clock,
  DollarSign,
  Phone,
  TrendingUp,
  Truck,
  UserCheck,
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface AICallSession {
  callId: string;
  carrierPhone: string;
  startTime: string;
  conversationStage: string;
  aiConfidence: number;
  carrierInfo?: {
    companyName?: string;
    mcNumber?: string;
    equipmentTypes?: string[];
  };
  transferRequired: boolean;
  conversationTurns: number;
}

interface AICallMetrics {
  aiHandledCalls: number;
  aiSuccessRate: number;
  averageAIConfidence: number;
  transferRate: number;
  topTransferReasons: string[];
  aiResponseTime: number;
  carrierSatisfaction: number;
  totalCalls: number;
  connectedCalls: number;
  averageCallTime: number;
  conversionRate: number;
  revenue: number;
}

export default function EnhancedAICallCenterDashboard() {
  const [activeSessions, setActiveSessions] = useState<AICallSession[]>([]);
  const [metrics, setMetrics] = useState<AICallMetrics | null>(null);
  const [selectedSession, setSelectedSession] = useState<AICallSession | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(loadDashboardData, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      // Load active sessions
      const sessionsResponse = await fetch(
        '/api/ai/voice-conversation/sessions'
      );
      if (sessionsResponse.ok) {
        const sessionsData = await sessionsResponse.json();
        setActiveSessions(sessionsData.sessions || []);
      }

      // Load metrics
      const metricsResponse = await fetch('/api/ai/call-center/metrics');
      if (metricsResponse.ok) {
        const metricsData = await metricsResponse.json();
        setMetrics(metricsData.metrics);
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      // Load mock data for demo
      loadMockData();
    }
  };

  const loadMockData = () => {
    setActiveSessions([
      {
        callId: 'CALL-001',
        carrierPhone: '+1-555-0123',
        startTime: '2024-01-15T10:30:00Z',
        conversationStage: 'rate_negotiation',
        aiConfidence: 0.87,
        carrierInfo: {
          companyName: 'ABC Trucking',
          mcNumber: 'MC-123456',
          equipmentTypes: ['Dry Van', 'Flatbed'],
        },
        transferRequired: false,
        conversationTurns: 8,
      },
      {
        callId: 'CALL-002',
        carrierPhone: '+1-555-0456',
        startTime: '2024-01-15T10:45:00Z',
        conversationStage: 'qualification',
        aiConfidence: 0.92,
        carrierInfo: {
          companyName: 'XYZ Logistics',
          mcNumber: 'MC-789012',
        },
        transferRequired: false,
        conversationTurns: 4,
      },
      {
        callId: 'CALL-003',
        carrierPhone: '+1-555-0789',
        startTime: '2024-01-15T11:00:00Z',
        conversationStage: 'load_discussion',
        aiConfidence: 0.65,
        transferRequired: true,
        conversationTurns: 12,
      },
    ]);

    setMetrics({
      aiHandledCalls: 47,
      aiSuccessRate: 0.89,
      averageAIConfidence: 0.84,
      transferRate: 0.11,
      topTransferReasons: [
        'Complex negotiation',
        'Rate outside range',
        'Special requirements',
      ],
      aiResponseTime: 1.2,
      carrierSatisfaction: 4.3,
      totalCalls: 52,
      connectedCalls: 49,
      averageCallTime: 8.5,
      conversionRate: 0.76,
      revenue: 125000,
    });

    setIsLoading(false);
  };

  const handleTransferCall = async (callId: string) => {
    try {
      await fetch('/api/ai/voice-conversation', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ callId, reason: 'Manual transfer' }),
      });

      // Refresh data
      loadDashboardData();
    } catch (error) {
      console.error('Failed to transfer call:', error);
    }
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'greeting':
        return 'text-blue-400';
      case 'qualification':
        return 'text-yellow-400';
      case 'load_discussion':
        return 'text-purple-400';
      case 'rate_negotiation':
        return 'text-orange-400';
      case 'closing':
        return 'text-green-400';
      default:
        return 'text-gray-400';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-400';
    if (confidence >= 0.6) return 'text-yellow-400';
    return 'text-red-400';
  };

  if (isLoading) {
    return (
      <div className='flex h-96 items-center justify-center'>
        <div className='text-white'>Loading AI Call Center Dashboard...</div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold text-white'>
            Enhanced AI Call Center
          </h1>
          <p className='mt-2 text-white/70'>
            Parade.ai CoDriver-Level Voice AI for Freight Brokerage
          </p>
        </div>
        <div className='flex items-center gap-2 rounded-lg border border-green-500/20 bg-green-500/10 px-4 py-2'>
          <div className='h-2 w-2 animate-pulse rounded-full bg-green-400' />
          <span className='font-medium text-green-400'>AI System Active</span>
        </div>
      </div>

      {/* Key Metrics */}
      {metrics && (
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
          <div className='rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm'>
            <div className='mb-4 flex items-center gap-3'>
              <Brain className='h-6 w-6 text-blue-400' />
              <h3 className='text-lg font-semibold text-white'>
                AI Performance
              </h3>
            </div>
            <div className='space-y-3'>
              <div className='flex justify-between'>
                <span className='text-white/70'>AI Handled</span>
                <span className='font-bold text-blue-400'>
                  {metrics.aiHandledCalls}/{metrics.totalCalls}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-white/70'>Success Rate</span>
                <span className='font-bold text-green-400'>
                  {Math.round(metrics.aiSuccessRate * 100)}%
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-white/70'>Avg Confidence</span>
                <span
                  className={`font-bold ${getConfidenceColor(metrics.averageAIConfidence)}`}
                >
                  {Math.round(metrics.averageAIConfidence * 100)}%
                </span>
              </div>
            </div>
          </div>

          <div className='rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm'>
            <div className='mb-4 flex items-center gap-3'>
              <TrendingUp className='h-6 w-6 text-green-400' />
              <h3 className='text-lg font-semibold text-white'>Call Metrics</h3>
            </div>
            <div className='space-y-3'>
              <div className='flex justify-between'>
                <span className='text-white/70'>Connected</span>
                <span className='font-bold text-green-400'>
                  {metrics.connectedCalls}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-white/70'>Avg Time</span>
                <span className='font-bold text-white'>
                  {metrics.averageCallTime}min
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-white/70'>Conversion</span>
                <span className='font-bold text-green-400'>
                  {Math.round(metrics.conversionRate * 100)}%
                </span>
              </div>
            </div>
          </div>

          <div className='rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm'>
            <div className='mb-4 flex items-center gap-3'>
              <Clock className='h-6 w-6 text-purple-400' />
              <h3 className='text-lg font-semibold text-white'>
                Response Time
              </h3>
            </div>
            <div className='space-y-3'>
              <div className='text-center'>
                <div className='text-3xl font-bold text-purple-400'>
                  {metrics.aiResponseTime}s
                </div>
                <div className='text-sm text-white/70'>Average AI Response</div>
              </div>
              <div className='flex justify-between'>
                <span className='text-white/70'>Transfer Rate</span>
                <span className='font-bold text-orange-400'>
                  {Math.round(metrics.transferRate * 100)}%
                </span>
              </div>
            </div>
          </div>

          <div className='rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm'>
            <div className='mb-4 flex items-center gap-3'>
              <DollarSign className='h-6 w-6 text-yellow-400' />
              <h3 className='text-lg font-semibold text-white'>
                Revenue Impact
              </h3>
            </div>
            <div className='space-y-3'>
              <div className='text-center'>
                <div className='text-2xl font-bold text-yellow-400'>
                  ${(metrics.revenue / 1000).toFixed(0)}K
                </div>
                <div className='text-sm text-white/70'>Monthly Revenue</div>
              </div>
              <div className='flex justify-between'>
                <span className='text-white/70'>Satisfaction</span>
                <span className='font-bold text-green-400'>
                  {metrics.carrierSatisfaction}/5.0
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Active AI Call Sessions */}
      <div className='rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm'>
        <div className='mb-6 flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <Activity className='h-6 w-6 text-green-400' />
            <h2 className='text-xl font-semibold text-white'>
              Active AI Call Sessions
            </h2>
          </div>
          <div className='text-white/70'>
            {activeSessions.length} active calls
          </div>
        </div>

        {activeSessions.length === 0 ? (
          <div className='py-8 text-center text-white/50'>
            No active AI call sessions
          </div>
        ) : (
          <div className='grid gap-4'>
            {activeSessions.map((session) => (
              <div
                key={session.callId}
                className='cursor-pointer rounded-lg border border-white/10 bg-white/5 p-4 transition-colors hover:bg-white/10'
                onClick={() => setSelectedSession(session)}
              >
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-4'>
                    <div className='flex items-center gap-2'>
                      <Phone className='h-4 w-4 text-green-400' />
                      <span className='font-mono text-sm text-white'>
                        {session.callId}
                      </span>
                    </div>

                    <div className='flex items-center gap-2'>
                      <UserCheck className='h-4 w-4 text-blue-400' />
                      <span className='text-white'>{session.carrierPhone}</span>
                    </div>

                    {session.carrierInfo?.companyName && (
                      <div className='flex items-center gap-2'>
                        <Truck className='h-4 w-4 text-purple-400' />
                        <span className='text-white'>
                          {session.carrierInfo.companyName}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className='flex items-center gap-4'>
                    <div className='text-right'>
                      <div
                        className={`text-sm font-medium ${getStageColor(session.conversationStage)}`}
                      >
                        {session.conversationStage
                          .replace('_', ' ')
                          .toUpperCase()}
                      </div>
                      <div className='text-xs text-white/50'>
                        {session.conversationTurns} turns
                      </div>
                    </div>

                    <div className='text-right'>
                      <div
                        className={`text-sm font-bold ${getConfidenceColor(session.aiConfidence)}`}
                      >
                        {Math.round(session.aiConfidence * 100)}%
                      </div>
                      <div className='text-xs text-white/50'>confidence</div>
                    </div>

                    {session.transferRequired ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTransferCall(session.callId);
                        }}
                        className='flex items-center gap-2 rounded border border-orange-500/30 bg-orange-500/20 px-3 py-1 text-orange-300 transition-colors hover:bg-orange-500/30'
                      >
                        <AlertTriangle className='h-4 w-4' />
                        Transfer
                      </button>
                    ) : (
                      <div className='flex items-center gap-2 text-green-400'>
                        <CheckCircle className='h-4 w-4' />
                        <span className='text-sm'>AI Handling</span>
                      </div>
                    )}
                  </div>
                </div>

                {session.carrierInfo && (
                  <div className='mt-3 border-t border-white/10 pt-3'>
                    <div className='flex items-center gap-6 text-sm text-white/70'>
                      {session.carrierInfo.mcNumber && (
                        <span>MC: {session.carrierInfo.mcNumber}</span>
                      )}
                      {session.carrierInfo.equipmentTypes && (
                        <span>
                          Equipment:{' '}
                          {session.carrierInfo.equipmentTypes.join(', ')}
                        </span>
                      )}
                      <span>
                        Duration:{' '}
                        {Math.round(
                          (Date.now() - new Date(session.startTime).getTime()) /
                            60000
                        )}
                        min
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Top Transfer Reasons */}
      {metrics && metrics.topTransferReasons.length > 0 && (
        <div className='rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm'>
          <div className='mb-4 flex items-center gap-3'>
            <AlertTriangle className='h-6 w-6 text-orange-400' />
            <h2 className='text-xl font-semibold text-white'>
              Top Transfer Reasons
            </h2>
          </div>
          <div className='space-y-2'>
            {metrics.topTransferReasons.map((reason, index) => (
              <div
                key={index}
                className='flex items-center gap-3 text-white/80'
              >
                <div className='font-bold text-orange-400'>#{index + 1}</div>
                <div>{reason}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Capabilities Showcase */}
      <div className='rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm'>
        <h2 className='mb-4 text-xl font-semibold text-white'>
          🚀 CoDriver-Level AI Capabilities
        </h2>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
          <div className='flex items-center gap-3 rounded-lg border border-green-500/20 bg-green-500/10 p-3'>
            <CheckCircle className='h-5 w-5 text-green-400' />
            <span className='text-white'>Automated Carrier Qualification</span>
          </div>
          <div className='flex items-center gap-3 rounded-lg border border-blue-500/20 bg-blue-500/10 p-3'>
            <CheckCircle className='h-5 w-5 text-blue-400' />
            <span className='text-white'>Real-time FMCSA Verification</span>
          </div>
          <div className='flex items-center gap-3 rounded-lg border border-purple-500/20 bg-purple-500/10 p-3'>
            <CheckCircle className='h-5 w-5 text-purple-400' />
            <span className='text-white'>Intelligent Load Matching</span>
          </div>
          <div className='flex items-center gap-3 rounded-lg border border-orange-500/20 bg-orange-500/10 p-3'>
            <CheckCircle className='h-5 w-5 text-orange-400' />
            <span className='text-white'>Dynamic Rate Negotiation</span>
          </div>
          <div className='flex items-center gap-3 rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-3'>
            <CheckCircle className='h-5 w-5 text-yellow-400' />
            <span className='text-white'>Conversation Intelligence</span>
          </div>
          <div className='flex items-center gap-3 rounded-lg border border-pink-500/20 bg-pink-500/10 p-3'>
            <CheckCircle className='h-5 w-5 text-pink-400' />
            <span className='text-white'>Smart Transfer Decisions</span>
          </div>
        </div>
      </div>
    </div>
  );
}




