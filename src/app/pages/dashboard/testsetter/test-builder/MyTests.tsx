import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listMyTests, publishTest } from "../../../../api/auth/testsetter/tests";
import type { TestRow } from "../../../../api/types";
import "../DefaultPage.css";

export default function MyTests() {
  const navigate = useNavigate();
  const [tests, setTests] = useState<TestRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [publishingId, setPublishingId] = useState<string | null>(null);

  const loadTests = (isRefetch = false) => {
    if (isRefetch) setLoading(true);
    
    listMyTests()
      .then(setTests)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadTests();
  }, []);

  const handlePublish = async (testId: string) => {
    if (!window.confirm("Are you sure you want to publish this test? Students will be able to see it immediately.")) {
      return;
    }
    
    setPublishingId(testId);
    try {
      await publishTest(testId);
      await loadTests(true);
    } catch (err) {
      alert("Failed to publish test");
      console.error(err);
    } finally {
      setPublishingId(null);
    }
  };

  if (loading) return <div className="default-page">Loading tests...</div>;

  return (
    <div className="default-page">
      <div className="default-panel">
        
        {/* Header with proper button styling */}
        <div className="section-bar" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>My Tests</span>
        </div>

        <div className="default-table-wrap">
          <table className="default-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Total Marks</th>
                <th>Duration</th>
                <th>Created</th>
                <th className="col-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tests.map((test) => (
                <tr key={test.id}>
                  <td className="cell-name">{test.title}</td>
                  
                  {/* Cleaned up Status Badge */}
                  <td>
                    <span 
                      className={`status-badge ${test.status === "PUBLISHED" ? "active" : "draft"}`}
                      style={
                        test.status === "DRAFT" 
                          ? { background: "#fef3c7", color: "#b45309", padding: "4px 8px", borderRadius: "12px", fontSize: "12px", fontWeight: 600 } 
                          : {}
                      }
                    >
                      {test.status}
                    </span>
                  </td>
                  
                  <td>{test.total_marks}</td>
                  <td>{test.duration_minutes} mins</td>
                  <td>{new Date(test.created_at).toLocaleDateString()}</td>
                  
                  {/* FIXED: Removed flex from <td>, wrapped buttons in a <div> instead */}
                  <td className="col-actions">
                    <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                      <button 
                        onClick={() => navigate(`sections-marking-scheme?testId=${test.id}`)}
                        className="perf-btn outline"
                      >
                        Edit Sections
                      </button>
                      
                      {test.status === "DRAFT" && (
                        <button 
                          onClick={() => handlePublish(test.id)}
                          disabled={publishingId === test.id}
                          className="perf-btn"
                          style={{ background: "#1a9a4a", color: "white" }} // Green for publish
                        >
                          {publishingId === test.id ? "Publishing..." : "Publish"}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              
              {tests.length === 0 && (
                <tr>
                  <td colSpan={6} className="no-results" style={{ textAlign: "center", padding: "40px 20px" }}>
                    No tests found. Click "+ Create New Test" to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}