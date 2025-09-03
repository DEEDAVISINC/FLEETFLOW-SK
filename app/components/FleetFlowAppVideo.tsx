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

  // TTS Diagnostics function for troubleshooting
  const diagnoseTTS = () => {
    console.info('🔊 === TTS DIAGNOSTICS ===');

    const diagnostics = {
      browserSupport: !!window.speechSynthesis,
      speaking: window.speechSynthesis?.speaking || false,
      pending: window.speechSynthesis?.pending || false,
      paused: window.speechSynthesis?.paused || false,
      voicesCount: window.speechSynthesis?.getVoices().length || 0,
      voices:
        window.speechSynthesis?.getVoices().map((v) => ({
          name: v.name,
          lang: v.lang,
          localService: v.localService,
          default: v.default,
        })) || [],
      browser: {
        userAgent: navigator.userAgent,
        language: navigator.language,
        platform: navigator.platform,
        onLine: navigator.onLine,
      },
    };

    console.table(diagnostics);
    console.info('🔊 Voices Details:', diagnostics.voices);

    // Test basic functionality
    if (window.speechSynthesis) {
      try {
        const testUtterance = new SpeechSynthesisUtterance(
          'Test speech synthesis'
        );
        testUtterance.volume = 0.1; // Quiet test
        testUtterance.onstart = () =>
          console.info('🔊 Test speech started successfully');
        testUtterance.onend = () =>
          console.info('🔊 Test speech ended successfully');
        testUtterance.onerror = (e) =>
          console.error('🔊 Test speech failed:', e);

        window.speechSynthesis.speak(testUtterance);
      } catch (error) {
        console.error('🔊 Test speech threw error:', error);
      }
    }

    return diagnostics;
  };

  // Expose diagnostics function globally for console access
  if (typeof window !== 'undefined') {
    (window as any).diagnoseTTS = diagnoseTTS;
  }

  // Enhanced browser speech synthesis with voice selection
  const fallbackToSpeechSynthesis = async (text: string) => {
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
        // Pre-flight checks before attempting TTS
        console.info('🔊 Starting browser TTS diagnostics...');

        // Check browser support
        if (!window.speechSynthesis) {
          console.error('🔊 Speech synthesis not supported');
          alert(
            'Speech synthesis is not supported in this browser. Try using Chrome, Firefox, or Safari.'
          );
          return;
        }

        // Check if browser is already speaking
        if (window.speechSynthesis.speaking) {
          console.warn('🔊 Browser is already speaking, canceling...');
          window.speechSynthesis.cancel();
          // Wait a moment for cancellation
          await new Promise((resolve) => setTimeout(resolve, 100));
        }

        // Check available voices
        let availableVoices = window.speechSynthesis.getVoices();
        console.info(`🔊 Available voices: ${availableVoices.length}`);

        // If no voices loaded yet, wait for them (especially important on some browsers)
        if (availableVoices.length === 0) {
          console.warn('🔊 No voices loaded, waiting...');
          // Some browsers load voices asynchronously
          await new Promise((resolve) => {
            const checkVoices = () => {
              availableVoices = window.speechSynthesis.getVoices();
              if (availableVoices.length > 0) {
                resolve(void 0);
              } else {
                setTimeout(checkVoices, 100);
              }
            };
            setTimeout(checkVoices, 100);
          });
          availableVoices = window.speechSynthesis.getVoices();
          console.info(`🔊 Voices loaded: ${availableVoices.length}`);
        }

        // Final check - if still no voices, warn user
        if (availableVoices.length === 0) {
          console.error('🔊 No voices available after waiting');
          alert(
            'No voice data available. Your browser may need to download voice packs. Try refreshing the page or check browser settings.'
          );
          return;
        }

        console.info('🔊 Pre-flight checks passed, proceeding with TTS...');

        // Stop any current speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);

        // Configure utterance with multiple fallback options
        try {
          utterance.rate = 0.75; // Even slower for more natural delivery
          utterance.pitch = 0.9; // Slightly lower pitch for professional sound
          utterance.volume = 0.9;
          utterance.lang = 'en-US';
        } catch (configError) {
          console.warn('🔊 Some utterance properties not supported, using defaults');
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
          // Enhanced error diagnostics
          const errorDetails = {
            error: error,
            errorType: error?.error || 'unknown',
            message: error?.message || 'No message provided',
            speechSynthesisSupported: !!window.speechSynthesis,
            voicesAvailable: window.speechSynthesis.getVoices().length,
            selectedVoice: selectedVoice,
            textLength: text.length,
            browserInfo: {
              userAgent: navigator.userAgent,
              language: navigator.language,
              platform: navigator.platform,
            },
            speechSynthesisState: {
              speaking: window.speechSynthesis.speaking,
              pending: window.speechSynthesis.pending,
              paused: window.speechSynthesis.paused,
            },
          };

          console.error('🔊 Browser TTS error details:', errorDetails);
          setIsBrowserSpeaking(false);

          // Check for specific error types and provide targeted solutions
          let errorMessage = 'Browser voice synthesis failed. ';
          let troubleshootingSteps = '';

          // Check if speech synthesis is supported
          if (!window.speechSynthesis) {
            errorMessage +=
              'Speech synthesis is not supported in this browser.';
            troubleshootingSteps = 'Try using Chrome, Firefox, or Safari.';
          }
          // Check if voices are available
          else if (window.speechSynthesis.getVoices().length === 0) {
            errorMessage += 'No voices are available.';
            troubleshootingSteps =
              'Your browser may need to download voice data. Try refreshing the page or enabling voice downloads in browser settings.';
          }
          // Check for permission issues
          else if (error?.error === 'not-allowed') {
            errorMessage += 'Voice permissions were denied.';
            troubleshootingSteps =
              'Enable microphone and speech synthesis permissions in your browser settings.';
          }
          // Check for network issues
          else if (error?.error === 'network') {
            errorMessage += 'Network error occurred.';
            troubleshootingSteps =
              'Check your internet connection and try again.';
          }
          // Generic fallback
          else {
            errorMessage +=
              'This may be due to browser compatibility or permissions.';
            troubleshootingSteps =
              'Try:\n• Using Chrome or Firefox\n• Enabling voice permissions\n• Refreshing the page\n• Checking if voice downloads are enabled';
          }

          // Show user-friendly error message with specific guidance
          alert(`${errorMessage}\n\nTroubleshooting:\n${troubleshootingSteps}`);

          // Log additional diagnostic information
          console.warn('🔊 TTS Diagnostics:', {
            voices: window.speechSynthesis.getVoices().map((v) => ({
              name: v.name,
              lang: v.lang,
              localService: v.localService,
              default: v.default,
            })),
            utterance: {
              rate: utterance.rate,
              pitch: utterance.pitch,
              volume: utterance.volume,
              lang: utterance.lang,
            },
          });
        };

        // Get available voices and select based on user preference
        let voiceList = window.speechSynthesis.getVoices();

        // If no voices are loaded yet, wait for them with better error handling
        if (voiceList.length === 0) {
          console.warn('🔊 No voices loaded yet, attempting to load...');

          // Try to trigger voice loading on some browsers
          try {
            // Create a dummy utterance to trigger voice loading
            const dummyUtterance = new SpeechSynthesisUtterance('');
            window.speechSynthesis.speak(dummyUtterance);
            window.speechSynthesis.cancel(); // Cancel immediately

            // Wait a bit for voices to load
            await new Promise(resolve => setTimeout(resolve, 500));
            voiceList = window.speechSynthesis.getVoices();

            if (voiceList.length === 0) {
              console.error('🔊 Still no voices after loading attempt');
              throw new Error('No voices available');
            }
          } catch (loadError) {
            console.error('🔊 Voice loading failed:', loadError);
            // Continue without voice selection - let browser use default
          }
        }

        let chosenVoice = null;

        if (selectedVoice.includes('female')) {
          // Look for American female voices
          chosenVoice = voiceList.find(
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
          chosenVoice = voiceList.find(
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
            voiceList.find(
              (voice) =>
                voice.lang.includes('en-US') &&
                (voice.name.includes('Alex') || voice.name.includes('Samantha'))
            ) || voiceList.find((voice) => voice.lang.startsWith('en-US'));
        }

        if (chosenVoice) {
          try {
            utterance.voice = chosenVoice;
            console.info(
              `🔊 Using enhanced browser voice: ${chosenVoice.name} for ${selectedVoice}`
            );
          } catch (voiceError) {
            console.warn('🔊 Voice assignment failed, using browser default');
            chosenVoice = null; // Reset to use default
          }
        } else {
          console.info(
            `🔊 Using default browser voice for ${selectedVoice} (no specific voice found)`
          );
        }

        // Try to speak with enhanced error handling
        try {
          console.info('🔊 Attempting to speak...');
          window.speechSynthesis.speak(utterance);
          console.info('🔊 Speech synthesis initiated successfully');
        } catch (speakError) {
          console.error('🔊 Failed to start speech synthesis:', speakError);

          // Last resort: try without any voice selection
          try {
            console.info('🔊 Attempting fallback without voice selection...');
            const fallbackUtterance = new SpeechSynthesisUtterance(text);
            window.speechSynthesis.speak(fallbackUtterance);
            console.info('🔊 Fallback speech synthesis initiated');
          } catch (fallbackError) {
            console.error('🔊 All speech synthesis attempts failed:', fallbackError);
            throw new Error('All speech synthesis attempts failed');
          }
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
            onClick={async () => {
              checkAvailableVoices();
              await fallbackToSpeechSynthesis(
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

          {/* TTS Diagnostics Button */}
          <button
            onClick={() => {
              const diagnostics = diagnoseTTS();
              alert(
                `TTS Diagnostics Complete!\n\nBrowser Support: ${diagnostics.browserSupport ? '✅' : '❌'}\nVoices Available: ${diagnostics.voicesCount}\nSpeaking: ${diagnostics.speaking ? '✅' : '❌'}\n\nCheck browser console for detailed information.\n\nTest speech played at low volume.`
              );
            }}
            style={{
              background: 'rgba(255,165,0,0.3)',
              color: 'white',
              border: '1px solid rgba(255,165,0,0.5)',
              padding: '6px 12px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '11px',
              marginRight: '8px',
            }}
            title='Run TTS diagnostics'
          >
            🔧 Diagnose
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
