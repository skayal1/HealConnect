//import React, { useState } from "react};
import { useNavigate } from "react-router-dom";
//icons
import { RiCalendarScheduleLine } from "react-icons/ri";
import { CiVideoOn } from "react-icons/ci";
import { GiMedicines } from "react-icons/gi";
import { GoArrowRight } from "react-icons/go";
import { FaUserPlus, FaCalendarCheck, FaVideo, FaFileMedical, FaCalendarAlt, FaCapsules, FaLock, FaClock, FaUserCheck } from "react-icons/fa"; // Add at the top

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
            <button className="get-started modern-btn" onClick={() => navigate("/signup")}>Get Started <GoArrowRight /></button>
            <button className="find-doctors modern-btn-outline" onClick={() => navigate("/medicine-search")}>Find Doctors</button>
          </div>
          <div className="hero-icons">
            <span><CiVideoOn /> Video Consultations</span>
            <span><RiCalendarScheduleLine /> Easy Scheduling</span>
            <span><GiMedicines /> Medicine Database</span>
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
        <div className="features-cards-wrapper grid-features">
          {[
            [<FaVideo />, "Video Consultations", "Connect from the comfort of your home."],
            [<FaCalendarAlt />, "Easy Appointment Booking", "Book or reschedule in just a few clicks."],
            [<FaCapsules />, "Homeopathic Medicine Database", "Access information about homeopathic remedies."],
            [<FaLock />, "Secure & Private", "Your health data is encrypted and secure."],
            [<FaClock />, "24/7 Availability", "Get medical advice anytime, anywhere."],
            [<FaUserCheck />, "Verified Specialists", "Consult verified doctors & specialists only."]
          ].map(([icon, title, desc], index) => (
            <div className="feature-card" key={index}>
              <div className="feature-icon feature-icon-solid">{icon}</div>
              <div className="feature-title">{title}</div>
              <div className="feature-desc">{desc}</div>
            </div>
          ))}
        </div>
      </section>
      {/* How It Works Section */}
      <section className="how-it-works modern-section">
        <h2 className="text-center font-weight-bold"><b>How It Works</b></h2>
        <p className="text-center">Get started with HealConnect in just a few simple steps</p>
        <div className="hiw-cards-wrapper hiw-row">
          {[
            [<FaUserPlus />, "Create an Account", "Sign up as a patient or doctor."],
            [<FaCalendarCheck />, "Book an Appointment", "Browse doctors and choose a slot."],
            [<FaVideo />, "Start Video Consultation", "Talk to your doctor online."],
            [<FaFileMedical />, "Get Treatment Plan", "Receive a digital prescription."]
          ].map(([icon, title, desc], index) => (
            <div className="hiw-card" key={index}>
              <div className="hiw-icon hiw-icon-solid">{icon}</div>
              <div className="hiw-title">{title}</div>
              <div className="hiw-desc">{desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Doctors Section */}
      <section className="doctors modern-section" id="doctors">
        <h2 className="text-center font-weight-bold mb-2"><b>Meet Our Top Homeopathic Doctors</b></h2>
        <p className="text-center mb-4">Consult with experienced, verified specialists for your health needs.</p>
        <div className="doctors-grid">
          {[1, 2, 3, 4].map((_, idx) => (
            <div className="doctor-card-wrapper" key={idx}>
              <DoctorCard />
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials modern-section">
        <h2 className="text-center font-weight-bold mb-2"><b>What Our Users Say</b></h2>
        <div className="testimonials-grid">
          {[
            {
              name: "Emma Thompson",
              avatar: "https://randomuser.me/api/portraits/women/68.jpg",
              review: "The video consultation was so convenient. I got the medical advice I needed without having to travel or wait in a clinic."
            },
            {
              name: "Robert Thompson",
              avatar: "https://randomuser.me/api/portraits/men/65.jpg",
              review: "Booking appointments is super easy and the doctors are very professional. Highly recommend HealConnect!"
            },
            {
              name: "Dr. Lisa Thompson",
              avatar: "https://randomuser.me/api/portraits/women/65.jpg",
              review: "As a doctor, I find the platform secure and easy to use. Patients can reach me anytime, anywhere."
            }
          ].map((t, index) => (
            <div className="testimonial-card modern-card" key={index}>
              <img className="testimonial-avatar" src={t.avatar} alt={t.name} />
              <h4 className="testimonial-name">{t.name}</h4>
              <p className="testimonial-text">“{t.review}”</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-fullwidth">
  <div className="cta-grid">
    <div className="cta-content text-white">
      <h2>Ready to take control of your health journey?</h2>
      <p>Join thousands of satisfied users who have transformed their healthcare experience. Register today to connect with specialists, access homeopathic remedies, and manage your health effectively.</p>
      <div>
        <button className="get-started modern-btn" onClick={() => navigate("/signup")}>Get Started</button>
        <button className="contact-us cta-button" onClick={() => navigate("#contact")}>Contact Us</button>
      </div>
    </div>
    <div className="cta-image">
      <img src="https://images.pexels.com/photos/7088530/pexels-photo-7088530.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Doctor Review" />
    </div>
  </div>
</section>

      {/* Footer */}
      <Footer />
    </div>
  ); 
};

export default HomePage;