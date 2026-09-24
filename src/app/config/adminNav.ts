import {
  GraduationCap, Home, LayoutGrid, CreditCard, BarChart3,
  Calendar, Ticket, Mail, DollarSign, Printer, Upload, Users, Sparkles,
} from "lucide-react";
import type { NavItem } from "../components/Navbar/types";

export const adminNav: NavItem[] = [
  { label: "Dashboard", icon: LayoutGrid },
  { label: "Admission", icon: GraduationCap },
  { label: "Home", icon: Home },
  {
    label: "Purchase Product",
    icon: CreditCard,
    children: [
      { label: "Assigned Package List", info: true },
      { label: "OMR Packages", info: true },
      { label: "Package Bulk Assign", info: true },
      { label: "Package Request Approval" },
      { label: "Package Transaction", info: true },
      { label: "Print PDF Packages", info: true },
      { label: "Product Catalog", info: true },
      { label: "Self Practice Packages", info: true },
      { label: "Test Series Packages", info: true },
      { label: "Package Utilization Report", info: true },
    ],
  },
  {
    label: "Reports",
    icon: BarChart3,
    children: [{ label: "Report Summary" }, { label: "Download Reports" }],
  },
  { label: "My Scheduled Test", icon: Calendar },
  {
    label: "Test Series",
    icon: Ticket,
    children: [
      { label: "Package Transactions", info: true },
      { label: "Packages", info: true },
      { label: "Schedule / Download Question Paper", info: true },
    ],
  },
  { label: "Contact Support", icon: Mail, info: true },
  { label: "ATM", icon: DollarSign, info: true },
  { label: "Print Paper", icon: Printer, info: true },
  { label: "Question Bulk Upload", icon: Upload, info: true },
  {
    label: "My Account",
    icon: Users,
    children: [{ label: "Profile" }, { label: "Change Password" }],
  },
  { label: "Explore Whats New", icon: Sparkles },
];