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

export default function PUFriendRequest({ open, onClose }) {
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

    // calls api endpoint to reject a friend request
    async function rejectFR() { 
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
                let msg = "";
                try {
                    const data = await res.json();
                    console.log(data);
                    if (data?.status) msg = data.status;
                    setFail(`Something went wrong. Please try again later. (${msg})`);
                } catch {}
                throw new Error(msg);
            }
            handleClose();
        } catch (e) {
            // setFail(e instanceof Error ? e.message : "Save failed.");
            setFail(`Something went wrong. Please try again later. (${e.message})`);
        } 
    }

    // calls an endpoint to accept a friend request, which is basically adding a friend
    const acceptFR = async () => {
        try {
            const response = await fetch("...", { //add friend endpoint
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                },
                credentials: "include",
            });

            if (!response.ok) {
                setFail(`Something went wrong. Please try again later. (${response.status})`);
                throw new Error("Failed to fetch users")
            }

            // sort endpoint responds with the list of users sorted with name or availability
            const data = await response.json()
            console.log(data)
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
            
                                        <button className="acceptFR" onClick={() => {acceptFR(user.username);}}>
                                            <img src={checkmark} className="accept-icon"/>
                                        </button>
            
                                        <button class="unfriend" onClick={() => {rejectFR(user.username);}} >
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
