import { Feedback } from '@/types';
import nodemailer from 'nodemailer';

/**
 * Sends a feedback notification email to the business owner
 */
export async function sendFeedbackNotification(
  businessEmail: string,
  businessName: string,
  feedback: Feedback
): Promise<void> {
  // Check if SMTP is configured
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
    console.log('SMTP not configured, skipping email notification');
    console.log('Feedback received:', {
      to: businessEmail,
      subject: `New ${feedback.rating} feedback for ${businessName}`,
      feedback,
    });
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // Use TLS
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const starRating = '⭐'.repeat(feedback.stars);
    const contactRequest = feedback.wantsContact
      ? '<p style="background-color: #fef3c7; padding: 10px; border-left: 4px solid #f59e0b;"><strong>⚠️ Customer wants to be contacted about this feedback</strong></p>'
      : '';

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: businessEmail,
      subject: `New ${feedback.rating} feedback (${feedback.stars}⭐) for ${businessName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
        </head>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333;">New Feedback Received</h2>

          ${contactRequest}

          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Star Rating:</strong> ${starRating} (${feedback.stars}/5)</p>
            <p><strong>Sentiment:</strong> ${feedback.rating === 'sad' ? '😞 Unhappy' : '😐 Neutral'}</p>
            <hr style="border: none; border-top: 1px solid #e5e7eb;">
            <p><strong>Name:</strong> ${feedback.name}</p>
            <p><strong>Email:</strong> <a href="mailto:${feedback.email}">${feedback.email}</a></p>
            ${feedback.phone ? `<p><strong>Phone:</strong> <a href="tel:${feedback.phone}">${feedback.phone}</a></p>` : ''}
            <hr style="border: none; border-top: 1px solid #e5e7eb;">
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap;">${feedback.message}</p>
          </div>

          <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
            Received on ${new Date(feedback.createdAt).toLocaleString()}
          </p>

          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          <p style="color: #9ca3af; font-size: 12px; text-align: center;">
            Sent by ReviewRescue
          </p>
        </body>
        </html>
      `,
    });

    console.log(`Feedback notification sent to ${businessEmail}`);
  } catch (error) {
    console.error('Error sending email notification:', error);
    throw error;
  }
}

/**
 * Generates HTML for email template with clickable emoji buttons
 */
export function generateReviewEmailTemplate(businessSlug: string, businessName: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>How was your experience?</title>
</head>
<body style="font-family: Arial, sans-serif; text-align: center; padding: 40px; background-color: #f5f5f5;">
  <div style="max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
    <h1 style="color: #333; font-size: 28px; margin-bottom: 20px;">How was your experience with ${businessName}?</h1>
    <p style="color: #666; font-size: 16px; margin-bottom: 40px;">We'd love to hear your feedback!</p>

    <div style="display: flex; justify-content: center; gap: 30px; margin: 40px 0;">
      <a href="${baseUrl}/review/${businessSlug}?sentiment=happy" style="text-decoration: none;">
        <div style="text-align: center;">
          <div style="font-size: 80px; margin-bottom: 10px;">😊</div>
          <div style="color: #10b981; font-weight: bold;">Great!</div>
        </div>
      </a>

      <a href="${baseUrl}/review/${businessSlug}?sentiment=neutral" style="text-decoration: none;">
        <div style="text-align: center;">
          <div style="font-size: 80px; margin-bottom: 10px;">😐</div>
          <div style="color: #f59e0b; font-weight: bold;">Okay</div>
        </div>
      </a>

      <a href="${baseUrl}/review/${businessSlug}?sentiment=sad" style="text-decoration: none;">
        <div style="text-align: center;">
          <div style="font-size: 80px; margin-bottom: 10px;">😞</div>
          <div style="color: #ef4444; font-weight: bold;">Not Great</div>
        </div>
      </a>
    </div>

    <p style="color: #999; font-size: 14px; margin-top: 40px;">
      Thank you for taking the time to share your feedback!
    </p>
  </div>
</body>
</html>
  `.trim();
}
