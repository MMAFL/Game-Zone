import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET all ROOMS BY TOKEN MEANS USERiD
export async function GET() {
  try {
    const categories = await prisma.messages.findMany();
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}
// create a new room with user ids
export async function POST() {
    try {
      const categories = await prisma.categories.findMany();
      return NextResponse.json(categories);
    } catch (error) {
      return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
    }
  }