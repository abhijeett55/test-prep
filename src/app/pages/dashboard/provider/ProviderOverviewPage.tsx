import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Building2, GraduationCap, Users, BookOpen,
  RefreshCw, AlertCircle, ArrowRight, ShieldCheck, TrendingUp
} from "lucide-react";
import { getDashboardStats } from "../../../api/auth/admin/reports";
import { errorMessage } from "../../../api/client";
import "../OverviewPage.css";

type Stats = Record<string, unknown>;

const num = (v: unknown, fallback = 0): number =>
  typeof v === "number" && Number.isFinite(v) ? v : fallback;

export default function ProviderOverviewPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    return () => { cancelled = true; };
  }, []);

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
    { label: "Total Institutes", icon: Building2,    value: num(stats?.institutes), tone: "violet" },
    { label: "Total Students",   icon: GraduationCap,value: num(stats?.students),   tone: "blue"   },
    { label: "Total Teachers",   icon: Users,        value: num(stats?.teachers),   tone: "emerald"},
    { label: "Total Courses",    icon: BookOpen,     value: num(stats?.courses),    tone: "amber"  },
  ] as const;

  const quickActions = [
    { label: "Onboard New Institute", to: "/dashboard/provider/institutes" },
    { label: "Global User Management",to: "/dashboard/provider/users" },
    { label: "Platform Analytics",    to: "/dashboard/provider/analytics" },
    { label: "System Configuration",  to: "/dashboard/provider/settings" },
  ] as const;

  return (
    <div className="overview">
      <div className="overview__head">
        <div>
          <h1 className="overview__title">Platform Overview</h1>
          <p className="overview__subtitle">Global statistics across all registered institutes.</p>
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

      {/* Platform Health */}
      <section className="overview__section">
        <h2 className="overview__sectionTitle">Platform Health</h2>
        <div className="overview__grid overview__grid--health">
          <div className="overview__health">
            <ShieldCheck size={20} className="overview__healthIcon" style={{ color: "#2563eb" }} />
            <div>
              <div className="overview__healthValue">Operational</div>
              <div className="overview__healthLabel">System Status</div>
            </div>
          </div>
          <div className="overview__health">
            <TrendingUp size={20} className="overview__healthIcon" />
            <div>
              <div className="overview__healthValue">{num(stats?.batches)}</div>
              <div className="overview__healthLabel">Active Batches Globally</div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick actions */}
      <section className="overview__section">
        <h2 className="overview__sectionTitle">Provider Actions</h2>
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