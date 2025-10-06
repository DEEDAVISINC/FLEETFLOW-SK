/**
 * 🔗 LINKEDIN SCRAPING SERVICE
 * 
 * Professional data enrichment from LinkedIn
 * Integrates with multiple providers for reliability
 * 
 * Providers:
 * - Proxycurl (primary) - $29/mo for 3,000 credits
 * - PhantomBuster (backup) - $30/mo for 20 hours
 * - ScrapingBee (fallback) - $49/mo for 150,000 API calls
 */

interface LinkedInProfile {
  fullName: string;
  firstName: string;
  lastName: string;
  headline: string;
  location: string;
  profileUrl: string;
  photoUrl?: string;
  summary?: string;
  currentCompany?: {
    name: string;
    title: string;
    startDate?: string;
    location?: string;
    description?: string;
  };
  experience: Array<{
    company: string;
    title: string;
    startDate?: string;
    endDate?: string;
    location?: string;
    description?: string;
  }>;
  education: Array<{
    school: string;
    degree?: string;
    field?: string;
    startYear?: number;
    endYear?: number;
  }>;
  skills: string[];
  connections?: number;
  contactInfo?: {
    email?: string;
    phone?: string;
    twitter?: string;
    website?: string;
  };
  industries: string[];
  languages: string[];
}

interface LinkedInCompanyProfile {
  name: string;
  website?: string;
  industry?: string;
  companySize?: string;
  headquarters?: string;
  founded?: number;
  specialties: string[];
  description?: string;
  employees?: number;
  linkedinUrl: string;
  logo?: string;
  type?: string;
}

interface LinkedInSearchResult {
  profiles: LinkedInProfile[];
  totalResults: number;
  searchQuery: string;
}

export class LinkedInScrapingService {
  private static instance: LinkedInScrapingService;
  private proxycurlApiKey: string;
  private phantomBusterApiKey: string;
  private scrapingBeeApiKey: string;
  private cache: Map<string, LinkedInProfile | LinkedInCompanyProfile> = new Map();
  private cacheExpiry: number = 30 * 24 * 60 * 60 * 1000; // 30 days

  private constructor() {
    // API keys from environment variables
    this.proxycurlApiKey = process.env.PROXYCURL_API_KEY || '';
    this.phantomBusterApiKey = process.env.PHANTOMBUSTER_API_KEY || '';
    this.scrapingBeeApiKey = process.env.SCRAPINGBEE_API_KEY || '';
    
    console.info('🔗 LinkedIn Scraping Service initialized');
  }

  public static getInstance(): LinkedInScrapingService {
    if (!LinkedInScrapingService.instance) {
      LinkedInScrapingService.instance = new LinkedInScrapingService();
    }
    return LinkedInScrapingService.instance;
  }

  /**
   * Enrich a lead with LinkedIn profile data
   */
  public async enrichLeadWithLinkedIn(
    name: string,
    company?: string,
    email?: string
  ): Promise<LinkedInProfile | null> {
    try {
      // Try to find LinkedIn profile URL first
      let profileUrl: string | null = null;

      if (email) {
        profileUrl = await this.findProfileByEmail(email);
      }

      if (!profileUrl && name && company) {
        profileUrl = await this.findProfileByNameAndCompany(name, company);
      }

      if (!profileUrl) {
        console.warn(`⚠️ Could not find LinkedIn profile for ${name}`);
        return null;
      }

      // Get full profile data
      return await this.getProfileByUrl(profileUrl);

    } catch (error) {
      console.error(`❌ LinkedIn enrichment error for ${name}:`, error);
      return null;
    }
  }

  /**
   * Get LinkedIn profile by URL
   */
  public async getProfileByUrl(linkedinUrl: string): Promise<LinkedInProfile | null> {
    // Check cache first
    const cached = this.cache.get(linkedinUrl);
    if (cached && 'fullName' in cached) {
      console.info(`🔗 Using cached LinkedIn profile for ${linkedinUrl}`);
      return cached as LinkedInProfile;
    }

    try {
      // Try Proxycurl first (most reliable)
      if (this.proxycurlApiKey) {
        const profile = await this.getProfileWithProxycurl(linkedinUrl);
        this.cache.set(linkedinUrl, profile);
        return profile;
      }

      // Fallback to PhantomBuster
      if (this.phantomBusterApiKey) {
        const profile = await this.getProfileWithPhantomBuster(linkedinUrl);
        this.cache.set(linkedinUrl, profile);
        return profile;
      }

      // Final fallback to ScrapingBee
      if (this.scrapingBeeApiKey) {
        const profile = await this.getProfileWithScrapingBee(linkedinUrl);
        this.cache.set(linkedinUrl, profile);
        return profile;
      }

      console.warn('⚠️ No LinkedIn scraping API keys configured');
      return null;

    } catch (error) {
      console.error(`❌ LinkedIn profile scraping error:`, error);
      return null;
    }
  }

  /**
   * Get company profile from LinkedIn
   */
  public async getCompanyProfile(companyName: string): Promise<LinkedInCompanyProfile | null> {
    const cacheKey = `company:${companyName.toLowerCase()}`;
    const cached = this.cache.get(cacheKey);
    if (cached && 'employees' in cached) {
      console.info(`🔗 Using cached company profile for ${companyName}`);
      return cached as LinkedInCompanyProfile;
    }

    try {
      if (this.proxycurlApiKey) {
        const profile = await this.getCompanyWithProxycurl(companyName);
        if (profile) {
          this.cache.set(cacheKey, profile);
        }
        return profile;
      }

      console.warn('⚠️ No LinkedIn scraping API keys configured');
      return null;

    } catch (error) {
      console.error(`❌ LinkedIn company scraping error:`, error);
      return null;
    }
  }

  /**
   * Search for profiles by criteria
   */
  public async searchProfiles(
    filters: {
      title?: string;
      company?: string;
      location?: string;
      industry?: string;
      keywords?: string;
    },
    limit: number = 10
  ): Promise<LinkedInSearchResult> {
    try {
      if (this.proxycurlApiKey) {
        return await this.searchWithProxycurl(filters, limit);
      }

      console.warn('⚠️ No LinkedIn search API configured');
      return {
        profiles: [],
        totalResults: 0,
        searchQuery: JSON.stringify(filters),
      };

    } catch (error) {
      console.error('❌ LinkedIn search error:', error);
      return {
        profiles: [],
        totalResults: 0,
        searchQuery: JSON.stringify(filters),
      };
    }
  }

  /**
   * Find profile by email using Proxycurl
   */
  private async findProfileByEmail(email: string): Promise<string | null> {
    if (!this.proxycurlApiKey) return null;

    try {
      const response = await fetch(
        `https://nubela.co/proxycurl/api/contact-api/personal-email?email=${encodeURIComponent(email)}`,
        {
          headers: {
            'Authorization': `Bearer ${this.proxycurlApiKey}`,
          },
        }
      );

      if (!response.ok) return null;

      const data = await response.json();
      return data.linkedin_profile_url || null;

    } catch (error) {
      console.error('❌ Email to LinkedIn lookup error:', error);
      return null;
    }
  }

  /**
   * Find profile by name and company
   */
  private async findProfileByNameAndCompany(name: string, company: string): Promise<string | null> {
    if (!this.proxycurlApiKey) return null;

    try {
      const response = await fetch(
        `https://nubela.co/proxycurl/api/linkedin/profile/resolve?` +
        `first_name=${encodeURIComponent(name.split(' ')[0])}&` +
        `last_name=${encodeURIComponent(name.split(' ').slice(1).join(' '))}&` +
        `company_domain=${encodeURIComponent(company)}`,
        {
          headers: {
            'Authorization': `Bearer ${this.proxycurlApiKey}`,
          },
        }
      );

      if (!response.ok) return null;

      const data = await response.json();
      return data.linkedin_profile_url || null;

    } catch (error) {
      console.error('❌ Name/Company to LinkedIn lookup error:', error);
      return null;
    }
  }

  /**
   * Proxycurl profile scraping (primary provider)
   */
  private async getProfileWithProxycurl(linkedinUrl: string): Promise<LinkedInProfile> {
    const response = await fetch(
      `https://nubela.co/proxycurl/api/v2/linkedin?url=${encodeURIComponent(linkedinUrl)}&skills=include`,
      {
        headers: {
          'Authorization': `Bearer ${this.proxycurlApiKey}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Proxycurl API error: ${response.status}`);
    }

    const data = await response.json();

    return {
      fullName: data.full_name || '',
      firstName: data.first_name || '',
      lastName: data.last_name || '',
      headline: data.headline || '',
      location: data.city ? `${data.city}, ${data.state || data.country}` : '',
      profileUrl: linkedinUrl,
      photoUrl: data.profile_pic_url,
      summary: data.summary,
      currentCompany: data.experiences?.[0] ? {
        name: data.experiences[0].company,
        title: data.experiences[0].title,
        startDate: data.experiences[0].starts_at ? 
          `${data.experiences[0].starts_at.year}-${data.experiences[0].starts_at.month || 1}` : undefined,
        location: data.experiences[0].location,
        description: data.experiences[0].description,
      } : undefined,
      experience: (data.experiences || []).map((exp: any) => ({
        company: exp.company,
        title: exp.title,
        startDate: exp.starts_at ? `${exp.starts_at.year}-${exp.starts_at.month || 1}` : undefined,
        endDate: exp.ends_at ? `${exp.ends_at.year}-${exp.ends_at.month || 1}` : undefined,
        location: exp.location,
        description: exp.description,
      })),
      education: (data.education || []).map((edu: any) => ({
        school: edu.school,
        degree: edu.degree_name,
        field: edu.field_of_study,
        startYear: edu.starts_at?.year,
        endYear: edu.ends_at?.year,
      })),
      skills: data.skills || [],
      connections: data.connections,
      contactInfo: {
        email: data.personal_emails?.[0],
        phone: data.personal_numbers?.[0],
        twitter: data.twitter_handle,
        website: data.personal_websites?.[0],
      },
      industries: data.industry ? [data.industry] : [],
      languages: data.languages || [],
    };
  }

  /**
   * PhantomBuster profile scraping (backup provider)
   */
  private async getProfileWithPhantomBuster(linkedinUrl: string): Promise<LinkedInProfile> {
    // PhantomBuster requires launching a phantom and waiting for results
    // This is a simplified implementation
    const response = await fetch(
      'https://api.phantombuster.com/api/v2/agents/launch',
      {
        method: 'POST',
        headers: {
          'X-Phantombuster-Key': this.phantomBusterApiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: 'linkedin-profile-scraper', // Replace with actual agent ID
          argument: { profileUrl: linkedinUrl },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`PhantomBuster API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Note: In production, you'd need to poll for results
    // This is a placeholder structure
    return {
      fullName: data.fullName || '',
      firstName: data.firstName || '',
      lastName: data.lastName || '',
      headline: data.headline || '',
      location: data.location || '',
      profileUrl: linkedinUrl,
      photoUrl: data.photoUrl,
      summary: data.summary,
      experience: data.experience || [],
      education: data.education || [],
      skills: data.skills || [],
      industries: [],
      languages: [],
    };
  }

  /**
   * ScrapingBee profile scraping (fallback provider)
   */
  private async getProfileWithScrapingBee(linkedinUrl: string): Promise<LinkedInProfile> {
    const response = await fetch(
      `https://app.scrapingbee.com/api/v1/?api_key=${this.scrapingBeeApiKey}&url=${encodeURIComponent(linkedinUrl)}&render_js=true`
    );

    if (!response.ok) {
      throw new Error(`ScrapingBee API error: ${response.status}`);
    }

    const html = await response.text();
    
    // Basic HTML parsing (in production, use a proper HTML parser)
    // This is a simplified placeholder
    return {
      fullName: '',
      firstName: '',
      lastName: '',
      headline: '',
      location: '',
      profileUrl: linkedinUrl,
      experience: [],
      education: [],
      skills: [],
      industries: [],
      languages: [],
    };
  }

  /**
   * Get company profile with Proxycurl
   */
  private async getCompanyWithProxycurl(companyName: string): Promise<LinkedInCompanyProfile | null> {
    try {
      // First, resolve company name to LinkedIn URL
      const searchResponse = await fetch(
        `https://nubela.co/proxycurl/api/linkedin/company/resolve?company_name=${encodeURIComponent(companyName)}`,
        {
          headers: {
            'Authorization': `Bearer ${this.proxycurlApiKey}`,
          },
        }
      );

      if (!searchResponse.ok) return null;

      const searchData = await searchResponse.json();
      const companyUrl = searchData.linkedin_profile_url;

      if (!companyUrl) return null;

      // Get full company profile
      const profileResponse = await fetch(
        `https://nubela.co/proxycurl/api/linkedin/company?url=${encodeURIComponent(companyUrl)}`,
        {
          headers: {
            'Authorization': `Bearer ${this.proxycurlApiKey}`,
          },
        }
      );

      if (!profileResponse.ok) return null;

      const data = await profileResponse.json();

      return {
        name: data.name || companyName,
        website: data.website,
        industry: data.industry,
        companySize: data.company_size_on_linkedin,
        headquarters: data.hq ? `${data.hq.city}, ${data.hq.country}` : undefined,
        founded: data.founded_year,
        specialties: data.specialities || [],
        description: data.description,
        employees: data.company_size,
        linkedinUrl: companyUrl,
        logo: data.logo_url,
        type: data.company_type,
      };

    } catch (error) {
      console.error('❌ Company profile error:', error);
      return null;
    }
  }

  /**
   * Search profiles with Proxycurl
   */
  private async searchWithProxycurl(
    filters: {
      title?: string;
      company?: string;
      location?: string;
      industry?: string;
      keywords?: string;
    },
    limit: number
  ): Promise<LinkedInSearchResult> {
    const params = new URLSearchParams();
    if (filters.title) params.append('title', filters.title);
    if (filters.company) params.append('current_company_name', filters.company);
    if (filters.location) params.append('location', filters.location);
    if (filters.industry) params.append('industry', filters.industry);
    if (filters.keywords) params.append('keywords', filters.keywords);
    params.append('page_size', limit.toString());

    const response = await fetch(
      `https://nubela.co/proxycurl/api/search/person?${params.toString()}`,
      {
        headers: {
          'Authorization': `Bearer ${this.proxycurlApiKey}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Proxycurl search error: ${response.status}`);
    }

    const data = await response.json();

    const profiles: LinkedInProfile[] = await Promise.all(
      (data.results || []).slice(0, limit).map(async (result: any) => {
        if (result.linkedin_profile_url) {
          return await this.getProfileByUrl(result.linkedin_profile_url) || {
            fullName: result.name || '',
            firstName: '',
            lastName: '',
            headline: result.headline || '',
            location: result.location || '',
            profileUrl: result.linkedin_profile_url,
            experience: [],
            education: [],
            skills: [],
            industries: [],
            languages: [],
          };
        }
        return {
          fullName: result.name || '',
          firstName: '',
          lastName: '',
          headline: result.headline || '',
          location: result.location || '',
          profileUrl: '',
          experience: [],
          education: [],
          skills: [],
          industries: [],
          languages: [],
        };
      })
    );

    return {
      profiles,
      totalResults: data.total_result_count || profiles.length,
      searchQuery: JSON.stringify(filters),
    };
  }

  /**
   * Clear scraping cache
   */
  public clearCache(): void {
    this.cache.clear();
    console.info('🔗 LinkedIn scraping cache cleared');
  }

  /**
   * Get cache statistics
   */
  public getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

// Export singleton instance
export const linkedInScrapingService = LinkedInScrapingService.getInstance();
