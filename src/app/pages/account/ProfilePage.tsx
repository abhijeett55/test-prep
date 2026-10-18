import { useEffect, useState } from "react";
import { useAuth } from "../../config/auth/AuthContext";
import { ROLE_API_SEGMENT, type Role } from "../../api/auth/roleRouting";
import { client, errorMessage } from "../../api/client";
import "./ProfilePage.css";

type Field = { key: string; label: string };

const PROFILE_FIELDS: Record<Role, Field[]> = {
  admin: [
    { key: "admin_id",       label: "Admin ID" },
    { key: "institute_name", label: "Institute Name" },
    { key: "institute_id",   label: "Institute ID" },
  ],
  institute: [
    { key: "institute_id",   label: "Institute ID" },
    { key: "institute_name", label: "Institute Name" },
    { key: "code",           label: "Code" },
    { key: "email",          label: "Email" },
    { key: "phone",          label: "Phone" },
    { key: "address",        label: "Address" },
    { key: "status",         label: "Status" },
  ],
  teacher: [
    { key: "teacher_id",    label: "Teacher ID" },
    { key: "name",          label: "Full Name" },
    { key: "email",         label: "Email" },
    { key: "phone",         label: "Phone" },
    { key: "institute",     label: "Institute" },
    { key: "subject",       label: "Subjects" },
    { key: "employee_code", label: "Employee Code" },
  ],
  provider: [
    { key: "provider_id",   label: "Provider ID" },
    { key: "full_name",     label: "Full Name" },
    { key: "email",         label: "Email" },
    { key: "phone",         label: "Phone" },
    { key: "employee_code", label: "Employee Code" },
  ],
  testsetter: [
    { key: "testsetter_id", label: "Test Setter ID" },
    { key: "name",          label: "Full Name" },
    { key: "email",         label: "Email" },
    { key: "phone",         label: "Phone" },
    { key: "institute",     label: "Institute" },
    { key: "employee_code", label: "Employee Code" },
  ],
};

const ROLE_TITLE: Record<Role, string> = {
  admin:      "Admin Profile",
  institute:  "Institute Profile",
  teacher:    "Teacher Profile",
  provider:   "Provider Profile",
  testsetter: "Test Setter Profile",
};

export default function ProfilePage() {
  const { user } = useAuth();
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setData(null);
    setErr(null);

    const segment = ROLE_API_SEGMENT[user.role];

    // baseURL already carries /api/v1 — do NOT add it here.
    client
      .get(`/${segment}/me`)
      .then((r) => setData(r.data))
      .catch((e) => setErr(errorMessage(e)));
  }, [user]);

  if (!user) return null;

  const fields = PROFILE_FIELDS[user.role];

  return (
    <div className="profile-page">
      <header className="profile-head">
        <h1>{ROLE_TITLE[user.role]}</h1>
        <p>Your account information as registered on the platform.</p>
      </header>

      {err && <p className="profile-error">{err}</p>}
      {!data && !err && <p className="profile-loading">Loading…</p>}

      {data && (
        <dl className="profile-grid">
          {fields.map(({ key, label }) => {
            const raw = data[key];
            const value =
              raw === null || raw === undefined || raw === ""
                ? "—"
                : String(raw);
            return (
              <div key={key} className="profile-row">
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            );
          })}
        </dl>
      )}
    </div>
  );
}