// ============================================================================
// FLEETFLOW AI CONTACT ANALYSIS SERVICE - PRODUCTION READY
// ============================================================================

import { createClient } from '@supabase/supabase-js';

// ============================================================================
// TYPESCRIPT INTERFACES
// ============================================================================

interface ContactData {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  contact_type: 'shipper' | 'carrier' | 'driver' | 'broker' | 'customer';
  industry?: string;
  communication_history?: any[];
  opportunities?: any[];
  activities?: any[];
  last_contact_date?: string;
  created_at: string;
  custom_fields?: Record<string, any>;
}

interface PersonalityProfile {
  communication_style: 'direct' | 'analytical' | 'expressive' | 'amiable';
  decision_making_speed: 'fast' | 'moderate' | 'slow';
  price_sensitivity: 'high' | 'moderate' | 'low';
  relationship_importance: 'high' | 'moderate' | 'low';
  technical_knowledge: 'expert' | 'intermediate' | 'beginner';
  preferred_contact_method: 'email' | 'phone' | 'text' | 'in_person';
  best_contact_time: 'morning' | 'afternoon' | 'evening';
  confidence_score: number;
  personality_summary: string;
}

interface BuyingSignal {
  signal_type: 'engagement' | 'urgency' | 'budget' | 'authority' | 'need' | 'timing';
  strength: 'strong' | 'moderate' | 'weak';
  description: string;
  confidence: number;
  source: string;
  detected_at: string;
  action_required: boolean;
}

interface NextBestAction {
  action_type: 'call' | 'email' | 'proposal' | 'meeting' | 'follow_up' | 'nurture';
  priority: 'urgent' | 'high' | 'medium' | 'low';
  suggested_timing: string;
  message_template: string;
  expected_outcome: string;
  success_probability: number;
  reasoning: string;
}

interface ContactAnalysis {
  contact_id: string;
  analysis_date: string;
  lead_score: number;
  personality_profile: PersonalityProfile;
  buying_signals: BuyingSignal[];
  next_best_action: NextBestAction;
  engagement_level: 'hot' | 'warm' | 'cold' | 'inactive';
  conversion_probability: number;
  estimated_deal_value: number;
  recommended_approach: string;
  key_insights: string[];
  risk_factors: string[];
  opportunities: string[];
  competitor_threat: 'high' | 'medium' | 'low';
  lifetime_value_prediction: number;
}

// ============================================================================
// AI CONTACT ANALYSIS SERVICE
// ============================================================================

export default class AIContactAnalysisService {
  private supabase: any;
  private organizationId: string;

  constructor(organizationId: string) {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    this.organizationId = organizationId;
  }

  // ============================================================================
  // MAIN ANALYSIS METHODS
  // ============================================================================

  /**
   * Comprehensive AI contact analysis - main method
   */
  async analyzeContactWithAI(contactId: string): Promise<ContactAnalysis> {
    try {
      // 1. Get contact data
      const contactData = await this.getContactData(contactId);
      
      // 2. Analyze personality profile
      const personalityProfile = await this.analyzePersonalityProfile(contactData);
      
      // 3. Detect buying signals
      const buyingSignals = await this.detectBuyingSignals(contactData);
      
      // 4. Calculate lead score
      const leadScore = await this.calculateAILeadScore(contactData, buyingSignals);
      
      // 5. Generate next best action
      const nextBestAction = await this.generateNextBestAction(contactData, personalityProfile, buyingSignals);
      
      // 6. Calculate engagement level
      const engagementLevel = this.calculateEngagementLevel(contactData, buyingSignals);
      
      // 7. Predict conversion probability
      const conversionProbability = this.predictConversionProbability(contactData, leadScore, buyingSignals);
      
      // 8. Estimate deal value
      const estimatedDealValue = this.estimateDealValue(contactData);
      
      // 9. Generate insights and recommendations
      const insights = await this.generateKeyInsights(contactData, personalityProfile, buyingSignals);
      
      // 10. Assess competitor threat
      const competitorThreat = this.assessCompetitorThreat(contactData);
      
      // 11. Predict lifetime value
      const lifetimeValuePrediction = this.predictLifetimeValue(contactData, estimatedDealValue);

      const analysis: ContactAnalysis = {
        contact_id: contactId,
        analysis_date: new Date().toISOString(),
        lead_score: leadScore,
        personality_profile: personalityProfile,
        buying_signals: buyingSignals,
        next_best_action: nextBestAction,
        engagement_level: engagementLevel,
        conversion_probability: conversionProbability,
        estimated_deal_value: estimatedDealValue,
        recommended_approach: this.generateRecommendedApproach(personalityProfile, buyingSignals),
        key_insights: insights.key_insights,
        risk_factors: insights.risk_factors,
        opportunities: insights.opportunities,
        competitor_threat: competitorThreat,
        lifetime_value_prediction: lifetimeValuePrediction
      };

      // Save analysis to database
      await this.saveAnalysis(analysis);
      
      return analysis;

    } catch (error) {
      console.error('Error in AI contact analysis:', error);
      throw error;
    }
  }

  // ============================================================================
  // PERSONALITY PROFILE ANALYSIS
  // ============================================================================

  /**
   * Analyze contact's personality profile using AI
   */
  async analyzePersonalityProfile(contactData: ContactData): Promise<PersonalityProfile> {
    try {
      // Analyze communication patterns
      const communicationStyle = this.analyzeCommunicationStyle(contactData);
      
      // Analyze decision-making speed from response times
      const decisionMakingSpeed = this.analyzeDecisionMakingSpeed(contactData);
      
      // Analyze price sensitivity from conversations
      const priceSensitivity = this.analyzePriceSensitivity(contactData);
      
      // Analyze relationship importance
      const relationshipImportance = this.analyzeRelationshipImportance(contactData);
      
      // Assess technical knowledge level
      const technicalKnowledge = this.assessTechnicalKnowledge(contactData);
      
      // Determine preferred contact method
      const preferredContactMethod = this.determinePreferredContactMethod(contactData);
      
      // Identify best contact time
      const bestContactTime = this.identifyBestContactTime(contactData);
      
      // Calculate confidence score
      const confidenceScore = this.calculatePersonalityConfidence(contactData);
      
      // Generate personality summary
      const personalitySummary = this.generatePersonalitySummary(
        communicationStyle,
        decisionMakingSpeed,
        priceSensitivity,
        relationshipImportance
      );

      return {
        communication_style: communicationStyle,
        decision_making_speed: decisionMakingSpeed,
        price_sensitivity: priceSensitivity,
        relationship_importance: relationshipImportance,
        technical_knowledge: technicalKnowledge,
        preferred_contact_method: preferredContactMethod,
        best_contact_time: bestContactTime,
        confidence_score: confidenceScore,
        personality_summary: personalitySummary
      };

    } catch (error) {
      console.error('Error analyzing personality profile:', error);
      throw error;
    }
  }

  // ============================================================================
  // BUYING SIGNALS DETECTION
  // ============================================================================

  /**
   * Detect buying signals using AI analysis
   */
  async detectBuyingSignals(contactData: ContactData): Promise<BuyingSignal[]> {
    const signals: BuyingSignal[] = [];
    
    try {
      // Analyze engagement signals
      const engagementSignals = this.analyzeEngagementSignals(contactData);
      signals.push(...engagementSignals);
      
      // Analyze urgency signals
      const urgencySignals = this.analyzeUrgencySignals(contactData);
      signals.push(...urgencySignals);
      
      // Analyze budget signals
      const budgetSignals = this.analyzeBudgetSignals(contactData);
      signals.push(...budgetSignals);
      
      // Analyze authority signals
      const authoritySignals = this.analyzeAuthoritySignals(contactData);
      signals.push(...authoritySignals);
      
      // Analyze need signals
      const needSignals = this.analyzeNeedSignals(contactData);
      signals.push(...needSignals);
      
      // Analyze timing signals
      const timingSignals = this.analyzeTimingSignals(contactData);
      signals.push(...timingSignals);
      
      // Sort by strength and confidence
      return signals.sort((a, b) => {
        const strengthOrder = { 'strong': 3, 'moderate': 2, 'weak': 1 };
        const aScore = strengthOrder[a.strength] * a.confidence;
        const bScore = strengthOrder[b.strength] * b.confidence;
        return bScore - aScore;
      });

    } catch (error) {
      console.error('Error detecting buying signals:', error);
      return [];
    }
  }

  // ============================================================================
  // NEXT BEST ACTION GENERATION
  // ============================================================================

  /**
   * Generate AI-powered next best action recommendation
   */
  async generateNextBestAction(
    contactData: ContactData,
    personalityProfile: PersonalityProfile,
    buyingSignals: BuyingSignal[]
  ): Promise<NextBestAction> {
    try {
      // Determine action type based on signals and profile
      const actionType = this.determineActionType(contactData, personalityProfile, buyingSignals);
      
      // Calculate priority based on signals strength
      const priority = this.calculateActionPriority(buyingSignals);
      
      // Suggest optimal timing
      const suggestedTiming = this.suggestOptimalTiming(personalityProfile, buyingSignals);
      
      // Generate personalized message template
      const messageTemplate = this.generateMessageTemplate(actionType, personalityProfile, contactData);
      
      // Predict expected outcome
      const expectedOutcome = this.predictExpectedOutcome(actionType, contactData, buyingSignals);
      
      // Calculate success probability
      const successProbability = this.calculateSuccessProbability(actionType, personalityProfile, buyingSignals);
      
      // Generate reasoning
      const reasoning = this.generateActionReasoning(actionType, personalityProfile, buyingSignals);

      return {
        action_type: actionType,
        priority: priority,
        suggested_timing: suggestedTiming,
        message_template: messageTemplate,
        expected_outcome: expectedOutcome,
        success_probability: successProbability,
        reasoning: reasoning
      };

    } catch (error) {
      console.error('Error generating next best action:', error);
      throw error;
    }
  }

  // ============================================================================
  // LEAD SCORING WITH AI
  // ============================================================================

  /**
   * Calculate AI-enhanced lead score
   */
  async calculateAILeadScore(contactData: ContactData, buyingSignals: BuyingSignal[]): Promise<number> {
    let score = 0;
    
    try {
      // Base score from contact data
      score += this.calculateBaseScore(contactData);
      
      // Engagement score
      score += this.calculateEngagementScore(contactData);
      
      // Buying signals score
      score += this.calculateBuyingSignalsScore(buyingSignals);
      
      // Industry and company size score
      score += this.calculateFirmographicScore(contactData);
      
      // Recency score
      score += this.calculateRecencyScore(contactData);
      
      // Frequency score
      score += this.calculateFrequencyScore(contactData);
      
      // Opportunity value score
      score += this.calculateOpportunityValueScore(contactData);
      
      // Ensure score is between 0-100
      score = Math.max(0, Math.min(100, score));
      
      return Math.round(score);

    } catch (error) {
      console.error('Error calculating AI lead score:', error);
      return 0;
    }
  }

  // ============================================================================
  // UTILITY METHODS - PERSONALITY ANALYSIS
  // ============================================================================

  private analyzeCommunicationStyle(contactData: ContactData): 'direct' | 'analytical' | 'expressive' | 'amiable' {
    const communications = contactData.communication_history || [];
    
    if (communications.length === 0) return 'direct';
    
    let directScore = 0;
    let analyticalScore = 0;
    let expressiveScore = 0;
    let amiableScore = 0;
    
    communications.forEach(comm => {
      const content = (comm.content || '').toLowerCase();
      const wordCount = content.split(' ').length;
      
      // Direct indicators
      if (content.includes('quickly') || content.includes('asap') || content.includes('urgent') || wordCount < 20) {
        directScore += 1;
      }
      
      // Analytical indicators
      if (content.includes('data') || content.includes('analysis') || content.includes('details') || content.includes('specifications')) {
        analyticalScore += 1;
      }
      
      // Expressive indicators
      if (content.includes('!') || content.includes('great') || content.includes('amazing') || content.includes('fantastic')) {
        expressiveScore += 1;
      }
      
      // Amiable indicators
      if (content.includes('thank') || content.includes('please') || content.includes('appreciate') || content.includes('hope')) {
        amiableScore += 1;
      }
    });
    
    const scores = { direct: directScore, analytical: analyticalScore, expressive: expressiveScore, amiable: amiableScore };
    return Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b) as any;
  }

  private analyzeDecisionMakingSpeed(contactData: ContactData): 'fast' | 'moderate' | 'slow' {
    const activities = contactData.activities || [];
    
    if (activities.length < 2) return 'moderate';
    
    const responseTimes = activities
      .filter(a => a.activity_type === 'email' || a.activity_type === 'call')
      .map(a => new Date(a.created_at).getTime())
      .sort();
    
    if (responseTimes.length < 2) return 'moderate';
    
    const avgResponseTime = responseTimes.reduce((sum, time, i) => {
      if (i === 0) return 0;
      return sum + (time - responseTimes[i - 1]);
    }, 0) / (responseTimes.length - 1);
    
    const hoursResponse = avgResponseTime / (1000 * 60 * 60);
    
    if (hoursResponse < 4) return 'fast';
    if (hoursResponse < 24) return 'moderate';
    return 'slow';
  }

  private analyzePriceSensitivity(contactData: ContactData): 'high' | 'moderate' | 'low' {
    const communications = contactData.communication_history || [];
    const opportunities = contactData.opportunities || [];
    
    let priceDiscussions = 0;
    let budgetConcerns = 0;
    
    communications.forEach(comm => {
      const content = (comm.content || '').toLowerCase();
      if (content.includes('price') || content.includes('cost') || content.includes('budget') || content.includes('rate')) {
        priceDiscussions++;
      }
      if (content.includes('expensive') || content.includes('cheaper') || content.includes('discount') || content.includes('reduce')) {
        budgetConcerns++;
      }
    });
    
    const hasHighValueOpportunities = opportunities.some(opp => opp.value > 10000);
    
    if (budgetConcerns > 2 || (priceDiscussions > 3 && !hasHighValueOpportunities)) return 'high';
    if (budgetConcerns > 0 || priceDiscussions > 1) return 'moderate';
    return 'low';
  }

  private analyzeRelationshipImportance(contactData: ContactData): 'high' | 'moderate' | 'low' {
    const communications = contactData.communication_history || [];
    const activities = contactData.activities || [];
    
    let relationshipIndicators = 0;
    
    communications.forEach(comm => {
      const content = (comm.content || '').toLowerCase();
      if (content.includes('relationship') || content.includes('partnership') || content.includes('long-term') || content.includes('trust')) {
        relationshipIndicators++;
      }
    });
    
    const hasPersonalActivities = activities.some(a => a.activity_type === 'meeting' || a.activity_type === 'call');
    const frequentCommunication = communications.length > 5;
    
    if (relationshipIndicators > 2 || (hasPersonalActivities && frequentCommunication)) return 'high';
    if (relationshipIndicators > 0 || hasPersonalActivities) return 'moderate';
    return 'low';
  }

  private assessTechnicalKnowledge(contactData: ContactData): 'expert' | 'intermediate' | 'beginner' {
    const communications = contactData.communication_history || [];
    
    let technicalTerms = 0;
    let basicQuestions = 0;
    
    communications.forEach(comm => {
      const content = (comm.content || '').toLowerCase();
      
      // Technical terms in freight/logistics
      if (content.includes('fmcsa') || content.includes('dot') || content.includes('ltl') || content.includes('ftl') || 
          content.includes('hazmat') || content.includes('reefer') || content.includes('flatbed') || content.includes('drayage')) {
        technicalTerms++;
      }
      
      // Basic questions
      if (content.includes('what is') || content.includes('how does') || content.includes('can you explain')) {
        basicQuestions++;
      }
    });
    
    if (technicalTerms > 3 && basicQuestions === 0) return 'expert';
    if (technicalTerms > 1 || basicQuestions < 2) return 'intermediate';
    return 'beginner';
  }

  private determinePreferredContactMethod(contactData: ContactData): 'email' | 'phone' | 'text' | 'in_person' {
    const activities = contactData.activities || [];
    
    const methodCounts = {
      email: activities.filter(a => a.activity_type === 'email').length,
      phone: activities.filter(a => a.activity_type === 'call').length,
      text: activities.filter(a => a.activity_type === 'sms').length,
      in_person: activities.filter(a => a.activity_type === 'meeting').length
    };
    
    return Object.keys(methodCounts).reduce((a, b) => methodCounts[a] > methodCounts[b] ? a : b) as any;
  }

  private identifyBestContactTime(contactData: ContactData): 'morning' | 'afternoon' | 'evening' {
    const activities = contactData.activities || [];
    
    const timeCounts = { morning: 0, afternoon: 0, evening: 0 };
    
    activities.forEach(activity => {
      const hour = new Date(activity.created_at).getHours();
      if (hour >= 6 && hour < 12) timeCounts.morning++;
      else if (hour >= 12 && hour < 18) timeCounts.afternoon++;
      else timeCounts.evening++;
    });
    
    return Object.keys(timeCounts).reduce((a, b) => timeCounts[a] > timeCounts[b] ? a : b) as any;
  }

  private calculatePersonalityConfidence(contactData: ContactData): number {
    const dataPoints = (contactData.communication_history?.length || 0) + 
                       (contactData.activities?.length || 0) + 
                       (contactData.opportunities?.length || 0);
    
    return Math.min(100, Math.max(10, dataPoints * 5));
  }

  private generatePersonalitySummary(
    communicationStyle: string,
    decisionMakingSpeed: string,
    priceSensitivity: string,
    relationshipImportance: string
  ): string {
    return `${communicationStyle.charAt(0).toUpperCase() + communicationStyle.slice(1)} communicator with ${decisionMakingSpeed} decision-making pace. Shows ${priceSensitivity} price sensitivity and ${relationshipImportance} relationship importance. Tailor your approach accordingly for optimal engagement.`;
  }

  // ============================================================================
  // UTILITY METHODS - BUYING SIGNALS
  // ============================================================================

  private analyzeEngagementSignals(contactData: ContactData): BuyingSignal[] {
    const signals: BuyingSignal[] = [];
    const activities = contactData.activities || [];
    const recentActivities = activities.filter(a => {
      const daysSince = (Date.now() - new Date(a.created_at).getTime()) / (1000 * 60 * 60 * 24);
      return daysSince <= 7;
    });
    
    if (recentActivities.length >= 3) {
      signals.push({
        signal_type: 'engagement',
        strength: 'strong',
        description: `High engagement: ${recentActivities.length} interactions in past 7 days`,
        confidence: 85,
        source: 'activity_analysis',
        detected_at: new Date().toISOString(),
        action_required: true
      });
    }
    
    return signals;
  }

  private analyzeUrgencySignals(contactData: ContactData): BuyingSignal[] {
    const signals: BuyingSignal[] = [];
    const communications = contactData.communication_history || [];
    
    communications.forEach(comm => {
      const content = (comm.content || '').toLowerCase();
      if (content.includes('urgent') || content.includes('asap') || content.includes('immediately') || content.includes('rush')) {
        signals.push({
          signal_type: 'urgency',
          strength: 'strong',
          description: 'Urgent language detected in communication',
          confidence: 90,
          source: 'communication_analysis',
          detected_at: comm.created_at || new Date().toISOString(),
          action_required: true
        });
      }
    });
    
    return signals;
  }

  private analyzeBudgetSignals(contactData: ContactData): BuyingSignal[] {
    const signals: BuyingSignal[] = [];
    const communications = contactData.communication_history || [];
    
    communications.forEach(comm => {
      const content = (comm.content || '').toLowerCase();
      if (content.includes('budget approved') || content.includes('funding secured') || content.includes('ready to proceed')) {
        signals.push({
          signal_type: 'budget',
          strength: 'strong',
          description: 'Budget approval language detected',
          confidence: 95,
          source: 'communication_analysis',
          detected_at: comm.created_at || new Date().toISOString(),
          action_required: true
        });
      }
    });
    
    return signals;
  }

  private analyzeAuthoritySignals(contactData: ContactData): BuyingSignal[] {
    const signals: BuyingSignal[] = [];
    const jobTitle = contactData.custom_fields?.job_title || '';
    
    if (jobTitle.toLowerCase().includes('director') || jobTitle.toLowerCase().includes('manager') || 
        jobTitle.toLowerCase().includes('owner') || jobTitle.toLowerCase().includes('ceo')) {
      signals.push({
        signal_type: 'authority',
        strength: 'strong',
        description: `Decision-making authority indicated by job title: ${jobTitle}`,
        confidence: 80,
        source: 'contact_profile',
        detected_at: new Date().toISOString(),
        action_required: false
      });
    }
    
    return signals;
  }

  private analyzeNeedSignals(contactData: ContactData): BuyingSignal[] {
    const signals: BuyingSignal[] = [];
    const communications = contactData.communication_history || [];
    
    communications.forEach(comm => {
      const content = (comm.content || '').toLowerCase();
      if (content.includes('need') || content.includes('require') || content.includes('looking for') || content.includes('must have')) {
        signals.push({
          signal_type: 'need',
          strength: 'moderate',
          description: 'Explicit need expressed in communication',
          confidence: 75,
          source: 'communication_analysis',
          detected_at: comm.created_at || new Date().toISOString(),
          action_required: true
        });
      }
    });
    
    return signals;
  }

  private analyzeTimingSignals(contactData: ContactData): BuyingSignal[] {
    const signals: BuyingSignal[] = [];
    const communications = contactData.communication_history || [];
    
    communications.forEach(comm => {
      const content = (comm.content || '').toLowerCase();
      if (content.includes('this month') || content.includes('next week') || content.includes('by friday') || content.includes('deadline')) {
        signals.push({
          signal_type: 'timing',
          strength: 'strong',
          description: 'Specific timing requirements mentioned',
          confidence: 85,
          source: 'communication_analysis',
          detected_at: comm.created_at || new Date().toISOString(),
          action_required: true
        });
      }
    });
    
    return signals;
  }

  // ============================================================================
  // UTILITY METHODS - NEXT BEST ACTION
  // ============================================================================

  private determineActionType(
    contactData: ContactData,
    personalityProfile: PersonalityProfile,
    buyingSignals: BuyingSignal[]
  ): 'call' | 'email' | 'proposal' | 'meeting' | 'follow_up' | 'nurture' {
    const strongSignals = buyingSignals.filter(s => s.strength === 'strong');
    const urgentSignals = buyingSignals.filter(s => s.signal_type === 'urgency');
    
    if (strongSignals.length >= 2 && urgentSignals.length > 0) return 'call';
    if (strongSignals.length >= 2) return 'proposal';
    if (personalityProfile.communication_style === 'direct' && strongSignals.length > 0) return 'call';
    if (personalityProfile.preferred_contact_method === 'email') return 'email';
    if (buyingSignals.length > 0) return 'follow_up';
    return 'nurture';
  }

  private calculateActionPriority(buyingSignals: BuyingSignal[]): 'urgent' | 'high' | 'medium' | 'low' {
    const strongSignals = buyingSignals.filter(s => s.strength === 'strong').length;
    const urgentSignals = buyingSignals.filter(s => s.signal_type === 'urgency').length;
    
    if (urgentSignals > 0 && strongSignals >= 2) return 'urgent';
    if (strongSignals >= 2) return 'high';
    if (strongSignals >= 1 || buyingSignals.length >= 3) return 'medium';
    return 'low';
  }

  private suggestOptimalTiming(personalityProfile: PersonalityProfile, buyingSignals: BuyingSignal[]): string {
    const urgentSignals = buyingSignals.filter(s => s.signal_type === 'urgency');
    
    if (urgentSignals.length > 0) return 'Immediately';
    if (personalityProfile.decision_making_speed === 'fast') return 'Within 2 hours';
    if (personalityProfile.best_contact_time === 'morning') return 'Tomorrow morning (9-11 AM)';
    if (personalityProfile.best_contact_time === 'afternoon') return 'This afternoon (1-4 PM)';
    return 'Within 24 hours';
  }

  private generateMessageTemplate(
    actionType: string,
    personalityProfile: PersonalityProfile,
    contactData: ContactData
  ): string {
    const name = contactData.name || 'there';
    const company = contactData.company || 'your company';
    
    const templates = {
      call: `Hi ${name}, I wanted to follow up on our recent conversation about ${company}'s freight needs. I have some specific solutions that could help streamline your operations. Would you have 15 minutes today to discuss how we can add value to your shipping strategy?`,
      
      email: `Subject: Solutions for ${company}'s Freight Needs\n\nHi ${name},\n\nI've been thinking about our conversation and believe I have some freight solutions that could significantly benefit ${company}. Based on your requirements, I'd like to propose a customized approach that addresses your specific challenges.\n\nWould you be available for a brief call this week to discuss the details?\n\nBest regards,`,
      
      proposal: `Hi ${name}, thank you for your interest in our freight services. Based on our discussions, I'm prepared to put together a comprehensive proposal that addresses ${company}'s specific shipping needs. I'll include competitive rates, service options, and implementation timeline.\n\nI'll have this ready for your review by tomorrow. Would you prefer to discuss it over a call or in person?`,
      
      meeting: `Hi ${name}, I'd like to schedule a meeting to discuss how we can support ${company}'s freight and logistics needs. I have some innovative solutions that could help optimize your supply chain operations.\n\nWould you be available for a 30-minute meeting this week? I'm flexible with timing and can meet at your location or via video conference.`,
      
      follow_up: `Hi ${name}, I wanted to follow up on our recent conversation about ${company}'s freight requirements. I understand you're evaluating options, and I'm here to answer any questions you might have.\n\nHave there been any developments with your shipping needs that I should be aware of?`,
      
      nurture: `Hi ${name}, I hope things are going well at ${company}. I wanted to share some industry insights that might be relevant to your operations. The freight market has been evolving, and I thought you'd find these trends interesting.\n\nWould you like to schedule a brief call to discuss how these changes might impact your shipping strategy?`
    };
    
    return templates[actionType] || templates.follow_up;
  }

  private predictExpectedOutcome(actionType: string, contactData: ContactData, buyingSignals: BuyingSignal[]): string {
    const strongSignals = buyingSignals.filter(s => s.strength === 'strong').length;
    
    const outcomes = {
      call: strongSignals >= 2 ? 'Likely to schedule proposal meeting' : 'Information gathering and relationship building',
      email: strongSignals >= 1 ? 'Response with specific questions or meeting request' : 'Acknowledgment and continued nurturing',
      proposal: strongSignals >= 2 ? 'Review and likely acceptance' : 'Detailed evaluation and feedback',
      meeting: strongSignals >= 1 ? 'Productive discussion leading to next steps' : 'Exploratory conversation',
      follow_up: strongSignals >= 1 ? 'Updated requirements and timeline' : 'Status update and continued engagement',
      nurture: 'Maintained relationship and future opportunity awareness'
    };
    
    return outcomes[actionType] || 'Continued engagement';
  }

  private calculateSuccessProbability(
    actionType: string,
    personalityProfile: PersonalityProfile,
    buyingSignals: BuyingSignal[]
  ): number {
    let probability = 50; // Base probability
    
    // Adjust based on buying signals
    const strongSignals = buyingSignals.filter(s => s.strength === 'strong').length;
    probability += strongSignals * 15;
    
    // Adjust based on personality alignment
    if (actionType === personalityProfile.preferred_contact_method) {
      probability += 10;
    }
    
    // Adjust based on decision-making speed
    if (personalityProfile.decision_making_speed === 'fast' && actionType === 'call') {
      probability += 15;
    }
    
    return Math.min(95, Math.max(5, probability));
  }

  private generateActionReasoning(
    actionType: string,
    personalityProfile: PersonalityProfile,
    buyingSignals: BuyingSignal[]
  ): string {
    const strongSignals = buyingSignals.filter(s => s.strength === 'strong');
    const signalTypes = [...new Set(strongSignals.map(s => s.signal_type))];
    
    let reasoning = `Recommended ${actionType} based on: `;
    
    if (strongSignals.length >= 2) {
      reasoning += `Strong buying signals detected (${signalTypes.join(', ')}). `;
    }
    
    if (personalityProfile.communication_style === 'direct') {
      reasoning += `Direct communication style suggests straightforward approach. `;
    }
    
    if (personalityProfile.decision_making_speed === 'fast') {
      reasoning += `Fast decision-making indicates urgency in follow-up. `;
    }
    
    return reasoning;
  }

  // ============================================================================
  // UTILITY METHODS - SCORING
  // ============================================================================

  private calculateBaseScore(contactData: ContactData): number {
    let score = 0;
    
    // Contact completeness
    if (contactData.email) score += 5;
    if (contactData.phone) score += 5;
    if (contactData.company) score += 5;
    
    // Industry relevance
    if (contactData.industry && this.isTargetIndustry(contactData.industry)) score += 10;
    
    return score;
  }

  private calculateEngagementScore(contactData: ContactData): number {
    const activities = contactData.activities || [];
    const recentActivities = activities.filter(a => {
      const daysSince = (Date.now() - new Date(a.created_at).getTime()) / (1000 * 60 * 60 * 24);
      return daysSince <= 30;
    });
    
    return Math.min(25, recentActivities.length * 2);
  }

  private calculateBuyingSignalsScore(buyingSignals: BuyingSignal[]): number {
    const strongSignals = buyingSignals.filter(s => s.strength === 'strong');
    const moderateSignals = buyingSignals.filter(s => s.strength === 'moderate');
    
    return (strongSignals.length * 10) + (moderateSignals.length * 5);
  }

  private calculateFirmographicScore(contactData: ContactData): number {
    let score = 0;
    
    // Company size indicators
    if (contactData.custom_fields?.company_size === 'large') score += 10;
    if (contactData.custom_fields?.company_size === 'medium') score += 5;
    
    // Job title relevance
    const jobTitle = contactData.custom_fields?.job_title || '';
    if (jobTitle.toLowerCase().includes('director') || jobTitle.toLowerCase().includes('manager')) score += 5;
    if (jobTitle.toLowerCase().includes('owner') || jobTitle.toLowerCase().includes('ceo')) score += 10;
    
    return score;
  }

  private calculateRecencyScore(contactData: ContactData): number {
    if (!contactData.last_contact_date) return 0;
    
    const daysSince = (Date.now() - new Date(contactData.last_contact_date).getTime()) / (1000 * 60 * 60 * 24);
    
    if (daysSince <= 1) return 15;
    if (daysSince <= 7) return 10;
    if (daysSince <= 30) return 5;
    return 0;
  }

  private calculateFrequencyScore(contactData: ContactData): number {
    const activities = contactData.activities || [];
    const past30Days = activities.filter(a => {
      const daysSince = (Date.now() - new Date(a.created_at).getTime()) / (1000 * 60 * 60 * 24);
      return daysSince <= 30;
    });
    
    return Math.min(10, past30Days.length);
  }

  private calculateOpportunityValueScore(contactData: ContactData): number {
    const opportunities = contactData.opportunities || [];
    const totalValue = opportunities.reduce((sum, opp) => sum + (opp.value || 0), 0);
    
    if (totalValue >= 50000) return 20;
    if (totalValue >= 25000) return 15;
    if (totalValue >= 10000) return 10;
    if (totalValue >= 5000) return 5;
    return 0;
  }

  // ============================================================================
  // HELPER METHODS
  // ============================================================================

  private async getContactData(contactId: string): Promise<ContactData> {
    try {
      const { data: contact, error } = await this.supabase
        .from('crm_contacts')
        .select(`
          *,
          activities:crm_activities(*),
          opportunities:crm_opportunities(*),
          communications:crm_communications(*)
        `)
        .eq('id', contactId)
        .eq('organization_id', this.organizationId)
        .single();

      if (error) throw error;
      
      return {
        ...contact,
        communication_history: contact.communications || [],
        activities: contact.activities || [],
        opportunities: contact.opportunities || []
      };
    } catch (error) {
      console.error('Error fetching contact data:', error);
      throw error;
    }
  }

  private async saveAnalysis(analysis: ContactAnalysis): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('crm_contact_analysis')
        .upsert({
          ...analysis,
          organization_id: this.organizationId
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error saving analysis:', error);
      throw error;
    }
  }

  private isTargetIndustry(industry: string): boolean {
    const targetIndustries = [
      'manufacturing',
      'retail',
      'automotive',
      'construction',
      'food_beverage',
      'chemicals',
      'energy',
      'agriculture'
    ];
    return targetIndustries.includes(industry.toLowerCase());
  }

  private calculateEngagementLevel(contactData: ContactData, buyingSignals: BuyingSignal[]): 'hot' | 'warm' | 'cold' | 'inactive' {
    const strongSignals = buyingSignals.filter(s => s.strength === 'strong').length;
    const recentActivities = (contactData.activities || []).filter(a => {
      const daysSince = (Date.now() - new Date(a.created_at).getTime()) / (1000 * 60 * 60 * 24);
      return daysSince <= 7;
    }).length;
    
    if (strongSignals >= 2 && recentActivities >= 3) return 'hot';
    if (strongSignals >= 1 || recentActivities >= 2) return 'warm';
    if (recentActivities >= 1) return 'cold';
    return 'inactive';
  }

  private predictConversionProbability(contactData: ContactData, leadScore: number, buyingSignals: BuyingSignal[]): number {
    const strongSignals = buyingSignals.filter(s => s.strength === 'strong').length;
    
    let probability = leadScore * 0.6; // Base on lead score
    probability += strongSignals * 10; // Add for strong signals
    
    // Adjust based on opportunities
    const opportunities = contactData.opportunities || [];
    const activeOpportunities = opportunities.filter(o => o.status === 'open').length;
    probability += activeOpportunities * 5;
    
    return Math.min(95, Math.max(5, Math.round(probability)));
  }

  private estimateDealValue(contactData: ContactData): number {
    const opportunities = contactData.opportunities || [];
    
    if (opportunities.length === 0) {
      // Estimate based on contact type and company size
      const companySize = contactData.custom_fields?.company_size || 'small';
      const baseValues = { small: 2500, medium: 7500, large: 15000 };
      return baseValues[companySize] || 2500;
    }
    
    const avgOpportunityValue = opportunities.reduce((sum, opp) => sum + (opp.value || 0), 0) / opportunities.length;
    return Math.round(avgOpportunityValue);
  }

  private async generateKeyInsights(
    contactData: ContactData,
    personalityProfile: PersonalityProfile,
    buyingSignals: BuyingSignal[]
  ): Promise<{ key_insights: string[]; risk_factors: string[]; opportunities: string[] }> {
    const insights = [];
    const riskFactors = [];
    const opportunities = [];
    
    // Generate insights based on analysis
    if (personalityProfile.communication_style === 'direct') {
      insights.push('Prefers direct, no-nonsense communication style');
    }
    
    if (buyingSignals.some(s => s.signal_type === 'urgency')) {
      insights.push('Shows urgency in requirements - time-sensitive opportunity');
    }
    
    if (personalityProfile.price_sensitivity === 'high') {
      riskFactors.push('High price sensitivity may impact deal closure');
    }
    
    if (personalityProfile.relationship_importance === 'high') {
      opportunities.push('Values relationships - opportunity for long-term partnership');
    }
    
    return { key_insights: insights, risk_factors: riskFactors, opportunities };
  }

  private generateRecommendedApproach(personalityProfile: PersonalityProfile, buyingSignals: BuyingSignal[]): string {
    let approach = `Focus on ${personalityProfile.communication_style} communication. `;
    
    if (personalityProfile.decision_making_speed === 'fast') {
      approach += 'Present options quickly and be ready to close. ';
    }
    
    if (personalityProfile.price_sensitivity === 'high') {
      approach += 'Emphasize value and ROI over features. ';
    }
    
    if (buyingSignals.some(s => s.signal_type === 'urgency')) {
      approach += 'Address urgency and provide immediate solutions. ';
    }
    
    return approach;
  }

  private assessCompetitorThreat(contactData: ContactData): 'high' | 'medium' | 'low' {
    const communications = contactData.communication_history || [];
    
    let competitorMentions = 0;
    communications.forEach(comm => {
      const content = (comm.content || '').toLowerCase();
      if (content.includes('competitor') || content.includes('other') || content.includes('comparing')) {
        competitorMentions++;
      }
    });
    
    if (competitorMentions >= 2) return 'high';
    if (competitorMentions >= 1) return 'medium';
    return 'low';
  }

  private predictLifetimeValue(contactData: ContactData, estimatedDealValue: number): number {
    const opportunities = contactData.opportunities || [];
    const wonOpportunities = opportunities.filter(o => o.status === 'won');
    
    if (wonOpportunities.length === 0) {
      return estimatedDealValue * 3; // Estimate 3x initial deal value
    }
    
    const avgDealValue = wonOpportunities.reduce((sum, opp) => sum + (opp.value || 0), 0) / wonOpportunities.length;
    const dealFrequency = wonOpportunities.length / 12; // Deals per month
    
    return Math.round(avgDealValue * dealFrequency * 36); // 3-year LTV
  }
}

// ============================================================================
// USAGE EXAMPLES
// ============================================================================

/*
// Example 1: Basic AI contact analysis
const aiAnalysis = new AIContactAnalysisService('your-org-id');
const analysis = await aiAnalysis.analyzeContactWithAI('contact-123');

console.log('Analysis Results:', {
  leadScore: analysis.lead_score,
  personalityProfile: analysis.personality_profile,
  buyingSignals: analysis.buying_signals,
  nextBestAction: analysis.next_best_action,
  engagementLevel: analysis.engagement_level,
  conversionProbability: analysis.conversion_probability
});
*/ 