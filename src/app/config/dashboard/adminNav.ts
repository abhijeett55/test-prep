import {
  GraduationCap,
  LayoutGrid,
  UserCog,
  Users2,
  BarChart3,
  Megaphone,
  Users,
  BookOpen,
  Library,
  Building2,
} from "lucide-react";
import type { NavItem } from "../../components/Navbar/types";

export const adminNav: NavItem[] = [
  { label: "Dashboard", icon: LayoutGrid, path: "/dashboard/admin" },

  {
    label: "User Management",
    icon: UserCog,
    children: [
      { label: "Teachers", path: "/dashboard/admin/user-management/teachers" },
      { label: "Test Setters", path: "/dashboard/admin/user-management/testsetters" },
      { label: "Students", path: "/dashboard/admin/user-management/students" },
    ],
  },

  {
    label: "Student Management",
    icon: GraduationCap,
    children: [
      { label: "Enrollment", path: "/dashboard/admin/student-management/enrollment" },
      { label: "Fee Status", path: "/dashboard/admin/student-management/fee-status" },
      { label: "Batch Transfers", path: "/dashboard/admin/student-management/batch-transfer" },
    ],
  },

  {
    label: "Courses",
    icon: BookOpen,
    children: [
      { label: "All Courses", path: "/dashboard/admin/courses-management/courses" }
    ],
  },

  {
    label: "Subjects",
    icon: Library,
    children: [
      { label: "All Subjects", path: "/dashboard/admin/subjects/all" },
      { label: "Create Subject", path: "/dashboard/admin/subjects/create" },
      { label: "Assign to Courses", path: "/dashboard/admin/subjects/assign" },
    ],
  },

  {
    label: "Batch Management",
    icon: Users2,
    children: [
      { label: "Create Batch", path: "/dashboard/admin/batch-management/create" },
      { label: "All Batches", path: "/dashboard/admin/batch-management/all" },
      { label: "Assign Teachers", path: "/dashboard/admin/batch-management/assign-teachers" },
      { label: "Map Students to Batch", path: "/dashboard/admin/batch-management/map-students" },
    ],
  },

  {
    label: "Announcements",
    icon: Megaphone,
    children: [
      { label: "New Announcement", path: "/dashboard/admin/announcements/new" },
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
      { label: "Course Performance", path: "/dashboard/admin/reports/course-performance" },
    ],
  },
  {
    label: "Institute Settings",
    icon: Building2,
    children: [
      { label: "Institute Profile", path: "/dashboard/admin/institute-settings/profile" },
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
];