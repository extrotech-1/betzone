import { useEffect, useState } from "react";
import "./DiceGame.css";

const START_BALANCE = 10000;

function DiceGame({ onBack }) {
  const [mode, setMode] = useState("demo");

  const [demoBalance, setDemoBalance] =
    useState(START_BALANCE);

  const [accountBalance, setAccountBalance] =
    useState(0);

  const [amount, setAmount] =
    useState(100);

  const [choice, setChoice] =
    useState("high");

  const [dice, setDice] =
    useState(null);

  const [result, setResult] =
    useState("ROLL THE DICE");

  const [rolling, setRolling] =
    useState(false);

  // =========================
  // READ ACCOUNT BALANCE
  // =========================

  function readAccountBalance() {
    const stored =
      localStorage.getItem("userBalance");

    const value = Number(stored);

    if (
      Number.isFinite(value) &&
      value >= 0
    ) {
      setAccountBalance(value);
    } else {
      setAccountBalance(0);
    }
  }

  useEffect(() => {
    readAccountBalance();

    const refreshBalance = () => {
      readAccountBalance();
    };

    window.addEventListener(
      "balance-updated",
      refreshBalance
    );

    window.addEventListener(
      "storage",
      refreshBalance
    );

    return () => {
      window.removeEventListener(
        "balance-updated",
        refreshBalance
      );

      window.removeEventListener(
        "storage",
        refreshBalance
      );
    };
  }, []);

  const currentBalance =
    mode === "demo"
      ? demoBalance
      : accountBalance;

  // =========================
  // ROLL DICE
  // =========================

  function rollDice() {
    if (rolling) {
      return;
    }

    const bet = Number(amount);

    if (
      !Number.isFinite(bet) ||
      bet <= 0
    ) {
      setResult("ENTER VALID AMOUNT");
      return;
    }

    if (bet > currentBalance) {
      setResult(
        mode === "demo"
          ? "INSUFFICIENT DEMO BALANCE"
          : "INSUFFICIENT ACCOUNT BALANCE"
      );
      return;
    }

    setRolling(true);
    setResult("ROLLING...");

    /*
     * DEMO MODE
     *
     * Demo balance can change.
     */

    if (mode === "demo") {
      setDemoBalance(
        previous =>
          previous - bet
      );
    }

    /*
     * ACCOUNT MODE
     *
     * Intentionally do NOT modify
     * localStorage/userBalance here.
     *
     * This keeps your existing
     * account balance safe.
     */

    const number =
      Math.floor(
        Math.random() * 6
      ) + 1;

    setTimeout(() => {
      setDice(number);

      const isHigh =
        number >= 4;

      const isLow =
        number <= 3;

      const won =
        choice === "high"
          ? isHigh
          : isLow;

      if (won) {
        const payout =
          bet * 2;

        /*
         * Only demo balance receives
         * the virtual payout.
         */

        if (mode === "demo") {
          setDemoBalance(
            previous =>
              previous + payout
          );
        }

        setResult(
          `YOU WIN • +NPR ${bet.toLocaleString()}`
        );
      } else {
        setResult(
          `YOU LOSE • DICE ${number}`
        );
      }

      setRolling(false);
    }, 700);
  }

  // =========================
  // RESET DEMO
  // =========================

  function resetGame() {
    if (mode !== "demo") {
      setResult(
        "SWITCH TO DEMO MODE TO RESET"
      );
      return;
    }

    setDemoBalance(
      START_BALANCE
    );

    setDice(null);

    setResult(
      "ROLL THE DICE"
    );
  }

  // =========================
  // MODE CHANGE
  // =========================

  function changeMode(nextMode) {
    if (rolling) {
      return;
    }

    setMode(nextMode);

    setDice(null);

    setResult(
      nextMode === "demo"
        ? "DEMO MODE SELECTED"
        : "ACCOUNT BALANCE SELECTED"
    );

    if (nextMode === "account") {
      readAccountBalance();
    }
  }

  return (
    <div className="dice-page">

      {/* =========================
          HEADER
      ========================= */}

      <header className="dice-header">

        <button
          className="dice-back"
          onClick={onBack}
        >
          ← Back
        </button>

        <div className="dice-logo">
          BET<span>ZONE</span>
        </div>

        <div className="dice-header-balance">
          {mode === "demo"
            ? "DEMO"
            : "ACCOUNT"}{" "}
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

      <main className="dice-container">

        {/* =========================
            BALANCE MODE PANEL
        ========================= */}

        <section className="dice-mode-panel">

          <div className="dice-mode-heading">

            <span>
              BALANCE MODE
            </span>

            <small>
              Choose which balance
              the game should display.
            </small>

          </div>

          <div className="dice-mode-buttons">

            {/* DEMO */}

            <button
              type="button"
              className={
                `dice-mode-btn ${
                  mode === "demo"
                    ? "active"
                    : ""
                }`
              }
              disabled={rolling}
              onClick={() =>
                changeMode("demo")
              }
            >

              <strong>
                DEMO BALANCE
              </strong>

              <small>
                NPR{" "}
                {demoBalance.toLocaleString(
                  undefined,
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  }
                )}
              </small>

            </button>

            {/* ACCOUNT */}

            <button
              type="button"
              className={
                `dice-mode-btn ${
                  mode === "account"
                    ? "active"
                    : ""
                }`
              }
              disabled={rolling}
              onClick={() =>
                changeMode("account")
              }
            >

              <strong>
                ACCOUNT BALANCE
              </strong>

              <small>
                NPR{" "}
                {accountBalance.toLocaleString(
                  undefined,
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  }
                )}
              </small>

            </button>

          </div>

          <div className="dice-current-balance">

            <span>
              CURRENT BALANCE
            </span>

            <strong>
              {mode === "demo"
                ? "DEMO"
                : "ACCOUNT"}{" "}
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

        {/* =========================
            TITLE
        ========================= */}

        <div className="dice-title">

          <div className="dice-title-icon">
            🎲
          </div>

          <div>

            <h1>
              Dice
            </h1>

            <p>
              Free-to-play virtual
              dice game
            </p>

          </div>

        </div>

        {/* =========================
            BOARD
        ========================= */}

        <section className="dice-board">

          <div
            className={
              `dice ${
                rolling
                  ? "dice-rolling"
                  : ""
              }`
            }
          >
            {dice || "?"}
          </div>

          <div className="dice-result">
            {result}
          </div>

        </section>

        {/* =========================
            CONTROLS
        ========================= */}

        <section className="dice-controls">

          <div className="dice-input-group">

            <label>
              {mode === "demo"
                ? "DEMO BET"
                : "ACCOUNT BET"}
            </label>

            <div className="dice-input">

              <span>
                NPR
              </span>

              <input
                type="number"
                min="1"
                value={amount}
                disabled={rolling}
                onChange={event =>
                  setAmount(
                    event.target.value
                  )
                }
              />

            </div>

          </div>

          {/* =========================
              CHOICE
          ========================= */}

          <div className="dice-input-group">

            <label>
              CHOOSE
            </label>

            <div className="choice-buttons">

              <button
                type="button"
                className={
                  choice === "low"
                    ? "choice-active"
                    : ""
                }
                disabled={rolling}
                onClick={() =>
                  setChoice("low")
                }
              >

                LOW

                <small>
                  1 – 3
                </small>

              </button>

              <button
                type="button"
                className={
                  choice === "high"
                    ? "choice-active"
                    : ""
                }
                disabled={rolling}
                onClick={() =>
                  setChoice("high")
                }
              >

                HIGH

                <small>
                  4 – 6
                </small>

              </button>

            </div>

          </div>

          {/* =========================
              ROLL
          ========================= */}

          <button
            className="roll-button"
            disabled={rolling}
            onClick={rollDice}
          >

            {rolling
              ? "ROLLING..."
              : "ROLL DICE"}

          </button>

          {/* =========================
              RESET DEMO
          ========================= */}

          <button
            className="reset-button"
            disabled={rolling}
            onClick={resetGame}
          >
            RESET DEMO BALANCE
          </button>

        </section>

        {/* =========================
            STATUS
        ========================= */}

        <section className="dice-status-box">

          <div>

            <span>
              MODE
            </span>

            <strong>
              {mode === "demo"
                ? "DEMO"
                : "ACCOUNT"}
            </strong>

          </div>

          <div>

            <span>
              BALANCE
            </span>

            <strong>
              NPR{" "}
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

        {/* =========================
            HOW TO PLAY
        ========================= */}

        <section className="dice-info">

          <h2>
            How to Play
          </h2>

          <div className="dice-steps">

            <div>

              <strong>
                01
              </strong>

              <h3>
                Select Amount
              </h3>

              <p>
                Choose your virtual
                game amount.
              </p>

            </div>

            <div>

              <strong>
                02
              </strong>

              <h3>
                Choose Side
              </h3>

              <p>
                Pick Low or High
                before rolling.
              </p>

            </div>

            <div>

              <strong>
                03
              </strong>

              <h3>
                Roll
              </h3>

              <p>
                Roll the dice and
                see the result.
              </p>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default DiceGame;