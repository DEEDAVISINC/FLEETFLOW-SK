/**
 * SalesCopilotPanel Component
 * Real-time sales guidance interface for human agents
 */

'use client';

import { useEffect, useState } from 'react';
import { useSalesCopilot } from '../hooks/useSalesCopilot';
import { SalesGuidance } from '../services/SalesCopilotAI';

interface SalesCopilotPanelProps {
  agentId: string;
  currentCallId?: string;
  className?: string;
}

export function SalesCopilotPanel({
  agentId,
  currentCallId,
  className = '',
}: SalesCopilotPanelProps) {
  // State management
  const [prospectMessage, setProspectMessage] = useState('');
  const [agentResponse, setAgentResponse] = useState('');
  const [isCallActive, setIsCallActive] = useState(false);
  const [activeTab, setActiveTab] = useState<'before' | 'during' | 'after'>(
    'before'
  );
  const [prospectResearch, setProspectResearch] = useState<any>(null);
  const [callRecording, setCallRecording] = useState<any>(null);
  const [sentimentAnalysis, setSentimentAnalysis] = useState<any>(null);
  const [talkToListenRatio, setTalkToListenRatio] = useState<number>(0);

  // Real-time speech processing state
  const [isSpeechRecognitionActive, setIsSpeechRecognitionActive] =
    useState(false);
  const [liveTranscription, setLiveTranscription] = useState<any[]>([]);

  // Hook usage
  const {
    startCallGuidance,
    endCallGuidance,
    processConversation,
    currentGuidance,
    callContext,
    isConnected,
    isProcessing,
    connectionStatus,
    dismissGuidance,
    markGuidanceUsed,
    // NEW ENHANCED FEATURES
    researchProspect,
    getSentimentAnalysis,
    getTalkToListenRatio,
    generateCallInsights,
    startCallRecording,
    generateTranscript,
    // NEW REAL-TIME SPEECH PROCESSING
    startRealTimeSpeechRecognition,
    stopRealTimeSpeechRecognition,
    getTranscriptionHistory,
    getRealTalkToListenRatio,
  } = useSalesCopilot(agentId);

  // Auto-start guidance when call becomes active
  useEffect(() => {
    if (
      currentCallId &&
      !isCallActive &&
      callContext?.callId !== currentCallId
    ) {
      startCallGuidance(currentCallId);
      setIsCallActive(true);

      // Start real-time speech recognition
      startRealTimeSpeechRecognition(currentCallId, {
        language: 'en-US',
        continuous: true,
        interimResults: true,
      }).then((success) => {
        setIsSpeechRecognitionActive(success);
        if (success) {
          console.info(
            '🎤 Real-time speech recognition started for call:',
            currentCallId
          );
        } else {
          console.warn('❌ Failed to start real-time speech recognition');
        }
      });
    } else if (!currentCallId && isCallActive) {
      if (callContext?.callId) {
        endCallGuidance(callContext.callId, 'follow_up');
        // Stop speech recognition
        stopRealTimeSpeechRecognition(callContext.callId);
        setIsSpeechRecognitionActive(false);
      }
      setIsCallActive(false);
    }
  }, [
    currentCallId,
    isCallActive,
    callContext,
    startCallGuidance,
    endCallGuidance,
    startRealTimeSpeechRecognition,
    stopRealTimeSpeechRecognition,
  ]);

  // Listen for real-time transcription updates
  useEffect(() => {
    if (currentCallId) {
      const transcriptionHistory = getTranscriptionHistory(currentCallId);
      setLiveTranscription(transcriptionHistory.slice(-10)); // Keep last 10 transcriptions

      const ratio = getRealTalkToListenRatio(currentCallId);
      setTalkToListenRatio(ratio);
    }
  }, [currentCallId, getTranscriptionHistory, getRealTalkToListenRatio]);

  // Enhanced handlers
  const handleResearchCompany = async () => {
    try {
      const research = await researchProspect(agentId, 'company');
      setProspectResearch(research);
    } catch (error) {
      console.error('Research failed:', error);
    }
  };

  const handleResearchProspect = async () => {
    try {
      const research = await researchProspect(agentId, 'prospect');
      setProspectResearch(research);
    } catch (error) {
      console.error('Research failed:', error);
    }
  };

  const handleAnalyzePainPoints = async () => {
    try {
      const research = await researchProspect(agentId, 'painpoints');
      setProspectResearch(research);
    } catch (error) {
      console.error('Research failed:', error);
    }
  };

  const handlePlayRecording = async () => {
    try {
      const recording = await startCallRecording(currentCallId!);
      setCallRecording(recording);
    } catch (error) {
      console.error('Recording failed:', error);
    }
  };

  const handleViewTranscript = async () => {
    if (callRecording?.recordingUrl) {
      try {
        const transcript = await generateTranscript(callRecording.recordingUrl);
        setCallRecording({ ...callRecording, transcript });
      } catch (error) {
        console.error('Transcript generation failed:', error);
      }
    }
  };

  const handleSendFollowUp = () => {
    console.info('📧 Sending follow-up email...');
    // Implementation would go here
  };

  const handleScheduleNextCall = () => {
    console.info('📞 Scheduling next call...');
    // Implementation would go here
  };

  const handleProcessConversation = async () => {
    if (!currentCallId || !prospectMessage.trim() || !agentResponse.trim())
      return;

    try {
      await processConversation(
        currentCallId,
        prospectMessage,
        agentResponse,
        talkToListenRatio
      );
      setProspectMessage('');
      setAgentResponse('');
    } catch (error) {
      console.error('Conversation processing failed:', error);
    }
  };

  const getGuidanceColor = (guidance: SalesGuidance) => {
    if (guidance.urgency === 'immediate') return 'bg-red-50 border-red-200';
    if (guidance.urgency === 'high') return 'bg-orange-50 border-orange-200';
    return 'bg-blue-50 border-blue-200';
  };

  const getGuidanceIcon = (type: string) => {
    switch (type) {
      case 'objection_response':
        return '🛡️';
      case 'question':
        return '❓';
      case 'follow_up':
        return '📧';
      default:
        return '💡';
    }
  };

  return (
    <div
      className={`${className}`}
      style={{
        background:
          'linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(51, 65, 85, 0.9))',
        border: '1px solid rgba(59, 130, 246, 0.2)',
        borderRadius: '16px',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
        overflow: 'hidden',
      }}
    >
      <style jsx>{`
        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>

      {/* Header */}
      <div
        style={{
          padding: '20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          background:
            'linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(30, 41, 59, 0.8))',
        }}
      >
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-3'>
            <div
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: isConnected ? '#22c55e' : '#ef4444',
                boxShadow: `0 0 10px ${isConnected ? 'rgba(34, 197, 94, 0.5)' : 'rgba(239, 68, 68, 0.5)'}`,
              }}
            />
            <h3
              style={{
                fontSize: '1.4rem',
                fontWeight: '700',
                color: 'white',
                margin: 0,
                fontFamily:
                  'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              }}
            >
              🎯 Sales Copilot AI
            </h3>
          </div>
          <div
            style={{
              fontSize: '0.9rem',
              color: 'rgba(255, 255, 255, 0.6)',
              fontWeight: '500',
            }}
          >
            {connectionStatus}
          </div>
        </div>

        {/* Tab Navigation */}
        <div
          style={{
            marginTop: '16px',
            display: 'flex',
            gap: '4px',
            padding: '6px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          {[
            { id: 'before', label: '📊 Before Call', icon: '📊' },
            { id: 'during', label: '🎯 During Call', icon: '🎯' },
            { id: 'after', label: '📈 After Call', icon: '📈' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                flex: 1,
                padding: '10px 16px',
                borderRadius: '8px',
                border: 'none',
                background:
                  activeTab === tab.id
                    ? 'linear-gradient(135deg, #3b82f6, #06b6d4)'
                    : 'transparent',
                color:
                  activeTab === tab.id ? 'white' : 'rgba(255, 255, 255, 0.7)',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                boxShadow:
                  activeTab === tab.id
                    ? '0 4px 12px rgba(59, 130, 246, 0.3)'
                    : 'none',
              }}
              onMouseEnter={(e) => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.color = 'rgba(255, 255, 255, 0.9)';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
                }
              }}
            >
              <span style={{ fontSize: '1.1rem' }}>{tab.icon}</span>
              <span>{tab.label.split(' ')[0]}</span>
            </button>
          ))}
        </div>

        {/* Call Context - Show on During and After tabs */}
        {(activeTab === 'during' || activeTab === 'after') && callContext && (
          <div
            style={{
              marginTop: '16px',
              padding: '12px',
              background:
                'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1))',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              borderRadius: '8px',
              backdropFilter: 'blur(10px)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '8px',
              }}
            >
              <span
                style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                }}
              >
                <strong style={{ color: '#3b82f6' }}>Stage:</strong>{' '}
                {callContext.conversationStage}
              </span>
              <span
                style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                }}
              >
                <strong style={{ color: '#22c55e' }}>Confidence:</strong>{' '}
                {Math.round(callContext.confidenceScore * 100)}%
              </span>
            </div>
            {callContext.prospectInfo?.name && (
              <div
                style={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: '0.8rem',
                }}
              >
                <strong style={{ color: '#f59e0b' }}>Prospect:</strong>{' '}
                {callContext.prospectInfo.name}
                {callContext.prospectInfo.company &&
                  ` (${callContext.prospectInfo.company})`}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Dynamic Content Based on Tab */}
      <div
        style={{
          maxHeight: '400px',
          overflowY: 'auto',
          padding: '20px',
          background:
            'linear-gradient(135deg, rgba(15, 23, 42, 0.3), rgba(30, 41, 59, 0.3))',
        }}
      >
        {activeTab === 'before' && (
          <div className='space-y-4'>
            <div className='text-center'>
              <div className='mb-2 text-2xl'>📊</div>
              <h4 className='mb-2 text-lg font-semibold text-slate-100'>
                Deep Research & Intelligent Prep
              </h4>
              <p className='text-sm text-slate-400'>
                AI researches your prospect's company, recent news, pain points,
                and decision-making style
              </p>
            </div>

            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
            >
              <div
                style={{
                  padding: '16px',
                  background:
                    'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1))',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                  borderRadius: '12px',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '12px',
                  }}
                >
                  <span style={{ fontSize: '1.2rem' }}>🏢</span>
                  <span
                    style={{
                      fontSize: '0.95rem',
                      fontWeight: '600',
                      color: 'rgba(255, 255, 255, 0.9)',
                    }}
                  >
                    Company Intelligence & News
                  </span>
                </div>
                <p
                  style={{
                    fontSize: '0.8rem',
                    color: 'rgba(255, 255, 255, 0.6)',
                    marginBottom: '12px',
                    lineHeight: '1.4',
                  }}
                >
                  Recent company updates, funding, leadership changes
                </p>
                {!prospectResearch ? (
                  <button
                    onClick={handleResearchCompany}
                    style={{
                      width: '100%',
                      padding: '10px 16px',
                      background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
                      border: 'none',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-1px)';
                      e.currentTarget.style.boxShadow =
                        '0 6px 16px rgba(59, 130, 246, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow =
                        '0 4px 12px rgba(59, 130, 246, 0.3)';
                    }}
                  >
                    🔍 Research Company
                  </button>
                ) : (
                  <div className='text-sm text-slate-300'>
                    <div>
                      • Founded: {prospectResearch.companyIntelligence?.founded}
                    </div>
                    <div>
                      • Revenue: {prospectResearch.companyIntelligence?.revenue}
                    </div>
                    <div>
                      • Recent: {prospectResearch.companyIntelligence?.funding}
                    </div>
                  </div>
                )}
              </div>

              <div
                style={{
                  padding: '16px',
                  background:
                    'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(59, 130, 246, 0.1))',
                  border: '1px solid rgba(34, 197, 94, 0.2)',
                  borderRadius: '12px',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '12px',
                  }}
                >
                  <span style={{ fontSize: '1.2rem' }}>👤</span>
                  <span
                    style={{
                      fontSize: '0.95rem',
                      fontWeight: '600',
                      color: 'rgba(255, 255, 255, 0.9)',
                    }}
                  >
                    Prospect Background & Role
                  </span>
                </div>
                <p
                  style={{
                    fontSize: '0.8rem',
                    color: 'rgba(255, 255, 255, 0.6)',
                    marginBottom: '12px',
                    lineHeight: '1.4',
                  }}
                >
                  Decision maker profile, experience, LinkedIn insights
                </p>
                {!prospectResearch ? (
                  <button
                    onClick={handleResearchProspect}
                    style={{
                      width: '100%',
                      padding: '10px 16px',
                      background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
                      border: 'none',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-1px)';
                      e.currentTarget.style.boxShadow =
                        '0 6px 16px rgba(59, 130, 246, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow =
                        '0 4px 12px rgba(59, 130, 246, 0.3)';
                    }}
                  >
                    🔍 Research Prospect
                  </button>
                ) : (
                  <div className='text-sm text-slate-300'>
                    <div>• {prospectResearch.prospectProfile?.role}</div>
                    <div>• {prospectResearch.prospectProfile?.experience}</div>
                    <div>
                      • Previously at{' '}
                      {prospectResearch.prospectProfile?.previousCompanies?.[0]}
                    </div>
                  </div>
                )}
              </div>

              <div
                style={{
                  padding: '16px',
                  background:
                    'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(59, 130, 246, 0.1))',
                  border: '1px solid rgba(245, 158, 11, 0.2)',
                  borderRadius: '12px',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '12px',
                  }}
                >
                  <span style={{ fontSize: '1.2rem' }}>⚡</span>
                  <span
                    style={{
                      fontSize: '0.95rem',
                      fontWeight: '600',
                      color: 'rgba(255, 255, 255, 0.9)',
                    }}
                  >
                    Pain Points & Buying Signals
                  </span>
                </div>
                <p
                  style={{
                    fontSize: '0.8rem',
                    color: 'rgba(255, 255, 255, 0.6)',
                    marginBottom: '12px',
                    lineHeight: '1.4',
                  }}
                >
                  Current challenges, urgent needs, budget indicators
                </p>
                {!prospectResearch ? (
                  <button
                    onClick={handleAnalyzePainPoints}
                    style={{
                      width: '100%',
                      padding: '10px 16px',
                      background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
                      border: 'none',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-1px)';
                      e.currentTarget.style.boxShadow =
                        '0 6px 16px rgba(59, 130, 246, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow =
                        '0 4px 12px rgba(59, 130, 246, 0.3)';
                    }}
                  >
                    🔍 Analyze Pain Points
                  </button>
                ) : (
                  <div className='text-sm text-slate-300'>
                    {prospectResearch.painPoints
                      ?.slice(0, 3)
                      .map((pain: string, index: number) => (
                        <div key={index}>• {pain}</div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'during' && (
          <div className='space-y-4'>
            <div className='text-center'>
              <div className='mb-2 text-2xl'>🎯</div>
              <h4 className='mb-2 text-lg font-semibold text-slate-100'>
                Real-Time Guidance When It Matters
              </h4>
              <p className='text-sm text-slate-400'>
                Get instant AI-powered responses to objections, smart questions
                to ask, and battle cards
              </p>
            </div>

            {/* Live Sentiment Analysis */}
            <div
              style={{
                padding: '16px',
                background:
                  'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(59, 130, 246, 0.1))',
                border: '1px solid rgba(34, 197, 94, 0.2)',
                borderRadius: '12px',
                backdropFilter: 'blur(10px)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '12px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <span style={{ fontSize: '1.2rem' }}>📈</span>
                  <span
                    style={{
                      fontSize: '0.95rem',
                      fontWeight: '600',
                      color: 'rgba(255, 255, 255, 0.9)',
                    }}
                  >
                    Live Sentiment Analysis
                  </span>
                </div>
                <span
                  style={{
                    fontSize: '0.85rem',
                    fontWeight: '700',
                    color: '#22c55e',
                  }}
                >
                  POSITIVE
                </span>
              </div>
              <div
                style={{
                  width: '100%',
                  height: '8px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '4px',
                  marginBottom: '8px',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: '75%',
                    height: '100%',
                    background: 'linear-gradient(90deg, #22c55e, #16a34a)',
                    borderRadius: '4px',
                  }}
                ></div>
              </div>
              <p
                style={{
                  fontSize: '0.8rem',
                  color: 'rgba(255, 255, 255, 0.6)',
                }}
              >
                Prospect showing strong interest signals
              </p>
            </div>

            {/* Live Transcription */}
            <div
              style={{
                padding: '16px',
                background:
                  'linear-gradient(135deg, rgba(147, 51, 234, 0.1), rgba(59, 130, 246, 0.1))',
                border: '1px solid rgba(147, 51, 234, 0.2)',
                borderRadius: '12px',
                backdropFilter: 'blur(10px)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '12px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <span style={{ fontSize: '1.2rem' }}>🎤</span>
                  <span
                    style={{
                      fontSize: '0.95rem',
                      fontWeight: '600',
                      color: 'rgba(255, 255, 255, 0.9)',
                    }}
                  >
                    Live Transcription
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <div
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: isSpeechRecognitionActive
                        ? '#22c55e'
                        : '#ef4444',
                      animation: isSpeechRecognitionActive
                        ? 'pulse 1s infinite'
                        : 'none',
                    }}
                  />
                  <span
                    style={{
                      fontSize: '0.75rem',
                      color: 'rgba(255, 255, 255, 0.6)',
                    }}
                  >
                    {isSpeechRecognitionActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              <div
                style={{
                  maxHeight: '120px',
                  overflowY: 'auto',
                  background: 'rgba(0, 0, 0, 0.2)',
                  borderRadius: '6px',
                  padding: '8px',
                }}
              >
                {liveTranscription.length === 0 ? (
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.5)',
                      fontSize: '0.8rem',
                      textAlign: 'center',
                      padding: '16px',
                    }}
                  >
                    Waiting for speech...
                  </div>
                ) : (
                  liveTranscription.map((transcription: any, index: number) => (
                    <div
                      key={index}
                      style={{
                        marginBottom: '6px',
                        padding: '4px 8px',
                        background:
                          transcription.speaker === 'prospect'
                            ? 'rgba(59, 130, 246, 0.2)'
                            : 'rgba(34, 197, 94, 0.2)',
                        borderRadius: '4px',
                        fontSize: '0.8rem',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '2px',
                        }}
                      >
                        <span
                          style={{
                            fontWeight: '600',
                            color:
                              transcription.speaker === 'prospect'
                                ? '#3b82f6'
                                : '#22c55e',
                            fontSize: '0.7rem',
                          }}
                        >
                          {transcription.speaker === 'prospect'
                            ? '👤 Prospect'
                            : '🎯 Agent'}
                        </span>
                        <span
                          style={{
                            fontSize: '0.6rem',
                            color: 'rgba(255, 255, 255, 0.5)',
                          }}
                        >
                          {transcription.isInterim ? '...' : ''}
                        </span>
                      </div>
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.9)',
                          lineHeight: '1.3',
                        }}
                      >
                        {transcription.text}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Current Guidance */}
            {currentGuidance.length === 0 ? (
              <div className='py-8 text-center text-slate-400'>
                <div className='mb-2 text-2xl'>🎯</div>
                <p>No active guidance</p>
                <p className='text-sm'>
                  Guidance will appear here during calls
                </p>
              </div>
            ) : (
              <div className='space-y-3'>
                {currentGuidance.map((guidance: SalesGuidance) => (
                  <div
                    key={guidance.id}
                    className={`rounded-lg border p-3 ${getGuidanceColor(guidance)}`}
                  >
                    <div className='flex items-start justify-between'>
                      <div className='flex-1'>
                        <div className='mb-2 flex items-center space-x-2'>
                          <span className='text-lg'>
                            {getGuidanceIcon(guidance.type)}
                          </span>
                          <span className='text-sm font-medium text-gray-700 capitalize'>
                            {guidance.type.replace('_', ' ')}
                          </span>
                          <span
                            className={`rounded px-2 py-1 text-xs ${
                              guidance.urgency === 'immediate'
                                ? 'bg-red-100 text-red-800'
                                : guidance.urgency === 'high'
                                  ? 'bg-orange-100 text-orange-800'
                                  : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {guidance.urgency}
                          </span>
                        </div>
                        <p className='text-gray-900'>{guidance.content}</p>
                        {guidance.alternatives &&
                          guidance.alternatives.length > 0 && (
                            <div className='mt-2'>
                              <p className='mb-1 text-xs text-gray-600'>
                                Alternatives:
                              </p>
                              <ul className='space-y-1 text-xs text-gray-700'>
                                {guidance.alternatives
                                  .slice(0, 2)
                                  .map((alt: string, idx: number) => (
                                    <li key={idx} className='italic'>
                                      • {alt}
                                    </li>
                                  ))}
                              </ul>
                            </div>
                          )}
                      </div>
                      <div className='ml-3 flex space-x-1'>
                        <button
                          onClick={() => markGuidanceUsed(guidance.id)}
                          className='rounded bg-green-100 px-2 py-1 text-xs text-green-800 hover:bg-green-200'
                        >
                          ✓ Used
                        </button>
                        <button
                          onClick={() => dismissGuidance(guidance.id)}
                          className='rounded bg-gray-100 px-2 py-1 text-xs text-gray-800 hover:bg-gray-200'
                        >
                          ✕ Dismiss
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'after' && (
          <div className='space-y-4'>
            <div className='text-center'>
              <div className='mb-2 text-2xl'>📈</div>
              <h4 className='mb-2 text-lg font-semibold text-slate-100'>
                Smart Analysis & Next Steps
              </h4>
              <p className='text-sm text-slate-400'>
                Review call recordings, AI-generated insights, transcription,
                talk-to-listen ratios
              </p>
            </div>

            <div className='space-y-3'>
              <div
                style={{
                  padding: '16px',
                  background:
                    'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1))',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                  borderRadius: '12px',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '12px',
                  }}
                >
                  <span style={{ fontSize: '1.2rem' }}>🎙️</span>
                  <span
                    style={{
                      fontSize: '0.95rem',
                      fontWeight: '600',
                      color: 'rgba(255, 255, 255, 0.9)',
                    }}
                  >
                    Call Recording & Transcript
                  </span>
                </div>
                <p
                  style={{
                    fontSize: '0.8rem',
                    color: 'rgba(255, 255, 255, 0.6)',
                    marginBottom: '12px',
                    lineHeight: '1.4',
                  }}
                >
                  Full conversation recording with AI transcription
                </p>
                <div className='flex space-x-2'>
                  <button
                    onClick={handlePlayRecording}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
                      border: 'none',
                      borderRadius: '6px',
                      color: 'white',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-1px)';
                      e.currentTarget.style.boxShadow =
                        '0 4px 12px rgba(59, 130, 246, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow =
                        '0 2px 8px rgba(59, 130, 246, 0.3)';
                    }}
                  >
                    ▶️ Play Recording
                  </button>
                  <button
                    onClick={handleViewTranscript}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      background: 'linear-gradient(135deg, #64748b, #475569)',
                      border: 'none',
                      borderRadius: '6px',
                      color: 'white',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 2px 8px rgba(100, 116, 139, 0.3)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-1px)';
                      e.currentTarget.style.boxShadow =
                        '0 4px 12px rgba(100, 116, 139, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow =
                        '0 2px 8px rgba(100, 116, 139, 0.3)';
                    }}
                  >
                    📝 View Transcript
                  </button>
                </div>
              </div>

              <div
                style={{
                  padding: '16px',
                  background:
                    'linear-gradient(135deg, rgba(147, 51, 234, 0.1), rgba(59, 130, 246, 0.1))',
                  border: '1px solid rgba(147, 51, 234, 0.2)',
                  borderRadius: '12px',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '12px',
                  }}
                >
                  <span style={{ fontSize: '1.2rem' }}>🧠</span>
                  <span
                    style={{
                      fontSize: '0.95rem',
                      fontWeight: '600',
                      color: 'rgba(255, 255, 255, 0.9)',
                    }}
                  >
                    AI-Powered Insights & Coaching
                  </span>
                </div>
                <p
                  style={{
                    fontSize: '0.8rem',
                    color: 'rgba(255, 255, 255, 0.6)',
                    marginBottom: '12px',
                    lineHeight: '1.4',
                  }}
                >
                  Smart analysis of conversation effectiveness
                </p>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    fontSize: '0.85rem',
                    color: 'rgba(255, 255, 255, 0.8)',
                  }}
                >
                  <div>• Strong objection handling (+85%)</div>
                  <div>• Good discovery questions asked</div>
                  <div>• Opportunity to probe deeper on budget</div>
                </div>
              </div>

              <div
                style={{
                  padding: '16px',
                  background:
                    'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(59, 130, 246, 0.1))',
                  border: '1px solid rgba(34, 197, 94, 0.2)',
                  borderRadius: '12px',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '12px',
                  }}
                >
                  <span style={{ fontSize: '1.2rem' }}>⚖️</span>
                  <span
                    style={{
                      fontSize: '0.95rem',
                      fontWeight: '600',
                      color: 'rgba(255, 255, 255, 0.9)',
                    }}
                  >
                    Talk-to-Listen Ratio Analysis
                  </span>
                </div>
                <p
                  style={{
                    fontSize: '0.8rem',
                    color: 'rgba(255, 255, 255, 0.6)',
                    marginBottom: '12px',
                    lineHeight: '1.4',
                  }}
                >
                  Optimal ratio: 30% talk, 70% listen
                </p>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                >
                  <div
                    style={{
                      flex: 1,
                      height: '8px',
                      background: 'rgba(255, 255, 255, 0.2)',
                      borderRadius: '4px',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: `${Math.min(talkToListenRatio, 100)}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, #22c55e, #16a34a)',
                        borderRadius: '4px',
                      }}
                    ></div>
                  </div>
                  <span
                    style={{
                      fontSize: '0.9rem',
                      fontWeight: '700',
                      color: '#22c55e',
                    }}
                  >
                    {talkToListenRatio}%
                  </span>
                </div>
                <p
                  style={{
                    fontSize: '0.8rem',
                    color: 'rgba(255, 255, 255, 0.6)',
                    marginTop: '8px',
                  }}
                >
                  Your ratio:{' '}
                  {Math.round(((100 - talkToListenRatio) / 100) * 100)}% talk,{' '}
                  {talkToListenRatio}% listen (
                  {talkToListenRatio >= 65 ? 'Good!' : 'Try listening more'})
                </p>
              </div>

              <div
                style={{
                  padding: '16px',
                  background:
                    'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(59, 130, 246, 0.1))',
                  border: '1px solid rgba(245, 158, 11, 0.2)',
                  borderRadius: '12px',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '12px',
                  }}
                >
                  <span style={{ fontSize: '1.2rem' }}>📧</span>
                  <span
                    style={{
                      fontSize: '0.95rem',
                      fontWeight: '600',
                      color: 'rgba(255, 255, 255, 0.9)',
                    }}
                  >
                    Automated Follow-Up Suggestions
                  </span>
                </div>
                <p
                  style={{
                    fontSize: '0.8rem',
                    color: 'rgba(255, 255, 255, 0.6)',
                    marginBottom: '12px',
                    lineHeight: '1.4',
                  }}
                >
                  AI-generated next steps and messaging
                </p>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                  }}
                >
                  <button
                    onClick={handleSendFollowUp}
                    style={{
                      width: '100%',
                      padding: '10px 16px',
                      background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                      border: 'none',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-1px)';
                      e.currentTarget.style.boxShadow =
                        '0 6px 16px rgba(34, 197, 94, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow =
                        '0 4px 12px rgba(34, 197, 94, 0.3)';
                    }}
                  >
                    📧 Send Follow-Up Email
                  </button>
                  <button
                    onClick={handleScheduleNextCall}
                    style={{
                      width: '100%',
                      padding: '10px 16px',
                      background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
                      border: 'none',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-1px)';
                      e.currentTarget.style.boxShadow =
                        '0 6px 16px rgba(59, 130, 246, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow =
                        '0 4px 12px rgba(59, 130, 246, 0.3)';
                    }}
                  >
                    📞 Schedule Next Call
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Conversation Input (for testing/development) */}
      {process.env.NODE_ENV === 'development' && callContext && (
        <div
          className='border-t border-slate-700 px-4 py-3'
          style={{ background: 'rgba(15, 23, 42, 0.6)' }}
        >
          <div className='mb-2 text-sm font-medium text-slate-300'>
            Process Conversation (Dev Mode)
          </div>
          <div className='space-y-2'>
            <input
              type='text'
              placeholder='What did the prospect say?'
              value={prospectMessage}
              onChange={(e) => setProspectMessage(e.target.value)}
              className='w-full rounded border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-slate-200 placeholder-slate-500'
            />
            <input
              type='text'
              placeholder='What did you say?'
              value={agentResponse}
              onChange={(e) => setAgentResponse(e.target.value)}
              className='w-full rounded border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-slate-200 placeholder-slate-500'
            />
            <button
              onClick={handleProcessConversation}
              disabled={
                !prospectMessage.trim() || !agentResponse.trim() || isProcessing
              }
              className='w-full rounded bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:bg-slate-700 disabled:text-slate-500'
            >
              {isProcessing ? 'Processing...' : 'Process Conversation'}
            </button>
          </div>
        </div>
      )}

      {/* Loading indicator */}
      {isProcessing && (
        <div
          className='border-t border-slate-700 px-4 py-2'
          style={{ background: 'rgba(59, 130, 246, 0.1)' }}
        >
          <div className='flex items-center space-x-2'>
            <div className='h-4 w-4 animate-spin rounded-full border-b-2 border-blue-500'></div>
            <span className='text-sm text-blue-400'>
              Analyzing conversation...
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
