import React from "react";
import { useNavigate } from "react-router-dom";

const sidebarLinks = [
  { label: "Dashboard", icon: "bx bxs-dashboard", href: "/doctor-dashboard" },
  { label: "Create Slot", icon: "bx bx-calendar-plus", href: "#create-slot" },
  { label: "Appointments", icon: "bx bx-list-ul", href: "#appointments" },
  { label: "Profile", icon: "bx bx-user", href: "/doctor-profile" },
];

const DoctorSidebar = ({ onLogout }) => {
  const navigate = useNavigate();
  return (
    <aside
      className="bg-white shadow-sm rounded h-100 p-3 d-flex flex-column align-items-start"
      style={{
        minWidth: 220,
        position: "sticky",
        top: 24,
        height: "calc(100vh - 48px)",
        overflow: "hidden",
      }}
    >
      <div className="mb-4 d-flex align-items-center gap-2 fs-5 fw-bold">
        <i className="bx bxs-heart text-primary"></i> HealConnect
      </div>
      <nav className="flex-grow-1 w-100">
        <ul className="nav flex-column w-100">
          {sidebarLinks.map((link) => (
            <li className="nav-item w-100" key={link.label}>
              <a
                href={link.href}
                className="nav-link d-flex align-items-center gap-2"
                onClick={(e) => {
                  if (link.href.startsWith("/")) {
                    e.preventDefault();
                    navigate(link.href);
                  }
                }}
              >
                <i className={link.icon}></i>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <button
        className="btn btn-outline-danger mt-auto w-100 d-flex align-items-center gap-2"
        onClick={onLogout}
      >
        <i className="bx bx-log-out"></i> Logout
      </button>
    </aside>
  );
};

export default DoctorSidebar;