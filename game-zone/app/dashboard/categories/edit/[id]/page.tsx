"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminNavbar from '@/app/components/AdminNavbar';
import Sidebar from '@/app/components/Sidebar';

interface Category {
    id: number;
    name: string;
}

export default function EditCategory({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [category, setCategory] = useState<Category | null>(null);
    const [name, setName] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const response = await fetch(`/api/categories/${params.id}`);
                const data = await response.json();
                setCategory(data);
                setName(data.name);
            } catch (err) {
                setError('Failed to fetch category');
            }
        };
        fetchCategory();
    }, [params.id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch(`/api/categories/${params.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name }),
            });

            if (response.ok) {
                router.push('/dashboard/categories');
            } else {
                setError('Failed to update category');
            }
        } catch (err) {
            setError('Failed to update category');
        }
    };

    return (
        <div>
            <AdminNavbar />
            <div className="flex mt-36">
                <Sidebar />
                <div className="flex-1 ml-64 p-8">
                    <h1 className="text-3xl font-bold mb-8">Edit Category</h1>
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    <form onSubmit={handleSubmit} className="max-w-md">
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Category Name
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                        </div>
                        <div className="flex gap-4">
                            <button
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                Update Category
                            </button>
                            <button
                                type="button"
                                onClick={() => router.push('/dashboard/categories')}
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