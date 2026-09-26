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
import type { NavItem } from "../../components/Navbar/types";

export const testsetterNav: NavItem[] = [
  { label: "Dashboard", icon: LayoutGrid, path: "/dashboard/testsetter" },
  {
    label: "Question Bank",
    icon: Library,
    children: [
      { label: "Add Question", path: "/dashboard/testsetter/question-bank/add", info: true },
      { label: "All Questions", path: "/dashboard/testsetter/question-bank/all" },
      { label: "Pending Review", path: "/dashboard/testsetter/question-bank/pending-review" },
      { label: "Rejected Questions", path: "/dashboard/testsetter/question-bank/rejected" },
      { label: "Tag Management", path: "/dashboard/testsetter/question-bank/tag-management", info: true },
      { label: "By Subject", path: "/dashboard/testsetter/question-bank/by-subject" },
      { label: "By Difficulty", path: "/dashboard/testsetter/question-bank/by-difficulty" },
    ],
  },
  { label: "Question Bulk Upload", icon: Upload, path: "/dashboard/testsetter/question-bulk-upload", info: true },
  {
    label: "Question Papers",
    icon: FileText,
    children: [
      { label: "Create Paper", path: "/dashboard/testsetter/question-papers/create", info: true },
      { label: "My Papers", path: "/dashboard/testsetter/question-papers/my-papers" },
      { label: "Download Paper", path: "/dashboard/testsetter/question-papers/download", info: true },
    ],
  },
  {
    label: "Test Builder",
    icon: FileStack,
    children: [
      { label: "Create Test", path: "/dashboard/testsetter/test-builder/create", info: true },
      { label: "My Tests", path: "/dashboard/testsetter/test-builder/my-tests" },
      { label: "Sections & Marking Scheme", path: "/dashboard/testsetter/test-builder/sections-marking-scheme", info: true },
      { label: "Negative Marking Rules", path: "/dashboard/testsetter/test-builder/negative-marking-rules" },
    ],
  },
  {
    label: "Review Queue",
    icon: ClipboardCheck,
    children: [
      { label: "Pending Questions", path: "/dashboard/testsetter/review-queue/pending-questions", badge: "New" },
      { label: "Pending Tests", path: "/dashboard/testsetter/review-queue/pending-tests" },
      { label: "Rejected Items", path: "/dashboard/testsetter/review-queue/rejected-items" },
    ],
  },
  {
    label: "Media Library",
    icon: Image,
    children: [
      { label: "Images", path: "/dashboard/testsetter/media-library/images" },
      { label: "Diagrams", path: "/dashboard/testsetter/media-library/diagrams" },
      { label: "Formulas / LaTeX", path: "/dashboard/testsetter/media-library/formulas-latex", info: true },
    ],
  },
  { label: "Print Paper", icon: Printer, path: "/dashboard/testsetter/print-paper", info: true },
  { label: "Contact Support", icon: Mail, path: "/dashboard/testsetter/contact-support", info: true },
  {
    label: "My Account",
    icon: Users,
    children: [
      { label: "Profile", path: "/dashboard/testsetter/profile" },
      { label: "Change Password", path: "/dashboard/testsetter/change-password" },
    ],
  },
  { label: "Explore Whats New", icon: Sparkles, path: "/dashboard/testsetter/whats-new" },
];