import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import mongoose from 'mongoose';

export async function GET() {
  try {
    await connectDB();
    
    if (!mongoose.connection.db) {
      throw new Error('Database connection not established');
    }

    // Get all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionData: { [key: string]: any[] } = {};

    // Get contents of each collection
    for (const collection of collections) {
      const data = await mongoose.connection.db
        .collection(collection.name)
        .find({})
        .limit(10)  // Limit to 10 documents per collection
        .toArray();
      
      collectionData[collection.name] = data;
    }

    return NextResponse.json({ 
      status: 'Success',
      collections: collections.map(c => c.name),
      data: collectionData
    });
  } catch (error) {
    console.error('Failed to list collections:', error);
    return NextResponse.json(
      { 
        status: 'Error',
        message: 'Failed to list collections',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 