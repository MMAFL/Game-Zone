"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { CheckCircle } from "lucide-react";

export default function GameLaunched() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const gameTitle = searchParams.get("gameTitle") || "your game";

  useEffect(() => {
    document.title = "Game Started!";
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white text-center">
      <CheckCircle className="w-16 h-16 text-green-500 mb-4 animate-bounce" />
      <h1 className="text-3xl font-bold">Game Launched!</h1>
      <p className="text-lg mt-2 opacity-80">
        {gameTitle} is now running in a new window.
      </p>
      <p className="mt-4 text-sm opacity-60">Enjoy your game!</p>
      <button
        onClick={() => router.push("/")}
        className="mt-6 px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white font-medium rounded-lg transition"
      >
        Return Home
      </button>
    </div>
  );
}
