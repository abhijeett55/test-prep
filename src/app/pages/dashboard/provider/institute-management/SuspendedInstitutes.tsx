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

export default function SuspendedInstitutes() {
  const [all, setAll] = useState<InstituteProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [busyId, setBusyId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const fetchInstitutes = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const rows = await listInstitutes();
      setAll(rows);
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

  const suspended = useMemo(
    () => all.filter((i) => i.status === "SUSPENDED"),
    [all]
  );

  const handleReactivate = async (i: InstituteProfile) => {
    if (!window.confirm(`Reactivate "${i.institute_name}"?`)) return;
    setBusyId(i.id);
    setActionError(null);
    try {
      const updated = await updateInstitute(i.id, {
        status: "ACTIVE" as InstituteStatus,
      });
      setAll((prev) => prev.map((row) => (row.id === updated.id ? updated : row)));
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
          <h1>Suspended Institutes</h1>
          <p>Institutes that are currently suspended</p>
        </div>
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
              <th>Last Updated</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: 24 }}>
                  Loading…
                </td>
              </tr>
            )}

            {!loading && loadError && (
              <tr>
                <td
                  colSpan={7}
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
              suspended.map((i) => {
                const busy = busyId === i.id;
                return (
                  <tr key={i.id}>
                    <td className="perf-id">{i.institute_id}</td>
                    <td className="perf-strong">{i.institute_name}</td>
                    <td>{i.code}</td>
                    <td>{i.email}</td>
                    <td>{i.phone || "—"}</td>
                    <td>{formatDate(i.updated_at)}</td>
                    <td>
                      <button
                        className="perf-btn outline"
                        onClick={() => handleReactivate(i)}
                        disabled={busy}
                      >
                        {busy ? "Working…" : "Reactivate"}
                      </button>
                    </td>
                  </tr>
                );
              })}

            {!loading && !loadError && suspended.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  style={{ textAlign: "center", color: "#6b7280", padding: 24 }}
                >
                  No suspended institutes.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}