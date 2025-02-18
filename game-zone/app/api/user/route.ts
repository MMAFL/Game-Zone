import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import prisma from "@/app/lib/prisma";
import { Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";

// Type for the expected request body in POST
type CreateUserInput = Prisma.usersCreateInput;

// GET handler
export async function GET(): Promise<NextResponse> {
  try {
    const users = await prisma.users.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        first_name: true,
        last_name: true,
        age: true,
        address: true,
        sexe: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("GET /api/user error:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

// POST handler
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();

    // Validate the input
    if (!body.email || !body.username || !body.password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = await prisma.users.findUnique({
      where: { email: body.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }

    // Check if username already exists
    const existingUsername = await prisma.users.findUnique({
      where: { username: body.username },
    });

    if (existingUsername) {
      return NextResponse.json(
        { error: "Username already taken" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(body.password, 10);

    // Create user
    const user = await prisma.users.create({
      data: {
        username: body.username,
        email: body.email,
        password: hashedPassword,
        first_name: body.first_name,
        last_name: body.last_name,
        age: body.age,
        address: body.address,
        sexe: body.sexe as "male" | "female",
        role: "player",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // Remove password from response
    const { password, ...userWithoutPassword } = user;

    // Return success response
    return NextResponse.json(
      {
        message: "User created successfully",
        user: userWithoutPassword,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/user error:", error);

    // Handle Prisma errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json(
          { error: "A user with this email or username already exists" },
          { status: 409 }
        );
      }
    }

    // Return generic error
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}

// PUT handler
export async function PUT(request: NextRequest): Promise<NextResponse> {
  try {
    const body: Prisma.usersUpdateInput = await request.json();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
    }

    const user = await prisma.users.update({
      where: { id: Number(id) },
      data: body,
    });

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("PUT /api/users error:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

// DELETE handler
export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
    }

    await prisma.users.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE /api/users error:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}

// Helper function to handle errors (optional)
function handlePrismaError(error: unknown): NextResponse {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002":
        return NextResponse.json(
          { error: "Unique constraint violation" },
          { status: 409 }
        );
      case "P2025":
        return NextResponse.json(
          { error: "Record not found" },
          { status: 404 }
        );
      default:
        return NextResponse.json({ error: "Database error" }, { status: 500 });
    }
  }

  return NextResponse.json({ error: "Internal server error" }, { status: 500 });
}
