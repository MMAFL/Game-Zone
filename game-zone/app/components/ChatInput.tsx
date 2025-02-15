import React, { useState } from 'react';
import { useChat } from './ChatContext';

const ChatInput: React.FC = () => {
  const [newMessage, setNewMessage] = useState('');
  const { token, selectedRoomId, setMessages } = useChat();

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
        setMessages((prevMessages) => [...prevMessages, message]);
        setNewMessage('');
      }
    }
  };

  return (
    <div className="chat-input flex">
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Type a message"
        className="w-full px-3 py-2 border border-gray-700 bg-black text-white rounded"
      />
      <button onClick={sendMessage} className="ml-2 bg-gray-700 text-white px-4 py-2 rounded">
        Send
      </button>
    </div>
  );
};

export default ChatInput;
