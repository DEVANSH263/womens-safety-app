import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { User } from "@/src/types/mongo";

export async function POST(req: Request) {
  try {
    const body: User = await req.json();
    const { _id, ...userData } = body;
    const client = await clientPromise;
    const db = client.db();
    const result = await db.collection("users").insertOne({
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return NextResponse.json({ insertedId: result.insertedId });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 