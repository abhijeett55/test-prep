import { useApi } from "../../../../hooks/useApi";
import { getMyBatchAnalytics } from "../../../../api/auth/teacher/teacher";
import "./Performance.css";

const barClass = (v: number) => (v < 60 ? "low" : v < 75 ? "mid" : "");

export default function BatchAnalytics() {
  const { data: batches, loading, error } = useApi(() => getMyBatchAnalytics());

  if (loading) return <div className="perf-page">Loading analytics…</div>;
  if (error) return <div className="perf-page" style={{ color: "red" }}>{error}</div>;

  const validBatches = batches ?? [];
  const totalStudents = validBatches.reduce((s, b) => s + b.students, 0);
  
  const avgScores = validBatches.filter(b => b.avgScore !== null).map(b => b.avgScore!);
  const overallAvg = avgScores.length ? Math.round(avgScores.reduce((a, b) => a + b, 0) / avgScores.length) : 0;

  const passRates = validBatches.filter(b => b.passRate !== null).map(b => b.passRate!);
  const overallPass = passRates.length ? Math.round(passRates.reduce((a, b) => a + b, 0) / passRates.length) : 0;

  return (
    <div className="perf-page">
      <div className="perf-header">
        <div>
          <h1>Batch-wise Analytics</h1>
          <p>Performance overview across your batches</p>
        </div>
      </div>

      <div className="perf-summary">
        <div className="perf-card">
          <div className="perf-card-label">Total Batches</div>
          <div className="perf-card-value">{validBatches.length}</div>
        </div>
        <div className="perf-card">
          <div className="perf-card-label">Total Students</div>
          <div className="perf-card-value">{totalStudents}</div>
        </div>
        <div className="perf-card">
          <div className="perf-card-label">Average Score</div>
          <div className="perf-card-value">{overallAvg}%</div>
        </div>
        <div className="perf-card">
          <div className="perf-card-label">Average Pass Rate</div>
          <div className="perf-card-value">{overallPass}%</div>
        </div>
      </div>

      <div className="perf-table-container">
        <table className="perf-table">
          <thead>
            <tr>
              <th>Batch ID</th>
              <th>Batch Name</th>
              <th>Students</th>
              <th>Tests Conducted</th>
              <th>Average Score</th>
              <th>Pass Rate</th>
              <th>Top Scorer</th>
            </tr>
          </thead>
          <tbody>
            {validBatches.map((b) => (
              <tr key={b.batchId}>
                <td className="perf-id">{b.batchId}</td>
                <td className="perf-strong">{b.batchName}</td>
                <td>{b.students}</td>
                <td>{b.testsConducted}</td>
                <td>
                  {b.avgScore !== null ? (
                    <div className="perf-progress">
                      <div className="perf-progress-track">
                        <div className={`perf-progress-fill ${barClass(b.avgScore)}`} style={{ width: `${b.avgScore}%` }} />
                      </div>
                      <span className="perf-progress-text">{b.avgScore}%</span>
                    </div>
                  ) : "—"}
                </td>
                <td>{b.passRate !== null ? `${b.passRate}%` : "—"}</td>
                <td>{b.topScorer || "—"}</td>
              </tr>
            ))}
            {validBatches.length === 0 && (
              <tr><td colSpan={7} style={{ textAlign: "center", padding: 24 }}>No batches assigned.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}