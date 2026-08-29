import { Route, Routes } from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout.jsx";
import DashboardHome from "../pages/DashboardHome.jsx";
import FinancePage from "../pages/FinancePage.jsx";
import GuestsPage from "../pages/GuestsPage.jsx";
import HistoryPage from "../pages/HistoryPage.jsx";
import LoginPage from "../pages/LoginPage.jsx";
import NotFoundPage from "../pages/NotFoundPage.jsx";
import RegisterPage from "../pages/RegisterPage.jsx";
import RoomsPage from "../pages/RoomsPage.jsx";
import StartPage from "../pages/StartPage.jsx";
import StaysPage from "../pages/StaysPage.jsx";
import GuestStayPage from "../pages/guestStaysPage.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<StartPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardHome />} />
        <Route path="rooms" element={<RoomsPage />} />
        <Route path="guests" element={<GuestsPage />} />
        <Route path="stays" element={<StaysPage />} />
        <Route path="guest-stays" element={<GuestStayPage />} />
        <Route path="finance" element={<FinancePage />} />
        <Route path="history" element={<HistoryPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRoutes;