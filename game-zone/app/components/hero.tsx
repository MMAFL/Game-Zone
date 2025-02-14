"use client"; // Required for useState and useEffect

import { useState, useEffect } from "react";
import styles from "../style/Hero.module.css"; // Import CSS

const images = [
  "/images/3.jpg",
  "/images/5.png",
  "/images/7.jpg",
];

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Automatically change images every 2.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3500);

    return () => clearInterval(interval); // Cleanup interval
  }, []);

  // Function to change slide when clicking dots
  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Function to scroll to the game section
  const scrollToGames = () => {
    const section = document.getElementById("gamesSection");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className={styles.hero}>
      {/* Image Slider */}
      <div className={styles.slider}>
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Slide ${index + 1}`}
            className={`${styles.slide} ${index === currentIndex ? styles.active : ""}`}
          />
        ))}
      </div>

      {/* Discover Button - Calls scroll function */}
      <button className={styles.discoverBtn} onClick={scrollToGames}>
        Discover Our Game
      </button>

      {/* Dots Navigation */}
      <div className={styles.dots}>
        {images.map((_, index) => (
          <span
            key={index}
            className={`${styles.dot} ${index === currentIndex ? styles.activeDot : ""}`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  );
}
