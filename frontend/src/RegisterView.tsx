import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function RegisterView() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    role: "User",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });

  const [error, setError] = useState("");

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password.length < 6) {
      setError("Hasło musi mieć minimum 6 znaków.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Hasła nie są takie same.");
      return;
    }

    if (!form.acceptTerms) {
      setError("Musisz zaakceptować regulamin.");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          company: form.company,
          role: form.role,
          password: form.password,
          confirmPassword: form.confirmPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(typeof data === "string" ? data : "Błąd rejestracji.");
        return;
      }

      // zapis zalogowanego użytkownika lokalnie po udanej rejestracji
      localStorage.setItem("loggedUser", JSON.stringify(data));

      navigate("/");
    } catch (err) {
      setError("Nie udało się połączyć z serwerem.");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Rejestracja</h2>

        <form onSubmit={handleRegister}>
          <label>Imię</label>
          <input
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            required
          />

          <label>Nazwisko</label>
          <input
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            required
          />

          <label>Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <label>Organizacja / Firma</label>
          <input
            name="company"
            value={form.company}
            onChange={handleChange}
            required
          />

          <label>Rola</label>
          <select name="role" value={form.role} onChange={handleChange}>
            <option value="User">Użytkownik</option>
            <option value="SecurityOfficer">Właściciel SZBI</option>
            <option value="Auditor">Audytor</option>
            <option value="Admin">Administrator</option>
          </select>

          <label>Hasło</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <label>Powtórz hasło</label>
          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />

          <div style={{ marginTop: "0.75rem" }}>
            <input
              type="checkbox"
              name="acceptTerms"
              checked={form.acceptTerms}
              onChange={handleChange}
            />
            <span style={{ marginLeft: "0.5rem" }}>
              Akceptuję regulamin i politykę prywatności
            </span>
          </div>

          {error && <p style={{ color: "red" }}>{error}</p>}

          <button
            type="submit"
            className="btn-primary"
            style={{ marginTop: "1rem" }}
          >
            Zarejestruj się
          </button>
        </form>
      </div>
    </div>
  );
}