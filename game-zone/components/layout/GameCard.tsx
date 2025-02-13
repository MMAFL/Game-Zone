import React, { useState } from "react";
import Image from "next/image";
import styles from './style/GameCard.module.css';


interface GameCardProps {
  title: string;
  description: string;
  category: string;
  thumbnail: string;
}

const GameCard: React.FC<GameCardProps> = ({ title, description, category, thumbnail }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={styles.gameCard}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="gameImage">
        <Image src={thumbnail} alt={title} layout="fill" objectFit="cover" />
      </div>
      <div className={`gameDetails ${hovered ? "hovered" : ""}`}>
        {hovered && (
          <div className="gameInfo">
            <p className="gameDescription">{description}</p>
            <p className="gameCategory">{category}</p>
          </div>
        )}
        <h3>{title}</h3>
      </div>
    </div>
  );
};

export default GameCard;
