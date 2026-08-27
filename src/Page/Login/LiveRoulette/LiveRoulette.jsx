import React from "react";
import "./LiveRoulette.css";

function LiveRoulette({ onBack }) {
  const rouletteUrl = "https://www.247roulette.org/";

  return (
    <div className="live-roulette-page">

      {/* HEADER */}
      <header className="live-roulette-header">
        <button
          className="back-button"
          onClick={onBack}
        >
          ← Back
        </button>

        <div className="live-brand">
          BET<span>ZONE</span>
        </div>

        <div className="live-status">
          <span className="live-dot"></span>
          LIVE ROULETTE
        </div>
      </header>

      {/* TITLE */}
      <section className="roulette-title">
        <span className="roulette-label">
          🎰 CASINO
        </span>

        <h1>Live Roulette</h1>

        <p>
          Roulette experience inside BETZONE.
        </p>
      </section>

      {/* GAME CONTAINER */}
      <section className="roulette-container">

        <div className="roulette-topbar">
          <div>
            <span className="green-dot"></span>
            Roulette
          </div>

          <span className="external-label">
            247 Roulette
          </span>
        </div>

        <div className="roulette-frame">

          <iframe
            src={rouletteUrl}
            title="247 Roulette"
            className="roulette-iframe"
            allow="fullscreen"
          />

        </div>

        {/* FALLBACK */}
        <div className="roulette-fallback">

          <div className="fallback-icon">
            🎰
          </div>

          <h2>
            Roulette loading issue?
          </h2>

          <p>
            The external roulette provider may not allow
            its game to be displayed inside another website.
          </p>

          <a
            href={rouletteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="open-provider-button"
          >
            Open 247 Roulette
          </a>

        </div>

      </section>

      {/* INFO */}
      <section className="roulette-info-section">

        <div className="info-card">
          <span>🎰</span>

          <div>
            <h3>Roulette</h3>
            <p>
              Play the roulette game provided by
              247Roulette.
            </p>
          </div>
        </div>

        <div className="info-card">
          <span>🔒</span>

          <div>
            <h3>Provider</h3>
            <p>
              Game content is provided by the external
              roulette website.
            </p>
          </div>
        </div>

        <div className="info-card">
          <span>🎮</span>

          <div>
            <h3>Demo Play</h3>
            <p>
              247Roulette describes its games as free
              play-money roulette.
            </p>
          </div>
        </div>

      </section>

    </div>
  );
}

export default LiveRoulette;