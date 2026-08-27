import { useState } from "react";
import "./MinesGame.css";

const GRID_SIZE = 25;
const DEFAULT_MINES = 5;

function createMines(total, mineCount) {
  const positions = [];

  while (positions.length < mineCount) {
    const position = Math.floor(Math.random() * total);

    if (!positions.includes(position)) {
      positions.push(position);
    }
  }

  return positions;
}

function MinesGame({ onBack }) {
  const [mode, setMode] = useState("demo");

  const [demoBalance, setDemoBalance] = useState(10000);
  const [realBalance, setRealBalance] = useState(0);

  const [amount, setAmount] = useState(100);
  const [mineCount, setMineCount] = useState(DEFAULT_MINES);

  const [mines, setMines] = useState([]);
  const [revealed, setRevealed] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const [message, setMessage] = useState(
    "SELECT BET AND START GAME"
  );

  const currentBalance =
    mode === "demo"
      ? demoBalance
      : realBalance;

  function changeMode(newMode) {
    if (gameStarted && !gameOver) {
      setMessage("FINISH CURRENT GAME FIRST");
      return;
    }

    setMode(newMode);
    setRevealed([]);
    setMines([]);
    setGameStarted(false);
    setGameOver(false);

    if (newMode === "demo") {
      setMessage("DEMO BALANCE SELECTED");
    } else {
      setMessage(
        "REAL BALANCE SELECTED"
      );
    }
  }

  function startGame() {
    const bet = Number(amount);

    if (
      !Number.isFinite(bet) ||
      bet <= 0
    ) {
      setMessage("ENTER VALID BET");
      return;
    }

    if (bet > currentBalance) {
      setMessage(
        mode === "demo"
          ? "INSUFFICIENT DEMO BALANCE"
          : "INSUFFICIENT REAL BALANCE"
      );
      return;
    }

    const generatedMines =
      createMines(
        GRID_SIZE,
        mineCount
      );

    setMines(generatedMines);
    setRevealed([]);
    setGameStarted(true);
    setGameOver(false);

    if (mode === "demo") {
      setDemoBalance(
        previous => previous - bet
      );
    } else {
      setRealBalance(
        previous => previous - bet
      );
    }

    setMessage(
      mode === "demo"
        ? "DEMO GAME STARTED"
        : "REAL MODE SELECTED"
    );
  }

  function revealCell(index) {
    if (!gameStarted || gameOver) {
      return;
    }

    if (revealed.includes(index)) {
      return;
    }

    setRevealed(
      previous => [
        ...previous,
        index
      ]
    );

    if (mines.includes(index)) {
      setGameOver(true);

      setMessage(
        `💣 MINE HIT • BET LOST`
      );

      return;
    }

    const safeCells =
      GRID_SIZE - mineCount;

    const nextRevealedCount =
      revealed.length + 1;

    if (
      nextRevealedCount >= safeCells
    ) {
      const bet = Number(amount);

      const payout = bet * 2;

      if (mode === "demo") {
        setDemoBalance(
          previous =>
            previous + payout
        );
      } else {
        setRealBalance(
          previous =>
            previous + payout
        );
      }

      setGameOver(true);

      setMessage(
        `🎉 YOU WIN • +NPR ${payout.toLocaleString()}`
      );

      return;
    }

    setMessage(
      "💎 SAFE • KEEP GOING"
    );
  }

  function cashOut() {
    if (!gameStarted || gameOver) {
      return;
    }

    const bet = Number(amount);

    const multiplier =
      1 +
      revealed.length * 0.25;

    const payout =
      Math.floor(
        bet * multiplier
      );

    if (mode === "demo") {
      setDemoBalance(
        previous =>
          previous + payout
      );
    } else {
      setRealBalance(
        previous =>
          previous + payout
      );
    }

    setGameOver(true);

    setMessage(
      `💰 CASHED OUT • +NPR ${payout.toLocaleString()}`
    );
  }

  function resetGame() {
    setMines([]);
    setRevealed([]);
    setGameStarted(false);
    setGameOver(false);
    setMessage(
      "SELECT BET AND START GAME"
    );
  }

  function resetDemoBalance() {
    setDemoBalance(10000);

    if (mode === "demo") {
      setMessage(
        "DEMO BALANCE RESET TO NPR 10,000"
      );
    }
  }

  return (
    <div className="mines-page">

      {/* HEADER */}

      <header className="mines-header">

        <button
          className="mines-back"
          onClick={onBack}
        >
          ← Back
        </button>

        <div className="mines-logo">
          BET<span>ZONE</span>
        </div>

        <div className="mines-header-balance">
          {mode === "demo"
            ? "DEMO"
            : "REAL"}{" "}
          • NPR{" "}
          {currentBalance.toLocaleString(
            undefined,
            {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            }
          )}
        </div>

      </header>

      <main className="mines-container">

        {/* BALANCE MODE */}

        <section className="mines-mode-panel">

          <div className="mines-mode-title">

            <strong>
              BALANCE MODE
            </strong>

            <small>
              Choose which balance to use
            </small>

          </div>

          <div className="mines-mode-buttons">

            <button
              className={
                mode === "demo"
                  ? "mines-mode-btn active"
                  : "mines-mode-btn"
              }
              onClick={() =>
                changeMode("demo")
              }
              disabled={
                gameStarted &&
                !gameOver
              }
            >

              <span>
                🎮
              </span>

              <strong>
                DEMO BALANCE
              </strong>

              <small>
                NPR{" "}
                {demoBalance.toLocaleString()}
              </small>

            </button>

            <button
              className={
                mode === "real"
                  ? "mines-mode-btn real active"
                  : "mines-mode-btn real"
              }
              onClick={() =>
                changeMode("real")
              }
              disabled={
                gameStarted &&
                !gameOver
              }
            >

              <span>
                💰
              </span>

              <strong>
                REAL BALANCE
              </strong>

              <small>
                NPR{" "}
                {realBalance.toLocaleString()}
              </small>

            </button>

          </div>

          <div className="mines-current-balance">

            <span>
              CURRENT BALANCE
            </span>

            <strong>
              {mode === "demo"
                ? "DEMO"
                : "REAL"}{" "}
              • NPR{" "}
              {currentBalance.toLocaleString(
                undefined,
                {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                }
              )}
            </strong>

          </div>

        </section>

        {/* TITLE */}

        <section className="mines-title">

          <div className="mines-title-icon">
            💣
          </div>

          <div>

            <h1>
              Mines
            </h1>

            <p>
              Find safe gems and avoid the mines.
            </p>

          </div>

        </section>

        {/* GAME BOARD */}

        <section className="mines-board">

          <div className="mines-board-top">

            <span>
              {mode === "demo"
                ? "🎮 DEMO GAME"
                : "💰 REAL BALANCE"}
            </span>

            <span>
              💣 {mineCount} MINES
            </span>

          </div>

          <div className="mines-grid">

            {Array.from(
              { length: GRID_SIZE },
              (_, index) => {

                const isRevealed =
                  revealed.includes(index);

                const isMine =
                  mines.includes(index);

                let className =
                  "mine-cell";

                if (isRevealed) {
                  className +=
                    " revealed";
                }

                if (
                  isRevealed &&
                  isMine
                ) {
                  className +=
                    " mine-hit";
                }

                if (
                  isRevealed &&
                  !isMine
                ) {
                  className +=
                    " safe";
                }

                return (
                  <button
                    key={index}
                    className={className}
                    onClick={() =>
                      revealCell(index)
                    }
                    disabled={
                      !gameStarted ||
                      gameOver ||
                      isRevealed
                    }
                  >
                    {isRevealed
                      ? isMine
                        ? "💣"
                        : "💎"
                      : "?"}
                  </button>
                );
              }
            )}

          </div>

          <div className="mines-message">
            {message}
          </div>

        </section>

        {/* CONTROLS */}

        <section className="mines-controls">

          <div className="mines-control-group">

            <label>
              {mode === "demo"
                ? "DEMO BET"
                : "REAL BET"}
            </label>

            <div className="mines-input">

              <span>
                NPR
              </span>

              <input
                type="number"
                min="1"
                value={amount}
                disabled={
                  gameStarted &&
                  !gameOver
                }
                onChange={event =>
                  setAmount(
                    event.target.value
                  )
                }
              />

            </div>

          </div>

          <div className="mines-control-group">

            <label>
              MINES
            </label>

            <select
              value={mineCount}
              disabled={
                gameStarted &&
                !gameOver
              }
              onChange={event =>
                setMineCount(
                  Number(event.target.value)
                )
              }
            >
              <option value="3">
                3 Mines
              </option>

              <option value="5">
                5 Mines
              </option>

              <option value="7">
                7 Mines
              </option>

              <option value="10">
                10 Mines
              </option>

            </select>

          </div>

          {!gameStarted || gameOver ? (

            <button
              className="mines-start-button"
              onClick={startGame}
            >
              {mode === "demo"
                ? "START DEMO GAME"
                : "START REAL MODE"}
            </button>

          ) : (

            <button
              className="mines-cashout-button"
              onClick={cashOut}
            >
              💰 CASH OUT
            </button>

          )}

          <button
            className="mines-reset-button"
            onClick={resetGame}
          >
            NEW GAME
          </button>

          <button
            className="mines-demo-reset"
            onClick={resetDemoBalance}
          >
            RESET DEMO BALANCE
          </button>

        </section>

        {/* BALANCE INFO */}

        <section className="mines-balance-info">

          <div>
            <span>
              DEMO BALANCE
            </span>

            <strong>
              NPR{" "}
              {demoBalance.toLocaleString()}
            </strong>
          </div>

          <div>
            <span>
              REAL BALANCE
            </span>

            <strong>
              NPR{" "}
              {realBalance.toLocaleString()}
            </strong>
          </div>

          <div>
            <span>
              ACTIVE MODE
            </span>

            <strong>
              {mode === "demo"
                ? "DEMO"
                : "REAL"}
            </strong>
          </div>

        </section>

        {/* INFO */}

        <section className="mines-info">

          <h2>
            How to Play
          </h2>

          <div className="mines-steps">

            <div>
              <strong>
                01
              </strong>

              <h3>
                Select Balance
              </h3>

              <p>
                Choose Demo or Real balance mode.
              </p>
            </div>

            <div>
              <strong>
                02
              </strong>

              <h3>
                Start Game
              </h3>

              <p>
                Select your bet and number of mines.
              </p>
            </div>

            <div>
              <strong>
                03
              </strong>

              <h3>
                Find Gems
              </h3>

              <p>
                Open safe cells and avoid the mines.
              </p>
            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default MinesGame;