import { useState, useMemo } from "react";
import { useApi } from "../../../../hooks/useApi";
import { listSubjects, assignSubjectToTeacher } from "../../../../api/auth/admin/subjects";
import { listTeachers } from "../../../../api/auth/teacher/teacher";
import { getMyInstitute } from "../../../../api/auth/admin/institute"; // <-- Import this
import { errorMessage } from "../../../../api/client";
import "../batch-management/DefaultPage.css";

export default function AssignTeachersToSubjectPage() {
  const { data: subjects, loading: loadingSubs } = useApi(() => listSubjects({}));
  const { data: allTeachers, loading: loadingTchs } = useApi(() => listTeachers());
  const { data: myInstitute } = useApi(() => getMyInstitute()); // <-- Fetch Admin's institute

  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedTeachers, setSelectedTeachers] = useState<Set<string>>(new Set());
  
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // FIX: Only show teachers that belong to the admin's institute
  const teachers = useMemo(() => {
    if (!allTeachers || !myInstitute) return [];
    return allTeachers.filter(t => t.institute_id === myInstitute.id);
  }, [allTeachers, myInstitute]);

  const toggleTeacher = (id: string) => {
    setSelectedTeachers((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSave = async () => {
    if (!selectedSubject || selectedTeachers.size === 0) return;
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      await Promise.all(
        Array.from(selectedTeachers).map((teacherId) =>
          assignSubjectToTeacher(selectedSubject, teacherId)
        )
      );
      
      setSuccess(true);
      setSelectedTeachers(new Set());
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="default-page">
      <div className="default-panel">
        <div className="section-bar">Map Teachers to Subject</div>
        
        <div style={{ padding: 24 }}>
          {error && <div className="perf-success" style={{ background: "#fdeaea", color: "#c62f2f", marginBottom: 16 }}>{error}</div>}
          {success && <div className="perf-success" style={{ marginBottom: 16 }}>Teachers assigned successfully!</div>}

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
                <span style={{ fontWeight: 600, fontSize: 14 }}>Select Teachers</span>
                <span style={{ fontSize: 13, color: "#6b7488" }}>{selectedTeachers.size} selected</span>
              </div>

              {loadingTchs ? (
                <p style={{ color: "#6b7488", padding: "20px 0" }}>Loading teachers…</p>
              ) : teachers.length === 0 ? (
                <p style={{ color: "#6b7488", padding: "20px 0" }}>No teachers found in your institute.</p>
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
                  {teachers.map((t) => (
                    <label 
                      key={t.id} 
                      style={{ 
                        display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", 
                        border: `1px solid ${selectedTeachers.has(t.id) ? "#3b4cca" : "#e6e9f0"}`, 
                        borderRadius: 8, cursor: "pointer", background: selectedTeachers.has(t.id) ? "#e8ebfd" : "#fff"
                      }}
                    >
                      <input type="checkbox" checked={selectedTeachers.has(t.id)} onChange={() => toggleTeacher(t.id)} />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 13.5 }}>{t.name}</div>
                        <div style={{ fontSize: 12, color: "#6b7488" }}>{t.teacher_id}</div>
                      </div>
                    </label>
                  ))}
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button className="confirm-btn-primary" onClick={handleSave} disabled={saving || selectedTeachers.size === 0}>
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