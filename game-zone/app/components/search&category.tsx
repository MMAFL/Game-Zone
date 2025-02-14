"use client";

import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import styles from "../style/SearchAndCategory.module.css";

interface Category {
  id: number;
  name: string;
}

interface SearchAndCategoryProps {
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  setCategoryId: React.Dispatch<React.SetStateAction<number | null>>;
}

export default function SearchAndCategory({
  setSearchQuery,
  setCategoryId,
}: SearchAndCategoryProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All Categories");
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    }

    fetchCategories();
  }, []);

  const handleCategorySelect = (categoryId: number | null, categoryName: string) => {
    setSelectedCategory(categoryName);
    setCategoryId(categoryId);
    setShowDropdown(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className={styles.container}>
      <div className={styles.searchContainer}>
        {/* Category Dropdown */}
        <div className={styles.dropdownContainer}>
          <button
            className={styles.dropdownButton}
            onClick={() => setShowDropdown(!showDropdown)}
          >
            {selectedCategory}
          </button>
          {showDropdown && (
            <div className={styles.dropdownContent}>
              <button
                onClick={() => handleCategorySelect(null, "All Categories")}
                className={styles.dropdownItem}
              >
                All Categories
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategorySelect(category.id, category.name)}
                  className={styles.dropdownItem}
                >
                  {category.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Search Bar */}
        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="Search for a game"
            onChange={handleSearchChange}
            className={styles.searchInput}
          />
          <FaSearch className={styles.searchIcon} />
        </div>
      </div>
    </div>
  );
}
