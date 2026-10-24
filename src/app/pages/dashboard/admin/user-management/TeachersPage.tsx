import { useMemo, useState } from "react";
import { Plus, Search, Pencil, Eye, X, BookOpen, Library, Users } from "lucide-react";
import TeacherForm from "../../../../config/nav-user/teacher/TeacherForm";
import type { FormValues } from "../../../../components/FormLayout/types";
import {
  getTeacherOptions,
  listTeachers,
  createTeacher,
  getTeacher,
  type TeacherCreate,
} from "../../../../api/auth/teacher/teacher";
import type {
  TeacherRow,
} from "../../../../api/types";
import { getMyInstitute } from "../../../../api/auth/admin/institute";
import { useApi } from "../../../../hooks/useApi";
import { errorMessage } from "../../../../api/client";
import EditTeacherDialog from "./EditTeacherDialog";
import AssignSubjectsDialog from "./AssignSubjectsDialog";
import AssignCoursesDialog from "./AssignCoursesDialog";
import AssignStudentsDialog from "./AssignStudentsDialog";
import "../DefaultPage.css";

const ENTRY_OPTIONS = [10, 25, 50];

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

export type TeacherDetail = TeacherRow & {
  subject_ids: string[];
  student_ids?: string[];
};

export default function TeachersPage() {
  const { data, loading, error, reload } = useApi(() => listTeachers());
  const { data: options } = useApi(() => getTeacherOptions());
  const { data: myInstitute } = useApi(() => getMyInstitute());

  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  const [editingTeacher, setEditingTeacher] = useState<TeacherDetail | null>(null);
  const [assigningTeacher, setAssigningTeacher] = useState<TeacherDetail | null>(null);
  const [assigningCourses, setAssigningCourses] = useState<TeacherDetail | null>(null);
  const [assigningStudents, setAssigningStudents] = useState<TeacherDetail | null>(null);
  const [rowBusyId, setRowBusyId] = useState<string | null>(null);
  const [viewingTeacher, setViewingTeacher] = useState<TeacherRow | null>(null); 
  const [pendingTeacher, setPendingTeacher] = useState<FormValues | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [tempPassword, setTempPassword] = useState<string | null>(null);

  const teachers = useMemo(() => {
    const allTeachers = data ?? [];
    if (!myInstitute) return [];
    return allTeachers.filter(t => t.institute_id === myInstitute.id);
  }, [data, myInstitute]);

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
    setSaveError(null);
    setPendingTeacher(values);
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
      const { temp_password } = await createTeacher(toPayload(pendingTeacher));
      setTempPassword(temp_password);
      await reload();
      setPendingTeacher(null);
      setShowForm(false);
    } catch (err) {
      setSaveError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  /* ---------- dialogs ---------- */

  const openDialog = async (row: TeacherRow, type: "edit" | "subjects" | "courses" | "students") => {
    setRowBusyId(row.id);
    try {
      const detail = (await getTeacher(row.id)) as TeacherDetail;
      if (type === "edit") setEditingTeacher(detail);
      if (type === "subjects") setAssigningTeacher(detail);
      if (type === "courses") setAssigningCourses(detail);
      if (type === "students") setAssigningStudents(detail);
    } catch (err) {
      window.alert(errorMessage(err));
    } finally {
      setRowBusyId(null);
    }
  };

  const lookupName = (
    id: string | undefined,
    list: { id: string; name: string }[]
  ) => list.find((o) => o.id === id)?.name ?? "—";

  /* ---------- render ---------- */

  return (
    <div className="default-page">
      {/* REMOVED THE EARLY RETURN. USING TERNARY INSTEAD */}
      {showForm && options && myInstitute ? (
        <TeacherForm
          institutes={[{ id: myInstitute.id, name: myInstitute.institute_name }]} 
          subjects={options.subjects}
          onSubmit={handleFormSubmit}
          onCancel={() => setShowForm(false)}
        />
      ) : (
        <>
          {error && (
            <div
              className="perf-success"
              style={{ background: "#fdeaea", color: "#c62f2f", marginBottom: 12 }}
            >
              {error}
            </div>
          )}

          {tempPassword && (
            <div
              className="perf-success"
              style={{ marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}
            >
              <div>
                <strong>Temporary password:</strong>{" "}
                <code style={{ fontFamily: "monospace" }}>{tempPassword}</code>
                <div style={{ fontSize: 12, opacity: 0.75, marginTop: 2 }}>
                  Share with the teacher. Shown only once.
                </div>
              </div>
              <button
                type="button"
                className="perf-btn outline"
                onClick={() => setTempPassword(null)}
              >
                Dismiss
              </button>
            </div>
          )}

          {loading && !data && <div className="default-empty">Loading teachers…</div>}

          {!loading && teachers.length === 0 && (
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
          )}

          {!loading && teachers.length > 0 && (
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
                      <th>Teacher ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Institute</th>
                      <th>Subject</th>
                      <th>Employee Code</th>
                      <th>Qualification</th>
                      <th className="col-actions">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visible.map((t, i) => (
                      <tr key={t.id}>
                        <td className="col-sno">{i + 1}</td>
                        <td>{t.teacher_id}</td>
                        <td className="cell-name">{t.name}</td>
                        <td>{t.email || "—"}</td>
                        <td>{t.phone || "—"}</td>
                        <td>{t.institute || "—"}</td>
                        <td>{t.subject || "—"}</td>
                        <td>{t.employee_code || "—"}</td>
                        <td>{t.qualification || "—"}</td>
                        <td className="col-actions">
                          <button
                            type="button"
                            className="icon-button"
                            title="Assign Subjects"
                            disabled={rowBusyId === t.id}
                            onClick={() => openDialog(t, "subjects")}
                          >
                            <Library size={15} strokeWidth={2} />
                          </button>
                          <button
                            type="button"
                            className="icon-button"
                            title="Assign Courses"
                            disabled={rowBusyId === t.id}
                            onClick={() => openDialog(t, "courses")}
                          >
                            <BookOpen size={15} strokeWidth={2} />
                          </button>
                          <button
                            type="button"
                            className="icon-button"
                            title="Map Students"
                            disabled={rowBusyId === t.id}
                            onClick={() => openDialog(t, "students")}
                          >
                            <Users size={15} strokeWidth={2} />
                          </button>
                          <button
                            type="button"
                            className="icon-button"
                            title="Edit"
                            disabled={rowBusyId === t.id}
                            onClick={() => openDialog(t, "edit")}
                          >
                            <Pencil size={15} strokeWidth={2} />
                          </button>
                          <button
                            type="button"
                            className="icon-button"
                            title="View"
                            onClick={() => setViewingTeacher(t)}
                          >
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
        </>
      )}

      {/* --- Add confirmation (Now it will actually show!) --- */}
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
                  {lookupName(pendingTeacher.institute_id, options?.institutes ?? [])}
                </strong>
              </div>
              <div className="confirm-row">
                <span>Subject</span>
                <strong>
                  {lookupName(pendingTeacher.subject_id, options?.subjects ?? [])}
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
            </div>

            {saveError && <p className="confirm-error">{saveError}</p>}

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

      {/* --- Dialogs --- */}
      {editingTeacher && (
        <EditTeacherDialog
          teacher={editingTeacher}
          onClose={() => setEditingTeacher(null)}
          onSaved={() => {
            setEditingTeacher(null);
            reload();
          }}
        />
      )}

      {assigningTeacher && (
        <AssignSubjectsDialog
          teacher={assigningTeacher}
          onClose={() => setAssigningTeacher(null)}
          onSaved={() => {
            setAssigningTeacher(null);
            reload();
          }}
        />
      )}

      {assigningCourses && (
        <AssignCoursesDialog
          teacher={assigningCourses}
          onClose={() => setAssigningCourses(null)}
          onSaved={() => {
            setAssigningCourses(null);
            reload();
          }}
        />
      )}

      {assigningStudents && (
        <AssignStudentsDialog
          teacher={assigningStudents}
          onClose={() => setAssigningStudents(null)}
          onSaved={() => {
            setAssigningStudents(null);
            reload();
          }}
        />
      )}
    {viewingTeacher && (
      <div className="confirm-overlay" role="dialog" aria-modal="true" onClick={() => setViewingTeacher(null)}>
          <div className="confirm-card" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="confirm-close" onClick={() => setViewingTeacher(null)}>
              <X size={16} strokeWidth={2.2} />
            </button>
            <div className="confirm-icon">
              <Eye size={20} strokeWidth={2.2} />
            </div>
            <h3 className="confirm-title">{viewingTeacher.name}</h3>
            <p className="confirm-subtitle">Teacher details</p>

            <div className="confirm-details">
              <div className="confirm-row"><span>Teacher ID</span><strong>{viewingTeacher.teacher_id || "—"}</strong></div>
              <div className="confirm-row"><span>Email</span><strong>{viewingTeacher.email || "—"}</strong></div>
              <div className="confirm-row"><span>Phone</span><strong>{viewingTeacher.phone || "—"}</strong></div>
              <div className="confirm-row"><span>Institute</span><strong>{viewingTeacher.institute || "—"}</strong></div>
              <div className="confirm-row"><span>Subject</span><strong>{viewingTeacher.subject || "—"}</strong></div>
              <div className="confirm-row"><span>Employee Code</span><strong>{viewingTeacher.employee_code || "—"}</strong></div>
              <div className="confirm-row"><span>Qualification</span><strong>{viewingTeacher.qualification || "—"}</strong></div>
            </div>

            <div className="confirm-actions">
              <button type="button" className="confirm-btn-secondary" onClick={() => setViewingTeacher(null)}>
                Close
              </button>
            </div>
          </div>
      </div>
      )}
    </div>
  );
}