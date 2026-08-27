import { useEffect, useState } from "react";
import "./TransactionHistory.css";

function TransactionHistory({ onBack }) {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const loadTransactions = () => {
      try {
        const saved = JSON.parse(
          localStorage.getItem("transactions") || "[]"
        );

        if (Array.isArray(saved)) {
          setTransactions(saved);
        } else {
          setTransactions([]);
        }
      } catch (error) {
        console.error(
          "Transaction history error:",
          error
        );

        setTransactions([]);
      }
    };

    loadTransactions();

    window.addEventListener(
      "transactions-updated",
      loadTransactions
    );

    window.addEventListener(
      "storage",
      loadTransactions
    );

    return () => {
      window.removeEventListener(
        "transactions-updated",
        loadTransactions
      );

      window.removeEventListener(
        "storage",
        loadTransactions
      );
    };
  }, []);

  return (
    <div className="transaction-page">

      {/* HEADER */}

      <header className="transaction-header">

        <button
          type="button"
          className="transaction-back"
          onClick={onBack}
        >
          ← Back
        </button>

        <div className="transaction-logo">
          BET<span>ZONE</span>
        </div>

        <div className="transaction-title-small">
          Transactions
        </div>

      </header>


      {/* CONTENT */}

      <main className="transaction-content">

        <div className="transaction-heading">

          <h1>
            Transaction History
          </h1>

          <p>
            View your deposit and withdrawal transactions.
          </p>

        </div>


        {/* EMPTY */}

        {transactions.length === 0 ? (

          <div className="transaction-empty">

            <div className="transaction-empty-icon">
              🔄
            </div>

            <h2>
              No transactions yet
            </h2>

            <p>
              Your deposit and withdrawal activity
              will appear here.
            </p>

          </div>

        ) : (

          /* TRANSACTIONS */

          <div className="transaction-list">

            {transactions.map(
              (transaction, index) => {

                const type =
                  transaction.type ||
                  "Transaction";

                const status =
                  transaction.status ||
                  "Pending";

                const amount =
                  Number(
                    transaction.amount || 0
                  );

                const method =
                  transaction.method ||
                  transaction.paymentMethod ||
                  "Payment method";

                const date =
                  transaction.date ||
                  transaction.createdAt ||
                  "Date not available";

                const isDeposit =
                  String(type).toLowerCase() ===
                  "deposit";

                return (
                  <div
                    className="transaction-card"
                    key={
                      transaction.id ||
                      `${date}-${index}`
                    }
                  >

                    <div className="transaction-icon">
                      {isDeposit
                        ? "💰"
                        : "💸"}
                    </div>


                    <div className="transaction-info">

                      <h3>
                        {type}
                      </h3>

                      <p>
                        {method}
                      </p>

                      <span>
                        {date}
                      </span>

                    </div>


                    <div className="transaction-right">

                      <strong
                        className={
                          isDeposit
                            ? "amount-positive"
                            : "amount-negative"
                        }
                      >
                        {isDeposit
                          ? "+"
                          : "-"}{" "}
                        NPR{" "}
                        {amount.toLocaleString(
                          "en-NP",
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }
                        )}
                      </strong>

                      <span
                        className={`transaction-status ${String(
                          status
                        ).toLowerCase()}`}
                      >
                        {status}
                      </span>

                    </div>

                  </div>
                );
              }
            )}

          </div>

        )}

      </main>

    </div>
  );
}

export default TransactionHistory;