'use client';
import { useState, useEffect } from 'react';
import { PrismaClient } from '@prisma/client';
import AdminNavbar from '@/app/components/AdminNavbar';
import Sidebar from '../components/Sidebar';

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
  first_name: string;
  last_name: string;
  email: string;
  createdAt: Date;
}

interface Category {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
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
      const token = localStorage.getItem('token'); // Retrieve the token from localStorage
      const response = await fetch('/api/users', {
        headers: {
          'Authorization': `Bearer ${token}`, // Include the token in the headers
        },
      });
      console.log('Response status:', response.status); // Log response status
      const data = await response.json();
      console.log('Response data:', data); // Log response data
      if (Array.isArray(data)) {
        setUsers(data);
      } else {
        setUsers([]);
        setError('Invalid users data received');
      }
    } catch (err) {
      console.error('Error fetching users:', err); // Log error
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
    <div>
      <AdminNavbar />
      <div className="flex mt-36">
        <Sidebar />
        <div className="flex-1 ml-64 p-8">
          <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>


          

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
                    <td className="border p-1">{user.first_name + " " + user.last_name}</td>
                    <td className="border p-1">{user.email}</td>
                    <td className="border p-1">{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className="border p-1">
                      <button
                        onClick={() => deleteUser(user.id)}
                        className="bg-violet-500 text-white px-3 py-1 rounded hover:bg-violet-600 mr-2"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => window.location.href = `/dashboard/users/edit/${user.id}`}
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
        </div>
      </div>
    </div>
  );
}
