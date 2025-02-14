import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET all messages by room id
export async function GET() {
  try {
    const categories = await prisma.messages.findMany();
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}
// create a new message with user ids and romm id 
export async function POST() {
    try {
      const categories = await prisma.categories.findMany();
      return NextResponse.json(categories);
    } catch (error) {
      return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
    }
  }