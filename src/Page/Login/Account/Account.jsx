import { useEffect, useState } from "react";
import "./Account.css";

function Account({
  onBack,
  onDeposit,
  onWithdraw,
  onTransactionHistory,
}) {
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const loadBalance = () => {
      const value = Number(
        localStorage.getItem("userBalance") || 0
      );

      setBalance(
        Number.isFinite(value) ? value : 0
      );
    };

    loadBalance();

    window.addEventListener(
      "balance-updated",
      loadBalance
    );

    window.addEventListener(
      "storage",
      loadBalance
    );

    return () => {
      window.removeEventListener(
        "balance-updated",
        loadBalance
      );

      window.removeEventListener(
        "storage",
        loadBalance
      );
    };
  }, []);

  return (
    <div className="account-page">

      {/* HEADER */}

      <header className="account-header">

        <button
          type="button"
          className="back-btn"
          onClick={onBack}
        >
          ← Back
        </button>

        <div className="account-logo">
          BET<span>ZONE</span>
        </div>

        <div className="account-balance">
          Balance: NPR{" "}
          {balance.toLocaleString("en-NP", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </div>

      </header>


      {/* CONTENT */}

      <main className="account-content">

        <div className="account-title">
          <h1>My Account</h1>

          <p>
            Manage your account and preferences
          </p>
        </div>


        {/* ACCOUNT */}

        <section className="account-section">

          <h2>Account</h2>

          <div className="account-grid">

            {/* DEPOSIT */}

            <button
              type="button"
              className="account-card"
              onClick={onDeposit}
            >
              <span className="account-icon">
                💰
              </span>

              <span className="account-card-text">
                Deposit
              </span>

              <span className="arrow">
                →
              </span>
            </button>


            {/* WITHDRAW */}

            <button
              type="button"
              className="account-card"
              onClick={onWithdraw}
            >
              <span className="account-icon">
                💸
              </span>

              <span className="account-card-text">
                Withdraw funds
              </span>

              <span className="arrow">
                →
              </span>
            </button>


            {/* BET HISTORY */}

            <button
              type="button"
              className="account-card"
            >
              <span className="account-icon">
                📋
              </span>

              <span className="account-card-text">
                Bet history
              </span>

              <span className="arrow">
                →
              </span>
            </button>


            {/* TRANSACTION HISTORY */}

            <button
              type="button"
              className="account-card"
              onClick={onTransactionHistory}
            >
              <span className="account-icon">
                🔄
              </span>

              <span className="account-card-text">
                Transaction history
              </span>

              <span className="arrow">
                →
              </span>
            </button>


            {/* PAYMENT QUERIES */}

            <button
              type="button"
              className="account-card"
            >
              <span className="account-icon">
                ❓
              </span>

              <span className="account-card-text">
                Payment queries
              </span>

              <span className="arrow">
                →
              </span>
            </button>

          </div>

        </section>


        {/* EXTRA */}

        <section className="account-section">

          <h2>Extra</h2>

          <div className="account-grid">

            <button
              type="button"
              className="account-card"
            >
              <span className="account-icon">
                🎁
              </span>

              <span className="account-card-text">
                Get your cashback
              </span>

              <span className="arrow">
                →
              </span>
            </button>


            <button
              type="button"
              className="account-card"
            >
              <span className="account-icon">
                ⭐
              </span>

              <span className="account-card-text">
                Casino VIP Cashback
              </span>

              <span className="arrow">
                →
              </span>
            </button>


            <button
              type="button"
              className="account-card"
            >
              <span className="account-icon">
                🎉
              </span>

              <span className="account-card-text">
                Bonuses and gifts
              </span>

              <span className="arrow">
                →
              </span>
            </button>


            <button
              type="button"
              className="account-card"
            >
              <span className="account-icon">
                💬
              </span>

              <span className="account-card-text">
                Customer Support
              </span>

              <span className="arrow">
                →
              </span>
            </button>

          </div>

        </section>


        {/* PROFILE */}

        <section className="account-section">

          <h2>Profile</h2>

          <div className="account-grid">

            <button
              type="button"
              className="account-card"
            >
              <span className="account-icon">
                👤
              </span>

              <span className="account-card-text">
                Personal profile
              </span>

              <span className="arrow">
                →
              </span>
            </button>


            <button
              type="button"
              className="account-card"
            >
              <span className="account-icon">
                🔐
              </span>

              <span className="account-card-text">
                Security
              </span>

              <span className="arrow">
                →
              </span>
            </button>


            <button
              type="button"
              className="account-card"
            >
              <span className="account-icon">
                ⚙️
              </span>

              <span className="account-card-text">
                Account settings
              </span>

              <span className="arrow">
                →
              </span>
            </button>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Account;