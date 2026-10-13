import { useEffect, useMemo, useState } from "react";
import {
  listInstitutes,
  updateInstitute,
  type InstituteStatus,
} from "../../../../api/auth/institute/institute";
import type { InstituteProfile } from "../../../../api/types";
import { errorMessage } from "../../../../api/client";
import "./Performance.css";

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

function StatusBadge({ status }: { status: string }) {
  const cls =
    status === "SUSPENDED"
      ? "perf-badge danger"
      : status === "INACTIVE"
        ? "perf-badge"
        : "perf-badge";
  return <span className={cls}>{status}</span>;
}

export default function AllInstitutes() {
  const [institutes, setInstitutes] = useState<InstituteProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const [busyId, setBusyId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const fetchInstitutes = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const rows = await listInstitutes();
      setInstitutes(rows);
    } catch (err) {
      setLoadError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchInstitutes();
  }, []);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return institutes;
    return institutes.filter((i) =>
      `${i.institute_name} ${i.code} ${i.email} ${i.institute_id}`
        .toLowerCase()
        .includes(q)
    );
  }, [institutes, search]);

  const handleSuspend = async (i: InstituteProfile) => {
    if (!window.confirm(`Suspend "${i.institute_name}"?`)) return;
    setBusyId(i.id);
    setActionError(null);
    try {
      const updated = await updateInstitute(i.id, {
        status: "SUSPENDED" as InstituteStatus,
      });
      setInstitutes((prev) =>
        prev.map((row) => (row.id === updated.id ? updated : row))
      );
    } catch (err) {
      setActionError(errorMessage(err));
    } finally {
      setBusyId(null);
    }
  };

  const handleReactivate = async (i: InstituteProfile) => {
    if (!window.confirm(`Reactivate "${i.institute_name}"?`)) return;
    setBusyId(i.id);
    setActionError(null);
    try {
      const updated = await updateInstitute(i.id, {
        status: "ACTIVE" as InstituteStatus,
      });
      setInstitutes((prev) =>
        prev.map((row) => (row.id === updated.id ? updated : row))
      );
    } catch (err) {
      setActionError(errorMessage(err));
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="perf-page">
      <div className="perf-header">
        <div>
          <h1>All Institutes</h1>
          <p>Institutes registered on the platform</p>
        </div>
      </div>

      <div className="perf-filters">
        <input
          className="perf-input"
          style={{ minWidth: 260 }}
          placeholder="Search by name, code, email or ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          disabled={loading}
        />
      </div>

      {actionError && (
        <div
          className="perf-success"
          style={{ background: "#fdeaea", color: "#c62f2f", marginBottom: 12 }}
        >
          {actionError}
        </div>
      )}

      <div className="perf-table-container">
        <table className="perf-table">
          <thead>
            <tr>
              <th>Institute ID</th>
              <th>Institute Name</th>
              <th>Code</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Onboarded</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={8} style={{ textAlign: "center", padding: 24 }}>
                  Loading institutes…
                </td>
              </tr>
            )}

            {!loading && loadError && (
              <tr>
                <td
                  colSpan={8}
                  style={{ textAlign: "center", padding: 24, color: "#c62f2f" }}
                >
                  {loadError}{" "}
                  <button
                    className="perf-btn outline"
                    style={{ marginLeft: 12 }}
                    onClick={fetchInstitutes}
                  >
                    Retry
                  </button>
                </td>
              </tr>
            )}

            {!loading &&
              !loadError &&
              visible.map((i) => {
                const isSuspended = i.status === "SUSPENDED";
                const busy = busyId === i.id;
                return (
                  <tr key={i.id}>
                    <td className="perf-id">{i.institute_id}</td>
                    <td className="perf-strong">{i.institute_name}</td>
                    <td>{i.code}</td>
                    <td>{i.email}</td>
                    <td>{i.phone || "—"}</td>
                    <td>
                      <StatusBadge status={i.status} />
                    </td>
                    <td>{formatDate(i.created_at)}</td>
                    <td>
                      {isSuspended ? (
                        <button
                          className="perf-btn outline"
                          onClick={() => handleReactivate(i)}
                          disabled={busy}
                        >
                          {busy ? "Working…" : "Reactivate"}
                        </button>
                      ) : (
                        <button
                          className="perf-btn danger-outline"
                          onClick={() => handleSuspend(i)}
                          disabled={busy}
                        >
                          {busy ? "Working…" : "Suspend"}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}

            {!loading && !loadError && visible.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  style={{ textAlign: "center", color: "#6b7280", padding: 24 }}
                >
                  {search ? `No institutes match "${search}".` : "No institutes yet."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}