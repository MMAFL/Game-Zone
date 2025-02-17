'use client';

import { useState, useEffect } from 'react';
import SweetAlert from 'sweetalert2'; // Import SweetAlert
import AdminNavbar from '@/app/components/AdminNavbar';
import Sidebar from '@/app/components/Sidebar';
import '@/app/style/categorie.model.css';

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
    const result = await SweetAlert.fire({
      title: 'Are you sure?',
      text: 'You won’t be able to recover this category!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`/api/categories/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          SweetAlert.fire('Deleted!', 'Category has been deleted.', 'success');
          fetchCategories();
        } else {
          SweetAlert.fire('Error', 'Failed to delete category.', 'error');
        }
      } catch (error) {
        SweetAlert.fire('Error', 'Something went wrong.', 'error');
      }
    }
  };

  return (
    <div className="dashboard-container">
      <AdminNavbar />
      <div className="sidebar">
        <Sidebar />
      </div>
      <div className="content">
        <h1 className="heading">Categories</h1>

        <div className="category-list">
          {categories.map((category) => (
            <div key={category.id} className="category-card">
              <h3 className="category-title">{category.name}</h3>
              <p className="category-description">{category.description}</p>
              <div className="button-container">
                <button
                  onClick={() => deleteCategory(category.id)}
                  className="button button-delete"
                >
                  Delete
                </button>
                <button
                  onClick={() => window.location.href = `/dashboard/categories/edit/${category.id}`}
                  className="button button-edit"
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
