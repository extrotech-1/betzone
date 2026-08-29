import { useEffect, useMemo, useState } from "react";
import "./AdminDepositRequests.css";
import { supabase } from "../../../supabaseClient";

/*
|--------------------------------------------------------------------------
| STATUS VALUES
|--------------------------------------------------------------------------
| Customer Deposit page currently creates:
| "Pending Verification"
|
| We keep the same value so existing requests continue to work.
|--------------------------------------------------------------------------
*/

const STATUS = {
  PENDING: "Pending Verification",
  APPROVED: "Approved",
  REJECTED: "Rejected",
};

/*
|--------------------------------------------------------------------------
| HELPERS
|--------------------------------------------------------------------------
*/

function getErrorMessage(error) {
  if (!error) {
    return "Unknown error";
  }

  return (
    error.message ||
    error.details ||
    error.hint ||
    "Unknown error"
  );
}

function formatAmount(amount, currency = "NPR") {
  const number = Number(amount);

  if (!Number.isFinite(number)) {
    return `${currency} —`;
  }

  return `${currency} ${number.toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(value) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function shortId(value) {
  if (!value) {
    return "—";
  }

  const text = String(value);

  if (text.length <= 18) {
    return text;
  }

  return `${text.slice(0, 8)}...${text.slice(-6)}`;
}

function normalizeStatus(value) {
  if (!value) {
    return STATUS.PENDING;
  }

  const status = String(value).trim().toLowerCase();

  if (
    status === "approved" ||
    status === "approve"
  ) {
    return STATUS.APPROVED;
  }

  if (
    status === "rejected" ||
    status === "reject"
  ) {
    return STATUS.REJECTED;
  }

  return STATUS.PENDING;
}

function getStatusClass(status) {
  const normalized = normalizeStatus(status);

  if (normalized === STATUS.APPROVED) {
    return "approved";
  }

  if (normalized === STATUS.REJECTED) {
    return "rejected";
  }

  return "pending";
}

/*
|--------------------------------------------------------------------------
| NORMALIZE DATABASE ROW
|--------------------------------------------------------------------------
|
| IMPORTANT:
| We use the actual fields saved by Deposit.jsx:
|
| id
| user_id
| status
| method_id
| method_name
| category
| network
| amount
| currency
| crypto_amount
| exchange_rate
| wallet_address
| sender_account
| sender_name
| transaction_id
| screenshot_name
| screenshot_size
| reviewed_at
|
|--------------------------------------------------------------------------
*/

function normalizeRequest(row) {
  return {
    id: row?.id ?? "",

    user_id: row?.user_id ?? "",

    status: normalizeStatus(row?.status),

    method_id: row?.method_id ?? "",

    method_name:
      row?.method_name ??
      row?.method_id ??
      "Unknown Payment Method",

    category:
      row?.category ??
      row?.type ??
      "Payment",

    network: row?.network ?? "",

    amount: row?.amount ?? 0,

    currency:
      row?.currency ??
      "NPR",

    crypto_amount:
      row?.crypto_amount ??
      null,

    exchange_rate:
      row?.exchange_rate ??
      null,

    wallet_address:
      row?.wallet_address ??
      "",

    sender_account:
      row?.sender_account ??
      "",

    sender_name:
      row?.sender_name ??
      "",

    transaction_id:
      row?.transaction_id ??
      "",

    screenshot_name:
      row?.screenshot_name ??
      "",

    screenshot_size:
      row?.screenshot_size ??
      0,

    reviewed_at:
      row?.reviewed_at ??
      null,

    /*
     * created_at is optional.
     *
     * We DO NOT use it in the Supabase query,
     * because your previous error showed that some
     * tables/configurations did not have created_at.
     */
    created_at:
      row?.created_at ??
      null,

    /*
     * Keep the complete original row.
     * This is useful if additional columns exist.
     */
    raw: row,
  };
}

/*
|--------------------------------------------------------------------------
| LOAD DEPOSIT REQUESTS
|--------------------------------------------------------------------------
*/

async function getDepositRequests() {
  /*
   * IMPORTANT:
   * Do not select payment_method.
   * Do not order by created_at.
   *
   * We simply select all existing columns.
   */

  const {
    data,
    error,
  } = await supabase
    .from("deposit_requests")
    .select("*");

  if (error) {
    throw error;
  }

  return Array.isArray(data)
    ? data.map(normalizeRequest)
    : [];
}

/*
|--------------------------------------------------------------------------
| ADMIN DEPOSIT REQUESTS
|--------------------------------------------------------------------------
*/

function AdminDepositRequests() {
  const [requests, setRequests] =
    useState([]);

  const [filter, setFilter] =
    useState("All");

  const [loading, setLoading] =
    useState(true);

  const [processingId, setProcessingId] =
    useState("");

  const [error, setError] =
    useState("");

  const [notice, setNotice] =
    useState("");

  const [selectedRequest, setSelectedRequest] =
    useState(null);

  /*
   * ---------------------------------------------------------------
   * LOAD
   * ---------------------------------------------------------------
   */

  async function refreshRequests() {
    try {
      setLoading(true);
      setError("");

      const data =
        await getDepositRequests();

      /*
       * Newest first when created_at exists.
       *
       * If created_at doesn't exist,
       * we keep database order.
       */
      const sorted = [...data].sort(
        (a, b) => {
          if (
            a.created_at &&
            b.created_at
          ) {
            return (
              new Date(b.created_at) -
              new Date(a.created_at)
            );
          }

          return 0;
        }
      );

      setRequests(sorted);
    } catch (err) {
      console.error(
        "Could not load deposit requests:",
        err
      );

      setError(
        `Could not load deposit requests: ${getErrorMessage(
          err
        )}`
      );
    } finally {
      setLoading(false);
    }
  }

  /*
   * ---------------------------------------------------------------
   * INITIAL LOAD
   * ---------------------------------------------------------------
   */

  useEffect(() => {
    refreshRequests();

    /*
     * Local event fired by Deposit.jsx
     */
    const handleNewRequest = () => {
      refreshRequests();
    };

    window.addEventListener(
      "deposit-request-created",
      handleNewRequest
    );

    return () => {
      window.removeEventListener(
        "deposit-request-created",
        handleNewRequest
      );
    };
  }, []);

  /*
   * ---------------------------------------------------------------
   * SUPABASE REALTIME
   * ---------------------------------------------------------------
   */

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

  /*
   * ---------------------------------------------------------------
   * COUNTS
   * ---------------------------------------------------------------
   */

  const counts = useMemo(() => {
    let pending = 0;
    let approved = 0;
    let rejected = 0;

    requests.forEach((request) => {
      const status =
        normalizeStatus(
          request.status
        );

      if (
        status ===
        STATUS.APPROVED
      ) {
        approved += 1;
      } else if (
        status ===
        STATUS.REJECTED
      ) {
        rejected += 1;
      } else {
        pending += 1;
      }
    });

    return {
      total: requests.length,
      pending,
      approved,
      rejected,
    };
  }, [requests]);

  /*
   * ---------------------------------------------------------------
   * FILTER
   * ---------------------------------------------------------------
   */

  const filteredRequests =
    useMemo(() => {
      if (filter === "All") {
        return requests;
      }

      if (filter === "Pending") {
        return requests.filter(
          (request) =>
            normalizeStatus(
              request.status
            ) ===
            STATUS.PENDING
        );
      }

      if (filter === "Approved") {
        return requests.filter(
          (request) =>
            normalizeStatus(
              request.status
            ) ===
            STATUS.APPROVED
        );
      }

      if (filter === "Rejected") {
        return requests.filter(
          (request) =>
            normalizeStatus(
              request.status
            ) ===
            STATUS.REJECTED
        );
      }

      return requests;
    }, [requests, filter]);

  /*
   * ---------------------------------------------------------------
   * UPDATE STATUS
   * ---------------------------------------------------------------
   */

  async function updateRequestStatus(
    request,
    newStatus
  ) {
    if (!request?.id) {
      setError(
        "This deposit request has no ID."
      );

      return;
    }

    /*
     * Do not process twice.
     */
    if (processingId) {
      return;
    }

    /*
     * Only pending requests can be
     * approved/rejected.
     */
    const currentStatus =
      normalizeStatus(
        request.status
      );

    if (
      currentStatus !==
      STATUS.PENDING
    ) {
      setError(
        "This request has already been reviewed."
      );

      return;
    }

    const actionText =
      newStatus === STATUS.APPROVED
        ? "approve"
        : "reject";

    const confirmed =
      window.confirm(
        `Are you sure you want to ${actionText} this deposit request?\n\nAmount: ${formatAmount(
          request.amount,
          request.currency
        )}\nPayment: ${
          request.method_name
        }`
      );

    if (!confirmed) {
      return;
    }

    try {
      setProcessingId(
        request.id
      );

      setError("");
      setNotice("");

      /*
       * IMPORTANT:
       *
       * We update by BOTH id and current status.
       *
       * This prevents an old browser tab from
       * approving/rejecting an already reviewed
       * request.
       */

      const {
        data,
        error: updateError,
      } = await supabase
        .from("deposit_requests")
        .update({
          status: newStatus,
          reviewed_at:
            new Date().toISOString(),
        })
        .eq("id", request.id)
        .eq(
          "status",
          STATUS.PENDING
        )
        .select("*")
        .maybeSingle();

      if (updateError) {
        throw updateError;
      }

      /*
       * If no row was returned,
       * the request was probably already
       * reviewed or RLS blocked the update.
       */
      if (!data) {
        throw new Error(
          "No request was updated. It may already have been reviewed, or Supabase Row Level Security is blocking this admin update."
        );
      }

      const updatedRequest =
        normalizeRequest(data);

      /*
       * Update UI immediately.
       */
      setRequests(
        (previous) =>
          previous.map(
            (item) =>
              item.id ===
              request.id
                ? updatedRequest
                : item
          )
      );

      /*
       * Update selected modal.
       */
      setSelectedRequest(
        updatedRequest
      );

      if (
        newStatus ===
        STATUS.APPROVED
      ) {
        setNotice(
          `Deposit request approved successfully. ${formatAmount(
            request.amount,
            request.currency
          )} is marked as approved.`
        );
      } else {
        setNotice(
          `Deposit request rejected successfully.`
        );
      }

      /*
       * Notify other pages/components.
       */
      window.dispatchEvent(
        new Event(
          "deposit-request-updated"
        )
      );
    } catch (err) {
      console.error(
        "Could not update deposit request:",
        err
      );

      setError(
        `Could not ${actionText} deposit request: ${getErrorMessage(
          err
        )}`
      );
    } finally {
      setProcessingId("");
    }
  }

  /*
   * ---------------------------------------------------------------
   * APPROVE
   * ---------------------------------------------------------------
   */

  function approveRequest(request) {
    updateRequestStatus(
      request,
      STATUS.APPROVED
    );
  }

  /*
   * ---------------------------------------------------------------
   * REJECT
   * ---------------------------------------------------------------
   */

  function rejectRequest(request) {
    updateRequestStatus(
      request,
      STATUS.REJECTED
    );
  }

  /*
   * ---------------------------------------------------------------
   * VIEW DETAILS
   * ---------------------------------------------------------------
   */

  function openDetails(request) {
    setSelectedRequest(
      request
    );

    setError("");
    setNotice("");
  }

  function closeDetails() {
    if (processingId) {
      return;
    }

    setSelectedRequest(null);
  }

  /*
   * ---------------------------------------------------------------
   * SCREENSHOT SIZE
   * ---------------------------------------------------------------
   */

  function formatFileSize(bytes) {
    const size =
      Number(bytes);

    if (
      !Number.isFinite(size) ||
      size <= 0
    ) {
      return "—";
    }

    if (size < 1024) {
      return `${size} B`;
    }

    if (size < 1024 * 1024) {
      return `${(
        size / 1024
      ).toFixed(1)} KB`;
    }

    return `${(
      size /
      (1024 * 1024)
    ).toFixed(2)} MB`;
  }

  /*
   * ---------------------------------------------------------------
   * STATUS LABEL
   * ---------------------------------------------------------------
   */

  function StatusBadge({
    status,
  }) {
    const normalized =
      normalizeStatus(status);

    return (
      <span
        className={`deposit-status ${getStatusClass(
          normalized
        )}`}
      >
        {normalized ===
        STATUS.PENDING
          ? "PENDING VERIFICATION"
          : normalized.toUpperCase()}
      </span>
    );
  }

  /*
   * ---------------------------------------------------------------
   * LOADING
   * ---------------------------------------------------------------
   */

  if (loading) {
    return (
      <div className="admin-deposit-page">
        <div className="admin-deposit-container">
          <header className="admin-deposit-header">
            <div>
              <div className="admin-kicker">
                ADMIN PANEL
              </div>

              <h1>
                Deposit Requests
              </h1>

              <p>
                Review, approve and
                reject customer deposit
                requests.
              </p>
            </div>
          </header>

          <div className="deposit-loading-card">
            <div className="deposit-spinner"></div>

            <h3>
              Loading deposit
              requests...
            </h3>

            <p>
              Please wait.
            </p>
          </div>
        </div>
      </div>
    );
  }

  /*
   * ---------------------------------------------------------------
   * PAGE
   * ---------------------------------------------------------------
   */

  return (
    <div className="admin-deposit-page">
      <div className="admin-deposit-container">

        {/* HEADER */}
        <header className="admin-deposit-header">
          <div>
            <div className="admin-kicker">
              ADMIN PANEL
            </div>

            <h1>
              Deposit Requests
            </h1>

            <p>
              Review, approve and reject
              customer deposit requests.
            </p>
          </div>

          <button
            type="button"
            className="admin-refresh-button"
            onClick={
              refreshRequests
            }
            disabled={
              Boolean(processingId)
            }
          >
            ↻ Refresh
          </button>
        </header>

        {/* ALERT */}
        {error && (
          <div className="admin-deposit-alert error">
            <div className="alert-icon">
              !
            </div>

            <div className="alert-message">
              {error}
            </div>

            <button
              type="button"
              onClick={() =>
                setError("")
              }
              className="alert-close"
            >
              ×
            </button>
          </div>
        )}

        {notice && (
          <div className="admin-deposit-alert success">
            <div className="alert-icon">
              ✓
            </div>

            <div className="alert-message">
              {notice}
            </div>

            <button
              type="button"
              onClick={() =>
                setNotice("")
              }
              className="alert-close"
            >
              ×
            </button>
          </div>
        )}

        {/* STAT CARDS */}
        <section className="deposit-stat-grid">

          <div
            className={`deposit-stat-card ${
              filter === "All"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setFilter("All")
            }
          >
            <span>
              TOTAL REQUESTS
            </span>

            <strong>
              {counts.total}
            </strong>
          </div>

          <div
            className={`deposit-stat-card pending ${
              filter === "Pending"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setFilter("Pending")
            }
          >
            <span>
              PENDING
            </span>

            <strong>
              {counts.pending}
            </strong>
          </div>

          <div
            className={`deposit-stat-card approved ${
              filter === "Approved"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setFilter("Approved")
            }
          >
            <span>
              APPROVED
            </span>

            <strong>
              {counts.approved}
            </strong>
          </div>

          <div
            className={`deposit-stat-card rejected ${
              filter === "Rejected"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setFilter("Rejected")
            }
          >
            <span>
              REJECTED
            </span>

            <strong>
              {counts.rejected}
            </strong>
          </div>

        </section>

        {/* REQUEST SECTION */}
        <section className="deposit-requests-section">

          <div className="deposit-section-header">

            <div>
              <div className="admin-kicker">
                CUSTOMER DEPOSITS
              </div>

              <h2>
                Deposit Requests
              </h2>
            </div>

            <div className="deposit-filter-tabs">

              <button
                type="button"
                className={
                  filter === "All"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setFilter("All")
                }
              >
                All ({counts.total})
              </button>

              <button
                type="button"
                className={
                  filter === "Pending"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setFilter(
                    "Pending"
                  )
                }
              >
                Pending (
                {counts.pending}
                )
              </button>

              <button
                type="button"
                className={
                  filter === "Approved"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setFilter(
                    "Approved"
                  )
                }
              >
                Approved (
                {counts.approved}
                )
              </button>

              <button
                type="button"
                className={
                  filter === "Rejected"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setFilter(
                    "Rejected"
                  )
                }
              >
                Rejected (
                {counts.rejected}
                )
              </button>

            </div>

          </div>

          {/* EMPTY */}
          {filteredRequests.length ===
            0 && (
            <div className="deposit-empty-card">

              <div className="empty-icon">
                📭
              </div>

              <h3>
                No deposit requests
              </h3>

              <p>
                There are no requests in
                this category.
              </p>

            </div>
          )}

          {/* REQUEST LIST */}
          <div className="deposit-request-list">

            {filteredRequests.map(
              (request) => {

                const status =
                  normalizeStatus(
                    request.status
                  );

                const isPending =
                  status ===
                  STATUS.PENDING;

                const isProcessing =
                  processingId ===
                  request.id;

                return (
                  <article
                    key={
                      request.id
                    }
                    className="deposit-request-card"
                  >

                    {/* TOP */}
                    <div className="request-card-top">

                      <div>
                        <div className="request-label">
                          REQUEST ID
                        </div>

                        <div className="request-id">
                          {request.id}
                        </div>
                      </div>

                      <StatusBadge
                        status={
                          request.status
                        }
                      />

                    </div>

                    {/* MAIN INFO */}
                    <div className="request-main-grid">

                      {/* CUSTOMER */}
                      <div className="request-info-block">

                        <div className="customer-avatar">
                          {(
                            request.sender_name ||
                            "C"
                          )
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div>
                          <span>
                            CUSTOMER
                          </span>

                          <strong>
                            {request.sender_name ||
                              "Customer"}
                          </strong>

                          {request.user_id && (
                            <small>
                              User:{" "}
                              {shortId(
                                request.user_id
                              )}
                            </small>
                          )}
                        </div>

                      </div>

                      {/* METHOD */}
                      <div className="request-info-block plain">

                        <span>
                          PAYMENT METHOD
                        </span>

                        <strong>
                          {
                            request.method_name
                          }
                        </strong>

                        <small>
                          {
                            request.category
                          }

                          {request.network
                            ? ` • ${request.network}`
                            : ""}
                        </small>

                      </div>

                      {/* AMOUNT */}
                      <div className="request-info-block amount-block">

                        <span>
                          AMOUNT
                        </span>

                        <strong>
                          {formatAmount(
                            request.amount,
                            request.currency
                          )}
                        </strong>

                        {request.crypto_amount && (
                          <small>
                            Crypto:{" "}
                            {
                              request.crypto_amount
                            }
                          </small>
                        )}

                      </div>

                    </div>

                    {/* SECOND ROW */}
                    <div className="request-meta-row">

                      <div>
                        <span>
                          TRANSACTION ID
                        </span>

                        <strong>
                          {request.transaction_id ||
                            "—"}
                        </strong>
                      </div>

                      <div>
                        <span>
                          CREATED
                        </span>

                        <strong>
                          {formatDate(
                            request.created_at
                          )}
                        </strong>
                      </div>

                      {request.reviewed_at && (
                        <div>
                          <span>
                            REVIEWED
                          </span>

                          <strong>
                            {formatDate(
                              request.reviewed_at
                            )}
                          </strong>
                        </div>
                      )}

                    </div>

                    {/* ACTIONS */}
                    <div className="request-card-actions">

                      <button
                        type="button"
                        className="view-details-button"
                        onClick={() =>
                          openDetails(
                            request
                          )
                        }
                      >
                        View Details
                      </button>

                      {isPending && (
                        <div className="request-review-actions">

                          <button
                            type="button"
                            className="reject-button"
                            onClick={() =>
                              rejectRequest(
                                request
                              )
                            }
                            disabled={
                              Boolean(
                                processingId
                              )
                            }
                          >
                            {isProcessing
                              ? "Processing..."
                              : "Reject"}
                          </button>

                          <button
                            type="button"
                            className="approve-button"
                            onClick={() =>
                              approveRequest(
                                request
                              )
                            }
                            disabled={
                              Boolean(
                                processingId
                              )
                            }
                          >
                            {isProcessing
                              ? "Processing..."
                              : "Approve"}
                          </button>

                        </div>
                      )}

                      {!isPending && (
                        <div className="already-reviewed">
                          {status ===
                          STATUS.APPROVED
                            ? "✓ Approved"
                            : "✕ Rejected"}
                        </div>
                      )}

                    </div>

                  </article>
                );
              }
            )}

          </div>

        </section>

      </div>

      {/* DETAILS MODAL */}
      {selectedRequest && (
        <div
          className="deposit-modal-overlay"
          onClick={
            closeDetails
          }
        >
          <div
            className="deposit-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* MODAL HEADER */}
            <div className="deposit-modal-header">

              <div>
                <div className="admin-kicker">
                  DEPOSIT REQUEST
                </div>

                <h2>
                  Request Details
                </h2>
              </div>

              <button
                type="button"
                className="modal-close-button"
                onClick={
                  closeDetails
                }
              >
                ×
              </button>

            </div>

            {/* STATUS */}
            <div className="modal-status-row">

              <StatusBadge
                status={
                  selectedRequest.status
                }
              />

              <span>
                ID:{" "}
                {selectedRequest.id}
              </span>

            </div>

            {/* AMOUNT */}
            <div className="modal-amount-card">

              <span>
                DEPOSIT AMOUNT
              </span>

              <strong>
                {formatAmount(
                  selectedRequest.amount,
                  selectedRequest.currency
                )}
              </strong>

            </div>

            {/* DETAILS */}
            <div className="modal-detail-grid">

              <div className="modal-detail">
                <span>
                  CUSTOMER
                </span>

                <strong>
                  {selectedRequest.sender_name ||
                    "Customer"}
                </strong>
              </div>

              <div className="modal-detail">
                <span>
                  USER ID
                </span>

                <strong className="break-text">
                  {selectedRequest.user_id ||
                    "—"}
                </strong>
              </div>

              <div className="modal-detail">
                <span>
                  PAYMENT METHOD
                </span>

                <strong>
                  {
                    selectedRequest.method_name
                  }
                </strong>
              </div>

              <div className="modal-detail">
                <span>
                  METHOD ID
                </span>

                <strong>
                  {selectedRequest.method_id ||
                    "—"}
                </strong>
              </div>

              <div className="modal-detail">
                <span>
                  CATEGORY
                </span>

                <strong>
                  {
                    selectedRequest.category
                  }
                </strong>
              </div>

              <div className="modal-detail">
                <span>
                  NETWORK
                </span>

                <strong>
                  {selectedRequest.network ||
                    "—"}
                </strong>
              </div>

              <div className="modal-detail">
                <span>
                  SENDER ACCOUNT
                </span>

                <strong>
                  {selectedRequest.sender_account ||
                    "—"}
                </strong>
              </div>

              <div className="modal-detail">
                <span>
                  TRANSACTION ID
                </span>

                <strong>
                  {selectedRequest.transaction_id ||
                    "—"}
                </strong>
              </div>

              <div className="modal-detail">
                <span>
                  CURRENCY
                </span>

                <strong>
                  {selectedRequest.currency ||
                    "NPR"}
                </strong>
              </div>

              <div className="modal-detail">
                <span>
                  CREATED
                </span>

                <strong>
                  {formatDate(
                    selectedRequest.created_at
                  )}
                </strong>
              </div>

              <div className="modal-detail">
                <span>
                  REVIEWED
                </span>

                <strong>
                  {formatDate(
                    selectedRequest.reviewed_at
                  )}
                </strong>
              </div>

              {selectedRequest.crypto_amount && (
                <div className="modal-detail">
                  <span>
                    CRYPTO AMOUNT
                  </span>

                  <strong>
                    {
                      selectedRequest.crypto_amount
                    }
                  </strong>
                </div>
              )}

              {selectedRequest.exchange_rate && (
                <div className="modal-detail">
                  <span>
                    EXCHANGE RATE
                  </span>

                  <strong>
                    1 USDT ={" "}
                    {
                      selectedRequest.exchange_rate
                    }{" "}
                    NPR
                  </strong>
                </div>
              )}

              {selectedRequest.wallet_address && (
                <div className="modal-detail full">
                  <span>
                    WALLET ADDRESS
                  </span>

                  <strong className="break-text">
                    {
                      selectedRequest.wallet_address
                    }
                  </strong>
                </div>
              )}

            </div>

            {/* SCREENSHOT */}
            <div className="modal-file-section">

              <div className="modal-file-header">
                <span>
                  PAYMENT SCREENSHOT
                </span>
              </div>

              {selectedRequest.screenshot_name ? (
                <div className="file-info-card">

                  <div className="file-icon">
                    📎
                  </div>

                  <div>
                    <strong>
                      {
                        selectedRequest.screenshot_name
                      }
                    </strong>

                    <span>
                      {formatFileSize(
                        selectedRequest.screenshot_size
                      )}
                    </span>
                  </div>

                </div>
              ) : (
                <div className="no-file">
                  No screenshot metadata
                  available.
                </div>
              )}

            </div>

            {/* MODAL ACTIONS */}
            <div className="deposit-modal-actions">

              {normalizeStatus(
                selectedRequest.status
              ) ===
                STATUS.PENDING ? (
                <>
                  <button
                    type="button"
                    className="reject-button large"
                    onClick={() =>
                      rejectRequest(
                        selectedRequest
                      )
                    }
                    disabled={
                      Boolean(
                        processingId
                      )
                    }
                  >
                    {processingId
                      ? "Processing..."
                      : "Reject Deposit"}
                  </button>

                  <button
                    type="button"
                    className="approve-button large"
                    onClick={() =>
                      approveRequest(
                        selectedRequest
                      )
                    }
                    disabled={
                      Boolean(
                        processingId
                      )
                    }
                  >
                    {processingId
                      ? "Processing..."
                      : "Approve Deposit"}
                  </button>
                </>
              ) : (
                <div className="reviewed-message">
                  This deposit request has
                  already been reviewed.
                </div>
              )}

            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default AdminDepositRequests;