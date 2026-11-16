import { useState } from "react";
import axios from "axios";

function Register({ onRegister }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/register",
        { full_name: fullName, email, password }
      );
      onRegister(response.data.token);
    } catch (err) {
      setError(
        err.response?.data?.message ?? "Could not connect to the server."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Full name
        <input
          type="text"
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
          required
        />
      </label>

      <label>
        Email
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
      </label>

      <label>
        Password (8-72 bytes)
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          minLength={8}
          maxLength={72}
          required
        />
      </label>

      <button type="submit" disabled={loading}>
        {loading ? "Creating account..." : "Create account"}
      </button>

      {error && <p role="alert">{error}</p>}
    </form>
  );
}

export default Register;
