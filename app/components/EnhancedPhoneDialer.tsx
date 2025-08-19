'use client';

import { useEffect, useState } from 'react';
import { aiCallAnalysisService } from '../services/AICallAnalysisService';
import { enhancedCRMService } from '../services/EnhancedCRMService';
import { freeSWITCHService } from '../services/FreeSWITCHService';
import { intelligentCallRoutingService } from '../services/IntelligentCallRoutingService';

interface ActiveCall {
  id: string;
  number: string;
  name?: string;
  status: 'dialing' | 'ringing' | 'connected' | 'on_hold';
  startTime: string;
  duration: number;
  platform: 'twilio' | 'freeswitch';
  recording: boolean;
  transcript: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
}

interface CallScript {
  id: string;
  name: string;
  category: string;
  content: {
    opening: string;
    keyPoints: string[];
    objectionHandling: { objection: string; response: string }[];
    closing: string;
  };
}

export default function EnhancedPhoneDialer() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [activeCall, setActiveCall] = useState<ActiveCall | null>(null);
  const [callQueue, setCallQueue] = useState<any[]>([]);
  const [currentScript, setCurrentScript] = useState<CallScript | null>(null);
  const [callScripts] = useState(aiCallAnalysisService.getCallScripts());
  const [agents] = useState(intelligentCallRoutingService.getAgents());
  const [selectedPlatform, setSelectedPlatform] = useState<
    'twilio' | 'freeswitch' | 'auto'
  >('auto');
  const [showAdvancedFeatures, setShowAdvancedFeatures] = useState(false);
  const [realtimeCoaching, setRealtimeCoaching] = useState<string[]>([]);
  const [callAnalysis, setCallAnalysis] = useState<any>(null);

  const [dialerStats, setDialerStats] = useState({
    callsMadeToday: 23,
    connectedCalls: 18,
    averageDuration: 285,
    conversionRate: 24.3,
    costSavings: 76.5, // % savings with FreeSWITCH
  });

  const [contacts] = useState(enhancedCRMService.getContacts({ limit: 10 }));
  const [recommendations] = useState(
    enhancedCRMService.getSmartRecommendations('agent-001')
  );

  useEffect(() => {
    // Initialize FreeSWITCH connection with error handling
    const initializeFreeSWITCH = async () => {
      try {
        await freeSWITCHService.connect();
      } catch (error) {
        console.error('FreeSWITCH initialization error:', error);
      }
    };

    initializeFreeSWITCH();

    // Set up event listeners
    freeSWITCHService.on('callStarted', handleCallStarted);
    freeSWITCHService.on('callAnswered', handleCallAnswered);
    freeSWITCHService.on('callEnded', handleCallEnded);
    freeSWITCHService.on('error', (error) => {
      console.error('FreeSWITCH error:', error);
    });

    return () => {
      freeSWITCHService.off('callStarted', handleCallStarted);
      freeSWITCHService.off('callAnswered', handleCallAnswered);
      freeSWITCHService.off('callEnded', handleCallEnded);
    };
  }, []);

  const handleCallStarted = (call: any) => {
    setActiveCall({
      id: call.uuid,
      number: call.calleeNumber,
      name:
        selectedContact?.personalInfo?.firstName +
        ' ' +
        selectedContact?.personalInfo?.lastName,
      status: 'dialing',
      startTime: call.startTime,
      duration: 0,
      platform: 'freeswitch',
      recording: true,
      transcript: [],
      sentiment: 'neutral',
    });
  };

  const handleCallAnswered = (call: any) => {
    if (activeCall) {
      setActiveCall({
        ...activeCall,
        status: 'connected',
      });

      // Load appropriate script
      const script = getScriptForContact(selectedContact);
      setCurrentScript(script);
    }
  };

  const handleCallEnded = (call: any) => {
    if (activeCall) {
      // Perform AI analysis
      performCallAnalysis();

      setActiveCall(null);
      setCurrentScript(null);
      setCallAnalysis(null);
    }
  };

  const getScriptForContact = (contact: any): CallScript | null => {
    if (!contact) return null;

    // Determine script based on contact type and status
    let category = 'inquiry';
    if (contact.relationship?.status === 'prospect') category = 'sales';
    else if (contact.type === 'carrier') category = 'booking';

    return (
      callScripts.find((script) => script.category === category) ||
      callScripts[0] ||
      null
    );
  };

  const makeCall = async () => {
    if (!phoneNumber) return;

    try {
      const platform =
        selectedPlatform === 'auto' ? 'freeswitch' : selectedPlatform;

      if (platform === 'freeswitch') {
        try {
          await freeSWITCHService.makeCall('+15551234567', phoneNumber, {
            recordCall: true,
            callerIdName: 'FleetFlow',
          });
        } catch (freeswitchError) {
          console.warn(
            'FreeSWITCH call failed, falling back to Twilio:',
            freeswitchError
          );
          // Auto-fallback to Twilio
          await makeTwilioCall();
        }
      } else {
        await makeTwilioCall();
      }
    } catch (error) {
      console.error('Failed to make call:', error);
      alert('Failed to make call. Please try again.');
    }
  };

  const makeTwilioCall = async () => {
    try {
      const response = await fetch('/api/twilio-calls/make-call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: phoneNumber,
          message:
            'Hello from FleetFlow! A representative will be with you shortly.',
        }),
      });

      const result = await response.json();
      if (result.success) {
        setActiveCall({
          id: result.callSid,
          number: phoneNumber,
          name:
            selectedContact?.personalInfo?.firstName +
            ' ' +
            selectedContact?.personalInfo?.lastName,
          status: 'dialing',
          startTime: new Date().toISOString(),
          duration: 0,
          platform: 'twilio',
          recording: true,
          transcript: [],
          sentiment: 'neutral',
        });
      } else {
        throw new Error(result.error || 'Twilio call failed');
      }
    } catch (error) {
      console.error('Twilio call failed:', error);
      throw error;
    }
  };

  const hangupCall = async () => {
    if (!activeCall) return;

    try {
      if (activeCall.platform === 'freeswitch') {
        await freeSWITCHService.hangupCall(activeCall.id);
      } else {
        // Twilio hangup logic
        console.log('Hanging up Twilio call:', activeCall.id);
      }
    } catch (error) {
      console.error('Failed to hangup call:', error);
    }
  };

  const holdCall = async () => {
    if (!activeCall) return;

    try {
      if (activeCall.platform === 'freeswitch') {
        await freeSWITCHService.holdCall(
          activeCall.id,
          activeCall.status !== 'on_hold'
        );
        setActiveCall({
          ...activeCall,
          status: activeCall.status === 'on_hold' ? 'connected' : 'on_hold',
        });
      }
    } catch (error) {
      console.error('Failed to hold/unhold call:', error);
    }
  };

  const performCallAnalysis = async () => {
    if (!activeCall) return;

    try {
      const transcript = activeCall.transcript.map((text, index) => ({
        id: `transcript-${index}`,
        callId: activeCall.id,
        timestamp: new Date().toISOString(),
        speaker: index % 2 === 0 ? 'agent' : 'customer',
        text,
        confidence: 0.9,
      }));

      const analysis = await aiCallAnalysisService.analyzeCall(transcript, {
        callId: activeCall.id,
        duration: activeCall.duration,
        platform: activeCall.platform,
      });

      setCallAnalysis(analysis);

      // Add interaction to CRM
      if (selectedContact) {
        try {
          const interaction = {
            id: `interaction-${Date.now()}`,
            contactId: selectedContact.id,
            type: 'call' as const,
            direction: 'outbound' as const,
            timestamp: activeCall.startTime,
            duration: activeCall.duration,
            subject: 'Outbound call',
            notes: `Call completed. Sentiment: ${analysis.sentiment.overall}. Intent: ${analysis.intent.primary}`,
            outcome: analysis.sentiment.overall as
              | 'positive'
              | 'neutral'
              | 'negative',
            followUpRequired: analysis.performance.callQuality.followUpNeeded,
            agentId: 'agent-001',
            agentName: 'Current User',
            attachments: [],
            sentiment: analysis.sentiment.overall as
              | 'positive'
              | 'neutral'
              | 'negative',
            callAnalysis: {
              transcript: activeCall.transcript.join('\n'),
              keyTopics: analysis.sentiment.keywords,
              actionItems: analysis.actionItems,
              nextSteps: analysis.recommendations,
            },
          };

          enhancedCRMService.addInteraction(interaction);
        } catch (crmError) {
          console.error('Failed to save interaction to CRM:', crmError);
        }
      }
    } catch (error) {
      console.error('Failed to analyze call:', error);
      // Don't throw - let the call end gracefully even if analysis fails
    }
  };

  const selectContact = (contact: any) => {
    setSelectedContact(contact);
    setPhoneNumber(contact.personalInfo.phone);
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCostSavings = () => {
    const comparison = freeSWITCHService.getCostComparison();
    return comparison.savings.percentage.toFixed(1);
  };

  return (
    <div
      style={{
        color: '#ffffff',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h2
          style={{
            fontSize: '20px',
            fontWeight: '600',
            margin: '0 0 8px 0',
            color: 'white',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
          }}
        >
          🚀 Enhanced AI Dialer
        </h2>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '12px',
            marginBottom: '12px',
          }}
        >
          <div
            style={{
              background: 'rgba(34, 197, 94, 0.2)',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              borderRadius: '4px',
              padding: '4px 8px',
              fontSize: '11px',
              color: '#22c55e',
              fontWeight: '600',
            }}
          >
            🟢 FreeSWITCH Connected
          </div>
          <div
            style={{
              background: 'rgba(59, 130, 246, 0.2)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '4px',
              padding: '4px 8px',
              fontSize: '11px',
              color: '#3b82f6',
              fontWeight: '600',
            }}
          >
            💰 {getCostSavings()}% Cost Savings
          </div>
        </div>
      </div>

      {/* Platform Selection */}
      <div style={{ marginBottom: '16px' }}>
        <label
          style={{
            display: 'block',
            fontSize: '12px',
            fontWeight: '600',
            color: 'white',
            marginBottom: '6px',
          }}
        >
          📡 Call Platform
        </label>
        <select
          value={selectedPlatform}
          onChange={(e) => setSelectedPlatform(e.target.value as any)}
          style={{
            width: '100%',
            padding: '8px 12px',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            background: 'rgba(255, 255, 255, 0.1)',
            color: '#ffffff',
            fontSize: '14px',
          }}
        >
          <option value='auto'>🤖 Auto (FreeSWITCH preferred)</option>
          <option value='freeswitch'>🔧 FreeSWITCH (Cost Effective)</option>
          <option value='twilio'>☁️ Twilio (Premium)</option>
        </select>
      </div>

      {/* Contact Selection */}
      <div style={{ marginBottom: '16px' }}>
        <label
          style={{
            display: 'block',
            fontSize: '12px',
            fontWeight: '600',
            color: 'white',
            marginBottom: '6px',
          }}
        >
          👤 Quick Contact Select
        </label>
        <div
          style={{
            maxHeight: '120px',
            overflowY: 'auto',
            background: 'rgba(0, 0, 0, 0.2)',
            borderRadius: '8px',
            padding: '8px',
          }}
        >
          {contacts.slice(0, 5).map((contact) => (
            <div
              key={contact.id}
              onClick={() => selectContact(contact)}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '6px',
                borderRadius: '4px',
                cursor: 'pointer',
                marginBottom: '4px',
                background:
                  selectedContact?.id === contact.id
                    ? 'rgba(59, 130, 246, 0.3)'
                    : 'rgba(255, 255, 255, 0.05)',
                transition: 'background 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (selectedContact?.id !== contact.id) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedContact?.id !== contact.id) {
                  e.currentTarget.style.background =
                    'rgba(255, 255, 255, 0.05)';
                }
              }}
            >
              <div>
                <div style={{ fontSize: '11px', fontWeight: '600' }}>
                  {contact.personalInfo.firstName}{' '}
                  {contact.personalInfo.lastName}
                </div>
                <div style={{ fontSize: '9px', color: '#9ca3af' }}>
                  {contact.companyInfo.companyName} • {contact.type}
                </div>
              </div>
              <div
                style={{
                  fontSize: '9px',
                  color: '#60a5fa',
                  fontFamily: 'monospace',
                }}
              >
                {contact.personalInfo.phone}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Phone Number Input */}
      <div style={{ marginBottom: '14px' }}>
        <label
          style={{
            display: 'block',
            fontSize: '12px',
            fontWeight: '600',
            color: 'white',
            marginBottom: '6px',
          }}
        >
          📞 Phone Number
        </label>
        <input
          type='tel'
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder='Enter phone number'
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            background: 'rgba(255, 255, 255, 0.1)',
            color: '#ffffff',
            fontSize: '14px',
            textAlign: 'center',
            fontFamily: 'monospace',
            fontWeight: '500',
          }}
        />
      </div>

      {/* Active Call Display */}
      {activeCall && (
        <div
          style={{
            background: 'rgba(34, 197, 94, 0.2)',
            border: '1px solid rgba(34, 197, 94, 0.3)',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '16px',
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
            <div>
              <div
                style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#22c55e',
                }}
              >
                📞 {activeCall.status === 'connected' ? 'Connected' : 'Calling'}
              </div>
              <div
                style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.8)' }}
              >
                {activeCall.name || activeCall.number}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div
                style={{
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: '#22c55e',
                }}
              >
                {formatDuration(activeCall.duration)}
              </div>
              <div
                style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.6)' }}
              >
                {activeCall.platform.toUpperCase()}
                {activeCall.recording && ' • 🔴 REC'}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={holdCall}
              style={{
                flex: 1,
                background:
                  activeCall.status === 'on_hold'
                    ? 'rgba(34, 197, 94, 0.3)'
                    : 'rgba(245, 158, 11, 0.2)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                borderRadius: '6px',
                padding: '8px',
                color: activeCall.status === 'on_hold' ? '#22c55e' : '#f59e0b',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              {activeCall.status === 'on_hold' ? '▶️ Resume' : '⏸️ Hold'}
            </button>
            <button
              onClick={hangupCall}
              style={{
                flex: 1,
                background: 'rgba(239, 68, 68, 0.2)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '6px',
                padding: '8px',
                color: '#ef4444',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              📞 Hang Up
            </button>
          </div>
        </div>
      )}

      {/* Call Script Display */}
      {currentScript && activeCall?.status === 'connected' && (
        <div
          style={{
            background: 'rgba(168, 85, 247, 0.2)',
            border: '1px solid rgba(168, 85, 247, 0.3)',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '16px',
          }}
        >
          <div
            style={{
              fontSize: '12px',
              fontWeight: '600',
              color: '#a855f7',
              marginBottom: '8px',
            }}
          >
            📝 {currentScript.name} Script
          </div>
          <div
            style={{
              fontSize: '11px',
              color: 'rgba(255, 255, 255, 0.8)',
              marginBottom: '8px',
            }}
          >
            <strong>Opening:</strong> {currentScript.content.opening}
          </div>
          <div style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.6)' }}>
            <strong>Key Points:</strong>{' '}
            {currentScript.content.keyPoints.join(' • ')}
          </div>
        </div>
      )}

      {/* Real-time Coaching */}
      {realtimeCoaching.length > 0 && activeCall && (
        <div
          style={{
            background: 'rgba(59, 130, 246, 0.2)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '12px',
            padding: '12px',
            marginBottom: '16px',
          }}
        >
          <div
            style={{
              fontSize: '12px',
              fontWeight: '600',
              color: '#3b82f6',
              marginBottom: '8px',
            }}
          >
            🤖 AI Coaching
          </div>
          {realtimeCoaching.map((suggestion, index) => (
            <div
              key={index}
              style={{
                fontSize: '10px',
                color: 'rgba(255, 255, 255, 0.8)',
                marginBottom: '4px',
              }}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}

      {/* Call Button */}
      {!activeCall && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '16px',
          }}
        >
          <button
            onClick={makeCall}
            disabled={!phoneNumber}
            style={{
              background: phoneNumber
                ? 'linear-gradient(135deg, #22c55e, #16a34a)'
                : 'rgba(107, 114, 128, 0.5)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              width: '120px',
              height: '48px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: phoneNumber ? 'pointer' : 'not-allowed',
              opacity: phoneNumber ? 1 : 0.5,
              boxShadow: phoneNumber
                ? '0 4px 12px rgba(34, 197, 94, 0.3)'
                : 'none',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
            onMouseEnter={(e) => {
              if (phoneNumber) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow =
                  '0 6px 16px rgba(34, 197, 94, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              if (phoneNumber) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow =
                  '0 4px 12px rgba(34, 197, 94, 0.3)';
              }
            }}
          >
            <span style={{ fontSize: '18px' }}>📞</span>
            <span>Call</span>
          </button>
        </div>
      )}

      {/* Smart Recommendations */}
      <div
        style={{
          background: 'rgba(0, 0, 0, 0.2)',
          borderRadius: '8px',
          padding: '12px',
          marginBottom: '16px',
        }}
      >
        <div
          style={{
            fontSize: '12px',
            fontWeight: '600',
            marginBottom: '8px',
            color: 'white',
          }}
        >
          🎯 Smart Recommendations
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {recommendations.followUpCalls.slice(0, 2).map((contact) => (
            <div
              key={contact.id}
              onClick={() => selectContact(contact)}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '6px',
                borderRadius: '4px',
                cursor: 'pointer',
                background: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.2)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(245, 158, 11, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(245, 158, 11, 0.1)';
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: '10px',
                    fontWeight: '600',
                    color: '#f59e0b',
                  }}
                >
                  📞 Follow-up: {contact.personalInfo.firstName}{' '}
                  {contact.personalInfo.lastName}
                </div>
                <div
                  style={{ fontSize: '9px', color: 'rgba(255, 255, 255, 0.6)' }}
                >
                  {contact.companyInfo.companyName}
                </div>
              </div>
              <div style={{ fontSize: '8px', color: '#f59e0b' }}>CALL NOW</div>
            </div>
          ))}
        </div>
      </div>

      {/* Daily Stats */}
      <div
        style={{
          background: 'rgba(0, 0, 0, 0.2)',
          borderRadius: '8px',
          padding: '12px',
        }}
      >
        <div
          style={{
            fontSize: '12px',
            fontWeight: '600',
            marginBottom: '8px',
            color: 'white',
          }}
        >
          📊 Today's Performance
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '8px',
            fontSize: '10px',
          }}
        >
          <div>
            <div style={{ color: '#22c55e', fontWeight: '600' }}>
              {dialerStats.callsMadeToday}
            </div>
            <div style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Calls Made</div>
          </div>
          <div>
            <div style={{ color: '#3b82f6', fontWeight: '600' }}>
              {dialerStats.conversionRate}%
            </div>
            <div style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Conversion</div>
          </div>
          <div>
            <div style={{ color: '#f59e0b', fontWeight: '600' }}>
              {formatDuration(dialerStats.averageDuration)}
            </div>
            <div style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
              Avg Duration
            </div>
          </div>
          <div>
            <div style={{ color: '#a855f7', fontWeight: '600' }}>
              ${dialerStats.costSavings.toFixed(2)}
            </div>
            <div style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Cost Saved</div>
          </div>
        </div>
      </div>

      {/* Advanced Features Toggle */}
      <button
        onClick={() => setShowAdvancedFeatures(!showAdvancedFeatures)}
        style={{
          width: '100%',
          background: 'rgba(59, 130, 246, 0.1)',
          border: '1px solid rgba(59, 130, 246, 0.2)',
          borderRadius: '6px',
          padding: '8px',
          color: '#60a5fa',
          fontSize: '11px',
          fontWeight: '600',
          cursor: 'pointer',
          marginTop: '12px',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(59, 130, 246, 0.2)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)';
        }}
      >
        {showAdvancedFeatures ? '🔽' : '🔼'} Advanced Features & Analytics
      </button>

      {showAdvancedFeatures && (
        <div
          style={{
            marginTop: '12px',
            padding: '12px',
            background: 'rgba(0, 0, 0, 0.2)',
            borderRadius: '8px',
            fontSize: '10px',
          }}
        >
          <div
            style={{ marginBottom: '8px', color: 'white', fontWeight: '600' }}
          >
            🚀 Available Features:
          </div>
          <div style={{ color: 'rgba(255, 255, 255, 0.8)', lineHeight: '1.4' }}>
            • Real-time AI call analysis & sentiment detection
            <br />
            • Intelligent call routing & queue management
            <br />
            • Dynamic call scripts & objection handling
            <br />
            • Voice-to-text transcription & coaching
            <br />
            • CRM integration & interaction tracking
            <br />
            • Cost optimization (FreeSWITCH vs Twilio)
            <br />
            • Performance analytics & reporting
            <br />• Multi-agent support & collaboration
          </div>
        </div>
      )}
    </div>
  );
}
