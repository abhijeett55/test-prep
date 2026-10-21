import { useEffect, useState } from "react";
import { X, UserCheck } from "lucide-react";
import { getCourse, assignTeachersToCourse } from "../../../../api/auth/admin/courses";
import { listTeachers } from "../../../../api/auth/teacher/teacher";
import type { CourseRow, TeacherRow } from "../../../../api/types";
import { errorMessage } from "../../../../api/client";
import "./DefaultPage.css"; // or the CSS you use for modals

type Props = {
  course: CourseRow;
  onClose: () => void;
  onSaved: () => void;
};

export default function AssignTeachersToCourseDialog({ course, onClose, onSaved }: Props) {
  const [teachers, setTeachers] = useState<TeacherRow[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        // 1. Fetch all teachers
        const allTeachers = await listTeachers();
        setTeachers(allTeachers);

        // 2. Fetch the course detail to get currently assigned teacher IDs
        const detail = await getCourse(course.id);
        setSelected(new Set(detail.teacher_ids));
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
      await assignTeachersToCourse(course.id, Array.from(selected));
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
        <button type="button" className="confirm-close" onClick={onClose} disabled={saving}>
          <X size={16} strokeWidth={2.2} />
        </button>
        <div className="confirm-icon">
          <UserCheck size={20} strokeWidth={2.4} />
        </div>
        <h3 className="confirm-title">Map Teachers to {course.course_name}</h3>
        
        {loading && <p className="profile-loading">Loading teachers…</p>}
        {error && <p className="detect-error">{error}</p>}

        {!loading && teachers.length === 0 && (
          <p style={{ color: "#6b7488", textAlign: "center", padding: 20 }}>
            No teachers found in this institute.
          </p>
        )}

        {!loading && teachers.length > 0 && (
          <div style={{ maxHeight: 300, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8, margin: "12px 0 20px" }}>
            {teachers.map((t) => (
              <label
                key={t.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 14px",
                  border: `1px solid ${selected.has(t.id) ? "#3b4cca" : "#e6e9f0"}`,
                  borderRadius: 8,
                  cursor: "pointer",
                  background: selected.has(t.id) ? "#e8ebfd" : "#fff",
                }}
              >
                <input type="checkbox" checked={selected.has(t.id)} onChange={() => toggle(t.id)} />
                <div>
                  <div style={{ fontWeight: 600 }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: "#6b7488" }}>
                    {t.teacher_id} · {t.subject || "No Subject"}
                  </div>
                </div>
              </label>
            ))}
          </div>
        )}

        <div className="confirm-actions">
          <button className="confirm-btn-secondary" onClick={onClose} disabled={saving}>
            Cancel
          </button>
          <button className="confirm-btn-primary" onClick={save} disabled={saving || loading}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}