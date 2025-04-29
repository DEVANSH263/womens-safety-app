import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Alert from '@/models/Alert';
import User, { IEmergencyContact } from '@/models/User';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { sendSOSAlert, sendSOSToContacts } from '@/lib/sms';

export async function POST(req: Request) {
  try {
    // Connect to database
    await connectDB();

    // Get request body
    const body = await req.json();
    const { location, timestamp, type, guestInfo } = body;

    if (!location || !Array.isArray(location) || location.length !== 2) {
      return NextResponse.json(
        { error: 'Valid location coordinates are required' },
        { status: 400 }
      );
    }

    // Try to get authenticated user session
    const session = await getServerSession(authOptions);
    let user = null;
    let isGuest = false;

    if (session?.user?.email) {
      // Get authenticated user details
      user = await User.findOne({ email: session.user.email });
    } else if (guestInfo?.phoneNumber) {
      // Handle guest user
      isGuest = true;
    } else {
      return NextResponse.json(
        { error: 'Either authentication or guest information is required' },
        { status: 400 }
      );
    }

    // Create new alert
    const alert = await Alert.create({
      user: user?._id,
      location: {
        type: 'Point',
        coordinates: [location[1], location[0]] // Convert to GeoJSON format [longitude, latitude]
      },
      timestamp: timestamp || new Date(),
      type: 'SOS', // Use uppercase SOS as per enum
      status: 'active',
      isGuest,
      guestInfo: isGuest ? {
        name: guestInfo.name || 'Anonymous',
        phoneNumber: guestInfo.phoneNumber
      } : undefined
    });

    let smsSuccess = false;
    const successfulNumbers: string[] = [];
    const failedNumbers: string[] = [];

    if (user) {
      // Send SMS to emergency contacts for authenticated users
      if (user.emergencyContacts?.length > 0) {
        try {
          const contactsSuccess = await sendSOSToContacts(
            user.emergencyContacts
              .filter((contact: IEmergencyContact) => contact.isVerified)
              .map((contact: IEmergencyContact) => ({
                name: contact.name,
                phoneNumber: contact.phoneNumber
              })),
            location as [number, number],
            user.name
          );
          if (contactsSuccess) {
            smsSuccess = true;
          }
        } catch (error) {
          console.error('Failed to send alerts to emergency contacts:', error);
        }
      }

      // Send SMS to user's own phone number if available
      if (user.phone) {
        try {
          await sendSOSAlert(user.phone, location as [number, number], user.name);
          smsSuccess = true;
          successfulNumbers.push(user.phone);
        } catch (error) {
          console.error('Failed to send alert to user:', error);
          failedNumbers.push(user.phone);
        }
      }
    } else if (guestInfo) {
      // Send SMS for guest users
      const numbersToNotify = [
        guestInfo.phoneNumber,
        ...(guestInfo.additionalNumbers || [])
      ];

      for (const number of numbersToNotify) {
        try {
          await sendSOSAlert(number, location as [number, number], guestInfo.name || 'Anonymous');
          smsSuccess = true;
          successfulNumbers.push(number);
        } catch (error) {
          console.error(`Failed to send alert to ${number}:`, error);
          failedNumbers.push(number);
        }
      }
    }

    // Send alerts to nearby police stations (if implemented)
    // TODO: Implement police station notification

    return NextResponse.json({
      alert,
      message: smsSuccess 
        ? 'SOS alert created and notifications sent successfully'
        : 'SOS alert created but some notifications failed',
      success: true,
      smsStatus: smsSuccess ? 'sent' : 'failed',
      successfulNumbers,
      failedNumbers
    });
  } catch (error) {
    console.error('Error creating SOS alert:', error);
    return NextResponse.json(
      { error: 'Failed to create SOS alert' },
      { status: 500 }
    );
  }
} 