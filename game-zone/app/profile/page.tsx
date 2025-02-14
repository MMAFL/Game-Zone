"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import styles from "../style/Profile.module.css";

const avatars = [
  "/images/p1.avif",
  "/images/p2.avif",
  "/images/p3.avif",
  "/images/p4.webp",
  "/images/p5.",
];

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  age: number;
  address: string;
  sexe: string;
  role: string;
  createdAt: string;
  avatar?: string;
}

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [selectedAvatar, setSelectedAvatar] = useState(avatars[0]);
  const [view, setView] = useState("profile");
  const [formData, setFormData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    age: "",
    address: "",
  });
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found, user not authenticated.");
          return;
        }

        const res = await fetch("/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch user");

        const data = await res.json();
        setUser(data);
        setSelectedAvatar(data.avatar || avatars[0]);
        setFormData({
          username: data.username || "",
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          age: data.age ? String(data.age) : "",
          address: data.address || "",
        });
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, []);

  const handleAvatarChange = (avatar: string) => {
    setSelectedAvatar(avatar);
  };

  const handleUpdateProfile = async () => {
    await fetch("/api/users", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData, avatar: selectedAvatar }),
    });
    setView("profile");
  };

  const handleChangePassword = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      Swal.fire("Error", "Passwords do not match!", "error");
      return;
    }
    if (passwords.newPassword.length < 6) {
      Swal.fire("Error", "Password is too weak!", "error");
      return;
    }
    if (passwords.newPassword === passwords.currentPassword) {
      Swal.fire("Error", "New password cannot be the same as the old password!", "error");
      return;
    }

    await fetch("/api/users/password", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ newPassword: passwords.newPassword }),
    });

    Swal.fire("Success", "Password updated successfully!", "success");
    setView("profile");
  };

  const handleDeleteAccount = async () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await fetch("/api/users", { method: "DELETE" });
        router.push("/login");
      }
    });
  };

  return (
    <div className={styles.profileContainer}>
      {view === "profile" && user && (
        <>
          <div className={styles.avatarContainer}>
            <Image src={selectedAvatar} alt="Avatar" width={100} height={100} className={styles.avatar} />
          </div>
          <h2 className={styles.username}>{user.username}</h2>
          <div className={styles.avatarSelection}>
            {avatars.map((avatar, index) => (
              <Image key={index} src={avatar} alt="Avatar Option" width={50} height={50} className={selectedAvatar === avatar ? styles.selectedAvatar : styles.avatarOption} onClick={() => handleAvatarChange(avatar)} />
            ))}
            <button onClick={handleUpdateProfile} className={styles.button}>Change Avatar</button>
          </div>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Name:</strong> {user.first_name} {user.last_name}</p>
          <p><strong>Age:</strong> {user.age}</p>
          <p><strong>Address:</strong> {user.address}</p>
          <p><strong>Sex:</strong> {user.sexe}</p>
          <p><strong>Role:</strong> {user.role}</p>
          <p><strong>Account Created:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
          <button onClick={() => setView("update")} className={styles.button}>Update Profile</button>
          <button onClick={() => setView("changePassword")} className={styles.button}>Change Password</button>
          <button onClick={handleDeleteAccount} className={`${styles.button} ${styles.deleteButton}`}>Delete Account</button>
        </>
      )}

      {view === "update" && (
        <>
          <h2>Update Profile</h2>
          <label>Username:</label>
          <input type="text" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} />
          <label>First Name:</label>
          <input type="text" value={formData.first_name} onChange={(e) => setFormData({ ...formData, first_name: e.target.value })} />
          <label>Last Name:</label>
          <input type="text" value={formData.last_name} onChange={(e) => setFormData({ ...formData, last_name: e.target.value })} />
          <label>Age:</label>
          <input type="number" value={formData.age} onChange={(e) => setFormData({ ...formData, age: e.target.value })} />
          <label>Address:</label>
          <input type="text" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
          <button onClick={handleUpdateProfile}>Save</button>
          <button onClick={() => setView("profile")}>Cancel</button>
        </>
      )}

      {view === "changePassword" && (
        <>
          <h2>Change Password</h2>
          <label>Current Password:</label>
          <input type="password" value={passwords.currentPassword} onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })} />
          <label>New Password:</label>
          <input type="password" value={passwords.newPassword} onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })} />
          <label>Confirm New Password:</label>
          <input type="password" value={passwords.confirmPassword} onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })} />
          <button onClick={handleChangePassword}>Update Password</button>
          <button onClick={() => setView("profile")}>Cancel</button>
        </>
      )}
    </div>
  );
};

export default ProfilePage;
