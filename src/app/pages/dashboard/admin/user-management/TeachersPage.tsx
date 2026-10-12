import { useEffect, useMemo, useState } from "react";
import { Plus, Search, Pencil, Eye, X } from "lucide-react";
import TeacherForm from "../../../../config/nav-user/teacher/TeacherForm";
import type { FormValues } from "../../../../components/FormLayout/types";
import {
  getTeacherOptions,
  listTeachers,
  createTeacher,
  type TeacherCreate,
} from "../../../../api/auth/teacher/teacher";
import type {
  TeacherOptionsResponse,
  TeacherRow,
} from "../../../../api/types";
import { errorMessage } from "../../../../api/client";
import "./DefaultPage.css";

const ENTRY_OPTIONS = [10, 25, 50];

/** FormValues (all strings) → TeacherCreate payload. */
function toPayload(v: FormValues): TeacherCreate {
  const trim = (s?: string) => (s ?? "").trim();
  const nullable = (s?: string) => trim(s) || null;

  return {
    teacher_id: trim(v.teacher_id),
    full_name: trim(v.fullName),
    email: nullable(v.email),
    phone: nullable(v.phone),
    institute_id: v.institute_id || null,
    employee_code: nullable(v.employee_code),
    qualification: nullable(v.qualification),
    ip_address: nullable(v.ip_address),
    latitude: nullable(v.latitude),
    longitude: nullable(v.longitude),
    subject_ids: v.subject_id ? [v.subject_id] : [],
  };
}

export default function TeachersPage() {
  const [showForm, setShowForm] = useState(false);

  const [options, setOptions] = useState<TeacherOptionsResponse | null>(null);
  const [teachers, setTeachers] = useState<TeacherRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  const [pendingTeacher, setPendingTeacher] = useState<FormValues | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  /* ---------- initial fetch: options + teachers in parallel ---------- */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setLoadError(null);
      try {
        const [opts, rows] = await Promise.all([
          getTeacherOptions(),
          listTeachers(),
        ]);
        if (!cancelled) {
          setOptions(opts);
          setTeachers(rows);
        }
      } catch (err) {
        if (!cancelled) setLoadError(errorMessage(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return teachers;
    return teachers.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        (t.email ?? "").toLowerCase().includes(q) ||
        (t.phone ?? "").toLowerCase().includes(q) ||
        t.institute.toLowerCase().includes(q) ||
        t.subject.toLowerCase().includes(q) ||
        (t.employee_code ?? "").toLowerCase().includes(q) ||
        t.teacher_id.toLowerCase().includes(q) ||
        (t.qualification ?? "").toLowerCase().includes(q)
    );
  }, [teachers, search]);

  const visible = filtered.slice(0, entriesPerPage);

  /* ---------- form → confirmation → POST ---------- */

  const handleFormSubmit = async (values: FormValues) => {
    setPendingTeacher(values);
    setSaveError(null);
  };

  const cancelPendingTeacher = () => {
    if (saving) return;
    setPendingTeacher(null);
    setSaveError(null);
  };

  const confirmPendingTeacher = async () => {
    if (!pendingTeacher || saving) return;
    setSaving(true);
    setSaveError(null);

    try {
      const { temp_password, ...row } = await createTeacher(
        toPayload(pendingTeacher)
      );
      // temp_password is the teacher's first-login credential.
      // Surface it (toast / banner) before dropping it.
      void temp_password;

      setTeachers((prev) => [...prev, row]);
      setPendingTeacher(null);
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

  if (loading) {
    return (
      <div className="default-page">
        <div className="default-empty">Loading teachers…</div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="default-page">
        <div className="default-empty">
          <p>{loadError}</p>
        </div>
      </div>
    );
  }

  if (!options) return null;

  const { institutes, subjects } = options;

  return (
    <div className="default-page">
      {showForm ? (
        <TeacherForm
          institutes={institutes}
          subjects={subjects}
          onSubmit={handleFormSubmit}
          onCancel={() => setShowForm(false)}
        />
      ) : teachers.length === 0 ? (
        <div className="default-empty">
          <p>No teachers added yet.</p>
          <button
            type="button"
            className="add-button"
            onClick={() => setShowForm(true)}
          >
            <Plus size={16} strokeWidth={2.4} />
            Add your first teacher
          </button>
        </div>
      ) : (
        <div className="default-panel">
          <div className="section-bar">All Teachers</div>

          <div className="default-toolbar">
            <div className="search-control">
              <Search size={15} strokeWidth={2} />
              <input
                type="text"
                placeholder="Search teachers…"
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
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Institute</th>
                  <th>Subject</th>
                  <th>Employee Code</th>
                  <th>Teacher ID</th>
                  <th>Qualification</th>
                  <th className="col-actions">Actions</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((t, i) => (
                  <tr key={t.id}>
                    <td className="col-sno">{i + 1}</td>
                    <td className="cell-name">{t.name}</td>
                    <td>{t.email || "—"}</td>
                    <td>{t.phone || "—"}</td>
                    <td>{t.institute || "—"}</td>
                    <td>{t.subject || "—"}</td>
                    <td>{t.employee_code || "—"}</td>
                    <td>{t.teacher_id}</td>
                    <td>{t.qualification || "—"}</td>
                    <td className="col-actions">
                      <button type="button" className="icon-button" title="Edit">
                        <Pencil size={15} strokeWidth={2} />
                      </button>
                      <button type="button" className="icon-button" title="View">
                        <Eye size={15} strokeWidth={2} />
                      </button>
                    </td>
                  </tr>
                ))}

                {visible.length === 0 && (
                  <tr>
                    <td colSpan={10} className="no-results">
                      No teachers match "{search}".
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
              Showing {visible.length} of {filtered.length} teacher
              {filtered.length === 1 ? "" : "s"}
            </div>
          </div>
        </div>
      )}

      {!showForm && teachers.length > 0 && (
        <button
          type="button"
          className="add-button-fab"
          onClick={() => setShowForm(true)}
        >
          <Plus size={18} strokeWidth={2.6} />
          <span>Add Teacher</span>
        </button>
      )}

      {pendingTeacher && (
        <div className="confirm-overlay" role="dialog" aria-modal="true">
          <div className="confirm-card">
            <button
              type="button"
              className="confirm-close"
              onClick={cancelPendingTeacher}
              aria-label="Close"
              disabled={saving}
            >
              <X size={16} strokeWidth={2.2} />
            </button>

            <div className="confirm-icon">
              <Plus size={20} strokeWidth={2.4} />
            </div>

            <h3 className="confirm-title">Add this teacher?</h3>
            <p className="confirm-subtitle">
              Please confirm the details before adding them to the list.
            </p>

            <div className="confirm-details">
              <div className="confirm-row">
                <span>Full name</span>
                <strong>{pendingTeacher.fullName || "—"}</strong>
              </div>
              <div className="confirm-row">
                <span>Teacher ID</span>
                <strong>{pendingTeacher.teacher_id || "—"}</strong>
              </div>
              <div className="confirm-row">
                <span>Email</span>
                <strong>{pendingTeacher.email || "—"}</strong>
              </div>
              <div className="confirm-row">
                <span>Phone</span>
                <strong>{pendingTeacher.phone || "—"}</strong>
              </div>
              <div className="confirm-row">
                <span>Institute</span>
                <strong>
                  {lookupName(pendingTeacher.institute_id, institutes)}
                </strong>
              </div>
              <div className="confirm-row">
                <span>Subject</span>
                <strong>
                  {lookupName(pendingTeacher.subject_id, subjects)}
                </strong>
              </div>
              <div className="confirm-row">
                <span>Employee code</span>
                <strong>{pendingTeacher.employee_code || "—"}</strong>
              </div>
              <div className="confirm-row">
                <span>Qualification</span>
                <strong>{pendingTeacher.qualification || "—"}</strong>
              </div>
              <div className="confirm-row">
                <span>IP address</span>
                <strong>{pendingTeacher.ip_address || "—"}</strong>
              </div>
              <div className="confirm-row">
                <span>Coordinates</span>
                <strong>
                  {pendingTeacher.latitude && pendingTeacher.longitude
                    ? `${pendingTeacher.latitude}, ${pendingTeacher.longitude}`
                    : "—"}
                </strong>
              </div>
            </div>

            {saveError && <p className="detect-error">{saveError}</p>}

            <div className="confirm-actions">
              <button
                type="button"
                className="confirm-btn-secondary"
                onClick={cancelPendingTeacher}
                disabled={saving}
              >
                Cancel
              </button>
              <button
                type="button"
                className="confirm-btn-primary"
                onClick={confirmPendingTeacher}
                disabled={saving}
              >
                {saving ? "Adding…" : "Yes, add teacher"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}