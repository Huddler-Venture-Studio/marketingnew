import { NextRequest, NextResponse } from 'next/server';
import { resend } from '@/lib/resend';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    if (!resend) {
      return NextResponse.json(
        { error: 'Resend is not configured. Please set the RESEND_API_KEY environment variable.' },
        { status: 500 }
      );
    }

    // Add email to your newsletter list or send a welcome email
    // For now, we'll just send a welcome email
    await resend.emails.send({
      from: 'Huddler <noreply@notifications.huddler.io>',
      to: email,
      subject: 'Welcome to Huddler Newsletter!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Welcome to Huddler!</h2>
          <p>Thank you for subscribing to our newsletter. We're excited to have you on board!</p>
          <p>You'll receive updates about our latest features, product announcements, and more.</p>
          <br>
          <p>Best regards,<br>The Huddler Team</p>
        </div>
      `,
    });

    return NextResponse.json({ message: 'Subscribed successfully' });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to subscribe to newsletter' },
      { status: 500 }
    );
  }
}