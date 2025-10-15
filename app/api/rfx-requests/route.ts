import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Supabase client setup
function getSupabaseClient() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    'https://nleqplwwothhxgrovnjw.supabase.co';
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5sZXFwbHd3b3RoaHhncm92bmp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzNzczODcsImV4cCI6MjA2Nzk1MzM4N30.SewQx-DIRXaKLtPHbxnmRWvdx96_VtMu5sjoKpaBWjg';
  return createClient(supabaseUrl, supabaseKey);
}

export async function GET() {
  try {
    const supabase = getSupabaseClient();

    // Query RFx requests from Supabase
    const { data, error } = await supabase
      .from('rfx_requests')
      .select('*')
      .eq('status', 'Active')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error fetching RFX requests:', error);
      // Return empty array if table doesn't exist yet (graceful degradation)
      if (error.code === '42P01') {
        console.warn(
          '⚠️  rfx_requests table does not exist yet - returning empty array'
        );
        return NextResponse.json([]);
      }
      throw error;
    }

    console.log(`✅ Retrieved ${data?.length || 0} RFx requests from Supabase`);
    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Error fetching RFX requests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch RFX requests' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const supabase = getSupabaseClient();

    // Prepare data for insertion
    const rfxData = {
      ...body,
      status: body.status || 'Active',
      current_bids: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    console.log('💾 Creating RFx request in Supabase:', {
      title: rfxData.title,
      rfx_type: rfxData.rfx_type,
    });

    // Insert into Supabase
    const { data, error } = await supabase
      .from('rfx_requests')
      .insert([rfxData])
      .select()
      .single();

    if (error) {
      console.error('Supabase error creating RFX request:', error);
      // Graceful degradation if table doesn't exist
      if (error.code === '42P01') {
        console.warn('⚠️  rfx_requests table does not exist yet');
        return NextResponse.json(
          {
            error: 'Database table not set up yet',
            message: 'Please run the SQL schema setup first',
            details: 'See scripts/rfx-bids-schema.sql',
          },
          { status: 503 }
        );
      }
      throw error;
    }

    console.log(`✅ RFx request created with ID: ${data.id}`);
    return NextResponse.json(
      { success: true, data, message: 'RFx request created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating RFX request:', error);
    return NextResponse.json(
      {
        error: 'Failed to create RFX request',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
