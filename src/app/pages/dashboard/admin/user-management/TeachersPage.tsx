import { useMemo, useState } from "react";
import { Plus, Search, Pencil, Eye, X } from "lucide-react";
import TeacherForm from "../../../../config/nav-user/teacher/TeacherForm";
import type { FormValues, Option } from "../../../../components/FormLayout/types";
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

type TeacherRow = {
  id: string;
  name: string;
  email: string;
  institute: string;
  subject: string;
  employeeCode: string;
  joinedDate: string;
};

const MOCK_TEACHERS: TeacherRow[] = [
  {
    id: "t-1",
    name: "Ravi Sharma",
    email: "ravi.sharma@example.com",
    institute: "Allen Career Institute",
    subject: "Physics",
    employeeCode: "EMP-1042",
    joinedDate: "12-Jan-2025",
  },
  {
    id: "t-2",
    name: "Ananya Iyer",
    email: "ananya.iyer@example.com",
    institute: "Physics Wallah",
    subject: "Chemistry",
    employeeCode: "EMP-1088",
    joinedDate: "03-Mar-2025",
  },
  {
    id: "t-3",
    name: "Karan Mehta",
    email: "karan.mehta@example.com",
    institute: "Aakash Institute",
    subject: "Mathematics",
    employeeCode: "EMP-1103",
    joinedDate: "22-Jun-2024",
  },
];

const ENTRY_OPTIONS = [10, 25, 50];

export default function TeachersPage() {
  const [showForm, setShowForm] = useState(false);
  const [teachers, setTeachers] = useState<TeacherRow[]>(MOCK_TEACHERS);
  const [search, setSearch] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  // Holds the form values while the confirmation card is open.
  // Nothing is added to the table until the user confirms.
  const [pendingTeacher, setPendingTeacher] = useState<FormValues | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return teachers;
    return teachers.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.email.toLowerCase().includes(q) ||
        t.institute.toLowerCase().includes(q) ||
        t.subject.toLowerCase().includes(q)
    );
  }, [teachers, search]);

  const visible = filtered.slice(0, entriesPerPage);

  // Form submit no longer commits directly — it stages the values
  // and opens the confirmation card.
  const handleFormSubmit = async (values: FormValues) => {
    setPendingTeacher(values);
  };

  const cancelPendingTeacher = () => setPendingTeacher(null);

  const confirmPendingTeacher = () => {
    if (!pendingTeacher) return;
    const newTeacher: TeacherRow = {
      id: crypto.randomUUID(),
      name: pendingTeacher.fullName ?? "",
      email: pendingTeacher.email ?? "",
      institute: institutes.find((i) => i.id === pendingTeacher.institute_id)?.name ?? "",
      subject: subjects.find((s) => s.id === pendingTeacher.subject_id)?.name ?? "",
      employeeCode: pendingTeacher.employee_code ?? "",
      joinedDate: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    };

    setTeachers((prev) => [...prev, newTeacher]);
    setPendingTeacher(null);
    setShowForm(false);
  };

  const pendingInstituteName = pendingTeacher
    ? institutes.find((i) => i.id === pendingTeacher.institute_id)?.name ?? "—"
    : "";
  const pendingSubjectName = pendingTeacher
    ? subjects.find((s) => s.id === pendingTeacher.subject_id)?.name ?? "—"
    : "";

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
          <button type="button" className="add-button" onClick={() => setShowForm(true)}>
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
                  <th>Institute</th>
                  <th>Subject</th>
                  <th>Employee Code</th>
                  <th>Joined</th>
                  <th className="col-actions">Actions</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((t, i) => (
                  <tr key={t.id}>
                    <td className="col-sno">{i + 1}</td>
                    <td className="cell-name">{t.name}</td>
                    <td>{t.email}</td>
                    <td>{t.institute}</td>
                    <td>{t.subject}</td>
                    <td>{t.employeeCode}</td>
                    <td>{t.joinedDate}</td>
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
              Showing {visible.length} of {filtered.length} teacher{filtered.length === 1 ? "" : "s"}
            </div>
          </div>
        </div>
      )}

      {/* Floating action button — bottom-right, only when the form isn't already open */}
      {!showForm && teachers.length > 0 && (
        <button type="button" className="add-button-fab" onClick={() => setShowForm(true)}>
          <Plus size={18} strokeWidth={2.6} />
          <span>Add Teacher</span>
        </button>
      )}

      {/* Confirmation card — replaces a generic browser confirm() */}
      {pendingTeacher && (
        <div className="confirm-overlay" role="dialog" aria-modal="true">
          <div className="confirm-card">
            <button
              type="button"
              className="confirm-close"
              onClick={cancelPendingTeacher}
              aria-label="Close"
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
                <span>Name</span>
                <strong>{pendingTeacher.fullName || "—"}</strong>
              </div>
              <div className="confirm-row">
                <span>Email</span>
                <strong>{pendingTeacher.email || "—"}</strong>
              </div>
              <div className="confirm-row">
                <span>Institute</span>
                <strong>{pendingInstituteName}</strong>
              </div>
              <div className="confirm-row">
                <span>Subject</span>
                <strong>{pendingSubjectName}</strong>
              </div>
              <div className="confirm-row">
                <span>Employee Code</span>
                <strong>{pendingTeacher.employee_code || "—"}</strong>
              </div>
            </div>

            <div className="confirm-actions">
              <button type="button" className="confirm-btn-secondary" onClick={cancelPendingTeacher}>
                Cancel
              </button>
              <button type="button" className="confirm-btn-primary" onClick={confirmPendingTeacher}>
                Yes, add teacher
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}