import { useMemo, useState } from "react";
import "./GamePicker.css";

export default function GamePicker({ games }) {
  const options = useMemo(() => {
    // games can be an array of {id,name,img}
    return (games ?? []).map((g, idx) =>
      typeof g === "string"
        ? { id: `${idx}`, name: g, img: `/games/${g}.png` } // adjust mapping
        : g
    );
  }, [games]);

  const [selectedGame, setSelectedGame] = useState(options[0] ?? null);
  const [open, setOpen] = useState(false);

  if (!selectedGame) {
    return <div className="profile-game-image-text-container">No games</div>;
  }

  return (
    <div style={{ position: "relative" }}>
      <div
        className="profile-game-image-text-container"
        onClick={() => setOpen(true)}
        style={{ cursor: "pointer" }}
      >
        <img className="profile-game-image" src={selectedGame.img} alt={selectedGame.name} />
        <span>{selectedGame.name}</span>
      </div>

      {open && (
        <div className="game-picker-backdrop" onClick={() => setOpen(false)}>
          <div className="game-picker-panel" onClick={(e) => e.stopPropagation()}>
            <div className="game-picker-header">
              <h3>Choose a game</h3>
              <button onClick={() => setOpen(false)}>✕</button>
            </div>

            <div className="game-grid">
              {options.map((g) => (
                <button
                  key={g.id}
                  className={`game-item ${g.id === selectedGame.id ? "selected" : ""}`}
                  onClick={() => {
                    setSelectedGame(g);
                    setOpen(false);
                  }}
                >
                  <img src={g.img} alt={g.name} />
                  <span>{g.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
