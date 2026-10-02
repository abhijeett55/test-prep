import "./Performance.css";

interface ClassPerformanceRow {
  classId: string;
  className: string;
  students: number;
  testsConducted: number;
  avgScore: number;
  highestScore: number;
  lowestScore: number;
  passRate: number;
}

const rows: ClassPerformanceRow[] = [
  { classId: "CLS-001", className: "Class 10 - A", students: 45, testsConducted: 8, avgScore: 78, highestScore: 98, lowestScore: 41, passRate: 91 },
  { classId: "CLS-002", className: "Class 10 - B", students: 38, testsConducted: 7, avgScore: 64, highestScore: 92, lowestScore: 28, passRate: 79 },
  { classId: "CLS-003", className: "Class 9 - A", students: 52, testsConducted: 6, avgScore: 55, highestScore: 89, lowestScore: 22, passRate: 68 },
  { classId: "CLS-004", className: "Class 9 - B", students: 41, testsConducted: 6, avgScore: 71, highestScore: 95, lowestScore: 35, passRate: 85 },
];

const barClass = (v: number) => (v < 60 ? "low" : v < 75 ? "mid" : "");

export default function ClassPerformance() {
  return (
    <div className="perf-page">
      <div className="perf-header">
        <div>
          <h1>Class Performance</h1>
          <p>How each of your classes is performing</p>
        </div>
      </div>

      <div className="perf-table-container">
        <table className="perf-table">
          <thead>
            <tr>
              <th>Class ID</th>
              <th>Class Name</th>
              <th>Students</th>
              <th>Tests Conducted</th>
              <th>Average Score</th>
              <th>Highest</th>
              <th>Lowest</th>
              <th>Pass Rate</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.classId}>
                <td className="perf-id">{r.classId}</td>
                <td className="perf-strong">{r.className}</td>
                <td>{r.students}</td>
                <td>{r.testsConducted}</td>
                <td>
                  <div className="perf-progress">
                    <div className="perf-progress-track">
                      <div
                        className={`perf-progress-fill ${barClass(r.avgScore)}`}
                        style={{ width: `${r.avgScore}%` }}
                      />
                    </div>
                    <span className="perf-progress-text">{r.avgScore}%</span>
                  </div>
                </td>
                <td>{r.highestScore}%</td>
                <td>{r.lowestScore}%</td>
                <td>{r.passRate}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}