import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
axios.defaults.baseURL = "https://medibook-p82u.onrender.com";
const BADGE = {
  pending:   { bg: '#fff8e1', color: '#f57f17' },
  confirmed: { bg: '#e8f5e9', color: '#2e7d32' },
  completed: { bg: '#e3f2fd', color: '#1565c0' },
  cancelled: { bg: '#ffebee', color: '#c62828' },
};

const AdminDashboard = () => {
  const [stats, setStats]               = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [tab, setTab]                   = useState('stats');
  const [loading, setLoading]           = useState(true);
  const [searchTerm, setSearchTerm]     = useState('');

  useEffect(() => {
    Promise.all([
      axios.get('/api/admin/stats'),
      axios.get('/api/admin/appointments'),
    ]).then(([s, a]) => {
      setStats(s.data.stats);
      setAppointments(a.data.appointments);
    }).catch(() => toast.error('Failed to load admin data'))
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`/api/admin/appointments/${id}`, { status });
      toast.success(`Status updated to "${status}"`);
      setAppointments(prev => prev.map(a => a._id === id ? { ...a, status } : a));
    } catch {
      toast.error('Update failed');
    }
  };

  const filteredAppointments = appointments.filter(a =>
    a.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.doctor?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.status?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div style={styles.center}>Loading admin dashboard...</div>;

  const statCards = [
    { label: 'Total Users',        value: stats?.totalUsers,        color: '#1a73e8', icon: '👥' },
    { label: 'Total Appointments', value: stats?.totalAppointments, color: '#7c4dff', icon: '📅' },
    { label: 'Pending',            value: stats?.pending,           color: '#f57c00', icon: '⏳' },
    { label: 'Confirmed',          value: stats?.confirmed,         color: '#2e7d32', icon: '✅' },
    { label: 'Completed',          value: stats?.completed,         color: '#0288d1', icon: '✔' },
    { label: 'Cancelled',          value: stats?.cancelled,         color: '#c62828', icon: '❌' },
  ];

  return (
    <div style={styles.page}>
      <div style={styles.pageHeader}>
        <h1 style={styles.pageTitle}>🛠 Admin Dashboard</h1>
        <div style={styles.headerMeta}>
          <span style={styles.roleBadge}>Admin</span>
        </div>
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        {['stats', 'appointments'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{ ...styles.tab, ...(tab === t ? styles.tabActive : {}) }}>
            {t === 'stats' ? '📊 Statistics' : '📋 All Appointments'}
          </button>
        ))}
      </div>

      {/* Stats tab */}
      {tab === 'stats' && (
        <>
          <div style={styles.statsGrid}>
            {statCards.map((c, i) => (
              <div key={i} style={{ ...styles.statCard, borderTop: `4px solid ${c.color}` }}>
                <div style={styles.statIcon}>{c.icon}</div>
                <div style={{ ...styles.statValue, color: c.color }}>{c.value ?? 0}</div>
                <div style={styles.statLabel}>{c.label}</div>
              </div>
            ))}
          </div>

          <div style={styles.quickStats}>
            <h3 style={{ marginBottom: '16px', color: '#333' }}>Quick Overview</h3>
            <div style={styles.progressRow}>
              {['pending','confirmed','completed','cancelled'].map(s => (
                <div key={s} style={styles.progressItem}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.85rem', color: '#555', textTransform: 'capitalize' }}>{s}</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{stats?.[s] ?? 0}</span>
                  </div>
                  <div style={styles.progressBg}>
                    <div style={{
                      ...styles.progressFill,
                      width: `${stats?.totalAppointments ? ((stats?.[s] / stats.totalAppointments) * 100).toFixed(0) : 0}%`,
                      background: BADGE[s]?.color,
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Appointments tab */}
      {tab === 'appointments' && (
        <div>
          <div style={styles.tableHeader}>
            <p style={{ color: '#888', fontSize: '0.9rem' }}>{filteredAppointments.length} appointments</p>
            <input
              type="text" placeholder="🔍 Search patient, doctor, status..."
              value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              style={styles.searchInput}
            />
          </div>

          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.thead}>
                  {['Patient', 'Doctor', 'Specialization', 'Date', 'Time Slot', 'Status', 'Update Status'].map(h => (
                    <th key={h} style={styles.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.map(a => {
                  const badge = BADGE[a.status] || BADGE.pending;
                  return (
                    <tr key={a._id} style={styles.tr}>
                      <td style={styles.td}>
                        <div style={styles.patientName}>{a.user?.name}</div>
                        <div style={styles.patientEmail}>{a.user?.email}</div>
                        <div style={styles.patientEmail}>{a.user?.phone}</div>
                      </td>
                      <td style={styles.td}>Dr. {a.doctor?.name}</td>
                      <td style={styles.td}>{a.doctor?.specialization}</td>
                      <td style={styles.td}>{new Date(a.appointmentDate).toLocaleDateString()}</td>
                      <td style={styles.td}>{a.timeSlot}</td>
                      <td style={styles.td}>
                        <span style={{ ...styles.badge, background: badge.bg, color: badge.color }}>
                          {a.status}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <select value={a.status}
                          onChange={e => updateStatus(a._id, e.target.value)}
                          style={styles.select}>
                          {['pending','confirmed','completed','cancelled'].map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  page: { padding: '40px', maxWidth: '1200px', margin: '0 auto' },
  center: { textAlign: 'center', padding: '80px', color: '#888', fontSize: '1.1rem' },
  pageHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' },
  pageTitle: { fontSize: '2rem', fontWeight: 800, color: '#222' },
  roleBadge: { background: '#e8f0fe', color: '#1a73e8', padding: '6px 16px', borderRadius: '20px', fontWeight: 700, fontSize: '0.85rem' },
  tabs: { display: 'flex', gap: '10px', marginBottom: '32px' },
  tab: {
    padding: '10px 24px', borderRadius: '10px', border: '1.5px solid #ddd',
    background: '#fff', cursor: 'pointer', fontWeight: 600, fontSize: '0.95rem', color: '#555',
  },
  tabActive: { background: '#1a73e8', color: '#fff', borderColor: '#1a73e8' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '20px', marginBottom: '28px' },
  statCard: {
    background: '#fff', borderRadius: '16px', padding: '24px 20px',
    textAlign: 'center', boxShadow: '0 4px 16px rgba(0,0,0,0.07)',
  },
  statIcon: { fontSize: '2rem', marginBottom: '8px' },
  statValue: { fontSize: '2.2rem', fontWeight: 800, marginBottom: '4px' },
  statLabel: { fontSize: '0.82rem', color: '#888', fontWeight: 600 },
  quickStats: { background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 16px rgba(0,0,0,0.07)' },
  progressRow: { display: 'flex', flexDirection: 'column', gap: '14px' },
  progressItem: {},
  progressBg: { height: '8px', background: '#f0f0f0', borderRadius: '4px', overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: '4px', transition: 'width 0.5s ease' },
  tableHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
  searchInput: {
    padding: '9px 16px', borderRadius: '20px', border: '1.5px solid #ddd',
    fontSize: '0.9rem', width: '280px', outline: 'none',
  },
  tableWrap: { overflowX: 'auto', background: '#fff', borderRadius: '16px', boxShadow: '0 4px 16px rgba(0,0,0,0.07)' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' },
  thead: { background: '#f8f9fa' },
  th: { padding: '14px 16px', textAlign: 'left', fontWeight: 700, color: '#555', borderBottom: '2px solid #eee' },
  tr: { borderBottom: '1px solid #f0f0f0' },
  td: { padding: '14px 16px', color: '#333', verticalAlign: 'middle' },
  patientName: { fontWeight: 700 },
  patientEmail: { fontSize: '0.78rem', color: '#999', marginTop: '2px' },
  badge: { padding: '3px 10px', borderRadius: '10px', fontSize: '0.78rem', fontWeight: 600 },
  select: {
    padding: '6px 10px', borderRadius: '8px', border: '1px solid #ddd',
    fontSize: '0.85rem', cursor: 'pointer', outline: 'none', background: '#fff',
  },
};

export default AdminDashboard;
