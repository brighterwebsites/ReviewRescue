import { NextRequest, NextResponse } from 'next/server';
import { createFeedback, getAllBusinesses } from '@/lib/db';
import { sendFeedbackNotification } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, message, businessId, rating, stars, wantsContact } = body;

    // Validate required fields
    if (!name || !email || !message || !businessId || !rating || !stars) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate rating
    if (rating !== 'neutral' && rating !== 'sad') {
      return NextResponse.json(
        { error: 'Invalid rating' },
        { status: 400 }
      );
    }

    // Validate stars
    if (stars < 1 || stars > 5) {
      return NextResponse.json(
        { error: 'Invalid star rating' },
        { status: 400 }
      );
    }

    // Create feedback
    const feedback = await createFeedback({
      businessId,
      name,
      email,
      phone: phone || '',
      message,
      rating,
      stars,
      wantsContact: wantsContact || false,
    });

    // Get business details for email notification
    const businesses = await getAllBusinesses();
    const business = businesses.find(b => b.id === businessId);

    if (business) {
      // Send email notification to business owner
      try {
        await sendFeedbackNotification(business.email, business.name, feedback);
      } catch (emailError) {
        console.error('Error sending email notification:', emailError);
        // Don't fail the request if email fails
      }
    }

    return NextResponse.json({ success: true, feedback });
  } catch (error) {
    console.error('Error creating feedback:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
