// lib/supabase-config.ts
// Environment-aware Supabase configuration for FleetFlow

import {
  createClientComponentClient,
  createServerComponentClient,
} from '@supabase/auth-helpers-nextjs';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

// ================================================================
// ENVIRONMENT DETECTION
// ================================================================

export const getEnvironment = () => {
  // Vercel environment detection
  if (process.env.VERCEL_ENV === 'production') return 'production';
  if (process.env.VERCEL_ENV === 'preview') return 'staging';
  if (process.env.NODE_ENV === 'development') return 'development';

  // Fallback based on URL or other indicators
  if (process.env.NEXT_PUBLIC_SITE_URL?.includes('fleetflow.vercel.app'))
    return 'production';
  if (process.env.NEXT_PUBLIC_SITE_URL?.includes('staging')) return 'staging';

  return 'development';
};

// ================================================================
// CONFIGURATION MAPPING
// ================================================================

interface SupabaseConfig {
  url: string;
  anonKey: string;
  serviceRoleKey: string;
}

const getSupabaseConfig = (): SupabaseConfig => {
  const env = getEnvironment();

  // Secure fallback - no functional keys exposed
  const fallbackConfig = {
    url: '',
    anonKey: '',
    serviceRoleKey: '',
  };

  switch (env) {
    case 'production':
      return {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL_PROD || fallbackConfig.url,
        anonKey:
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_PROD ||
          fallbackConfig.anonKey,
        serviceRoleKey:
          process.env.SUPABASE_SERVICE_ROLE_KEY_PROD ||
          fallbackConfig.serviceRoleKey,
      };

    case 'staging':
      return {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL_STAGING || fallbackConfig.url,
        anonKey:
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_STAGING ||
          fallbackConfig.anonKey,
        serviceRoleKey:
          process.env.SUPABASE_SERVICE_ROLE_KEY_STAGING ||
          fallbackConfig.serviceRoleKey,
      };

    case 'development':
    default:
      return {
        url:
          process.env.NEXT_PUBLIC_SUPABASE_URL_DEV ||
          process.env.NEXT_PUBLIC_SUPABASE_URL ||
          fallbackConfig.url,
        anonKey:
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_DEV ||
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
          fallbackConfig.anonKey,
        serviceRoleKey:
          process.env.SUPABASE_SERVICE_ROLE_KEY_DEV ||
          process.env.SUPABASE_SERVICE_ROLE_KEY ||
          fallbackConfig.serviceRoleKey,
      };
  }
};

// ================================================================
// CLIENT INSTANCES
// ================================================================

// Client-side Supabase client (for components)
export const createSupabaseClient = () => {
  const config = getSupabaseConfig();

  return createClientComponentClient({
    supabaseUrl: config.url,
    supabaseKey: config.anonKey,
  });
};

// Server-side Supabase client (for API routes and server components)
export const createSupabaseServerClient = () => {
  const config = getSupabaseConfig();
  const cookieStore = cookies();

  return createServerComponentClient(
    { cookies: () => cookieStore },
    {
      supabaseUrl: config.url,
      supabaseKey: config.anonKey,
    }
  );
};

// Admin client with service role (server-side only!)
export const createSupabaseAdminClient = () => {
  const config = getSupabaseConfig();

  if (typeof window !== 'undefined') {
    throw new Error('Admin client should only be used on the server side');
  }

  return createClient(config.url, config.serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    global: {
      headers: {
        Authorization: `Bearer ${config.serviceRoleKey}`,
      },
    },
  });
};

// Default client instance (backward compatibility)
export const supabase = createSupabaseClient();

// ================================================================
// REALTIME CONFIGURATION
// ================================================================

export const createRealtimeClient = (options?: {
  enableLogs?: boolean;
  reconnectInterval?: number;
}) => {
  const config = getSupabaseConfig();

  return createClient(config.url, config.anonKey, {
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
      heartbeatIntervalMs: 30000,
      reconnectIntervalMs: options?.reconnectInterval || 5000,
    },
    global: {
      headers: {
        'x-application-name': 'FleetFlow-TMS',
      },
    },
  });
};

// ================================================================
// WEBHOOK CONFIGURATION
// ================================================================

export const getWebhookConfig = () => {
  const env = getEnvironment();
  const baseUrl =
    process.env.NEXTAUTH_URL ||
    process.env.VERCEL_URL ||
    'http://localhost:3000';

  return {
    baseUrl: baseUrl.startsWith('http') ? baseUrl : `https://${baseUrl}`,
    secret: process.env.WEBHOOK_SECRET || `fleetflow-webhook-${env}`,
    endpoints: {
      loadStatus: '/api/webhooks/load-status',
      driverLocation: '/api/webhooks/driver-location',
      deliveryConfirmation: '/api/webhooks/delivery-confirmation',
      documentUpload: '/api/webhooks/document-upload',
      maintenanceReminder: '/api/webhooks/maintenance-reminder',
    },
  };
};

// ================================================================
// CORS CONFIGURATION
// ================================================================

export const getAllowedOrigins = () => {
  const env = getEnvironment();

  const baseOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001',
  ];

  switch (env) {
    case 'production':
      return [
        ...baseOrigins,
        'https://fleetflow.vercel.app',
        'https://fleetflowapp.com',
        'https://www.fleetflowapp.com',
      ];

    case 'staging':
      return [
        ...baseOrigins,
        'https://*.vercel.app',
        'https://fleetflow-git-*.vercel.app',
        'https://fleetflow-staging.vercel.app',
      ];

    case 'development':
    default:
      return [
        ...baseOrigins,
        'http://192.168.*.*:3000',
        'http://192.168.*.*:3001',
        'http://10.*.*.*:3000',
        'http://172.*.*.*:3000',
      ];
  }
};

// ================================================================
// DATABASE UTILITIES
// ================================================================

export const getDatabaseInfo = async () => {
  const config = getSupabaseConfig();
  const env = getEnvironment();

  try {
    const adminClient = createSupabaseAdminClient();

    // Test connection
    const { data, error } = await adminClient
      .from('users')
      .select('count', { count: 'exact', head: true });

    if (error) throw error;

    return {
      environment: env,
      url: config.url,
      connected: true,
      userCount: data?.length || 0,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    return {
      environment: env,
      url: config.url,
      connected: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    };
  }
};

// ================================================================
// TYPE DEFINITIONS
// ================================================================

export type Environment = 'development' | 'staging' | 'production';

export interface DatabaseInfo {
  environment: Environment;
  url: string;
  connected: boolean;
  userCount?: number;
  error?: string;
  timestamp: string;
}

// ================================================================
// CONFIGURATION VALIDATION
// ================================================================

export const validateSupabaseConfig = () => {
  const config = getSupabaseConfig();
  const env = getEnvironment();

  const errors: string[] = [];

  if (!config.url) {
    errors.push(`Missing Supabase URL for ${env} environment`);
  }

  if (!config.anonKey) {
    errors.push(`Missing Supabase anon key for ${env} environment`);
  }

  if (!config.serviceRoleKey && typeof window === 'undefined') {
    errors.push(`Missing Supabase service role key for ${env} environment`);
  }

  // Validate URL format
  if (config.url && !config.url.match(/^https:\/\/.*\.supabase\.co$/)) {
    errors.push(`Invalid Supabase URL format for ${env} environment`);
  }

  // Validate key format
  if (config.anonKey && !config.anonKey.startsWith('eyJ')) {
    errors.push(`Invalid anon key format for ${env} environment`);
  }

  if (config.serviceRoleKey && !config.serviceRoleKey.startsWith('eyJ')) {
    errors.push(`Invalid service role key format for ${env} environment`);
  }

  return {
    valid: errors.length === 0,
    errors,
    environment: env,
    config: {
      url: config.url ? '✓ Set' : '✗ Missing',
      anonKey: config.anonKey ? '✓ Set' : '✗ Missing',
      serviceRoleKey: config.serviceRoleKey ? '✓ Set' : '✗ Missing',
    },
  };
};

// ================================================================
// INITIALIZATION HELPER
// ================================================================

export const initializeSupabase = async () => {
  console.info('🔧 Initializing FleetFlow Supabase configuration...');

  const validation = validateSupabaseConfig();
  const env = getEnvironment();

  console.info(`📊 Environment: ${env}`);
  console.info(`🔍 Configuration:`, validation.config);

  if (!validation.valid) {
    console.error('❌ Supabase configuration errors:', validation.errors);
    throw new Error(
      `Supabase configuration invalid: ${validation.errors.join(', ')}`
    );
  }

  try {
    const dbInfo = await getDatabaseInfo();
    console.info('✅ Database connection successful');
    console.info(`📈 Connected to: ${dbInfo.url}`);
    return dbInfo;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw error;
  }
};
