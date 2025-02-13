"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/authContext";
import Link from "next/link";

export default function RegisterForm() {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        first_name: "",
        last_name: "",
        age: "",
        address: "",
        sexe: "male",
    });
    const [error, setError] = useState("");
    const router = useRouter();
    const { login } = useAuth();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        // Validate age
        const age = parseInt(formData.age);
        if (isNaN(age) || age < 1) {
            setError("Please enter a valid age");
            return;
        }

        try {
            const response = await fetch("/api/user", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    age: parseInt(formData.age),
                    role: "player", // Default role
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // Auto-login after successful registration
                const loginResponse = await fetch("/api/auth", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: formData.email,
                        password: formData.password,
                    }),
                });

                const loginData = await loginResponse.json();

                if (loginResponse.ok) {
                    login(loginData.token, loginData.user);
                    router.push("/"); // Redirect to home page
                }
            } else {
                setError(data.error || "Registration failed");
            }
        } catch (err) {
            console.error("Registration error:", err);
            setError("An error occurred during registration");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {error && (
                <div className="bg-red-100 text-red-600 p-4 rounded-md">{error}</div>
            )}

            <div className="rounded-md shadow-sm space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                            First Name
                        </label>
                        <input
                            id="first_name"
                            name="first_name"
                            type="text"
                            required
                            value={formData.first_name}
                            onChange={handleChange}
                            className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
                            Last Name
                        </label>
                        <input
                            id="last_name"
                            name="last_name"
                            type="text"
                            required
                            value={formData.last_name}
                            onChange={handleChange}
                            className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                        Username
                    </label>
                    <input
                        id="username"
                        name="username"
                        type="text"
                        required
                        value={formData.username}
                        onChange={handleChange}
                        className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    />
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    />
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        Password
                    </label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    />
                </div>

                <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                        Confirm Password
                    </label>
                    <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        required
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    />
                </div>

                <div>
                    <label htmlFor="age" className="block text-sm font-medium text-gray-700">
                        Age
                    </label>
                    <input
                        id="age"
                        name="age"
                        type="number"
                        required
                        value={formData.age}
                        onChange={handleChange}
                        className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    />
                </div>

                <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                        Address
                    </label>
                    <input
                        id="address"
                        name="address"
                        type="text"
                        required
                        value={formData.address}
                        onChange={handleChange}
                        className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    />
                </div>

                <div>
                    <label htmlFor="sexe" className="block text-sm font-medium text-gray-700">
                        Gender
                    </label>
                    <select
                        id="sexe"
                        name="sexe"
                        value={formData.sexe}
                        onChange={handleChange}
                        className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                </div>
            </div>

            <div>
                <button
                    type="submit"
                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Register
                </button>
            </div>

            <div className="text-center text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                    href="/login"
                    className="font-medium text-blue-600 hover:text-blue-500"
                >
                    Sign in
                </Link>
            </div>
        </form>
    );
} 