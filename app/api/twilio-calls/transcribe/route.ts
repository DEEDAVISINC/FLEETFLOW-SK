/**
 * Twilio Transcription Webhook Handler
 * Processes voicemail transcriptions and stores them
 */

import { NextRequest, NextResponse } from 'next/server';

interface TwilioTranscriptionWebhook {
  TranscriptionSid: string;
  TranscriptionText: string;
  TranscriptionStatus: string;
  CallSid: string;
  RecordingSid: string;
  RecordingUrl?: string;
  From: string;
  To: string;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Parse Twilio webhook data (form-encoded)
    const formData = await request.formData();
    const transcriptionData: TwilioTranscriptionWebhook = {
      TranscriptionSid: formData.get('TranscriptionSid') as string,
      TranscriptionText: formData.get('TranscriptionText') as string,
      TranscriptionStatus: formData.get('TranscriptionStatus') as string,
      CallSid: formData.get('CallSid') as string,
      RecordingSid: formData.get('RecordingSid') as string,
      RecordingUrl: formData.get('RecordingUrl') as string,
      From: formData.get('From') as string,
      To: formData.get('To') as string,
    };

    console.log(`📝 Voicemail Transcription Received:`, {
      transcriptionSid: transcriptionData.TranscriptionSid,
      callSid: transcriptionData.CallSid,
      from: transcriptionData.From,
      to: transcriptionData.To,
      status: transcriptionData.TranscriptionStatus,
      textLength: transcriptionData.TranscriptionText?.length || 0,
    });

    if (transcriptionData.TranscriptionStatus === 'completed') {
      // Process successful transcription
      await processVoicemailTranscription(transcriptionData);

      // Send notification to relevant parties
      await notifyVoicemailReceived(transcriptionData);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Transcription webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function processVoicemailTranscription(
  transcriptionData: TwilioTranscriptionWebhook
): Promise<void> {
  // In production, this would save to database
  const voicemailRecord = {
    transcriptionSid: transcriptionData.TranscriptionSid,
    callSid: transcriptionData.CallSid,
    recordingSid: transcriptionData.RecordingSid,
    recordingUrl: transcriptionData.RecordingUrl,
    fromNumber: transcriptionData.From,
    toNumber: transcriptionData.To,
    transcriptionText: transcriptionData.TranscriptionText,
    status: transcriptionData.TranscriptionStatus,
    receivedAt: new Date().toISOString(),
    processed: true,
  };

  console.log(`💾 Voicemail Transcription Saved:`, {
    transcriptionSid: voicemailRecord.transcriptionSid,
    fromNumber: voicemailRecord.fromNumber,
    transcriptionLength: voicemailRecord.transcriptionText?.length || 0,
    receivedAt: voicemailRecord.receivedAt,
  });

  // TODO: Save to database
  // await database.voicemails.create(voicemailRecord);

  // TODO: Process with AI for priority/urgency detection
  // const urgencyAnalysis = await analyzeVoicemailUrgency(transcriptionData.TranscriptionText);
}

async function notifyVoicemailReceived(
  transcriptionData: TwilioTranscriptionWebhook
): Promise<void> {
  // Determine which tenant received the voicemail based on the 'To' number
  const receivingNumber = transcriptionData.To;

  // In production, this would:
  // 1. Look up which tenant owns the receiving phone number
  // 2. Send email/SMS notification to tenant's team
  // 3. Create dashboard notification
  // 4. Trigger any automated workflows

  console.log(`📧 Voicemail Notification Sent:`, {
    receivingNumber,
    fromNumber: transcriptionData.From,
    transcriptionPreview:
      transcriptionData.TranscriptionText?.substring(0, 100) + '...',
    notificationMethods: ['email', 'dashboard', 'sms'],
  });

  // TODO: Implement actual notifications
  // await emailService.sendVoicemailNotification({
  //   tenantId: tenantId,
  //   fromNumber: transcriptionData.From,
  //   transcription: transcriptionData.TranscriptionText,
  //   recordingUrl: transcriptionData.RecordingUrl
  // });
}


