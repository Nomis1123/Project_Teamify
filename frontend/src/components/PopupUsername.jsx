import { useState } from "react";
import "./PopupUsername.css";
import Popup from "./Popup"

export default function PUUsername({username, usernameModifier}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("")
  const [isSaving, setIsSaving] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const [usernameFail, setFail] = useState("");

  async function handleSave() {
    setFail("");
    const usernameRegex = /^[A-Za-z0-9]{3,20}$/
    if (name === "" || !usernameRegex.test(name)) {
        setUsernameError("Username cannot include spaces, special characters, and must be 3-20 letters")
        return;
    }

    setIsSaving(true);
    setUsernameError("");
    // This is for test only
    // usernameModifier(name);

    try {
      const res = await fetch("/api/user/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("access_token")}` },
        body: JSON.stringify({ username: name }),
      });

      if (!res.ok) {
        // backend might return JSON error { message: "..." }
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
      usernameModifier(name);
    } catch (e) {
      // setFail(e instanceof Error ? e.message : "Save failed.");
      setFail(`Save failed. Please try again later. (${e.message})`);
    } finally {
      setIsSaving(false);
    }
  };
  function handleClose() {
    setName("");
    setIsSaving(false);
    setOpen(false);
    setUsernameError("");
    setFail("");
  };
  return (
    <div className="element-username">
      <button className="btn-username btn-username-change" onClick={() => {setOpen(true); setName(username);}}>
        Change Username
      </button>

      <Popup open={open} onClose={handleClose} title="Change Username" fail_msg={usernameFail} className="popup-username">
        <h2>Enter your new username</h2>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            className="input-username"
            placeholder="Type here..."
            value={name}
            onChange={(e) => setName(e.target.value)}
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
