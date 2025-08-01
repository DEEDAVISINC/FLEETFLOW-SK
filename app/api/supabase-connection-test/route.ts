import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET() {
  const testResults = {
    timestamp: new Date().toISOString(),
    connection: {
      status: 'unknown',
      message: '',
      details: {},
    },
    environment: {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL || 'not_set',
      key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'configured' : 'not_set',
      serviceRole: process.env.SUPABASE_SERVICE_ROLE_KEY
        ? 'configured'
        : 'not_set',
    },
    recommendations: [],
  };

  try {
    // Test with current configuration
    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL ||
      'https://nleqplwwothhxgrovnjw.supabase.co';
    const supabaseKey =
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5sZXFwbHd3b3RoaHhncm92bmp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzNzczODcsImV4cCI6MjA2Nzk1MzM4N30.SewQx-DIRXaKLtPHbxnmRWvdx96_VtMu5sjoKpaBWjg';

    console.log('🔍 Testing Supabase connection...');
    console.log('URL:', supabaseUrl);
    console.log('Key configured:', !!supabaseKey);

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Test basic connection
    const { data, error } = await supabase
      .from('loads')
      .select('count')
      .limit(1);

    if (error) {
      testResults.connection = {
        status: 'error',
        message: error.message,
        details: {
          code: error.code,
          hint: error.hint,
          details: error.details,
        },
      };

      // Provide specific recommendations based on error
      if (error.code === 'PGRST116') {
        testResults.recommendations.push(
          'Table "loads" does not exist. Create the table in Supabase dashboard.'
        );
      } else if (error.code === 'PGRST301') {
        testResults.recommendations.push(
          'Authentication failed. Check your Supabase API key.'
        );
      } else if (error.message.includes('fetch failed')) {
        testResults.recommendations.push(
          'Network connectivity issue. Check your internet connection and Supabase URL.'
        );
      }
    } else {
      testResults.connection = {
        status: 'success',
        message: 'Supabase connection successful',
        details: {
          data: data,
          count: data?.length || 0,
        },
      };
    }
  } catch (err: any) {
    testResults.connection = {
      status: 'error',
      message: err.message,
      details: {
        type: err.constructor.name,
        stack: err.stack,
      },
    };

    if (err.message.includes('fetch failed')) {
      testResults.recommendations.push(
        'Network error. Check if Supabase is accessible.'
      );
    } else if (err.message.includes('Invalid URL')) {
      testResults.recommendations.push(
        'Invalid Supabase URL. Check NEXT_PUBLIC_SUPABASE_URL.'
      );
    }
  }

  // Add general recommendations
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    testResults.recommendations.push(
      'Set NEXT_PUBLIC_SUPABASE_URL in your environment variables.'
    );
  }
  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    testResults.recommendations.push(
      'Set NEXT_PUBLIC_SUPABASE_ANON_KEY in your environment variables.'
    );
  }

  const statusCode = testResults.connection.status === 'success' ? 200 : 503;

  return NextResponse.json(testResults, { status: statusCode });
}
