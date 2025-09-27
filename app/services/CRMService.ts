// ============================================================================
// FLEETFLOW CRM SERVICE - COMPREHENSIVE PRODUCTION READY
// ============================================================================

import { createClient } from '@supabase/supabase-js';

// ============================================================================
// TYPESCRIPT INTERFACES
// ============================================================================

interface CRMContact {
  id?: string;
  contact_type: 'driver' | 'shipper' | 'carrier' | 'broker' | 'customer';
  first_name: string;
  last_name: string;
  title?: string;
  email?: string;
  phone?: string;
  mobile?: string;
  fax?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  company_id?: string;
  cdl_number?: string;
  cdl_class?: string;
  cdl_expiry?: string;
  dot_number?: string;
  mc_number?: string;
  duns_number?: string;
  status?: 'active' | 'inactive' | 'prospect' | 'blacklisted';
  lead_source?: string;
  lead_score?: number;
  preferred_contact_method?: 'email' | 'phone' | 'sms' | 'mail';
  time_zone?: string;
  notes?: string;
  tags?: string[];
  custom_fields?: Record<string, any>;
}

interface CRMCompany {
  id?: string;
  company_name: string;
  legal_name?: string;
  company_type: 'shipper' | 'carrier' | 'broker' | 'customer' | 'vendor';
  industry?: string;
  employee_count?: number;
  annual_revenue?: number;
  website?: string;
  main_phone?: string;
  main_email?: string;
  dot_number?: string;
  mc_number?: string;
  duns_number?: string;
  ein_number?: string;
  status?: 'active' | 'inactive' | 'prospect' | 'blacklisted';
  tier?: 'premium' | 'standard' | 'basic';
  credit_limit?: number;
  payment_terms?: number;
  notes?: string;
  tags?: string[];
  custom_fields?: Record<string, any>;
}

interface CRMOpportunity {
  id?: string;
  opportunity_name: string;
  description?: string;
  contact_id?: string;
  company_id?: string;
  pipeline_id?: string;
  stage: string;
  probability?: number;
  value?: number;
  expected_close_date?: string;
  actual_close_date?: string;
  load_type?: string;
  origin_city?: string;
  origin_state?: string;
  destination_city?: string;
  destination_state?: string;
  equipment_type?: string;
  status?: 'open' | 'won' | 'lost' | 'cancelled';
  win_reason?: string;
  loss_reason?: string;
  assigned_to?: string;
  notes?: string;
  tags?: string[];
  custom_fields?: Record<string, any>;
}

interface CRMActivity {
  id?: string;
  activity_type:
    | 'call'
    | 'email'
    | 'meeting'
    | 'task'
    | 'note'
    | 'sms'
    | 'quote'
    | 'follow_up';
  subject: string;
  description?: string;
  contact_id?: string;
  company_id?: string;
  opportunity_id?: string;
  activity_date: string;
  duration_minutes?: number;
  location?: string;
  status?: 'planned' | 'in_progress' | 'completed' | 'cancelled';
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  call_direction?: 'inbound' | 'outbound';
  call_outcome?: string;
  call_recording_url?: string;
  email_subject?: string;
  email_body?: string;
  email_opened?: boolean;
  email_clicked?: boolean;
  meeting_type?: 'phone' | 'video' | 'in_person';
  meeting_url?: string;
  attendees?: string[];
  assigned_to?: string;
  tags?: string[];
  custom_fields?: Record<string, any>;
}

interface CRMFilters {
  contact_type?: string;
  status?: string;
  lead_source?: string;
  assigned_to?: string;
  date_from?: string;
  date_to?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

interface CRMDashboard {
  total_contacts: number;
  total_opportunities: number;
  total_activities: number;
  pipeline_value: number;
  won_opportunities: number;
  conversion_rate: number;
  recent_activities: CRMActivity[];
  top_opportunities: CRMOpportunity[];
  lead_sources: Array<{ source: string; count: number }>;
  contact_types: Array<{ type: string; count: number }>;
  monthly_revenue: Array<{ month: string; revenue: number }>;
}

// ============================================================================
// CRM SERVICE CLASS
// ============================================================================

class CRMService {
  private supabase: any;
  private organizationId: string;

  constructor(organizationId: string) {
    // Check if Supabase environment variables are available
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (
      supabaseUrl &&
      supabaseKey &&
      supabaseUrl !== 'your-supabase-url' &&
      supabaseKey !== 'your-supabase-key'
    ) {
      try {
        this.supabase = createClient(supabaseUrl, supabaseKey);
        console.info('✅ CRM Service: Supabase client initialized');
      } catch (error) {
        console.error(
          '❌ CRM Service: Supabase client failed to initialize, using empty client'
        );
        this.supabase = this.createEmptySupabaseClient();
      }
    } else {
      // Use empty client when Supabase is not configured - no mock data
      console.warn('⚠️ CRM Service: Supabase not configured, using empty data');
      this.supabase = this.createEmptySupabaseClient();
    }
    this.organizationId = organizationId;
  }

  // ============================================================================
  // EMPTY SUPABASE CLIENT
  // ============================================================================

  private createEmptySupabaseClient() {
    // Mock data removed - CRM will require real Supabase connection for data
    return {
      from: (table: string) => ({
        select: (columns: string, options?: any) => {
          const result = { data: [], count: 0 };

          return {
            eq: (column: string, value: any) => Promise.resolve({ data: [] }),
            not: (column: string, operator: string, value: any) =>
              Promise.resolve({ data: [] }),
            order: (column: string, options: any) => ({
              limit: (count: number) => Promise.resolve({ data: [] }),
            }),
            limit: (count: number) => Promise.resolve({ data: [] }),
            // For direct Promise resolution (like await Promise.all)
            then: (callback: any) => callback(result),
            // For count queries
            ...result,
          };
        },
        insert: (data: any) => Promise.resolve({ data: null, error: null }),
        update: (data: any) => Promise.resolve({ data: null, error: null }),
        delete: () => Promise.resolve({ data: null, error: null }),
      }),
    };
  }

  // ============================================================================
  // CONTACT MANAGEMENT
  // ============================================================================

  async createContact(contactData: CRMContact): Promise<CRMContact> {
    try {
      // Validate required fields
      if (
        !contactData.first_name ||
        !contactData.last_name ||
        !contactData.contact_type
      ) {
        throw new Error(
          'Missing required fields: first_name, last_name, contact_type'
        );
      }

      // Calculate initial lead score
      const initialLeadScore =
        await this.calculateInitialLeadScore(contactData);

      const { data, error } = await this.supabase
        .from('crm_contacts')
        .insert([
          {
            ...contactData,
            lead_score: initialLeadScore,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) throw error;

      // Log activity
      await this.createActivity({
        activity_type: 'note',
        subject: `Contact Created: ${contactData.first_name} ${contactData.last_name}`,
        description: `New ${contactData.contact_type} contact added to the system`,
        contact_id: data.id,
        activity_date: new Date().toISOString(),
        status: 'completed',
      });

      return data;
    } catch (error) {
      console.error('Error creating contact:', error);
      throw error;
    }
  }

  async updateContact(
    contactId: string,
    updateData: Partial<CRMContact>
  ): Promise<CRMContact> {
    try {
      const { data, error } = await this.supabase
        .from('crm_contacts')
        .update({
          ...updateData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', contactId)
        .select()
        .single();

      if (error) throw error;

      // Recalculate lead score if relevant data changed
      if (updateData.email || updateData.phone || updateData.company_id) {
        await this.calculateLeadScore(contactId);
      }

      return data;
    } catch (error) {
      console.error('Error updating contact:', error);
      throw error;
    }
  }

  async getContacts(
    organizationId: string,
    filters: CRMFilters = {}
  ): Promise<CRMContact[]> {
    try {
      let query = this.supabase.from('v_crm_contacts_with_company').select('*');

      // Apply filters
      if (filters.contact_type) {
        query = query.eq('contact_type', filters.contact_type);
      }
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.lead_source) {
        query = query.eq('lead_source', filters.lead_source);
      }
      if (filters.assigned_to) {
        query = query.eq('assigned_to', filters.assigned_to);
      }
      if (filters.search) {
        query = query.or(
          `first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`
        );
      }

      // Apply pagination
      if (filters.limit) {
        query = query.limit(filters.limit);
      }
      if (filters.offset) {
        query = query.range(
          filters.offset,
          filters.offset + (filters.limit || 10) - 1
        );
      }

      // Order by latest first
      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting contacts:', error);
      throw error;
    }
  }

  async getContact(contactId: string): Promise<CRMContact | null> {
    try {
      const { data, error } = await this.supabase
        .from('v_crm_contacts_with_company')
        .select('*')
        .eq('id', contactId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting contact:', error);
      throw error;
    }
  }

  // ============================================================================
  // OPPORTUNITY MANAGEMENT
  // ============================================================================

  async createOpportunity(
    opportunityData: CRMOpportunity
  ): Promise<CRMOpportunity> {
    try {
      // Validate required fields
      if (!opportunityData.opportunity_name || !opportunityData.stage) {
        throw new Error('Missing required fields: opportunity_name, stage');
      }

      const { data, error } = await this.supabase
        .from('crm_opportunities')
        .insert([
          {
            ...opportunityData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) throw error;

      // Log activity
      await this.createActivity({
        activity_type: 'note',
        subject: `Opportunity Created: ${opportunityData.opportunity_name}`,
        description: `New opportunity created in ${opportunityData.stage} stage`,
        contact_id: opportunityData.contact_id,
        company_id: opportunityData.company_id,
        opportunity_id: data.id,
        activity_date: new Date().toISOString(),
        status: 'completed',
      });

      return data;
    } catch (error) {
      console.error('Error creating opportunity:', error);
      throw error;
    }
  }

  async updateOpportunityStage(
    opportunityId: string,
    newStage: string
  ): Promise<CRMOpportunity> {
    try {
      // Get current opportunity
      const { data: currentOpp, error: fetchError } = await this.supabase
        .from('crm_opportunities')
        .select('*')
        .eq('id', opportunityId)
        .single();

      if (fetchError) throw fetchError;

      // Update stage
      const { data, error } = await this.supabase
        .from('crm_opportunities')
        .update({
          stage: newStage,
          updated_at: new Date().toISOString(),
        })
        .eq('id', opportunityId)
        .select()
        .single();

      if (error) throw error;

      // Log stage change activity
      await this.createActivity({
        activity_type: 'note',
        subject: `Stage Changed: ${currentOpp.opportunity_name}`,
        description: `Opportunity moved from ${currentOpp.stage} to ${newStage}`,
        contact_id: data.contact_id,
        company_id: data.company_id,
        opportunity_id: opportunityId,
        activity_date: new Date().toISOString(),
        status: 'completed',
      });

      return data;
    } catch (error) {
      console.error('Error updating opportunity stage:', error);
      throw error;
    }
  }

  async getOpportunities(
    organizationId: string,
    filters: CRMFilters = {}
  ): Promise<CRMOpportunity[]> {
    try {
      let query = this.supabase.from('v_crm_opportunity_pipeline').select('*');

      // Apply filters
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.assigned_to) {
        query = query.eq('assigned_to', filters.assigned_to);
      }
      if (filters.search) {
        query = query.or(
          `opportunity_name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
        );
      }

      // Apply pagination
      if (filters.limit) {
        query = query.limit(filters.limit);
      }
      if (filters.offset) {
        query = query.range(
          filters.offset,
          filters.offset + (filters.limit || 10) - 1
        );
      }

      // Order by expected close date
      query = query.order('expected_close_date', { ascending: true });

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting opportunities:', error);
      throw error;
    }
  }

  // ============================================================================
  // ACTIVITY MANAGEMENT
  // ============================================================================

  async createActivity(activityData: CRMActivity): Promise<CRMActivity> {
    try {
      // Validate required fields
      if (
        !activityData.activity_type ||
        !activityData.subject ||
        !activityData.activity_date
      ) {
        throw new Error(
          'Missing required fields: activity_type, subject, activity_date'
        );
      }

      const { data, error } = await this.supabase
        .from('crm_activities')
        .insert([
          {
            ...activityData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) throw error;

      // Update contact's last activity date
      if (activityData.contact_id) {
        await this.supabase
          .from('crm_contacts')
          .update({ updated_at: new Date().toISOString() })
          .eq('id', activityData.contact_id);
      }

      return data;
    } catch (error) {
      console.error('Error creating activity:', error);
      throw error;
    }
  }

  async getActivities(
    organizationId: string,
    filters: CRMFilters = {}
  ): Promise<CRMActivity[]> {
    try {
      let query = this.supabase.from('v_crm_activity_summary').select('*');

      // Apply filters
      if (filters.contact_type) {
        query = query.eq('activity_type', filters.contact_type);
      }
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.assigned_to) {
        query = query.eq('assigned_to', filters.assigned_to);
      }
      if (filters.date_from) {
        query = query.gte('activity_date', filters.date_from);
      }
      if (filters.date_to) {
        query = query.lte('activity_date', filters.date_to);
      }

      // Apply pagination
      if (filters.limit) {
        query = query.limit(filters.limit);
      }
      if (filters.offset) {
        query = query.range(
          filters.offset,
          filters.offset + (filters.limit || 10) - 1
        );
      }

      // Order by activity date
      query = query.order('activity_date', { ascending: false });

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting activities:', error);
      throw error;
    }
  }

  // ============================================================================
  // AI FEATURES
  // ============================================================================

  async calculateLeadScore(contactId: string): Promise<number> {
    try {
      // Get contact data
      const contact = await this.getContact(contactId);
      if (!contact) throw new Error('Contact not found');

      let score = 0;

      // Basic information completeness (30 points)
      if (contact.email) score += 10;
      if (contact.phone) score += 10;
      if (contact.company_id) score += 10;

      // Contact type scoring (20 points)
      const typeScores = {
        shipper: 20,
        carrier: 15,
        broker: 10,
        customer: 15,
        driver: 5,
      };
      score += typeScores[contact.contact_type] || 0;

      // Industry-specific scoring (20 points)
      if (contact.dot_number) score += 10;
      if (contact.mc_number) score += 10;

      // Activity-based scoring (30 points)
      const { data: activities } = await this.supabase
        .from('crm_activities')
        .select('*')
        .eq('contact_id', contactId)
        .gte(
          'activity_date',
          new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
        );

      const activityCount = activities?.length || 0;
      score += Math.min(activityCount * 3, 30);

      // Opportunity-based scoring (bonus)
      const { data: opportunities } = await this.supabase
        .from('crm_opportunities')
        .select('*')
        .eq('contact_id', contactId)
        .eq('status', 'open');

      const oppCount = opportunities?.length || 0;
      score += oppCount * 10;

      // Cap at 100
      score = Math.min(score, 100);

      // Update the contact's lead score
      await this.supabase
        .from('crm_contacts')
        .update({ lead_score: score })
        .eq('id', contactId);

      return score;
    } catch (error) {
      console.error('Error calculating lead score:', error);
      throw error;
    }
  }

  /**
   * AI automatically scores leads and suggests actions
   * Returns: personality_profile, buying_signals, next_best_action
   */
  async analyzeContactWithAI(contactId: string): Promise<any> {
    try {
      // Import AI Analysis Service dynamically to avoid circular dependencies
      const AIContactAnalysisService = await import(
        './AIContactAnalysisService'
      );
      const aiAnalysis = new AIContactAnalysisService.default(
        this.organizationId
      );

      // Perform comprehensive AI analysis
      const analysis = await aiAnalysis.analyzeContactWithAI(contactId);

      // Update contact with AI insights
      await this.updateContactAIInsights(contactId, analysis);

      return {
        personality_profile: analysis.personality_profile,
        buying_signals: analysis.buying_signals,
        next_best_action: analysis.next_best_action,
        lead_score: analysis.lead_score,
        engagement_level: analysis.engagement_level,
        conversion_probability: analysis.conversion_probability,
        estimated_deal_value: analysis.estimated_deal_value,
        key_insights: analysis.key_insights,
        risk_factors: analysis.risk_factors,
        opportunities: analysis.opportunities,
        competitor_threat: analysis.competitor_threat,
        lifetime_value_prediction: analysis.lifetime_value_prediction,
      };
    } catch (error) {
      console.error('Error in AI contact analysis:', error);
      throw error;
    }
  }

  // ============================================================================
  // REPORTING
  // ============================================================================

  async getCRMDashboard(organizationId: string): Promise<CRMDashboard> {
    try {
      // Check if using empty client (Supabase not configured)
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (
        !supabaseUrl ||
        !supabaseKey ||
        supabaseUrl === 'your-supabase-url' ||
        supabaseKey === 'your-supabase-key'
      ) {
        // Return empty dashboard data when Supabase is not configured - no mock data
        console.info(
          '📊 CRM Dashboard: Using empty data (Supabase not configured)'
        );
        const emptyDashboard: CRMDashboard = {
          total_contacts: 0,
          total_opportunities: 0,
          total_activities: 0,
          pipeline_value: 0,
          won_opportunities: 0,
          conversion_rate: 0,
          recent_activities: [],
          top_opportunities: [],
          lead_sources: [],
          contact_types: [],
          monthly_revenue: [],
        };
        return emptyDashboard;
      }

      // Get total counts (real Supabase implementation)
      const [
        { data: contacts },
        { data: opportunities },
        { data: activities },
        { data: wonOpps },
        { data: recentActivities },
        { data: topOpps },
      ] = await Promise.all([
        this.supabase.from('crm_contacts').select('id', { count: 'exact' }),
        this.supabase
          .from('crm_opportunities')
          .select('id,value', { count: 'exact' }),
        this.supabase.from('crm_activities').select('id', { count: 'exact' }),
        this.supabase
          .from('crm_opportunities')
          .select('id,value')
          .eq('status', 'won'),
        this.supabase
          .from('crm_activities')
          .select('*')
          .order('activity_date', { ascending: false })
          .limit(10),
        this.supabase
          .from('crm_opportunities')
          .select('*')
          .order('value', { ascending: false })
          .limit(10),
      ]);

      // Calculate metrics
      const totalContacts = contacts?.length || 0;
      const totalOpportunities = opportunities?.length || 0;
      const totalActivities = activities?.length || 0;
      const wonOpportunities = wonOpps?.length || 0;
      const pipelineValue =
        opportunities?.reduce(
          (sum: number, opp: any) => sum + (opp.value || 0),
          0
        ) || 0;
      const conversionRate =
        totalOpportunities > 0
          ? (wonOpportunities / totalOpportunities) * 100
          : 0;

      // Get lead sources
      const { data: leadSources } = await this.supabase
        .from('crm_contacts')
        .select('lead_source')
        .not('lead_source', 'is', null);

      const leadSourceCounts =
        leadSources?.reduce(
          (acc, contact) => {
            acc[contact.lead_source] = (acc[contact.lead_source] || 0) + 1;
            return acc;
          },
          {} as Record<string, number>
        ) || {};

      // Get contact types
      const { data: contactTypes } = await this.supabase
        .from('crm_contacts')
        .select('contact_type');

      const contactTypeCounts =
        contactTypes?.reduce(
          (acc, contact) => {
            acc[contact.contact_type] = (acc[contact.contact_type] || 0) + 1;
            return acc;
          },
          {} as Record<string, number>
        ) || {};

      // Get monthly revenue (last 12 months)
      const monthlyRevenue = await this.getMonthlyRevenue(organizationId);

      return {
        total_contacts: totalContacts,
        total_opportunities: totalOpportunities,
        total_activities: totalActivities,
        pipeline_value: pipelineValue,
        won_opportunities: wonOpportunities,
        conversion_rate: conversionRate,
        recent_activities: recentActivities || [],
        top_opportunities: topOpps || [],
        lead_sources: Object.entries(leadSourceCounts).map(
          ([source, count]) => ({ source, count })
        ),
        contact_types: Object.entries(contactTypeCounts).map(
          ([type, count]) => ({ type, count })
        ),
        monthly_revenue: monthlyRevenue,
      };
    } catch (error) {
      console.error('Error getting CRM dashboard:', error);
      // Return empty dashboard on error to prevent system crashes
      const emptyDashboard: CRMDashboard = {
        total_contacts: 0,
        total_opportunities: 0,
        total_activities: 0,
        pipeline_value: 0,
        won_opportunities: 0,
        conversion_rate: 0,
        recent_activities: [],
        top_opportunities: [],
        lead_sources: [],
        contact_types: [],
        monthly_revenue: [],
      };
      return emptyDashboard;
    }
  }

  async getLeadSourceReport(organizationId: string): Promise<any> {
    try {
      const { data, error } = await this.supabase
        .from('crm_contacts')
        .select(
          `
          lead_source,
          contact_type,
          status,
          lead_score,
          created_at
        `
        )
        .not('lead_source', 'is', null);

      if (error) throw error;

      // Group by lead source
      const sourceReport =
        data?.reduce(
          (acc, contact) => {
            const source = contact.lead_source;
            if (!acc[source]) {
              acc[source] = {
                source,
                total_contacts: 0,
                active_contacts: 0,
                average_lead_score: 0,
                contact_types: {},
                monthly_trend: {},
              };
            }

            acc[source].total_contacts++;
            if (contact.status === 'active') acc[source].active_contacts++;

            // Contact type breakdown
            acc[source].contact_types[contact.contact_type] =
              (acc[source].contact_types[contact.contact_type] || 0) + 1;

            // Monthly trend
            const month = new Date(contact.created_at)
              .toISOString()
              .substr(0, 7);
            acc[source].monthly_trend[month] =
              (acc[source].monthly_trend[month] || 0) + 1;

            return acc;
          },
          {} as Record<string, any>
        ) || {};

      // Calculate average lead scores
      for (const source in sourceReport) {
        const sourceContacts =
          data?.filter((c) => c.lead_source === source) || [];
        const avgScore =
          sourceContacts.reduce((sum, c) => sum + (c.lead_score || 0), 0) /
          sourceContacts.length;
        sourceReport[source].average_lead_score = Math.round(avgScore);
      }

      return Object.values(sourceReport);
    } catch (error) {
      console.error('Error getting lead source report:', error);
      throw error;
    }
  }

  // ============================================================================
  // HELPER METHODS
  // ============================================================================

  private async calculateInitialLeadScore(
    contactData: CRMContact
  ): Promise<number> {
    let score = 0;

    // Basic completeness
    if (contactData.email) score += 10;
    if (contactData.phone) score += 10;
    if (contactData.company_id) score += 10;

    // Contact type
    const typeScores = {
      shipper: 20,
      carrier: 15,
      broker: 10,
      customer: 15,
      driver: 5,
    };
    score += typeScores[contactData.contact_type] || 0;

    // Industry info
    if (contactData.dot_number) score += 10;
    if (contactData.mc_number) score += 10;

    return Math.min(score, 100);
  }

  private calculateContactHealth(
    contact: any,
    activities: any[],
    opportunities: any[]
  ): string {
    let score = 0;

    // Recent activity
    const recentActivities =
      activities?.filter(
        (a) =>
          new Date(a.activity_date) >
          new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      ) || [];
    score += Math.min(recentActivities.length * 10, 40);

    // Open opportunities
    const openOpps = opportunities?.filter((o) => o.status === 'open') || [];
    score += openOpps.length * 20;

    // Contact completeness
    if (contact.email) score += 10;
    if (contact.phone) score += 10;
    if (contact.company_id) score += 10;

    if (score >= 80) return 'excellent';
    if (score >= 60) return 'good';
    if (score >= 40) return 'fair';
    return 'poor';
  }

  private calculateEngagementLevel(activities: any[]): string {
    const recentActivities =
      activities?.filter(
        (a) =>
          new Date(a.activity_date) >
          new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      ) || [];

    if (recentActivities.length >= 10) return 'high';
    if (recentActivities.length >= 5) return 'medium';
    if (recentActivities.length >= 1) return 'low';
    return 'none';
  }

  private suggestNextAction(
    contact: any,
    activities: any[],
    opportunities: any[]
  ): string {
    const recentActivities =
      activities?.filter(
        (a) =>
          new Date(a.activity_date) >
          new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      ) || [];

    if (recentActivities.length === 0) return 'Schedule follow-up call';

    const lastActivity = activities?.[0];
    if (
      lastActivity?.activity_type === 'call' &&
      lastActivity?.call_outcome === 'no_answer'
    ) {
      return 'Send follow-up email';
    }

    const openOpps = opportunities?.filter((o) => o.status === 'open') || [];
    if (openOpps.length > 0) {
      return 'Update opportunity status';
    }

    return 'Schedule regular check-in';
  }

  private identifyRiskFactors(
    contact: any,
    activities: any[],
    opportunities: any[]
  ): string[] {
    const risks: string[] = [];

    // No recent activity
    const recentActivities =
      activities?.filter(
        (a) =>
          new Date(a.activity_date) >
          new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      ) || [];
    if (recentActivities.length === 0) risks.push('No recent activity');

    // Low lead score
    if ((contact.lead_score || 0) < 30) risks.push('Low lead score');

    // Incomplete profile
    if (!contact.email && !contact.phone)
      risks.push('Missing contact information');

    // Lost opportunities
    const lostOpps = opportunities?.filter((o) => o.status === 'lost') || [];
    if (lostOpps.length > 0) risks.push('Previous lost opportunities');

    return risks;
  }

  private identifyOpportunities(
    contact: any,
    activities: any[],
    opportunities: any[]
  ): string[] {
    const opps: string[] = [];

    // High engagement
    const recentActivities =
      activities?.filter(
        (a) =>
          new Date(a.activity_date) >
          new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      ) || [];
    if (recentActivities.length >= 5) opps.push('High engagement level');

    // Industry match
    if (contact.contact_type === 'shipper' && contact.mc_number) {
      opps.push('Large shipper potential');
    }

    // Complete profile
    if (contact.email && contact.phone && contact.company_id) {
      opps.push('Complete profile ready for outreach');
    }

    return opps;
  }

  private analyzeCommPreferences(activities: any[]): any {
    const commTypes =
      activities?.reduce(
        (acc, activity) => {
          acc[activity.activity_type] = (acc[activity.activity_type] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      ) || {};

    const total = Object.values(commTypes).reduce(
      (sum, count) => sum + count,
      0
    );
    const preferences = Object.entries(commTypes)
      .map(([type, count]) => ({ type, percentage: (count / total) * 100 }))
      .sort((a, b) => b.percentage - a.percentage);

    return {
      preferred_method: preferences[0]?.type || 'email',
      preferences,
    };
  }

  private predictContactValue(contact: any, opportunities: any[]): number {
    const avgOppValue =
      opportunities?.reduce((sum, opp) => sum + (opp.value || 0), 0) /
      (opportunities?.length || 1);
    const leadScoreMultiplier = (contact.lead_score || 50) / 100;

    return Math.round(avgOppValue * leadScoreMultiplier);
  }

  private async getMonthlyRevenue(
    organizationId: string
  ): Promise<Array<{ month: string; revenue: number }>> {
    const { data, error } = await this.supabase
      .from('crm_opportunities')
      .select('value,actual_close_date')
      .eq('status', 'won')
      .not('actual_close_date', 'is', null)
      .gte(
        'actual_close_date',
        new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString()
      );

    if (error) return [];

    const monthlyData =
      data?.reduce(
        (acc, opp) => {
          const month = new Date(opp.actual_close_date)
            .toISOString()
            .substr(0, 7);
          acc[month] = (acc[month] || 0) + (opp.value || 0);
          return acc;
        },
        {} as Record<string, number>
      ) || {};

    return Object.entries(monthlyData)
      .map(([month, revenue]) => ({ month, revenue }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }

  /**
   * Update contact with AI insights
   */
  private async updateContactAIInsights(
    contactId: string,
    analysis: any
  ): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('crm_contacts')
        .update({
          lead_score: analysis.lead_score,
          engagement_level: analysis.engagement_level,
          conversion_probability: analysis.conversion_probability,
          estimated_deal_value: analysis.estimated_deal_value,
          ai_last_analyzed: new Date().toISOString(),
          ai_insights: {
            personality_profile: analysis.personality_profile,
            buying_signals: analysis.buying_signals,
            next_best_action: analysis.next_best_action,
            key_insights: analysis.key_insights,
            risk_factors: analysis.risk_factors,
            opportunities: analysis.opportunities,
            competitor_threat: analysis.competitor_threat,
            lifetime_value_prediction: analysis.lifetime_value_prediction,
          },
        })
        .eq('id', contactId)
        .eq('organization_id', this.organizationId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating contact AI insights:', error);
      throw error;
    }
  }

  /**
   * Get AI insights for a contact
   */
  async getContactAIInsights(contactId: string): Promise<any> {
    try {
      const { data, error } = await this.supabase
        .from('crm_contacts')
        .select(
          'ai_insights, ai_last_analyzed, lead_score, engagement_level, conversion_probability'
        )
        .eq('id', contactId)
        .eq('organization_id', this.organizationId)
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error fetching contact AI insights:', error);
      throw error;
    }
  }

  /**
   * Bulk analyze contacts with AI
   */
  async bulkAnalyzeContactsWithAI(contactIds: string[]): Promise<any[]> {
    const results = [];

    for (const contactId of contactIds) {
      try {
        const analysis = await this.analyzeContactWithAI(contactId);
        results.push({
          contact_id: contactId,
          status: 'success',
          analysis: analysis,
        });
      } catch (error) {
        results.push({
          contact_id: contactId,
          status: 'failed',
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return results;
  }

  /**
   * Get contacts that need AI analysis
   */
  async getContactsNeedingAIAnalysis(limit: number = 50): Promise<any[]> {
    try {
      const { data, error } = await this.supabase
        .from('crm_contacts')
        .select(
          'id, name, email, company, contact_type, last_contact_date, ai_last_analyzed'
        )
        .eq('organization_id', this.organizationId)
        .or(
          'ai_last_analyzed.is.null,ai_last_analyzed.lt.' +
            new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        )
        .limit(limit);

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching contacts needing AI analysis:', error);
      return [];
    }
  }
}

export default CRMService;
export type {
  CRMActivity,
  CRMCompany,
  CRMContact,
  CRMDashboard,
  CRMFilters,
  CRMOpportunity,
};
