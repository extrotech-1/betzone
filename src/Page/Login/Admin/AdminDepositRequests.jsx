import { useEffect, useMemo, useState } from "react";
import "./AdminDepositRequests.css";
import { supabase } from "../../../supabaseClient";

/* =========================================================
   LOCAL STORAGE
========================================================= */

function loadLocalRequests() {
  try {
    const saved = JSON.parse(
      localStorage.getItem("depositRequests") || "[]"
    );

    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function saveLocalRequests(requests) {
  try {
    localStorage.setItem(
      "depositRequests",
      JSON.stringify(requests)
    );
  } catch (error) {
    console.error(
      "Could not save local requests:",
      error
    );
  }
}

/* =========================================================
   NORMALIZE SUPABASE ROW
========================================================= */

function normalizeRow(row) {
  return {
    id: row.id,

    // USER UUID
    userId:
      row.user_id ||
      row.userId ||
      "",

    createdAt:
      row.created_at ||
      new Date().toISOString(),

    status:
      row.status ||
      "Pending Verification",

    methodId:
      row.method_id || "",

    methodName:
      row.method_name ||
      "Unknown",

    category:
      row.category || "",

    network:
      row.network || "",

    amount:
      Number(row.amount || 0),

    currency:
      row.currency || "NPR",

    cryptoAmount:
      row.crypto_amount ?? null,

    exchangeRate:
      row.exchange_rate ?? null,

    walletAddress:
      row.wallet_address || "",

    senderAccount:
      row.sender_account || "",

    senderName:
      row.sender_name || "",

    transactionId:
      row.transaction_id || "",

    screenshotName:
      row.screenshot_name || "",

    screenshotSize:
      Number(row.screenshot_size || 0),

    reviewedAt:
      row.reviewed_at || null,
  };
}

/* =========================================================
   SUPABASE
========================================================= */

async function loadSupabaseRequests() {
  const {
    data,
    error,
  } = await supabase
    .from("deposit_requests")
    .select("*")
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    throw error;
  }

  return Array.isArray(data)
    ? data.map(normalizeRow)
    : [];
}

/* =========================================================
   COMPONENT
========================================================= */

function AdminDepositRequests() {
  const [requests, setRequests] =
    useState(loadLocalRequests);

  const [filter, setFilter] =
    useState("All");

  const [selectedId, setSelectedId] =
    useState(null);

  const [notice, setNotice] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [updatingId, setUpdatingId] =
    useState(null);

  /* =======================================================
     LOAD REQUESTS
  ======================================================= */

  async function refreshRequests() {
    try {
      setLoading(true);
      setNotice("");

      const data =
        await loadSupabaseRequests();

      setRequests(data);

      saveLocalRequests(data);

      /*
       * If currently selected request
       * disappeared, clear selection.
       */
      if (
        selectedId &&
        !data.some(
          (item) =>
            item.id === selectedId
        )
      ) {
        setSelectedId(null);
      }
    } catch (error) {
      console.error(
        "Could not load deposit requests:",
        error
      );

      setNotice(
        `Could not load Supabase requests: ${
          error.message ||
          "Unknown error"
        }`
      );
    } finally {
      setLoading(false);
    }
  }

  /* =======================================================
     INITIAL LOAD
  ======================================================= */

  useEffect(() => {
    refreshRequests();

    const refresh = () => {
      refreshRequests();
    };

    window.addEventListener(
      "storage",
      refresh
    );

    window.addEventListener(
      "deposit-request-created",
      refresh
    );

    window.addEventListener(
      "deposit-request-updated",
      refresh
    );

    return () => {
      window.removeEventListener(
        "storage",
        refresh
      );

      window.removeEventListener(
        "deposit-request-created",
        refresh
      );

      window.removeEventListener(
        "deposit-request-updated",
        refresh
      );
    };
  }, []);

  /* =======================================================
     SUPABASE REALTIME
  ======================================================= */

  useEffect(() => {
    const channel =
      supabase
        .channel(
          "admin-deposit-requests"
        )
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "deposit_requests",
          },
          () => {
            refreshRequests();
          }
        )
        .subscribe();

    return () => {
      supabase.removeChannel(
        channel
      );
    };
  }, []);

  /* =======================================================
     FILTER
  ======================================================= */

  const filtered = useMemo(() => {
    if (filter === "All") {
      return requests;
    }

    return requests.filter(
      (request) =>
        request.status === filter
    );
  }, [requests, filter]);

  /* =======================================================
     SELECTED
  ======================================================= */

  const selected =
    requests.find(
      (request) =>
        request.id === selectedId
    );

  /* =======================================================
     UPDATE STATUS
  ======================================================= */

  async function updateStatus(
    id,
    newStatus
  ) {
    if (updatingId) {
      return;
    }

    const request =
      requests.find(
        (item) =>
          item.id === id
      );

    if (!request) {
      setNotice(
        "Deposit request not found."
      );

      return;
    }

    if (
      request.status ===
      newStatus
    ) {
      setNotice(
        `Request ${id} is already ${newStatus}.`
      );

      return;
    }

    /* APPROVE CONFIRMATION */

    if (
      newStatus === "Approved"
    ) {
      const confirmed =
        window.confirm(
          `Approve deposit request ${id}?\n\n` +
          `User ID: ${
            request.userId ||
            "Not available"
          }\n\n` +
          `Amount: ${Number(
            request.amount
          ).toLocaleString()} ${
            request.currency
          }\n\n` +
          `This will only update the deposit request status.`
        );

      if (!confirmed) {
        return;
      }
    }

    /* REJECT CONFIRMATION */

    if (
      newStatus === "Rejected"
    ) {
      const confirmed =
        window.confirm(
          `Reject deposit request ${id}?\n\n` +
          `User ID: ${
            request.userId ||
            "Not available"
          }`
        );

      if (!confirmed) {
        return;
      }
    }

    try {
      setUpdatingId(id);
      setNotice("");

      const reviewedAt =
        new Date().toISOString();

      const {
        data,
        error,
      } = await supabase
        .from("deposit_requests")
        .update({
          status: newStatus,
          reviewed_at: reviewedAt,
        })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      const updated =
        normalizeRow(data);

      const nextRequests =
        requests.map(
          (item) =>
            item.id === id
              ? {
                  ...item,
                  ...updated,
                }
              : item
        );

      setRequests(
        nextRequests
      );

      saveLocalRequests(
        nextRequests
      );

      window.dispatchEvent(
        new Event(
          "deposit-request-updated"
        )
      );

      setNotice(
        `Request ${id} marked as ${newStatus}.`
      );
    } catch (error) {
      console.error(
        "Status update failed:",
        error
      );

      setNotice(
        `Could not update request: ${
          error.message ||
          "Unknown error"
        }`
      );
    } finally {
      setUpdatingId(null);
    }
  }

  /* =======================================================
     CLEAR LOCAL CACHE
  ======================================================= */

  function clearLocalCache() {
    const confirmed =
      window.confirm(
        "Clear only the local browser cache? Supabase requests will NOT be deleted."
      );

    if (!confirmed) {
      return;
    }

    localStorage.removeItem(
      "depositRequests"
    );

    setNotice(
      "Local request cache cleared."
    );

    refreshRequests();
  }

  /* =======================================================
     HELPERS
  ======================================================= */

  function statusClass(status) {
    return String(status || "")
      .toLowerCase()
      .replace(/\s+/g, "-");
  }

  function formatAmount(
    amount,
    currency
  ) {
    const value =
      Number(amount);

    if (
      !Number.isFinite(value)
    ) {
      return `0 ${
        currency || ""
      }`;
    }

    return `${value.toLocaleString(
      "en-NP",
      {
        maximumFractionDigits: 8,
      }
    )} ${currency || ""}`;
  }

  function shortUserId(
    userId
  ) {
    if (!userId) {
      return "User ID unavailable";
    }

    if (userId.length <= 24) {
      return userId;
    }

    return `${userId.slice(
      0,
      12
    )}...${userId.slice(-8)}`;
  }

  async function copyUserId(
    userId
  ) {
    if (!userId) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        userId
      );

      setNotice(
        "User UUID copied."
      );
    } catch (error) {
      console.error(
        "Could not copy UUID:",
        error
      );
    }
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="requests-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="requests-header">

        <div>

          <div className="admin-label">
            ADMIN PANEL
          </div>

          <h1>
            Deposit Requests
          </h1>

          <p>
            Review and manage customer
            deposit submissions.
          </p>

        </div>

        {/* STATS */}

        <div className="request-stats">

          <span>
            <b>
              {requests.length}
            </b>{" "}
            Total
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
            </b>{" "}
            Pending
          </span>

          <span>
            <b>
              {
                requests.filter(
                  (r) =>
                    r.status ===
                    "Approved"
                ).length
              }
            </b>{" "}
            Approved
          </span>

          <span>
            <b>
              {
                requests.filter(
                  (r) =>
                    r.status ===
                    "Rejected"
                ).length
              }
            </b>{" "}
            Rejected
          </span>

        </div>

      </header>

      {/* =================================================
          TOOLBAR
      ================================================= */}

      <div className="request-toolbar">

        {[
          "All",
          "Pending Verification",
          "Approved",
          "Rejected",
        ].map((item) => (
          <button
            key={item}
            type="button"
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
          type="button"
          onClick={
            refreshRequests
          }
          disabled={loading}
        >
          {loading
            ? "Refreshing..."
            : "↻ Refresh"}
        </button>

        <button
          type="button"
          className="danger"
          onClick={
            clearLocalCache
          }
        >
          Clear local cache
        </button>

      </div>

      {/* =================================================
          NOTICE
      ================================================= */}

      {notice && (
        <div className="request-notice">
          ✓ {notice}
        </div>
      )}

      {/* =================================================
          LAYOUT
      ================================================= */}

      <div className="requests-layout">

        {/* =================================================
            REQUEST LIST
        ================================================= */}

        <section className="request-list">

          {filtered.length ===
          0 ? (

            <div className="empty-state">

              <div>
                📭
              </div>

              <h3>
                No deposit requests
              </h3>

              <p>
                New submissions will
                appear here.
              </p>

            </div>

          ) : (

            filtered.map(
              (request) => (

                <button
                  key={request.id}
                  type="button"
                  className={
                    `request-row ${
                      selectedId ===
                      request.id
                        ? "selected"
                        : ""
                    }`
                  }
                  onClick={() =>
                    setSelectedId(
                      request.id
                    )
                  }
                >

                  {/* MAIN */}

                  <div className="request-main">

                    <strong>
                      {request.id}
                    </strong>

                    <span>
                      {request.methodName}

                      {request.network
                        ? ` • ${request.network}`
                        : ""}
                    </span>

                    {/* USER UUID */}

                    <small>
                      User:{" "}
                      {shortUserId(
                        request.userId
                      )}
                    </small>

                  </div>

                  {/* AMOUNT */}

                  <div className="request-amount">

                    {formatAmount(
                      request.amount,
                      request.currency
                    )}

                  </div>

                  {/* STATUS */}

                  <span
                    className={
                      `status-pill ${
                        statusClass(
                          request.status
                        )
                      }`
                    }
                  >
                    {request.status}
                  </span>

                  {/* DATE */}

                  <small>
                    {new Date(
                      request.createdAt
                    ).toLocaleString()}
                  </small>

                </button>

              )
            )

          )}

        </section>

        {/* =================================================
            DETAIL
        ================================================= */}

        <aside className="request-detail">

          {!selected ? (

            <div className="detail-empty">

              Select a request to view
              its details.

            </div>

          ) : (

            <>

              {/* DETAIL TOP */}

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

              {/* =================================================
                  USER INFORMATION
              ================================================= */}

              <div className="user-info-box">

                <div className="user-info-title">
                  👤 User Information
                </div>

                <div className="user-id-row">

                  <div>

                    <span>
                      User UUID
                    </span>

                    <strong>
                      {selected.userId ||
                        "User ID not available"}
                    </strong>

                  </div>

                  {selected.userId && (

                    <button
                      type="button"
                      onClick={() =>
                        copyUserId(
                          selected.userId
                        )
                      }
                    >
                      Copy UUID
                    </button>

                  )}

                </div>

              </div>

              {/* =================================================
                  DETAIL GRID
              ================================================= */}

              <div className="detail-grid">

                <Detail
                  label="Payment Method"
                  value={
                    selected.methodName
                  }
                />

                <Detail
                  label="Category"
                  value={
                    selected.category ||
                    "—"
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
                  label="Amount"
                  value={formatAmount(
                    selected.amount,
                    selected.currency
                  )}
                />

                <Detail
                  label="Crypto Amount"
                  value={
                    selected.cryptoAmount !==
                    null
                      ? String(
                          selected.cryptoAmount
                        )
                      : "—"
                  }
                />

                <Detail
                  label="Exchange Rate"
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
                    selected.createdAt
                      ? new Date(
                          selected.createdAt
                        ).toLocaleString()
                      : "—"
                  }
                />

                <Detail
                  label="Reviewed"
                  value={
                    selected.reviewedAt
                      ? new Date(
                          selected.reviewedAt
                        ).toLocaleString()
                      : "Not reviewed"
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

              {/* =================================================
                  WALLET
              ================================================= */}

              {selected.walletAddress && (

                <div className="upload-note">

                  Wallet address:

                  <br />

                  <strong>
                    {selected.walletAddress}
                  </strong>

                </div>

              )}

              {/* =================================================
                  SCREENSHOT
              ================================================= */}

              {selected.screenshotName && (

                <div className="upload-note">

                  Screenshot:

                  {" "}

                  {selected.screenshotName}

                  {selected.screenshotSize
                    ? ` (${Math.ceil(
                        selected.screenshotSize /
                          1024
                      )} KB)`
                    : ""}

                  <br />

                  The current browser
                  prototype stores
                  screenshot metadata
                  only.

                </div>

              )}

              {/* =================================================
                  DEVELOPMENT NOTICE
              ================================================= */}

              <div className="upload-note">

                <strong>
                  Development mode:
                </strong>{" "}

                Approving this request
                changes only its status.
                It does not transfer,
                credit, or withdraw real
                money.

              </div>

              {/* =================================================
                  ACTIONS
              ================================================= */}

              <div className="detail-actions">

                <button
                  type="button"
                  className="approve"
                  disabled={
                    updatingId ===
                      selected.id ||
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
                  {updatingId ===
                  selected.id
                    ? "UPDATING..."
                    : "✓ Approve"}
                </button>

                <button
                  type="button"
                  className="reject"
                  disabled={
                    updatingId ===
                      selected.id ||
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
                    type="button"
                    className="pending"
                    disabled={
                      updatingId ===
                      selected.id
                    }
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

/* =========================================================
   DETAIL COMPONENT
========================================================= */

function Detail({
  label,
  value,
}) {
  return (
    <div className="detail-item">

      <span>
        {label}
      </span>

      <strong>
        {value || "—"}
      </strong>

    </div>
  );
}

export default AdminDepositRequests;