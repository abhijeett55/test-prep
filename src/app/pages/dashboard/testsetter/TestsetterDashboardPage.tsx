import Header from "../../../components/Header/Header";
import Navbar from "../../../components/Navbar/Navbar";
import Footer from "../../../components/Footer/Footer";
import { testsetterNav } from "../../../config/testsetterNav";
import "../DashboardPage.css";


export default function TestsetterDashboardPage() {
  return (
    <div className="dashboard-page">
      <Header title="Test Setter Panel" />

      <div className="dashboard-body">
        <Navbar items={testsetterNav} defaultActive="Dashboard" />

        <main className="dashboard-content">
          {/* admin content */}
        </main>
      </div>

      <Footer />
    </div>
  );
}