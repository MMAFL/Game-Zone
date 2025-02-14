'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function AddGames() {
  const [gameFile, setGameFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      alert('Failed to fetch categories.');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setGameFile(e.target.files[0]);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ml_default");

    setLoading(true);

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/doxjp0kvo/image/upload",
        {
          method: 'POST',
          body: formData,
        }
      );
      const data = await response.json();
      setThumbnail(data.secure_url);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!gameFile || !title || !description || !thumbnail || !category) {
      alert("Please fill all fields and upload an image.");
      return;
    }

    // Convert the game file to base64
    const reader = new FileReader();
    reader.readAsDataURL(gameFile);
    reader.onload = async () => {
      const base64GameFile = reader.result?.toString().split(',')[1]; // Remove the data URL prefix

      const payload = {
        title,
        description,
        thumbnail,
        category,
        gameFile: base64GameFile,
      };

      setLoading(true);

      try {
        const response = await fetch('/api/games', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error('Failed to upload game');
        }

        const data = await response.json();
        alert("Game uploaded successfully!");
        // Clear form
        setTitle('');
        setDescription('');
        setThumbnail('');
        setCategory('');
        setGameFile(null);
      } catch (error) {
        console.error("Error uploading game:", error);
        alert("Failed to upload game.");
      } finally {
        setLoading(false);
      }
    };

    reader.onerror = (error) => {
      console.error("Error reading file:", error);
      alert("Failed to read game file.");
    };
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8">Add New Game</h1>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Game Title</label>
          <input 
            type="text" 
            className="w-full p-2 border rounded-md"
            placeholder="Enter game title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Game Description</label>
          <textarea
            className="w-full p-2 border rounded-md"
            placeholder="Enter game description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Thumbnail Image</label>
          <input
            type="file"
            className="w-full p-2 border rounded-md"
            onChange={handleImageUpload}
            accept="image/*"
          />
          {thumbnail && (
            <div className="mt-2">
              <Image
                src={thumbnail}
                alt="Thumbnail preview"
                width={100}
                height={100}
                className="rounded-md"
              />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Game File (ZIP)</label>
          <input
            type="file"
            className="w-full p-2 border rounded-md"
            onChange={handleFileUpload}
            accept=".zip"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Category</label>
          <select 
            className="w-full p-2 border rounded-md"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select a Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <button
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload Game"}
        </button>

        {loading && (
          <p className="text-center text-gray-600">
            Loading... Please wait.
          </p>
        )}
      </div>
    </div>
  );
}