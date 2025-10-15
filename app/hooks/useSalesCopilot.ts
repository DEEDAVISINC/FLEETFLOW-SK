/**
 * React Hook for Sales Copilot Integration
 * Provides real-time sales guidance to human agents during calls
 */

'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  SalesCallContext,
  SalesGuidance,
  salesCopilotAI,
} from '../services/SalesCopilotAI';
import { webSocketNotificationService } from '../services/WebSocketNotificationService';

export interface SalesCopilotHookReturn {
  // Call management
  startCallGuidance: (callId: string, prospectInfo?: any) => Promise<void>;
  endCallGuidance: (
    callId: string,
    outcome: 'won' | 'lost' | 'follow_up'
  ) => Promise<void>;
  updateProspectInfo: (callId: string, updates: any) => void;

  // Real-time guidance
  processConversation: (
    callId: string,
    agentMessage: string,
    prospectResponse: string
  ) => Promise<void>;
  currentGuidance: SalesGuidance[];
  callContext: SalesCallContext | null;

  // UI state
  isConnected: boolean;
  isProcessing: boolean;
  connectionStatus: string;

  // Guidance management
  dismissGuidance: (guidanceId: string) => void;
  markGuidanceUsed: (guidanceId: string) => void;

  // NEW ENHANCED FEATURES
  // Before Call
  researchProspect: (
    prospectName?: string,
    companyName?: string,
    industry?: string
  ) => Promise<any>;

  // During Call
  getSentimentAnalysis: (prospectStatements: string[]) => any;
  getTalkToListenRatio: (agentTime: number, prospectTime: number) => number;

  // After Call
  generateCallInsights: (
    callId: string,
    transcript: string,
    sentiment: any,
    ratio: number
  ) => Promise<any>;
  startCallRecording: (callId: string) => Promise<any>;
  generateTranscript: (recordingUrl: string) => Promise<string>;

  // NEW REAL-TIME SPEECH PROCESSING
  startRealTimeSpeechRecognition: (
    callId: string,
    config?: any
  ) => Promise<boolean>;
  stopRealTimeSpeechRecognition: (callId: string) => void;
  getTranscriptionHistory: (callId: string) => any[];
  getRealTalkToListenRatio: (callId: string) => number;
}

export function useSalesCopilot(agentId: string): SalesCopilotHookReturn {
  const [currentGuidance, setCurrentGuidance] = useState<SalesGuidance[]>([]);
  const [callContext, setCallContext] = useState<SalesCallContext | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [guidanceHistory, setGuidanceHistory] = useState<
    Map<string, SalesGuidance>
  >(new Map());

  // Initialize WebSocket connection
  useEffect(() => {
    const initWebSocket = async () => {
      try {
        // WebSocket service is already initialized globally
        setIsConnected(
          webSocketNotificationService.getConnectionStatus().connected
        );
        setConnectionStatus('connected');
      } catch (error) {
        console.error('Failed to initialize WebSocket:', error);
        setConnectionStatus('error');
      }
    };

    initWebSocket();

    // Set up message handler for sales copilot guidance
    const messageHandler = (message: any) => {
      if (
        message.type === 'notification' &&
        message.service === 'sales-copilot'
      ) {
        const { callId, guidance, context } = message.data;

        if (guidance) {
          // Add unique ID to guidance
          const guidanceWithId = {
            ...guidance,
            id: `${callId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            timestamp: new Date(),
          };

          setCurrentGuidance((prev) => {
            // Filter out old guidance for this call
            const filtered = prev.filter((g) => g.callId !== callId);
            return [...filtered, guidanceWithId].slice(-5); // Keep last 5 guidance items
          });

          // Store in history
          setGuidanceHistory(
            (prev) => new Map(prev.set(guidanceWithId.id, guidanceWithId))
          );
        }

        if (context) {
          setCallContext(context);
        }
      }
    };

    const unsubscribeSalesCopilot = webSocketNotificationService.onMessage(
      'sales-copilot',
      messageHandler
    );

    // Monitor connection status
    const statusHandler = (status: any) => {
      setIsConnected(status.connected);
      setConnectionStatus(status.connected ? 'connected' : 'disconnected');
    };

    const unsubscribeStatus = webSocketNotificationService.onMessage(
      'connection_status',
      statusHandler
    );

    return () => {
      unsubscribeSalesCopilot();
      unsubscribeStatus();
    };
  }, [agentId]);

  // Start call guidance
  const startCallGuidance = useCallback(
    async (callId: string, prospectInfo?: any) => {
      try {
        setIsProcessing(true);
        await salesCopilotAI.startCallGuidance(callId, agentId, prospectInfo);
        setCallContext(salesCopilotAI.getActiveCallContext(callId));
      } catch (error) {
        console.error('Failed to start call guidance:', error);
      } finally {
        setIsProcessing(false);
      }
    },
    [agentId]
  );

  // End call guidance
  const endCallGuidance = useCallback(
    async (callId: string, outcome: 'won' | 'lost' | 'follow_up') => {
      try {
        await salesCopilotAI.endCallGuidance(callId, outcome);
        setCallContext(null);
        setCurrentGuidance((prev) => prev.filter((g) => g.callId !== callId));
      } catch (error) {
        console.error('Failed to end call guidance:', error);
      }
    },
    []
  );

  // Update prospect information
  const updateProspectInfo = useCallback((callId: string, updates: any) => {
    salesCopilotAI.updateProspectInfo(callId, updates);
    setCallContext(salesCopilotAI.getActiveCallContext(callId));
  }, []);

  // Process conversation input
  const processConversation = useCallback(
    async (callId: string, agentMessage: string, prospectResponse: string) => {
      try {
        setIsProcessing(true);
        await salesCopilotAI.processConversationInput(
          callId,
          agentMessage,
          prospectResponse
        );

        // Update local context
        setCallContext(salesCopilotAI.getActiveCallContext(callId));
      } catch (error) {
        console.error('Failed to process conversation:', error);
      } finally {
        setIsProcessing(false);
      }
    },
    []
  );

  // Dismiss guidance
  const dismissGuidance = useCallback((guidanceId: string) => {
    setCurrentGuidance((prev) => prev.filter((g) => g.id !== guidanceId));
  }, []);

  // Mark guidance as used
  const markGuidanceUsed = useCallback(
    (guidanceId: string) => {
      const guidance = guidanceHistory.get(guidanceId);
      if (guidance) {
        // Update guidance history to mark as used
        setGuidanceHistory((prev) => {
          const updated = new Map(prev);
          updated.set(guidanceId, { ...guidance, used: true });
          return updated;
        });
      }
    },
    [guidanceHistory]
  );

  // NEW ENHANCED FEATURES IMPLEMENTATION

  // Research prospect before call
  const researchProspect = useCallback(
    async (prospectName?: string, companyName?: string, industry?: string) => {
      try {
        setIsProcessing(true);
        const research = await salesCopilotAI.researchProspect(
          prospectName,
          companyName,
          industry
        );
        return research;
      } catch (error) {
        console.error('Failed to research prospect:', error);
        return null;
      } finally {
        setIsProcessing(false);
      }
    },
    []
  );

  // Get real-time sentiment analysis
  const getSentimentAnalysis = useCallback((prospectStatements: string[]) => {
    return salesCopilotAI.analyzeSentiment([], prospectStatements);
  }, []);

  // Calculate talk-to-listen ratio
  const getTalkToListenRatio = useCallback(
    (agentTime: number, prospectTime: number) => {
      return salesCopilotAI.calculateTalkToListenRatio(agentTime, prospectTime);
    },
    []
  );

  // Generate call insights after call
  const generateCallInsights = useCallback(
    async (
      callId: string,
      transcript: string,
      sentiment: any,
      ratio: number
    ) => {
      try {
        setIsProcessing(true);
        const insights = await salesCopilotAI.generateCallInsights(
          callId,
          transcript,
          sentiment,
          ratio
        );
        return insights;
      } catch (error) {
        console.error('Failed to generate call insights:', error);
        return null;
      } finally {
        setIsProcessing(false);
      }
    },
    []
  );

  // Start call recording
  const startCallRecording = useCallback(async (callId: string) => {
    try {
      setIsProcessing(true);
      const recording = await salesCopilotAI.startCallRecording(callId);
      return recording;
    } catch (error) {
      console.error('Failed to start call recording:', error);
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  // Generate transcript
  const generateTranscript = useCallback(async (recordingUrl: string) => {
    try {
      setIsProcessing(true);
      const transcript = await salesCopilotAI.generateTranscript(recordingUrl);
      return transcript;
    } catch (error) {
      console.error('Failed to generate transcript:', error);
      return '';
    } finally {
      setIsProcessing(false);
    }
  }, []);

  // NEW REAL-TIME SPEECH PROCESSING IMPLEMENTATIONS

  const startRealTimeSpeechRecognition = useCallback(
    async (callId: string, config?: any) => {
      try {
        setIsProcessing(true);
        const success = await salesCopilotAI.startRealTimeSpeechRecognition(
          callId,
          config
        );
        return success;
      } catch (error) {
        console.error('Failed to start real-time speech recognition:', error);
        return false;
      } finally {
        setIsProcessing(false);
      }
    },
    []
  );

  const stopRealTimeSpeechRecognition = useCallback((callId: string) => {
    salesCopilotAI.stopRealTimeSpeechRecognition(callId);
  }, []);

  const getTranscriptionHistory = useCallback((callId: string) => {
    return salesCopilotAI.getTranscriptionHistory(callId);
  }, []);

  const getRealTalkToListenRatio = useCallback((callId: string) => {
    return salesCopilotAI.calculateRealTalkToListenRatio(callId);
  }, []);

  return {
    startCallGuidance,
    endCallGuidance,
    updateProspectInfo,
    processConversation,
    currentGuidance,
    callContext,
    isConnected,
    isProcessing,
    connectionStatus,
    dismissGuidance,
    markGuidanceUsed,

    // NEW ENHANCED FEATURES
    researchProspect,
    getSentimentAnalysis,
    getTalkToListenRatio,
    generateCallInsights,
    startCallRecording,
    generateTranscript,

    // NEW REAL-TIME SPEECH PROCESSING
    startRealTimeSpeechRecognition,
    stopRealTimeSpeechRecognition,
    getTranscriptionHistory,
    getRealTalkToListenRatio,
  };
}
