import React from "react";
import "./Games.css";

const games = [
  {
    name: "Poker",
    logo: "♠️",
    emoji: "🃏",
    theme: "purple",
  },
  {
    name: "Solitaire",
    logo: "♣️",
    emoji: "👑",
    theme: "green",
  },
  {
    name: "UNO",
    logo: "UNO",
    emoji: "🎴",
    theme: "red",
  },
  {
    name: "Rummy",
    logo: "♦️",
    emoji: "🃏",
    theme: "blue",
  },
  {
    name: "Blackjack",
    logo: "21",
    emoji: "🂡",
    theme: "gold",
  },
  {
    name: "Bridge",
    logo: "♠️",
    emoji: "🃏",
    theme: "green",
  },
  {
    name: "Hearts",
    logo: "♥️",
    emoji: "❤️",
    theme: "red",
  },
  {
    name: "Spades",
    logo: "♠️",
    emoji: "🃏",
    theme: "blue",
  },
  {
    name: "Cribbage",
    logo: "♣️",
    emoji: "🎯",
    theme: "gold",
  },
  {
    name: "Cards Against Humanity",
    logo: "CAH",
    emoji: "🖤",
    theme: "purple",
  },
];

function Games({ onHome, onAccount, onLogout }) {
  const openGame = (game) => {
    alert(`${game.name}\n\nCOMING SOON\n\nWe will activate games one by one.`);
  };

  return (
    <div className="games-page">

      {/* HEADER */}
      <header className="games-header">
        <div className="games-logo">
          BET<span>ZONE</span>
        </div>

        <nav className="games-nav">
          <button onClick={onHome}>⚽ Sports</button>
          <button>📡 Live</button>
          <button>🎰 Casino</button>
          <button className="active">🎮 Games</button>
          <button>🏆 Esports</button>
        </nav>

        <div className="games-user">
          <div className="balance">
            🪙 NPR 10,000.00
          </div>

          <button onClick={onAccount}>Account</button>
          <button className="logout" onClick={onLogout}>
            Logout
          </button>
        </div>
      </header>

      {/* MOBILE NAV */}
      <div className="mobile-top-nav">
        <button>☰</button>

        <div className="mobile-logo">
          BET<span>ZONE</span>
        </div>

        <div className="mobile-balance">
          🪙 10K
        </div>
      </div>

      {/* MAIN */}
      <main className="games-main">

        {/* SIDEBAR */}
        <aside className="games-sidebar">

          <h3>CATEGORIES</h3>

          <button>
            🎰
            <span>Slots</span>
          </button>

          <button className="selected">
            🃏
            <span>Card Games</span>
          </button>

          <button>
            🎲
            <span>Dice</span>
          </button>

          <button>
            ⚡
            <span>Fast Games</span>
          </button>

          <button>
            🔴
            <span>Live Games</span>
          </button>

          <button>
            🏆
            <span>Esports</span>
          </button>

          <div className="bonus-box">
            <small>WELCOME BONUS</small>

            <h2>100%</h2>

            <p>UP TO</p>

            <strong>NPR 10,000</strong>

            <div className="bonus-gift">
              🎁
            </div>

            <button>Claim Now</button>
          </div>

        </aside>

        {/* CONTENT */}
        <section className="games-content">

          <div className="games-title">
            <div className="title-icon">👑</div>

            <div>
              <h1>CARD GAMES</h1>
              <p>
                Classic card games of skill, strategy and fun
              </p>
            </div>
          </div>

          {/* GAMES GRID */}
          <div className="card-games-grid">

            {games.map((game) => (
              <div
                key={game.name}
                className={`game-card ${game.theme}`}
                onClick={() => openGame(game)}
              >

                <div className="game-card-inner">

                  <div className="game-art">

                    <div className="floating-card card-one">
                      {game.logo}
                    </div>

                    <div className="floating-card card-two">
                      {game.emoji}
                    </div>

                    <div className="game-big-logo">
                      {game.logo}
                    </div>

                    <div className="game-logo-text">
                      {game.name}
                    </div>

                  </div>

                  <div className="game-info">

                    <h2>{game.name}</h2>

                    <span className="coming-soon">
                      COMING SOON
                    </span>

                  </div>

                </div>

              </div>
            ))}

          </div>

          {/* FEATURES */}
          <div className="features">

            <div className="feature">
              <span>🔒</span>
              <div>
                <b>SAFE & SECURE</b>
                <small>Protected account</small>
              </div>
            </div>

            <div className="feature">
              <span>⚡</span>
              <div>
                <b>INSTANT PLAY</b>
                <small>No download</small>
              </div>
            </div>

            <div className="feature">
              <span>🛡️</span>
              <div>
                <b>FAIR PLAY</b>
                <small>Fair gaming</small>
              </div>
            </div>

            <div className="feature">
              <span>🎧</span>
              <div>
                <b>24/7 SUPPORT</b>
                <small>We're here</small>
              </div>
            </div>

          </div>

        </section>
      </main>

      {/* MOBILE BOTTOM NAV */}
      <div className="mobile-bottom-nav">

        <button onClick={onHome}>
          <span>⌂</span>
          Home
        </button>

        <button>
          <span>🎁</span>
          Offers
        </button>

        <button className="deposit-button">
          <span>💳</span>
          Deposit
        </button>

        <button>
          <span>↗</span>
          Withdraw
        </button>

        <button onClick={onAccount}>
          <span>•••</span>
          More
        </button>

      </div>

    </div>
  );
}

export default Games;