import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './app/pages/login/LoginPage';
import AdminDashboardPage from "./app/pages/dashboard/admin/AdminDashboardPage";
import TeacherDashboardPage from "./app/pages/dashboard/teacher/TeacherDashboardPage";
import TestsetterDashboardPage from "./app/pages/dashboard/testsetter/TestsetterDashboardPage";
import ProviderDashboardPage from "./app/pages/dashboard/provider/ProviderDashboardPage";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element= {<LoginPage />} />
        <Route path="/dashboard/admin/*" element={<AdminDashboardPage />} />
        <Route path="/dashboard/teacher/*" element={<TeacherDashboardPage/>} />
        <Route path="/dashboard/testsetter/*" element={<TestsetterDashboardPage/>} />
        <Route path="/dashboard/provider/*" element={<ProviderDashboardPage/>} />
        <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    </BrowserRouter>
  )
}
