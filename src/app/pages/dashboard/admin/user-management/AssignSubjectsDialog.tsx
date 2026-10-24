import { useEffect, useState } from "react";
import { X, BookOpen } from "lucide-react";
import {
  listSubjects,
  type SubjectRow,
} from "../../../../api/auth/admin/subjects";
import {
  setTeacherSubjects,
  type TeacherDetail,
} from "../../../../api/auth/teacher/teacher";
import { errorMessage } from "../../../../api/client";
import "../DefaultPage.css";

type Props = {
  teacher: TeacherDetail;
  onClose: () => void;
  onSaved: (updated: TeacherDetail) => void;
};

export default function AssignSubjectsDialog({ teacher, onClose, onSaved }: Props) {
  const [subjects, setSubjects] = useState<SubjectRow[]>([]);
  const [selected, setSelected] = useState<Set<string>>(
    new Set(teacher.subject_ids)
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const rows = await listSubjects(
          teacher.institute_id ? { institute_id: teacher.institute_id } : {}
        );
        if (!cancelled) setSubjects(rows);
      } catch (e) {
        if (!cancelled) setError(errorMessage(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [teacher.institute_id]);

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
      const updated = (await setTeacherSubjects(
        teacher.id,
        Array.from(selected)
      )) as TeacherDetail;
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
    selectedCount !== teacher.subject_ids.length ||
    teacher.subject_ids.some((id) => !selected.has(id));

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

        <h3 className="confirm-title">Assign subjects to {teacher.name}</h3>
        <p className="confirm-subtitle">
          Select the subjects this teacher handles. Changes are saved when you
          click Save.
        </p>

        {loading && <p className="profile-loading">Loading subjects…</p>}

        {error && (
          <p className="detect-error" style={{ margin: "0 0 12px", fontSize: 13 }}>
            {error}
          </p>
        )}

        {!loading && subjects.length === 0 && !error && (
          <p style={{ color: "#6b7488", fontSize: 13.5, padding: "20px 0", textAlign: "center" }}>
            No subjects available in this teacher's institute yet.
          </p>
        )}

        {!loading && subjects.length > 0 && (
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
            {subjects.map((s) => {
              const checked = selected.has(s.id);
              return (
                <label
                  key={s.id}
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
                    onChange={() => toggle(s.id)}
                    style={{ accentColor: "#3b4cca" }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: 13.5,
                        color: "#172033",
                      }}
                    >
                      {s.subject_name}
                    </div>
                    <div style={{ fontSize: 12, color: "#6b7488", marginTop: 2 }}>
                      {s.subject_code}
                    </div>
                  </div>
                </label>
              );
            })}
          </div>
        )}

        <div className="confirm-actions">
          <button className="confirm-btn-secondary" onClick={onClose} disabled={saving}>
            Cancel
          </button>
          <button
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