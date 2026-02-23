import React from 'react'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from "react-router-dom";
import "./Matchmaking.css";
import GameScheduleBar from "../components/GameScheduleBar";
import valorantImg from "../gameImages/valorant-banner.jpg";
import pubgImg from "../gameImages/pubg-banner.jpg";
import lolImg from "../gameImages/lol-banner.webp";
import minecraftImg from "../gameImages/minecraft.webp";
import hsrProfile from "../gameImages/hq720.jpg";
import RegionIcon from "../gameImages/map-5.png";
import filterIcon from "../gameImages/filterIcon.png"

// data for demo
const placeboUsers = [
  {
    id: 1,
    username: "GamerNumberOne",
    rank: "Gold",
    region: "NA",
    avatar: "https://api.dicebear.com/9.x/adventurer/svg?seed=Aidan",
    description: "Casual player looking for duo partners",
    game: "Valorant"
  },
  {
    id: 2,
    username: "ProPlayer99",
    rank: "Diamond",
    region: "EU",
    avatar: "https://api.dicebear.com/9.x/lorelei-neutral/svg?seed=Luis",
    description: "Competitive gamer, top tier",
    game: "League"
  },
  {
    id: 3,
    username: "NightOwl",
    rank: "Pro",
    region: "ASIA",
    avatar: "https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=Adrian",
    description: "I play mostly at night",
    game: "Minecraft"
  },
  {
    id: 4,
    username: "HSRenjoyer",
    rank: "Platinum",
    region: "ASIA",
    avatar: hsrProfile,
    description: "I just need the last constellation...",
    game: "PUBG"
  },
  {
    id: 5,
    username: "RandomPerson",
    rank: "Immortal",
    region: "NA",
    avatar: lolImg,
    description: "Hello! Need two teammates for rank",
    game: "Valorant"
  },
];

const gameImages = {
  Valorant: valorantImg,
  PUBG: pubgImg,
  League: lolImg,
  Minecraft: minecraftImg,
};

const Matchmaking = () => {
    const [users, setUsers] = useState([]); // users expected to be type array
    const [game, setGame] = useState("all") // default all 
    const [rank, setRank] = useState("all")
    const [region, setRegion] = useState("all")
    const [showAvailability, setShowAvailability] = useState(false);

    // const days = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

    // returns one object including all 7 days, with each having { morning, afternoon, night}
    const [availability, setAvailability] = useState({
        Monday: { morning: false, afternoon: false, evening: false },
        Tuesday: { morning: false, afternoon: false, evening: false },
        Wednesday: { morning: false, afternoon: false, evening: false },
        Thursday: { morning: false, afternoon: false, evening: false },
        Friday: { morning: false, afternoon: false, evening: false },
        Saturday: { morning: false, afternoon: false, evening: false },
        Sunday: { morning: false, afternoon: false, evening: false },}
    );

    // set availability selections by creating a temp copy of availability to prevent direct modifications
    const handleAvailabilityToggle = (day, time) => {
        let temp = {...availability}
        let newDay = {...temp[day]} // get the modified day
        newDay[time] = !newDay[time]; // toggle on/off the time for that day
        temp[day] = newDay;          
        setAvailability(temp);  
    }

    // map the game for each user to background images for each game
    const attachGameImages = (users) => {
        const newUsers = [];

        for (let i = 0; i < users.length; i++) {
            const user = users[i];
            let image = gameImages[user.game];

            if (!image) {
                image = ""; // no img if not found
            }
            user.gameImage = image;
            newUsers.push(user);
        }
        return newUsers;
    };

    // fetch the list of recommended users from backend upon page load
    useEffect(() => {
        // placeholder fetch 
        let users = attachGameImages (placeboUsers)
        setUsers(users);
    }, []);

    // sends a filter obj with other info and receives recommended users from backend
    const onFilterSubmit = async (Filters) => {
        //setUsers(received result)
    }
    
    return (
        <div className="layout">
            <h1 className="title">Connect with Others</h1>
            <div className="filters-layout">

                {/* filter components */}
                <div className = "filters">
                    <img src={filterIcon} className="filterIcon"/>
                    <span> Filters </span>
                    
                    <div className ="filter-controls">
                        <select value={game} onChange={(e) => setGame(e.target.value)}>
                            <option value="all">All Games</option>
                            <option value="League">League of Legends</option>
                            <option value="Valorant">Valorant</option>
                            <option value="Minecraft">Minecraft</option>
                            <option value="PUBG">PUBG</option>
                        </select>

                        <select value={rank} onChange={(e) => setRank(e.target.value)}>
                            <option value="all">All Ranks</option>
                            <option value="Bronze">Bronze</option>
                            <option value="Silver">Silver</option>
                            <option value="Gold">Gold</option>
                            <option value="Platinum">Platinum</option>
                            <option value="Diamond">Diamond</option>
                            <option value="Master">Master</option>
                        </select>

                        <select value={region} onChange={(e) => setRegion(e.target.value)}>
                            <option value="all">All Regions</option>
                            <option value="NA">NA</option>
                            <option value="Asia">Asia</option>
                            <option value="EU">EU</option>
                        </select>

                        {/* create button to show/hide availability filter*/}
                        <div className="availability-dropdown">
                            <button className="availability-button" 
                                onClick={() => setShowAvailability(prev => !prev)}>
                                {showAvailability ? "Hide Availability" : "Set Availability"}
                            </button>
                            {showAvailability && (
                                <div className="availability-content">
                                    <GameScheduleBar
                                        schedule={availability}
                                        onClick={handleAvailabilityToggle}
                                    />
                                </div>
                            )}
                        </div>
        
                        <button className="apply-button"> Apply </button>
                    </div>
                </div>
            </div>
            
            {/* For each returned user, map its attributes to a banner*/}
            <div className="user-layout">
                {users.map((user) => (
                    <div className="user-banners">
                        {/* demo game img for different games*/}
                        <div className="bg-image" style={{ backgroundImage: `url(${user.gameImage})` }}>
                            <div className="bg-gradient-overlay" />
                        </div>

                        {/* rank on left of banner*/}
                        <div className="left-side">
                            <div className="rank">{user.rank}</div>
                        </div>

                        {/* other user info on right of banner*/}
                        <div className="right-side">
                            <div className="user-content">
                                <div className="top-row">
                                    <img src={user.avatar} className="avatar" />
                                    <h3 className="username">{user.username}</h3>
                                </div>

                                <div className="user-info">
                                    <p className="description">{user.description}</p>
                                    <div className="region">
                                        <img src={RegionIcon} />
                                        <span> {user.region}</span>
                                    </div>
                                </div>
                            </div>

                            <div class="connect-wrapper">
                                <button className="connect-button">Connect</button>
                            </div>
                        </div>
                    </div>
                ))} 
            </div>
            {/* Add no player/party found later */}
        </div>
    )
}

export default Matchmaking