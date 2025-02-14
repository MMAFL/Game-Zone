"use client";
import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/hero";
import SearchAndCategory from "./components/search&category";
import GameList from "./components/GameList";
import Footer from "./components/footer";
import RoomSelection from "./components/RoomSelection";
import ChatList from "./components/ChatList";

const Home: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [roomId, setRoomId] = useState<number | null>(null);

  const handleRoomSelect = (selectedRoomId: number) => {
    setRoomId(selectedRoomId);
    setChatOpen(true);
  };

  return (
    <div>
      <Navbar />
      <Hero />
      <SearchAndCategory setSearchQuery={setSearchQuery} setCategoryId={setCategoryId} />
      <GameList searchQuery={searchQuery} categoryId={categoryId} />
      <Footer />
      <button onClick={() => setChatOpen(!chatOpen)} className="chatButton">
        {chatOpen ? "Close Chat" : "Open Chat"}
      </button>
      {chatOpen && roomId === null && <RoomSelection onRoomSelect={handleRoomSelect} />}
      {chatOpen && roomId !== null && <Chat roomId={roomId} />}
      <ChatList />
    </div>
  );
};

export default Home;

