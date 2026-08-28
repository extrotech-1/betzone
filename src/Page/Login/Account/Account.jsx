import { useEffect, useState } from "react";
import { supabase } from "../../../supabaseClient.js";
import "./Account.css";

function Account({
  onBack,
  onDeposit,
  onWithdraw,
  onTransactionHistory,
  onCustomerSupport,
}) {
  const [balance, setBalance] = useState(0);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadAccount() {
      try {
        setLoading(true);

        // Get currently logged-in user
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) {
          console.error("Get user error:", userError);
          return;
        }

        if (!user) {
          console.log("No logged-in user");
          return;
        }

        // Get profile from Supabase
        const { data, error } = await supabase
          .from("profiles")
          .select(
            "full_name, username, email, avatar_url, phone, balance"
          )
          .eq("id", user.id)
          .maybeSingle();

        if (error) {
          console.error("Profile load error:", error);
          return;
        }

        if (!mounted) return;

        if (data) {
          setProfile(data);

          const userBalance = Number(data.balance || 0);

          setBalance(
            Number.isFinite(userBalance)
              ? userBalance
              : 0
          );

          // Keep local copy also
          localStorage.setItem(
            "userBalance",
            String(
              Number.isFinite(userBalance)
                ? userBalance
                : 0
            )
          );
        }
      } catch (error) {
        console.error("Account loading error:", error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadAccount();

    // Listen for balance updates
    const handleBalanceUpdate = () => {
      loadAccount();
    };

    window.addEventListener(
      "balance-updated",
      handleBalanceUpdate
    );

    // Listen for Supabase auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (event) => {
        if (
          event === "SIGNED_IN" ||
          event === "TOKEN_REFRESHED" ||
          event === "USER_UPDATED"
        ) {
          loadAccount();
        }

        if (event === "SIGNED_OUT") {
          setProfile(null);
          setBalance(0);
        }
      }
    );

    return () => {
      mounted = false;

      window.removeEventListener(
        "balance-updated",
        handleBalanceUpdate
      );

      subscription.unsubscribe();
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

          {loading
            ? "..."
            : balance.toLocaleString("en-NP", {
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


        {/* PROFILE SUMMARY */}

        {profile && (
          <section className="account-section">

            <h2>Profile</h2>

            <div
              style={{
                background: "#0c131e",
                border: "1px solid #202b3a",
                borderRadius: "10px",
                padding: "15px",
                display: "flex",
                alignItems: "center",
                gap: "14px",
                marginBottom: "15px",
              }}
            >

              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt="Profile"
                  style={{
                    width: "52px",
                    height: "52px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "2px solid #f5b400",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "52px",
                    height: "52px",
                    borderRadius: "50%",
                    background: "#182235",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "25px",
                  }}
                >
                  👤
                </div>
              )}

              <div>

                <div
                  style={{
                    color: "#fff",
                    fontSize: "16px",
                    fontWeight: "800",
                  }}
                >
                  {profile.full_name ||
                    profile.username ||
                    "User"}
                </div>

                <div
                  style={{
                    color: "#8b98aa",
                    fontSize: "12px",
                    marginTop: "4px",
                  }}
                >
                  {profile.email || "No email"}
                </div>

              </div>

            </div>

          </section>
        )}


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
              onClick={onCustomerSupport}
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

          <h2>Profile Settings</h2>

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