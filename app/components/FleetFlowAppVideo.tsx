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

  // Function to check and log available voices
  const checkAvailableVoices = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const voices = window.speechSynthesis.getVoices();
      console.info(
        '🎙️ Available Browser Voices:',
        voices.map(
          (v) => `${v.name} (${v.lang}) - ${v.default ? 'DEFAULT' : 'ALT'}`
        )
      );
      return voices.length;
    }
    return 0;
  };

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
        'SAM.gov Integration',
        'Enterprise RFPs',
        'Automated Bidding',
        'Contract Management',
      ],
      narration:
        'Access millions in government contracts and enterprise opportunities through our comprehensive RFx discovery platform.',
      duration: 10000, // Extended for full narration
    },
    {
      title: 'Live Load Tracking',
      description: '30-second GPS updates with customer portals',
      route: '/tracking',
      features: [
        'Real-time GPS',
        'Customer Portals',
        'ETA Predictions',
        'Exception Management',
      ],
      narration:
        'Provide customers with real-time visibility through our advanced tracking system with 30-second GPS updates.',
      duration: 9000, // Extended for full narration
    },
    {
      title: 'Driver Management Portal',
      description: 'Complete driver onboarding and operations',
      route: '/drivers',
      features: [
        'Digital Onboarding',
        'Document Management',
        'Performance Analytics',
        'Mobile App',
      ],
      narration:
        'Streamline driver operations with our comprehensive management portal and mobile app integration.',
      duration: 9000, // Extended for full narration
    },
    {
      title: 'Carrier Network',
      description: 'FMCSA-verified carrier partnerships',
      route: '/carriers',
      features: [
        'FMCSA Verification',
        'Safety Ratings',
        'Capacity Matching',
        'Performance Tracking',
      ],
      narration:
        'Build a reliable carrier network with real-time FMCSA verification and safety monitoring.',
      duration: 9000, // Extended for full narration
    },
    {
      title: 'Financial Intelligence',
      description: 'Complete accounting and billing automation',
      route: '/billing',
      features: [
        'QuickBooks Integration',
        'Automated Invoicing',
        'Bill.com Sync',
        'Revenue Analytics',
      ],
      narration:
        'Automate your entire financial workflow with integrations to QuickBooks, Bill.com, and advanced analytics.',
      duration: 9000, // Extended for full narration
    },
    {
      title: 'FleetFlow University',
      description: 'Comprehensive training and certification',
      route: '/training',
      features: [
        'Interactive Courses',
        'Certifications',
        'Role-based Training',
        'Progress Tracking',
      ],
      narration:
        'Develop your team with our comprehensive training platform covering all aspects of transportation management.',
      duration: 9000, // Extended for full narration
    },
  ];

  // Auto-advance slides
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setTimeout(() => {
      setCurrentSlide((prev) => {
        const nextSlide = prev + 1;
        // Stop at the end instead of looping
        if (nextSlide >= appScreenshots.length) {
          setIsPlaying(false); // Stop playing when we reach the end
          return prev; // Stay on the last slide
        }
        return nextSlide;
      });
    }, appScreenshots[currentSlide].duration);

    return () => clearTimeout(timer);
  }, [currentSlide, isPlaying, appScreenshots]);

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
    // Cost protection: After 3 full playthroughs, use browser TTS only
    if (playCount >= MAX_PLAYS_PER_SESSION) {
      console.info(
        '🛡️ ElevenLabs usage limit reached for this session. Using browser TTS to control costs.'
      );
      fallbackToSpeechSynthesis(text);
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
          audio.play().catch((error) => {
            console.warn('ElevenLabs audio playback failed:', error);
            setIsUsingElevenLabs(false);
            setCurrentAudio(null);
            fallbackToSpeechSynthesis(text);
          });
          setCurrentAudio(audio);
          return;
        }
      }

      // Fallback to browser speech synthesis
      fallbackToSpeechSynthesis(text);
    } catch (error) {
      console.warn('ElevenLabs API error:', error);
      fallbackToSpeechSynthesis(text);
    }
  };

  // Enhanced browser speech synthesis with voice selection
  const fallbackToSpeechSynthesis = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        // Check if speech synthesis is available and has voices
        if (!window.speechSynthesis) {
          console.error('🔊 Browser TTS not supported');
          alert(
            'Speech synthesis is not supported in this browser. Please try Chrome or Firefox.'
          );
          return;
        }
        // Stop any current speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.75; // Even slower for more natural delivery
        utterance.pitch = 0.9; // Slightly lower pitch for professional sound
        utterance.volume = 0.9;
        utterance.lang = 'en-US';

        // Add event listeners for debugging
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
        utterance.onerror = (error) => {
          console.error('🔊 Browser TTS error details:', {
            error: error,
            errorType: error?.error,
            message: error?.message,
            speechSynthesisSupported: !!window.speechSynthesis,
            voicesAvailable: window.speechSynthesis.getVoices().length,
            selectedVoice: selectedVoice,
            textLength: text.length,
          });
          setIsBrowserSpeaking(false);

          // Show user-friendly error message
          alert(
            'Browser voice synthesis failed. This may be due to:\n• Browser compatibility\n• Voice permissions\n• No voices installed\n\nTry Chrome or Firefox, or enable voice permissions in browser settings.'
          );
        };

        // Get available voices and select based on user preference
        const voices = window.speechSynthesis.getVoices();

        // If no voices are loaded yet, wait for them
        if (voices.length === 0) {
          console.warn('🔊 No voices loaded yet, using default');
          // Still try to speak with default voice
        }

        let chosenVoice = null;

        if (selectedVoice.includes('female')) {
          // Look for American female voices
          chosenVoice = voices.find(
            (voice) =>
              voice.lang.includes('en-US') &&
              (voice.name.toLowerCase().includes('samantha') ||
                voice.name.toLowerCase().includes('allison') ||
                voice.name.toLowerCase().includes('ava') ||
                voice.name.toLowerCase().includes('susan') ||
                voice.name.toLowerCase().includes('female'))
          );
        } else if (selectedVoice.includes('male')) {
          // Look for American male voices
          chosenVoice = voices.find(
            (voice) =>
              voice.lang.includes('en-US') &&
              (voice.name.toLowerCase().includes('alex') ||
                voice.name.toLowerCase().includes('daniel') ||
                voice.name.toLowerCase().includes('tom') ||
                voice.name.toLowerCase().includes('male'))
          );
        }

        // Fallback to any good American English voice
        if (!chosenVoice) {
          chosenVoice =
            voices.find(
              (voice) =>
                voice.lang.includes('en-US') &&
                (voice.name.includes('Alex') || voice.name.includes('Samantha'))
            ) || voices.find((voice) => voice.lang.startsWith('en-US'));
        }

        if (chosenVoice) {
          utterance.voice = chosenVoice;
          console.info(
            `🔊 Using enhanced browser voice: ${chosenVoice.name} for ${selectedVoice}`
          );
        } else {
          console.info(
            `🔊 Using default browser voice for ${selectedVoice} (no specific voice found)`
          );
        }

        // Try to speak regardless - default voice will be used if no specific voice found
        try {
          window.speechSynthesis.speak(utterance);
        } catch (speakError) {
          console.error('🔊 Failed to start speech synthesis:', speakError);
          alert(
            'Failed to start speech synthesis. Please check your browser settings.'
          );
        }
      } catch (error) {
        console.warn('Speech synthesis error:', error);
      }
    }
  };

  // Play narration when slide changes
  useEffect(() => {
    if (
      isPlaying &&
      currentSlide >= 0 &&
      currentSlide < appScreenshots.length
    ) {
      // Stop any current audio before starting new narration
      if (currentAudio) {
        currentAudio.pause();
        setCurrentAudio(null);
      }
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsUsingElevenLabs(false);

      const timer = setTimeout(() => {
        playNarration(appScreenshots[currentSlide].narration);
      }, 100); // Small delay to prevent race conditions

      return () => clearTimeout(timer);
    }
  }, [currentSlide, isPlaying, appScreenshots, currentAudio]);

  // Load voices on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
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

      // Load voices immediately if available
      loadVoices();

      // Also listen for the voiceschanged event
      window.speechSynthesis.addEventListener('voiceschanged', loadVoices);

      return () => {
        window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
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
        window.speechSynthesis.cancel();
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
        window.speechSynthesis.cancel();
      }
      setIsUsingElevenLabs(false);
      setIsPlaying(false);
    } else {
      // Play or Replay
      if (currentSlide >= appScreenshots.length - 1) {
        // If at the end, restart from beginning and increment play count
        setCurrentSlide(0);
        setPlayCount((prev) => prev + 1);
      }
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
      {/* Video Controls Header */}
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
          ></div>
          <div
            style={{
              width: '8px',
              height: '8px',
              background: '#f59e0b',
              borderRadius: '50%',
            }}
          ></div>
          <div
            style={{
              width: '8px',
              height: '8px',
              background: '#10b981',
              borderRadius: '50%',
            }}
          ></div>
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

          {/* Voice Test Button */}
          <button
            onClick={() => {
              checkAvailableVoices();
              fallbackToSpeechSynthesis(
                'This is a test of the browser voice synthesis. Can you hear this? If not, check browser settings and try Chrome or Firefox.'
              );
            }}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              borderRadius: '4px',
              padding: '4px 8px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '11px',
              marginRight: '8px',
            }}
            title='Test browser TTS'
          >
            🗣️ Test Voice
          </button>

          {/* Voice Info Button */}
          <button
            onClick={() => {
              const voiceCount = checkAvailableVoices();
              alert(
                `Browser Voices Available: ${voiceCount}\n\nCheck console for details.\n\nIf no voices or voice fails:\n• Try Chrome/Firefox\n• Enable voice permissions\n• Check audio settings`
              );
            }}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              borderRadius: '4px',
              padding: '4px 8px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '11px',
              marginRight: '8px',
            }}
            title='Check voice availability'
          >
            🎙️ Info
          </button>

          {/* Voice Selector */}
          <select
            value={selectedVoice}
            onChange={(e) => setSelectedVoice(e.target.value)}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              borderRadius: '4px',
              padding: '4px 8px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '11px',
            }}
          >
            <option
              value='custom-dee-voice'
              style={{ background: '#1a1a2e', color: 'white' }}
            >
              🎙️ Dee's Custom Voice (Premium)
            </option>
            <option
              value='american-female-professional'
              style={{ background: '#1a1a2e', color: 'white' }}
            >
              🎙️ Rachel (Female)
            </option>
            <option
              value='american-male-professional'
              style={{ background: '#1a1a2e', color: 'white' }}
            >
              🎙️ Josh (Male)
            </option>
            <option
              value='american-female-warm'
              style={{ background: '#1a1a2e', color: 'white' }}
            >
              🎙️ Dorothy (Warm Female)
            </option>
            <option
              value='american-male-authoritative'
              style={{ background: '#1a1a2e', color: 'white' }}
            >
              🎙️ Clyde (Authoritative Male)
            </option>
            <option
              value='american-male-narrator'
              style={{ background: '#1a1a2e', color: 'white' }}
            >
              🎙️ Bill (Narrator Male)
            </option>
          </select>

          <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>
            🔴 LIVE: FleetFlow Platform Demo ({currentSlide + 1}/
            {appScreenshots.length})
            {playCount >= MAX_PLAYS_PER_SESSION && (
              <span style={{ color: '#f59e0b', marginLeft: '8px' }}>
                🛡️ Cost Protection Active
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
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
        {/* Current Screen Display */}
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
          {/* Screen Title */}
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
                margin: 0,
              }}
            >
              {currentScreen.title}
            </h3>
          </div>

          {/* Screen Description */}
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

          {/* Features Grid */}
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

          {/* Route Indicator */}
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

        {/* Progress Indicators */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            marginTop: '20px',
          }}
        >
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

        {/* Audio Indicator */}
        {(isPlaying || isBrowserSpeaking) && (
          <div
            style={{
              position: 'absolute',
              bottom: '20px',
              right: '20px',
              background: isUsingElevenLabs
                ? 'rgba(59,130,246,0.9)'
                : isBrowserSpeaking
                  ? 'rgba(34,197,94,0.9)'
                  : 'rgba(245,158,11,0.9)',
              color: 'white',
              padding: '6px 12px',
              borderRadius: '20px',
              fontSize: '0.7rem',
              fontWeight: '600',
              animation: 'pulse 2s ease-in-out infinite',
            }}
          >
            {isUsingElevenLabs
              ? '🎙️ ElevenLabs AI Voice'
              : isBrowserSpeaking
                ? '🗣️ Browser TTS Speaking'
                : '🔊 Audio Narration'}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
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

        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.05);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
