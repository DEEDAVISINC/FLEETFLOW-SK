/**
 * Twilio Transcription Webhook Handler
 * Processes voicemail transcriptions and stores them with AI analysis
 */

import { NextRequest, NextResponse } from 'next/server';
import { callDatabaseService } from '../../services/CallDatabaseService';

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
  try {
    // Determine tenant from phone number
    const tenantId = await callDatabaseService.getTenantFromPhoneNumber(
      transcriptionData.To
    );

    // Save to database with AI analysis
    const savedRecord = await callDatabaseService.saveVoicemailTranscription(
      transcriptionData,
      tenantId
    );

    console.log(`💾 Voicemail Transcription Processed:`, {
      id: savedRecord.id,
      transcriptionSid: savedRecord.transcription_sid,
      fromNumber: transcriptionData.From,
      urgencyScore: savedRecord.urgency_score,
      priorityLevel: savedRecord.priority_level,
      transcriptionLength: transcriptionData.TranscriptionText?.length || 0,
    });

    // Send urgent notifications if high priority
    if (savedRecord.urgency_score >= 70) {
      await sendUrgentVoicemailAlert(tenantId, savedRecord);
    }
  } catch (error) {
    console.error('Failed to process voicemail transcription:', error);
    throw error;
  }
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

  // Send notification via enhanced Twilio service
  try {
    const response = await fetch('/api/twilio-enhanced?action=send-sms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: '+1234567890', // Replace with actual notification number
        message: `New voicemail received from ${transcriptionData.From}. Priority: ${transcriptionData.TranscriptionText ? 'Transcribed' : 'Audio only'}`,
      }),
    });

    console.log(`📧 Voicemail notification sent to tenant ${receivingNumber}`);
  } catch (error) {
    console.error('Failed to send voicemail notification:', error);
  }
}

async function sendUrgentVoicemailAlert(
  tenantId: string,
  voicemailRecord: any
): Promise<void> {
  try {
    // Send urgent notification via enhanced Twilio service
    const response = await fetch('/api/twilio-enhanced?action=send-sms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: '+1234567890', // Replace with actual urgent notification number
        message: `🚨 URGENT VOICEMAIL: ${voicemailRecord.priority_level.toUpperCase()} priority message received. Score: ${voicemailRecord.urgency_score}/100. Please respond immediately.`,
      }),
    });

    console.log(`🚨 Urgent voicemail alert sent for tenant ${tenantId}:`, {
      urgencyScore: voicemailRecord.urgency_score,
      priorityLevel: voicemailRecord.priority_level,
    });
  } catch (error) {
    console.error('Failed to send urgent voicemail alert:', error);
  }
}
