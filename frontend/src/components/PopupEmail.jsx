import { useState } from "react";
import "./PopupEmail.css";
import Popup from "./Popup"

export default function PUEmail({email, emailModifier}) {
    const [open, setOpen] = useState(false);
    const [oldEmail, setOldEmail] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [oldEmailError, setOldEmailError] = useState("");
    const [newEmailError, setNewEmailError] = useState("");
    const [emailFail, setFail] = useState("");
    async function handleSave() {
        setFail("");
        let isValid = true;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (oldEmail === "" || !emailRegex.test(oldEmail)) {
            setOldEmailError("Email empty or incorrect format");
            isValid = false;
        } else {
            setOldEmailError("");
        }
        if (newEmail === "" || !emailRegex.test(newEmail)) {
            setNewEmailError("Email empty or incorrect format");
            isValid = false;
        } else {
            setNewEmailError("");
        }
        if (!isValid) {
            return;
        }
        
        if (oldEmail === newEmail) {
            setNewEmailError("New email must be different from your current email.");
            return;
        } else {
            setNewEmailError("");
        }

        setIsSaving(true);

        try {
            const res = await fetch("/api/user/me", {
                method: "PATCH",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("access_token")}` },
                body: JSON.stringify({ old_email: oldEmail, new_email: newEmail }),
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
            emailModifier(newEmail);
        } catch (e) {
            // setFail(e instanceof Error ? e.message : "Save failed.");
            setFail(`Save failed. Please try again later. (${e.message})`);
        } finally {
            setIsSaving(false);
        }
    };
    function handleClose() {
        setOldEmail("");
        setNewEmail("");
        setIsSaving(false);
        setOpen(false);
        setOldEmailError("");
        setNewEmailError("");
        setFail("");
    };

    return (
        <div className="element-email">
          <button className="btn-email btn-email-change" onClick={() => setOpen(true)}>
            Change Email
          </button>

          <Popup open={open} onClose={handleClose} title="Change Email" fail_msg={emailFail} 
              body_height="popup-email-body-height" popup_width="popup-email-popup-width">
              <div style={{ display: "flex", gap: 8 }}>
                  <div className="email-input-container">
                      <div className="single-input-block-email"><h2>Enter your current email</h2>
                          <div style={{ display: "flex", gap: 8 }}>
                              <input
                                  className="input-email"
                                  placeholder="Type here..."
                                  value={oldEmail}
                                  onChange={(e) => setOldEmail(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") handleSave();
                                  }}
                              />
                          </div>
                          {oldEmailError ? <p className="error-msg">{oldEmailError}</p> : ""}
                      </div>

                      <div className="single-input-block-email"><h2>Enter your new email</h2>
                          <div style={{ display: "flex", gap: 8 }}>
                              <input
                                  className="input-email"
                                  placeholder="Type here..."
                                  value={newEmail}
                                  onChange={(e) => setNewEmail(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") handleSave();
                                  }}
                              />
                          </div>
                          {newEmailError ? <p className="error-msg">{newEmailError}</p> : ""}
                        </div>
                    </div>
                    <div className="email-save-container">
                        <button
                            className="btn-email btn-email-save"
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
