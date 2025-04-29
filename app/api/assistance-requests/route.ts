import { NextRequest, NextResponse } from 'next/server';
import AssistanceRequest from '@/models/AssistanceRequest';
import { connectDB } from '@/lib/db';

export async function GET() {
  await connectDB();
  const requests = await AssistanceRequest.find();
  return NextResponse.json({ requests });
}

export async function POST(req: NextRequest) {
  await connectDB();
  const { user, type, status, location } = await req.json();
  if (!user || !type || !location || !location.lat || !location.lng) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }
  const request = await AssistanceRequest.create({ user, type, status: status || 'pending', location });
  return NextResponse.json({ request });
} 