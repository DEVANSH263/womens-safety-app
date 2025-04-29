import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { getServerSession } from 'next-auth';
import { ObjectId } from 'mongodb';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Interface for the geofence data
interface GeofenceData {
  _id?: ObjectId;
  name: string;
  points: Array<{ lat: number; lng: number }>;
  userId: string;
  createdAt: Date;
  isActive: boolean;
  description?: string;
  alertSettings?: {
    onEnter: boolean;
    onExit: boolean;
    notifyContacts: string[];
  };
}

// POST /api/geofences - Create a new geofence
export async function POST(req: Request) {
  try {
    const data = await req.json();
    console.log('POST received data:', data);

    return NextResponse.json({ 
      success: true, 
      id: Date.now().toString(),
      geofence: { ...data, _id: Date.now().toString() }
    });
  } catch (error) {
    console.error('Error in POST /api/geofences:', error);
    return NextResponse.json(
      { error: 'Failed to save geofence' },
      { status: 500 }
    );
  }
}

// GET /api/geofences - List geofences
export async function GET(req: Request) {
  try {
    console.log('GET /api/geofences called');
    return NextResponse.json([]);
  } catch (error) {
    console.error('Error in GET /api/geofences:', error);
    return NextResponse.json(
      { error: 'Failed to fetch geofences' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    console.log('DELETE /api/geofences called for id:', id);

    if (!id) {
      return NextResponse.json(
        { error: 'Geofence ID is required' },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/geofences:', error);
    return NextResponse.json(
      { error: 'Failed to delete geofence' },
      { status: 500 }
    );
  }
}

// Add PATCH endpoint for updating geofence
export async function PATCH(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Geofence ID is required' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const data = await req.json();

    const result = await db.collection('geofences').updateOne(
      {
        _id: new ObjectId(id),
        userId: session.user.id || 'anonymous'
      },
      {
        $set: {
          ...data,
          updatedAt: new Date()
        }
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Geofence not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating geofence:', error);
    return NextResponse.json(
      { error: 'Failed to update geofence' },
      { status: 500 }
    );
  }
} 