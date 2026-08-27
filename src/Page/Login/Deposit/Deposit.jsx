import { useEffect, useMemo, useState } from "react";
import "./Deposit.css";

const defaultMethods = [
  { id: "esewa", name: "eSewa", category: "Local Payment", icon: "e", color: "#49b64a", recommended: true, enabled: true, accountName: "", accountNumber: "", qrImage: "", minAmount: 500, maxAmount: 25000 },
  { id: "khalti", name: "Khalti", category: "Local Payment", icon: "K", color: "#5c2d91", recommended: true, enabled: true, accountName: "", accountNumber: "", qrImage: "", minAmount: 500, maxAmount: 25000 },
  { id: "bank", name: "Bank Transfer", category: "Local Payment", icon: "B", color: "#2563eb", recommended: false, enabled: true, accountName: "", accountNumber: "", bankName: "", branch: "", qrImage: "", minAmount: 500, maxAmount: 25000 },

  { id: "tether-ton", name: "Tether on TON", category: "Cryptocurrency", icon: "₮", color: "#26a17b", enabled: true, network: "TON", walletAddress: "", qrImage: "", minAmount: 3, maxAmount: 100000 },
  { id: "tether-tron", name: "Tether on Tron", category: "Cryptocurrency", icon: "₮", color: "#26a17b", enabled: true, network: "TRON", walletAddress: "", qrImage: "", minAmount: 3, maxAmount: 100000 },
  { id: "tether-bsc", name: "Tether on BSC", category: "Cryptocurrency", icon: "₮", color: "#26a17b", enabled: true, network: "BSC", walletAddress: "", qrImage: "", minAmount: 3, maxAmount: 100000 },
  { id: "tether-ethereum", name: "Tether on Ethereum", category: "Cryptocurrency", icon: "₮", color: "#26a17b", enabled: true, network: "Ethereum", walletAddress: "", qrImage: "", minAmount: 3, maxAmount: 100000 },
  { id: "tron", name: "TRON", category: "Cryptocurrency", icon: "T", color: "#e33b45", enabled: true, network: "TRON", walletAddress: "", qrImage: "", minAmount: 10, maxAmount: 100000 },
  { id: "bitcoin", name: "Bitcoin", category: "Cryptocurrency", icon: "₿", color: "#f7931a", enabled: true, network: "Bitcoin", walletAddress: "", qrImage: "", minAmount: 0.0001, maxAmount: 10 },
  { id: "litecoin", name: "Litecoin", category: "Cryptocurrency", icon: "Ł", color: "#345d9d", enabled: true, network: "Litecoin", walletAddress: "", qrImage: "", minAmount: 0.01, maxAmount: 100 },
  { id: "ethereum", name: "Ethereum", category: "Cryptocurrency", icon: "Ξ", color: "#627eea", enabled: true, network: "Ethereum", walletAddress: "", qrImage: "", minAmount: 0.001, maxAmount: 100 },
  { id: "bnb", name: "Binance Coin BSC", category: "Cryptocurrency", icon: "B", color: "#f3ba2f", enabled: true, network: "BSC", walletAddress: "", qrImage: "", minAmount: 0.01, maxAmount: 100 },
  { id: "dogecoin", name: "Dogecoin", category: "Cryptocurrency", icon: "Ð", color: "#c2a633", enabled: true, network: "Dogecoin", walletAddress: "", qrImage: "", minAmount: 10, maxAmount: 100000 },
  { id: "usdc-eth", name: "USD Coin on Ethereum", category: "Cryptocurrency", icon: "$", color: "#2775ca", enabled: true, network: "Ethereum", walletAddress: "", qrImage: "", minAmount: 3, maxAmount: 100000 },
  { id: "xrp", name: "XRP", category: "Cryptocurrency", icon: "X", color: "#23292f", enabled: true, network: "XRP", walletAddress: "", qrImage: "", minAmount: 5, maxAmount: 100000 },
  { id: "polygon", name: "Polygon", category: "Cryptocurrency", icon: "P", color: "#8247e5", enabled: true, network: "Polygon", walletAddress: "", qrImage: "", minAmount: 1, maxAmount: 100000 },
];

function loadMethods() {
  try {
    const saved = JSON.parse(localStorage.getItem("adminPaymentMethods") || "null");

    if (!Array.isArray(saved)) {
      return defaultMethods;
    }

    return defaultMethods.map((base) => ({
      ...base,
      ...(saved.find((item) => item.id === base.id || item.name === base.name) || {}),
    }));
  } catch {
    return defaultMethods;
  }
}

function loadRequestById(id) {
  if (!id) return null;

  try {
    const requests = JSON.parse(localStorage.getItem("depositRequests") || "[]");

    if (!Array.isArray(requests)) return null;

    return requests.find((request) => request.id === id) || null;
  } catch {
    return null;
  }
}

function Deposit({ onBack }) {
  const [methods, setMethods] = useState(loadMethods);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [search, setSearch] = useState("");

  const [amount, setAmount] = useState("");
  const [senderAccount, setSenderAccount] = useState("");
  const [senderName, setSenderName] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [screenshot, setScreenshot] = useState(null);

  const [depositError, setDepositError] = useState("");
  const [depositSubmitted, setDepositSubmitted] = useState(false);

  const [rate, setRate] = useState(169.7335108);
  const [cryptoAmount, setCryptoAmount] = useState("");

  // NEW: keeps the public page synchronized with Admin approval/rejection.
  const [createdRequest, setCreatedRequest] = useState(null);

  useEffect(() => {
    const refresh = () => {
      setMethods(loadMethods());

      try {
        const savedRate = Number(localStorage.getItem("usdtNprRate"));

        if (savedRate > 0) {
          setRate(savedRate);
        }
      } catch {}
    };

    refresh();

    window.addEventListener("storage", refresh);
    window.addEventListener("payment-config-updated", refresh);

    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("payment-config-updated", refresh);
    };
  }, []);

  // NEW: watch the latest deposit request for Admin status changes.
  useEffect(() => {
    if (!createdRequest?.id) return;

    const syncStatus = () => {
      const latest = loadRequestById(createdRequest.id);

      if (latest) {
        setCreatedRequest(latest);
      }
    };

    syncStatus();

    const interval = window.setInterval(syncStatus, 1000);

    window.addEventListener("storage", syncStatus);
    window.addEventListener("deposit-request-updated", syncStatus);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("storage", syncStatus);
      window.removeEventListener("deposit-request-updated", syncStatus);
    };
  }, [createdRequest?.id]);

  const visibleMethods = useMemo(
    () =>
      methods.filter(
        (m) =>
          m.enabled &&
          m.name.toLowerCase().includes(search.toLowerCase())
      ),
    [methods, search]
  );

  const localPayments = visibleMethods.filter(
    (m) => m.category === "Local Payment"
  );

  const cryptoPayments = visibleMethods.filter(
    (m) => m.category === "Cryptocurrency"
  );

  const isCrypto = selectedMethod?.category === "Cryptocurrency";

  const cryptoUnit = selectedMethod?.name
    ?.toLowerCase()
    .includes("tether")
    ? "USDT"
    : selectedMethod?.name;

  function openPaymentMethod(method) {
    setSelectedMethod(method);
    setAmount("");
    setCryptoAmount("");
    setSenderAccount("");
    setSenderName("");
    setTransactionId("");
    setScreenshot(null);
    setDepositError("");
    setDepositSubmitted(false);
    setCreatedRequest(null);
  }

  function copyText(text) {
    if (text) {
      navigator.clipboard?.writeText(text);
    }
  }

  function submitDeposit(e) {
    e.preventDefault();
    setDepositError("");

    if (!selectedMethod) {
      setDepositError("Please select a payment method.");
      return;
    }

    const value = Number(amount);

    const min = Number(
      selectedMethod.minAmount ??
        (selectedMethod.category === "Local Payment" ? 500 : 0)
    );

    const max = Number(
      selectedMethod.maxAmount ??
        (selectedMethod.category === "Local Payment"
          ? 25000
          : Infinity)
    );

    // Crypto amount validation.
    if (isCrypto) {
      const cryptoValue = Number(cryptoAmount);

      if (!cryptoValue || cryptoValue <= 0) {
        setDepositError(`Please enter a valid ${cryptoUnit} amount.`);
        return;
      }

      if (cryptoValue < min || cryptoValue > max) {
        setDepositError(
          `${cryptoUnit} amount must be between ${min} and ${max}.`
        );
        return;
      }
    } else {
      // Local payment validation.
      if (!value || value < min || value > max) {
        setDepositError(
          `Amount must be between NPR ${min.toLocaleString()} and NPR ${max.toLocaleString()}.`
        );
        return;
      }
    }

    if (selectedMethod.category === "Local Payment") {
      if (!senderAccount.trim() || !senderName.trim()) {
        setDepositError(
          "Please enter your payment account number and account name."
        );
        return;
      }

      if (!transactionId.trim()) {
        setDepositError(
          "Please enter the Transaction ID / Reference No."
        );
        return;
      }

      if (!screenshot) {
        setDepositError("Please upload your payment screenshot.");
        return;
      }
    } else {
      if (!selectedMethod.walletAddress) {
        setDepositError(
          "This cryptocurrency wallet is not configured by admin yet."
        );
        return;
      }

      if (!transactionId.trim()) {
        setDepositError("Please enter the transaction hash.");
        return;
      }
    }

    const requestId = `DP${Date.now().toString().slice(-8)}`;
    const createdAt = new Date().toISOString();

    // For crypto, amount is the crypto amount.
    // For local payments, amount is NPR.
    const request = {
      id: requestId,
      createdAt,
      status: "Pending Verification",

      methodId: selectedMethod.id,
      methodName: selectedMethod.name,
      category: selectedMethod.category,
      network: selectedMethod.network || "",

      amount: isCrypto ? Number(cryptoAmount) : value,
      currency: isCrypto ? cryptoUnit : "NPR",

      cryptoAmount: isCrypto
        ? Number(cryptoAmount)
        : null,

      // Snapshot the exchange rate at request creation.
      exchangeRate:
        isCrypto &&
        selectedMethod.name.toLowerCase().includes("tether")
          ? Number(rate)
          : null,

      walletAddress: isCrypto
        ? selectedMethod.walletAddress
        : "",

      senderAccount: senderAccount.trim(),
      senderName: senderName.trim(),

      transactionId: transactionId.trim(),

      screenshotName: screenshot?.name || "",
      screenshotType: screenshot?.type || "",
      screenshotSize: screenshot?.size || 0,
    };

    try {
      const existing = JSON.parse(
        localStorage.getItem("depositRequests") || "[]"
      );

      const safeExisting = Array.isArray(existing)
        ? existing
        : [];

      localStorage.setItem(
        "depositRequests",
        JSON.stringify([request, ...safeExisting])
      );

      localStorage.setItem(
        "lastDepositRequestId",
        requestId
      );

      // Public page and Admin page can listen for this.
      window.dispatchEvent(
        new Event("deposit-request-created")
      );

      setCreatedRequest(request);
      setDepositSubmitted(true);
    } catch {
      setDepositError(
        "Could not save the deposit request in this browser. Please try again."
      );
    }
  }

  const currentStatus =
    createdRequest?.status || "Pending Verification";

  const statusClass = String(currentStatus)
    .toLowerCase()
    .replace(/\s+/g, "-");

  function statusMessage() {
    if (currentStatus === "Approved") {
      return "Your deposit has been approved by the admin.";
    }

    if (currentStatus === "Rejected") {
      return "Your deposit request was rejected. Please contact support or create a new request.";
    }

    return "Your deposit is waiting for admin verification.";
  }

  return (
    <div className="deposit-page">
      <header className="deposit-header">
        <button
          className="deposit-back"
          onClick={onBack}
        >
          ← Back
        </button>

        <div className="deposit-logo">
          BET<span>ZONE</span>
        </div>

        <div className="deposit-title-small">
          Deposit
        </div>
      </header>

      <main className="deposit-content">
        <div className="deposit-heading">
          <h1>Deposit</h1>
          <p>Select your preferred payment method</p>
        </div>

        <input
          className="deposit-search"
          type="text"
          placeholder="Search payment method..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <section className="payment-section">
          <div className="payment-section-heading">
            <h2>Local Payments</h2>
            <span>{localPayments.length}</span>
          </div>

          <div className="payment-grid">
            {localPayments.map((method) => (
              <button
                className="payment-card"
                key={method.id}
                onClick={() => openPaymentMethod(method)}
              >
                {method.recommended && (
                  <span className="recommended-badge">
                    RECOMMENDED
                  </span>
                )}

                <div
                  className="payment-icon"
                  style={{ background: method.color }}
                >
                  {method.icon}
                </div>

                <strong>{method.name}</strong>

                <span className="payment-arrow">
                  →
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className="payment-section">
          <div className="payment-section-heading">
            <h2>Cryptocurrency</h2>
            <span>{cryptoPayments.length}</span>
          </div>

          <div className="payment-grid">
            {cryptoPayments.map((method) => (
              <button
                className="payment-card"
                key={method.id}
                onClick={() => openPaymentMethod(method)}
              >
                <div
                  className="payment-icon"
                  style={{ background: method.color }}
                >
                  {method.icon}
                </div>

                <strong>{method.name}</strong>

                <small>{method.network}</small>

                <span className="payment-arrow">
                  →
                </span>
              </button>
            ))}
          </div>
        </section>
      </main>

      {selectedMethod && (
        <div
          className="payment-overlay"
          onClick={() => setSelectedMethod(null)}
        >
          <div
            className="payment-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={() => setSelectedMethod(null)}
            >
              ×
            </button>

            <div
              className="modal-payment-icon"
              style={{
                background: selectedMethod.color,
              }}
            >
              {selectedMethod.icon}
            </div>

            <h2>{selectedMethod.name}</h2>

            {isCrypto ? (
              <>
                <div className="detail-row">
                  <span>Network</span>
                  <strong>
                    {selectedMethod.network ||
                      "Not configured"}
                  </strong>
                </div>

                {selectedMethod.name
                  .toLowerCase()
                  .includes("tether") && (
                  <div className="rate-box">
                    1 USDT ={" "}
                    {Number(rate).toFixed(7)} NPR
                  </div>
                )}

                <p className="modal-subtitle">
                  Copy the address or scan the QR code:
                </p>

                {selectedMethod.qrImage ? (
                  <div className="qr-box">
                    <img
                      src={selectedMethod.qrImage}
                      alt={`${selectedMethod.name} QR`}
                      className="admin-qr-image"
                    />
                  </div>
                ) : (
                  <div className="qr-box">
                    <div className="qr-not-configured">
                      QR not configured
                    </div>
                  </div>
                )}

                <div className="wallet-box">
                  <span>
                    {selectedMethod.walletAddress ||
                      "Wallet address not configured"}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      copyText(
                        selectedMethod.walletAddress
                      )
                    }
                  >
                    Copy
                  </button>
                </div>

                <div className="warning-box">
                  Send only through the configured{" "}
                  <strong>
                    {selectedMethod.network}
                  </strong>{" "}
                  network. Sending through another
                  network can result in loss of funds.
                </div>

                {depositSubmitted ? (
                  <div
                    className={`success-box deposit-status-${statusClass}`}
                  >
                    <strong>
                      {currentStatus === "Approved"
                        ? "Deposit Approved"
                        : currentStatus === "Rejected"
                        ? "Deposit Rejected"
                        : "Deposit Request Created"}
                    </strong>

                    <span>
                      Status: {currentStatus}
                    </span>

                    <span>
                      Your request ID:{" "}
                      {createdRequest?.id || "Created"}
                    </span>

                    <small>
                      {statusMessage()}
                    </small>

                    {createdRequest?.reviewedAt && (
                      <small>
                        Reviewed:{" "}
                        {new Date(
                          createdRequest.reviewedAt
                        ).toLocaleString()}
                      </small>
                    )}
                  </div>
                ) : (
                  <form
                    className="local-deposit-form"
                    onSubmit={submitDeposit}
                  >
                    <div className="form-field">
                      <label>
                        Crypto Amount
                      </label>

                      <input
                        type="number"
                        min={
                          selectedMethod.minAmount ?? 0
                        }
                        max={
                          selectedMethod.maxAmount ??
                          undefined
                        }
                        step="any"
                        value={cryptoAmount}
                        onChange={(e) => {
                          const v = e.target.value;

                          setCryptoAmount(v);

                          if (
                            selectedMethod.name
                              .toLowerCase()
                              .includes("tether") &&
                            Number(v) > 0
                          ) {
                            setAmount(
                              String(
                                (
                                  Number(v) *
                                  Number(rate)
                                ).toFixed(2)
                              )
                            );
                          } else {
                            setAmount("");
                          }
                        }}
                        placeholder={`Enter ${cryptoUnit}`}
                      />

                      <small>
                        Minimum:{" "}
                        {selectedMethod.minAmount ?? 0}{" "}
                        {cryptoUnit}
                        {" • "}
                        Maximum:{" "}
                        {selectedMethod.maxAmount ??
                          "No limit"}{" "}
                        {cryptoUnit}
                      </small>
                    </div>

                    {selectedMethod.name
                      .toLowerCase()
                      .includes("tether") && (
                      <div className="form-field">
                        <label>
                          NPR Value
                        </label>

                        <input
                          type="text"
                          value={
                            amount
                              ? `${Number(
                                  amount
                                ).toLocaleString()} NPR`
                              : ""
                          }
                          readOnly
                        />
                      </div>
                    )}

                    <div className="form-field">
                      <label>
                        Transaction Hash / ID
                      </label>

                      <input
                        type="text"
                        value={transactionId}
                        onChange={(e) =>
                          setTransactionId(
                            e.target.value
                          )
                        }
                        placeholder="Enter transaction hash"
                      />
                    </div>

                    {depositError && (
                      <div className="deposit-error">
                        {depositError}
                      </div>
                    )}

                    <button
                      type="submit"
                      className="deposit-submit"
                    >
                      Create Deposit Request
                    </button>
                  </form>
                )}
              </>
            ) : (
              <>
                <p className="modal-subtitle">
                  Before creating a request, transfer
                  the funds within 10 minutes using the
                  payment details provided below.
                </p>

                {selectedMethod.bankName && (
                  <div className="detail-row">
                    <span>Bank Name</span>
                    <strong>
                      {selectedMethod.bankName}
                    </strong>
                  </div>
                )}

                <div className="detail-row">
                  <span>Account Number</span>

                  <div className="copy-line">
                    <strong>
                      {selectedMethod.accountNumber ||
                        "Not configured"}
                    </strong>

                    <button
                      type="button"
                      onClick={() =>
                        copyText(
                          selectedMethod.accountNumber
                        )
                      }
                    >
                      Copy
                    </button>
                  </div>
                </div>

                <div className="detail-row">
                  <span>Account Name</span>

                  <strong>
                    {selectedMethod.accountName ||
                      "Not configured"}
                  </strong>
                </div>

                {selectedMethod.branch && (
                  <div className="detail-row">
                    <span>Branch</span>
                    <strong>
                      {selectedMethod.branch}
                    </strong>
                  </div>
                )}

                {selectedMethod.qrImage ? (
                  <div className="qr-box">
                    <img
                      src={selectedMethod.qrImage}
                      alt={`${selectedMethod.name} QR`}
                      className="admin-qr-image"
                    />
                  </div>
                ) : (
                  <div className="qr-box">
                    <div className="qr-not-configured">
                      QR not configured by admin
                    </div>
                  </div>
                )}

                {depositSubmitted ? (
                  <div
                    className={`success-box deposit-status-${statusClass}`}
                  >
                    <strong>
                      {currentStatus === "Approved"
                        ? "Deposit Approved"
                        : currentStatus === "Rejected"
                        ? "Deposit Rejected"
                        : "Deposit Request Created"}
                    </strong>

                    <span>
                      Status: {currentStatus}
                    </span>

                    <span>
                      Your request ID:{" "}
                      {createdRequest?.id || "Created"}
                    </span>

                    <small>
                      {statusMessage()}
                    </small>

                    {createdRequest?.reviewedAt && (
                      <small>
                        Reviewed:{" "}
                        {new Date(
                          createdRequest.reviewedAt
                        ).toLocaleString()}
                      </small>
                    )}
                  </div>
                ) : (
                  <form
                    className="local-deposit-form"
                    onSubmit={submitDeposit}
                  >
                    <div className="form-field">
                      <label>
                        Amount (NPR)
                      </label>

                      <input
                        type="number"
                        min={
                          selectedMethod.minAmount ?? 500
                        }
                        max={
                          selectedMethod.maxAmount ??
                          25000
                        }
                        step="1"
                        value={amount}
                        onChange={(e) =>
                          setAmount(e.target.value)
                        }
                        placeholder="Enter amount"
                      />

                      <small>
                        Minimum: NPR{" "}
                        {Number(
                          selectedMethod.minAmount ??
                            500
                        ).toLocaleString()}
                        {" • "}
                        Maximum: NPR{" "}
                        {Number(
                          selectedMethod.maxAmount ??
                            25000
                        ).toLocaleString()}
                      </small>
                    </div>

                    <div className="quick-amounts">
                      {[
                        500,
                        1000,
                        2000,
                        3000,
                        5000,
                        10000,
                        20000,
                        25000,
                      ].map((v) => (
                        <button
                          key={v}
                          type="button"
                          onClick={() =>
                            setAmount(String(v))
                          }
                        >
                          {v.toLocaleString()}
                        </button>
                      ))}
                    </div>

                    <div className="form-field">
                      <label>
                        Your {selectedMethod.name}{" "}
                        Account Number
                      </label>

                      <input
                        type="text"
                        value={senderAccount}
                        onChange={(e) =>
                          setSenderAccount(
                            e.target.value
                          )
                        }
                        placeholder="Enter your account number"
                      />
                    </div>

                    <div className="form-field">
                      <label>
                        Your {selectedMethod.name}{" "}
                        Account Name
                      </label>

                      <input
                        type="text"
                        value={senderName}
                        onChange={(e) =>
                          setSenderName(e.target.value)
                        }
                        placeholder="Enter your account name"
                      />
                    </div>

                    <div className="form-field">
                      <label>
                        Payment Screenshot
                      </label>

                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png,.pdf"
                        onChange={(e) => {
                          const file =
                            e.target.files?.[0];

                          if (
                            file &&
                            file.size >
                              20 *
                                1024 *
                                1024
                          ) {
                            setDepositError(
                              "Maximum screenshot/file size is 20 MB."
                            );

                            setScreenshot(null);
                          } else {
                            setScreenshot(
                              file || null
                            );
                            setDepositError("");
                          }
                        }}
                      />

                      <small>
                        JPG, JPEG, PNG or PDF •
                        Maximum 20 MB
                      </small>
                    </div>

                    <div className="form-field">
                      <label>
                        Transaction ID /
                        Reference No.
                      </label>

                      <input
                        type="text"
                        value={transactionId}
                        onChange={(e) =>
                          setTransactionId(
                            e.target.value
                          )
                        }
                        placeholder="Enter transaction ID"
                      />
                    </div>

                    {depositError && (
                      <div className="deposit-error">
                        {depositError}
                      </div>
                    )}

                    <button
                      type="submit"
                      className="deposit-submit"
                    >
                      CONFIRM
                    </button>

                    <button
                      type="button"
                      className="change-payment-button"
                      onClick={() =>
                        setSelectedMethod(null)
                      }
                    >
                      Change payment details
                    </button>

                    <p className="payment-safety-note">
                      Please click here only if you
                      are unable to pay using the
                      details provided. The details
                      can only be changed a limited
                      number of times.
                    </p>

                    <p className="payment-safety-note">
                      Please do not mention words
                      related to betting in the
                      comments to the payment.
                    </p>
                  </form>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Deposit;