// src/pages/HomeopathySearch.js
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const HomeopathySearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [medicineList, setMedicineList] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);

  useEffect(() => {
    const fetchMedicines = async () => {
      const querySnapshot = await getDocs(collection(db, 'homeopathy_medicines'));
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMedicineList(data);
    };
    fetchMedicines();
  }, []);

  useEffect(() => {
    const lowerSearch = searchTerm.toLowerCase();
    const results = medicineList.filter(
      item =>
        item.medicineName.toLowerCase().includes(lowerSearch) ||
        item.symptoms.join(', ').toLowerCase().includes(lowerSearch) ||
        item.diseases.join(', ').toLowerCase().includes(lowerSearch)
    );
    setFilteredResults(results);
  }, [searchTerm, medicineList]);

  return (
    <div style={{ padding: 20 }}>
      <h2>🔍 Homeopathy Medicine Finder</h2>
      <input
        type="text"
        placeholder="Search by symptom, disease, or medicine name"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        style={{ width: '80%', padding: '10px', marginBottom: '20px' }}
      />
      {filteredResults.length === 0 && searchTerm ? (
        <p>No results found.</p>
      ) : (
        filteredResults.map((item) => (
          <div key={item.id} style={{ marginBottom: 20, padding: 10, border: '1px solid #ccc', borderRadius: 8 }}>
            <h3>{item.medicineName}</h3>
            <p><strong>Symptoms:</strong> {item.symptoms.join(', ')}</p>
            <p><strong>Diseases:</strong> {item.diseases.join(', ')}</p>
            <p><strong>Description:</strong> {item.description}</p>
            <p><strong>Dosage:</strong> {item.dosage}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default HomeopathySearch;
