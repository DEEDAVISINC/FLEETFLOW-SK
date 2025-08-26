'use client';

/**
 * Twilio Transcription Webhook Handler
 * Processes voicemail transcriptions and stores them with AI analysis
 */

import { NextRequest, NextResponse } from 'next/server';
import { CallDatabaseService } from '../../../services/CallDatabaseService';

interface TwilioTranscriptionWebhook {
  TranscriptionSid: string;
  TranscriptionText: string;
  TranscriptionStatus: string;
  CallSid: string;
  RecordingUrl?: string;
  RecordingSid?: string;
}

export async function POST(request: NextRequest) {
  try {
    const webhookData = await request.formData();

    // Convert FormData to plain object
    const data: Record<string, string> = {};
    webhookData.forEach((value, key) => {
      data[key] = value.toString();
    });

    // Parse as TwilioTranscriptionWebhook
    const transcriptionData: TwilioTranscriptionWebhook = {
      TranscriptionSid: data.TranscriptionSid,
      TranscriptionText: data.TranscriptionText,
      TranscriptionStatus: data.TranscriptionStatus,
      CallSid: data.CallSid,
      RecordingUrl: data.RecordingUrl,
      RecordingSid: data.RecordingSid,
    };

    // Save the transcription
    await CallDatabaseService.saveTranscription(
      transcriptionData.CallSid,
      transcriptionData.TranscriptionText
    );

    return NextResponse.json(
      { success: true, message: 'Transcription processed successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing Twilio transcription webhook:', error);
    return NextResponse.json(
      { error: 'Failed to process transcription' },
      { status: 500 }
    );
  }
}
