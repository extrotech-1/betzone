import { useEffect, useState } from "react";
import "./AdminWithdrawals.css";

function AdminWithdrawals() {
  const [requests, setRequests] = useState([]);

  const loadRequests = () => {
    try {
      const saved =
        localStorage.getItem("withdrawalRequests");

      if (saved) {
        setRequests(JSON.parse(saved));
      } else {
        setRequests([]);
      }
    } catch {
      setRequests([]);
    }
  };

  useEffect(() => {
    loadRequests();

    const handler = () => {
      loadRequests();
    };

    window.addEventListener(
      "withdrawal-request-created",
      handler
    );

    window.addEventListener(
      "storage",
      handler
    );

    return () => {
      window.removeEventListener(
        "withdrawal-request-created",
        handler
      );

      window.removeEventListener(
        "storage",
        handler
      );
    };
  }, []);

  const saveRequests = (updated) => {
    setRequests(updated);

    localStorage.setItem(
      "withdrawalRequests",
      JSON.stringify(updated)
    );
  };

  const updateStatus = (id, status) => {
    const updated = requests.map((request) =>
      request.id === id
        ? {
            ...request,
            status,
            updatedAt: new Date().toISOString(),
          }
        : request
    );

    saveRequests(updated);

    window.dispatchEvent(
      new Event("withdrawal-updated")
    );
  };

  const deleteRequest = (id) => {
    const updated = requests.filter(
      (request) => request.id !== id
    );

    saveRequests(updated);
  };

  return (
    <div className="admin-withdrawal-page">

      <header className="withdrawal-admin-header">

        <div>
          <div className="withdrawal-brand">
            BET<span>ZONE</span>
          </div>

          <div className="withdrawal-subtitle">
            Admin Withdrawal Management
          </div>
        </div>

        <nav className="withdrawal-nav">

          <a href="/admin">
            Payment Methods
          </a>

          <a href="/admin/deposits">
            Deposit Requests
          </a>

          <a
            href="/admin/withdrawals"
            className="active"
          >
            Withdrawal Requests
          </a>

        </nav>

      </header>


      <main className="withdrawal-container">

        <div className="withdrawal-heading">

          <div>
            <h1>Withdrawal Requests</h1>

            <p>
              Review and manage user withdrawal requests.
            </p>
          </div>

          <button
            className="refresh-btn"
            onClick={loadRequests}
          >
            ↻ Refresh
          </button>

        </div>


        <div className="withdrawal-summary">

          <div className="summary-card">
            <span>Total</span>
            <strong>{requests.length}</strong>
          </div>

          <div className="summary-card pending">
            <span>Pending</span>
            <strong>
              {
                requests.filter(
                  (r) => r.status === "Pending"
                ).length
              }
            </strong>
          </div>

          <div className="summary-card approved">
            <span>Approved</span>
            <strong>
              {
                requests.filter(
                  (r) => r.status === "Approved"
                ).length
              }
            </strong>
          </div>

          <div className="summary-card rejected">
            <span>Rejected</span>
            <strong>
              {
                requests.filter(
                  (r) => r.status === "Rejected"
                ).length
              }
            </strong>
          </div>

        </div>


        <section className="withdrawal-list">

          {requests.length === 0 ? (

            <div className="withdrawal-empty">
              <div className="empty-icon">
                💸
              </div>

              <h2>No withdrawal requests</h2>

              <p>
                New user withdrawal requests will appear
                here.
              </p>
            </div>

          ) : (

            requests
              .slice()
              .reverse()
              .map((request) => (

                <article
                  className="withdrawal-card"
                  key={request.id}
                >

                  <div className="withdrawal-card-top">

                    <div>

                      <h2>
                        Withdrawal #
                        {request.id}
                      </h2>

                      <span className="request-time">
                        {request.createdAt
                          ? new Date(
                              request.createdAt
                            ).toLocaleString()
                          : ""}
                      </span>

                    </div>

                    <span
                      className={`request-status ${String(
                        request.status || "Pending"
                      ).toLowerCase()}`}
                    >
                      {request.status ||
                        "Pending"}
                    </span>

                  </div>


                  <div className="withdrawal-info">

                    <div>
                      <span>Amount</span>

                      <strong>
                        NPR{" "}
                        {Number(
                          request.amount || 0
                        ).toLocaleString(
                          "en-NP",
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }
                        )}
                      </strong>
                    </div>


                    <div>
                      <span>Method</span>

                      <strong>
                        {request.method ||
                          "Not specified"}
                      </strong>
                    </div>


                    {request.paymentName && (
                      <div>
                        <span>Payment</span>

                        <strong>
                          {request.paymentName}
                        </strong>
                      </div>
                    )}


                    {request.walletAddress && (
                      <div className="wide-info">
                        <span>Wallet Address</span>

                        <strong className="break-text">
                          {request.walletAddress}
                        </strong>
                      </div>
                    )}


                    {request.accountName && (
                      <div>
                        <span>Account Name</span>

                        <strong>
                          {request.accountName}
                        </strong>
                      </div>
                    )}


                    {request.accountNumber && (
                      <div>
                        <span>Account Number</span>

                        <strong>
                          {request.accountNumber}
                        </strong>
                      </div>
                    )}

                  </div>


                  <div className="withdrawal-actions">

                    {request.status === "Pending" ||
                    !request.status ? (
                      <>
                        <button
                          className="approve-btn"
                          onClick={() =>
                            updateStatus(
                              request.id,
                              "Approved"
                            )
                          }
                        >
                          ✓ Approve
                        </button>

                        <button
                          className="reject-btn"
                          onClick={() =>
                            updateStatus(
                              request.id,
                              "Rejected"
                            )
                          }
                        >
                          × Reject
                        </button>
                      </>
                    ) : null}

                    <button
                      className="delete-request-btn"
                      onClick={() =>
                        deleteRequest(request.id)
                      }
                    >
                      Delete
                    </button>

                  </div>

                </article>

              ))

          )}

        </section>

      </main>

    </div>
  );
}

export default AdminWithdrawals;