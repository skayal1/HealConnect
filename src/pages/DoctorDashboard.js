import React, { useEffect, useState, useRef } from 'react';
import { getAuth } from 'firebase/auth';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  addDoc,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebaseConfig';
import emailjs from 'emailjs-com';
import '../styles/DoctorDashboard.css';
import DoctorSidebar from "../components/DoctorSidebar";
import Footer from '../components/footer';

const DoctorDashboard = () => {
  const [doctorName, setDoctorName] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [jitsiRoom, setJitsiRoom] = useState(null);
  const [activeAppointmentId, setActiveAppointmentId] = useState(null);
  const [createdSlots, setCreatedSlots] = useState([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatPatient, setChatPatient] = useState(null);
  const [chatAppointmentId, setChatAppointmentId] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef(null);
  const jitsiApiRef = useRef(null);

  // Dashboard stats
  const totalBooked = appointments.length;
  const totalCompleted = appointments.filter(a => a.status === 'complete').length;
  const totalSlots = createdSlots.length;
  const totalPatients = [
    ...new Set(
      appointments
        .filter(a => a.status === 'complete' && a.patientEmail)
        .map(a => a.patientEmail)
    ),
  ].length;

  useEffect(() => {
    const fetchDoctorInfo = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        setDoctorId(user.uid);
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setDoctorName(docSnap.data().name);
        }
      }
    };

    const fetchAppointments = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        const q = query(collection(db, 'appointments'), where('doctorId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const results = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAppointments(results);
      }
    };

    const fetchCreatedSlots = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        const q = query(collection(db, 'availability'), where('doctorId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const results = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCreatedSlots(results);
      }
    };

    fetchDoctorInfo();
    fetchAppointments();
    fetchCreatedSlots();
  }, []);

  // Chat: fetch messages for this appointment
  const openChat = async (patientName, appointmentId) => {
    setChatPatient(patientName);
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
      from: 'doctor',
      fromName: doctorName,
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

  // Generate a unique Jitsi room name
  const generateJitsiRoomName = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const random = (len) => Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    return `healconnect-${random(10)}`;
  };

  const initiateVideoCall = async (appointment) => {
    try {
      const roomName = generateJitsiRoomName();
      const meetLink = `https://meet.jit.si/${roomName}`;
      const apptRef = doc(db, 'appointments', appointment.id);

      await updateDoc(apptRef, {
        videoLink: meetLink,
        status: 'in-progress',
        videoStartedAt: serverTimestamp()
      });

      const templateParams = {
        to_email: appointment.patientEmail,
        to_name: appointment.patientName,
        doctor_name: doctorName,
        meet_link: meetLink,
        date: appointment.date,
        time: appointment.time
      };

      emailjs.send('service_x99abn6', 'template_5ce5sfj', templateParams, 'Vwdsjxq_-vr9dKcbU')
        .then(() => {
          console.log('Email sent successfully');
        })
        .catch((error) => {
          console.error('Email sending error:', error);
        });

      setJitsiRoom(roomName);
      setActiveAppointmentId(appointment.id);
    } catch (err) {
      console.error('Error initiating video call:', err);
    }
  };

  useEffect(() => {
    if (jitsiRoom) {
      const domain = "meet.jit.si";
      const options = {
        roomName: jitsiRoom,
        parentNode: document.getElementById("jitsi-container"),
        width: "100%",
        height: 600,
      };
      // eslint-disable-next-line no-undef
      jitsiApiRef.current = new window.JitsiMeetExternalAPI(domain, options);
      jitsiApiRef.current.addEventListener('readyToClose', async () => {
        if (activeAppointmentId) {
          const apptRef = doc(db, 'appointments', activeAppointmentId);
          await updateDoc(apptRef, { status: 'complete' });
          setAppointments((prev) =>
            prev.map((a) =>
              a.id === activeAppointmentId ? { ...a, status: 'complete' } : a
            )
          );
        }
        setJitsiRoom(null);
        setActiveAppointmentId(null);
      });
    }
    return () => {
      if (jitsiApiRef.current) {
        jitsiApiRef.current.dispose();
        jitsiApiRef.current = null;
      }
    };
  }, [jitsiRoom, activeAppointmentId]);

  const handleCreateSlot = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!selectedDate || !selectedTime || !user) return;

    try {
      await addDoc(collection(db, 'availability'), {
        doctorId: user.uid,
        doctorName,
        date: selectedDate,
        time: selectedTime,
        available: true,
        createdAt: serverTimestamp(),
      });
      alert('Availability slot created successfully');
      // Fetch slots again
      const q = query(collection(db, 'availability'), where('doctorId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      const results = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCreatedSlots(results);
    } catch (error) {
      console.error('Error creating slot:', error);
    }
  };

  return (
    <>
      <div className="container-fluid py-4">
        <div className="row">
          {/* Sidebar */}
          <div className="col-12 col-md-3 col-lg-2 mb-4 mb-md-0">
            <DoctorSidebar onLogout={handleLogout} />
          </div>
          {/* Main Content */}
          <div className="col-12 col-md-9 col-lg-10">
            {/* Jitsi Modal */}
            {jitsiRoom && (
              <div className="modal show fade d-block" tabIndex="-1" style={{
                background: 'rgba(0,0,0,0.7)', zIndex: 9999
              }}>
                <div className="modal-dialog modal-xl modal-dialog-centered">
                  <div className="modal-content" style={{ borderRadius: 8 }}>
                    <div className="modal-header">
                      <h5 className="modal-title">Video Conference</h5>
                      <button
                        type="button"
                        className="btn-close"
                        aria-label="Close"
                        onClick={async () => {
                          if (activeAppointmentId) {
                            const apptRef = doc(db, 'appointments', activeAppointmentId);
                            await updateDoc(apptRef, { status: 'complete' });
                            setAppointments((prev) => prev.map((a) => a.id === activeAppointmentId ? { ...a, status: 'complete' } : a
                            )
                            );
                          }
                          if (jitsiApiRef.current) {
                            jitsiApiRef.current.dispose();
                            jitsiApiRef.current = null;
                          }
                          setJitsiRoom(null);
                          setActiveAppointmentId(null);
                        }}
                      ></button>
                    </div>
                    <div className="modal-body p-0">
                      <div id="jitsi-container" style={{ width: '100%', height: 600 }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Welcome Section with Logout Button on Right */}
            <div className="bg-white rounded shadow-sm p-4 mb-4">
              <div className="d-flex flex-column flex-md-row align-items-center justify-content-between">
                <div className="text-center text-md-start">
                  <h2 className="fw-bold mb-2">
                    Welcome, <span className="text-primary">Dr. {doctorName}</span>
                  </h2>
                  <p className="mb-0 text-muted">
                    Manage your appointments and availability slots below.
                  </p>
                </div>
                <button
                  className="btn btn-outline-danger d-flex align-items-center gap-2 mt-3 mt-md-0"
                  onClick={handleLogout}
                >
                  <i className="bx bx-log-out"></i> Logout
                </button>
              </div>
            </div>

            {/* Dashboard Stats Cards */}
            <div className="row g-3 mb-4">
              <div className="col-12 col-sm-6 col-lg-3">
                <div className="card shadow-sm border-0 h-100" style={{ background: "linear-gradient(90deg,#6a82fb,#fc5c7d)", color: "#fff" }}>
                  <div className="card-body d-flex flex-column align-items-start">
                    <div className="fs-2 mb-2"><i className="bx bx-calendar-check"></i></div>
                    <div className="fw-bold fs-4">{totalBooked}</div>
                    <div className="small">Total Booked Appointments</div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-6 col-lg-3">
                <div className="card shadow-sm border-0 h-100" style={{ background: "linear-gradient(90deg,#43cea2,#185a9d)", color: "#fff" }}>
                  <div className="card-body d-flex flex-column align-items-start">
                    <div className="fs-2 mb-2"><i className="bx bx-check-circle"></i></div>
                    <div className="fw-bold fs-4">{totalCompleted}</div>
                    <div className="small">Total Completed Appointments</div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-6 col-lg-3">
                <div className="card shadow-sm border-0 h-100" style={{ background: "linear-gradient(90deg,#f7971e,#ffd200)", color: "#fff" }}>
                  <div className="card-body d-flex flex-column align-items-start">
                    <div className="fs-2 mb-2"><i className="bx bx-time-five"></i></div>
                    <div className="fw-bold fs-4">{totalSlots}</div>
                    <div className="small">Total Created Slots</div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-6 col-lg-3">
                <div className="card shadow-sm border-0 h-100" style={{ background: "linear-gradient(90deg,#ff5858,#f09819)", color: "#fff" }}>
                  <div className="card-body d-flex flex-column align-items-start">
                    <div className="fs-2 mb-2"><i className="bx bx-user"></i></div>
                    <div className="fw-bold fs-4">{totalPatients}</div>
                    <div className="small">Total Patients Treated</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Create Slot & Created Slots Section */}
            <div className="row g-3 mb-4">
              <div className="col-12 col-md-6">
                <div className="bg-white rounded shadow-sm p-4 h-100">
                  <h4 className="fw-bold mb-3 d-flex align-items-center gap-2">
                    <i className="bx bx-calendar"></i> Create New Availability Slot
                  </h4>
                  <div className="row g-2 align-items-end">
                    <div className="col-12 col-md-6">
                      <label className="form-label mb-1">Date</label>
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="form-control" />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label mb-1">Time</label>
                      <input
                        type="time"
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                        className="form-control" />
                    </div>
                    <div className="col-12 d-grid mt-2">
                      <button className="btn btn-primary" onClick={handleCreateSlot}>
                        <i className="bx bx-plus"></i> Create Slot
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              {/* Created Slots Card */}
              <div className="col-12 col-md-6">
                <div className="bg-white rounded shadow-sm p-4 h-100">
                  <h4 className="fw-bold mb-3 d-flex align-items-center gap-2">
                    <i className="bx bx-time-five"></i> Your Created Slots
                  </h4>
                  {createdSlots.length === 0 ? (
                    <div className="alert alert-info mb-0 text-center">No slots created yet.</div>
                  ) : (
                    <ul className="list-group">
                      {createdSlots.map(slot => (
                        <li key={slot.id} className="list-group-item d-flex justify-content-between align-items-center">
                          <span>
                            <i className="bx bx-calendar"></i> {slot.date} &nbsp;
                            <i className="bx bx-time"></i> {slot.time}
                          </span>
                          <span className={`badge ${slot.available ? 'bg-success' : 'bg-secondary'}`}>
                            {slot.available ? 'Available' : 'Unavailable'}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>

            {/* Appointments Section */}
            <div className="bg-white rounded shadow-sm p-4 mb-4">
              <h4 className="fw-bold mb-3 d-flex align-items-center gap-2">
                <i className="bx bx-list-ul"></i> Your Appointments
              </h4>
              {appointments.length === 0 ? (
                <div className="alert alert-info mb-0 text-center">No appointments scheduled yet.</div>
              ) : (
                <div className="row g-3">
                  {appointments.map((appt, index) => (
                    <div className="col-12 col-md-6 col-lg-4" key={index}>
                      <div className="card h-100 shadow-sm border-0">
                        <div className="card-body">
                          <div className="mb-2">
                            <strong><i className="bx bx-user"></i> Patient:</strong> {appt.patientName}
                          </div>
                          <div className="mb-2">
                            <strong><i className="bx bx-envelope"></i> Email:</strong> {appt.patientEmail || 'N/A'}
                          </div>
                          <div className="mb-2">
                            <strong><i className="bx bx-calendar"></i> Date:</strong> {appt.date}
                          </div>
                          <div className="mb-2">
                            <strong><i className="bx bx-time"></i> Time:</strong> {appt.time}
                          </div>
                          <div className="mb-2">
                            <strong>Status:</strong>{' '}
                            <span className={`badge ${appt.status === 'complete' ? 'bg-success' : 'bg-danger'}`}>
                              {appt.status === 'complete' ? <i className="bx bx-check-circle"></i> : null}
                              {appt.status}
                            </span>
                          </div>
                          {appt.videoLink && appt.status !== 'complete' ? (
                            <div className="mb-2">
                              <strong><i className="bx bx-video"></i> Video Link:</strong>{' '}
                              <a href={appt.videoLink} target="_blank" rel="noreferrer" className="btn btn-link p-0 align-baseline">
                                Join
                              </a>
                            </div>
                          ) : (
                            appt.status !== 'complete' && (
                              <button
                                className="btn btn-outline-primary btn-sm mt-2"
                                onClick={() => {
                                  window.confirm(`✅ Video calling link sent to ${appt.patientEmail}. Please check your email to proceed.`);
                                  initiateVideoCall(appt);
                                }}
                              >
                                <i className="bx bx-video"></i> Initiate Video Conference
                              </button>
                            )
                          )}
                          {/* Chat Button */}
                          <div className="mt-2">
                            <button
                              className="btn btn-outline-primary btn-sm"
                              onClick={() => openChat(appt.patientName, appt.id)}
                            >
                              <i className="bx bx-chat"></i> Chat
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
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
                  <i className="bx bx-chat"></i> Chat with {chatPatient}
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
                    className={`mb-2 d-flex ${msg.from === 'doctor' ? 'justify-content-end' : 'justify-content-start'}`}
                  >
                    <span
                      className={`px-3 py-2 rounded-pill ${msg.from === 'doctor' ? 'bg-primary text-white' : 'bg-light text-dark'}`}
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

export default DoctorDashboard;