// import Image from "next/image";
"use client"
import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/layout/hero";
import SearchAndCategory from "@/components/layout/search&category";
import GameList from "@/components/layout/GameList";
import Footer from "@/components/layout/footer";

const Home: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [categoryId, setCategoryId] = useState<number | null>(null);

  return (
    <div>
      <Navbar />
      <Hero />
      <SearchAndCategory setSearchQuery={setSearchQuery} setCategoryId={setCategoryId} />
      <GameList searchQuery={searchQuery} categoryId={categoryId} />
      <Footer />
    </div>
  );
};

export default Home;

