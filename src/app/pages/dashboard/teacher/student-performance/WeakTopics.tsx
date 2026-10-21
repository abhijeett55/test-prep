import { useApi } from "../../../../hooks/useApi";
import { getMyWeakTopics } from "../../../../api/auth/teacher/teacher";
import "./Performance.css";

const level = (a: number) =>
  a < 50 ? { label: "Critical", cls: "danger", bar: "low" }
  : a < 65 ? { label: "Needs Attention", cls: "warning", bar: "mid" }
  : { label: "Moderate", cls: "", bar: "" };

export default function WeakTopics() {
  const { data: topics, loading, error } = useApi(() => getMyWeakTopics());

  if (loading) return <div className="perf-page">Loading topics…</div>;
  if (error) return <div className="perf-page" style={{ color: "red" }}>{error}</div>;

  return (
    <div className="perf-page">
      <div className="perf-header">
        <div>
          <h1>Weak Topics</h1>
          <p>Topics where students are scoring lowest</p>
        </div>
      </div>

      <div className="perf-table-container">
        <table className="perf-table">
          <thead>
            <tr>
              <th>Topic ID</th>
              <th>Topic</th>
              <th>Subject</th>
              <th>Batch</th>
              <th>Accuracy</th>
              <th>Students Struggling</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {(topics ?? []).map((t) => {
              const lv = level(t.accuracy);
              return (
                <tr key={t.topicId}>
                  <td className="perf-id">{t.topicId}</td>
                  <td className="perf-strong">{t.topic}</td>
                  <td><span className="perf-badge">{t.subject}</span></td>
                  <td>{t.batch}</td>
                  <td>
                    <div className="perf-progress">
                      <div className="perf-progress-track">
                        <div className={`perf-progress-fill ${lv.bar}`} style={{ width: `${t.accuracy}%` }} />
                      </div>
                      <span className="perf-progress-text">{t.accuracy}%</span>
                    </div>
                  </td>
                  <td>{t.studentsStruggling}</td>
                  <td><span className={`perf-badge ${lv.cls}`}>{lv.label}</span></td>
                </tr>
              );
            })}
            {topics?.length === 0 && (
              <tr><td colSpan={7} style={{ textAlign: "center", padding: 24 }}>No weak topics found. Great job!</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}