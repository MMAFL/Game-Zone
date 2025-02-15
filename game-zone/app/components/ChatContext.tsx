import React, { createContext, useState, useContext, ReactNode } from 'react';

interface ChatContextProps {
  rooms: any[];
  setRooms: React.Dispatch<React.SetStateAction<any[]>>;
  messages: any[];
  setMessages: React.Dispatch<React.SetStateAction<any[]>>;
  selectedRoomId: number | null;
  setSelectedRoomId: React.Dispatch<React.SetStateAction<number | null>>;
  token: string;
  setToken: React.Dispatch<React.SetStateAction<string>>;
}

const ChatContext = createContext<ChatContextProps | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [rooms, setRooms] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
  const [token, setToken] = useState<string>('');

  return (
    <ChatContext.Provider value={{ rooms, setRooms, messages, setMessages, selectedRoomId, setSelectedRoomId, token, setToken }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
