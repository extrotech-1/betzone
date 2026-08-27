// CrashGame.jsx

import { useEffect, useRef, useState } from "react";
import "./CrashGame.css";

const DEMO_START_BALANCE = 10000;
const DEMO_STORAGE_KEY = "betzoneDemoBalance";

const MIN_CRASH = 2.2;
const MAX_CRASH = 10;

function getCrashPoint() {
  const point =
    MIN_CRASH +
    Math.random() * (MAX_CRASH - MIN_CRASH);

  return Number(point.toFixed(2));
}

function CrashGame({ onBack }) {
  const [mode, setMode] = useState("demo");

  const [demoBalance, setDemoBalance] = useState(() => {
    try {
      const saved =
        localStorage.getItem(DEMO_STORAGE_KEY);

      if (saved === null) {
        return DEMO_START_BALANCE;
      }

      const value = Number(saved);

      return Number.isFinite(value) && value >= 0
        ? value
        : DEMO_START_BALANCE;
    } catch {
      return DEMO_START_BALANCE;
    }
  });

  const [accountBalance, setAccountBalance] =
    useState(0);

  const [phase, setPhase] =
    useState("betting");

  const [countdown, setCountdown] =
    useState(6);

  const [multiplier, setMultiplier] =
    useState(1);

  const [crashPoint, setCrashPoint] =
    useState(null);

  const [amount, setAmount] =
    useState(100);

  const [autoCashout, setAutoCashout] =
    useState(2.5);

  const [selected, setSelected] =
    useState(false);

  const [cashedOut, setCashedOut] =
    useState(false);

  const [cashoutMultiplier, setCashoutMultiplier] =
    useState(null);

  const [history, setHistory] =
    useState([]);

  const [message, setMessage] =
    useState("BETTING OPEN");

  const [plane, setPlane] =
    useState({
      x: 4,
      y: 8,
    });

  const timerRef = useRef(null);
  const animationRef = useRef(null);
  const nextRoundRef = useRef(null);

  const startTimeRef = useRef(0);

  const phaseRef =
    useRef("betting");

  const selectedRef =
    useRef(false);

  const cashedOutRef =
    useRef(false);

  const autoCashoutRef =
    useRef(2.5);

  /*
   * SAVE DEMO BALANCE
   */
  useEffect(() => {
    try {
      localStorage.setItem(
        DEMO_STORAGE_KEY,
        String(demoBalance)
      );
    } catch {
      // Ignore localStorage errors.
    }
  }, [demoBalance]);

  /*
   * READ ACCOUNT BALANCE
   *
   * This only reads userBalance.
   */
  function readAccountBalance() {
    try {
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
    } catch {
      setAccountBalance(0);
    }
  }

  /*
   * ACCOUNT BALANCE LISTENER
   */
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

  /*
   * KEEP REFS UPDATED
   */
  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    selectedRef.current = selected;
  }, [selected]);

  useEffect(() => {
    cashedOutRef.current = cashedOut;
  }, [cashedOut]);

  useEffect(() => {
    const value = Number(autoCashout);

    autoCashoutRef.current =
      Number.isFinite(value)
        ? value
        : 0;
  }, [autoCashout]);

  /*
   * CURRENT BALANCE
   */
  const gameBalance =
    mode === "demo"
      ? demoBalance
      : accountBalance;

  /*
   * CLEAR EVERYTHING
   */
  function clearTimers() {
    if (timerRef.current !== null) {
      clearInterval(
        timerRef.current
      );

      timerRef.current = null;
    }

    if (animationRef.current !== null) {
      cancelAnimationFrame(
        animationRef.current
      );

      animationRef.current = null;
    }

    if (nextRoundRef.current !== null) {
      clearTimeout(
        nextRoundRef.current
      );

      nextRoundRef.current = null;
    }
  }

  /*
   * START BETTING
   */
  function startBettingRound() {
    clearTimers();

    phaseRef.current = "betting";

    setPhase("betting");
    setCountdown(6);

    setMultiplier(1);
    setCrashPoint(null);

    setSelected(false);
    selectedRef.current = false;

    setCashedOut(false);
    cashedOutRef.current = false;

    setCashoutMultiplier(null);

    setPlane({
      x: 4,
      y: 8,
    });

    setMessage("BETTING OPEN");

    let seconds = 6;

    timerRef.current =
      setInterval(() => {
        seconds -= 1;

        setCountdown(seconds);

        if (seconds <= 0) {
          clearInterval(
            timerRef.current
          );

          timerRef.current = null;

          startFlight();
        }
      }, 1000);
  }

  /*
   * START FLIGHT
   *
   * FIX:
   * The animation loop continues after
   * auto cashout.
   */
  function startFlight() {
    const crash =
      Math.max(
        MIN_CRASH,
        getCrashPoint()
      );

    setCrashPoint(crash);

    phaseRef.current = "flying";

    setPhase("flying");

    setMultiplier(1);

    setPlane({
      x: 4,
      y: 8,
    });

    setMessage(
      "FLIGHT IN PROGRESS"
    );

    startTimeRef.current =
      performance.now();

    function animate(now) {
      /*
       * STOP ONLY WHEN ROUND IS NO
       * LONGER FLYING.
       */
      if (
        phaseRef.current !== "flying"
      ) {
        animationRef.current = null;
        return;
      }

      const elapsed =
        (now - startTimeRef.current) /
        1000;

      const nextMultiplier =
        Number(
          Math.exp(
            elapsed * 0.115
          ).toFixed(2)
        );

      /*
       * CRASH CHECK
       *
       * Never crash below 2.20x.
       */
      if (
        nextMultiplier >= crash
      ) {
        finishRound(crash);
        return;
      }

      setMultiplier(
        nextMultiplier
      );

      /*
       * PLANE POSITION
       */
      const progress =
        Math.min(
          (nextMultiplier - 1) /
            Math.max(
              crash - 1,
              1
            ),
          1
        );

      setPlane({
        x:
          4 +
          progress * 86,

        y:
          8 +
          progress * 72,
      });

      /*
       * AUTO CASHOUT
       *
       * IMPORTANT:
       * Do NOT return here.
       * The flight must continue.
       */
      const autoTarget =
        Number(
          autoCashoutRef.current
        );

      if (
        selectedRef.current &&
        !cashedOutRef.current &&
        Number.isFinite(
          autoTarget
        ) &&
        autoTarget >= 1.01 &&
        nextMultiplier >=
          autoTarget
      ) {
        performCashout(
          nextMultiplier,
          true
        );
      }

      /*
       * CONTINUE ANIMATION
       */
      if (
        phaseRef.current === "flying"
      ) {
        animationRef.current =
          requestAnimationFrame(
            animate
          );
      }
    }

    animationRef.current =
      requestAnimationFrame(
        animate
      );
  }

  /*
   * FINISH ROUND
   */
  function finishRound(
    finalMultiplier
  ) {
    if (
      animationRef.current !== null
    ) {
      cancelAnimationFrame(
        animationRef.current
      );

      animationRef.current = null;
    }

    const finalValue =
      Math.max(
        MIN_CRASH,
        Number(finalMultiplier)
      );

    phaseRef.current =
      "crashed";

    setPhase("crashed");

    setMultiplier(
      finalValue
    );

    setCrashPoint(
      finalValue
    );

    setMessage(
      `CRASHED AT ${finalValue.toFixed(
        2
      )}x`
    );

    /*
     * HISTORY
     */
    setHistory(
      previous => [
        {
          id: Date.now(),
          multiplier:
            finalValue,
        },
        ...previous,
      ].slice(0, 20)
    );

    /*
     * CLEAR ACTIVE BET
     */
    setSelected(false);

    selectedRef.current =
      false;

    setCashedOut(false);

    cashedOutRef.current =
      false;

    /*
     * START NEXT ROUND
     */
    nextRoundRef.current =
      setTimeout(() => {
        nextRoundRef.current =
          null;

        startBettingRound();
      }, 1800);
  }

  /*
   * PLACE BET
   */
  function placeBet() {
    if (
      phaseRef.current !==
      "betting"
    ) {
      setMessage(
        "BETTING CLOSED — WAIT FOR NEXT ROUND"
      );

      return;
    }

    const betAmount =
      Number(amount);

    /*
     * VALID AMOUNT
     */
    if (
      !Number.isFinite(
        betAmount
      ) ||
      betAmount <= 0
    ) {
      setMessage(
        "ENTER A VALID AMOUNT"
      );

      return;
    }

    /*
     * BALANCE CHECK
     */
    if (
      betAmount >
      gameBalance
    ) {
      setMessage(
        mode === "demo"
          ? "INSUFFICIENT DEMO BALANCE"
          : "ACCOUNT BALANCE IS TOO LOW"
      );

      return;
    }

    /*
     * DEMO BALANCE
     */
    if (
      mode === "demo"
    ) {
      setDemoBalance(
        previous =>
          previous -
          betAmount
      );
    }

    /*
     * MARK BET ACTIVE
     */
    selectedRef.current =
      true;

    setSelected(true);

    setCashedOut(false);

    cashedOutRef.current =
      false;

    setCashoutMultiplier(
      null
    );

    setMessage(
      `BET PLACED • NPR ${betAmount.toLocaleString()}`
    );
  }

  /*
   * CASHOUT
   */
  function performCashout(
    value,
    automatic = false
  ) {
    if (
      !selectedRef.current ||
      cashedOutRef.current ||
      phaseRef.current !==
        "flying"
    ) {
      return;
    }

    const current =
      Number(value);

    if (
      !Number.isFinite(
        current
      )
    ) {
      return;
    }

    /*
     * LOCK CASHOUT
     */
    cashedOutRef.current =
      true;

    setCashedOut(true);

    setCashoutMultiplier(
      current
    );

    /*
     * DEMO PAYOUT
     */
    if (
      mode === "demo"
    ) {
      const betAmount =
        Number(amount);

      const payout =
        betAmount *
        current;

      setDemoBalance(
        previous =>
          previous +
          payout
      );
    }

    /*
     * IMPORTANT:
     *
     * We do NOT stop the flight here.
     * The round continues until crash.
     */
    setMessage(
      automatic
        ? `AUTO CASHOUT @ ${current.toFixed(
            2
          )}x`
        : `CASHED OUT @ ${current.toFixed(
            2
          )}x`
    );
  }

  /*
   * MANUAL CASHOUT
   */
  function manualCashout() {
    if (
      phaseRef.current !==
      "flying"
    ) {
      return;
    }

    performCashout(
      multiplier,
      false
    );
  }

  /*
   * RESET DEMO
   */
  function resetDemoBalance() {
    if (
      mode !== "demo"
    ) {
      return;
    }

    setDemoBalance(
      DEMO_START_BALANCE
    );

    try {
      localStorage.setItem(
        DEMO_STORAGE_KEY,
        String(
          DEMO_START_BALANCE
        )
      );
    } catch {
      // Ignore storage errors.
    }

    setMessage(
      "DEMO BALANCE RESET"
    );
  }

  /*
   * START GAME ON MOUNT
   */
  useEffect(() => {
    startBettingRound();

    return () => {
      clearTimers();
    };
  }, []);

  const betting =
    phase === "betting";

  const flying =
    phase === "flying";

  const crashed =
    phase === "crashed";

  return (
    <div className="crash-page">

      <header className="crash-header">

        <button
          className="crash-back-btn"
          onClick={onBack}
        >
          ← Back
        </button>

        <div className="crash-logo">
          BET<span>ZONE</span>
        </div>

        <div className="crash-header-balance">
          {mode === "demo"
            ? "DEMO"
            : "ACCOUNT"}{" "}
          • NPR{" "}
          {gameBalance.toLocaleString(
            undefined,
            {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }
          )}
        </div>

      </header>

      <main className="crash-container">

        <div className="crash-mode-switch">

          <button
            className={
              mode === "demo"
                ? "mode-active"
                : ""
            }
            onClick={() =>
              setMode("demo")
            }
          >
            DEMO MODE
          </button>

          <button
            className={
              mode === "account"
                ? "mode-active"
                : ""
            }
            onClick={() =>
              setMode("account")
            }
          >
            ACCOUNT BALANCE
          </button>

        </div>

        <div className="crash-mode-info">

          {mode === "demo" ? (
            <>
              Demo balance:

              <strong>
                {" "}
                NPR{" "}
                {demoBalance.toLocaleString(
                  undefined,
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }
                )}
              </strong>

              <button
                onClick={
                  resetDemoBalance
                }
              >
                Reset Demo
              </button>
            </>
          ) : (
            <>
              Account balance:

              <strong>
                {" "}
                NPR{" "}
                {accountBalance.toLocaleString(
                  undefined,
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }
                )}
              </strong>
            </>
          )}

        </div>

        <div className="crash-top">

          <button className="terms-btn">
            TERMS
          </button>

        </div>

        <section className="crash-board">

          <div className="board-grid" />

          <div className="round-info">

            {betting &&
              `BETTING OPEN • ${countdown}s`}

            {flying &&
              "FLIGHT IN PROGRESS"}

            {crashed &&
              "ROUND FINISHED"}

          </div>

          <div className="board-message">

            {betting &&
              "Place your bet before takeoff"}

            {flying &&
              "Cash out before the crash"}

            {crashed &&
              `Crashed at ${crashPoint?.toFixed(
                2
              )}x`}

          </div>

          <div
            className="flight-path"
            style={{
              width:
                `${plane.x}%`,

              transform:
                `rotate(-${Math.min(
                  23,
                  plane.x * 0.16
                )}deg)`,
            }}
          />

          <div
            className={
              `plane ${
                flying
                  ? "plane-flying"
                  : ""
              }`
            }
            style={{
              left:
                `${plane.x}%`,

              bottom:
                `${plane.y}%`,
            }}
          >
            ✈
          </div>

          <div
            className={
              `multiplier ${
                crashed
                  ? "crashed-number"
                  : ""
              }`
            }
          >
            {crashed
              ? `${crashPoint?.toFixed(
                  2
                )}x`
              : `${multiplier.toFixed(
                  2
                )}x`}
          </div>

        </section>

        <section className="crash-controls">

          <div className="bet-panel">

            <div className="input-label">
              BET AMOUNT
            </div>

            <div className="amount-input-wrap">

              <span>
                NPR
              </span>

              <input
                type="number"
                min="1"
                value={amount}
                disabled={selected}
                onChange={event =>
                  setAmount(
                    event.target.value
                  )
                }
              />

              <button
                type="button"
                disabled={selected}
                onClick={() =>
                  setAmount(
                    Math.max(
                      1,
                      Number(amount) -
                        10
                    )
                  )
                }
              >
                −
              </button>

              <button
                type="button"
                disabled={selected}
                onClick={() =>
                  setAmount(
                    Number(amount) +
                      10
                  )
                }
              >
                +
              </button>

            </div>

            <div className="quick-bets">

              {[
                10,
                50,
                100,
                500,
                1000,
                5000,
              ].map(
                value => (
                  <button
                    key={value}
                    disabled={selected}
                    onClick={() =>
                      setAmount(
                        value
                      )
                    }
                  >
                    {value}
                  </button>
                )
              )}

            </div>

            <div className="auto-row">

              <label>
                AUTO CASHOUT
              </label>

              <input
                type="number"
                min="1.01"
                step="0.01"
                value={
                  autoCashout
                }
                onChange={
                  event =>
                    setAutoCashout(
                      event.target.value
                    )
                }
              />

            </div>

          </div>

          <div className="action-panel">

            <button
              className="autoplay-btn"
              onClick={() =>
                setMessage(
                  "AUTOPLAY IS DISABLED"
                )
              }
            >
              AUTOPLAY
            </button>

            {!selected ? (

              <button
                className="place-bet-btn"
                disabled={
                  !betting
                }
                onClick={
                  placeBet
                }
              >

                {betting
                  ? "PLACE BET"
                  : "WAIT FOR NEXT ROUND"}

                <small>
                  {betting
                    ? `${countdown}s remaining`
                    : "Betting closed"}
                </small>

              </button>

            ) : (

              <button
                className="cashout-btn"
                disabled={
                  !flying ||
                  cashedOut
                }
                onClick={
                  manualCashout
                }
              >

                {cashedOut
                  ? `CASHED OUT @ ${cashoutMultiplier?.toFixed(
                      2
                    )}x`
                  : "CASH OUT"}

                <small>
                  {cashedOut
                    ? "Result recorded"
                    : `${multiplier.toFixed(
                        2
                      )}x`}
                </small>

              </button>

            )}

          </div>

        </section>

        <div className="notice">
          {message}
        </div>

        <section className="history-section">

          <div className="history-title">
            <span>📊</span>
            Previous Crash Multipliers
          </div>

          <div className="history-header">

            <span>TIME</span>
            <span>RESULT</span>
            <span>TYPE</span>
            <span>STATUS</span>
            <span>MULTIPLIER</span>
            <span />

          </div>

          {history.length === 0 ? (

            <div className="empty-history">
              No previous crashes yet.
            </div>

          ) : (

            history.map(
              item => (

                <div
                  className="history-row"
                  key={item.id}
                >

                  <span>
                    {new Date(
                      item.id
                    ).toLocaleTimeString()}
                  </span>

                  <span>
                    Crash
                  </span>

                  <span>
                    Automatic
                  </span>

                  <span>
                    Finished
                  </span>

                  <span>
                    {item.multiplier.toFixed(
                      2
                    )}x
                  </span>

                  <span>
                    ✓
                  </span>

                </div>

              )
            )

          )}

        </section>

        <section className="how-section">

          <h2>
            How to Play
          </h2>

          <div className="steps">

            <div className="step">

              <strong>
                01
              </strong>

              <h3>
                Place Bet
              </h3>

              <p>
                Place a virtual
                credit bet during
                the six second
                opening period.
              </p>

            </div>

            <div className="step">

              <strong>
                02
              </strong>

              <h3>
                Watch Multiplier
              </h3>

              <p>
                Watch the airplane
                rise as the
                multiplier increases.
              </p>

            </div>

            <div className="step">

              <strong>
                03
              </strong>

              <h3>
                Cash Out
              </h3>

              <p>
                Cash out manually
                or use the automatic
                target.
              </p>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default CrashGame;