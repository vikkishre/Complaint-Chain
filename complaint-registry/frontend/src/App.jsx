import { useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import './App.css';

import Login from './Authentication/login';
import Signup from './Authentication/signup';
import RegisterComplaint from './pages/ComplaintRegistration';
import AdminPanel from './pages/Admin';
import ProtectedRoute from './components/ProtectedRoute'; // <- make sure this path is correct
import Dashboard from './components/Dashboard';
import My_Complaints from './pages/My-Complaints';
function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      try {
        const res = await fetch('http://localhost:3000/api/protected-route', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.ok) {
          navigate('/dashboard');  // ✅ User is logged in
        }//else {
        //   localStorage.removeItem('authToken');  // ❌ Invalid token
        // }
      } catch (err) {
        console.error('Token verification failed:', err);
        localStorage.removeItem('authToken');
      }
    };

    verifyToken();
  }, []);

  return (
    <div >
      <Routes>
        {/* Public routes */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminPanel />} />
        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-complaints"
          element={
            <ProtectedRoute>
              <My_Complaints/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/register-complaint"
          element={
            <ProtectedRoute>
              <RegisterComplaint />
            </ProtectedRoute>
          }
        />

        {/* Root route: Redirect based on token */}
        <Route
          path="/"
          element={
            localStorage.getItem("authToken") ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        
        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
