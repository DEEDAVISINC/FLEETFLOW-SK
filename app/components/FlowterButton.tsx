'use client';

import React, { useEffect, useRef, useState } from 'react';
import { getCurrentUser } from '../config/access';
import {
  EnhancedFlowterAI,
  FlowterMessage,
  FlowterResponse,
} from '../services/EnhancedFlowterAI';

interface UnifiedFlowterAIProps {
  hasNewSuggestions?: boolean;
  userTier?: string;
  userRole?: string;
}

const UnifiedFlowterAI: React.FC<UnifiedFlowterAIProps> = ({
  hasNewSuggestions = false,
  userTier = 'basic',
  userRole = 'employee',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showHelperPulse, setShowHelperPulse] = useState(false);
  const [messages, setMessages] = useState<FlowterMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentResponse, setCurrentResponse] =
    useState<FlowterResponse | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const flowterAI = useRef(new EnhancedFlowterAI());

  // Helper pulse animation to draw attention
  useEffect(() => {
    const interval = setInterval(() => {
      setShowHelperPulse((prev) => !prev);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Initialize with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const { user } = getCurrentUser();
      const welcomeMessage: FlowterMessage = {
        role: 'assistant',
        content: `👋 Hi ${user.name}! I'm your AI assistant for FleetFlow. I can help you navigate features, provide guidance, and optimize your workflow.`,
        timestamp: new Date().toLocaleTimeString(),
        type: 'welcome',
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, messages.length]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, currentResponse]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const getRoleWelcomeMessage = (role: string) => {
    switch (role) {
      case 'dispatcher':
        return '🚛 Dispatcher Support';
      case 'broker':
        return '🚛 Broker Support';
      case 'driver':
        return '🚚 Driver Support';
      default:
        return '👔 Team Support';
    }
  };

  const getTierMessage = (tier: string) => {
    switch (tier) {
      case 'enterprise':
        return '🌟 Enterprise AI Assistant';
      case 'professional':
        return '⭐ Professional AI Assistant';
      case 'university':
        return '🎓 Educational AI Assistant';
      default:
        return '🚀 AI Assistant - Upgrade for more!';
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage: FlowterMessage = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    setCurrentResponse(null);

    try {
      const response = await flowterAI.current.handleUserQuery(input.trim());
      const assistantMessage: FlowterMessage = {
        role: 'assistant',
        content: response.message,
        timestamp: new Date().toLocaleTimeString(),
        type: response.type,
        actions: response.actions,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setCurrentResponse(response);
    } catch (error) {
      const errorMessage: FlowterMessage = {
        role: 'assistant',
        content:
          'I apologize, but I encountered an issue processing your request. Please try again.',
        timestamp: new Date().toLocaleTimeString(),
        type: 'error',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleNavigation = (url: string) => {
    console.info(`🔗 Navigating to: ${url}`);
    setIsOpen(false);
  };

  const renderMessage = (message: FlowterMessage, index: number) => {
    const isUser = message.role === 'user';

    return (
      <div
        key={index}
        style={{
          background: isUser
            ? 'rgba(217, 70, 239, 0.1)'
            : 'rgba(255, 255, 255, 0.9)',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '12px',
          border: isUser
            ? '1px solid rgba(217, 70, 239, 0.2)'
            : '1px solid rgba(229, 231, 235, 0.8)',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '12px',
          }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: isUser
                ? 'linear-gradient(135deg, #d946ef, #8b5cf6)'
                : 'linear-gradient(135deg, #10b981, #059669)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              color: 'white',
              flexShrink: 0,
            }}
          >
            {isUser ? '👤' : '🤖'}
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: '14px',
                fontWeight: '600',
                color: isUser ? '#d946ef' : '#059669',
                marginBottom: '2px',
              }}
            >
              {isUser ? 'You' : 'Flowter AI'}
            </div>
            <div
              style={{
                fontSize: '12px',
                color: 'rgba(0, 0, 0, 0.5)',
              }}
            >
              {message.timestamp}
            </div>
          </div>
        </div>

        <div
          style={{
            fontSize: '14px',
            lineHeight: '1.5',
            color: isUser ? '#1f2937' : '#374151',
            whiteSpace: 'pre-wrap',
            marginBottom:
              message.actions && message.actions.length > 0 ? '16px' : '0',
          }}
        >
          {message.content}
        </div>

        {message.actions && message.actions.length > 0 && (
          <div
            style={{
              display: 'grid',
              gap: '8px',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            }}
          >
            {message.actions.map((action, actionIndex) => (
              <button
                key={actionIndex}
                style={{
                  background: isUser
                    ? 'rgba(217, 70, 239, 0.1)'
                    : 'rgba(16, 185, 129, 0.1)',
                  border: isUser
                    ? '1px solid rgba(217, 70, 239, 0.2)'
                    : '1px solid rgba(16, 185, 129, 0.2)',
                  borderRadius: '6px',
                  padding: '12px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: isUser ? '#d946ef' : '#059669',
                }}
                onClick={() => {
                  if (action.url) {
                    handleNavigation(action.url);
                  }
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.background = isUser
                    ? 'rgba(217, 70, 239, 0.2)'
                    : 'rgba(16, 185, 129, 0.2)';
                  (e.target as HTMLElement).style.transform =
                    'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.background = isUser
                    ? 'rgba(217, 70, 239, 0.1)'
                    : 'rgba(16, 185, 129, 0.1)';
                  (e.target as HTMLElement).style.transform = 'translateY(0)';
                }}
              >
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <span style={{ fontSize: '16px' }}>{action.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600', marginBottom: '2px' }}>
                      {action.label}
                    </div>
                    <div
                      style={{
                        fontSize: '12px',
                        color: isUser
                          ? 'rgba(217, 70, 239, 0.7)'
                          : 'rgba(5, 150, 105, 0.7)',
                      }}
                    >
                      {action.description}
                    </div>
                  </div>
                  <span style={{ fontSize: '12px', opacity: 0.6 }}>→</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderTypingIndicator = () => (
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.9)',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '12px',
        border: '1px solid rgba(229, 231, 235, 0.8)',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #10b981, #059669)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            color: 'white',
            flexShrink: 0,
          }}
        >
          🤖
        </div>
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#059669',
              marginBottom: '2px',
            }}
          >
            Flowter AI
          </div>
          <div
            style={{
              fontSize: '12px',
              color: 'rgba(0, 0, 0, 0.5)',
            }}
          >
            {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginTop: '12px',
        }}
      >
        <div style={{ display: 'flex', gap: '4px' }}>
          <div
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: '#059669',
              animation: 'bounce 1.4s ease-in-out infinite both',
            }}
          />
          <div
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: '#059669',
              animation: 'bounce 1.4s ease-in-out 0.1s infinite both',
            }}
          />
          <div
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: '#059669',
              animation: 'bounce 1.4s ease-in-out 0.2s infinite both',
            }}
          />
        </div>
        <span
          style={{
            fontSize: '14px',
            color: '#374151',
          }}
        >
          Flowter is thinking...
        </span>
      </div>
    </div>
  );

  return (
    <>
      {/* Floating Button */}
      <div
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 1000,
        }}
      >
        {/* Helper Halo/Badge */}
        <div
          style={{
            position: 'absolute',
            top: '-8px',
            right: '-8px',
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #d946ef, #8b5cf6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            color: 'white',
            fontWeight: 'bold',
            boxShadow: '0 2px 8px rgba(217, 70, 239, 0.3)',
            animation: showHelperPulse
              ? 'helperPulse 2s ease-in-out infinite'
              : 'none',
            zIndex: 1001,
            border: '2px solid rgba(255, 255, 255, 0.8)',
          }}
          title='AI Helper Assistant Available'
        >
          💡
        </div>

        {/* Notification Badge */}
        {hasNewSuggestions && (
          <div
            style={{
              position: 'absolute',
              top: '-4px',
              left: '-4px',
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              background: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '10px',
              color: 'white',
              fontWeight: 'bold',
              boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)',
              animation: 'notificationBounce 1s ease-in-out infinite',
              zIndex: 1001,
            }}
          >
            !
          </div>
        )}

        <button
          onClick={() => setIsOpen(true)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #d946ef, #8b5cf6)',
            border: '3px solid rgba(255, 255, 255, 0.2)',
            boxShadow: isHovered
              ? '0 8px 25px rgba(217, 70, 239, 0.4), 0 0 0 4px rgba(217, 70, 239, 0.1)'
              : '0 4px 12px rgba(217, 70, 239, 0.3)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            color: 'white',
            transition: 'all 0.3s ease',
            transform: isHovered ? 'scale(1.1)' : 'scale(1)',
            position: 'relative',
            overflow: 'hidden',
          }}
          title='Flowter AI - Your intelligent assistant for FleetFlow'
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              animation: isHovered ? 'helperBounce 0.6s ease' : 'none',
            }}
          >
            <span style={{ fontSize: '20px', lineHeight: '1' }}>🤖</span>
            <div
              style={{
                fontSize: '8px',
                marginTop: '2px',
                opacity: isHovered ? 1 : 0.7,
                transition: 'opacity 0.3s ease',
                fontWeight: 'bold',
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)',
              }}
            >
              AI
            </div>
          </div>

          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              background:
                'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
              opacity: isHovered ? 1 : 0,
              transition: 'opacity 0.3s ease',
              pointerEvents: 'none',
            }}
          />
        </button>

        {/* Enhanced Tooltip */}
        {isHovered && (
          <div
            style={{
              position: 'absolute',
              bottom: '75px',
              right: '0',
              background: 'rgba(15, 23, 42, 0.95)',
              color: 'white',
              padding: '16px 20px',
              borderRadius: '12px',
              fontSize: '14px',
              maxWidth: '280px',
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)',
              border: '1px solid rgba(217, 70, 239, 0.3)',
              animation: 'fadeInUp 0.3s ease',
              backdropFilter: 'blur(10px)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '8px',
              }}
            >
              <span style={{ fontSize: '16px' }}>🤖</span>
              <strong>Your AI Assistant is Ready!</strong>
            </div>
            <div style={{ fontSize: '13px', lineHeight: '1.4', opacity: 0.9 }}>
              Ask me anything about FleetFlow features, get step-by-step
              guidance, or explore new capabilities.
              <br />
              <em style={{ color: '#d946ef', fontStyle: 'normal' }}>
                {getTierMessage(userTier)}
              </em>
              <br />
              <small style={{ color: '#9ca3af', fontSize: '12px' }}>
                {getRoleWelcomeMessage(userRole)}
              </small>
              {userTier === 'basic' && (
                <div
                  style={{
                    marginTop: '8px',
                    padding: '6px 10px',
                    background: 'rgba(245, 158, 11, 0.2)',
                    borderRadius: '4px',
                    fontSize: '12px',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                  }}
                >
                  💎 Upgrade for advanced AI features!
                </div>
              )}
            </div>
            <div
              style={{
                position: 'absolute',
                bottom: '-6px',
                right: '20px',
                width: '0',
                height: '0',
                borderLeft: '6px solid transparent',
                borderRight: '6px solid transparent',
                borderTop: '6px solid rgba(15, 23, 42, 0.95)',
              }}
            />
          </div>
        )}
      </div>

      {/* Properly Sized Modal */}
      {isOpen && (
        <div
          className='fixed inset-0 z-50'
          style={{
            background: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(8px)',
          }}
          onClick={() => setIsOpen(false)}
        >
          <div
            className='rounded-xl shadow-2xl'
            style={{
              position: 'absolute',
              bottom: '90px',
              right: '20px',
              width: '420px',
              maxWidth: '90vw',
              maxHeight: '600px',
              overflow: 'hidden',
              background:
                'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)',
              border: '1px solid rgba(217, 70, 239, 0.2)',
              transform: 'translateY(0)',
              animation: 'modalSlideUp 0.3s ease-out',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header - AI Flow Platform Style */}
            <div
              style={{
                background:
                  'linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(51, 65, 85, 0.8))',
                padding: '16px 20px',
                borderRadius: '12px 12px 0 0',
                position: 'relative',
                backdropFilter: 'blur(10px)',
                borderBottom: '1px solid rgba(217, 70, 239, 0.2)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <button
                  onClick={() => setIsOpen(false)}
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: 'none',
                    border: 'none',
                    fontSize: '20px',
                    cursor: 'pointer',
                    color: 'white',
                  }}
                >
                  ×
                </button>
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '20px' }}
                >
                  <div
                    style={{
                      padding: '12px',
                      background: 'rgba(255, 255, 255, 0.15)',
                      borderRadius: '12px',
                    }}
                  >
                    <span style={{ fontSize: '28px' }}>🤖</span>
                  </div>
                  <div>
                    <h1
                      style={{
                        fontSize: '24px',
                        fontWeight: 'bold',
                        color: '#d946ef',
                        margin: '0 0 6px 0',
                        textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                      }}
                    >
                      FLOWTER AI
                    </h1>
                    <p
                      style={{
                        fontSize: '14px',
                        color: '#ec4899',
                        margin: '0 0 6px 0',
                      }}
                    >
                      Intelligent FleetFlow Assistant
                    </p>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        fontSize: '12px',
                        color: 'rgba(255, 255, 255, 0.9)',
                      }}
                    >
                      <span
                        style={{
                          padding: '3px 8px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: '600',
                          background: 'rgba(16, 185, 129, 0.2)',
                          color: '#10b981',
                        }}
                      >
                        ✅ ACTIVE
                      </span>
                      <span>•</span>
                      <span>Ready to assist</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    width: '36px',
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLElement).style.background =
                      'rgba(255, 255, 255, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLElement).style.background =
                      'rgba(255, 255, 255, 0.1)';
                  }}
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div
              style={{ padding: '20px', maxHeight: '500px', overflowY: 'auto' }}
            >
              {/* Welcome Message */}
              <div
                style={{
                  background: 'rgba(217, 70, 239, 0.1)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '12px',
                  padding: '20px',
                  marginBottom: '20px',
                  border: '1px solid rgba(217, 70, 239, 0.2)',
                }}
              >
                <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                  <h3
                    style={{
                      fontSize: '20px',
                      fontWeight: '600',
                      color: '#fff',
                      margin: '0 0 8px 0',
                      textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)',
                    }}
                  >
                    👋 Welcome to Flowter AI
                  </h3>
                  <p
                    style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.8)',
                      margin: 0,
                      lineHeight: '1.5',
                    }}
                  >
                    Hi {getCurrentUser().user.name || 'User'}! I'm your
                    intelligent assistant for FleetFlow.
                    {getRoleWelcomeMessage(
                      getCurrentUser().user.role || 'employee'
                    )}
                  </p>
                </div>
              </div>

              {/* Enhanced Features Section */}
              <div
                style={{
                  background: 'rgba(30, 41, 59, 0.6)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '12px',
                  padding: '20px',
                  marginBottom: '20px',
                  border: '1px solid rgba(217, 70, 239, 0.2)',
                }}
              >
                <div style={{ marginBottom: '16px' }}>
                  <h4
                    style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#fff',
                      margin: '0 0 12px 0',
                      textAlign: 'center',
                    }}
                  >
                    🚀 Enhanced AI Features
                  </h4>

                  {/* Quick Actions Grid */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, 1fr)',
                      gap: '12px',
                      marginBottom: '16px',
                    }}
                  >
                    {[
                      {
                        icon: '🔍',
                        label: 'Smart Search',
                        desc: 'Find any feature instantly',
                      },
                      {
                        icon: '🧠',
                        label: 'AI Navigation',
                        desc: 'Get me to the right place',
                      },
                      {
                        icon: '⚡',
                        label: 'Quick Actions',
                        desc: 'One-click shortcuts',
                      },
                      {
                        icon: '📚',
                        label: 'Contextual Help',
                        desc: 'Smart tutorials',
                      },
                    ].map((feature, index) => (
                      <button
                        key={index}
                        style={{
                          background: 'rgba(217, 70, 239, 0.15)',
                          border: '1px solid rgba(217, 70, 239, 0.3)',
                          borderRadius: '8px',
                          padding: '12px',
                          color: '#fff',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          textAlign: 'left',
                        }}
                        onMouseEnter={(e) => {
                          (e.target as HTMLElement).style.background =
                            'rgba(217, 70, 239, 0.25)';
                          (e.target as HTMLElement).style.transform =
                            'translateY(-1px)';
                        }}
                        onMouseLeave={(e) => {
                          (e.target as HTMLElement).style.background =
                            'rgba(217, 70, 239, 0.15)';
                          (e.target as HTMLElement).style.transform =
                            'translateY(0)';
                        }}
                        onClick={() =>
                          setInput(
                            feature.label === 'Smart Search'
                              ? 'Find routing'
                              : feature.label === 'AI Navigation'
                                ? 'Take me to dispatch'
                                : feature.label === 'Quick Actions'
                                  ? 'Help with loads'
                                  : 'How to use FleetFlow'
                          )
                        }
                      >
                        <div style={{ fontSize: '20px', marginBottom: '4px' }}>
                          {feature.icon}
                        </div>
                        <div
                          style={{
                            fontSize: '12px',
                            fontWeight: '600',
                            marginBottom: '2px',
                          }}
                        >
                          {feature.label}
                        </div>
                        <div style={{ fontSize: '10px', opacity: 0.8 }}>
                          {feature.desc}
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Popular Commands */}
                  <div>
                    <div
                      style={{
                        fontSize: '12px',
                        color: 'rgba(255, 255, 255, 0.7)',
                        marginBottom: '8px',
                        fontWeight: '600',
                      }}
                    >
                      💡 Try saying:
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '6px',
                      }}
                    >
                      {[
                        'Find routing',
                        'Help with dispatch',
                        'Show me invoicing',
                        'Take me to reports',
                        'Create new load',
                        'Track drivers',
                      ].map((command, index) => (
                        <button
                          key={index}
                          style={{
                            background: 'rgba(15, 23, 42, 0.6)',
                            border: '1px solid rgba(217, 70, 239, 0.2)',
                            borderRadius: '12px',
                            padding: '4px 8px',
                            fontSize: '10px',
                            color: 'rgba(255, 255, 255, 0.8)',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                          }}
                          onMouseEnter={(e) => {
                            (e.target as HTMLElement).style.background =
                              'rgba(217, 70, 239, 0.2)';
                          }}
                          onMouseLeave={(e) => {
                            (e.target as HTMLElement).style.background =
                              'rgba(15, 23, 42, 0.6)';
                          }}
                          onClick={() => setInput(command)}
                        >
                          {command}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Chat Interface */}
              {messages.length > 1 && (
                <div
                  style={{
                    background: 'rgba(30, 41, 59, 0.6)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '12px',
                    marginBottom: '20px',
                    border: '1px solid rgba(217, 70, 239, 0.2)',
                    maxHeight: '300px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      padding: '16px',
                      borderBottom: '1px solid rgba(217, 70, 239, 0.2)',
                      background: 'rgba(217, 70, 239, 0.15)',
                    }}
                  >
                    <h4
                      style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        color: '#fff',
                        margin: 0,
                        textAlign: 'center',
                      }}
                    >
                      💬 Conversation
                    </h4>
                  </div>
                  <div
                    style={{
                      maxHeight: '200px',
                      overflowY: 'auto',
                      padding: '16px',
                      background: 'rgba(15, 23, 42, 0.4)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                      }}
                    >
                      {messages.slice(1).map(renderMessage)}
                      {isTyping && renderTypingIndicator()}
                      <div ref={messagesEndRef} />
                    </div>
                  </div>
                </div>
              )}

              {/* Input Area */}
              <div
                style={{
                  background: 'rgba(30, 41, 59, 0.6)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '12px',
                  padding: '20px',
                  border: '1px solid rgba(217, 70, 239, 0.2)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    gap: '16px',
                    alignItems: 'flex-end',
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <textarea
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      style={{
                        width: '100%',
                        resize: 'none',
                        borderRadius: '8px',
                        padding: '16px',
                        fontSize: '14px',
                        color: '#fff',
                        background: 'rgba(15, 23, 42, 0.8)',
                        border: '1px solid rgba(217, 70, 239, 0.3)',
                        minHeight: '56px',
                        maxHeight: '120px',
                        outline: 'none',
                        transition: 'all 0.2s ease',
                      }}
                      placeholder="Ask Flowter anything... (e.g., 'Find routing' or 'Help with dispatch')"
                      disabled={isTyping}
                      rows={1}
                      onFocus={(e) => {
                        e.target.style.border =
                          '1px solid rgba(217, 70, 239, 0.8)';
                        e.target.style.boxShadow =
                          '0 0 0 3px rgba(217, 70, 239, 0.2)';
                      }}
                      onBlur={(e) => {
                        e.target.style.border =
                          '1px solid rgba(217, 70, 239, 0.3)';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                  <button
                    onClick={handleSendMessage}
                    disabled={!input.trim() || isTyping}
                    style={{
                      background: 'linear-gradient(135deg, #d946ef, #8b5cf6)',
                      color: 'white',
                      border: '1px solid rgba(217, 70, 239, 0.3)',
                      borderRadius: '8px',
                      padding: '16px 24px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor:
                        input.trim() && !isTyping ? 'pointer' : 'not-allowed',
                      opacity: input.trim() && !isTyping ? 1 : 0.5,
                      transition: 'all 0.2s ease',
                      boxShadow: '0 4px 12px rgba(217, 70, 239, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                    onMouseEnter={(e) => {
                      if (!isTyping && input.trim()) {
                        e.currentTarget.style.transform = 'translateY(-1px)';
                        e.currentTarget.style.boxShadow =
                          '0 8px 20px rgba(217, 70, 239, 0.4)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow =
                        '0 4px 12px rgba(217, 70, 239, 0.3)';
                    }}
                  >
                    {isTyping ? (
                      <>
                        <div
                          style={{
                            width: '16px',
                            height: '16px',
                            border: '2px solid white',
                            borderTop: '2px solid transparent',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite',
                          }}
                        />
                        <span>Thinking...</span>
                      </>
                    ) : (
                      <>
                        <span>Send</span>
                        <span style={{ fontSize: '16px' }}>🚀</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style
        dangerouslySetInnerHTML={{
          __html: `
          @keyframes helperPulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.2); opacity: 0.8; }
          }

          @keyframes notificationBounce {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
          }

          @keyframes helperBounce {
            0%, 60%, 100% { transform: translateY(0); }
            30% { transform: translateY(-2px); }
          }

          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes bounce {
            0%, 20%, 53%, 80%, 100% { transform: translate3d(0,0,0); }
            40%, 43% { transform: translate3d(0, -8px, 0); }
            70% { transform: translate3d(0, -4px, 0); }
            90% { transform: translate3d(0, -2px, 0); }
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          @keyframes modalSlideUp {
            from {
              opacity: 0;
              transform: translateY(20px) scale(0.95);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
        `,
        }}
      />
    </>
  );
};

export default UnifiedFlowterAI;
