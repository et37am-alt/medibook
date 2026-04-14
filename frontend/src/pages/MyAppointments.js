import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
axios.defaults.baseURL = "https://medibook-p82u.onrender.com";
const STATUS = {
  pending:   { bg: '#fff8e1', color: '#f57f17', label: '⏳ Pending' },
  confirmed: { bg: '#e8f5e9', color: '#2e7d32', label: '✅ Confirmed' },
  cancelled: { bg: '#ffebee', color: '#c62828', label: '❌ Cancelled' },
  completed: { bg: '#e3f2fd', color: '#1565c0', label: '✔ Completed' },
};

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [filter, setFilter]             = useState('all');
  const [cancelling, setCancelling]     = useState(null);

  const fetchAppointments = async () => {
    try {
      const { data } = await axios.get('/api/appointments/my');
      setAppointments(data.appointments);
    } catch {
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAppointments(); }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    setCancelling(id);
    try {
      const { data } = await axios.put(`/api/appointments/${id}/cancel`, { reason: 'Cancelled by patient' });
      toast.success(data.message || 'Appointment cancelled');
      fetchAppointments();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cancellation failed');
    } finally {
      setCancelling(null);
    }
  };

  const filtered = filter === 'all' ? appointments : appointments.filter(a => a.status === filter);

  const counts = {
    all: appointments.length,
    pending:   appointments.filter(a => a.status === 'pending').length,
    confirmed: appointments.filter(a => a.status === 'confirmed').length,
    completed: appointments.filter(a => a.status === 'completed').length,
    cancelled: appointments.filter(a => a.status === 'cancelled').length,
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.pageTitle}>My Appointments</h1>

      {/* Filter tabs */}
      <div style={styles.filterBar}>
        {Object.entries(counts).map(([key, count]) => (
          <button key={key} onClick={() => setFilter(key)}
            style={{ ...styles.filterBtn, ...(filter === key ? styles.filterActive : {}) }}>
            {key.charAt(0).toUpperCase() + key.slice(1)}
            <span style={styles.filterCount}>{count}</span>
          </button>
        ))}
      </div>

      {loading ? (
        <div style={styles.center}>Loading appointments...</div>
      ) : filtered.length === 0 ? (
        <div style={styles.empty}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🗓</div>
          <p>No {filter !== 'all' ? filter : ''} appointments found.</p>
        </div>
      ) : (
        <div style={styles.list}>
          {filtered.map(appt => {
            const s = STATUS[appt.status] || STATUS.pending;
            const date = new Date(appt.appointmentDate);
            const canCancel = appt.status === 'pending' || appt.status === 'confirmed';
            return (
              <div key={appt._id} style={styles.card}>
                <div style={styles.cardLeft}>
                  <div style={styles.avatar}>{appt.doctor?.name?.charAt(0) || 'D'}</div>
                  <div style={{ ...styles.statusDot, background: s.color }} />
                </div>

                <div style={styles.cardBody}>
                  <div style={styles.cardTopRow}>
                    <div>
                      <h3 style={styles.docName}>Dr. {appt.doctor?.name}</h3>
                      <p style={styles.spec}>{appt.doctor?.specialization}</p>
                    </div>
                    <span style={{ ...styles.statusBadge, background: s.bg, color: s.color }}>
                      {s.label}
                    </span>
                  </div>

                  <div style={styles.detailsRow}>
                    <div style={styles.detail}><span>📅</span><strong>{date.toDateString()}</strong></div>
                    <div style={styles.detail}><span>🕐</span><strong>{appt.timeSlot}</strong></div>
                    <div style={styles.detail}><span>💰</span><strong>₹{appt.doctor?.fees}</strong></div>
                  </div>

                  <div style={styles.reasonBox}>
                    <strong>Reason: </strong><span style={{ color: '#666' }}>{appt.reason}</span>
                  </div>

                  {appt.cancellationReason && (
                    <div style={styles.cancelNote}>
                      ⚠️ Cancellation reason: {appt.cancellationReason}
                    </div>
                  )}
                </div>

                {canCancel && (
                  <button
                    onClick={() => handleCancel(appt._id)}
                    disabled={cancelling === appt._id}
                    style={styles.cancelBtn}>
                    {cancelling === appt._id ? '...' : 'Cancel'}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const styles = {
  page: { padding: '40px', maxWidth: '900px', margin: '0 auto' },
  pageTitle: { fontSize: '2rem', fontWeight: 800, color: '#222', marginBottom: '24px' },
  filterBar: { display: 'flex', gap: '8px', marginBottom: '28px', flexWrap: 'wrap' },
  filterBtn: {
    display: 'flex', alignItems: 'center', gap: '6px',
    padding: '8px 16px', borderRadius: '20px', border: '1.5px solid #ddd',
    background: '#fff', cursor: 'pointer', fontSize: '0.85rem', color: '#555', fontWeight: 500,
  },
  filterActive: { background: '#e11ae8', color: '#fff', borderColor: '#e11ae8' },
  filterCount: {
    background: 'rgba(255,255,255,0.3)', borderRadius: '10px',
    padding: '1px 6px', fontSize: '0.75rem', fontWeight: 700,
  },
  list: { display: 'flex', flexDirection: 'column', gap: '16px' },
  card: {
    background: '#fff', borderRadius: '16px', padding: '20px 24px',
    boxShadow: '0 4px 16px rgba(0,0,0,0.07)', display: 'flex',
    alignItems: 'flex-start', gap: '16px',
  },
  cardLeft: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' },
  avatar: {
    width: '52px', height: '52px', borderRadius: '50%', background: '#e11ae8',
    color: '#fff', fontSize: '1.4rem', display: 'flex', alignItems: 'center',
    justifyContent: 'center', fontWeight: 700, flexShrink: 0,
  },
  statusDot: { width: '8px', height: '8px', borderRadius: '50%' },
  cardBody: { flex: 1 },
  cardTopRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' },
  docName: { fontSize: '1.1rem', fontWeight: 700, color: '#222', margin: 0 },
  spec: { color: '#e11ae8', fontSize: '0.85rem', fontWeight: 600, margin: '2px 0 0' },
  statusBadge: { padding: '4px 12px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 600, flexShrink: 0 },
  detailsRow: { display: 'flex', gap: '20px', marginBottom: '10px', flexWrap: 'wrap' },
  detail: { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem', color: '#555' },
  reasonBox: { fontSize: '0.85rem', color: '#555', background: '#f8f9ff', borderRadius: '8px', padding: '8px 12px' },
  cancelNote: { fontSize: '0.8rem', color: '#e53935', marginTop: '8px' },
  cancelBtn: {
    padding: '8px 16px', background: '#fff', color: '#e53935',
    border: '1.5px solid #e53935', borderRadius: '8px', cursor: 'pointer',
    fontWeight: 600, fontSize: '0.85rem', flexShrink: 0, alignSelf: 'center',
  },
  center: { textAlign: 'center', color: '#888', padding: '40px', fontSize: '1rem' },
  empty: { textAlign: 'center', padding: '60px', color: '#aaa', fontSize: '1.1rem' },
};

export default MyAppointments;
