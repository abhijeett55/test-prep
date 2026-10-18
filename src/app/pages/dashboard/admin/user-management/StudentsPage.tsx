import { useMemo, useState } from "react";
import { Plus, Search, Pencil, Eye, X, GraduationCap } from "lucide-react";
import StudentForm from "../../../../config/nav-user/student/StudentForm";
import type { FormValues } from "../../../../components/FormLayout/types";
import {
  listStudents,
  createStudent,
  getStudent,
  getStudentOptions,
  type StudentRow,
  type StudentDetail,
} from "../../../../api/auth/admin/students";
import { useApi } from "../../../../hooks/useApi";
import { errorMessage } from "../../../../api/client";
import EnrollCoursesDialog from "./EnrollCoursesDialog";
import EditStudentDialog from "./EditStudentDialog";
import "./DefaultPage.css";

const ENTRY_OPTIONS = [10, 25, 50];

const STATUS_OPTIONS = [
  { id: "ACTIVE", name: "Active" },
  { id: "INACTIVE", name: "Inactive" },
  { id: "BLOCKED", name: "Blocked" },
];

export default function StudentsPage() {
  const { data, loading, error, reload } = useApi(() => listStudents());
  const { data: options } = useApi(() => getStudentOptions());

  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  const [editingStudent, setEditingStudent] = useState<StudentDetail | null>(null);
  const [enrollingStudent, setEnrollingStudent] = useState<StudentDetail | null>(null);
  const [rowBusyId, setRowBusyId] = useState<string | null>(null);

  const [pendingStudent, setPendingStudent] = useState<FormValues | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const students: StudentRow[] = data ?? [];

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return students;
    return students.filter(
      (s) =>
        s.full_name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.institute.toLowerCase().includes(q) ||
        s.student_id.toLowerCase().includes(q)
    );
  }, [students, search]);

  const visible = filtered.slice(0, entriesPerPage);

  /* ---------- form → confirmation → POST ---------- */

  const handleFormSubmit = async (values: FormValues) => {
    setSaveError(null);
    setPendingStudent(values);
  };

  const cancelPendingStudent = () => {
    if (saving) return;
    setPendingStudent(null);
    setSaveError(null);
  };

  const confirmPendingStudent = async () => {
    if (!pendingStudent || saving) return;
    setSaving(true);
    setSaveError(null);

    try {
      const full_name =
        `${pendingStudent.firstName ?? ""} ${pendingStudent.LastName ?? ""}`.trim();
      const father_name =
        `${pendingStudent.fatherFirstName ?? ""} ${pendingStudent.fatherLastName ?? ""}`.trim();
      const mother_name =
        `${pendingStudent.motherFirstName ?? ""} ${pendingStudent.motherLastName ?? ""}`.trim();

      await createStudent({
        full_name,
        email: pendingStudent.email ?? "",
        institute_id: pendingStudent.institute_id || null,
        father_name,
        mother_name,
        address: pendingStudent.address ?? "",
        self_phone: pendingStudent.phone || null,
        father_phone: pendingStudent.fatherPhone || null,
        mother_phone: pendingStudent.motherPhone || null,
        ip_address: pendingStudent.ip_address || null,
        latitude: pendingStudent.latitude || null,
        longitude: pendingStudent.longitude || null,
      });

      await reload();
      setPendingStudent(null);
      setShowForm(false);
    } catch (err) {
      setSaveError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  /* ---------- open dialogs ---------- */

  const openEnrollDialog = async (row: StudentRow) => {
    setRowBusyId(row.id);
    try {
      setEnrollingStudent(await getStudent(row.id));
    } catch (err) {
      window.alert(errorMessage(err));
    } finally {
      setRowBusyId(null);
    }
  };

  const openEditDialog = async (row: StudentRow) => {
    setRowBusyId(row.id);
    try {
      setEditingStudent(await getStudent(row.id));
    } catch (err) {
      window.alert(errorMessage(err));
    } finally {
      setRowBusyId(null);
    }
  };

  /* ---------- render ---------- */

  if (showForm && options) {
    return (
      <div className="default-page">
        <StudentForm
          institutes={options.institutes}
          subjects={options.subjects}
          statuses={STATUS_OPTIONS}
          onSubmit={handleFormSubmit}
          onCancel={() => setShowForm(false)}
        />
      </div>
    );
  }

  return (
    <div className="default-page">
      {error && (
        <div
          className="perf-success"
          style={{ background: "#fdeaea", color: "#c62f2f", marginBottom: 12 }}
        >
          {error}
        </div>
      )}

      {loading && !data && <div className="default-empty">Loading students…</div>}

      {!loading && students.length === 0 && (
        <div className="default-empty">
          <p>No students added yet.</p>
          <button
            type="button"
            className="add-button"
            onClick={() => setShowForm(true)}
          >
            <Plus size={16} strokeWidth={2.4} />
            Add your first student
          </button>
        </div>
      )}

      {!loading && students.length > 0 && (
        <div className="default-panel">
          <div className="section-bar">All Students</div>

          <div className="default-toolbar">
            <div className="search-control">
              <Search size={15} strokeWidth={2} />
              <input
                type="text"
                placeholder="Search students…"
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
                  <th>Student ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Self Phone</th>
                  <th>Institute</th>
                  <th>Batch</th>
                  <th>Status</th>
                  <th className="col-actions">Actions</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((s, i) => (
                  <tr key={s.id}>
                    <td className="col-sno">{i + 1}</td>
                    <td>{s.student_id}</td>
                    <td className="cell-name">{s.full_name}</td>
                    <td>{s.email}</td>
                    <td>{s.self_phone || "—"}</td>
                    <td>{s.institute || "—"}</td>
                    <td>{s.batch_name ?? "—"}</td>
                    <td>{s.status}</td>
                    <td className="col-actions">
                      <button
                        type="button"
                        className="icon-button"
                        title="Enroll in courses"
                        disabled={rowBusyId === s.id}
                        onClick={() => openEnrollDialog(s)}
                      >
                        <GraduationCap size={15} strokeWidth={2} />
                      </button>
                      <button
                        type="button"
                        className="icon-button"
                        title="Edit"
                        disabled={rowBusyId === s.id}
                        onClick={() => openEditDialog(s)}
                      >
                        <Pencil size={15} strokeWidth={2} />
                      </button>
                      <button
                        type="button"
                        className="icon-button"
                        title="View"
                      >
                        <Eye size={15} strokeWidth={2} />
                      </button>
                    </td>
                  </tr>
                ))}

                {visible.length === 0 && (
                  <tr>
                    <td colSpan={9} className="no-results">
                      No students match "{search}".
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
              Showing {visible.length} of {filtered.length} student
              {filtered.length === 1 ? "" : "s"}
            </div>
          </div>
        </div>
      )}

      {!showForm && students.length > 0 && (
        <button
          type="button"
          className="add-button-fab"
          onClick={() => setShowForm(true)}
        >
          <Plus size={18} strokeWidth={2.6} />
          <span>Add Student</span>
        </button>
      )}

      {/* --- Add confirmation --- */}
      {pendingStudent && (
        <div className="confirm-overlay" role="dialog" aria-modal="true">
          <div className="confirm-card">
            <button
              type="button"
              className="confirm-close"
              onClick={cancelPendingStudent}
              aria-label="Close"
              disabled={saving}
            >
              <X size={16} strokeWidth={2.2} />
            </button>

            <div className="confirm-icon">
              <Plus size={20} strokeWidth={2.4} />
            </div>

            <h3 className="confirm-title">Add this student?</h3>
            <p className="confirm-subtitle">
              Please confirm the details before adding them to the list.
            </p>

            <div className="confirm-details">
              <div className="confirm-row">
                <span>Name</span>
                <strong>
                  {`${pendingStudent.firstName ?? ""} ${pendingStudent.LastName ?? ""}`.trim() || "—"}
                </strong>
              </div>
              <div className="confirm-row">
                <span>Email</span>
                <strong>{pendingStudent.email || "—"}</strong>
              </div>
              <div className="confirm-row">
                <span>Institute</span>
                <strong>{pendingStudent.institute_id || "—"}</strong>
              </div>
              <div className="confirm-row">
                <span>Address</span>
                <strong>{pendingStudent.address || "—"}</strong>
              </div>
            </div>

            {saveError && <p className="confirm-error">{saveError}</p>}

            <div className="confirm-actions">
              <button
                type="button"
                className="confirm-btn-secondary"
                onClick={cancelPendingStudent}
                disabled={saving}
              >
                Cancel
              </button>
              <button
                type="button"
                className="confirm-btn-primary"
                onClick={confirmPendingStudent}
                disabled={saving}
              >
                {saving ? "Saving…" : "Yes, add student"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- Edit dialog --- */}
      {editingStudent && (
        <EditStudentDialog
          student={editingStudent}
          onClose={() => setEditingStudent(null)}
          onSaved={() => {
            setEditingStudent(null);
            reload();
          }}
        />
      )}

      {/* --- Enroll courses dialog --- */}
      {enrollingStudent && (
        <EnrollCoursesDialog
          student={enrollingStudent}
          onClose={() => setEnrollingStudent(null)}
          onSaved={() => {
            setEnrollingStudent(null);
            reload();
          }}
        />
      )}
    </div>
  );
}