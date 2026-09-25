import { useNavigate } from "react-router-dom";
import Header from "../../../components/Header/Header";
import Navbar from "../../../components/Navbar/Navbar";
import Footer from "../../../components/Footer/Footer";
import { adminNav } from "../../../config/dashboard/adminNav";
import "../DashboardPage.css";


// export default function AdminDashboardPage() {
//   return (
//     <div className="dashboard-page">
//       <Header title="Admin Panel" />

//       <div className="dashboard-body">
//         <Navbar items={adminNav} defaultActive="Dashboard" />

//         <main className="dashboard-content">
//           {/* admin content */}
//         </main>
//       </div>

//       <Footer />
//     </div>
//   );
// }

const ROUTES: Record<string, string> = {
  Teachers: "/dashboard/admin/user-management/teachers",
  "Test Setters": "/dashboard/admin/user-management/test-setters",
  Students: "/dashboard/admin/user-management/students",
};

export default function AdminDashboardPage() {
  const navigate = useNavigate();

  const handleNavigate = (label: string) => {
    const path = ROUTES[label];
    if (path) navigate(path);
  };

  return (
    <div className="dashboard-page">
      <Header title="Admin Panel" />

      <div className="dashboard-body">
        <Navbar items={adminNav} defaultActive="Dashboard" onNavigate={handleNavigate} />

        <main className="dashboard-content">
          {/* admin content */}
        </main>
      </div>

      <Footer />
    </div>
  );
}