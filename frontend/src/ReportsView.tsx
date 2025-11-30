import { useEffect, useState } from "react";

// Typy tylko z polami potrzebnymi do raportów
type Risk = {
    id: number;
    code: string;
    name: string;
    asset: string;
    category: string;
    likelihood: number;
    impact: number;
    riskLevel: number;
    treatmentOption: string;
    status: string;
    dueDate?: string | null;
    reviewDate?: string | null;
};

type Control = {
    id: number;
    annexId: string;
    name: string;
    objective: string;
    owner: string;
    implementationStatus: string;
    effectiveness: string;
    frequency: string;
    nextReviewDate?: string | null;
};

function getRiskColor(level: number | null | undefined): string {
    if (!level) return "#e5e7eb";
    if (level <= 4) return "#4ce667";
    if (level <= 9) return "#f6e94d";
    return "#ff1515";
}

function statusColor(status: string) {
    switch (status) {
        case "IN_PLACE":
            return "#bbf7d0";
        case "PLANNED":
            return "#fef9c3";
        case "NOT_APPLICABLE":
            return "#e5e7eb";
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

export function RaportsView() {
    const [risks, setRisks] = useState<Risk[]>([]);
    const [controls, setControls] = useState<Control[]>([]);
    const [loading, setLoading] = useState(false);

    // proste metryki
    const highRiskThreshold = 10;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const parseDate = (value?: string | null) => {
        if (!value) return null;
        const d = new Date(value);
        if (isNaN(d.getTime())) return null;
        d.setHours(0, 0, 0, 0);
        return d;
    };

    const loadData = () => {
        setLoading(true);

        Promise.all([
            fetch("http://localhost:8080/api/risks").then((res) => res.json()),
            fetch("http://localhost:8080/api/controls").then((res) => res.json()),
        ])
            .then(([risksData, controlsData]) => {
                setRisks(risksData);
                setControls(controlsData);
            })
            .catch((err) => {
                console.error("Błąd przy ładowaniu danych do raportów:", err);
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadData();
    }, []);

    // KPI
    const totalRisks = risks.length;
    const highRisks = risks.filter((r) => (r.riskLevel || 0) >= highRiskThreshold);

    const overdueRisks = risks.filter((r) => {
        const due = parseDate(r.dueDate);
        if (!due) return false;
        return due < today && r.status !== "CLOSED";
    });

    const totalControls = controls.length;
    const plannedControls = controls.filter((c) => c.implementationStatus === "PLANNED");
    const ineffectiveControls = controls.filter((c) =>
        c.effectiveness === "PARTIALLY_EFFECTIVE" || c.effectiveness === "INEFFECTIVE"
    );

    // do tabel – ograniczymy do kilku rekordów, żeby było czytelnie
    const topHighRisks = [...highRisks].sort((a, b) => (b.riskLevel || 0) - (a.riskLevel || 0)).slice(0, 10);
    const topIneffectiveControls = ineffectiveControls.slice(0, 10);

    return (
        <div>
            <h2>Raporty SZBI</h2>
    <p style={{ color: "#e5e7eb", marginBottom: "1rem" }}>
    Widok raportowy dla właścicieli SZBI i audytorów wewnętrznych. Poniżej
    znajdują się podsumowania ryzyk oraz kontroli wraz z listą pozycji
    wymagających szczególnej uwagi.
    </p>

    <div style={{ marginBottom: "0.75rem", display: "flex", justifyContent: "space-between" }}>
    <small style={{ color: "#9ca3af" }}>
    Próg ryzyk wysokich: poziom &gt;= {highRiskThreshold}
    </small>
    <button
    type="button"
    onClick={loadData}
    style={{
        padding: "0.35rem 0.9rem",
            cursor: "pointer",
            borderRadius: "6px",
            border: "1px solid #4b5563",
            background: "transparent",
            color: "#e5e7eb",
    }}
>
    Odśwież dane
    </button>
    </div>

    {loading && <p>Ładowanie danych raportowych...</p>}

        {/* KAFELKI KPI */}
        <section className="kpi-grid">
        <div className="kpi-card">
        <div className="kpi-label">Ryzyka ogółem</div>
    <div className="kpi-value">{totalRisks}</div>
        </div>

        <div className="kpi-card">
    <div className="kpi-label">Ryzyka wysokie</div>
    <div className="kpi-value kpi-value-danger">{highRisks.length}</div>
        <div className="kpi-note">Poziom &gt;= {highRiskThreshold}</div>
        </div>

        <div className="kpi-card">
    <div className="kpi-label">Ryzyka po terminie</div>
    <div className="kpi-value kpi-value-warning">{overdueRisks.length}</div>
        <div className="kpi-note">Termin wdrożenia działań minął</div>
    </div>

    <div className="kpi-card">
    <div className="kpi-label">Kontrole ogółem</div>
    <div className="kpi-value">{totalControls}</div>
        </div>

        <div className="kpi-card">
    <div className="kpi-label">Kontrole planowane</div>
    <div className="kpi-value">{plannedControls.length}</div>
        <div className="kpi-note">Status: PLANNED</div>
    </div>

    <div className="kpi-card">
    <div className="kpi-label">Kontrole nieefektywne</div>
    <div className="kpi-value kpi-value-danger">
        {ineffectiveControls.length}
        </div>
        <div className="kpi-note">PARTIALLY_EFFECTIVE / INEFFECTIVE</div>
        </div>
        </section>

        {/* TABELA: RYZYKA WYSOKIEGO POZIOMU */}
        <section
            style={{
        marginTop: "1.5rem",
            padding: "1rem 1.25rem",
            border: "1px solid #4b5563",
            borderRadius: "10px",
            backgroundColor: "#111245",
    }}
    >
        <h3>Ryzyka wysokiego poziomu</h3>
    <p style={{ color: "#9ca3af", fontSize: "0.9rem", marginBottom: "0.5rem" }}>
        Ryzyka, dla których poziom ryzyka przekracza ustalony próg. Lista może
        być wykorzystana jako załącznik do raportu z przeglądu SZBI.
    </p>

        {topHighRisks.length === 0 ? (
            <p>Brak ryzyk wysokiego poziomu.</p>
        ) : (
            <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
                <tr style={{ borderBottom: "1px solid #4b5563" }}>
            <th style={{ textAlign: "left", padding: "0.4rem" }}>Kod</th>
        <th style={{ textAlign: "left", padding: "0.4rem" }}>Nazwa</th>
        <th style={{ textAlign: "left", padding: "0.4rem" }}>Zasób</th>
        <th style={{ textAlign: "left", padding: "0.4rem" }}>
            Kategoria
            </th>
            <th style={{ textAlign: "center", padding: "0.4rem" }}>P</th>
        <th style={{ textAlign: "center", padding: "0.4rem" }}>I</th>
        <th style={{ textAlign: "center", padding: "0.4rem" }}>
            Poziom
            </th>
            <th style={{ textAlign: "left", padding: "0.4rem" }}>
            Traktowanie
            </th>
            <th style={{ textAlign: "left", padding: "0.4rem" }}>
            Status
            </th>
            <th style={{ textAlign: "left", padding: "0.4rem" }}>
            Termin wdrożenia
        </th>
        </tr>
        </thead>
        <tbody>
        {topHighRisks.map((r) => (
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
        <td style={{ padding: "0.4rem" }}>
            {r.dueDate || "-"}
            </td>
            </tr>
        ))}
            </tbody>
            </table>
            </div>
        )}
        </section>

        {/* TABELA: KONTROLE NIEEFEKTYWNE */}
        <section
            style={{
        marginTop: "1.5rem",
            marginBottom: "1rem",
            padding: "1rem 1.25rem",
            border: "1px solid #4b5563",
            borderRadius: "10px",
            backgroundColor: "#111245",
    }}
    >
        <h3>Kontrole o obniżonej skuteczności</h3>
    <p style={{ color: "#9ca3af", fontSize: "0.9rem", marginBottom: "0.5rem" }}>
        Kontrole oznaczone jako częściowo skuteczne lub nieskuteczne. Warto
        uwzględnić je w planie działań korygujących.
    </p>

        {topIneffectiveControls.length === 0 ? (
            <p>Brak kontroli o obniżonej skuteczności.</p>
        ) : (
            <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
                <tr style={{ borderBottom: "1px solid #4b5563" }}>
            <th style={{ textAlign: "left", padding: "0.4rem" }}>A-ID</th>
        <th style={{ textAlign: "left", padding: "0.4rem" }}>
            Nazwa
            </th>
            <th style={{ textAlign: "left", padding: "0.4rem" }}>
            Cel
            </th>
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
            {topIneffectiveControls.map((c) => (
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
