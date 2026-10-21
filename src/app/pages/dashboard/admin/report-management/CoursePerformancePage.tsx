import { useApi } from "../../../../hooks/useApi";
import { getCoursePerformance } from "../../../../api/auth/admin/reports";
import "./CoursesPage.css";

export default function CoursePerformancePage() {
  const { data, loading, error } = useApi(() => getCoursePerformance());

  if (loading) return <div className="default-page">Loading…</div>;
  if (error) return <div className="default-page" style={{ color: "red" }}>{error}</div>;

  return (
    <div className="default-page">
      <div className="courses-header">
        <div>
          <h1>Course Performance</h1>
          <p>Enrollment metrics for your courses</p>
        </div>
      </div>

      <div className="courses-table-container">
        <table className="courses-table">
          <thead>
            <tr>
              <th>Course Name</th>
              <th>Enrolled Students</th>
              <th>Completed</th>
              <th>Avg Score</th>
            </tr>
          </thead>
          <tbody>
            {(data ?? []).map((c) => (
              <tr key={c.course_id}>
                <td className="course-name">{c.course_name}</td>
                <td>{c.enrolled}</td>
                <td>{c.completed}</td>
                <td>{c.avg_score ? `${c.avg_score}%` : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}