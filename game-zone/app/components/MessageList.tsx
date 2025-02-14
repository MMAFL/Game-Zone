import React from 'react';

interface MessageListProps {
  messages: { id: number; content: string; user_id: number; createdAt: string }[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  return (
    <div className="message-list">
      <h2 className="text-2xl font-bold mb-4">Messages</h2>
      <ul>
        {messages.map((message) => (
          <li key={message.id} className="mb-2">
            <div className="p-2 bg-gray-100 rounded">
              <p>{message.content}</p>
              <small>By User {message.user_id} at {new Date(message.createdAt).toLocaleString()}</small>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MessageList;
