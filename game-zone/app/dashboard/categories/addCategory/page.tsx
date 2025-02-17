'use client';

import { useState } from 'react';

import Sidebar from '@/app/components/Sidebar';
import AdminNavbar from '@/app/components/AdminNavbar';

export default function AddCategory() {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const addCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    console.log('Sending data:', { name });
    
    if (!name.trim()) {
      setError('Category name is required');
      return;
    }

    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      });
      
      if (!res.ok) {
        throw new Error('Failed to add category');
      }
      
      setName('');
    } catch (error: unknown) { // Cast error to `unknown` type
      if (error instanceof Error) {
        setError(error.message); // Now we can access `message` safely
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  return (
    <div>
      <AdminNavbar />
      <div className="p-6 max-w-lg mx-auto">
        <Sidebar />
        <h1 className="text-xl font-bold mb-4">Add Category</h1>
        <form onSubmit={addCategory}>
          <input
            type="text"
            placeholder="Category Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 w-full mb-2"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" className="bg-blue-500 text-white p-2 w-full">
            Add Category
          </button>
        </form>
      </div>
    </div>
  );
}
