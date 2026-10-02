import { useState } from "react";
import "../reports/Performance.css";

type TestStatus = "Upcoming" | "Ongoing" | "Completed";

interface ScheduledTest {
  testId: string;
  testName: string;
  className: string;
  subject: string;
  date: string;
  startTime: string;
  duration: string;
  totalMarks: number;
  status: TestStatus;
}

const tests: ScheduledTest[] = [
  { testId: "TST-001", testName: "Algebra Unit Test", className: "Class 10 - A", subject: "Mathematics", date: "02 Oct 2026", startTime: "10:00 AM", duration: "60 min", totalMarks: 50, status: "Ongoing" },
  { testId: "TST-002", testName: "Chemical Reactions Quiz", className: "Class 10 - B", subject: "Science", date: "05 Oct 2026", startTime: "11:30 AM", duration: "45 min", totalMarks: 40, status: "Upcoming" },
  { testId: "TST-003", testName: "Linear Equations Test", className: "Class 9 - A", subject: "Mathematics", date: "08 Oct 2026", startTime: "09:00 AM", duration: "90 min", totalMarks: 60, status: "Upcoming" },
  { testId: "TST-004", testName: "Motion and Force Test", className: "Class 9 - B", subject: "Science", date: "25 Sep 2026", startTime: "02:00 PM", duration: "60 min", totalMarks: 40, status: "Completed" },
];

const statusClass: Record<TestStatus, string> = {
  Upcoming: "",
  Ongoing: "warning",
  Completed: "success",
};

const filters = ["All", "Upcoming", "Ongoing", "Completed"] as const;

export default function MyScheduledTests() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");

  const count = (s: TestStatus) => tests.filter((t) => t.status === s).length;
  const visible = filter === "All" ? tests : tests.filter((t) => t.status === filter);

  return (
    <div className="perf-page">
      <div className="perf-header">
        <div>
          <h1>My Scheduled Tests</h1>
          <p>Tests you have scheduled for your classes</p>
        </div>
      </div>

      <div className="perf-summary">
        <div className="perf-card">
          <div className="perf-card-label">Total Tests</div>
          <div className="perf-card-value">{tests.length}</div>
        </div>
        <div className="perf-card">
          <div className="perf-card-label">Upcoming</div>
          <div className="perf-card-value">{count("Upcoming")}</div>
        </div>
        <div className="perf-card">
          <div className="perf-card-label">Ongoing</div>
          <div className="perf-card-value">{count("Ongoing")}</div>
        </div>
        <div className="perf-card">
          <div className="perf-card-label">Completed</div>
          <div className="perf-card-value">{count("Completed")}</div>
        </div>
      </div>

      <div className="perf-filters">
        <select
          className="perf-select"
          value={filter}
          onChange={(e) => setFilter(e.target.value as (typeof filters)[number])}
        >
          {filters.map((f) => (
            <option key={f} value={f}>
              {f === "All" ? "All Statuses" : f}
            </option>
          ))}
        </select>
      </div>

      <div className="perf-table-container">
        <table className="perf-table">
          <thead>
            <tr>
              <th>Test ID</th>
              <th>Test Name</th>
              <th>Class</th>
              <th>Subject</th>
              <th>Date</th>
              <th>Start Time</th>
              <th>Duration</th>
              <th>Total Marks</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((t) => (
              <tr key={t.testId}>
                <td className="perf-id">{t.testId}</td>
                <td className="perf-strong">{t.testName}</td>
                <td>
                  <span className="perf-badge">{t.className}</span>
                </td>
                <td>{t.subject}</td>
                <td>{t.date}</td>
                <td>{t.startTime}</td>
                <td>{t.duration}</td>
                <td>{t.totalMarks}</td>
                <td>
                  <span className={`perf-badge ${statusClass[t.status]}`}>
                    {t.status}
                  </span>
                </td>
              </tr>
            ))}
            {visible.length === 0 && (
              <tr>
                <td colSpan={9} style={{ textAlign: "center", color: "#6b7280" }}>
                  No tests found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}