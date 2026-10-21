import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Check } from "lucide-react";
import { listCourses } from "../../../../api/auth/admin/courses";
import { listSubjects, assignSubjectToCourse, getSubject } from "../../../../api/auth/admin/subjects";
import type { CourseRow, SubjectRow } from "../../../../api/types";
import { errorMessage } from "../../../../api/client";
import "../batch-management/DefaultPage.css"; // Adjust path if needed

export default function AssignCoursesPage() {
  const { id: urlSubjectId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [subjects, setSubjects] = useState<SubjectRow[]>([]);
  const [courses, setCourses] = useState<CourseRow[]>([]);
  
  const [selectedSubject, setSelectedSubject] = useState<SubjectRow | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<CourseRow | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        // Fetch all courses and all subjects in parallel
        const [coursesData, subjectsData] = await Promise.all([
          listCourses(),
          listSubjects({}), 
        ]);
        setCourses(coursesData);
        setSubjects(subjectsData);

        // If the URL has an ID (e.g. /subjects/assign/uuid), auto-select that subject
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
        // FIX: Ensure loading turns off regardless of whether a subject was found
        setLoading(false);
      }
    })();
  }, [urlSubjectId]);

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
      <div className="default-toolbar" style={{ justifyContent: "flex-start", marginBottom: 16 }}>
        <button
          type="button"
          className="icon-button"
          onClick={() => navigate("/dashboard/admin/subjects/all")}
          style={{ marginRight: 12 }}
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h2 style={{ margin: 0, fontSize: 18 }}>
            Assign Subject to Course
          </h2>
          <p style={{ margin: 0, fontSize: 13, color: "#6b7488" }}>
            Link a subject to a course so students can study it.
          </p>
        </div>
      </div>

      {error && (
        <div className="perf-success" style={{ background: "#fdeaea", color: "#c62f2f", marginBottom: 16 }}>
          {error}
        </div>
      )}

      {/* Step 1: Pick a Subject if not already selected via URL */}
      {!selectedSubject && (
        <div style={{ marginBottom: 24, maxWidth: 400 }}>
          <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ fontWeight: 600, fontSize: 14 }}>1. Select a Subject *</span>
            <select
              className="perf-input"
              value=""
              onChange={(e) => {
                const sub = subjects.find((s) => s.id === e.target.value);
                setSelectedSubject(sub || null);
              }}
            >
              <option value="">Choose a subject…</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.subject_name} ({s.subject_code})
                </option>
              ))}
            </select>
          </label>
        </div>
      )}

      {/* Step 2: Pick a Course */}
      {selectedSubject && (
        <>
          <div style={{ marginBottom: 16 }}>
            <h3 style={{ margin: "0 0 8px", fontSize: 15 }}>
              2. Select a Course for <span style={{ color: "#3b4cca" }}>{selectedSubject.subject_name}</span>
            </h3>
            {urlSubjectId && (
              <button 
                type="button"
                onClick={() => setSelectedSubject(null)}
                style={{ background: "none", border: "none", color: "#3b4cca", cursor: "pointer", padding: 0, fontSize: 13 }}
              >
                (Change subject)
              </button>
            )}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 16 }}>
            {courses.map((course) => {
              const isSelected = selectedCourse?.id === course.id;
              
              return (
                <div
                  key={course.id}
                  onClick={() => setSelectedCourse(course)}
                  style={{
                    padding: 16,
                    border: `1px solid ${isSelected ? "#3b4cca" : "#e6e9f0"}`,
                    borderRadius: 12,
                    cursor: "pointer",
                    background: isSelected ? "#e8ebfd" : "#fff",
                    position: "relative",
                  }}
                >
                  {isSelected && (
                    <div style={{ position: "absolute", top: 12, right: 12, color: "#3b4cca" }}>
                      <Check size={18} />
                    </div>
                  )}
                  <h4 style={{ margin: "0 0 4px", fontSize: 15 }}>{course.course_name}</h4>
                  <p style={{ margin: 0, fontSize: 13, color: "#6b7488" }}>{course.course_code}</p>
                </div>
              );
            })}
            {courses.length === 0 && (
              <p style={{ color: "#6b7488" }}>No courses found. Create a course first.</p>
            )}
          </div>

          <div style={{ marginTop: 24, display: "flex", justifyContent: "flex-end" }}>
            <button
              className="confirm-btn-primary"
              onClick={handleSave}
              disabled={!selectedCourse || saving}
            >
              {saving ? "Assigning…" : "Assign to Course"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}