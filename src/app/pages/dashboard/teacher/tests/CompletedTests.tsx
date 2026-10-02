import "./Performance.css";

interface CompletedTest {
  testId: string;
  testName: string;
  className: string;
  subject: string;
  conductedOn: string;
  attempted: number;
  totalStudents: number;
  avgScore: number;
  passRate: number;
}

const tests: CompletedTest[] = [
  { testId: "TST-004", testName: "Motion and Force Test", className: "Class 9 - B", subject: "Science", conductedOn: "25 Sep 2026", attempted: 39, totalStudents: 41, avgScore: 71, passRate: 85 },
  { testId: "TST-006", testName: "Number Systems Test", className: "Class 9 - A", subject: "Mathematics", conductedOn: "18 Sep 2026", attempted: 48, totalStudents: 52, avgScore: 55, passRate: 68 },
  { testId: "TST-007", testName: "Light and Reflection Quiz", className: "Class 10 - B", subject: "Science", conductedOn: "12 Sep 2026", attempted: 36, totalStudents: 38, avgScore: 64, passRate: 79 },
];

const barClass = (v: number) => (v < 60 ? "low" : v < 75 ? "mid" : "");

export default function CompletedTests() {
  return (
    <div className="perf-page">
      <div className="perf-header">
        <div>
          <h1>Completed Tests</h1>
          <p>Tests that have already been conducted</p>
        </div>
      </div>

      <div className="perf-table-container">
        <table className="perf-table">
          <thead>
            <tr>
              <th>Test ID</th>
              <th>Test Name</th>
              <th>Class</th>
              <th>Subject</th>
              <th>Conducted On</th>
              <th>Attempted</th>
              <th>Average Score</th>
              <th>Pass Rate</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {tests.map((t) => (
              <tr key={t.testId}>
                <td className="perf-id">{t.testId}</td>
                <td className="perf-strong">{t.testName}</td>
                <td><span className="perf-badge">{t.className}</span></td>
                <td>{t.subject}</td>
                <td>{t.conductedOn}</td>
                <td>{t.attempted} / {t.totalStudents}</td>
                <td>
                  <div className="perf-progress">
                    <div className="perf-progress-track">
                      <div
                        className={`perf-progress-fill ${barClass(t.avgScore)}`}
                        style={{ width: `${t.avgScore}%` }}
                      />
                    </div>
                    <span className="perf-progress-text">{t.avgScore}%</span>
                  </div>
                </td>
                <td>{t.passRate}%</td>
                <td>
                  <button className="perf-btn outline">View Results</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}