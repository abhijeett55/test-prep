import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Search } from "lucide-react";
import { listCourses } from "../../../../api/auth/admin/courses";
import { listSubjects, assignSubjectToCourse, getSubject } from "../../../../api/auth/admin/subjects";
import type { CourseRow, SubjectRow } from "../../../../api/types";
import { errorMessage } from "../../../../api/client";
import "../DefaultPage.css";

export default function AssignCoursesPage() {
  const { id: urlSubjectId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [subjects, setSubjects] = useState<SubjectRow[]>([]);
  const [courses, setCourses] = useState<CourseRow[]>([]);
  
  const [selectedSubject, setSelectedSubject] = useState<SubjectRow | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<CourseRow | null>(null);

  // Search states
  const [subjectSearch, setSubjectSearch] = useState("");
  const [courseSearch, setCourseSearch] = useState("");
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [coursesData, subjectsData] = await Promise.all([
          listCourses(),
          listSubjects({}), 
        ]);
        setCourses(coursesData);
        setSubjects(subjectsData);

        if (urlSubjectId) {
          const found = subjectsData.find((s) => s.id === urlSubjectId);
          if (found) setSelectedSubject(found);
          else {
            const exact = await getSubject(urlSubjectId);
            setSelectedSubject(exact);
          }
        }
      } catch (e) {
        setError(errorMessage(e));
      } finally {
        setLoading(false);
      }
    })();
  }, [urlSubjectId]);

  const filteredSubjects = useMemo(() => {
    const result = [...subjects].sort((a, b) => a.subject_name.localeCompare(b.subject_name)); // <-- Changed to const
    const q = subjectSearch.trim().toLowerCase();
    if (!q) return result;
    return result.filter(s => s.subject_name.toLowerCase().includes(q) || s.subject_code.toLowerCase().includes(q));
  }, [subjects, subjectSearch]);

  const filteredCourses = useMemo(() => {
    const result = [...courses].sort((a, b) => a.course_name.localeCompare(b.course_name)); // <-- Changed to const
    const q = courseSearch.trim().toLowerCase();
    if (!q) return result;
    return result.filter(c => c.course_name.toLowerCase().includes(q) || c.course_code.toLowerCase().includes(q));
  }, [courses, courseSearch]);

  const handleSave = async () => {
    if (!selectedSubject || !selectedCourse) return;
    setSaving(true);
    setError(null);
    try {
      await assignSubjectToCourse(selectedSubject.id, selectedCourse.id);
      navigate("/dashboard/admin/subjects/all");
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="default-page">Loading…</div>;

  return (
    <div className="default-page">
      <div className="default-panel">
        
        {/* Centered Header with Back Button */}
        <div className="section-bar" style={{ display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
          <button
            type="button"
            className="icon-button"
            onClick={() => navigate("/dashboard/admin/subjects/all")}
            style={{ position: "absolute", left: 16, background: "rgba(255,255,255,0.1)", border: "none", color: "#fff" }}
          >
            <ArrowLeft size={16} />
          </button>
          Assign Subject to Course
        </div>

        <div style={{ padding: 24 }}>
          {error && (
            <div className="perf-success" style={{ background: "#fdeaea", color: "#c62f2f", marginBottom: 16 }}>
              {error}
            </div>
          )}

          {/* SUBJECT SECTION (Only shows if not pre-selected via URL) */}
          {!selectedSubject ? (
            <div style={{ marginBottom: 40 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <span style={{ fontWeight: 600, fontSize: 14 }}>1. Select a Subject</span>
                <div className="search-control" style={{ maxWidth: 300, margin: 0 }}>
                  <Search size={15} strokeWidth={2} />
                  <input
                    type="text"
                    placeholder="Search subjects..."
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
                    {filteredSubjects.map((s) => (
                      <tr 
                        key={s.id} 
                        style={{ cursor: "pointer" }}
                        onClick={() => setSelectedSubject(s)}
                      >
                        <td><input type="radio" name="subject" /></td>
                        <td className="cell-name">{s.subject_name}</td>
                        <td>{s.subject_code}</td>
                      </tr>
                    ))}
                    {filteredSubjects.length === 0 && (
                      <tr><td colSpan={3} style={{ textAlign: "center", padding: 20 }}>No subjects found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* Show selected subject summary if pre-selected */
            <div style={{ marginBottom: 24, padding: 16, background: "#f7f8fc", borderRadius: 8, border: "1px solid #e6e9f0" }}>
              <span style={{ fontSize: 13, color: "#6b7488", display: "block", marginBottom: 4 }}>Selected Subject:</span>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <strong style={{ fontSize: 16 }}>{selectedSubject.subject_name} ({selectedSubject.subject_code})</strong>
                {!urlSubjectId && (
                  <button 
                    type="button"
                    onClick={() => setSelectedSubject(null)}
                    style={{ background: "none", border: "none", color: "#3b4cca", cursor: "pointer", fontSize: 13, fontWeight: 600 }}
                  >
                    Change Subject
                  </button>
                )}
              </div>
            </div>
          )}

          {/* COURSE SECTION */}
          {selectedSubject && (
            <div style={{ animation: "fadeIn 0.3s ease" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <span style={{ fontWeight: 600, fontSize: 14 }}>2. Select a Course</span>
                <div className="search-control" style={{ maxWidth: 300, margin: 0 }}>
                  <Search size={15} strokeWidth={2} />
                  <input
                    type="text"
                    placeholder="Search courses..."
                    value={courseSearch}
                    onChange={(e) => setCourseSearch(e.target.value)}
                  />
                </div>
              </div>

              <div className="default-table-wrap" style={{ border: "1px solid #e6e9f0", borderRadius: 8, marginBottom: 24 }}>
                <table className="default-table">
                  <thead>
                    <tr>
                      <th style={{ width: 40 }}></th>
                      <th>Course Name</th>
                      <th>Course Code</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCourses.map((c) => (
                      <tr 
                        key={c.id} 
                        style={{ 
                          background: selectedCourse?.id === c.id ? "#e8ebfd" : undefined,
                          cursor: "pointer" 
                        }}
                        onClick={() => setSelectedCourse(c)}
                      >
                        <td><input type="radio" name="course" checked={selectedCourse?.id === c.id} readOnly /></td>
                        <td className="cell-name">{c.course_name}</td>
                        <td>{c.course_code}</td>
                      </tr>
                    ))}
                    {filteredCourses.length === 0 && (
                      <tr><td colSpan={3} style={{ textAlign: "center", padding: 20 }}>No courses found. Create a course first.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button
                  className="confirm-btn-primary"
                  onClick={handleSave}
                  disabled={!selectedCourse || saving}
                  style={{ width: "auto", minWidth: "200px", padding: "0 32px" }}
                >
                  {saving ? "Assigning…" : "Assign to Course"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}