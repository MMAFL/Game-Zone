import { NextRequest, NextResponse } from 'next/server';
import prisma from "@/app/lib/prisma"; // ✅ Correct Prisma import

// GET all categories
export async function GET() {
  try {
    const categories = await prisma.categories.findMany();
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

// Handle POST requests (add a new category)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body || !body.name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const { name } = body;

    // Check if the category already exists
    const existingCategory = await prisma.categories.findUnique({
      where: { name }
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: 'Category already exists' },
        { status: 409 } // Conflict status code
      );
    }

    const newCategory = await prisma.categories.create({
      data: {
        name,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}
