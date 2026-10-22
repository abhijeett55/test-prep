import { useMemo, useState } from "react";
import { useApi } from "../../../../hooks/useApi";
import { listCourses, assignTeachersToCourse, getCourse } from "../../../../api/auth/admin/courses";
import { listTeachers } from "../../../../api/auth/teacher/teacher";
import { getMyInstitute } from "../../../../api/auth/admin/institute";
import { errorMessage } from "../../../../api/client";
import "./DefaultPage.css";

export default function AssignTeachersToCoursesPage() {
  const { data: allCourses, loading: loadingCourses } = useApi(() => listCourses());
  const { data: allTeachers, loading: loadingTeachers } = useApi(() => listTeachers());
  const { data: myInstitute } = useApi(() => getMyInstitute());

  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [selectedTeachers, setSelectedTeachers] = useState<Set<string>>(new Set());
  
  const [fetchingCourse, setFetchingCourse] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Filter courses and teachers to only show those in the Admin's institute
  const courses = useMemo(() => {
    if (!allCourses || !myInstitute) return [];
    return allCourses.filter(c => c.institute_id === myInstitute.id);
  }, [allCourses, myInstitute]);

  const teachers = useMemo(() => {
    if (!allTeachers || !myInstitute) return [];
    return allTeachers.filter(t => t.institute_id === myInstitute.id);
  }, [allTeachers, myInstitute]);

  const handleCourseChange = async (courseId: string) => {
    setSelectedCourse(courseId);
    setSuccess(false);
    setError(null);
    
    if (!courseId) {
      setSelectedTeachers(new Set());
      return;
    }

    setFetchingCourse(true);
    try {
      const courseDetails = await getCourse(courseId);
      // courseDetails.teacher_ids is returned by the backend
      if (courseDetails && courseDetails.teacher_ids) {
        setSelectedTeachers(new Set(courseDetails.teacher_ids));
      } else {
        setSelectedTeachers(new Set());
      }
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setFetchingCourse(false);
    }
  };

  const toggleTeacher = (id: string) => {
    setSelectedTeachers((prev) => {
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
      await assignTeachersToCourse(selectedCourse, Array.from(selectedTeachers));
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
        <div className="section-bar">Assign Teachers to Course</div>
        
        <div style={{ padding: 24 }}>
          {error && (
            <div className="perf-success" style={{ background: "#fdeaea", color: "#c62f2f", marginBottom: 16 }}>
              {error}
            </div>
          )}
          
          {success && (
            <div className="perf-success" style={{ marginBottom: 16 }}>
              Teachers assigned successfully!
            </div>
          )}

          <label style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24, maxWidth: 400 }}>
            <span style={{ fontWeight: 600, fontSize: 14 }}>Select Course</span>
            <select 
              className="perf-input" 
              value={selectedCourse} 
              onChange={(e) => handleCourseChange(e.target.value)}
              disabled={loadingCourses}
            >
              <option value="">Choose a course...</option>
              {courses.map(c => (
                <option key={c.id} value={c.id}>
                  {c.course_name} ({c.course_code})
                </option>
              ))}
            </select>
          </label>

          {selectedCourse && (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <span style={{ fontWeight: 600, fontSize: 14 }}>Select Teachers</span>
                <span style={{ fontSize: 13, color: "#6b7488" }}>{selectedTeachers.size} selected</span>
              </div>

              {fetchingCourse || loadingTeachers ? (
                <p style={{ color: "#6b7488", padding: "20px 0" }}>Loading teachers…</p>
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
                        display: "flex", 
                        alignItems: "center", 
                        gap: 10, 
                        padding: "10px 14px", 
                        border: `1px solid ${selectedTeachers.has(t.id) ? "#3b4cca" : "#e6e9f0"}`, 
                        borderRadius: 8, 
                        cursor: "pointer",
                        background: selectedTeachers.has(t.id) ? "#e8ebfd" : "#fff"
                      }}
                    >
                      <input 
                        type="checkbox" 
                        checked={selectedTeachers.has(t.id)} 
                        onChange={() => toggleTeacher(t.id)} 
                      />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 13.5 }}>{t.name}</div>
                        <div style={{ fontSize: 12, color: "#6b7488" }}>{t.teacher_id}</div>
                      </div>
                    </label>
                  ))}
                  {teachers.length === 0 && (
                    <p style={{ color: "#6b7488" }}>No teachers found in this institute.</p>
                  )}
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button 
                  className="confirm-btn-primary" 
                  onClick={handleSave} 
                  disabled={saving || fetchingCourse || loadingTeachers}
                >
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