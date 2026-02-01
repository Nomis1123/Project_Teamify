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
                Games:
                <div className="profile-game-bar">
                    <div className='profile-game-image-text-container'>
                        <img
                            className="profile-game-image"
                            src="https://png.pngtree.com/thumb_back/fw800/background/20231008/pngtree-white-low-poly-wall-texture-background-3d-rendered-abstract-design-image_13582488.png"
                            alt="Profile"
                        />
                        Game 1
                    </div>
                    <div className='profile-game-image-text-container'>
                        <img
                            className="profile-game-image"
                            src="https://png.pngtree.com/thumb_back/fw800/background/20231008/pngtree-white-low-poly-wall-texture-background-3d-rendered-abstract-design-image_13582488.png"
                            alt="Profile"
                        />
                        Game 2
                    </div>
                    <div className='profile-game-image-text-container'>
                        <img
                            className="profile-game-image"
                            src="https://png.pngtree.com/thumb_back/fw800/background/20231008/pngtree-white-low-poly-wall-texture-background-3d-rendered-abstract-design-image_13582488.png"
                            alt="Profile"
                        />
                        Game 3
                    </div>
                    <div className='profile-game-image-text-container'>
                        <img
                            className="profile-game-image"
                            src="https://png.pngtree.com/thumb_back/fw800/background/20231008/pngtree-white-low-poly-wall-texture-background-3d-rendered-abstract-design-image_13582488.png"
                            alt="Profile"
                        />
                        Game 4
                    </div>
                    <div className='profile-game-image-text-container'>
                        <img
                            className="profile-game-image"
                            src="https://png.pngtree.com/thumb_back/fw800/background/20231008/pngtree-white-low-poly-wall-texture-background-3d-rendered-abstract-design-image_13582488.png"
                            alt="Profile"
                        />
                        Game 5
                    </div>
                    <div className='profile-game-image-text-container'>
                        <img
                            className="profile-game-image"
                            src="https://png.pngtree.com/thumb_back/fw800/background/20231008/pngtree-white-low-poly-wall-texture-background-3d-rendered-abstract-design-image_13582488.png"
                            alt="Profile"
                        />
                        Game 6
                    </div>
                    <div className='profile-game-image-text-container'>
                        <img
                            className="profile-game-image"
                            src="https://png.pngtree.com/thumb_back/fw800/background/20231008/pngtree-white-low-poly-wall-texture-background-3d-rendered-abstract-design-image_13582488.png"
                            alt="Profile"
                        />
                        Game 7
                    </div>
                </div>
                Game schedule:
                <div className='profile-game-schedule'>

                </div>
            </div>
            
      </div>
    </div>
  );
};

export default Profile;