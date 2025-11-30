import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import { RisksView } from "./RisksView";
import { ControlsView } from "./ControlsView";
import { HomeView } from "./HomeView";
import { ListsView } from "./ListsView";
import { RaportsView } from "./ReportsView.tsx";
import "./App.css";

function App() {
    return (
        <BrowserRouter>
            <div className="app-root">
                {/* GÓRNY PASEK */}
                <header className="topbar">
                    <div className="topbar-inner">
                        {/* lewa kolumna – na razie pusta */}
                        <div />

                        {/* środek – LOGO jako przycisk do strony głównej */}
                        <div className="topbar-logo">
                            <NavLink to="/" className="logo-link">
                                LOGO
                            </NavLink>
                        </div>

                        {/* prawa kolumna – zakładki + Raporty jako przycisk */}
                        <nav className="topbar-nav topbar-nav-right">
                            <NavLink
                                to="/risks"
                                className={({ isActive }) =>
                                    "nav-link" + (isActive ? " nav-link-active" : "")
                                }
                            >
                                Rejestr ryzyk
                            </NavLink>

                            <NavLink
                                to="/controls"
                                className={({ isActive }) =>
                                    "nav-link" + (isActive ? " nav-link-active" : "")
                                }
                            >
                                Rejestr kontroli
                            </NavLink>

                            <NavLink
                                to="/lists"
                                className={({ isActive }) =>
                                    "nav-link" + (isActive ? " nav-link-active" : "")
                                }
                            >
                                Listy
                            </NavLink>

                            <NavLink
                                to="/reports"
                                className={({ isActive }) =>
                                    "topbar-button" + (isActive ? " topbar-button-active" : "")
                                }
                            >
                                Raporty
                            </NavLink>
                        </nav>
                    </div>
                </header>

                {/* GŁÓWNA TREŚĆ STRONY */}
                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<HomeView />} />
                        <Route path="/risks" element={<RisksView />} />
                        <Route path="/controls" element={<ControlsView />} />
                        <Route path="/lists" element={<ListsView />} />
                        <Route path="/reports" element={<RaportsView />} />
                    </Routes>
                </main>
            </div>
        </BrowserRouter>
    );
}

export default App;
