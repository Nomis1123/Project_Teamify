import { useState } from "react";
import "./PopupUsername.css";
import Popup from "./Popup"

export default function PUUsername() {
  const [open, setOpen] = useState(false);

  return (
    <div className="element-username">
      <button className="btn-username btn-username-change" onClick={() => setOpen(true)}>
        Change Username
      </button>

      <Popup open={open} onClose={() => setOpen(false)} title="Change Username">
        <h2>Enter your new Username</h2>
        <div style={{ display: "flex", gap: 8 }}>
          <input className="input" placeholder="Type here..." />
          <button className="btn-username btn-username-save">Save</button>
        </div>
      </Popup>
    </div>
  );
}
