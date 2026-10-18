import { useState } from "react";
import Card, { CardRow } from "../../../../components/Card/Card";
import { useApi } from "../../../../hooks/useApi";
import { listSubjects, assignSubjectToCourse, type SubjectRow } from "../../../../api/auth/admin/subjects";
// Assuming you have a listCourses function in your courses API
import { listCourses } from "../../../../api/auth/admin/courses"; 
import { errorMessage } from "../../../../api/client";
import "../student-management/Performance.css";

export default function AssignCoursesPage() {
  const { data: courses, loading: coursesLoading } = useApi(listCourses);
  const { data: subjects, loading: subjectsLoading } = useApi(() => listSubjects({}));
  
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [busySubject, setBusySubject] = useState<string | null>(null);

  const handleAssign = async (subjectId: string) => {
    if (!selectedCourse) return;
    setBusySubject(subjectId);
    setActionError(null);
    try {
      await assignSubjectToCourse(subjectId, selectedCourse);
      alert("Subject assigned successfully!");
    } catch (e) {
      setActionError(errorMessage(e));
    } finally {
      setBusySubject(null);
    }
  };

  return (
    <div className="perf-page">
      <div className="perf-header">
        <div>
          <h1>Assign Subjects to Courses</h1>
          <p>Select a course, then assign available subjects to it</p>
        </div>
      </div>

      {actionError && (
        <div className="perf-success" style={{ background: "#fdeaea", color: "#c62f2f" }}>
          {actionError}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
        {/* Left Side: Courses List */}
        <div>
          <h3 style={{ marginBottom: '10px' }}>1. Select a Course</h3>
          {coursesLoading && <p>Loading courses...</p>}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {courses?.map((course: any) => (
              <div 
                key={course.id}
                onClick={() => setSelectedCourse(course.id)}
                style={{
                  padding: '12px',
                  border: '1px solid',
                  borderColor: selectedCourse === course.id ? '#2563eb' : '#e5e7eb',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  background: selectedCourse === course.id ? '#eff6ff' : 'white'
                }}
              >
                <strong>{course.course_name}</strong>
                <div style={{ fontSize: '12px', color: '#666' }}>{course.course_code}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Subjects List */}
        <div>
          <h3 style={{ marginBottom: '10px' }}>2. Assign Subjects</h3>
          {!selectedCourse ? (
            <p style={{ color: '#666' }}>Please select a course on the left first.</p>
          ) : subjectsLoading ? (
            <p>Loading subjects...</p>
          ) : (
            <div className="card-grid">
              {subjects?.map((sub: SubjectRow) => (
                <Card
                  key={sub.id}
                  title={sub.subject_name}
                  subtitle={sub.subject_code}
                  footer={
                    <button 
                      className="perf-btn" 
                      disabled={busySubject === sub.id}
                      onClick={() => handleAssign(sub.id)}
                    >
                      {busySubject === sub.id ? "Assigning..." : "Assign to Course"}
                    </button>
                  }
                >
                  <CardRow label="Subject ID" value={sub.id} />
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}