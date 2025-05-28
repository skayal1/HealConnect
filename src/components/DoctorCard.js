import React from "react";
import { Card, Button, Badge } from "react-bootstrap";
import { FaStar, FaVideo, FaCalendarAlt } from "react-icons/fa";
import './../styles/DoctorCard.css';

const DoctorCard = () => {
  return (
    <Card className="doctor-card shadow-sm">
      <div className="position-relative">
        <Card.Img
          variant="top"
          src="https://randomuser.me/api/portraits/men/75.jpg"
          className="doctor-img"
        />
        <Badge bg="warning" className="rating-badge">
          <FaStar className="me-1" />
          4.9
        </Badge>
      </div>
      <Card.Body>
        <Card.Title className="mb-1 fw-bold">Dr. Sarah Johnson</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          Homeopathy Specialist
        </Card.Subtitle>
        <Card.Text className="text-secondary mb-3">12 years experience</Card.Text>
        <div className="d-flex justify-content-between gap-2">
          <Button variant="outline-primary" className="w-50">
            <FaCalendarAlt className="me-1" /> Book
          </Button>
          <Button variant="primary" className="w-50">
            <FaVideo className="me-1" /> Consult
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default DoctorCard;
