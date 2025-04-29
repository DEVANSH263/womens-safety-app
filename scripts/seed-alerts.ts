import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { connectDB } from '../lib/db';
import Alert from '../models/Alert';
import User from '../models/User';
import { IAlert } from '../models/Alert';

async function seedAlerts() {
  try {
    await connectDB();
    console.log('Connected to database');

    // Create a test user if doesn't exist
    const hashedPassword = await bcrypt.hash('test123', 10);
    const testUser = await User.findOneAndUpdate(
      { email: 'test@example.com' },
      {
        name: 'Test User',
        email: 'test@example.com',
        password: hashedPassword,
        phone: '+1234567890',
        emergencyContacts: [
          {
            name: 'Emergency Contact 1',
            relation: 'Family',
            phone: '+0987654321',
            notificationPreference: 'sms'
          },
          {
            name: 'Emergency Contact 2',
            relation: 'Friend',
            phone: '+1122334455',
            notificationPreference: 'call'
          }
        ],
        lastKnownLocation: {
          coordinates: [77.2090, 28.6139], // Delhi coordinates
          timestamp: new Date(),
          address: 'Test Location, Delhi'
        },
        settings: {
          locationTracking: true,
          backgroundTracking: true,
          highAccuracyMode: true,
          saveLocationHistory: true,
          shareLocationWith: []
        },
        verificationStatus: {
          email: true,
          phone: true
        }
      },
      { upsert: true, new: true }
    );

    console.log('Test user created/updated:', testUser._id);

    // Delete existing alerts for clean slate
    await Alert.deleteMany({ user: testUser._id });

    // Create sample alerts
    const alerts = [
      {
        user: testUser._id,
        type: 'sos',
        location: {
          coordinates: [77.2090, 28.6139],
          timestamp: new Date(),
          address: 'Emergency Location, Delhi'
        },
        status: 'active',
        notifiedContacts: [
          {
            contactId: testUser._id,
            notifiedAt: new Date(),
            responseStatus: 'pending'
          }
        ]
      },
      {
        user: testUser._id,
        type: 'geofence',
        location: {
          coordinates: [77.2000, 28.6000],
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
          address: 'Geofence Alert Location'
        },
        status: 'resolved',
        resolvedBy: testUser._id,
        resolvedAt: new Date(),
        notifiedContacts: [
          {
            contactId: testUser._id,
            notifiedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
            responseStatus: 'responded'
          }
        ]
      },
      {
        user: testUser._id,
        type: 'inactivity',
        location: {
          coordinates: [77.1900, 28.5900],
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
          address: 'Inactivity Alert Location'
        },
        status: 'false_alarm',
        resolvedBy: testUser._id,
        resolvedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        notifiedContacts: [
          {
            contactId: testUser._id,
            notifiedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            responseStatus: 'acknowledged'
          }
        ]
      }
    ];

    const createdAlerts = await Alert.create(alerts);
    console.log('Created alerts:', createdAlerts.length);

    // Log the created alerts
    createdAlerts.forEach((alert: IAlert, index: number) => {
      console.log(`Alert ${index + 1}:`, {
        id: alert._id,
        type: alert.type,
        status: alert.status,
        createdAt: alert.createdAt
      });
    });

  } catch (error) {
    console.error('Error seeding alerts:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from database');
  }
}

// Run the seed function
seedAlerts(); 