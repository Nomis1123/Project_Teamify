import React from 'react'
import { useEffect, useState } from "react";
import "./Chat.css";
import { useNavigate } from "react-router-dom";
import ChatFriendsList from "../components/ChatFriendsList"

const Chat = ({ target = null }) => {
    const [friends_list, setFriendsList] = useState([
        {username: "Man!", userid: 12, pfp_url: "https://motionbgs.com/media/474/arknights.jpg"},
        {username: "Doggggggggggggg", userid: 111111111111111111, pfp_url: "https://image.petmd.com/files/styles/863x625/public/2022-10/beagle-dog.jpg"},
        {username: "Dog", userid: 1, pfp_url: "https://image.petmd.com/files/styles/863x625/public/2022-10/beagle-dog.jpg"},
        {username: "Dog", userid: 2, pfp_url: "https://image.petmd.com/files/styles/863x625/public/2022-10/beagle-dog.jpg"},
        {username: "Dog", userid: 3, pfp_url: "https://image.petmd.com/files/styles/863x625/public/2022-10/beagle-dog.jpg"},
        {username: "Dog", userid: 4, pfp_url: "https://image.petmd.com/files/styles/863x625/public/2022-10/beagle-dog.jpg"},
        {username: "Dog", userid: 5, pfp_url: "https://image.petmd.com/files/styles/863x625/public/2022-10/beagle-dog.jpg"},
        {username: "Dog", userid: 6, pfp_url: "https://image.petmd.com/files/styles/863x625/public/2022-10/beagle-dog.jpg"},
        {username: "Dog", userid: 7, pfp_url: "https://image.petmd.com/files/styles/863x625/public/2022-10/beagle-dog.jpg"},
        {username: "Dog", userid: 8, pfp_url: "https://image.petmd.com/files/styles/863x625/public/2022-10/beagle-dog.jpg"},
        {username: "Dog", userid: 9, pfp_url: "https://image.petmd.com/files/styles/863x625/public/2022-10/beagle-dog.jpg"},
    ]);
    const [conversation_id , setConversationID] = useState(null);
    const [loading_fl, setLoadingFL] = useState(false);
    const [loading_ch, setLoadingCH] = useState(false);
    const [currTarget, setCurrTarget] = useState(target);

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

                const res = await fetch("/api/conversations", {
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
    }, [currTarget]);

    useEffect(() => {
        console.log("Changed the chatting target to ", currTarget);
    }, [currTarget]);

    return (
    <div className="chat-page">
        <div className='chat-window'>
            {currTarget ? <span>Chat with user {currTarget}</span> : <span>Select a friend to start a chat</span>}
        </div>
        <div className='chat-friend-list'>
            <ChatFriendsList friends_list={friends_list} target={currTarget} targetModifier={setCurrTarget}/>
        </div>
 
    </div>
  );
};

export default Chat;