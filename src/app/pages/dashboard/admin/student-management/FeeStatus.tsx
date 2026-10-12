import { useState } from "react";
import Card, { CardRow, type CardTone } from "../../../../components/Card/Card";
import "./Performance.css";

interface StudentFee {
  studentId: string;
  name: string;
  className: string;
  totalFee: number;
  paid: number;
  dueDate: string;
}

const students: StudentFee[] = [
  { studentId: "STU-001", name: "Aarav Sharma", className: "Class 10 - A", totalFee: 45000, paid: 45000, dueDate: "15 Oct 2026" },
  { studentId: "STU-002", name: "Diya Verma", className: "Class 10 - B", totalFee: 45000, paid: 22500, dueDate: "15 Oct 2026" },
  { studentId: "STU-003", name: "Rohan Patel", className: "Class 9 - A", totalFee: 40000, paid: 0, dueDate: "10 Oct 2026" },
  { studentId: "STU-004", name: "Ananya Singh", className: "Class 9 - B", totalFee: 40000, paid: 30000, dueDate: "20 Oct 2026" },
];

const rupees = (n: number) => `₹${n.toLocaleString("en-IN")}`;

function status(s: StudentFee): { label: string; tone: CardTone; bar: string } {
  if (s.paid >= s.totalFee) return { label: "Paid", tone: "success", bar: "" };
  if (s.paid === 0) return { label: "Pending", tone: "danger", bar: "low" };
  return { label: "Partial", tone: "warning", bar: "mid" };
}

const filters = ["All", "Paid", "Partial", "Pending"] as const;

export default function FeeStatus() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");

  const visible = students.filter((s) => filter === "All" || status(s).label === filter);

  const handleReminder = (name: string) => {
    // TODO: call send-reminder API
    window.alert(`Reminder sent to ${name}`);
  };

  return (
    <div className="perf-page">
      <div className="perf-header">
        <div>
          <h1>Fee Status</h1>
          <p>Fee payment status of your students</p>
        </div>
      </div>

      <div className="perf-filters">
        <select
          className="perf-select"
          value={filter}
          onChange={(e) => setFilter(e.target.value as (typeof filters)[number])}
        >
          {filters.map((f) => (
            <option key={f} value={f}>{f === "All" ? "All Statuses" : f}</option>
          ))}
        </select>
      </div>

      <div className="card-grid">
        {visible.map((s) => {
          const st = status(s);
          const pct = Math.round((s.paid / s.totalFee) * 100);
          return (
            <Card
              key={s.studentId}
              title={s.name}
              subtitle={`${s.studentId} · ${s.className}`}
              badge={{ label: st.label, tone: st.tone }}
              footer={
                st.label !== "Paid" && (
                  <button className="perf-btn outline" onClick={() => handleReminder(s.name)}>
                    Send Reminder
                  </button>
                )
              }
            >
              <div className="perf-progress">
                <div className="perf-progress-track">
                  <div className={`perf-progress-fill ${st.bar}`} style={{ width: `${pct}%` }} />
                </div>
                <span className="perf-progress-text">{pct}%</span>
              </div>
              <CardRow label="Total fee" value={rupees(s.totalFee)} />
              <CardRow label="Paid" value={rupees(s.paid)} />
              <CardRow label="Pending" value={rupees(s.totalFee - s.paid)} />
              <CardRow label="Due date" value={s.dueDate} />
            </Card>
          );
        })}

        {visible.length === 0 && <div className="card-empty">No students found</div>}
      </div>
    </div>
  );
}