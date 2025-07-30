import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const carrierId = formData.get('carrierId') as string;
    const photoType = formData.get('photoType') as string; // 'vehicle' or 'user'
    const file = formData.get('file') as File;

    if (!carrierId || !photoType || !file) {
      return NextResponse.json(
        { error: 'Missing required fields: carrierId, photoType, file' },
        { status: 400 }
      );
    }

    // Validate photo type
    if (!['vehicle', 'user'].includes(photoType)) {
      return NextResponse.json(
        { error: 'Invalid photoType. Must be "vehicle" or "user"' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 5MB' },
        { status: 400 }
      );
    }

    // In production, this would:
    // 1. Upload to cloud storage (AWS S3, Cloudinary, etc.)
    // 2. Store file URL in database with carrierId
    // 3. Return the public URL

    // For demo purposes, return a mock URL
    const mockPhotoUrl =
      photoType === 'vehicle'
        ? 'https://images.unsplash.com/photo-1558618047-f0c1b401b0cf?w=150&h=150&fit=crop&auto=format'
        : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face&auto=format';

    return NextResponse.json({
      success: true,
      photoUrl: mockPhotoUrl,
      message: `${photoType === 'vehicle' ? 'Vehicle equipment' : 'User'} photo uploaded successfully`,
    });
  } catch (error) {
    console.error('Photo upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload photo' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const carrierId = searchParams.get('carrierId');

  if (!carrierId) {
    return NextResponse.json(
      { error: 'carrierId parameter is required' },
      { status: 400 }
    );
  }

  // Mock response - in production, fetch from database
  const mockPhotos = {
    carrierId,
    vehicleEquipment:
      'https://images.unsplash.com/photo-1558618047-f0c1b401b0cf?w=150&h=150&fit=crop&auto=format',
    userPhotoOrLogo:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face&auto=format',
  };

  return NextResponse.json(mockPhotos);
}
