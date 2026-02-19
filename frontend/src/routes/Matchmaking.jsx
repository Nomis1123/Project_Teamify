import React from 'react'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from "react-router-dom";
import "./Matchmaking.css";
import GameScheduleBar from "../components/GameScheduleBar";

const Matchmaking = () => {
    // default all 
    const [game, setGame] = useState("all")
    const [rank, setRank] = useState("all")
    const [region, setRegion] = useState("all")
    const [showAvailability, setShowAvailability] = useState(false);

    const days = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

    // returns one object accumlator with all 7 days, each having { morning, afternoon, night}
    const [availability, setAvailability] = useState(
        days.reduce((acc, day) => {
            acc[day] = { morning: false, afternoon: false, night: false };
            return acc;
        }, {})
    );

    const handleAvailabilityToggle = (day, time) => {
        // create a temp copy to store the new availability filters to prevent direct modifications
        let temp = {...availability}
        let newDay = {...temp[day]}
        newDay[time] = !newDay[time]; // set false to true and vice versa
        temp[day] = newDay;          
        setAvailability(temp);  
    }
    
    return (
        <div className="container">
            <h1>Connect with Others</h1>

            {/* filter components */}
            <div className = "filters">
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
                    <option value="Europe">Europe</option>
                </select>

                {/* create button to hide/display availability filter*/}
                <div className="availability-dropdown">
                    <button 
                        className="availability-button" 
                        onClick={() => setShowAvailability(prev => !prev)}
                    >
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
    )
}

export default Matchmaking