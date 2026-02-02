const SLOTS = 48;

// This function generates a time interval for the schedule bar
// function slotLabel(i) {
//     const start = i * 30;
//     const end = start + 30;

//     const hh1 = String(Math.floor(start / 60)).padStart(2, "0");
//     const mm1 = String(start % 60).padStart(2, "0");
//     const hh2 = String(Math.floor(end / 60)).padStart(2, "0");
//     const mm2 = String(end % 60).padStart(2, "0");

//     return `${hh1}:${mm1} - ${hh2}:${mm2}`;
// }

export default function GameScheduleBar({ schedule }) {
    // Ensure we always have exactly 48 booleans
    const slots = Array.isArray(schedule) && schedule.length === SLOTS
        ? schedule : Array(SLOTS).fill(false);

    return (
        <div>
            Monday:
            <div className="schedule-bar-day">
                {slots.map((isFree, i) => (
                <div
                    key={i}
                    className={`schedule-slot ${isFree ? "free" : "busy"}`}
                    // title={slotLabel(i)}
                />
                ))}
            </div>
        </div>
        
    );
}
