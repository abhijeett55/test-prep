import Header from "../../../components/Header/Header";
import Navbar from "../../../components/Navbar/Navbar";
import ProfilePage from "../../account/ProfilePage";
import { Routes, Route, Navigate } from "react-router-dom";
import ChangePasswordPage from "../../account/ChangePasswordPage";
import Footer from "../../../components/Footer/Footer";
import { testsetterNav } from "../../../config/dashboard/testsetterNav";
import CreateTest from "./test-builder/CreateTest";
import MyTests from "./test-builder/MyTests";
import SectionsMarkingScheme from "./test-builder/SectionsMarkingScheme";
import NegativeMarkingRules from "./test-builder/NegativeMarkingRules";
import AddQuestion from "./question-bank/AddQuestion";
import PendingReview from "./question-bank/PendingReview";
import QuestionBulkUpload from "./question-bank/QuestionBulkUpload";
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
          <Route path="test-builder/create" element={<CreateTest />} />
          <Route path="test-builder/my-tests" element={<MyTests />} />
          <Route path="question-bank/add" element={<AddQuestion />} />
          <Route path="question-bank/all" element={<QuestionBulkUpload />} />
          <Route path="question-bank/pending-review" element={<PendingReview />} />
          <Route path="test-builder/sections-marking-scheme" element={<SectionsMarkingScheme />} />
          <Route path="test-builder/negative-marking-rules" element={<NegativeMarkingRules />} />
          <Route path="change-password" element={<ChangePasswordPage />} />
          <Route path="*" element={<Navigate to="/dashboard/testsetter" replace />} />
        </Routes>
        </main>
      </div>

      <Footer />
    </div>
  );
}