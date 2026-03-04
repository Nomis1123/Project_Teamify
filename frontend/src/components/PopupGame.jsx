import { useState } from "react";
import "./PopupGame.css";
import Popup from "./Popup"

export default function PUGame({game, gameModifier}) {
    const [open, setOpen] = useState(false);
    const [gme, setGme] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [gmeFail, setFail] = useState("");

    async function handleSave() {
        setFail("");
        setIsSaving(true);

        try {
            const res = await fetch("/api/user/me", {
                method: "PATCH",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("access_token")}` },
                body: JSON.stringify({ games: gme }),
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
            gameModifier(gme);
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
        setFail("");
    };

    return (
        <div className="element-game">
            <button className="btn-game btn-game-change" onClick={() => {setOpen(true); setGme(game);}}>
                Change game
            </button>

            <Popup open={open} onClose={handleClose} title="Change Game" fail_msg={gmeFail} className="popup-game">
                <div style={{ display: "flex", gap: 8 }}>
                    <div className="game-input-container">
                        {/* Put game images display here */}
                    </div>

                    <div className="game-save-container">
                        <button
                            className="btn-game btn-game-save"
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
