'use client';

import { useEffect, useState } from 'react';

interface FleetFlowAppVideoProps {
  autoPlay?: boolean;
}

export function FleetFlowAppVideo({
  autoPlay = false,
}: FleetFlowAppVideoProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [isUsingElevenLabs, setIsUsingElevenLabs] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState('custom-dee-voice');
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(
    null
  );
  const [voicesLoaded, setVoicesLoaded] = useState(false);
  const [audioCache, setAudioCache] = useState<Map<string, string>>(new Map());
  const [quotaExceeded, setQuotaExceeded] = useState(false);
  const [playCount, setPlayCount] = useState(0);
  const MAX_PLAYS_PER_SESSION = 3; // Limit to 3 full playthroughs per session
  const [isBrowserSpeaking, setIsBrowserSpeaking] = useState(false);
  const [ttsErrorMessage, setTtsErrorMessage] = useState<string | null>(null);

  // Clear TTS error message on mount to prevent persistent error display
  useEffect(() => {
    setTtsErrorMessage(null);
  }, []);

  // App Screenshots Data with Narration
  const appScreenshots = [
    {
      title: 'FleetFlow Command Center',
      description:
        'Your unified operations dashboard with real-time fleet visibility',
      route: '/',
      features: [
        'Live Load Tracking',
        'Driver Management',
        'Revenue Analytics',
        'AI Notifications',
      ],
      narration:
        'Welcome to FleetFlow - the complete transportation management platform. Our command center gives you instant visibility across your entire operation.',
      duration: 12000, // 12 seconds for full narration
    },
    {
      title: '🌊 Go With the Flow',
      description:
        'Instant freight marketplace connecting shippers and drivers',
      route: '/go-with-the-flow',
      features: [
        'Instant Load Matching',
        'AI-Powered Pricing',
        'Real-Time Driver Tracking',
        'Quick Payment Processing',
      ],
      narration:
        'Go With the Flow is our instant freight marketplace. Shippers can request trucks immediately while drivers find high-paying loads nearby - all powered by AI matching and dynamic pricing.',
      duration: 12000, // Extended for full narration
    },
    {
      title: 'AI Automation Hub',
      description: 'Claude AI-powered automation for freight operations',
      route: '/ai',
      features: [
        'AI Dispatch',
        'Smart Routing',
        'Predictive Analytics',
        'Automated Communications',
      ],
      narration:
        'Our AI automation hub uses Claude AI to handle dispatch, routing, and customer communications - reducing manual work by 80%.',
      duration: 10000, // Extended for full narration
    },
    {
      title: 'FreightFlow RFx Platform',
      description: 'Government contracts and enterprise RFP discovery',
      route: '/freightflow-rfx',
      features: [
        'Contract Discovery',
        'Bid Management',
        'Compliance Tracking',
        'Award Notifications',
      ],
      narration:
        'FreightFlow RFx helps you discover and win government contracts and enterprise RFPs with automated bid management and compliance tracking.',
      duration: 10000, // Extended for full narration
    },
    {
      title: 'FleetFlow University',
      description: 'Comprehensive training and certification programs',
      route: '/university',
      features: [
        'DOT Compliance Training',
        'Safety Certifications',
        'Business Development',
        'Technology Training',
      ],
      narration:
        'FleetFlow University provides comprehensive training programs covering DOT compliance, safety certifications, and business development for transportation professionals.',
      duration: 11000, // Extended for full narration
    },
    {
      title: 'Advanced Analytics',
      description: 'Real-time insights and performance metrics',
      route: '/analytics',
      features: [
        'Performance Dashboards',
        'Predictive Insights',
        'Cost Analysis',
        'Route Optimization',
      ],
      narration:
        'Our advanced analytics platform provides real-time insights into your operations with predictive analytics, cost analysis, and route optimization recommendations.',
      duration: 10000, // Extended for full narration
    },
    {
      title: 'Carrier Management',
      description: 'Complete carrier onboarding and relationship management',
      route: '/carriers',
      features: [
        'Digital Onboarding',
        'Document Management',
        'Performance Tracking',
        'Payment Processing',
      ],
      narration:
        'Streamline carrier relationships with digital onboarding, automated document management, performance tracking, and integrated payment processing.',
      duration: 9000, // Extended for full narration
    },
  ];

  // Auto-advance slides
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setTimeout(() => {
      setCurrentSlide((prev) => {
        const nextSlide = prev + 1;
        console.info(`🎬 Slide transition: ${prev} -> ${nextSlide}`);
        // Stop at the end instead of looping
        if (nextSlide >= appScreenshots.length) {
          console.info('🎬 Video reached end, stopping playback');
          setIsPlaying(false); // Stop playing when we reach the end
          return prev; // Stay on the last slide
        }
        return nextSlide;
      });
    }, appScreenshots[currentSlide].duration);

    return () => clearTimeout(timer);
  }, [currentSlide, isPlaying]); // Removed appScreenshots from dependencies to prevent unnecessary re-runs

  // Initialize audio for narration
  useEffect(() => {
    if (typeof window !== 'undefined' && !audioContext) {
      try {
        const ctx = new (window.AudioContext ||
          (window as any).webkitAudioContext)();
        setAudioContext(ctx);
      } catch (error) {
        console.warn('Audio context not available:', error);
      }
    }
  }, [audioContext]);

  // Handle autoPlay prop
  useEffect(() => {
    if (autoPlay && !isPlaying) {
      // Only auto-play on pages that explicitly request it
      setIsPlaying(true);
    }
  }, [autoPlay]);

  // ElevenLabs Text-to-Speech narration with cost protection
  const playNarration = async (text: string) => {
    console.info(
      `🎙️ playNarration called with text: "${text.substring(0, 50)}..."`
    );

    // Cost protection: After 3 full playthroughs, use browser TTS only
    if (playCount >= MAX_PLAYS_PER_SESSION) {
      console.info(
        '🛡️ ElevenLabs usage limit reached for this session. Using browser TTS to control costs.'
      );
      await fallbackToSpeechSynthesis(text);
      return;
    }

    try {
      // First try ElevenLabs for professional voice
      const response = await fetch('/api/ai/voice-conversation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: text,
          conversationId: 'landing-page-narration',
          carrierInfo: { name: 'FleetFlow Demo' },
          useElevenLabs: true,
          voiceId: selectedVoice, // User-selected American voice
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.info('🎙️ Voice API Response:', {
          provider: data.provider,
          hasAudio: !!data.audioUrl,
          voiceUsed: data.voiceUsed,
          fallback: data.fallback,
        });

        // Play ElevenLabs audio if available
        if (data.audioUrl && data.provider === 'elevenlabs') {
          console.info('🎙️ Playing ElevenLabs audio...');
          setIsUsingElevenLabs(true);
          const audio = new Audio(data.audioUrl);
          audio.volume = 0.8;
          audio.onended = () => {
            setIsUsingElevenLabs(false);
            setCurrentAudio(null);
          };
          audio.play().catch(async (error) => {
            console.warn('ElevenLabs audio playback failed:', error);
            setIsUsingElevenLabs(false);
            setCurrentAudio(null);
            await fallbackToSpeechSynthesis(text);
          });
          setCurrentAudio(audio);
          return;
        }
      }

      // Fallback to browser speech synthesis
      await fallbackToSpeechSynthesis(text);
    } catch (error) {
      console.warn('ElevenLabs API error:', error);
      await fallbackToSpeechSynthesis(text);
    }
  };

  // Browser speech synthesis fallback
  const fallbackToSpeechSynthesis = async (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        // Check if speech synthesis is available and has voices
        if (!window.speechSynthesis) {
          console.warn('🔊 Browser TTS not supported');
          return;
        }

        // Stop any current speech
        try {
          window.speechSynthesis.cancel();
        } catch (cancelError) {
          console.warn('🔊 Cancel error before TTS setup:', cancelError);
        }

        const utterance = new SpeechSynthesisUtterance(text);

        // Configure utterance with multiple fallback options
        try {
          utterance.rate = 0.75; // Even slower for more natural delivery
          utterance.pitch = 0.9; // Slightly lower pitch for professional sound
          utterance.volume = 0.9;
          utterance.lang = 'en-US';
        } catch (configError) {
          console.warn(
            '🔊 Some utterance properties not supported, using defaults'
          );
          // Continue with defaults if some properties aren't supported
        }

        // Add event listeners for debugging and user feedback
        utterance.onstart = () => {
          console.info(
            '🔊 Browser TTS started:',
            text.substring(0, 50) + '...'
          );
          setIsUsingElevenLabs(false);
          setIsBrowserSpeaking(true);
        };
        utterance.onend = () => {
          console.info('🔊 Browser TTS ended');
          setIsBrowserSpeaking(false);
        };
        utterance.onpause = () => {
          console.info('🔊 Browser TTS paused');
        };
        utterance.onresume = () => {
          console.info('🔊 Browser TTS resumed');
        };
        utterance.onerror = (error) => {
          // Use console.warn instead of console.error to prevent Next.js error interception
          console.warn('🔊 Browser TTS error details:', error);
          setIsBrowserSpeaking(false);
        };

        // Try to speak
        try {
          window.speechSynthesis.speak(utterance);
        } catch (speakError) {
          console.warn('🔊 Failed to start speech synthesis:', speakError);
        }
      } catch (error) {
        console.warn('Speech synthesis error:', error);
      }
    }
  };

  // Play narration when slide changes - DISABLED to prevent infinite loop
  useEffect(() => {
    // TEMPORARILY DISABLED - TTS causing infinite loops
    console.info(
      `🎙️ Narration disabled for slide ${currentSlide} to prevent infinite loops`
    );
    return;
  }, [currentSlide, isPlaying]); // Removed currentAudio and appScreenshots from dependencies

  // Load voices on mount and initialize TTS
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      console.info('🎙️ Initializing TTS system...');

      // Check if speech synthesis is immediately available
      const initialVoices = window.speechSynthesis.getVoices();
      if (initialVoices.length > 0) {
        setVoicesLoaded(true);
        console.info('🎙️ Voices immediately available:', initialVoices.length);
      }

      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
          setVoicesLoaded(true);
          console.info(
            '🎙️ Available voices loaded:',
            voices.map((v) => `${v.name} (${v.lang})`)
          );
        }
      };

      // Listen for voices to be loaded
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }

      // Load voices immediately if available
      loadVoices();

      // Also listen for the voiceschanged event
      window.speechSynthesis.addEventListener('voiceschanged', loadVoices);

      return () => {
        // Cleanup: remove event listener and safely cancel any ongoing speech
        window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
        try {
          if (
            window.speechSynthesis.speaking ||
            window.speechSynthesis.pending
          ) {
            console.info('🎙️ Cleanup: Canceling speech on component unmount');
            window.speechSynthesis.cancel();
          }
        } catch (cleanupError) {
          console.warn(
            '🎙️ Cleanup: Error canceling speech (safe to ignore):',
            cleanupError
          );
        }
      };
    }
  }, []);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (currentAudio) {
        currentAudio.pause();
      }
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        try {
          window.speechSynthesis.cancel();
        } catch (cancelError) {
          console.warn('🔊 Cancel error in cleanup:', cancelError);
        }
      }
    };
  }, [currentAudio]);

  const currentScreen = appScreenshots[currentSlide];

  // Handle pause/play/replay functionality
  const handlePlayPause = () => {
    if (isPlaying) {
      // Pause: Stop current audio and speech synthesis
      if (currentAudio) {
        currentAudio.pause();
        setCurrentAudio(null);
      }
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        try {
          window.speechSynthesis.cancel();
        } catch (cancelError) {
          console.warn('🔊 Cancel error in cleanup:', cancelError);
        }
      }
      setIsUsingElevenLabs(false);
      setIsPlaying(false);
    } else {
      // Play or Replay
      // Only restart from beginning if we're actually at the last slide and user wants to replay
      if (currentSlide === appScreenshots.length - 1) {
        // User is at the end, restart from beginning and increment play count
        setCurrentSlide(0);
        setPlayCount((prev) => prev + 1);
      }
      // If not at the end, continue from current slide
      setIsPlaying(true);
    }
  };

  // Safety check
  if (!currentScreen) {
    return (
      <div
        style={{
          width: '100%',
          maxWidth: '900px',
          height: '500px',
          borderRadius: '20px',
          border: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(255,255,255,0.05)',
        }}
      >
        <div style={{ color: 'rgba(255,255,255,0.7)' }}>
          Loading FleetFlow Demo...
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '900px',
        height: '500px',
        borderRadius: '20px',
        border: '1px solid rgba(255,255,255,0.1)',
        overflow: 'hidden',
        position: 'relative',
        boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
        background:
          'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)',
      }}
    >
      {/* Clean Video Header */}
      <div
        style={{
          background: 'rgba(255,255,255,0.1)',
          padding: '12px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '8px',
              height: '8px',
              background: '#ef4444',
              borderRadius: '50%',
            }}
           />
          <div
            style={{
              width: '8px',
              height: '8px',
              background: '#f59e0b',
              borderRadius: '50%',
            }}
           />
          <div
            style={{
              width: '8px',
              height: '8px',
              background: '#10b981',
              borderRadius: '50%',
            }}
           />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button
            onClick={handlePlayPause}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              borderRadius: '4px',
              padding: '4px 8px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '12px',
            }}
          >
            {isPlaying
              ? '⏸️ Pause'
              : currentSlide >= appScreenshots.length - 1
                ? '🔄 Replay'
                : '▶️ Play'}
          </button>

          <div
            style={{
              color: 'rgba(255,255,255,0.7)',
              fontSize: '12px',
            }}
          >
            🔴 LIVE: FleetFlow Platform Demo ({currentSlide + 1}/
            {appScreenshots.length})
          </div>
        </div>
      </div>

      {/* Video Content */}
      <div
        style={{
          flex: 1,
          padding: '30px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          position: 'relative',
          height: 'calc(100% - 60px)',
        }}
      >
        <div
          style={{
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '12px',
            padding: '25px',
            width: '100%',
            maxWidth: '700px',
            border: '1px solid rgba(255,255,255,0.1)',
            animation: 'fadeIn 0.5s ease-in-out',
            backdropFilter: 'blur(10px)',
          }}
        >
          <div
            style={{
              background: 'rgba(59,130,246,0.2)',
              borderRadius: '8px',
              padding: '10px 15px',
              marginBottom: '20px',
              display: 'inline-block',
            }}
          >
            <h3
              style={{
                color: '#3b82f6',
                fontSize: '1.3rem',
                fontWeight: '600',
                margin: '0',
              }}
            >
              {currentScreen.title}
            </h3>
          </div>
          <p
            style={{
              color: 'rgba(255,255,255,0.9)',
              fontSize: '1rem',
              marginBottom: '25px',
              lineHeight: '1.5',
            }}
          >
            {currentScreen.description}
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '15px',
              marginBottom: '20px',
            }}
          >
            {currentScreen.features.map((feature, index) => (
              <div
                key={index}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  animation: `slideInFeature 0.6s ease-out ${index * 0.1}s both`,
                }}
              >
                <div
                  style={{
                    color: 'rgba(255,255,255,0.8)',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                  }}
                >
                  ✅ {feature}
                </div>
              </div>
            ))}
          </div>
          <div
            style={{
              background: 'rgba(16,185,129,0.2)',
              color: '#10b981',
              padding: '8px 15px',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: '600',
              display: 'inline-block',
            }}
          >
            📍 Route: {currentScreen.route}
          </div>
        </div>

        {/* Slide Navigation Dots */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '20px' }}>
          {appScreenshots.map((_, index) => (
            <div
              key={index}
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background:
                  index === currentSlide ? '#3b82f6' : 'rgba(255,255,255,0.3)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInFeature {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}
