import React from 'react'
import { useEffect, useState } from "react";
import "./Profile.css";
import { useNavigate } from "react-router-dom";


const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);     // { id, username }
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadMe = async () => {
            try {
                setLoading(true);
                setError("");

                const res = await fetch("/api/me", {
                    method: "GET",
                    // If your backend uses cookies/sessions, uncomment:
                    // credentials: "include",
                    headers: { "Content-Type": "application/json" },
                });

                if (!res.ok) throw new Error(`HTTP ${res.status}`);

                const data = await res.json();
                setUser(data);
            } catch (e) {
                setError("Failed to load profile info.");
            } finally {
                setLoading(false);
            }
        };

        loadMe();
    }, []);

    return (
    <div className="profile-page">
        <div className="profile-card profile-layout">
            
            <div className="profile-info-layout">
                <img
                    className="profile-image"
                    src="https://th.bing.com/th/id/OIP.BXIufrwgTFhg49ux6NTkiQHaQD?w=236"
                    alt="Profile"
                />

                <div className='username'>
                    {loading ? (
                        <>
                            <h1>Loading...</h1>
                            <p> </p>
                        </>
                    ) : error ? (
                        <>
                            <h1>Error</h1>
                            <p>{error}</p>
                        </>
                    ) : (
                        <>
                            <h1>{user.username}</h1>
                            <p>User ID: {user.id}</p>
                        </>
                    )}
                </div>
                
                <button className="profile-edit-btn" onClick={() => navigate("/profile_editing")}>
                    Edit Profile
                </button>
            </div>
            
            <div className='profile-scroll'>
                Description:
                <div className="profile-description">
                    <p>
                        {!user?.description?.trim()
                        ? "You have not set a description yet."
                        : user.description}
                    </p>
                </div>

                <div className="profile-game-bar">
                    User games here!
                </div>
            </div>
            
      </div>
    </div>
  );
};

export default Profile;