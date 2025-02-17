import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.users.delete({
      where: { id: parseInt(params.id) },
    });
    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    return NextResponse.json({ message: 'Error deleting user', error }, { status: 500 });
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await prisma.users.findUnique({
      where: {
        id: parseInt(params.id)
      }
    });
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    // Remove password from response
    const { password, ...userWithoutPassword } = user;
    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { username, email, first_name, last_name, age, address, sexe, role, password } = await request.json();
    
    const updateData: any = {
      username,
      email,
      first_name,
      last_name,
      age: parseInt(age),
      address,
      sexe,
      role,
      updatedAt: new Date()
    };

    // Only hash and update password if it's provided
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    const updatedUser = await prisma.users.update({
      where: {
        id: parseInt(params.id)
      },
      data: updateData
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = updatedUser;
    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
} 