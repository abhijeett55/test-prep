import { useEffect, useState } from "react";
import { X, BookOpen } from "lucide-react";
import { listSubjects } from "../../../../api/auth/admin/subjects";
import { assignSubjects } from "../../../../api/auth/admin/students";
import type { SubjectRow, StudentDetail } from "../../../../api/types";
import { errorMessage } from "../../../../api/client";
import "../DefaultPage.css";

type Props = {
  student: StudentDetail;
  onClose: () => void;
  onSaved: () => void;
};

export default function AssignSubjectsToStudentDialog({ student, onClose, onSaved }: Props) {
  const [subjects, setSubjects] = useState<SubjectRow[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set(student.subject_ids || []));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const rows = await listSubjects({});
        setSubjects(rows);
      } catch (e) {
        setError(errorMessage(e));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

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
      await assignSubjects(student.id, Array.from(selected));
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
        <h3 className="confirm-title">Assign Subjects to {student.full_name}</h3>
        
        {loading && <p className="profile-loading">Loading subjects…</p>}
        {error && <p className="detect-error">{error}</p>}

        {!loading && subjects.length === 0 && (
          <p style={{ color: "#6b7488", textAlign: "center", padding: 20 }}>
            No subjects found in this institute.
          </p>
        )}

        {!loading && subjects.length > 0 && (
          <div style={{ maxHeight: 300, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8, margin: "12px 0 20px" }}>
            {subjects.map((s) => (
              <label key={s.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", border: `1px solid ${selected.has(s.id) ? "#3b4cca" : "#e6e9f0"}`, borderRadius: 8, cursor: "pointer", background: selected.has(s.id) ? "#e8ebfd" : "#fff" }}>
                <input type="checkbox" checked={selected.has(s.id)} onChange={() => toggle(s.id)} />
                <div>
                  <div style={{ fontWeight: 600 }}>{s.subject_name}</div>
                  <div style={{ fontSize: 12, color: "#6b7488" }}>{s.subject_code}</div>
                </div>
              </label>
            ))}
          </div>
        )}

        <div className="confirm-actions">
          <button className="confirm-btn-secondary" onClick={onClose} disabled={saving}>Cancel</button>
          <button className="confirm-btn-primary" onClick={save} disabled={saving || loading}>
            Save ({selected.size})
          </button>
        </div>
      </div>
    </div>
  );
}