import {
  LayoutGrid,
  Package,
  CreditCard,
  Users,
  BarChart3,
  Mail,
  Sparkles,
} from "lucide-react";
import type { NavItem } from "../components/Navbar/types";

export const providerNav: NavItem[] = [
  { label: "Dashboard", icon: LayoutGrid },
  {
    label: "My Packages",
    icon: Package,
    children: [
      { label: "Create Package", info: true },
      { label: "Published Packages" },
      { label: "Draft Packages" },
      { label: "Package Requests" },
    ],
  },
  {
    label: "Sales",
    icon: CreditCard,
    children: [
      { label: "Transactions", info: true },
      { label: "Payouts", info: true },
    ],
  },
  { label: "Students", icon: Users },
  {
    label: "Reports",
    icon: BarChart3,
    children: [{ label: "Sales Report" }, { label: "Download Reports" }],
  },
  { label: "Contact Support", icon: Mail, info: true },
  {
    label: "My Account",
    icon: Users,
    children: [{ label: "Profile" }, { label: "Change Password" }],
  },
  { label: "Explore Whats New", icon: Sparkles },
];