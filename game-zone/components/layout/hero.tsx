"use client"; // Required for useState and useEffect

import { useState, useEffect } from "react";
import styles from "@/components/layout/style/Hero.module.css"; // Import CSS

const images = [
  "/images/1.jpg",
  "/images/2.png",
  "/images/3.jpg",
  "/images/4.jpg",


];

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Automatically change images every 1 second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 1500);

    return () => clearInterval(interval); // Cleanup interval
  }, []);

  // Function to change slide when clicking dots
  const goToSlide = (index: number) => {
    setCurrentIndex(index);
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
