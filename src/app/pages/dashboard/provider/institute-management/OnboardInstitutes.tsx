import { useState } from "react";
import "./Performance.css";

interface InstituteForm {
  name: string;
  type: string;
  city: string;
  state: string;
  contactPerson: string;
  email: string;
  phone: string;
}

const emptyForm: InstituteForm = {
  name: "",
  type: "",
  city: "",
  state: "",
  contactPerson: "",
  email: "",
  phone: "",
};

const typeOptions = ["School", "College", "Coaching Institute", "University"];

export default function OnboardInstitute() {
  const [form, setForm] = useState<InstituteForm>(emptyForm);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const update =
    (key: keyof InstituteForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setForm({ ...form, [key]: e.target.value });
      setSaved(false);
    };

  const handleSubmit = () => {
    const { name, type, city, state, contactPerson, email, phone } = form;
    if (!name || !type || !city || !state || !contactPerson || !email || !phone) {
      setError("Please fill in all fields.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    // TODO: call onboard-institute API with `form`
    console.log("Onboard institute:", form);
    setSaved(true);
    setForm(emptyForm);
  };

  return (
    <div className="perf-page">
      <div className="perf-header">
        <div>
          <h1>Onboard Institute</h1>
          <p>Add a new institute to the platform</p>
        </div>
      </div>

      {saved && <div className="perf-success">Institute onboarded successfully.</div>}
      {error && (
        <div className="perf-success" style={{ background: "#fdeaea", color: "#c62f2f" }}>
          {error}
        </div>
      )}

      <div className="perf-form-card">
        <div className="perf-form-grid">
          <div className="perf-field full">
            <label>Institute Name *</label>
            <input className="perf-input" value={form.name} onChange={update("name")} />
          </div>

          <div className="perf-field">
            <label>Institute Type *</label>
            <select className="perf-input" value={form.type} onChange={update("type")}>
              <option value="">Select type</option>
              {typeOptions.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="perf-field">
            <label>City *</label>
            <input className="perf-input" value={form.city} onChange={update("city")} />
          </div>

          <div className="perf-field">
            <label>State *</label>
            <input className="perf-input" value={form.state} onChange={update("state")} />
          </div>

          <div className="perf-field">
            <label>Contact Person *</label>
            <input className="perf-input" value={form.contactPerson} onChange={update("contactPerson")} />
          </div>

          <div className="perf-field">
            <label>Email *</label>
            <input type="email" className="perf-input" value={form.email} onChange={update("email")} />
          </div>

          <div className="perf-field">
            <label>Phone *</label>
            <input type="tel" className="perf-input" value={form.phone} onChange={update("phone")} />
          </div>
        </div>

        <div className="perf-form-actions">
          <button className="perf-btn outline" onClick={() => { setForm(emptyForm); setError(""); }}>
            Reset
          </button>
          <button className="perf-btn" onClick={handleSubmit}>
            Onboard Institute
          </button>
        </div>
      </div>
    </div>
  );
}