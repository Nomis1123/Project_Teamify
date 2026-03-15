import React from 'react'
import { useEffect, useState } from "react";
import "./Chat.css";
import { useNavigate } from "react-router-dom";

const ProfileEdit = () => {
    const [user, setUser] = useState({
        id: "",
        username: "",
        description: "",
        profileImageUrl: "",
        games: [],
    });
    const [username, setUsername] = useState("");
    const [id, setID] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadMe = async () => {
            try {
                setLoading(true);

                const res = await fetch("/api/user/me", {
                    method: "GET",
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
                };
                console.log("setting user to:", normalized);
                setUser(normalized);

                setUsername(normalized.username);
                setID(normalized.id);
                setEmail(normalized.email);
                setDescription(normalized.description);
                setImage(normalized.profile_picture);
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

    return (
    <div className="chat-page">
        <div className='chat-window'>
            {/* Put chat window here */}
        </div>
        <div className='chat-friend-list'>
            {/* Put friend list here */}
        </div>
 
    </div>
  );
};

export default ProfileEdit;