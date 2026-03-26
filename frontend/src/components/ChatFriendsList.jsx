import { useState, useEffect } from "react";
import "./ChatFriendsList.css";

export default function ChatFriendsList({friends_list, target, targetModifier}) {
    return (
        <div className="friends-section">
            <div className="friends-list-top-bar">
                Friends
            </div>
            <div className="friends-list">
                {friends_list.map((user) => (
                    <button className={`friend-element ${user.userid === target ? "friend-target" : "friend-default"}`} 
                        key={`${user.userid}`} 
                        onClick={() => targetModifier(user.userid)}>
                        <img
                            className={`friend-pfp`}
                            src={user.pfp_url}
                            alt={user.username}
                        />
                        <div className="friend-info">
                            <div className="friend-username">
                                {user.username}
                            </div>
                            <div className="friend-unread">
                                {user.unread}
                            </div>
                        </div>
                        {user.unread === "" ? null : <div className="friend-unread-dot"/>}
                    </button>
                ))}
            </div>
        </div>
        
    );
}
