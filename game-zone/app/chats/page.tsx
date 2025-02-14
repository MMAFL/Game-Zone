"use client";

import { useEffect, useState } from "react";
import io from "socket.io-client";
import RoomList from "@/app/components/RoomList";
import MessageList from "@/app/components/MessageList";

const socket = io("http://localhost:5000");

export default function ChatsPage() {
  const [rooms, setRooms] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
  const [token, setToken] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      fetchRooms(storedToken);
    }

    socket.on("receiveMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, []);

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

  const fetchMessages = async (roomId: number) => {
    const response = await fetch(`/api/message?roomId=${roomId}`, {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });
    if (response.ok) {
      const messages = await response.json();
      setMessages(messages);
    }
  };

  const handleSelectRoom = (roomId: number) => {
    setSelectedRoomId(roomId);
    fetchMessages(roomId);
    socket.emit("joinRoom", roomId);
  };

  const sendMessage = async () => {
    if (newMessage.trim() && token && selectedRoomId) {
      const response = await fetch("/api/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ content: newMessage, roomId: selectedRoomId }),
      });

      if (response.ok) {
        const message = await response.json();
        socket.emit("sendMessage", message);
        setNewMessage("");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-8">
        <div className="flex">
          <div className="w-1/3 p-4">
            <RoomList rooms={rooms} onSelectRoom={handleSelectRoom} />
          </div>
          <div className="w-2/3 p-4">
            {selectedRoomId ? (
              <>
                <MessageList messages={messages} />
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message"
                  className="w-full px-3 py-2 border rounded"
                />
                <button onClick={sendMessage} className="mt-2 w-full bg-blue-500 text-white py-2 rounded">
                  Send
                </button>
              </>
            ) : (
              <p>Select a room to view messages</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}