import { useEffect, useMemo, useState } from "react";
import "./Deposit.css";
import { supabase } from "../../../supabaseClient";

const defaultMethods = [
  {
    id: "esewa",
    name: "eSewa",
    category: "Local Payment",
    icon: "e",
    color: "#49b64a",
    recommended: true,
    enabled: true,
    accountName: "",
    accountNumber: "",
    qrImage: "",
    minAmount: 500,
    maxAmount: 25000,
  },
  {
    id: "khalti",
    name: "Khalti",
    category: "Local Payment",
    icon: "K",
    color: "#5c2d91",
    recommended: true,
    enabled: true,
    accountName: "",
    accountNumber: "",
    qrImage: "",
    minAmount: 500,
    maxAmount: 25000,
  },
  {
    id: "bank",
    name: "Bank Transfer",
    category: "Local Payment",
    icon: "B",
    color: "#2563eb",
    recommended: false,
    enabled: true,
    accountName: "",
    accountNumber: "",
    bankName: "",
    branch: "",
    qrImage: "",
    minAmount: 500,
    maxAmount: 25000,
  },

  {
    id: "tether-ton",
    name: "Tether on TON",
    category: "Cryptocurrency",
    icon: "₮",
    color: "#26a17b",
    enabled: true,
    network: "TON",
    walletAddress: "",
    qrImage: "",
    minAmount: 3,
    maxAmount: 100000,
  },
  {
    id: "tether-tron",
    name: "Tether on Tron",
    category: "Cryptocurrency",
    icon: "₮",
    color: "#26a17b",
    enabled: true,
    network: "TRON",
    walletAddress: "",
    qrImage: "",
    minAmount: 3,
    maxAmount: 100000,
  },
  {
    id: "tether-bsc",
    name: "Tether on BSC",
    category: "Cryptocurrency",
    icon: "₮",
    color: "#26a17b",
    enabled: true,
    network: "BSC",
    walletAddress: "",
    qrImage: "",
    minAmount: 3,
    maxAmount: 100000,
  },
  {
    id: "tether-ethereum",
    name: "Tether on Ethereum",
    category: "Cryptocurrency",
    icon: "₮",
    color: "#26a17b",
    enabled: true,
    network: "Ethereum",
    walletAddress: "",
    qrImage: "",
    minAmount: 3,
    maxAmount: 100000,
  },
  {
    id: "tron",
    name: "TRON",
    category: "Cryptocurrency",
    icon: "T",
    color: "#e33b45",
    enabled: true,
    network: "TRON",
    walletAddress: "",
    qrImage: "",
    minAmount: 10,
    maxAmount: 100000,
  },
  {
    id: "bitcoin",
    name: "Bitcoin",
    category: "Cryptocurrency",
    icon: "₿",
    color: "#f7931a",
    enabled: true,
    network: "Bitcoin",
    walletAddress: "",
    qrImage: "",
    minAmount: 0.0001,
    maxAmount: 10,
  },
  {
    id: "litecoin",
    name: "Litecoin",
    category: "Cryptocurrency",
    icon: "Ł",
    color: "#345d9d",
    enabled: true,
    network: "Litecoin",
    walletAddress: "",
    qrImage: "",
    minAmount: 0.01,
    maxAmount: 100,
  },
  {
    id: "ethereum",
    name: "Ethereum",
    category: "Cryptocurrency",
    icon: "Ξ",
    color: "#627eea",
    enabled: true,
    network: "Ethereum",
    walletAddress: "",
    qrImage: "",
    minAmount: 0.001,
    maxAmount: 100,
  },
  {
    id: "bnb",
    name: "Binance Coin BSC",
    category: "Cryptocurrency",
    icon: "B",
    color: "#f3ba2f",
    enabled: true,
    network: "BSC",
    walletAddress: "",
    qrImage: "",
    minAmount: 0.01,
    maxAmount: 100,
  },
  {
    id: "dogecoin",
    name: "Dogecoin",
    category: "Cryptocurrency",
    icon: "Ð",
    color: "#c2a633",
    enabled: true,
    network: "Dogecoin",
    walletAddress: "",
    qrImage: "",
    minAmount: 10,
    maxAmount: 100000,
  },
  {
    id: "usdc-eth",
    name: "USD Coin on Ethereum",
    category: "Cryptocurrency",
    icon: "$",
    color: "#2775ca",
    enabled: true,
    network: "Ethereum",
    walletAddress: "",
    qrImage: "",
    minAmount: 3,
    maxAmount: 100000,
  },
  {
    id: "xrp",
    name: "XRP",
    category: "Cryptocurrency",
    icon: "X",
    color: "#23292f",
    enabled: true,
    network: "XRP",
    walletAddress: "",
    qrImage: "",
    minAmount: 5,
    maxAmount: 100000,
  },
  {
    id: "polygon",
    name: "Polygon",
    category: "Cryptocurrency",
    icon: "P",
    color: "#8247e5",
    enabled: true,
    network: "Polygon",
    walletAddress: "",
    qrImage: "",
    minAmount: 1,
    maxAmount: 100000,
  },
];

/* =========================================================
   LOCAL STORAGE
========================================================= */

function loadMethods() {
  try {
    const saved = JSON.parse(
      localStorage.getItem("adminPaymentMethods") || "null"
    );

    if (!Array.isArray(saved)) {
      return defaultMethods;
    }

    return defaultMethods.map((base) => ({
      ...base,
      ...(saved.find(
        (item) =>
          item.id === base.id ||
          item.name === base.name
      ) || {}),
    }));
  } catch {
    return defaultMethods;
  }
}

function loadLocalRequestById(id) {
  if (!id) return null;

  try {
    const requests = JSON.parse(
      localStorage.getItem("depositRequests") || "[]"
    );

    if (!Array.isArray(requests)) {
      return null;
    }

    return (
      requests.find(
        (request) => request.id === id
      ) || null
    );
  } catch {
    return null;
  }
}

function saveLocalRequest(request) {
  try {
    const existing = JSON.parse(
      localStorage.getItem("depositRequests") || "[]"
    );

    const safeExisting = Array.isArray(existing)
      ? existing
      : [];

    const filtered = safeExisting.filter(
      (item) => item.id !== request.id
    );

    localStorage.setItem(
      "depositRequests",
      JSON.stringify([
        request,
        ...filtered,
      ])
    );

    localStorage.setItem(
      "lastDepositRequestId",
      request.id
    );

    return true;
  } catch {
    return false;
  }
}

/* =========================================================
   SUPABASE HELPERS
========================================================= */

async function getCurrentUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw error;
  }

  return user;
}

async function createSupabaseRequest(request) {
  /*
   * IMPORTANT:
   * user_id contains the logged-in Supabase
   * user's UUID.
   */

  if (!request.userId) {
    throw new Error(
      "User UUID not found. Please login again."
    );
  }

  const row = {
    id: request.id,

    user_id: request.userId,

    status: request.status,

    method_id: request.methodId,
    method_name: request.methodName,
    category: request.category,
    network: request.network || null,

    amount: request.amount,
    currency: request.currency,

    crypto_amount:
      request.cryptoAmount !== null
        ? request.cryptoAmount
        : null,

    exchange_rate:
      request.exchangeRate !== null
        ? request.exchangeRate
        : null,

    wallet_address:
      request.walletAddress || null,

    sender_account:
      request.senderAccount || null,

    sender_name:
      request.senderName || null,

    transaction_id:
      request.transactionId || null,

    screenshot_name:
      request.screenshotName || null,

    screenshot_type:
      request.screenshotType || null,

    screenshot_size:
      request.screenshotSize || 0,
  };

  const {
    data,
    error,
  } = await supabase
    .from("deposit_requests")
    .insert(row)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

async function getSupabaseRequestById(id) {
  if (!id) return null;

  const {
    data,
    error,
  } = await supabase
    .from("deposit_requests")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error(
      "Could not read Supabase deposit request:",
      error
    );

    return null;
  }

  return data;
}

/* =========================================================
   COMPONENT
========================================================= */

function Deposit({ onBack }) {
  const [methods, setMethods] =
    useState(loadMethods);

  const [selectedMethod, setSelectedMethod] =
    useState(null);

  const [search, setSearch] =
    useState("");

  const [amount, setAmount] =
    useState("");

  const [senderAccount, setSenderAccount] =
    useState("");

  const [senderName, setSenderName] =
    useState("");

  const [transactionId, setTransactionId] =
    useState("");

  const [screenshot, setScreenshot] =
    useState(null);

  const [depositError, setDepositError] =
    useState("");

  const [depositSubmitted, setDepositSubmitted] =
    useState(false);

  const [rate, setRate] =
    useState(169.7335108);

  const [cryptoAmount, setCryptoAmount] =
    useState("");

  const [createdRequest, setCreatedRequest] =
    useState(null);

  const [isSaving, setIsSaving] =
    useState(false);

  /*
   * Logged-in Supabase user UUID.
   */
  const [userId, setUserId] =
    useState(null);

  /* =======================================================
     GET LOGGED-IN USER
  ======================================================= */

  useEffect(() => {
    let mounted = true;

    async function loadUser() {
      try {
        const user =
          await getCurrentUser();

        if (!mounted) return;

        if (user) {
          setUserId(user.id);

          console.log(
            "Logged-in Supabase UUID:",
            user.id
          );
        } else {
          setUserId(null);

          console.warn(
            "No logged-in Supabase user."
          );
        }
      } catch (error) {
        console.error(
          "Could not get logged-in user:",
          error
        );

        if (mounted) {
          setUserId(null);
        }
      }
    }

    loadUser();

    const {
      data: authListener,
    } =
      supabase.auth.onAuthStateChange(
        (_event, session) => {
          const user =
            session?.user || null;

          setUserId(
            user?.id || null
          );

          if (user) {
            console.log(
              "Supabase UUID:",
              user.id
            );
          }
        }
      );

    return () => {
      mounted = false;

      authListener?.subscription?.unsubscribe();
    };
  }, []);

  /* =======================================================
     LOAD PAYMENT CONFIG
  ======================================================= */

  useEffect(() => {
    const refresh = () => {
      setMethods(
        loadMethods()
      );

      try {
        const savedRate =
          Number(
            localStorage.getItem(
              "usdtNprRate"
            )
          );

        if (savedRate > 0) {
          setRate(savedRate);
        }
      } catch {}
    };

    refresh();

    window.addEventListener(
      "storage",
      refresh
    );

    window.addEventListener(
      "payment-config-updated",
      refresh
    );

    return () => {
      window.removeEventListener(
        "storage",
        refresh
      );

      window.removeEventListener(
        "payment-config-updated",
        refresh
      );
    };
  }, []);

  /* =======================================================
     VISIBLE METHODS
  ======================================================= */

  const visibleMethods =
    useMemo(
      () =>
        methods.filter(
          (method) =>
            method.enabled &&
            method.name
              .toLowerCase()
              .includes(
                search.toLowerCase()
              )
        ),
      [methods, search]
    );

  const localPayments =
    visibleMethods.filter(
      (method) =>
        method.category ===
        "Local Payment"
    );

  const cryptoPayments =
    visibleMethods.filter(
      (method) =>
        method.category ===
        "Cryptocurrency"
    );

  const isCrypto =
    selectedMethod?.category ===
    "Cryptocurrency";

  const isTether =
    selectedMethod?.name
      ?.toLowerCase()
      .includes("tether");

  const cryptoUnit =
    isTether
      ? "USDT"
      : selectedMethod?.name || "";

  /* =======================================================
     OPEN PAYMENT METHOD
  ======================================================= */

  function openPaymentMethod(
    method
  ) {
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
    setIsSaving(false);
  }

  /* =======================================================
     COPY
  ======================================================= */

  async function copyText(text) {
    if (!text) return;

    try {
      await navigator.clipboard?.writeText(
        text
      );
    } catch (error) {
      console.error(
        "Copy failed:",
        error
      );
    }
  }

  /* =======================================================
     CREATE REQUEST
  ======================================================= */

  async function submitDeposit(e) {
    e.preventDefault();

    if (isSaving) {
      return;
    }

    setDepositError("");

    /*
     * Make sure user is logged in.
     */
    let currentUser = null;

    try {
      currentUser =
        await getCurrentUser();
    } catch (error) {
      console.error(
        "User authentication check failed:",
        error
      );
    }

    if (!currentUser) {
      setDepositError(
        "You must be logged in before creating a deposit request."
      );

      return;
    }

    /*
     * This is the Supabase Auth UUID.
     */
    const currentUserId =
      currentUser.id;

    setUserId(currentUserId);

    console.log(
      "Creating deposit for user UUID:",
      currentUserId
    );

    if (!selectedMethod) {
      setDepositError(
        "Please select a payment method."
      );

      return;
    }

    const value =
      Number(amount);

    const min =
      Number(
        selectedMethod.minAmount ??
          (selectedMethod.category ===
          "Local Payment"
            ? 500
            : 0)
      );

    const max =
      Number(
        selectedMethod.maxAmount ??
          (selectedMethod.category ===
          "Local Payment"
            ? 25000
            : Infinity)
      );

    /* =====================================================
       CRYPTO VALIDATION
    ===================================================== */

    if (isCrypto) {
      const cryptoValue =
        Number(cryptoAmount);

      if (
        !cryptoValue ||
        cryptoValue <= 0
      ) {
        setDepositError(
          `Please enter a valid ${cryptoUnit} amount.`
        );

        return;
      }

      if (
        cryptoValue < min ||
        cryptoValue > max
      ) {
        setDepositError(
          `${cryptoUnit} amount must be between ${min} and ${max}.`
        );

        return;
      }
    }

    /* =====================================================
       LOCAL PAYMENT VALIDATION
    ===================================================== */

    else {
      if (
        !value ||
        value < min ||
        value > max
      ) {
        setDepositError(
          `Amount must be between NPR ${min.toLocaleString()} and NPR ${max.toLocaleString()}.`
        );

        return;
      }
    }

    /* =====================================================
       LOCAL REQUIRED FIELDS
    ===================================================== */

    if (
      selectedMethod.category ===
      "Local Payment"
    ) {
      if (
        !senderAccount.trim() ||
        !senderName.trim()
      ) {
        setDepositError(
          "Please enter your payment account number and account name."
        );

        return;
      }

      if (
        !transactionId.trim()
      ) {
        setDepositError(
          "Please enter the Transaction ID / Reference No."
        );

        return;
      }

      if (!screenshot) {
        setDepositError(
          "Please upload your payment screenshot."
        );

        return;
      }
    }

    /* =====================================================
       CRYPTO REQUIRED FIELDS
    ===================================================== */

    else {
      if (
        !selectedMethod.walletAddress
      ) {
        setDepositError(
          "This cryptocurrency wallet is not configured by admin yet."
        );

        return;
      }

      if (
        !transactionId.trim()
      ) {
        setDepositError(
          "Please enter the transaction hash."
        );

        return;
      }
    }

    /* =====================================================
       REQUEST ID
    ===================================================== */

    const requestId =
      `DP${Date.now()
        .toString()
        .slice(-8)}`;

    const createdAt =
      new Date().toISOString();

    /* =====================================================
       REQUEST OBJECT
    ===================================================== */

    const request = {
      id: requestId,

      /*
       * IMPORTANT:
       * Logged-in Supabase UUID.
       */
      userId: currentUserId,

      createdAt,

      status:
        "Pending Verification",

      methodId:
        selectedMethod.id,

      methodName:
        selectedMethod.name,

      category:
        selectedMethod.category,

      network:
        selectedMethod.network || "",

      amount:
        isCrypto
          ? Number(cryptoAmount)
          : value,

      currency:
        isCrypto
          ? cryptoUnit
          : "NPR",

      cryptoAmount:
        isCrypto
          ? Number(cryptoAmount)
          : null,

      exchangeRate:
        isTether
          ? Number(rate)
          : null,

      walletAddress:
        isCrypto
          ? selectedMethod.walletAddress
          : "",

      senderAccount:
        senderAccount.trim(),

      senderName:
        senderName.trim(),

      transactionId:
        transactionId.trim(),

      screenshotName:
        screenshot?.name || "",

      screenshotType:
        screenshot?.type || "",

      screenshotSize:
        screenshot?.size || 0,
    };

    /* =====================================================
       SAVE
    ===================================================== */

    setIsSaving(true);

    try {
      /*
       * Local cache.
       */
      saveLocalRequest(
        request
      );

      /*
       * Save to Supabase.
       *
       * user_id is automatically
       * inserted from currentUser.id.
       */
      try {
        await createSupabaseRequest(
          request
        );
      } catch (
        supabaseError
      ) {
        console.error(
          "Supabase save failed:",
          supabaseError
        );

        setDepositError(
          `Request saved locally, but Supabase save failed: ${
            supabaseError.message ||
            "Unknown error"
          }`
        );

        setIsSaving(false);

        return;
      }

      /*
       * Notify admin page.
       */
      window.dispatchEvent(
        new Event(
          "deposit-request-created"
        )
      );

      setCreatedRequest(
        request
      );

      setDepositSubmitted(
        true
      );
    } catch (error) {
      console.error(
        "Deposit request error:",
        error
      );

      setDepositError(
        "Could not create the deposit request. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  }

  /* =======================================================
     SYNC REQUEST STATUS
  ======================================================= */

  useEffect(() => {
    if (
      !createdRequest?.id
    ) {
      return;
    }

    let cancelled = false;

    async function syncStatus() {
      const supabaseRequest =
        await getSupabaseRequestById(
          createdRequest.id
        );

      if (
        supabaseRequest &&
        !cancelled
      ) {
        const updatedRequest = {
          ...createdRequest,

          /*
           * Keep user UUID.
           */
          userId:
            supabaseRequest.user_id ||
            createdRequest.userId,

          status:
            supabaseRequest.status ||
            createdRequest.status,

          reviewedAt:
            supabaseRequest.reviewed_at ||
            createdRequest.reviewedAt ||
            null,
        };

        setCreatedRequest(
          updatedRequest
        );

        try {
          const requests =
            JSON.parse(
              localStorage.getItem(
                "depositRequests"
              ) || "[]"
            );

          if (
            Array.isArray(
              requests
            )
          ) {
            const updated =
              requests.map(
                (item) =>
                  item.id ===
                  createdRequest.id
                    ? {
                        ...item,
                        ...updatedRequest,
                      }
                    : item
              );

            localStorage.setItem(
              "depositRequests",
              JSON.stringify(
                updated
              )
            );
          }
        } catch {}
      }
    }

    syncStatus();

    const interval =
      window.setInterval(
        syncStatus,
        2000
      );

    window.addEventListener(
      "storage",
      syncStatus
    );

    window.addEventListener(
      "deposit-request-updated",
      syncStatus
    );

    const channel =
      supabase
        .channel(
          `deposit-request-${createdRequest.id}`
        )
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "deposit_requests",
            filter: `id=eq.${createdRequest.id}`,
          },
          (payload) => {
            const row =
              payload.new;

            if (
              row &&
              row.id ===
                createdRequest.id
            ) {
              setCreatedRequest(
                (previous) => ({
                  ...previous,

                  userId:
                    row.user_id ||
                    previous.userId,

                  status:
                    row.status ||
                    previous.status,

                  reviewedAt:
                    row.reviewed_at ||
                    previous.reviewedAt ||
                    null,
                })
              );
            }
          }
        )
        .subscribe();

    return () => {
      cancelled = true;

      window.clearInterval(
        interval
      );

      window.removeEventListener(
        "storage",
        syncStatus
      );

      window.removeEventListener(
        "deposit-request-updated",
        syncStatus
      );

      supabase.removeChannel(
        channel
      );
    };
  }, [createdRequest?.id]);

  /* =======================================================
     STATUS
  ======================================================= */

  const currentStatus =
    createdRequest?.status ||
    "Pending Verification";

  const statusClass =
    String(currentStatus)
      .toLowerCase()
      .replace(
        /\s+/g,
        "-"
      );

  function statusMessage() {
    if (
      currentStatus ===
      "Approved"
    ) {
      return "Your deposit has been approved by the admin.";
    }

    if (
      currentStatus ===
      "Rejected"
    ) {
      return "Your deposit request was rejected. Please contact support or create a new request.";
    }

    return "Your deposit is waiting for admin verification.";
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="deposit-page">

      {/* HEADER */}

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

      {/* MAIN */}

      <main className="deposit-content">

        <div className="deposit-heading">

          <h1>
            Deposit
          </h1>

          <p>
            Select your preferred payment method
          </p>

        </div>

        {/* SEARCH */}

        <input
          className="deposit-search"
          type="text"
          placeholder="Search payment method..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
        />

        {/* LOCAL PAYMENTS */}

        <section className="payment-section">

          <div className="payment-section-heading">

            <h2>
              Local Payments
            </h2>

            <span>
              {localPayments.length}
            </span>

          </div>

          <div className="payment-grid">

            {localPayments.map(
              (method) => (
                <button
                  className="payment-card"
                  key={method.id}
                  onClick={() =>
                    openPaymentMethod(
                      method
                    )
                  }
                >

                  {method.recommended && (
                    <span className="recommended-badge">
                      RECOMMENDED
                    </span>
                  )}

                  <div
                    className="payment-icon"
                    style={{
                      background:
                        method.color,
                    }}
                  >
                    {method.icon}
                  </div>

                  <strong>
                    {method.name}
                  </strong>

                  <span className="payment-arrow">
                    →
                  </span>

                </button>
              )
            )}

          </div>

        </section>

        {/* CRYPTO */}

        <section className="payment-section">

          <div className="payment-section-heading">

            <h2>
              Cryptocurrency
            </h2>

            <span>
              {cryptoPayments.length}
            </span>

          </div>

          <div className="payment-grid">

            {cryptoPayments.map(
              (method) => (
                <button
                  className="payment-card"
                  key={method.id}
                  onClick={() =>
                    openPaymentMethod(
                      method
                    )
                  }
                >

                  <div
                    className="payment-icon"
                    style={{
                      background:
                        method.color,
                    }}
                  >
                    {method.icon}
                  </div>

                  <strong>
                    {method.name}
                  </strong>

                  <small>
                    {method.network}
                  </small>

                  <span className="payment-arrow">
                    →
                  </span>

                </button>
              )
            )}

          </div>

        </section>

      </main>

      {/* MODAL */}

      {selectedMethod && (

        <div
          className="payment-overlay"
          onClick={() =>
            setSelectedMethod(
              null
            )
          }
        >

          <div
            className="payment-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <button
              className="modal-close"
              onClick={() =>
                setSelectedMethod(
                  null
                )
              }
            >
              ×
            </button>

            <div
              className="modal-payment-icon"
              style={{
                background:
                  selectedMethod.color,
              }}
            >
              {selectedMethod.icon}
            </div>

            <h2>
              {selectedMethod.name}
            </h2>

            {/* CRYPTO */}

            {isCrypto ? (
              <>

                <div className="detail-row">

                  <span>
                    Network
                  </span>

                  <strong>
                    {selectedMethod.network ||
                      "Not configured"}
                  </strong>

                </div>

                {isTether && (

                  <div className="rate-box">
                    1 USDT ={" "}
                    {Number(rate).toFixed(
                      7
                    )}{" "}
                    NPR
                  </div>

                )}

                <p className="modal-subtitle">
                  Copy the address or scan the QR code:
                </p>

                {selectedMethod.qrImage ? (

                  <div className="qr-box">

                    <img
                      src={
                        selectedMethod.qrImage
                      }
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

                {/* SUCCESS */}

                {depositSubmitted ? (

                  <div
                    className={`success-box deposit-status-${statusClass}`}
                  >

                    <strong>

                      {currentStatus ===
                      "Approved"
                        ? "Deposit Approved"
                        : currentStatus ===
                          "Rejected"
                        ? "Deposit Rejected"
                        : "Deposit Request Created"}

                    </strong>

                    <span>
                      Status:{" "}
                      {currentStatus}
                    </span>

                    <span>
                      Your request ID:{" "}
                      {createdRequest?.id ||
                        "Created"}
                    </span>

                    <small>
                      {statusMessage()}
                    </small>

                    {createdRequest?.userId && (

                      <small>
                        User ID:{" "}
                        {createdRequest.userId}
                      </small>

                    )}

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
                    onSubmit={
                      submitDeposit
                    }
                  >

                    <div className="form-field">

                      <label>
                        Crypto Amount
                      </label>

                      <input
                        type="number"
                        min={
                          selectedMethod.minAmount ??
                          0
                        }
                        max={
                          selectedMethod.maxAmount ??
                          undefined
                        }
                        step="any"
                        value={
                          cryptoAmount
                        }
                        onChange={(e) => {

                          const v =
                            e.target.value;

                          setCryptoAmount(
                            v
                          );

                          if (
                            isTether &&
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

                            setAmount(
                              ""
                            );

                          }

                        }}
                        placeholder={`Enter ${cryptoUnit}`}
                      />

                      <small>
                        Minimum:{" "}
                        {selectedMethod.minAmount ??
                          0}{" "}
                        {cryptoUnit}

                        {" • "}

                        Maximum:{" "}
                        {selectedMethod.maxAmount ??
                          "No limit"}{" "}
                        {cryptoUnit}
                      </small>

                    </div>

                    {isTether && (

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
                        value={
                          transactionId
                        }
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
                      disabled={
                        isSaving
                      }
                    >

                      {isSaving
                        ? "CREATING..."
                        : "Create Deposit Request"}

                    </button>

                  </form>

                )}

              </>

            ) : (

              /* LOCAL PAYMENT */

              <>

                <p className="modal-subtitle">

                  Before creating a request, transfer
                  the funds within 10 minutes using the
                  payment details provided below.

                </p>

                {selectedMethod.bankName && (

                  <div className="detail-row">

                    <span>
                      Bank Name
                    </span>

                    <strong>
                      {
                        selectedMethod.bankName
                      }
                    </strong>

                  </div>

                )}

                <div className="detail-row">

                  <span>
                    Account Number
                  </span>

                  <div className="copy-line">

                    <strong>
                      {
                        selectedMethod.accountNumber ||
                        "Not configured"
                      }
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

                  <span>
                    Account Name
                  </span>

                  <strong>
                    {
                      selectedMethod.accountName ||
                      "Not configured"
                    }
                  </strong>

                </div>

                {selectedMethod.branch && (

                  <div className="detail-row">

                    <span>
                      Branch
                    </span>

                    <strong>
                      {
                        selectedMethod.branch
                      }
                    </strong>

                  </div>

                )}

                {selectedMethod.qrImage ? (

                  <div className="qr-box">

                    <img
                      src={
                        selectedMethod.qrImage
                      }
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

                {/* SUCCESS */}

                {depositSubmitted ? (

                  <div
                    className={`success-box deposit-status-${statusClass}`}
                  >

                    <strong>

                      {currentStatus ===
                      "Approved"
                        ? "Deposit Approved"
                        : currentStatus ===
                          "Rejected"
                        ? "Deposit Rejected"
                        : "Deposit Request Created"}

                    </strong>

                    <span>
                      Status:{" "}
                      {currentStatus}
                    </span>

                    <span>
                      Your request ID:{" "}
                      {createdRequest?.id ||
                        "Created"}
                    </span>

                    <small>
                      {statusMessage()}
                    </small>

                    {createdRequest?.userId && (

                      <small>
                        User ID:{" "}
                        {createdRequest.userId}
                      </small>

                    )}

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
                    onSubmit={
                      submitDeposit
                    }
                  >

                    <div className="form-field">

                      <label>
                        Amount (NPR)
                      </label>

                      <input
                        type="number"
                        min={
                          selectedMethod.minAmount ??
                          500
                        }
                        max={
                          selectedMethod.maxAmount ??
                          25000
                        }
                        step="1"
                        value={amount}
                        onChange={(e) =>
                          setAmount(
                            e.target.value
                          )
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
                      ].map(
                        (v) => (

                          <button
                            key={v}
                            type="button"
                            onClick={() =>
                              setAmount(
                                String(v)
                              )
                            }
                          >
                            {v.toLocaleString()}
                          </button>

                        )
                      )}

                    </div>

                    <div className="form-field">

                      <label>
                        Your{" "}
                        {
                          selectedMethod.name
                        }{" "}
                        Account Number
                      </label>

                      <input
                        type="text"
                        value={
                          senderAccount
                        }
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
                        Your{" "}
                        {
                          selectedMethod.name
                        }{" "}
                        Account Name
                      </label>

                      <input
                        type="text"
                        value={
                          senderName
                        }
                        onChange={(e) =>
                          setSenderName(
                            e.target.value
                          )
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

                            setScreenshot(
                              null
                            );

                            return;
                          }

                          setScreenshot(
                            file ||
                              null
                          );

                          setDepositError(
                            ""
                          );

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
                        value={
                          transactionId
                        }
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
                      disabled={
                        isSaving
                      }
                    >

                      {isSaving
                        ? "CREATING..."
                        : "CONFIRM"}

                    </button>

                    <button
                      type="button"
                      className="change-payment-button"
                      onClick={() =>
                        setSelectedMethod(
                          null
                        )
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