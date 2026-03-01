import { Link } from "react-router-dom";

export function HomeView() {
    return (
        <div className="home">

            <section className="home-hero">
                <h2 className="home-hero-title">
                    System zarządzania ryzykiem i kontrolami SZBI
                </h2>
                <p className="home-hero-subtitle">
                    Tu możesz w pracy opisać krótko cel aplikacji: wsparcie prowadzenia
                    rejestru ryzyk i kontroli zgodnie z ISO 27001, ułatwienie pracy
                    audytorów wewnętrznych oraz właścicieli procesów.
                </p>
                <div className="home-hero-actions">
                    <Link to="/risks" className="btn-primary">
                        Przejdź do rejestru ryzyk
                    </Link>
                    <Link to="/controls" className="btn-outline">
                        Przejdź do rejestru kontroli
                    </Link>
                </div>
            </section>

            {/* NOWY GŁÓWNY GRID */}
            <div className="home-main-grid">

                {/* LEWA KOLUMNA – CAŁA TWOJA OBECNA TREŚĆ */}
                <div>

                    <section className="home-layout">
                        <div className="home-card">
                            <div className="home-card-title">Dla kogo jest aplikacja?</div>
                            <p>
                                System przeznaczony jest dla właścicieli SZBI, audytorów
                                wewnętrznych oraz osób odpowiedzialnych za bezpieczeństwo
                                informacji. Ułatwia dokumentowanie ryzyk, planów postępowania
                                oraz stanu realizacji kontroli.
                            </p>
                        </div>

                        <div className="image-box">
                            Miejsce na grafikę / schemat SZBI
                        </div>
                    </section>

                    <section className="home-layout" style={{ marginTop: "1rem" }}>
                        <div className="home-card">
                            <div className="home-card-title">Najważniejsze funkcje</div>
                            <ul style={{ paddingLeft: "1.1rem", margin: 0 }}>
                                <li>Rejestr ryzyk z oceną, poziomem i sposobem traktowania.</li>
                                <li>
                                    Rejestr kontroli powiązany z załącznikiem A normy ISO 27001,
                                    statusem wdrożenia i skutecznością.
                                </li>
                                <li>
                                    Dane uporządkowane w czytelnych tabelach – gotowe do raportów
                                    i przeglądów SZBI.
                                </li>
                            </ul>
                        </div>

                        <div className="home-card">
                            <div className="home-card-title">Miejsce na drugi obrazek</div>
                            <p style={{ color: "#9ca3af", fontSize: "0.9rem" }}>
                                Tu możesz później wstawić np. zrzut ekranu z aplikacji,
                                heatmapę ryzyk albo diagram architektury systemu.
                            </p>
                        </div>
                    </section>

                </div>

                {/* PRAWA DUŻA KOLUMNA – TU MA BYĆ PANEL */}
                <div className="home-auth-panel">
                    <div className="home-auth-card-large">
                        <h3>Panel użytkownika</h3>
                        <p>
                            Zaloguj się do systemu lub utwórz konto, aby zarządzać
                            rejestrem ryzyk i kontroli w organizacji.
                        </p>

                        <div className="auth-buttons">
                            <Link to="/login" className="btn-primary">
                                Zaloguj się
                            </Link>

                            <Link to="/register" className="btn-outline">
                                Zarejestruj się
                            </Link>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}



