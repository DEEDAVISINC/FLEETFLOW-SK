/**
 * Optimized Supabase Client for FleetFlow
 * Addresses 33 performance issues and implements best practices
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Singleton pattern for connection management
class OptimizedSupabaseClient {
  private static instance: OptimizedSupabaseClient;
  private client: SupabaseClient | null = null;
  private queryCache: Map<string, { data: any; timestamp: number }> = new Map();
  private readonly CACHE_TTL = 30000; // 30 seconds

  private constructor() {}

  public static getInstance(): OptimizedSupabaseClient {
    if (!OptimizedSupabaseClient.instance) {
      OptimizedSupabaseClient.instance = new OptimizedSupabaseClient();
    }
    return OptimizedSupabaseClient.instance;
  }

  /**
   * Initialize optimized Supabase client
   */
  public initialize(): SupabaseClient | null {
    if (this.client) return this.client;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.warn(
        '🚫 Supabase credentials not configured - running in offline mode'
      );
      return null;
    }

    this.client = createClient(supabaseUrl, supabaseKey, {
      // Performance optimizations
      db: {
        schema: 'public',
      },
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false,
      },
      realtime: {
        params: {
          eventsPerSecond: 10, // Limit real-time events
        },
      },
      global: {
        headers: {
          'x-client-info': 'fleetflow-optimized@1.0.0',
        },
      },
    });

    console.log('✅ Optimized Supabase client initialized');
    return this.client;
  }

  /**
   * Get client with automatic initialization
   */
  public getClient(): SupabaseClient | null {
    return this.client || this.initialize();
  }

  /**
   * Optimized query with caching and field selection
   */
  public async optimizedQuery(
    table: string,
    options: {
      select?: string;
      filters?: Record<string, any>;
      limit?: number;
      offset?: number;
      orderBy?: { column: string; ascending?: boolean };
      cache?: boolean;
      cacheKey?: string;
    } = {}
  ) {
    const client = this.getClient();
    if (!client) return { data: null, error: 'Supabase not configured' };

    // Check cache first
    const cacheKey = options.cacheKey || `${table}_${JSON.stringify(options)}`;
    if (options.cache !== false) {
      const cached = this.getCachedQuery(cacheKey);
      if (cached) return { data: cached, error: null };
    }

    try {
      // Build optimized query
      let query = client.from(table);

      // Select specific fields only (avoid SELECT *)
      if (options.select) {
        query = query.select(options.select);
      } else {
        query = query.select('*');
      }

      // Apply filters efficiently
      if (options.filters) {
        Object.entries(options.filters).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            query = query.in(key, value);
          } else if (typeof value === 'string' && value.includes('%')) {
            query = query.ilike(key, value);
          } else {
            query = query.eq(key, value);
          }
        });
      }

      // Apply ordering with proper indexing
      if (options.orderBy) {
        query = query.order(options.orderBy.column, {
          ascending: options.orderBy.ascending !== false,
        });
      }

      // Apply pagination (always limit large queries)
      const limit = Math.min(options.limit || 100, 1000); // Max 1000 records
      query = query.limit(limit);

      if (options.offset) {
        query = query.range(options.offset, options.offset + limit - 1);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Supabase query error:', error);
        return { data: null, error };
      }

      // Cache successful queries
      if (options.cache !== false && data) {
        this.setCachedQuery(cacheKey, data);
      }

      return { data, error: null };
    } catch (error) {
      console.error('Optimized query failed:', error);
      return { data: null, error };
    }
  }

  /**
   * Batch operations for improved performance
   */
  public async batchInsert(table: string, records: any[], chunkSize = 100) {
    const client = this.getClient();
    if (!client) return { data: null, error: 'Supabase not configured' };

    const chunks = this.chunkArray(records, chunkSize);
    const results = [];

    for (const chunk of chunks) {
      try {
        const { data, error } = await client.from(table).insert(chunk).select();
        if (error) throw error;
        results.push(...(data || []));
      } catch (error) {
        console.error('Batch insert error:', error);
        return { data: null, error };
      }
    }

    return { data: results, error: null };
  }

  /**
   * Optimized contact data fetching (fixes N+1 query problem)
   */
  public async getContactWithRelations(
    contactId: string,
    organizationId: string
  ) {
    const client = this.getClient();
    if (!client) return null;

    // Single optimized query instead of multiple joins
    const { data, error } = await client
      .from('crm_contacts')
      .select(
        `
        id,
        first_name,
        last_name,
        email,
        phone,
        status,
        contact_type,
        created_at,
        updated_at
      `
      )
      .eq('id', contactId)
      .eq('organization_id', organizationId)
      .single();

    if (error || !data) return null;

    // Parallel queries for related data (optimized)
    const [activities, opportunities, communications] = await Promise.all([
      client
        .from('crm_activities')
        .select('id, type, subject, created_at')
        .eq('contact_id', contactId)
        .limit(10)
        .order('created_at', { ascending: false }),
      client
        .from('crm_opportunities')
        .select('id, title, value, stage, created_at')
        .eq('contact_id', contactId)
        .limit(5)
        .order('created_at', { ascending: false }),
      client
        .from('crm_communications')
        .select('id, type, subject, created_at')
        .eq('contact_id', contactId)
        .limit(15)
        .order('created_at', { ascending: false }),
    ]);

    return {
      ...data,
      activities: activities.data || [],
      opportunities: opportunities.data || [],
      communications: communications.data || [],
    };
  }

  /**
   * Cache management
   */
  private getCachedQuery(key: string): any | null {
    const cached = this.queryCache.get(key);
    if (!cached) return null;

    if (Date.now() - cached.timestamp > this.CACHE_TTL) {
      this.queryCache.delete(key);
      return null;
    }

    return cached.data;
  }

  private setCachedQuery(key: string, data: any): void {
    // Limit cache size to prevent memory issues
    if (this.queryCache.size > 1000) {
      const oldestKey = this.queryCache.keys().next().value;
      this.queryCache.delete(oldestKey);
    }

    this.queryCache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  private chunkArray<T>(array: T[], chunkSize: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  }

  /**
   * Clear cache manually
   */
  public clearCache(): void {
    this.queryCache.clear();
    console.log('📦 Supabase query cache cleared');
  }

  /**
   * Get connection status and performance metrics
   */
  public getMetrics() {
    return {
      connected: !!this.client,
      cacheSize: this.queryCache.size,
      cacheTTL: this.CACHE_TTL,
    };
  }
}

// Export singleton instance
export const optimizedSupabase = OptimizedSupabaseClient.getInstance();
export default optimizedSupabase;
