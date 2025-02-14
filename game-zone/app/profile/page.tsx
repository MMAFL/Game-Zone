"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { Eye, EyeOff } from "lucide-react";
import styles from '../style/Profile.module.css';

const avatars = [
  "/images/p2.avif",
  "/images/p3.avif",
  "/images/p4.webp",
  "/images/p5.jpeg",
  "/images/p6.webp",
  "/images/p7.avif",
  "/images/p8.avif",
  "/images/p9.avif",
  "/images/p10.avif",
  "/images/p11.jpg",
  "/images/p12.jpeg",
  "/images/p12.jpg",
 
  
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
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
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
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#9333ea",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await fetch("/api/users", { method: "DELETE" });
        router.push("/login");
      }
    });
  };

  if (!user) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
      </div>
    );
  }

  return (
    <div className={styles.profileContainer}>
      

      {view === "profile" && user && (
        <>
          <div className={styles.profileHeader}>
            <div className={styles.avatarContainer}>
              <Image 
                src={selectedAvatar} 
                alt="Avatar" 
                width={120} 
                height={120} 
                className={styles.avatar}
              />
            </div>
            <div className={styles.userHeaderInfo}>
              <h2 className={styles.username}>{user.username}</h2>
            </div>
          </div>

          <div className={styles.avatarSelection}>
            {avatars.map((avatar, index) => (
              <Image
                key={index}
                src={avatar}
                alt="Avatar Option"
                width={50}
                height={50}
                className={`${styles.avatarOption} ${selectedAvatar === avatar ? styles.selectedAvatar : ''}`}
                onClick={() => handleAvatarChange(avatar)}
              />
            ))}
          </div>

          <div className={styles.userInfo}>
            <p><strong>First Name:</strong> {user.first_name}</p>
            <p><strong>Last Name:</strong> {user.last_name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Address:</strong> {user.address}</p>
            <p><strong>Role:</strong> {user.role}</p>
            <p><strong>Score:</strong> {user.age}</p>
          </div>

          <div className={styles.buttonContainer}>
            <button onClick={() => setView("update")} className={styles.button}>Update Profile</button>
            <button onClick={() => setView("changePassword")} className={styles.button}>Change Password</button>
            <button onClick={handleDeleteAccount} className={`${styles.button} ${styles.deleteButton}`}>Delete Account</button>
          </div>
        </>
      )}

      {view === "update" && (
        <div className={styles.formContainer}>
          <h2>Update Profile</h2>
          <div className={styles.formGroup}>
            <label>Username:</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            />
          </div>
          <div className={styles.formGroup}>
            <label>First Name:</label>
            <input
              type="text"
              value={formData.first_name}
              onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Last Name:</label>
            <input
              type="text"
              value={formData.last_name}
              onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Score:</label>
            <input
              type="number"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Address:</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>
          <div className={styles.buttonContainer}>
            <button onClick={handleUpdateProfile} className={styles.button}>Save</button>
            <button onClick={() => setView("profile")} className={styles.button}>Cancel</button>
          </div>
        </div>
      )}

      {view === "changePassword" && (
        <div className={styles.formContainer}>
          <h2>Change Password</h2>
          <div className={styles.formGroup}>
            <label>Current Password:</label>
            <div className={styles.passwordInputContainer}>
              <input
                type={showPasswords.current ? "text" : "password"}
                value={passwords.currentPassword}
                onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
              >
                {showPasswords.current ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <div className={styles.formGroup}>
            <label>New Password:</label>
            <div className={styles.passwordInputContainer}>
              <input
                type={showPasswords.new ? "text" : "password"}
                value={passwords.newPassword}
                onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
              >
                {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <div className={styles.formGroup}>
            <label>Confirm New Password:</label>
            <div className={styles.passwordInputContainer}>
              <input
                type={showPasswords.confirm ? "text" : "password"}
                value={passwords.confirmPassword}
                onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
              >
                {showPasswords.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <div className={styles.buttonContainer}>
            <button onClick={handleChangePassword} className={styles.button}>Update Password</button>
            <button onClick={() => setView("profile")} className={styles.button}>Cancel</button>
          </div>
        </div>
      )}
      <div className={styles.header}>
        <button onClick={() => router.push("/")} className={styles.returnButton}>
          Return to Home
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;