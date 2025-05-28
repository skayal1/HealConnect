// DoctorDashboardrs.js
import React from 'react';
import '../styles/Ddashboard.css';
import { Container, Row, Col, Card, Button, Nav, Tab, ListGroup, Form } from 'react-bootstrap';
import { FaCalendarAlt, FaUserMd, FaVideo, FaUsers } from 'react-icons/fa';

const DoctorDashboard = () => {
  return (
    <Container fluid className="doctor-dashboard">
      <Row>
        {/* Sidebar */}
        <Col md={2} className="sidebar p-3">
          <h4 className="logo">Doct.</h4>
          <Nav defaultActiveKey="/overview" className="flex-column">
            <Nav.Link href="/overview">Overview</Nav.Link>
            <Nav.Link href="/appointment">Appointment</Nav.Link>
            <Nav.Link href="/patients">My Patient</Nav.Link>
            <Nav.Link href="/schedule">Schedule Timings</Nav.Link>
            <Nav.Link href="/payments">Payments</Nav.Link>
            <Nav.Link href="/messages">Messages</Nav.Link>
            <Nav.Link href="/blog">Blog</Nav.Link>
            <Nav.Link href="/settings">Settings</Nav.Link>
          </Nav>
        </Col>

        {/* Main Content */}
        <Col md={10} className="main-content p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h5>Welcome, Dr. Stephen</h5>
              <p className="text-muted">Have a nice day at great work</p>
            </div>
            <div className="profile-info d-none d-md-flex align-items-center">
              <img src="https://i.pravatar.cc/40" alt="avatar" className="rounded-circle me-2" />
              <div>
                <strong>Stephen Conley</strong><br />
                <small>Cardiologist</small>
              </div>
            </div>
          </div>

          {/* Stats */}
          <Row className="g-3">
            <Col md={3} sm={6} xs={12}>
              <Card className="stat-card purple">
                <Card.Body>
                  <FaCalendarAlt size={24} />
                  <h4>24.4k</h4>
                  <p>Appointments</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} sm={6} xs={12}>
              <Card className="stat-card red">
                <Card.Body>
                  <FaUsers size={24} />
                  <h4>166.3k</h4>
                  <p>Total Patients</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} sm={6} xs={12}>
              <Card className="stat-card yellow">
                <Card.Body>
                  <FaUserMd size={24} />
                  <h4>53.5k</h4>
                  <p>Clinic Consulting</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} sm={6} xs={12}>
              <Card className="stat-card blue">
                <Card.Body>
                  <FaVideo size={24} />
                  <h4>28.0k</h4>
                  <p>Video Consulting</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Appointment Requests */}
          <Row className="mt-4">
            <Col md={6}>
              <h6>Appointment Requests</h6>
              <ListGroup>
                {['Savannah Nguyen', 'Jacob Jones', 'Cody Fisher'].map((name, index) => (
                  <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                    <div>
                      <strong>{name}</strong>
                      <p className="text-muted mb-0">45 Male, 12 April 9:30</p>
                    </div>
                    <span className={`badge bg-${index % 2 === 0 ? 'danger' : 'primary'}`}>{index % 2 === 0 ? 'Declined' : 'Confirmed'}</span>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Col>

            {/* Gender & Calendar */}
            <Col md={6}>
              <Row>
                <Col xs={12} className="mb-4">
                  <h6>Patients (2020)</h6>
                  <div className="d-flex justify-content-between">
                    <div>
                      <p>New Patients: 24.4k</p>
                      <p>Old Patients: 166.3k</p>
                    </div>
                    <div>
                      <h6>Gender</h6>
                      <div className="gender-chart">
                        <span>Male: 45%</span><br />
                        <span>Female: 30%</span><br />
                        <span>Child: 25%</span>
                      </div>
                    </div>
                  </div>
                </Col>

                <Col xs={12}>
                  <h6>Today Appointments</h6>
                  <ListGroup>
                    {['Jhon Smith', 'Frank Murray', 'Robert Fox'].map((name, i) => (
                      <ListGroup.Item key={i} className="d-flex justify-content-between align-items-center">
                        <span>{name}</span>
                        <span className="text-muted">Clinic Consulting</span>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default DoctorDashboard;
