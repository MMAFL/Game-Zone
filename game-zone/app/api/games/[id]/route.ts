import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import prisma from "@/app/lib/prisma";
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const prismaClient = new PrismaClient();

// **CREATE** - Add a new game
// export async function POST(request: Request) {
//   try {
//     const body = await request.json();
//     const newGame = await prisma.games.create({
//       data: {
//         title: body.title,
//         description: body.description,
//         thumbnail: body.thumbnail,
//         game_file: body.game_file,
//         category_id: body.category_id || null, // Set category ID if provided
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       },
//     });

//     return NextResponse.json(newGame, { status: 201 });
//   } catch (error) {
//     return NextResponse.json(
//       { message: "Error creating game", error },
//       { status: 500 }
//     );
//   }
// }

// **READ** - Get all games
export async function GET() {
  try {
    const games = await prisma.games.findMany({
      include: { categories: true, scores: true }, // Include related categories & scores
    });
    return NextResponse.json(games);
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching games", error },
      { status: 500 }
    );
  }
}

// **UPDATE** - Update a game by ID
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const updatedGame = await prisma.games.update({
      where: { id: parseInt(params.id) },
      data: {
        title: body.title,
        description: body.description,
        thumbnail: body.thumbnail,
        game_file: body.game_file,
        category_id: body.category_id || null, // Update category ID if provided
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(updatedGame);
  } catch (error) {
    return NextResponse.json(
      { message: "Error updating game", error },
      { status: 500 }
    );
  }
}

// **DELETE** - Delete a game by ID
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prismaClient.games.delete({
      where: { id: parseInt(params.id) },
    });

    return NextResponse.json({ message: "Game deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { message: "Error deleting game", error },
      { status: 500 }
    );
  }
}

// export async function GET(
//   request: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const game = await prisma.games.findUnique({
//       where: {
//         id: parseInt(params.id)
//       },
//       include: {
//         categories: true
//       }
//     });

//     if (!game) {
//       return NextResponse.json({ error: "Game not found" }, { status: 404 });
//     }

//     return NextResponse.json(game);
//   } catch (error) {
//     return NextResponse.json({ error: "Failed to fetch game" }, { status: 500 });
//   }
// }

// export async function PUT(
//   request: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const { title, description, thumbnail, category_id } = await request.json();

//     const updatedGame = await prisma.games.update({
//       where: {
//         id: parseInt(params.id)
//       },
//       data: {
//         title,
//         description,
//         thumbnail,
//         category_id,
//         updatedAt: new Date()
//       }
//     });
//     return NextResponse.json(updatedGame);
//   } catch (error) {
//     return NextResponse.json({ error: "Failed to update game" }, { status: 500 });
//   }
// }

// export async function POST(
//   request: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const { id } = params; // Extract the `id` from the URL

//     // Validate the `id`
//     if (!id || isNaN(Number(id))) {
//       return NextResponse.json({ message: "Invalid game ID" }, { status: 400 });
//     }

//     // Simulate starting the game (replace with your logic)
//     console.log(`Starting game with ID: ${id}`);

//     // Return the `id` in the response
//     return NextResponse.json(
//       { message: "Game started successfully", id },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error starting the game:", error);
//     return NextResponse.json(
//       { message: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

//////////////////:

export async function POST(request: NextRequest) {
  try {
    // Extract `id` from URL params
    const { id } = await request.json();

    // Validate `id`id
    if (!id || isNaN(Number(id))) {
      return NextResponse.json({ message: "Invalid game ID" }, { status: 400 });
    }

    // Fetch the game from the database
    const game = await prisma.games.findUnique({
      where: { id: parseInt(id) },
    });

    if (!game) {
      return NextResponse.json({ message: "Game Not Found" }, { status: 404 });
    }

    // // Construct the game directory path
    const gameDir = path.join(process.cwd(), "public", "games", game.title);

    // // Check if the game directory exists
    if (!fs.existsSync(gameDir)) {
      return NextResponse.json(
        { message: "Game directory does not exist" },
        { status: 404 }
      );
    }

    // Execute `npm install` in the game directory
    exec(
      `cd "${gameDir}" && npm install --force`,
      (error: Error | null, stdout: string, stderr: string) => {
        if (error) {
          console.error(`Error executing npm install: ${error.message}`);
          return NextResponse.json(
            { message: "Error during npm install" },
            { status: 500 }
          );
        }
        console.log(`npm install output: ${stdout}`);
        console.error(`npm install error output: ${stderr}`);

        // Execute `npm run dev` in the game directory
        exec(
          `cd "${gameDir}" && npm run dev`,
          (error: Error | null, stdout: string, stderr: string) => {
            if (error) {
              console.error(`Error executing npm run dev: ${error.message}`);
              return NextResponse.json(
                { message: "Error starting the game" },
                { status: 500 }
              );
            }
            console.log(`npm run dev output: ${stdout}`);
            console.error(`npm run dev error output: ${stderr}`);

            // Return success response with additional data
            return NextResponse.json(
              {
                message: "Game started successfully",
                gameId: id,
                gameUrl: `/games/${game.title}`,
              },
              { status: 200 }
            );
          }
        );
      }
    );
    return NextResponse.json(
      {
        message: "Game started successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error unzipping and running game:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
