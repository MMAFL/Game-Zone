'use client';
import { useState, useEffect } from 'react';
import { PrismaClient } from '@prisma/client';

interface Game {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  game_file: string;
  category_id: number;
  createdAt: Date;
  updatedAt: Date;
}

interface User {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
}

export default function Dashboard() {
  const [games, setGames] = useState<Game[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchGames();
    fetchUsers();
  }, []);

  const fetchGames = async () => {
    try {
      const response = await fetch('/api/games');
      const data = await response.json();
      if (Array.isArray(data)) {
        setGames(data);
      } else {
        setGames([]);
        setError('Invalid games data received');
      }
    } catch (err) {
      setError('Failed to fetch games');
      setGames([]);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      if (Array.isArray(data)) {
        setUsers(data);
      } else {
        setUsers([]);
        setError('Invalid users data received');
      }
    } catch (err) {
      setError('Failed to fetch users');
      setUsers([]);
    }
  };

  const deleteGame = async (id: number) => {
    if (confirm('Are you sure you want to delete this game?')) {
      const response = await fetch(`/api/games/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchGames();
      }
    }
  };

  const deleteUser = async (id: number) => {
    if (confirm('Are you sure you want to delete this user?')) {
      const response = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchUsers();
      }
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Games</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {games.map((game) => (
            <div key={game.id} className="border p-4 rounded-lg">
              <img src={game.thumbnail} alt={game.title} className="w-full h-48 object-cover rounded mb-4" />
              <h3 className="font-bold">{game.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{game.description}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => deleteGame(game.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Delete
                </button>
                <button
                  onClick={() => window.location.href = `/games/edit/${game.id}`}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Users</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">Name</th>
              <th className="border p-2 text-left">Email</th>
              <th className="border p-2 text-left">Joined</th>
              <th className="border p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="border p-2">{user.name}</td>
                <td className="border p-2">{user.email}</td>
                <td className="border p-2">{new Date(user.createdAt).toLocaleDateString()}</td>
                <td className="border p-2">
                  <button
                    onClick={() => deleteUser(user.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 mr-2"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => window.location.href = `/users/edit/${user.id}`}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={() => window.location.href = '/dashboard/addGames'}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Add New Game
      </button>
    </div>
  );
}
