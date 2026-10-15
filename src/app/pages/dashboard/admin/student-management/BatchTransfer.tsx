import Card, { CardRow, type CardTone } from "../../../../components/Card/Card";
import { useApi } from "../../../../hooks/useApi";
import { listBatchTransfers, decideBatchTransfer } from "../../../../api/auth/admin/students";
import { errorMessage } from "../../../../api/client";
import { useState } from "react";
import "./Performance.css";

type TransferStatus = "PENDING" | "APPROVED" | "REJECTED";

interface BatchTransfer {
  id: string;
  student_name: string;
  from_batch_name: string;
  to_batch_name: string;
  reason: string;
  requested_at: string;
  status: TransferStatus;
}

const MOCK: BatchTransfer[] = [
  { id: "TRF-001", student_name: "Aarav Sharma", from_batch_name: "Class 10 - A", to_batch_name: "Class 10 - B", reason: "Timing clash", requested_at: "2026-10-02", status: "PENDING" },
  // ...
];

async function load(): Promise<BatchTransfer[]> {
  try {
    return await listBatchTransfers();
  } catch (e) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((e as any)?.response?.status === 404) return MOCK;
    throw e;
  }
}

const tone: Record<TransferStatus, CardTone> = {
  PENDING: "warning",
  APPROVED: "success",
  REJECTED: "danger",
};

export default function BatchTransfers() {
  const { data, loading, error, setData } = useApi(load);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const decide = async (id: string, status: "APPROVED" | "REJECTED") => {
    setBusyId(id);
    setActionError(null);
    try {
      await decideBatchTransfer(id, status);
      setData((prev) =>
        prev ? prev.map((t) => (t.id === id ? { ...t, status } : t)) : prev
      );
    } catch (e) {
      setActionError(errorMessage(e));
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="perf-page">
      <div className="perf-header">
        <div>
          <h1>Batch Transfers</h1>
          <p>Student requests to move between batches</p>
        </div>
      </div>

      {error && <p className="profile-error">{error}</p>}
      {actionError && <p className="profile-error">{actionError}</p>}
      {loading && <p className="profile-loading">Loading…</p>}

      <div className="card-grid">
        {data?.map((t) => (
          <Card
            key={t.id}
            title={t.student_name}
            subtitle={`${t.from_batch_name} → ${t.to_batch_name}`}
            badge={{ label: t.status, tone: tone[t.status] }}
            footer={
              t.status === "PENDING" && (
                <>
                  <button
                    className="perf-btn"
                    disabled={busyId === t.id}
                    onClick={() => decide(t.id, "APPROVED")}
                  >
                    {busyId === t.id ? "Working…" : "Approve"}
                  </button>
                  <button
                    className="perf-btn danger-outline"
                    disabled={busyId === t.id}
                    onClick={() => decide(t.id, "REJECTED")}
                  >
                    Reject
                  </button>
                </>
              )
            }
          >
            <CardRow label="Request ID" value={t.id} />
            <CardRow label="Reason" value={t.reason} />
            <CardRow label="Requested on" value={t.requested_at} />
          </Card>
        ))}
      </div>
    </div>
  );
}