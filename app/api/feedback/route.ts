import { NextRequest, NextResponse } from 'next/server';
import { createFeedback, getBusinessBySlug } from '@/lib/db';
import { sendFeedbackNotification } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, message, businessId, rating } = body;

    // Validate required fields
    if (!name || !email || !message || !businessId || !rating) {
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

    // Create feedback
    const feedback = await createFeedback({
      businessId,
      name,
      email,
      message,
      rating,
    });

    // Get business details for email notification
    // We'll need to fetch business by ID, but for now we can work with what we have
    // In a real implementation with Prisma, we'd include the business in the feedback creation

    // Send email notification to business owner
    // TODO: Implement email sending
    // await sendFeedbackNotification(business.email, business.name, feedback);

    return NextResponse.json({ success: true, feedback });
  } catch (error) {
    console.error('Error creating feedback:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
