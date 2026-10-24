import { useState } from "react";
import Card, { CardRow, type CardTone } from "../../../../components/Card/Card";
import { useApi } from "../../../../hooks/useApi";
import {
  listBatchTransfers,
  decideBatchTransfer,
  type BatchTransferRow,
  type TransferStatus,
} from "../../../../api/auth/admin/students";
import { errorMessage } from "../../../../api/client";
import "../DefaultPage.css";

const tone: Record<TransferStatus, CardTone> = {
  PENDING: "warning",
  APPROVED: "success",
  REJECTED: "danger",
};

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

export default function BatchTransfers() {
  const { data, loading, error, reload } = useApi(listBatchTransfers);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const decide = async (id: string, status: "APPROVED" | "REJECTED") => {
    if (status === "REJECTED" && !window.confirm("Reject this transfer request?")) {
      return;
    }
    setBusyId(id);
    setActionError(null);
    try {
      await decideBatchTransfer(id, status);
      await reload();
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

      {(error || actionError) && (
        <div
          className="perf-success"
          style={{ background: "#fdeaea", color: "#c62f2f" }}
        >
          {error ?? actionError}
        </div>
      )}

      {loading && <p className="profile-loading">Loading…</p>}

      <div className="card-grid">
        {data?.map((t: BatchTransferRow) => (
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
            <CardRow label="Reason" value={t.reason ?? "—"} />
            <CardRow label="Requested on" value={formatDate(t.requested_at)} />
          </Card>
        ))}

        {!loading && (data?.length ?? 0) === 0 && (
          <div className="card-empty">No transfer requests</div>
        )}
      </div>
    </div>
  );
}