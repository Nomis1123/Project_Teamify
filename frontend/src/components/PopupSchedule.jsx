import { useState } from "react";
import "./PopupSchedule.css";
import Popup from "./Popup"
import GameScheduleBar from "./GameScheduleBar";

export default function PUSchedule({schedule, scheduleModifier}) {
    const [open, setOpen] = useState(false);
    const [sche, setSche] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [scheFail, setFail] = useState("");
    const defaultDailySchedule = { morning: false, afternoon: false, night: false };
    const handleScheduleToggle = (day, timeSlot) => {
        const updatedSchedule = { ...sche };
        const updatedDay = { ...(updatedSchedule[day] || defaultDailySchedule) };

        updatedDay[timeSlot] = !updatedDay[timeSlot];
        updatedSchedule[day] = updatedDay;

        setSche(updatedSchedule);
    };

    async function handleSave() {
        setFail("");
        setIsSaving(true);
        // console.log(sche);
        // scheduleModifier(sche); // Uncomment this to check the update of schedule w/o backend

        try {
            const res = await fetch("/api/user/me", {
                method: "PATCH",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("access_token")}` },
                body: JSON.stringify({ avaliability: sche }),
            });

            if (!res.ok) {
            // backend might return JSON error { message: "..." }
            setFail(`Save failed. Please try again later. (${res.status})`);
            let msg = "";
            try {
                const data = await res.json();
                console.log(data);
                if (data?.status) msg = data.status;
                setFail(`Save failed. Please try again later. (${msg})`);
            } catch {}
            throw new Error(msg);
            }
            handleClose();
            scheduleModifier(sche);
        } catch (e) {
            // setFail(e instanceof Error ? e.message : "Save failed.");
            setFail(`Save failed. Please try again later. (${e.message})`);
        } finally {
            setIsSaving(false);
        }
    };
    function handleClose() {
        setIsSaving(false);
        setOpen(false);
        setFail("");
    };

    return (
        <div className="element-schedule">
            <button className="btn-schedule btn-schedule-change" onClick={() => {setOpen(true); setSche(schedule);}}>
            Change Schedule
            </button>

            <Popup open={open} onClose={handleClose} title="Change Schedule" fail_msg={scheFail} 
                body_height="popup-schedule-body-height" popup_width="popup-schedule-popup-width">
                <div style={{ display: "flex", gap: 8 }}>
                    <div className="schedule-input-container">
                        <GameScheduleBar 
                            schedule={sche} 
                            onClick={handleScheduleToggle}
                        />
                    </div>

                    <div className="schedule-save-container">
                        <button
                            className="btn-schedule btn-schedule-save"
                            onClick={handleSave}
                            disabled={isSaving}
                            type="button"
                        >
                            {isSaving ? "Saving..." : "Save"}
                        </button>
                    </div>
                </div>
            </Popup>
        </div>
    );
}
