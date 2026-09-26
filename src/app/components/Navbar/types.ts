import type { LucideIcon } from "lucide-react";

export type NavChild = {
  label: string;
  path: string;
  badge?: string;
  info?: boolean;
};

export type NavItem = {
  label: string;
  icon: LucideIcon;
  path?: string;
  badge?: string;
  info?: boolean;
  children?: NavChild[];
};

export type NavbarProps = {
  items: NavItem[];
  defaultActive?: string;
  onNavigate?: (label: string) => void;
};