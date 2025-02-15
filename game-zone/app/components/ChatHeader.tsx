import React from 'react';

const ChatHeader: React.FC = () => {
  return (
    <div className="chat-header bg-black text-white p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold">Gaming Chat Bot</h1>
      <button className="bg-gray-700 px-4 py-2 rounded">Logout</button>
    </div>
  );
};

export default ChatHeader;
