import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/footer';
import '../styles/Login.css'; // Make sure to create this CSS file for styling

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const { role } = userDoc.data();
        if (role === 'patient') {
          navigate('/patient-dashboard');
        } else if (role === 'doctor') {
          navigate('/doctor-dashboard');
        } else {
          setErrorMsg('Role not assigned');
        }
      } else {
        setErrorMsg('User data not found');
      }
    } catch (error) {
      setErrorMsg(error.message);
    }
    setLoading(false);
  };

  return (
    <>
    <Navbar />
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <div className="login-logo">💜 HealConnect</div>
        <h2>Welcome Back</h2>
        <p className="login-subtitle">Sign in to your account</p>
        {errorMsg && <div className="login-error">{errorMsg}</div>}
        <input
          type="email"
          placeholder="Email"
          className="login-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required />
        <input
          type="password"
          placeholder="Password"
          className="login-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required />
        <button className="login-btn" type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
        <div className="login-links">
          <span>
            Don't have an account? <Link to="/signup">Sign up</Link>
          </span>
        </div>
      </form>
    </div>
    <Footer /></>
  );
}

export default Login;