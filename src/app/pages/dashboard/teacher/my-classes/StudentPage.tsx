import { useApi } from "../../../../hooks/useApi";
import { getMyStudents } from "../../../../api/auth/teacher/teacher";
import "./CoursesPage.css";

export default function StudentPage() {
  const { data: students, loading, error } = useApi(() => getMyStudents());

  if (loading) return <div className="courses-page">Loading students…</div>;
  if (error) return <div className="courses-page" style={{ color: "red" }}>{error}</div>;

  return (
    <div className="courses-page">
      <div className="courses-header">
        <div>
          <h1>Student List</h1>
          <p>Students in your classes</p>
        </div>
      </div>

      <div className="courses-table-container">
        <table className="courses-table">
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Student Name</th>
              <th>Batch</th>
              <th>Email</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {(students ?? []).map((student) => (
              <tr key={student.id}>
                <td className="course-id">{student.student_id}</td>
                <td className="course-name">{student.full_name}</td>
                <td>
                  <span className="subject-badge">
                    {student.batch_name || "Unassigned"}
                  </span>
                </td>
                <td>{student.email}</td>
                <td>{student.status}</td>
              </tr>
            ))}
            {students?.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", padding: 24 }}>
                  No students assigned to you yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}