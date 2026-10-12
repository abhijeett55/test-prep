import { Routes, Route, Navigate } from "react-router-dom";
import Header from "../../../components/Header/Header";
import Navbar from "../../../components/Navbar/Navbar";
import Footer from "../../../components/Footer/Footer";
import { teacherNav } from "../../../config/dashboard/teacherNav";
import CoursesPage from "./my-classes/CoursesPage";
import ClassPage from "./my-classes/ClassPage";
import StudentPage from "./my-classes/StudentPage";

import AttemptHistory from "./student-performance/AttemptHistory";
import WeakTopics from "./student-performance/WeakTopics";
import BatchAnalytics from "./student-performance/BatchAnalytics";
import ProfilePage from "../../account/ProfilePage";
import ChangePasswordPage from "../../account/ChangePasswordPage";

import ClassPerformance from "./reports/ClassPerformance";
import StudentPerformance from "./reports/StudentPerformance";
import DownloadReports from "./reports/DownloadReports";

import MyScheduledTests from "./my-scheduled-tests/MyScheduledTests";

import CompletedTests from "./tests/CompletedTests";
import CreateTests from "./tests/CreateTests";
import ScheduledTests from "./tests/ScheduledTests";

import "../DashboardPage.css";


export default function TeacherDashboardPage() {
  return (
    <div className="dashboard-page">
      <Header title="Teacher Panel" userId="T-1001" role="Teacher" />

      <div className="dashboard-body">
        <Navbar items={teacherNav} defaultActive="Dashboard" />

        <main className="dashboard-content">
          {/* admin content */}
          <Routes>
            {/* / -> renders at /dashboard/admin itself */}
            <Route index element={<div>Admin dashboard overview — build me</div>} />

            <Route path="my-classes/course-list" element={<CoursesPage />} />
            <Route path="my-classes/class-list" element={<ClassPage />} />
            <Route path="my-classes/student-list" element={<StudentPage />} />

            <Route path="student-performance/batch-analytics" element={<BatchAnalytics />} />
            <Route path="student-performance/weak-topics" element={<WeakTopics />} />
            <Route path="student-performance/attempt-history" element={<AttemptHistory />} />

            <Route path="reports/class-performance" element={<ClassPerformance />} />
            <Route path="reports/student-performance" element={<StudentPerformance />} />
            <Route path="reports/download" element={<DownloadReports />} />
            
            <Route path="my-scheduled-tests" element={<MyScheduledTests />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="change-password" element={<ChangePasswordPage />} />

            <Route path="tests/test-create" element={<CreateTests />} />
            <Route path="tests/test-completed" element={<CompletedTests />} />
            <Route path="tests/test-scheduled" element={<ScheduledTests />} />
            
            <Route path="*" element={<Navigate to="/dashboard/teacher" replace />} />
          </Routes>
        </main>
      </div>

      <Footer />
    </div>
  );
}