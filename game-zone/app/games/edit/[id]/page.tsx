"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminNavbar from "@/app/components/AdminNavbar";
import Sidebar from "@/app/components/Sidebar";
import Image from "next/image";

interface Game {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  category: string;
}

export default function EditGame({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [game, setGame] = useState<Game | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    []
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchGame();
    fetchCategories();
  }, [params.id]);

  const fetchGame = async () => {
    try {
      const response = await fetch(`/api/games/${params.id}`);
      const data = await response.json();
      setGame(data);
      setTitle(data.title);
      setDescription(data.description);
      setThumbnail(data.thumbnail);
      setCategory(data.category);
    } catch (err) {
      setError("Failed to fetch game details");
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      setError("Failed to fetch categories");
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
        { method: "POST", body: formData }
      );
      const data = await response.json();
      setThumbnail(data.secure_url);
    } catch (error) {
      setError("Failed to upload image");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/games/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, thumbnail, category }),
      });

      if (response.ok) {
        router.push("/dashboard/games");
      } else {
        setError("Failed to update game");
      }
    } catch (err) {
      setError("Failed to update game");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <AdminNavbar />
      <div className="flex mt-36">
        <Sidebar />
        <div className="flex-1 ml-64 p-8">
          <h1 className="text-3xl font-bold mb-8">Edit Game</h1>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <form onSubmit={handleSubmit} className="max-w-md">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Game Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Game Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 border rounded-md"
                rows={4}
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Thumbnail Image
              </label>
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

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2 border rounded-md"
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

            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Game"}
              </button>
              <button
                type="button"
                onClick={() => router.push("/dashboard/games")}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
