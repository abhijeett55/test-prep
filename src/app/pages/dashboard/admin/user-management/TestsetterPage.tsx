import { useMemo, useState } from "react";
import { Plus, Search, Pencil, Eye, X } from "lucide-react";
import TestsetterForm from "../../../../config/nav-user/testsetter/TestsetterForm";
import type { FormValues } from "../../../../components/FormLayout/types";
import {
  getTestSetterOptions,
  listTestSetters,
  createTestSetter,
  type TestSetterCreate,
} from "../../../../api/auth/testsetter/testsetter";
import type { TestSetterRow } from "../../../../api/types";
import { useApi } from "../../../../hooks/useApi";
import { errorMessage } from "../../../../api/client";
import "./DefaultPage.css";

const ENTRY_OPTIONS = [10, 25, 50];

function toPayload(v: FormValues): TestSetterCreate {
  const trim = (s?: string) => (s ?? "").trim();
  const nullable = (s?: string) => trim(s) || null;

  return {
    testsetter_id: trim(v.testsetter_id),
    full_name: trim(v.fullName),
    email: trim(v.email),
    phone: nullable(v.phone),
    institute_id: v.institute_id || "",
    employee_code: nullable(v.employee_code),
  };
}

export default function TestSettersPage() {
  const { data, loading, error, reload } = useApi(() => listTestSetters());
  const { data: options } = useApi(() => getTestSetterOptions());

  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  const [pendingTestSetter, setPendingTestSetter] = useState<FormValues | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  
  const [viewing, setViewing] = useState<TestSetterRow | null>(null);
  const [tempPassword, setTempPassword] = useState<string | null>(null);

  const testSetters = useMemo(() => data ?? [], [data]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return testSetters;
    return testSetters.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        (t.email ?? "").toLowerCase().includes(q) ||
        (t.institute ?? "").toLowerCase().includes(q) ||
        (t.testsetter_id ?? "").toLowerCase().includes(q)
    );
  }, [testSetters, search]);

  const visible = filtered.slice(0, entriesPerPage);

  /* ---------- form → confirmation → POST ---------- */

  const handleFormSubmit = async (values: FormValues) => {
    setSaveError(null);
    setPendingTestSetter(values);
  };

  const cancelPendingTestSetter = () => {
    if (saving) return;
    setPendingTestSetter(null);
    setSaveError(null);
  };

  const confirmPendingTestSetter = async () => {
    if (!pendingTestSetter || saving) return;
    setSaving(true);
    setSaveError(null);

    try {
      const { temp_password } = await createTestSetter(toPayload(pendingTestSetter));
      setTempPassword(temp_password);
      
      await reload(); // Refresh the list
      setPendingTestSetter(null);
      setShowForm(false);
    } catch (err) {
      setSaveError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const lookupName = (
    id: string | undefined,
    list: { id: string; name: string }[]
  ) => list.find((o) => o.id === id)?.name ?? "—";

  /* ---------- render ---------- */

  if (showForm && options) {
    return (
      <div className="default-page">
        <TestsetterForm
          institutes={options.institutes}
          subjects={[]} // If your backend doesn't have testsetter subjects yet, leave empty
          onSubmit={handleFormSubmit}
          onCancel={() => setShowForm(false)}
        />
      </div>
    );
  }

  return (
    <div className="default-page">
      {error && (
        <div className="perf-success" style={{ background: "#fdeaea", color: "#c62f2f", marginBottom: 12 }}>
          {error}
        </div>
      )}

      {tempPassword && (
        <div className="perf-success" style={{ marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <strong>Temporary password:</strong> <code style={{ fontFamily: "monospace" }}>{tempPassword}</code>
            <div style={{ fontSize: 12, opacity: 0.75, marginTop: 2 }}>Share with the test setter. Shown only once.</div>
          </div>
          <button type="button" className="perf-btn outline" onClick={() => setTempPassword(null)}>
            Dismiss
          </button>
        </div>
      )}

      {loading && !data && <div className="default-empty">Loading test setters…</div>}

      {!loading && testSetters.length === 0 && (
        <div className="default-empty">
          <p>No test setters added yet.</p>
          <button type="button" className="add-button" onClick={() => setShowForm(true)}>
            <Plus size={16} strokeWidth={2.4} />
            Add your first test setter
          </button>
        </div>
      )}

      {!loading && testSetters.length > 0 && (
        <div className="default-panel">
          <div className="section-bar">All Test Setters</div>

          <div className="default-toolbar">
            <div className="search-control">
              <Search size={15} strokeWidth={2} />
              <input
                type="text"
                placeholder="Search test setters…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="default-table-wrap">
            <table className="default-table">
              <thead>
                <tr>
                  <th className="col-sno">Sr. No.</th>
                  <th>Test Setter ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Institute</th>
                  <th>Employee Code</th>
                  <th className="col-actions">Actions</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((t, i) => (
                  <tr key={t.id}>
                    <td className="col-sno">{i + 1}</td>
                    <td>{t.testsetter_id}</td>
                    <td className="cell-name">{t.name}</td>
                    <td>{t.email || "—"}</td>
                    <td>{t.institute || "—"}</td>
                    <td>{t.employee_code || "—"}</td>
                    <td className="col-actions">
                      <button type="button" className="icon-button" title="Edit">
                        <Pencil size={15} strokeWidth={2} />
                      </button>
                      <button
                        type="button"
                        className="icon-button"
                        title="View"
                        onClick={() => setViewing(t)}
                      >
                        <Eye size={15} strokeWidth={2} />
                      </button>
                    </td>
                  </tr>
                ))}

                {visible.length === 0 && (
                  <tr>
                    <td colSpan={7} className="no-results">
                      No test setters match "{search}".
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="default-footer">
            <label className="entries-control">
              Show
              <select
                value={entriesPerPage}
                onChange={(e) => setEntriesPerPage(Number(e.target.value))}
              >
                {ENTRY_OPTIONS.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
              entries
            </label>

            <div className="default-footer-note">
              Showing {visible.length} of {filtered.length} test setter
              {filtered.length === 1 ? "" : "s"}
            </div>
          </div>
        </div>
      )}

      {!showForm && testSetters.length > 0 && (
        <button type="button" className="add-button-fab" onClick={() => setShowForm(true)}>
          <Plus size={18} strokeWidth={2.6} />
          <span>Add Test Setter</span>
        </button>
      )}

      {/* Confirmation card */}
      {pendingTestSetter && (
        <div className="confirm-overlay" role="dialog" aria-modal="true">
          <div className="confirm-card">
            <button type="button" className="confirm-close" onClick={cancelPendingTestSetter} disabled={saving}>
              <X size={16} strokeWidth={2.2} />
            </button>

            <div className="confirm-icon">
              <Plus size={20} strokeWidth={2.4} />
            </div>

            <h3 className="confirm-title">Add this test setter?</h3>
            <p className="confirm-subtitle">Please confirm the details before adding them.</p>

            <div className="confirm-details">
              <div className="confirm-row"><span>Name</span><strong>{pendingTestSetter.fullName || "—"}</strong></div>
              <div className="confirm-row"><span>Email</span><strong>{pendingTestSetter.email || "—"}</strong></div>
              <div className="confirm-row"><span>Institute</span><strong>{lookupName(pendingTestSetter.institute_id, options?.institutes ?? [])}</strong></div>
              <div className="confirm-row"><span>Employee Code</span><strong>{pendingTestSetter.employee_code || "—"}</strong></div>
              <div className="confirm-row"><span>Test Setter ID</span><strong>{pendingTestSetter.testsetter_id || "—"}</strong></div>
            </div>

            {saveError && <p className="confirm-error">{saveError}</p>}

            <div className="confirm-actions">
              <button type="button" className="confirm-btn-secondary" onClick={cancelPendingTestSetter} disabled={saving}>
                Cancel
              </button>
              <button type="button" className="confirm-btn-primary" onClick={confirmPendingTestSetter} disabled={saving}>
                {saving ? "Adding…" : "Yes, add test setter"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Details card */}
      {viewing && (
        <div className="confirm-overlay" role="dialog" aria-modal="true" onClick={() => setViewing(null)}>
          <div className="confirm-card" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="confirm-close" onClick={() => setViewing(null)}>
              <X size={16} strokeWidth={2.2} />
            </button>
            <div className="confirm-icon">
              <Eye size={20} strokeWidth={2.2} />
            </div>
            <h3 className="confirm-title">{viewing.name}</h3>
            <p className="confirm-subtitle">Test setter details</p>

            <div className="confirm-details">
              <div className="confirm-row"><span>Test Setter ID</span><strong>{viewing.testsetter_id || "—"}</strong></div>
              <div className="confirm-row"><span>Email</span><strong>{viewing.email || "—"}</strong></div>
              <div className="confirm-row"><span>Institute</span><strong>{viewing.institute || "—"}</strong></div>
              <div className="confirm-row"><span>Employee Code</span><strong>{viewing.employee_code || "—"}</strong></div>
            </div>

            <div className="confirm-actions">
              <button type="button" className="confirm-btn-secondary" onClick={() => setViewing(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}