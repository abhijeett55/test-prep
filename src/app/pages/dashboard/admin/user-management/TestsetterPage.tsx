import { useMemo, useState } from "react";
import { Plus, Search, Pencil, Eye, X } from "lucide-react";
import TestsetterForm from "../../../../config/nav-user/testsetter/TestsetterForm";
import type { FormValues, Option } from "../../../../components/FormLayout/types";
import "./DefaultPage.css";

const institutes: Option[] = [
  { id: "inst-1", name: "Allen Career Institute" },
  { id: "inst-2", name: "Physics Wallah" },
  { id: "inst-3", name: "Aakash Institute" },
];

const subjects: Option[] = [
  { id: "sub-1", name: "Physics" },
  { id: "sub-2", name: "Chemistry" },
  { id: "sub-3", name: "Mathematics" },
  { id: "sub-4", name: "Biology" },
];

type TestSetterRow = {
  id: string;
  name: string;
  email: string;
  institute: string;
  subject: string;
  employeeCode: string;
  testSetterId: string;
  qualification: string;
};

const MOCK_TEST_SETTERS: TestSetterRow[] = [
  {
    id: "ts-1",
    name: "Neha Kapoor",
    email: "neha.kapoor@example.com",
    institute: "Allen Career Institute",
    subject: "Physics",
    employeeCode: "EMP-2011",
    testSetterId: "TS-001",
    qualification: "M.Sc. Physics",
  },
  {
    id: "ts-2",
    name: "Arjun Verma",
    email: "arjun.verma@example.com",
    institute: "Physics Wallah",
    subject: "Mathematics",
    employeeCode: "EMP-2047",
    testSetterId: "TS-002",
    qualification: "M.Sc. Mathematics",
  },
  {
    id: "ts-3",
    name: "Meera Nair",
    email: "meera.nair@example.com",
    institute: "Aakash Institute",
    subject: "Biology",
    employeeCode: "EMP-2090",
    testSetterId: "TS-003",
    qualification: "M.Sc. Zoology",
  },
];

const ENTRY_OPTIONS = [10, 25, 50];

export default function TestSettersPage() {
  const [showForm, setShowForm] = useState(false);
  const [testSetters, setTestSetters] = useState<TestSetterRow[]>(MOCK_TEST_SETTERS);
  const [search, setSearch] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  const [pendingTestSetter, setPendingTestSetter] = useState<FormValues | null>(null);
  const [viewing, setViewing] = useState<TestSetterRow | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return testSetters;
    return testSetters.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.email.toLowerCase().includes(q) ||
        t.institute.toLowerCase().includes(q) ||
        t.subject.toLowerCase().includes(q) ||
        t.testSetterId.toLowerCase().includes(q) ||
        t.qualification.toLowerCase().includes(q)
    );
  }, [testSetters, search]);

  const visible = filtered.slice(0, entriesPerPage);

  const handleFormSubmit = async (values: FormValues) => {
    setPendingTestSetter(values);
  };

  const cancelPendingTestSetter = () => setPendingTestSetter(null);

  const confirmPendingTestSetter = () => {
    if (!pendingTestSetter) return;
    const newTestSetter: TestSetterRow = {
      id: crypto.randomUUID(),
      name: pendingTestSetter.fullName ?? "",
      email: pendingTestSetter.email ?? "",
      institute: institutes.find((i) => i.id === pendingTestSetter.institute_id)?.name ?? "",
      subject: subjects.find((s) => s.id === pendingTestSetter.subject_id)?.name ?? "",
      employeeCode: pendingTestSetter.employee_code ?? "",
      testSetterId: pendingTestSetter.testsetter_id ?? "",
      qualification: pendingTestSetter.qualification ?? "",
    };

    // TODO: call create test setter API
    setTestSetters((prev) => [...prev, newTestSetter]);
    setPendingTestSetter(null);
    setShowForm(false);
  };

  const pendingInstituteName = pendingTestSetter
    ? institutes.find((i) => i.id === pendingTestSetter.institute_id)?.name ?? "—"
    : "";
  const pendingSubjectName = pendingTestSetter
    ? subjects.find((s) => s.id === pendingTestSetter.subject_id)?.name ?? "—"
    : "";

  return (
    <div className="default-page">
      {showForm ? (
        <TestsetterForm
          institutes={institutes}
          subjects={subjects}
          onSubmit={handleFormSubmit}
          onCancel={() => setShowForm(false)}
        />
      ) : testSetters.length === 0 ? (
        <div className="default-empty">
          <p>No test setters added yet.</p>
          <button type="button" className="add-button" onClick={() => setShowForm(true)}>
            <Plus size={16} strokeWidth={2.4} />
            Add your first test setter
          </button>
        </div>
      ) : (
        <div className="default-panel">
          <div className="section-bar">All Test Setters</div>

          <div className="default-toolbar">
            <div className="search-control">
              <Search size={15} strokeWidth={2} />
              <input
                type="text"
                placeholder="Search test setters…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="default-table-wrap">
            <table className="default-table">
              <thead>
                <tr>
                  <th className="col-sno">Sr. No.</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Institute</th>
                  <th>Subject</th>
                  <th>Employee Code</th>
                  <th>Test Setter ID</th>
                  <th>Qualification</th>
                  <th className="col-actions">Actions</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((t, i) => (
                  <tr key={t.id}>
                    <td className="col-sno">{i + 1}</td>
                    <td className="cell-name">{t.name}</td>
                    <td>{t.email}</td>
                    <td>{t.institute}</td>
                    <td>{t.subject}</td>
                    <td>{t.employeeCode}</td>
                    <td>{t.testSetterId}</td>
                    <td>{t.qualification || "—"}</td>
                    <td className="col-actions">
                      <button type="button" className="icon-button" title="Edit">
                        <Pencil size={15} strokeWidth={2} />
                      </button>
                      <button
                        type="button"
                        className="icon-button"
                        title="View"
                        onClick={() => setViewing(t)}
                      >
                        <Eye size={15} strokeWidth={2} />
                      </button>
                    </td>
                  </tr>
                ))}

                {visible.length === 0 && (
                  <tr>
                    <td colSpan={9} className="no-results">
                      No test setters match "{search}".
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="default-footer">
            <label className="entries-control">
              Show
              <select
                value={entriesPerPage}
                onChange={(e) => setEntriesPerPage(Number(e.target.value))}
              >
                {ENTRY_OPTIONS.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
              entries
            </label>

            <div className="default-footer-note">
              Showing {visible.length} of {filtered.length} test setter
              {filtered.length === 1 ? "" : "s"}
            </div>
          </div>
        </div>
      )}

      {/* Floating action button */}
      {!showForm && testSetters.length > 0 && (
        <button type="button" className="add-button-fab" onClick={() => setShowForm(true)}>
          <Plus size={18} strokeWidth={2.6} />
          <span>Add Test Setter</span>
        </button>
      )}

      {/* Confirmation card */}
      {pendingTestSetter && (
        <div className="confirm-overlay" role="dialog" aria-modal="true">
          <div className="confirm-card">
            <button
              type="button"
              className="confirm-close"
              onClick={cancelPendingTestSetter}
              aria-label="Close"
            >
              <X size={16} strokeWidth={2.2} />
            </button>

            <div className="confirm-icon">
              <Plus size={20} strokeWidth={2.4} />
            </div>

            <h3 className="confirm-title">Add this test setter?</h3>
            <p className="confirm-subtitle">
              Please confirm the details before adding them to the list.
            </p>

            <div className="confirm-details">
              <div className="confirm-row">
                <span>Name</span>
                <strong>{pendingTestSetter.fullName || "—"}</strong>
              </div>
              <div className="confirm-row">
                <span>Email</span>
                <strong>{pendingTestSetter.email || "—"}</strong>
              </div>
              <div className="confirm-row">
                <span>Institute</span>
                <strong>{pendingInstituteName}</strong>
              </div>
              <div className="confirm-row">
                <span>Subject</span>
                <strong>{pendingSubjectName}</strong>
              </div>
              <div className="confirm-row">
                <span>Employee Code</span>
                <strong>{pendingTestSetter.employee_code || "—"}</strong>
              </div>
              <div className="confirm-row">
                <span>Test Setter ID</span>
                <strong>{pendingTestSetter.testsetter_id || "—"}</strong>
              </div>
              <div className="confirm-row">
                <span>Qualification</span>
                <strong>{pendingTestSetter.qualification || "—"}</strong>
              </div>
            </div>

            <div className="confirm-actions">
              <button
                type="button"
                className="confirm-btn-secondary"
                onClick={cancelPendingTestSetter}
              >
                Cancel
              </button>
              <button
                type="button"
                className="confirm-btn-primary"
                onClick={confirmPendingTestSetter}
              >
                Yes, add test setter
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Details card */}
      {viewing && (
        <div className="confirm-overlay" role="dialog" aria-modal="true" onClick={() => setViewing(null)}>
          <div className="confirm-card" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="confirm-close"
              onClick={() => setViewing(null)}
              aria-label="Close"
            >
              <X size={16} strokeWidth={2.2} />
            </button>

            <div className="confirm-icon">
              <Eye size={20} strokeWidth={2.2} />
            </div>

            <h3 className="confirm-title">{viewing.name}</h3>
            <p className="confirm-subtitle">Test setter details</p>

            <div className="confirm-details">
              <div className="confirm-row"><span>Test Setter ID</span><strong>{viewing.testSetterId || "—"}</strong></div>
              <div className="confirm-row"><span>Email</span><strong>{viewing.email || "—"}</strong></div>
              <div className="confirm-row"><span>Institute</span><strong>{viewing.institute || "—"}</strong></div>
              <div className="confirm-row"><span>Subject</span><strong>{viewing.subject || "—"}</strong></div>
              <div className="confirm-row"><span>Employee Code</span><strong>{viewing.employeeCode || "—"}</strong></div>
              <div className="confirm-row"><span>Qualification</span><strong>{viewing.qualification || "—"}</strong></div>
            </div>

            <div className="confirm-actions">
              <button type="button" className="confirm-btn-secondary" onClick={() => setViewing(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}