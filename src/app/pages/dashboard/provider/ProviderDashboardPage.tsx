import { Routes, Route, Navigate } from "react-router-dom";
import Header from "../../../components/Header/Header";
import Navbar from "../../../components/Navbar/Navbar";
import Footer from "../../../components/Footer/Footer";
import { providerNav } from "../../../config/dashboard/providerNav";
import AllInstitutes from "./institute-management/AllInstitutes";
import ProfilePage from "../../account/ProfilePage";
import ChangePasswordPage from "../../account/ChangePasswordPage";
import SuspendedInstitutes from "./institute-management/SuspendedInstitutes";
import ProviderOverviewPage from "./ProviderOverviewPage";
import "../OverviewPage.css";
import "../DashboardPage.css";


export default function ProviderDashboardPage() {
  return (
    <div className="dashboard-page">
      <Header title="Provider Panel" userId="P-1001" role="Provider" />

      <div className="dashboard-body">
        <Navbar items={providerNav} defaultActive="Dashboard" />

        <main className="dashboard-content">
          <Routes>

            <Route index element={<ProviderOverviewPage />} />
            <Route path="institute-management/all-institutes" element={<AllInstitutes />} />
            <Route path="institute-management/suspended-institutes" element={<SuspendedInstitutes />} />
            <Route path="*" element={<Navigate to="/dashboard/provider" replace />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="change-password" element={<ChangePasswordPage />} />
          </Routes>
        </main>
      </div>

      <Footer />
    </div>
  );
}