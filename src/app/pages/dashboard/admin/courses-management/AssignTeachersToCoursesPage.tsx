import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useApi } from "../../../../hooks/useApi";
import { listCourses, assignTeachersToCourse, getCourse } from "../../../../api/auth/admin/courses";
import { listTeachers } from "../../../../api/auth/teacher/teacher";
import { getMyInstitute } from "../../../../api/auth/admin/institute";
import { errorMessage } from "../../../../api/client";
import "../DefaultPage.css";

export default function AssignTeachersToCoursesPage() {
  const { data: allCourses, loading: loadingCourses } = useApi(() => listCourses());
  const { data: allTeachers, loading: loadingTeachers } = useApi(() => listTeachers());
  const { data: myInstitute } = useApi(() => getMyInstitute());

  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [courseSearch, setCourseSearch] = useState("");

  const [selectedTeachers, setSelectedTeachers] = useState<Set<string>>(new Set());
  const [teacherSearch, setTeacherSearch] = useState("");
  
  const [fetchingCourse, setFetchingCourse] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Filter, Sort, and Search Courses
  const filteredCourses = useMemo(() => {
    if (!allCourses || !myInstitute) return [];
    let result = allCourses.filter(c => c.institute_id === myInstitute.id);
    result = result.sort((a, b) => a.course_name.localeCompare(b.course_name));

    const q = courseSearch.trim().toLowerCase();
    if (!q) return result;
    return result.filter(
      (c) => c.course_name.toLowerCase().includes(q) || c.course_code.toLowerCase().includes(q)
    );
  }, [allCourses, myInstitute, courseSearch]);

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

  // NEW: Only split if there are more than 4 teachers
  const shouldSplit = filteredTeachers.length > 4;
  const midIndex = shouldSplit ? Math.ceil(filteredTeachers.length / 2) : filteredTeachers.length;
  
  const leftTeachers = filteredTeachers.slice(0, midIndex);
  const rightTeachers = shouldSplit ? filteredTeachers.slice(midIndex) : [];

  const handleCourseSelect = async (courseId: string) => {
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

  const handleSelectAllTeachers = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const isAllSelected = 
    filteredTeachers.length > 0 && 
    filteredTeachers.every((t) => selectedTeachers.has(t.id));

  // Helper to render a single teacher table
  const renderTeacherTable = (teacherList: typeof filteredTeachers) => (
    <div className="default-table-wrap" style={{ border: "1px solid #e6e9f0", borderRadius: 8, width: "100%" }}>
      <table className="default-table" style={{ minWidth: "100%" }}>
        <thead>
          <tr>
            <th style={{ width: 40 }}></th>
            <th>Teacher Name</th>
            <th>Teacher ID</th>
            <th>Emp Code</th>
          </tr>
        </thead>
        <tbody>
          {teacherList.map((t) => (
            <tr 
              key={t.id}
              style={{ 
                background: selectedTeachers.has(t.id) ? "#e8ebfd" : undefined, 
                cursor: "pointer" 
              }}
              onClick={() => toggleTeacher(t.id)}
            >
              <td onClick={(e) => e.stopPropagation()}>
                <input 
                  type="checkbox" 
                  checked={selectedTeachers.has(t.id)} 
                  onChange={() => toggleTeacher(t.id)} 
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
  );

  return (
    <div className="default-page">
      <div className="default-panel">
        
        <div className="section-bar" style={{ textAlign: "center" }}>
          Assign Teachers to Course
        </div>
        
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

          {/* COURSE SECTION */}
          <div style={{ marginBottom: 40 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontWeight: 600, fontSize: 14 }}>1. Select Course</span>
                {selectedCourse && (
                  <span style={{ fontSize: 13, color: "#1a8f5a", background: "#e5f7ee", padding: "2px 8px", borderRadius: 12, fontWeight: 500 }}>
                    1 selected
                  </span>
                )}
              </div>

              <div className="search-control" style={{ maxWidth: 300, margin: 0 }}>
                <Search size={15} strokeWidth={2} />
                <input
                  type="text"
                  placeholder="Search by course name or code..."
                  value={courseSearch}
                  onChange={(e) => setCourseSearch(e.target.value)}
                />
              </div>
            </div>

            {loadingCourses ? (
              <p style={{ color: "#6b7488", padding: "20px 0" }}>Loading courses…</p>
            ) : filteredCourses.length === 0 ? (
              <p style={{ color: "#6b7488", padding: "20px 0" }}>
                {courseSearch ? `No courses match "${courseSearch}"` : "No courses found."}
              </p>
            ) : (
              <div className="default-table-wrap" style={{ border: "1px solid #e6e9f0", borderRadius: 8, width: "100%" }}>
                <table className="default-table" style={{ minWidth: "100%" }}>
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
                          background: selectedCourse === c.id ? "#e8ebfd" : undefined, 
                          cursor: "pointer" 
                        }}
                        onClick={() => handleCourseSelect(c.id)}
                      >
                        <td onClick={(e) => e.stopPropagation()}>
                          <input 
                            type="radio" 
                            name="courseSelection"
                            checked={selectedCourse === c.id} 
                            onChange={() => handleCourseSelect(c.id)} 
                          />
                        </td>
                        <td className="cell-name">{c.course_name}</td>
                        <td>{c.course_code}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* TEACHER SECTION */}
          {selectedCourse && (
            <div style={{ animation: "fadeIn 0.3s ease" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>2. Select Teachers</span>
                  
                  <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 13 }}>
                    <input 
                      type="checkbox" 
                      checked={isAllSelected} 
                      onChange={handleSelectAllTeachers} 
                    />
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

              {fetchingCourse || loadingTeachers ? (
                <p style={{ color: "#6b7488", padding: "20px 0" }}>Loading teachers…</p>
              ) : filteredTeachers.length === 0 ? (
                <p style={{ color: "#6b7488", padding: "20px 0" }}>
                  {teacherSearch ? `No teachers match "${teacherSearch}"` : "No teachers found in this institute."}
                </p>
              ) : (
                // SMART RENDERING: Single table if few teachers, Dual tables if many
                shouldSplit ? (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: 24 }}>
                    {renderTeacherTable(leftTeachers)}
                    {rightTeachers.length > 0 && renderTeacherTable(rightTeachers)}
                  </div>
                ) : (
                  <div style={{ marginBottom: 24 }}>
                    {renderTeacherTable(filteredTeachers)}
                  </div>
                )
              )}

              {/* FIXED: Button no longer stretches to 100% */}
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button 
                  className="confirm-btn-primary" 
                  onClick={handleSave} 
                  disabled={saving || fetchingCourse || loadingTeachers}
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