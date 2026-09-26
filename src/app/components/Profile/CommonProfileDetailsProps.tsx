import Profile from "./Profile";
import GoogleAccountSection from "./GoogleAccountSection";
import Sessions from "./Sessions";
import type { ProfileSection, SessionRow, ConnectedAccount } from "./types";
import "./Profile.css";

export type CommonProfileDetailsProps = {
  user: {
    name: string;
    email: string;
    backupEmail?: string;
    contactPhone?: string;
    hasPassword: boolean;
  };
  onEditUser: () => void;
  onSetPassword: () => void;
  onAddBackupEmail: () => void;
  onAddContactPhone: () => void;
  googleAccount: ConnectedAccount;
  sessions: SessionRow[];
  onSignOutOtherSessions: () => void;
  /** Extra role-specific sections rendered right after "Personal details".
   *  e.g. Teacher passes an "Employment" section, Student passes an "Enrollment" section. */
  extraSections?: ProfileSection[];
};

// The single shared component. Admin/Teacher/Student profile pages all
// render this unchanged, and pass in whatever role-specific extra
// sections they need via `extraSections`.
export default function CommonProfileDetails({
  user,
  onEditUser,
  onSetPassword,
  onAddBackupEmail,
  onAddContactPhone,
  googleAccount,
  sessions,
  onSignOutOtherSessions,
  extraSections = [],
}: CommonProfileDetailsProps) {
  const personalDetailsSection: ProfileSection = {
    title: "Personal details",
    badge: "Global setting",
    editable: true,
    onEdit: onEditUser,
    rows: [
      { key: "name", label: "Name", value: user.name },
      {
        key: "password",
        label: "Password",
        action: { label: "Set password", onClick: onSetPassword },
      },
      { key: "email", label: "Email", value: user.email },
      {
        key: "backupEmail",
        label: "Backup email",
        value: user.backupEmail,
        action: user.backupEmail
          ? undefined
          : { label: "Add backup email", onClick: onAddBackupEmail },
      },
      {
        key: "contactPhone",
        label: "Contact phone",
        value: user.contactPhone,
        action: user.contactPhone
          ? undefined
          : { label: "Add contact phone number", onClick: onAddContactPhone },
      },
    ],
  };

  return (
    <div className="profile-page">
      <div className="profile-breadcrumb">Settings</div>
      <h1 className="profile-heading">Personal details</h1>

      <Profile section={{ ...personalDetailsSection, title: "User" }} />

      {extraSections.map((section) => (
        <Profile key={section.title} section={section} />
      ))}

      <GoogleAccountSection account={googleAccount} />
      <Sessions sessions={sessions} onSignOutOthers={onSignOutOtherSessions} />
    </div>
  );
}