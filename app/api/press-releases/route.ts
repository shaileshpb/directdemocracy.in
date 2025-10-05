// directdemocracy.in/app/api/press-releases/route.ts
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "25", 10);
    const skip = (page - 1) * limit;

    const client = await clientPromise;
    const db = client.db("pib");
    const collection = db.collection("press_releases");

    const releases = await collection
      .find({})
      .sort({ posted_on: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    const total = await collection.countDocuments({});

    return NextResponse.json({
      releases,
      total,
      page,
      limit,
    });
  } catch (error) {
    console.error("Error fetching press releases:", error);
    return NextResponse.json(
      { error: "Failed to fetch press releases" },
      { status: 500 }
    );
  }
}