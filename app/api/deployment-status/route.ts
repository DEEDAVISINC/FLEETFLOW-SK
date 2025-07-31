import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

export async function GET() {
  const deploymentStatus = {
    timestamp: new Date().toISOString(),
    deployment: 'ready',
    services: {
      database: { status: 'unknown', message: '', ready: false },
      apis: { status: 'unknown', message: '', ready: false },
      environment: { status: 'unknown', message: '', ready: false },
      security: { status: 'unknown', message: '', ready: false }
    },
    recommendations: [],
    criticalIssues: []
  };

  // Check database connectivity
  try {
    const { data, error } = await supabase
      .from('loads')
      .select('count')
      .limit(1);

    if (error) {
      deploymentStatus.services.database = {
        status: 'error',
        message: error.message,
        ready: false
      };
      deploymentStatus.criticalIssues.push('Database connection failed');
    } else {
      deploymentStatus.services.database = {
        status: 'healthy',
        message: 'Supabase database connected successfully',
        ready: true
      };
    }
  } catch (err: any) {
    deploymentStatus.services.database = {
      status: 'error',
      message: err.message,
      ready: false
    };
    deploymentStatus.criticalIssues.push('Database connection error');
  }

  // Check environment variables
  const requiredEnvVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY'
  ];

  const optionalEnvVars = [
    'SUPABASE_SERVICE_ROLE_KEY',
    'FMCSA_API_KEY',
    'TWILIO_ACCOUNT_SID',
    'TWILIO_AUTH_TOKEN',
    'STRIPE_SECRET_KEY'
  ];

  const missingRequired = requiredEnvVars.filter(varName => !process.env[varName]);
  const missingOptional = optionalEnvVars.filter(varName => !process.env[varName]);

  if (missingRequired.length > 0) {
    deploymentStatus.services.environment = {
      status: 'error',
      message: `Missing required environment variables: ${missingRequired.join(', ')}`,
      ready: false
    };
    deploymentStatus.criticalIssues.push('Missing required environment variables');
  } else {
    deploymentStatus.services.environment = {
      status: 'healthy',
      message: 'All required environment variables configured',
      ready: true
    };
  }

  if (missingOptional.length > 0) {
    deploymentStatus.recommendations.push(`Consider configuring optional APIs: ${missingOptional.join(', ')}`);
  }

  // Check API connectivity
  const apiTests = await Promise.allSettled([
    fetch('https://api.weather.gov/points/40.7128,-74.0060'),
    fetch('https://api.exchangerate-api.com/v4/latest/USD')
  ]);

  const workingApis = apiTests.filter(result => 
    result.status === 'fulfilled' && result.value.ok
  ).length;

  if (workingApis >= 1) {
    deploymentStatus.services.apis = {
      status: 'healthy',
      message: `${workingApis}/2 external APIs responding`,
      ready: true
    };
  } else {
    deploymentStatus.services.apis = {
      status: 'warning',
      message: 'External APIs not responding',
      ready: false
    };
    deploymentStatus.recommendations.push('Check external API connectivity');
  }

  // Check security configuration
  const hasHttps = process.env.NEXT_PUBLIC_APP_URL?.startsWith('https://') || 
                   process.env.NODE_ENV === 'development';
  
  deploymentStatus.services.security = {
    status: hasHttps ? 'healthy' : 'warning',
    message: hasHttps ? 'HTTPS configured' : 'HTTPS not configured for production',
    ready: hasHttps
  };

  if (!hasHttps && process.env.NODE_ENV === 'production') {
    deploymentStatus.recommendations.push('Enable HTTPS for production deployment');
  }

  // Determine overall deployment status
  const allServicesReady = Object.values(deploymentStatus.services).every(service => service.ready);
  const hasCriticalIssues = deploymentStatus.criticalIssues.length > 0;

  if (hasCriticalIssues) {
    deploymentStatus.deployment = 'blocked';
  } else if (allServicesReady) {
    deploymentStatus.deployment = 'ready';
  } else {
    deploymentStatus.deployment = 'warning';
  }

  // Add deployment recommendations
  if (deploymentStatus.deployment === 'ready') {
    deploymentStatus.recommendations.push('✅ System ready for production deployment');
  }

  const statusCode = deploymentStatus.deployment === 'ready' ? 200 : 
                    deploymentStatus.deployment === 'warning' ? 207 : 503;

  return NextResponse.json(deploymentStatus, { status: statusCode });
} 