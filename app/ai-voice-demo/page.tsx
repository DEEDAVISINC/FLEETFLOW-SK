'use client';

import { Bot, MicOff, Phone, Send, User } from 'lucide-react';
import { useState } from 'react';

export default function AIVoiceDemoPage() {
  const [callId] = useState(`DEMO-${Date.now()}`);
  const [conversation, setConversation] = useState<
    Array<{
      speaker: 'user' | 'ai';
      message: string;
      timestamp: string;
      confidence?: number;
    }>
  >([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [callActive, setCallActive] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);

  // Text-to-Speech function
  const speakText = (text: string) => {
    if (!voiceEnabled || !window.speechSynthesis) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9; // Slightly slower for clarity
    utterance.pitch = 1.0;
    utterance.volume = 0.8;

    // Try to use a professional female voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      (voice) =>
        voice.name.includes('Samantha') ||
        voice.name.includes('Karen') ||
        voice.name.includes('Female') ||
        voice.lang.includes('en-US')
    );

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    window.speechSynthesis.speak(utterance);
  };

  const startCall = async () => {
    setCallActive(true);
    const greetingMessage =
      "Hello! I'm FleetFlow's AI assistant. How can I help you today?";

    setConversation([
      {
        speaker: 'ai',
        message: greetingMessage,
        timestamp: new Date().toLocaleTimeString(),
        confidence: 0.9,
      },
    ]);

    // Speak the greeting if voice is enabled
    if (voiceEnabled) {
      speakText(greetingMessage);
    }
  };

  const sendMessage = async () => {
    if (!userInput.trim()) return;

    // Add user message to conversation
    const userMessage = {
      speaker: 'user' as const,
      message: userInput,
      timestamp: new Date().toLocaleTimeString(),
    };

    setConversation((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Send to AI voice conversation API
      const response = await fetch('/api/ai/voice-conversation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          callId: callId,
          userInput: userInput,
          context: {
            callType: 'inbound_inquiry',
          },
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Add AI response to conversation
        const aiMessage = {
          speaker: 'ai' as const,
          message: data.response,
          timestamp: new Date().toLocaleTimeString(),
          confidence: data.confidence,
        };

        setConversation((prev) => [...prev, aiMessage]);

        // Play voice output if available
        if (voiceEnabled) {
          if (data.audioUrl) {
            // Play ElevenLabs audio if available
            const audio = new Audio(data.audioUrl);
            audio.play().catch(console.error);
          } else {
            // Fallback to browser TTS
            speakText(data.response);
          }
        }
      } else {
        // Handle error
        const errorMessage = {
          speaker: 'ai' as const,
          message:
            "I apologize, but I'm experiencing technical difficulties. Let me transfer you to a human agent.",
          timestamp: new Date().toLocaleTimeString(),
          confidence: 0.3,
        };

        setConversation((prev) => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('Failed to get AI response:', error);

      // Fallback response
      const fallbackMessage = {
        speaker: 'ai' as const,
        message:
          "I'm having trouble connecting right now. Please try again in a moment or let me transfer you to a human agent.",
        timestamp: new Date().toLocaleTimeString(),
        confidence: 0.2,
      };

      setConversation((prev) => [...prev, fallbackMessage]);
    }

    setUserInput('');
    setIsLoading(false);
  };

  const endCall = () => {
    setCallActive(false);
    const endMessage = {
      speaker: 'ai' as const,
      message:
        'Thank you for calling FleetFlow! Have a great day and safe travels.',
      timestamp: new Date().toLocaleTimeString(),
      confidence: 0.95,
    };

    setConversation((prev) => [...prev, endMessage]);
  };

  const getConfidenceColor = (confidence?: number) => {
    if (!confidence) return 'text-gray-400';
    if (confidence >= 0.8) return 'text-green-400';
    if (confidence >= 0.6) return 'text-yellow-400';
    return 'text-red-400';
  };

  const quickTestMessages = [
    'Hi, this is John from ABC Trucking, MC-123456',
    "I'm looking for loads going to California",
    "What's the rate for that load?",
    "That's a bit low, can you do $3,200?",
    "Okay, I'll take it at $3,000",
  ];

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-6'>
      <div className='mx-auto max-w-4xl'>
        {/* Header */}
        <div className='mb-8 text-center'>
          <h1 className='mb-4 text-4xl font-bold text-white'>
            🤖 FleetFlow AI Voice Demo
          </h1>
          <p className='text-lg text-white/70'>
            Test Parade.ai CoDriver-level voice AI for carrier conversations
          </p>
        </div>

        {/* Call Controls */}
        <div className='mb-6 flex items-center justify-center gap-4'>
          {!callActive ? (
            <div className='flex flex-col items-center gap-4'>
              <button
                onClick={startCall}
                className='flex items-center gap-3 rounded-xl border border-green-500/30 bg-gradient-to-r from-green-500/20 to-blue-500/20 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:scale-105 hover:from-green-500/30 hover:to-blue-500/30'
              >
                <Phone className='h-6 w-6' />
                🎙️ Start Conversation
              </button>
              <p className='text-sm text-white/60'>
                Click to begin AI voice conversation demo
              </p>
              <div className='flex items-center gap-2 text-xs text-white/50'>
                <span>
                  💡 Tip: Enable voice during call to hear AI responses
                </span>
              </div>
            </div>
          ) : (
            <div className='flex items-center gap-4'>
              <div className='flex items-center gap-2 rounded-lg border border-green-500/30 bg-green-500/20 px-4 py-2'>
                <div className='h-2 w-2 animate-pulse rounded-full bg-green-400' />
                <span className='text-green-300'>Call Active</span>
              </div>
              <button
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                className={`flex items-center gap-2 rounded-lg border px-4 py-2 transition-colors ${
                  voiceEnabled
                    ? 'border-blue-500/30 bg-blue-500/20 text-blue-300 hover:bg-blue-500/30'
                    : 'border-gray-500/30 bg-gray-500/20 text-gray-300 hover:bg-gray-500/30'
                }`}
              >
                🔊 Voice {voiceEnabled ? 'ON' : 'OFF'}
              </button>
              <button
                onClick={endCall}
                className='flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/20 px-4 py-2 text-red-300 transition-colors hover:bg-red-500/30'
              >
                <MicOff className='h-4 w-4' />
                End Call
              </button>
            </div>
          )}
        </div>

        {/* Conversation Window */}
        <div className='mb-6 rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm'>
          <div className='mb-4 flex items-center gap-3'>
            <Bot className='h-6 w-6 text-blue-400' />
            <h2 className='text-xl font-semibold text-white'>
              AI Conversation
            </h2>
            <span className='text-white/50'>Call ID: {callId}</span>
          </div>

          {/* Conversation History */}
          <div className='mb-6 max-h-96 space-y-4 overflow-y-auto'>
            {conversation.length === 0 ? (
              <div className='py-8 text-center text-white/50'>
                Click "Start AI Call Demo" to begin conversation
              </div>
            ) : (
              conversation.map((msg, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-3 ${
                    msg.speaker === 'ai' ? 'justify-start' : 'justify-end'
                  }`}
                >
                  {msg.speaker === 'ai' && (
                    <div className='rounded-full bg-blue-500/20 p-2'>
                      <Bot className='h-4 w-4 text-blue-400' />
                    </div>
                  )}

                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      msg.speaker === 'ai'
                        ? 'border border-blue-500/20 bg-blue-500/10'
                        : 'border border-green-500/20 bg-green-500/10'
                    }`}
                  >
                    <div className='text-white'>{msg.message}</div>
                    <div className='mt-2 flex items-center gap-2 text-xs'>
                      <span className='text-white/50'>{msg.timestamp}</span>
                      {msg.confidence && (
                        <span
                          className={`font-medium ${getConfidenceColor(msg.confidence)}`}
                        >
                          {Math.round(msg.confidence * 100)}% confidence
                        </span>
                      )}
                    </div>
                  </div>

                  {msg.speaker === 'user' && (
                    <div className='rounded-full bg-green-500/20 p-2'>
                      <User className='h-4 w-4 text-green-400' />
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Input Area */}
          {callActive && (
            <div className='space-y-4'>
              <div className='flex gap-2'>
                <input
                  type='text'
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === 'Enter' && !isLoading && sendMessage()
                  }
                  placeholder='Type your message as a carrier...'
                  className='flex-1 rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500/50 focus:outline-none'
                  disabled={isLoading}
                />
                <button
                  onClick={sendMessage}
                  disabled={isLoading || !userInput.trim()}
                  className='flex items-center gap-2 rounded-lg border border-blue-500/30 bg-blue-500/20 px-4 py-2 text-blue-300 transition-colors hover:bg-blue-500/30 disabled:cursor-not-allowed disabled:opacity-50'
                >
                  {isLoading ? (
                    <div className='h-4 w-4 animate-spin rounded-full border-2 border-blue-400 border-t-transparent' />
                  ) : (
                    <Send className='h-4 w-4' />
                  )}
                  Send
                </button>
              </div>

              {/* Quick Test Messages */}
              <div className='grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3'>
                {quickTestMessages.map((msg, index) => (
                  <button
                    key={index}
                    onClick={() => setUserInput(msg)}
                    className='rounded border border-white/10 bg-white/5 p-2 text-left text-sm text-white/70 transition-colors hover:bg-white/10'
                  >
                    "{msg}"
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Usage Instructions */}
        <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
          {/* How to Use */}
          <div className='rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm'>
            <h3 className='mb-4 text-xl font-semibold text-white'>
              🎯 How to Use
            </h3>
            <div className='space-y-3 text-white/80'>
              <div className='flex items-start gap-3'>
                <div className='flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/20 text-sm font-bold text-blue-400'>
                  1
                </div>
                <div>
                  <div className='font-medium'>Start a Call</div>
                  <div className='text-sm text-white/60'>
                    Click "🎙️ Start Conversation" to begin
                  </div>
                </div>
              </div>
              <div className='flex items-start gap-3'>
                <div className='flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/20 text-sm font-bold text-blue-400'>
                  2
                </div>
                <div>
                  <div className='font-medium'>Act Like a Carrier</div>
                  <div className='text-sm text-white/60'>
                    Type messages as if you're calling about loads
                  </div>
                </div>
              </div>
              <div className='flex items-start gap-3'>
                <div className='flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/20 text-sm font-bold text-blue-400'>
                  3
                </div>
                <div>
                  <div className='font-medium'>Watch AI Respond</div>
                  <div className='text-sm text-white/60'>
                    See how AI qualifies, matches loads, and negotiates rates
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Example Conversation Flow */}
          <div className='rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm'>
            <h3 className='mb-4 text-xl font-semibold text-white'>
              💬 Example Flow
            </h3>
            <div className='space-y-3 text-sm'>
              <div className='rounded border border-green-500/20 bg-green-500/10 p-2'>
                <div className='font-medium text-green-400'>Carrier:</div>
                <div className='text-white/80'>
                  "Hi, this is John from ABC Trucking, MC-123456"
                </div>
              </div>
              <div className='rounded border border-blue-500/20 bg-blue-500/10 p-2'>
                <div className='font-medium text-blue-400'>AI:</div>
                <div className='text-white/80'>
                  "Hello John! I can verify MC-123456... Great! Your authority
                  is active. What can I help you with?"
                </div>
              </div>
              <div className='rounded border border-green-500/20 bg-green-500/10 p-2'>
                <div className='font-medium text-green-400'>Carrier:</div>
                <div className='text-white/80'>
                  "Looking for loads going west from Chicago"
                </div>
              </div>
              <div className='rounded border border-blue-500/20 bg-blue-500/10 p-2'>
                <div className='font-medium text-blue-400'>AI:</div>
                <div className='text-white/80'>
                  "Perfect! I have electronics loads Chicago to LA, $2,850
                  all-in. Interested?"
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* API Endpoints Reference */}
        <div className='mt-6 rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm'>
          <h3 className='mb-4 text-xl font-semibold text-white'>
            🔧 API Reference
          </h3>
          <div className='grid grid-cols-1 gap-4 text-sm md:grid-cols-3'>
            <div className='rounded border border-white/10 bg-white/5 p-3'>
              <div className='mb-2 font-medium text-blue-400'>
                Voice Conversation
              </div>
              <div className='font-mono text-white/70'>
                POST /api/ai/voice-conversation
              </div>
              <div className='mt-1 text-white/50'>
                Process carrier conversations
              </div>
            </div>
            <div className='rounded border border-white/10 bg-white/5 p-3'>
              <div className='mb-2 font-medium text-green-400'>
                Active Sessions
              </div>
              <div className='font-mono text-white/70'>
                GET /api/ai/voice-conversation/sessions
              </div>
              <div className='mt-1 text-white/50'>Monitor active calls</div>
            </div>
            <div className='rounded border border-white/10 bg-white/5 p-3'>
              <div className='mb-2 font-medium text-purple-400'>
                Call Metrics
              </div>
              <div className='font-mono text-white/70'>
                GET /api/ai/call-center/metrics
              </div>
              <div className='mt-1 text-white/50'>Performance analytics</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
