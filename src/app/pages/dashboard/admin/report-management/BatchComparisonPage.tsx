import { useApi } from "../../../../hooks/useApi";
import { getBatchComparison } from "../../../../api/auth/admin/reports";
import "./CoursesPage.css";

export default function BatchComparisonPage() {
  const { data, loading, error } = useApi(() => getBatchComparison([]));

  if (loading) return <div className="default-page">Loading…</div>;
  if (error) return <div className="default-page" style={{ color: "red" }}>{error}</div>;

  return (
    <div className="default-page">
      <div className="courses-header">
        <div>
          <h1>Batch Comparison</h1>
          <p>Student enrollment across your batches</p>
        </div>
      </div>

      <div className="courses-table-container">
        <table className="courses-table">
          <thead>
            <tr>
              <th>Batch Name</th>
              <th>Student Count</th>
              <th>Avg Score</th>
              <th>Pass Rate</th>
            </tr>
          </thead>
          <tbody>
            {(data ?? []).map((b) => (
              <tr key={b.batch_id}>
                <td className="course-name">{b.batch_name}</td>
                <td>{b.student_count}</td>
                <td>{b.avg_score ? `${b.avg_score}%` : "—"}</td>
                <td>{b.pass_rate ? `${b.pass_rate}%` : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}