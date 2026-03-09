import { useState } from "react";
import "./PopupDescription.css";
import Popup from "./Popup"

export default function PUDescription({description, descriptionModifier}) {
    const [open, setOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [desc, setDesc] = useState("");
    const [descriptionError, setDescriptionError] = useState("");
    const [descriptionFail, setFail] = useState("");

    async function handleSave() {
        setFail("");
        if (desc.length > 500) {
            setDescriptionError("Description must be less than 500 letters")
            return;
        }

        setIsSaving(true);
        setDescriptionError("");

        try {
            const res = await fetch("/api/user/me", {
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
            descriptionModifier(desc);
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
        setDesc("");
        setDescriptionError("");
        setFail("");
    };
    return (
        <div className="element-description">
            <button className="btn-description btn-description-change" onClick={() => {setOpen(true); setDesc(description);}}>
              Change Description
            </button>

            <Popup open={open} onClose={handleClose} title="Change Description" fail_msg={descriptionFail} 
                body_height="popup-description-body-height" popup_width="popup-description-popup-width">
                
                <div style={{ display: "flex", gap: 8 }}>
                    <div className="description-input-container">
                        <h2>Edit your description</h2>
                        <div style={{ display: "flex", flexDirection: "column"}}>
                            <textarea
                                className="input-description"
                                placeholder="Type here..."
                                value={desc}
                                onChange={(e) => setDesc(e.target.value)}
                                onKeyDown={(e) => {
                                if (e.key === "Enter") handleSave();
                                }}
                            />
                            <p className="description-length-display">{desc.length} / 500</p>
                        </div>
                        {descriptionError ? <p className="error-msg">{descriptionError}</p> : ""}

                    </div>
                    <div className="description-save-container">
                        <button
                            className="btn-description btn-description-save"
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
