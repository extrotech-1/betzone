import { useState } from "react";

import Login from "./Page/Login/Login";
import Register from "./Page/Login/Register/Register";
import Home from "./Page/Login/Home/Home";
import Account from "./Page/Login/Account/Account";
import Deposit from "./Page/Login/Deposit/Deposit";
import Withdrawal from "./Page/Login/Withdrawal/Withdrawal";

import CrashGame from "./Page/Login/CrashGame/CrashGame";
import DiceGame from "./Page/Login/DiceGame/DiceGame";
import MinesGame from "./Page/Login/MinesGame/MinesGame";

import AdminPaymentMethods from "./Page/Login/Admin/AdminPaymentMethods";
import AdminDepositRequests from "./Page/Login/Admin/AdminDepositRequests";

import "./App.css";

/* =========================================================
   ADMIN WITHDRAWALS
========================================================= */

function AdminWithdrawals() {
  const [withdrawals, setWithdrawals] = useState(() => {
    try {
      const saved = localStorage.getItem("betzone_withdrawals");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const updateStatus = (id, status) => {
    const updated = withdrawals.map((item) =>
      String(item.id) === String(id)
        ? {
            ...item,
            status,
            updatedAt: new Date().toISOString(),
          }
        : item
    );

    setWithdrawals(updated);
    localStorage.setItem(
      "betzone_withdrawals",
      JSON.stringify(updated)
    );
  };

  const deleteWithdrawal = (id) => {
    const updated = withdrawals.filter(
      (item) => String(item.id) !== String(id)
    );

    setWithdrawals(updated);

    localStorage.setItem(
      "betzone_withdrawals",
      JSON.stringify(updated)
    );
  };

  const clearAll = () => {
    if (!window.confirm("Delete all withdrawal requests?")) {
      return;
    }

    setWithdrawals([]);

    localStorage.setItem(
      "betzone_withdrawals",
      JSON.stringify([])
    );
  };

  return (
    <div className="admin-withdrawal-page">
      <style>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          background: #070b12;
          color: #f5f7fa;
          font-family: Arial, Helvetica, sans-serif;
        }

        .admin-withdrawal-page {
          min-height: 100vh;
          background: #070b12;
          color: #f5f7fa;
        }

        .admin-topbar {
          min-height: 68px;
          padding: 14px 22px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          background: #0b111b;
          border-bottom: 1px solid #202a38;
        }

        .admin-logo {
          font-size: 20px;
          font-weight: 900;
          letter-spacing: .3px;
        }

        .admin-logo span {
          color: #f5b400;
        }

        .admin-subtitle {
          margin-top: 3px;
          color: #8d9aab;
          font-size: 12px;
        }

        .admin-links {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .admin-link {
          color: #dce5ef;
          background: #121a27;
          border: 1px solid #293548;
          border-radius: 7px;
          padding: 8px 11px;
          text-decoration: none;
          font-size: 12px;
        }

        .admin-link:hover {
          border-color: #f5b400;
          color: #f5b400;
        }

        .admin-container {
          width: min(1100px, calc(100% - 24px));
          margin: 22px auto;
        }

        .admin-heading-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 16px;
        }

        .admin-heading h1 {
          margin: 0;
          font-size: 24px;
        }

        .admin-heading p {
          margin: 5px 0 0;
          color: #8794a5;
          font-size: 13px;
        }

        .clear-btn {
          border: 1px solid #5a2830;
          background: #261117;
          color: #ff8f9c;
          border-radius: 7px;
          padding: 9px 12px;
          cursor: pointer;
        }

        .request-count {
          background: #121b29;
          border: 1px solid #293548;
          padding: 7px 11px;
          border-radius: 20px;
          color: #f5b400;
          font-size: 12px;
          white-space: nowrap;
        }

        .withdrawal-card {
          background: #0c131e;
          border: 1px solid #202b3a;
          border-radius: 10px;
          margin-bottom: 12px;
          overflow: hidden;
        }

        .withdrawal-card-header {
          padding: 13px 15px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
          border-bottom: 1px solid #1d2735;
        }

        .withdrawal-id {
          font-weight: 800;
          font-size: 15px;
        }

        .withdrawal-date {
          color: #758295;
          font-size: 11px;
          margin-top: 4px;
        }

        .status {
          border-radius: 20px;
          padding: 5px 9px;
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
        }

        .status-pending {
          background: #332b0d;
          color: #f5c842;
        }

        .status-approved {
          background: #0d3327;
          color: #39d99a;
        }

        .status-rejected {
          background: #35151a;
          color: #ff7381;
        }

        .status-processing {
          background: #102c3b;
          color: #58c7ff;
        }

        .withdrawal-body {
          padding: 14px 15px;
        }

        .withdrawal-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 10px;
        }

        .info-box {
          background: #09101a;
          border: 1px solid #1c2735;
          border-radius: 7px;
          padding: 10px;
        }

        .info-label {
          color: #738196;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: .4px;
          margin-bottom: 5px;
        }

        .info-value {
          color: #e9eef5;
          font-size: 13px;
          word-break: break-word;
        }

        .amount {
          color: #f5b400;
          font-weight: 900;
          font-size: 16px;
        }

        .withdrawal-actions {
          display: flex;
          gap: 7px;
          flex-wrap: wrap;
          margin-top: 13px;
        }

        .action-btn {
          border: 1px solid #2c394c;
          background: #111a27;
          color: #dce5ef;
          border-radius: 6px;
          padding: 8px 11px;
          font-size: 12px;
          cursor: pointer;
        }

        .approve-btn {
          border-color: #155d47;
          background: #0c2b22;
          color: #43dfa1;
        }

        .reject-btn {
          border-color: #63303a;
          background: #2b151a;
          color: #ff7d8b;
        }

        .processing-btn {
          border-color: #24516a;
          background: #102634;
          color: #61caff;
        }

        .delete-btn {
          color: #ff6e7c;
        }

        .empty-state {
          text-align: center;
          padding: 55px 20px;
          border: 1px dashed #293548;
          border-radius: 10px;
          color: #8190a4;
          background: #0b111a;
        }

        .empty-icon {
          font-size: 34px;
          margin-bottom: 10px;
        }

        @media (max-width: 700px) {
          .admin-topbar {
            align-items: flex-start;
            flex-direction: column;
          }

          .admin-links {
            width: 100%;
          }

          .admin-link {
            flex: 1;
            text-align: center;
          }

          .admin-heading-row {
            align-items: flex-start;
            flex-direction: column;
          }

          .withdrawal-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 450px) {
          .admin-container {
            width: calc(100% - 14px);
            margin: 12px auto;
          }

          .withdrawal-grid {
            grid-template-columns: 1fr;
          }

          .withdrawal-card-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .withdrawal-actions {
            display: grid;
            grid-template-columns: 1fr 1fr;
          }

          .action-btn {
            width: 100%;
          }
        }
      `}</style>

      <header className="admin-topbar">
        <div>
          <div className="admin-logo">
            BET<span>ZONE</span>
          </div>
          <div className="admin-subtitle">
            Admin Withdrawal Management
          </div>
        </div>

        <div className="admin-links">
          <a className="admin-link" href="/admin">
            Payment Methods
          </a>

          <a className="admin-link" href="/admin/deposits">
            Deposit Requests
          </a>

          <a className="admin-link" href="/admin/withdrawals">
            Withdrawal Requests
          </a>
        </div>
      </header>

      <main className="admin-container">
        <div className="admin-heading-row">
          <div className="admin-heading">
            <h1>Withdrawal Requests</h1>
            <p>
              Review and manage user withdrawal requests.
            </p>
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            <div className="request-count">
              {withdrawals.length} Requests
            </div>

            {withdrawals.length > 0 && (
              <button
                className="clear-btn"
                onClick={clearAll}
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        {withdrawals.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">💸</div>
            <div>No withdrawal requests yet.</div>
          </div>
        ) : (
          withdrawals.map((item) => {
            const status = String(
              item.status || "pending"
            ).toLowerCase();

            return (
              <div
                className="withdrawal-card"
                key={item.id}
              >
                <div className="withdrawal-card-header">
                  <div>
                    <div className="withdrawal-id">
                      Withdrawal #{item.id}
                    </div>

                    {item.createdAt && (
                      <div className="withdrawal-date">
                        {new Date(
                          item.createdAt
                        ).toLocaleString()}
                      </div>
                    )}
                  </div>

                  <div
                    className={`status status-${status}`}
                  >
                    {status}
                  </div>
                </div>

                <div className="withdrawal-body">
                  <div className="withdrawal-grid">
                    <div className="info-box">
                      <div className="info-label">
                        Amount
                      </div>

                      <div className="info-value amount">
                        NPR{" "}
                        {Number(
                          item.amount || 0
                        ).toLocaleString()}
                      </div>
                    </div>

                    <div className="info-box">
                      <div className="info-label">
                        User
                      </div>

                      <div className="info-value">
                        {item.userName ||
                          item.username ||
                          item.user ||
                          "User"}
                      </div>
                    </div>

                    <div className="info-box">
                      <div className="info-label">
                        Method
                      </div>

                      <div className="info-value">
                        {item.method ||
                          "Local Payment"}
                      </div>
                    </div>

                    <div className="info-box">
                      <div className="info-label">
                        Account Name
                      </div>

                      <div className="info-value">
                        {item.accountName ||
                          item.senderName ||
                          "-"}
                      </div>
                    </div>

                    <div className="info-box">
                      <div className="info-label">
                        Account Number
                      </div>

                      <div className="info-value">
                        {item.accountNumber ||
                          item.phone ||
                          "-"}
                      </div>
                    </div>

                    <div className="info-box">
                      <div className="info-label">
                        Reference
                      </div>

                      <div className="info-value">
                        {item.reference ||
                          item.transactionId ||
                          "-"}
                      </div>
                    </div>
                  </div>

                  <div className="withdrawal-actions">
                    <button
                      className="action-btn processing-btn"
                      onClick={() =>
                        updateStatus(
                          item.id,
                          "processing"
                        )
                      }
                    >
                      Processing
                    </button>

                    <button
                      className="action-btn approve-btn"
                      onClick={() =>
                        updateStatus(
                          item.id,
                          "approved"
                        )
                      }
                    >
                      ✓ Approve
                    </button>

                    <button
                      className="action-btn reject-btn"
                      onClick={() =>
                        updateStatus(
                          item.id,
                          "rejected"
                        )
                      }
                    >
                      ✕ Reject
                    </button>

                    <button
                      className="action-btn delete-btn"
                      onClick={() =>
                        deleteWithdrawal(item.id)
                      }
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </main>
    </div>
  );
}

/* =========================================================
   LIVE ROULETTE
========================================================= */

function LiveRoulettePage({ onBack }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#050912",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <header
        style={{
          height: "60px",
          flexShrink: 0,
          background: "#090f19",
          borderBottom: "1px solid #202938",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 14px",
        }}
      >
        <button
          type="button"
          onClick={onBack}
          style={{
            background: "#182235",
            color: "#fff",
            border: "1px solid #34435b",
            borderRadius: "7px",
            padding: "8px 13px",
            cursor: "pointer",
          }}
        >
          ← Back
        </button>

        <div
          style={{
            fontSize: "19px",
            fontWeight: "900",
          }}
        >
          BET<span style={{ color: "#f5b400" }}>ZONE</span>
        </div>

        <div
          style={{
            color: "#ff4d4d",
            fontWeight: "700",
            fontSize: "12px",
          }}
        >
          🔴 LIVE
        </div>
      </header>

      <div
        style={{
          padding: "12px 14px",
          background: "#080e18",
          borderBottom: "1px solid #202938",
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: "18px",
          }}
        >
          🎰 Live Roulette
        </h2>

        <p
          style={{
            margin: "4px 0 0",
            color: "#8996a8",
            fontSize: "12px",
          }}
        >
          Live roulette experience
        </p>
      </div>

      <div
        style={{
          flex: 1,
          padding: "8px",
          background: "#02050a",
        }}
      >
        <iframe
          src="https://www.247roulette.org/"
          title="Live Roulette"
          style={{
            width: "100%",
            height: "calc(100vh - 125px)",
            minHeight: "500px",
            border: "none",
            borderRadius: "8px",
            background: "#fff",
          }}
          allow="fullscreen"
        />
      </div>
    </div>
  );
}

/* =========================================================
   APP
========================================================= */

function App() {
  const [page, setPage] = useState("login");

  const path = window.location.pathname;

  /* =====================================================
     ADMIN ROUTES
  ===================================================== */

  if (path === "/admin") {
    return <AdminPaymentMethods />;
  }

  if (path === "/admin/deposits") {
    return <AdminDepositRequests />;
  }

  if (path === "/admin/withdrawals") {
    return <AdminWithdrawals />;
  }

  /* =====================================================
     LOGIN
  ===================================================== */

  if (page === "login") {
    return (
      <Login
        onLogin={() => setPage("home")}
        onRegister={() => setPage("register")}
      />
    );
  }

  /* =====================================================
     REGISTER
  ===================================================== */

  if (page === "register") {
    return (
      <Register
        onRegister={() => setPage("login")}
        onLogin={() => setPage("login")}
      />
    );
  }

  /* =====================================================
     HOME
  ===================================================== */

  if (page === "home") {
    return (
      <Home
        onLogout={() => setPage("login")}

        onAccount={() =>
          setPage("account")
        }

        onCrashGame={() =>
          setPage("crash")
        }

        onDiceGame={() =>
          setPage("dice")
        }

        onMinesGame={() =>
          setPage("mines")
        }

        onLiveRoulette={() =>
          setPage("live-roulette")
        }
      />
    );
  }

  /* =====================================================
     ACCOUNT
  ===================================================== */

  if (page === "account") {
    return (
      <Account
        onBack={() =>
          setPage("home")
        }

        onDeposit={() =>
          setPage("deposit")
        }

        onWithdraw={() =>
          setPage("withdrawal")
        }
      />
    );
  }

  /* =====================================================
     DEPOSIT
  ===================================================== */

  if (page === "deposit") {
    return (
      <Deposit
        onBack={() =>
          setPage("account")
        }
      />
    );
  }

  /* =====================================================
     WITHDRAWAL
  ===================================================== */

  if (page === "withdrawal") {
    return (
      <Withdrawal
        onBack={() =>
          setPage("account")
        }
      />
    );
  }

  /* =====================================================
     CRASH
  ===================================================== */

  if (page === "crash") {
    return (
      <CrashGame
        onBack={() =>
          setPage("home")
        }
      />
    );
  }

  /* =====================================================
     DICE
  ===================================================== */

  if (page === "dice") {
    return (
      <DiceGame
        onBack={() =>
          setPage("home")
        }
      />
    );
  }

  /* =====================================================
     MINES
  ===================================================== */

  if (page === "mines") {
    return (
      <MinesGame
        onBack={() =>
          setPage("home")
        }
      />
    );
  }

  /* =====================================================
     LIVE ROULETTE
  ===================================================== */

  if (page === "live-roulette") {
    return (
      <LiveRoulettePage
        onBack={() =>
          setPage("home")
        }
      />
    );
  }

  return null;
}

export default App;