import React from 'react'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from "react-router-dom";
import "./Matchmaking.css";
import GameScheduleBar from "../components/GameScheduleBar";

// data for demo
const placeboUsers = [
  {
    id: 1,
    username: "GamerNumberOne",
    rank: "Gold",
    region: "NA",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=1",
    description: "Casual player looking for duo partners",
  },
  {
    id: 2,
    username: "ProPlayer99",
    rank: "Diamond",
    region: "EU",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=2",
    description: "Competitive gamer, top tier",
  },
  {
    id: 3,
    username: "NightOwl",
    rank: "Platinum",
    region: "ASIA",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=3",
    description: "I play mostly at night",
  },
  {
    id: 4,
    username: "HSRenjoyer",
    rank: "Platinum",
    region: "ASIA",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=3",
    description: "I just need the last constellation...",
  },
];

const Matchmaking = () => {
    const [users, setUsers] = useState([]); // users expected to be type array
    const [game, setGame] = useState("all") // default all 
    const [rank, setRank] = useState("all")
    const [region, setRegion] = useState("all")
    const [showAvailability, setShowAvailability] = useState(false);

    const days = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

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

    // fetch the list of recommended users from backend upon page load
    useEffect(() => {
        // placeholder fetch 
        setUsers(placeboUsers);
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
                    <span> Filters </span>
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
                </div>
            </div>
            
            {/* For each returned user, map its attributes to a banner*/}
            <div className="user-layout">
                {users.map((user) => (
                    <div className="user-banners">
                        <img src={user.avatar} className="avatar" />
                        <div className="bg-image" /> {/* tbd */}
                        <div className="rank">{user.rank}</div>
                        <div className="user-info">
                            <h3 className="username">{user.username}</h3>
                            <p className="description">{user.description}</p>
                            <span>{user.region}</span>
                        </div>

                        <button className="connect-button">Connect</button>
                    </div>
                ))} 
            </div>
        </div>
    )
}

export default Matchmaking