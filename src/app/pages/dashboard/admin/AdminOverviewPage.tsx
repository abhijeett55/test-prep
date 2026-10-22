import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Users, GraduationCap, Users2, BookOpen,
  ClipboardCheck, Wallet, ArrowRightLeft,
  TrendingUp, RefreshCw, AlertCircle, ArrowRight,
} from "lucide-react";
import { getDashboardStats } from "../../../api/auth/admin/reports";
import { errorMessage } from "../../../api/client";
import "../OverviewPage.css";

/*
  FIELD NAMES — These map exactly to the `DashboardStats` schema in the backend.
*/
const KEY_ALIASES = {
  students:       ["students"],
  teachers:       ["teachers"],
  batches:        ["batches"],
  courses:        ["courses"],
  pendingEnroll:  ["pending_enrollments"],
  pendingFees:    ["pending_fees"],
  pendingXfers:   ["pending_transfers"],
  avgScore:       ["avg_score"],
  passRate:       ["pass_rate"],
} as const;

type Stats = Record<string, unknown>;
type Metric = keyof typeof KEY_ALIASES;

function pick(stats: Stats | null, metric: Metric): unknown {
  if (!stats) return undefined;
  for (const key of KEY_ALIASES[metric]) {
    if (stats[key] !== undefined && stats[key] !== null) return stats[key];
  }
  return undefined;
}

const num = (v: unknown, fallback = 0): number =>
  typeof v === "number" && Number.isFinite(v) ? v : fallback;

const fmtPct = (v: unknown): string =>
  typeof v === "number" && Number.isFinite(v) ? `${v.toFixed(1)}%` : "—";

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 1. Standard effect pattern for initial load (no synchronous setState)
  useEffect(() => {
    let cancelled = false;

    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        if (!cancelled) {
          setStats(data as unknown as Stats);
          setError(null);
        }
      } catch (e: unknown) {
        if (!cancelled) {
          setError(errorMessage(e));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchStats();

    return () => {
      cancelled = true;
    };
  }, []);

  // 2. Separate handler for the manual Refresh button
  const handleRefresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getDashboardStats();
      setStats(data as unknown as Stats);
    } catch (e: unknown) {
      setError(errorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  const kpis = [
    { label: "Students",   icon: GraduationCap, value: num(pick(stats, "students")),   tone: "blue"   },
    { label: "Teachers",   icon: Users,         value: num(pick(stats, "teachers")),   tone: "violet" },
    { label: "Batches",    icon: Users2,        value: num(pick(stats, "batches")),    tone: "emerald"},
    { label: "Courses",    icon: BookOpen,      value: num(pick(stats, "courses")),    tone: "amber"  },
  ] as const;

  const attention = [
    {
      label: "Pending enrollments",
      value: num(pick(stats, "pendingEnroll")),
      icon: ClipboardCheck,
      to: "/dashboard/admin/student-management/enrollment",
    },
    {
      label: "Overdue / pending fees",
      value: num(pick(stats, "pendingFees")),
      icon: Wallet,
      to: "/dashboard/admin/student-management/fee-status",
    },
    {
      label: "Pending batch transfers",
      value: num(pick(stats, "pendingXfers")),
      icon: ArrowRightLeft,
      to: "/dashboard/admin/student-management/batch-transfer",
    },
  ] as const;

  const health = [
    { label: "Average score", value: fmtPct(pick(stats, "avgScore")), icon: TrendingUp },
    { label: "Pass rate",     value: fmtPct(pick(stats, "passRate")), icon: TrendingUp },
  ] as const;

  const quickActions = [
    { label: "Add a teacher",        to: "/dashboard/admin/user-management/teachers" },
    { label: "Create a batch",       to: "/dashboard/admin/batch-management/create" },
    { label: "New announcement",     to: "/dashboard/admin/announcements/new" },
    { label: "View institute report",to: "/dashboard/admin/reports/institute-performance" },
  ] as const;

  return (
    <div className="overview">
      <div className="overview__head">
        <div>
          <h1 className="overview__title">Overview</h1>
          <p className="overview__subtitle">A snapshot of your institute.</p>
        </div>
        <button
          className="overview__refresh"
          onClick={handleRefresh}
          disabled={loading}
          title="Refresh"
        >
          <RefreshCw size={16} className={loading ? "spin" : ""} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="overview__error" role="alert">
          <AlertCircle size={18} />
          <span>{error}</span>
          <button onClick={handleRefresh}>Retry</button>
        </div>
      )}

      {/* KPI tiles */}
      <div className="overview__grid overview__grid--kpi">
        {kpis.map(({ label, icon: Icon, value, tone }) => (
          <div key={label} className={`overview__card tone-${tone}`}>
            <div className="overview__cardIcon"><Icon size={20} /></div>
            <div className="overview__cardBody">
              <span className="overview__cardLabel">{label}</span>
              <span className="overview__cardValue">
                {loading ? <span className="overview__skeleton" /> : value}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Needs attention */}
      <section className="overview__section">
        <h2 className="overview__sectionTitle">Needs attention</h2>
        <div className="overview__grid overview__grid--attention">
          {attention.map(({ label, value, icon: Icon, to }) => (
            <Link key={label} to={to} className="overview__attention">
              <div className="overview__attentionIcon"><Icon size={18} /></div>
              <div className="overview__attentionBody">
                <span className="overview__attentionValue">
                  {loading ? <span className="overview__skeleton overview__skeleton--sm" /> : value}
                </span>
                <span className="overview__attentionLabel">{label}</span>
              </div>
              <ArrowRight size={16} className="overview__attentionArrow" />
            </Link>
          ))}
        </div>
      </section>

      {/* Institute health */}
      <section className="overview__section">
        <h2 className="overview__sectionTitle">Institute health</h2>
        <div className="overview__grid overview__grid--health">
          {health.map(({ label, value, icon: Icon }) => (
            <div key={label} className="overview__health">
              <Icon size={20} className="overview__healthIcon" />
              <div>
                <div className="overview__healthValue">
                  {loading ? <span className="overview__skeleton overview__skeleton--sm" /> : value}
                </div>
                <div className="overview__healthLabel">{label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick actions */}
      <section className="overview__section">
        <h2 className="overview__sectionTitle">Quick actions</h2>
        <div className="overview__quick">
          {quickActions.map(({ label, to }) => (
            <Link key={to} to={to} className="overview__quickLink">
              {label}
              <ArrowRight size={14} />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}