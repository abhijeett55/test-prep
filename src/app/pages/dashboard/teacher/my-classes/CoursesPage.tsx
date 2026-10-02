import "./CoursesPage.css";

interface Course {
  courseId: string;
  courseName: string;
  subject: string;
  createdAt: string;
  studentsEnrolled: number;
}

const courses: Course[] = [
  {
    courseId: "CRS-001",
    courseName: "Class 10 Mathematics",
    subject: "Mathematics",
    createdAt: "02 Oct 2026",
    studentsEnrolled: 45,
  },
  {
    courseId: "CRS-002",
    courseName: "Class 10 Science",
    subject: "Science",
    createdAt: "28 Sep 2026",
    studentsEnrolled: 38,
  },
  {
    courseId: "CRS-003",
    courseName: "Class 9 Mathematics",
    subject: "Mathematics",
    createdAt: "25 Sep 2026",
    studentsEnrolled: 52,
  },
  {
    courseId: "CRS-004",
    courseName: "Class 9 Science",
    subject: "Science",
    createdAt: "20 Sep 2026",
    studentsEnrolled: 41,
  },
];

export default function CoursesList() {
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
              <th>Course ID</th>
              <th>Course Name</th>
              <th>Assigned Subject</th>
              <th>Created At</th>
              <th>Students Enrolled</th>
            </tr>
          </thead>

          <tbody>
            {courses.map((course) => (
              <tr key={course.courseId}>
                <td className="course-id">
                  {course.courseId}
                </td>

                <td className="course-name">
                  {course.courseName}
                </td>

                <td>
                  <span className="subject-badge">
                    {course.subject}
                  </span>
                </td>

                <td>{course.createdAt}</td>

                <td className="student-count">
                  {course.studentsEnrolled}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}