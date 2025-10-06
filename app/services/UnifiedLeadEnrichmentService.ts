/**
 * 🎯 UNIFIED LEAD ENRICHMENT SERVICE
 * 
 * Orchestrates all lead enrichment services into a single, powerful pipeline
 * Combines FleetFlow's existing services with new email validation and LinkedIn scraping
 * 
 * This service integrates:
 * - Email Validation (Hunter.io, ZeroBounce, Abstract API)
 * - LinkedIn Scraping (Proxycurl, PhantomBuster, ScrapingBee)
 * - AI Lead Scoring (existing LeadGenerationService)
 * - Company Data Enrichment (existing services)
 * - FMCSA Data (existing services)
 * - AI Analysis (existing AIAgentOrchestrator)
 */

import { emailValidationService } from './EmailValidationService';
import { linkedInScrapingService } from './LinkedInScrapingService';
import { LeadGenerationService } from './LeadGenerationService';

interface EnrichmentInput {
  // Basic lead data
  name?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  company?: string;
  title?: string;
  
  // Optional context
  source?: string;
  industry?: string;
  location?: string;
  website?: string;
  
  // Tenant context
  tenantId: string;
}

interface EnrichedLead {
  // Original data
  original: EnrichmentInput;
  
  // Enriched contact data
  contact: {
    fullName: string;
    firstName: string;
    lastName: string;
    email: string;
    emailValidation?: {
      isValid: boolean;
      isDeliverable: boolean;
      score: number;
      suggestion?: string;
    };
    phone?: string;
    title?: string;
    location?: string;
  };
  
  // Company data
  company?: {
    name: string;
    website?: string;
    industry?: string;
    size?: string;
    headquarters?: string;
    founded?: number;
    description?: string;
    linkedinUrl?: string;
    employees?: number;
  };
  
  // LinkedIn profile data
  linkedIn?: {
    profileUrl: string;
    headline: string;
    summary?: string;
    currentCompany?: {
      name: string;
      title: string;
      startDate?: string;
    };
    experience: Array<{
      company: string;
      title: string;
      duration?: string;
    }>;
    education: Array<{
      school: string;
      degree?: string;
    }>;
    skills: string[];
    connections?: number;
  };
  
  // AI-powered insights
  intelligence: {
    leadScore: number; // 0-100
    fitScore: number; // 0-100
    intentScore: number; // 0-100
    priority: 'hot' | 'warm' | 'cold';
    recommendedAction: string;
    insights: string[];
    tags: string[];
  };
  
  // Freight-specific data (if applicable)
  freight?: {
    mcNumber?: string;
    dotNumber?: string;
    authority?: string;
    safetyRating?: string;
    fleetSize?: number;
    operatingRadius?: string;
    specializations?: string[];
  };
  
  // Enrichment metadata
  metadata: {
    enrichedAt: string;
    enrichmentSources: string[];
    confidence: number; // 0-100
    completeness: number; // 0-100
    tenantId: string;
  };
}

interface EnrichmentOptions {
  // Control which enrichment services to use
  validateEmail?: boolean;
  enrichLinkedIn?: boolean;
  enrichCompany?: boolean;
  enrichFreightData?: boolean;
  runAIAnalysis?: boolean;
  
  // Performance options
  timeout?: number; // ms
  useCache?: boolean;
  
  // Quality thresholds
  minEmailScore?: number;
  minLeadScore?: number;
}

export class UnifiedLeadEnrichmentService {
  private static instance: UnifiedLeadEnrichmentService;
  private leadGenService: LeadGenerationService;
  private enrichmentCache: Map<string, EnrichedLead> = new Map();

  private constructor() {
    this.leadGenService = new LeadGenerationService();
    console.info('🎯 Unified Lead Enrichment Service initialized');
  }

  public static getInstance(): UnifiedLeadEnrichmentService {
    if (!UnifiedLeadEnrichmentService.instance) {
      UnifiedLeadEnrichmentService.instance = new UnifiedLeadEnrichmentService();
    }
    return UnifiedLeadEnrichmentService.instance;
  }

  /**
   * Main enrichment method - enriches a single lead with all available data
   */
  public async enrichLead(
    input: EnrichmentInput,
    options: EnrichmentOptions = {}
  ): Promise<EnrichedLead> {
    const startTime = Date.now();
    const enrichmentSources: string[] = ['base'];

    console.info(`🎯 Starting enrichment for ${input.name || input.email || 'unknown lead'}`);

    try {
      // Check cache first
      const cacheKey = this.getCacheKey(input);
      if (options.useCache !== false) {
        const cached = this.enrichmentCache.get(cacheKey);
        if (cached) {
          console.info(`✅ Using cached enrichment for ${input.name || input.email}`);
          return cached;
        }
      }

      // Initialize enriched lead with original data
      const enrichedLead: EnrichedLead = {
        original: input,
        contact: {
          fullName: input.name || `${input.firstName || ''} ${input.lastName || ''}`.trim(),
          firstName: input.firstName || input.name?.split(' ')[0] || '',
          lastName: input.lastName || input.name?.split(' ').slice(1).join(' ') || '',
          email: input.email || '',
          phone: input.phone,
          title: input.title,
          location: input.location,
        },
        intelligence: {
          leadScore: 0,
          fitScore: 0,
          intentScore: 0,
          priority: 'cold',
          recommendedAction: 'Review lead',
          insights: [],
          tags: [],
        },
        metadata: {
          enrichedAt: new Date().toISOString(),
          enrichmentSources,
          confidence: 0,
          completeness: 0,
          tenantId: input.tenantId,
        },
      };

      // Run enrichment services in parallel where possible
      const enrichmentPromises: Promise<void>[] = [];

      // 1. Email Validation (if email provided)
      if (input.email && options.validateEmail !== false) {
        enrichmentPromises.push(
          this.enrichWithEmailValidation(enrichedLead, input.email).then(() => {
            enrichmentSources.push('email-validation');
          })
        );
      }

      // 2. LinkedIn Enrichment (if name/company provided)
      if ((input.name || (input.firstName && input.lastName)) && options.enrichLinkedIn !== false) {
        enrichmentPromises.push(
          this.enrichWithLinkedIn(enrichedLead, input).then(() => {
            enrichmentSources.push('linkedin');
          })
        );
      }

      // 3. Company Enrichment (if company provided)
      if (input.company && options.enrichCompany !== false) {
        enrichmentPromises.push(
          this.enrichWithCompanyData(enrichedLead, input.company).then(() => {
            enrichmentSources.push('company-data');
          })
        );
      }

      // 4. Freight Data Enrichment (if applicable)
      if (options.enrichFreightData !== false) {
        enrichmentPromises.push(
          this.enrichWithFreightData(enrichedLead, input).then(() => {
            enrichmentSources.push('freight-data');
          })
        );
      }

      // Wait for all enrichment services to complete (with timeout)
      const timeout = options.timeout || 15000;
      await Promise.race([
        Promise.all(enrichmentPromises),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Enrichment timeout')), timeout)
        ),
      ]).catch(error => {
        console.warn('⚠️ Some enrichment services timed out:', error);
      });

      // 5. AI Analysis (run after other enrichments to have more data)
      if (options.runAIAnalysis !== false) {
        await this.enrichWithAIAnalysis(enrichedLead, input);
        enrichmentSources.push('ai-analysis');
      }

      // Calculate final scores
      this.calculateEnrichmentMetrics(enrichedLead);

      // Cache the result
      if (options.useCache !== false) {
        this.enrichmentCache.set(cacheKey, enrichedLead);
      }

      const duration = Date.now() - startTime;
      console.info(
        `✅ Enrichment complete for ${enrichedLead.contact.fullName} ` +
        `(${duration}ms, ${enrichmentSources.length} sources, ` +
        `score: ${enrichedLead.intelligence.leadScore})`
      );

      return enrichedLead;

    } catch (error) {
      console.error('❌ Lead enrichment error:', error);
      throw error;
    }
  }

  /**
   * Enrich multiple leads in bulk (more efficient)
   */
  public async enrichLeadsBulk(
    inputs: EnrichmentInput[],
    options: EnrichmentOptions = {}
  ): Promise<EnrichedLead[]> {
    console.info(`🎯 Starting bulk enrichment for ${inputs.length} leads`);

    // Process in batches to avoid overwhelming APIs
    const batchSize = 10;
    const results: EnrichedLead[] = [];

    for (let i = 0; i < inputs.length; i += batchSize) {
      const batch = inputs.slice(i, i + batchSize);
      const batchResults = await Promise.all(
        batch.map(input => this.enrichLead(input, options))
      );
      results.push(...batchResults);

      // Rate limiting delay between batches
      if (i + batchSize < inputs.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    console.info(`✅ Bulk enrichment complete: ${results.length} leads processed`);
    return results;
  }

  /**
   * Email validation enrichment
   */
  private async enrichWithEmailValidation(
    enrichedLead: EnrichedLead,
    email: string
  ): Promise<void> {
    try {
      const validation = await emailValidationService.validateEmail(email);
      
      enrichedLead.contact.emailValidation = {
        isValid: validation.isValid,
        isDeliverable: validation.isDeliverable,
        score: validation.score,
        suggestion: validation.suggestion,
      };

      // Update email if suggestion provided
      if (validation.suggestion && validation.score < 50) {
        enrichedLead.contact.email = validation.suggestion;
        enrichedLead.intelligence.insights.push(
          `Email corrected from ${email} to ${validation.suggestion}`
        );
      }

      // Add insights based on validation
      if (!validation.isDeliverable) {
        enrichedLead.intelligence.insights.push('⚠️ Email may not be deliverable');
      }
      if (validation.isDisposable) {
        enrichedLead.intelligence.insights.push('⚠️ Disposable email detected');
      }
      if (validation.isCatchAll) {
        enrichedLead.intelligence.insights.push('ℹ️ Company uses catch-all email');
      }

    } catch (error) {
      console.error('❌ Email validation enrichment error:', error);
    }
  }

  /**
   * LinkedIn enrichment
   */
  private async enrichWithLinkedIn(
    enrichedLead: EnrichedLead,
    input: EnrichmentInput
  ): Promise<void> {
    try {
      const profile = await linkedInScrapingService.enrichLeadWithLinkedIn(
        input.name || `${input.firstName} ${input.lastName}`,
        input.company,
        input.email
      );

      if (profile) {
        enrichedLead.linkedIn = {
          profileUrl: profile.profileUrl,
          headline: profile.headline,
          summary: profile.summary,
          currentCompany: profile.currentCompany,
          experience: profile.experience.map(exp => ({
            company: exp.company,
            title: exp.title,
            duration: exp.startDate && exp.endDate ? 
              `${exp.startDate} - ${exp.endDate}` : 
              exp.startDate ? `${exp.startDate} - Present` : undefined,
          })),
          education: profile.education.map(edu => ({
            school: edu.school,
            degree: edu.degree,
          })),
          skills: profile.skills,
          connections: profile.connections,
        };

        // Update contact info from LinkedIn
        if (!enrichedLead.contact.email && profile.contactInfo?.email) {
          enrichedLead.contact.email = profile.contactInfo.email;
        }
        if (!enrichedLead.contact.phone && profile.contactInfo?.phone) {
          enrichedLead.contact.phone = profile.contactInfo.phone;
        }
        if (!enrichedLead.contact.title && profile.currentCompany?.title) {
          enrichedLead.contact.title = profile.currentCompany.title;
        }

        // Add insights
        enrichedLead.intelligence.insights.push(
          `LinkedIn profile found with ${profile.connections || 0} connections`
        );
        
        if (profile.skills.length > 0) {
          enrichedLead.intelligence.tags.push(...profile.skills.slice(0, 5));
        }
      }

    } catch (error) {
      console.error('❌ LinkedIn enrichment error:', error);
    }
  }

  /**
   * Company data enrichment
   */
  private async enrichWithCompanyData(
    enrichedLead: EnrichedLead,
    companyName: string
  ): Promise<void> {
    try {
      const companyProfile = await linkedInScrapingService.getCompanyProfile(companyName);

      if (companyProfile) {
        enrichedLead.company = {
          name: companyProfile.name,
          website: companyProfile.website,
          industry: companyProfile.industry,
          size: companyProfile.companySize,
          headquarters: companyProfile.headquarters,
          founded: companyProfile.founded,
          description: companyProfile.description,
          linkedinUrl: companyProfile.linkedinUrl,
          employees: companyProfile.employees,
        };

        // Add insights
        if (companyProfile.employees) {
          const sizeCategory = 
            companyProfile.employees > 1000 ? 'Enterprise' :
            companyProfile.employees > 100 ? 'Mid-Market' : 'SMB';
          enrichedLead.intelligence.insights.push(
            `Company size: ${sizeCategory} (${companyProfile.employees} employees)`
          );
        }

        if (companyProfile.specialties.length > 0) {
          enrichedLead.intelligence.tags.push(...companyProfile.specialties.slice(0, 3));
        }
      }

    } catch (error) {
      console.error('❌ Company enrichment error:', error);
    }
  }

  /**
   * Freight-specific data enrichment
   */
  private async enrichWithFreightData(
    enrichedLead: EnrichedLead,
    input: EnrichmentInput
  ): Promise<void> {
    try {
      // Use existing LeadGenerationService to get FMCSA data
      // This is a placeholder - integrate with your existing freight data services
      
      if (input.company) {
        // Check if company is in freight/logistics industry
        const freightKeywords = [
          'trucking', 'logistics', 'freight', 'transportation',
          'carrier', 'shipping', 'delivery', 'warehouse'
        ];
        
        const isFreightRelated = freightKeywords.some(keyword =>
          input.company?.toLowerCase().includes(keyword) ||
          input.industry?.toLowerCase().includes(keyword) ||
          enrichedLead.company?.industry?.toLowerCase().includes(keyword)
        );

        if (isFreightRelated) {
          enrichedLead.freight = {
            // Placeholder - integrate with FMCSA API
            specializations: [],
          };
          
          enrichedLead.intelligence.tags.push('freight-industry');
          enrichedLead.intelligence.insights.push('Company operates in freight/logistics industry');
        }
      }

    } catch (error) {
      console.error('❌ Freight data enrichment error:', error);
    }
  }

  /**
   * AI-powered analysis and scoring
   */
  private async enrichWithAIAnalysis(
    enrichedLead: EnrichedLead,
    input: EnrichmentInput
  ): Promise<void> {
    try {
      // Calculate lead score based on available data
      let leadScore = 0;

      // Email quality (0-25 points)
      if (enrichedLead.contact.emailValidation) {
        leadScore += (enrichedLead.contact.emailValidation.score / 100) * 25;
      } else if (enrichedLead.contact.email) {
        leadScore += 10; // Has email but not validated
      }

      // LinkedIn presence (0-25 points)
      if (enrichedLead.linkedIn) {
        leadScore += 15;
        if (enrichedLead.linkedIn.connections && enrichedLead.linkedIn.connections > 500) {
          leadScore += 10;
        }
      }

      // Company data (0-25 points)
      if (enrichedLead.company) {
        leadScore += 10;
        if (enrichedLead.company.employees && enrichedLead.company.employees > 50) {
          leadScore += 10;
        }
        if (enrichedLead.company.website) {
          leadScore += 5;
        }
      }

      // Contact completeness (0-25 points)
      const hasPhone = !!enrichedLead.contact.phone;
      const hasTitle = !!enrichedLead.contact.title;
      const hasLocation = !!enrichedLead.contact.location;
      const completeness = [hasPhone, hasTitle, hasLocation].filter(Boolean).length;
      leadScore += (completeness / 3) * 25;

      enrichedLead.intelligence.leadScore = Math.round(leadScore);

      // Determine priority
      if (leadScore >= 75) {
        enrichedLead.intelligence.priority = 'hot';
        enrichedLead.intelligence.recommendedAction = 'Contact immediately - high-quality lead';
      } else if (leadScore >= 50) {
        enrichedLead.intelligence.priority = 'warm';
        enrichedLead.intelligence.recommendedAction = 'Add to nurture campaign';
      } else {
        enrichedLead.intelligence.priority = 'cold';
        enrichedLead.intelligence.recommendedAction = 'Gather more information before outreach';
      }

      // Fit score (how well they match your ideal customer profile)
      enrichedLead.intelligence.fitScore = this.calculateFitScore(enrichedLead);

      // Intent score (likelihood of being interested)
      enrichedLead.intelligence.intentScore = this.calculateIntentScore(enrichedLead);

    } catch (error) {
      console.error('❌ AI analysis error:', error);
    }
  }

  /**
   * Calculate how well the lead fits your ideal customer profile
   */
  private calculateFitScore(enrichedLead: EnrichedLead): number {
    let fitScore = 50; // Start at neutral

    // Company size fit
    if (enrichedLead.company?.employees) {
      if (enrichedLead.company.employees >= 50 && enrichedLead.company.employees <= 500) {
        fitScore += 20; // Sweet spot for FleetFlow
      }
    }

    // Industry fit
    if (enrichedLead.freight || enrichedLead.intelligence.tags.includes('freight-industry')) {
      fitScore += 30; // Perfect fit for FleetFlow
    }

    // Title fit (decision maker)
    const decisionMakerTitles = ['ceo', 'coo', 'owner', 'president', 'director', 'vp', 'manager'];
    if (enrichedLead.contact.title) {
      const hasDecisionMakerTitle = decisionMakerTitles.some(title =>
        enrichedLead.contact.title?.toLowerCase().includes(title)
      );
      if (hasDecisionMakerTitle) {
        fitScore += 20;
      }
    }

    return Math.min(100, Math.max(0, fitScore));
  }

  /**
   * Calculate likelihood of being interested in your product
   */
  private calculateIntentScore(enrichedLead: EnrichedLead): number {
    let intentScore = 30; // Start low

    // Recent job change (indicates openness to new solutions)
    if (enrichedLead.linkedIn?.currentCompany?.startDate) {
      const startDate = new Date(enrichedLead.linkedIn.currentCompany.startDate);
      const monthsInRole = (Date.now() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
      if (monthsInRole < 6) {
        intentScore += 30; // New in role, likely evaluating solutions
      }
    }

    // Company growth indicators
    if (enrichedLead.company?.founded) {
      const yearsInBusiness = new Date().getFullYear() - enrichedLead.company.founded;
      if (yearsInBusiness >= 2 && yearsInBusiness <= 10) {
        intentScore += 20; // Growth phase companies
      }
    }

    // Engagement indicators (placeholder - integrate with your tracking)
    // if (hasVisitedWebsite || hasOpenedEmails) intentScore += 20;

    return Math.min(100, Math.max(0, intentScore));
  }

  /**
   * Calculate enrichment quality metrics
   */
  private calculateEnrichmentMetrics(enrichedLead: EnrichedLead): void {
    // Calculate completeness (how much data we have)
    const dataPoints = [
      enrichedLead.contact.email,
      enrichedLead.contact.phone,
      enrichedLead.contact.title,
      enrichedLead.contact.location,
      enrichedLead.company,
      enrichedLead.linkedIn,
      enrichedLead.freight,
    ];
    const completeness = (dataPoints.filter(Boolean).length / dataPoints.length) * 100;
    enrichedLead.metadata.completeness = Math.round(completeness);

    // Calculate confidence (how reliable the data is)
    let confidence = 50; // Start at neutral
    
    if (enrichedLead.contact.emailValidation?.isValid) confidence += 20;
    if (enrichedLead.linkedIn) confidence += 20;
    if (enrichedLead.company) confidence += 10;
    
    enrichedLead.metadata.confidence = Math.min(100, confidence);
  }

  /**
   * Generate cache key for a lead
   */
  private getCacheKey(input: EnrichmentInput): string {
    return `${input.tenantId}:${input.email || input.name || input.company || 'unknown'}`.toLowerCase();
  }

  /**
   * Clear enrichment cache
   */
  public clearCache(): void {
    this.enrichmentCache.clear();
    emailValidationService.clearCache();
    linkedInScrapingService.clearCache();
    console.info('🎯 All enrichment caches cleared');
  }

  /**
   * Get enrichment statistics
   */
  public getStats(): {
    cacheSize: number;
    emailValidationCacheSize: number;
    linkedInCacheSize: number;
  } {
    return {
      cacheSize: this.enrichmentCache.size,
      emailValidationCacheSize: emailValidationService.getCacheStats().size,
      linkedInCacheSize: linkedInScrapingService.getCacheStats().size,
    };
  }
}

// Export singleton instance
export const unifiedLeadEnrichmentService = UnifiedLeadEnrichmentService.getInstance();
