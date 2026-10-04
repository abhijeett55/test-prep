import { useState } from "react";
import "./Performance.css";

interface SuspendedInstitute {
  instituteId: string;
  name: string;
  type: string;
  city: string;
  suspendedAt: string;
  reason: string;
}

const initialInstitutes: SuspendedInstitute[] = [
  { instituteId: "INS-005", name: "Global Learning Hub", type: "Coaching Institute", city: "Dewas", suspendedAt: "30 Sep 2026", reason: "Payment overdue" },
  { instituteId: "INS-006", name: "City Public School", type: "School", city: "Ratlam", suspendedAt: "18 Sep 2026", reason: "Policy violation" },
];

export default function SuspendedInstitutes() {
  const [institutes, setInstitutes] = useState(initialInstitutes);

  const handleReactivate = (id: string) => {
    if (!window.confirm("Reactivate this institute?")) return;
    // TODO: call reactivate API
    setInstitutes(institutes.filter((i) => i.instituteId !== id));
  };

  return (
    <div className="perf-page">
      <div className="perf-header">
        <div>
          <h1>Suspended Institutes</h1>
          <p>Institutes that are currently suspended</p>
        </div>
      </div>

      <div className="perf-table-container">
        <table className="perf-table">
          <thead>
            <tr>
              <th>Institute ID</th>
              <th>Institute Name</th>
              <th>Type</th>
              <th>City</th>
              <th>Suspended At</th>
              <th>Reason</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {institutes.map((i) => (
              <tr key={i.instituteId}>
                <td className="perf-id">{i.instituteId}</td>
                <td className="perf-strong">{i.name}</td>
                <td><span className="perf-badge">{i.type}</span></td>
                <td>{i.city}</td>
                <td>{i.suspendedAt}</td>
                <td><span className="perf-badge danger">{i.reason}</span></td>
                <td>
                  <button className="perf-btn outline" onClick={() => handleReactivate(i.instituteId)}>
                    Reactivate
                  </button>
                </td>
              </tr>
            ))}
            {institutes.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", color: "#6b7280" }}>
                  No suspended institutes
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}