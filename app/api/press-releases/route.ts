import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("pib"); // your DB name
    const collection = db.collection("press_releases");

    const releases = await collection
      .find({})
      .sort({ posted_on: -1 }) // latest first
      .limit(50)
      .toArray();

    return NextResponse.json(releases);
  } catch (error) {
    console.error("Error fetching press releases:", error);
    return NextResponse.json(
      { error: "Failed to fetch press releases" },
      { status: 500 }
    );
  }
}
