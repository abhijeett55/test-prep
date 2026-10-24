import { useState } from "react";
import Card, { CardRow } from "../../../../components/Card/Card";
import { useApi } from "../../../../hooks/useApi";
import {
  listEnrollmentRequests,
  decideEnrollmentRequest,
} from "../../../../api/auth/admin/students";
import { errorMessage } from "../../../../api/client";
import "../DefaultPage.css";

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export default function Enrollment() {
  const { data, loading, error, reload } = useApi(listEnrollmentRequests);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const decide = async (id: string, status: "APPROVED" | "REJECTED") => {
    if (status === "REJECTED" && !window.confirm("Reject this enrollment request?")) {
      return;
    }
    setBusyId(id);
    setActionError(null);
    try {
      await decideEnrollmentRequest(id, status);
      await reload();   // refetch so counters and list stay in sync
    } catch (e) {
      setActionError(errorMessage(e));
    } finally {
      setBusyId(null);
    }
  };

  const pending = data?.requests ?? [];

  return (
    <div className="perf-page">
      <div className="perf-header">
        <div>
          <h1>Enrollment</h1>
          <p>Review and approve new student enrollment requests</p>
        </div>
      </div>

      {(error || actionError) && (
        <div
          className="perf-success"
          style={{ background: "#fdeaea", color: "#c62f2f" }}
        >
          {error ?? actionError}
        </div>
      )}

      <div className="perf-summary">
        <div className="perf-card">
          <div className="perf-card-label">Pending</div>
          <div className="perf-card-value">{data?.pending ?? 0}</div>
        </div>
        <div className="perf-card">
          <div className="perf-card-label">Approved</div>
          <div className="perf-card-value">{data?.approved ?? 0}</div>
        </div>
        <div className="perf-card">
          <div className="perf-card-label">Rejected</div>
          <div className="perf-card-value">{data?.rejected ?? 0}</div>
        </div>
      </div>

      {loading && <p className="profile-loading">Loading…</p>}

      <div className="card-grid">
        {pending.map((r) => (
          <Card
            key={r.id}
            title={r.full_name}
            subtitle={r.email}
            badge={{ label: "Pending", tone: "warning" }}
            footer={
              <>
                <button
                  className="perf-btn"
                  disabled={busyId === r.id}
                  onClick={() => decide(r.id, "APPROVED")}
                >
                  {busyId === r.id ? "Working…" : "Approve"}
                </button>
                <button
                  className="perf-btn danger-outline"
                  disabled={busyId === r.id}
                  onClick={() => decide(r.id, "REJECTED")}
                >
                  Reject
                </button>
              </>
            }
          >
            <CardRow label="Request ID" value={r.id} />
            <CardRow label="Phone" value={r.phone ?? "—"} />
            <CardRow
              label="Applied for"
              value={r.requested_batch_name ?? "—"}
            />
            <CardRow label="Applied on" value={formatDate(r.applied_at)} />
          </Card>
        ))}

        {!loading && pending.length === 0 && (
          <div className="card-empty">No pending enrollment requests</div>
        )}
      </div>
    </div>
  );
}