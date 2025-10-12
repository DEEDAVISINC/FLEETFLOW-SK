import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// RFX Bid Response Tracking API
// Automatically saves all RFP/RFQ responses for tracking and management

function getSupabaseClient() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    'https://nleqplwwothhxgrovnjw.supabase.co';
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5sZXFwbHd3b3RoaHhncm92bmp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzNzczODcsImV4cCI6MjA2Nzk1MzM4N30.SewQx-DIRXaKLtPHbxnmRWvdx96_VtMu5sjoKpaBWjg';
  return createClient(supabaseUrl, supabaseKey);
}

interface RFXBidResponse {
  id?: string;
  solicitationId?: string;
  solicitationType: string;
  documentName: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  organizationName?: string;
  submissionDeadline?: string;
  responseSubject?: string;
  responseHtml: string;
  responseText: string;
  signatureType?: string;
  extractedRequirements?: any[];
  submissionInstructions?: any;
  status?: string;
  createdBy?: string;
}

// GET /api/rfx-bids - Get all bid responses or filter
export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseClient();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const id = searchParams.get('id');

    if (id) {
      // Get single bid by ID
      const { data, error } = await supabase
        .from('rfx_bid_responses')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching bid:', error);
        return NextResponse.json(
          {
            success: false,
            error: 'Bid not found',
          },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data,
      });
    }

    // Get filtered list
    let query = supabase
      .from('rfx_bid_responses')
      .select('*')
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching bids:', error);
      throw error;
    }

    console.log('📊 Retrieved bids from database:', {
      count: data?.length || 0,
      status: status || 'all',
    });

    return NextResponse.json({
      success: true,
      data: data || [],
      count: data?.length || 0,
      message:
        data && data.length > 0
          ? `Retrieved ${data.length} bid(s) from database`
          : 'No bids found',
    });
  } catch (error) {
    console.error('Error fetching RFX bids:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch bid responses',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// POST /api/rfx-bids - Create new bid response (auto-save)
export async function POST(request: NextRequest) {
  try {
    const body: RFXBidResponse = await request.json();

    // Validate required fields
    if (
      !body.solicitationType ||
      !body.documentName ||
      !body.responseHtml ||
      !body.responseText
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Missing required fields: solicitationType, documentName, responseHtml, responseText',
        },
        { status: 400 }
      );
    }

    const supabase = getSupabaseClient();

    // Prepare data for database (convert camelCase to snake_case)
    const dbData = {
      solicitation_id: body.solicitationId,
      solicitation_type: body.solicitationType.toUpperCase(),
      document_name: body.documentName,
      contact_name: body.contactName,
      contact_email: body.contactEmail,
      contact_phone: body.contactPhone,
      organization_name: body.organizationName,
      submission_deadline: body.submissionDeadline
        ? new Date(body.submissionDeadline).toISOString()
        : null,
      response_subject: body.responseSubject,
      response_html: body.responseHtml,
      response_text: body.responseText,
      signature_type: body.signatureType || 'dee_davis',
      extracted_requirements: body.extractedRequirements || [],
      submission_instructions: body.submissionInstructions || {},
      status: body.status || 'draft',
      created_by: body.createdBy || 'info@deedavis.biz',
    };

    console.log('💾 Saving RFX bid response to database:', {
      solicitationType: dbData.solicitation_type,
      documentName: dbData.document_name,
      contactEmail: dbData.contact_email,
      solicitationId: dbData.solicitation_id,
    });

    const { data, error } = await supabase
      .from('rfx_bid_responses')
      .insert([dbData])
      .select()
      .single();

    if (error) {
      console.error('❌ Database error:', error);
      throw error;
    }

    console.log(`✅ Bid saved to database with ID: ${data.id}`);

    return NextResponse.json({
      success: true,
      data,
      message: 'Bid response saved successfully to database',
    });
  } catch (error) {
    console.error('Error saving RFX bid:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to save bid response',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// PATCH /api/rfx-bids - Update existing bid response
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const id = body.id;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Bid response ID is required',
        },
        { status: 400 }
      );
    }

    const supabase = getSupabaseClient();

    // Remove id from updates and convert to snake_case
    const { id: _, ...updates } = body;
    const dbUpdates: any = {};

    // Convert camelCase to snake_case
    Object.entries(updates).forEach(([key, value]) => {
      const snakeKey = key.replace(
        /[A-Z]/g,
        (letter) => `_${letter.toLowerCase()}`
      );
      dbUpdates[snakeKey] = value;
    });

    console.log('📝 Updating RFX bid response:', {
      id,
      updates: Object.keys(dbUpdates),
    });

    const { data, error } = await supabase
      .from('rfx_bid_responses')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('❌ Database error:', error);
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          {
            success: false,
            error: 'Bid not found',
          },
          { status: 404 }
        );
      }
      throw error;
    }

    console.log('✅ Bid updated:', data.id);

    return NextResponse.json({
      success: true,
      data,
      message: 'Bid response updated successfully',
    });
  } catch (error) {
    console.error('Error updating RFX bid:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update bid response',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// DELETE /api/rfx-bids?id=<id> - Delete bid response
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Bid response ID is required',
        },
        { status: 400 }
      );
    }

    const supabase = getSupabaseClient();

    console.log('🗑️ Deleting RFX bid response:', id);

    const { error } = await supabase
      .from('rfx_bid_responses')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('❌ Database error:', error);
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          {
            success: false,
            error: 'Bid not found',
          },
          { status: 404 }
        );
      }
      throw error;
    }

    console.log('✅ Bid deleted:', id);

    return NextResponse.json({
      success: true,
      message: 'Bid response deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting RFX bid:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete bid response',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
