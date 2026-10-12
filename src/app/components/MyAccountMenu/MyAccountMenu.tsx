import { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Users } from "lucide-react";
import { useAuth } from "../../config/auth/AuthContext";
import "./MyAccountMenu.css";

export default function MyAccountMenu() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close on outside click.
  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  if (!user) return null;

  function handleLogout() {
    logout();
    navigate("/role", { replace: true });
  }

  return (
    <div className="account-menu" ref={ref}>
      <button
        className="account-menu-trigger"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <Users size={22} strokeWidth={1.7} />
        <span>My Account</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" strokeWidth="2">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div className="account-menu-list" role="menu">
          <NavLink
            to="/account/profile"
            className={({ isActive }) =>
              "account-menu-item" + (isActive ? " active" : "")
            }
            onClick={() => setOpen(false)}
          >
            <span className="dot filled" />
            <span>Profile</span>
          </NavLink>

          <NavLink
            to="/account/change-password"
            className={({ isActive }) =>
              "account-menu-item" + (isActive ? " active" : "")
            }
            onClick={() => setOpen(false)}
          >
            <span className="dot" />
            <span>Change Password</span>
          </NavLink>

          <button className="account-menu-item logout" onClick={handleLogout}>
            <span className="dot" />
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
}