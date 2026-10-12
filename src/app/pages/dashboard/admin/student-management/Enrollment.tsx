import { useState } from "react";
import Card, { CardRow } from "../../../../components/Card/Card";
import "./Performance.css";

interface EnrollmentRequest {
  id: string;
  name: string;
  email: string;
  className: string;
  appliedOn: string;
}

const initialRequests: EnrollmentRequest[] = [
  { id: "ENR-001", name: "Aarav Sharma", email: "aarav.sharma@example.com", className: "Class 10 - A", appliedOn: "02 Oct 2026" },
  { id: "ENR-002", name: "Diya Verma", email: "diya.verma@example.com", className: "Class 10 - B", appliedOn: "01 Oct 2026" },
  { id: "ENR-003", name: "Rohan Patel", email: "rohan.patel@example.com", className: "Class 9 - A", appliedOn: "29 Sep 2026" },
  { id: "ENR-004", name: "Ananya Singh", email: "ananya.singh@example.com", className: "Class 9 - B", appliedOn: "27 Sep 2026" },
];

export default function Enrollment() {
  const [requests, setRequests] = useState(initialRequests);
  const [approved, setApproved] = useState(0);
  const [rejected, setRejected] = useState(0);

  const remove = (id: string) => setRequests((r) => r.filter((x) => x.id !== id));

  const approve = (id: string) => {
    // TODO: call approve-enrollment API
    setApproved((n) => n + 1);
    remove(id);
  };

  const reject = (id: string) => {
    if (!window.confirm("Reject this enrollment request?")) return;
    // TODO: call reject-enrollment API
    setRejected((n) => n + 1);
    remove(id);
  };

  return (
    <div className="perf-page">
      <div className="perf-header">
        <div>
          <h1>Enrollment</h1>
          <p>Review and approve new student enrollment requests</p>
        </div>
      </div>

      <div className="perf-summary">
        <div className="perf-card">
          <div className="perf-card-label">Pending</div>
          <div className="perf-card-value">{requests.length}</div>
        </div>
        <div className="perf-card">
          <div className="perf-card-label">Approved (this session)</div>
          <div className="perf-card-value">{approved}</div>
        </div>
        <div className="perf-card">
          <div className="perf-card-label">Rejected (this session)</div>
          <div className="perf-card-value">{rejected}</div>
        </div>
      </div>

      <div className="card-grid">
        {requests.map((r) => (
          <Card
            key={r.id}
            title={r.name}
            subtitle={r.email}
            badge={{ label: "Pending", tone: "warning" }}
            footer={
              <>
                <button className="perf-btn" onClick={() => approve(r.id)}>Approve</button>
                <button className="perf-btn danger-outline" onClick={() => reject(r.id)}>Reject</button>
              </>
            }
          >
            <CardRow label="Request ID" value={r.id} />
            <CardRow label="Applied for" value={r.className} />
            <CardRow label="Applied on" value={r.appliedOn} />
          </Card>
        ))}

        {requests.length === 0 && <div className="card-empty">No pending enrollment requests</div>}
      </div>
    </div>
  );
}