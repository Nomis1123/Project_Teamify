import React from 'react'
import { useEffect, useState } from "react";
import "./AdminPage.css";

const Profile = () => {
    const [games, setGames] = useState([{id: 5, title: "Apex", icon_url: "http://media.steampowered.com/steamcommunity/public/images/apps/341800/1d0a322b0184faa755ad99af803dfd7e14add30f.jpg"}]);
    const [selectedGame, setSelectedGame] = useState(null);
    const [genre, setGenre] = useState("");
    const [developer, setDeveloper] = useState("");
    const [rank, setRank] = useState("");
    const [role, setRole] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [preview, setPreview] = useState("");
    const [errMsg, setError] = useState("");
    const [successMsg, setSuccess] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const MAX_IMAGE_SIZE = 5*1024*1024;

    useEffect(() => {
        const loadMe = async () => {
            try {
                const res = await fetch("/api/games", {
                    method: "GET",
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("access_token")}` },
                });
                // console.log("fetch returned:", res.status, res.url);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = await res.json();
                // console.log("response data:", data);
                
                setGames(data.games)
            } catch (e) {
                console.log("error:", e);
            } 
        };

        loadMe();
    }, []);

    async function handleSaveInfo() {
        try {
            setIsSaving(true);

            if (genre === "" || developer === "" || rank === "" || role === "") {
                showErrorMessage("All input fields must be filled!");
                return;
            }

            const res = await fetch("/api/admin/games", {
                method: "PATCH",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("access_token")}` },
                body: JSON.stringify({ gameId: selectedGame, genre: genre, developer: developer, rank: rank, role: role }),
            });

            if (!res.ok) {
                let msg = "";
                try {
                    const data = await res.json();
                    console.log(data);
                    if (data?.status) msg = data.status;
                    showErrorMessage(`Save failed. Please try again later. (${msg})`);
                } catch {}
                throw new Error(msg);
            }
            showSuccessMessage("Save Suceess!");
        } catch (e) {
            showErrorMessage(`Save failed. Please try again later.`);
        } finally {
            setIsSaving(false);
        }
    };

    async function handleSaveImage() {
        try {
            setIsSaving(true);

            if (imageFile === null) {
                showErrorMessage("An image must be uploaded");
                return;
            }

            const formData = new FormData();
            formData.append("image", imageFile);
            formData.append("gameId", selectedGame);
            const res = await fetch("/api/admin/games", {
                method: "PATCH",
                headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
                body: formData,
            });

            if (!res.ok) {
                let msg = "";
                try {
                    const data = await res.json();
                    console.log(data);
                    if (data?.status) msg = data.status;
                    showErrorMessage(`Save failed. Please try again later. (${msg})`);
                } catch {}
                throw new Error(msg);
            }
            showSuccessMessage("Save Suceess!");
        } catch (e) {
            showErrorMessage(`Save failed. Please try again later.`);
        } finally {
            setIsSaving(false);
        }
    };

    function handleUpload() {
        const input = document.createElement("input");
        input.type = "file";
        // Somebody needs to change this to strictly accept jpg/png/jpeg unless otherwise stated
        input.accept = "image/*";

        input.onchange = (e) => {
            const file = e.target.files?.[0];
            if (!file) return;

            // Preview shouldn't update if uploading fails or is invalid
            if (file.size > MAX_IMAGE_SIZE) {
                setFail("Save failed. File too big (5MB max)");
                return;
            }
            const previewUrl = URL.createObjectURL(file);

            setPreview(previewUrl);
            setImageFile(file);
        };

        input.click();
    }

    const showErrorMessage = (message) => {
        setError(message);

        setTimeout(() => {
            setError("");
        }, 1000);
    };

    const showSuccessMessage = (message) => {
        setSuccess(message);

        setTimeout(() => {
            setSuccess("");
        }, 1000);
    };

    useEffect(() => {
        console.log("Image URL changed!");
    }, [preview]);

    return (
        <div className="admin-page">
            {errMsg && (
                <div className="temp-popup-err">
                    {errMsg}
                </div>
            )}
            {successMsg && (
                <div className="temp-popup-succ">
                    {successMsg}
                </div>
            )}
            <div className="admin-card">
                <div className="admin-dropdown-section">
                    <div>
                        <select className="popup-grr-dropdown" value={selectedGame ?? ''} onChange={(e) => setSelectedGame(e.target.value)}>
                            <option value="" disabled> {'Select a game'} </option>
                            {games.map((g) => (<option key={g.id} value={g.id}>{g.title}</option>))}
                        </select>
                    </div>
                </div>
                <div className="admin-input-button">
                    <div className="admin-input-button-info">
                        <div className="admin-input-section admin-info-section-alignment">
                            <div className="admin-input-element">
                                <div className="admin-input-left">
                                    Genre:
                                </div>
                                <input
                                    className="admin-input-right"
                                    placeholder="Enter the game genre"
                                    value={genre}
                                    onChange={(e) => setGenre(e.target.value)}
                                /> 
                            </div>
                            <div className="admin-input-element">
                                <div className="admin-input-left">
                                    Developer: 
                                </div>
                                <input
                                    className="admin-input-right"
                                    placeholder="Enter the game developer"
                                    value={developer}
                                    onChange={(e) => setDeveloper(e.target.value)}
                                />  
                            </div>
                            <div className="admin-input-element">
                                <div className="admin-input-left">
                                    Rank: 
                                </div>
                                <input
                                    className="admin-input-right"
                                    placeholder="Enter the game ranks, e.g. rank1,rank2,..."
                                    value={rank}
                                    onChange={(e) => setRank(e.target.value)}
                                />  
                            </div>
                            <div className="admin-input-element">
                                <div className="admin-input-left">
                                    Role: 
                                </div>
                                <input
                                    className="admin-input-right"
                                    placeholder="Enter the game roles, e.g. role1,role2,..."
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                />  
                            </div>
                            
                        </div>
                        <div className="admin-button-section">
                            <button className="admin-save-button" onClick={handleSaveInfo} disabled={isSaving}>
                                Save Info
                            </button>
                        </div>
                    </div>
                    <div className="admin-input-button-image">
                        <div className="admin-input-section admin-image-section-alignment">
                            {preview === "" ?
                                <button
                                    className="admin-upload-button"
                                    onClick={handleUpload}
                                    disabled={isSaving}
                                    type="button"
                                >
                                    Upload 
                                </button> : 
                                <button
                                    className="admin-upload-button"
                                    onClick={handleUpload}
                                    disabled={isSaving}
                                    type="button"
                                >
                                    <img
                                        className="admin-image-preview"
                                        src={preview}
                                        alt="Profile"
                                    />
                                </button>
                                }
                        </div>
                        <div className="admin-button-section">
                            <button className="admin-save-button" onClick={handleSaveImage} disabled={isSaving}>
                                Save Image
                            </button>
                        </div>

                    </div>
                </div>
                
            </div>
        </div>
    );
};

export default Profile;
