import React, { useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import Navbar from '../components/Navbar';
import { Container, Row, Col, Card, Button, InputGroup, FormControl, Spinner, Alert } from 'react-bootstrap';
import { FaSearch, FaCapsules, FaRobot, FaShoppingCart } from 'react-icons/fa';
import {  BiSearch,BiGitBranch  } from "react-icons/bi";

const MedicineSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [aiResults, setAiResults] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    setSearched(true);
    setResults([]);
    setAiResults([]);
    try {
      const q = collection(db, 'homeo_medicines');
      const querySnapshot = await getDocs(q);
      const fetchedResults = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.symptoms && data.symptoms.includes(searchTerm.toLowerCase())) {
          fetchedResults.push({ id: doc.id, ...data });
        }
      });
      setResults(fetchedResults);
    } catch (error) {
      console.error('Error searching:', error);
    }
    setLoading(false);
  };

  const handleAISearch = async () => {
    if (!searchTerm.trim()) {
      alert('Please type any symptom or medicine name');
      return;
    }
    setAiLoading(true);
    setSearched(true);
    setAiResults([]);
    setResults([]);
    try {
      const q = collection(db, 'homeo_medicines');
      const querySnapshot = await getDocs(q);
      const fetchedResults = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const term = searchTerm.toLowerCase();
        const found =
          (data.medicineName && data.medicineName.toLowerCase().includes(term)) ||
          (data.short_name && data.short_name.toLowerCase().includes(term)) ||
          (data.long_name && data.long_name.toLowerCase().includes(term)) ||
          (data.description && data.description.toLowerCase().includes(term)) ||
          (data.dose && data.dose.toLowerCase().includes(term)) ||
          (data.category && data.category.toLowerCase().includes(term)) ||
          (Array.isArray(data.symptoms) && data.symptoms.some(s => s.toLowerCase().includes(term)));
        if (found) {
          fetchedResults.push({ id: doc.id, ...data });
        }
      });
      setAiResults(fetchedResults);
    } catch (error) {
      console.error('AI search error:', error);
    }
    setAiLoading(false);
  };

  return (
    <>
      <Navbar />
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col xs={12} md={10} lg={8}>
            <Card className="shadow-sm border-0 mb-4">
              <Card.Body>
                <h2 className="mb-4 text-center fw-bold d-flex justify-content-center align-items-center gap-2">
                  Search Homeopathic Medicines by Symptom
                </h2>
                <InputGroup className="mb-3">
                  <FormControl
                    placeholder="e.g. fever, headache, cough"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSearch()}
                    className="fs-5"
                  />
                  <Button variant="primary" onClick={handleSearch}>
                    {loading ? <Spinner animation="border" size="sm" /> : <><BiSearch className="me-1" />Search</>}
                  </Button>
                  <Button variant="outline-success" onClick={handleAISearch} className="ms-2">
                    {aiLoading ? <Spinner animation="border" size="sm" /> : <><BiGitBranch className="me-1" />AI Search</>}
                  </Button>
                </InputGroup>
                {searched && !loading && !aiLoading && results.length === 0 && aiResults.length === 0 && (
                  <Alert variant="warning" className="text-center">
                    No medicines found for <b>{searchTerm}</b>.
                  </Alert>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row className="g-4">
          {[...results, ...aiResults].map((med, idx) => (
            <Col xs={12} md={6} lg={4} key={med.id + (med.medicineName || idx)}>
              <Card className="h-100 shadow-sm border-0">
                <Card.Body>
                  <div className="d-flex align-items-center mb-2">
                    <FaCapsules className="fs-3 me-2 text-success" />
                    <Card.Title className="mb-0 d-flex align-items-center gap-2">
                      {med.medicineName}
                      {aiResults.includes(med) && (
                        <span className="badge bg-info d-flex align-items-center gap-1">
                          <FaRobot /> AI
                        </span>
                      )}
                    </Card.Title>
                  </div>
                  <Card.Text>
                    <div><strong>Short Name:</strong> {med.short_name}</div>
                    <div><strong>Long Name:</strong> {med.long_name}</div>
                    <div><strong>Symptoms:</strong> {Array.isArray(med.symptoms) ? med.symptoms.join(', ') : ''}</div>
                    <div><strong>Description:</strong> {med.description}</div>
                    <div><strong>Dose:</strong> {med.dose}</div>
                    <div><strong>Category:</strong> {med.category}</div>
                  </Card.Text>
                </Card.Body>
                <Card.Footer className="bg-white border-0 text-end">
                  <a
                    className="btn btn-outline-success d-flex align-items-center justify-content-center gap-2"
                    href={`https://www.google.com/search?tbm=shop&q=${encodeURIComponent(med.medicineName)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaShoppingCart /> Buy Now
                  </a>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
};

export default MedicineSearch;