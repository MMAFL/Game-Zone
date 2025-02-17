"use client";
import { useState, useEffect } from "react";
import { PrismaClient } from "@prisma/client";
import AdminNavbar from "@/app/components/AdminNavbar";
import Sidebar from "@/app/components/Sidebar";

interface Game {
  id: number;
  title: string;
  thumbnail: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function Dashboard() {
  const [games, setGames] = useState<Game[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      const response = await fetch("/api/games");
      const data = await response.json();
      if (Array.isArray(data)) {
        setGames(data);
      } else {
        setGames([]);
        setError("Invalid games data received");
      }
    } catch (err) {
      setError("Failed to fetch games");
      setGames([]);
    }
  };

  const deleteGame = async (id: number) => {
    if (confirm("Are you sure you want to delete this game?")) {
      const response = await fetch(`/api/games/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchGames();
      }
    }
  };

  return (
    <div>
      <AdminNavbar />
      <div className="flex mt-36">
        <Sidebar />
        <div className="flex-1 ml-64 p-8">
          <h1 className="text-3xl font-bold mb-8">Games</h1>

          <div className="mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {games.map((game) => (
                <div key={game.id} className="border p-4 rounded-lg">
                  <img
                    src={game.thumbnail}
                    alt={game.title}
                    className="w-full h-48 object-cover rounded mb-4"
                  />
                  <h3 className="font-bold">{game.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {game.description}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => deleteGame(game.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() =>
                        (window.location.href = `/games/edit/${game.id}`)
                      }
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
