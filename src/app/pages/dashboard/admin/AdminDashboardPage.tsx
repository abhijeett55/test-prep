import { Routes, Route, Navigate } from "react-router-dom";
import Header from "../../../components/Header/Header";
import Navbar from "../../../components/Navbar/Navbar";
import Footer from "../../../components/Footer/Footer";
import { adminNav } from "../../../config/dashboard/adminNav";
import TeachersPage from "./user-management/TeachersPage";
import StudentsPage from "./user-management/StudentsPage";
import AdminProfilePage from "../../profile/AdminProfilePage";
import "./AdminDashboardPage.css";

export default function AdminDashboardPage() {
  return (
    <div className="dashboard-page">
      <Header title="Admin Panel" />

      <div className="dashboard-body">
        <Navbar items={adminNav} defaultActive="Dashboard" />

        <main className="dashboard-content">
          <Routes>
            {/* / -> renders at /dashboard/admin itself */}
            <Route index element={<div>Admin dashboard overview — build me</div>} />

            <Route path="user-management/teachers" element={<TeachersPage />} />
            <Route path="user-management/students" element={<StudentsPage />} />
            <Route path="profile" element={<AdminProfilePage />} />
            <Route path="*" element={<Navigate to="/dashboard/admin" replace />} />
          </Routes>
        </main>
      </div>

      <Footer />
    </div>
  );
}