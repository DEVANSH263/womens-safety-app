import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import Geofence from '@/models/Geofence';

// Helper function to validate coordinates
function isValidCoordinates(coordinates: number[]): boolean {
  if (!Array.isArray(coordinates) || coordinates.length !== 2) return false;
  const [longitude, latitude] = coordinates;
  return (
    typeof longitude === 'number' &&
    typeof latitude === 'number' &&
    longitude >= -180 && 
    longitude <= 180 &&
    latitude >= -90 &&
    latitude <= 90
  );
}

// GET /api/geofences/[id] - Get a specific geofence
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const geofence = await Geofence.findOne({
      _id: params.id,
      userId: session.user.id
    });

    if (!geofence) {
      return NextResponse.json({ error: 'Geofence not found' }, { status: 404 });
    }

    return NextResponse.json({ geofence });
  } catch (error) {
    console.error('Error fetching geofence:', error);
    return NextResponse.json(
      { error: 'Failed to fetch geofence' },
      { status: 500 }
    );
  }
}

// PATCH /api/geofences/[id] - Update a geofence
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, type, coordinates, radius } = body;

    await connectDB();
    const geofence = await Geofence.findOne({
      _id: params.id,
      userId: session.user.id
    });

    if (!geofence) {
      return NextResponse.json({ error: 'Geofence not found' }, { status: 404 });
    }

    // Validate coordinates based on geofence type
    if (coordinates) {
      if (type === 'circle' && (!Array.isArray(coordinates) || coordinates.length !== 2 || !isValidCoordinates(coordinates))) {
        return NextResponse.json(
          { error: 'Invalid coordinates for circle geofence' },
          { status: 400 }
        );
      } else if (type === 'polygon' && (!Array.isArray(coordinates) || !coordinates.every(coord => Array.isArray(coord) && coord.length === 2 && isValidCoordinates(coord)))) {
        return NextResponse.json(
          { error: 'Invalid coordinates for polygon geofence' },
          { status: 400 }
        );
      }
    }

    // Update geofence
    const updatedGeofence = await Geofence.findByIdAndUpdate(
      params.id,
      {
        $set: {
          ...(name && { name }),
          ...(type && { type }),
          ...(coordinates && { coordinates }),
          ...(radius && { radius })
        }
      },
      { new: true }
    );

    return NextResponse.json({ geofence: updatedGeofence });
  } catch (error) {
    console.error('Error updating geofence:', error);
    return NextResponse.json(
      { error: 'Failed to update geofence' },
      { status: 500 }
    );
  }
}

// DELETE /api/geofences/[id] - Delete a geofence
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const geofence = await Geofence.findOneAndDelete({
      _id: params.id,
      userId: session.user.id
    });

    if (!geofence) {
      return NextResponse.json({ error: 'Geofence not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Geofence deleted successfully' });
  } catch (error) {
    console.error('Error deleting geofence:', error);
    return NextResponse.json(
      { error: 'Failed to delete geofence' },
      { status: 500 }
    );
  }
} 