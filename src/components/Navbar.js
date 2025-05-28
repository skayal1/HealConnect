import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/HomePage.css";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Doctors", href: "/doctors" },
  { label: "Services", href: "/services" },
  { label: "Medicines", href: "/medicinesearch" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const Navbar = () => {
  const navigate = useNavigate();
  const [navOpen, setNavOpen] = useState(false);

  const handleNavToggle = () => setNavOpen((open) => !open);

  const handleNavLinkClick = (e, href) => {
    e.preventDefault();
    setNavOpen(false);
    navigate(href);
  };

  return (
    <header>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm fixed-top">
        <div className="container-fluid">
          <div
            className="navbar-brand d-flex align-items-center gap-2"
            style={{ cursor: "pointer" }}
            onClick={() => { setNavOpen(false); navigate("/"); }}
          >
            <i className='bx bxs-heart text-primary fs-4'></i>
            <span className="fw-bold fs-5">HealConnect</span>
          </div>
          {/* Hamburger */}
          <button
            className="navbar-toggler border-0"
            type="button"
            aria-label={navOpen ? "Close navigation" : "Open navigation"}
            onClick={handleNavToggle}
          >
            <i className={`bx ${navOpen ? "bx-x" : "bx-menu"} fs-2`}></i>
          </button>
          {/* Desktop Nav */}
          <div className="collapse navbar-collapse d-none d-lg-flex justify-content-between">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 gap-2">
              {NAV_LINKS.map(link => (
                <li className="nav-item" key={link.label}>
                  <a
                    href={link.href}
                    className="nav-link"
                    onClick={e => handleNavLinkClick(e, link.href)}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="d-flex gap-2">
              <button className="btn btn-outline-primary" onClick={() => { setNavOpen(false); navigate("/login"); }}>
                <i className='bx bx-log-in'></i> Log in
              </button>
              <button className="btn btn-primary" onClick={() => { setNavOpen(false); navigate("/signup"); }}>
                <i className='bx bx-user-plus'></i> Sign up
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Side Menu Overlay */}
      <div
        className={`offcanvas-backdrop fade${navOpen ? " show" : ""}`}
        style={{
          display: navOpen ? "block" : "none",
          zIndex: 1040,
        }}
        onClick={() => setNavOpen(false)}
      />

      {/* Mobile Side Menu */}
      <div
        className={`offcanvas offcanvas-start${navOpen ? " show" : ""}`}
        tabIndex="-1"
        style={{
          visibility: navOpen ? "visible" : "hidden",
          width: 260,
          zIndex: 1045,
          transition: "transform 0.3s ease-in-out",
          transform: navOpen ? "translateX(0)" : "translateX(-100%)",
          background: "#fff",
          boxShadow: "2px 0 8px rgba(0,0,0,0.1)",
          height: "93vh",
          position: "fixed",
          top: 0,
          left: 0,
          padding: "2rem 1.5rem",
          display: "flex",
          flexDirection: "column"
        }}
      >
        <div className="mb-4 d-flex align-items-center gap-2 fw-bold fs-5">
          <i className='bx bxs-heart text-primary'></i> HealConnect
        </div>
        <ul className="navbar-nav flex-column mb-4">
          {NAV_LINKS.map(link => (
            <li className="nav-item" key={link.label}>
              <a
                href={link.href}
                className="nav-link"
                style={{ fontSize: "1.1rem", margin: "0.5rem 0", padding: "0px !important" }}
                onClick={e => handleNavLinkClick(e, link.href)}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="mt-auto d-flex flex-column gap-2">
          <button className="btn btn-outline-primary" onClick={() => { setNavOpen(false); navigate("/login"); }}>
            <i className='bx bx-log-in'></i> Log in
          </button>
          <button className="btn btn-primary" onClick={() => { setNavOpen(false); navigate("/signup"); }}>
            <i className='bx bx-user-plus'></i> Sign up
          </button>
        </div>
      </div>
      {/* Spacer for fixed navbar */}
      <div style={{ height: "56px" }}></div>
    </header>
  );
};

export default Navbar;