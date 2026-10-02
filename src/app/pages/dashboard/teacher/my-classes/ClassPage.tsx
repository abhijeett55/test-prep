import "./CoursesPage.css";

interface ClassItem {
  classId: string;
  className: string;
  section: string;
  subject: string;
  createdAt: string;
  studentsEnrolled: number;
}

const classes: ClassItem[] = [
  {
    classId: "CLS-001",
    className: "Class 10",
    section: "A",
    subject: "Mathematics",
    createdAt: "02 Oct 2026",
    studentsEnrolled: 45,
  },
  {
    classId: "CLS-002",
    className: "Class 10",
    section: "B",
    subject: "Science",
    createdAt: "28 Sep 2026",
    studentsEnrolled: 38,
  },
  {
    classId: "CLS-003",
    className: "Class 9",
    section: "A",
    subject: "Mathematics",
    createdAt: "25 Sep 2026",
    studentsEnrolled: 52,
  },
  {
    classId: "CLS-004",
    className: "Class 9",
    section: "B",
    subject: "Science",
    createdAt: "20 Sep 2026",
    studentsEnrolled: 41,
  },
];

export default function ClassPage() {
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
              <th>Class ID</th>
              <th>Class Name</th>
              <th>Section</th>
              <th>Assigned Subject</th>
              <th>Created At</th>
              <th>Students Enrolled</th>
            </tr>
          </thead>

          <tbody>
            {classes.map((cls) => (
              <tr key={cls.classId}>
                <td className="course-id">{cls.classId}</td>
                <td className="course-name">{cls.className}</td>
                <td>{cls.section}</td>
                <td>
                  <span className="subject-badge">{cls.subject}</span>
                </td>
                <td>{cls.createdAt}</td>
                <td className="student-count">{cls.studentsEnrolled}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}