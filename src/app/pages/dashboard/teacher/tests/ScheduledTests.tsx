import { useState } from "react";
import "./Performance.css";

interface ScheduledTest {
  testId: string;
  testName: string;
  className: string;
  subject: string;
  date: string;
  startTime: string;
  duration: string;
  totalMarks: number;
}

const initialTests: ScheduledTest[] = [
  { testId: "TST-002", testName: "Chemical Reactions Quiz", className: "Class 10 - B", subject: "Science", date: "05 Oct 2026", startTime: "11:30 AM", duration: "45 min", totalMarks: 40 },
  { testId: "TST-003", testName: "Linear Equations Test", className: "Class 9 - A", subject: "Mathematics", date: "08 Oct 2026", startTime: "09:00 AM", duration: "90 min", totalMarks: 60 },
  { testId: "TST-005", testName: "Trigonometry Test", className: "Class 10 - A", subject: "Mathematics", date: "12 Oct 2026", startTime: "10:00 AM", duration: "60 min", totalMarks: 50 },
];

export default function ScheduledTests() {
  const [tests, setTests] = useState(initialTests);

  const handleCancel = (id: string) => {
    if (!window.confirm("Cancel this scheduled test?")) return;
    // TODO: call cancel API
    setTests(tests.filter((t) => t.testId !== id));
  };

  return (
    <div className="perf-page">
      <div className="perf-header">
        <div>
          <h1>Scheduled Tests</h1>
          <p>Upcoming tests scheduled for your classes</p>
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
              <th>Date</th>
              <th>Start Time</th>
              <th>Duration</th>
              <th>Total Marks</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tests.map((t) => (
              <tr key={t.testId}>
                <td className="perf-id">{t.testId}</td>
                <td className="perf-strong">{t.testName}</td>
                <td><span className="perf-badge">{t.className}</span></td>
                <td>{t.subject}</td>
                <td>{t.date}</td>
                <td>{t.startTime}</td>
                <td>{t.duration}</td>
                <td>{t.totalMarks}</td>
                <td>
                  <div className="perf-actions">
                    <button className="perf-btn outline">Edit</button>
                    <button className="perf-btn danger-outline" onClick={() => handleCancel(t.testId)}>
                      Cancel
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {tests.length === 0 && (
              <tr>
                <td colSpan={9} style={{ textAlign: "center", color: "#6b7280" }}>
                  No upcoming tests
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}