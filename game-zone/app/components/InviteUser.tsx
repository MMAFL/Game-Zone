import React, { useState, useEffect } from 'react';

interface User {
  id: number;
  username: string;
}

interface InviteUserProps {
  roomId: number;
  onInviteUser: (inviteeId: number) => void;
}

const InviteUser: React.FC<InviteUserProps> = ({ roomId, onInviteUser }) => {
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

  const handleInviteUser = (inviteeId: number) => {
    onInviteUser(inviteeId);
    setSearchTerm('');
    setSuggestions([]);
  };

  return (
    <div className="invite-user">
      <h2 className="text-2xl font-bold mb-4">Invite User to Room {roomId}</h2>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Enter Username"
        className="w-full px-3 py-2 border rounded mb-2"
      />
      {suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((user) => (
            <li key={user.id} className="mb-2">
              <button
                className="w-full text-left p-2 bg-gray-200 rounded"
                onClick={() => handleInviteUser(user.id)}
              >
                {user.username}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default InviteUser;
