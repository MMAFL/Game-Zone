"use client";

import { useState } from "react";
import styles from "../style/RoomSelection.module.css";

interface RoomSelectionProps {
  onRoomSelect: (roomId: number) => void;
}

const RoomSelection: React.FC<RoomSelectionProps> = ({ onRoomSelect }) => {
  const [roomId, setRoomId] = useState<number | null>(null);

  const handleJoinRoom = () => {
    if (roomId !== null && roomId >= 0 && roomId <= 1000) {
      onRoomSelect(roomId);
    } else {
      alert("Please enter a room ID between 0 and 1000.");
    }
  };

  return (
    <div className={styles.roomSelectionContainer}>
      <input
        type="number"
        placeholder="Enter Room ID"
        value={roomId !== null ? roomId : ""}
        onChange={(e) => setRoomId(Number(e.target.value))}
        className={styles.roomInput}
      />
      <button onClick={handleJoinRoom} className={styles.joinButton}>
        Join Room
      </button>
    </div>
  );
};

export default RoomSelection;
