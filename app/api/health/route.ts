import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

export async function GET() {
  const healthCheck = {
    timestamp: new Date().toISOString(),
    status: 'healthy',
    services: {
      supabase: { status: 'unknown', message: '' },
      environment: { status: 'unknown', message: '' },
      apis: { status: 'unknown', message: '' },
    },
    environment: {
      nodeEnv: process.env.NODE_ENV || 'development',
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL
        ? 'configured'
        : 'missing',
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        ? 'configured'
        : 'missing',
      serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY
        ? 'configured'
        : 'missing',
    },
  };

  try {
    // Test Supabase connection
    const { data, error } = await supabase
      .from('loads')
      .select('count')
      .limit(1);

    if (error) {
      healthCheck.services.supabase = {
        status: 'error',
        message: error.message,
      };
      healthCheck.status = 'degraded';
    } else {
      healthCheck.services.supabase = {
        status: 'healthy',
        message: 'Connected successfully',
      };
    }
  } catch (err: any) {
    healthCheck.services.supabase = {
      status: 'error',
      message: err.message,
    };
    healthCheck.status = 'degraded';
  }

  // Check environment configuration
  const requiredEnvVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  ];

  const missingEnvVars = requiredEnvVars.filter(
    (varName) => !process.env[varName]
  );

  if (missingEnvVars.length > 0) {
    healthCheck.services.environment = {
      status: 'warning',
      message: `Missing environment variables: ${missingEnvVars.join(', ')}`,
    };
    if (healthCheck.status === 'healthy') {
      healthCheck.status = 'degraded';
    }
  } else {
    healthCheck.services.environment = {
      status: 'healthy',
      message: 'All required environment variables configured',
    };
  }

  // Test external APIs (basic connectivity)
  const apiTests = await Promise.allSettled([
    fetch(
      'https://mobile.fmcsa.dot.gov/qc/services/carriers/123456?webKey=' +
        (process.env.FMCSA_API_KEY || ''),
      {
        method: 'GET',
        headers: { Accept: 'application/json' },
      }
    ),
    fetch('https://api.weather.gov/points/40.7128,-74.0060'),
    fetch('https://api.exchangerate-api.com/v4/latest/USD'),
  ]);

  const apiResults = apiTests.map((result, index) => {
    const apiNames = ['FMCSA', 'Weather.gov', 'ExchangeRate'];
    if (result.status === 'fulfilled' && result.value.ok) {
      return { name: apiNames[index], status: 'healthy' };
    } else {
      return {
        name: apiNames[index],
        status: 'error',
        message:
          result.status === 'rejected' ? result.reason : 'API not responding',
      };
    }
  });

  const healthyApis = apiResults.filter(
    (api) => api.status === 'healthy'
  ).length;
  const totalApis = apiResults.length;

  healthCheck.services.apis = {
    status: healthyApis === totalApis ? 'healthy' : 'degraded',
    message: `${healthyApis}/${totalApis} APIs responding`,
    details: apiResults,
  };

  if (
    healthCheck.services.apis.status === 'degraded' &&
    healthCheck.status === 'healthy'
  ) {
    healthCheck.status = 'degraded';
  }

  const statusCode = healthCheck.status === 'healthy' ? 200 : 503;

  return NextResponse.json(healthCheck, { status: statusCode });
}
