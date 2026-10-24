import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  FilePenLine,
  GraduationCap,
  Building2,
  LogIn,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import "./RolePage.css";

interface RoleCard {
  key: string;
  label: string;
  description: string;
  icon: LucideIcon;
  path: string;
}

const roles: RoleCard[] = [
  {
    key: "admin",
    label: "Admin",
    description: "Manage users, teachers and students",
    icon: ShieldCheck,
    path: "/login/admin",
  },
  {
    key: "testsetter",
    label: "Test Setter",
    description: "Create and manage question papers",
    icon: FilePenLine,
    path: "/login/testsetter",
  },
  {
    key: "teacher",
    label: "Teacher",
    description: "Run classes, schedule tests, track performance",
    icon: GraduationCap,
    path: "/login/teacher",
  },
  {
    key: "provider",
    label: "Provider",
    description: "Manage your institute and its content",
    icon: Building2,
    path: "/login/provider",
  },
];

const spotlight: string[] = [
  "Create, schedule and conduct online tests for your classes",
  "Track batch-wise analytics and weak topics in real time",
  "Download class and student performance reports in one click",
];

export default function RolePage() {
  const navigate = useNavigate();

  return (
    <div className="role-page">
      <div className="role-banner">
        <span className="role-banner-logo">Test Prep</span>
        <span className="role-banner-sub">(Online Education Platform)</span>
      </div>

      <main className="role-main">
        <h1 className="role-title">Welcome to Test Prep</h1>

        <div className="role-grid">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <div key={role.key} className={`role-card role-${role.key}`}>
                <div className="role-card-icon">
                  <Icon size={44} strokeWidth={1.6} />
                </div>
                <div className="role-card-body">
                  <h2 className="role-card-label">{role.label}</h2>
                  <p className="role-card-desc">{role.description}</p>
                  <button
                    className="role-card-btn"
                    onClick={() => navigate(role.path)}
                    aria-label={`Continue as ${role.label}`}
                  >
                    <LogIn size={18} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <section className="role-spotlight">
          <div className="role-spotlight-head">
            <h3>Spotlight</h3>
          </div>
          <ul className="role-spotlight-list">
            {spotlight.map((item) => (
              <li key={item}>
                <Zap size={14} className="role-spotlight-icon" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}