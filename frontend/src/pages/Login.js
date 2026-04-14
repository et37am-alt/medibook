import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import axios from "axios";

axios.defaults.baseURL = "https://medibook-p82u.onrender.com";
const Login = () => {
  const [form, setForm]       = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await login(form.email, form.password);
      toast.success(data.message || 'Login successful!');
      navigate(data.user.role === 'admin' ? '/admin' : '/doctors');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logoWrap}>🏥</div>
        <h2 style={styles.title}>Welcome Back</h2>
        <p style={styles.sub}>Login to manage your appointments</p>

        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label style={styles.label}>Email Address</label>
            <input
              name="email" type="email" value={form.email}
              onChange={handleChange} required style={styles.input}
              placeholder="you@example.com"
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                name="password" type={showPass ? 'text' : 'password'}
                value={form.password} onChange={handleChange}
                required style={styles.input} placeholder="••••••••"
              />
              <button type="button" onClick={() => setShowPass(!showPass)}
                style={styles.showPassBtn}>
                {showPass ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} style={styles.btn}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div style={styles.divider}><span>OR</span></div>

      

        <p style={styles.footer}>
          Don't have an account?{' '}
          <Link to="/register" style={styles.link}>Register here</Link>
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
  field: { marginBottom: '20px' },
  label: { display: 'block', marginBottom: '7px', fontWeight: 600, color: '#444', fontSize: '0.9rem' },
  input: {
    width: '100%', padding: '12px 14px', borderRadius: '10px',
    border: '1.5px solid #ddd', fontSize: '1rem', outline: 'none',
    boxSizing: 'border-box', transition: 'border 0.2s', fontFamily: 'inherit',
  },
  showPassBtn: {
    position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
    background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem',
  },
  btn: {
    width: '100%', padding: '14px', background: '#e11ae8', color: '#fff',
    border: 'none', borderRadius: '10px', fontSize: '1rem', fontWeight: 700,
    cursor: 'pointer', marginTop: '8px', transition: 'background 0.2s',
  },
  divider: {
    textAlign: 'center', margin: '20px 0', color: '#ccc', fontSize: '0.85rem',
    borderTop: '1px solid #eee', paddingTop: '16px',
  },
  adminHint: {
    background: '#f8f9ff', borderRadius: '8px', padding: '10px',
    marginBottom: '16px', border: '1px dashed #c5d5f5',
  },
  footer: { textAlign: 'center', color: '#777', fontSize: '0.9rem' },
  link: { color: '#e11ae8', fontWeight: 700, textDecoration: 'none' },
};

export default Login;
