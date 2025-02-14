import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET all categories
export async function GET() {
  try {
    const categories = await prisma.categories.findMany();
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

// POST a new category
// export async function POST(request: Request, { params }: { params: { id: string }}) {
//   try {
//     const { name } = await request.json();
//     const newCategory = await prisma.categories.create({
//       data: {
//         name,
//       },
//     });
//     return NextResponse.json(newCategory, { status: 201 });
//   } catch (error) {
//     return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
//   }
// }

// PUT (update) a category
export async function PUT(request: Request) {
  try {
    const { id, name } = await request.json();
    const updatedCategory = await prisma.categories.update({
      where: { id },
      data: { name },
    });
    return NextResponse.json(updatedCategory);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  }
}

// DELETE a category
export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    await prisma.categories.delete({
      where: { id },
    });
    return NextResponse.json({ message: 'Category deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}
