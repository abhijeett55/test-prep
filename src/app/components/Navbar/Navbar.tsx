import { useRef, useState, type FocusEvent, type MouseEvent } from "react";
import { ChevronRight, Info } from "lucide-react";
import type { NavItem } from "./types";
import "./Navbar.css";

const REACH = 110;
const MAX_SCALE = 0.34;
const MAX_SLIDE = 6;

type NavbarProps = {
  items: NavItem[];
  defaultActive?: string;
  onNavigate?: (label: string) => void;
};

export default function Navbar({ items, defaultActive, onNavigate }: NavbarProps) {
  const [openSections, setOpenSections] = useState<string[]>([]);
  const [active, setActive] = useState(defaultActive ?? items[0]?.label ?? "");
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);

  const navRef = useRef<HTMLElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);

  const expanded = hovered || focused;

  const select = (label: string) => {
    setActive(label);
    onNavigate?.(label);
  };

  const toggle = (label: string) => {
    setOpenSections((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );
  };

  const resetIcons = () => {
    navRef.current
      ?.querySelectorAll<HTMLElement>(".sidebar-item-icon")
      .forEach((icon) => {
        icon.style.setProperty("--s", "1");
        icon.style.setProperty("--tx", "0px");
      });
  };

  const handleMouseMove = (e: MouseEvent<HTMLElement>) => {
    const nav = navRef.current;
    const pill = pillRef.current;
    if (!nav || !pill) return;

    // 1. Slide the highlight pill to whatever row is under the mouse
    const row = (e.target as HTMLElement).closest<HTMLElement>("[data-row]");
    if (row) {
      const navRect = nav.getBoundingClientRect();
      const r = row.getBoundingClientRect();
      pill.style.setProperty("--y", `${r.top - navRect.top + nav.scrollTop}px`);
      pill.style.setProperty("--h", `${r.height}px`);
      pill.style.opacity = "1";
    }

    // 2. Icons lean toward the cursor and grow the closer it gets
    nav.querySelectorAll<HTMLElement>(".sidebar-item-icon").forEach((icon) => {
      const r = icon.getBoundingClientRect();
      const dist = Math.abs(e.clientY - (r.top + r.height / 2));
      const t = Math.max(0, 1 - dist / REACH);
      const eased = t * t * (3 - 2 * t);
      icon.style.setProperty("--s", String(1 + MAX_SCALE * eased));
      icon.style.setProperty("--tx", `${MAX_SLIDE * eased}px`);
    });
  };

  const handleMouseLeave = () => {
    setHovered(false);
    if (pillRef.current) pillRef.current.style.opacity = "0";
    resetIcons();
  };

  const handleFocus = (e: FocusEvent<HTMLElement>) => {
    if ((e.target as HTMLElement).matches(":focus-visible")) setFocused(true);
  };

  const handleBlur = (e: FocusEvent<HTMLElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
      setFocused(false);
    }
  };

  return (
    <div className="sidebar-shell">
      <aside
        className={`sidebar ${expanded ? "is-expanded" : ""}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
      >
        <nav
          ref={navRef}
          className="sidebar-nav"
          aria-label="Main navigation"
          onMouseMove={handleMouseMove}
        >
          <span ref={pillRef} className="sidebar-pill" aria-hidden="true" />

          {items.map((item) => {
            const isOpen = openSections.includes(item.label);
            const hasChildren = !!item.children;
            const childActive = item.children?.some((c) => c.label === active);
            const isActive = active === item.label || (!!childActive && !isOpen);
            const ItemIcon = item.icon;

            return (
              <div key={item.label} className="sidebar-group">
                <button
                  type="button"
                  data-row
                  aria-label={item.label}
                  aria-expanded={hasChildren ? isOpen : undefined}
                  className={`sidebar-item ${isActive ? "active" : ""} ${
                    childActive ? "has-active" : ""
                  }`}
                  onClick={() =>
                    hasChildren ? toggle(item.label) : select(item.label)
                  }
                >
                  <span className="sidebar-item-icon">
                    <ItemIcon size={19} strokeWidth={1.8} />
                  </span>
                  <span className="sidebar-item-label">{item.label}</span>
                  {item.info && (
                    <Info size={14} className="info-dot" strokeWidth={1.8} />
                  )}
                  {item.badge && (
                    <span className="sidebar-badge">{item.badge}</span>
                  )}
                  {hasChildren && (
                    <span className={`sidebar-chevron ${isOpen ? "open" : ""}`}>
                      <ChevronRight size={14} strokeWidth={2} />
                    </span>
                  )}
                </button>

                {hasChildren && (
                  <div
                    className={`sidebar-submenu ${
                      isOpen && expanded ? "open" : ""
                    }`}
                  >
                    <div className="sidebar-submenu-inner">
                      {item.children!.map((child) => (
                        <button
                          type="button"
                          key={child.label}
                          data-row
                          tabIndex={isOpen && expanded ? 0 : -1}
                          className={`sidebar-subitem ${
                            active === child.label ? "active" : ""
                          }`}
                          onClick={() => select(child.label)}
                        >
                          <span className="sidebar-radio" />
                          <span className="sidebar-subitem-label">
                            {child.label}
                          </span>
                          {child.info && (
                            <Info
                              size={13}
                              className="info-dot"
                              strokeWidth={1.8}
                            />
                          )}
                          {child.badge && (
                            <span className="sidebar-badge">{child.badge}</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </aside>
    </div>
  );
}