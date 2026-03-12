import { use, useState } from "react";
import "./PopupImage.css";
import Popup from "./Popup"

export default function PUPFImage({image, imageModifier}) {
    const [open, setOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [preview, setPreview] = useState("");
    const [imageFile, setImageFile] = useState();
    const [imageFail, setFail] = useState("");

async function handleSave() {
        setFail("");

        setIsSaving(true);

        // imageModifier(preview);

        try {
            const formData = new FormData();
            formData.append("image", imageFile);
            const res = await fetch("/api/user/me", {
                method: "PATCH",
                headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
                body: formData,
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
            } else {
                const data = await res.json();
                setPreview(data.public_url);
            }
            handleClose();
            imageModifier(preview);
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
        setPreview("");
    };
    function handleUpload() {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";

        input.onchange = (e) => {
            const file = e.target.files?.[0];
            if (!file) return;

            const previewUrl = URL.createObjectURL(file);

            setPreview(previewUrl);
            setImageFile(file);
        };

        input.click();
        }

    return (
        <div className="element-pfimage">
            <button className="btn-pfimage btn-pfimage-image" onClick={() => {setOpen(true);}}>
                <img
                    className="popup-pfimage-image-auto"
                    src={image}
                    alt="Profile"
                />
            </button>

            <Popup open={open} onClose={handleClose} title="Change Profile Image" fail_msg={imageFail} 
                body_height="popup-pfimage-body-height" popup_width="popup-pfimage-popup-width">
                <div style={{ display: "flex", gap: 8 }}>
                    <div className="pfimage-image-container">
                        <img
                            className="popup-pfimage-image-fixed"
                            src={preview === ""? image : preview}
                            alt="Profile"
                        />
                    </div>

                    <div className="pfimage-save-container" style={{ gap: 8 }}>
                        <button
                            className="btn-pfimage btn-pfimage-save"
                            onClick={handleUpload}
                            disabled={isSaving}
                            type="button"
                        >
                            Upload
                        </button>
                        <button
                            className="btn-pfimage btn-pfimage-save"
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
