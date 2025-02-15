"use client";

import { useEffect } from "react";
import io from "socket.io-client";
import ChatHeader from "@/app/components/ChatHeader";
import ChatSidebar from "@/app/components/ChatSidebar";
import ChatInput from "@/app/components/ChatInput";
import MessageList from "@/app/components/MessageList";
import { ChatProvider, useChat } from "@/app/components/ChatContext";

const socket = io("http://localhost:5000");

const ChatsPageContent: React.FC = () => {
  const { setMessages, token, setToken } = useChat();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }

    socket.on("receiveMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [setMessages, setToken]);

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <ChatHeader />
      <div className="flex flex-1">
        <ChatSidebar />
        <div className="flex-1 p-4">
          <MessageList />
          <ChatInput />
        </div>
      </div>
    </div>
  );
};

const ChatsPage: React.FC = () => {
  return (
    <ChatProvider>
      <ChatsPageContent />
    </ChatProvider>
  );
};

export default ChatsPage;