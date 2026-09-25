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
  { label: "Dashboard", icon: LayoutGrid },
    {
    label: "User Management",
    icon: UserCog,
    children: [
      { label: "Teachers" },
      { label: "Test Setters" },
      { label: "Students" },
      { label: "Role Assignment", info: true },
    ],
  },
  {
    label: "Student Management",
    icon: GraduationCap,
    children: [
      { label: "Enrollment" },
      { label: "Fee Status", info: true },
      { label: "Batch Transfers" },
    ],
  },
  {
    label: "Billing & Subscription",
    icon: CreditCard,
    children: [
      { label: "Current Plan" },
      { label: "Seats & Usage", info: true },
      { label: "Invoices" },
    ],
  },
  {
    label: "Announcements",
    icon: Megaphone,
    children: [
      { label: "New Announcement", info: true },
      { label: "Institute-wide" },
      { label: "Batch-specific" },
    ],
  },
 
  {
    label: "Reports & Analytics",
    icon: BarChart3,
    children: [
      { label: "Institute-wide Performance" },
      { label: "Batch Comparison" },
      { label: "Teacher Comparison" },
    ],
  },
 
  {
    label: "Batch Management",
    icon: Users2,
    children: [
      { label: "Create Batch", info: true },
      { label: "All Batches" },
      { label: "Assign Teachers" },
      { label: "Map Students to Batch" },
    ],
  },
  {
    label: "My Account",
    icon: Users,
    children: [{ label: "Profile" }, { label: "Change Password" }],
  },
  { label: "Explore Whats New", icon: Sparkles },
];