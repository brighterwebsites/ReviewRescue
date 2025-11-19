import { NextRequest, NextResponse } from 'next/server';
import { getAllBusinesses, updateBusiness, deleteBusiness, updateReviewPlatforms } from '@/lib/db';

// GET single business
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const businesses = await getAllBusinesses();
    const business = businesses.find(b => b.id === params.id);

    if (!business) {
      return NextResponse.json(
        { error: 'Business not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ business });
  } catch (error) {
    console.error('Error fetching business:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Shared update logic for both PATCH and POST
async function handleUpdate(
  request: NextRequest,
  params: { id: string }
) {
  try {
    const body = await request.json();
    const { name, email, platforms } = body;

    // Update basic info if provided
    if (name || email) {
      await updateBusiness(params.id, { name, email });
    }

    // Update platforms if provided
    if (platforms && Array.isArray(platforms)) {
      await updateReviewPlatforms(params.id, platforms);
    }

    // Get updated business
    const businesses = await getAllBusinesses();
    const business = businesses.find(b => b.id === params.id);

    if (!business) {
      return NextResponse.json(
        { error: 'Business not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, business });
  } catch (error) {
    console.error('Error updating business:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST handler with method override support (workaround for proxy blocking PATCH)
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const url = new URL(request.url);
  const method = url.searchParams.get('_method');

  // If _method=PATCH or _method=DELETE, handle accordingly
  if (method === 'PATCH') {
    return handleUpdate(request, params);
  } else if (method === 'DELETE') {
    return handleDelete(request, params);
  }

  // Default POST behavior is to update (same as PATCH)
  return handleUpdate(request, params);
}

// PATCH update business
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return handleUpdate(request, params);
}

// Shared delete logic for both DELETE and POST
async function handleDelete(
  request: NextRequest,
  params: { id: string }
) {
  try {
    const success = await deleteBusiness(params.id);

    if (!success) {
      return NextResponse.json(
        { error: 'Business not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting business:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE business
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return handleDelete(request, params);
}
