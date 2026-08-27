import { useEffect, useMemo, useState } from "react";
import "./AdminPaymentMethods.css";

/* =====================================================
   ALL PAYMENT METHODS
===================================================== */

const BASE_METHODS = [
  /* LOCAL */
  {
    id: "esewa",
    name: "eSewa",
    type: "Local Payment",
    category: "Local Payment",
    icon: "e",
    color: "#35b96f",
    network: "",
  },
  {
    id: "khalti",
    name: "Khalti",
    type: "Local Payment",
    category: "Local Payment",
    icon: "K",
    color: "#5c2d91",
    network: "",
  },
  {
    id: "bank",
    name: "Bank Transfer",
    type: "Local Payment",
    category: "Local Payment",
    icon: "B",
    color: "#4c8bf5",
    network: "",
  },

  /* CRYPTO */
  {
    id: "tether-ton",
    name: "Tether on TON",
    type: "Cryptocurrency",
    category: "Cryptocurrency",
    icon: "₮",
    color: "#26a17b",
    network: "TON",
  },
  {
    id: "tether-tron",
    name: "Tether on Tron",
    type: "Cryptocurrency",
    category: "Cryptocurrency",
    icon: "₮",
    color: "#26a17b",
    network: "TRON",
  },
  {
    id: "tether-bsc",
    name: "Tether on BSC",
    type: "Cryptocurrency",
    category: "Cryptocurrency",
    icon: "₮",
    color: "#26a17b",
    network: "BSC",
  },
  {
    id: "tether-ethereum",
    name: "Tether on Ethereum",
    type: "Cryptocurrency",
    category: "Cryptocurrency",
    icon: "₮",
    color: "#26a17b",
    network: "Ethereum",
  },
  {
    id: "tron",
    name: "TRON",
    type: "Cryptocurrency",
    category: "Cryptocurrency",
    icon: "T",
    color: "#e33b45",
    network: "TRON",
  },
  {
    id: "bitcoin",
    name: "Bitcoin",
    type: "Cryptocurrency",
    category: "Cryptocurrency",
    icon: "₿",
    color: "#f7931a",
    network: "Bitcoin",
  },
  {
    id: "litecoin",
    name: "Litecoin",
    type: "Cryptocurrency",
    category: "Cryptocurrency",
    icon: "Ł",
    color: "#345d9d",
    network: "Litecoin",
  },
  {
    id: "ethereum",
    name: "Ethereum",
    type: "Cryptocurrency",
    category: "Cryptocurrency",
    icon: "Ξ",
    color: "#627eea",
    network: "Ethereum",
  },
  {
    id: "bnb",
    name: "Binance Coin BSC",
    type: "Cryptocurrency",
    category: "Cryptocurrency",
    icon: "B",
    color: "#f3ba2f",
    network: "BSC",
  },
  {
    id: "dogecoin",
    name: "Dogecoin",
    type: "Cryptocurrency",
    category: "Cryptocurrency",
    icon: "Ð",
    color: "#c2a633",
    network: "Dogecoin",
  },
  {
    id: "usdc-eth",
    name: "USD Coin on Ethereum",
    type: "Cryptocurrency",
    category: "Cryptocurrency",
    icon: "$",
    color: "#2775ca",
    network: "Ethereum",
  },
  {
    id: "xrp",
    name: "XRP",
    type: "Cryptocurrency",
    category: "Cryptocurrency",
    icon: "X",
    color: "#23292f",
    network: "XRP",
  },
  {
    id: "polygon",
    name: "Polygon",
    type: "Cryptocurrency",
    category: "Cryptocurrency",
    icon: "P",
    color: "#8247e5",
    network: "Polygon",
  },
];

/* =====================================================
   CREATE DEFAULT CONFIG
===================================================== */

function createDefaultConfig(method) {
  const isLocal = method.type === "Local Payment";
  const isTether = method.name.toLowerCase().includes("tether");

  return {
    id: method.id,
    name: method.name,
    type: method.type,
    category: method.category,

    icon: method.icon,
    color: method.color,

    enabled: true,

    recommended: isLocal && method.id !== "bank",

    /* LOCAL */
    agentName: "",
    accountNumber: "",
    accountName: "",
    phone: "",
    bankName: "",
    branch: "",

    /* CRYPTO */
    network: method.network || "",
    walletAddress: "",

    /* LIMITS */
    minAmount: isLocal ? 500 : 3,
    maxAmount: isLocal ? 25000 : 100000,

    /* WITHDRAWAL LIMITS */
    minWithdrawal: isLocal ? 500 : 3,
    maxWithdrawal: isLocal ? 25000 : 100000,

    /* USDT */
    exchangeRate: isTether ? 169.7335108 : "",

    /* QR / INSTRUCTIONS */
    qrImage: "",
    instructions: "",
  };
}

/* =====================================================
   LOAD SAVED CONFIG
===================================================== */

function loadConfigs() {
  try {
    const saved = JSON.parse(
      localStorage.getItem("adminPaymentMethods") || "[]"
    );

    return BASE_METHODS.map((method) => {
      const defaultConfig = createDefaultConfig(method);

      const savedConfig = saved.find(
        (item) => item.id === method.id
      );

      return {
        ...defaultConfig,
        ...(savedConfig || {}),
      };
    });
  } catch (error) {
    console.error("Payment config load error:", error);

    return BASE_METHODS.map(createDefaultConfig);
  }
}

/* =====================================================
   ADMIN PAYMENT METHODS
===================================================== */

function AdminPaymentMethods() {
  const [configs, setConfigs] = useState(loadConfigs);

  const [selectedId, setSelectedId] = useState("esewa");

  const [activeTab, setActiveTab] = useState("all");

  const [search, setSearch] = useState("");

  const [message, setMessage] = useState("");

  const [qrFileName, setQrFileName] = useState("");

  /* =====================================================
     SELECTED METHOD
  ===================================================== */

  const selected = configs.find(
    (item) => item.id === selectedId
  );

  /* =====================================================
     AUTO SAVE STATE
  ===================================================== */

  useEffect(() => {
    localStorage.setItem(
      "adminPaymentMethods",
      JSON.stringify(configs)
    );
  }, [configs]);

  /* =====================================================
     FILTER METHODS
  ===================================================== */

  const filteredMethods = useMemo(() => {
    return configs.filter((method) => {
      const matchesTab =
        activeTab === "all" ||
        (activeTab === "local" &&
          method.type === "Local Payment") ||
        (activeTab === "crypto" &&
          method.type === "Cryptocurrency");

      const matchesSearch =
        method.name
          .toLowerCase()
          .includes(search.toLowerCase());

      return matchesTab && matchesSearch;
    });
  }, [configs, activeTab, search]);

  /* =====================================================
     UPDATE FIELD
  ===================================================== */

  function update(field, value) {
    setConfigs((current) =>
      current.map((item) =>
        item.id === selectedId
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    );

    setMessage("");
  }

  /* =====================================================
     SAVE
  ===================================================== */

  function save() {
    localStorage.setItem(
      "adminPaymentMethods",
      JSON.stringify(configs)
    );

    /*
      Save latest USDT rate separately.
    */

    if (
      selected &&
      selected.exchangeRate &&
      Number(selected.exchangeRate) > 0
    ) {
      localStorage.setItem(
        "usdtNprRate",
        String(selected.exchangeRate)
      );
    }

    /*
      Notify Deposit / Withdrawal pages.
    */

    window.dispatchEvent(
      new Event("payment-config-updated")
    );

    setMessage(
      `${selected?.name || "Payment method"} settings saved successfully.`
    );
  }

  /* =====================================================
     ENABLE / DISABLE
  ===================================================== */

  function toggleEnabled() {
    if (!selected) return;

    update(
      "enabled",
      !selected.enabled
    );
  }

  /* =====================================================
     QR UPLOAD
  ===================================================== */

  function handleQr(file) {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage(
        "Please select a valid image for QR code."
      );

      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setMessage(
        "QR image must be smaller than 2 MB."
      );

      return;
    }

    setQrFileName(file.name);

    const reader = new FileReader();

    reader.onload = () => {
      update(
        "qrImage",
        reader.result
      );
    };

    reader.readAsDataURL(file);
  }

  /* =====================================================
     DELETE QR
  ===================================================== */

  function removeQr() {
    update("qrImage", "");
    setQrFileName("");
  }

  /* =====================================================
     COPY WALLET
  ===================================================== */

  function copyWallet() {
    if (!selected?.walletAddress) {
      setMessage(
        "Wallet address is empty."
      );

      return;
    }

    navigator.clipboard
      ?.writeText(selected.walletAddress)
      .then(() => {
        setMessage(
          "Wallet address copied."
        );
      });
  }

  /* =====================================================
     RESET CURRENT METHOD
  ===================================================== */

  function resetCurrentMethod() {
    if (!selected) return;

    const base = BASE_METHODS.find(
      (item) => item.id === selected.id
    );

    if (!base) return;

    const confirmed = window.confirm(
      `Reset ${selected.name} settings?`
    );

    if (!confirmed) return;

    const resetConfig =
      createDefaultConfig(base);

    setConfigs((current) =>
      current.map((item) =>
        item.id === selectedId
          ? resetConfig
          : item
      )
    );

    setMessage(
      `${selected.name} settings reset.`
    );
  }

  /* =====================================================
     COUNTS
  ===================================================== */

  const localCount = configs.filter(
    (item) =>
      item.type === "Local Payment"
  ).length;

  const cryptoCount = configs.filter(
    (item) =>
      item.type === "Cryptocurrency"
  ).length;

  const enabledCount = configs.filter(
    (item) => item.enabled
  ).length;

  /* =====================================================
     UI
  ===================================================== */

  return (
    <div className="admin-payment-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="admin-header">

        <div className="admin-brand">

          <div className="admin-logo">
            BET<span>ZONE</span>
          </div>

          <div className="admin-subtitle">
            Admin Payment Management
          </div>

        </div>

        <nav className="admin-nav">

          <button
            onClick={() =>
              (window.location.href = "/admin")
            }
            className="nav-active"
          >
            Payment Methods
          </button>

          <button
            onClick={() =>
              (window.location.href =
                "/admin/deposits")
            }
          >
            Deposit Requests
          </button>

          <button
            onClick={() =>
              (window.location.href =
                "/admin/withdrawals")
            }
          >
            Withdrawal Requests
          </button>

        </nav>

      </header>

      {/* =================================================
          MAIN
      ================================================= */}

      <main className="admin-container">

        {/* PAGE TOP */}

        <div className="page-top">

          <div>

            <h1>
              Payment Methods
            </h1>

            <p>
              Manage local payments and
              cryptocurrency payment settings.
            </p>

          </div>

          <div className="admin-summary">

            <div className="summary-box">
              <strong>
                {configs.length}
              </strong>

              <span>
                Total
              </span>
            </div>

            <div className="summary-box">
              <strong>
                {enabledCount}
              </strong>

              <span>
                Enabled
              </span>
            </div>

          </div>

        </div>

        {/* =================================================
            TABS
        ================================================= */}

        <div className="method-toolbar">

          <div className="method-tabs">

            <button
              className={
                activeTab === "all"
                  ? "tab active"
                  : "tab"
              }
              onClick={() =>
                setActiveTab("all")
              }
            >
              All
              <span>
                {configs.length}
              </span>
            </button>

            <button
              className={
                activeTab === "local"
                  ? "tab active"
                  : "tab"
              }
              onClick={() =>
                setActiveTab("local")
              }
            >
              Local Payments
              <span>
                {localCount}
              </span>
            </button>

            <button
              className={
                activeTab === "crypto"
                  ? "tab active"
                  : "tab"
              }
              onClick={() =>
                setActiveTab("crypto")
              }
            >
              Cryptocurrency
              <span>
                {cryptoCount}
              </span>
            </button>

          </div>

          <input
            className="method-search"
            type="text"
            placeholder="Search payment..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

        {/* =================================================
            CONTENT
        ================================================= */}

        <div className="admin-workspace">

          {/* =================================================
              PAYMENT LIST
          ================================================= */}

          <section className="payment-list-panel">

            <div className="panel-title">

              <div>
                <h2>
                  Available Methods
                </h2>

                <span>
                  {filteredMethods.length} methods
                </span>
              </div>

            </div>

            <div className="payment-list">

              {filteredMethods.map((method) => (

                <button
                  key={method.id}
                  className={
                    selectedId === method.id
                      ? "payment-list-item selected"
                      : "payment-list-item"
                  }
                  onClick={() => {
                    setSelectedId(method.id);
                    setMessage("");
                    setQrFileName("");
                  }}
                >

                  <div
                    className="method-icon"
                    style={{
                      background:
                        `${method.color}18`,
                      color:
                        method.color,
                    }}
                  >
                    {method.icon}
                  </div>

                  <div className="method-list-info">

                    <strong>
                      {method.name}
                    </strong>

                    <small>
                      {method.type}

                      {method.network
                        ? ` • ${method.network}`
                        : ""}
                    </small>

                  </div>

                  <div className="method-list-right">

                    <span
                      className={
                        method.enabled
                          ? "status-badge enabled"
                          : "status-badge disabled"
                      }
                    >
                      {method.enabled
                        ? "Enabled"
                        : "Disabled"}
                    </span>

                    {method.recommended && (
                      <span className="recommended-small">
                        Recommended
                      </span>
                    )}

                  </div>

                </button>

              ))}

              {filteredMethods.length === 0 && (

                <div className="empty-list">
                  No payment method found.
                </div>

              )}

            </div>

          </section>

          {/* =================================================
              EDIT PANEL
          ================================================= */}

          {selected && (

            <section className="edit-panel">

              {/* EDIT HEADER */}

              <div className="edit-panel-header">

                <div className="edit-method-title">

                  <div
                    className="large-method-icon"
                    style={{
                      background:
                        `${selected.color}18`,
                      color:
                        selected.color,
                    }}
                  >
                    {selected.icon}
                  </div>

                  <div>

                    <span className="edit-type">
                      {selected.type}
                    </span>

                    <h2>
                      Edit {selected.name}
                    </h2>

                    {selected.network && (
                      <p>
                        Network:
                        <strong>
                          {" "}
                          {selected.network}
                        </strong>
                      </p>
                    )}

                  </div>

                </div>

                <div className="edit-header-actions">

                  <label className="switch-row">

                    <input
                      type="checkbox"
                      checked={selected.enabled}
                      onChange={(e) =>
                        update(
                          "enabled",
                          e.target.checked
                        )
                      }
                    />

                    <span className="switch"></span>

                    <span>
                      {selected.enabled
                        ? "Enabled"
                        : "Disabled"}
                    </span>

                  </label>

                </div>

              </div>

              {/* =================================================
                  LOCAL PAYMENT
              ================================================= */}

              {selected.type ===
                "Local Payment" && (

                <>

                  <div className="form-section">

                    <div className="section-heading">

                      <h3>
                        Account Details
                      </h3>

                      <span>
                        User-facing payment information
                      </span>

                    </div>

                    <div className="form-grid">

                      <Field
                        label="Agent Name"
                        value={
                          selected.agentName
                        }
                        onChange={(value) =>
                          update(
                            "agentName",
                            value
                          )
                        }
                      />

                      <Field
                        label="Account Number / ID"
                        value={
                          selected.accountNumber
                        }
                        onChange={(value) =>
                          update(
                            "accountNumber",
                            value
                          )
                        }
                      />

                      <Field
                        label="Account Name"
                        value={
                          selected.accountName
                        }
                        onChange={(value) =>
                          update(
                            "accountName",
                            value
                          )
                        }
                      />

                      <Field
                        label="Phone Number"
                        value={
                          selected.phone
                        }
                        onChange={(value) =>
                          update(
                            "phone",
                            value
                          )
                        }
                      />

                      {selected.id === "bank" && (
                        <>

                          <Field
                            label="Bank Name"
                            value={
                              selected.bankName
                            }
                            onChange={(value) =>
                              update(
                                "bankName",
                                value
                              )
                            }
                          />

                          <Field
                            label="Branch"
                            value={
                              selected.branch
                            }
                            onChange={(value) =>
                              update(
                                "branch",
                                value
                              )
                            }
                          />

                        </>
                      )}

                    </div>

                  </div>

                </>

              )}

              {/* =================================================
                  CRYPTO
              ================================================= */}

              {selected.type ===
                "Cryptocurrency" && (

                <>

                  <div className="form-section">

                    <div className="section-heading">

                      <h3>
                        Cryptocurrency Settings
                      </h3>

                      <span>
                        Configure wallet and network
                      </span>

                    </div>

                    <div className="form-grid">

                      <Field
                        label="Network"
                        value={
                          selected.network
                        }
                        onChange={(value) =>
                          update(
                            "network",
                            value
                          )
                        }
                      />

                      <Field
                        label="Wallet Address"
                        value={
                          selected.walletAddress
                        }
                        onChange={(value) =>
                          update(
                            "walletAddress",
                            value
                          )
                        }
                        full
                      />

                    </div>

                    <div className="wallet-actions">

                      <button
                        type="button"
                        onClick={copyWallet}
                      >
                        Copy Wallet Address
                      </button>

                      <span>
                        Enter the exact wallet
                        address used for this
                        payment network.
                      </span>

                    </div>

                  </div>

                </>

              )}

              {/* =================================================
                  LIMITS
              ================================================= */}

              <div className="form-section">

                <div className="section-heading">

                  <h3>
                    Payment Limits
                  </h3>

                  <span>
                    Deposit and withdrawal limits
                  </span>

                </div>

                <div className="form-grid">

                  <Field
                    label="Minimum Deposit"
                    type="number"
                    value={
                      selected.minAmount
                    }
                    onChange={(value) =>
                      update(
                        "minAmount",
                        value
                      )
                    }
                  />

                  <Field
                    label="Maximum Deposit"
                    type="number"
                    value={
                      selected.maxAmount
                    }
                    onChange={(value) =>
                      update(
                        "maxAmount",
                        value
                      )
                    }
                  />

                  <Field
                    label="Minimum Withdrawal"
                    type="number"
                    value={
                      selected.minWithdrawal
                    }
                    onChange={(value) =>
                      update(
                        "minWithdrawal",
                        value
                      )
                    }
                  />

                  <Field
                    label="Maximum Withdrawal"
                    type="number"
                    value={
                      selected.maxWithdrawal
                    }
                    onChange={(value) =>
                      update(
                        "maxWithdrawal",
                        value
                      )
                    }
                  />

                </div>

              </div>

              {/* =================================================
                  USDT RATE
              ================================================= */}

              {selected.name
                .toLowerCase()
                .includes("tether") && (

                <div className="form-section">

                  <div className="section-heading">

                    <h3>
                      USDT Exchange Rate
                    </h3>

                    <span>
                      Used for NPR / USDT conversion
                    </span>

                  </div>

                  <div className="rate-box">

                    <div className="rate-label">
                      1 USDT =
                    </div>

                    <input
                      type="number"
                      step="0.0000001"
                      value={
                        selected.exchangeRate
                      }
                      onChange={(e) =>
                        update(
                          "exchangeRate",
                          e.target.value
                        )
                      }
                    />

                    <div className="rate-label">
                      NPR
                    </div>

                  </div>

                </div>

              )}

              {/* =================================================
                  QR CODE
              ================================================= */}

              <div className="form-section">

                <div className="section-heading">

                  <h3>
                    QR Code
                  </h3>

                  <span>
                    Optional payment QR
                  </span>

                </div>

                <div className="qr-box">

                  <div className="qr-preview">

                    {selected.qrImage ? (

                      <img
                        src={selected.qrImage}
                        alt={`${selected.name} QR`}
                      />

                    ) : (

                      <div className="qr-empty">
                        No QR
                      </div>

                    )}

                  </div>

                  <div className="qr-upload">

                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={(e) =>
                        handleQr(
                          e.target.files?.[0]
                        )
                      }
                    />

                    {qrFileName && (
                      <div className="file-name">
                        {qrFileName}
                      </div>
                    )}

                    <small>
                      PNG, JPG or WEBP.
                      Maximum 2 MB.
                    </small>

                    {selected.qrImage && (

                      <button
                        type="button"
                        className="remove-qr"
                        onClick={removeQr}
                      >
                        Remove QR
                      </button>

                    )}

                  </div>

                </div>

              </div>

              {/* =================================================
                  RECOMMENDED
              ================================================= */}

              <div className="form-section compact-section">

                <div className="section-heading">

                  <h3>
                    Display Settings
                  </h3>

                </div>

                <label className="recommended-row">

                  <input
                    type="checkbox"
                    checked={
                      Boolean(
                        selected.recommended
                      )
                    }
                    onChange={(e) =>
                      update(
                        "recommended",
                        e.target.checked
                      )
                    }
                  />

                  <div>

                    <strong>
                      Recommended
                    </strong>

                    <small>
                      Show Recommended badge
                      on the user payment page.
                    </small>

                  </div>

                </label>

              </div>

              {/* =================================================
                  INSTRUCTIONS
              ================================================= */}

              <div className="form-section">

                <div className="section-heading">

                  <h3>
                    Payment Instructions
                  </h3>

                  <span>
                    Instructions shown to users
                  </span>

                </div>

                <textarea
                  className="instructions"
                  rows="4"
                  value={
                    selected.instructions || ""
                  }
                  onChange={(e) =>
                    update(
                      "instructions",
                      e.target.value
                    )
                  }
                  placeholder="Enter payment instructions..."
                />

              </div>

              {/* =================================================
                  MESSAGE
              ================================================= */}

              {message && (

                <div className="admin-message">
                  {message}
                </div>

              )}

              {/* =================================================
                  ACTIONS
              ================================================= */}

              <div className="edit-actions">

                <button
                  className="reset-button"
                  type="button"
                  onClick={
                    resetCurrentMethod
                  }
                >
                  Reset
                </button>

                <button
                  className="save-button"
                  type="button"
                  onClick={save}
                >
                  Save Changes
                </button>

              </div>

            </section>

          )}

        </div>

      </main>

    </div>
  );
}

/* =====================================================
   FIELD COMPONENT
===================================================== */

function Field({
  label,
  value,
  onChange,
  type = "text",
  full = false,
}) {
  return (
    <div
      className={
        full
          ? "admin-field full"
          : "admin-field"
      }
    >

      <label>
        {label}
      </label>

      <input
        type={type}
        value={value ?? ""}
        onChange={(e) =>
          onChange(e.target.value)
        }
      />

    </div>
  );
}

export default AdminPaymentMethods;