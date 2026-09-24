import Header from "../../../components/Header/Header";
import Navbar from "../../../components/Navbar/Navbar";
import Footer from "../../../components/Footer/Footer";
import { providerNav } from "../../../config/providerNav";
import "../DashboardPage.css";


export default function ProviderDashboardPage() {
  return (
    <div className="dashboard-page">
      <Header title="Provider Panel" />

      <div className="dashboard-body">
        <Navbar items={providerNav} defaultActive="Dashboard" />

        <main className="dashboard-content">
          {/* admin content */}
        </main>
      </div>

      <Footer />
    </div>
  );
}