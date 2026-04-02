import React from 'react'
import { useEffect, useState } from "react";
import "./Profile.css";
import { useNavigate } from "react-router-dom";
import "../components/GameScheduleBar.css"
import GameScheduleBar from "../components/GameScheduleBar";
import useRequireAuth from "../components/RequireAuth.jsx";

const Profile = () => {
    useRequireAuth();
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
        games: [],
        schedule: defaultWeeklySchedule,
    });
    const [loading, setLoading] = useState(true);

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
                    profile_picture: data.user.pfp_url ?? "",
                    games: Array.isArray(data.user.owned_games) ? data.user.owned_games : [],
                    schedule: days.reduce((acc, day) => {
                        // console.log("schedule:", day, data.schedule[day]);
                        const d = data.user.availability?.[day] ?? defaultDailySchedule;
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
                            user.games.map((game, index) => (
                                <div className='profile-game-image-text-container' key={index}>
                                    <img className='profile-game-image' src={game.thumbnail_url? game.thumbnail_url : "http://138.197.132.126:8000/uploads/default_game_card.png"} alt={game.title} />
                                    <div className='profile-game-text'>{game.title}</div>
                                    {game.current_rank && <span>Rank: {game.current_rank}</span>}
                                    {game.curr_role && <span>Role: {game.curr_role}</span>}
                                </div>
                            )
                        )}
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
