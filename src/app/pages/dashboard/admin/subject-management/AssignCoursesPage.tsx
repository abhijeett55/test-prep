import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Check } from "lucide-react";
import { listCourses } from "../../../../api/auth/admin/courses";
import { assignSubjectToCourse } from "../../../../api/auth/admin/subjects";
import { getSubject } from "../../../../api/auth/admin/subjects";
import type { CourseRow, SubjectRow } from "../../../../api/types";
import { errorMessage } from "../../../../api/client";
import "../batch-management/DefaultPage.css";

export default function AssignCoursesPage() {
  const { id: subjectId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [subject, setSubject] = useState<SubjectRow | null>(null);
  const [courses, setCourses] = useState<CourseRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // FIX: Use CourseRow object instead of string
  const [selectedCourse, setSelectedCourse] = useState<CourseRow | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      if (!subjectId) return;
      try {
        const [subjData, coursesData] = await Promise.all([
          getSubject(subjectId),
          listCourses(),
        ]);
        setSubject(subjData);
        setCourses(coursesData);
      } catch (e) {
        setError(errorMessage(e));
      } finally {
        setLoading(false);
      }
    })();
  }, [subjectId]);

  const handleSave = async () => {
    if (!subjectId || !selectedCourse) return;
    setSaving(true);
    setError(null);
    try {
      // FIX: Pass selectedCourse.id instead of the object
      await assignSubjectToCourse(subjectId, selectedCourse.id);
      navigate("/dashboard/admin/subjects/all");
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="default-page">Loading…</div>;
  if (error) return <div className="default-page" style={{ color: "red" }}>{error}</div>;

  return (
    <div className="default-page">
      <div className="default-toolbar" style={{ justifyContent: "flex-start", marginBottom: 16 }}>
        <button
          type="button"
          className="icon-button"
          onClick={() => navigate(-1)}
          style={{ marginRight: 12 }}
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h2 style={{ margin: 0, fontSize: 18 }}>
            Assign Course to {subject?.subject_name}
          </h2>
          <p style={{ margin: 0, fontSize: 13, color: "#6b7488" }}>
            Select a course to link this subject to.
          </p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 16 }}>
        {courses.map((course) => {
          // FIX: Compare course.id to selectedCourse?.id
          const isSelected = selectedCourse?.id === course.id;
          
          return (
            <div
              key={course.id}
              onClick={() => setSelectedCourse(course)} // FIX: Set the whole object
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
      </div>

      <div style={{ marginTop: 24, display: "flex", justifyContent: "flex-end" }}>
        <button
          className="confirm-btn-primary"
          onClick={handleSave}
          disabled={!selectedCourse || saving}
        >
          {saving ? "Assigning…" : "Assign Course"}
        </button>
      </div>
    </div>
  );
}