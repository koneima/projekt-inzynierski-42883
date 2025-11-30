import { FormEvent, useEffect, useState } from "react";

export type Control = {
  id: number;
  annexId: string;
  name: string;
  description: string;
  objective: string;
  controlType: string;
  category: string;
  owner: string;
  implementationStatus: string;
  frequency: string;
  evidenceLocation: string;
  relatedRisks: string;
  effectiveness: string;
  lastTestDate?: string;
  nextReviewDate?: string;
  notes: string;
};

const controlTypes = ["Organizacyjna", "Techniczna", "Fizyczna"];
const categories = ["Prewencyjna", "Detekcyjna", "Korygująca"];
const implementationStatuses = ["PLANNED", "IN_PLACE", "NOT_APPLICABLE"];
const frequencies = [
  "Ciągła",
  "Dzienna",
  "Tygodniowa",
  "Miesięczna",
  "Kwartalna",
  "Roczna",
  "Po zmianie",
];
const effectivenessOptions = [
  "EFFECTIVE",
  "PARTIALLY_EFFECTIVE",
  "INEFFECTIVE",
];

function statusColor(status: string) {
  switch (status) {
    case "IN_PLACE":
      return "#bbf7d0"; // zielony
    case "PLANNED":
      return "#fef9c3"; // żółty
    case "NOT_APPLICABLE":
      return "#e5e7eb"; // szary
    default:
      return "transparent";
  }
}

function effectivenessColor(eff: string) {
  switch (eff) {
    case "EFFECTIVE":
      return "#bbf7d0";
    case "PARTIALLY_EFFECTIVE":
      return "#fef9c3";
    case "INEFFECTIVE":
      return "#fecaca";
    default:
      return "transparent";
  }
}

export function ControlsView() {
  const [controls, setControls] = useState<Control[]>([]);
  const [loading, setLoading] = useState(false);

  // pola formularza
  const [annexId, setAnnexId] = useState("");
  const [name, setName] = useState("");
  const [objective, setObjective] = useState("");
  const [description, setDescription] = useState("");
  const [controlType, setControlType] = useState(controlTypes[0]);
  const [category, setCategory] = useState(categories[0]);
  const [owner, setOwner] = useState("");
  const [implementationStatus, setImplementationStatus] = useState("PLANNED");
  const [frequency, setFrequency] = useState("Miesięczna");
  const [evidenceLocation, setEvidenceLocation] = useState("");
  const [relatedRisks, setRelatedRisks] = useState("");
  const [effectiveness, setEffectiveness] = useState("EFFECTIVE");
  const [lastTestDate, setLastTestDate] = useState("");
  const [nextReviewDate, setNextReviewDate] = useState("");
  const [notes, setNotes] = useState("");

  const loadControls = () => {
    setLoading(true);
    fetch("http://localhost:8080/api/controls")
      .then((res) => res.json())
      .then((data) => setControls(data))
      .catch((err) => {
        console.error("Błąd przy pobieraniu kontroli:", err);
        // alert("Nie udało się pobrać listy kontroli");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadControls();
  }, []);

  const handleAddControl = async (e: FormEvent) => {
    e.preventDefault();

    const body = {
      annexId,
      name,
      description,
      objective,
      controlType,
      category,
      owner: owner || "Nieprzypisany",
      implementationStatus,
      frequency,
      evidenceLocation,
      relatedRisks,
      effectiveness,
      lastTestDate: lastTestDate || null,
      nextReviewDate: nextReviewDate || null,
      notes,
    };

    try {
      const res = await fetch("http://localhost:8080/api/controls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        throw new Error("Nie udało się dodać kontroli");
      }

      const created: Control = await res.json();
      setControls((prev) => [...prev, created]);

      // reset formularza
      setAnnexId("");
      setName("");
      setObjective("");
      setDescription("");
      setControlType(controlTypes[0]);
      setCategory(categories[0]);
      setOwner("");
      setImplementationStatus("PLANNED");
      setFrequency("Miesięczna");
      setEvidenceLocation("");
      setRelatedRisks("");
      setEffectiveness("EFFECTIVE");
      setLastTestDate("");
      setNextReviewDate("");
      setNotes("");
    } catch (err) {
      console.error(err);
      alert("Wystąpił błąd przy dodawaniu kontroli");
    }
  };

  return (
    <div>
      <h2>Rejestr kontroli</h2>
      <p style={{ color: "#E5E7EBFF", marginBottom: "1rem" }}>
        Rejestr kontroli bezpieczeństwa informacji powiązanych z załącznikiem A
        ISO 27001. Dla każdej kontroli przechowywane są informacje o celu,
        typie, właścicielu, statusie wdrożenia, częstotliwości oraz skuteczności.
      </p>

      {/* FORMULARZ */}
     <section
       style={{
         marginTop: "1rem",
         padding: "1.5rem 2rem",        // większy padding = więcej miejsca z boków
         border: "1px solid #4b5563",
         borderRadius: "10px",
         backgroundColor: "#111245",
       }}
     >

        <h3>Dodaj nową kontrolę</h3>
        <form onSubmit={handleAddControl}>
          {/* Identyfikator + nazwa */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 2.5fr",
              columnGap: "1.5rem",
              rowGap: "0.75rem",
              marginTop: "0.75rem",
            }}
          >
            <div>
              <label>
                Identyfikator z załącznika A:
                <input
                  value={annexId}
                  onChange={(e) => setAnnexId(e.target.value)}
                  placeholder="np. A.5.7"
                  required
                />
              </label>
            </div>

            <div>
              <label>
                Nazwa kontroli:
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="np. Zarządzanie dostępem do systemu CRM"
                  required
                />
              </label>
            </div>
          </div>

          {/* Cel + opis */}
          <div style={{ marginTop: "0.75rem" }}>
            <label>
              Cel kontroli:
              <input
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                placeholder="np. Ograniczenie dostępu do danych klientów do upoważnionych osób"
              />
            </label>
          </div>

          <div style={{ marginTop: "0.75rem" }}>
            <label>
              Opis:
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{
                  minHeight: "80px",
                }}
                required
              />
            </label>
          </div>

          {/* Typ, kategoria, właściciel */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 2fr",
              columnGap: "0.55rem",
              rowGap: "0.55rem",
              marginTop: "0.75rem",
            }}
          >
            <div>
              <label>
                Typ:
                <select
                  value={controlType}
                  onChange={(e) => setControlType(e.target.value)}
                >
                  {controlTypes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div>
              <label>
                Kategoria:
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div>
              <label>
                Właściciel kontroli:
                <input
                  value={owner}
                  onChange={(e) => setOwner(e.target.value)}
                  placeholder="np. Kierownik działu IT"
                />
              </label>
            </div>
          </div>

          {/* Status implementacji, częstotliwość, skuteczność */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.5fr 1.5fr 1.5fr",
              columnGap: "0.55rem",
              rowGap: "0.75rem",
              marginTop: "0.75rem",
            }}
          >
            <div>
              <label>
                Status wdrożenia:
                <select
                  value={implementationStatus}
                  onChange={(e) => setImplementationStatus(e.target.value)}
                >
                  {implementationStatuses.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div>
              <label>
                Częstotliwość:
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                >
                  {frequencies.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div>
              <label>
                Skuteczność:
                <select
                  value={effectiveness}
                  onChange={(e) => setEffectiveness(e.target.value)}
                >
                  {effectivenessOptions.map((e) => (
                    <option key={e} value={e}>
                      {e}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          {/* Dowody, powiązane ryzyka */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.5fr 1.5fr",
              columnGap: "1.5rem",
              rowGap: "0.75rem",
              marginTop: "0.75rem",
            }}
          >
            <div>
              <label>
                Lokalizacja dowodów:
                <input
                  value={evidenceLocation}
                  onChange={(e) => setEvidenceLocation(e.target.value)}
                  placeholder="np. SharePoint / folder \\serwer\\dowody\\kontrole"
                />
              </label>
            </div>

            <div>
              <label>
                Powiązane ryzyka:
                <input
                  value={relatedRisks}
                  onChange={(e) => setRelatedRisks(e.target.value)}
                  placeholder="np. R-001, R-003"
                />
              </label>
            </div>
          </div>

          {/* Daty */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              columnGap: "1.5rem",
              rowGap: "0.75rem",
              marginTop: "0.75rem",
            }}
          >
            <div>
              <label>
                Data ostatniego testu:
                <input
                  type="date"
                  value={lastTestDate}
                  onChange={(e) => setLastTestDate(e.target.value)}
                />
              </label>
            </div>

            <div>
              <label>
                Planowana data przeglądu:
                <input
                  type="date"
                  value={nextReviewDate}
                  onChange={(e) => setNextReviewDate(e.target.value)}
                />
              </label>
            </div>
          </div>

          {/* Notatki */}
          <div style={{ marginTop: "0.75rem", marginBottom: "1rem" }}>
            <label>
              Dodatkowe uwagi:
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                style={{ minHeight: "60px" }}
              />
            </label>
          </div>

          <button
            type="submit"
            style={{
              padding: "0.5rem 1.2rem",
              cursor: "pointer",
              backgroundColor: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "6px",
            }}
          >
            Zapisz kontrolę
          </button>
        </form>
      </section>

      {/* LISTA KONTROLI */}
      <section
        style={{
          marginTop: "1.5rem",
          padding: "1rem 1.25rem",
          border: "1px solid #4b5563",
          borderRadius: "10px",
          backgroundColor: "#111245",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "0.75rem",
          }}
        >
          <h3>Lista kontroli</h3>
          <button
            type="button"
            onClick={loadControls}
            style={{
              padding: "0.35rem 0.9rem",
              cursor: "pointer",
              borderRadius: "6px",
              border: "1px solid #111245",
              background: "transparent",
              color: "#e5e7eb",
            }}
          >
            Odśwież
          </button>
        </div>

        {loading && <p>Ładowanie...</p>}

        {controls.length === 0 && !loading ? (
          <p>Brak kontroli w rejestrze.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #4b5563" }}>
                  <th style={{ textAlign: "left", padding: "0.4rem" }}>A-ID</th>
                  <th style={{ textAlign: "left", padding: "0.4rem" }}>Nazwa</th>
                  <th style={{ textAlign: "left", padding: "0.4rem" }}>Cel</th>
                  <th style={{ textAlign: "left", padding: "0.4rem" }}>
                    Właściciel
                  </th>
                  <th style={{ textAlign: "center", padding: "0.4rem" }}>
                    Status
                  </th>
                  <th style={{ textAlign: "center", padding: "0.4rem" }}>
                    Skuteczność
                  </th>
                  <th style={{ textAlign: "left", padding: "0.4rem" }}>
                    Częstotliwość
                  </th>
                  <th style={{ textAlign: "left", padding: "0.4rem" }}>
                    Nast. przegląd
                  </th>
                </tr>
              </thead>
              <tbody>
                {controls.map((c) => (
                  <tr key={c.id} style={{ borderBottom: "1px solid #1f2937" }}>
                    <td style={{ padding: "0.4rem" }}>{c.annexId}</td>
                    <td style={{ padding: "0.4rem" }}>{c.name}</td>
                    <td style={{ padding: "0.4rem" }}>{c.objective}</td>
                    <td style={{ padding: "0.4rem" }}>{c.owner}</td>
                    <td
                      style={{
                        padding: "0.4rem",
                        textAlign: "center",
                        backgroundColor: statusColor(c.implementationStatus),
                      }}
                    >
                      {c.implementationStatus}
                    </td>
                    <td
                      style={{
                        padding: "0.4rem",
                        textAlign: "center",
                        backgroundColor: effectivenessColor(c.effectiveness),
                      }}
                    >
                      {c.effectiveness}
                    </td>
                    <td style={{ padding: "0.4rem" }}>{c.frequency}</td>
                    <td style={{ padding: "0.4rem" }}>
                      {c.nextReviewDate || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
