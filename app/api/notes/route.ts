import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

function getSupabaseClient() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    'https://nleqplwwothhxgrovnjw.supabase.co';
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5sZXFwbHd3b3RoaHhncm92bmp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzNzczODcsImV4cCI6MjA2Nzk1MzM4N30.SewQx-DIRXaKLtPHbxnmRWvdx96_VtMu5sjoKpaBWjg';
  return createClient(supabaseUrl, supabaseKey);
}

// GET /api/notes - Fetch all notes
export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseClient();
    const { searchParams } = new URL(request.url);

    const category = searchParams.get('category');
    const loadId = searchParams.get('load_id');

    let query = supabase
      .from('notes')
      .select('*')
      .order('created_at', { ascending: false });

    if (category) {
      query = query.eq('category', category);
    }

    if (loadId) {
      query = query.eq('load_id', loadId);
    }

    const { data: notes, error } = await query;

    if (error) {
      console.error('Error fetching notes:', error);
      return NextResponse.json(
        {
          success: false,
          error:
            'Failed to fetch notes. Run scripts/complete-local-database.sql',
          notes: [],
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      notes: notes || [],
      count: notes?.length || 0,
    });
  } catch (error: any) {
    console.error('Notes API Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/notes - Create note
export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseClient();
    const body = await request.json();

    const noteId = `NOTE-${Date.now()}`;
    const { data: newNote, error } = await supabase
      .from('notes')
      .insert([
        {
          note_id: noteId,
          title: body.title || 'Untitled Note',
          content: body.content || '',
          category: body.category || 'General',
          tags: body.tags || [],
          priority: body.priority || 'medium',
          is_pinned: body.is_pinned || false,
          load_id: body.load_id,
          driver_id: body.driver_id,
        },
      ])
      .select();

    if (error) {
      console.error('Error creating note:', error);
      return NextResponse.json(
        {
          success: false,
          error:
            'Failed to create note. Run scripts/complete-local-database.sql',
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      note: newNote?.[0],
      message: 'Note created successfully',
    });
  } catch (error: any) {
    console.error('Notes API Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/notes?id=:id - Update note
export async function PUT(request: NextRequest) {
  try {
    const supabase = getSupabaseClient();
    const { searchParams } = new URL(request.url);
    const noteId = searchParams.get('id');
    const body = await request.json();

    if (!noteId) {
      return NextResponse.json(
        { success: false, error: 'Note ID required' },
        { status: 400 }
      );
    }

    const { data: updatedNote, error } = await supabase
      .from('notes')
      .update({
        title: body.title,
        content: body.content,
        category: body.category,
        tags: body.tags,
        priority: body.priority,
        is_pinned: body.is_pinned,
        updated_at: new Date().toISOString(),
      })
      .eq('note_id', noteId)
      .select();

    if (error) {
      console.error('Error updating note:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to update note' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      note: updatedNote?.[0],
      message: 'Note updated successfully',
    });
  } catch (error: any) {
    console.error('Notes API Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/notes?id=:id - Delete note
export async function DELETE(request: NextRequest) {
  try {
    const supabase = getSupabaseClient();
    const { searchParams } = new URL(request.url);
    const noteId = searchParams.get('id');

    if (!noteId) {
      return NextResponse.json(
        { success: false, error: 'Note ID required' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('note_id', noteId);

    if (error) {
      console.error('Error deleting note:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to delete note' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Note deleted successfully',
    });
  } catch (error: any) {
    console.error('Notes API Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

