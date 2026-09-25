import {
  LayoutGrid,
  Building2,
  UsersRound,
  ShieldCheck,
  BarChart3,
  SlidersHorizontal,
  ScrollText,
  Plug,
  LifeBuoy,
  Users,
  Sparkles,
} from "lucide-react";
import type { NavItem } from "../../components/Navbar/types";

export const providerNav: NavItem[] = [
  { label: "Dashboard", icon: LayoutGrid, info: true },

  {
    label: "Institute Management",
    icon: Building2,
    children: [
      { label: "Onboard Institute", info: true },
      { label: "All Institutes" },
      { label: "Suspended Institutes" },
      { label: "Pending Admin Approvals", badge: "New" },
    ],
  },

  {
    label: "Global User Management",
    icon: UsersRound,
    children: [
      { label: "Search Users" },
      { label: "All Institutes' Users" },
      { label: "Impersonate for Support", info: true },
    ],
  },

  {
    label: "Content Governance",
    icon: ShieldCheck,
    children: [
      { label: "Pending Question Banks", badge: "New" },
      { label: "Approved Content" },
      { label: "Quality / Plagiarism Checks", info: true },
    ],
  },

  {
    label: "Analytics & Reports",
    icon: BarChart3,
    children: [
      { label: "Platform Usage" },
      { label: "Revenue", info: true },
      { label: "Churn" },
    ],
  },

  {
    label: "System Configuration",
    icon: SlidersHorizontal,
    children: [
      { label: "Global Settings" },
      { label: "Feature Flags", info: true },
      { label: "Exam Pattern Templates" },
    ],
  },

  { label: "Audit Logs", icon: ScrollText, info: true },

  {
    label: "API / Integrations",
    icon: Plug,
    children: [
      { label: "Payment Gateways" },
      { label: "SMS / Email Providers" },
      { label: "API Keys", info: true },
    ],
  },

  { label: "Support Tickets", icon: LifeBuoy, badge: "New" },

  {
    label: "My Account",
    icon: Users,
    children: [{ label: "Profile" }, { label: "Change Password" }],
  },

  { label: "Explore Whats New", icon: Sparkles },
];