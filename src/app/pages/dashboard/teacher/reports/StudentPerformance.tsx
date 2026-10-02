import { useState } from "react";
import "./Performance.css";

interface StudentPerformanceRow {
  studentId: string;
  name: string;
  className: string;
  testsTaken: number;
  avgScore: number;
  bestSubject: string;
  weakSubject: string;
}

const students: StudentPerformanceRow[] = [
  { studentId: "STU-001", name: "Aarav Sharma", className: "Class 10 - A", testsTaken: 8, avgScore: 86, bestSubject: "Mathematics", weakSubject: "Science" },
  { studentId: "STU-002", name: "Diya Verma", className: "Class 10 - B", testsTaken: 7, avgScore: 72, bestSubject: "Science", weakSubject: "Mathematics" },
  { studentId: "STU-003", name: "Rohan Patel", className: "Class 9 - A", testsTaken: 6, avgScore: 54, bestSubject: "Science", weakSubject: "Mathematics" },
  { studentId: "STU-004", name: "Ananya Singh", className: "Class 9 - B", testsTaken: 6, avgScore: 79, bestSubject: "Mathematics", weakSubject: "Science" },
];

const barClass = (v: number) => (v < 60 ? "low" : v < 75 ? "mid" : "");

export default function StudentPerformance() {
  const [classFilter, setClassFilter] = useState("All");

  const classes = ["All", ...Array.from(new Set(students.map((s) => s.className)))];
  const visible =
    classFilter === "All"
      ? students
      : students.filter((s) => s.className === classFilter);

  return (
    <div className="perf-page">
      <div className="perf-header">
        <div>
          <h1>Student Performance</h1>
          <p>Individual performance of your students</p>
        </div>
      </div>

      <div className="perf-filters">
        <select
          className="perf-select"
          value={classFilter}
          onChange={(e) => setClassFilter(e.target.value)}
        >
          {classes.map((c) => (
            <option key={c} value={c}>
              {c === "All" ? "All Classes" : c}
            </option>
          ))}
        </select>
      </div>

      <div className="perf-table-container">
        <table className="perf-table">
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Student Name</th>
              <th>Class</th>
              <th>Tests Taken</th>
              <th>Average Score</th>
              <th>Best Subject</th>
              <th>Weak Subject</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((s) => (
              <tr key={s.studentId}>
                <td className="perf-id">{s.studentId}</td>
                <td className="perf-strong">{s.name}</td>
                <td>
                  <span className="perf-badge">{s.className}</span>
                </td>
                <td>{s.testsTaken}</td>
                <td>
                  <div className="perf-progress">
                    <div className="perf-progress-track">
                      <div
                        className={`perf-progress-fill ${barClass(s.avgScore)}`}
                        style={{ width: `${s.avgScore}%` }}
                      />
                    </div>
                    <span className="perf-progress-text">{s.avgScore}%</span>
                  </div>
                </td>
                <td>
                  <span className="perf-badge success">{s.bestSubject}</span>
                </td>
                <td>
                  <span className="perf-badge warning">{s.weakSubject}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}