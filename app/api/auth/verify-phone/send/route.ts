import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { sendVerificationCode } from '@/lib/twilio';
import User from '@/models/User';
import { connectDB } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    const { phoneNumber } = await req.json();

    if (!phoneNumber) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      );
    }

    // Format phone number to E.164 format
    const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;

    // Check if phone number is already verified by another user
    const existingUser = await User.findOne({
      phone: formattedPhone,
      'verificationStatus.phone': true,
      email: { $ne: session.user.email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Phone number is already verified by another user' },
        { status: 400 }
      );
    }

    // Send verification code
    await sendVerificationCode(formattedPhone);

    // Update user's phone number
    await User.updateOne(
      { email: session.user.email },
      { 
        phone: formattedPhone,
        'verificationStatus.phone': false
      }
    );

    return NextResponse.json({
      message: 'Verification code sent successfully'
    });
  } catch (error) {
    console.error('Error sending verification code:', error);
    return NextResponse.json(
      { error: 'Failed to send verification code' },
      { status: 500 }
    );
  }
} 