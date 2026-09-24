import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './app/page/login/LoginPage';
import AdminDashboardPage from "./app/page/admin/AdminDashboardPage";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element= {<LoginPage />} />
        <Route path="/admin/*" element={<AdminDashboardPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    </BrowserRouter>
  )
}
