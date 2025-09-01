/**
 * Enhanced Flowter AI Modal
 * Full-featured AI chat interface with intelligent search and navigation
 */

'use client';

import React, { useEffect, useRef, useState } from 'react';
import { getCurrentUser } from '../config/access';
import {
  EnhancedFlowterAI,
  FlowterMessage,
  FlowterResponse,
} from '../services/EnhancedFlowterAI';
import FlowterSmartNavigation from './FlowterSmartNavigation';

// ============================================================================
// INTERFACES & TYPES
// ============================================================================

interface EnhancedFlowterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// ============================================================================
// ENHANCED FLOWTER MODAL COMPONENT
// ============================================================================

export const EnhancedFlowterModal: React.FC<EnhancedFlowterModalProps> = ({
  isOpen,
  onClose,
}) => {
  // State management
  const [messages, setMessages] = useState<FlowterMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentResponse, setCurrentResponse] =
    useState<FlowterResponse | null>(null);

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const flowterAI = useRef(new EnhancedFlowterAI());

  // Initialize with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const { user } = getCurrentUser();
      const welcomeMessage: FlowterMessage = {
        role: 'assistant',
        content: `👋 Hi ${user.name}! I'm Flowter AI, your FleetFlow assistant. I can help you with:

🔍 **Smart Navigation**: ""Find routing"" or ""Take me to dispatch""
📚 **Feature Help**: ""How do I create loads?"" or ""Help with invoicing""
🚀 **Quick Actions**: ""Create new invoice"" or ""Optimize routes""
📊 **Insights**: ""Show me reports"" or ""Track shipments""

What would you like to do today?`,
        timestamp: new Date().toLocaleTimeString(),
        type: 'welcome',
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, messages.length]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages, currentResponse]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // ============================================================================
  // MESSAGE HANDLING
  // ============================================================================

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
      // Get AI response
      const response = await flowterAI.current.handleUserQuery(input.trim());

      // Create assistant message
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
      console.error('❌ Flowter AI error:', error);
      const errorMessage: FlowterMessage = {
        role: 'assistant',
        content:
          'I apologize, but I encountered an issue processing your request. Please try again or contact support.',
        timestamp: new Date().toLocaleTimeString(),
        type: 'error',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickAction = (action: string) => {
    setInput(action);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleNavigation = (url: string) => {
    console.info(`🔗 Navigating to: ${url}`);
    onClose(); // Close modal after navigation
  };

  // ============================================================================
  // RENDER HELPERS
  // ============================================================================

  const renderMessage = (message: FlowterMessage, index: number) => {
    const isUser = message.role === 'user';
    const isWelcome = message.type === 'welcome';

    return (
      <div
        key={index}
        className={`mb-4 flex ${isUser ? 'justify-end' : 'justify-start'}`}
      >
        {/* Avatar */}
        {!isUser && (
          <div className='mr-3 flex-shrink-0'>
            <div className='flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-sm font-bold text-white'>
              🤖
            </div>
          </div>
        )}

        {/* Message Bubble */}
        <div
          className={`max-w-sm rounded-2xl px-4 py-3 lg:max-w-md ${
            isUser
              ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
              : isWelcome
                ? 'border border-purple-200 bg-gradient-to-r from-blue-50 to-purple-50 text-gray-800'
                : 'bg-gray-100 text-gray-800'
          }`}
        >
          <div className='text-sm leading-relaxed whitespace-pre-wrap'>
            {message.content}
          </div>

          {/* Timestamp */}
          <div
            className={`mt-2 text-xs ${
              isUser ? 'text-pink-100' : 'text-gray-500'
            }`}
          >
            {message.timestamp}
          </div>

          {/* Action Buttons */}
          {message.actions && message.actions.length > 0 && (
            <div className='mt-3 space-y-2'>
              {message.actions.map((action, actionIndex) => (
                <button
                  key={actionIndex}
                  className='bg-opacity-20 hover:bg-opacity-30 w-full rounded-lg bg-white px-3 py-2 text-left text-xs transition-all duration-200'
                  onClick={() => {
                    if (action.url) {
                      handleNavigation(action.url);
                    }
                  }}
                >
                  <div className='flex items-center gap-2'>
                    <span>{action.icon}</span>
                    <span className='font-medium'>{action.label}</span>
                  </div>
                  <div className='mt-1 text-xs opacity-75'>
                    {action.description}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* User Avatar */}
        {isUser && (
          <div className='ml-3 flex-shrink-0'>
            <div className='flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-sm font-bold text-white'>
              👤
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderTypingIndicator = () => (
    <div className='mb-4 flex justify-start'>
      <div className='mr-3 flex-shrink-0'>
        <div className='flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-sm font-bold text-white'>
          🤖
        </div>
      </div>
      <div className='rounded-2xl bg-gray-100 px-4 py-3'>
        <div className='flex items-center gap-1'>
          <div className='flex gap-1'>
            <div className='h-2 w-2 animate-bounce rounded-full bg-gray-400'></div>
            <div
              className='h-2 w-2 animate-bounce rounded-full bg-gray-400'
              style={{ animationDelay: '0.1s' }}
            ></div>
            <div
              className='h-2 w-2 animate-bounce rounded-full bg-gray-400'
              style={{ animationDelay: '0.2s' }}
            ></div>
          </div>
          <span className='ml-2 text-sm text-gray-600'>
            Flowter is thinking...
          </span>
        </div>
      </div>
    </div>
  );

  const renderQuickActions = () => {
    const quickActions = [
      { label: 'Find routing', icon: '🗺️' },
      { label: 'Help with dispatch', icon: '🎯' },
      { label: 'Show me drivers', icon: '👥' },
      { label: 'Create invoice', icon: '💰' },
      { label: 'Track shipments', icon: '📍' },
      { label: 'Generate reports', icon: '📊' },
    ];

    return (
      <div className='border-t bg-gray-50 px-4 py-3'>
        <div className='mb-2 text-xs font-semibold text-gray-600'>
          Quick Actions:
        </div>
        <div className='flex flex-wrap gap-2'>
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={() => handleQuickAction(action.label)}
              className='inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs transition-colors duration-200 hover:bg-gray-100'
            >
              <span>{action.icon}</span>
              <span>{action.label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  };

  // ============================================================================
  // RENDER MODAL
  // ============================================================================

  if (!isOpen) return null;

  return (
    <div className='bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4'>
      <div
        className='flex max-h-[80vh] w-full max-w-lg flex-col rounded-2xl bg-white shadow-2xl'
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className='flex items-center justify-between rounded-t-2xl border-b border-gray-200 bg-gradient-to-r from-pink-500 to-purple-600 px-6 py-4 text-white'>
          <div className='flex items-center gap-3'>
            <div className='bg-opacity-20 flex h-8 w-8 items-center justify-center rounded-full bg-white text-lg'>
              🤖
            </div>
            <div>
              <h2 className='text-lg font-bold'>Flowter AI</h2>
              <p className='text-sm text-pink-100'>Your FleetFlow Assistant</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className='bg-opacity-20 hover:bg-opacity-30 flex h-8 w-8 items-center justify-center rounded-full bg-white transition-all duration-200'
          >
            ✕
          </button>
        </div>

        {/* Messages Area */}
        <div className='max-h-96 min-h-96 flex-1 space-y-4 overflow-y-auto p-4'>
          {messages.map(renderMessage)}
          {isTyping && renderTypingIndicator()}
          <div ref={messagesEndRef} />
        </div>

        {/* Navigation Component */}
        {currentResponse &&
          (currentResponse.actions || currentResponse.options) && (
            <div className='border-t border-gray-100 px-4 py-2'>
              <FlowterSmartNavigation
                actions={currentResponse.actions}
                options={currentResponse.options}
                onNavigate={handleNavigation}
                onClose={onClose}
              />
            </div>
          )}

        {/* Input Area */}
        <div className='border-t border-gray-200 px-4 py-4'>
          <div className='flex gap-3'>
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Flowter anything... (e.g., 'Find routing' or 'Help with dispatch')"
              disabled={isTyping}
              className='flex-1 resize-none rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-transparent focus:ring-2 focus:ring-pink-500 focus:outline-none disabled:opacity-50'
              rows={1}
              style={{
                minHeight: '44px',
                maxHeight: '100px',
              }}
            />
            <button
              onClick={handleSendMessage}
              disabled={!input.trim() || isTyping}
              className='flex items-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 px-6 py-3 font-medium text-white transition-all duration-200 hover:from-pink-600 hover:to-purple-700 disabled:cursor-not-allowed disabled:opacity-50'
            >
              {isTyping ? (
                <>
                  <div className='h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent'></div>
                  <span>Thinking</span>
                </>
              ) : (
                <>
                  <span>Send</span>
                  <span>🚀</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick Actions Footer */}
        {renderQuickActions()}
      </div>
    </div>
  );
};

export default EnhancedFlowterModal;
