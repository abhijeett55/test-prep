import {
  LayoutGrid,
  GraduationCap,
  Calendar,
  CalendarClock,
  ClipboardList,
  BarChart3,
  Mail,
  Users,
} from "lucide-react";
import type { NavItem } from "../../components/Navbar/types";

export const teacherNav: NavItem[] = [
  { label: "Dashboard", icon: LayoutGrid, path: "/dashboard/teacher" },
  {
    label: "My Classes",
    icon: GraduationCap,
    children: [
      { label: "Courses List", path: "/dashboard/teacher/my-classes/course-list"},
      { label: "Class List", path: "/dashboard/teacher/my-classes/class-list" },
      { label: "Student List", path: "/dashboard/teacher/my-classes/student-list" },
    ],
  },
  {
    label: "Tests",
    icon: ClipboardList,
    children: [
      { label: "Create Test", path: "/dashboard/teacher/tests/test-create", info: true },
      { label: "Upcoming Tests", path: "/dashboard/teacher/tests/upcoming-test" },
      { label: "Completed Tests", path: "/dashboard/teacher/tests/test-completed" },
    ],
  },
  {
    label: "Schedule Test",
    icon: CalendarClock,
    children: [
      { label: "Assign from Question Bank", path: "/dashboard/teacher/schedule-test/assign-from-question-bank", info: true },
      { label: "Scheduled Tests", path: "/dashboard/teacher/schedule-test/scheduled" },
      { label: "Set Date & Duration", path: "/dashboard/teacher/schedule-test/set-date-duration" },
    ],
  },
  {
    label: "Student Performance",
    icon: BarChart3,
    children: [
      { label: "Batch-wise Analytics", path: "/dashboard/teacher/student-performance/batch-analytics" },
      { label: "Weak Topics", path: "/dashboard/teacher/student-performance/weak-topics" },
      { label: "Attempt History", path: "/dashboard/teacher/student-performance/attempt-history" },
    ],
  },
  { label: "My Scheduled Test", icon: Calendar, path: "/dashboard/teacher/my-scheduled-tests" },
  {
    label: "Reports",
    icon: BarChart3,
    children: [
      { label: "Class Performance", path: "/dashboard/teacher/reports/class-performance" },
      { label: "Student Performance", path: "/dashboard/teacher/reports/student-performance" },
      { label: "Download Reports", path: "/dashboard/teacher/reports/download" },
    ],
  },
  { label: "Contact Support", icon: Mail, path: "/dashboard/teacher/contact-support", info: true },
  {
    label: "My Account",
    icon: Users,
    children: [
      { label: "Profile", path: "/dashboard/teacher/profile" },
      { label: "Change Password", path: "/dashboard/teacher/change-password" },
    ],
  },
];