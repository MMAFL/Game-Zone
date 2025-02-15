import React, { useState, useEffect } from 'react';

interface User {
  id: number;
  username: string;
}

interface CreateRoomProps {
  onCreateRoom: (roomName: string, inviteeUsernames: string[]) => void;
}

const CreateRoom: React.FC<CreateRoomProps> = ({ onCreateRoom }) => {
  const [roomName, setRoomName] = useState('');
  const [inviteeUsernames, setInviteeUsernames] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<User[]>([]);

  useEffect(() => {
    if (searchTerm) {
      const fetchSuggestions = async () => {
        const response = await fetch(`/api/users/search?username=${searchTerm}`);
        if (response.ok) {
          const users = await response.json();
          setSuggestions(users);
        }
      };
      fetchSuggestions();
    } else {
      setSuggestions([]);
    }
  }, [searchTerm]);

  const handleAddInvitee = (username: string) => {
    if (!inviteeUsernames.includes(username)) {
      setInviteeUsernames([...inviteeUsernames, username]);
    }
    setSearchTerm('');
    setSuggestions([]);
  };

  const handleCreateRoom = () => {
    if (roomName.trim() && inviteeUsernames.length > 0) {
      onCreateRoom(roomName, inviteeUsernames);
      setRoomName('');
      setInviteeUsernames([]);
    }
  };

  return (
    <div className="create-room">
      <h2 className="text-2xl font-bold mb-4">Create a Room</h2>
      <input
        type="text"
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
        placeholder="Enter Room Name"
        className="w-full px-3 py-2 border rounded mb-2"
      />
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Enter Username to Invite"
        className="w-full px-3 py-2 border rounded mb-2"
      />
      {suggestions.length > 0 && (
        <ul className="suggestions-list mb-2">
          {suggestions.map((user) => (
            <li key={user.id} className="mb-2">
              <button
                className="w-full text-left p-2 bg-gray-200 rounded"
                onClick={() => handleAddInvitee(user.username)}
              >
                {user.username}
              </button>
            </li>
          ))}
        </ul>
      )}
      <ul className="invitee-list mb-2">
        {inviteeUsernames.map((username) => (
          <li key={username} className="mb-1">
            Username: {username}
          </li>
        ))}
      </ul>
      <button onClick={handleCreateRoom} className="w-full bg-green-500 text-white py-2 rounded">
        Create Room
      </button>
    </div>
  );
};

export default CreateRoom;
