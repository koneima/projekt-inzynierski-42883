import { FormEvent, useEffect, useState } from "react";

type Risk = {
    id: number;
    code: string;
    name: string;
    description: string;
    asset: string;
    category: string;
    owner: string;
    threat: string;
    vulnerability: string;
    likelihood: number;
    impact: number;
    riskLevel: number;
    treatmentOption: string;
    status: string;
    reviewDate?: string;
    dueDate?: string;
};

const categories = [
    "Techniczne",
    "Organizacyjne",
    "Ludzkie",
    "Prawne / zgodność",
    "Fizyczne",
];

const treatmentOptions = ["REDUCE", "ACCEPT", "TRANSFER", "AVOID"];

function getRiskColor(level: number | null | undefined): string {
    if (!level) return "#e5e7eb"; // gray
    if (level <= 4) return "#4ce667"; // green
    if (level <= 9) return "#f6e94d"; // yellow
    return "#ff1515"; // red
}

export function RisksView() {
    const [risks, setRisks] = useState<Risk[]>([]);
    const [loading, setLoading] = useState(false);

    //formularz
    const [code, setCode] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [asset, setAsset] = useState("");
    const [category, setCategory] = useState(categories[0]);
    const [owner, setOwner] = useState("");
    const [threat, setThreat] = useState("");
    const [vulnerability, setVulnerability] = useState("");
    const [likelihood, setLikelihood] = useState(3);
    const [impact, setImpact] = useState(3);
    const [treatmentOption, setTreatmentOption] = useState("REDUCE");
    const [reviewDate, setReviewDate] = useState("");
    const [dueDate, setDueDate] = useState("");

    const loadRisks = () => {
        setLoading(true);
        fetch("http://localhost:8080/api/risks")
            .then((res) => res.json())
            .then((data) => setRisks(data))
            .catch((err) => {
                console.error("Błąd przy pobieraniu ryzyk:", err);
                alert("Nie udało się pobrać listy ryzyk");
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadRisks();
    }, []);

    const handleAddRisk = async (e: FormEvent) => {
        e.preventDefault();

        const body = {
            code,
            name,
            description,
            asset,
            category,
            owner: owner || "Nieprzypisany",
            threat,
            vulnerability,
            likelihood,
            impact,
            treatmentOption,
            status: "OPEN",
            reviewDate: reviewDate || null,
            dueDate: dueDate || null,
        };

        try {
            const res = await fetch("http://localhost:8080/api/risks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            if (!res.ok) {
                throw new Error("Nie udało się dodać ryzyk");
            }

            const created: Risk = await res.json();
            setRisks((prev) => [...prev, created]);

            // reset formularza
            setCode("");
            setName("");
            setDescription("");
            setAsset("");
            setCategory(categories[0]);
            setOwner("");
            setThreat("");
            setVulnerability("");
            setLikelihood(3);
            setImpact(3);
            setTreatmentOption("REDUCE");
            setReviewDate("");
            setDueDate("");
        } catch (err) {
            console.error(err);
            alert("Wystąpił błąd przy dodawaniu ryzyka");
        }
    };

    return (
        <div>
            <h2>Rejestr ryzyk</h2>
            <p style={{ color: "#ffffff", marginBottom: "1rem" }}>
                Rejestr ryzyka bezpieczeństwa informacji zgodny z ISO 27001/27005:
                identyfikacja zasobu, zagrożeń, podatności, ocena i sposób traktowania.
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

            <h3>Dodaj nowe ryzyko</h3>
                <form onSubmit={handleAddRisk}>
                    {/* pierwsza linia: kod + zasób + kategoria */}
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 2fr 1.5fr",
                            gap: "0.75rem",
                            marginTop: "0.75rem",
                        }}
                    >
                        <label>
                            Kod ryzyka:
                            <input
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                placeholder="np. R-001"
                                style={{ width: "100%", padding: "0.35rem", marginTop: "0.2rem" }}
                            />
                        </label>

                        <label>
                            Zasób / system / proces:
                            <input
                                value={asset}
                                onChange={(e) => setAsset(e.target.value)}
                                placeholder="np. System CRM"
                                style={{ width: "100%", padding: "0.35rem", marginTop: "0.2rem" }}
                            />
                        </label>

                        <label>
                            Kategoria:
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                style={{ width: "100%", padding: "0.35rem", marginTop: "0.2rem" }}
                            >
                                {categories.map((c) => (
                                    <option key={c} value={c}>
                                        {c}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>

                    {/* nazwa + opis */}
                    <div style={{ marginTop: "0.75rem" }}>
                        <label>
                            Nazwa ryzyka:
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                style={{ width: "100%", padding: "0.35rem", marginTop: "0.2rem" }}
                                required
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
                                    width: "100%",
                                    padding: "0.35rem",
                                    marginTop: "0.2rem",
                                    minHeight: "80px",
                                }}
                                required
                            />
                        </label>
                    </div>

                    {/* zagrożenie + podatność */}
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            columnGap: "1.5rem",  // wyraźny odstęp między polami
                            rowGap: "0.75rem",
                            marginTop: "1rem",
                            marginBottom: "0.5rem",
                        }}
                    >
                        <div>
                            <label>
                                Zagrożenie:
                                <input
                                    value={threat}
                                    onChange={(e) => setThreat(e.target.value)}
                                    placeholder="np. atak phishingowy"
                                />
                            </label>
                        </div>

                        <div>
                            <label>
                                Podatność / słabość:
                                <input
                                    value={vulnerability}
                                    onChange={(e) => setVulnerability(e.target.value)}
                                    placeholder="np. brak MFA"
                                />
                            </label>
                        </div>
                    </div>

                    {/* właściciel + ocena + treatment */}
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "2fr 1fr 1fr 1.5fr",
                            gap: "1.75rem",
                            marginTop: "0.75rem",
                        }}
                    >
                        <label>
                            Właściciel ryzyka:
                            <input
                                value={owner}
                                onChange={(e) => setOwner(e.target.value)}
                                placeholder="np. Kierownik IT"
                                style={{ width: "100%", padding: "0.35rem", marginTop: "0.2rem" }}
                            />
                        </label>

                        <label>
                            Prawdopodobieństwo (1–5):
                            <input
                                type="number"
                                min={1}
                                max={5}
                                value={likelihood}
                                onChange={(e) => setLikelihood(Number(e.target.value))}
                                style={{ width: "100%", padding: "0.35rem", marginTop: "0.2rem" }}
                            />
                        </label>

                        <label>
                            Wpływ (1–5):
                            <input
                                type="number"
                                min={1}
                                max={5}
                                value={impact}
                                onChange={(e) => setImpact(Number(e.target.value))}
                                style={{ width: "100%", padding: "0.35rem", marginTop: "0.2rem" }}
                            />
                        </label>

                        <label>
                            Sposób traktowania:
                            <select
                                value={treatmentOption}
                                onChange={(e) => setTreatmentOption(e.target.value)}
                                style={{ width: "100%", padding: "0.35rem", marginTop: "0.2rem" }}
                            >
                                {treatmentOptions.map((t) => (
                                    <option key={t} value={t}>
                                        {t}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>

                    {/* daty */}
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: "0.75rem",
                            marginTop: "0.75rem",
                            marginBottom: "1rem",
                        }}
                    >
                        <label>
                            Data ostatniego przeglądu:
                            <input
                                type="date"
                                value={reviewDate}
                                onChange={(e) => setReviewDate(e.target.value)}
                                style={{ width: "100%", padding: "0.35rem", marginTop: "0.2rem" }}
                            />
                        </label>

                        <label>
                            Termin wdrożenia działań:
                            <input
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                style={{ width: "100%", padding: "0.35rem", marginTop: "0.2rem" }}
                            />
                        </label>
                    </div>

                    <button
                        type="submit"
                        style={{
                            padding: "0.5rem 1.2rem",
                            cursor: "pointer",
                            backgroundColor: "#2f33d6",
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                        }}
                    >
                        Zapisz ryzyko
                    </button>
                </form>
            </section>

            {/* LISTA RYZYKA */}
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
                    <h3>Lista ryzyka</h3>
                    <button
                        type="button"
                        onClick={loadRisks}
                        style={{
                            padding: "0.35rem 0.9rem",
                            cursor: "pointer",
                            borderRadius: "6px",
                            border: "1px solid #4b5563",
                            background: "transparent",
                            color: "#e5e7eb",
                        }}
                    >
                        Odśwież
                    </button>
                </div>

                {loading && <p>Ładowanie...</p>}

                {risks.length === 0 && !loading ? (
                    <p>Brak ryzyka w rejestrze.</p>
                ) : (
                    <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                            <tr style={{ borderBottom: "1px solid #4b5563" }}>
                                <th style={{ textAlign: "left", padding: "0.4rem" }}>Kod</th>
                                <th style={{ textAlign: "left", padding: "0.4rem" }}>Nazwa</th>
                                <th style={{ textAlign: "left", padding: "0.4rem" }}>Zasób</th>
                                <th style={{ textAlign: "left", padding: "0.4rem" }}>Kategoria</th>
                                <th style={{ textAlign: "center", padding: "0.4rem" }}>
                                    P
                                </th>
                                <th style={{ textAlign: "center", padding: "0.4rem" }}>
                                    I
                                </th>
                                <th style={{ textAlign: "center", padding: "0.4rem" }}>
                                    Poziom
                                </th>
                                <th style={{ textAlign: "left", padding: "0.4rem" }}>
                                    Traktowanie
                                </th>
                                <th style={{ textAlign: "left", padding: "0.4rem" }}>
                                    Status
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            {risks.map((r) => (
                                <tr key={r.id} style={{ borderBottom: "1px solid #1f2937" }}>
                                    <td style={{ padding: "0.4rem" }}>{r.code}</td>
                                    <td style={{ padding: "0.4rem" }}>{r.name}</td>
                                    <td style={{ padding: "0.4rem" }}>{r.asset}</td>
                                    <td style={{ padding: "0.4rem" }}>{r.category}</td>
                                    <td style={{ padding: "0.4rem", textAlign: "center" }}>
                                        {r.likelihood}
                                    </td>
                                    <td style={{ padding: "0.4rem", textAlign: "center" }}>
                                        {r.impact}
                                    </td>
                                    <td
                                        style={{
                                            padding: "0.4rem",
                                            textAlign: "center",
                                            backgroundColor: getRiskColor(r.riskLevel),
                                            fontWeight: 600,
                                        }}
                                    >
                                        {r.riskLevel}
                                    </td>
                                    <td style={{ padding: "0.4rem" }}>{r.treatmentOption}</td>
                                    <td style={{ padding: "0.4rem" }}>{r.status}</td>
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
