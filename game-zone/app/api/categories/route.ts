import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET all categories
export async function GET() {
  try {
    const categories = await prisma.categories.findMany();
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}