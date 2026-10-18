import { useMemo, useState } from "react";
import { Plus, Search, Pencil, Trash2, BookOpen } from "lucide-react";
import {
  listCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  type CourseCreate,
} from "../../../../api/auth/admin/courses";
import type { CourseRow } from "../../../../api/types";
import { getMyInstitute } from "../../../../api/auth/admin/institute";
import { useApi } from "../../../../hooks/useApi";
import { errorMessage } from "../../../../api/client";
import "./DefaultPage.css";

const ENTRY_OPTIONS = [10, 25, 50];

type FormValues = {
  institute_id: string;
  course_name: string;
  course_code: string;
  course_description: string;
};

const emptyForm: FormValues = {
  institute_id: "",
  course_name: "",
  course_code: "",
  course_description: "",
};

export default function CoursesPage() {
  const { data, loading, error, reload } = useApi(() => listCourses());
  const { data: myInstitute } = useApi(() => getMyInstitute());

  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormValues>(emptyForm);
  const [pending, setPending] = useState<FormValues | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const courses: CourseRow[] = data ?? [];

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return courses;
    return courses.filter(
      (c) =>
        c.course_name.toLowerCase().includes(q) ||
        c.course_code.toLowerCase().includes(q) ||
        (c.course_description ?? "").toLowerCase().includes(q) ||
        c.institute.toLowerCase().includes(q)
    );
  }, [courses, search]);

  const visible = filtered.slice(0, entriesPerPage);

  /* ---------- form ---------- */

  const openCreate = () => {
    setEditingId(null);
    setForm({
      ...emptyForm,
      institute_id: myInstitute?.id ?? "",
    });
    setShowForm(true);
  };

  const openEdit = (row: CourseRow) => {
    setEditingId(row.id);
    setForm({
      institute_id: row.institute_id,
      course_name: row.course_name,
      course_code: row.course_code,
      course_description: row.course_description ?? "",
    });
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.institute_id ||
      !form.course_name.trim() ||
      !form.course_code.trim()
    ) {
      setSaveError("Name and code are required.");
      return;
    }
    setSaveError(null);
    setPending(form);
  };

  const confirmSave = async () => {
    if (!pending || saving) return;
    setSaving(true);
    setSaveError(null);
    try {
      const payload: CourseCreate = {
        institute_id: pending.institute_id,
        course_name: pending.course_name.trim(),
        course_code: pending.course_code.trim(),
        course_description: pending.course_description.trim() || null,
      };
      if (editingId) {
        await updateCourse(editingId, payload);
      } else {
        await createCourse(payload);
      }
      await reload();
      setPending(null);
      setShowForm(false);
      setEditingId(null);
    } catch (err) {
      setSaveError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (row: CourseRow) => {
    if (!window.confirm(`Delete "${row.course_name}"?`)) return;
    setDeletingId(row.id);
    try {
      await deleteCourse(row.id);
      await reload();
    } catch (err) {
      window.alert(errorMessage(err));
    } finally {
      setDeletingId(null);
    }
  };

  /* ---------- render ---------- */

  if (showForm && myInstitute) {
    return (
      <div className="default-page">
        <form
          className="confirm-card"
          style={{ width: "100%", maxWidth: 720, margin: "0 auto" }}
          onSubmit={handleSubmit}
        >
          <h3 className="confirm-title">
            {editingId ? "Edit course" : "Create course"}
          </h3>
          <p className="confirm-subtitle">
            {editingId
              ? "Update the course details."
              : "Add a new course to your institute."}
          </p>

          {saveError && (
            <p className="detect-error" style={{ margin: "0 0 12px" }}>
              {saveError}
            </p>
          )}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "14px 16px",
              margin: "12px 0 20px",
            }}
          >
            {/* Institute is fixed — an admin belongs to one institute. */}
            <label
              style={{
                gridColumn: "1 / -1",
                display: "flex",
                flexDirection: "column",
                gap: 4,
              }}
            >
              <span style={{ fontSize: 12.5, color: "#6b7488" }}>Institute</span>
              <input
                value={myInstitute.institute_name}
                disabled
                style={{
                  height: 40,
                  padding: "0 10px",
                  border: "1px solid #d5d9e6",
                  borderRadius: 8,
                  fontSize: 13.5,
                  background: "#f7f8fc",
                  color: "#6b7488",
                }}
              />
            </label>

            <label
              style={{
                gridColumn: "1 / -1",
                display: "flex",
                flexDirection: "column",
                gap: 4,
              }}
            >
              <span style={{ fontSize: 12.5, color: "#6b7488" }}>
                Course name *
              </span>
              <input
                value={form.course_name}
                onChange={(e) =>
                  setForm({ ...form, course_name: e.target.value })
                }
                placeholder="e.g. Foundation Mathematics"
                style={{
                  height: 40,
                  padding: "0 10px",
                  border: "1px solid #d5d9e6",
                  borderRadius: 8,
                  fontSize: 13.5,
                }}
              />
            </label>

            <label
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 4,
              }}
            >
              <span style={{ fontSize: 12.5, color: "#6b7488" }}>
                Course code *
              </span>
              <input
                value={form.course_code}
                onChange={(e) =>
                  setForm({ ...form, course_code: e.target.value })
                }
                placeholder="e.g. FOUND-MATH-10"
                style={{
                  height: 40,
                  padding: "0 10px",
                  border: "1px solid #d5d9e6",
                  borderRadius: 8,
                  fontSize: 13.5,
                }}
              />
            </label>

            <label
              style={{
                gridColumn: "1 / -1",
                display: "flex",
                flexDirection: "column",
                gap: 4,
              }}
            >
              <span style={{ fontSize: 12.5, color: "#6b7488" }}>
                Description
              </span>
              <textarea
                value={form.course_description}
                onChange={(e) =>
                  setForm({ ...form, course_description: e.target.value })
                }
                rows={3}
                placeholder="Optional — brief summary of the course"
                style={{
                  padding: "10px 12px",
                  border: "1px solid #d5d9e6",
                  borderRadius: 8,
                  fontSize: 13.5,
                  resize: "vertical",
                }}
              />
            </label>
          </div>

          <div className="confirm-actions">
            <button
              type="button"
              className="confirm-btn-secondary"
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
                setSaveError(null);
              }}
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="confirm-btn-primary"
              disabled={saving}
            >
              {editingId ? "Save changes" : "Create course"}
            </button>
          </div>
        </form>

        {pending && (
          <div className="confirm-overlay" role="dialog" aria-modal="true">
            <div className="confirm-card">
              <div className="confirm-icon">
                <BookOpen size={20} strokeWidth={2.4} />
              </div>
              <h3 className="confirm-title">
                {editingId ? "Save changes?" : "Create this course?"}
              </h3>
              <p className="confirm-subtitle">
                Please confirm before saving.
              </p>
              <div className="confirm-details">
                <div className="confirm-row">
                  <span>Institute</span>
                  <strong>{myInstitute.institute_name}</strong>
                </div>
                <div className="confirm-row">
                  <span>Name</span>
                  <strong>{pending.course_name || "—"}</strong>
                </div>
                <div className="confirm-row">
                  <span>Code</span>
                  <strong>{pending.course_code || "—"}</strong>
                </div>
              </div>
              {saveError && <p className="detect-error">{saveError}</p>}
              <div className="confirm-actions">
                <button
                  type="button"
                  className="confirm-btn-secondary"
                  onClick={() => setPending(null)}
                  disabled={saving}
                >
                  Back
                </button>
                <button
                  type="button"
                  className="confirm-btn-primary"
                  onClick={confirmSave}
                  disabled={saving}
                >
                  {saving ? "Saving…" : "Confirm"}
                </button>
              </div>
            </div>
          </div>
        )}
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

      {loading && !data && <div className="default-empty">Loading courses…</div>}

      {!loading && courses.length === 0 && (
        <div className="default-empty">
          <p>No courses yet.</p>
          <button type="button" className="add-button" onClick={openCreate}>
            <Plus size={16} strokeWidth={2.4} />
            Create your first course
          </button>
        </div>
      )}

      {!loading && courses.length > 0 && (
        <div className="default-panel">
          <div className="section-bar">All Courses</div>

          <div className="default-toolbar">
            <div className="search-control">
              <Search size={15} strokeWidth={2} />
              <input
                type="text"
                placeholder="Search courses…"
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
                  <th>Code</th>
                  <th>Name</th>
                  <th>Institute</th>
                  <th>Students</th>
                  <th>Teachers</th>
                  <th>Description</th>
                  <th className="col-actions">Actions</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((c, i) => (
                  <tr key={c.id}>
                    <td className="col-sno">{i + 1}</td>
                    <td>{c.course_code}</td>
                    <td className="cell-name">{c.course_name}</td>
                    <td>{c.institute || "—"}</td>
                    <td>{c.student_count}</td>
                    <td>{c.teacher_count}</td>
                    <td title={c.course_description ?? ""}>
                      {c.course_description || "—"}
                    </td>
                    <td className="col-actions">
                      <button
                        type="button"
                        className="icon-button"
                        title="Edit"
                        onClick={() => openEdit(c)}
                      >
                        <Pencil size={15} strokeWidth={2} />
                      </button>
                      <button
                        type="button"
                        className="icon-button"
                        title="Delete"
                        onClick={() => handleDelete(c)}
                        disabled={deletingId === c.id}
                      >
                        <Trash2 size={15} strokeWidth={2} />
                      </button>
                    </td>
                  </tr>
                ))}

                {visible.length === 0 && (
                  <tr>
                    <td colSpan={8} className="no-results">
                      No courses match "{search}".
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
              Showing {visible.length} of {filtered.length} course
              {filtered.length === 1 ? "" : "s"}
            </div>
          </div>
        </div>
      )}

      {!showForm && courses.length > 0 && (
        <button type="button" className="add-button-fab" onClick={openCreate}>
          <Plus size={18} strokeWidth={2.6} />
          <span>Create Course</span>
        </button>
      )}
    </div>
  );
}