import { useState } from "react";
import "./Register.css";

function Register({ onRegister, onLogin }) {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [terms, setTerms] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();

    if (!phone || !password || !confirmPassword) {
      alert("Please fill in all required fields.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    if (!terms) {
      alert("Please accept the Terms and Conditions.");
      return;
    }

    onRegister();
  }

  return (
    <div className="register-page">
      <div className="register-card">

        <div className="register-logo">
          BET<span>ZONE</span>
        </div>

        <h1>Create Account</h1>

        <p className="register-subtitle">
          Register your new account
        </p>

        <form onSubmit={handleSubmit}>

          <label>Phone Number</label>

          <div className="register-phone">
            <span>+977</span>

            <input
              type="tel"
              placeholder="98XXXXXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <label>Password</label>

          <input
            className="register-input"
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <label>Confirm Password</label>

          <input
            className="register-input"
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <label>Promo Code <span>(Optional)</span></label>

          <input
            className="register-input"
            type="text"
            placeholder="Enter promo code"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
          />

          <label className="terms-row">
            <input
              type="checkbox"
              checked={terms}
              onChange={(e) => setTerms(e.target.checked)}
            />

            <span>
              I agree to the Terms and Conditions
            </span>
          </label>

          <button
            className="register-btn"
            type="submit"
          >
            CREATE ACCOUNT
          </button>

        </form>

        <div className="login-link">
          Already have an account?

          <button
            type="button"
            onClick={onLogin}
          >
            Login
          </button>
        </div>

      </div>
    </div>
  );
}

export default Register;