import { useState } from "react";
import apiClient from "../services/api";

function Register() {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        try {
            await apiClient.post("/api/auth/register", {
                full_name: fullName,
                email,
                password,
            });

            setSuccess("Registration successful! You can now log in.");

            setFullName("");
            setEmail("");
            setPassword("");

        } catch (err) {
            setError(
                err.response?.data?.message ?? "Could not connect to the server."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
  <div className="auth-container">
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>Create an Account</h2>
      <p>Join SkillBridge and start sharing your skills.</p>

      <label className="auth-label">
        Full name
        <input
          className="auth-input"
          type="text"
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
          required
        />
      </label>

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
          minLength={8}
          maxLength={72}
          required
        />
      </label>

      <button className="auth-button" type="submit" disabled={loading}>
        {loading ? "Creating account..." : "Create account"}
      </button>

      {success && <p className="auth-success" role="status">{success}</p>}
      {error && <p className="auth-error" role="alert">{error}</p>}
    </form>
  </div>
);
}

export default Register;
