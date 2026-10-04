import { Routes, Route, Navigate } from "react-router-dom";
import Header from "../../../components/Header/Header";
import Navbar from "../../../components/Navbar/Navbar";
import Footer from "../../../components/Footer/Footer";
import { providerNav } from "../../../config/dashboard/providerNav";
import AllInstitutes from "./institute-management/AllInstitutes";
import OnboardInstitutes from "./institute-management/OnboardInstitutes";
import SuspendedInstitutes from "./institute-management/SuspendedInstitutes";

import "../DashboardPage.css";
import ProfilePage from "../../profile/ProfilePage";


export default function ProviderDashboardPage() {
  return (
    <div className="dashboard-page">
      <Header title="Provider Panel" userId="P-1001" role="Provider" />

      <div className="dashboard-body">
        <Navbar items={providerNav} defaultActive="Dashboard" />

        <main className="dashboard-content">
          <Routes>

            <Route index element={<div>Provider dashboard overview — build me</div>} />

            <Route path="institute-management/onboard-institutes" element={<OnboardInstitutes />} />
            <Route path="institute-management/all-institutes" element={<AllInstitutes />} />
            <Route path="institute-management/suspended-institutes" element={<SuspendedInstitutes />} />
            
            <Route path="profile" element={<ProfilePage />} />
            <Route path="*" element={<Navigate to="/dashboard/provider" replace />} />
          </Routes>
        </main>
      </div>

      <Footer />
    </div>
  );
}