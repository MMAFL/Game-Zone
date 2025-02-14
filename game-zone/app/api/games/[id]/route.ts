import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import prisma from "@/app/lib/prisma";

const prismaClient = new PrismaClient();

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prismaClient.games.delete({
      where: { id: parseInt(params.id) },
    });
    return NextResponse.json({ message: 'Game deleted successfully' });
  } catch (error) {
    return NextResponse.json({ message: 'Error deleting game', error }, { status: 500 });
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const game = await prisma.games.findUnique({
      where: {
        id: parseInt(params.id)
      },
      include: {
        categories: true
      }
    });
    
    if (!game) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }
    
    return NextResponse.json(game);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch game" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { title, description, thumbnail, category_id } = await request.json();
    
    const updatedGame = await prisma.games.update({
      where: {
        id: parseInt(params.id)
      },
      data: {
        title,
        description,
        thumbnail,
        category_id,
        updatedAt: new Date()
      }
    });
    return NextResponse.json(updatedGame);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update game" }, { status: 500 });
  }
} 