import "./Performance.css";

interface Attempt {
  attemptId: string;
  student: string;
  testName: string;
  batch: string;
  attemptedAt: string;
  score: number;
  totalMarks: number;
  passMarks: number;
}

const attempts: Attempt[] = [
  { attemptId: "ATT-001", student: "Aarav Sharma", testName: "Algebra Unit Test", batch: "Class 10 - A", attemptedAt: "02 Oct 2026", score: 42, totalMarks: 50, passMarks: 20 },
  { attemptId: "ATT-002", student: "Diya Verma", testName: "Chemical Reactions Quiz", batch: "Class 10 - B", attemptedAt: "30 Sep 2026", score: 18, totalMarks: 40, passMarks: 16 },
  { attemptId: "ATT-003", student: "Rohan Patel", testName: "Linear Equations Test", batch: "Class 9 - A", attemptedAt: "28 Sep 2026", score: 14, totalMarks: 30, passMarks: 15 },
  { attemptId: "ATT-004", student: "Ananya Singh", testName: "Motion and Force Test", batch: "Class 9 - B", attemptedAt: "25 Sep 2026", score: 33, totalMarks: 40, passMarks: 16 },
];

export default function AttemptHistory() {
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
            {attempts.map((a) => {
              const passed = a.score >= a.passMarks;
              return (
                <tr key={a.attemptId}>
                  <td className="perf-id">{a.attemptId}</td>
                  <td className="perf-strong">{a.student}</td>
                  <td>{a.testName}</td>
                  <td>
                    <span className="perf-badge">{a.batch}</span>
                  </td>
                  <td>{a.attemptedAt}</td>
                  <td className="perf-strong">
                    {a.score} / {a.totalMarks}
                  </td>
                  <td>
                    <span className={`perf-badge ${passed ? "success" : "danger"}`}>
                      {passed ? "Passed" : "Failed"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}