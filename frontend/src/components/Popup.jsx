import { useEffect } from "react";
import "./Popup.css";

export default function Popup({ open, onClose, title = "Popup" , children, fail_msg }) {
  // Close on esc
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="popup-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="presentation"
    >
      <div className="popup" role="dialog" aria-popup="true" aria-label={title}>
        <div className="popup-header">
          <h2 className="popup-title">{title}</h2>
          <button className="popup-close" onClick={onClose} aria-label="Close">
            Cancel
          </button>
        </div>

        <div className="popup-body">
          {children}
        </div>

        <div className="popup-footer">
          {fail_msg ? <p className="error-msg">{fail_msg}</p> : ""}
        </div>
      </div>
    </div>
  );
}