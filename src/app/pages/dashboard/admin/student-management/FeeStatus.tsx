import { useState } from "react";
import Card, { CardRow, type CardTone } from "../../../../components/Card/Card";
import { useApi } from "../../../../hooks/useApi";
import {
  listFees,
  sendFeeReminder,
  type FeeRow,
  type FeeStatusValue,
} from "../../../../api/auth/admin/students";
import { errorMessage } from "../../../../api/client";
import "../DefaultPage.css";

const rupees = (n: number) => `₹${Number(n).toLocaleString("en-IN")}`;

const tone: Record<FeeStatusValue, CardTone> = {
  PAID: "success",
  PARTIAL: "warning",
  PENDING: "danger",
  OVERDUE: "danger",
};

const label: Record<FeeStatusValue, string> = {
  PAID: "Paid",
  PARTIAL: "Partial",
  PENDING: "Pending",
  OVERDUE: "Overdue",
};

const barClass: Record<FeeStatusValue, string> = {
  PAID: "",
  PARTIAL: "mid",
  PENDING: "low",
  OVERDUE: "low",
};

const filters = ["All", "PAID", "PARTIAL", "PENDING", "OVERDUE"] as const;
type Filter = (typeof filters)[number];

export default function FeeStatus() {
  const [filter, setFilter] = useState<Filter>("All");
  const { data, loading, error } = useApi(() => listFees());
  const [busyId, setBusyId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const visible = (data ?? []).filter(
    (s) => filter === "All" || s.status === filter
  );

  const handleReminder = async (s: FeeRow) => {
    setBusyId(s.student_id);
    try {
      await sendFeeReminder(s.student_id);
      setToast(`Reminder sent to ${s.student_name}`);
      window.setTimeout(() => setToast(null), 2500);
    } catch (e) {
      setToast(`Failed: ${errorMessage(e)}`);
      window.setTimeout(() => setToast(null), 4000);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="perf-page">
      <div className="perf-header">
        <div>
          <h1>Fee Status</h1>
          <p>Fee payment status of your students</p>
        </div>
      </div>

      {error && (
        <div
          className="perf-success"
          style={{ background: "#fdeaea", color: "#c62f2f" }}
        >
          {error}
        </div>
      )}
      {toast && <div className="perf-success">{toast}</div>}

      <div className="perf-filters">
        <select
          className="perf-select"
          value={filter}
          onChange={(e) => setFilter(e.target.value as Filter)}
        >
          {filters.map((f) => (
            <option key={f} value={f}>
              {f === "All" ? "All Statuses" : label[f]}
            </option>
          ))}
        </select>
      </div>

      {loading && <p className="profile-loading">Loading…</p>}

      <div className="card-grid">
        {visible.map((s) => {
          const pct = s.total_fee
            ? Math.round((s.paid / s.total_fee) * 100)
            : 0;
          const busy = busyId === s.student_id;

          return (
            <Card
              key={s.student_id}
              title={s.student_name}
              subtitle={`${s.student_id}${s.batch_name ? ` · ${s.batch_name}` : ""}`}
              badge={{ label: label[s.status], tone: tone[s.status] }}
              footer={
                s.status !== "PAID" && (
                  <button
                    className="perf-btn outline"
                    disabled={busy}
                    onClick={() => handleReminder(s)}
                  >
                    {busy ? "Sending…" : "Send Reminder"}
                  </button>
                )
              }
            >
              <div className="perf-progress">
                <div className="perf-progress-track">
                  <div
                    className={`perf-progress-fill ${barClass[s.status]}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="perf-progress-text">{pct}%</span>
              </div>
              <CardRow label="Total fee" value={rupees(s.total_fee)} />
              <CardRow label="Paid" value={rupees(s.paid)} />
              <CardRow label="Pending" value={rupees(s.total_fee - s.paid)} />
              <CardRow label="Due date" value={s.due_date ?? "—"} />
            </Card>
          );
        })}

        {!loading && visible.length === 0 && (
          <div className="card-empty">No students found</div>
        )}
      </div>
    </div>
  );
}