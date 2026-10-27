import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { useApi } from "../../../../hooks/useApi";
import { listBatches, updateBatch } from "../../../../api/auth/admin/batches";
import { listCourses } from "../../../../api/auth/admin/courses";
import { getMyInstitute } from "../../../../api/auth/admin/institute";
import { errorMessage } from "../../../../api/client";
import "../DefaultPage.css";

export default function AssignCourseToBatch() {
  const { data: allBatches, loading: loadingBatches } = useApi(() => listBatches());
  const { data: allCourses, loading: loadingCourses } = useApi(() => listCourses());
  const { data: myInstitute } = useApi(() => getMyInstitute());

  const [selectedBatch, setSelectedBatch] = useState<string>("");
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  
  const [batchSearch, setBatchSearch] = useState("");
  const [courseSearch, setCourseSearch] = useState("");
  
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Filter and Sort Batches
  const filteredBatches = useMemo(() => {
    if (!allBatches || !myInstitute) return [];
    let result = allBatches.filter(b => b.institute_id === myInstitute.id);
    result = result.sort((a, b) => a.batch_name.localeCompare(b.batch_name));
    const q = batchSearch.trim().toLowerCase();
    if (!q) return result;
    return result.filter(b => b.batch_name.toLowerCase().includes(q) || b.batch_code.toLowerCase().includes(q));
  }, [allBatches, myInstitute, batchSearch]);

  // Filter and Sort Courses
  const filteredCourses = useMemo(() => {
    if (!allCourses || !myInstitute) return [];
    let result = allCourses.filter(c => c.institute_id === myInstitute.id);
    result = result.sort((a, b) => a.course_name.localeCompare(b.course_name));
    const q = courseSearch.trim().toLowerCase();
    if (!q) return result;
    return result.filter(c => c.course_name.toLowerCase().includes(q) || c.course_code.toLowerCase().includes(q));
  }, [allCourses, myInstitute, courseSearch]);

  const handleSave = async () => {
    if (!selectedBatch) {
      setError("Please select a batch first.");
      return;
    }
    
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      // Assign the selected course to the batch (or null if they want to unassign)
      await updateBatch(selectedBatch, {
        course_id: selectedCourse || null
      });
      setSuccess(true);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="default-page">
      <div className="default-panel">
        <div className="section-bar" style={{ textAlign: "center" }}>
          Map Batch to Course
        </div>
        
        <div style={{ padding: 24 }}>
          {error && <div className="perf-success" style={{ background: "#fdeaea", color: "#c62f2f", marginBottom: 16 }}>{error}</div>}
          {success && <div className="perf-success" style={{ marginBottom: 16 }}>Batch successfully mapped to Course!</div>}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            
            {/* BATCH SECTION */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <span style={{ fontWeight: 600, fontSize: 14 }}>1. Select Batch</span>
                <div className="search-control" style={{ maxWidth: 200, margin: 0 }}>
                  <Search size={15} strokeWidth={2} />
                  <input type="text" placeholder="Search batch..." value={batchSearch} onChange={(e) => setBatchSearch(e.target.value)} />
                </div>
              </div>

              <div className="default-table-wrap" style={{ border: "1px solid #e6e9f0", borderRadius: 8, maxHeight: 400, overflowY: "auto" }}>
                <table className="default-table">
                  <thead>
                    <tr>
                      <th style={{ width: 40 }}></th>
                      <th>Batch Name</th>
                      <th>Code</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loadingBatches ? (
                      <tr><td colSpan={3} style={{ textAlign: "center", padding: 20 }}>Loading...</td></tr>
                    ) : filteredBatches.map((b) => (
                      <tr 
                        key={b.id} 
                        style={{ background: selectedBatch === b.id ? "#e8ebfd" : undefined, cursor: "pointer" }}
                        onClick={() => setSelectedBatch(b.id)}
                      >
                        <td><input type="radio" name="batch" checked={selectedBatch === b.id} readOnly /></td>
                        <td className="cell-name">{b.batch_name}</td>
                        <td>{b.batch_code}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* COURSE SECTION */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <span style={{ fontWeight: 600, fontSize: 14 }}>2. Select Course</span>
                <div className="search-control" style={{ maxWidth: 200, margin: 0 }}>
                  <Search size={15} strokeWidth={2} />
                  <input type="text" placeholder="Search course..." value={courseSearch} onChange={(e) => setCourseSearch(e.target.value)} />
                </div>
              </div>

              <div className="default-table-wrap" style={{ border: "1px solid #e6e9f0", borderRadius: 8, maxHeight: 400, overflowY: "auto" }}>
                <table className="default-table">
                  <thead>
                    <tr>
                      <th style={{ width: 40 }}></th>
                      <th>Course Name</th>
                      <th>Code</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loadingCourses ? (
                      <tr><td colSpan={3} style={{ textAlign: "center", padding: 20 }}>Loading...</td></tr>
                    ) : filteredCourses.map((c) => (
                      <tr 
                        key={c.id} 
                        style={{ background: selectedCourse === c.id ? "#e8ebfd" : undefined, cursor: "pointer" }}
                        onClick={() => setSelectedCourse(c.id)}
                      >
                        <td><input type="radio" name="course" checked={selectedCourse === c.id} readOnly /></td>
                        <td className="cell-name">{c.course_name}</td>
                        <td>{c.course_code}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 24 }}>
            <button 
              className="confirm-btn-primary" 
              onClick={handleSave} 
              disabled={saving || !selectedBatch}
              style={{ width: "auto", minWidth: "200px", padding: "0 32px" }}
            >
              {saving ? "Saving…" : "Save Mapping"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}