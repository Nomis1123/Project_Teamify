import { useState, useEffect, useRef } from "react";
import "./ChatWindow.css";

export default function ChatWindow({messages, target, friends_list, user}) {
    const targetUser = friends_list.find((u) => u.userid === target);
    const [input, setInput] = useState("");
    const socketRef = useRef(null);

    useEffect(() => {
        const ws = new WebSocket(`ws://localhost:8000/ws/${currentUserId}`);
        socketRef.current = ws;

        ws.onopen = () => {
            console.log("WebSocket Connection ON");
        };

        ws.onmessage = (event) => {
            const msg = JSON.parse(event.data);

            if (msg.type === "Send") {
                
            } 
        };

        ws.onclose = () => {
            console.log("WebSocket Connection OFF");
        };

        ws.onerror = (e) => {
            console.log(`WebSocket Error: ${e}`)
        }

    }, []);

    useEffect(() => {
        console.log("############## Resetting input box ###############");
        setInput("");
    }, [target]);

    return (
        <div className="chat-window-section">
            <div className="chat-window-top-bar">
                <img
                    className={"chat-pfp-large"}
                    src={targetUser.pfp_url}
                    alt={targetUser.id}
                />
                <div className="dot"/>
                <div className="chat-username-large">
                    {targetUser.username}
                </div>
            </div>
            <div className="chat-list">
                {messages.map((message, index) => (
                    message.sender === target ? (
                        <div style={{ display: "flex", flexDirection: "column" }}>
                            <div className="chat-timestamp">
                                {message.timestamp}
                            </div>
                            <div className="chat-element chat-target">
                                <img
                                    className="chat-pfp"
                                    src={targetUser.pfp_url}
                                    alt={targetUser.id}
                                />
                                <div className="chat-body">
                                    <div className="chat-username-target">
                                        {targetUser.username}
                                    </div>
                                    <div className="chat-message">
                                        {message.message}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : message.sender === user.id ? (
                        <div style={{ display: "flex", flexDirection: "column" }}>
                            <div className="chat-timestamp">
                                {message.timestamp}
                            </div>
                            <div className="chat-element chat-user">
                                <div className="chat-body">
                                    <div className="chat-username-user">
                                        {user.username}
                                    </div>
                                    <div className="chat-message">
                                        {message.message}
                                    </div>
                                </div>
                                <img
                                    className="chat-pfp"
                                    src={user.pfp_url}
                                    alt={user.id}
                                />
                            </div>
                        </div>
                    ) : null
                ))}
            </div>
            <textarea 
                className="chat-input-box"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Send message to ${targetUser.username}`}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        // e.preventDefault();
                        // handleSend();
                    }
                }}
            />
        </div>
    );
}