import React from 'react'
import { useEffect, useState, useRef } from "react";
import "./Chat.css";
import { useNavigate } from "react-router-dom";
import ChatFriendsList from "../components/ChatFriendsList"
import ChatWindow from '../components/ChatWindow';
import { io } from "socket.io-client";

const Chat = ({ target = null }) => {
    //const [friends_list, setFriendsList] = useState([
    //    {username: "bbb", userid: 2, pfp_url: "https://image.petmd.com/files/styles/863x625/public/2022-10/beagle-dog.jpg", conversation_id: 1, unread: ""},
    //    {username: "ccc", userid: 3, pfp_url: "https://image.petmd.com/files/styles/863x625/public/2022-10/beagle-dog.jpg", conversation_id: 2, unread: ""},
    //    {username: "ddd", userid: 4, pfp_url: "https://image.petmd.com/files/styles/863x625/public/2022-10/beagle-dog.jpg", conversation_id: 3, unread: ""},
    //]);

    // REPLACE WITH THIS: 
    const [friends_list, setFriendsList] = useState([]);
    const [convid_list, setConvidList] = useState([]);

    const [conversation_id , setConversationID] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loading_fl, setLoadingFL] = useState(false);
    const [loading_ch, setLoadingCH] = useState(false);
    const [connected, setConnected] = useState(false);
    const [currTarget, setCurrTarget] = useState(target);

    // WITH THIS:
    const [user, setUser] = useState(null);

    const socketRef = useRef(null);
    const activeConvoRef = useRef(null); // <-- Add this new ref

    // Get the user's friend list and build live chat
    useEffect(() => {
        const loadMe = async () => {
            try {
                setLoadingFL(true);

                // 1. Hit the correct endpoint
                const res = await fetch("/api/conversations/friends", {
                    method: "GET",
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("access_token")}` },
                });
                
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                
                // 2. data is the array itself
                const data = await res.json(); 
                
                // 3. Map keys to perfectly match what ChatController.py sends and what your dummy state used
                const normalized_friends = data.map((friend) => ({
                    userid: friend.userid ?? "", 
                    username: friend.username ?? "",
                    pfp_url: friend.pfp_url ?? "",
                    conversation_id: friend.conversation_id ?? "",
                    unread: friend.unread ?? "",
                }));
                
                setFriendsList(normalized_friends);
            } catch (e) {
                console.log("error:", e);
            } finally {
                setLoadingFL(false);
            }
        };
        loadMe();
    }, []);

    useEffect(() => {
        let isMounted = true; // <-- 1. Add this flag
        let socket;

        const loadMe = async () => {
            try {
                const res = await fetch("/api/user/me", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                    },
                });

                if (!res.ok) throw new Error(`HTTP ${res.status}`);

                const data = await res.json();

                const normalized_user = {
                    id: data.user.id ?? "",
                    username: data.user.username ?? "",
                    pfp_url: data.user.pfp_url ?? "",
                };

                setUser(normalized_user);

                socket = io("138.197.132.126:8000", {
                    autoConnect: false,
                    auth: {
                        token: localStorage.getItem("access_token"),
                        user_id: normalized_user.id,
                    },
                    transports: ["websocket"],
                });

                socketRef.current = socket;

                socket.on("connect", () => {
                    setConnected(true);
                    console.log("Socket.IO Connection ON");
                });

                // 1. Listen for the exact event name from the backend
                socket.on("receive_message", (msg) => {
                    const income_conversation_id = msg.conversation_id;

                    // 2. Map the payload to match the database schema that ChatWindow expects
                    const newMsg = {
                        id: msg.id,
                        content: msg.message,
                        sender_id: msg.sender,
                        created_at: new Date(msg.timestamp).toLocaleString([], {
                            month: 'short',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit',
                        }),
                    };

                    if (income_conversation_id === activeConvoRef.current) {
                        setMessages((prevMessages) => {
                            // <-- ADD THE SHIELD: If the message ID is already on screen, ignore it!
                            if (prevMessages.some(m => m.id === newMsg.id)) return prevMessages;
                            return [newMsg, ...prevMessages];
                        });
                    } else {
                        setFriendsList((prevFriends) =>
                            prevFriends.map((friend) =>
                                friend.conversation_id === income_conversation_id
                                    ? { ...friend, unread: newMsg.content } // Update to use newMsg.content
                                    : friend
                            )
                        );
                    }
                });

                socket.on("disconnect", (reason) => {
                    setConnected(false);
                    console.log("Socket.IO Connection OFF:", reason);
                });

                socket.on("connect_error", (err) => {
                    console.log("Socket.IO connect error:", err.message);
                });

                socket.connect();
            } catch (e) {
                console.log("error:", e);
            }
        };

        loadMe();

        return () => {
            isMounted = false; // <-- 3. Trip the flag when the component unmounts
            if (socket) {
                socket.disconnect();
            }
        };
    }, []);

    useEffect(() => {
        if (friends_list.length > 0) {
            setConvidList(friends_list.map(friend => friend.conversation_id));
        }
    }, [friends_list]);

    useEffect(() => {
        if (connected && convid_list.length > 0) {
            socketRef.current.emit("join_conversation", { conversation_id_lst: convid_list });
        }
    }, [connected, convid_list]);
                    
    // Reset the unread messages of current user and set conversation id
    useEffect(() => {
        const loadMe = async () => {
            try {
                setLoadingCH(true);
                // Reset the unread message from this friend
                if (currTarget != null) {
                    const target_friend = friends_list.find((f) => f.userid === currTarget);
                    target_friend.unread = "";
                    // console.log("########## Successfully reset the unread message! ############")

                    setConversationID(target_friend.conversation_id);
                };
                
            } catch (e) {
                console.log("error:", e);
            } finally {
                setLoadingCH(false);
            }
        };
        loadMe();
    }, [currTarget]);

    // Get the conversation between current user and the target user
    useEffect(() => {
        const loadMe = async () => {
            try {
                setLoadingCH(true);
                if (conversation_id != null) {
                    // console.log(`Attempt to get messages from /api/conversations/${conversation_id}/messages`)
                    const res = await fetch(`/api/conversations/${conversation_id}/messages`, {
                        method: "GET",
                        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("access_token")}` },
                    });
                    if (!res.ok) throw new Error(`HTTP ${res.status}`);
                    const data = await res.json();
                    // console.log("########## message data:", data);
                    const normalized_messages = data.map((msg) => ({
                        id: msg.id,
                        content: msg.content,
                        sender_id: msg.sender_id,
                        created_at: new Date(msg.created_at).toLocaleString([], {
                            month: 'short',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit',
                        }),
                    }));
                    setMessages(normalized_messages);
                };
            } catch (e) {
                console.log("error:", e);
            } finally {
                activeConvoRef.current = conversation_id;
                setLoadingCH(false);
            }
        };
        loadMe();
    }, [conversation_id]);

    // Send the user input to the socket
    const sendMessage = (input) => {
        const trimmed = input.trim();
        if (!trimmed) return;
        
        // 1. Use Socket.IO's .connected property
        if (!socketRef.current || !socketRef.current.connected) {
            console.log("Socket not open");
            return false;
        }

        // 2. Use .emit() and match the exact event name your Python backend expects
        socketRef.current.emit("send_message", {
            sender: user.id, // Fixed from user.userid
            message: trimmed,
            conversation_id: conversation_id,
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
