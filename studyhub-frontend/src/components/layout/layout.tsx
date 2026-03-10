import { useContext, useState, type ReactNode } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./layout.css";

interface Props {
  title: string;
  children: ReactNode;
}

export default function Layout({ title, children }: Props) {

  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <div className="layout">

      <aside className="sidebar">

        <h2 className="logo">StudyHub</h2>

        <nav className="menu">

          <button onClick={() => navigate("/dashboard")}>
            Dashboard
          </button>

          <button onClick={() => navigate("/decks")}>
            Decks
          </button>

          <button onClick={() => navigate("/summaries")}>
            Resumos
          </button>

          <button onClick={() => navigate("/folders")}>
            Pastas
          </button>

          {user?.role === "teacher" && (
            <button onClick={() => navigate("/users")}>
              Usuários
            </button>
          )}

        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout}>
            Sair
          </button>
        </div>

      </aside>

      <div className="content">

        <header className="topbar">

          <div className="breadcrumbs">
            {title}
          </div>

          <div className="profile">

            <div
              className="avatar"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {user?.name?.charAt(0).toUpperCase()}
            </div>

            <span className="username">
              {user?.name}
            </span>

            {menuOpen && (
              <div className="profile-menu">

                <p className="profile-name">
                  {user?.name}
                </p>

                <p className="profile-email">
                  {user?.email}
                </p>

                <p className="profile-role">
                  {user?.role === "teacher" ? "Professor" : "Aluno"}
                </p>

                <hr />

                <button onClick={() => navigate("/profile")}>
                  Configurações
                </button>

                <button onClick={handleLogout}>
                  Sair
                </button>

              </div>
            )}

          </div>

        </header>

        <main className="main">
          {children}
        </main>

      </div>

    </div>
  );
}