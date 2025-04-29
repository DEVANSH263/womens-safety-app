import { NextRequest, NextResponse } from 'next/server';
import Contact from '@/models/Contact';
import { connectDB } from '@/lib/db';

export async function GET() {
  try {
    await connectDB();
    const contacts = await Contact.find();
    return NextResponse.json({ contacts: contacts || [] });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json({ contacts: [], error: 'Failed to fetch contacts' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { user, name, phoneNumber, relationship } = await req.json();
    if (!user || !name || !phoneNumber || !relationship) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }
    const contact = await Contact.create({ user, name, phoneNumber, relationship });
    return NextResponse.json({ contact });
  } catch (error) {
    console.error('Error creating contact:', error);
    return NextResponse.json({ error: 'Failed to create contact' }, { status: 500 });
  }
} 