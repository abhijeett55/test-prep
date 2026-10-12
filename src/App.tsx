import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom';
import RolePage from './app/pages/login/RolePage';
import AdminLoginPage from './app/pages/login/AdminLoginPage';
import ProviderLoginPage from './app/pages/login/ProviderLoginPage';
import TestsetterLoginPage from './app/pages/login/TestsetterLoginPage';
import TeacherLoginPage from './app/pages/login/TeacherLoginPage';
import AdminDashboardPage from "./app/pages/dashboard/admin/AdminDashboardPage";
import TeacherDashboardPage from "./app/pages/dashboard/teacher/TeacherDashboardPage";
import TestsetterDashboardPage from "./app/pages/dashboard/testsetter/TestsetterDashboardPage";
import ProviderDashboardPage from "./app/pages/dashboard/provider/ProviderDashboardPage";
import ProtectedRoute from "./app/components/ProtectedRoute/ProtectedRoute";


export default function App() {
  return (
    <Routes>
      <Route path="/role" element={<RolePage />} />
      <Route path="/login/admin" element={<AdminLoginPage />} />
      <Route path="/login/provider" element={<ProviderLoginPage />} />
      <Route path="/login/testsetter" element={<TestsetterLoginPage />} />
      <Route path="/login/teacher" element={<TeacherLoginPage />} />
      <Route
        path="/dashboard/admin/*"
        element={
          <ProtectedRoute>
            <AdminDashboardPage />
          </ProtectedRoute>
        }
      />
      

      <Route
        path="/dashboard/teacher/*"
        element={
          <ProtectedRoute>
            <TeacherDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/testsetter/*"
        element={
          <ProtectedRoute>
            <TestsetterDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/provider/*"
        element={
          <ProtectedRoute>
            <ProviderDashboardPage />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/role" replace />} />
    </Routes>
  );
}