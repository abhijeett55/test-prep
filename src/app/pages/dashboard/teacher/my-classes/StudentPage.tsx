import "./CoursesPage.css";

interface Student {
  studentId: string;
  name: string;
  className: string;
  email: string;
  joinedAt: string;
  testsTaken: number;
}

const students: Student[] = [
  {
    studentId: "STU-001",
    name: "Aarav Sharma",
    className: "Class 10 - A",
    email: "aarav.sharma@example.com",
    joinedAt: "02 Oct 2026",
    testsTaken: 6,
  },
  {
    studentId: "STU-002",
    name: "Diya Verma",
    className: "Class 10 - B",
    email: "diya.verma@example.com",
    joinedAt: "28 Sep 2026",
    testsTaken: 4,
  },
  {
    studentId: "STU-003",
    name: "Rohan Patel",
    className: "Class 9 - A",
    email: "rohan.patel@example.com",
    joinedAt: "25 Sep 2026",
    testsTaken: 5,
  },
  {
    studentId: "STU-004",
    name: "Ananya Singh",
    className: "Class 9 - B",
    email: "ananya.singh@example.com",
    joinedAt: "20 Sep 2026",
    testsTaken: 3,
  },
];

export default function StudentPage() {
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
              <th>Class</th>
              <th>Email</th>
              <th>Joined At</th>
              <th>Tests Taken</th>
            </tr>
          </thead>

          <tbody>
            {students.map((student) => (
              <tr key={student.studentId}>
                <td className="course-id">{student.studentId}</td>
                <td className="course-name">{student.name}</td>
                <td>
                  <span className="subject-badge">{student.className}</span>
                </td>
                <td>{student.email}</td>
                <td>{student.joinedAt}</td>
                <td className="student-count">{student.testsTaken}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}