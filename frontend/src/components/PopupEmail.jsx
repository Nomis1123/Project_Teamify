import { useState } from "react";
import "./PopupEmail.css";
import Popup from "./Popup"

export default function PUEmail() {
  const [open, setOpen] = useState(false);

  return (
    <div className="element-email">
      <button className="btn-email btn-email-change" onClick={() => setOpen(true)}>
        Change Email
      </button>

      <Popup open={open} onClose={() => setOpen(false)} title="Change Email">
        <h2>Enter your new Email Address</h2>
        <div style={{ display: "flex", gap: 8 }}>
          <input className="input" placeholder="Type here..." />
          <button className="btn-email btn-email-save">Save</button>
        </div>
      </Popup>
    </div>
  );
}
