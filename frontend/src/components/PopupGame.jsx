import { useState } from "react";
import "./PopupGame.css";
import Popup from "./Popup"

export default function PUGame({game, gameModifier, which, isAdding}) {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState([null, null, null, null]);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [unselected, setUnselected] = useState([['lol', 'src/gameImages/lol.webp'], 
        ['minecraft', 'src/gameImages/minecraft.webp'],
        ['minecraft', 'src/gameImages/minecraft.webp'],
        ['minecraft', 'src/gameImages/minecraft.webp'],
        ['minecraft', 'src/gameImages/minecraft.webp'],
        ['minecraft', 'src/gameImages/minecraft.webp'],
        ['minecraft', 'src/gameImages/minecraft.webp']]);
    const [isSaving, setIsSaving] = useState(false);
    const [gmeFail, setFail] = useState("");

    async function handleGet() {
        setFail("");
        try {
            const res = await fetch("/api/user/???", {
                method: "GET",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("access_token")}` },
            });
            if (!res.ok) {
                setFail(`Failed to fetch game data. Please try again later. (${res.status})`);
            }
            const data = await res.json();
            console.log(data);
            setUnselected(data.unselected);
        } catch (e) {
            setFail(`Failed to fetch game data. Please try again later. (${e.message})`);
        } finally {
        }
    }
    async function handleSave() {
        setFail("");
        console.log(selected)
        if (selected[0] == null) {
            setFail(`You must select a game before save!`);
            return;
        }

        setIsSaving(true);

        try {
            const res = await fetch("/api/user/me", {
                method: "PATCH",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("access_token")}` },
                body: JSON.stringify({ games: selected }),
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
            gameModifier(selected);
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
            {which != null? 
                <button className="btn-game btn-game-image" onClick={() => {setOpen(true);}}>
                    <img className="popup-game-image" src={game[which][1]} alt={game[which][0]} />
                    <span>{game[which][0]}</span>
                </button> :
                <button className="btn-game btn-game-image" onClick={() => {setOpen(true);}}>
                    <img className="popup-game-image" src={"src/gameImages/select.webp"} alt={"Select Your Game"} />
                    <span>{"Select Your Game"}</span>
                </button>
            }
            

            <Popup open={open} onClose={handleClose} title="Change Game" fail_msg={gmeFail} className="popup-game">
                <div style={{ display: "flex", gap: 8 }}>
                    {unselected.length > 0 && (
                        <div className="game-input-container">
                            {unselected.map(([alt, src], index) => (
                                <img key={`${alt}-${index}`} 
                                    className={`popup-game-image popup-game-${selectedIndex === index ? "selected" : ""}`} 
                                    src={src} 
                                    alt={alt} 
                                    onClick={() => {setSelected([alt, src, null, null]); setSelectedIndex(index);}}
                                />
                            ))}
                        </div>
                    )}

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
