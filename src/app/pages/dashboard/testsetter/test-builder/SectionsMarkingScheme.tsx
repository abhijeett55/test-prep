import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { 
  getTestDetails, 
  addTestSection, 
  deleteTestSection 
} from "../../../../api/auth/testsetter/tests";
import type { Test, CreateSectionPayload } from "../../../../api/types";

export default function SectionsMarkingScheme() {
  const [searchParams] = useSearchParams();
  const testId = searchParams.get("testId");

  const [test, setTest] = useState<Test | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState<CreateSectionPayload>({
    name: "Section A",
    total_questions: 10,
    marks_per_question: 1,
    has_negative_marking: false,
    negative_marks_value: null,
    negative_marks_type: null,
  });

  const loadTest = useCallback(() => {
    if (!testId) return;
    getTestDetails(testId)
      .then(setTest)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [testId]);

  useEffect(() => {
    loadTest();
  }, [loadTest]);

  const handleAddSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testId) return;
    setSaving(true);
    try {
      await addTestSection(testId, formData);
      loadTest(); // Reload test to see updated sections and total marks
      setFormData({ ...formData, name: `Section ${String.fromCharCode(66 + (test?.sections?.length || 0))}` }); // Auto-increment name
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      alert("Failed to add section");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (sectionId: string) => {
    if (!testId || !window.confirm("Delete this section?")) return;
    try {
      await deleteTestSection(testId, sectionId);
      loadTest();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      alert("Failed to delete section");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!testId) return <div>No Test Selected. Go back to My Tests.</div>;
  if (!test) return <div>Test not found.</div>;

  return (
    <div className="page-container">
      <h1>{test.title} - Sections</h1>
      <h3>Total Marks: {test.total_marks}</h3>

      <div className="panel" style={{ marginBottom: "2rem" }}>
        <h4>Add New Section</h4>
        <form onSubmit={handleAddSection} className="form-row">
          <div className="field">
            <label>Section Name</label>
            <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>
          <div className="field">
            <label>No. of Questions</label>
            <input required type="number" min="1" value={formData.total_questions} onChange={e => setFormData({...formData, total_questions: Number(e.target.value)})} />
          </div>
          <div className="field">
            <label>Marks per Q</label>
            <input required type="number" min="0.5" step="0.5" value={formData.marks_per_question} onChange={e => setFormData({...formData, marks_per_question: Number(e.target.value)})} />
          </div>
          <button type="submit" disabled={saving} className="primary" style={{ alignSelf: "flex-end" }}>
            Add Section
          </button>
        </form>
      </div>

      <h3>Current Sections</h3>
      <table className="default-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Questions</th>
            <th>Marks/Q</th>
            <th>Negative Marking</th>
            <th>Total Section Marks</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {test.sections?.map(sec => (
            <tr key={sec.id}>
              <td>{sec.name}</td>
              <td>{sec.total_questions}</td>
              <td>{sec.marks_per_question}</td>
              <td>{sec.has_negative_marking ? `-${sec.negative_marks_value} (${sec.negative_marks_type})` : "None"}</td>
              <td>{sec.total_questions * sec.marks_per_question}</td>
              <td>
                <button onClick={() => handleDelete(sec.id)} className="danger">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}