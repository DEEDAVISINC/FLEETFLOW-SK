// Enhanced Call Database Service for Twilio Integration
import { createClient } from '@supabase/supabase-js';
import { enhancedClaudeAIService } from './EnhancedClaudeAIService';

interface CallRecord {
  tenant_id: string;
  call_sid: string;
  from_number: string;
  to_number: string;
  direction: string;
  status: string;
  duration?: number;
  cost?: number;
  currency?: string;
  start_time?: string;
  end_time?: string;
}

interface VoicemailTranscription {
  tenant_id: string;
  call_sid: string;
  transcription_sid: string;
  recording_sid?: string;
  recording_url?: string;
  transcription_text: string;
  transcription_status: string;
  urgency_score?: number;
  priority_level?: string;
  ai_analysis?: any;
  processed?: boolean;
}

interface AIAnalysisResult {
  urgencyLevel: 'critical' | 'high' | 'medium' | 'low';
  urgencyScore: number;
  category: string;
  keyPoints: string[];
  suggestedAction: string;
  estimatedValue: 'high' | 'medium' | 'low';
  requiresImmediate: boolean;
  summary: string;
}

export class CallDatabaseService {
  private supabase;

  constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
  }

  /**
   * Save call record to database
   */
  async saveCallRecord(callData: any, tenantId: string): Promise<any> {
    try {
      const callRecord: CallRecord = {
        tenant_id: tenantId,
        call_sid: callData.CallSid,
        from_number: callData.From,
        to_number: callData.To,
        direction: callData.Direction || 'inbound',
        status: callData.CallStatus,
        duration: parseInt(callData.CallDuration || '0'),
        cost: parseFloat(callData.Price || '0'),
        currency: callData.PriceUnit || 'USD',
        start_time: callData.StartTime,
        end_time: callData.EndTime,
      };

      const { data, error } = await this.supabase
        .from('call_records')
        .insert(callRecord)
        .select()
        .single();

      if (error) {
        console.error('Error saving call record:', error);
        throw error;
      }

      console.log('✅ Call record saved:', {
        id: data.id,
        call_sid: data.call_sid,
        status: data.status,
        duration: data.duration,
      });

      return data;
    } catch (error) {
      console.error('Failed to save call record:', error);
      throw error;
    }
  }

  /**
   * Update existing call record
   */
  async updateCallRecord(
    callSid: string,
    updateData: Partial<CallRecord>
  ): Promise<any> {
    try {
      const { data, error } = await this.supabase
        .from('call_records')
        .update({
          ...updateData,
          updated_at: new Date().toISOString(),
        })
        .eq('call_sid', callSid)
        .select()
        .single();

      if (error) {
        console.error('Error updating call record:', error);
        throw error;
      }

      console.log('✅ Call record updated:', {
        call_sid: callSid,
        status: data.status,
      });

      return data;
    } catch (error) {
      console.error('Failed to update call record:', error);
      throw error;
    }
  }

  /**
   * Save voicemail transcription with AI analysis
   */
  async saveVoicemailTranscription(
    transcriptionData: any,
    tenantId: string
  ): Promise<any> {
    try {
      // Perform AI analysis on transcription
      const aiAnalysis = await this.analyzeVoicemailUrgency(
        transcriptionData.TranscriptionText
      );

      const voicemailRecord: VoicemailTranscription = {
        tenant_id: tenantId,
        call_sid: transcriptionData.CallSid,
        transcription_sid: transcriptionData.TranscriptionSid,
        recording_sid: transcriptionData.RecordingSid,
        recording_url: transcriptionData.RecordingUrl,
        transcription_text: transcriptionData.TranscriptionText,
        transcription_status: transcriptionData.TranscriptionStatus,
        urgency_score: aiAnalysis.urgencyScore,
        priority_level: aiAnalysis.urgencyLevel,
        ai_analysis: aiAnalysis,
        processed: true,
      };

      const { data, error } = await this.supabase
        .from('voicemail_transcriptions')
        .insert(voicemailRecord)
        .select()
        .single();

      if (error) {
        console.error('Error saving voicemail transcription:', error);
        throw error;
      }

      console.log('✅ Voicemail transcription saved:', {
        id: data.id,
        transcription_sid: data.transcription_sid,
        urgency_score: data.urgency_score,
        priority_level: data.priority_level,
      });

      return data;
    } catch (error) {
      console.error('Failed to save voicemail transcription:', error);
      throw error;
    }
  }

  /**
   * AI-powered voicemail urgency analysis
   */
  private async analyzeVoicemailUrgency(
    transcriptionText: string
  ): Promise<AIAnalysisResult> {
    if (!transcriptionText || transcriptionText.trim().length === 0) {
      return this.getDefaultAnalysis();
    }

    try {
      // Use enhanced Claude AI service for analysis
      const analysisPrompt = `
Analyze this voicemail transcription for a freight/logistics company and provide urgency assessment:

Transcription: "${transcriptionText}"

Analyze for:
1. Urgency level (critical/high/medium/low)
2. Business category (load_inquiry/payment_issue/emergency/general/complaint/breakdown)
3. Key points mentioned
4. Suggested response action
5. Estimated business value
6. Whether immediate response is required

Respond in JSON format:
{
  "urgencyLevel": "critical|high|medium|low",
  "urgencyScore": 0-100,
  "category": "load_inquiry|payment_issue|emergency|general|complaint|breakdown",
  "keyPoints": ["point1", "point2", "point3"],
  "suggestedAction": "immediate_callback|schedule_callback|email_response|no_action",
  "estimatedValue": "high|medium|low",
  "requiresImmediate": true/false,
  "summary": "brief summary of the voicemail content and urgency"
}`;

      const response = await enhancedClaudeAIService.generateResponseWithRetry({
        prompt: analysisPrompt,
        maxTokens: 500,
        temperature: 0.3,
        fallbackEnabled: true,
      });

      if (response.success && response.content) {
        try {
          // Try to parse AI response as JSON
          const aiResult = JSON.parse(response.content);

          // Validate and normalize the result
          return {
            urgencyLevel: this.normalizeUrgencyLevel(aiResult.urgencyLevel),
            urgencyScore: Math.min(
              Math.max(aiResult.urgencyScore || 50, 0),
              100
            ),
            category: aiResult.category || 'general',
            keyPoints: Array.isArray(aiResult.keyPoints)
              ? aiResult.keyPoints
              : [transcriptionText.substring(0, 100)],
            suggestedAction: aiResult.suggestedAction || 'schedule_callback',
            estimatedValue: aiResult.estimatedValue || 'medium',
            requiresImmediate: Boolean(aiResult.requiresImmediate),
            summary: aiResult.summary || 'Voicemail received and analyzed',
          };
        } catch (parseError) {
          console.warn(
            'Failed to parse AI analysis JSON, using fallback:',
            parseError
          );
          return this.performBasicAnalysis(transcriptionText);
        }
      } else {
        console.warn('AI analysis failed, using basic analysis');
        return this.performBasicAnalysis(transcriptionText);
      }
    } catch (error) {
      console.error('AI voicemail analysis error:', error);
      return this.performBasicAnalysis(transcriptionText);
    }
  }

  /**
   * Basic keyword-based analysis fallback
   */
  private performBasicAnalysis(text: string): AIAnalysisResult {
    const lowerText = text.toLowerCase();

    const urgencyKeywords = {
      critical: [
        'emergency',
        'urgent',
        'asap',
        'immediately',
        'crisis',
        'broken down',
        'accident',
        'help',
      ],
      high: [
        'important',
        'priority',
        'soon',
        'quickly',
        'rush',
        'problem',
        'issue',
        'delay',
      ],
      medium: [
        'follow up',
        'when possible',
        'convenient',
        'update',
        'question',
        'need',
      ],
      low: [
        'fyi',
        'information',
        'no rush',
        'whenever',
        'thanks',
        'just calling',
      ],
    };

    const categoryKeywords = {
      emergency: ['emergency', 'accident', 'breakdown', 'help', 'stuck'],
      load_inquiry: [
        'load',
        'freight',
        'shipment',
        'pickup',
        'delivery',
        'quote',
      ],
      payment_issue: ['payment', 'invoice', 'money', 'pay', 'bill', 'check'],
      complaint: ['complaint', 'problem', 'issue', 'unhappy', 'disappointed'],
      breakdown: ['broken', 'repair', 'maintenance', 'truck', 'vehicle'],
    };

    let urgencyLevel: 'critical' | 'high' | 'medium' | 'low' = 'low';
    let urgencyScore = 30;
    let category = 'general';

    // Determine urgency
    if (urgencyKeywords.critical.some((word) => lowerText.includes(word))) {
      urgencyLevel = 'critical';
      urgencyScore = 90;
    } else if (urgencyKeywords.high.some((word) => lowerText.includes(word))) {
      urgencyLevel = 'high';
      urgencyScore = 70;
    } else if (
      urgencyKeywords.medium.some((word) => lowerText.includes(word))
    ) {
      urgencyLevel = 'medium';
      urgencyScore = 50;
    }

    // Determine category
    for (const [cat, keywords] of Object.entries(categoryKeywords)) {
      if (keywords.some((word) => lowerText.includes(word))) {
        category = cat;
        break;
      }
    }

    return {
      urgencyLevel,
      urgencyScore,
      category,
      keyPoints: [text.substring(0, 100) + (text.length > 100 ? '...' : '')],
      suggestedAction:
        urgencyScore >= 70 ? 'immediate_callback' : 'schedule_callback',
      estimatedValue:
        urgencyScore >= 70 ? 'high' : urgencyScore >= 50 ? 'medium' : 'low',
      requiresImmediate: urgencyScore >= 80,
      summary: `${urgencyLevel} priority ${category} voicemail requiring ${urgencyScore >= 70 ? 'immediate' : 'standard'} response`,
    };
  }

  /**
   * Get default analysis for empty/invalid transcriptions
   */
  private getDefaultAnalysis(): AIAnalysisResult {
    return {
      urgencyLevel: 'medium',
      urgencyScore: 50,
      category: 'general',
      keyPoints: ['Transcription not available'],
      suggestedAction: 'schedule_callback',
      estimatedValue: 'medium',
      requiresImmediate: false,
      summary: 'Voicemail received - transcription pending or unavailable',
    };
  }

  /**
   * Normalize urgency level to valid values
   */
  private normalizeUrgencyLevel(
    level: string
  ): 'critical' | 'high' | 'medium' | 'low' {
    const normalized = level?.toLowerCase();
    if (['critical', 'high', 'medium', 'low'].includes(normalized)) {
      return normalized as 'critical' | 'high' | 'medium' | 'low';
    }
    return 'medium';
  }

  /**
   * Get call records for a tenant
   */
  async getCallRecords(
    tenantId: string,
    limit = 50,
    offset = 0
  ): Promise<any[]> {
    try {
      const { data, error } = await this.supabase
        .from('call_records')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Failed to get call records:', error);
      return [];
    }
  }

  /**
   * Get voicemail transcriptions for a tenant
   */
  async getVoicemailTranscriptions(
    tenantId: string,
    limit = 50,
    offset = 0
  ): Promise<any[]> {
    try {
      const { data, error } = await this.supabase
        .from('voicemail_transcriptions')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Failed to get voicemail transcriptions:', error);
      return [];
    }
  }

  /**
   * Get urgent voicemails for a tenant
   */
  async getUrgentVoicemails(
    tenantId: string,
    minUrgencyScore = 70
  ): Promise<any[]> {
    try {
      const { data, error } = await this.supabase
        .from('voicemail_transcriptions')
        .select('*')
        .eq('tenant_id', tenantId)
        .gte('urgency_score', minUrgencyScore)
        .eq('processed', true)
        .order('urgency_score', { ascending: false })
        .limit(20);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Failed to get urgent voicemails:', error);
      return [];
    }
  }

  /**
   * Determine tenant ID from phone number
   */
  async getTenantFromPhoneNumber(phoneNumber: string): Promise<string> {
    // In production, this would look up the tenant based on the phone number
    // For now, return a default tenant ID
    // TODO: Implement actual tenant lookup based on phone number mapping

    // Mock tenant mapping
    const phoneToTenant: { [key: string]: string } = {
      '+18333863509': 'depointe-tenant-id', // Twilio number from .env.local
      // Add more phone number mappings as needed
    };

    return phoneToTenant[phoneNumber] || 'default-tenant-id';
  }

  /**
   * Health check for database connection
   */
  async healthCheck(): Promise<{ healthy: boolean; details: any }> {
    try {
      const { data, error } = await this.supabase
        .from('call_records')
        .select('count')
        .limit(1);

      return {
        healthy: !error,
        details: {
          connected: !error,
          error: error?.message,
          timestamp: new Date().toISOString(),
        },
      };
    } catch (error) {
      return {
        healthy: false,
        details: {
          connected: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }
}

// Export singleton instance
export const callDatabaseService = new CallDatabaseService();

