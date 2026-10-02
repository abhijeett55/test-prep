import { useState } from "react";
import "./Performance.css";

interface TestForm {
  testName: string;
  className: string;
  subject: string;
  totalMarks: string;
  passMarks: string;
  duration: string;
  instructions: string;
}

const emptyForm: TestForm = {
  testName: "",
  className: "",
  subject: "",
  totalMarks: "",
  passMarks: "",
  duration: "",
  instructions: "",
};

const classOptions = ["Class 10 - A", "Class 10 - B", "Class 9 - A", "Class 9 - B"];
const subjectOptions = ["Mathematics", "Science"];

export default function CreateTest() {
  const [form, setForm] = useState<TestForm>(emptyForm);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const update =
    (key: keyof TestForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setForm({ ...form, [key]: e.target.value });
      setSaved(false);
    };

  const handleSubmit = () => {
    const { testName, className, subject, totalMarks, passMarks, duration } = form;
    if (!testName || !className || !subject || !totalMarks || !passMarks || !duration) {
      setError("Please fill in all required fields.");
      return;
    }
    if (Number(passMarks) > Number(totalMarks)) {
      setError("Pass marks cannot be more than total marks.");
      return;
    }
    setError("");
    // TODO: call create-test API with `form`
    console.log("Create test:", form);
    setSaved(true);
    setForm(emptyForm);
  };

  return (
    <div className="perf-page">
      <div className="perf-header">
        <div>
          <h1>Create Test</h1>
          <p>Set up a new test for your class</p>
        </div>
      </div>

      {saved && <div className="perf-success">Test created successfully.</div>}
      {error && (
        <div className="perf-success" style={{ background: "#fdeaea", color: "#c62f2f" }}>
          {error}
        </div>
      )}

      <div className="perf-form-card">
        <div className="perf-form-grid">
          <div className="perf-field full">
            <label>Test Name *</label>
            <input
              className="perf-input"
              placeholder="e.g. Algebra Unit Test"
              value={form.testName}
              onChange={update("testName")}
            />
          </div>

          <div className="perf-field">
            <label>Class *</label>
            <select className="perf-input" value={form.className} onChange={update("className")}>
              <option value="">Select class</option>
              {classOptions.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="perf-field">
            <label>Subject *</label>
            <select className="perf-input" value={form.subject} onChange={update("subject")}>
              <option value="">Select subject</option>
              {subjectOptions.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="perf-field">
            <label>Total Marks *</label>
            <input type="number" min={1} className="perf-input" value={form.totalMarks} onChange={update("totalMarks")} />
          </div>

          <div className="perf-field">
            <label>Pass Marks *</label>
            <input type="number" min={0} className="perf-input" value={form.passMarks} onChange={update("passMarks")} />
          </div>

          <div className="perf-field">
            <label>Duration (minutes) *</label>
            <input type="number" min={1} className="perf-input" value={form.duration} onChange={update("duration")} />
          </div>

          <div className="perf-field full">
            <label>Instructions</label>
            <textarea
              className="perf-input"
              placeholder="Instructions shown to students before the test"
              value={form.instructions}
              onChange={update("instructions")}
            />
          </div>
        </div>

        <div className="perf-form-actions">
          <button className="perf-btn outline" onClick={() => { setForm(emptyForm); setError(""); }}>
            Reset
          </button>
          <button className="perf-btn" onClick={handleSubmit}>
            Create Test
          </button>
        </div>
      </div>
    </div>
  );
}