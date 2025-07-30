// Shared CORS configuration for FleetFlow Edge Functions

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
};

export const devCorsHeaders = {
  'Access-Control-Allow-Origin': 'http://localhost:3000',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type, x-fleetflow-version',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
  'Access-Control-Allow-Credentials': 'true',
};

// Get appropriate CORS headers based on environment
export function getCorsHeaders(origin?: string) {
  const isDev =
    Deno.env.get('ENVIRONMENT') === 'development' ||
    origin?.includes('localhost') ||
    origin?.includes('127.0.0.1');

  if (isDev) {
    return {
      ...devCorsHeaders,
      'Access-Control-Allow-Origin': origin || 'http://localhost:3000',
    };
  }

  return corsHeaders;
}

// Verify request origin for security
export function verifyOrigin(req: Request): boolean {
  const origin = req.headers.get('origin');
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://fleetflow.vercel.app',
    'https://fleetflow-git-*.vercel.app',
  ];

  if (!origin) return false;

  return allowedOrigins.some((allowed) => {
    if (allowed.includes('*')) {
      const pattern = allowed.replace('*', '.*');
      const regex = new RegExp(pattern);
      return regex.test(origin);
    }
    return origin === allowed;
  });
}
