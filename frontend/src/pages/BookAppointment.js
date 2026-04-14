import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import axios from "axios";
import { toast } from 'react-toastify';

axios.defaults.baseURL = "https://medibook-p82u.onrender.com";
const BookAppointment = () => {
  const { doctorId } = useParams();
  const navigate     = useNavigate();

  const [doctor, setDoctor]           = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [bookedSlots, setBookedSlots]   = useState([]);
  const [reason, setReason]             = useState('');
  const [loading, setLoading]           = useState(false);

  useEffect(() => {
    axios.get(`/api/doctors/${doctorId}`)
      .then(({ data }) => setDoctor(data.doctor))
      .catch(() => { toast.error('Doctor not found'); navigate('/doctors'); });
  }, [doctorId, navigate]);

  useEffect(() => {
    if (!selectedDate) return;
    const dateStr = selectedDate.toISOString().split('T')[0];
    axios.get(`/api/appointments/slots/${doctorId}?date=${dateStr}`)
      .then(({ data }) => setBookedSlots(data.bookedSlots))
      .catch(() => {});
    setSelectedSlot('');
  }, [selectedDate, doctorId]);

  const isAvailableDay = (date) => {
    if (date < new Date().setHours(0,0,0,0)) return false;
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
    return doctor?.availableDays?.includes(dayName);
  };

  const handleBooking = async () => {
    if (!selectedDate || !selectedSlot || !reason.trim()) {
      return toast.error('Please fill in all fields');
    }
    setLoading(true);
    try {
      const { data } = await axios.post('/api/appointments', {
        doctorId,
        appointmentDate: selectedDate.toISOString(),
        timeSlot: selectedSlot,
        reason,
      });
      toast.success(data.message || 'Appointment booked!');
      navigate('/appointments');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!doctor) return <div style={styles.center}>Loading doctor details...</div>;

  const canBook = selectedDate && selectedSlot && reason.trim().length > 0;

  return (
    <div style={styles.page}>
      {/* Doctor Info */}
      <div style={styles.docCard}>
        <div style={styles.avatar}>{doctor.name.charAt(0)}</div>
        <div style={{ flex: 1 }}>
          <h2 style={styles.docName}>Dr. {doctor.name}</h2>
          <p style={styles.spec}>{doctor.specialization} · {doctor.experience} years experience</p>
          <div style={styles.docMeta}>
            <span>⭐ {doctor.rating} Rating</span>
            <span>💰 ₹{doctor.fees} Consultation</span>
          </div>
        </div>
      </div>

      <div style={styles.formGrid}>
        {/* Left: Date picker */}
        <div style={styles.panel}>
          <h3 style={styles.panelTitle}>📅 Select Appointment Date</h3>
          <DatePicker
            selected={selectedDate}
            onChange={setSelectedDate}
            minDate={new Date()}
            filterDate={isAvailableDay}
            inline
          />
          <div style={styles.availInfo}>
            <strong>Available days:</strong><br />
            {doctor.availableDays?.join(' · ')}
          </div>
        </div>

        {/* Right: Slot + Reason */}
        <div style={styles.panel}>
          <h3 style={styles.panelTitle}>🕐 Select Time Slot</h3>

          {!selectedDate ? (
            <div style={styles.hintBox}>Please select a date first to see available slots</div>
          ) : (
            <div style={styles.slotsGrid}>
              {doctor.availableSlots?.map(slot => {
                const booked  = bookedSlots.includes(slot);
                const active  = selectedSlot === slot;
                return (
                  <button key={slot}
                    onClick={() => !booked && setSelectedSlot(slot)}
                    disabled={booked}
                    style={{
                      ...styles.slot,
                      ...(active  ? styles.slotActive  : {}),
                      ...(booked  ? styles.slotBooked  : {}),
                    }}>
                    {slot}
                    {booked && <div style={{ fontSize: '0.65rem', color: '#e53935' }}>Booked</div>}
                  </button>
                );
              })}
            </div>
          )}

          <h3 style={{ ...styles.panelTitle, marginTop: '24px' }}>📝 Reason for Visit</h3>
          <textarea
            value={reason} onChange={e => setReason(e.target.value)}
            placeholder="Describe your symptoms or reason for visiting the doctor..."
            style={styles.textarea} rows={4} maxLength={300}
          />
          <div style={{ textAlign: 'right', fontSize: '0.8rem', color: '#aaa', marginTop: '4px' }}>
            {reason.length}/300
          </div>

          {/* Booking summary */}
          {canBook && (
            <div style={styles.summary}>
              <h4 style={{ marginBottom: '10px', color: '#e11ae8' }}>📋 Booking Summary</h4>
              <div style={styles.summaryRow}><span>Doctor</span><strong>Dr. {doctor.name}</strong></div>
              <div style={styles.summaryRow}><span>Date</span><strong>{selectedDate.toDateString()}</strong></div>
              <div style={styles.summaryRow}><span>Time</span><strong>{selectedSlot}</strong></div>
              <div style={styles.summaryRow}><span>Fees</span><strong>₹{doctor.fees}</strong></div>
            </div>
          )}

          <button
            onClick={handleBooking}
            disabled={loading || !canBook}
            style={{ ...styles.bookBtn, opacity: canBook ? 1 : 0.5, cursor: canBook ? 'pointer' : 'not-allowed' }}>
            {loading ? 'Booking...' : '✅ Confirm Appointment'}
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: { padding: '40px', maxWidth: '1050px', margin: '0 auto' },
  center: { textAlign: 'center', padding: '80px', color: '#888', fontSize: '1.1rem' },
  docCard: {
    display: 'flex', alignItems: 'center', gap: '20px',
    background: '#fff', borderRadius: '20px', padding: '24px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)', marginBottom: '32px',
  },
  avatar: {
    width: '72px', height: '72px', borderRadius: '50%', background: '#1a73e8',
    color: '#fff', fontSize: '2rem', display: 'flex', alignItems: 'center',
    justifyContent: 'center', fontWeight: 700, flexShrink: 0,
  },
  docName: { fontSize: '1.5rem', fontWeight: 800, color: '#222', margin: 0 },
  spec: { color: '#1a73e8', fontWeight: 600, margin: '4px 0 8px' },
  docMeta: { display: 'flex', gap: '20px', fontSize: '0.9rem', color: '#555' },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px' },
  panel: {
    background: '#fff', borderRadius: '20px', padding: '24px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.07)',
  },
  panelTitle: { fontSize: '1.1rem', fontWeight: 700, color: '#333', marginTop: 0, marginBottom: '16px' },
  availInfo: {
    marginTop: '16px', padding: '12px', background: '#f0f4ff',
    borderRadius: '10px', fontSize: '0.85rem', color: '#555', lineHeight: 1.8,
  },
  hintBox: {
    background: '#f8f9ff', borderRadius: '10px', padding: '20px',
    textAlign: 'center', color: '#888', fontSize: '0.9rem',
  },
  slotsGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' },
  slot: {
    padding: '10px 8px', border: '1.5px solid #ddd', borderRadius: '10px',
    background: '#fff', cursor: 'pointer', fontSize: '0.85rem',
    fontWeight: 600, color: '#333', textAlign: 'center', transition: 'all 0.2s',
  },
  slotActive: { background: '#1a73e8', color: '#fff', borderColor: '#1a73e8' },
  slotBooked: { background: '#f5f5f5', color: '#ccc', cursor: 'not-allowed', borderColor: '#eee' },
  textarea: {
    width: '100%', padding: '12px', borderRadius: '10px', border: '1.5px solid #ddd',
    fontSize: '0.95rem', resize: 'vertical', outline: 'none',
    boxSizing: 'border-box', fontFamily: 'inherit', lineHeight: 1.6,
  },
  summary: {
    background: '#f0f4ff', borderRadius: '12px', padding: '16px',
    margin: '16px 0', border: '1px solid #d0e0ff',
  },
  summaryRow: {
    display: 'flex', justifyContent: 'space-between',
    fontSize: '0.9rem', color: '#555', padding: '5px 0',
    borderBottom: '1px solid #dde8ff',
  },
  bookBtn: {
    width: '100%', padding: '14px', background: '#1a73e8', color: '#fff',
    border: 'none', borderRadius: '12px', fontWeight: 700,
    fontSize: '1rem', marginTop: '12px', transition: 'opacity 0.2s',
  },
};

export default BookAppointment;
