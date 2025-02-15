import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// **CREATE** - Add a new game
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newGame = await prisma.games.create({
      data: {
        title: body.title,
        description: body.description,
        thumbnail: body.thumbnail,
        game_file: body.game_file,
        category_id: body.category_id || null, // Set category ID if provided
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(newGame, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error creating game', error }, { status: 500 });
  }
}

// **READ** - Get all games
export async function GET() {
  try {
    const games = await prisma.games.findMany({
      include: { categories: true, scores: true }, // Include related categories & scores
    });
    return NextResponse.json(games);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching games', error }, { status: 500 });
  }
}

// **UPDATE** - Update a game by ID
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const updatedGame = await prisma.games.update({
      where: { id: parseInt(params.id) },
      data: {
        title: body.title,
        description: body.description,
        thumbnail: body.thumbnail,
        game_file: body.game_file,
        category_id: body.category_id || null, // Update category ID if provided
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(updatedGame);
  } catch (error) {
    return NextResponse.json({ message: 'Error updating game', error }, { status: 500 });
  }
}

// **DELETE** - Delete a game by ID
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
