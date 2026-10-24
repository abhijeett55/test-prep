import { useState } from "react";
import { Search } from "lucide-react";
import { useApi } from "../../../../hooks/useApi";
import { listBatches } from "../../../../api/auth/admin/batches";
import "../DefaultPage.css";

export default function AllBatches() {
  const { data: batches, loading, error } = useApi(() => listBatches());
  const [search, setSearch] = useState("");

  if (loading) return <div className="default-page">Loading…</div>;
  if (error) return <div className="default-page" style={{ color: "red" }}>{error}</div>;

  const visible = (batches ?? []).filter((b) =>
    b.batch_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="default-page">
      <div className="default-panel">
        <div className="section-bar">All Batches</div>
        <div className="default-toolbar">
          <div className="search-control">
            <Search size={15} />
            <input
              type="text"
              placeholder="Search batches…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="default-table-wrap">
          <table className="default-table">
            <thead>
              <tr>
                <th>Batch Code</th>
                <th>Batch Name</th>
                <th>Course</th>
                <th>Students</th>
                <th>Teachers</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((b) => (
                <tr key={b.id}>
                  <td>{b.batch_code}</td>
                  <td className="cell-name">{b.batch_name}</td>
                  <td>{b.course_name || "—"}</td>
                  <td>{b.student_count}</td>
                  <td>{b.teacher_count}</td>
                </tr>
              ))}
              {visible.length === 0 && (
                <tr>
                  <td colSpan={5} className="no-results">No batches found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}