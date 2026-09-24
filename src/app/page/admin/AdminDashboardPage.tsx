import Header from "../../components/Header/Header";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { adminNav } from "../../config/adminNav";
import "./AdminDashboardPage.css";


export default function AdminDashboardPage() {
  return (
    <div className="dashboard-page">
      <Header title="Admin Panel" />

      <div className="dashboard-body">
        <Navbar items={adminNav} defaultActive="Dashboard" />

        <main className="dashboard-content">
          {/* admin content */}
        </main>
      </div>

      <Footer />
    </div>
  );
}