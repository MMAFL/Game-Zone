import { NextRequest, NextResponse } from 'next/server';
// import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';
import prisma from "../../lib/prisma";

// const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { 
      title,
      description,
      thumbnail,
      category,
      gameFile 
    } = data;

    if (!title || !description || !thumbnail || !category || !gameFile) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const gameDir = path.join(process.cwd(), 'public/games', title);
    const zipFilePath = path.join(gameDir, 'game.zip');

    // Create game directory
    if (!fs.existsSync(gameDir)) {
      fs.mkdirSync(gameDir, { recursive: true });
    }

    // Save the zip file
    const fileBuffer = Buffer.from(gameFile, 'base64');
    fs.writeFileSync(zipFilePath, fileBuffer);

    // Unzip the file
    const zip = new JSZip();
    const zipData = fs.readFileSync(zipFilePath);
    const unzipped = await zip.loadAsync(zipData);

    // Extract all files into the game directory
    for (const [relativePath, file] of Object.entries(unzipped.files)) {
      if (!file.dir) {
        const filePath = path.join(gameDir, relativePath);
        const dir = path.dirname(filePath);

        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }

        fs.writeFileSync(filePath, await file.async('nodebuffer'));
      }
    }

    // Find or create the category
    let categoryRecord = await prisma.categories.findUnique({
      where: { name: category },
    });

    if (!categoryRecord) {
      categoryRecord = await prisma.categories.create({
        data: { 
          name: category,
          createdAt: new Date(),
          updatedAt: new Date()
        },
      });
    }

    // Save game data in the database
    const game = await prisma.games.create({
      data: {
        title,
        description,
        thumbnail,
        game_file: gameDir,
        category_id: categoryRecord.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(game, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error creating game', error }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const categoryId = searchParams.get("category");
  const searchQuery = searchParams.get("search") || "";

  try {
    const games = await prisma.games.findMany({
      where: {
        title: {
          contains: searchQuery, // Search games by name
          // mode: "insensitive",
        },
        ...(categoryId ? { category_id: parseInt(categoryId) } : {}), // Use category_id from your model
      },
      include: { categories: true }, // Include category in response
    });

    return NextResponse.json(games);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch games" }, { status: 500 });
  }
}

