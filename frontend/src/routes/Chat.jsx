import React from 'react'
import { useEffect, useState } from "react";
import "./Chat.css";
import { useNavigate } from "react-router-dom";

const Chat = ({ target = null }) => {
    const [friends_list, setFriendsList] = useState([]);
    const [conversation_id , setConversationID] = useState(null);
    const [loading_fl, setLoadingFL] = useState(false);
    const [loading_ch, setLoadingCH] = useState(false);

    useEffect(() => {
        const loadMe = async () => {
            try {
                setLoadingFL(true);

                const res = await fetch("???", {
                    method: "GET",
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("access_token")}` },
                });
                // console.log("fetch returned:", res.status, res.url);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = await res.json();
                // console.log("response data:", data);
                setFriendsList(data.friends_list);
            } catch (e) {
                console.log("error:", e);
            } finally {
                setLoadingFL(false);
            }
        };
        loadMe();
    }, []);

    useEffect(() => {
        console.log("User's friends list:", friends_list);
    }, [friends_list]);

    useEffect(() => {
        const loadMe = async () => {
            try {
                setLoadingCH(true);

                const res = await fetch("api/conversations", {
                    method: "POST",
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("access_token")}` },
                    body: {target_id: target},
                });
                // console.log("fetch returned:", res.status, res.url);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = await res.json();
                // console.log("response data:", data);
                setConversationID(data.conversation_id);
            } catch (e) {
                console.log("error:", e);
            } finally {
                setLoadingCH(false);
            }
        };
        loadMe();
    }, [target]);

    return (
    <div className="chat-page">
        <div className='chat-window'>
            {target ? <span>Chat with user {target}</span> : <span>Select a friend to start a chat</span>}
        </div>
        <div className='chat-friend-list'>
            {/* Put friend list here */}
        </div>
 
    </div>
  );
};

export default Chat;