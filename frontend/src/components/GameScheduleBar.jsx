import React from "react";
import "./GameScheduleBar.css"

const days = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
const time = ["morning", "afternoon", "night"];
    
export default function GameScheduleBar({ schedule, onClick }) {
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
                        {time.map((timeSlot) => (
                            <div
                            key={timeSlot}
                            className={`schedule-cell ${d[timeSlot] ? "free" : "busy"}`}
                            title={`${day} ${timeSlot}`}
                            onClick={() => onClick(day, timeSlot)}
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
