import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import { RisksView } from "./RisksView";
import { ControlsView } from "./ControlsView";
import { HomeView } from "./HomeView";
import { ListsView } from "./ListsView";
import { RaportsView } from "./ReportsView";
import { LoginView } from "./LoginView";
import { RegisterView } from "./RegisterView";
import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-root">

        {/* GÓRNY PASEK */}
        <header className="topbar">
          <div className="topbar-inner">

            {/* LOGO */}
            <div className="topbar-logo">
              <NavLink to="/" className="logo-link">
                LOGO
              </NavLink>
            </div>

            {/* NAWIGACJA (bez login/register) */}
            <nav className="topbar-nav">
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
                to="/raports"
                className={({ isActive }) =>
                  "nav-link" + (isActive ? " nav-link-active" : "")
                }
              >
                Raporty
              </NavLink>
            </nav>
          </div>
        </header>

        {/* TREŚĆ */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomeView />} />
            <Route path="/risks" element={<RisksView />} />
            <Route path="/controls" element={<ControlsView />} />
            <Route path="/lists" element={<ListsView />} />
            <Route path="/raports" element={<RaportsView />} />
            <Route path="/login" element={<LoginView />} />
            <Route path="/register" element={<RegisterView />} />
          </Routes>
        </main>

      </div>
    </BrowserRouter>
  );
}