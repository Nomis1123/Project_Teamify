import { useState, useEffect } from "react";
import "./ChatWindow.css";

export default function ChatWindow({messages, target, friends_list, user}) {
    const targetUser = friends_list.find((u) => u.userid === target);
    const [input, setInput] = useState("");
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
                {messages.map((message, index) => {
                    if (message.sender === target) {
                        return (
                            <div key={index} className="chat-element chat-target">
                                <img
                                    className={"chat-pfp"}
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
                        );
                    } else if (message.sender === user.id) {
                        return (
                            <div key={index} className="chat-element chat-user">
                                <div className="chat-body">
                                    <div className="chat-username-user">
                                        {user.username}
                                    </div>
                                    <div className="chat-message">
                                        {message.message}
                                    </div>
                                </div>
                                <img
                                    className={"chat-pfp"}
                                    src={user.pfp_url}
                                    alt={user.id}
                                />
                            </div>
                        );
                    }
                })}
            </div>
            <textarea 
                className="chat-input-box"
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