import { useEffect, useState } from "react";
import { X, GraduationCap } from "lucide-react";
import { getCourse, enrollStudentsInCourse } from "../../../../api/auth/admin/courses";
import { listStudents } from "../../../../api/auth/admin/students";
import type { CourseRow, StudentRow } from "../../../../api/types";
import { errorMessage } from "../../../../api/client";
import "./DefaultPage.css";

type Props = {
  course: CourseRow;
  onClose: () => void;
  onSaved: () => void;
};

export default function EnrollStudentsDialog({ course, onClose, onSaved }: Props) {
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [allStudents, courseDetail] = await Promise.all([
          listStudents(),
          getCourse(course.id)
        ]);
        setStudents(allStudents);
        setSelected(new Set(courseDetail.student_ids || []));
      } catch (e) {
        setError(errorMessage(e));
      } finally {
        setLoading(false);
      }
    })();
  }, [course.id]);

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      await enrollStudentsInCourse(course.id, Array.from(selected));
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
        <div className="confirm-icon"><GraduationCap size={20} strokeWidth={2.4} /></div>
        <h3 className="confirm-title">Enroll Students in {course.course_name}</h3>
        
        {loading && <p className="profile-loading">Loading students…</p>}
        {error && <p className="detect-error">{error}</p>}

        {!loading && students.length === 0 && (
          <p style={{ color: "#6b7488", textAlign: "center", padding: 20 }}>
            No students found in this institute.
          </p>
        )}

        {!loading && students.length > 0 && (
          <div style={{ maxHeight: 300, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8, margin: "12px 0 20px" }}>
            {students.map((s) => (
              <label key={s.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", border: `1px solid ${selected.has(s.id) ? "#3b4cca" : "#e6e9f0"}`, borderRadius: 8, cursor: "pointer", background: selected.has(s.id) ? "#e8ebfd" : "#fff" }}>
                <input type="checkbox" checked={selected.has(s.id)} onChange={() => toggle(s.id)} />
                <div>
                  <div style={{ fontWeight: 600 }}>{s.full_name}</div>
                  <div style={{ fontSize: 12, color: "#6b7488" }}>{s.student_id} · {s.email}</div>
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