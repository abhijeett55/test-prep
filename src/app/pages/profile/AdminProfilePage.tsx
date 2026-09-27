import CommonProfileDetails from "../../components/Profile/CommonProfileDetailsProps";
import type { ProfileSection, SessionRow, ConnectedAccount } from "../../components/Profile/types";

const mockAdmin = {
  name: "Abhijeet Biswas",
  email: "abhijeetavi25@gmail.com",
  backupEmail: undefined,
  contactPhone: undefined,
  hasPassword: true,
  role: "Super Admin",
  permissions: "Full access",
};

const mockSessions: SessionRow[] = [
  {
    id: "sess-1",
    location: "India (WB)",
    device: "Chrome - Windows",
    ipAddress: "152.56.139.6",
    time: "1 minute ago",
    isCurrent: true,
  },
];

const mockGoogleAccount: ConnectedAccount = {
  provider: "google",
  name: "Abhijeet biswas",
  email: "abhijeetavi25@gmail.com",
  connected: true,
  onConnectToggle: () => {},
};

export default function AdminProfilePage() {
  // Role-specific section — swapped out per role.
  const accessSection: ProfileSection = {
    title: "Access",
    rows: [
      { key: "role", label: "Role", value: mockAdmin.role },
      { key: "permissions", label: "Permissions", value: mockAdmin.permissions },
    ],
  };

  return (
    <CommonProfileDetails
      user={mockAdmin}
      onEditUser={() => {}}
      onSetPassword={() => {}}
      onAddBackupEmail={() => {}}
      onAddContactPhone={() => {}}
      googleAccount={mockGoogleAccount}
      sessions={mockSessions}
      onSignOutOtherSessions={() => {}}
      extraSections={[accessSection]}
    />
  );
}