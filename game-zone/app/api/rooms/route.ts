import { NextResponse, NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';

// Middleware to extract user ID from token
async function getUserIdFromToken(req: NextRequest) {
  const token = req.headers.get('authorization')?.split(' ')[1];
  if (!token) {
    throw new Error('No token provided');
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    return decoded.userId;
  } catch (error) {
    throw new Error('Invalid token');
  }
}

// GET all rooms created by and joined by the user
export async function GET(req: NextRequest) {
  try {
    const userId = await getUserIdFromToken(req);

    // Fetch rooms created by the user
    const createdRooms = await prisma.rooms.findMany({
      where: { created_by: userId },
    });

    // Fetch rooms joined by the user
    const joinedRooms = await prisma.rooms.findMany({
      where: {
        userrooms: {
          some: {
            user_id: userId,
          },
        },
      },
    });

    // Combine both created and joined rooms
    const allRooms = [...createdRooms, ...joinedRooms];

    return NextResponse.json(allRooms);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Create a new room with user id
export async function POST(req: NextRequest) {
  try {
    const userId = await getUserIdFromToken(req);
    const { name } = await req.json();
    const newRoom = await prisma.rooms.create({
      data: {
        name,
        created_by: userId,
      },
    });
    return NextResponse.json(newRoom);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}