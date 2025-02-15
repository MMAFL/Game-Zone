import React, { useState } from 'react';

interface JoinRoomProps {
  onJoinRoom: (roomId: number) => void;
}

const JoinRoom: React.FC<JoinRoomProps> = ({ onJoinRoom }) => {
  const [roomId, setRoomId] = useState<number | null>(null);

  const handleJoinRoom = () => {
    if (roomId !== null) {
      onJoinRoom(roomId);
    }
  };

  return (
    <div className="join-room">
      <h2 className="text-2xl font-bold mb-4">Join a Room</h2>
      <input
        type="number"
        value={roomId !== null ? roomId : ''}
        onChange={(e) => setRoomId(Number(e.target.value))}
        placeholder="Enter Room ID"
        className="w-full px-3 py-2 border rounded mb-2"
      />
      <button onClick={handleJoinRoom} className="w-full bg-blue-500 text-white py-2 rounded">
        Join Room
      </button>
    </div>
  );
};

export default JoinRoom;
