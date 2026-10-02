import "./Performance.css";

interface Report {
  reportId: string;
  title: string;
  description: string;
  type: string;
  generatedAt: string;
  headers: string[];
  rows: (string | number)[][];
}

const reports: Report[] = [
  {
    reportId: "RPT-001",
    title: "Class Performance Report",
    description: "Average scores and pass rates for each class",
    type: "Class",
    generatedAt: "02 Oct 2026",
    headers: ["Class", "Students", "Avg Score %", "Pass Rate %"],
    rows: [
      ["Class 10 - A", 45, 78, 91],
      ["Class 10 - B", 38, 64, 79],
      ["Class 9 - A", 52, 55, 68],
      ["Class 9 - B", 41, 71, 85],
    ],
  },
  {
    reportId: "RPT-002",
    title: "Student Performance Report",
    description: "Individual scores and tests taken per student",
    type: "Student",
    generatedAt: "02 Oct 2026",
    headers: ["Student", "Class", "Tests Taken", "Avg Score %"],
    rows: [
      ["Aarav Sharma", "Class 10 - A", 8, 86],
      ["Diya Verma", "Class 10 - B", 7, 72],
      ["Rohan Patel", "Class 9 - A", 6, 54],
      ["Ananya Singh", "Class 9 - B", 6, 79],
    ],
  },
  {
    reportId: "RPT-003",
    title: "Weak Topics Report",
    description: "Topics with the lowest accuracy across batches",
    type: "Topics",
    generatedAt: "30 Sep 2026",
    headers: ["Topic", "Subject", "Batch", "Accuracy %"],
    rows: [
      ["Quadratic Equations", "Mathematics", "Class 10 - A", 42],
      ["Trigonometry", "Mathematics", "Class 10 - B", 51],
      ["Chemical Reactions", "Science", "Class 10 - B", 58],
    ],
  },
  {
    reportId: "RPT-004",
    title: "Attempt History Report",
    description: "Every test attempt with score and result",
    type: "Attempts",
    generatedAt: "28 Sep 2026",
    headers: ["Student", "Test", "Score", "Result"],
    rows: [
      ["Aarav Sharma", "Algebra Unit Test", "42/50", "Passed"],
      ["Diya Verma", "Chemical Reactions Quiz", "18/40", "Passed"],
      ["Rohan Patel", "Linear Equations Test", "14/30", "Failed"],
    ],
  },
];

const escapeCell = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;

function downloadCsv(report: Report) {
  const csv = [report.headers, ...report.rows]
    .map((row) => row.map(escapeCell).join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${report.title.replace(/\s+/g, "_")}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export default function DownloadReports() {
  return (
    <div className="perf-page">
      <div className="perf-header">
        <div>
          <h1>Download Reports</h1>
          <p>Export your class and student data as CSV</p>
        </div>
      </div>

      <div className="perf-table-container">
        <table className="perf-table">
          <thead>
            <tr>
              <th>Report ID</th>
              <th>Report Name</th>
              <th>Description</th>
              <th>Type</th>
              <th>Generated At</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((r) => (
              <tr key={r.reportId}>
                <td className="perf-id">{r.reportId}</td>
                <td className="perf-strong">{r.title}</td>
                <td>{r.description}</td>
                <td>
                  <span className="perf-badge">{r.type}</span>
                </td>
                <td>{r.generatedAt}</td>
                <td>
                  <button className="perf-btn" onClick={() => downloadCsv(r)}>
                    Download CSV
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}