import { supabase } from "../../supabaseClient.js";
import "./Login.css";

function Login({ onRegister }) {
  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin,
        },
      });

      if (error) {
        console.error("GOOGLE LOGIN ERROR:", error);
        alert(error.message);
      }
    } catch (error) {
      console.error("GOOGLE LOGIN ERROR:", error);
      alert("Google login failed.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">

        <div className="register-logo">
          BET<span>ZONE</span>
        </div>

        <h1>Welcome Back</h1>

        <p>Login to your account</p>

        <button
          type="button"
          className="google-btn"
          onClick={handleGoogleLogin}
        >
          Continue with Google
        </button>

        <p className="register-text">
          Don't have an account?

          <button
            type="button"
            onClick={onRegister}
          >
            Register
          </button>
        </p>

      </div>
    </div>
  );
}

export default Login;