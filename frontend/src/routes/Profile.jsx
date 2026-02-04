import React from 'react'
import { useEffect, useState } from "react";
import "./Profile.css";
import { useNavigate } from "react-router-dom";
import "../components/GameScheduleBar.css"
import GameScheduleBar from "../components/GameScheduleBar";


const Profile = () => {
    const navigate = useNavigate();
    const days = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
    const defaultDailySchedule = { morning: false, afternoon: false, night: false };
    const defaultWeeklySchedule = {
            Monday: { ...defaultDailySchedule },
            Tuesday: { ...defaultDailySchedule },
            Wednesday: { ...defaultDailySchedule },
            Thursday: { ...defaultDailySchedule },
            Friday: { ...defaultDailySchedule },
            Saturday: { ...defaultDailySchedule },
            Sunday: { ...defaultDailySchedule },
    };
    const [user, setUser] = useState({
        id: "abc",
        username: "",
        email: "",
        description: "",
        profileImageUrl: "",
        games: [],
        schedule: defaultWeeklySchedule,
    });
    const [loading, setLoading] = useState(true);
    // const [error, setError] = useState("");

    useEffect(() => {
        const loadMe = async () => {
            try {
                setLoading(true);

                const res = await fetch("http://localhost:8000/api/user/me", {
                    method: "GET",
                    // If your backend uses cookies/sessions, uncomment:
                    // credentials: "include",
                    headers: { "Content-Type": "application/json" },
                });
                // console.log("fetch returned:", res.status, res.url);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = await res.json();
                // console.log("response data:", data);
                const normalized = {
                    id: data.id ?? "",
                    username: data.username ?? "",
                    email: data.email ?? "",
                    profileImageUrl: data.profileImageUrl ?? "",
                    games: Array.isArray(data.games) ? data.games : [],
                    schedule: days.reduce((acc, day) => {
                        // console.log("schedule:", day, data.schedule[day]);
                        const d = data.schedule?.[day] ?? defaultDailySchedule;
                        acc[day] = {
                            morning: Boolean(d.morning),
                            afternoon: Boolean(d.afternoon),
                            night: Boolean(d.night),
                        };
                        return acc;
                    }, {}),
                };
                console.log("setting user to:", normalized);
                setUser(normalized);
            } catch (e) {
                console.log("error:", e);
            } finally {
                setLoading(false);
            }
        };

        loadMe();
    }, []);

    useEffect(() => {
        console.log("user state updated:", user.id);
    }, [user]);
    // Test:
    // useEffect(() => {
    //     setUser({
    //         uid: "user123",
    //         username: "TestUser",
    //         email: "testingemail@123.com"
    //         description: "Hello I am a new user",
    //         profileImageUrl: "",
    //         games: [],
    //         schedule: {
    //         Monday: { morning: true, afternoon: false, night: true },
    //         Tuesday: { morning: false, afternoon: false, night: false },
    //         Wednesday: { morning: false, afternoon: true, night: false },
    //         Thursday: { morning: true, afternoon: true, night: true },
    //         Friday: { morning: false, afternoon: true, night: true },
    //         Saturday: { morning: true, afternoon: false, night: false },
    //         Sunday: { morning: false, afternoon: false, night: true },
    //         },
    //     });
    // }, []);

    return (
    <div className="profile-page">
        <div className="profile-card profile-layout">
            
            <div className="profile-info-layout">
                <img
                    className="profile-image"
                    // This image link is temporary. Replace it when we figure out a default profile image.
                    src={user.profileImageUrl || "https://th.bing.com/th/id/OIP.BXIufrwgTFhg49ux6NTkiQHaQD?w=236"}
                    alt="Profile"
                />

                <div className='username'>
                    <h1>{loading ? "Loading..." : user.username || "Unknown User"}</h1>
                    <p>User ID: {user.id || "-"}</p>
                </div>
                
                <button className="profile-edit-btn" onClick={() => navigate("/profile_editing")}>
                    Edit Profile
                </button>
            </div>
            
            <div className='profile-scroll'>
                <h2>Description:</h2>
                <div className="profile-description">
                    <p>
                        {!user?.description?.trim()
                        ? "You have not set a description yet."
                        : user.description}
                    </p>
                </div>

                <h2>Games:</h2>
                <div className='profile-game-section'>
                    <div className="profile-game-bar">
                        {/* The image sources are temporary. Replace with game icons and name after.
                            I still have to modify this so that it accept game image and name from db. */}
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
                </div>
            
                <h2>Game Schedule:</h2>
                <div className='profile-game-schedule'>
                    <GameScheduleBar schedule={user.schedule} />
                </div>
            </div>
            
      </div>
    </div>
  );
};

export default Profile;