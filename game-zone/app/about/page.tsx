'use client'

import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/footer';

export default function About() {
  return (
    <div style={{ backgroundColor: 'black', color: 'white', padding: '20px', fontFamily: 'poppins, sans-serif', width: '100%' }}>
      <Navbar />
      <div style={{ maxWidth: "3000px", marginTop: '60px', textAlign: 'center', padding: '20px', color: 'white', borderRadius: '10px' }}>
        <h1 style={{ color: 'purple', textAlign: 'center', fontSize: "40px", fontWeight: "bolder" }}>About Game Zone</h1>
        <p style={{ fontSize: '18px', lineHeight: '1.6', margin: '40px 0' }}>
          Welcome to Game Zone, your ultimate platform for playing games online. 
          We offer a wide variety of games to suit all tastes and preferences. Whether you're into action, adventure, 
          puzzles, or strategy, we have something for everyone. Join our community of gamers and start playing today!
        </p>
        <p style={{ fontSize: '18px', lineHeight: '1.6', margin: '40px 0' }}>
          At Game Zone, we believe in providing a seamless and enjoyable gaming experience. Our platform is designed 
          to be user-friendly and accessible, ensuring that you can easily find and play your favorite games. We are 
          constantly updating our game library with the latest and greatest titles, so there's always something new to 
          discover.
        </p>
        <p style={{ fontSize: '18px', lineHeight: '1.6', margin: '40px 0' }}>
          Our community is at the heart of everything we do. We encourage our players to connect, share tips, and 
          compete in friendly competitions. Whether you're a casual gamer or a hardcore enthusiast, you'll find a 
          welcoming and supportive community at Game Zone.
        </p>
        <p style={{ fontSize: '18px', lineHeight: '1.6', margin: '40px 0' }}>
          Thank you for choosing Game Zone as your go-to gaming platform. We are committed to providing you with the 
          best gaming experience possible. If you have any questions or feedback, please don't hesitate to reach out 
          to our support team. Happy gaming!
        </p>
      </div>
      <Footer />
    </div>
  );
}