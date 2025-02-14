"use client"

import { useState, useEffect } from 'react';
import AdminNavbar from '@/app/components/AdminNavbar';
import Sidebar from '@/app/components/Sidebar';

interface Category {
    id: number;
    name: string;
    description: string;
    thumbnail: string;
    createdAt: Date;
    updatedAt: Date;
}

export default function Dashboard() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await fetch('/api/categories');
            const data = await response.json();
            if (Array.isArray(data)) {
                setCategories(data);
            } else {
                setCategories([]);
                setError('Invalid categories data received');
            }
        } catch (err) {
            setError('Failed to fetch categories');
            setCategories([]);
        }
    };

    const deleteCategory = async (id: number) => {
        if (confirm('Are you sure you want to delete this category?')) {
            const response = await fetch(`/api/categories/${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                fetchCategories();
            }
        }
    };

    return (
        <div>
            <AdminNavbar />
            <div className="flex mt-36">
                <Sidebar />
                <div className="flex-1 ml-64 p-8">
                    <h1 className="text-3xl font-bold mb-8">Categories</h1>

                    <div className="mb-12">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {categories.map((category) => (
                                <div key={category.id} className="border p-4 rounded-lg flex">
                                
                                    <h3 className="font-bold">{category.name}</h3>
                                    <p className="text-sm text-gray-600 mb-4">{category.description}</p>
                                    <div className="flex gap-3 ml-80">
                                        <button
                                            onClick={() => deleteCategory(category.id)}
                                            className="bg-violet-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                        >
                                            Delete
                                        </button>
                                        <button
                                            onClick={() => window.location.href = `/categories/edit/${category.id}`}
                                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                        >
                                            Edit
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}