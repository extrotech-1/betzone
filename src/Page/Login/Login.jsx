import "./Login.css";

function Login({ onLogin, onRegister }) {
  function handleSubmit(e) {
    e.preventDefault();
    onLogin();
  }

  return (
    <div className="login-page">
      <div className="login-box">

        <h1>Welcome Back</h1>

        <p>Login to your account</p>

        <button type="button" className="google-btn">
          Continue with Google
        </button>

        <div className="divider">
          <span>OR</span>
        </div>

        <form onSubmit={handleSubmit}>

          <label htmlFor="phone">Phone Number</label>

          <input
            id="phone"
            type="tel"
            placeholder="Enter phone number"
            required
          />

          <label htmlFor="password">Password</label>

          <input
            id="password"
            type="password"
            placeholder="Enter password"
            required
          />

          <button type="submit" className="login-btn">
            Login
          </button>

        </form>

        <p className="register-text">
          Don't have an account?
          <button type="button" onClick={onRegister}>
            Register
          </button>
        </p>

      </div>
    </div>
  );
}

export default Login;