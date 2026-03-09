import { use, useState } from "react";
import "./PopupGRR.css";
import Popup from "./Popup"

export default function PUGRR({games, gameModifier, which}) {
    const [open, setOpen] = useState(false);
    // const [rank, setRank] = useState(['Iron', 'Silver', 'Gold']);
    // const [role, setRole] = useState(['Top', 'Support', 'ADC']);
    const [rank, setRank] = useState([]);
    const [role, setRole] = useState([]);
    const [selectedRank, setSelectedRank] = useState('');
    const [selectedRole, setSelectedRole] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [gmeFail, setFail] = useState("");

    async function handleGet() {
        setFail("");
        try {
            const res = await fetch("/api/user/???", {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("access_token")}` },
                body: { 'title': games[which]['title']},
            });
            if (!res.ok) {
                setFail(`Failed to fetch game rank and role data. Please try again later.`);
            }
            const data = await res.json();
            console.log(data);
            setRank(data.rank);
            setRole(data.role);
        } catch (e) {
            setFail(`Failed to fetch game rank and role data. Please try again later.`);
        } finally {
            setSelectedRank(games[which]['rank']? games[which]['rank'] : '');
            setSelectedRole(games[which]['role']? games[which]['role'] : '');
        }
    }
    async function handleSave() {
        setFail("");

        setIsSaving(true);

        const update = (() => {
                const u = [...games];
                const replacement = {}
                replacement['title'] = u[which]['title'];
                replacement['url'] = u[which]['url'];

                if (selectedRank != '') {
                    replacement['rank'] = selectedRank;
                }
                if (selectedRole != '') {
                    replacement['role'] = selectedRole;
                }
                u[which] = replacement;
                return u;
            })();
        // gameModifier(update);

        try {
            const res = await fetch("/api/user/me", {
                method: "PATCH",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("access_token")}` },
                body: JSON.stringify({ games: update }),
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
            gameModifier(update);
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
        setRank([]);
        setRole([]);
        setSelectedRank('');
        setSelectedRole('');
    };

    return (
        <div className="element-grr">
            <button className="btn-grr btn-grr-image btn-grr-rr" onClick={() => {setOpen(true); handleGet();}}>
                <span>Rank: {games[which]['rank']? games[which]['rank']:'-'}</span>
                <span>Role: {games[which]['role']? games[which]['role']:'-'}</span>
            </button>
            

            <Popup open={open} onClose={handleClose} title="Change Game Rank and Role" fail_msg={gmeFail} 
                body_height="popup-grr-body-height" popup_width="popup-grr-popup-width">
                <div style={{ display: "flex", gap: 8 }}>
                    <div className="grr-image-container">
                        <img className="popup-game-image" src={games[which]['url']} alt={games[which]['title']}/>
                    </div>
                    <div className="grr-rr-container">
                        <div className="popup-grr-dropdown-container">
                            <h2>Rank: </h2>

                            <select className="popup-grr-dropdown" value={selectedRank ?? ''} onChange={(e) => setSelectedRank(e.target.value)}>
                                <option value="" disabled> {'Select a rank'} </option>
                                {rank.map((opt) => (<option key={opt} value={opt}>{opt}</option>))}
                            </select>
                        </div>

                        <div className="popup-grr-dropdown-container">
                            <h2>Role: </h2>

                            <select className="popup-grr-dropdown" value={selectedRole ?? ''} onChange={(e) => setSelectedRole(e.target.value)}>
                                <option value="" disabled> {'Select a role'} </option>
                                {role.map((opt) => (<option key={opt} value={opt}>{opt}</option>))}
                            </select>
                        </div>
                        
                    </div>

                    <div className="grr-save-container">
                        <button
                            className="btn-grr btn-grr-save"
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
