import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const SPECIALIZATIONS = [
  'All', 'Cardiologist', 'Dermatologist', 'General Physician', 'Neurologist',
  'Orthopedic', 'Pediatrician', 'Psychiatrist', 'ENT', 'Gynecologist', 'Dentist',
];

const DoctorCard = ({ doc }) => (
  <div style={styles.card}>
    <div style={styles.cardTop}>
      <div style={styles.avatar}>{doc.name.charAt(0)}</div>
      <div style={styles.cardInfo}>
        <h3 style={styles.docName}>Dr. {doc.name}</h3>
        <span style={styles.specBadge}>{doc.specialization}</span>
      </div>
    </div>

    <div style={styles.statsRow}>
      <div style={styles.stat}><span style={styles.statVal}>⭐ {doc.rating}</span><span style={styles.statLbl}>Rating</span></div>
      <div style={styles.stat}><span style={styles.statVal}>🩺 {doc.experience}yr</span><span style={styles.statLbl}>Exp</span></div>
      <div style={styles.stat}><span style={styles.statVal}>₹{doc.fees}</span><span style={styles.statLbl}>Fees</span></div>
    </div>

    <p style={styles.bio}>{doc.bio || 'Experienced specialist providing quality healthcare.'}</p>

    <div style={styles.daysRow}>
      {doc.availableDays?.map(d => (
        <span key={d} style={styles.dayBadge}>{d.slice(0, 3)}</span>
      ))}
    </div>

    {doc.isAvailable ? (
      <Link to={`/book/${doc._id}`} style={styles.bookBtn}>Book Appointment</Link>
    ) : (
      <button style={styles.unavailBtn} disabled>Currently Unavailable</button>
    )}
  </div>
);

const Doctors = () => {
  const [doctors, setDoctors]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const selected = searchParams.get('specialization') || 'All';

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      try {
        const params = selected !== 'All' ? `?specialization=${selected}` : '';
        const { data } = await axios.get(`/api/doctors${params}`);
        setDoctors(data.doctors);
      } catch {
        toast.error('Failed to load doctors');
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, [selected]);

  const filtered = doctors.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.specialization.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={styles.page}>
      <div style={styles.pageHeader}>
        <h1 style={styles.pageTitle}>Find a Doctor</h1>
        <input
          type="text" placeholder="🔍 Search by name or specialization..."
          value={search} onChange={e => setSearch(e.target.value)}
          style={styles.searchInput}
        />
      </div>

      {/* Filter tabs */}
      <div style={styles.filterBar}>
        {SPECIALIZATIONS.map(s => (
          <button key={s}
            onClick={() => { setSearchParams(s !== 'All' ? { specialization: s } : {}); setSearch(''); }}
            style={{ ...styles.filterBtn, ...(selected === s || (s === 'All' && !searchParams.get('specialization')) ? styles.filterActive : {}) }}>
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={styles.center}><p>Loading doctors...</p></div>
      ) : filtered.length === 0 ? (
        <div style={styles.center}><p>No doctors found. Try a different filter.</p></div>
      ) : (
        <>
          <p style={styles.resultCount}>{filtered.length} doctor{filtered.length !== 1 ? 's' : ''} found</p>
          <div style={styles.grid}>
            {filtered.map(doc => <DoctorCard key={doc._id} doc={doc} />)}
          </div>
        </>
      )}
    </div>
  );
};

const styles = {
  page: { padding: '40px', maxWidth: '1200px', margin: '0 auto' },
  pageHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' },
  pageTitle: { fontSize: '2rem', fontWeight: 800, color: '#222' },
  searchInput: {
    padding: '10px 16px', borderRadius: '30px', border: '1.5px solid #ddd',
    fontSize: '0.95rem', width: '300px', outline: 'none',
  },
  filterBar: { display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '28px' },
  filterBtn: {
    padding: '7px 16px', borderRadius: '20px', border: '1.5px solid #ddd',
    background: '#fff', cursor: 'pointer', fontSize: '0.85rem', color: '#555', fontWeight: 500,
  },
  filterActive: { background: '#e11ae8', color: '#fff', borderColor: '#1a73e8' },
  resultCount: { color: '#888', fontSize: '0.9rem', marginBottom: '20px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '24px' },
  card: {
    background: '#fff', borderRadius: '20px', padding: '24px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.07)', display: 'flex',
    flexDirection: 'column', gap: '14px',
  },
  cardTop: { display: 'flex', alignItems: 'center', gap: '14px' },
  avatar: {
    width: '60px', height: '60px', borderRadius: '50%', background: '#1a73e8',
    color: '#fff', fontSize: '1.6rem', display: 'flex', alignItems: 'center',
    justifyContent: 'center', fontWeight: 700, flexShrink: 0,
  },
  cardInfo: { flex: 1 },
  docName: { fontSize: '1.1rem', fontWeight: 700, color: '#222', marginBottom: '4px' },
  specBadge: {
    background: '#e8f0fe', color: '#e11ae8', padding: '3px 10px',
    borderRadius: '10px', fontSize: '0.78rem', fontWeight: 600,
  },
  statsRow: { display: 'flex', justifyContent: 'space-between', background: '#f8f9ff', borderRadius: '10px', padding: '12px' },
  stat: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' },
  statVal: { fontSize: '0.9rem', fontWeight: 700, color: '#333' },
  statLbl: { fontSize: '0.72rem', color: '#999' },
  bio: { fontSize: '0.85rem', color: '#777', lineHeight: 1.6 },
  daysRow: { display: 'flex', flexWrap: 'wrap', gap: '6px' },
  dayBadge: {
    background: '#e8f0fe', color: '#1565c0', padding: '3px 9px',
    borderRadius: '8px', fontSize: '0.75rem', fontWeight: 600,
  },
  bookBtn: {
    display: 'block', padding: '12px', background: '#e11ae8', color: '#fff',
    borderRadius: '10px', textAlign: 'center', fontWeight: 700,
    textDecoration: 'none', fontSize: '0.95rem',
  },
  unavailBtn: {
    padding: '12px', background: '#f0f0f0', color: '#aaa',
    borderRadius: '10px', border: 'none', fontSize: '0.95rem',
    cursor: 'not-allowed', width: '100%',
  },
  center: { textAlign: 'center', padding: '60px', color: '#999', fontSize: '1.1rem' },
};

export default Doctors;
