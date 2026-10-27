import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { useApi } from "../../../../hooks/useApi";
import { listCourses, getCourse } from "../../../../api/auth/admin/courses";
import { listSubjects, assignSubjectToCourse } from "../../../../api/auth/admin/subjects";
import { getMyInstitute } from "../../../../api/auth/admin/institute";
import { errorMessage } from "../../../../api/client";
import "../DefaultPage.css"; // Adjust path if needed

export default function AssignSubjectsToCoursesPage() {
  const { data: allCourses, loading: loadingCourses } = useApi(() => listCourses());
  const { data: subjects, loading: loadingSubs } = useApi(() => listSubjects({}));
  const { data: myInstitute } = useApi(() => getMyInstitute());

  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [selectedSubjects, setSelectedSubjects] = useState<Set<string>>(new Set());
  
  const [courseSearch, setCourseSearch] = useState("");
  const [subjectSearch, setSubjectSearch] = useState("");
  
  const [fetchingCourse, setFetchingCourse] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const courses = useMemo(() => {
    if (!allCourses || !myInstitute) return [];
    let result = allCourses.filter(c => c.institute_id === myInstitute.id);
    result = result.sort((a, b) => a.course_name.localeCompare(b.course_name));
    const q = courseSearch.trim().toLowerCase();
    if (!q) return result;
    return result.filter(c => c.course_name.toLowerCase().includes(q) || c.course_code.toLowerCase().includes(q));
  }, [allCourses, myInstitute, courseSearch]);

  const filteredSubjects = useMemo(() => {
    if (!subjects) return [];
    const result = [...subjects].sort((a, b) => a.subject_name.localeCompare(b.subject_name));
    const q = subjectSearch.trim().toLowerCase();
    if (!q) return result;
    return result.filter(s => s.subject_name.toLowerCase().includes(q) || s.subject_code.toLowerCase().includes(q));
  }, [subjects, subjectSearch]);

  const handleCourseSelect = async (courseId: string) => {
    setSelectedCourse(courseId);
    setSuccess(false);
    setError(null);
    
    if (!courseId) {
      setSelectedSubjects(new Set());
      return;
    }

    setFetchingCourse(true);
    try {
      // Fetch course details to see which subjects are already mapped
      const courseDetails = await getCourse(courseId);
      if (courseDetails && courseDetails.subject_ids) {
        setSelectedSubjects(new Set(courseDetails.subject_ids));
      } else {
        setSelectedSubjects(new Set());
      }
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setFetchingCourse(false);
    }
  };

  const toggleSubject = (id: string) => {
    setSelectedSubjects((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSave = async () => {
    if (!selectedCourse) return;
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      // Loop through all selected subjects and assign them to the course
      await Promise.all(
        Array.from(selectedSubjects).map((subjectId) =>
          assignSubjectToCourse(subjectId, selectedCourse)
        )
      );
      setSuccess(true);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="default-page">
      <div className="default-panel">
        <div className="section-bar" style={{ textAlign: "center" }}>
          Map Subjects to Course
        </div>
        
        <div style={{ padding: 24 }}>
          {error && <div className="perf-success" style={{ background: "#fdeaea", color: "#c62f2f", marginBottom: 16 }}>{error}</div>}
          {success && <div className="perf-success" style={{ marginBottom: 16 }}>Subjects mapped successfully!</div>}

          {/* COURSE SECTION */}
          <div style={{ marginBottom: 40 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontWeight: 600, fontSize: 14 }}>1. Select Course</span>
                {selectedCourse && <span style={{ fontSize: 13, color: "#1a8f5a", background: "#e5f7ee", padding: "2px 8px", borderRadius: 12, fontWeight: 500 }}>1 selected</span>}
              </div>
              <div className="search-control" style={{ maxWidth: 300, margin: 0 }}>
                <Search size={15} strokeWidth={2} />
                <input type="text" placeholder="Search by course..." value={courseSearch} onChange={(e) => setCourseSearch(e.target.value)} />
              </div>
            </div>

            <div className="default-table-wrap" style={{ border: "1px solid #e6e9f0", borderRadius: 8 }}>
              <table className="default-table">
                <thead>
                  <tr>
                    <th style={{ width: 40 }}></th>
                    <th>Course Name</th>
                    <th>Course Code</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingCourses ? (
                    <tr><td colSpan={3} style={{ textAlign: "center", padding: 20 }}>Loading...</td></tr>
                  ) : courses.map((c) => (
                    <tr key={c.id} style={{ background: selectedCourse === c.id ? "#e8ebfd" : undefined, cursor: "pointer" }} onClick={() => handleCourseSelect(c.id)}>
                      <td><input type="radio" name="course" checked={selectedCourse === c.id} readOnly /></td>
                      <td className="cell-name">{c.course_name}</td>
                      <td>{c.course_code}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* SUBJECT SECTION */}
          {selectedCourse && (
            <div style={{ animation: "fadeIn 0.3s ease" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>2. Select Subjects</span>
                  <span style={{ fontSize: 13, color: "#6b7488", background: "#e6e9f0", padding: "2px 8px", borderRadius: 12 }}>{selectedSubjects.size} selected</span>
                </div>
                <div className="search-control" style={{ maxWidth: 300, margin: 0 }}>
                  <Search size={15} strokeWidth={2} />
                  <input type="text" placeholder="Search by subject..." value={subjectSearch} onChange={(e) => setSubjectSearch(e.target.value)} />
                </div>
              </div>

              {fetchingCourse || loadingSubs ? (
                <p style={{ color: "#6b7488", padding: "20px 0" }}>Loading subjects…</p>
              ) : (
                <div className="default-table-wrap" style={{ marginBottom: 24, border: "1px solid #e6e9f0", borderRadius: 8 }}>
                  <table className="default-table">
                    <thead>
                      <tr>
                        <th style={{ width: 40 }}></th>
                        <th>Subject Name</th>
                        <th>Subject Code</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSubjects.map((s) => (
                        <tr key={s.id} style={{ background: selectedSubjects.has(s.id) ? "#e8ebfd" : undefined, cursor: "pointer" }} onClick={() => toggleSubject(s.id)}>
                          <td onClick={(e) => e.stopPropagation()}>
                            <input type="checkbox" checked={selectedSubjects.has(s.id)} onChange={() => toggleSubject(s.id)} />
                          </td>
                          <td className="cell-name">{s.subject_name}</td>
                          <td>{s.subject_code}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button className="confirm-btn-primary" onClick={handleSave} disabled={saving || fetchingCourse} style={{ width: "auto", minWidth: "200px", padding: "0 32px" }}>
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