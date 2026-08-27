import { useState } from "react";
import "./Withdrawal.css";

function Withdrawal({ onBack }) {
  const [method, setMethod] = useState("");

  const [amount, setAmount] = useState("");

  const [crypto, setCrypto] = useState("");

  const [network, setNetwork] = useState("");

  const [walletAddress, setWalletAddress] = useState("");

  const [accountName, setAccountName] = useState("");

  const [accountNumber, setAccountNumber] = useState("");

  const [bankName, setBankName] = useState("");

  const [message, setMessage] = useState("");


  const submitWithdrawal = (e) => {
    e.preventDefault();

    setMessage("");

    if (!method) {
      setMessage("Please select a withdrawal method.");
      return;
    }

    if (!amount || Number(amount) <= 0) {
      setMessage("Please enter a valid withdrawal amount.");
      return;
    }


    if (method === "crypto") {
      if (!crypto || !network || !walletAddress.trim()) {
        setMessage(
          "Please complete all crypto withdrawal details."
        );
        return;
      }
    }


    if (method === "local") {
      if (
        !accountName.trim() ||
        !accountNumber.trim()
      ) {
        setMessage(
          "Please enter account name and account number."
        );
        return;
      }
    }


    const existingRequests = JSON.parse(
      localStorage.getItem(
        "withdrawalRequests"
      ) || "[]"
    );


    const newRequest = {
      id: Date.now(),

      amount: Number(amount),

      method:
        method === "crypto"
          ? "Cryptocurrency"
          : "Local Payment",

      type:
        method === "crypto"
          ? "Crypto"
          : "Local Payment",

      cryptocurrency:
        method === "crypto"
          ? crypto
          : "",

      network:
        method === "crypto"
          ? network
          : "",

      walletAddress:
        method === "crypto"
          ? walletAddress.trim()
          : "",

      accountName:
        method === "local"
          ? accountName.trim()
          : "",

      accountNumber:
        method === "local"
          ? accountNumber.trim()
          : "",

      bankName:
        method === "local"
          ? bankName.trim()
          : "",

      status: "Pending",

      createdAt:
        new Date().toISOString(),
    };


    const updatedRequests = [
      newRequest,
      ...existingRequests,
    ];


    localStorage.setItem(
      "withdrawalRequests",
      JSON.stringify(
        updatedRequests
      )
    );


    window.dispatchEvent(
      new Event(
        "withdrawal-request-created"
      )
    );


    setMessage(
      "Withdrawal request submitted successfully."
    );


    setAmount("");

    setCrypto("");

    setNetwork("");

    setWalletAddress("");

    setAccountName("");

    setAccountNumber("");

    setBankName("");
  };


  return (
    <div className="withdrawal-page">

      <header className="withdrawal-header">

        <button
          type="button"
          className="withdrawal-back"
          onClick={onBack}
        >
          ← Back
        </button>

        <div className="withdrawal-logo">
          BET<span>ZONE</span>
        </div>

        <div className="withdrawal-title-small">
          Withdrawal
        </div>

      </header>


      <main className="withdrawal-container">

        <div className="withdrawal-heading">

          <h1>
            Withdraw Funds
          </h1>

          <p>
            Add your withdrawal method
          </p>

        </div>


        <form
          className="withdrawal-form"
          onSubmit={submitWithdrawal}
        >


          {/* METHOD */}

          <section className="withdrawal-section">

            <h2>
              Select Withdrawal Method
            </h2>


            <div className="withdrawal-method-grid">

              <button
                type="button"
                className={
                  method === "local"
                    ? "withdrawal-method selected"
                    : "withdrawal-method"
                }
                onClick={() =>
                  setMethod("local")
                }
              >

                <span className="method-icon">
                  🏦
                </span>

                <span>
                  <strong>
                    Local Payment
                  </strong>

                  <small>
                    eSewa, Khalti or Bank Account
                  </small>
                </span>

                <span>
                  →
                </span>

              </button>


              <button
                type="button"
                className={
                  method === "crypto"
                    ? "withdrawal-method selected"
                    : "withdrawal-method"
                }
                onClick={() =>
                  setMethod("crypto")
                }
              >

                <span className="method-icon">
                  ₿
                </span>

                <span>
                  <strong>
                    Cryptocurrency
                  </strong>

                  <small>
                    Withdraw to your crypto wallet
                  </small>
                </span>

                <span>
                  →
                </span>

              </button>

            </div>

          </section>


          {/* AMOUNT */}

          <section className="withdrawal-section">

            <h2>
              Withdrawal Amount
            </h2>

            <label>
              Amount
            </label>


            <div className="amount-box">

              <span>
                NPR
              </span>

              <input
                type="number"
                min="0"
                step="0.01"
                value={amount}
                onChange={(e) =>
                  setAmount(
                    e.target.value
                  )
                }
                placeholder="Enter withdrawal amount"
              />

            </div>

          </section>


          {/* LOCAL */}

          {method === "local" && (
            <section className="withdrawal-section">

              <h2>
                Local Payment Details
              </h2>


              <label>
                Account Name
              </label>

              <input
                className="withdrawal-input"
                type="text"
                value={accountName}
                onChange={(e) =>
                  setAccountName(
                    e.target.value
                  )
                }
                placeholder="Enter account name"
              />


              <label>
                Account Number
              </label>

              <input
                className="withdrawal-input"
                type="text"
                value={accountNumber}
                onChange={(e) =>
                  setAccountNumber(
                    e.target.value
                  )
                }
                placeholder="Enter account number"
              />


              <label>
                Bank / Wallet Name
              </label>

              <input
                className="withdrawal-input"
                type="text"
                value={bankName}
                onChange={(e) =>
                  setBankName(
                    e.target.value
                  )
                }
                placeholder="eSewa, Khalti, Bank etc."
              />

            </section>
          )}


          {/* CRYPTO */}

          {method === "crypto" && (
            <section className="withdrawal-section">

              <h2>
                Crypto Withdrawal Details
              </h2>


              <label>
                Cryptocurrency
              </label>

              <select
                className="withdrawal-input"
                value={crypto}
                onChange={(e) =>
                  setCrypto(
                    e.target.value
                  )
                }
              >

                <option value="">
                  Select cryptocurrency
                </option>

                <option value="USDT">
                  USDT
                </option>

                <option value="BTC">
                  Bitcoin
                </option>

                <option value="ETH">
                  Ethereum
                </option>

                <option value="TRX">
                  TRON
                </option>

                <option value="LTC">
                  Litecoin
                </option>

                <option value="XRP">
                  XRP
                </option>

              </select>


              <label>
                Network
              </label>

              <select
                className="withdrawal-input"
                value={network}
                onChange={(e) =>
                  setNetwork(
                    e.target.value
                  )
                }
              >

                <option value="">
                  Select network
                </option>

                <option value="TRON">
                  TRON
                </option>

                <option value="BSC">
                  BSC
                </option>

                <option value="Ethereum">
                  Ethereum
                </option>

                <option value="TON">
                  TON
                </option>

              </select>


              <label>
                Wallet Address
              </label>

              <input
                className="withdrawal-input"
                type="text"
                value={walletAddress}
                onChange={(e) =>
                  setWalletAddress(
                    e.target.value
                  )
                }
                placeholder="Enter your wallet address"
              />

            </section>
          )}


          {/* MESSAGE */}

          {message && (
            <div className="withdrawal-message">
              {message}
            </div>
          )}


          {/* SUBMIT */}

          {method && (
            <button
              type="submit"
              className="withdrawal-submit"
            >
              Submit Withdrawal Request
            </button>
          )}

        </form>

      </main>

    </div>
  );
}

export default Withdrawal;