import { NavLink, Outlet, useNavigate } from "react-router-dom";

import { useAuth } from "../hooks/useAuth.js";

const navigationItems = [
  {
    label: "Dashboard",
    to: "/dashboard",
    end: true,
  },
  {
    label: "Rooms",
    to: "/dashboard/rooms",
  },
  {
    label: "Guests",
    to: "/dashboard/guests",
  },
  {
    label: "Stays",
    to: "/dashboard/stays",
  },
  {
  label: "Guest Stays",
  to: "/dashboard/guest-stays",
  },
  {
    label: "Finance",
    to: "/dashboard/finance",
  },
  {
    label: "History",
    to: "/dashboard/history",
  },
];

function DashboardLayout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <div className="dashboard-shell">
      <aside className="dashboard-sidebar">
        <div className="dashboard-brand">
          <span className="dashboard-brand-mark">H</span>
          <div>
            <p className="dashboard-brand-name">HelloStay</p>
            <p className="dashboard-brand-subtitle">Hotel Management</p>
          </div>
        </div>

        <nav className="dashboard-nav" aria-label="Dashboard navigation">
          {navigationItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                isActive
                  ? "dashboard-nav-link dashboard-nav-link-active"
                  : "dashboard-nav-link"
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="dashboard-sidebar-footer">
          <p className="dashboard-user-label">Signed in as</p>
          <p className="dashboard-user-name">
            {user?.username || "HelloStay User"}
          </p>

          <button
            type="button"
            className="dashboard-logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </aside>

      <div className="dashboard-main-area">
        <header className="dashboard-topbar">
          <div>
            <p className="dashboard-topbar-label">Offline Desktop App</p>
            <h1 className="dashboard-topbar-title">Dashboard</h1>
          </div>

          <p className="dashboard-topbar-status">Local system ready</p>
        </header>

        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;