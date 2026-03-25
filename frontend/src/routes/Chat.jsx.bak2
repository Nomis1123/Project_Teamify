import React from 'react'
import { useEffect, useState, useRef } from "react";
import "./Chat.css";
import { useNavigate } from "react-router-dom";
import ChatFriendsList from "../components/ChatFriendsList"
import ChatWindow from '../components/ChatWindow';

// 1. Import Socket.IO client
import { io } from "socket.io-client";

const Chat = ({ target = null }) => {
    // [Keeping your initial dummy data for friends_list and messages...]
    const [friends_list, setFriendsList] = useState([
        {username: "Man!", userid: 12, pfp_url: "https://motionbgs.com/media/474/arknights.jpg", conversation_id: null, unread: ""},
        {username: "Doggggggggggggg", userid: 111111111111111111, pfp_url: "https://image.petmd.com/files/styles/863x625/public/2022-10/beagle-dog.jpg", conversation_id: null, unread: ""},
        {username: "Dog", userid: 1, pfp_url: "https://image.petmd.com/files/styles/863x625/public/2022-10/beagle-dog.jpg", conversation_id: null, unread: ""},
        // ... truncated for brevity, assume the rest of your mock data is here ...
        {username: "Dog", userid: 2, pfp_url: "https://image.petmd.com/files/styles/863x625/public/2022-10/beagle-dog.jpg", conversation_id: null, unread: "You have unread messages"},
        {username: "Dog", userid: 3, pfp_url: "https://image.petmd.com/files/styles/863x625/public/2022-10/beagle-dog.jpg", conversation_id: null, unread: ""},
        {username: "Dog", userid: 4, pfp_url: "https://image.petmd.com/files/styles/863x625/public/2022-10/beagle-dog.jpg", conversation_id: null, unread: ""},
        {username: "Dog", userid: 5, pfp_url: "https://image.petmd.com/files/styles/863x625/public/2022-10/beagle-dog.jpg", conversation_id: null, unread: ""},
        {username: "Dog", userid: 6, pfp_url: "https://image.petmd.com/files/styles/863x625/public/2022-10/beagle-dog.jpg", conversation_id: null, unread: ""},
        {username: "Dog", userid: 7, pfp_url: "https://image.petmd.com/files/styles/863x625/public/2022-10/beagle-dog.jpg", conversation_id: null, unread: ""},
        {username: "Dog", userid: 8, pfp_url: "https://image.petmd.com/files/styles/863x625/public/2022-10/beagle-dog.jpg", conversation_id: null, unread: ""},
        {username: "Dog", userid: 9, pfp_url: "https://image.petmd.com/files/styles/863x625/public/2022-10/beagle-dog.jpg", conversation_id: null, unread: ""},
    ]);
    const [conversation_id , setConversationID] = useState(null);
    const [messages, setMessages] = useState([]);
    
    const [loading_fl, setLoadingFL] = useState(false);
    const [loading_ch, setLoadingCH] = useState(false);
    const [connected, setConnected] = useState(false);
    const [currTarget, setCurrTarget] = useState(target);
    const [user, setUser] = useState({
        id: 12,
        username: "Man!",
        pfp_url: "https://motionbgs.com/media/474/arknights.jpg",
    });
    
    const socketRef = useRef(null);

    // Get the user's friend list, info and build live chat
    useEffect(() => {
        const loadMe = async () => {
            try {
                setLoadingFL(true);

                // Get the user's friends list
                let res = await fetch("???", {  // Changed to 'let' to allow reassignment below
                    method: "GET",
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("access_token")}` },
                });
                
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                let data = await res.json();
                const normalized_friends = data.friends_list.map((friend) => ({
                    id: friend.id ?? "",
                    username: friend.username ?? "",
                    profile_picture: friend.profile_picture ?? "",
                    conversation_id: friend.conversation_id ?? "",
                    unread: "",
                }));
                setFriendsList(normalized_friends);

                // Get user info
                res = await fetch("/api/user/me", {
                    method: "GET",
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("access_token")}` },
                });
                
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                data = await res.json();
                
                const normalized_user = {
                    id: data.user.id ?? "",
                    username: data.user.username ?? "",
                    profile_picture: data.user.profile_picture ?? "",
                };
                setUser(normalized_user);

                // 2. Setup the Socket.IO connection
                const socket = io("http://localhost:8000"); 
                socketRef.current = socket;

                socket.on("connect", () => {
                    setConnected(true);
                    console.log("Socket.IO Connection ON");
                });

                // Listen for custom 'receive_message' event instead of standard onmessage
                socket.on("receive_message", (msg) => {
                    const income_conversation_id = msg.conversation_id;

                    const newMsg = {
                        message: msg.message,
                        sender: msg.sender,
                        timestamp: msg.timestamp,
                    };

                    // Use functional state updates to avoid stale closure issues inside useEffect
                    setConversationID((currentConvoId) => {
                        if (income_conversation_id === currentConvoId) {
                            setMessages((prevMessages) => [newMsg, ...prevMessages]);
                        } else {
                            setFriendsList((prevFriends) => {
                                const updatedFriends = [...prevFriends];
                                const target_friend = updatedFriends.find((f) => f.conversation_id === income_conversation_id);
                                if (target_friend) {
                                    target_friend.unread = newMsg.message;
                                }
                                return updatedFriends;
                            });
                        }
                        return currentConvoId;
                    });
                });

                socket.on("disconnect", () => {
                    setConnected(false);
                    console.log("Socket.IO Connection OFF");
                });

                socket.on("connect_error", (err) => {
                    console.log(`Socket.IO Error: ${err.message}`);
                });

            } catch (e) {
                console.log("error:", e);
            } 
        };
        loadMe();

        // Cleanup function to disconnect socket when component unmounts
        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, []);

    // Get the conversation_id between current user and the target user and set the messages
    useEffect(() => {
        const loadMessages = async () => {
            try {
                setLoadingCH(true);
                // Reset the unread message from this friend
                if (currTarget != null) {
                    const target_friend = friends_list.find((f) => f.userid === currTarget);
                    
                    if (target_friend) {
                        target_friend.unread = "";
                        console.log("########## Successfully reset the unread message! ############")
                        
                        // Extract ID locally to ensure we use the fresh value for the fetch call
                        const targetConvoId = target_friend.conversation_id;
                        setConversationID(targetConvoId);

                        // 3. Tell the backend we are looking at this specific conversation room
                        if (socketRef.current && targetConvoId) {
                            socketRef.current.emit("join_conversation", { conversation_id: targetConvoId });
                        }

                        const res = await fetch(`/api/conversations/${targetConvoId}/messages`, {
                            method: "GET",
                            headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("access_token")}` },
                        });
                        
                        if (!res.ok) throw new Error(`HTTP ${res.status}`);
                        const data = await res.json();
                        setMessages(data.messages);
                    }
                };
                
            } catch (e) {
                console.log("error:", e);
            } finally {
                setLoadingCH(false);
            }
        };
        loadMessages();
    }, [currTarget]);

    // Send the user input to the socket
    const sendMessage = (input) => {
        const trimmed = input.trim();
        if (!trimmed) return;
        
        // 4. Update the connection check for Socket.IO
        if (!socketRef.current || !socketRef.current.connected) {
            console.log("Socket not open");
            return false;
        }

        // 5. Emit the specific 'send_message' event instead of a generic send
        socketRef.current.emit("send_message", {
            sender: user.id, // Fixed from user.userid to match your state shape
            message: trimmed,
            conversation_id: conversation_id,
            timestamp: new Date().toISOString() // Good practice to timestamp upon send
        });
        
        return true;
    };

    return (
        <div className="chat-page">
            <div className='chat-window'>
                {currTarget ? 
                    <ChatWindow 
                        messages={messages} 
                        target={currTarget} 
                        friends_list={friends_list} 
                        user={user} 
                        sendMessage={sendMessage}
                    /> : 
                    <span>Select a friend to start a chat</span>}
            </div>
            <div className='chat-friend-list'>
                <ChatFriendsList 
                    friends_list={friends_list} 
                    target={currTarget} 
                    targetModifier={setCurrTarget}
                />
            </div>
        </div>
    );
};

export default Chat;
