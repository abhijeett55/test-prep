import { useApi } from "../../../../hooks/useApi";
import { getMyAttempts } from "../../../../api/auth/teacher/teacher";
import "./Performance.css";

export default function AttemptHistory() {
  const { data: attempts, loading, error } = useApi(() => getMyAttempts());

  if (loading) return <div className="perf-page">Loading attempts…</div>;
  if (error) return <div className="perf-page" style={{ color: "red" }}>{error}</div>;

  return (
    <div className="perf-page">
      <div className="perf-header">
        <div>
          <h1>Attempt History</h1>
          <p>All test attempts by your students</p>
        </div>
      </div>

      <div className="perf-table-container">
        <table className="perf-table">
          <thead>
            <tr>
              <th>Attempt ID</th>
              <th>Student</th>
              <th>Test Name</th>
              <th>Batch</th>
              <th>Attempted At</th>
              <th>Score</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>
            {(attempts ?? []).map((a) => {
              const passed = a.score >= a.passMarks;
              return (
                <tr key={a.attemptId}>
                  <td className="perf-id">{a.attemptId}</td>
                  <td className="perf-strong">{a.student}</td>
                  <td>{a.testName}</td>
                  <td><span className="perf-badge">{a.batch}</span></td>
                  <td>{a.attemptedAt}</td>
                  <td className="perf-strong">{a.score} / {a.totalMarks}</td>
                  <td>
                    <span className={`perf-badge ${passed ? "success" : "danger"}`}>
                      {passed ? "Passed" : "Failed"}
                    </span>
                  </td>
                </tr>
              );
            })}
            {attempts?.length === 0 && (
              <tr><td colSpan={7} style={{ textAlign: "center", padding: 24 }}>No attempts found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}