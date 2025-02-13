import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import prisma from "@/app/lib/prisma";
import { Prisma } from "@prisma/client";

// Type for the expected request body in POST
type CreateUserInput = Prisma.usersCreateInput;

// GET handler
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const users = await prisma.users.findMany();
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error("GET /api/users error:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

// POST handler
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: CreateUserInput = await request.json();

    // Validate the input
    if (!body.email || !body.username) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const user = await prisma.users.create({
      data: body,
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error("POST /api/users error:", error);

    // Handle unique constraint violations
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") { 
        return NextResponse.json(
          { error: "A user with this email already exists" },
          { status: 409 }
        );
      }
    }

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
