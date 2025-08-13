import { NextRequest, NextResponse } from 'next/server';
import { ElevenLabsVoiceService } from '../../../../lib/claude-ai-service';
import FreightConversationAI, {
  FreightCallContext,
} from '../../../services/FreightConversationAI';

const conversationAI = new FreightConversationAI();
const elevenLabsVoice = new ElevenLabsVoiceService();

// Store active call contexts (in production, use Redis or database)
const activeCallContexts = new Map<string, FreightCallContext>();

export async function POST(request: NextRequest) {
  try {
    const { callId, userInput, context, message, conversationId, voiceId } =
      await request.json();

    // Handle landing page narration requests
    if (conversationId === 'landing-page-narration' && message) {
      console.log(
        `🎙️ Landing page narration request: voice=${voiceId}, text="${message.substring(0, 50)}..."`
      );

      try {
        const result = await elevenLabsVoice.textToSpeech(message, voiceId);
        if (result.success && result.audioUrl) {
          console.log(`✅ ElevenLabs success for voice: ${voiceId}`);
          return NextResponse.json({
            success: true,
            response: message,
            audioUrl: result.audioUrl,
            isNarration: true,
            voiceUsed: voiceId || 'american-female-professional',
            provider: 'elevenlabs',
          });
        }
      } catch (error) {
        console.warn('ElevenLabs narration failed:', error);
      }

      // Always return success so browser TTS can handle it
      console.log(
        `🔊 Falling back to enhanced browser TTS for voice: ${voiceId}`
      );
      return NextResponse.json({
        success: true,
        response: message,
        audioUrl: null,
        isNarration: true,
        fallback: true,
        voiceUsed: voiceId || 'american-female-professional',
        provider: 'browser-enhanced',
      });
    }

    if (!callId || !userInput) {
      return NextResponse.json(
        {
          success: false,
          error: 'Call ID and user input required',
        },
        { status: 400 }
      );
    }

    // Get or create call context
    let callContext = activeCallContexts.get(callId);
    if (!callContext) {
      callContext = {
        callId,
        callType: 'inbound_inquiry',
        conversationStage: 'greeting',
        aiConfidence: 0.8,
        transferRequired: false,
        ...context, // Allow override from request
      };
      activeCallContexts.set(callId, callContext);
    }

    // Process the conversation
    const response = await conversationAI.processCarrierCall(
      userInput,
      callContext
    );

    // Update context with any changes
    if (response.nextStage) {
      callContext.conversationStage = response.nextStage as any;
    }
    if (response.dataCollected) {
      if (response.dataCollected.mcNumber || response.dataCollected.dotNumber) {
        callContext.carrierInfo = {
          ...callContext.carrierInfo,
          ...response.dataCollected,
        };
      }
      if (response.dataCollected.loadRequirements) {
        callContext.loadInfo = {
          ...callContext.loadInfo,
          ...response.dataCollected.loadRequirements,
        };
      }
    }
    callContext.aiConfidence = response.confidence;
    callContext.transferRequired = response.requiresHumanReview;

    // Save updated context
    activeCallContexts.set(callId, callContext);

    // Generate voice audio if ElevenLabs is configured
    let audioUrl = null;
    const elevenLabsEnabled = process.env.TTS_PROVIDER === 'elevenlabs';

    if (elevenLabsEnabled) {
      const voiceResult = await elevenLabsVoice.textToSpeech(
        response.response,
        process.env.ELEVENLABS_VOICE_ID
      );

      if (voiceResult.success && voiceResult.audioUrl) {
        audioUrl = voiceResult.audioUrl;
      }
    }

    // Clean up completed calls
    if (response.action === 'end_call') {
      activeCallContexts.delete(callId);
    }

    return NextResponse.json({
      success: true,
      response: response.response,
      action: response.action,
      confidence: response.confidence,
      requiresHumanReview: response.requiresHumanReview,
      conversationStage: callContext.conversationStage,
      context: callContext,
      audioUrl: audioUrl, // ElevenLabs audio URL if available
      hasVoice: !!audioUrl,
    });
  } catch (error) {
    console.error('Voice conversation AI error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'AI processing failed',
        response:
          "I apologize, but I'm experiencing technical difficulties. Let me transfer you to one of our human brokers right away.",
        action: 'transfer',
        requiresHumanReview: true,
      },
      { status: 500 }
    );
  }
}

// Get call context for debugging/monitoring
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const callId = searchParams.get('callId');

  if (!callId) {
    return NextResponse.json(
      {
        success: false,
        error: 'Call ID required',
      },
      { status: 400 }
    );
  }

  const context = activeCallContexts.get(callId);

  return NextResponse.json({
    success: true,
    context: context || null,
    activeCallsCount: activeCallContexts.size,
  });
}

// Manually transfer call to human
export async function PUT(request: NextRequest) {
  try {
    const { callId, reason } = await request.json();

    if (!callId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Call ID required',
        },
        { status: 400 }
      );
    }

    const context = activeCallContexts.get(callId);
    if (!context) {
      return NextResponse.json(
        {
          success: false,
          error: 'Call context not found',
        },
        { status: 404 }
      );
    }

    // Mark for human transfer
    context.transferRequired = true;
    context.aiConfidence = 0.3;
    activeCallContexts.set(callId, context);

    // Log transfer reason for analytics
    console.log(`Call ${callId} transferred to human. Reason: ${reason}`);

    return NextResponse.json({
      success: true,
      message: 'Call marked for human transfer',
      transferReason: reason,
      context,
    });
  } catch (error) {
    console.error('Call transfer error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Transfer request failed',
      },
      { status: 500 }
    );
  }
}

// Delete call context (cleanup)
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const callId = searchParams.get('callId');

  if (!callId) {
    return NextResponse.json(
      {
        success: false,
        error: 'Call ID required',
      },
      { status: 400 }
    );
  }

  const deleted = activeCallContexts.delete(callId);

  return NextResponse.json({
    success: true,
    deleted,
    remainingCalls: activeCallContexts.size,
  });
}
