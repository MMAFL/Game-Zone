import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.games.delete({
      where: { id: parseInt(params.id) },
    });
    return NextResponse.json({ message: 'Game deleted successfully' });
  } catch (error) {
    return NextResponse.json({ message: 'Error deleting game', error }, { status: 500 });
  }
} 