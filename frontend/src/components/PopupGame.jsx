import { useState } from "react";
import "./PopupGame.css";
import Popup from "./Popup"

export default function PUGame({games, gameModifier, which, isAdding}) {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [unselected, setUnselected] = useState([]);
    const [isSaving, setIsSaving] = useState(false);
    const [gmeFail, setFail] = useState("");

    async function handleGet() {
        setFail("");
        try {
            const res = await fetch("/api/users/me/unowned", {
                method: "GET",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("access_token")}` },
            });
            if (!res.ok) {
                setFail(`Failed to fetch game data. Please try again later.`);
            }
            const data = await res.json();
            // console.log(data);
            const normalized_games = data.map((game) => ({
                id: game.id ?? "", 
                title: game.title ?? "",
                thumbnail_url: game.thumbnail_url ?? null,
            }));
            setUnselected(normalized_games);
        } catch (e) {
            setFail(`Failed to fetch game data. Please try again later.`);
        } finally {
        }
    }
    async function handleSave() {
        setFail("");
        if (selected === null) {
            setFail(`You must select a game before save!`);
            return;
        }

        setIsSaving(true);

        const update = isAdding? [...games, selected]: 
            (() => {
                const u = [...games];
                u[which] = selected;
                return u;
            })();
        // gameModifier(update);

        try {
            const res = await fetch("/api/user/me", {
                method: "PATCH",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("access_token")}` },
                body: JSON.stringify({ owned_games: update }),
            });

            if (!res.ok) {
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
            gameModifier(update);
        } catch (e) {
            setFail(`Save failed. Please try again later. (${e.message})`);
        } finally {
            setIsSaving(false);
        }
    };
    function handleClose() {
        setIsSaving(false);
        setOpen(false);
        setFail("");
        setSelected(null);
        setUnselected([]);
        setSelectedIndex(null);
    };

    return (
        <div className="element-game">
            {which != null? 
                <button className="btn-game btn-game-image" onClick={() => {setOpen(true); handleGet();}}>
                    <img className="popup-game-image" src={games[which]['thumbnail_url']? games[which]['thumbnail_url'] : "http://138.197.132.126:8000/uploads/default_game_card.png"} alt={games[which]['title']} />
                    <div className="popup-game-text">{games[which]['title']}</div>
                </button> :
                <button className="btn-game btn-game-image" onClick={() => {setOpen(true); handleGet();}}>
                    <img className="popup-game-image" src={"src/gameImages/select.webp"} alt={"Select Your Game"} />
                    <span>{"Select Your Game"}</span>
                </button>
            }
            

            <Popup open={open} onClose={handleClose} title="Change Game" fail_msg={gmeFail} 
                body_height="popup-game-body-height" popup_width="popup-game-popup-width">
                <div style={{ display: "flex", gap: 8 }}>
                    {unselected.length > 0 && (
                        <div className="game-input-container">
                            {unselected.map(({ id, title, thumbnail_url }, index) => (
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <img
                                        key={`${title}-${index}`}
                                        className={`popup-game-image ${selectedIndex === index ? "popup-game-selected" : ""}`}
                                        src={thumbnail_url? thumbnail_url : "http://138.197.132.126:8000/uploads/default_game_card.png"}
                                        alt={title}
                                        onClick={() => {
                                            setSelected({ id, title, thumbnail_url });
                                            setSelectedIndex(index);
                                        }}
                                    />
                                    <div className="popup-game-text">{title}</div>
                                </div>
                                
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
