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
  } = useSalesCopilot(agentId);

  const [prospectMessage, setProspectMessage] = useState('');
  const [agentResponse, setAgentResponse] = useState('');
  const [isCallActive, setIsCallActive] = useState(false);

  // Auto-start guidance when call becomes active
  useEffect(() => {
    if (
      currentCallId &&
      !isCallActive &&
      callContext?.callId !== currentCallId
    ) {
      startCallGuidance(currentCallId);
      setIsCallActive(true);
    } else if (!currentCallId && isCallActive) {
      if (callContext?.callId) {
        endCallGuidance(callContext.callId, 'follow_up');
      }
      setIsCallActive(false);
    }
  }, [
    currentCallId,
    isCallActive,
    callContext,
    startCallGuidance,
    endCallGuidance,
  ]);

  const handleProcessConversation = async () => {
    if (!currentCallId || !prospectMessage.trim() || !agentResponse.trim())
      return;

    await processConversation(currentCallId, agentResponse, prospectMessage);
    setProspectMessage('');
    setAgentResponse('');
  };

  const getGuidanceColor = (guidance: SalesGuidance) => {
    switch (guidance.urgency) {
      case 'immediate':
        return 'bg-red-50 border-red-200';
      case 'high':
        return 'bg-orange-50 border-orange-200';
      case 'normal':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getGuidanceIcon = (type: SalesGuidance['type']) => {
    switch (type) {
      case 'question':
        return '❓';
      case 'objection_response':
        return '🛡️';
      case 'faq_answer':
        return '💡';
      case 'closing_script':
        return '🎯';
      case 'negotiation_tactic':
        return '⚖️';
      default:
        return '💭';
    }
  };

  return (
    <div className={`rounded-lg border bg-white shadow-sm ${className}`}>
      {/* Header */}
      <div className='border-b border-gray-200 px-4 py-3'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-2'>
            <div
              className={`h-2 w-2 rounded-full ${
                isConnected ? 'bg-green-500' : 'bg-red-500'
              }`}
            />
            <h3 className='text-lg font-semibold text-gray-900'>
              Sales Copilot AI
            </h3>
          </div>
          <div className='text-sm text-gray-500'>{connectionStatus}</div>
        </div>

        {/* Call Context */}
        {callContext && (
          <div className='mt-2 rounded bg-gray-50 p-2 text-sm'>
            <div className='flex items-center justify-between'>
              <span>
                <strong>Stage:</strong> {callContext.conversationStage}
              </span>
              <span>
                <strong>Confidence:</strong>{' '}
                {Math.round(callContext.confidenceScore * 100)}%
              </span>
            </div>
            {callContext.prospectInfo?.name && (
              <div className='mt-1'>
                <strong>Prospect:</strong> {callContext.prospectInfo.name}
                {callContext.prospectInfo.company &&
                  ` (${callContext.prospectInfo.company})`}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Current Guidance */}
      <div className='max-h-96 overflow-y-auto px-4 py-3'>
        {currentGuidance.length === 0 ? (
          <div className='py-8 text-center text-gray-500'>
            <div className='mb-2 text-2xl'>🎯</div>
            <p>No active guidance</p>
            <p className='text-sm'>Guidance will appear here during calls</p>
          </div>
        ) : (
          <div className='space-y-3'>
            {currentGuidance.map((guidance) => (
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
                              .map((alt, idx) => (
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

      {/* Conversation Input (for testing/development) */}
      {process.env.NODE_ENV === 'development' && callContext && (
        <div className='border-t border-gray-200 bg-gray-50 px-4 py-3'>
          <div className='mb-2 text-sm font-medium text-gray-700'>
            Process Conversation (Dev Mode)
          </div>
          <div className='space-y-2'>
            <input
              type='text'
              placeholder='What did the prospect say?'
              value={prospectMessage}
              onChange={(e) => setProspectMessage(e.target.value)}
              className='w-full rounded border border-gray-300 px-3 py-2 text-sm'
            />
            <input
              type='text'
              placeholder='What did you say?'
              value={agentResponse}
              onChange={(e) => setAgentResponse(e.target.value)}
              className='w-full rounded border border-gray-300 px-3 py-2 text-sm'
            />
            <button
              onClick={handleProcessConversation}
              disabled={
                !prospectMessage.trim() || !agentResponse.trim() || isProcessing
              }
              className='w-full rounded bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:bg-gray-400'
            >
              {isProcessing ? 'Processing...' : 'Process Conversation'}
            </button>
          </div>
        </div>
      )}

      {/* Loading indicator */}
      {isProcessing && (
        <div className='border-t border-blue-200 bg-blue-50 px-4 py-2'>
          <div className='flex items-center space-x-2'>
            <div className='h-4 w-4 animate-spin rounded-full border-b-2 border-blue-600'></div>
            <span className='text-sm text-blue-700'>
              Analyzing conversation...
            </span>
          </div>
        </div>
      )}
    </div>
  );
}


