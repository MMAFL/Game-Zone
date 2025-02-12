import Image from "next/image";
import { Game } from "@/types/game";

interface GameCardProps {
  game: Game;
}

export default function GameCard({ game }: GameCardProps) {
  return (
    <div className="border rounded-lg p-4 shadow-lg">
      <Image
        src={game.image}
        alt={game.title}
        width={200}
        height={150}
        className="rounded-md"
      />
      <h2 className="mt-2 text-lg font-bold">{game.title}</h2>
    </div>
  );
}
