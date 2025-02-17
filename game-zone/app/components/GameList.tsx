// GameList.tsx
"use client";
import React, { useEffect, useState } from "react";
import GameCard from "./GameCard";
import styles from "../style/GameList.module.css";

interface Game {
  id: number;
  title: string;
  description: string;
  categories: { name: string };
  thumbnail: string;
}

interface GameListProps {
  searchQuery: string;
  categoryId: number | null;
}

const GameList: React.FC<GameListProps> = ({ searchQuery, categoryId }) => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true);
      if (searchQuery || categoryId !== null) {
        setMessage("");
      }
      const url = new URL(`/api/games`, window.location.origin);
      if (searchQuery) url.searchParams.append("search", searchQuery);
      if (categoryId)
        url.searchParams.append("category", categoryId.toString());

      try {
        const res = await fetch(url.toString());
        const data = await res.json();
        setGames(data);
        console.log(data);
        if ((searchQuery || categoryId !== null) && data.length === 0) {
          setMessage("No games found. Try a different search or a category.");
        } else if (data.length > 0) {
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
    <div id="gamesSection" className={styles.AllgameList}>
      {loading && <p className="searchMessage">Loading games...</p>}
      {!loading && message && searchQuery && (
        <p style={{ color: "white" }} className="searchMessage">
          {message}
        </p>
      )}
      <div className={styles.gameList}>
        {games.map((game) => (
          <GameCard
            id={game.id}
            key={game.id}
            title={game.title}
            description={game.description}
            category={game.categories?.name}
            thumbnail={game.thumbnail}
          />
        ))}
      </div>
    </div>
  );
};

export default GameList;
