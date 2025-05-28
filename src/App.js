import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import HomePage from "./pages/HomePage";
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import HomeopathySearch from './pages/HomeopathySearch';
import MedicineSearch from './pages/MedicineSearch';
import Ddashboard from './pages/Ddashobard';
import PrivateRoute from './components/PrivateRoute';


function App() {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<HomePage />} /> {/* Add this line */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/patient-dashboard"
            element={<PrivateRoute>
              <PatientDashboard />
            </PrivateRoute>} />
          <Route
            path="/doctor-dashboard"
            element={<PrivateRoute>
              <DoctorDashboard />
            </PrivateRoute>} />
          <Route path="/homeopathy-search" element={<HomeopathySearch />} />
          <Route path="/medicine-search" element={<MedicineSearch />} />
          <Route path="/ddashboard" element={<Ddashboard />} />
        </Routes>
      </Router>
  );
}
// ...existing code...

export default App;
