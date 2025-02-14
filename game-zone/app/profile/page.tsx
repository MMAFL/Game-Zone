'use client';
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
// import styles from "../styles/Profile.module.css";

const avatars = [
  "/avatars/avatar1.png",
  "/avatars/avatar2.png",
  "/avatars/avatar3.png",
  "/avatars/avatar4.png",
];

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [selectedAvatar, setSelectedAvatar] = useState("/avatars/avatar1.png");
  const [imageFile, setImageFile] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch("/api/user");
      const data = await res.json();
      setUser(data);
      setSelectedAvatar(data.avatar || "/avatars/avatar1.png");
    };
    fetchUser();
  }, []);

  const handleAvatarChange = (avatar) => {
    setSelectedAvatar(avatar);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "your_upload_preset");

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/doxjp0kvo/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      setSelectedAvatar(data.secure_url);
    } catch (error) {
      console.error("Error uploading image", error);
    }
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
        await fetch("/api/user", { method: "DELETE" });
        router.push("/login");
      }
    });
  };

  const handleUpdateProfile = async () => {
    await fetch("/api/user", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ avatar: selectedAvatar }),
    });
  };

  return (
    <div className={styles.profileContainer}>
      {user && (
        <>
          <div className={styles.avatarContainer}>
            <Image
              src={selectedAvatar}
              alt="Avatar"
              width={100}
              height={100}
              className={styles.avatar}
            />
          </div>
          <h2>{user.username}</h2>
          <p>{user.first_name} {user.last_name}</p>
          <div className={styles.avatarSelection}>
            {avatars.map((avatar, index) => (
              <Image
                key={index}
                src={avatar}
                alt="Avatar Option"
                width={50}
                height={50}
                className={
                  selectedAvatar === avatar ? styles.selectedAvatar : styles.avatarOption
                }
                onClick={() => handleAvatarChange(avatar)}
              />
            ))}
            <input type="file" onChange={handleImageUpload} />
          </div>
          <button onClick={handleUpdateProfile} className={styles.updateButton}>
            Update Profile
          </button>
          <button onClick={handleDeleteAccount} className={styles.deleteButton}>
            Delete Account
          </button>
          <button onClick={() => router.push("/change-password")} className={styles.passwordButton}>
            Change Password
          </button>
        </>
      )}
    </div>
  );
};

export default ProfilePage;
