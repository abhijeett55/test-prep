import { useApi } from "../../../../hooks/useApi";
import { getTeacherComparison } from "../../../../api/auth/admin/reports";
import "../DefaultPage.css";

export default function TeacherComparisonPage() {
  const { data, loading, error } = useApi(() => getTeacherComparison([]));

  if (loading) return <div className="default-page">Loading…</div>;
  if (error) return <div className="default-page" style={{ color: "red" }}>{error}</div>;

  return (
    <div className="default-page">
      <div className="courses-header">
        <div>
          <h1>Teacher Comparison</h1>
          <p>Overview of teachers and their assignments</p>
        </div>
      </div>

      <div className="courses-table-container">
        <table className="courses-table">
          <thead>
            <tr>
              <th>Teacher Name</th>
              <th>Subjects</th>
              <th>Students</th>
              <th>Avg Score</th>
            </tr>
          </thead>
          <tbody>
            {(data ?? []).map((t) => (
              <tr key={t.teacher_id}>
                <td className="course-name">{t.full_name}</td>
                <td>{t.subject_count}</td>
                <td>{t.student_count}</td>
                <td>{t.avg_score ? `${t.avg_score}%` : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}