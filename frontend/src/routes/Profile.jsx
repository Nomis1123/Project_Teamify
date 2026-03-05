import React from 'react'
import { useEffect, useState } from "react";
import "./Profile.css";
import { useNavigate } from "react-router-dom";
import "../components/GameScheduleBar.css"
import GameScheduleBar from "../components/GameScheduleBar";
import GamePicker from "../components/GamePicker";

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
        id: "",
        steam_id: "",
        username: "",
        email: "",
        description: "",
        profileImageUrl: "",
        // games: [['lol1', 'src/gameImages/lol.webp', 'gold', 'Support'],
        //         ['lol2', 'src/gameImages/lol.webp', 'iron', 'top'],
        //         ['lol3', 'src/gameImages/lol.webp', 'silver', 'some role'],
        //         ['lol4', 'src/gameImages/lol.webp', 'diamond', 'some role2'],
        //         ['lol5', 'src/gameImages/lol.webp', 'master']],
        games: [],
        schedule: defaultWeeklySchedule,
    });
    const [loading, setLoading] = useState(true);
    // const [error, setError] = useState("");

    useEffect(() => {
        const loadMe = async () => {
            try {
                setLoading(true);
                // console.log(localStorage.getItem("access_token"))

                const res = await fetch("/api/user/me", {
                    method: "GET",
                    // If your backend uses cookies/sessions, uncomment:
                    // credentials: "include",
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("access_token")}` },
                });
                // console.log("fetch returned:", res.status, res.url);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = await res.json();
                // console.log("response data:", data);
                const normalized = {
                    id: data.user.id ?? "",
                    steam_id: data.user.steam_id ?? "",
                    username: data.user.username ?? "",
                    email: data.user.email ?? "",
                    description: data.user.description ?? "",
                    profile_picture: data.user.profile_picture ?? "",
                    games: Array.isArray(data.user.games) ? data.games : [],
                    schedule: days.reduce((acc, day) => {
                        // console.log("schedule:", day, data.schedule[day]);
                        const d = data.user.schedule?.[day] ?? defaultDailySchedule;
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

    async function sendToken() {
        try {
            const res = await fetch("/api/auth/steamlogin", {
                method: "GET",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("access_token")}` },
            });
            if (!res.ok) {
                // backend might return JSON error { message: "..." }
                let msg = "";
                try {
                    const data = await res.json();
                    console.log(data);
                if (data?.status) msg = data.status;
                    console.log(msg);
                } catch {}
                throw new Error(msg);
            }
            const data = await res.json();

            if (data.redirect_url) {
                window.location.href = data.redirect_url;
            }
            // console.log("Token sent successfully");
        } catch (e) {
            console.log(e);
        }
    };

    return (
    <div className="profile-page">
        <div className="profile-card profile-layout">
            
            <div className="profile-info-layout">
                <img
                    className="profile-image"
                    // This image link is temporary. Replace it when we figure out a default profile image.
                    src={user.profile_picture || "https://th.bing.com/th/id/OIP.BXIufrwgTFhg49ux6NTkiQHaQD?w=236"}
                    alt="Profile"
                />

                <div className='username'>
                    <h1>
                        {loading ? "Loading..." : user.username || "Unknown User"}
                    </h1>
                    <p>
                        User ID: {user.id ? user.id : "-"}
                        </p>
                    <p>
                        Email: {user.email ? user.email : "-"}
                    </p>
                    {user?.steam_id && <p>Linked to steam</p>}
                </div>
                <div className='profile-button-container'>
                    <button className="profile-btn" onClick={() => navigate("/profile_editing")}>
                        Edit Profile
                    </button>
                    {!user?.steam_id && 
                        <button className="profile-btn" onClick={ () => sendToken() }>
                            Link Steam
                        </button>
                    }
                    
                </div>
                
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
                        {user.games.length === 0 && 
                            <div className='profile-section' style={{gap: 10}}>
                                <h2>You haven't select a game yet! Add more games here:</h2>
                                <button className="profile-btn btn-auto-height" onClick={() => navigate("/profile_editing")}>
                                    Edit Profile
                                </button> 
                            </div>
                        }
                        {user.games.length >= 1 && 
                            <div className='profile-game-image-text-container'>
                                <img className="profile-game-image" src={user.games[0][1]} alt={user.games[0][0]} />
                                <span>{user.games[0][0]}</span>
                                {user.games[0].length >= 3 && <span>Rank: {user.games[0][2]}</span>}
                                {user.games[0].length >= 4 && <span>Role: {user.games[0][3]}</span>}
                            </div>
                        }
                        {user.games.length >= 2 && 
                            <div className='profile-game-image-text-container'>
                                <img className="profile-game-image" src={user.games[1][1]} alt={user.games[1][0]} />
                                <span>{user.games[1][0]}</span>
                                {user.games[1].length >= 3 && <span>Rank: {user.games[1][2]}</span>}
                                {user.games[1].length >= 4 && <span>Role: {user.games[1][3]}</span>}
                            </div>
                        }
                        {user.games.length >= 3 && 
                            <div className='profile-game-image-text-container'>
                                <img className="profile-game-image" src={user.games[2][1]} alt={user.games[2][0]} />
                                <span>{user.games[2][0]}</span>
                                {user.games[2].length >= 3 && <span>Rank: {user.games[2][2]}</span>}
                                {user.games[2].length >= 4 && <span>Role: {user.games[2][3]}</span>}
                            </div>
                        }
                        {user.games.length >= 4 && 
                            <div className='profile-game-image-text-container'>
                                <img className="profile-game-image" src={user.games[3][1]} alt={user.games[3][0]} />
                                <span>{user.games[3][0]}</span>
                                {user.games[3].length >= 3 && <span>Rank: {user.games[3][2]}</span>}
                                {user.games[3].length >= 4 && <span>Role: {user.games[3][3]}</span>}
                            </div>
                        }
                        {user.games.length === 5 && 
                            <div className='profile-game-image-text-container'>
                                <img className="profile-game-image" src={user.games[4][1]} alt={user.games[4][0]} />
                                <span>{user.games[4][0]}</span>
                                {user.games[4].length >= 3 && <span>Rank: {user.games[4][2]}</span>}
                                {user.games[4].length >= 4 && <span>Role: {user.games[4][3]}</span>}
                            </div>
                        }
                    </div>
                </div>
            
                <h2>Game Schedule:</h2>
                <div className='profile-game-schedule'>
                    <GameScheduleBar 
                    schedule={user.schedule} 
                    onClick={() => {}}
                    />
                </div>
            </div>
            
      </div>
    </div>
  );
};

export default Profile;
