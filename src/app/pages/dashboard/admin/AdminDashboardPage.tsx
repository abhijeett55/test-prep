import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../../../config/auth/AuthContext";
import Header from "../../../components/Header/Header";
import Navbar from "../../../components/Navbar/Navbar";
import Footer from "../../../components/Footer/Footer";
import { adminNav } from "../../../config/dashboard/adminNav";

// User Management
import TeachersPage from "./user-management/TeachersPage";
import StudentsPage from "./user-management/StudentsPage";
import TestsetterPage from "./user-management/TestsetterPage";
import AssignTeachersToStudentsPage from "./user-management/AssignTeachersToStudentsPage";

// Student Management
import Enrollment from "./student-management/Enrollment";
import FeeStatus from "./student-management/FeeStatus";
import BatchTransfer from "./student-management/BatchTransfer";

// Subjects
import SubjectsPage from "./subject-management/SubjectsPage";
import CreateSubjectPage from "./subject-management/CreateSubjectPage";
import AssignCoursesPage from "./subject-management/AssignCoursesPage";
import AssignTeachersToSubjectPage from "./subject-management/AssignTeachersToSubjectPage";
import AssignSubjectsToStudentsPage from "./subject-management/AssignSubjectsToStudentsPage";

// Batches
import AllBatches from "./batch-management/AllBatches";
import CreateBatch from "./batch-management/CreateBatch";
import AssignTeachers from "./batch-management/AssignTeachers";
import MapStudents from "./batch-management/MapStudents";

// Courses & Institute
import CoursesPage from "./courses-management/CoursesPage";
import AssignTeachersToCoursesPage from "./courses-management/AssignTeachersToCoursesPage"; // Make sure this file exists!
import InstituteProfilePage from "./institute-settings/InstituteProfilePage";

// Performance
import InstitutePerformancePage from "./report-management/InstitutePerformancePage";
import BatchComparisonPage from "./report-management/BatchComparisonPage";
import TeacherComparisonPage from "./report-management/TeacherComparisonPage";
import CoursePerformancePage from "./report-management/CoursePerformancePage";

// Announcements
import NewAnnouncement from "./announcements/NewAnnouncement";
import InstituteWide from "./announcements/InstituteWide";
import BatchSpecific from "./announcements/BatchSpecific";

// Account
import ProfilePage from "../../account/ProfilePage";
import ChangePasswordPage from "../../account/ChangePasswordPage";
import AdminOverviewPage from "./AdminOverviewPage";

import "./AdminDashboardPage.css";

export default function AdminDashboardPage() {
  const { user } = useAuth();
  
  return (
    <div className="dashboard-page">
      <Header 
        title="Admin Panel" 
        userId={user?.full_name || user?.id || "Admin"}
        role="Admin" 
      />

      <div className="dashboard-body">
        <Navbar items={adminNav} defaultActive="Dashboard" />

        <main className="dashboard-content">
          <Routes>
            <Route index element={<AdminOverviewPage />} />

            {/* User Management */}
            <Route path="user-management/teachers" element={<TeachersPage />} />
            <Route path="user-management/testsetters" element={<TestsetterPage />} />
            <Route path="user-management/students" element={<StudentsPage />} />
            <Route path="user-management/assign-teachers-students" element={<AssignTeachersToStudentsPage />} />
            
            {/* Student Management */}
            <Route path="student-management/enrollment" element={<Enrollment />} />
            <Route path="student-management/fee-status" element={<FeeStatus />} />
            <Route path="student-management/batch-transfer" element={<BatchTransfer />} />
            
            {/* Subjects */}
            <Route path="subjects/all" element={<SubjectsPage />} />
            <Route path="subjects/create" element={<CreateSubjectPage />} />
            <Route path="subjects/assign" element={<AssignCoursesPage />} />
            <Route path="subjects/assign-students-subjects" element={<AssignSubjectsToStudentsPage />} />
            <Route path="subjects/assign-teachers-subjects" element={<AssignTeachersToSubjectPage />} />

            {/* Courses */}
            <Route path="courses-management/courses" element={<CoursesPage />} />
            <Route path="courses-management/assign-teachers-courses" element={<AssignTeachersToCoursesPage />} />

            {/* Batch Management */}
            <Route path="batch-management/create" element={<CreateBatch />} />
            <Route path="batch-management/all" element={<AllBatches />} />
            <Route path="batch-management/assign-teachers-batch" element={<AssignTeachers />} />
            <Route path="batch-management/assign-students-batch" element={<MapStudents />} />
            
            {/* Reports */}
            <Route path="reports/institute-performance" element={<InstitutePerformancePage />} />
            <Route path="reports/batch-comparison" element={<BatchComparisonPage />} />
            <Route path="reports/teacher-comparison" element={<TeacherComparisonPage />} />
            <Route path="reports/course-performance" element={<CoursePerformancePage />} />

            {/* Announcements */}
            <Route path="announcements/new" element={<NewAnnouncement />} />
            <Route path="announcements/institute-wide" element={<InstituteWide />} />
            <Route path="announcements/batch-specific" element={<BatchSpecific />} />

            {/* Institute Settings & Account */}
            <Route path="institute-settings/profile" element={<InstituteProfilePage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="change-password" element={<ChangePasswordPage />} />
            
            <Route path="*" element={<Navigate to="/dashboard/admin" replace />} />
          </Routes>
        </main>
      </div>

      <Footer />
    </div>
  );
}