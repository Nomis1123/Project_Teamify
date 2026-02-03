import React from "react";
import "./GameScheduleBar.css"

const days = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
const time = ["morning", "afternoon", "night"];
    
export default function GameScheduleBar({ schedule }) {
    return (
        <div className="weekly-schedule">
            {days.map((day) => {const d = schedule?.[day] ?? { morning: false, afternoon: false, night: false };

            return (
                <div className="daily-schedule" key={day}>
                    <div className="day-label">{day}:</div>

                    <div className="schedule-right">
                        <div className="time-sections">
                            <div>Morning</div>
                            <div>Afternoon</div>
                            <div>Night</div>
                        </div>

                        <div className="bar-sections">
                        {time.map((p) => (
                            <div
                            key={p}
                            className={`schedule-cell ${d[p] ? "free" : "busy"}`}
                            title={`${day} ${p}`}
                            />
                        ))}
                        </div>
                    </div>
                </div>
            );
            })}
        </div>
    );
}
