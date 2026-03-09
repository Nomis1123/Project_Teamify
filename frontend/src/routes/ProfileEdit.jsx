import React from 'react'
import { useEffect, useState } from "react";
import "./ProfileEdit.css";
import { useNavigate } from "react-router-dom";
import "../components/GameScheduleBar.css";
import "../components/PopupStarter.css";
import GameScheduleBar from "../components/GameScheduleBar";
import PUUsername from '../components/PopupUsername';
import PUEmail from '../components/PopupEmail';
import PUPassword from '../components/PopupPassword';
import PUDescription from '../components/PopupDescription';
import PUGame from '../components/PopupGame';
import PUSchedule from '../components/PopupSchedule';
import PUGRR from '../components/PopupGRR';

const ProfileEdit = () => {
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
        username: "",
        email: "",
        description: "",
        profileImageUrl: "",
        games: [],
        schedule: defaultWeeklySchedule,
    });
    const [username, setUsername] = useState("");
    const [id, setID] = useState("");
    const [email, setEmail] = useState("");
    const [description, setDescription] = useState("");
    const [schedule, setSchedule] = useState(defaultWeeklySchedule);
    // const [games, setGame] = useState([{'title': 'minecraft', 'url': 'src/gameImages/minecraft.webp'},
    //     {'title': 'lol', 'url': 'src/gameImages/lol.webp', 'rank': 'Gold', 'role': 'Top'},
    // ]);
    const [games, setGame] = useState([]);
    const [loading, setLoading] = useState(true);
    // const [error, setError] = useState("");

    useEffect(() => {
        const loadMe = async () => {
            try {
                setLoading(true);
                
                // This is for testing only
                // setUsername("TestUser");
                // setDescription("TestDesc");

                const res = await fetch("/api/user/me", {
                    method: "GET",
                    // If backend uses cookies/sessions, uncomment:
                    // credentials: "include",
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("access_token")}` },
                });
                // console.log("fetch returned:", res.status, res.url);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = await res.json();
                // console.log("response data:", data);
                const normalized = {
                    id: data.user.id ?? "",
                    username: data.user.username ?? "",
                    email: data.user.email ?? "",
                    description: data.user.description ?? "",
                    profile_picture: data.user.profile_picture ?? "",
                    games: Array.isArray(data.games) ? data.user.games : [],
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

                setUsername(normalized.username);
                setID(normalized.id);
                setEmail(normalized.email);
                setDescription(normalized.description);
                setSchedule(normalized.schedule);
                setGame(normalized.games);
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
                    src={user.profile_picture || "https://th.bing.com/th/id/OIP.BXIufrwgTFhg49ux6NTkiQHaQD?w=236"}
                    alt="Profile"
                />

                <div className='username'>
                    <h1>
                        {loading ? "Loading..." : username || "Unknown User"}
                    </h1>
                    <p>
                        User ID: {id ? id : "-"}
                    </p>
                    <p>
                        Email: {email ? email : "-"}
                    </p>
                </div>
                
                <button className="profile-return-btn" onClick={() => navigate("/profile")}>
                    Return to Profile
                </button>
            </div>
            
            <div className='profile-scroll'>
                <div>
                    <PUUsername username={username} usernameModifier={setUsername}/>
                </div>
                <div>
                    <PUEmail email={email} emailModifier={setEmail}/>
                </div>
                <div>
                    <PUPassword />
                </div>
                <div className='profile-section'>
                    <h2 className='profile-text-right'>Description:</h2>
                    <div>
                        <PUDescription description={description} descriptionModifier={setDescription}/>
                    </div>
                </div>
                <div className="profile-description">
                    <p>
                        {description ? description : "You have not set a description yet."}
                    </p>
                </div>

                <div className='profile-section'>
                    <h2 className='profile-text-right'>Games:</h2>
                </div>
                <div className='profile-game-section'>
                    <div className="profile-game-bar">
                        {/* The image sources are temporary. Replace with game icons and name after.
                            I still have to modify this so that it accept game image and name from db. */}

                        {games.length >= 1 && 
                            <div className='profile-game-image-text-container'>
                                <PUGame games={games} gameModifier={setGame} which={0} isAdding={false}/>
                                <PUGRR games={games} gameModifier={setGame} which={0}/>
                            </div>
                        }
                        {games.length >= 2 && 
                            <div className='profile-game-image-text-container'>
                                <PUGame games={games} gameModifier={setGame} which={1} isAdding={false}/>
                                <PUGRR games={games} gameModifier={setGame} which={1}/>
                            </div>
                        }
                        {games.length >= 3 && 
                            <div className='profile-game-image-text-container'>
                                <PUGame games={games} gameModifier={setGame} which={2} isAdding={false}/>
                                <PUGRR games={games} gameModifier={setGame} which={2}/>
                            </div>
                        }
                        {games.length >= 4 && 
                            <div className='profile-game-image-text-container'>
                                <PUGame games={games} gameModifier={setGame} which={3} isAdding={false}/>
                                <PUGRR games={games} gameModifier={setGame} which={3}/>
                            </div>
                        }
                        {games.length === 5 && 
                            <div className='profile-game-image-text-container'>
                                <PUGame games={games} gameModifier={setGame} which={4} isAdding={false}/>
                                <PUGRR games={games} gameModifier={setGame} which={4}/>
                            </div>
                        }

                        {games.length < 5 && 
                            <div>
                                <PUGame games={games} gameModifier={setGame} which={null} isAdding={true}/>
                            </div>
                        }
                    </div>
                </div>

                <div className='profile-section'>
                    <h2 className='profile-text-right'>Game Schedule:</h2>
                    <PUSchedule schedule={schedule} scheduleModifier={setSchedule}/>
                </div>
                
                <div className='profile-game-schedule'>
                    <GameScheduleBar 
                    schedule={schedule} 
                    onClick={() => {}}
                    />
                </div>
            </div>
            
      </div>
    </div>
  );
};

export default ProfileEdit;