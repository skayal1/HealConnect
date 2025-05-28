//import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CiVideoOn } from "react-icons/ci";

import DoctorCard from "../components/DoctorCard"; // Importing the DoctorCard component
import "./../styles/HomePage.css";
// Importing styles for the HomePage component  
import Navbar from "../components/Navbar"; // Importing the Navbar component

//import footer from "../components/footer"; // Importing the Footer component
import Footer from "../components/footer";
// Importing the Navbar component for navigation    
// This component serves as the main landing page for the HealConnect application

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="homepage modern-homepage">
      {/* React UI Navbar */}
     <Navbar/>

      {/* Hero Section */}
      <section className="hero modern-hero">
        <div className="hero-text">
          <h1 className="text-dark Health">
            Your Health, Our Priority <span>Anytime, Anywhere</span>
          </h1>
          <p className="text-secondary" style={{ padding: "0rem 5.5rem 0rem 0rem" }}>
            Connect with verified doctors via video consultation, book appointments,
            and access a comprehensive homeopathic medicine database all in one place.
          </p>
          <div className="hero-buttons">
            <button className="get-started modern-btn" onClick={() => navigate("/signup")}>Get Started</button>
            <button className="find-doctors modern-btn-outline" onClick={() => navigate("/homeopathy-search")}>Find Doctors</button>
          </div>
          <div className="hero-icons">
            <span><i className="bx bx-capsule bx-sm text-primary"></i> Video Consultations</span>
            <span><i className="bx bx-capsule bx-sm text-primary"></i> Easy Scheduling</span>
            <span><i className="bx bx-capsule bx-sm text-primary"></i> Medicine Database</span>
          </div>
        </div>
        <div className="hero-image">
          <img src="https://images.pexels.com/photos/7579831/pexels-photo-7579831.jpeg" alt="Doctor Consultation" />
        </div>
      </section>

      {/* Features */}
      <section className="features modern-section" id="features">
        <h2 className="text-center font-weight-bold"><b>Comprehensive Healthcare Features</b></h2>
        <p className="text-center">Our platform offers a range of features designed to make healthcare accessible, convenient, and effective.</p>
        <div className="container">
          <div className="row">
            {[
              ["CiVideoOn", "Video Consultations", "Connect from the comfort of your home."],
              ["bx-calendar", "Easy Appointment Booking", "Book or reschedule in just a few clicks."],
              ["bx-capsule", "Homeopathic Medicine Database", "Access information about homeopathic remedies."],
              ["bx-lock", "Secure & Private", "Your health data is encrypted and secure."],
              ["bx-time-five", "24/7 Availability", "Get medical advice anytime, anywhere."],
              ["bx-user-check", "Verified Specialists", "Consult verified professionals only."]
            ].map(([icon, title, desc], index) => (
              <div className="col-md-4 col-sm-6 mb-4 d-flex align-items-stretch" key={index}>
                <div className="card h-100 text-center shadow-sm">
                  <div className="card-body">
                    <div className="feature-icon mb-3">
                      <i className={`bx ${icon} bx-lg`} style={{ color: "#007bff" }}></i>
                    </div>
                    <h5 className="card-title">{title}</h5>
                    <p className="card-text">{desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* How It Works Section */}
      <section className="how-it-works modern-section">
        <h2>How It Works</h2>
        <p>Get started with HealConnect in just a few simple steps</p>
        <div className="steps">
          {[
            ["🧑‍⚕️", "Create an Account", "Sign up as a patient or doctor."],
            ["📆", "Book an Appointment", "Browse doctors and choose a slot."],
            ["🎥", "Start Video Consultation", "Talk to your doctor online."],
            ["📄", "Get Treatment Plan", "Receive a digital prescription."]
          ].map(([icon, title, desc], index) => (
            <div className="step-card modern-card" key={index}>
              <div className="step-icon">{icon}</div>
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Doctors Section */}
      {/* Doctors Section */}
      <section className="doctors modern-section" id="doctors">
        <div className="container-fluid mt-4">
          <div className="row">
            {[1, 2, 3, 4].map((_, idx) => (
              <div className="col-12 col-sm-6 col-lg-3 mb-4 d-flex align-items-stretch" key={idx}>
                <DoctorCard />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials modern-section">
        <h2>What Our Users Say</h2>
        <div className="testimonial-list">
          {["Emma", "Robert", "Dr. Lisa"].map((name, index) => (
            <div className="testimonial-card modern-card" key={index}>
              <h4>{name} Thompson</h4>
              <p>
                “The video consultation was so convenient. I got the medical advice I needed without having to travel or wait in a clinic.”
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta modern-section">
        <div className="cta-content">
          <h2>Ready to take control of your health journey?</h2>
          <p>Join thousands of satisfied users who have transformed their healthcare experience.</p>
          <div>
            <button className="get-started modern-btn" onClick={() => navigate("/signup")}>Get Started</button>
            <button className="contact-us modern-btn-outline" onClick={() => navigate("#contact")}>Contact Us</button>
          </div>
        </div>
        <div className="cta-image">
          <img src="https://i.ibb.co/xMZQjcq/doctor-xray.png" alt="Doctor Review" />
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;