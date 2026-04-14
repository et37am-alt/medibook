import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-datepicker/dist/react-datepicker.css';

import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar          from './components/Navbar';
import Home            from './pages/Home';
import Login           from './pages/Login';
import Register        from './pages/Register';
import Doctors         from './pages/Doctors';
import BookAppointment from './pages/BookAppointment';
import MyAppointments  from './pages/MyAppointments';
import AdminDashboard  from './pages/AdminDashboard';
import axios from "../api";
// Redirect to login if not logged in
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading">Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

// Redirect to home if not admin
const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading">Loading...</div>;
  return user?.role === 'admin' ? children : <Navigate to="/" />;
};

function AppContent() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/"        element={<Home />} />
        <Route path="/login"   element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/book/:doctorId" element={
          <ProtectedRoute><BookAppointment /></ProtectedRoute>
        } />
        <Route path="/appointments" element={
          <ProtectedRoute><MyAppointments /></ProtectedRoute>
        } />
        <Route path="/admin" element={
          <AdminRoute><AdminDashboard /></AdminRoute>
        } />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
