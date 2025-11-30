import { useEffect, useState } from "react";

type RiskListItem = {
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
};

type ControlListItem = {
    id: number;
    annexId: string;
    name: string;
    objective: string;
    owner: string;
    implementationStatus: string;
    effectiveness: string;
    frequency: string;
    nextReviewDate?: string;
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

export function ListsView() {
    const [risks, setRisks] = useState<RiskListItem[]>([]);
    const [controls, setControls] = useState<ControlListItem[]>([]);
    const [loadingRisks, setLoadingRisks] = useState(false);
    const [loadingControls, setLoadingControls] = useState(false);

    const loadRisks = () => {
        setLoadingRisks(true);
        fetch("http://localhost:8080/api/risks")
            .then((res) => res.json())
            .then((data) => setRisks(data))
            .catch((err) => console.error("Błąd przy pobieraniu ryzyk:", err))
            .finally(() => setLoadingRisks(false));
    };

    const loadControls = () => {
        setLoadingControls(true);
        fetch("http://localhost:8080/api/controls")
            .then((res) => res.json())
            .then((data) => setControls(data))
            .catch((err) => console.error("Błąd przy pobieraniu kontroli:", err))
            .finally(() => setLoadingControls(false));
    };

    useEffect(() => {
        loadRisks();
        loadControls();
    }, []);

    return (
        <div>
            <h2>Listy ryzyk i kontroli</h2>
    <p style={{ color: "#e5e7eb", marginBottom: "1rem" }}>
    Widok przeglądowy do raportowania: poniżej znajdują się zestawienia
    wszystkich zarejestrowanych ryzyk oraz kontroli SZBI.
    </p>

    {/* LISTA RYZYK */}
    <section
        style={{
        marginTop: "0.5rem",
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
    <h3>Lista ryzyk</h3>
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

    {loadingRisks && <p>Ładowanie ryzyk...</p>}

        {risks.length === 0 && !loadingRisks ? (
            <p>Brak ryzyk w rejestrze.</p>
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
            border: "1px solid #4b5563",
            background: "transparent",
            color: "#e5e7eb",
    }}
    >
        Odśwież
        </button>
        </div>

        {loadingControls && <p>Ładowanie kontroli...</p>}

            {controls.length === 0 && !loadingControls ? (
                <p>Brak kontroli w rejestrze.</p>
            ) : (
                <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr style={{ borderBottom: "1px solid #4b5563" }}>
                <th style={{ textAlign: "left", padding: "0.4rem" }}>A-ID</th>
            <th style={{ textAlign: "left", padding: "0.4rem" }}>
                Nazwa
                </th>
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
