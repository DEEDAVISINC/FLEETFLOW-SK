'use client';

import { useState } from 'react';
import { useSalesCopilot } from '../hooks/useSalesCopilot';

export default function SpeechRecognitionTest() {
  const [callId] = useState('test-call-' + Date.now());
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState<any[]>([]);

  const {
    startRealTimeSpeechRecognition,
    stopRealTimeSpeechRecognition,
    getTranscriptionHistory,
    getRealTalkToListenRatio,
  } = useSalesCopilot('test-agent');

  const handleStartRecording = async () => {
    const success = await startRealTimeSpeechRecognition(callId, {
      language: 'en-US',
      continuous: true,
      interimResults: true,
    });

    if (success) {
      setIsRecording(true);
      console.info('🎤 Speech recognition started');
    } else {
      alert('Speech recognition not supported or failed to start');
    }
  };

  const handleStopRecording = () => {
    stopRealTimeSpeechRecognition(callId);
    setIsRecording(false);
    console.info('🎤 Speech recognition stopped');
  };

  const handleGetTranscription = () => {
    const history = getTranscriptionHistory(callId);
    setTranscription(history);
  };

  const handleGetRatio = () => {
    const ratio = getRealTalkToListenRatio(callId);
    alert(`Talk-to-Listen Ratio: ${ratio}%`);
  };

  return (
    <div
      style={{
        padding: '20px',
        background:
          'linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.9))',
        border: '1px solid rgba(59, 130, 246, 0.2)',
        borderRadius: '16px',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
        margin: '20px',
      }}
    >
      <h3
        style={{
          color: 'white',
          fontSize: '1.4rem',
          fontWeight: '700',
          marginBottom: '20px',
          textAlign: 'center',
        }}
      >
        🎤 Speech Recognition Test
      </h3>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button
          onClick={isRecording ? handleStopRecording : handleStartRecording}
          style={{
            padding: '10px 20px',
            background: isRecording
              ? 'linear-gradient(135deg, #ef4444, #dc2626)'
              : 'linear-gradient(135deg, #22c55e, #16a34a)',
            border: 'none',
            borderRadius: '8px',
            color: 'white',
            fontWeight: '600',
            cursor: 'pointer',
            flex: 1,
          }}
        >
          {isRecording ? '⏹️ Stop Recording' : '🎤 Start Recording'}
        </button>

        <button
          onClick={handleGetTranscription}
          style={{
            padding: '10px 20px',
            background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
            border: 'none',
            borderRadius: '8px',
            color: 'white',
            fontWeight: '600',
            cursor: 'pointer',
            flex: 1,
          }}
        >
          📝 Get Transcription
        </button>

        <button
          onClick={handleGetRatio}
          style={{
            padding: '10px 20px',
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            border: 'none',
            borderRadius: '8px',
            color: 'white',
            fontWeight: '600',
            cursor: 'pointer',
            flex: 1,
          }}
        >
          ⚖️ Get Ratio
        </button>
      </div>

      <div
        style={{
          background: 'rgba(0, 0, 0, 0.2)',
          borderRadius: '8px',
          padding: '15px',
          maxHeight: '300px',
          overflowY: 'auto',
        }}
      >
        <h4 style={{ color: 'white', marginBottom: '10px' }}>
          Transcription History:
        </h4>
        {transcription.length === 0 ? (
          <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontStyle: 'italic' }}>
            No transcription data yet. Start recording and speak to see results.
          </p>
        ) : (
          transcription.map((item, index) => (
            <div
              key={index}
              style={{
                background:
                  item.speaker === 'prospect'
                    ? 'rgba(59, 130, 246, 0.2)'
                    : 'rgba(34, 197, 94, 0.2)',
                padding: '8px 12px',
                borderRadius: '6px',
                marginBottom: '8px',
                fontSize: '0.9rem',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '4px',
                }}
              >
                <span
                  style={{
                    fontWeight: '600',
                    color: item.speaker === 'prospect' ? '#3b82f6' : '#22c55e',
                  }}
                >
                  {item.speaker === 'prospect' ? '👤 Prospect' : '🎯 Agent'}
                </span>
                <span
                  style={{
                    fontSize: '0.7rem',
                    color: 'rgba(255, 255, 255, 0.6)',
                  }}
                >
                  {item.confidence
                    ? `${Math.round(item.confidence * 100)}%`
                    : ''}
                </span>
              </div>
              <div style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                {item.text}
              </div>
            </div>
          ))
        )}
      </div>

      <div
        style={{
          marginTop: '20px',
          padding: '15px',
          background: 'rgba(147, 51, 234, 0.1)',
          border: '1px solid rgba(147, 51, 234, 0.2)',
          borderRadius: '8px',
        }}
      >
        <h5 style={{ color: 'white', marginBottom: '10px' }}>
          Test Instructions:
        </h5>
        <ul
          style={{
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: '0.9rem',
            lineHeight: '1.5',
          }}
        >
          <li>• Click "Start Recording" to begin speech recognition</li>
          <li>• Speak clearly into your microphone</li>
          <li>• Click "Get Transcription" to see the captured speech</li>
          <li>• Click "Get Ratio" to see talk-to-listen analysis</li>
          <li>
            • Try saying objection words like "expensive", "cost", "budget"
          </li>
          <li>
            • The system will automatically detect objections and opportunities
          </li>
        </ul>
      </div>
    </div>
  );
}



