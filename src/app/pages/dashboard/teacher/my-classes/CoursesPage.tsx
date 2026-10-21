import { useApi } from "../../../../hooks/useApi";
import { getMyCourses } from "../../../../api/auth/teacher/teacher";
import "./CoursesPage.css";

export default function CoursesPage() {
  const { data: courses, loading, error } = useApi(() => getMyCourses());

  if (loading) return <div className="courses-page">Loading courses…</div>;
  if (error) return <div className="courses-page" style={{ color: "red" }}>{error}</div>;

  return (
    <div className="courses-page">
      <div className="courses-header">
        <div>
          <h1>Courses List</h1>
          <p>Courses assigned to you</p>
        </div>
      </div>

      <div className="courses-table-container">
        <table className="courses-table">
          <thead>
            <tr>
              <th>Course Code</th>
              <th>Course Name</th>
              <th>Assigned Subject</th>
              <th>Created At</th>
              <th>Students Enrolled</th>
            </tr>
          </thead>
          <tbody>
            {(courses ?? []).map((course) => (
              <tr key={course.id}>
                <td className="course-id">{course.course_code}</td>
                <td className="course-name">{course.course_name}</td>
                <td>
                  <span className="subject-badge">
                    {course.subjects || "General"}
                  </span>
                </td>
                <td>{new Date(course.created_at).toLocaleDateString()}</td>
                <td className="student-count">{course.student_count}</td>
              </tr>
            ))}
            {courses?.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", padding: 24 }}>
                  No courses assigned to you yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}