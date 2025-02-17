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

// // Handle DELETE requests (delete a category)
// export async function DELETE(req: NextRequest) {
//   try {
//     const { id } = req.query; // Get the category ID from the query string
    
//     if (!id || isNaN(Number(id))) {
//       return NextResponse.json({ error: 'Invalid category ID' }, { status: 400 });
//     }

//     const categoryId = Number(id);

//     const deletedCategory = await prisma.categories.delete({
//       where: { id: categoryId },
//     });

//     return NextResponse.json(deletedCategory, { status: 200 });
//   } catch (error) {
//     console.error("Error deleting category:", error);
//     return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
//   }
// }
