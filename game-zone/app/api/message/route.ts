import { NextResponse, NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';

// Middleware to extract user ID from token
async function getUserIdFromToken(req: NextRequest) {
  const token = req.headers.get('authorization')?.split(' ')[1];
  console.log("token",token);
  if (!token) {
    throw new Error('No token provided');
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    console.log("decoded",decoded);
    return decoded.userId;
  } catch (error) {
    throw new Error('Invalid token');
  }
}

// GET all messages by room id
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const roomId = searchParams.get('roomId');

  try {
    const messages = await prisma.messages.findMany({
      where: { room_id: Number(roomId) },
      include: { users: true },
    });
    return NextResponse.json(messages);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}

// Create a new message with user ids and room id
export async function POST(req: NextRequest) {
  try {
    const userId = await getUserIdFromToken(req);
    const { content, roomId } = await req.json();
    const newMessage = await prisma.messages.create({
      data: {
        user_id: userId,
        content,
        room_id:Number(roomId),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    return NextResponse.json(newMessage);
  } catch (error) {
    throw new Error(error);
    return NextResponse.json({ error: "Failed to create message" }, { status: 500 });
  }
}