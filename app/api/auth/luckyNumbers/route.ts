import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Handle POST requests
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, number, date, time } = body;
    if (!userId || !number || !date || !time) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newLuckyNumber = await prisma.luckyNumber.create({
      data: {
        number,
        date: date,
        time,
        user: { connect: { id: userId } },
      },
    });
    return NextResponse.json(newLuckyNumber, { status: 201 });
  } catch (error) {
    console.error("Error creating lucky number:", error);
    return NextResponse.json({ error: "Failed to create lucky number" }, { status: 500 });
  }
}

// Handle GET requests
export async function GET() {
  try {
    const luckyNumbers = await prisma.luckyNumber.findMany();
    return NextResponse.json(luckyNumbers, { status: 200 });
  } catch (error) {
    console.error("Error fetching lucky numbers:", error);
    return NextResponse.json({ error: "Failed to fetch lucky numbers" }, { status: 500 });
  }
}
