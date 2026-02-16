import { useState } from "react";
import "./PopupPassword.css";
import Popup from "./Popup"

export default function PUPassword() {
  const [open, setOpen] = useState(false);

  return (
    <div className="element-pwd">
      <button className="btn-pwd btn-pwd-change" onClick={() => setOpen(true)}>
        Change Password
      </button>

      <Popup open={open} onClose={() => setOpen(false)} title="Change Password">
        <h2>Enter your old password</h2>
    
        <div style={{ display: "flex" }}>
            <input className="input" placeholder="Type here..." />
        </div>
        <h2>Enter your new password</h2>
        <div style={{ display: "flex" }}>
            <input className="input" placeholder="Type here..." />
        </div>
        <h2>Confirm your new password</h2>
        <div style={{ display: "flex" }}>
            <input className="input" placeholder="Type here..." />
        </div>
        <div style={{ display: "flex" }}>
            <button className="btn-pwd btn-pwd-save">Save</button>
        </div>
        
      </Popup>
    </div>
  );
}
