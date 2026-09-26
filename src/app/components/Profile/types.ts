export type ProfileRowAction = {
  label: string;
  onClick: () => void;
};

export type ProfileRow = {
  key: string;
  label: string;
  value?: string;
  action?: ProfileRowAction;
};

export type ProfileSection = {
  title: string;
  badge?: string;
  editable?: boolean;
  onEdit?: () => void;
  rows: ProfileRow[];
};

export type SessionRow = {
  id: string;
  location: string;
  device: string;
  ipAddress: string;
  time: string;
  isCurrent?: boolean;
};

export type ConnectedAccount = {
  provider: "google";
  name: string;
  email: string;
  avatarUrl?: string;
  connected: boolean;
  onConnectToggle: () => void;
};