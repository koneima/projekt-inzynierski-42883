import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function LoginView() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(typeof data === "string" ? data : "Błąd logowania.");
        return;
      }

      // zapis zalogowanego użytkownika
      localStorage.setItem("loggedUser", JSON.stringify(data));

      navigate("/");
    } catch (err) {
      setError("Nie udało się połączyć z serwerem.");
    }
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