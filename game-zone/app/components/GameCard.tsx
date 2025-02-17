"use client";
import React, { useState } from "react";
import Image from "next/image";
import styles from "../style/GameCard.module.css";

interface GameCardProps {
  id: number;
  title: string;
  description: string;
  category: string;
  thumbnail: string;
}

const GameCard: React.FC<GameCardProps> = ({
  id,
  title,
  description,
  category,
  thumbnail,
}) => {
  const [showDetails, setShowDetails] = useState(false);

  // const startGame = async (id: number) => {
  //   try {
  //     const response = await fetch(`/api/games/${id}`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ title }),
  //     });

  //     if (response.ok) {
  //       console.log(`${title} started successfully`);
  //     } else {
  //       console.error("Failed to start the game");
  //     }
  //   } catch (error) {
  //     console.error("Error starting the game:", error);
  //   }
  // };

  const startGame = async () => {
    try {
      const response = await fetch(`/api/games/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }), // Send id in the request body
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Game started successfully:", data);
        // Redirect to the game URL
        window.location.href = data.gameUrl;
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
          <p className={styles.gameDescription}>
            <strong>Description:</strong> {description}
          </p>
          <p className={styles.gameCategory}>
            <strong>Category:</strong> {category}
          </p>
        </div>
      )}
    </div>
  );
};

export default GameCard;
