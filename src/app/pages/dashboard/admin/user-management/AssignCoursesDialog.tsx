import { useEffect, useState } from "react";
import { X, BookOpen } from "lucide-react";
import { listCourses, assignTeachersToCourse } from "../../../../api/auth/admin/courses";
import type { CourseRow, TeacherRow } from "../../../../api/types";
import { errorMessage } from "../../../../api/client";
import "../DefaultPage.css";

type Props = {
  teacher: TeacherRow;
  onClose: () => void;
  onSaved: () => void;
};

export default function AssignCoursesDialog({ teacher, onClose, onSaved }: Props) {
  const [courses, setCourses] = useState<CourseRow[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        // Fetch all courses for this institute
        const rows = await listCourses({ institute_id: teacher.institute_id! });
        setCourses(rows);
      } catch (e) {
        setError(errorMessage(e));
      } finally {
        setLoading(false);
      }
    })();
  }, [teacher.institute_id]);

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      // Assign the selected courses to this teacher
      await assignTeachersToCourse(teacher.id, Array.from(selected));
      onSaved();
      onClose();
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="confirm-overlay" role="dialog" aria-modal="true">
      <div className="confirm-card" style={{ width: 520 }}>
        <button className="confirm-close" onClick={onClose} disabled={saving}>
          <X size={16} strokeWidth={2.2} />
        </button>
        <div className="confirm-icon"><BookOpen size={20} strokeWidth={2.4} /></div>
        <h3 className="confirm-title">Assign Courses to {teacher.name}</h3>
        
        {loading && <p className="profile-loading">Loading courses…</p>}
        {error && <p className="detect-error">{error}</p>}

        {!loading && courses.length === 0 && (
          <p style={{ color: "#6b7488", textAlign: "center", padding: 20 }}>
            No courses available in this institute.
          </p>
        )}

        {!loading && courses.length > 0 && (
          <div style={{ maxHeight: 300, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8, margin: "12px 0 20px" }}>
            {courses.map((c) => (
              <label key={c.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", border: `1px solid ${selected.has(c.id) ? "#3b4cca" : "#e6e9f0"}`, borderRadius: 8, cursor: "pointer", background: selected.has(c.id) ? "#e8ebfd" : "#fff" }}>
                <input type="checkbox" checked={selected.has(c.id)} onChange={() => toggle(c.id)} />
                <div>
                  <div style={{ fontWeight: 600 }}>{c.course_name}</div>
                  <div style={{ fontSize: 12, color: "#6b7488" }}>{c.course_code}</div>
                </div>
              </label>
            ))}
          </div>
        )}

        <div className="confirm-actions">
          <button className="confirm-btn-secondary" onClick={onClose} disabled={saving}>Cancel</button>
          <button className="confirm-btn-primary" onClick={save} disabled={saving || loading}>Save</button>
        </div>
      </div>
    </div>
  );
}