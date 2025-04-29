import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { checkVerificationCode } from '@/lib/twilio';
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
    const { code } = await req.json();

    if (!code) {
      return NextResponse.json(
        { error: 'Verification code is required' },
        { status: 400 }
      );
    }

    // Get user's phone number
    const user = await User.findOne({ email: session.user.email });
    if (!user || !user.phone) {
      return NextResponse.json(
        { error: 'User or phone number not found' },
        { status: 404 }
      );
    }

    // Check verification code
    const isValid = await checkVerificationCode(user.phone, code);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid verification code' },
        { status: 400 }
      );
    }

    // Update user's verification status
    await User.updateOne(
      { email: session.user.email },
      { 'verificationStatus.phone': true }
    );

    return NextResponse.json({
      message: 'Phone number verified successfully'
    });
  } catch (error) {
    console.error('Error verifying code:', error);
    return NextResponse.json(
      { error: 'Failed to verify code' },
      { status: 500 }
    );
  }
} 