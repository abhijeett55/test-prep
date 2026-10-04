import { useState } from "react";
import "./Performance.css";

interface Institute {
  instituteId: string;
  name: string;
  type: string;
  city: string;
  teachers: number;
  students: number;
  onboardedAt: string;
}

const initialInstitutes: Institute[] = [
  { instituteId: "INS-001", name: "Sunrise Public School", type: "School", city: "Indore", teachers: 24, students: 520, onboardedAt: "02 Oct 2026" },
  { instituteId: "INS-002", name: "Bright Future Coaching", type: "Coaching Institute", city: "Bhopal", teachers: 12, students: 310, onboardedAt: "28 Sep 2026" },
  { instituteId: "INS-003", name: "Vidya Mandir College", type: "College", city: "Ujjain", teachers: 38, students: 940, onboardedAt: "20 Sep 2026" },
  { instituteId: "INS-004", name: "Apex Academy", type: "Coaching Institute", city: "Jabalpur", teachers: 9, students: 180, onboardedAt: "11 Sep 2026" },
];

export default function AllInstitutes() {
  const [institutes, setInstitutes] = useState(initialInstitutes);
  const [search, setSearch] = useState("");

  const handleSuspend = (id: string) => {
    if (!window.confirm("Suspend this institute?")) return;
    // TODO: call suspend API
    setInstitutes(institutes.filter((i) => i.instituteId !== id));
  };

  const visible = institutes.filter((i) =>
    `${i.name} ${i.city} ${i.instituteId}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="perf-page">
      <div className="perf-header">
        <div>
          <h1>All Institutes</h1>
          <p>Institutes currently active on the platform</p>
        </div>
      </div>

      <div className="perf-filters">
        <input
          className="perf-input"
          style={{ minWidth: 260 }}
          placeholder="Search by name, city or ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="perf-table-container">
        <table className="perf-table">
          <thead>
            <tr>
              <th>Institute ID</th>
              <th>Institute Name</th>
              <th>Type</th>
              <th>City</th>
              <th>Teachers</th>
              <th>Students</th>
              <th>Onboarded At</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((i) => (
              <tr key={i.instituteId}>
                <td className="perf-id">{i.instituteId}</td>
                <td className="perf-strong">{i.name}</td>
                <td><span className="perf-badge">{i.type}</span></td>
                <td>{i.city}</td>
                <td>{i.teachers}</td>
                <td>{i.students}</td>
                <td>{i.onboardedAt}</td>
                <td>
                  <button className="perf-btn danger-outline" onClick={() => handleSuspend(i.instituteId)}>
                    Suspend
                  </button>
                </td>
              </tr>
            ))}
            {visible.length === 0 && (
              <tr>
                <td colSpan={8} style={{ textAlign: "center", color: "#6b7280" }}>
                  No institutes found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}