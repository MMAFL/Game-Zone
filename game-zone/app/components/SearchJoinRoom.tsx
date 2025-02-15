import React, { useState, useEffect } from 'react';

interface Room {
  id: number;
  name: string;
}

interface SearchJoinRoomProps {
  onJoinRoom: (roomId: number) => void;
}

const SearchJoinRoom: React.FC<SearchJoinRoomProps> = ({ onJoinRoom }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<Room[]>([]);

  useEffect(() => {
    if (searchTerm) {
      const fetchSuggestions = async () => {
        const response = await fetch(`/api/rooms/search?name=${searchTerm}`);
        if (response.ok) {
          const rooms = await response.json();
          setSuggestions(rooms);
        }
      };
      fetchSuggestions();
    } else {
      setSuggestions([]);
    }
  }, [searchTerm]);

  const handleJoinRoom = (roomId: number) => {
    onJoinRoom(roomId);
    setSearchTerm('');
    setSuggestions([]);
  };

  return (
    <div className="search-join-room">
      <h2 className="text-2xl font-bold mb-4">Search and Join a Room</h2>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Enter Room Name"
        className="w-full px-3 py-2 border rounded mb-2"
      />
      {suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((room) => (
            <li key={room.id} className="mb-2">
              <button
                className="w-full text-left p-2 bg-gray-200 rounded"
                onClick={() => handleJoinRoom(room.id)}
              >
                {room.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchJoinRoom;
