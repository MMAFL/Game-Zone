"use client";

import { useEffect, useState } from "react";
import styles from "../style/ChatList.module.css";

interface Message {
  id: number;
  content: string;
  user: { username: string };
  createdAt: string;
}

const ChatList: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch("/api/message");
        const data = await response.json();
        console.log("data",data);
        setMessages(data);
      } catch (error) {
        console.error("Failed to fetch messages", error);
      }
    };

    fetchMessages();
  }, []);

  return (
    <div className={styles.chatListContainer}>
      <h2>All Chats</h2>
      <div className={styles.messages}>
        {messages.map((message) => (
          <div key={message.id} className={styles.message}>
            <strong>{message.user.username}</strong>: {message.content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatList;
