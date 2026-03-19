import { useState } from "react";
import "../components/PopupRemoveFriend.css";
import Popup from "./Popup"

export default function PURemoveFriend({ user, open, onClose }) {
    const [isSaving, setIsSaving] = useState(false);
    const [desc, setDesc] = useState("");
    const [descriptionError, setDescriptionError] = useState("");
    const [descriptionFail, setFail] = useState("");

    async function handleSave() {
        setFail("");
        setIsSaving(true);
        setDescriptionError("");

        try {
            const res = await fetch("/api/users/unfriend", { // fake endpoint 
                method: "PATCH",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("access_token")}` },
                body: JSON.stringify({ description: desc }),
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
        } catch (e) {
            // setFail(e instanceof Error ? e.message : "Save failed.");
            setFail(`Something went wrong. Please try again later. (${e.message})`);
        } finally {
            setIsSaving(false);
        }
    };
    function handleClose() {
        setIsSaving(false);
        onClose();
        setDesc("");
        setDescriptionError("");
        setFail("");
    };
    
    return (
        <div className="element-friend">
            <Popup open={open} onClose={handleClose} title="Remove Friend" fail_msg={descriptionFail} 
                body_height="popup-friend-body-height" popup_width="popup-friend-popup-width">
                
                <div style={{ display: "flex", gap: 8 }}>
                    <div className="friend-input-container">
                        <h2 className="unfriend-title"> Are you sure you want to unfriend {user}? </h2>
                        {descriptionError ? <p className="error-msg">{descriptionError}</p> : ""}

                    </div>
                    <div className="friend-save-container">
                        <button
                            className="btn-friend btn-friend-save"
                            onClick={handleSave}
                            disabled={isSaving}
                            type="button"
                        >
                            {isSaving ? "Removing..." : "Unfriend"}
                        </button>  
                    </div>
                </div>
              
            </Popup>
        </div>
    );
}
