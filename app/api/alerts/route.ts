import { NextRequest, NextResponse } from 'next/server';
import Alert from '@/models/Alert';
import { connectDB } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// POST /api/alerts - Create a new alert
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const data = await req.json();

    // Validate required fields
    if (!data.type || !data.location?.coordinates) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const alert = await Alert.create({
      user: session.user.id,
      type: data.type,
      location: {
        coordinates: data.location.coordinates,
        timestamp: data.location.timestamp || new Date(),
        address: data.location.address
      },
      notifiedContacts: data.notifiedContacts || []
    });

    return NextResponse.json(alert);
  } catch (error) {
    console.error('Failed to create alert:', error);
    return NextResponse.json(
      { error: 'Failed to create alert' },
      { status: 500 }
    );
  }
}

// GET /api/alerts - List alerts
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { searchParams } = new URL(req.url);
    
    // Build query based on parameters
    const query: any = { user: session.user.id };
    
    // Filter by status
    const status = searchParams.get('status');
    if (status) {
      query.status = status;
    }

    // Filter by type
    const type = searchParams.get('type');
    if (type) {
      query.type = type;
    }

    // Filter by date range
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const alerts = await Alert.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(searchParams.get('limit') || '50'))
      .populate('notifiedContacts.contactId', 'name phone');

    return NextResponse.json(alerts);
  } catch (error) {
    console.error('Failed to fetch alerts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch alerts' },
      { status: 500 }
    );
  }
} 