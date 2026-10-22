import {
  LayoutGrid,
  Building2,
  UsersRound,
  BarChart3,
  SlidersHorizontal,
  ScrollText,
  Users,
} from "lucide-react";
import type { NavItem } from "../../components/Navbar/types";

export const providerNav: NavItem[] = [
  { label: "Dashboard", icon: LayoutGrid, path: "/dashboard/provider", info: true },

  {
    label: "Institute Management",
    icon: Building2,
    children: [
      { label: "Onboard Institute", path: "/dashboard/provider/institute-management/onboard-institutes" },
      { label: "All Institutes", path: "/dashboard/provider/institute-management/all-institutes" },
      { label: "Suspended Institutes", path: "/dashboard/provider/institute-management/suspended-institutes" },
    ],
  },

  {
    label: "Global User Management",
    icon: UsersRound,
    children: [
      { label: "Search Users", path: "/dashboard/provider/institute-management/search" },
      { label: "All Institutes' Users", path: "/dashboard/provider/institute-management/all-institutes-users" },
    ],
  },

  {
    label: "Analytics & Reports",
    icon: BarChart3,
    children: [
      { label: "Platform Usage", path: "/dashboard/provider/analytics/platform-usage" },
      { label: "Revenue", path: "/dashboard/provider/analytics/revenue"},
      { label: "Churn", path: "/dashboard/provider/analytics/churn" },
    ],
  },

  {
    label: "System Configuration",
    icon: SlidersHorizontal,
    children: [
      { label: "Global Settings", path: "/dashboard/provider/system-configuration/global-settings" },
      { label: "Feature Flags", path: "/dashboard/provider/system-configuration/feature-flags", info: true },
      { label: "Exam Pattern Templates", path: "/dashboard/provider/system-configuration/exam-pattern-templates" },
    ],
  },

  { label: "Audit Logs", icon: ScrollText, path: "/dashboard/provider/audit-logs", info: true },

  {
    label: "My Account",
    icon: Users,
    children: [
      { label: "Profile", path: "/dashboard/provider/profile" },
      { label: "Change Password", path: "/dashboard/provider/change-password" },
    ],
  },
];