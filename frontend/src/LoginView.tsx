import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function LoginView() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      setError("Użytkownik nie istnieje.");
      return;
    }

    const user = JSON.parse(storedUser);

    if (user.email !== email || user.password !== password) {
      setError("Nieprawidłowy email lub hasło.");
      return;
    }

    localStorage.setItem("isLoggedIn", "true");
    navigate("/");
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Logowanie</h2>

        <form onSubmit={handleLogin}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Hasło</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p style={{ color: "red" }}>{error}</p>}

          <button type="submit" className="btn-primary">
            Zaloguj się
          </button>
        </form>
      </div>
    </div>
  );
}