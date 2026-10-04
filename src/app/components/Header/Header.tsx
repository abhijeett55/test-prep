import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";

type HeaderProps = {
  /** Text next to the logo, e.g. "Teacher Panel" */
  title?: string;
  /** Where the logo links to */
  homeHref?: string;
  /** Shown in the top-right, e.g. "24MCA10070" */
  userId: string;
  /** Shown in brackets after the id, e.g. "STUDENT" */
  role?: string;
  /** Profile photo. Falls back to the first letter of userId. */
  avatarUrl?: string;
  onSignOut?: () => void;
};

export default function Header({
  title = "Online Exam",
  homeHref = "/dashboard",
  userId,
  role,
  avatarUrl,
  onSignOut,
}: HeaderProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();
  const handleSignOut = () => {
      setOpen(false);
      // clear token/session here
      onSignOut?.();
      navigate("/login");
    };



  // close the dropdown when clicking outside or pressing Escape
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    
    
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const avatar = (className: string) =>
    avatarUrl ? (
      <img src={avatarUrl} alt={userId} className={className} />
    ) : (
      <span className={`${className} account-avatar-fallback`}>
        {userId.charAt(0).toUpperCase()}
      </span>
    );

  return (
    <header className="header">
      <a href={homeHref} className="logo">
        <svg width="26" height="26" viewBox="0 0 56 56" fill="none">
          <circle cx="28" cy="28" r="27" stroke="#4F6BFF" strokeWidth="2" />
          <path
            d="M18 30L25 37L39 20"
            stroke="#4F6BFF"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="logo-text">{title}</span>
      </a>

      <div className="account" ref={menuRef}>
        <button
          className="account-trigger"
          onClick={() => setOpen((o) => !o)}
          aria-haspopup="menu"
          aria-expanded={open}
        >
          {avatar("account-avatar")}
          <span className="account-id">
            {userId}
            {role && ` (${role.toUpperCase()})`}
          </span>
          <span className={`account-caret ${open ? "open" : ""}`} />
        </button>

        {open && (
          <div className="account-menu" role="menu">
            <div className="account-menu-top">{avatar("account-avatar-lg")}</div>
            <div className="account-menu-body">
              <button
                className="account-signout"
                role="menuitem"
                onClick={handleSignOut}
              >
                Sign out
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}