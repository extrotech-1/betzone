import { useEffect, useMemo, useState } from "react";
import "./AdminPaymentMethods.css";
import { supabase } from "../../../supabaseClient";

/*
|--------------------------------------------------------------------------
| DEFAULT PAYMENT METHODS
|--------------------------------------------------------------------------
*/

const DEFAULT_METHODS = [
  {
    method_id: "esewa",
    name: "eSewa",
    category: "Local Payment",
    type: "Local Payment",
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
    type: "Local Payment",
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
    type: "Local Payment",
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
    type: "Cryptocurrency",
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
    type: "Cryptocurrency",
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
    type: "Cryptocurrency",
    icon: "₮",
    color: "#26a17b",
    enabled: true,
    recommended: false,
    account_name: "",
    account_number: "",
    bank_name: "",
    branch: "",
    qr_image: "",
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
    type: "Cryptocurrency",
    icon: "₮",
    color: "#26a17b",
    enabled: true,
    recommended: false,
    account_name: "",
    account_number: "",
    bank_name: "",
    branch: "",
    qr_image: "",
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
    type: "Cryptocurrency",
    icon: "T",
    color: "#e33b45",
    enabled: true,
    recommended: false,
    account_name: "",
    account_number: "",
    bank_name: "",
    branch: "",
    qr_image: "",
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
    type: "Cryptocurrency",
    icon: "₿",
    color: "#f7931a",
    enabled: true,
    recommended: false,
    account_name: "",
    account_number: "",
    bank_name: "",
    branch: "",
    qr_image: "",
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
    type: "Cryptocurrency",
    icon: "Ł",
    color: "#345d9d",
    enabled: true,
    recommended: false,
    account_name: "",
    account_number: "",
    bank_name: "",
    branch: "",
    qr_image: "",
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
    type: "Cryptocurrency",
    icon: "Ξ",
    color: "#627eea",
    enabled: true,
    recommended: false,
    account_name: "",
    account_number: "",
    bank_name: "",
    branch: "",
    qr_image: "",
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
    type: "Cryptocurrency",
    icon: "B",
    color: "#f3ba2f",
    enabled: true,
    recommended: false,
    account_name: "",
    account_number: "",
    bank_name: "",
    branch: "",
    qr_image: "",
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
    type: "Cryptocurrency",
    icon: "Ð",
    color: "#c2a633",
    enabled: true,
    recommended: false,
    account_name: "",
    account_number: "",
    bank_name: "",
    branch: "",
    qr_image: "",
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
    type: "Cryptocurrency",
    icon: "$",
    color: "#2775ca",
    enabled: true,
    recommended: false,
    account_name: "",
    account_number: "",
    bank_name: "",
    branch: "",
    qr_image: "",
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
    type: "Cryptocurrency",
    icon: "X",
    color: "#23292f",
    enabled: true,
    recommended: false,
    account_name: "",
    account_number: "",
    bank_name: "",
    branch: "",
    qr_image: "",
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
    type: "Cryptocurrency",
    icon: "P",
    color: "#8247e5",
    enabled: true,
    recommended: false,
    account_name: "",
    account_number: "",
    bank_name: "",
    branch: "",
    qr_image: "",
    network: "Polygon",
    wallet_address: "",
    min_amount: 1,
    max_amount: 100000,
    instructions: "",
  },
];

/*
|--------------------------------------------------------------------------
| EMPTY FORM
|--------------------------------------------------------------------------
*/

function emptyForm() {
  return {
    method_id: "",
    name: "",
    category: "Local Payment",
    type: "Local Payment",

    icon: "",
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

    min_amount: "",
    max_amount: "",

    instructions: "",
  };
}

/*
|--------------------------------------------------------------------------
| NORMALIZE DATABASE ROW
|--------------------------------------------------------------------------
*/

function normalizeMethod(row) {
  const category =
    row?.category ||
    row?.type ||
    "Local Payment";

  return {
    id: row?.id ?? null,

    method_id:
      row?.method_id ??
      "",

    name:
      row?.name ??
      row?.method_name ??
      "",

    category,

    type:
      row?.type ??
      category,

    icon:
      row?.icon ??
      "",

    color:
      row?.color ??
      "#2563eb",

    enabled:
      row?.enabled !== false,

    recommended:
      row?.recommended === true,

    account_name:
      row?.account_name ??
      "",

    account_number:
      row?.account_number ??
      "",

    bank_name:
      row?.bank_name ??
      "",

    branch:
      row?.branch ??
      "",

    qr_image:
      row?.qr_image ??
      row?.qr_image_url ??
      "",

    network:
      row?.network ??
      "",

    wallet_address:
      row?.wallet_address ??
      "",

    min_amount:
      row?.min_amount ??
      "",

    max_amount:
      row?.max_amount ??
      "",

    instructions:
      row?.instructions ??
      row?.customer_instructions ??
      "",
  };
}

/*
|--------------------------------------------------------------------------
| LOAD PAYMENT METHODS
|--------------------------------------------------------------------------
*/

async function getPaymentMethods() {
  const {
    data,
    error,
  } = await supabase
    .from("payment_methods")
    .select("*");

  if (error) {
    throw error;
  }

  return Array.isArray(data)
    ? data.map(normalizeMethod)
    : [];
}

/*
|--------------------------------------------------------------------------
| LOAD RATE
|--------------------------------------------------------------------------
*/

function getRate() {
  try {
    const saved =
      Number(
        localStorage.getItem(
          "usdtNprRate"
        )
      );

    if (
      Number.isFinite(saved) &&
      saved > 0
    ) {
      return saved;
    }
  } catch (error) {
    console.warn(
      "Could not read exchange rate:",
      error
    );
  }

  return 169.7335108;
}

/*
|--------------------------------------------------------------------------
| COMPONENT
|--------------------------------------------------------------------------
*/

function AdminPaymentMethods() {
  const [methods, setMethods] =
    useState([]);

  const [filter, setFilter] =
    useState("All");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [notice, setNotice] =
    useState("");

  const [error, setError] =
    useState("");

  const [showEditor, setShowEditor] =
    useState(false);

  const [editingMethod, setEditingMethod] =
    useState(null);

  const [form, setForm] =
    useState(emptyForm());

  const [rate, setRate] =
    useState(169.7335108);

  const [rateInput, setRateInput] =
    useState("169.7335108");

  /*
  |--------------------------------------------------------------------------
  | REFRESH METHODS
  |--------------------------------------------------------------------------
  */

  async function refreshMethods() {
    try {
      setLoading(true);
      setError("");

      const data =
        await getPaymentMethods();

      /*
       * If database has no records,
       * display all defaults.
       */
      if (!data.length) {
        setMethods(
          DEFAULT_METHODS.map(
            normalizeMethod
          )
        );

        return;
      }

      /*
       * Merge database records with
       * the default 16 methods.
       */
      const merged =
        DEFAULT_METHODS.map(
          (base) => {
            const databaseMethod =
              data.find(
                (item) =>
                  item.method_id ===
                  base.method_id
              );

            if (!databaseMethod) {
              return base;
            }

            return {
              ...base,
              ...databaseMethod,
            };
          }
        );

      /*
       * Include custom methods created
       * by admin.
       */
      const customMethods =
        data.filter(
          (databaseMethod) =>
            !DEFAULT_METHODS.some(
              (base) =>
                base.method_id ===
                databaseMethod.method_id
            )
        );

      setMethods([
        ...merged,
        ...customMethods,
      ]);
    } catch (err) {
      console.error(
        "Could not load payment methods:",
        err
      );

      /*
       * Keep page usable even if
       * Supabase temporarily fails.
       */
      setMethods(
        DEFAULT_METHODS.map(
          normalizeMethod
        )
      );

      setError(
        `Could not load payment methods: ${
          err?.message ||
          "Unknown error"
        }`
      );
    } finally {
      setLoading(false);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | REFRESH RATE
  |--------------------------------------------------------------------------
  */

  function refreshRate() {
    const saved = getRate();

    setRate(saved);
    setRateInput(
      String(saved)
    );
  }

  /*
  |--------------------------------------------------------------------------
  | INITIAL LOAD
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    refreshMethods();
    refreshRate();

    const refresh = () => {
      refreshMethods();
      refreshRate();
    };

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

  /*
  |--------------------------------------------------------------------------
  | FILTER
  |--------------------------------------------------------------------------
  */

  const filteredMethods =
    useMemo(() => {
      if (filter === "All") {
        return methods;
      }

      return methods.filter(
        (method) =>
          method.category ===
          filter
      );
    }, [
      methods,
      filter,
    ]);

  /*
  |--------------------------------------------------------------------------
  | OPEN ADD
  |--------------------------------------------------------------------------
  */

  function openAdd() {
    setEditingMethod(null);
    setForm(emptyForm());
    setNotice("");
    setError("");
    setShowEditor(true);
  }

  /*
  |--------------------------------------------------------------------------
  | OPEN EDIT
  |--------------------------------------------------------------------------
  */

  function openEdit(method) {
    setEditingMethod(method);

    setForm({
      ...emptyForm(),
      ...method,

      type:
        method.type ||
        method.category ||
        "Local Payment",

      category:
        method.category ||
        method.type ||
        "Local Payment",

      min_amount:
        method.min_amount ??
        "",

      max_amount:
        method.max_amount ??
        "",
    });

    setNotice("");
    setError("");
    setShowEditor(true);
  }

  /*
  |--------------------------------------------------------------------------
  | CLOSE EDITOR
  |--------------------------------------------------------------------------
  */

  function closeEditor() {
    if (saving) {
      return;
    }

    setShowEditor(false);
    setEditingMethod(null);
    setForm(emptyForm());
  }

  /*
  |--------------------------------------------------------------------------
  | UPDATE FORM
  |--------------------------------------------------------------------------
  */

  function updateField(
    field,
    value
  ) {
    setForm(
      (previous) => ({
        ...previous,
        [field]: value,

        /*
         * Keep type synchronized
         * with category.
         */
        ...(field === "category"
          ? {
              type: value,
            }
          : {}),
      })
    );
  }

  /*
  |--------------------------------------------------------------------------
  | SAVE RATE
  |--------------------------------------------------------------------------
  */

  function saveRate() {
    const value =
      Number(rateInput);

    if (
      !Number.isFinite(value) ||
      value <= 0
    ) {
      setError(
        "Please enter a valid USDT/NPR exchange rate."
      );

      return;
    }

    try {
      localStorage.setItem(
        "usdtNprRate",
        String(value)
      );

      setRate(value);

      window.dispatchEvent(
        new Event(
          "payment-config-updated"
        )
      );

      setNotice(
        `Exchange rate saved: 1 USDT = ${value} NPR`
      );

      setError("");
    } catch (err) {
      setError(
        "Could not save exchange rate."
      );
    }
  }

  /*
  |--------------------------------------------------------------------------
  | SAVE PAYMENT METHOD
  |--------------------------------------------------------------------------
  */

  async function saveMethod(event) {
    event.preventDefault();

    if (saving) {
      return;
    }

    setNotice("");
    setError("");

    const methodId =
      form.method_id.trim();

    const name =
      form.name.trim();

    /*
     * BASIC VALIDATION
     */

    if (!methodId) {
      setError(
        "Method ID is required."
      );

      return;
    }

    if (!name) {
      setError(
        "Method Name is required."
      );

      return;
    }

    /*
     * Validate method ID.
     */
    if (
      !/^[a-zA-Z0-9_-]+$/.test(
        methodId
      )
    ) {
      setError(
        "Method ID can contain only letters, numbers, hyphens and underscores."
      );

      return;
    }

    /*
     * AMOUNTS
     */

    const minAmount =
      form.min_amount === ""
        ? null
        : Number(
            form.min_amount
          );

    const maxAmount =
      form.max_amount === ""
        ? null
        : Number(
            form.max_amount
          );

    if (
      minAmount !== null &&
      (!Number.isFinite(
        minAmount
      ) ||
        minAmount < 0)
    ) {
      setError(
        "Minimum amount is invalid."
      );

      return;
    }

    if (
      maxAmount !== null &&
      (!Number.isFinite(
        maxAmount
      ) ||
        maxAmount < 0)
    ) {
      setError(
        "Maximum amount is invalid."
      );

      return;
    }

    if (
      minAmount !== null &&
      maxAmount !== null &&
      minAmount > maxAmount
    ) {
      setError(
        "Minimum amount cannot be greater than maximum amount."
      );

      return;
    }

    /*
     * CRYPTO NETWORK
     */

    if (
      form.category ===
        "Cryptocurrency" &&
      !form.network.trim()
    ) {
      setError(
        "Crypto Network is required."
      );

      return;
    }

    try {
      setSaving(true);

      /*
       * IMPORTANT
       *
       * Your Supabase table requires:
       *
       * id   -> NOT NULL
       * type -> NOT NULL
       *
       * Therefore type is always included.
       */

      const payload = {
        method_id:
          methodId,

        name:
          name,

        /*
         * REQUIRED COLUMN
         */
        type:
          form.category,

        /*
         * Keep category as well
         * for the frontend.
         */
        category:
          form.category,

        icon:
          form.icon.trim(),

        color:
          form.color ||
          "#2563eb",

        enabled:
          Boolean(
            form.enabled
          ),

        recommended:
          Boolean(
            form.recommended
          ),

        account_name:
          form.account_name.trim(),

        account_number:
          form.account_number.trim(),

        bank_name:
          form.bank_name.trim(),

        branch:
          form.branch.trim(),

        qr_image:
          form.qr_image.trim(),

        network:
          form.network.trim(),

        wallet_address:
          form.wallet_address.trim(),

        min_amount:
          minAmount,

        max_amount:
          maxAmount,

        instructions:
          form.instructions.trim(),
      };

      let savedData = null;

      /*
       * =========================================================
       * EDIT EXISTING METHOD
       * =========================================================
       *
       * IMPORTANT:
       * We use UPDATE.
       *
       * No new id is generated.
       */
      if (editingMethod) {
        const {
          data,
          error: updateError,
        } = await supabase
          .from(
            "payment_methods"
          )
          .update(payload)
          .eq(
            "method_id",
            editingMethod.method_id
          )
          .select()
          .single();

        if (updateError) {
          throw updateError;
        }

        savedData = data;
      }

      /*
       * =========================================================
       * ADD NEW METHOD
       * =========================================================
       *
       * Your table says:
       *
       * id NOT NULL
       *
       * So generate a UUID.
       */
      else {
        const newId =
          crypto.randomUUID();

        const {
          data,
          error: insertError,
        } = await supabase
          .from(
            "payment_methods"
          )
          .insert({
            id: newId,

            ...payload,
          })
          .select()
          .single();

        if (insertError) {
          throw insertError;
        }

        savedData = data;
      }

      /*
       * NORMALIZE RESULT
       */

      const savedMethod =
        normalizeMethod(
          savedData
        );

      /*
       * UPDATE UI
       */

      setMethods(
        (previous) => {
          const exists =
            previous.some(
              (item) =>
                item.method_id ===
                savedMethod.method_id
            );

          if (exists) {
            return previous.map(
              (item) =>
                item.method_id ===
                savedMethod.method_id
                  ? {
                      ...item,
                      ...savedMethod,
                    }
                  : item
            );
          }

          return [
            ...previous,
            savedMethod,
          ];
        }
      );

      setNotice(
        `${savedMethod.name} payment details saved successfully.`
      );

      /*
       * Notify Deposit page.
       */

      window.dispatchEvent(
        new Event(
          "payment-config-updated"
        )
      );

      /*
       * Close editor.
       */

      setShowEditor(false);
      setEditingMethod(null);
      setForm(emptyForm());

    } catch (err) {
      console.error(
        "Could not save payment method:",
        err
      );

      setError(
        `Could not save payment method: ${
          err?.message ||
          "Unknown error"
        }`
      );
    } finally {
      setSaving(false);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | TOGGLE ENABLE / DISABLE
  |--------------------------------------------------------------------------
  */

  async function toggleMethod(
    method
  ) {
    if (!method.method_id) {
      return;
    }

    try {
      setError("");

      const newValue =
        !method.enabled;

      /*
       * IMPORTANT:
       * Update existing row only.
       *
       * No upsert.
       * No new ID required.
       */
      const updatePayload = {
        name:
          method.name,

        /*
         * REQUIRED
         */
        type:
          method.type ||
          method.category ||
          "Local Payment",

        category:
          method.category ||
          method.type ||
          "Local Payment",

        icon:
          method.icon ||
          "",

        color:
          method.color ||
          "#2563eb",

        enabled:
          newValue,

        recommended:
          Boolean(
            method.recommended
          ),

        account_name:
          method.account_name ||
          "",

        account_number:
          method.account_number ||
          "",

        bank_name:
          method.bank_name ||
          "",

        branch:
          method.branch ||
          "",

        qr_image:
          method.qr_image ||
          "",

        network:
          method.network ||
          "",

        wallet_address:
          method.wallet_address ||
          "",

        min_amount:
          method.min_amount ===
            "" ||
          method.min_amount ==
            null
            ? null
            : Number(
                method.min_amount
              ),

        max_amount:
          method.max_amount ===
            "" ||
          method.max_amount ==
            null
            ? null
            : Number(
                method.max_amount
              ),

        instructions:
          method.instructions ||
          "",
      };

      const {
        data,
        error: updateError,
      } = await supabase
        .from(
          "payment_methods"
        )
        .update(
          updatePayload
        )
        .eq(
          "method_id",
          method.method_id
        )
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      const updated =
        normalizeMethod(data);

      setMethods(
        (previous) =>
          previous.map(
            (item) =>
              item.method_id ===
              updated.method_id
                ? {
                    ...item,
                    ...updated,
                  }
                : item
          )
      );

      setNotice(
        `${method.name} is now ${
          newValue
            ? "enabled"
            : "disabled"
        }.`
      );

      window.dispatchEvent(
        new Event(
          "payment-config-updated"
        )
      );

    } catch (err) {
      console.error(
        "Could not update payment method:",
        err
      );

      setError(
        `Could not update payment method: ${
          err?.message ||
          "Unknown error"
        }`
      );
    }
  }

  /*
  |--------------------------------------------------------------------------
  | DELETE CUSTOM METHOD
  |--------------------------------------------------------------------------
  */

  async function deleteMethod(
    method
  ) {
    const isDefault =
      DEFAULT_METHODS.some(
        (item) =>
          item.method_id ===
          method.method_id
      );

    if (isDefault) {
      setError(
        "Default payment methods cannot be deleted. Disable them instead."
      );

      return;
    }

    const confirmed =
      window.confirm(
        `Delete ${method.name}?`
      );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      const {
        error: deleteError,
      } = await supabase
        .from(
          "payment_methods"
        )
        .delete()
        .eq(
          "method_id",
          method.method_id
        );

      if (deleteError) {
        throw deleteError;
      }

      setMethods(
        (previous) =>
          previous.filter(
            (item) =>
              item.method_id !==
              method.method_id
          )
      );

      setNotice(
        `${method.name} deleted successfully.`
      );

    } catch (err) {
      console.error(
        "Delete failed:",
        err
      );

      setError(
        `Could not delete payment method: ${
          err?.message ||
          "Unknown error"
        }`
      );
    }
  }

  /*
  |--------------------------------------------------------------------------
  | JSX
  |--------------------------------------------------------------------------
  */

  return (
    <div className="admin-payment-page">

      {/* =========================================================
          HEADER
      ========================================================= */}

      <header className="admin-payment-header">

        <div>
          <div className="admin-payment-label">
            ADMIN PANEL
          </div>

          <h1>
            Payment Methods
          </h1>

          <p>
            Manage customer deposit
            payment details.
          </p>
        </div>

        <button
          type="button"
          className="add-method-button"
          onClick={openAdd}
        >
          + Add Payment Method
        </button>

      </header>

      {/* =========================================================
          ERROR
      ========================================================= */}

      {error && (
        <div className="admin-alert error">

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

      {/* =========================================================
          SUCCESS
      ========================================================= */}

      {notice && (
        <div className="admin-alert success">

          <span>✓</span>

          <div>
            {notice}
          </div>

          <button
            type="button"
            onClick={() =>
              setNotice("")
            }
          >
            ×
          </button>

        </div>
      )}

      {/* =========================================================
          EXCHANGE RATE
      ========================================================= */}

      <section className="exchange-card">

        <div className="exchange-left">

          <div className="section-kicker">
            CRYPTO EXCHANGE RATE
          </div>

          <h2>
            USDT / NPR
          </h2>

          <p>
            This rate is automatically
            used by the customer
            Deposit page for Tether.
          </p>

        </div>

        <div className="exchange-control">

          <label>
            1 USDT =
          </label>

          <input
            type="number"
            step="any"
            value={rateInput}
            onChange={(event) =>
              setRateInput(
                event.target.value
              )
            }
          />

          <span>
            NPR
          </span>

          <button
            type="button"
            onClick={saveRate}
          >
            Save Rate
          </button>

        </div>

      </section>

      {/* =========================================================
          TOOLBAR
      ========================================================= */}

      <div className="payment-toolbar">

        <div className="filter-tabs">

          {[
            "All",
            "Local Payment",
            "Cryptocurrency",
          ].map(
            (item) => (
              <button
                key={item}
                type="button"
                className={
                  filter === item
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setFilter(
                    item
                  )
                }
              >
                {item}
              </button>
            )
          )}

        </div>

        <button
          type="button"
          className="refresh-button"
          onClick={() => {
            refreshMethods();
            refreshRate();
          }}
          disabled={loading}
        >
          {loading
            ? "Loading..."
            : "↻ Refresh"}
        </button>

      </div>

      {/* =========================================================
          METHODS
      ========================================================= */}

      <section className="methods-section">

        <div className="methods-heading">

          <div>

            <div className="section-kicker">
              PAYMENT CONFIGURATION
            </div>

            <h2>
              Payment Methods
            </h2>

          </div>

          <span className="method-count">
            {filteredMethods.length} methods
          </span>

        </div>

        {loading ? (

          <div className="loading-card">

            <div className="spinner"></div>

            <span>
              Loading payment methods...
            </span>

          </div>

        ) : (

          <div className="method-grid">

            {filteredMethods.map(
              (method) => {

                const isDefault =
                  DEFAULT_METHODS.some(
                    (item) =>
                      item.method_id ===
                      method.method_id
                  );

                return (
                  <article
                    className={
                      `method-card ${
                        !method.enabled
                          ? "disabled"
                          : ""
                      }`
                    }
                    key={
                      method.method_id
                    }
                  >

                    {/* CARD TOP */}

                    <div className="method-card-top">

                      <div
                        className="method-icon"
                        style={{
                          background:
                            method.color ||
                            "#2563eb",
                        }}
                      >
                        {method.icon ||
                          "?"}
                      </div>

                      <div className="method-info">

                        <div className="method-name-line">

                          <h3>
                            {method.name}
                          </h3>

                          {method.recommended && (
                            <span className="recommended">
                              RECOMMENDED
                            </span>
                          )}

                        </div>

                        <p>
                          {method.category}

                          {method.network
                            ? ` • ${method.network}`
                            : ""}
                        </p>

                      </div>

                      <button
                        type="button"
                        className={
                          `status-toggle ${
                            method.enabled
                              ? "on"
                              : "off"
                          }`
                        }
                        onClick={() =>
                          toggleMethod(
                            method
                          )
                        }
                      >
                        {method.enabled
                          ? "ON"
                          : "OFF"}
                      </button>

                    </div>

                    {/* PREVIEW */}

                    <div className="method-preview">

                      {method.category ===
                      "Local Payment" ? (

                        <>
                          <div>

                            <span>
                              Account
                            </span>

                            <strong>
                              {method.account_name ||
                                "Not configured"}
                            </strong>

                          </div>

                          <div>

                            <span>
                              Number
                            </span>

                            <strong>
                              {method.account_number ||
                                "Not configured"}
                            </strong>

                          </div>

                        </>

                      ) : (

                        <>
                          <div>

                            <span>
                              Network
                            </span>

                            <strong>
                              {method.network ||
                                "Not configured"}
                            </strong>

                          </div>

                          <div>

                            <span>
                              Wallet
                            </span>

                            <strong>
                              {method.wallet_address
                                ? `${method.wallet_address.slice(
                                    0,
                                    10
                                  )}...`
                                : "Not configured"}
                            </strong>

                          </div>

                        </>

                      )}

                    </div>

                    {/* CARD BOTTOM */}

                    <div className="method-card-bottom">

                      <div className="method-limits">

                        <span>
                          Min
                        </span>

                        <strong>
                          {method.min_amount ??
                            "—"}
                        </strong>

                        <span>
                          Max
                        </span>

                        <strong>
                          {method.max_amount ??
                            "—"}
                        </strong>

                      </div>

                      <div className="method-actions">

                        <button
                          type="button"
                          className="edit-button"
                          onClick={() =>
                            openEdit(
                              method
                            )
                          }
                        >
                          Edit
                        </button>

                        {!isDefault && (
                          <button
                            type="button"
                            className="delete-button"
                            onClick={() =>
                              deleteMethod(
                                method
                              )
                            }
                          >
                            Delete
                          </button>
                        )}

                      </div>

                    </div>

                  </article>
                );
              }
            )}

          </div>

        )}

      </section>

      {/* =========================================================
          EDITOR MODAL
      ========================================================= */}

      {showEditor && (

        <div
          className="payment-editor-overlay"
          onClick={closeEditor}
        >

          <div
            className="payment-editor"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* EDITOR HEADER */}

            <div className="editor-header">

              <div>

                <div className="section-kicker">
                  PAYMENT CONFIGURATION
                </div>

                <h2>
                  {editingMethod
                    ? "Edit Payment Method"
                    : "Add Payment Method"}
                </h2>

                <p>
                  These details are shown
                  on the customer Deposit
                  page.
                </p>

              </div>

              <button
                type="button"
                className="editor-close"
                onClick={closeEditor}
                disabled={saving}
              >
                ×
              </button>

            </div>

            {/* FORM */}

            <form
              className="payment-form"
              onSubmit={
                saveMethod
              }
            >

              {/* =================================================
                  BASIC INFORMATION
              ================================================= */}

              <div className="form-section">

                <div className="form-section-title">
                  Basic Information
                </div>

                <div className="form-grid">

                  {/* METHOD ID */}

                  <div className="form-field">

                    <label>
                      Method ID
                    </label>

                    <input
                      type="text"
                      value={
                        form.method_id
                      }
                      onChange={(
                        event
                      ) =>
                        updateField(
                          "method_id",
                          event.target
                            .value
                        )
                      }
                      placeholder="esewa, khalti, bitcoin"
                      disabled={
                        Boolean(
                          editingMethod
                        )
                      }
                    />

                    <small>
                      Unique ID used by
                      the application.
                    </small>

                  </div>

                  {/* NAME */}

                  <div className="form-field">

                    <label>
                      Method Name
                    </label>

                    <input
                      type="text"
                      value={
                        form.name
                      }
                      onChange={(
                        event
                      ) =>
                        updateField(
                          "name",
                          event.target
                            .value
                        )
                      }
                      placeholder="eSewa"
                    />

                  </div>

                  {/* CATEGORY */}

                  <div className="form-field">

                    <label>
                      Category
                    </label>

                    <select
                      value={
                        form.category
                      }
                      onChange={(
                        event
                      ) =>
                        updateField(
                          "category",
                          event.target
                            .value
                        )
                      }
                    >

                      <option value="Local Payment">
                        Local Payment
                      </option>

                      <option value="Cryptocurrency">
                        Cryptocurrency
                      </option>

                    </select>

                  </div>

                  {/* ICON */}

                  <div className="form-field">

                    <label>
                      Icon
                    </label>

                    <input
                      type="text"
                      value={
                        form.icon
                      }
                      onChange={(
                        event
                      ) =>
                        updateField(
                          "icon",
                          event.target
                            .value
                        )
                      }
                      placeholder="e"
                    />

                  </div>

                  {/* COLOR */}

                  <div className="form-field">

                    <label>
                      Icon Background Color
                    </label>

                    <div className="color-input">

                      <input
                        type="color"
                        value={
                          form.color ||
                          "#2563eb"
                        }
                        onChange={(
                          event
                        ) =>
                          updateField(
                            "color",
                            event.target
                              .value
                          )
                        }
                      />

                      <input
                        type="text"
                        value={
                          form.color
                        }
                        onChange={(
                          event
                        ) =>
                          updateField(
                            "color",
                            event.target
                              .value
                          )
                        }
                      />

                    </div>

                  </div>

                  {/* CHECKBOXES */}

                  <div className="form-checks">

                    <label className="checkbox-row">

                      <input
                        type="checkbox"
                        checked={Boolean(
                          form.enabled
                        )}
                        onChange={(
                          event
                        ) =>
                          updateField(
                            "enabled",
                            event.target
                              .checked
                          )
                        }
                      />

                      <span>
                        Payment method enabled
                      </span>

                    </label>

                    <label className="checkbox-row">

                      <input
                        type="checkbox"
                        checked={Boolean(
                          form.recommended
                        )}
                        onChange={(
                          event
                        ) =>
                          updateField(
                            "recommended",
                            event.target
                              .checked
                          )
                        }
                      />

                      <span>
                        Show RECOMMENDED badge
                      </span>

                    </label>

                  </div>

                </div>

              </div>

              {/* =================================================
                  LOCAL PAYMENT
              ================================================= */}

              {form.category ===
                "Local Payment" && (

                <div className="form-section">

                  <div className="form-section-title">
                    Local Payment Details
                  </div>

                  <div className="form-grid">

                    <div className="form-field">

                      <label>
                        Account Name
                      </label>

                      <input
                        type="text"
                        value={
                          form.account_name
                        }
                        onChange={(
                          event
                        ) =>
                          updateField(
                            "account_name",
                            event.target
                              .value
                          )
                        }
                        placeholder="Payment account holder name"
                      />

                    </div>

                    <div className="form-field">

                      <label>
                        Account Number
                      </label>

                      <input
                        type="text"
                        value={
                          form.account_number
                        }
                        onChange={(
                          event
                        ) =>
                          updateField(
                            "account_number",
                            event.target
                              .value
                          )
                        }
                        placeholder="Payment account number"
                      />

                    </div>

                    <div className="form-field">

                      <label>
                        Bank Name
                      </label>

                      <input
                        type="text"
                        value={
                          form.bank_name
                        }
                        onChange={(
                          event
                        ) =>
                          updateField(
                            "bank_name",
                            event.target
                              .value
                          )
                        }
                        placeholder="Only required for bank transfer"
                      />

                    </div>

                    <div className="form-field">

                      <label>
                        Branch
                      </label>

                      <input
                        type="text"
                        value={
                          form.branch
                        }
                        onChange={(
                          event
                        ) =>
                          updateField(
                            "branch",
                            event.target
                              .value
                          )
                        }
                        placeholder="Bank branch"
                      />

                    </div>

                  </div>

                </div>
              )}

              {/* =================================================
                  CRYPTOCURRENCY
              ================================================= */}

              {form.category ===
                "Cryptocurrency" && (

                <div className="form-section">

                  <div className="form-section-title">
                    Cryptocurrency Details
                  </div>

                  <div className="form-grid">

                    <div className="form-field">

                      <label>
                        Network
                      </label>

                      <input
                        type="text"
                        value={
                          form.network
                        }
                        onChange={(
                          event
                        ) =>
                          updateField(
                            "network",
                            event.target
                              .value
                          )
                        }
                        placeholder="TRON, TON, BSC, Ethereum..."
                      />

                    </div>

                    <div className="form-field full">

                      <label>
                        Wallet Address
                      </label>

                      <input
                        type="text"
                        value={
                          form.wallet_address
                        }
                        onChange={(
                          event
                        ) =>
                          updateField(
                            "wallet_address",
                            event.target
                              .value
                          )
                        }
                        placeholder="Paste the real wallet address"
                      />

                      <small>
                        Never enter a generated
                        or fake wallet address.
                      </small>

                    </div>

                  </div>

                </div>
              )}

              {/* =================================================
                  QR CODE
              ================================================= */}

              <div className="form-section">

                <div className="form-section-title">
                  QR Code
                </div>

                <div className="form-field">

                  <label>
                    QR Image URL
                  </label>

                  <input
                    type="url"
                    value={
                      form.qr_image
                    }
                    onChange={(
                      event
                    ) =>
                      updateField(
                        "qr_image",
                        event.target
                          .value
                      )
                    }
                    placeholder="https://example.com/qr.png"
                  />

                  <small>
                    Paste a publicly accessible
                    image URL.
                  </small>

                </div>

                {form.qr_image && (

                  <div className="qr-preview">

                    <img
                      src={
                        form.qr_image
                      }
                      alt="Payment QR preview"
                      onError={(
                        event
                      ) => {
                        event.currentTarget.style.display =
                          "none";
                      }}
                    />

                  </div>

                )}

              </div>

              {/* =================================================
                  LIMITS
              ================================================= */}

              <div className="form-section">

                <div className="form-section-title">
                  Deposit Limits
                </div>

                <div className="form-grid">

                  <div className="form-field">

                    <label>
                      Minimum Amount
                    </label>

                    <input
                      type="number"
                      step="any"
                      value={
                        form.min_amount
                      }
                      onChange={(
                        event
                      ) =>
                        updateField(
                          "min_amount",
                          event.target
                            .value
                        )
                      }
                      placeholder="500"
                    />

                  </div>

                  <div className="form-field">

                    <label>
                      Maximum Amount
                    </label>

                    <input
                      type="number"
                      step="any"
                      value={
                        form.max_amount
                      }
                      onChange={(
                        event
                      ) =>
                        updateField(
                          "max_amount",
                          event.target
                            .value
                        )
                      }
                      placeholder="25000"
                    />

                  </div>

                </div>

              </div>

              {/* =================================================
                  INSTRUCTIONS
              ================================================= */}

              <div className="form-section">

                <div className="form-section-title">
                  Payment Instructions
                </div>

                <div className="form-field">

                  <label>
                    Customer Instructions
                  </label>

                  <textarea
                    rows="5"
                    value={
                      form.instructions
                    }
                    onChange={(
                      event
                    ) =>
                      updateField(
                        "instructions",
                        event.target
                          .value
                      )
                    }
                    placeholder="Instructions shown to customers..."
                  />

                </div>

              </div>

              {/* =================================================
                  ACTIONS
              ================================================= */}

              <div className="editor-actions">

                <button
                  type="button"
                  className="cancel-button"
                  onClick={
                    closeEditor
                  }
                  disabled={
                    saving
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-button"
                  disabled={
                    saving
                  }
                >
                  {saving
                    ? "SAVING..."
                    : "SAVE PAYMENT DETAILS"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}

export default AdminPaymentMethods;