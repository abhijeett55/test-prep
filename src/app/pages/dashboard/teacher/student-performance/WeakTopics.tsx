import "./Performance.css";

interface WeakTopic {
  topicId: string;
  topic: string;
  subject: string;
  batch: string;
  accuracy: number;
  studentsStruggling: number;
}

const topics: WeakTopic[] = [
  { topicId: "TPC-001", topic: "Quadratic Equations", subject: "Mathematics", batch: "Class 10 - A", accuracy: 42, studentsStruggling: 21 },
  { topicId: "TPC-002", topic: "Trigonometry", subject: "Mathematics", batch: "Class 10 - B", accuracy: 51, studentsStruggling: 17 },
  { topicId: "TPC-003", topic: "Chemical Reactions", subject: "Science", batch: "Class 10 - B", accuracy: 58, studentsStruggling: 14 },
  { topicId: "TPC-004", topic: "Linear Equations", subject: "Mathematics", batch: "Class 9 - A", accuracy: 63, studentsStruggling: 19 },
  { topicId: "TPC-005", topic: "Motion and Force", subject: "Science", batch: "Class 9 - B", accuracy: 69, studentsStruggling: 11 },
];

const level = (a: number) =>
  a < 50 ? { label: "Critical", cls: "danger", bar: "low" }
  : a < 65 ? { label: "Needs Attention", cls: "warning", bar: "mid" }
  : { label: "Moderate", cls: "", bar: "" };

export default function WeakTopics() {
  return (
    <div className="perf-page">
      <div className="perf-header">
        <div>
          <h1>Weak Topics</h1>
          <p>Topics where students are scoring lowest</p>
        </div>
      </div>

      <div className="perf-table-container">
        <table className="perf-table">
          <thead>
            <tr>
              <th>Topic ID</th>
              <th>Topic</th>
              <th>Subject</th>
              <th>Batch</th>
              <th>Accuracy</th>
              <th>Students Struggling</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {topics.map((t) => {
              const lv = level(t.accuracy);
              return (
                <tr key={t.topicId}>
                  <td className="perf-id">{t.topicId}</td>
                  <td className="perf-strong">{t.topic}</td>
                  <td>
                    <span className="perf-badge">{t.subject}</span>
                  </td>
                  <td>{t.batch}</td>
                  <td>
                    <div className="perf-progress">
                      <div className="perf-progress-track">
                        <div
                          className={`perf-progress-fill ${lv.bar}`}
                          style={{ width: `${t.accuracy}%` }}
                        />
                      </div>
                      <span className="perf-progress-text">{t.accuracy}%</span>
                    </div>
                  </td>
                  <td>{t.studentsStruggling}</td>
                  <td>
                    <span className={`perf-badge ${lv.cls}`}>{lv.label}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}