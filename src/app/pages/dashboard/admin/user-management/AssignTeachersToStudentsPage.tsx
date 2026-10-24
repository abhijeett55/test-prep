import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { useApi } from "../../../../hooks/useApi";
import { listTeachers } from "../../../../api/auth/teacher/teacher";
import { listStudents, bulkAssignStudents } from "../../../../api/auth/admin/students";
import { getMyInstitute } from "../../../../api/auth/admin/institute";
import { errorMessage } from "../../../../api/client";
import "../DefaultPage.css";

export default function AssignTeachersToStudentsPage() {
  const { data: allTeachers, loading: loadingTchs } = useApi(() => listTeachers());
  const { data: allStudents, loading: loadingStuds } = useApi(() => listStudents());
  const { data: myInstitute } = useApi(() => getMyInstitute());

  // Teacher State
  const [selectedTeacher, setSelectedTeacher] = useState<string>("");
  const [teacherSearch, setTeacherSearch] = useState("");

  // Student State
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set());
  const [studentSearch, setStudentSearch] = useState("");
  
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Filter, Sort, and Search Teachers
  const filteredTeachers = useMemo(() => {
    if (!allTeachers || !myInstitute) return [];
    let result = allTeachers.filter(t => t.institute_id === myInstitute.id);
    result = result.sort((a, b) => a.name.localeCompare(b.name));

    const q = teacherSearch.trim().toLowerCase();
    if (!q) return result;
    return result.filter(
      (t) => t.name.toLowerCase().includes(q) || t.teacher_id.toLowerCase().includes(q)
    );
  }, [allTeachers, myInstitute, teacherSearch]);

  // Filter, Sort, and Search Students
  const filteredStudents = useMemo(() => {
    if (!allStudents || !myInstitute) return [];
    let result = allStudents.filter(s => s.institute_id === myInstitute.id);
    result = result.sort((a, b) => a.full_name.localeCompare(b.full_name));

    const q = studentSearch.trim().toLowerCase();
    if (!q) return result;
    return result.filter(
      (s) => s.full_name.toLowerCase().includes(q) || s.student_id.toLowerCase().includes(q)
    );
  }, [allStudents, myInstitute, studentSearch]);

  const toggleStudent = (id: string) => {
    setSelectedStudents((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSelectAllStudents = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedStudents((prev) => {
        const next = new Set(prev);
        filteredStudents.forEach((s) => next.add(s.id));
        return next;
      });
    } else {
      setSelectedStudents((prev) => {
        const next = new Set(prev);
        filteredStudents.forEach((s) => next.delete(s.id));
        return next;
      });
    }
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

  const isAllStudentsSelected = 
    filteredStudents.length > 0 && 
    filteredStudents.every((s) => selectedStudents.has(s.id));

  return (
    <div className="default-page">
      <div className="default-panel">
        
        {/* Centered Header */}
        <div className="section-bar" style={{ textAlign: "center" }}>
          Map Teachers to Students
        </div>
        
        <div style={{ padding: 24 }}>
          {error && <div className="perf-success" style={{ background: "#fdeaea", color: "#c62f2f", marginBottom: 16 }}>{error}</div>}
          {success && <div className="perf-success" style={{ marginBottom: 16 }}>Teacher assigned successfully!</div>}

          {/* ================= TEACHER SECTION ================= */}
          <div style={{ marginBottom: 40 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontWeight: 600, fontSize: 14 }}>1. Select Teacher</span>
                {selectedTeacher && (
                  <span style={{ fontSize: 13, color: "#1a8f5a", background: "#e5f7ee", padding: "2px 8px", borderRadius: 12, fontWeight: 500 }}>
                    1 selected
                  </span>
                )}
              </div>

              <div className="search-control" style={{ maxWidth: 300, margin: 0 }}>
                <Search size={15} strokeWidth={2} />
                <input
                  type="text"
                  placeholder="Search by teacher name or ID..."
                  value={teacherSearch}
                  onChange={(e) => setTeacherSearch(e.target.value)}
                />
              </div>
            </div>

            {loadingTchs ? (
              <p style={{ color: "#6b7488", padding: "20px 0" }}>Loading teachers…</p>
            ) : filteredTeachers.length === 0 ? (
              <p style={{ color: "#6b7488", padding: "20px 0" }}>
                {teacherSearch ? `No teachers match "${teacherSearch}"` : "No teachers found."}
              </p>
            ) : (
              <div className="default-table-wrap" style={{ border: "1px solid #e6e9f0", borderRadius: 8 }}>
                <table className="default-table">
                  <thead>
                    <tr>
                      <th style={{ width: 40 }}></th>
                      <th>Teacher Name</th>
                      <th>Teacher ID</th>
                      <th>Emp Code</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTeachers.map((t) => (
                      <tr 
                        key={t.id} 
                        style={{ 
                          background: selectedTeacher === t.id ? "#e8ebfd" : undefined, 
                          cursor: "pointer" 
                        }}
                        onClick={() => setSelectedTeacher(t.id)}
                      >
                        <td onClick={(e) => e.stopPropagation()}>
                          {/* Using radio buttons for single selection */}
                          <input 
                            type="radio" 
                            name="teacherSelection"
                            checked={selectedTeacher === t.id} 
                            onChange={() => setSelectedTeacher(t.id)} 
                          />
                        </td>
                        <td className="cell-name">{t.name}</td>
                        <td>{t.teacher_id}</td>
                        <td>{t.employee_code || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* ================= STUDENT SECTION ================= */}
          {selectedTeacher && (
            <div style={{ animation: "fadeIn 0.3s ease" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>2. Select Students</span>
                  <span style={{ fontSize: 13, color: "#6b7488", background: "#e6e9f0", padding: "2px 8px", borderRadius: 12 }}>
                    {selectedStudents.size} selected
                  </span>
                </div>

                <div className="search-control" style={{ maxWidth: 300, margin: 0 }}>
                  <Search size={15} strokeWidth={2} />
                  <input
                    type="text"
                    placeholder="Search by student name or ID..."
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                  />
                </div>
              </div>

              {loadingStuds ? (
                <p style={{ color: "#6b7488", padding: "20px 0" }}>Loading students…</p>
              ) : filteredStudents.length === 0 ? (
                <p style={{ color: "#6b7488", padding: "20px 0" }}>
                  {studentSearch ? `No students match "${studentSearch}"` : "No students found."}
                </p>
              ) : (
                <div className="default-table-wrap" style={{ marginBottom: 24, border: "1px solid #e6e9f0", borderRadius: 8 }}>
                  <table className="default-table">
                    <thead>
                      <tr>
                        <th style={{ width: 40 }}>
                          <input 
                            type="checkbox" 
                            checked={isAllStudentsSelected} 
                            onChange={handleSelectAllStudents} 
                          />
                        </th>
                        <th>Student Name</th>
                        <th>Student ID</th>
                        <th>Batch</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudents.map((s) => (
                        <tr 
                          key={s.id} 
                          style={{ 
                            background: selectedStudents.has(s.id) ? "#e8ebfd" : undefined, 
                            cursor: "pointer" 
                          }}
                          onClick={() => toggleStudent(s.id)}
                        >
                          <td onClick={(e) => e.stopPropagation()}>
                            <input 
                              type="checkbox" 
                              checked={selectedStudents.has(s.id)} 
                              onChange={() => toggleStudent(s.id)} 
                            />
                          </td>
                          <td className="cell-name">{s.full_name}</td>
                          <td>{s.student_id}</td>
                          <td>{s.batch_name || "—"}</td>
                          <td>{s.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button 
                  className="confirm-btn-primary" 
                  onClick={handleSave} 
                  disabled={saving || selectedStudents.size === 0}
                >
                  {saving ? "Saving…" : "Save Mappings"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}