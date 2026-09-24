import Header from "../../../components/Header/Header";
import Navbar from "../../../components/Navbar/Navbar";
import Footer from "../../../components/Footer/Footer";
import { teacherNav } from "../../../config/teacherNav";
import "../DashboardPage.css";


export default function TeacherDashboardPage() {
  return (
    <div className="dashboard-page">
      <Header title="Teacher Panel" />

      <div className="dashboard-body">
        <Navbar items={teacherNav} defaultActive="Dashboard" />

        <main className="dashboard-content">
          {/* admin content */}
        </main>
      </div>

      <Footer />
    </div>
  );
}