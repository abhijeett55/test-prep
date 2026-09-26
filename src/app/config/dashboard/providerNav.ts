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
  { label: "Dashboard", icon: LayoutGrid, path: "/dashboard/provider", info: true },

  {
    label: "Institute Management",
    icon: Building2,
    children: [
      { label: "Onboard Institute", path: "/dashboard/provider/institute-management/onboard", info: true },
      { label: "All Institutes", path: "/dashboard/provider/institute-management/all" },
      { label: "Suspended Institutes", path: "/dashboard/provider/institute-management/suspended" },
      { label: "Pending Admin Approvals", path: "/dashboard/provider/institute-management/pending-admin-approvals", badge: "New" },
    ],
  },

  {
    label: "Global User Management",
    icon: UsersRound,
    children: [
      { label: "Search Users", path: "/dashboard/provider/global-user-management/search" },
      { label: "All Institutes' Users", path: "/dashboard/provider/global-user-management/all-institutes-users" },
      { label: "Impersonate for Support", path: "/dashboard/provider/global-user-management/impersonate", info: true },
    ],
  },

  {
    label: "Content Governance",
    icon: ShieldCheck,
    children: [
      { label: "Pending Question Banks", path: "/dashboard/provider/content-governance/pending-question-banks", badge: "New" },
      { label: "Approved Content", path: "/dashboard/provider/content-governance/approved-content" },
      { label: "Quality / Plagiarism Checks", path: "/dashboard/provider/content-governance/quality-checks", info: true },
    ],
  },

  {
    label: "Analytics & Reports",
    icon: BarChart3,
    children: [
      { label: "Platform Usage", path: "/dashboard/provider/analytics/platform-usage" },
      { label: "Revenue", path: "/dashboard/provider/analytics/revenue", info: true },
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
    label: "API / Integrations",
    icon: Plug,
    children: [
      { label: "Payment Gateways", path: "/dashboard/provider/integrations/payment-gateways" },
      { label: "SMS / Email Providers", path: "/dashboard/provider/integrations/sms-email-providers" },
      { label: "API Keys", path: "/dashboard/provider/integrations/api-keys", info: true },
    ],
  },

  { label: "Support Tickets", icon: LifeBuoy, path: "/dashboard/provider/support-tickets", badge: "New" },

  {
    label: "My Account",
    icon: Users,
    children: [
      { label: "Profile", path: "/dashboard/provider/profile" },
      { label: "Change Password", path: "/dashboard/provider/change-password" },
    ],
  },

  { label: "Explore Whats New", icon: Sparkles, path: "/dashboard/provider/whats-new" },
];