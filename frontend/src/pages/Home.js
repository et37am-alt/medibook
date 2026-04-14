import React from 'react';
import { Link } from 'react-router-dom';
import axios from "../api";
const features = [
  { icon: '🔍', title: 'Find Doctors',    desc: 'Search by specialization and availability' },
  { icon: '📅', title: 'Book Instantly',  desc: 'Choose your date and time slot in seconds' },
  { icon: '✅', title: 'Get Confirmed',   desc: 'Receive instant booking confirmation' },
  { icon: '📋', title: 'Manage Bookings', desc: 'View, track, or cancel appointments anytime' },
];

const specializations = [
  'Cardiologist', 'Dermatologist', 'General Physician', 'Neurologist',
  'Orthopedic', 'Pediatrician', 'Psychiatrist', 'Dentist', 'ENT', 'Gynecologist',
];

const stats = [
  { value: '50+', label: 'Doctors' },
  { value: '1000+', label: 'Patients' },
  { value: '10+', label: 'Specializations' },
  { value: '24/7', label: 'Support' },
];

const Home = () => {
  return (
    <div>
      {/* Hero */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>Book Doctor Appointments Online</h1>
          <p style={styles.heroSub}>
            Skip the queue. Find top doctors, choose your slot, and confirm instantly.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/doctors" style={styles.heroBtnPrimary}>Find a Doctor →</Link>
            <Link to="/register" style={styles.heroBtnSecondary}>Register Free</Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={styles.statsBar}>
        {stats.map((s, i) => (
          <div key={i} style={styles.statItem}>
            <div style={styles.statValue}>{s.value}</div>
            <div style={styles.statLabel}>{s.label}</div>
          </div>
        ))}
      </section>

      {/* How it works */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>How It Works</h2>
        <p style={styles.sectionSub}>Book your appointment in 3 simple steps</p>
        <div style={styles.grid4}>
          {features.map((f, i) => (
            <div key={i} style={styles.featureCard}>
              <div style={styles.featureIcon}>{f.icon}</div>
              <h3 style={styles.featureTitle}>{f.title}</h3>
              <p style={styles.featureDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Specializations */}
      <section style={{ ...styles.section, background: '#f0f4ff' }}>
        <h2 style={styles.sectionTitle}>Browse by Specialization</h2>
        <p style={styles.sectionSub}>Find the right specialist for your needs</p>
        <div style={styles.specGrid}>
          {specializations.map((s, i) => (
            <Link key={i} to={`/doctors?specialization=${s}`} style={styles.specCard}>
              {s}
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={styles.ctaSection}>
        <h2 style={{ color: '#fff', fontSize: '2rem', marginBottom: '12px' }}>
          Ready to book your appointment?
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.85)', marginBottom: '28px', fontSize: '1.1rem' }}>
          Join thousands of patients who trust MediBook for their healthcare needs.
        </p>
        <Link to="/register" style={styles.ctaBtn}>Get Started — It's Free</Link>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <p>© 2024 MediBook. All rights reserved. | Online Appointment Booking System</p>
      </footer>
    </div>
  );
};

const styles = {
  hero: {
    background: 'linear-gradient(135deg, #e11ae8 0%, #0d47a1 100%)',
    color: '#fff', padding: '80px 20px', textAlign: 'center',
  },
  heroContent: { maxWidth: '700px', margin: '0 auto' },
  heroTitle: { fontSize: '2.8rem', fontWeight: 800, marginBottom: '16px', lineHeight: 1.2 },
  heroSub: { fontSize: '1.2rem', opacity: 0.9, marginBottom: '36px', lineHeight: 1.6 },
  heroBtnPrimary: {
    background: '#fff', color: '#e11ae8', padding: '14px 36px',
    borderRadius: '30px', fontWeight: 700, fontSize: '1.05rem',
    textDecoration: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
  },
  heroBtnSecondary: {
    background: 'rgba(255,255,255,0.15)', color: '#fff', padding: '14px 36px',
    borderRadius: '30px', fontWeight: 700, fontSize: '1.05rem',
    textDecoration: 'none', border: '2px solid rgba(255,255,255,0.5)',
  },
  statsBar: {
    display: 'flex', justifyContent: 'center', gap: '0',
    background: '#fff', borderBottom: '1px solid #eee', flexWrap: 'wrap',
  },
  statItem: {
    padding: '24px 48px', textAlign: 'center',
    borderRight: '1px solid #eee',
  },
  statValue: { fontSize: '2rem', fontWeight: 800, color: '#e11ae8' },
  statLabel: { fontSize: '0.9rem', color: '#777', marginTop: '4px' },
  section: { padding: '70px 40px', textAlign: 'center', background: '#fff' },
  sectionTitle: { fontSize: '2rem', fontWeight: 700, color: '#222', marginBottom: '8px' },
  sectionSub: { color: '#777', marginBottom: '40px', fontSize: '1rem' },
  grid4: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '24px', maxWidth: '900px', margin: '0 auto',
  },
  featureCard: {
    background: '#f8f9ff', borderRadius: '16px', padding: '32px 20px',
    border: '1px solid #e8edf8',
  },
  featureIcon: { fontSize: '2.5rem', marginBottom: '14px' },
  featureTitle: { fontSize: '1.1rem', fontWeight: 700, color: '#222', marginBottom: '8px' },
  featureDesc: { fontSize: '0.9rem', color: '#666', lineHeight: 1.6 },
  specGrid: {
    display: 'flex', flexWrap: 'wrap', gap: '12px',
    justifyContent: 'center', maxWidth: '800px', margin: '0 auto',
  },
  specCard: {
    background: '#fff', border: '2px solid #e11ae8', color: '#e11ae8',
    padding: '10px 22px', borderRadius: '30px', fontWeight: 600,
    textDecoration: 'none', fontSize: '0.9rem', transition: 'all 0.2s',
  },
  ctaSection: {
    background: 'linear-gradient(135deg, #e11ae8, #0d47a1)',
    padding: '70px 40px', textAlign: 'center',
  },
  ctaBtn: {
    background: '#fff', color: '#e11ae8', padding: '14px 36px',
    borderRadius: '30px', fontWeight: 700, fontSize: '1.05rem',
    textDecoration: 'none', display: 'inline-block',
  },
  footer: {
    background: '#222', color: '#aaa', textAlign: 'center',
    padding: '20px', fontSize: '0.85rem',
  },
};

export default Home;
