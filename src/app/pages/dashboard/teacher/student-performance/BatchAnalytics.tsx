import "./Performance.css";

interface Batch {
  batchId: string;
  batchName: string;
  students: number;
  testsConducted: number;
  avgScore: number;
  passRate: number;
  topScorer: string;
}

const batches: Batch[] = [
  { batchId: "BCH-001", batchName: "Class 10 - A", students: 45, testsConducted: 8, avgScore: 78, passRate: 91, topScorer: "Aarav Sharma" },
  { batchId: "BCH-002", batchName: "Class 10 - B", students: 38, testsConducted: 7, avgScore: 64, passRate: 79, topScorer: "Diya Verma" },
  { batchId: "BCH-003", batchName: "Class 9 - A", students: 52, testsConducted: 6, avgScore: 55, passRate: 68, topScorer: "Rohan Patel" },
  { batchId: "BCH-004", batchName: "Class 9 - B", students: 41, testsConducted: 6, avgScore: 71, passRate: 85, topScorer: "Ananya Singh" },
];

const barClass = (v: number) => (v < 60 ? "low" : v < 75 ? "mid" : "");

export default function BatchAnalytics() {
  const totalStudents = batches.reduce((s, b) => s + b.students, 0);
  const overallAvg = Math.round(
    batches.reduce((s, b) => s + b.avgScore, 0) / batches.length
  );
  const overallPass = Math.round(
    batches.reduce((s, b) => s + b.passRate, 0) / batches.length
  );

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
          <div className="perf-card-value">{batches.length}</div>
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
            {batches.map((b) => (
              <tr key={b.batchId}>
                <td className="perf-id">{b.batchId}</td>
                <td className="perf-strong">{b.batchName}</td>
                <td>{b.students}</td>
                <td>{b.testsConducted}</td>
                <td>
                  <div className="perf-progress">
                    <div className="perf-progress-track">
                      <div
                        className={`perf-progress-fill ${barClass(b.avgScore)}`}
                        style={{ width: `${b.avgScore}%` }}
                      />
                    </div>
                    <span className="perf-progress-text">{b.avgScore}%</span>
                  </div>
                </td>
                <td>{b.passRate}%</td>
                <td>{b.topScorer}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}