import {
  LayoutGrid,
  GraduationCap,
  Calendar,
  ClipboardList,
  BarChart3,
  Printer,
  Mail,
  Users,
  Sparkles,
} from "lucide-react";
import type { NavItem } from "../components/Navbar/types";

export const teacherNav: NavItem[] = [
  { label: "Dashboard", icon: LayoutGrid },
  {
    label: "My Classes",
    icon: GraduationCap,
    children: [
      { label: "Class List" },
      { label: "Student List" },
      { label: "Assign Students", info: true },
    ],
  },
  {
    label: "Tests",
    icon: ClipboardList,
    children: [
      { label: "Create Test", info: true },
      { label: "Scheduled Tests" },
      { label: "Completed Tests" },
    ],
  },
  { label: "My Scheduled Test", icon: Calendar },
  {
    label: "Reports",
    icon: BarChart3,
    children: [
      { label: "Class Performance" },
      { label: "Student Performance" },
      { label: "Download Reports" },
    ],
  },
  { label: "Print Paper", icon: Printer, info: true },
  { label: "Contact Support", icon: Mail, info: true },
  {
    label: "My Account",
    icon: Users,
    children: [{ label: "Profile" }, { label: "Change Password" }],
  },
  { label: "Explore Whats New", icon: Sparkles },
];