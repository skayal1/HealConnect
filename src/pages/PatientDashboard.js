import React, { useEffect, useState, useRef } from 'react';
import { getAuth } from 'firebase/auth';
import { collection, query, where, getDocs, doc, getDoc, addDoc, deleteDoc, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import Navbar from '../components/Navbar';
import Footer from '../components/footer';
import '../styles/PatientDashboard.css';

// For chart and calendar
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

Chart.register(ArcElement, Tooltip, Legend);

const PatientSidebar = ({ onLogout }) => (
  <aside
    className="bg-white shadow-sm rounded h-100 p-3 d-flex flex-column align-items-start"
    style={{
      minWidth: 220,
      position: "sticky",
      top: 24,
      height: "calc(100vh - 48px)",
      overflow: "hidden",
    }}
  >
    <div className="mb-4 d-flex align-items-center gap-2 fs-5 fw-bold">
      <i className="bx bxs-heart text-primary"></i> HealConnect
    </div>
    <nav className="flex-grow-1 w-100">
      <ul className="nav flex-column w-100">
        <li className="nav-item w-100">
          <a href="#dashboard" className="nav-link d-flex align-items-center gap-2">
            <i className="bx bxs-dashboard"></i> Dashboard
          </a>
        </li>
        <li className="nav-item w-100">
          <a href="#slots" className="nav-link d-flex align-items-center gap-2">
            <i className="bx bx-calendar"></i> Doctor Slots
          </a>
        </li>
        <li className="nav-item w-100">
          <a href="#appointments" className="nav-link d-flex align-items-center gap-2">
            <i className="bx bx-list-ul"></i> Appointments
          </a>
        </li>
        <li className="nav-item w-100">
          <a href="#records" className="nav-link d-flex align-items-center gap-2">
            <i className="bx bx-file"></i> Health Records
          </a>
        </li>
      </ul>
    </nav>
    <button
      className="btn btn-outline-danger mt-auto w-100 d-flex align-items-center gap-2"
      onClick={onLogout}
    >
      <i className="bx bx-log-out"></i> Logout
    </button>
  </aside>
);

const PatientDashboard = () => {
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Chat state
  const [chatOpen, setChatOpen] = useState(false);
  const [chatDoctor, setChatDoctor] = useState(null);
  const [chatDoctorId, setChatDoctorId] = useState(null);
  const [chatAppointmentId, setChatAppointmentId] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        setUserId(user.uid);
        setUserEmail(user.email);
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserName(docSnap.data().name);
        }
      }
    };

    const fetchAppointments = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        const q = query(collection(db, 'appointments'), where('patientId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const results = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAppointments(results);
      }
    };

    const fetchAvailableSlots = async () => {
      const q = query(collection(db, 'availability'));
      const snapshot = await getDocs(q);
      const results = await Promise.all(snapshot.docs.map(async docSnap => {
        const data = docSnap.data();
        const doctorRef = doc(db, 'users', data.doctorId);
        const doctorSnap = await getDoc(doctorRef);
        return {
          id: docSnap.id,
          doctorName: doctorSnap.exists() ? doctorSnap.data().name : 'Unknown',
          ...data
        };
      }));
      setAvailableSlots(results);
    };

    fetchUserInfo();
    fetchAppointments();
    fetchAvailableSlots();
  }, []);

  // Chat: fetch messages for this appointment
  const openChat = async (doctorName, doctorId, appointmentId) => {
    setChatDoctor(doctorName);
    setChatDoctorId(doctorId);
    setChatAppointmentId(appointmentId);
    setChatOpen(true);

    // Fetch messages for this appointment
    const q = query(
      collection(db, 'appointments', appointmentId, 'messages'),
      orderBy('timestamp', 'asc')
    );
    const snapshot = await getDocs(q);
    setChatMessages(snapshot.docs.map(doc => doc.data()));
    setTimeout(() => {
      if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const sendMessage = async () => {
    if (!chatInput.trim() || !chatAppointmentId) return;
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;

    const msg = {
      from: 'patient',
      fromName: userName,
      text: chatInput,
      timestamp: serverTimestamp(),
    };
    await addDoc(collection(db, 'appointments', chatAppointmentId, 'messages'), msg);

    // Fetch updated messages
    const q = query(
      collection(db, 'appointments', chatAppointmentId, 'messages'),
      orderBy('timestamp', 'asc')
    );
    const snapshot = await getDocs(q);
    setChatMessages(snapshot.docs.map(doc => doc.data()));
    setChatInput('');
    setTimeout(() => {
      if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Poll for new messages when chat is open
  useEffect(() => {
    if (!chatOpen || !chatAppointmentId) return;
    const interval = setInterval(async () => {
      const q = query(
        collection(db, 'appointments', chatAppointmentId, 'messages'),
        orderBy('timestamp', 'asc')
      );
      const snapshot = await getDocs(q);
      setChatMessages(snapshot.docs.map(doc => doc.data()));
    }, 2000);
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [chatOpen, chatAppointmentId]);

  const handleLogout = () => {
    const auth = getAuth();
    auth.signOut().then(() => {
      window.location.href = '/login';
    }).catch((error) => {
      console.error('Logout error:', error);
    });
  };

  const bookAppointment = async (slot) => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        const q = query(
          collection(db, 'appointments'),
          where('doctorId', '==', slot.doctorId),
          where('date', '==', slot.date),
          where('time', '==', slot.time)
        );
        const existing = await getDocs(q);
        if (!existing.empty) {
          alert('This slot has already been booked.');
          return;
        }

        const confirm = window.confirm(`Book appointment with Dr. ${slot.doctorName} on ${slot.date} at ${slot.time}?`);
        if (!confirm) return;

        await addDoc(collection(db, 'appointments'), {
          doctorId: slot.doctorId,
          doctorName: slot.doctorName,
          patientId: user.uid,
          patientName: userName,
          patientEmail: user.email,
          date: slot.date,
          time: slot.time,
          status: 'booked',
          bookedAt: new Date()
        });

        alert('Appointment booked successfully!');
        window.location.reload();
      }
    } catch (error) {
      console.error('Error booking appointment:', error);
    }
  };

  const cancelAppointment = async (apptId) => {
    const confirmCancel = window.confirm('Are you sure you want to cancel this appointment?');
    if (!confirmCancel) return;

    try {
      await deleteDoc(doc(db, 'appointments', apptId));
      alert('Appointment cancelled.');
      setAppointments(prev => prev.filter(appt => appt.id !== apptId));
    } catch (error) {
      console.error('Error cancelling appointment:', error);
    }
  };

  // Dashboard stats
  const totalBooked = appointments.length;
  const totalCompleted = appointments.filter(a => a.status === 'complete').length;
  const totalUpcoming = appointments.filter(a => a.status === 'booked').length;
  const totalDoctors = [...new Set(appointments.map(a => a.doctorName))].length;

  // Pie chart data
  const pieData = {
    labels: ['Completed', 'Upcoming'],
    datasets: [
      {
        data: [totalCompleted, totalUpcoming],
        backgroundColor: ['#43cea2', '#6a82fb'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <>
      <Navbar />
      <div className="container-fluid py-4">
        <div className="row">
          {/* Sidebar */}
          <div className="col-12 col-md-3 col-lg-2 mb-4 mb-md-0">
            <PatientSidebar onLogout={handleLogout} />
          </div>
          {/* Main Content */}
          <div className="col-12 col-md-9 col-lg-10">
            {/* Welcome & Stat Cards */}
            <div className="row g-3 mb-4">
              <div className="col-12">
                <div className="bg-white rounded shadow-sm p-4 mb-2 d-flex flex-column flex-md-row align-items-center justify-content-between">
                  <div className="text-center text-md-start">
                    <h2 className="fw-bold mb-2">
                      Welcome, <span className="text-primary">{userName}</span>
                    </h2>
                    <p className="mb-0 text-muted">
                      Manage your health records, schedule appointments, and more.
                    </p>
                  </div>
                  <button
                    className="btn btn-outline-primary mt-3 mt-md-0"
                    onClick={() => alert('View Health Records')}
                  >
                    <i className="bx bx-file"></i> View Health Records
                  </button>
                </div>
              </div>
              {/* Stat Cards */}
              <div className="col-12 col-sm-6 col-lg-3">
                <div className="card shadow-sm border-0 h-100" style={{ background: "linear-gradient(90deg,#6a82fb,#fc5c7d)", color: "#fff" }}>
                  <div className="card-body d-flex flex-column align-items-start">
                    <div className="fs-2 mb-2"><i className="bx bx-calendar-check"></i></div>
                    <div className="fw-bold fs-4">{totalBooked}</div>
                    <div className="small">Total Booked</div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-6 col-lg-3">
                <div className="card shadow-sm border-0 h-100" style={{ background: "linear-gradient(90deg,#43cea2,#185a9d)", color: "#fff" }}>
                  <div className="card-body d-flex flex-column align-items-start">
                    <div className="fs-2 mb-2"><i className="bx bx-check-circle"></i></div>
                    <div className="fw-bold fs-4">{totalCompleted}</div>
                    <div className="small">Completed</div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-6 col-lg-3">
                <div className="card shadow-sm border-0 h-100" style={{ background: "linear-gradient(90deg,#f7971e,#ffd200)", color: "#fff" }}>
                  <div className="card-body d-flex flex-column align-items-start">
                    <div className="fs-2 mb-2"><i className="bx bx-time-five"></i></div>
                    <div className="fw-bold fs-4">{totalUpcoming}</div>
                    <div className="small">Upcoming</div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-6 col-lg-3">
                <div className="card shadow-sm border-0 h-100" style={{ background: "linear-gradient(90deg,#ff5858,#f09819)", color: "#fff" }}>
                  <div className="card-body d-flex flex-column align-items-start">
                    <div className="fs-2 mb-2"><i className="bx bx-user"></i></div>
                    <div className="fw-bold fs-4">{totalDoctors}</div>
                    <div className="small">Doctors Consulted</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Chart & Calendar */}
            <div className="row g-3 mb-4">
              <div className="col-12 col-lg-6">
                <div className="bg-white rounded shadow-sm p-4 h-100">
                  <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
                    <i className="bx bx-pie-chart-alt"></i> Appointment Status
                  </h5>
                  <Pie data={pieData} />
                </div>
              </div>
              <div className="col-12 col-lg-6">
                <div className="bg-white rounded shadow-sm p-4 h-100">
                  <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
                    <i className="bx bx-calendar"></i> Calendar
                  </h5>
                  <Calendar
                    value={selectedDate}
                    onChange={setSelectedDate}
                    className="w-100"
                  />
                </div>
              </div>
            </div>

            {/* Available Doctor Slots */}
            <section className="dashboard-section mb-4" id="slots">
              <h3>Available Doctor Slots</h3>
              {availableSlots.length === 0 ? (
                <div className="dashboard-empty">No available slots at the moment.</div>
              ) : (
                <div className="dashboard-table-wrapper">
                  <table className="dashboard-table">
                    <thead>
                      <tr>
                        <th>Doctor Name</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {availableSlots.map((slot, index) => (
                        <tr key={index}>
                          <td>{slot.doctorName}</td>
                          <td>{slot.date}</td>
                          <td>{slot.time}</td>
                          <td>
                            <button className="dashboard-book-btn" onClick={() => bookAppointment(slot)}>
                              Book
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            {/* Your Appointments */}
            <section className="dashboard-section mb-4" id="appointments">
              <h3>Your Appointments</h3>
              {appointments.length === 0 ? (
                <div className="dashboard-empty">No appointments booked yet.</div>
              ) : (
                <div className="dashboard-appointments-list">
                  {appointments.map((appt, index) => (
                    <div className="dashboard-appointment-card" key={index}>
                      <div>
                        <strong>Doctor:</strong> {appt.doctorName}
                      </div>
                      <div>
                        <strong>Date:</strong> {appt.date}
                      </div>
                      <div>
                        <strong>Time:</strong> {appt.time}
                      </div>
                      <div>
                        <strong>Status:</strong> <span className={`dashboard-status ${appt.status}`}>{appt.status}</span>
                      </div>
                      <div className="mt-2 d-flex gap-2 flex-wrap">
                        {appt.status !== 'complete' && (
                          <button className="dashboard-cancel-btn" onClick={() => cancelAppointment(appt.id)}>
                            Cancel Booking
                          </button>
                        )}
                        <button
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => openChat(appt.doctorName, appt.doctorId, appt.id)}
                        >
                          <i className="bx bx-chat"></i> Chat
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
      {/* Chat Modal */}
      {chatOpen && (
        <div
          className="modal fade show"
          style={{
            display: 'block',
            background: 'rgba(0,0,0,0.3)',
            zIndex: 9999
          }}
          tabIndex="-1"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content" style={{ borderRadius: 10 }}>
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="bx bx-chat"></i> Chat with Dr. {chatDoctor}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => setChatOpen(false)}
                ></button>
              </div>
              <div className="modal-body" style={{ minHeight: 200, maxHeight: 300, overflowY: 'auto' }}>
                {chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`mb-2 d-flex ${msg.from === 'patient' ? 'justify-content-end' : 'justify-content-start'}`}
                  >
                    <span
                      className={`px-3 py-2 rounded-pill ${msg.from === 'patient' ? 'bg-primary text-white' : 'bg-light text-dark'}`}
                      style={{ maxWidth: '75%', wordBreak: 'break-word' }}
                    >
                      {msg.text}
                    </span>
                  </div>
                ))}
                <div ref={chatEndRef}></div>
              </div>
              <div className="modal-footer">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Type your message..."
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && sendMessage()}
                  />
                  <button className="btn btn-primary" onClick={sendMessage}>
                    <i className="bx bx-send"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
};

export default PatientDashboard;