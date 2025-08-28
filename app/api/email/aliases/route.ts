import { improvmxService } from '@/app/services/improvmx-service';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/email/aliases - Get all email aliases
export async function GET() {
  try {
    const result = await improvmxService.getAliases();

    if (result.success) {
      return NextResponse.json({
        success: true,
        aliases: result.data,
      });
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Email aliases fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch email aliases' },
      { status: 500 }
    );
  }
}

// POST /api/email/aliases - Create new email alias
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { alias, forward } = body;

    if (!alias || !forward) {
      return NextResponse.json(
        { success: false, error: 'Alias and forward email are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(forward)) {
      return NextResponse.json(
        { success: false, error: 'Invalid forward email format' },
        { status: 400 }
      );
    }

    const result = await improvmxService.createAlias(alias, forward);

    if (result.success) {
      return NextResponse.json({
        success: true,
        alias: result.data,
        message: `Email alias ${alias}@fleetflowapp.com created successfully`,
      });
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Email alias creation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create email alias' },
      { status: 500 }
    );
  }
}

// PUT /api/email/aliases - Update email alias
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { aliasId, forward } = body;

    if (!aliasId || !forward) {
      return NextResponse.json(
        { success: false, error: 'Alias ID and forward email are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(forward)) {
      return NextResponse.json(
        { success: false, error: 'Invalid forward email format' },
        { status: 400 }
      );
    }

    const result = await improvmxService.updateAlias(aliasId, forward);

    if (result.success) {
      return NextResponse.json({
        success: true,
        alias: result.data,
        message: `Email alias updated successfully`,
      });
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Email alias update error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update email alias' },
      { status: 500 }
    );
  }
}

// DELETE /api/email/aliases - Delete email alias
export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const aliasId = url.searchParams.get('id');

    if (!aliasId) {
      return NextResponse.json(
        { success: false, error: 'Alias ID is required' },
        { status: 400 }
      );
    }

    const result = await improvmxService.deleteAlias(parseInt(aliasId));

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: `Email alias deleted successfully`,
      });
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Email alias deletion error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete email alias' },
      { status: 500 }
    );
  }
}
