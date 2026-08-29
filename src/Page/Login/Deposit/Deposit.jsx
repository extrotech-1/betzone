import { useEffect, useMemo, useState } from "react";
import "./Deposit.css";
import { supabase } from "../../../supabaseClient";

const FALLBACK_METHODS = [
  {
    method_id: "esewa",
    name: "eSewa",
    category: "Local Payment",
    icon: "e",
    color: "#49b64a",
    enabled: true,
    recommended: true,
    account_name: "",
    account_number: "",
    bank_name: "",
    branch: "",
    qr_image: "",
    network: "",
    wallet_address: "",
    min_amount: 500,
    max_amount: 25000,
    instructions: "",
  },
  {
    method_id: "khalti",
    name: "Khalti",
    category: "Local Payment",
    icon: "K",
    color: "#5c2d91",
    enabled: true,
    recommended: true,
    account_name: "",
    account_number: "",
    bank_name: "",
    branch: "",
    qr_image: "",
    network: "",
    wallet_address: "",
    min_amount: 500,
    max_amount: 25000,
    instructions: "",
  },
  {
    method_id: "bank",
    name: "Bank Transfer",
    category: "Local Payment",
    icon: "B",
    color: "#2563eb",
    enabled: true,
    recommended: false,
    account_name: "",
    account_number: "",
    bank_name: "",
    branch: "",
    qr_image: "",
    network: "",
    wallet_address: "",
    min_amount: 500,
    max_amount: 25000,
    instructions: "",
  },
  {
    method_id: "tether-ton",
    name: "Tether on TON",
    category: "Cryptocurrency",
    icon: "₮",
    color: "#26a17b",
    enabled: true,
    recommended: false,
    account_name: "",
    account_number: "",
    bank_name: "",
    branch: "",
    qr_image: "",
    network: "TON",
    wallet_address: "",
    min_amount: 3,
    max_amount: 100000,
    instructions: "",
  },
  {
    method_id: "tether-tron",
    name: "Tether on Tron",
    category: "Cryptocurrency",
    icon: "₮",
    color: "#26a17b",
    enabled: true,
    recommended: false,
    account_name: "",
    account_number: "",
    bank_name: "",
    branch: "",
    qr_image: "",
    network: "TRON",
    wallet_address: "",
    min_amount: 3,
    max_amount: 100000,
    instructions: "",
  },
  {
    method_id: "tether-bsc",
    name: "Tether on BSC",
    category: "Cryptocurrency",
    icon: "₮",
    color: "#26a17b",
    enabled: true,
    recommended: false,
    network: "BSC",
    wallet_address: "",
    min_amount: 3,
    max_amount: 100000,
    instructions: "",
  },
  {
    method_id: "tether-ethereum",
    name: "Tether on Ethereum",
    category: "Cryptocurrency",
    icon: "₮",
    color: "#26a17b",
    enabled: true,
    recommended: false,
    network: "Ethereum",
    wallet_address: "",
    min_amount: 3,
    max_amount: 100000,
    instructions: "",
  },
  {
    method_id: "tron",
    name: "TRON",
    category: "Cryptocurrency",
    icon: "T",
    color: "#e33b45",
    enabled: true,
    recommended: false,
    network: "TRON",
    wallet_address: "",
    min_amount: 10,
    max_amount: 100000,
    instructions: "",
  },
  {
    method_id: "bitcoin",
    name: "Bitcoin",
    category: "Cryptocurrency",
    icon: "₿",
    color: "#f7931a",
    enabled: true,
    recommended: false,
    network: "Bitcoin",
    wallet_address: "",
    min_amount: 0.0001,
    max_amount: 10,
    instructions: "",
  },
  {
    method_id: "litecoin",
    name: "Litecoin",
    category: "Cryptocurrency",
    icon: "Ł",
    color: "#345d9d",
    enabled: true,
    recommended: false,
    network: "Litecoin",
    wallet_address: "",
    min_amount: 0.01,
    max_amount: 100,
    instructions: "",
  },
  {
    method_id: "ethereum",
    name: "Ethereum",
    category: "Cryptocurrency",
    icon: "Ξ",
    color: "#627eea",
    enabled: true,
    recommended: false,
    network: "Ethereum",
    wallet_address: "",
    min_amount: 0.001,
    max_amount: 100,
    instructions: "",
  },
  {
    method_id: "bnb",
    name: "Binance Coin BSC",
    category: "Cryptocurrency",
    icon: "B",
    color: "#f3ba2f",
    enabled: true,
    recommended: false,
    network: "BSC",
    wallet_address: "",
    min_amount: 0.01,
    max_amount: 100,
    instructions: "",
  },
  {
    method_id: "dogecoin",
    name: "Dogecoin",
    category: "Cryptocurrency",
    icon: "Ð",
    color: "#c2a633",
    enabled: true,
    recommended: false,
    network: "Dogecoin",
    wallet_address: "",
    min_amount: 10,
    max_amount: 100000,
    instructions: "",
  },
  {
    method_id: "usdc-eth",
    name: "USD Coin on Ethereum",
    category: "Cryptocurrency",
    icon: "$",
    color: "#2775ca",
    enabled: true,
    recommended: false,
    network: "Ethereum",
    wallet_address: "",
    min_amount: 3,
    max_amount: 100000,
    instructions: "",
  },
  {
    method_id: "xrp",
    name: "XRP",
    category: "Cryptocurrency",
    icon: "X",
    color: "#23292f",
    enabled: true,
    recommended: false,
    network: "XRP",
    wallet_address: "",
    min_amount: 5,
    max_amount: 100000,
    instructions: "",
  },
  {
    method_id: "polygon",
    name: "Polygon",
    category: "Cryptocurrency",
    icon: "P",
    color: "#8247e5",
    enabled: true,
    recommended: false,
    network: "Polygon",
    wallet_address: "",
    min_amount: 1,
    max_amount: 100000,
    instructions: "",
  },
];

function normalizeMethod(row) {
  return {
    method_id: row.method_id || row.id || "",
    name: row.name || row.method_name || "Payment Method",
    category:
      row.category ||
      row.type ||
      "Local Payment",

    icon: row.icon || "?",
    color: row.color || "#2563eb",

    enabled: row.enabled !== false,
    recommended: row.recommended === true,

    account_name: row.account_name || "",
    account_number: row.account_number || "",
    bank_name: row.bank_name || "",
    branch: row.branch || "",

    qr_image:
      row.qr_image ||
      row.qr_image_url ||
      "",

    network: row.network || "",
    wallet_address:
      row.wallet_address || "",

    min_amount:
      row.min_amount !== null &&
      row.min_amount !== undefined
        ? Number(row.min_amount)
        : null,

    max_amount:
      row.max_amount !== null &&
      row.max_amount !== undefined
        ? Number(row.max_amount)
        : null,

    instructions:
      row.instructions ||
      row.customer_instructions ||
      "",
  };
}

function formatNumber(value, maximum = 8) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return "0";
  }

  return number.toLocaleString("en-NP", {
    maximumFractionDigits: maximum,
  });
}

function Deposit() {
  const [methods, setMethods] = useState([]);

  const [selectedMethodId, setSelectedMethodId] =
    useState("");

  const [loadingMethods, setLoadingMethods] =
    useState(true);

  const [user, setUser] = useState(null);

  const [amount, setAmount] = useState("");

  const [senderAccount, setSenderAccount] =
    useState("");

  const [senderName, setSenderName] =
    useState("");

  const [transactionId, setTransactionId] =
    useState("");

  const [screenshotFile, setScreenshotFile] =
    useState(null);

  const [exchangeRate, setExchangeRate] =
    useState(169.7335108);

  const [submitting, setSubmitting] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  /*
   * GET LOGGED-IN USER
   */
  async function loadUser() {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        throw error;
      }

      setUser(user || null);
    } catch (err) {
      console.error(
        "Could not get logged-in user:",
        err
      );

      setUser(null);
    }
  }

  /*
   * LOAD PAYMENT METHODS FROM SUPABASE
   */
  async function loadPaymentMethods() {
    try {
      setLoadingMethods(true);
      setError("");

      const {
        data,
        error,
      } = await supabase
        .from("payment_methods")
        .select("*");

      if (error) {
        throw error;
      }

      let databaseMethods = Array.isArray(data)
        ? data.map(normalizeMethod)
        : [];

      /*
       * Keep only enabled methods.
       */
      databaseMethods =
        databaseMethods.filter(
          (method) => method.enabled
        );

      /*
       * If DB contains methods,
       * use them as the live source.
       *
       * If DB is empty, use fallback
       * so the page doesn't become blank.
       */
      if (databaseMethods.length > 0) {
        setMethods(databaseMethods);

        setSelectedMethodId(
          (previous) => {
            const stillExists =
              databaseMethods.some(
                (method) =>
                  method.method_id ===
                  previous
              );

            if (stillExists) {
              return previous;
            }

            return (
              databaseMethods[0]
                ?.method_id || ""
            );
          }
        );
      } else {
        const enabledFallback =
          FALLBACK_METHODS.filter(
            (method) => method.enabled
          );

        setMethods(enabledFallback);

        setSelectedMethodId(
          enabledFallback[0]
            ?.method_id || ""
        );
      }
    } catch (err) {
      console.error(
        "Could not load payment methods:",
        err
      );

      /*
       * Keep UI usable if DB temporarily fails.
       */
      const enabledFallback =
        FALLBACK_METHODS.filter(
          (method) => method.enabled
        );

      setMethods(enabledFallback);

      setSelectedMethodId(
        enabledFallback[0]
          ?.method_id || ""
      );

      setError(
        `Could not load payment methods: ${
          err?.message ||
          "Unknown error"
        }`
      );
    } finally {
      setLoadingMethods(false);
    }
  }

  /*
   * LOAD LIVE RATE
   *
   * Current admin panel stores the rate
   * in localStorage.
   */
  function loadExchangeRate() {
    const saved = Number(
      localStorage.getItem(
        "usdtNprRate"
      )
    );

    if (
      Number.isFinite(saved) &&
      saved > 0
    ) {
      setExchangeRate(saved);
    }
  }

  useEffect(() => {
    loadUser();
    loadPaymentMethods();
    loadExchangeRate();

    /*
     * Listen for admin-panel changes
     * when both pages are open in browser.
     */
    function handleConfigUpdate() {
      loadPaymentMethods();
      loadExchangeRate();
    }

    window.addEventListener(
      "payment-config-updated",
      handleConfigUpdate
    );

    window.addEventListener(
      "storage",
      handleConfigUpdate
    );

    return () => {
      window.removeEventListener(
        "payment-config-updated",
        handleConfigUpdate
      );

      window.removeEventListener(
        "storage",
        handleConfigUpdate
      );
    };
  }, []);

  /*
   * SELECTED PAYMENT METHOD
   */
  const selectedMethod = useMemo(() => {
    return (
      methods.find(
        (method) =>
          method.method_id ===
          selectedMethodId
      ) || null
    );
  }, [
    methods,
    selectedMethodId,
  ]);

  /*
   * RESET FORM WHEN METHOD CHANGES
   */
  useEffect(() => {
    setAmount("");
    setSenderAccount("");
    setSenderName("");
    setTransactionId("");
    setScreenshotFile(null);
    setMessage("");
    setError("");
  }, [selectedMethodId]);

  /*
   * LOCAL METHODS
   */
  const localMethods = useMemo(() => {
    return methods.filter(
      (method) =>
        method.category ===
        "Local Payment"
    );
  }, [methods]);

  /*
   * CRYPTO METHODS
   */
  const cryptoMethods = useMemo(() => {
    return methods.filter(
      (method) =>
        method.category ===
        "Cryptocurrency"
    );
  }, [methods]);

  /*
   * AMOUNT NUMBERS
   */
  const numericAmount = Number(amount);

  const validAmount =
    Number.isFinite(numericAmount) &&
    numericAmount > 0;

  /*
   * CRYPTO CALCULATION
   *
   * For crypto methods the amount entered
   * is treated as NPR deposit value.
   */
  const calculatedCryptoAmount =
    selectedMethod?.category ===
      "Cryptocurrency" &&
    validAmount &&
    exchangeRate > 0
      ? numericAmount /
        exchangeRate
      : 0;

  /*
   * COPY WALLET
   */
  async function copyWalletAddress() {
    if (
      !selectedMethod?.wallet_address
    ) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        selectedMethod.wallet_address
      );

      setMessage(
        "Wallet address copied."
      );

      setError("");
    } catch {
      setError(
        "Could not copy wallet address."
      );
    }
  }

  /*
   * SCREENSHOT VALIDATION
   */
  function handleScreenshotChange(
    event
  ) {
    const file =
      event.target.files?.[0];

    if (!file) {
      setScreenshotFile(null);
      return;
    }

    const maxSize =
      20 * 1024 * 1024;

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "application/pdf",
    ];

    if (
      !allowedTypes.includes(
        file.type
      )
    ) {
      setError(
        "Screenshot must be JPG, JPEG, PNG or PDF."
      );

      event.target.value = "";
      setScreenshotFile(null);

      return;
    }

    if (file.size > maxSize) {
      setError(
        "Screenshot must be 20 MB or smaller."
      );

      event.target.value = "";
      setScreenshotFile(null);

      return;
    }

    setError("");
    setScreenshotFile(file);
  }

  /*
   * CREATE DEPOSIT REQUEST
   */
  async function createDepositRequest(
    event
  ) {
    event.preventDefault();

    if (submitting) {
      return;
    }

    setError("");
    setMessage("");

    /*
     * Check logged-in user again immediately
     * before insert.
     */
    let currentUser = user;

    try {
      const {
        data: {
          user: authenticatedUser,
        },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) {
        throw authError;
      }

      currentUser =
        authenticatedUser || null;

      setUser(currentUser);
    } catch (err) {
      console.error(
        "Authentication check failed:",
        err
      );

      setError(
        "Could not verify your login session."
      );

      return;
    }

    /*
     * USER MUST BE LOGGED IN
     */
    if (!currentUser) {
      setError(
        "Please login before creating a deposit request."
      );

      return;
    }

    /*
     * PAYMENT METHOD CHECK
     */
    if (!selectedMethod) {
      setError(
        "Please select a payment method."
      );

      return;
    }

    /*
     * AMOUNT CHECK
     */
    const amountNumber =
      Number(amount);

    if (
      !Number.isFinite(
        amountNumber
      ) ||
      amountNumber <= 0
    ) {
      setError(
        "Please enter a valid deposit amount."
      );

      return;
    }

    /*
     * MIN LIMIT
     */
    if (
      selectedMethod.min_amount !==
        null &&
      amountNumber <
        Number(
          selectedMethod.min_amount
        )
    ) {
      setError(
        `Minimum deposit is ${formatNumber(
          selectedMethod.min_amount
        )}.`
      );

      return;
    }

    /*
     * MAX LIMIT
     */
    if (
      selectedMethod.max_amount !==
        null &&
      amountNumber >
        Number(
          selectedMethod.max_amount
        )
    ) {
      setError(
        `Maximum deposit is ${formatNumber(
          selectedMethod.max_amount
        )}.`
      );

      return;
    }

    /*
     * LOCAL PAYMENT REQUIRED FIELDS
     */
    if (
      selectedMethod.category ===
      "Local Payment"
    ) {
      if (!senderAccount.trim()) {
        setError(
          `Please enter your ${selectedMethod.name} Account Number.`
        );

        return;
      }

      if (!senderName.trim()) {
        setError(
          `Please enter your ${selectedMethod.name} Account Name.`
        );

        return;
      }
    }

    /*
     * TRANSACTION ID
     */
    if (!transactionId.trim()) {
      setError(
        "Please enter the Transaction ID / Reference Number."
      );

      return;
    }

    /*
     * SCREENSHOT
     */
    if (!screenshotFile) {
      setError(
        "Please upload your payment screenshot."
      );

      return;
    }

    try {
      setSubmitting(true);

      /*
       * CRYPTO VALUE
       */
      const cryptoAmount =
        selectedMethod.category ===
        "Cryptocurrency"
          ? amountNumber /
            exchangeRate
          : null;

      /*
       * IMPORTANT
       *
       * user_id is the authenticated
       * Supabase UUID.
       */
      const payload = {
        user_id: currentUser.id,

        method_id:
          selectedMethod.method_id,

        method_name:
          selectedMethod.name,

        category:
          selectedMethod.category,

        network:
          selectedMethod.network ||
          null,

        amount:
          amountNumber,

        currency:
          selectedMethod.category ===
          "Cryptocurrency"
            ? "NPR"
            : "NPR",

        crypto_amount:
          cryptoAmount !== null
            ? cryptoAmount
            : null,

        exchange_rate:
          selectedMethod.category ===
          "Cryptocurrency"
            ? exchangeRate
            : null,

        wallet_address:
          selectedMethod.wallet_address ||
          null,

        sender_account:
          senderAccount.trim() ||
          null,

        sender_name:
          senderName.trim() ||
          null,

        transaction_id:
          transactionId.trim(),

        screenshot_name:
          screenshotFile.name,

        screenshot_size:
          screenshotFile.size,

        status:
          "Pending Verification",

        reviewed_at: null,
      };

      console.log(
        "Creating deposit request:",
        payload
      );

      const {
        data,
        error,
      } = await supabase
        .from("deposit_requests")
        .insert(payload)
        .select()
        .single();

      if (error) {
        throw error;
      }

      console.log(
        "Deposit request created:",
        data
      );

      /*
       * Notify admin page if it is open
       * in the same browser.
       */
      window.dispatchEvent(
        new Event(
          "deposit-request-created"
        )
      );

      setMessage(
        "Deposit request submitted successfully. Please wait for verification."
      );

      /*
       * Reset form
       */
      setAmount("");
      setSenderAccount("");
      setSenderName("");
      setTransactionId("");
      setScreenshotFile(null);

      const fileInput =
        document.getElementById(
          "deposit-screenshot"
        );

      if (fileInput) {
        fileInput.value = "";
      }
    } catch (err) {
      console.error(
        "Could not create deposit request:",
        err
      );

      /*
       * Helpful RLS message
       */
      if (
        String(
          err?.message || ""
        ).toLowerCase().includes(
          "row-level security"
        )
      ) {
        setError(
          "Deposit request was blocked by Supabase security policy. Make sure the user_id RLS policy is enabled."
        );
      } else {
        setError(
          `Could not create deposit request: ${
            err?.message ||
            "Unknown error"
          }`
        );
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="deposit-page">

      {/* PAGE HEADER */}
      <div className="deposit-header">

        <div>
          <div className="deposit-kicker">
            DEPOSIT
          </div>

          <h1>
            Deposit
          </h1>

          <p>
            Choose your preferred payment
            method and submit your deposit.
          </p>
        </div>

      </div>

      {/* ALERT */}
      {error && (
        <div className="deposit-alert error">
          <span>!</span>

          <div>
            {error}
          </div>

          <button
            type="button"
            onClick={() =>
              setError("")
            }
          >
            ×
          </button>
        </div>
      )}

      {message && (
        <div className="deposit-alert success">
          <span>✓</span>

          <div>
            {message}
          </div>

          <button
            type="button"
            onClick={() =>
              setMessage("")
            }
          >
            ×
          </button>
        </div>
      )}

      {/* PAYMENT METHODS */}
      <section className="deposit-methods-section">

        <div className="section-kicker">
          PAYMENT METHODS
        </div>

        <h2>
          Choose Payment Method
        </h2>

        {loadingMethods ? (
          <div className="deposit-loading">
            Loading payment methods...
          </div>
        ) : (
          <>
            {/* LOCAL */}
            {localMethods.length > 0 && (
              <div className="payment-category">

                <h3>
                  Local Payments
                </h3>

                <div className="payment-method-grid">

                  {localMethods.map(
                    (method) => (
                      <button
                        key={
                          method.method_id
                        }
                        type="button"
                        className={
                          `payment-method-card ${
                            selectedMethodId ===
                            method.method_id
                              ? "selected"
                              : ""
                          }`
                        }
                        onClick={() =>
                          setSelectedMethodId(
                            method.method_id
                          )
                        }
                      >

                        <div
                          className="payment-method-icon"
                          style={{
                            background:
                              method.color ||
                              "#2563eb",
                          }}
                        >
                          {method.icon ||
                            "?"}
                        </div>

                        <div className="payment-method-info">

                          <div className="payment-method-title">

                            <strong>
                              {method.name}
                            </strong>

                            {method.recommended && (
                              <span className="recommended-badge">
                                RECOMMENDED
                              </span>
                            )}

                          </div>

                          <span>
                            {method.category}
                          </span>

                        </div>

                        <div className="payment-method-arrow">
                          {selectedMethodId ===
                          method.method_id
                            ? "✓"
                            : "›"}
                        </div>

                      </button>
                    )
                  )}

                </div>

              </div>
            )}

            {/* CRYPTO */}
            {cryptoMethods.length > 0 && (
              <div className="payment-category">

                <h3>
                  Cryptocurrency
                </h3>

                <div className="payment-method-grid">

                  {cryptoMethods.map(
                    (method) => (
                      <button
                        key={
                          method.method_id
                        }
                        type="button"
                        className={
                          `payment-method-card ${
                            selectedMethodId ===
                            method.method_id
                              ? "selected"
                              : ""
                          }`
                        }
                        onClick={() =>
                          setSelectedMethodId(
                            method.method_id
                          )
                        }
                      >

                        <div
                          className="payment-method-icon"
                          style={{
                            background:
                              method.color ||
                              "#2563eb",
                          }}
                        >
                          {method.icon ||
                            "?"}
                        </div>

                        <div className="payment-method-info">

                          <div className="payment-method-title">

                            <strong>
                              {method.name}
                            </strong>

                            {method.recommended && (
                              <span className="recommended-badge">
                                RECOMMENDED
                              </span>
                            )}

                          </div>

                          <span>
                            {method.category}

                            {method.network
                              ? ` • ${method.network}`
                              : ""}
                          </span>

                        </div>

                        <div className="payment-method-arrow">
                          {selectedMethodId ===
                          method.method_id
                            ? "✓"
                            : "›"}
                        </div>

                      </button>
                    )
                  )}

                </div>

              </div>
            )}
          </>
        )}

      </section>

      {/* SELECTED METHOD */}
      {selectedMethod && (
        <section className="selected-method-section">

          <div className="selected-method-heading">

            <div
              className="selected-method-icon"
              style={{
                background:
                  selectedMethod.color ||
                  "#2563eb",
              }}
            >
              {selectedMethod.icon ||
                "?"}
            </div>

            <div>

              <div className="section-kicker">
                SELECTED METHOD
              </div>

              <h2>
                {selectedMethod.name}
              </h2>

              <p>
                {selectedMethod.category}

                {selectedMethod.network
                  ? ` • ${selectedMethod.network}`
                  : ""}
              </p>

            </div>

          </div>

          {/* PAYMENT DETAILS */}
          <div className="payment-details-card">

            <div className="section-kicker">
              PAYMENT DETAILS
            </div>

            <div className="payment-instruction">

              <strong>
                Before creating a request
              </strong>

              <p>
                Transfer the funds within
                10 minutes using the payment
                details provided below.
              </p>

            </div>

            {/* ADMIN INSTRUCTIONS */}
            {selectedMethod.instructions && (
              <div className="admin-payment-instructions">

                <strong>
                  Payment Instructions
                </strong>

                <p>
                  {selectedMethod.instructions}
                </p>

              </div>
            )}

            {/* LOCAL PAYMENT DETAILS */}
            {selectedMethod.category ===
              "Local Payment" && (
              <div className="configured-details">

                {selectedMethod.account_name && (
                  <div className="configured-detail">

                    <span>
                      Account Name
                    </span>

                    <strong>
                      {selectedMethod.account_name}
                    </strong>

                  </div>
                )}

                {selectedMethod.account_number && (
                  <div className="configured-detail">

                    <span>
                      Account Number
                    </span>

                    <strong>
                      {selectedMethod.account_number}
                    </strong>

                  </div>
                )}

                {selectedMethod.bank_name && (
                  <div className="configured-detail">

                    <span>
                      Bank Name
                    </span>

                    <strong>
                      {selectedMethod.bank_name}
                    </strong>

                  </div>
                )}

                {selectedMethod.branch && (
                  <div className="configured-detail">

                    <span>
                      Branch
                    </span>

                    <strong>
                      {selectedMethod.branch}
                    </strong>

                  </div>
                )}

              </div>
            )}

            {/* CRYPTO DETAILS */}
            {selectedMethod.category ===
              "Cryptocurrency" && (
              <div className="crypto-details">

                {selectedMethod.network && (
                  <div className="configured-detail">

                    <span>
                      Network
                    </span>

                    <strong>
                      {selectedMethod.network}
                    </strong>

                  </div>
                )}

                {selectedMethod.wallet_address && (
                  <div className="wallet-box">

                    <span>
                      Wallet Address
                    </span>

                    <div className="wallet-address-row">

                      <strong>
                        {selectedMethod.wallet_address}
                      </strong>

                      <button
                        type="button"
                        onClick={
                          copyWalletAddress
                        }
                      >
                        Copy
                      </button>

                    </div>

                  </div>
                )}

                {selectedMethod.wallet_address && (
                  <div className="wallet-warning">

                    ⚠️ Send only through the
                    <strong>
                      {" "}
                      {selectedMethod.network}
                    </strong>{" "}
                    network. Sending through
                    another network may result
                    in permanent loss of funds.

                  </div>
                )}

              </div>
            )}

            {/* QR */}
            {selectedMethod.qr_image && (
              <div className="payment-qr">

                <span>
                  Payment QR Code
                </span>

                <img
                  src={
                    selectedMethod.qr_image
                  }
                  alt={`${selectedMethod.name} payment QR`}
                  onError={(event) => {
                    event.currentTarget.style.display =
                      "none";
                  }}
                />

              </div>
            )}

          </div>

          {/* FORM */}
          <form
            className="deposit-form"
            onSubmit={
              createDepositRequest
            }
          >

            {/* AMOUNT */}
            <div className="form-section">

              <label>
                Deposit Amount (NPR)
              </label>

              <div className="amount-limits">

                <span>
                  Minimum:{" "}
                  {selectedMethod.min_amount !==
                  null
                    ? `${formatNumber(
                        selectedMethod.min_amount
                      )} NPR`
                    : "—"}
                </span>

                <span>
                  Maximum:{" "}
                  {selectedMethod.max_amount !==
                  null
                    ? `${formatNumber(
                        selectedMethod.max_amount
                      )} NPR`
                    : "—"}
                </span>

              </div>

              <input
                type="number"
                step="any"
                min={
                  selectedMethod.min_amount ??
                  undefined
                }
                max={
                  selectedMethod.max_amount ??
                  undefined
                }
                value={amount}
                onChange={(event) =>
                  setAmount(
                    event.target.value
                  )
                }
                placeholder="Enter amount"
              />

              {/* QUICK AMOUNTS */}
              {selectedMethod.category ===
                "Local Payment" && (
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
                  ].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() =>
                        setAmount(
                          String(value)
                        )
                      }
                    >
                      {value.toLocaleString(
                        "en-NP"
                      )}
                    </button>
                  ))}

                </div>
              )}

            </div>

            {/* CRYPTO CALCULATION */}
            {selectedMethod.category ===
              "Cryptocurrency" && (
              <div className="crypto-calculation">

                <div>

                  <span>
                    Current Exchange Rate
                  </span>

                  <strong>
                    1 USDT ={" "}
                    {formatNumber(
                      exchangeRate,
                      8
                    )}{" "}
                    NPR
                  </strong>

                </div>

                <div>

                  <span>
                    You will send approximately
                  </span>

                  <strong>
                    {formatNumber(
                      calculatedCryptoAmount,
                      8
                    )}{" "}
                    {selectedMethod.name
                      .toLowerCase()
                      .includes("usdt")
                      ? "USDT"
                      : selectedMethod.name}
                  </strong>

                </div>

                <p>
                  The displayed exchange rate
                  may differ slightly from the
                  final settlement rate.
                </p>

              </div>
            )}

            {/* SENDER ACCOUNT */}
            <div className="form-field">

              <label>
                Your{" "}
                {selectedMethod.name}{" "}
                Account Number
              </label>

              <input
                type="text"
                value={senderAccount}
                onChange={(event) =>
                  setSenderAccount(
                    event.target.value
                  )
                }
                placeholder={`Your ${selectedMethod.name} Account Number`}
              />

            </div>

            {/* SENDER NAME */}
            <div className="form-field">

              <label>
                Your{" "}
                {selectedMethod.name}{" "}
                Account Name
              </label>

              <input
                type="text"
                value={senderName}
                onChange={(event) =>
                  setSenderName(
                    event.target.value
                  )
                }
                placeholder={`Your ${selectedMethod.name} Account Name`}
              />

            </div>

            {/* TRANSACTION ID */}
            <div className="form-field">

              <label>
                Transaction ID / Reference No.
              </label>

              <input
                type="text"
                value={transactionId}
                onChange={(event) =>
                  setTransactionId(
                    event.target.value
                  )
                }
                placeholder="Enter transaction ID / reference number"
              />

            </div>

            {/* SCREENSHOT */}
            <div className="form-field">

              <label>
                Payment Screenshot
              </label>

              <input
                id="deposit-screenshot"
                type="file"
                accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf"
                onChange={
                  handleScreenshotChange
                }
              />

              <small>
                Accepted formats: JPG,
                JPEG, PNG, PDF. Maximum
                size: 20 MB.
              </small>

              {screenshotFile && (
                <div className="selected-file">

                  ✓{" "}
                  {screenshotFile.name}

                  {" • "}

                  {Math.ceil(
                    screenshotFile.size /
                      1024
                  )}{" "}
                  KB

                </div>
              )}

            </div>

            {/* SAFETY NOTICE */}
            <div className="safety-notice">

              <strong>
                Safety notice
              </strong>

              <p>
                Please do not include
                betting-related words or
                unnecessary sensitive
                information in payment
                comments.
              </p>

            </div>

            {/* USER INFO */}
            {user && (
              <div className="deposit-session-info">

                Logged-in account verified.
                Your deposit request will be
                linked to your account.

              </div>
            )}

            {!user && (
              <div className="deposit-session-info warning">

                Please log in before creating
                a deposit request.

              </div>
            )}

            {/* SUBMIT */}
            <button
              type="submit"
              className="create-deposit-button"
              disabled={
                submitting ||
                !user ||
                !selectedMethod
              }
            >
              {submitting
                ? "SUBMITTING..."
                : "CREATE DEPOSIT REQUEST"}
            </button>

          </form>

        </section>
      )}

    </div>
  );
}

export default Deposit;