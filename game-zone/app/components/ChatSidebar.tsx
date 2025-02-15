import React from 'react';
import RoomList from './RoomList';
import SearchJoinRoom from './SearchJoinRoom';
import CreateRoom from './CreateRoom';
import { useChat } from './ChatContext';

const ChatSidebar: React.FC = () => {
  const { rooms, setRooms, setSelectedRoomId, token } = useChat();

  const fetchRooms = async (token: string) => {
    const response = await fetch("/api/rooms", {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });
    if (response.ok) {
      const rooms = await response.json();
      setRooms(rooms);
    }
  };

  const handleSelectRoom = (roomId: number) => {
    setSelectedRoomId(roomId);
  };

  const handleJoinRoom = async (roomId: number) => {
    const response = await fetch("/api/rooms/join", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ roomId }),
    });

    if (response.ok) {
      fetchRooms(token);
      handleSelectRoom(roomId);
    }
  };

  const handleCreateRoom = async (roomName: string, inviteeUsernames: string[]) => {
    const response = await fetch("/api/rooms/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ roomName, inviteeUsernames }),
    });

    if (response.ok) {
      fetchRooms(token);
    }
  };

  return (
    <div className="chat-sidebar bg-gray-900 text-white p-4">
      <RoomList rooms={rooms} onSelectRoom={handleSelectRoom} />
      <SearchJoinRoom onJoinRoom={handleJoinRoom} />
      <CreateRoom onCreateRoom={handleCreateRoom} />
    </div>
  );
};

export default ChatSidebar;
