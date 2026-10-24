import { useEffect, useState, useCallback } from "react"; // <-- Added useCallback
import { useSearchParams } from "react-router-dom";
import { 
  getTestDetails, 
  updateTestSection 
} from "../../../../api/auth/testsetter/tests";
import type { Test, TestSection } from "../../../../api/types";

export default function NegativeMarkingRules() {
  const [searchParams] = useSearchParams();
  const testId = searchParams.get("testId");
  
  const [test, setTest] = useState<Test | null>(null);
  const [loading, setLoading] = useState(true);

  // Wrapped in useCallback to satisfy ESLint
  const loadTest = useCallback(() => {
    if (!testId) return;
    getTestDetails(testId)
      .then(setTest)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [testId]);

  useEffect(() => {
    loadTest();
  }, [loadTest]); // <-- Added loadTest to deps

  const handleUpdate = async (section: TestSection, e: React.FormEvent) => {
    e.preventDefault();
    if (!testId) return;
    
    try {
      await updateTestSection(testId, section.id, {
        name: section.name,
        total_questions: section.total_questions,
        marks_per_question: section.marks_per_question,
        has_negative_marking: section.has_negative_marking,
        negative_marks_value: section.negative_marks_value,
        negative_marks_type: section.negative_marks_type,
      });
      alert("Rules updated!");
      loadTest();
    } catch { // <-- Removed unused 'err' variable
      alert("Failed to update rules");
    }
  };


  if (loading) return <div>Loading...</div>;
  if (!test) return <div>No test found.</div>;

  return (
    <div className="page-container">
      <h1>Negative Marking Rules</h1>
      <p>Configure negative marking for: <strong>{test.title}</strong></p>

      <div className="sections-list">
        {test.sections?.map((section) => (
          <div key={section.id} className="panel" style={{ marginBottom: "1rem" }}>
            <h4>{section.name}</h4>
            <form onSubmit={(e) => handleUpdate(section, e)} className="form-row">
              
              <div className="field">
                <label>
                  <input 
                    type="checkbox" 
                    checked={section.has_negative_marking}
                    onChange={(e) => setTest({
                      ...test,
                      sections: test.sections?.map(s => s.id === section.id ? { ...s, has_negative_marking: e.target.checked } : s)
                    })}
                  /> Enable Negative Marking
                </label>
              </div>

              {section.has_negative_marking && (
                <>
                  <div className="field">
                    <label>Deduction Value</label>
                    <input 
                      type="number" step="0.25" min="0" 
                      value={section.negative_marks_value || 0}
                      onChange={(e) => setTest({
                        ...test,
                        sections: test.sections?.map(s => s.id === section.id ? { ...s, negative_marks_value: Number(e.target.value) } : s)
                      })}
                    />
                  </div>

                  <div className="field">
                    <label>Type</label>
                    <select
                      value={section.negative_marks_type || "ABSOLUTE"}
                      onChange={(e) => setTest({
                        ...test,
                        sections: test.sections?.map(s => s.id === section.id ? { ...s, negative_marks_type: e.target.value as "ABSOLUTE" | "PERCENTAGE" } : s)
                      })}
                    >
                      <option value="ABSOLUTE">Absolute (e.g., -0.25 marks)</option>
                      <option value="PERCENTAGE">Percentage (e.g., -25% of marks)</option>
                    </select>
                  </div>
                </>
              )}

              <button type="submit" className="primary" style={{ alignSelf: "flex-end" }}>
                Save Section
              </button>
            </form>
          </div>
        ))}

        {test.sections?.length === 0 && <p>No sections added yet.</p>}
      </div>
    </div>
  );
}