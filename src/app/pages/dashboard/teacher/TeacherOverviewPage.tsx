import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Users, GraduationCap, BookOpen,
  TrendingUp, RefreshCw, AlertCircle, ArrowRight, ClipboardCheck
} from "lucide-react";
import {
  getMyCourses,
  getMyBatches,
  getMyStudents,
  getMyAttempts,
} from "../../../api/auth/teacher/teacher";
import { errorMessage } from "../../../api/client";
// Reusing the Admin CSS since the classes are identical
import "../OverviewPage.css"; 

type TeacherStats = {
  students: number;
  batches: number;
  courses: number;
  attempts: number;
  avgScore: number | null;
  passRate: number | null;
};

export default function TeacherOverviewPage() {
  const [stats, setStats] = useState<TeacherStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Standard effect pattern (no synchronous setState)
  useEffect(() => {
    let cancelled = false;

    const fetchTeacherStats = async () => {
      try {
        // Fetch all four datasets in parallel
        const [courses, batches, students, attempts] = await Promise.all([
          getMyCourses(),
          getMyBatches(),
          getMyStudents(),
          getMyAttempts(),
        ]);

        if (!cancelled) {
          // Calculate aggregate stats from the attempts
          let totalScore = 0;
          let totalMax = 0;
          let passed = 0;

          attempts.forEach((a) => {
            totalScore += a.score;
            totalMax += a.totalMarks;
            if (a.score >= a.passMarks) passed++;
          });

          const avgScore = totalMax > 0 ? (totalScore / totalMax) * 100 : null;
          const passRate = attempts.length > 0 ? (passed / attempts.length) * 100 : null;

          setStats({
            students: students.length,
            batches: batches.length,
            courses: courses.length,
            attempts: attempts.length,
            avgScore,
            passRate,
          });
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

    fetchTeacherStats();

    return () => {
      cancelled = true;
    };
  }, []);

  // Manual Refresh Handler
  const handleRefresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const [courses, batches, students, attempts] = await Promise.all([
        getMyCourses(),
        getMyBatches(),
        getMyStudents(),
        getMyAttempts(),
      ]);

      let totalScore = 0;
      let totalMax = 0;
      let passed = 0;

      attempts.forEach((a) => {
        totalScore += a.score;
        totalMax += a.totalMarks;
        if (a.score >= a.passMarks) passed++;
      });

      setStats({
        students: students.length,
        batches: batches.length,
        courses: courses.length,
        attempts: attempts.length,
        avgScore: totalMax > 0 ? (totalScore / totalMax) * 100 : null,
        passRate: attempts.length > 0 ? (passed / attempts.length) * 100 : null,
      });
    } catch (e: unknown) {
      setError(errorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  const fmtPct = (v: number | null): string =>
    v !== null ? `${v.toFixed(1)}%` : "—";

  const kpis = [
    { label: "My Students", icon: GraduationCap, value: stats?.students, tone: "blue" },
    { label: "My Classes",  icon: Users,         value: stats?.batches,  tone: "violet" },
    { label: "My Courses",  icon: BookOpen,      value: stats?.courses,  tone: "emerald" },
    { label: "Tests Taken", icon: ClipboardCheck,value: stats?.attempts, tone: "amber" },
  ] as const;

  const health = [
    { label: "Average Score", value: fmtPct(stats?.avgScore ?? null), icon: TrendingUp },
    { label: "Pass Rate",     value: fmtPct(stats?.passRate ?? null), icon: TrendingUp },
  ] as const;

  const quickActions = [
    { label: "View My Courses",     to: "/dashboard/teacher/my-classes/course-list" },
    { label: "View My Classes",     to: "/dashboard/teacher/my-classes/class-list" },
    { label: "View My Students",    to: "/dashboard/teacher/my-classes/student-list" },
    { label: "View Attempt History",to: "/dashboard/teacher/student-performance/attempt-history" },
  ] as const;

  return (
    <div className="overview">
      <div className="overview__head">
        <div>
          <h1 className="overview__title">Teacher Overview</h1>
          <p className="overview__subtitle">A snapshot of your classes and students.</p>
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
                {loading ? <span className="overview__skeleton" /> : (value ?? 0)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Institute health (Performance) */}
      <section className="overview__section">
        <h2 className="overview__sectionTitle">My Class Performance</h2>
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