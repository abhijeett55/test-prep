import { useEffect, useState } from "react";
import { X, BookOpen } from "lucide-react";
import {
  listCourses,
  type CourseRow,
} from "../../../../api/auth/admin/courses";
import { setStudentCourses } from "../../../../api/auth/admin/students";
import type { StudentDetail } from "../../../../api/auth/admin/students";
import { errorMessage } from "../../../../api/client";
import "../DefaultPage.css";

type Props = {
  student: StudentDetail;
  onClose: () => void;
  onSaved: (updated: StudentDetail) => void;
};

export default function EnrollCoursesDialog({
  student,
  onClose,
  onSaved,
}: Props) {
  const [courses, setCourses] = useState<CourseRow[]>([]);
  const [selected, setSelected] = useState<Set<string>>(
    new Set(student.course_ids)
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        // Scope courses to the student's institute when we know it.
        const rows = await listCourses(
          student.institute_id ? { institute_id: student.institute_id } : {}
        );
        if (!cancelled) setCourses(rows);
      } catch (e) {
        if (!cancelled) setError(errorMessage(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [student.institute_id]);

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
      const updated = await setStudentCourses(student.id, Array.from(selected));
      onSaved(updated);
      onClose();
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setSaving(false);
    }
  };

  const selectedCount = selected.size;
  const hasChanges =
    selectedCount !== student.course_ids.length ||
    student.course_ids.some((id) => !selected.has(id));

  return (
    <div className="confirm-overlay" role="dialog" aria-modal="true">
      <div className="confirm-card" style={{ width: 520, maxWidth: "calc(100vw - 32px)" }}>
        <button
          type="button"
          className="confirm-close"
          onClick={onClose}
          aria-label="Close"
          disabled={saving}
        >
          <X size={16} strokeWidth={2.2} />
        </button>

        <div className="confirm-icon">
          <BookOpen size={20} strokeWidth={2.4} />
        </div>

        <h3 className="confirm-title">Enroll {student.full_name}</h3>
        <p className="confirm-subtitle">
          Select the courses this student is enrolled in. Changes are saved when
          you click Save.
        </p>

        {loading && <p className="profile-loading">Loading courses…</p>}

        {error && (
          <p
            className="detect-error"
            style={{ margin: "0 0 12px", fontSize: 13 }}
          >
            {error}
          </p>
        )}

        {!loading && courses.length === 0 && !error && (
          <p
            style={{
              color: "#6b7488",
              fontSize: 13.5,
              padding: "20px 0",
              textAlign: "center",
            }}
          >
            No courses available in this student's institute yet.
          </p>
        )}

        {!loading && courses.length > 0 && (
          <div
            style={{
              maxHeight: 320,
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: 8,
              margin: "12px 0 20px",
              paddingRight: 4,
            }}
          >
            {courses.map((c) => {
              const checked = selected.has(c.id);
              return (
                <label
                  key={c.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "10px 14px",
                    border: `1px solid ${checked ? "#3b4cca" : "#e6e9f0"}`,
                    borderRadius: 8,
                    cursor: "pointer",
                    background: checked ? "#e8ebfd" : "#fff",
                    transition: "background 0.12s ease, border-color 0.12s ease",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggle(c.id)}
                    style={{ accentColor: "#3b4cca" }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: 13.5,
                        color: "#172033",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {c.course_name}
                    </div>
                    <div style={{ fontSize: 12, color: "#6b7488", marginTop: 2 }}>
                      {c.course_code}
                      {c.institute ? ` · ${c.institute}` : ""}
                    </div>
                  </div>
                </label>
              );
            })}
          </div>
        )}

        <div className="confirm-actions">
          <button
            type="button"
            className="confirm-btn-secondary"
            onClick={onClose}
            disabled={saving}
          >
            Cancel
          </button>
          <button
            type="button"
            className="confirm-btn-primary"
            onClick={save}
            disabled={saving || loading || !hasChanges}
          >
            {saving
              ? "Saving…"
              : selectedCount === 0
                ? "Save (none)"
                : `Save (${selectedCount})`}
          </button>
        </div>
      </div>
    </div>
  );
}