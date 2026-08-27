import { useEffect, useMemo, useState } from "react";
import "./AdminDepositRequests.css";

function loadRequests() {
  try {
    const saved = JSON.parse(
      localStorage.getItem("depositRequests") || "[]"
    );

    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function AdminDepositRequests() {
  const [requests, setRequests] = useState(loadRequests);
  const [filter, setFilter] = useState("All");
  const [selectedId, setSelectedId] = useState(null);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const refresh = () => {
      setRequests(loadRequests());
    };

    window.addEventListener("storage", refresh);
    window.addEventListener("deposit-request-created", refresh);
    window.addEventListener("deposit-request-updated", refresh);

    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("deposit-request-created", refresh);
      window.removeEventListener("deposit-request-updated", refresh);
    };
  }, []);

  const filtered = useMemo(() => {
    if (filter === "All") {
      return requests;
    }

    return requests.filter(
      (request) => request.status === filter
    );
  }, [requests, filter]);

  const selected = requests.find(
    (request) => request.id === selectedId
  );

  // ==========================================
  // APPROVE / REJECT / PENDING
  // ==========================================

  function updateStatus(id, status) {
    const currentRequests = loadRequests();

    const request = currentRequests.find(
      (r) => r.id === id
    );

    if (!request) {
      setNotice("Deposit request not found.");
      return;
    }

    const oldStatus = request.status;

    // Same status - nothing to do
    if (oldStatus === status) {
      return;
    }

    let currentBalance = Number(
      localStorage.getItem("userBalance") || "0"
    );

    const depositAmount =
      Number(request.amount) || 0;

    // ------------------------------------------
    // PENDING -> APPROVED
    // ADD MONEY
    // ------------------------------------------

    if (
      oldStatus === "Pending Verification" &&
      status === "Approved"
    ) {
      currentBalance += depositAmount;
    }

    // ------------------------------------------
    // APPROVED -> PENDING
    // REMOVE MONEY
    // ------------------------------------------

    if (
      oldStatus === "Approved" &&
      status === "Pending Verification"
    ) {
      currentBalance -= depositAmount;
    }

    // ------------------------------------------
    // APPROVED -> REJECTED
    // REMOVE MONEY
    // ------------------------------------------

    if (
      oldStatus === "Approved" &&
      status === "Rejected"
    ) {
      currentBalance -= depositAmount;
    }

    // ------------------------------------------
    // REJECTED -> APPROVED
    // ADD MONEY
    // ------------------------------------------

    if (
      oldStatus === "Rejected" &&
      status === "Approved"
    ) {
      currentBalance += depositAmount;
    }

    // ------------------------------------------
    // PENDING -> REJECTED
    // No balance change
    // ------------------------------------------

    // ------------------------------------------
    // REJECTED -> PENDING
    // No balance change
    // ------------------------------------------

    // Balance negative nahi hone denge
    if (currentBalance < 0) {
      currentBalance = 0;
    }

    // Save balance
    localStorage.setItem(
      "userBalance",
      currentBalance.toString()
    );

    // Update request status
    const next = currentRequests.map((r) =>
      r.id === id
        ? {
            ...r,
            status,
            reviewedAt: new Date().toISOString(),
          }
        : r
    );

    // Update React state
    setRequests(next);

    // Save requests
    localStorage.setItem(
      "depositRequests",
      JSON.stringify(next)
    );

    // Show notification
    setNotice(
      `Request ${id} marked as ${status}. Balance: NPR ${currentBalance.toLocaleString(
        "en-NP",
        {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }
      )}`
    );

    // Tell other components to refresh
    window.dispatchEvent(
      new Event("deposit-request-updated")
    );

    window.dispatchEvent(
      new Event("balance-updated")
    );
  }

  // ==========================================
  // CLEAR REQUESTS
  // ==========================================

  function clearRequests() {
    if (
      !window.confirm(
        "Delete all demo deposit requests from this browser?"
      )
    ) {
      return;
    }

    localStorage.removeItem("depositRequests");

    setRequests([]);
    setSelectedId(null);

    setNotice("All demo requests deleted.");
  }

  // ==========================================
  // STATUS CLASS
  // ==========================================

  function statusClass(status) {
    return status
      .toLowerCase()
      .replace(/\s+/g, "-");
  }

  return (
    <div className="requests-page">

      {/* HEADER */}

      <header className="requests-header">

        <div>
          <div className="admin-label">
            ADMIN PANEL
          </div>

          <h1>
            Deposit Requests
          </h1>

          <p>
            Review, approve or reject customer
            deposit submissions.
          </p>
        </div>

        <div className="request-stats">

          <span>
            <b>{requests.length}</b>
            {" "}Total
          </span>

          <span>
            <b>
              {
                requests.filter(
                  (r) =>
                    r.status ===
                    "Pending Verification"
                ).length
              }
            </b>
            {" "}Pending
          </span>

          <span>
            <b>
              {
                requests.filter(
                  (r) =>
                    r.status === "Approved"
                ).length
              }
            </b>
            {" "}Approved
          </span>

        </div>

      </header>


      {/* TOOLBAR */}

      <div className="request-toolbar">

        {[
          "All",
          "Pending Verification",
          "Approved",
          "Rejected",
        ].map((item) => (

          <button
            key={item}
            className={
              filter === item
                ? "active"
                : ""
            }
            onClick={() =>
              setFilter(item)
            }
          >
            {item}
          </button>

        ))}

        <button
          className="danger"
          onClick={clearRequests}
        >
          Clear demo requests
        </button>

      </div>


      {/* NOTICE */}

      {notice && (
        <div className="request-notice">
          ✓ {notice}
        </div>
      )}


      {/* MAIN */}

      <div className="requests-layout">

        {/* REQUEST LIST */}

        <section className="request-list">

          {filtered.length === 0 ? (

            <div className="empty-state">

              <div>
                📭
              </div>

              <h3>
                No deposit requests
              </h3>

              <p>
                New submissions will appear here.
              </p>

            </div>

          ) : (

            filtered.map((r) => (

              <button
                key={r.id}
                className={
                  `request-row ${
                    selectedId === r.id
                      ? "selected"
                      : ""
                  }`
                }
                onClick={() =>
                  setSelectedId(r.id)
                }
              >

                <div className="request-main">

                  <strong>
                    {r.id}
                  </strong>

                  <span>
                    {r.methodName}

                    {r.network
                      ? ` • ${r.network}`
                      : ""}
                  </span>

                </div>


                <div className="request-amount">

                  {Number(
                    r.amount
                  ).toLocaleString()}

                  {" "}

                  {r.currency}

                </div>


                <span
                  className={
                    `status-pill ${
                      statusClass(
                        r.status
                      )
                    }`
                  }
                >
                  {r.status}
                </span>


                <small>
                  {new Date(
                    r.createdAt
                  ).toLocaleString()}
                </small>

              </button>

            ))

          )}

        </section>


        {/* DETAILS */}

        <aside className="request-detail">

          {!selected ? (

            <div className="detail-empty">

              Select a request to view
              its details.

            </div>

          ) : (

            <>

              {/* DETAIL HEADER */}

              <div className="detail-top">

                <div>

                  <span>
                    Deposit Request
                  </span>

                  <h2>
                    {selected.id}
                  </h2>

                </div>


                <span
                  className={
                    `status-pill ${
                      statusClass(
                        selected.status
                      )
                    }`
                  }
                >
                  {selected.status}
                </span>

              </div>


              {/* DETAILS GRID */}

              <div className="detail-grid">

                <Detail
                  label="Payment Method"
                  value={
                    selected.methodName
                  }
                />

                <Detail
                  label="Network"
                  value={
                    selected.network ||
                    "—"
                  }
                />

                <Detail
                  label="User Amount"
                  value={
                    `${Number(
                      selected.amount
                    ).toLocaleString()} ${
                      selected.currency
                    }`
                  }
                />

                <Detail
                  label="Crypto Amount"
                  value={
                    selected.cryptoAmount
                      ? `${selected.cryptoAmount} ${
                          selected.currency ===
                          "NPR"
                            ? "USDT"
                            : selected.currency
                        }`
                      : "—"
                  }
                />

                <Detail
                  label="Rate at Creation"
                  value={
                    selected.exchangeRate
                      ? `${selected.exchangeRate} NPR/USDT`
                      : "—"
                  }
                />

                <Detail
                  label="Transaction ID / Hash"
                  value={
                    selected.transactionId ||
                    "—"
                  }
                />

                <Detail
                  label="Sender Account"
                  value={
                    selected.senderAccount ||
                    "—"
                  }
                />

                <Detail
                  label="Sender Name"
                  value={
                    selected.senderName ||
                    "—"
                  }
                />

                <Detail
                  label="Submitted"
                  value={
                    new Date(
                      selected.createdAt
                    ).toLocaleString()
                  }
                />

                <Detail
                  label="Screenshot"
                  value={
                    selected.screenshotName ||
                    "Not uploaded"
                  }
                />

              </div>


              {/* SCREENSHOT INFO */}

              {selected.screenshotName && (

                <div className="upload-note">

                  Screenshot metadata saved:

                  {" "}

                  {selected.screenshotName}

                  {" "}

                  (
                  {Math.ceil(
                    selected.screenshotSize /
                      1024
                  )}
                  {" "}KB)

                  <br />

                  In this browser-only
                  prototype the file itself
                  is not uploaded to a server.

                </div>

              )}


              {/* ACTION BUTTONS */}

              <div className="detail-actions">

                <button
                  className="approve"
                  disabled={
                    selected.status ===
                    "Approved"
                  }
                  onClick={() =>
                    updateStatus(
                      selected.id,
                      "Approved"
                    )
                  }
                >
                  ✓ Approve
                </button>


                <button
                  className="reject"
                  disabled={
                    selected.status ===
                    "Rejected"
                  }
                  onClick={() =>
                    updateStatus(
                      selected.id,
                      "Rejected"
                    )
                  }
                >
                  ✕ Reject
                </button>


                {selected.status !==
                  "Pending Verification" && (

                  <button
                    className="pending"
                    onClick={() =>
                      updateStatus(
                        selected.id,
                        "Pending Verification"
                      )
                    }
                  >
                    ↻ Set Pending
                  </button>

                )}

              </div>

            </>

          )}

        </aside>

      </div>

    </div>
  );
}


// ==========================================
// DETAIL COMPONENT
// ==========================================

function Detail({ label, value }) {
  return (
    <div className="detail-item">

      <span>
        {label}
      </span>

      <strong>
        {value}
      </strong>

    </div>
  );
}


export default AdminDepositRequests;