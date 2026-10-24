import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { useApi } from "../../../../hooks/useApi";
import { listSubjects, assignSubjectToTeacher } from "../../../../api/auth/admin/subjects";
import { listTeachers } from "../../../../api/auth/teacher/teacher";
import { getMyInstitute } from "../../../../api/auth/admin/institute";
import { errorMessage } from "../../../../api/client";
import "../DefaultPage.css";

export default function AssignTeachersToSubjectPage() {
  const { data: subjects, loading: loadingSubs } = useApi(() => listSubjects({}));
  const { data: allTeachers, loading: loadingTchs } = useApi(() => listTeachers());
  const { data: myInstitute } = useApi(() => getMyInstitute());

  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [subjectSearch, setSubjectSearch] = useState("");

  const [selectedTeachers, setSelectedTeachers] = useState<Set<string>>(new Set());
  const [teacherSearch, setTeacherSearch] = useState("");
  
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Filter, Sort, and Search Subjects (FIXED DEPENDENCY ARRAY)
  const filteredSubjects = useMemo(() => {
    if (!subjects) return [];
    const result = [...subjects].sort((a, b) => a.subject_name.localeCompare(b.subject_name));
    const q = subjectSearch.trim().toLowerCase();
    if (!q) return result;
    return result.filter(s => s.subject_name.toLowerCase().includes(q) || s.subject_code.toLowerCase().includes(q));
  }, [subjects, subjectSearch]); // <-- Changed searchQuery to subjectSearch

  // Filter, Sort, and Search Teachers
  const filteredTeachers = useMemo(() => {
    if (!allTeachers || !myInstitute) return [];
    const result = allTeachers.filter(t => t.institute_id === myInstitute.id);
    result.sort((a, b) => a.name.localeCompare(b.name));
    
    const q = teacherSearch.trim().toLowerCase();
    if (!q) return result;
    return result.filter(t => t.name.toLowerCase().includes(q) || t.teacher_id.toLowerCase().includes(q));
  }, [allTeachers, myInstitute, teacherSearch]);

  const toggleTeacher = (id: string) => {
    setSelectedTeachers((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedTeachers((prev) => {
        const next = new Set(prev);
        filteredTeachers.forEach((t) => next.add(t.id));
        return next;
      });
    } else {
      setSelectedTeachers((prev) => {
        const next = new Set(prev);
        filteredTeachers.forEach((t) => next.delete(t.id));
        return next;
      });
    }
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

  const isAllSelected = 
    filteredTeachers.length > 0 && 
    filteredTeachers.every((t) => selectedTeachers.has(t.id));

  return (
    <div className="default-page">
      <div className="default-panel">
        <div className="section-bar" style={{ textAlign: "center" }}>
          Map Teachers to Subject
        </div>
        
        <div style={{ padding: 24 }}>
          {error && <div className="perf-success" style={{ background: "#fdeaea", color: "#c62f2f", marginBottom: 16 }}>{error}</div>}
          {success && <div className="perf-success" style={{ marginBottom: 16 }}>Teachers assigned successfully!</div>}

          {/* SUBJECT SECTION */}
          <div style={{ marginBottom: 40 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontWeight: 600, fontSize: 14 }}>1. Select Subject</span>
                {selectedSubject && (
                  <span style={{ fontSize: 13, color: "#1a8f5a", background: "#e5f7ee", padding: "2px 8px", borderRadius: 12, fontWeight: 500 }}>1 selected</span>
                )}
              </div>
              <div className="search-control" style={{ maxWidth: 300, margin: 0 }}>
                <Search size={15} strokeWidth={2} />
                <input
                  type="text"
                  placeholder="Search by subject..."
                  value={subjectSearch}
                  onChange={(e) => setSubjectSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="default-table-wrap" style={{ border: "1px solid #e6e9f0", borderRadius: 8 }}>
              <table className="default-table">
                <thead>
                  <tr>
                    <th style={{ width: 40 }}></th>
                    <th>Subject Name</th>
                    <th>Subject Code</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingSubs ? (
                    <tr><td colSpan={3} style={{ textAlign: "center", padding: 20 }}>Loading...</td></tr>
                  ) : filteredSubjects.map((s) => (
                    <tr 
                      key={s.id} 
                      style={{ background: selectedSubject === s.id ? "#e8ebfd" : undefined, cursor: "pointer" }}
                      onClick={() => setSelectedSubject(s.id)}
                    >
                      <td><input type="radio" name="subject" checked={selectedSubject === s.id} readOnly /></td>
                      <td className="cell-name">{s.subject_name}</td>
                      <td>{s.subject_code}</td>
                    </tr>
                  ))}
                  {!loadingSubs && filteredSubjects.length === 0 && (
                    <tr><td colSpan={3} style={{ textAlign: "center", padding: 20 }}>No subjects found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* TEACHER SECTION */}
          {selectedSubject && (
            <div style={{ animation: "fadeIn 0.3s ease" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>2. Select Teachers</span>
                  <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 13 }}>
                    <input type="checkbox" checked={isAllSelected} onChange={handleSelectAll} />
                    Select All
                  </label>
                  <span style={{ fontSize: 13, color: "#6b7488", background: "#e6e9f0", padding: "2px 8px", borderRadius: 12 }}>
                    {selectedTeachers.size} selected
                  </span>
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
                <p style={{ color: "#6b7488", padding: "20px 0" }}>No teachers found.</p>
              ) : (
                <div className="default-table-wrap" style={{ marginBottom: 24, border: "1px solid #e6e9f0", borderRadius: 8 }}>
                  <table className="default-table">
                    <thead>
                      <tr>
                        <th style={{ width: 40 }}></th>
                        <th>Teacher Name</th>
                        <th>Teacher ID</th>
                        <th>Employee Code</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTeachers.map((t) => (
                        <tr 
                          key={t.id}
                          style={{ background: selectedTeachers.has(t.id) ? "#e8ebfd" : undefined, cursor: "pointer" }}
                          onClick={() => toggleTeacher(t.id)}
                        >
                          <td onClick={(e) => e.stopPropagation()}>
                            <input type="checkbox" checked={selectedTeachers.has(t.id)} onChange={() => toggleTeacher(t.id)} />
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

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button 
                  className="confirm-btn-primary" 
                  onClick={handleSave} 
                  disabled={saving || selectedTeachers.size === 0}
                  style={{ width: "auto", minWidth: "200px", padding: "0 32px" }}
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