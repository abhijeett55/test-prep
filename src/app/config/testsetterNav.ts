import {
  LayoutGrid,
  Library,
  Upload,
  FileText,
  FileStack,
  ClipboardCheck,
  Image,
  Printer,
  Mail,
  Users,
  Sparkles,
} from "lucide-react";
import type { NavItem } from "../components/Navbar/types";

export const testsetterNav: NavItem[] = [
  { label: "Dashboard", icon: LayoutGrid },
  {
    label: "Question Bank",
    icon: Library,
    children: [
      { label: "Add Question", info: true },
      { label: "All Questions" },
      { label: "Pending Review" },
      { label: "Rejected Questions" },
      { label: "Tag Management", info: true },
      { label: "By Subject" },
      { label: "By Difficulty" },
    ],
  },
  { label: "Question Bulk Upload", icon: Upload, info: true },
  {
    label: "Question Papers",
    icon: FileText,
    children: [
      { label: "Create Paper", info: true },
      { label: "My Papers" },
      { label: "Download Paper", info: true },
    ],
  },
  {
    label: "Test Builder",
    icon: FileStack,
    children: [
      { label: "Create Test", info: true },
      { label: "My Tests" },
      { label: "Sections & Marking Scheme", info: true },
      { label: "Negative Marking Rules" },
    ],
  },
  {
    label: "Review Queue",
    icon: ClipboardCheck,
    children: [
      { label: "Pending Questions", badge: "New" },
      { label: "Pending Tests" },
      { label: "Rejected Items" },
    ],
  },
  {
    label: "Media Library",
    icon: Image,
    children: [
      { label: "Images" },
      { label: "Diagrams" },
      { label: "Formulas / LaTeX", info: true },
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
