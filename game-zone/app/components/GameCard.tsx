'use client';
import React, { useState } from "react";
import Image from "next/image";
import styles from "../style/GameCard.module.css";

interface GameCardProps {
  title: string;
  description: string;
  category: string;
  thumbnail: string;
}

const GameCard: React.FC<GameCardProps> = ({ title, description, category, thumbnail }) => {
  const [showDetails, setShowDetails] = useState(false);

  const startGame = async () => {
    try {
      const response = await fetch("app/api/games/[id]/route.ts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });

      if (response.ok) {
        console.log(`${title} started successfully`);
      } else {
        console.error("Failed to start the game");
      }
    } catch (error) {
      console.error("Error starting the game:", error);
    }
  };

  return (
    <div
      className={styles.gameCard}
      onClick={startGame}
      onMouseEnter={() => setShowDetails(true)}
      onMouseLeave={() => setShowDetails(false)}
    >
      {/* Game Image */}
      <div className={styles.gameImage}>
        <Image src={thumbnail} alt={title} layout="fill" objectFit="cover" />
      </div>

      {/* Game Title */}
      <div className={styles.gameDetails}>
        <h3>{title}</h3>
      </div>

      {/* Game Details Box Appears on Top */}
      {showDetails && (
        <div className={styles.detailsBox}>
          <p className={styles.gameDescription}><strong>Description:</strong> {description}</p>
          <p className={styles.gameCategory}><strong>Category:</strong> {category}</p>
        </div>
      )}
    </div>
  );
};

export default GameCard;
