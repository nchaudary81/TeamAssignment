import { useState } from "react";
// import axios from "axios";
import { useNavigate } from "react-router-dom";
import apiClient from "../services/api";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await apiClient.post("/api/auth/login", {
        email,
        password,
      });
      onLogin(response.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ?? "Could not connect to the server.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
  <div className="auth-container">
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>Welcome Back!</h2>
      <p>Log in to your SkillBridge account.</p>

      <label className="auth-label">
        Email
        <input
          className="auth-input"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
      </label>

      <label className="auth-label">
        Password
        <input
          className="auth-input"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
      </label>

      <button className="auth-button" type="submit" disabled={loading}>
        {loading ? "Logging in..." : "Log in"}
      </button>

      {error && <p className="auth-error" role="alert">{error}</p>}
    </form>
  </div>
);
}

export default Login;
