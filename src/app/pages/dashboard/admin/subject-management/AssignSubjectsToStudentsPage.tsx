import { useState } from "react";
import { useApi } from "../../../../hooks/useApi";
import { listSubjects } from "../../../../api/auth/admin/subjects";
import { listStudents, bulkAssignStudents } from "../../../../api/auth/admin/students";
import { errorMessage } from "../../../../api/client";
import "../batch-management/DefaultPage.css";

export default function AssignSubjectsToStudentsPage() {
  const { data: subjects, loading: loadingSubs } = useApi(() => listSubjects({}));
  const { data: students, loading: loadingStuds } = useApi(() => listStudents());

  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set());
  
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const toggleStudent = (id: string) => {
    setSelectedStudents((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSave = async () => {
    if (!selectedSubject) return;
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      await bulkAssignStudents({
        student_ids: Array.from(selectedStudents),
        subject_ids: [selectedSubject],
      });
      setSuccess(true);
      setSelectedStudents(new Set());
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="default-page">
      <div className="default-panel">
        <div className="section-bar">Map Subjects to Students</div>
        
        <div style={{ padding: 24 }}>
          {error && <div className="perf-success" style={{ background: "#fdeaea", color: "#c62f2f", marginBottom: 16 }}>{error}</div>}
          {success && <div className="perf-success" style={{ marginBottom: 16 }}>Subject assigned successfully!</div>}

          <label style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24, maxWidth: 400 }}>
            <span style={{ fontWeight: 600, fontSize: 14 }}>Select Subject</span>
            <select 
              className="perf-input" 
              value={selectedSubject} 
              onChange={(e) => setSelectedSubject(e.target.value)}
              disabled={loadingSubs}
            >
              <option value="">Choose a subject...</option>
              {subjects?.map(s => (
                <option key={s.id} value={s.id}>{s.subject_name} ({s.subject_code})</option>
              ))}
            </select>
          </label>

          {selectedSubject && (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <span style={{ fontWeight: 600, fontSize: 14 }}>Select Students</span>
                <span style={{ fontSize: 13, color: "#6b7488" }}>{selectedStudents.size} selected</span>
              </div>

              {loadingStuds ? (
                <p style={{ color: "#6b7488", padding: "20px 0" }}>Loading students…</p>
              ) : (
                <div style={{ 
                  display: "grid", 
                  gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", 
                  gap: 12, 
                  maxHeight: 400, 
                  overflowY: "auto",
                  marginBottom: 24,
                  paddingRight: 8
                }}>
                  {students?.map((s) => (
                    <label 
                      key={s.id} 
                      style={{ 
                        display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", 
                        border: `1px solid ${selectedStudents.has(s.id) ? "#3b4cca" : "#e6e9f0"}`, 
                        borderRadius: 8, cursor: "pointer", background: selectedStudents.has(s.id) ? "#e8ebfd" : "#fff"
                      }}
                    >
                      <input type="checkbox" checked={selectedStudents.has(s.id)} onChange={() => toggleStudent(s.id)} />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 13.5 }}>{s.full_name}</div>
                        <div style={{ fontSize: 12, color: "#6b7488" }}>{s.student_id}</div>
                      </div>
                    </label>
                  ))}
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button className="confirm-btn-primary" onClick={handleSave} disabled={saving || selectedStudents.size === 0}>
                  {saving ? "Saving…" : "Save Mappings"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}