import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import UserModel from '@/models/User';

export async function GET() {
  try {
    await connectDB();
    
    // Create a test user if none exists
    const testUser = await UserModel.findOne({ email: 'test@example.com' });
    
    if (!testUser) {
      await UserModel.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'testpassword123',
        phone: '+1234567890',
        emergencyContacts: [{
          name: 'Emergency Contact',
          relation: 'Family',
          phone: '+0987654321',
          notificationPreference: 'sms'
        }],
        lastKnownLocation: {
          coordinates: [77.2090, 28.6139], // Example coordinates (Delhi)
          timestamp: new Date(),
          address: "Test Location"
        },
        settings: {
          locationTracking: true,
          backgroundTracking: true,
          highAccuracyMode: true,
          saveLocationHistory: false,
          shareLocationWith: []
        },
        verificationStatus: {
          email: false,
          phone: false
        }
      });
    }

    const usersCount = await UserModel.countDocuments();
    
    return NextResponse.json({ 
      status: 'Connected',
      message: 'Successfully connected to MongoDB',
      usersCount,
      databaseName: 'womens-safety-app'
    });
  } catch (error) {
    console.error('MongoDB test failed:', error);
    return NextResponse.json(
      { 
        status: 'Error',
        message: 'Failed to connect to MongoDB',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 