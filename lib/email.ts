import { Feedback } from '@/types';

/**
 * Sends a feedback notification email to the business owner
 */
export async function sendFeedbackNotification(
  businessEmail: string,
  businessName: string,
  feedback: Feedback
): Promise<void> {
  // TODO: Implement with nodemailer when SMTP is configured
  console.log('Sending feedback notification:', {
    to: businessEmail,
    subject: `New ${feedback.rating} feedback for ${businessName}`,
    feedback,
  });

  // Uncomment when ready to use:
  /*
  const nodemailer = require('nodemailer');

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: businessEmail,
    subject: `New ${feedback.rating} feedback for ${businessName}`,
    html: `
      <h2>New Feedback Received</h2>
      <p><strong>From:</strong> ${feedback.name} (${feedback.email})</p>
      <p><strong>Rating:</strong> ${feedback.rating}</p>
      <p><strong>Message:</strong></p>
      <p>${feedback.message}</p>
      <hr>
      <p><small>Sent by ReviewRescue</small></p>
    `,
  });
  */
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
