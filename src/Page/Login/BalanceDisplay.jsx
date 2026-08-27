import { useEffect, useState } from "react";

function BalanceDisplay() {
  const [balance, setBalance] = useState(() => {
    const saved = Number(localStorage.getItem("userBalance") || "0");
    return Number.isFinite(saved) ? saved : 0;
  });

  useEffect(() => {
    const updateBalance = () => {
      const saved = Number(
        localStorage.getItem("userBalance") || "0"
      );

      setBalance(
        Number.isFinite(saved) ? saved : 0
      );
    };

    updateBalance();

    window.addEventListener(
      "balance-updated",
      updateBalance
    );

    window.addEventListener(
      "storage",
      updateBalance
    );

    // Extra safety: check every second
    const timer = setInterval(
      updateBalance,
      1000
    );

    return () => {
      window.removeEventListener(
        "balance-updated",
        updateBalance
      );

      window.removeEventListener(
        "storage",
        updateBalance
      );

      clearInterval(timer);
    };
  }, []);

  return (
    <div className="global-balance">
      <span className="global-balance-label">
        Balance
      </span>

      <strong>
        NPR{" "}
        {balance.toLocaleString("en-NP", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </strong>
    </div>
  );
}

export default BalanceDisplay;