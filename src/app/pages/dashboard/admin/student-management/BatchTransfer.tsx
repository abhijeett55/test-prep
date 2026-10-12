import { useState } from "react";
import Card, { CardRow, type CardTone } from "../../../../components/Card/Card";
import "./Performance.css";

type TransferStatus = "Pending" | "Approved" | "Rejected";

interface BatchTransfer {
  id: string;
  student: string;
  fromBatch: string;
  toBatch: string;
  reason: string;
  requestedOn: string;
  status: TransferStatus;
}

const initialTransfers: BatchTransfer[] = [
  { id: "TRF-001", student: "Aarav Sharma", fromBatch: "Class 10 - A", toBatch: "Class 10 - B", reason: "Timing clash with tuition", requestedOn: "02 Oct 2026", status: "Pending" },
  { id: "TRF-002", student: "Rohan Patel", fromBatch: "Class 9 - A", toBatch: "Class 9 - B", reason: "Moved to a new area", requestedOn: "30 Sep 2026", status: "Pending" },
  { id: "TRF-003", student: "Diya Verma", fromBatch: "Class 10 - B", toBatch: "Class 10 - A", reason: "Wants a stronger peer group", requestedOn: "26 Sep 2026", status: "Approved" },
  { id: "TRF-004", student: "Ananya Singh", fromBatch: "Class 9 - B", toBatch: "Class 9 - A", reason: "Personal reasons", requestedOn: "22 Sep 2026", status: "Rejected" },
];

const tone: Record<TransferStatus, CardTone> = {
  Pending: "warning",
  Approved: "success",
  Rejected: "danger",
};

export default function BatchTransfers() {
  const [transfers, setTransfers] = useState(initialTransfers);

  const setStatus = (id: string, status: TransferStatus) => {
    // TODO: call approve/reject transfer API
    setTransfers((list) => list.map((t) => (t.id === id ? { ...t, status } : t)));
  };

  return (
    <div className="perf-page">
      <div className="perf-header">
        <div>
          <h1>Batch Transfers</h1>
          <p>Student requests to move between batches</p>
        </div>
      </div>

      <div className="card-grid">
        {transfers.map((t) => (
          <Card
            key={t.id}
            title={t.student}
            subtitle={`${t.fromBatch}  →  ${t.toBatch}`}
            badge={{ label: t.status, tone: tone[t.status] }}
            footer={
              t.status === "Pending" && (
                <>
                  <button className="perf-btn" onClick={() => setStatus(t.id, "Approved")}>
                    Approve
                  </button>
                  <button className="perf-btn danger-outline" onClick={() => setStatus(t.id, "Rejected")}>
                    Reject
                  </button>
                </>
              )
            }
          >
            <CardRow label="Request ID" value={t.id} />
            <CardRow label="Reason" value={t.reason} />
            <CardRow label="Requested on" value={t.requestedOn} />
          </Card>
        ))}
      </div>
    </div>
  );
}