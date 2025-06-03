import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import './../styles/Footer.css'; // Optional: for custom styling if needed

const Footer = () => {
  return (
    <footer className="pt-5 pb-5">
      <Container>
        <Row className="mb-4">
          <Col md={4} className="mb-3">
            <h5 className="mb-3">
              <i className="bi bi-heart-fill text-primary me-2 text-light"></i>HealConnect
            </h5>
            <p className="small">
              Connecting patients with qualified healthcare professionals for virtual consultations and providing access to homeopathic medicine information.
            </p>
            <div className="d-flex gap-3 mt-3">
              <a href="#" className="text-light"><FaFacebookF /></a>
              <a href="#" className="text-light"><FaTwitter /></a>
              <a href="#" className="text-light"><FaInstagram /></a>
              <a href="#" className="text-light"><FaLinkedinIn /></a>
            </div>
          </Col>

          <Col md={2} className="mb-3">
            <h6 className="text-uppercase mb-3 text-light">Company</h6>
            <ul className="list-unstyled footer-linkes">
              <li><a href="#" className="text-light pb-5 text-decoration-none">About Us</a></li>
              <li><a href="#" className="text-light pb-5 text-decoration-none">Careers</a></li>
              <li><a href="#" className="text-light pb-5 text-decoration-none">Blog</a></li>
              <li><a href="#" className="text-light pb-5 text-decoration-none">Contact</a></li>
            </ul>
          </Col>

          <Col md={3} className="mb-3">
            <h6 className="text-uppercase mb-3 text-light">Services</h6>
            <ul className="list-unstyled footer-linkes">
              <li><a href="#" className="text-light pb-5 text-decoration-none">Find Doctors</a></li>
              <li><a href="#" className="text-light pb-5 text-decoration-none">Book Appointments</a></li>
              <li><a href="#" className="text-light pb-5 text-decoration-none">Video Consultation</a></li>
              <li><a href="#" className="text-light pb-5 text-decoration-none">Homeopathic Medicines</a></li>
            </ul>
          </Col>

          <Col md={3} className="mb-3">
            <h6 className="text-uppercase mb-3">Resources</h6>
            <ul className="list-unstyled footer-linkes">
              <li><a href="#" className="text-light pb-5 text-decoration-none">Health Articles</a></li>
              <li><a href="#" className="text-light pb-5 text-decoration-none">FAQs</a></li>
              <li><a href="#" className="text-light pb-5 text-decoration-none">Terms of Service</a></li>
              <li><a href="#" className="text-light pb-5 text-decoration-none">Privacy Policy</a></li>
            </ul>
          </Col>
        </Row>

        <hr className="border-secondary" />

        <Row className="d-flex justify-content-between align-items-center">
          <Col md={6} className="small">
            © 2025 HealConnect. All rights reserved.
          </Col>
          <Col md={6} className="text-md-end small">
            <a href="#" className="text-light text-decoration-none me-3">Terms</a>
            <a href="#" className="text-light text-decoration-none">Privacy</a>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
