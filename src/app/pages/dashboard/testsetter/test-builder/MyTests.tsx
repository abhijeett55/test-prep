import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listMyTests } from "../../../../api/auth/testsetter/tests";
import type { TestRow } from "../../../../api/types";

export default function MyTests() {
  const navigate = useNavigate();
  const [tests, setTests] = useState<TestRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listMyTests()
      .then(setTests)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading tests...</div>;

  return (
    <div className="page-container">
      <div className="header-row">
        <h1>My Tests</h1>
        <button onClick={() => navigate("create")} className="primary">+ Create New Test</button>
      </div>

      <table className="default-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Status</th>
            <th>Total Marks</th>
            <th>Duration</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tests.map((test) => (
            <tr key={test.id}>
              <td>{test.title}</td>
              <td>
                <span className={`badge ${test.status.toLowerCase()}`}>{test.status}</span>
              </td>
              <td>{test.total_marks}</td>
              <td>{test.duration_minutes} mins</td>
              <td>{new Date(test.created_at).toLocaleDateString()}</td>
              <td>
                <button 
                  onClick={() => navigate(`sections-marking-scheme?testId=${test.id}`)}
                  className="secondary"
                >
                  Edit Sections
                </button>
              </td>
            </tr>
          ))}
          {tests.length === 0 && (
            <tr><td colSpan={6}>No tests found. Create one to get started.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}