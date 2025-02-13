import React, { useEffect, useState } from "react";
import GameCard from "@/components/layout/GameCard";

interface GameListProps {
  searchQuery: string;
  categoryId: number | null;
}

interface Game {
  id: number;
  title: string;
  description: string;
  categories: { name: string };
  thumbnail: string;
}

const GameList: React.FC<GameListProps> = ({ searchQuery, categoryId }) => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true);
      setMessage("");

      const url = new URL(`/api/games`, window.location.origin);
      if (searchQuery) url.searchParams.append("search", searchQuery);
      if (categoryId) url.searchParams.append("category", categoryId.toString());

      try {
        const res = await fetch(url.toString());
        const data = await res.json();
        setGames(data);

        if (data.length === 0) {
          setMessage("No games found. Try a different search or category.");
        } else {
          setMessage(`${data.length} game(s) found.`);
        }
      } catch (error) {
        setMessage("Error fetching games. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, [searchQuery, categoryId]);

  return (
    <div className="gameList">
      {loading && <p>Loading games...</p>}
      {!loading && message && <p className="searchMessage">{message}</p>}

      {games.map((game) => (
        <GameCard
          key={game.id}
          title={game.title}
          description={game.description}
          category={game.categories.name}
          thumbnail={game.thumbnail}
        />
      ))}
    </div>
  );
};

export default GameList;
