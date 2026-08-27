import { useState } from "react";
import "./Home.css";

const fastGames = [
  {
    name: "Ludo",
    icon: "🎲",
    description: "Classic multiplayer board game",
  },
  {
    name: "Dice",
    icon: "🎲",
    description: "Fast dice action",
  },
  {
    name: "Crash",
    icon: "✈️",
    description: "Watch the multiplier rise",
  },
  {
    name: "Plinko",
    icon: "🔴",
    description: "Drop and watch the ball",
  },
  {
    name: "Mines",
    icon: "💣",
    description: "Find the safe tiles",
  },
  {
    name: "Heads or Tails",
    icon: "🪙",
    description: "Simple coin flip",
  },
];

const liveGames = [
  "Live Roulette",
  "Live Blackjack",
  "Live Baccarat",
  "Live Poker",
];

const esports = [
  "CS 2",
  "Dota 2",
  "League of Legends",
  "Mobile Legends",
  "Valorant",
];

/* =========================================================
   CARD GAMES
========================================================= */

const cardGames = [
  {
    name: "Poker",
    logo: "♠",
    short: "POKER",
    description: "Strategy and skill card game",
    className: "poker-card",
  },
  {
    name: "Solitaire",
    logo: "♦",
    short: "SOLITAIRE",
    description: "Classic single-player cards",
    className: "solitaire-card",
  },
  {
    name: "UNO",
    logo: "UNO",
    short: "UNO",
    description: "Color matching card game",
    className: "uno-card",
  },
  {
    name: "Rummy",
    logo: "♥",
    short: "RUMMY",
    description: "Classic matching card game",
    className: "rummy-card",
  },
  {
    name: "Blackjack",
    logo: "21",
    short: "BLACKJACK",
    description: "Classic 21 card game",
    className: "blackjack-card",
  },
  {
    name: "Bridge",
    logo: "♣",
    short: "BRIDGE",
    description: "Strategic partnership cards",
    className: "bridge-card",
  },
  {
    name: "Hearts",
    logo: "♥",
    short: "HEARTS",
    description: "Classic trick-taking game",
    className: "hearts-card",
  },
  {
    name: "Spades",
    logo: "♠",
    short: "SPADES",
    description: "Partnership trick-taking game",
    className: "spades-card",
  },
  {
    name: "Cribbage",
    logo: "♛",
    short: "CRIBBAGE",
    description: "Classic scoring card game",
    className: "cribbage-card",
  },
  {
    name: "Cards Against Humanity",
    logo: "CAH",
    short: "CAH",
    description: "Party card game",
    className: "cah-card",
  },
];

const categories = [
  {
    icon: "🎰",
    name: "Slots",
  },
  {
    icon: "🃏",
    name: "Card Games",
  },
  {
    icon: "🎲",
    name: "Dice",
  },
  {
    icon: "🎯",
    name: "Fast Games",
  },
  {
    icon: "🎥",
    name: "Live Games",
  },
  {
    icon: "🏆",
    name: "Esports",
  },
];

function Home({
  onLogout,
  onAccount,
  onCrashGame,
  onDiceGame,
  onMinesGame,
  onLiveRoulette,
}) {
  const [showOffer, setShowOffer] = useState(true);

  function getBalance() {
    const value = Number(
      localStorage.getItem("userBalance") || 0
    );

    return Number.isFinite(value) ? value : 0;
  }

  function openGame(game) {
    if (game === "Crash") {
      if (onCrashGame) {
        onCrashGame();
      }
      return;
    }

    if (game === "Dice") {
      if (onDiceGame) {
        onDiceGame();
      }
      return;
    }

    if (game === "Mines") {
      if (onMinesGame) {
        onMinesGame();
      }
      return;
    }

    alert(`${game} game is coming soon.`);
  }

  function openLiveGame(game) {
    if (game === "Live Roulette") {
      if (onLiveRoulette) {
        onLiveRoulette();
      }
      return;
    }

    alert(`${game} is coming soon.`);
  }

  function openCardGame(game) {
    alert(`${game} is coming soon.`);
  }

  function exploreGames() {
    const element =
      document.getElementById("fast-games");

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }

  function scrollToCards() {
    const element =
      document.getElementById("card-games");

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }

  function viewSports() {
    alert("Sports section is coming soon.");
  }

  return (
    <div className="home-page">

      {/* =================================================
          OFFER POPUP
      ================================================= */}

      {showOffer && (
        <div
          className="offer-overlay"
          onClick={() => setShowOffer(false)}
        >
          <div
            className="offer-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <button
              type="button"
              className="offer-close"
              onClick={() => setShowOffer(false)}
              aria-label="Close offer"
            >
              ×
            </button>

            <img
              src="/offer.png"
              alt="Welcome offer"
              className="offer-image"
              onError={(event) => {
                event.currentTarget.style.display =
                  "none";

                const errorBox =
                  document.getElementById(
                    "offer-image-error"
                  );

                if (errorBox) {
                  errorBox.style.display = "flex";
                }
              }}
            />

            <div
              id="offer-image-error"
              className="offer-image-error"
            >
              <div className="offer-error-icon">
                🖼️
              </div>

              <strong>
                Offer image not found
              </strong>

              <p>
                Make sure the file is inside:
                <br />
                <b>public/offer.png</b>
              </p>
            </div>

            <div className="offer-footer">
              <button
                type="button"
                onClick={() =>
                  setShowOffer(false)
                }
              >
                Continue
              </button>
            </div>

          </div>
        </div>
      )}

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="home-header">

        <div className="home-logo">
          BET<span>ZONE</span>
        </div>

        <nav className="home-nav">

          <button
            type="button"
            onClick={viewSports}
          >
            Sports
          </button>

          <button
            type="button"
            onClick={() => {
              const live =
                document.querySelector(
                  ".live-games-section"
                );

              if (live) {
                live.scrollIntoView({
                  behavior: "smooth",
                });
              }
            }}
          >
            Live
          </button>

          <button
            type="button"
            onClick={() =>
              alert(
                "Casino section is coming soon."
              )
            }
          >
            Casino
          </button>

          <button
            type="button"
            onClick={exploreGames}
          >
            Games
          </button>

          <button
            type="button"
            onClick={() =>
              alert(
                "Esports section is coming soon."
              )
            }
          >
            Esports
          </button>

        </nav>

        <div className="header-actions">

          <button
            type="button"
            className="balance"
            onClick={onAccount}
          >
            Balance: NPR{" "}
            {getBalance().toLocaleString(
              undefined,
              {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }
            )}
          </button>

          <button
            type="button"
            className="profile"
            onClick={onAccount}
          >
            Account
          </button>

          <button
            type="button"
            className="profile"
            onClick={onLogout}
          >
            Logout
          </button>

        </div>

      </header>

      {/* =================================================
          HERO
      ================================================= */}

      <section className="hero-section">

        <div className="hero-content">

          <span className="hero-tag">
            WELCOME TO BETZONE
          </span>

          <h1>
            Your Gaming
            <br />
            <strong>
              Entertainment Hub
            </strong>
          </h1>

          <p>
            Explore fast games, card games,
            live entertainment and esports
            from one modern gaming platform.
          </p>

          <div className="hero-buttons">

            <button
              type="button"
              className="primary-btn"
              onClick={exploreGames}
            >
              Explore Games →
            </button>

            <button
              type="button"
              className="secondary-btn"
              onClick={scrollToCards}
            >
              Card Games
            </button>

          </div>

        </div>

        <div className="hero-card">

          <div className="hero-card-icon">
            ★
          </div>

          <h3>
            Featured Games
          </h3>

          <p>
            Discover fast games, card games
            and live entertainment.
          </p>

          <button
            type="button"
            className="primary-btn"
            onClick={exploreGames}
          >
            Explore Now
          </button>

        </div>

      </section>

      {/* =================================================
          CATEGORIES
      ================================================= */}

      <section className="section">

        <div className="section-heading">

          <h2>
            Game Categories
          </h2>

          <button
            type="button"
            onClick={exploreGames}
          >
            View All →
          </button>

        </div>

        <div className="category-grid">

          {categories.map((category) => (

            <button
              type="button"
              className="category-card"
              key={category.name}
              onClick={
                category.name === "Card Games"
                  ? scrollToCards
                  : exploreGames
              }
            >

              <div className="category-icon">
                {category.icon}
              </div>

              <span>
                {category.name}
              </span>

            </button>

          ))}

        </div>

      </section>

      {/* =================================================
          CARD GAMES
      ================================================= */}

      <section
        className="section card-games-section"
        id="card-games"
      >

        <div className="section-heading">

          <div>

            <h2>
              Card Games
            </h2>

            <p className="section-subtitle">
              Classic card games — one by one
              coming soon.
            </p>

          </div>

          <span className="coming-badge">
            COMING SOON
          </span>

        </div>

        <div className="card-game-grid">

          {cardGames.map((game) => (

            <button
              type="button"
              className={`card-game-item ${game.className}`}
              key={game.name}
              onClick={() =>
                openCardGame(game.name)
              }
            >

              <div className="playing-card-back">

                <div className="card-corner top">
                  {game.logo}
                </div>

                <div className="card-logo">
                  {game.logo}
                </div>

                <div className="card-name">
                  {game.short}
                </div>

                <div className="card-corner bottom">
                  {game.logo}
                </div>

              </div>

              <div className="card-game-info">

                <h3>
                  {game.name}
                </h3>

                <p>
                  {game.description}
                </p>

                <span className="card-coming">
                  Coming Soon
                </span>

              </div>

            </button>

          ))}

        </div>

      </section>

      {/* =================================================
          FAST GAMES
      ================================================= */}

      <section
        className="section"
        id="fast-games"
      >

        <div className="section-heading">

          <div>

            <h2>
              Fast Games
            </h2>

            <p className="section-subtitle">
              Quick games and instant
              entertainment
            </p>

          </div>

          <button
            type="button"
            onClick={exploreGames}
          >
            View All →
          </button>

        </div>

        <div className="game-grid">

          {fastGames.map((game) => (

            <div
              className="game-card"
              key={game.name}
            >

              <div className="game-image">

                <span>
                  {game.icon}
                </span>

              </div>

              <h3>
                {game.name}
              </h3>

              <p>
                {game.description}
              </p>

              <button
                type="button"
                onClick={() =>
                  openGame(game.name)
                }
              >
                {game.name === "Crash"
                  ? "Play Crash"
                  : game.name === "Dice"
                  ? "Play Dice"
                  : game.name === "Mines"
                  ? "Play Mines"
                  : "Play Now"}
              </button>

            </div>

          ))}

        </div>

      </section>

      {/* =================================================
          LIVE GAMES
      ================================================= */}

      <section
        className="section live-games-section"
      >

        <div className="section-heading">

          <div>

            <h2>
              Live Games
            </h2>

            <p className="section-subtitle">
              Live-style entertainment
            </p>

          </div>

          <button
            type="button"
            onClick={() => {
              if (onLiveRoulette) {
                onLiveRoulette();
              }
            }}
          >
            Live Roulette →
          </button>

        </div>

        <div className="game-grid">

          {liveGames.map((game) => (

            <div
              className="game-card"
              key={game}
            >

              <div className="game-image live-icon">
                <span>
                  LIVE
                </span>
              </div>

              <h3>
                {game}
              </h3>

              <button
                type="button"
                onClick={() =>
                  openLiveGame(game)
                }
              >
                {game === "Live Roulette"
                  ? "Open Roulette"
                  : "Open"}
              </button>

            </div>

          ))}

        </div>

      </section>

      {/* =================================================
          ESPORTS
      ================================================= */}

      <section className="section">

        <div className="section-heading">

          <div>

            <h2>
              Esports
            </h2>

            <p className="section-subtitle">
              Competitive gaming events
            </p>

          </div>

        </div>

        <div className="esports-grid">

          {esports.map((game) => (

            <div
              className="esports-card"
              key={game}
            >

              <span>
                ESPORTS
              </span>

              <h3>
                {game}
              </h3>

              <button
                type="button"
                onClick={() =>
                  alert(
                    `${game} events are coming soon.`
                  )
                }
              >
                View Events
              </button>

            </div>

          ))}

        </div>

      </section>

      {/* =================================================
          FOOTER
      ================================================= */}

      <footer>

        <div className="home-logo">
          BET<span>ZONE</span>
        </div>

        <p>
          Entertainment platform frontend.
        </p>

        <div className="footer-links">

          <button
            type="button"
            onClick={() =>
              alert("Terms page coming soon.")
            }
          >
            Terms
          </button>

          <button
            type="button"
            onClick={() =>
              alert(
                "Privacy page coming soon."
              )
            }
          >
            Privacy
          </button>

          <button
            type="button"
            onClick={() =>
              alert(
                "Support page coming soon."
              )
            }
          >
            Support
          </button>

          <button
            type="button"
            onClick={() =>
              alert(
                "Responsible gaming information coming soon."
              )
            }
          >
            Responsible Gaming
          </button>

        </div>

      </footer>

    </div>
  );
}

export default Home;