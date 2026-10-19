import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../../../config/auth/AuthContext";
import Header from "../../../components/Header/Header";
import Navbar from "../../../components/Navbar/Navbar";
import Footer from "../../../components/Footer/Footer";
import { adminNav } from "../../../config/dashboard/adminNav";

// Existing Imports
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

// NEW IMPORTS FOR SUBJECTS
import SubjectsPage from "./subject-management/SubjectsPage";
import CreateSubjectPage from "./subject-management/CreateSubjectPage";
import AssignCoursesPage from "./subject-management/AssignCoursesPage";

import AllBatches from "./batch-management/AllBatches";
import CreateBatch from "./batch-management/CreateBatch";
import AssignTeachers from "./batch-management/AssignTeachers";
import MapStudents from "./batch-management/MapStudents";

import "./AdminDashboardPage.css";

export default function AdminDashboardPage() {
  const { user } = useAuth();
  
  return (
    <div className="dashboard-page">
      <Header 
        title="Admin Panel" 
        userId={user?.id || "Loading..."} 
        role="Admin" 
      />

      <div className="dashboard-body">
        <Navbar items={adminNav} defaultActive="Dashboard" />

        <main className="dashboard-content">
          <Routes>
            <Route index element={<div>Admin dashboard overview — build me</div>} />

            {/* User Management */}
            <Route path="user-management/teachers" element={<TeachersPage />} />
            <Route path="user-management/testsetters" element={<TestsetterPage />} />
            <Route path="user-management/students" element={<StudentsPage />} />
            
            {/* Student Management */}
            <Route path="student-management/enrollment" element={<Enrollment />} />
            <Route path="student-management/fee-status" element={<FeeStatus />} />
            <Route path="student-management/batch-transfer" element={<BatchTransfer />} />
            
            {/* Subject Management (NEW) */}
            <Route path="subjects/all" element={<SubjectsPage />} />
            <Route path="subjects/create" element={<CreateSubjectPage />} />
            <Route path="subjects/assign" element={<AssignCoursesPage />} />

            {/* Other */}
            <Route path="profile" element={<ProfilePage />} />
            <Route path="courses-management/courses" element={<CoursesPage />} />

            <Route path="batch-management/create" element={<CreateBatch />} />
            <Route path="batch-management/all" element={<AllBatches />} />
            <Route path="batch-management/assign-teachers" element={<AssignTeachers />} />
            <Route path="batch-management/map-students" element={<MapStudents />} />
            
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