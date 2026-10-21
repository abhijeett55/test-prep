import { useApi } from "../../../../hooks/useApi";
import { getInstitutePerformance } from "../../../../api/auth/admin/reports";
import "./CoursesPage.css";

export default function InstitutePerformancePage() {
  const { data, loading, error } = useApi(() => getInstitutePerformance());

  if (loading) return <div className="default-page">Loading…</div>;
  if (error) return <div className="default-page" style={{ color: "red" }}>{error}</div>;

  return (
    <div className="default-page">
      <div className="courses-header">
        <div>
          <h1>Institute Performance</h1>
          <p>Overview of your institute's statistics</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        <div className="perf-card">
          <div className="perf-card-label">Total Students</div>
          <div className="perf-card-value">{data?.students_total || 0}</div>
        </div>
        <div className="perf-card">
          <div className="perf-card-label">Active Students</div>
          <div className="perf-card-value">{data?.students_active || 0}</div>
        </div>
        <div className="perf-card">
          <div className="perf-card-label">Teachers</div>
          <div className="perf-card-value">{data?.teachers_total || 0}</div>
        </div>
        <div className="perf-card">
          <div className="perf-card-label">Courses</div>
          <div className="perf-card-value">{data?.courses_total || 0}</div>
        </div>
      </div>
    </div>
  );
}