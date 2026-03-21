import { useState, useEffect } from "react";
import "../components/PopupFriendRequest.css";
import Popup from "./Popup";
import hsrProfile from "../gameImages/hq720.jpg";
import lolImg from "../gameImages/lol-banner.webp";
import checkmark from "../assets/checkmark.png";
import X from "../assets/X.png";

const placeboUsers = [
  {
    id: 1,
    username: "GamerNumberOne",
    avatar: "https://api.dicebear.com/9.x/adventurer/svg?seed=Aidan",
    description: "Casual player looking for duo partners"
  },
  {
    id: 2,
    username: "ProPlayer99",
    avatar: "https://api.dicebear.com/9.x/lorelei-neutral/svg?seed=Luis",
    description: "Competitive gamer, top tier"
  },
  {
    id: 3,
    username: "NightOwl",
    avatar: "https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=Adrian",
    description: "I play mostly at night"
  },
  {
    id: 4,
    username: "HSRenjoyer",
    avatar: hsrProfile,
    description: "I just need the last constellation..."
  },
  {
    id: 5,
    username: "RandomPerson",
    avatar: lolImg,
    description: "Hello! Need two teammates for rank"
  },
];

export default function PUFriendRequest({ open, onClose, onAddFriend}) {
    const [users, setUsers] = useState([]); 
    const [frError, setFrError] = useState("");
    const [descriptionFail, setFail] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    //when popup loads, call the list of friend requests
    useEffect(() => {
        const init = async () => {
            //const data = await getFriends();
            setUsers(placeboUsers); // switch to data later
        }
        init();
    }, []);

    // remove user from friend request list
    async function removePerson(userID){
        setUsers(prevUsers => prevUsers.filter(user => user.id !== userID));
    }

    // calls api endpoint to reject a friend request
    async function rejectFR(userID) { 
        setFail("");
        setFrError("");
        try {
            const res = await fetch("/api/users/reject", { // fake endpoint 
                method: "PATCH",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("access_token")}` },
            });

            if (!res.ok) {
                // backend might return JSON error { message: "..." }
                setFail(`Something went wrong. Please try again later. (${res.status})`);
                throw new Error("something went wrong");
            }

            const data = await res.json();
            console.log(data);
            removePerson(userID); 

            handleClose();
        } catch (e) {
            // setFail(e instanceof Error ? e.message : "Save failed.");
            setFail(`Something went wrong. Please try again later. (${e.message})`);
        } 
    }

    // calls an endpoint to accept a friend request, which is basically adding a friend
    const acceptFR = async (userID) => {
        try {
            const response = await fetch("/api/friends/accept", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                },
                credentials: "include",
                body: JSON.stringify({ friend_id: userID }),
            });

            if (!response.ok) {
                setFail(`Something went wrong. Please try again later. (${response.status})`);
                throw new Error("Failed to fetch users")
            }

            //update friends list to show new friend and remove person from friend request list
            await onAddFriend();
            removePerson(userID)
            setSuccessMsg("Successfully Added Friend.")
            
        } catch (error) {
            console.error("Error fetching users:", error)
        }
    }

    function handleClose() {
        onClose();
        setFrError("");
        setFail("");
        setSuccessMsg("");
    };
    
    return (
        <div className="element-fr">
            <Popup open={open} onClose={handleClose} title="Friend Requests" fail_msg={descriptionFail} 
                body_height="popup-fr-body-height" popup_width="popup-fr-popup-width">
                
                <div style={{ display: "flex", gap: 8 }}>
                    <div className="fr-input-container">
                        {frError ? <p className="error-msg">{frError}</p> : ""}
                        {successMsg ? <p className="success-msg">{successMsg}</p> : ""}

                    <div className="user-layout-fr">
                            {users.map((user) => (
                                <div className="fr-banners">
            
                                    {/* rank on left of banner*/}
                                    <div className="left-side-fr">
                                    </div>
            
                                    {/* other user info on right of banner*/}
                                    <div className="right-side-fr">
                                        <div className="user-content-fr">
                                            <div className="top-row-fr">
                                                <img src={user.avatar} className="avatar-fr" />
                                                <h3 className="username">{user.username}</h3>
                                            </div>
            
                                            <div className="user-info-fr">
                                                <p className="description-fr">{user.description}</p>
                                            </div>
                                        </div>
            
                                        <button className="acceptFR" onClick={() => {acceptFR(user.id);}}>
                                            <img src={checkmark} className="accept-icon"/>
                                        </button>
            
                                        <button class="unfriend" onClick={() => {rejectFR(user.id);}} >
                                            <img src={X}  className="unfriend-icon"/>
                                        </button>
                                    </div>
                                </div>
                            ))} 
                        </div>
                        {/* If no users found */}
                        {users.length === 0 && (
                            <div className="empty-msg-friends">
                                <p>No friend requests.</p>
                            </div>
                        )}
                    </div>
                    
                </div>
              
            </Popup>
        </div>
    );
}
