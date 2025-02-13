"use client"; // Required for state management in Next.js

import { createContext, useContext, useState, ReactNode } from "react";

// Define user types
interface User {
  id: string;
  name: string;
  email: string;
  role: "player" | "admin";
}

// Define Auth Context Type
interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  token: string | null;
}

// Create Context with default values
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook to use Auth Context
export function useAuth() {
  const context = useContext(AuthContext);
  console.log("context", context);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Provider Component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Login function
  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData)); // Persist user data
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
