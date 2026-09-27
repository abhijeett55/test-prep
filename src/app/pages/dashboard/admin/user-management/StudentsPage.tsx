import { useMemo, useState } from "react";
import { Plus, Search, Pencil, Eye, X } from "lucide-react";
import StudentForm from "../../../../config/nav-user/student/StudentForm";
import type { FormValues, Option } from "../../../../components/FormLayout/types";
import { createStudent } from "../../../../api/student/students";
import "./DefaultPage.css";

const institutes: Option[] = [
  { id: "inst-1", name: "Allen Career Institute" },
  { id: "inst-2", name: "Physics Wallah" },
  { id: "inst-3", name: "Aakash Institute" },
];

const subjects: Option[] = [
  { id: "sub-1", name: "Physics" },
  { id: "sub-2", name: "Chemistry" },
  { id: "sub-3", name: "Mathematics" },
  { id: "sub-4", name: "Biology" },
];

const statuses: Option[] = [
  { id: "ACTIVE", name: "Active" },
  { id: "INACTIVE", name: "Inactive" },
  { id: "BLOCKED", name: "Blocked" },
];

// Mirrors app/models/student.py (Student SQLAlchemy model) field-for-field,
// plus a UI-friendly `subject` label until the form supports multi-select.
type StudentRow = {
  id: string;
  name: string;
  email: string;
  selfPhone: string;
  institute: string;
  status: string;
  address: string;
  fatherName: string;
  fatherPhone: string;
  motherName: string;
  motherPhone: string;
  ipAddress: string; // sourced from form field `ip_address`
  latitude: string;
  longitude: string;
  placeholder: string;
  joinedDate: string; // maps to created_at
};

const MOCK_STUDENTS: StudentRow[] = [
  {
    id: "s-1",
    name: "Aarav Kapoor",
    email: "aarav.kapoor@example.com",
    selfPhone: "98100-00000",
    institute: "Allen Career Institute",
    status: "Active",
    address: "Sector 12, Noida",
    fatherName: "Rajesh Kapoor",
    fatherPhone: "98100-11111",
    motherName: "Sunita Kapoor",
    motherPhone: "98100-22222",
    ipAddress: "103.21.244.10",
    latitude: "28.53500000",
    longitude: "77.39100000",
    placeholder: "",
    joinedDate: "12-Jan-2025",
  },
  {
    id: "s-2",
    name: "Diya Nair",
    email: "diya.nair@example.com",
    selfPhone: "94470-00000",
    institute: "Physics Wallah",
    status: "Active",
    address: "MG Road, Kochi",
    fatherName: "Suresh Nair",
    fatherPhone: "94470-33333",
    motherName: "Lakshmi Nair",
    motherPhone: "94470-44444",
    ipAddress: "182.75.10.5",
    latitude: "9.93120000",
    longitude: "76.26730000",
    placeholder: "",
    joinedDate: "03-Mar-2025",
  },
  {
    id: "s-3",
    name: "Ishaan Verma",
    email: "ishaan.verma@example.com",
    selfPhone: "98290-00000",
    institute: "Aakash Institute",
    status: "Inactive",
    address: "Civil Lines, Jaipur",
    fatherName: "Anil Verma",
    fatherPhone: "98290-55555",
    motherName: "Pooja Verma",
    motherPhone: "98290-66666",
    ipAddress: "117.99.20.3",
    latitude: "26.91240000",
    longitude: "75.78730000",
    placeholder: "",
    joinedDate: "22-Jun-2024",
  },
];

const ENTRY_OPTIONS = [10, 25, 50];

export default function StudentsPage() {
  const [showForm, setShowForm] = useState(false);
  const [students, setStudents] = useState<StudentRow[]>(MOCK_STUDENTS);
  const [search, setSearch] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  // Holds the form values while the confirmation card is open.
  // Nothing is added to the table until the user confirms.
  const [pendingStudent, setPendingStudent] = useState<FormValues | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return students;
    return students.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.institute.toLowerCase().includes(q)
    );
  }, [students, search]);

  const visible = filtered.slice(0, entriesPerPage);

  // Form submit no longer commits directly — it stages the values
  // and opens the confirmation card.
  const handleFormSubmit = async (values: FormValues) => {
    setSaveError(null);
    setPendingStudent(values);
  };

  const cancelPendingStudent = () => {
    if (saving) return; // don't let them cancel mid-request
    setPendingStudent(null);
    setSaveError(null);
  };

  // Now actually persists to the FastAPI backend (POST /students) instead of
  // only updating local state. The row added to the table is built from the
  // server's response, not the raw form values, so it reflects what was
  // really saved (generated id, created_at, any server-side defaults).
  const confirmPendingStudent = async () => {
    if (!pendingStudent || saving) return;

    const instituteName = institutes.find((i) => i.id === pendingStudent.institute_id)?.name ?? "";
    // NOTE: the backend's Student schema has no subject/subjects field yet
    // (that's a many-to-many relation on the model), so this stays a
    // client-side-only label until that endpoint support is added.

    setSaving(true);
    setSaveError(null);

    try {
      const created = await createStudent(pendingStudent);

      const newStudent: StudentRow = {
        id: created.id,
        name: created.full_name,
        email: created.email,
        selfPhone: created.self_phone ?? "",
        institute: institutes.find((i) => i.id === created.institute_id)?.name ?? instituteName,
        status: statuses.find((s) => s.id === created.status)?.name ?? created.status,
        address: created.address,
        fatherName: created.father_name,
        fatherPhone: created.father_phone ?? "",
        motherName: created.mother_name,
        motherPhone: created.mother_phone ?? "",
        ipAddress: created.ip_address ?? "",
        latitude: created.latitude != null ? String(created.latitude) : "",
        longitude: created.longitude != null ? String(created.longitude) : "",
        placeholder: created.placeholder ?? "",
        joinedDate: new Date(created.created_at).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
      };

      setStudents((prev) => [...prev, newStudent]);
      setPendingStudent(null);
      setShowForm(false);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Couldn't save the student. Try again.");
    } finally {
      setSaving(false);
    }
  };

  const pendingInstituteName = pendingStudent
    ? institutes.find((i) => i.id === pendingStudent.institute_id)?.name ?? "—"
    : "";
  const pendingStatusName = pendingStudent
    ? statuses.find((s) => s.id === pendingStudent.status)?.name ?? "—"
    : "";

  return (
    <div className="default-page">
      {showForm ? (
        <StudentForm
          institutes={institutes}
          subjects={subjects}
          statuses={statuses}
          onSubmit={handleFormSubmit}
          onCancel={() => setShowForm(false)}
        />
      ) : students.length === 0 ? (
        <div className="default-empty">
          <p>No students added yet.</p>
          <button type="button" className="add-button" onClick={() => setShowForm(true)}>
            <Plus size={16} strokeWidth={2.4} />
            Add your first student
          </button>
        </div>
      ) : (
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
                  <th>Name</th>
                  <th>Email</th>
                  <th>Self Phone</th>
                  <th>Institute</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th className="col-actions">Actions</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((s, i) => (
                  <tr key={s.id}>
                    <td className="col-sno">{i + 1}</td>
                    <td className="cell-name">{s.name}</td>
                    <td>{s.email}</td>
                    <td>{s.selfPhone || "—"}</td>
                    <td>{s.institute}</td>
                    <td>{s.status}</td>
                    <td>{s.joinedDate}</td>
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
              Showing {visible.length} of {filtered.length} student{filtered.length === 1 ? "" : "s"}
            </div>
          </div>
        </div>
      )}

      {/* Floating action button — bottom-right, only when the form isn't already open */}
      {!showForm && students.length > 0 && (
        <button type="button" className="add-button-fab" onClick={() => setShowForm(true)}>
          <Plus size={18} strokeWidth={2.6} />
          <span>Add Student</span>
        </button>
      )}

      {/* Confirmation card — replaces a generic browser confirm() */}
      {pendingStudent && (
        <div className="confirm-overlay" role="dialog" aria-modal="true">
          <div className="confirm-card">
            <button
              type="button"
              className="confirm-close"
              onClick={cancelPendingStudent}
              aria-label="Close"
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
                <strong>{`${pendingStudent.firstName ?? ""} ${pendingStudent.LastName ?? ""}`.trim() || "—"}</strong>
              </div>
              <div className="confirm-row">
                <span>Email</span>
                <strong>{pendingStudent.email || "—"}</strong>
              </div>
              <div className="confirm-row">
                <span>Self Phone</span>
                <strong>{pendingStudent.phone || "—"}</strong>
              </div>
              <div className="confirm-row">
                <span>Institute</span>
                <strong>{pendingInstituteName}</strong>
              </div>
              <div className="confirm-row">
                <span>Status</span>
                <strong>{pendingStatusName}</strong>
              </div>
              <div className="confirm-row">
                <span>Father's Name</span>
                <strong>{`${pendingStudent.fatherFirstName ?? ""} ${pendingStudent.fatherLastName ?? ""}`.trim() || "—"}</strong>
              </div>
              <div className="confirm-row">
                <span>Father's Phone</span>
                <strong>{pendingStudent.fatherPhone || "—"}</strong>
              </div>
              <div className="confirm-row">
                <span>Mother's Name</span>
                <strong>{`${pendingStudent.motherFirstName ?? ""} ${pendingStudent.motherLastName ?? ""}`.trim() || "—"}</strong>
              </div>
              <div className="confirm-row">
                <span>Mother's Phone</span>
                <strong>{pendingStudent.motherPhone || "—"}</strong>
              </div>
              <div className="confirm-row">
                <span>Address</span>
                <strong>{pendingStudent.address || "—"}</strong>
              </div>
              <div className="confirm-row">
                <span>IP Address</span>
                <strong>{pendingStudent.ip_address || "—"}</strong>
              </div>
              <div className="confirm-row">
                <span>Latitude</span>
                <strong>{pendingStudent.latitude || "—"}</strong>
              </div>
              <div className="confirm-row">
                <span>Longitude</span>
                <strong>{pendingStudent.longitude || "—"}</strong>
              </div>
              <div className="confirm-row">
                <span>Placeholder</span>
                <strong>{pendingStudent.placeholder || "—"}</strong>
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
    </div>
  );
}