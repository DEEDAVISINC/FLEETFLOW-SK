'use client';

import { Bot, Phone, User } from 'lucide-react';
import { useState } from 'react';

export default function AIVoiceDemoPage() {
  const [callActive, setCallActive] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [conversation, setConversation] = useState<
    Array<{
      id: string;
      sender: 'user' | 'ai';
      message: string;
      timestamp: Date;
      confidence?: number;
      stage?: string;
    }>
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  const [activeSection, setActiveSection] = useState('demo');

  const sections = [
    { id: 'demo', label: 'Voice Demo', icon: '🎙️' },
    { id: 'features', label: 'AI Features', icon: '🤖' },
    { id: 'examples', label: 'Conversation Examples', icon: '💬' },
    { id: 'api', label: 'API Reference', icon: '🔧' },
  ];

  const startCall = () => {
    setCallActive(true);
    setConversation([]);
    // Add initial AI greeting
    setConversation([
      {
        id: '1',
        sender: 'ai',
        message:
          "Hello! This is FleetFlow's AI assistant. How can I help you with your freight needs today?",
        timestamp: new Date(),
        confidence: 0.95,
        stage: 'greeting',
      },
    ]);
  };

  const endCall = () => {
    setCallActive(false);
    setVoiceEnabled(false);
    setUserInput('');
  };

  const sendMessage = async () => {
    if (!userInput.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      sender: 'user' as const,
      message: userInput.trim(),
      timestamp: new Date(),
    };

    setConversation((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setUserInput('');

    try {
      const response = await fetch('/api/ai/voice-conversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          callId: `demo-${Date.now()}`,
          userInput: userMessage.message,
          context: { callType: 'inbound_inquiry' },
        }),
      });

      const data = await response.json();

      const aiMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai' as const,
        message:
          data.response ||
          "I'm here to help with your freight needs. Can you tell me more about what you're looking for?",
        timestamp: new Date(),
        confidence: data.confidence || 0.9,
        stage: data.stage || 'conversation',
      };

      setConversation((prev) => [...prev, aiMessage]);

      // Text-to-speech if voice is enabled
      if (voiceEnabled && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(aiMessage.message);
        utterance.rate = 0.9;
        utterance.pitch = 1;
        window.speechSynthesis.speak(utterance);
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai' as const,
        message:
          "I'm here to help with your freight needs. Can you tell me more about what you're looking for?",
        timestamp: new Date(),
        confidence: 0.8,
        stage: 'fallback',
      };
      setConversation((prev) => [...prev, errorMessage]);
    }

    setIsLoading(false);
  };

  const quickTestMessages = [
    'Hi, this is John from ABC Trucking, MC-123456',
    "I'm looking for loads going to California",
    'What equipment do you need?',
    "I have a 53' dry van available",
    "What's the rate for that load?",
    "That's a bit low, can you do $3,200?",
    "Okay, I'll take it at $3,000",
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'demo':
        return (
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '16px',
              padding: '32px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <h2
              style={{
                color: '#f59e0b',
                fontSize: '24px',
                fontWeight: '700',
                marginBottom: '20px',
              }}
            >
              🎙️ Interactive Voice Demo
            </h2>

            {!callActive ? (
              <div style={{ textAlign: 'center' }}>
                {/* Voice Setup Callout */}
                <div
                  style={{
                    maxWidth: '600px',
                    margin: '0 auto 24px',
                    borderRadius: '12px',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                    background:
                      'linear-gradient(to right, rgba(245, 158, 11, 0.15), rgba(249, 115, 22, 0.15))',
                    padding: '24px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '12px',
                      marginBottom: '16px',
                    }}
                  >
                    <span style={{ fontSize: '2rem' }}>🎙️</span>
                    <div>
                      <h3
                        style={{
                          fontSize: '20px',
                          fontWeight: '700',
                          color: '#fbbf24',
                          margin: '0 0 4px 0',
                        }}
                      >
                        Ultra-Realistic Voice Experience
                      </h3>
                      <p
                        style={{
                          fontSize: '14px',
                          color: 'rgba(251, 191, 36, 0.8)',
                          margin: '0',
                        }}
                      >
                        Powered by ElevenLabs AI - sounds completely human to
                        carriers!
                      </p>
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(180px, 1fr))',
                      gap: '16px',
                      fontSize: '14px',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        color: 'rgba(255, 255, 255, 0.9)',
                      }}
                    >
                      <span style={{ color: '#22c55e' }}>✅</span>
                      <span>Professional freight broker voice</span>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        color: 'rgba(255, 255, 255, 0.9)',
                      }}
                    >
                      <span style={{ color: '#22c55e' }}>✅</span>
                      <span>Natural conversation flow</span>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        color: 'rgba(255, 255, 255, 0.9)',
                      }}
                    >
                      <span style={{ color: '#22c55e' }}>✅</span>
                      <span>Real-time FMCSA verification</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={startCall}
                  style={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '16px',
                    borderRadius: '16px',
                    border: '2px solid rgba(34, 197, 94, 0.4)',
                    background:
                      'linear-gradient(to right, rgba(34, 197, 94, 0.2), rgba(59, 130, 246, 0.2), rgba(139, 92, 246, 0.2))',
                    padding: '24px 48px',
                    fontSize: '20px',
                    fontWeight: '700',
                    color: 'white',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    margin: '0 auto',
                  }}
                >
                  <Phone style={{ width: '32px', height: '32px' }} />
                  <span>🚀 Start AI Voice Demo</span>
                </button>

                <p
                  style={{
                    marginTop: '16px',
                    color: 'rgba(255, 255, 255, 0.7)',
                    textAlign: 'center',
                  }}
                >
                  Experience CoDriver-level AI that carriers can't tell is
                  artificial
                </p>
              </div>
            ) : (
              <div>
                {/* Active Call Interface */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '16px',
                    marginBottom: '24px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      borderRadius: '8px',
                      border: '1px solid rgba(34, 197, 94, 0.4)',
                      background: 'rgba(34, 197, 94, 0.2)',
                      padding: '12px 24px',
                    }}
                  >
                    <div
                      style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        background: '#22c55e',
                        animation: 'pulse 2s infinite',
                      }}
                    />
                    <span style={{ fontWeight: '600', color: '#22c55e' }}>
                      🔥 Call Active
                    </span>
                  </div>
                </div>

                {/* Voice Status */}
                {voiceEnabled ? (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      borderRadius: '50px',
                      border: '1px solid rgba(34, 197, 94, 0.3)',
                      background: 'rgba(34, 197, 94, 0.2)',
                      padding: '8px 16px',
                      marginBottom: '16px',
                    }}
                  >
                    <span style={{ animation: 'pulse 2s infinite' }}>🎙️</span>
                    <span
                      style={{
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#22c55e',
                      }}
                    >
                      Ultra-realistic voice enabled - Listen as you type!
                    </span>
                  </div>
                ) : (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      borderRadius: '50px',
                      border: '1px solid rgba(245, 158, 11, 0.3)',
                      background: 'rgba(245, 158, 11, 0.2)',
                      padding: '8px 16px',
                      marginBottom: '16px',
                    }}
                  >
                    <span>💡</span>
                    <span
                      style={{
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#f59e0b',
                      }}
                    >
                      Click "Voice OFF" in sidebar to hear the AI speak!
                    </span>
                  </div>
                )}

                {/* Conversation Display */}
                <div
                  style={{
                    maxHeight: '400px',
                    overflowY: 'auto',
                    marginBottom: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '16px',
                    background: 'rgba(255, 255, 255, 0.02)',
                  }}
                >
                  {conversation.map((msg) => (
                    <div
                      key={msg.id}
                      style={{
                        display: 'flex',
                        gap: '12px',
                        marginBottom: '16px',
                        alignItems: 'flex-start',
                      }}
                    >
                      <div
                        style={{
                          borderRadius: '50%',
                          border: `1px solid ${msg.sender === 'ai' ? 'rgba(59, 130, 246, 0.3)' : 'rgba(34, 197, 94, 0.3)'}`,
                          background: `${msg.sender === 'ai' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(34, 197, 94, 0.2)'}`,
                          padding: '8px',
                        }}
                      >
                        {msg.sender === 'ai' ? (
                          <Bot
                            style={{
                              width: '16px',
                              height: '16px',
                              color: '#3b82f6',
                            }}
                          />
                        ) : (
                          <User
                            style={{
                              width: '16px',
                              height: '16px',
                              color: '#22c55e',
                            }}
                          />
                        )}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            borderRadius: '12px',
                            border: `1px solid ${msg.sender === 'ai' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(34, 197, 94, 0.2)'}`,
                            background: `${msg.sender === 'ai' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(34, 197, 94, 0.1)'}`,
                            padding: '12px',
                          }}
                        >
                          <div
                            style={{
                              fontWeight: '600',
                              color:
                                msg.sender === 'ai' ? '#3b82f6' : '#22c55e',
                              marginBottom: '4px',
                              fontSize: '14px',
                            }}
                          >
                            {msg.sender === 'ai'
                              ? '🤖 Your AI Assistant:'
                              : '📞 Carrier:'}
                          </div>
                          <div style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                            {msg.message}
                          </div>
                          {msg.confidence && (
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                marginTop: '8px',
                              }}
                            >
                              <span
                                style={{
                                  borderRadius: '50px',
                                  background: '#22c55e',
                                  padding: '2px 8px',
                                  fontSize: '12px',
                                  fontWeight: '700',
                                  color: 'white',
                                }}
                              >
                                {Math.round(msg.confidence * 100)}% confidence
                              </span>
                              <span
                                style={{
                                  fontSize: '12px',
                                  color: '#3b82f6',
                                }}
                              >
                                🎙️ Spoken in realistic voice
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div
                      style={{
                        textAlign: 'center',
                        color: 'rgba(255, 255, 255, 0.7)',
                      }}
                    >
                      <div>🤖 AI is thinking...</div>
                    </div>
                  )}
                </div>

                {/* Input Section */}
                <div
                  style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}
                >
                  <input
                    type='text'
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder='Type your message as a carrier...'
                    style={{
                      flex: 1,
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      background: 'rgba(255, 255, 255, 0.05)',
                      color: 'white',
                      fontSize: '14px',
                    }}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!userInput.trim() || isLoading}
                    style={{
                      padding: '12px 24px',
                      borderRadius: '8px',
                      border: 'none',
                      background: userInput.trim()
                        ? 'rgba(34, 197, 94, 0.3)'
                        : 'rgba(255, 255, 255, 0.1)',
                      color: userInput.trim()
                        ? '#22c55e'
                        : 'rgba(255, 255, 255, 0.5)',
                      fontWeight: '600',
                      cursor: userInput.trim() ? 'pointer' : 'not-allowed',
                    }}
                  >
                    Send
                  </button>
                </div>

                {/* Quick Test Messages */}
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '12px',
                    }}
                  >
                    <span style={{ fontSize: '18px' }}>⚡</span>
                    <h4
                      style={{
                        fontWeight: '600',
                        color: 'white',
                        margin: '0',
                        fontSize: '16px',
                      }}
                    >
                      Quick Test Messages
                    </h4>
                    <div
                      style={{
                        height: '1px',
                        background: 'rgba(255, 255, 255, 0.2)',
                        flex: 1,
                      }}
                    />
                  </div>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(250px, 1fr))',
                      gap: '12px',
                    }}
                  >
                    {quickTestMessages.map((msg, index) => (
                      <button
                        key={index}
                        onClick={() => setUserInput(msg)}
                        style={{
                          position: 'relative',
                          borderRadius: '8px',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          background:
                            'linear-gradient(to right, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.1))',
                          padding: '12px',
                          textAlign: 'left',
                          fontSize: '14px',
                          color: 'rgba(255, 255, 255, 0.8)',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '8px',
                          }}
                        >
                          <span
                            style={{
                              borderRadius: '50px',
                              background: 'rgba(59, 130, 246, 0.2)',
                              padding: '2px 8px',
                              fontSize: '12px',
                              fontWeight: '700',
                              color: '#3b82f6',
                            }}
                          >
                            {index + 1}
                          </span>
                          <span>"{msg}"</span>
                        </div>
                      </button>
                    ))}
                  </div>
                  <p
                    style={{
                      marginTop: '8px',
                      textAlign: 'center',
                      fontSize: '12px',
                      color: 'rgba(255, 255, 255, 0.5)',
                    }}
                  >
                    💡 Click any message above to auto-fill and test different
                    conversation flows
                  </p>
                </div>
              </div>
            )}
          </div>
        );

      case 'features':
        return (
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '16px',
              padding: '32px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <h2
              style={{
                color: '#f59e0b',
                fontSize: '24px',
                fontWeight: '700',
                marginBottom: '20px',
              }}
            >
              🤖 AI Features & Capabilities
            </h2>

            <div style={{ display: 'grid', gap: '24px' }}>
              <div
                style={{
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  borderRadius: '12px',
                  background: 'rgba(34, 197, 94, 0.1)',
                  padding: '20px',
                }}
              >
                <h3
                  style={{
                    color: '#22c55e',
                    marginBottom: '12px',
                    fontSize: '18px',
                    fontWeight: '600',
                  }}
                >
                  🎙️ Voice Intelligence
                </h3>
                <p
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    lineHeight: '1.6',
                    marginBottom: '16px',
                  }}
                >
                  The ElevenLabs integration makes your AI sound so realistic
                  that carriers think they're talking to a real person from your
                  company!
                </p>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '8px',
                    fontSize: '14px',
                  }}
                >
                  <div style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    ✅ Real-time MC verification
                  </div>
                  <div style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    ✅ Load matching intelligence
                  </div>
                  <div style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    ✅ Professional voice synthesis
                  </div>
                  <div style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    ✅ Natural conversation flow
                  </div>
                </div>
              </div>

              <div
                style={{
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '12px',
                  background: 'rgba(59, 130, 246, 0.1)',
                  padding: '20px',
                }}
              >
                <h3
                  style={{
                    color: '#3b82f6',
                    marginBottom: '12px',
                    fontSize: '18px',
                    fontWeight: '600',
                  }}
                >
                  🧠 Freight Industry Expertise
                </h3>
                <p
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    lineHeight: '1.6',
                    marginBottom: '16px',
                  }}
                >
                  Built specifically for freight and logistics, with deep
                  understanding of industry terminology, regulations, and
                  processes.
                </p>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '8px',
                    fontSize: '14px',
                  }}
                >
                  <div style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    ✅ FMCSA compliance checking
                  </div>
                  <div style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    ✅ Equipment type recognition
                  </div>
                  <div style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    ✅ Route optimization
                  </div>
                  <div style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    ✅ Rate negotiation
                  </div>
                </div>
              </div>

              <div
                style={{
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  borderRadius: '12px',
                  background: 'rgba(139, 92, 246, 0.1)',
                  padding: '20px',
                }}
              >
                <h3
                  style={{
                    color: '#8b5cf6',
                    marginBottom: '12px',
                    fontSize: '18px',
                    fontWeight: '600',
                  }}
                >
                  ⚡ Performance & Automation
                </h3>
                <p
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    lineHeight: '1.6',
                    marginBottom: '16px',
                  }}
                >
                  90%+ automation rates with 24/7 availability, handling
                  multiple calls simultaneously with consistent quality.
                </p>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '8px',
                    fontSize: '14px',
                  }}
                >
                  <div style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    ✅ 24/7 availability
                  </div>
                  <div style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    ✅ Multi-call handling
                  </div>
                  <div style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    ✅ Consistent quality
                  </div>
                  <div style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    ✅ Instant scaling
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'examples':
        return (
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '16px',
              padding: '32px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <h2
              style={{
                color: '#f59e0b',
                fontSize: '24px',
                fontWeight: '700',
                marginBottom: '20px',
              }}
            >
              💬 Live Conversation Example
            </h2>

            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
            >
              {/* Conversation Message 1 */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                }}
              >
                <div
                  style={{
                    borderRadius: '50%',
                    border: '1px solid rgba(34, 197, 94, 0.3)',
                    background: 'rgba(34, 197, 94, 0.2)',
                    padding: '8px',
                  }}
                >
                  <User
                    style={{ width: '16px', height: '16px', color: '#22c55e' }}
                  />
                </div>
                <div
                  style={{
                    flex: 1,
                    borderRadius: '12px',
                    border: '1px solid rgba(34, 197, 94, 0.2)',
                    background: 'rgba(34, 197, 94, 0.1)',
                    padding: '12px',
                  }}
                >
                  <div
                    style={{
                      fontWeight: '600',
                      color: '#22c55e',
                      marginBottom: '4px',
                      fontSize: '14px',
                    }}
                  >
                    📞 Carrier:
                  </div>
                  <div style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                    "Hi, this is John from ABC Trucking, MC-123456"
                  </div>
                </div>
              </div>

              {/* AI Response 1 */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                }}
              >
                <div
                  style={{
                    borderRadius: '50%',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    background: 'rgba(59, 130, 246, 0.2)',
                    padding: '8px',
                  }}
                >
                  <Bot
                    style={{ width: '16px', height: '16px', color: '#3b82f6' }}
                  />
                </div>
                <div
                  style={{
                    flex: 1,
                    borderRadius: '12px',
                    border: '1px solid rgba(59, 130, 246, 0.2)',
                    background: 'rgba(59, 130, 246, 0.1)',
                    padding: '12px',
                  }}
                >
                  <div
                    style={{
                      fontWeight: '600',
                      color: '#3b82f6',
                      marginBottom: '4px',
                      fontSize: '14px',
                    }}
                  >
                    🤖 Your AI Assistant:
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.9)',
                      marginBottom: '8px',
                    }}
                  >
                    "Hello John! Let me verify MC-123456... Great! Your
                    authority is active and insurance is current. What equipment
                    do you run?"
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <span
                      style={{
                        borderRadius: '50px',
                        background: '#22c55e',
                        padding: '2px 8px',
                        fontSize: '12px',
                        fontWeight: '700',
                        color: 'white',
                      }}
                    >
                      95% confidence
                    </span>
                    <span style={{ fontSize: '12px', color: '#3b82f6' }}>
                      🎙️ Spoken in realistic voice
                    </span>
                  </div>
                </div>
              </div>

              {/* Conversation Message 2 */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                }}
              >
                <div
                  style={{
                    borderRadius: '50%',
                    border: '1px solid rgba(34, 197, 94, 0.3)',
                    background: 'rgba(34, 197, 94, 0.2)',
                    padding: '8px',
                  }}
                >
                  <User
                    style={{ width: '16px', height: '16px', color: '#22c55e' }}
                  />
                </div>
                <div
                  style={{
                    flex: 1,
                    borderRadius: '12px',
                    border: '1px solid rgba(34, 197, 94, 0.2)',
                    background: 'rgba(34, 197, 94, 0.1)',
                    padding: '12px',
                  }}
                >
                  <div
                    style={{
                      fontWeight: '600',
                      color: '#22c55e',
                      marginBottom: '4px',
                      fontSize: '14px',
                    }}
                  >
                    📞 Carrier:
                  </div>
                  <div style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                    "Dry van, looking for loads going west from Chicago"
                  </div>
                </div>
              </div>

              {/* AI Response 2 */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                }}
              >
                <div
                  style={{
                    borderRadius: '50%',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    background: 'rgba(59, 130, 246, 0.2)',
                    padding: '8px',
                  }}
                >
                  <Bot
                    style={{ width: '16px', height: '16px', color: '#3b82f6' }}
                  />
                </div>
                <div
                  style={{
                    flex: 1,
                    borderRadius: '12px',
                    border: '1px solid rgba(59, 130, 246, 0.2)',
                    background: 'rgba(59, 130, 246, 0.1)',
                    padding: '12px',
                  }}
                >
                  <div
                    style={{
                      fontWeight: '600',
                      color: '#3b82f6',
                      marginBottom: '4px',
                      fontSize: '14px',
                    }}
                  >
                    🤖 Your AI Assistant:
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.9)',
                      marginBottom: '8px',
                    }}
                  >
                    "Perfect! I have electronics loads Chicago to LA, 45,000
                    lbs, $2,850 all-in. Pickup tomorrow, delivery in 2 days.
                    Interested?"
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <span
                      style={{
                        borderRadius: '50px',
                        background: '#22c55e',
                        padding: '2px 8px',
                        fontSize: '12px',
                        fontWeight: '700',
                        color: 'white',
                      }}
                    >
                      92% confidence
                    </span>
                    <span style={{ fontSize: '12px', color: '#3b82f6' }}>
                      🎙️ Load details spoken naturally
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'api':
        return (
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '16px',
              padding: '32px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <h2
              style={{
                color: '#f59e0b',
                fontSize: '24px',
                fontWeight: '700',
                marginBottom: '20px',
              }}
            >
              🔧 API Reference
            </h2>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '16px',
              }}
            >
              <div
                style={{
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  padding: '16px',
                }}
              >
                <div
                  style={{
                    fontWeight: '500',
                    color: '#3b82f6',
                    marginBottom: '8px',
                    fontSize: '16px',
                  }}
                >
                  Voice Conversation
                </div>
                <div
                  style={{
                    fontFamily: 'monospace',
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '14px',
                    marginBottom: '4px',
                  }}
                >
                  POST /api/ai/voice-conversation
                </div>
                <div
                  style={{
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.5)',
                  }}
                >
                  Process carrier conversations
                </div>
              </div>

              <div
                style={{
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  padding: '16px',
                }}
              >
                <div
                  style={{
                    fontWeight: '500',
                    color: '#22c55e',
                    marginBottom: '8px',
                    fontSize: '16px',
                  }}
                >
                  Active Sessions
                </div>
                <div
                  style={{
                    fontFamily: 'monospace',
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '14px',
                    marginBottom: '4px',
                  }}
                >
                  GET /api/ai/voice-conversation/sessions
                </div>
                <div
                  style={{
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.5)',
                  }}
                >
                  Monitor active calls
                </div>
              </div>

              <div
                style={{
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  padding: '16px',
                }}
              >
                <div
                  style={{
                    fontWeight: '500',
                    color: '#8b5cf6',
                    marginBottom: '8px',
                    fontSize: '16px',
                  }}
                >
                  Call Metrics
                </div>
                <div
                  style={{
                    fontFamily: 'monospace',
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '14px',
                    marginBottom: '4px',
                  }}
                >
                  GET /api/ai/call-center/metrics
                </div>
                <div
                  style={{
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.5)',
                  }}
                >
                  Performance analytics
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          'linear-gradient(135deg, #1e293b 0%, #334155 50%, #1e293b 100%)',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Hero Header */}
      <div
        style={{
          textAlign: 'center',
          padding: '80px 20px 60px',
          background: 'rgba(255,255,255,0.02)',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <h1
          style={{
            fontSize: '4rem',
            fontWeight: '900',
            background:
              'linear-gradient(135deg, #3b82f6 0%, #10b981 50%, #f59e0b 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '24px',
            letterSpacing: '-0.02em',
          }}
        >
          🎙️ AI Voice Intelligence
        </h1>
        <p
          style={{
            fontSize: '1.3rem',
            color: 'rgba(255,255,255,0.8)',
            maxWidth: '800px',
            margin: '0 auto 32px',
            lineHeight: '1.6',
          }}
        >
          Experience ultra-realistic freight AI conversations powered by
          advanced voice intelligence and natural language processing for any
          transportation company.
        </p>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '24px',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div
              style={{ fontSize: '2rem', fontWeight: '800', color: '#10b981' }}
            >
              90%+
            </div>
            <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)' }}>
              Automation Rate
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div
              style={{ fontSize: '2rem', fontWeight: '800', color: '#f59e0b' }}
            >
              100%
            </div>
            <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)' }}>
              Human-Like Voice
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div
              style={{ fontSize: '2rem', fontWeight: '800', color: '#8b5cf6' }}
            >
              24/7
            </div>
            <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)' }}>
              Availability
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '40px 24px',
        }}
      >
        {/* Navigation Sidebar */}
        <div
          style={{
            width: '320px',
            marginRight: '40px',
            position: 'sticky',
            top: '40px',
            height: 'fit-content',
          }}
        >
          <nav
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              marginBottom: '24px',
            }}
          >
            <h3
              style={{
                color: '#14b8a6',
                fontSize: '18px',
                margin: '0 0 20px 0',
                fontWeight: '600',
              }}
            >
              🎙️ Voice Demo Sections
            </h3>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
            >
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    background:
                      activeSection === section.id
                        ? 'rgba(20, 184, 166, 0.3)'
                        : 'rgba(255, 255, 255, 0.05)',
                    color:
                      activeSection === section.id
                        ? '#14b8a6'
                        : 'rgba(255, 255, 255, 0.7)',
                    fontSize: '14px',
                    fontWeight: activeSection === section.id ? '600' : '400',
                    cursor: 'pointer',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.2s',
                  }}
                >
                  <span>{section.icon}</span>
                  {section.label}
                </button>
              ))}
            </div>
          </nav>

          {/* Demo Controls */}
          <nav
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <h3
              style={{
                color: '#14b8a6',
                fontSize: '18px',
                margin: '0 0 20px 0',
                fontWeight: '600',
              }}
            >
              🎮 Demo Controls
            </h3>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
            >
              <button
                style={{
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  background: callActive
                    ? 'rgba(34, 197, 94, 0.2)'
                    : 'rgba(59, 130, 246, 0.2)',
                  color: callActive ? '#22c55e' : '#3b82f6',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s',
                }}
                onClick={callActive ? endCall : startCall}
              >
                <span>{callActive ? '🔴' : '🎙️'}</span>
                {callActive ? 'End Call Demo' : 'Start Voice Demo'}
              </button>

              {callActive && (
                <button
                  style={{
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    background: voiceEnabled
                      ? 'rgba(34, 197, 94, 0.2)'
                      : 'rgba(245, 158, 11, 0.2)',
                    color: voiceEnabled ? '#22c55e' : '#f59e0b',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.2s',
                  }}
                  onClick={() => setVoiceEnabled(!voiceEnabled)}
                >
                  <span>🔊</span>
                  Voice {voiceEnabled ? 'ON' : 'OFF'}
                </button>
              )}
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1 }}>{renderContent()}</div>
      </div>
    </div>
  );
}
