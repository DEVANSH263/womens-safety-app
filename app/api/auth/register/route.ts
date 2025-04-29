import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/User';
import { connectDB } from '@/lib/db';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

export async function POST(req: NextRequest) {
  try {
    // Connect to database
    try {
      await connectDB();
      console.log('Connected to MongoDB successfully');
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      );
    }

    // Parse request body
    let name, email, password, phoneNumber;
    try {
      const body = await req.json();
      ({ name, email, password, phoneNumber } = body);
      console.log('Received registration request for:', email);
    } catch (parseError) {
      console.error('Request parsing error:', parseError);
      return NextResponse.json(
        { error: 'Invalid request format' },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!name || !email || !password || !phoneNumber) {
      console.log('Missing fields:', { name, email, phoneNumber });
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('Invalid email format:', email);
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate phone number format
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    if (!phoneRegex.test(phoneNumber)) {
      console.log('Invalid phone format:', phoneNumber);
      return NextResponse.json(
        { error: 'Invalid phone number format' },
        { status: 400 }
      );
    }

    // Check if user already exists
    try {
      const existingUser = await User.findOne({
        $or: [{ email: email.toLowerCase() }, { phone: phoneNumber }]
      });

      if (existingUser) {
        console.log('User already exists:', existingUser.email);
        return NextResponse.json(
          { error: 'User with this email or phone number already exists' },
          { status: 409 }
        );
      }
    } catch (lookupError) {
      console.error('Error checking existing user:', lookupError);
      return NextResponse.json(
        { error: 'Error checking user existence' },
        { status: 500 }
      );
    }

    // Create user (password will be hashed by the model's pre-save hook)
    try {
      const user = await User.create({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password, // Let the model's pre-save hook handle hashing
        phone: phoneNumber.trim(),
        verificationStatus: {
          email: false,
          phone: false
        },
        settings: {
          locationTracking: true,
          backgroundTracking: true,
          highAccuracyMode: true,
          saveLocationHistory: false,
          shareLocationWith: []
        },
        emergencyContacts: []
      });

      console.log('User created successfully:', user._id);

      // Return user data without sensitive information
      return NextResponse.json({
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone
        }
      });
    } catch (createError) {
      if (createError instanceof mongoose.Error.ValidationError) {
        console.error('Validation error:', createError.errors);
        const errorMessages = Object.values(createError.errors)
          .map(err => err.message)
          .join(', ');
        return NextResponse.json(
          { error: `Validation failed: ${errorMessages}` },
          { status: 400 }
        );
      }
      
      console.error('Error creating user:', createError);
      return NextResponse.json(
        { error: 'Failed to create user account' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Unexpected registration error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred during registration' },
      { status: 500 }
    );
  }
} 