import Header from "../../../components/Header/Header";
import Navbar from "../../../components/Navbar/Navbar";
import ProfilePage from "../../account/ProfilePage";
import { Routes, Route, Navigate } from "react-router-dom";
import ChangePasswordPage from "../../account/ChangePasswordPage";
import Footer from "../../../components/Footer/Footer";
import { testsetterNav } from "../../../config/dashboard/testsetterNav";
import "../DashboardPage.css";


export default function TestsetterDashboardPage() {
  return (
    <div className="dashboard-page">
      <Header title="Test Setter Panel" userId="TS-1001" role="Test Setter" />

      <div className="dashboard-body">
        <Navbar items={testsetterNav} defaultActive="Dashboard" />

        <main className="dashboard-content">
          <Routes>
          <Route path="profile" element={<ProfilePage />} />
          <Route path="change-password" element={<ChangePasswordPage />} />
          <Route path="*" element={<Navigate to="/dashboard/testsetter" replace />} />
        </Routes>
        </main>
      </div>

      <Footer />
    </div>
  );
}