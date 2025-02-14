import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma"; // Ensure you have a Prisma client setup

export async function GET() {
  try {
    const categories = await prisma.categories.findMany();
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}