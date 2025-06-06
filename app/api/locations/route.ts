import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { Location } from "@/src/types/mongo";

export async function POST(req: Request) {
  try {
    const body: Location = await req.json();
    const { _id, ...locationData } = body;
    const client = await clientPromise;
    const db = client.db();
    const result = await db.collection("locations").insertOne({
      ...locationData,
      timestamp: new Date(),
    });
    return NextResponse.json({ insertedId: result.insertedId });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 