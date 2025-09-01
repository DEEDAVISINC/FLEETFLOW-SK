/**
 * Claude AI Service for Advanced Document Generation and Analysis
 * Integrates with Anthropic's Claude for intelligent fleet management
 */

export interface DocumentRequest {
  type: string;
  prompt: string;
  context?: any;
  format?: 'markdown' | 'html' | 'plain';
}

export interface AIInsight {
  category: string;
  insight: string;
  confidence: number;
  actionItems: string[];
}

export class ClaudeAIService {
  private apiKey: string | undefined;
  private baseUrl = 'https://api.anthropic.com/v1';

  constructor() {
    this.apiKey = process.env.ANTHROPIC_API_KEY;
  }

  /**
   * Generate documents using Claude AI
   */
  async generateDocument(
    prompt: string,
    documentType: string
  ): Promise<string> {
    if (!this.apiKey) {
      console.warn(
        'Anthropic API key not configured, using fallback generation'
      );
      return this.generateFallbackDocument(prompt, documentType);
    }

    try {
      const response = await fetch(`${this.baseUrl}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-3-sonnet-20240229',
          max_tokens: 4000,
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`Claude API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.content[0].text;
    } catch (error) {
      console.error('Error calling Claude API:', error);
      return this.generateFallbackDocument(prompt, documentType);
    }
  }

  /**
   * Generate AI response for conversations
   * Used by FreightConversationAI for voice interactions
   */
  async generateResponse(prompt: string): Promise<string> {
    if (!this.apiKey) {
      console.warn('Anthropic API key not configured, using fallback response');
      return this.generateFallbackResponse(prompt);
    }

    try {
      const response = await fetch(`${this.baseUrl}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-3-sonnet-20240229',
          max_tokens: 1000,
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`Claude API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.content[0].text;
    } catch (error) {
      console.error('Error calling Claude API for conversation:', error);
      return this.generateFallbackResponse(prompt);
    }
  }

  /**
   * Generate fallback conversation response
   */
  private generateFallbackResponse(prompt: string): string {
    const promptLower = prompt.toLowerCase();

    if (promptLower.includes('greeting')) {
      return "Hello! This is FleetFlow's AI assistant. How can I help you with your freight needs today?";
    }

    if (
      promptLower.includes('qualification') ||
      promptLower.includes('mc number') ||
      promptLower.includes('dot number')
    ) {
      return 'Great! Can you provide your MC or DOT number so I can verify your authority and help you with available loads?';
    }

    if (promptLower.includes('load') || promptLower.includes('freight')) {
      return "Perfect! I have several loads that might be a good fit. What's your preferred pickup area and equipment type?";
    }

    if (promptLower.includes('rate') || promptLower.includes('price')) {
      return 'Based on current market rates and this lane, I can offer $2,850 all-in. This is competitive for this route. How does that work for you?';
    }

    if (promptLower.includes('closing') || promptLower.includes('book')) {
      return "Excellent! I'll get the load booked for you right away. You'll receive confirmation and pickup details within the next few minutes. Thank you for choosing FleetFlow!";
    }

    // Default professional response
    return "I understand. Let me help you with that. Can you provide a bit more detail about what you're looking for?";
  }

  /**
   * Optimize routes using AI analysis
   */
  async optimizeRoute(routeData: {
    origin: string;
    destination: string;
    stops?: string[];
    constraints?: string[];
    vehicleType?: string;
    cargo?: string;
  }): Promise<{
    optimizedRoute: string[];
    estimatedTime: number;
    estimatedCost: number;
    recommendations: string[];
  }> {
    const prompt = `Analyze and optimize the following route:

    Origin: ${routeData.origin}
    Destination: ${routeData.destination}
    Stops: ${routeData.stops?.join(', ') || 'None'}
    Vehicle Type: ${routeData.vehicleType || 'Standard truck'}
    Cargo: ${routeData.cargo || 'General freight'}
    Constraints: ${routeData.constraints?.join(', ') || 'None'}

    Provide:
    1. Optimized route sequence
    2. Estimated travel time
    3. Estimated fuel costs
    4. Traffic considerations
    5. Efficiency recommendations

    Format as JSON with optimizedRoute (array), estimatedTime (hours), estimatedCost (dollars), and recommendations (array).`;

    try {
      const result = await this.generateDocument(prompt, 'route_optimization');
      return JSON.parse(result);
    } catch (error) {
      console.error('Error optimizing route:', error);
      return this.getFallbackRouteOptimization(routeData);
    }
  }

  /**
   * Generate fleet insights and recommendations
   */
  async generateFleetInsights(fleetData: {
    vehicles: number;
    drivers: number;
    utilization: number;
    safetyScore: number;
    fuelEfficiency: number;
    maintenanceCosts: number;
  }): Promise<AIInsight[]> {
    const prompt = `Analyze this fleet performance data and provide insights:

    Fleet Size: ${fleetData.vehicles} vehicles, ${fleetData.drivers} drivers
    Utilization Rate: ${fleetData.utilization}%
    Safety Score: ${fleetData.safetyScore}/100
    Fuel Efficiency: ${fleetData.fuelEfficiency} MPG
    Monthly Maintenance Costs: $${fleetData.maintenanceCosts}

    Provide 3-5 key insights with:
    - Category (efficiency, safety, cost, maintenance, etc.)
    - Specific insight
    - Confidence level (0-100)
    - 2-3 actionable recommendations

    Format as JSON array.`;

    try {
      const result = await this.generateDocument(prompt, 'fleet_insights');
      return JSON.parse(result);
    } catch (error) {
      console.error('Error generating fleet insights:', error);
      return this.getFallbackFleetInsights(fleetData);
    }
  }

  /**
   * Fallback document generation when API is unavailable
   */
  private generateFallbackDocument(
    prompt: string,
    documentType: string
  ): string {
    const templates = {
      audit_report: `
COMPLIANCE AUDIT REPORT

Generated on: ${new Date().toLocaleDateString()}

EXECUTIVE SUMMARY
This automated audit report provides a comprehensive review of compliance status and recommendations for improvement.

FINDINGS
Based on the provided information, the following areas have been reviewed:
- Driver qualification files
- Vehicle maintenance records
- Hours of service compliance
- Drug and alcohol testing program
- Safety management systems

RECOMMENDATIONS
1. Continue regular compliance monitoring
2. Maintain up-to-date documentation
3. Implement proactive training programs
4. Schedule regular internal audits
5. Stay current with regulatory changes

NEXT STEPS
- Address any identified deficiencies
- Schedule follow-up reviews
- Update policies as needed
- Maintain compliance documentation

This report was generated automatically. Please review with compliance professionals.
      `,
      safety_policy: `
COMPANY SAFETY POLICY

Effective Date: ${new Date().toLocaleDateString()}

PURPOSE
This policy establishes safety standards and procedures to ensure compliance with DOT regulations and protect our drivers, equipment, and the public.

POLICY STATEMENT
[Company Name] is committed to maintaining the highest standards of safety in all operations.

DRIVER RESPONSIBILITIES
- Conduct pre-trip inspections
- Follow hours of service regulations
- Report safety concerns immediately
- Participate in required training

VEHICLE MAINTENANCE
- Regular preventive maintenance
- Immediate repair of safety defects
- Proper documentation of all maintenance

TRAINING REQUIREMENTS
- New driver orientation
- Annual safety training
- Specialized training as required

This is a template document. Please customize for your specific operations.
      `,
      default: `
GENERATED DOCUMENT: ${documentType.toUpperCase()}

This document has been automatically generated based on your request.

Content Summary:
${prompt.substring(0, 200)}...

Generated on: ${new Date().toLocaleDateString()}

Please review and customize this document according to your specific needs and regulatory requirements.

For detailed guidance, consult with compliance professionals or refer to relevant federal regulations.
      `,
    };

    return (
      templates[documentType as keyof typeof templates] || templates.default
    );
  }

  private getFallbackRouteOptimization(routeData: any) {
    return {
      optimizedRoute: [
        routeData.origin,
        ...(routeData.stops || []),
        routeData.destination,
      ],
      estimatedTime: 8,
      estimatedCost: 250,
      recommendations: [
        'Consider off-peak travel times',
        'Monitor fuel prices for optimal stops',
        'Plan for rest breaks per HOS regulations',
      ],
    };
  }

  private getFallbackFleetInsights(fleetData: any): AIInsight[] {
    return [
      {
        category: 'efficiency',
        insight: 'Fleet utilization could be improved',
        confidence: 75,
        actionItems: [
          'Analyze route optimization opportunities',
          'Consider load consolidation strategies',
        ],
      },
      {
        category: 'safety',
        insight: 'Safety score indicates good performance',
        confidence: 80,
        actionItems: [
          'Continue current safety training',
          'Monitor driver performance metrics',
        ],
      },
    ];
  }
}

/**
 * ElevenLabs Voice Service for Ultra-Realistic TTS
 */
export class ElevenLabsVoiceService {
  private apiKey: string | undefined;
  private baseUrl = 'https://api.elevenlabs.io/v1';

  constructor() {
    this.apiKey = process.env.ELEVENLABS_API_KEY;
    console.info(
      `🎙️ ElevenLabs API Key Status: ${this.apiKey ? 'CONFIGURED ✅' : 'MISSING ❌'}`
    );
    if (this.apiKey) {
      console.info(`🎙️ ElevenLabs API Key: ${this.apiKey.substring(0, 8)}...`);
    } else {
      console.info(
        '🎙️ ElevenLabs running in demo mode - using browser TTS with voice selection'
      );
    }
  }

  /**
   * Convert text to ultra-realistic speech using ElevenLabs
   */
  async textToSpeech(
    text: string,
    voiceId?: string
  ): Promise<{
    audioBuffer?: Buffer;
    audioUrl?: string;
    success: boolean;
    error?: string;
  }> {
    // For demo purposes, use browser TTS with enhanced settings if no API key
    if (!this.apiKey) {
      console.info(
        '🎙️ ElevenLabs API key not configured - using enhanced browser TTS demo mode'
      );
      return {
        success: false,
        error: 'ElevenLabs API key not configured - using browser TTS fallback',
      };
    }

    // Professional American voices for freight business (verified ElevenLabs voice IDs)
    const voiceMap = {
      'american-female-professional': '21m00Tcm4TlvDq8ikWAM', // Rachel
      'american-male-professional': 'VR6AewLTigWG4xSOukaG', // Josh
      'american-female-friendly': 'EXAVITQu4vr4xnSDxMaL', // Bella
      'american-male-authoritative': '2EiwWnXFnvU5JabPnv8n', // Clyde
      'american-female-business': 'pNInz6obpgDQGcFmaJgB', // Sarah
      'american-male-narrator': 'pqHfZKP75CvOlQylNhV4', // Bill
      'american-female-warm': 'ThT5KcBeYPX3keUQqHPh', // Dorothy
      'american-male-confident': 'ZQe5CZNOzWyzPSCn5a3c', // Marcus
    };

    console.info(
      `🎙️ Voice selection: ${voiceId} -> ${voiceMap[voiceId] || voiceId}`
    );

    // Map voice name to actual ElevenLabs voice ID
    const selectedVoiceId =
      voiceMap[voiceId] ||
      voiceMap['american-female-professional'] ||
      '21m00Tcm4TlvDq8ikWAM';

    try {
      const response = await fetch(
        `${this.baseUrl}/text-to-speech/${selectedVoiceId}`,
        {
          method: 'POST',
          headers: {
            Accept: 'audio/mpeg',
            'Content-Type': 'application/json',
            'xi-api-key': this.apiKey,
          },
          body: JSON.stringify({
            text: text.substring(0, 2500), // Limit text length to avoid API limits
            model_id: 'eleven_multilingual_v2', // Use newer model
            voice_settings: {
              stability: 0.3, // Lower for more dynamic speech
              similarity_boost: 0.8, // Higher for better voice similarity
              style: 0.2, // Lower for more natural speech
              use_speaker_boost: true,
            },
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`🚨 ElevenLabs API Error Details:`, {
          status: response.status,
          statusText: response.statusText,
          voiceId: selectedVoiceId,
          originalVoiceParam: voiceId,
          errorBody: errorText,
        });
        throw new Error(
          `ElevenLabs API error: ${response.statusText} - ${errorText}`
        );
      }

      const audioBuffer = Buffer.from(await response.arrayBuffer());

      return {
        success: true,
        audioBuffer,
        audioUrl: `data:audio/mpeg;base64,${audioBuffer.toString('base64')}`,
      };
    } catch (error) {
      console.error('ElevenLabs TTS error:', error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown ElevenLabs error',
      };
    }
  }

  /**
   * Get available ElevenLabs voices
   */
  async getAvailableVoices(): Promise<any[]> {
    if (!this.apiKey) {
      return [];
    }

    try {
      const response = await fetch(`${this.baseUrl}/voices`, {
        headers: {
          'xi-api-key': this.apiKey,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch voices: ${response.statusText}`);
      }

      const data = await response.json();
      return data.voices || [];
    } catch (error) {
      console.error('Error fetching ElevenLabs voices:', error);
      return [];
    }
  }

  /**
   * Clone a voice from audio sample
   */
  async cloneVoice(
    name: string,
    audioFiles: File[]
  ): Promise<{
    voiceId?: string;
    success: boolean;
    error?: string;
  }> {
    if (!this.apiKey) {
      return {
        success: false,
        error: 'ElevenLabs API key not configured',
      };
    }

    try {
      const formData = new FormData();
      formData.append('name', name);

      audioFiles.forEach((file, index) => {
        formData.append('files', file);
      });

      const response = await fetch(`${this.baseUrl}/voices/add`, {
        method: 'POST',
        headers: {
          'xi-api-key': this.apiKey,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Voice cloning failed: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        success: true,
        voiceId: data.voice_id,
      };
    } catch (error) {
      console.error('Voice cloning error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown cloning error',
      };
    }
  }
}

export default ClaudeAIService;
