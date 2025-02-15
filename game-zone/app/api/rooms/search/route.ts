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

// GET rooms by name
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get('name');

  try {
    const rooms = await prisma.rooms.findMany({
      where: {
        name: {
          contains: name,
        },
      },
    });
    return NextResponse.json(rooms);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch rooms" }, { status: 500 });
  }
}
