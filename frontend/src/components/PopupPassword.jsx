import { useState } from "react";
import "./PopupPassword.css";
import Popup from "./Popup"

export default function PUPassword() {
    const [open, setOpen] = useState(false);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [cfmPassword, setCfmPassword] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [oldPasswordError, setOldPasswordError] = useState("");
    const [newPasswordError, setNewPasswordError] = useState("");
    const [cfmPasswordError, setCfmPasswordError] = useState("");
    const [passwordFail, setFail] = useState("");
    async function handleSave() {
        setFail("");
        let isValid = true;
        if (oldPassword == "") {
            setOldPasswordError("This field cannot be empty");
            isValid = false;
        } else {
            setOldPasswordError("");
        }
        const passRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/
        if (newPassword == "" || !passRegex.test(newPassword)) {
            setNewPasswordError("Password must include at least one letter, one number, and minimum 8 letters");
            isValid = false;
        } else {
            setNewPasswordError("");
        }
        if (cfmPassword === "" || !passRegex.test(cfmPassword)) {
            setCfmPasswordError("Password must include at least one letter, one number, and minimum 8 letters");
            isValid = false;
        } else {
            setCfmPasswordError("");
        }

        if (!isValid) {
            return;
        }
        
        if (oldPassword === newPassword) {
            setNewPasswordError("New password must be different from your current password.");
            isValid = false;
        } else {
            setNewPasswordError("");
        }
        if (newPassword != cfmPassword) {
            setCfmPasswordError("This field must match your new password");
            isValid = false;
        } else {
            setCfmPasswordError("");
        }

        if (!isValid) {
            return;
        }

        setIsSaving(true);

        try {
            const res = await fetch("/api/user/me", {
                method: "PATCH",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("access_token")}` },
                body: JSON.stringify({ old_password: oldPassword, new_password: newPassword }),
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
            setFail(`Save failed. Please try again later. (${e.message})`);
        } finally {
            setIsSaving(false);
        }
    };
    function handleClose() {
        setOldPassword("");
        setNewPassword("");
        setCfmPassword("");
        setIsSaving(false);
        setOpen(false);
        setOldPasswordError("");
        setNewPasswordError("");
        setCfmPasswordError("");
        setFail("");
    };

    return (
        <div className="element-pwd">
            <button className="btn-pwd btn-pwd-change" onClick={() => setOpen(true)}>
                Change Password
            </button>

            <Popup open={open} onClose={handleClose} title="Change Password" fail_msg={passwordFail} 
                body_height="popup-pwd-body-height" popup_width="popup-pwd-popup-width">
                <div style={{ display: "flex", gap: 8 }}>
                    <div className="pwd-input-container">
                        <div className="single-input-block-pwd">
                            <h2>Enter your current password</h2>
                            <div style={{ display: "flex", gap: 8 }}>
                                <input
                                    className="input-pwd"
                                    placeholder="Type here..."
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") handleSave();
                                    }}
                                />
                            </div>
                            {oldPasswordError ? <p className="error-msg">{oldPasswordError}</p> : ""}
                        </div>

                        <div className="single-input-block-pwd">
                            <h2>Enter your new password</h2>
                            <div style={{ display: "flex", gap: 8 }}>
                                <input
                                    className="input-pwd"
                                    placeholder="Type here..."
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") handleSave();
                                    }}
                                />
                            </div>
                            {newPasswordError ? <p className="error-msg">{newPasswordError}</p> : ""}
                        </div>

                        <div className="single-input-block-pwd">
                            <h2>Confirm your new password</h2>
                            <div style={{ display: "flex", gap: 8 }}>
                                <input
                                    className="input-pwd"
                                    placeholder="Type here..."
                                    value={cfmPassword}
                                    onChange={(e) => setCfmPassword(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") handleSave();
                                    }}
                                />
                            </div>
                            {cfmPasswordError ? <p className="error-msg">{cfmPasswordError}</p> : ""}
                        </div>
                    </div>

                    <div className="pwd-save-container">
                        <button
                            className="btn-pwd btn-pwd-save"
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
