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
    if (typeof decoded === 'string') {
      throw new Error('Invalid token payload');
    }
    return (decoded as jwt.JwtPayload).userId;
  } catch (error) {
    throw new Error('Invalid token');
  }
}

// POST to invite a user to a room
export async function POST(req: NextRequest) {
  try {
    const userId = await getUserIdFromToken(req);
    const { roomId, inviteeId } = await req.json();

    // Check if the invitee is already in the room
    const existingUserRoom = await prisma.userrooms.findUnique({
      where: {
        user_id_room_id: {
          user_id: inviteeId,
          room_id: roomId,
        },
      },
    });

    if (existingUserRoom) {
      return NextResponse.json({ message: 'User is already in the room' });
    }

    // Add the invitee to the room
    const userRoom = await prisma.userrooms.create({
      data: {
        user_id: inviteeId,
        room_id: roomId,
        joined_at: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(userRoom);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
