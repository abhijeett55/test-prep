import { useState, useMemo } from "react";
import { useApi } from "../../../../hooks/useApi";
import { listTeachers } from "../../../../api/auth/teacher/teacher";
import { listStudents, bulkAssignStudents } from "../../../../api/auth/admin/students";
import { getMyInstitute } from "../../../../api/auth/admin/institute";
import { errorMessage } from "../../../../api/client";
import "../batch-management/DefaultPage.css";

export default function AssignTeachersToStudentsPage() {
  const { data: allTeachers, loading: loadingTchs } = useApi(() => listTeachers());
  const { data: allStudents, loading: loadingStuds } = useApi(() => listStudents());
  const { data: myInstitute } = useApi(() => getMyInstitute());

  const [selectedTeacher, setSelectedTeacher] = useState<string>("");
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set());
  
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // FIX: Filter teachers to only show those in this institute
  const teachers = useMemo(() => {
    if (!allTeachers || !myInstitute) return [];
    return allTeachers.filter(t => t.institute_id === myInstitute.id);
  }, [allTeachers, myInstitute]);

  // FIX: Filter students to only show those in this institute
  const students = useMemo(() => {
    if (!allStudents || !myInstitute) return [];
    return allStudents.filter(s => s.institute_id === myInstitute.id);
  }, [allStudents, myInstitute]);

  const toggleStudent = (id: string) => {
    setSelectedStudents((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSave = async () => {
    if (!selectedTeacher) return;
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      await bulkAssignStudents({
        student_ids: Array.from(selectedStudents),
        teacher_ids: [selectedTeacher],
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
        <div className="section-bar">Map Teachers to Students</div>
        
        <div style={{ padding: 24 }}>
          {error && <div className="perf-success" style={{ background: "#fdeaea", color: "#c62f2f", marginBottom: 16 }}>{error}</div>}
          {success && <div className="perf-success" style={{ marginBottom: 16 }}>Teacher assigned successfully!</div>}

          <label style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24, maxWidth: 400 }}>
            <span style={{ fontWeight: 600, fontSize: 14 }}>Select Teacher</span>
            <select 
              className="perf-input" 
              value={selectedTeacher} 
              onChange={(e) => setSelectedTeacher(e.target.value)}
              disabled={loadingTchs}
            >
              <option value="">Choose a teacher...</option>
              {teachers.map(t => (
                <option key={t.id} value={t.id}>{t.name} ({t.teacher_id})</option>
              ))}
            </select>
          </label>

          {selectedTeacher && (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <span style={{ fontWeight: 600, fontSize: 14 }}>Select Students</span>
                <span style={{ fontSize: 13, color: "#6b7488" }}>{selectedStudents.size} selected</span>
              </div>

              {loadingStuds ? (
                <p style={{ color: "#6b7488", padding: "20px 0" }}>Loading students…</p>
              ) : students.length === 0 ? (
                <p style={{ color: "#6b7488", padding: "20px 0" }}>No students found in your institute.</p>
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
                  {students.map((s) => (
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