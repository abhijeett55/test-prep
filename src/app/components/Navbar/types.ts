import type { LucideIcon } from "lucide-react";

export type NavChild = {
  label: string;
  badge?: string;
  info?: boolean;
};

export type NavItem = {
  label: string;
  icon: LucideIcon;
  badge?: string;
  info?: boolean;
  children?: NavChild[];
};