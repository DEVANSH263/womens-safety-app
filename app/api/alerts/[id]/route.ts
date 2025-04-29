import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Alert, { IAlert } from '@/models/Alert';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

interface RouteParams {
  params: {
    id: string;
  };
}

interface NotifiedContact {
  contactId: {
    toString(): string;
  };
  responseStatus: string;
}

interface UserSession {
  user?: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

// GET /api/alerts/[id] - Get a specific alert
export async function GET(req: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions) as UserSession;
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const alert = await Alert.findById(params.id)
      .populate('notifiedContacts.contactId', 'name phone');

    if (!alert) {
      return NextResponse.json({ error: 'Alert not found' }, { status: 404 });
    }

    // Check if user owns the alert or is a notified contact
    const isOwner = alert.user.toString() === session.user.id;
    const isNotifiedContact = alert.notifiedContacts.some(
      (contact: NotifiedContact) => contact.contactId.toString() === session.user!.id
    );

    if (!isOwner && !isNotifiedContact) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json(alert);
  } catch (error) {
    console.error('Failed to fetch alert:', error);
    return NextResponse.json(
      { error: 'Failed to fetch alert' },
      { status: 500 }
    );
  }
}

// PATCH /api/alerts/[id] - Update alert status
export async function PATCH(req: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions) as UserSession;
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const data = await req.json();
    
    const alert = await Alert.findById(params.id);
    if (!alert) {
      return NextResponse.json({ error: 'Alert not found' }, { status: 404 });
    }

    // Check permissions
    const isOwner = alert.user.toString() === session.user.id;
    const isNotifiedContact = alert.notifiedContacts.some(
      (contact: NotifiedContact) => contact.contactId.toString() === session.user!.id
    );

    if (!isOwner && !isNotifiedContact) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Update alert status
    if (data.status) {
      alert.status = data.status;
      if (data.status === 'resolved') {
        alert.resolvedBy = session.user.id;
        alert.resolvedAt = new Date();
      }
    }

    // Update contact response status
    if (isNotifiedContact && data.responseStatus) {
      const contactIndex = alert.notifiedContacts.findIndex(
        (contact: NotifiedContact) => contact.contactId.toString() === session.user!.id
      );
      if (contactIndex !== -1) {
        alert.notifiedContacts[contactIndex].responseStatus = data.responseStatus;
      }
    }

    await alert.save();
    return NextResponse.json(alert);
  } catch (error) {
    console.error('Failed to update alert:', error);
    return NextResponse.json(
      { error: 'Failed to update alert' },
      { status: 500 }
    );
  }
}

// DELETE /api/alerts/[id] - Delete an alert
export async function DELETE(req: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions) as UserSession;
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const alert = await Alert.findById(params.id);
    
    if (!alert) {
      return NextResponse.json({ error: 'Alert not found' }, { status: 404 });
    }

    // Only alert owner can delete
    if (alert.user.toString() !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await alert.deleteOne();
    return NextResponse.json({ message: 'Alert deleted successfully' });
  } catch (error) {
    console.error('Failed to delete alert:', error);
    return NextResponse.json(
      { error: 'Failed to delete alert' },
      { status: 500 }
    );
  }
} 