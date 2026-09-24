import type { ReactNode } from "react";
import "./Header.css";

export type HeaderLink = {
  label: string;
  href: string;
};

type HeaderProps = {
  /** Text next to the logo, e.g. "Online Exam" or "Admin Panel" */
  title?: string;
  /** Where the logo links to */
  homeHref?: string;
  /** Top navigation links. Each dashboard passes its own. */
  links?: HeaderLink[];
  /**
   * Right side of the header (user name, logout, etc).
   * Leave it out to show the default Sign In / Sign Up buttons.
   * Pass `null` to show nothing.
   */
  actions?: ReactNode;
};

const defaultLinks: HeaderLink[] = [
  { label: "Home", href: "/dashboard" },
  { label: "Reports", href: "/dashboard/reports" },
  { label: "Test Series", href: "/dashboard/tests" },
  { label: "Support", href: "/dashboard/support" },
  { label: "My Account", href: "/dashboard/account" },
];

export default function Header({
  title = "Online Exam",
  homeHref = "/dashboard",
  links = defaultLinks,
  actions,
}: HeaderProps) {
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

      {links.length > 0 && (
        <nav>
          <ul className="nav-links">
            {links.map((link) => (
              <li key={link.href}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <div className="header-actions">
        {actions === undefined ? (
          <>
            <button className="signin">Sign In</button>
            <button className="signup">Sign Up</button>
          </>
        ) : (
          actions
        )}
      </div>
    </header>
  );
}