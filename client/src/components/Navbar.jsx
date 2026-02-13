import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../services/useAuth";

const linkClass = ({ isActive }) =>
  [
    "rounded-lg px-3 py-2 text-sm transition",
    isActive ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100",
  ].join(" ");

function Navbar() {
  const navigate = useNavigate();
  const { isAuthed, logout, isAdmin } = useAuth();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <nav className="flex flex-wrap items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-sm">
      <NavLink to="/" className={linkClass}>
        דף הבית
      </NavLink>

      <NavLink to="/articles" className={linkClass}>
        כתבות
      </NavLink>

      <div className="ms-auto flex items-center gap-3">
        {isAuthed ? (
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg px-3 py-2 text-sm transition text-slate-700 hover:bg-slate-100"
          >
            התנתקות
          </button>
        ) : (
          <>
            <NavLink to="/login" className={linkClass}>
              התחברות
            </NavLink>

            <NavLink to="/register" className={linkClass}>
              הרשמה
            </NavLink>
          </>
        )}
        {isAdmin && (
          <NavLink
            to="/articles/new"
            className="rounded-lg px-3 py-2 text-sm transition bg-slate-900 text-white"
          >
            כתבה חדשה
          </NavLink>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
