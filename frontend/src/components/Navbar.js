import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.brand}>🏥 MediBook</Link>

      {/* Desktop links */}
      <div style={styles.links}>
        <Link to="/doctors" style={{ ...styles.link, ...(isActive('/doctors') ? styles.activeLink : {}) }}>
          Doctors
        </Link>

        {user ? (
          <>
            <Link to="/appointments" style={{ ...styles.link, ...(isActive('/appointments') ? styles.activeLink : {}) }}>
              My Appointments
            </Link>
            {user.role === 'admin' && (
              <Link to="/admin" style={{ ...styles.link, ...(isActive('/admin') ? styles.activeLink : {}) }}>
                Admin
              </Link>
            )}
            <span style={styles.userName}>Hi, {user.name.split(' ')[0]} 👋</span>
            <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login"    style={{ ...styles.link, ...(isActive('/login') ? styles.activeLink : {}) }}>Login</Link>
            <Link to="/register" style={styles.registerBtn}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '0 40px', height: '64px', background: '#1a73e8',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)', position: 'sticky', top: 0, zIndex: 100,
  },
  brand: {
    fontSize: '1.4rem', fontWeight: 700, color: '#fff', textDecoration: 'none', letterSpacing: '-0.5px',
  },
  links: { display: 'flex', alignItems: 'center', gap: '8px' },
  link: {
    color: 'rgba(255,255,255,0.88)', textDecoration: 'none', fontSize: '0.95rem',
    padding: '6px 12px', borderRadius: '6px', transition: 'background 0.2s',
  },
  activeLink: { background: 'rgba(255,255,255,0.2)', color: '#fff' },
  userName: { color: '#d0e8ff', fontSize: '0.9rem', padding: '0 8px' },
  logoutBtn: {
    background: 'rgba(255,255,255,0.15)', color: '#fff',
    border: '1px solid rgba(255,255,255,0.35)', padding: '7px 16px',
    borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500,
  },
  registerBtn: {
    background: '#fff', color: '#1a73e8', padding: '7px 16px',
    borderRadius: '6px', fontWeight: 700, textDecoration: 'none', fontSize: '0.9rem',
  },
};

export default Navbar;
