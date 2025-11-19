import { NextRequest, NextResponse } from 'next/server';
import { createBusiness, getAllBusinesses } from '@/lib/db';

// GET all businesses
export async function GET() {
  try {
    const businesses = await getAllBusinesses();
    return NextResponse.json({ businesses });
  } catch (error) {
    console.error('Error fetching businesses:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST create new business
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, slug, email } = body;

    // Validate required fields
    if (!name || !slug || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate slug format
    if (!/^[a-z0-9-]+$/.test(slug)) {
      return NextResponse.json(
        { error: 'Slug must contain only lowercase letters, numbers, and hyphens' },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const businesses = await getAllBusinesses();
    if (businesses.some(b => b.slug === slug)) {
      return NextResponse.json(
        { error: 'A business with this slug already exists' },
        { status: 409 }
      );
    }

    const business = await createBusiness({ name, slug, email });

    return NextResponse.json({ success: true, business });
  } catch (error) {
    console.error('Error creating business:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
