import { Routes, Route, Navigate } from "react-router-dom";
import Header from "../../../components/Header/Header";
import Navbar from "../../../components/Navbar/Navbar";
import Footer from "../../../components/Footer/Footer";
import { adminNav } from "../../../config/dashboard/adminNav";
import TeachersPage from "./user-management/TeachersPage";
import StudentsPage from "./user-management/StudentsPage";
import TestsetterPage from "./user-management/TestsetterPage";
import CoursesPage from "./courses-management/CoursesPage";
import InstituteProfilePage from "./institute-settings/InstituteProfilePage";

import Enrollment from "./student-management/Enrollment";
import FeeStatus from "./student-management/FeeStatus";
import BatchTransfer from "./student-management/BatchTransfer";
import ProfilePage from "../../account/ProfilePage";
import ChangePasswordPage from "../../account/ChangePasswordPage";
import "./AdminDashboardPage.css";

export default function AdminDashboardPage() {
  return (
    <div className="dashboard-page">
      <Header title="Admin Panel" userId="A-1001" role="Admin" />

      <div className="dashboard-body">
        <Navbar items={adminNav} defaultActive="Dashboard" />

        <main className="dashboard-content">
          <Routes>
            <Route index element={<div>Admin dashboard overview — build me</div>} />

            <Route path="user-management/teachers" element={<TeachersPage />} />
            <Route path="user-management/testsetters" element={<TestsetterPage />} />
            <Route path="user-management/students" element={<StudentsPage />} />
            <Route path="student-management/enrollment" element={<Enrollment />} />
            <Route path="student-management/fee-status" element={<FeeStatus />} />
            <Route path="student-management/batch-transfer" element={<BatchTransfer />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="courses-management/courses" element={<CoursesPage />} />
            <Route path="change-password" element={<ChangePasswordPage />} />
            <Route path="institute-settings/profile" element={<InstituteProfilePage />} />
            <Route path="*" element={<Navigate to="/dashboard/admin" replace />} />
          </Routes>
        </main>
      </div>

      <Footer />
    </div>
  );
}