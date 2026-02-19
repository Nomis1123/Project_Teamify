import { useState } from "react";
import "./PopupUsername.css";
import Popup from "./Popup"

export default function PUUsername() {
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("")
  const [isSaving, setIsSaving] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const [usernameFail, setFail] = useState("");
  async function handleSave() {
    setFail("");
    const usernameRegex = /^[A-Za-z0-9]{3,20}$/
    if (username === "" || !usernameRegex.test(username)) {
        setUsernameError("Username cannot include spaces, special characters, and must be 3-20 letters")
        return;
    }

    setIsSaving(true);
    setUsernameError("");

    try {
      const res = await fetch("/api/user/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username }),
      });

      if (!res.ok) {
        // backend might return JSON error { message: "..." }
        setFail(`Save failed. Please try again later. (${res.status})`);
        try {
          const data = await res.json();
          if (data?.message) msg = data.message;
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
    setUsername("");
    setIsSaving(false);
    setOpen(false);
    setUsernameError("");
    setFail("");
  };
  return (
    <div className="element-username">
      <button className="btn-username btn-username-change" onClick={() => setOpen(true)}>
        Change Username
      </button>

      <Popup open={open} onClose={handleClose} title="Change Username" fail_msg={usernameFail}>
        <h2>Enter your new username</h2>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            className="input-username"
            placeholder="Type here..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave();
            }}
          />

          <button
            className="btn-username btn-username-save"
            onClick={handleSave}
            disabled={isSaving}
            type="button"
          >
            {isSaving ? "Saving..." : "Save"}
          </button>

        </div>
        {usernameError ? <p className="error-msg">{usernameError}</p> : ""}
      </Popup>
    </div>
  );
}
