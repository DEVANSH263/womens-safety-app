import { NextRequest, NextResponse } from 'next/server';
import Police from '@/models/Police';
import { connectDB } from '@/lib/db';

export async function GET() {
  await connectDB();
  const policeStations = await Police.find();
  return NextResponse.json({ policeStations });
}

export async function POST(req: NextRequest) {
  await connectDB();
  const { name, address, phoneNumber } = await req.json();
  if (!name || !address || !phoneNumber) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }
  const police = await Police.create({ name, address, phoneNumber });
  return NextResponse.json({ police });
} 