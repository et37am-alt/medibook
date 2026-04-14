import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import axios from "axios";
const fields = [
  { name: 'name',     label: 'Full Name',     type: 'text',     placeholder: 'John Doe' },
  { name: 'email',    label: 'Email Address', type: 'email',    placeholder: 'you@example.com' },
  { name: 'phone',    label: 'Phone Number',  type: 'tel',      placeholder: '9876543210 (10 digits)' },
  { name: 'password', label: 'Password',      type: 'password', placeholder: 'Minimum 6 characters' },
];

const Register = () => {
  const [form, setForm]       = useState({ name: '', email: '', phone: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate     = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6)         return toast.error('Password must be at least 6 characters');
    if (!/^[0-9]{10}$/.test(form.phone))  return toast.error('Phone must be exactly 10 digits');

    setLoading(true);
    try {
      const data = await register(form);
      toast.success(data.message || 'Registered successfully!');
      navigate('/doctors');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logoWrap}>🏥</div>
        <h2 style={styles.title}>Create Account</h2>
        <p style={styles.sub}>Join MediBook to book appointments easily</p>

        <form onSubmit={handleSubmit}>
          {fields.map((f) => (
            <div key={f.name} style={styles.field}>
              <label style={styles.label}>{f.label}</label>
              <input
                name={f.name} type={f.type} value={form[f.name]}
                onChange={handleChange} required style={styles.input}
                placeholder={f.placeholder}
              />
            </div>
          ))}

          <div style={styles.terms}>
            <input type="checkbox" required id="terms" style={{ marginRight: '8px' }} />
            <label htmlFor="terms" style={{ fontSize: '0.85rem', color: '#666' }}>
              I agree to the Terms & Conditions
            </label>
          </div>

          <button type="submit" disabled={loading} style={styles.btn}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p style={styles.footer}>
          Already have an account?{' '}
          <Link to="/login" style={styles.link}>Login here</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  page: {
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    minHeight: 'calc(100vh - 64px)', background: '#f0f4ff', padding: '20px',
  },
  card: {
    background: '#fff', borderRadius: '20px', padding: '40px',
    boxShadow: '0 8px 40px rgba(0,0,0,0.1)', width: '100%', maxWidth: '420px',
  },
  logoWrap: { fontSize: '2.5rem', textAlign: 'center', marginBottom: '16px' },
  title: { fontSize: '1.8rem', fontWeight: 800, color: '#222', textAlign: 'center', marginBottom: '6px' },
  sub: { color: '#888', textAlign: 'center', marginBottom: '28px', fontSize: '0.95rem' },
  field: { marginBottom: '18px' },
  label: { display: 'block', marginBottom: '7px', fontWeight: 600, color: '#444', fontSize: '0.9rem' },
  input: {
    width: '100%', padding: '12px 14px', borderRadius: '10px',
    border: '1.5px solid #ddd', fontSize: '1rem', outline: 'none',
    boxSizing: 'border-box', fontFamily: 'inherit',
  },
  terms: { display: 'flex', alignItems: 'center', marginBottom: '16px' },
  btn: {
    width: '100%', padding: '14px', background: '#e11ae8', color: '#fff',
    border: 'none', borderRadius: '10px', fontSize: '1rem', fontWeight: 700,
    cursor: 'pointer',
  },
  footer: { textAlign: 'center', marginTop: '20px', color: '#777', fontSize: '0.9rem' },
  link: { color: '#e11ae8', fontWeight: 700, textDecoration: 'none' },
};

export default Register;
