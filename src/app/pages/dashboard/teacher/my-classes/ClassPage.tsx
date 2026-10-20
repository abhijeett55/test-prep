/* eslint-disable react-hooks/purity */
import { useApi } from "../../../../hooks/useApi";
import { getMyBatches } from "../../../../api/auth/teacher/teacher";
import "./CoursesPage.css";

export default function ClassPage() {
  const { data: batches, loading, error } = useApi(() => getMyBatches());

  if (loading) return <div className="courses-page">Loading classes…</div>;
  if (error) return <div className="courses-page" style={{ color: "red" }}>{error}</div>;

  return (
    <div className="courses-page">
      <div className="courses-header">
        <div>
          <h1>Class List</h1>
          <p>Classes assigned to you</p>
        </div>
      </div>

      <div className="courses-table-container">
        <table className="courses-table">
          <thead>
            <tr>
              <th>Class Code</th>
              <th>Class Name</th>
              <th>Course</th>
              <th>Created At</th>
              <th>Students Enrolled</th>
            </tr>
          </thead>
          <tbody>
            {(batches ?? []).map((batch) => (
              <tr key={batch.id}>
                <td className="course-id">{batch.batch_code}</td>
                <td className="course-name">{batch.batch_name}</td>
                <td>
                  <span className="subject-badge">
                    {batch.course_name || "No Course"}
                  </span>
                </td>
                // eslint-disable-next-line react-hooks/purity, react-hooks/purity
                <td>{new Date(batch.start_date || Date.now()).toLocaleDateString()}</td>
                <td className="student-count">{batch.student_count}</td>
              </tr>
            ))}
            {batches?.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", padding: 24 }}>
                  No classes assigned to you yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}