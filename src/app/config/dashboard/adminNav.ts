import {
  GraduationCap,
  LayoutGrid,
  UserCog,
  Users2,
  BarChart3,
  Megaphone,
  CreditCard,
  Users,
  Sparkles,
} from "lucide-react";
import type { NavItem } from "../../components/Navbar/types";

export const adminNav: NavItem[] = [
  { label: "Dashboard", icon: LayoutGrid, path: "/dashboard/admin" },
  {
    label: "User Management",
    icon: UserCog,
    children: [
      { label: "Teachers", path: "/dashboard/admin/user-management/teachers" },
      { label: "Test Setters", path: "/dashboard/admin/user-management/test-setters" },
      { label: "Students", path: "/dashboard/admin/user-management/students" },
      { label: "Role Assignment", path: "/dashboard/admin/user-management/role-assignment", info: true },
    ],
  },
  {
    label: "Student Management",
    icon: GraduationCap,
    children: [
      { label: "Enrollment", path: "/dashboard/admin/student-management/enrollment" },
      { label: "Fee Status", path: "/dashboard/admin/student-management/fee-status", info: true },
      { label: "Batch Transfers", path: "/dashboard/admin/student-management/batch-transfers" },
    ],
  },
  {
    label: "Billing & Subscription",
    icon: CreditCard,
    children: [
      { label: "Current Plan", path: "/dashboard/admin/billing/current-plan" },
      { label: "Seats & Usage", path: "/dashboard/admin/billing/seats-usage", info: true },
      { label: "Invoices", path: "/dashboard/admin/billing/invoices" },
    ],
  },
  {
    label: "Announcements",
    icon: Megaphone,
    children: [
      { label: "New Announcement", path: "/dashboard/admin/announcements/new", info: true },
      { label: "Institute-wide", path: "/dashboard/admin/announcements/institute-wide" },
      { label: "Batch-specific", path: "/dashboard/admin/announcements/batch-specific" },
    ],
  },
  {
    label: "Reports & Analytics",
    icon: BarChart3,
    children: [
      { label: "Institute-wide Performance", path: "/dashboard/admin/reports/institute-performance" },
      { label: "Batch Comparison", path: "/dashboard/admin/reports/batch-comparison" },
      { label: "Teacher Comparison", path: "/dashboard/admin/reports/teacher-comparison" },
    ],
  },
  {
    label: "Batch Management",
    icon: Users2,
    children: [
      { label: "Create Batch", path: "/dashboard/admin/batch-management/create", info: true },
      { label: "All Batches", path: "/dashboard/admin/batch-management/all" },
      { label: "Assign Teachers", path: "/dashboard/admin/batch-management/assign-teachers" },
      { label: "Map Students to Batch", path: "/dashboard/admin/batch-management/map-students" },
    ],
  },
  {
    label: "My Account",
    icon: Users,
    children: [
      { label: "Profile", path: "/dashboard/admin/profile" },
      { label: "Change Password", path: "/dashboard/admin/change-password" },
    ],
  },
  { label: "Explore Whats New", icon: Sparkles, path: "/dashboard/admin/whats-new" },
];