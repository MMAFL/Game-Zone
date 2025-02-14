"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminNavbar from '@/app/components/AdminNavbar';
import Sidebar from '@/app/components/Sidebar';

interface Game {
    id: number;
    title: string;
    description: string;
    thumbnail: string;
    category_id: number;
}

interface Category {
    id: number;
    name: string;
}

export default function EditGame({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [game, setGame] = useState<Game | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        thumbnail: '',
        category_id: ''
    });
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch game data
                const gameResponse = await fetch(`/api/games/${params.id}`);
                const gameData = await gameResponse.json();
                setGame(gameData);
                setFormData({
                    title: gameData.title,
                    description: gameData.description,
                    thumbnail: gameData.thumbnail,
                    category_id: gameData.category_id.toString()
                });

                // Fetch categories
                const categoriesResponse = await fetch('/api/categories');
                const categoriesData = await categoriesResponse.json();
                setCategories(categoriesData);
            } catch (err) {
                setError('Failed to fetch data');
            }
        };
        fetchData();
    }, [params.id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch(`/api/games/${params.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    category_id: parseInt(formData.category_id)
                }),
            });

            if (response.ok) {
                router.push('/dashboard/games');
            } else {
                setError('Failed to update game');
            }
        } catch (err) {
            setError('Failed to update game');
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
                                Title
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                rows={4}
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Thumbnail URL
                            </label>
                            <input
                                type="text"
                                name="thumbnail"
                                value={formData.thumbnail}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Category
                            </label>
                            <select
                                name="category_id"
                                value={formData.category_id}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            >
                                <option value="">Select a category</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex gap-4">
                            <button
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                Update Game
                            </button>
                            <button
                                type="button"
                                onClick={() => router.push('/dashboard/games')}
                                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
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