import { useEffect, useState } from "react";
import { X, CheckSquare } from "lucide-react";
import { listSubjects } from "../../../../api/auth/admin/subjects";
import { listTeachers } from "../../../../api/auth/teacher/teacher";
import { bulkAssignStudents } from "../../../../api/auth/admin/students";
import type { SubjectRow, TeacherRow } from "../../../../api/types";
import { errorMessage } from "../../../../api/client";
import "./DefaultPage.css";

type Props = {
  studentIds: string[];
  onClose: () => void;
  onSaved: () => void;
};

export default function BulkAssignDialog({ studentIds, onClose, onSaved }: Props) {
  const [subjects, setSubjects] = useState<SubjectRow[]>([]);
  const [teachers, setTeachers] = useState<TeacherRow[]>([]);
  
  const [selectedSubjects, setSelectedSubjects] = useState<Set<string>>(new Set());
  const [selectedTeachers, setSelectedTeachers] = useState<Set<string>>(new Set());
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [subs, tchs] = await Promise.all([listSubjects({}), listTeachers()]);
        setSubjects(subs);
        setTeachers(tchs);
      } catch (e) {
        setError(errorMessage(e));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const toggleSubject = (id: string) => {
    setSelectedSubjects((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleTeacher = (id: string) => {
    setSelectedTeachers((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const save = async () => {
    if (selectedSubjects.size === 0 && selectedTeachers.size === 0) {
      setError("Please select at least one subject or teacher.");
      return;
    }
    
    setSaving(true);
    setError(null);
    try {
      await bulkAssignStudents({
        student_ids: studentIds,
        subject_ids: Array.from(selectedSubjects),
        teacher_ids: Array.from(selectedTeachers),
      });
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
      <div className="confirm-card" style={{ width: 600 }}>
        <button className="confirm-close" onClick={onClose} disabled={saving}>
          <X size={16} strokeWidth={2.2} />
        </button>
        <div className="confirm-icon"><CheckSquare size={20} strokeWidth={2.4} /></div>
        <h3 className="confirm-title">Bulk Assign to {studentIds.length} Students</h3>
        <p className="confirm-subtitle">Select the subjects and teachers you want to assign to all selected students.</p>
        
        {loading && <p className="profile-loading">Loading data…</p>}
        {error && <p className="detect-error">{error}</p>}

        {!loading && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, margin: "16px 0 24px" }}>
            
            {/* Subjects Column */}
            <div>
              <h4 style={{ fontSize: 14, marginBottom: 8 }}>Subjects</h4>
              <div style={{ maxHeight: 250, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8 }}>
                {subjects.map((s) => (
                  <label key={s.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: 10, border: `1px solid ${selectedSubjects.has(s.id) ? "#3b4cca" : "#e6e9f0"}`, borderRadius: 8, cursor: "pointer", background: selectedSubjects.has(s.id) ? "#e8ebfd" : "#fff" }}>
                    <input type="checkbox" checked={selectedSubjects.has(s.id)} onChange={() => toggleSubject(s.id)} />
                    <span style={{ fontSize: 13, fontWeight: 500 }}>{s.subject_name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Teachers Column */}
            <div>
              <h4 style={{ fontSize: 14, marginBottom: 8 }}>Teachers</h4>
              <div style={{ maxHeight: 250, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8 }}>
                {teachers.map((t) => (
                  <label key={t.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: 10, border: `1px solid ${selectedTeachers.has(t.id) ? "#3b4cca" : "#e6e9f0"}`, borderRadius: 8, cursor: "pointer", background: selectedTeachers.has(t.id) ? "#e8ebfd" : "#fff" }}>
                    <input type="checkbox" checked={selectedTeachers.has(t.id)} onChange={() => toggleTeacher(t.id)} />
                    <span style={{ fontSize: 13, fontWeight: 500 }}>{t.name}</span>
                  </label>
                ))}
              </div>
            </div>

          </div>
        )}

        <div className="confirm-actions">
          <button className="confirm-btn-secondary" onClick={onClose} disabled={saving}>Cancel</button>
          <button className="confirm-btn-primary" onClick={save} disabled={saving || loading}>
            {saving ? "Assigning…" : "Apply to Selected"}
          </button>
        </div>
      </div>
    </div>
  );
}