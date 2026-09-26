import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './app/pages/login/LoginPage';
import AdminDashboardPage from "./app/pages/dashboard/admin/AdminDashboardPage";
import TeacherDashboardPage from "./app/pages/dashboard/teacher/TeacherDashboardPage";
import TestsetterDashboardPage from "./app/pages/dashboard/testsetter/TestsetterDashboardPage";
import ProviderDashboardPage from "./app/pages/dashboard/provider/ProviderDashboardPage";
import ProtectedRoute from "./app/components/ProtectedRoute/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/dashboard/admin/*"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/teacher/*"
        element={
          <ProtectedRoute allowedRoles={["teacher"]}>
            <TeacherDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/testsetter/*"
        element={
          <ProtectedRoute allowedRoles={["testsetter"]}>
            <TestsetterDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/provider/*"
        element={
          <ProtectedRoute allowedRoles={["provider"]}>
            <ProviderDashboardPage />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}