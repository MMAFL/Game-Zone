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

// POST to create a room and add users to it
export async function POST(req: NextRequest) {
  try {
    const userId = await getUserIdFromToken(req);
    const { roomName, inviteeUsernames } = await req.json();

    // Create the room
    const newRoom = await prisma.rooms.create({
      data: {
        name: roomName,
        created_by: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // Add the creator to the room
    await prisma.userrooms.create({
      data: {
        user_id: userId,
        room_id: newRoom.id,
        joined_at: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // Add invitees to the room
    for (const username of inviteeUsernames) {
      const invitee = await prisma.users.findUnique({
        where: { username },
      });

      if (invitee) {
        await prisma.userrooms.create({
          data: {
            user_id: invitee.id,
            room_id: newRoom.id,
            joined_at: new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });
      }
    }

    return NextResponse.json(newRoom);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
