import { useState } from "react";
import "./PopupStarter.css";
import Popup from "./Popup"

export default function PUStarter() {
  const [open, setOpen] = useState(false);

  return (
    <div className="page">
      <button className="btn btn-primary" onClick={() => setOpen(true)}>
        Open Popup
      </button>

      <Popup open={open} onClose={() => setOpen(false)} title="Starter">
        <p>Put something here.</p>
        <div style={{ display: "flex", gap: 8 }}>
          <input className="input" placeholder="Type here..." />
          <button className="btn btn-primary">Action</button>
        </div>
      </Popup>
    </div>
  );
}
