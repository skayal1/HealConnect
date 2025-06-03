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
          src="https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
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
          <Button className="doc-button">
            <FaCalendarAlt className="me-1" /> Book
          </Button>
          <Button className="doc-button">
            <FaVideo className="me-1" /> Consult
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default DoctorCard;
