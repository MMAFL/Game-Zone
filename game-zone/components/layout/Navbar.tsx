"use client"; // This tells Next.js it's a client component
import { useState } from "react";
import Link from "next/link";
import { FaRegCircleUser } from "react-icons/fa6";
import styles from "@/components/layout/style/Navbar.module.css"; // Correct import

interface User {
  role: "player" | "admin" | null; 
}

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null); // If null, no user is logged in
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const scrollToGames = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    event.preventDefault(); // Prevent default link behavior

    const section = document.getElementById("gamesSection");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <nav className={styles.navbar}>
      {/* Logo */}
      <div className={styles.logo}>
        <Link href="/">GameZone</Link>
      </div>

      {/* Navigation Links */}
      <ul className={styles.navLinks}>
        <li><Link href="/">Home</Link></li>
        <li>
          {/* Change Games link to call scroll function */}
          <a href="#gamesSection" onClick={scrollToGames}>Games</a>
        </li>
        <li><Link href="/about">About</Link></li>
        <li><Link href="/contact">Contact</Link></li>
      </ul>

      {/* User Icon with Dropdown */}
      <div
        className={styles.userMenu}
        onMouseEnter={() => setDropdownOpen(true)}
        onMouseLeave={() => setDropdownOpen(false)}
      >
        <FaRegCircleUser className={styles.userIcon} />

        {dropdownOpen && (
          <div className={styles.dropdown}>
            {!user && <Link href="/login">Log In</Link>}
            {user?.role === "player" && (
              <button onClick={() => setUser(null)}>Log Out</button>
            )}
            {user?.role === "admin" && (
              <>
                <button onClick={() => setUser(null)}>Log Out</button>
                <Link href="/admin/add-game">Add a Game</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
