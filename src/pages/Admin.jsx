import { useState, useMemo, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  LuArrowLeft, LuPlus, LuTrash2, LuCar, LuList, LuMapPin,
  LuCheck, LuX, LuPencil, LuUsers, LuBarChart2, LuTag, LuCalendarDays,
  LuDownload, LuSearch, LuFilter, LuHome, LuPhone, LuClock4, LuImage
} from 'react-icons/lu';
import toast from 'react-hot-toast';
import { addCustomVehicle, deleteAnyVehicle, updateVehicle, getCustomVehicles, vehiclesData, categories } from '../services/VehicleService';
import { bookingService } from '../services/Bookingservice';
import { promoService } from '../services/PromoService';
import { agencyService } from '../services/AgencyService';
import LocationMap from '../components/LocationMap';
import ConfirmModal from '../components/ConfirmModal';
import './Admin.css';

const emptyForm = {
  name: '', category: 'Économique', type: 'Citadine', image: '',
  price24: '', price48: '', priceWeek: '', priceMonth: '',
  passengers: '5', luggage: '2', transmission: 'Automatique',
  fuel: 'Essence', doors: '4', features: '', withDriver: false
};

const emptyPromoForm = {
  code: '', discount: '', type: 'percent', minAmount: '', maxUses: '', expiresAt: ''
};

// ── Mini Bar Chart Component ──
const BarChart = ({ data, labelKey, valueKey, color = '#4a7bff' }) => {
  const max = Math.max(...data.map(d => d[valueKey]), 1);
  return (
    <div className="admin-chart">
      {data.map((d, i) => (
        <div key={i} className="admin-chart-col">
          <span className="admin-chart-val">{d[valueKey]}</span>
          <div className="admin-chart-bar" style={{ height: `${(d[valueKey] / max) * 100}%`, background: color }} />
          <span className="admin-chart-label">{d[labelKey]}</span>
        </div>
      ))}
    </div>
  );
};

const Admin = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('analytics');
  const [form, setForm] = useState({ ...emptyForm });
  const [editingId, setEditingId] = useState(null);
  const [customVehicles, setCustomVehicles] = useState(getCustomVehicles());
  const [showForm, setShowForm] = useState(false);
  const [allBookings, setAllBookings] = useState([]);
  const [, forceUpdate] = useState(0);

  // Bookings filters
  const [bookingFilter, setBookingFilter] = useState('all');
  const [bookingSearch, setBookingSearch] = useState('');
  const [bookingDateFrom, setBookingDateFrom] = useState('');
  const [bookingDateTo, setBookingDateTo] = useState('');

  // Users
  const [users, setUsers] = useState([]);

  // Promos
  const [promos, setPromos] = useState(promoService.getAll());
  const [promoForm, setPromoForm] = useState({ ...emptyPromoForm });
  const [showPromoForm, setShowPromoForm] = useState(false);

  // Calendar
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  // Agencies
  const [agencies, setAgencies] = useState([]);
  const [editingAgency, setEditingAgency] = useState(null);
  const [agencyForm, setAgencyForm] = useState({ name: '', address: '', phone: '', hours: '', image: '' });

  // Confirm modal
  const [confirmModal, setConfirmModal] = useState({ open: false, title: '', message: '', variant: 'danger', onConfirm: null });
  const showConfirm = (title, message, onConfirm, variant = 'danger') => {
    setConfirmModal({ open: true, title, message, variant, onConfirm });
  };
  const closeConfirm = () => setConfirmModal(prev => ({ ...prev, open: false }));

  // Load data from Firebase
  const refreshBookings = useCallback(async () => {
    const data = await bookingService.getAllBookings();
    setAllBookings(data);
  }, []);

  const refreshAgencies = useCallback(async () => {
    const data = await agencyService.getAll();
    setAgencies(data);
  }, []);

  const refreshUsers = useCallback(async () => {
    try {
      const { getDocs, collection } = await import('firebase/firestore');
      const { db } = await import('../services/firebase');
      const snap = await getDocs(collection(db, 'users'));
      setUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch { setUsers([]); }
  }, []);

  useEffect(() => {
    refreshBookings();
    refreshAgencies();
    refreshUsers();
  }, [refreshBookings, refreshAgencies, refreshUsers]);

  // ── Handlers ──
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setForm(prev => ({ ...prev, image: reader.result }));
      reader.readAsDataURL(file);
    }
  };

  const buildVehicleData = () => ({
    name: form.name, category: form.category, type: form.type,
    image: form.image || 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800',
    price: { '24h': Number(form.price24), '48h': Number(form.price48) || Number(form.price24) * 1.8, '1week': Number(form.priceWeek) || Number(form.price24) * 6, '1month': Number(form.priceMonth) || Number(form.price24) * 22 },
    features: form.features.split(',').map(f => f.trim()).filter(Boolean),
    specs: { passengers: Number(form.passengers), luggage: Number(form.luggage), transmission: form.transmission, fuel: form.fuel, doors: Number(form.doors) },
    withDriver: form.withDriver
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.price24) { toast.error(t('admin.nameRequired')); return; }
    const vehicleData = buildVehicleData();

    if (editingId) {
      updateVehicle(editingId, vehicleData);
      setEditingId(null);
      toast.success(`${vehicleData.name} ${t('admin.modified')}`);
    } else {
      addCustomVehicle(vehicleData);
      toast.success(`${vehicleData.name} ${t('admin.added')}`);
    }
    setCustomVehicles(getCustomVehicles());
    setForm({ ...emptyForm });
    setShowForm(false);
    forceUpdate(n => n + 1);
  };

  const handleEdit = (v) => {
    setForm({
      name: v.name, category: v.category, type: v.type, image: v.image || '',
      price24: v.price['24h'] || '', price48: v.price['48h'] || '',
      priceWeek: v.price['1week'] || '', priceMonth: v.price['1month'] || '',
      passengers: v.specs?.passengers || '5', luggage: v.specs?.luggage || '2',
      transmission: v.specs?.transmission || 'Automatique', fuel: v.specs?.fuel || 'Essence',
      doors: v.specs?.doors || '4',
      features: (v.features || []).join(', '), withDriver: v.withDriver || false
    });
    setEditingId(v.id);
    setShowForm(true);
  };

  const handleDelete = (id, name) => {
    showConfirm(t('admin.deleteVehicleTitle'), t('admin.deleteVehicleMsg', { name }), () => {
      closeConfirm();
      deleteAnyVehicle(id);
      setCustomVehicles(getCustomVehicles());
      forceUpdate(n => n + 1);
      toast.success(t('admin.vehicleDeleted'));
    });
  };

  const handleStatusChange = async (id, status) => {
    await bookingService.updateAllBookingStatus(id, status);
    await refreshBookings();
    toast.success(t(status === 'confirmed' ? 'admin.bookingConfirmed' : status === 'cancelled' ? 'admin.bookingCancelled' : 'admin.bookingUpdated'));
  };

  const handleDeleteBooking = (id) => {
    showConfirm(t('admin.deleteBookingTitle'), t('admin.deleteBookingMsg'), async () => {
      closeConfirm();
      await bookingService.deleteBooking(id);
      await refreshBookings();
      toast.success(t('admin.bookingDeleted'));
    });
  };

  // Users
  const handleToggleBlock = async (userId) => {
    const u = users.find(u => u.id === userId);
    if (u) {
      const { doc, updateDoc } = await import('firebase/firestore');
      const { db } = await import('../services/firebase');
      await updateDoc(doc(db, 'users', userId), { blocked: !u.blocked });
      await refreshUsers();
      toast.success(!u.blocked ? t('admin.userBlocked') : t('admin.userUnblocked'));
    }
  };

  const handleDeleteUser = (userId) => {
    showConfirm(t('admin.deleteUserTitle'), t('admin.deleteUserMsg'), async () => {
      closeConfirm();
      const { doc, deleteDoc } = await import('firebase/firestore');
      const { db } = await import('../services/firebase');
      await deleteDoc(doc(db, 'users', userId));
      await refreshUsers();
      toast.success(t('admin.userDeleted'));
    });
  };

  // Promos
  const handlePromoSubmit = (e) => {
    e.preventDefault();
    if (!promoForm.code || !promoForm.discount) { toast.error(t('admin.promoRequired')); return; }
    promoService.create(promoForm);
    setPromos(promoService.getAll());
    setPromoForm({ ...emptyPromoForm });
    setShowPromoForm(false);
    toast.success(t('admin.promoCreated'));
  };

  const handleTogglePromo = (id) => {
    promoService.toggle(id);
    setPromos(promoService.getAll());
  };

  const handleDeletePromo = (id) => {
    promoService.delete(id);
    setPromos(promoService.getAll());
    toast.success(t('admin.promoDeleted'));
  };

  // Agencies
  const handleEditAgency = (agency) => {
    setEditingAgency(agency.id);
    setAgencyForm({ name: agency.name, address: agency.address, phone: agency.phone, hours: agency.hours, image: agency.image || '' });
  };

  const handleAgencyImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAgencyForm(prev => ({ ...prev, image: reader.result }));
      reader.readAsDataURL(file);
    }
  };

  const handleAgencySubmit = async (e) => {
    e.preventDefault();
    if (!agencyForm.name) { toast.error(t('admin.agencyRequired')); return; }
    if (editingAgency) {
      await agencyService.update(editingAgency, agencyForm);
      toast.success(t('admin.agencyModified'));
    } else {
      await agencyService.create(agencyForm);
      toast.success(t('admin.agencyAdded'));
    }
    await refreshAgencies();
    setEditingAgency(null);
    setAgencyForm({ name: '', address: '', phone: '', hours: '', image: '' });
  };

  const handleDeleteAgency = (id) => {
    showConfirm(t('admin.deleteAgencyTitle'), t('admin.deleteAgencyMsg'), async () => {
      closeConfirm();
      await agencyService.delete(id);
      await refreshAgencies();
      toast.success(t('admin.agencyDeleted'));
    });
  };

  const handleCancelAgencyEdit = () => {
    setEditingAgency(null);
    setAgencyForm({ name: '', address: '', phone: '', hours: '', image: '' });
  };

  // Export CSV
  const exportCSV = () => {
    const headers = ['ID', 'Véhicule', 'Client', 'Email', 'Durée', 'Total', 'Statut', 'Date', 'Lieu'];
    const rows = allBookings.map(b => [
      b.id, b.vehicleName || '', b.userName || '', b.userEmail || '',
      bookingService.getDurationLabel(b.duration), b.total || 0,
      bookingService.getStatusInfo(b.status).label,
      b.startDate ? new Date(b.startDate).toLocaleDateString(i18n.language === 'fr' ? 'fr-FR' : 'en-US') : '',
      b.pickupLocation || ''
    ]);
    const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(',')).join('\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `reservations_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click(); URL.revokeObjectURL(url);
    toast.success(t('admin.csvExported'));
  };

  // Filtered bookings
  const filteredBookings = useMemo(() => {
    let list = [...allBookings];
    if (bookingFilter !== 'all') list = list.filter(b => b.status === bookingFilter);
    if (bookingSearch) {
      const s = bookingSearch.toLowerCase();
      list = list.filter(b =>
        (b.vehicleName || '').toLowerCase().includes(s) ||
        (b.userName || '').toLowerCase().includes(s) ||
        (b.userEmail || '').toLowerCase().includes(s)
      );
    }
    if (bookingDateFrom) list = list.filter(b => b.startDate && b.startDate >= bookingDateFrom);
    if (bookingDateTo) list = list.filter(b => b.startDate && b.startDate <= bookingDateTo);
    return list;
  }, [allBookings, bookingFilter, bookingSearch, bookingDateFrom, bookingDateTo]);

  // ── Analytics data ──
  const analytics = useMemo(() => {
    const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
    const now = new Date();
    const revenueByMonth = [];
    const bookingsByMonth = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const monthBookings = allBookings.filter(b => b.createdAt && b.createdAt.startsWith(key));
      revenueByMonth.push({ label: monthNames[d.getMonth()], value: monthBookings.reduce((s, b) => s + (b.total || 0), 0) });
      bookingsByMonth.push({ label: monthNames[d.getMonth()], value: monthBookings.length });
    }
    const byStatus = {};
    allBookings.forEach(b => { byStatus[b.status] = (byStatus[b.status] || 0) + 1; });
    const byCategory = {};
    allBookings.forEach(b => {
      const v = vehiclesData.find(v2 => v2.id === b.vehicleId);
      const cat = v ? v.category : 'Autre';
      byCategory[cat] = (byCategory[cat] || 0) + 1;
    });
    return { revenueByMonth, bookingsByMonth, byStatus, byCategory };
  }, [allBookings]);

  // ── Calendar data ──
  const calendarData = useMemo(() => {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const offset = firstDay === 0 ? 6 : firstDay - 1;
    const days = [];
    for (let i = 0; i < offset; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const dayBookings = allBookings.filter(b => {
        if (!b.startDate) return false;
        const start = b.startDate.slice(0, 10);
        const end = b.endDate ? b.endDate.slice(0, 10) : start;
        return dateStr >= start && dateStr <= end && (b.status === 'confirmed' || b.status === 'active' || b.status === 'pending');
      });
      days.push({ day: d, date: dateStr, bookings: dayBookings });
    }
    return { days, monthLabel: new Date(year, month).toLocaleDateString(i18n.language === 'fr' ? 'fr-FR' : 'en-US', { month: 'long', year: 'numeric' }) };
  }, [calendarMonth, allBookings]);

  const tabs = [
    { id: 'analytics', label: t('admin.analytics'), icon: <LuBarChart2 /> },
    { id: 'vehicles', label: t('admin.vehicles'), icon: <LuCar /> },
    { id: 'bookings', label: t('admin.bookings'), icon: <LuList /> },
    { id: 'users', label: t('admin.users'), icon: <LuUsers /> },
    { id: 'promos', label: t('admin.promos'), icon: <LuTag /> },
    { id: 'agencies', label: t('admin.agenciesTab'), icon: <LuHome /> },
    { id: 'calendar', label: t('admin.calendarTab'), icon: <LuCalendarDays /> },
    { id: 'tracking', label: t('admin.tracking'), icon: <LuMapPin /> }
  ];

  const totalRevenue = allBookings.reduce((sum, b) => sum + (b.total || 0), 0);

  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-header slide-up">
          <button className="vd-back" onClick={() => navigate(-1)}><LuArrowLeft /></button>
          <div>
            <h1 className="admin-title">{t('admin.title')}</h1>
            <p className="admin-subtitle">{t('admin.dashboard')}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="admin-stats slide-up">
          <div className="admin-stat-card">
            <span className="admin-stat-number">{vehiclesData.length}</span>
            <span className="admin-stat-label">{t('admin.vehicles')}</span>
          </div>
          <div className="admin-stat-card">
            <span className="admin-stat-number">{allBookings.length}</span>
            <span className="admin-stat-label">{t('admin.bookings')}</span>
          </div>
          <div className="admin-stat-card">
            <span className="admin-stat-number">{allBookings.filter(b => b.status === 'pending').length}</span>
            <span className="admin-stat-label">{t('admin.pending')}</span>
          </div>
          <div className="admin-stat-card">
            <span className="admin-stat-number">{totalRevenue}€</span>
            <span className="admin-stat-label">{t('admin.revenue')}</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="admin-tabs slide-up">
          {tabs.map(tab => (
            <button key={tab.id} className={`admin-tab ${activeTab === tab.id ? 'admin-tab--active' : ''}`} onClick={() => setActiveTab(tab.id)}>
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* ══════════════════════════════════════
            Tab: Analytics
           ══════════════════════════════════════ */}
        {activeTab === 'analytics' && (
          <div className="admin-analytics slide-up">
            <div className="admin-analytics-grid">
              <div className="admin-chart-card">
                <h3 className="admin-section-title">{t('admin.revenueChart')}</h3>
                <BarChart data={analytics.revenueByMonth} labelKey="label" valueKey="value" color="#00d98e" />
              </div>
              <div className="admin-chart-card">
                <h3 className="admin-section-title">{t('admin.bookingsChart')}</h3>
                <BarChart data={analytics.bookingsByMonth} labelKey="label" valueKey="value" color="#4a7bff" />
              </div>
            </div>
            <div className="admin-analytics-grid">
              <div className="admin-chart-card">
                <h3 className="admin-section-title">{t('admin.byStatus')}</h3>
                <div className="admin-status-grid">
                  {Object.entries(analytics.byStatus).map(([status, count]) => {
                    const info = bookingService.getStatusInfo(status);
                    return (
                      <div key={status} className="admin-status-item">
                        <span className={`booking-status booking-status--${info.color}`}>{info.label}</span>
                        <strong>{count}</strong>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="admin-chart-card">
                <h3 className="admin-section-title">{t('admin.byCategory')}</h3>
                <div className="admin-status-grid">
                  {Object.entries(analytics.byCategory).map(([cat, count]) => (
                    <div key={cat} className="admin-status-item">
                      <span>{cat}</span>
                      <strong>{count}</strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════
            Tab: Vehicles (with Edit)
           ══════════════════════════════════════ */}
        {activeTab === 'vehicles' && (
          <>
            <button className="admin-add-btn slide-up" onClick={() => { setShowForm(!showForm); setEditingId(null); setForm({ ...emptyForm }); }}>
              <LuPlus />
              <span>{showForm ? t('admin.cancelAction') : t('admin.addVehicle')}</span>
            </button>

            {showForm && (
              <form className="admin-form slide-up" onSubmit={handleSubmit}>
                <h3 className="admin-form-section-title">{editingId ? t('admin.editVehicle') : t('admin.newVehicle')}</h3>
                <div className="admin-form-grid">
                  <div className="form-group">
                    <label className="form-label">{t('admin.formName')}</label>
                    <input className="form-input" name="name" value={form.name} onChange={handleChange} placeholder="ex. BMW M3" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t('admin.formCategory')}</label>
                    <select className="form-input" name="category" value={form.category} onChange={handleChange}>
                      {categories.filter(c => c.id !== 'all').map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t('admin.formType')}</label>
                    <input className="form-input" name="type" value={form.type} onChange={handleChange} placeholder="Berline, SUV..." />
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t('admin.formTransmission')}</label>
                    <select className="form-input" name="transmission" value={form.transmission} onChange={handleChange}>
                      <option value="Automatique">{t('vehicles.transmission_auto')}</option>
                      <option value="Manuelle">{t('vehicles.transmission_manual')}</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t('admin.formFuel')}</label>
                    <select className="form-input" name="fuel" value={form.fuel} onChange={handleChange}>
                      <option value="Essence">{t('vehicles.fuel_petrol')}</option>
                      <option value="Diesel">{t('vehicles.fuel_diesel')}</option>
                      <option value="Électrique">{t('vehicles.fuel_electric')}</option>
                      <option value="Hybride">{t('vehicles.fuel_hybrid')}</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t('admin.formPassengers')}</label>
                    <input className="form-input" name="passengers" type="number" min="1" max="9" value={form.passengers} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t('admin.formLuggage')}</label>
                    <input className="form-input" name="luggage" type="number" min="0" max="20" value={form.luggage} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t('admin.formDoors')}</label>
                    <input className="form-input" name="doors" type="number" min="2" max="5" value={form.doors} onChange={handleChange} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">{t('admin.photo')}</label>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="form-input" />
                  {form.image && <img src={form.image} alt="Preview" className="admin-img-preview" />}
                </div>
                <h3 className="admin-form-section-title">{t('admin.formPrices')}</h3>
                <div className="admin-form-grid">
                  <div className="form-group"><label className="form-label">{t('admin.formPriceDay')}</label><input className="form-input" name="price24" type="number" min="1" value={form.price24} onChange={handleChange} required /></div>
                  <div className="form-group"><label className="form-label">{t('admin.formPrice48')}</label><input className="form-input" name="price48" type="number" min="1" value={form.price48} onChange={handleChange} placeholder="auto" /></div>
                  <div className="form-group"><label className="form-label">{t('admin.formPriceWeek')}</label><input className="form-input" name="priceWeek" type="number" min="1" value={form.priceWeek} onChange={handleChange} placeholder="auto" /></div>
                  <div className="form-group"><label className="form-label">{t('admin.formPriceMonth')}</label><input className="form-input" name="priceMonth" type="number" min="1" value={form.priceMonth} onChange={handleChange} placeholder="auto" /></div>
                </div>
                <div className="form-group">
                  <label className="form-label">{t('admin.formFeatures')}</label>
                  <input className="form-input" name="features" value={form.features} onChange={handleChange} placeholder="GPS, Climatisation, Bluetooth" />
                </div>
                <label className="admin-checkbox">
                  <input type="checkbox" name="withDriver" checked={form.withDriver} onChange={handleChange} />
                  <span>{t('admin.formDriverAvailable')}</span>
                </label>
                <button type="submit" className="btn-primary">{editingId ? t('admin.saveChanges') : t('admin.addVehicleBtn')}</button>
              </form>
            )}

            <div className="admin-vehicles slide-up">
              <h3 className="admin-section-title">{t('admin.allVehicles')} ({vehiclesData.length})</h3>
              <div className="admin-vehicles-list">
                {vehiclesData.map(v => (
                  <div key={v.id} className="admin-vehicle-item">
                    <img src={v.image} alt={v.name} className="admin-vehicle-img" />
                    <div className="admin-vehicle-info">
                      <strong>{v.name}</strong>
                      <span>{v.category} — {v.price['24h']}€{t('vehicles.perDay')}</span>
                    </div>
                    <button className="admin-edit-btn" onClick={() => handleEdit(v)}><LuPencil /></button>
                    <button className="admin-delete-btn" onClick={() => handleDelete(v.id, v.name)}><LuTrash2 /></button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ══════════════════════════════════════
            Tab: Bookings (with Filters + Export)
           ══════════════════════════════════════ */}
        {activeTab === 'bookings' && (
          <div className="admin-bookings slide-up">
            <div className="admin-bookings-toolbar">
              <div className="admin-search-bar">
                <LuSearch />
                <input type="text" placeholder={t('admin.search')} value={bookingSearch} onChange={e => setBookingSearch(e.target.value)} />
              </div>
              <div className="admin-filter-row">
                <select className="form-input admin-filter-select" value={bookingFilter} onChange={e => setBookingFilter(e.target.value)}>
                  <option value="all">{t('admin.allStatuses')}</option>
                  <option value="pending">{t('status.pending')}</option>
                  <option value="confirmed">{t('status.confirmed')}</option>
                  <option value="active">{t('status.active')}</option>
                  <option value="completed">{t('status.completed')}</option>
                  <option value="cancelled">{t('status.cancelled')}</option>
                </select>
                <input type="date" className="form-input admin-filter-date" value={bookingDateFrom} onChange={e => setBookingDateFrom(e.target.value)} />
                <input type="date" className="form-input admin-filter-date" value={bookingDateTo} onChange={e => setBookingDateTo(e.target.value)} />
                <button className="admin-export-btn" onClick={exportCSV}><LuDownload /> CSV</button>
              </div>
            </div>

            <h3 className="admin-section-title">{t('admin.bookings')} ({filteredBookings.length})</h3>
            {filteredBookings.length > 0 ? (
              <div className="admin-bookings-list">
                {filteredBookings.map(b => {
                  const status = bookingService.getStatusInfo(b.status);
                  return (
                    <div key={b.id} className="admin-booking-card">
                      <div className="admin-booking-top">
                        <div className="admin-booking-vehicle">
                          {b.vehicleImage && <img src={b.vehicleImage} alt={b.vehicleName} className="admin-booking-img" />}
                          <div>
                            <strong>{b.vehicleName}</strong>
                            <span className="admin-booking-user">👤 {b.userName || 'Client'} {b.userEmail ? `(${b.userEmail})` : ''}</span>
                          </div>
                        </div>
                        <span className={`booking-status booking-status--${status.color}`}>{status.label}</span>
                      </div>
                      <div className="admin-booking-details">
                        <span>💰 {b.total}€</span>
                        <span>⏱ {bookingService.getDurationLabel(b.duration)}</span>
                        {b.startDate && <span>📅 {new Date(b.startDate).toLocaleDateString(i18n.language === 'fr' ? 'fr-FR' : 'en-US')}</span>}
                        {b.pickupLocation && <span>📍 {b.pickupLocation}</span>}
                        {b.withDriver && <span>🚗 {t('admin.driver')}</span>}
                      </div>
                      <div className="admin-booking-actions">
                        {b.status === 'pending' && (
                          <>
                            <button className="admin-action-btn admin-action-btn--confirm" onClick={() => handleStatusChange(b.id, 'confirmed')}>
                              <LuCheck /> {t('admin.confirm')}
                            </button>
                            <button className="admin-action-btn admin-action-btn--cancel" onClick={() => handleStatusChange(b.id, 'cancelled')}>
                              <LuX /> {t('admin.reject')}
                            </button>
                          </>
                        )}
                        {b.status === 'confirmed' && (
                          <button className="admin-action-btn admin-action-btn--confirm" onClick={() => handleStatusChange(b.id, 'active')}>
                            {t('admin.markActive')}
                          </button>
                        )}
                        {b.status === 'active' && (
                          <button className="admin-action-btn admin-action-btn--confirm" onClick={() => handleStatusChange(b.id, 'completed')}>
                            {t('admin.markCompleted')}
                          </button>
                        )}
                        <button className="admin-action-btn admin-action-btn--delete" onClick={() => handleDeleteBooking(b.id)}>
                          <LuTrash2 />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="admin-empty">{t('admin.noBookings')}</p>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════
            Tab: Users
           ══════════════════════════════════════ */}
        {activeTab === 'users' && (
          <div className="admin-users slide-up">
            <h3 className="admin-section-title">{t('admin.registeredUsers')} ({users.length})</h3>
            {users.length > 0 ? (
              <div className="admin-users-list">
                {users.map(u => (
                  <div key={u.id} className={`admin-user-card ${u.blocked ? 'admin-user-card--blocked' : ''}`}>
                    <div className="admin-user-avatar">
                      {u.avatar ? <img src={u.avatar} alt={u.name} /> : <span>{(u.name || u.email)[0].toUpperCase()}</span>}
                    </div>
                    <div className="admin-user-info">
                      <strong>{u.name || t('admin.noName')}</strong>
                      <span>{u.email}</span>
                      {u.phone && <span>📞 {u.phone}</span>}
                      {u.blocked && <span className="admin-user-badge-blocked">{t('admin.blocked')}</span>}
                    </div>
                    <div className="admin-user-actions">
                      <button className={`admin-action-btn ${u.blocked ? 'admin-action-btn--confirm' : 'admin-action-btn--cancel'}`} onClick={() => handleToggleBlock(u.id)}>
                        {u.blocked ? t('admin.unblock') : t('admin.block')}
                      </button>
                      <button className="admin-action-btn admin-action-btn--delete" onClick={() => handleDeleteUser(u.id)}>
                        <LuTrash2 />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="admin-empty">{t('admin.noUsers')}</p>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════
            Tab: Promos
           ══════════════════════════════════════ */}
        {activeTab === 'promos' && (
          <div className="admin-promos slide-up">
            <button className="admin-add-btn" onClick={() => setShowPromoForm(!showPromoForm)}>
              <LuPlus />
              <span>{showPromoForm ? t('admin.cancelAction') : t('admin.createPromo')}</span>
            </button>

            {showPromoForm && (
              <form className="admin-form" onSubmit={handlePromoSubmit}>
                <div className="admin-form-grid">
                  <div className="form-group">
                    <label className="form-label">{t('admin.code')}</label>
                    <input className="form-input" value={promoForm.code} onChange={e => setPromoForm(p => ({ ...p, code: e.target.value }))} placeholder="SUMMER25" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t('admin.discount')}</label>
                    <input className="form-input" type="number" min="1" value={promoForm.discount} onChange={e => setPromoForm(p => ({ ...p, discount: e.target.value }))} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t('admin.formType')}</label>
                    <select className="form-input" value={promoForm.type} onChange={e => setPromoForm(p => ({ ...p, type: e.target.value }))}>
                      <option value="percent">{t('admin.percent')}</option>
                      <option value="fixed">{t('admin.fixed')}</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t('admin.minAmount')}</label>
                    <input className="form-input" type="number" min="0" value={promoForm.minAmount} onChange={e => setPromoForm(p => ({ ...p, minAmount: e.target.value }))} placeholder="0" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t('admin.maxUses')}</label>
                    <input className="form-input" type="number" min="0" value={promoForm.maxUses} onChange={e => setPromoForm(p => ({ ...p, maxUses: e.target.value }))} placeholder={t('admin.unlimited')} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t('admin.expiresAt')}</label>
                    <input className="form-input" type="date" value={promoForm.expiresAt} onChange={e => setPromoForm(p => ({ ...p, expiresAt: e.target.value }))} />
                  </div>
                </div>
                <button type="submit" className="btn-primary">{t('admin.createPromoBtn')}</button>
              </form>
            )}

            <h3 className="admin-section-title" style={{ marginTop: '1.5rem' }}>{t('admin.promoCodes')} ({promos.length})</h3>
            {promos.length > 0 ? (
              <div className="admin-promos-list">
                {promos.map(p => (
                  <div key={p.id} className={`admin-promo-card ${!p.active ? 'admin-promo-card--inactive' : ''}`}>
                    <div className="admin-promo-info">
                      <span className="admin-promo-code">{p.code}</span>
                      <span className="admin-promo-discount">
                        -{p.discount}{p.type === 'percent' ? '%' : '€'}
                      </span>
                    </div>
                    <div className="admin-promo-meta">
                      {p.minAmount > 0 && <span>Min: {p.minAmount}€</span>}
                      <span>{t('admin.used')}: {p.usedCount}x{p.maxUses > 0 ? `/${p.maxUses}` : ''}</span>
                      {p.expiresAt && <span>{t('admin.expires')}: {new Date(p.expiresAt).toLocaleDateString(i18n.language === 'fr' ? 'fr-FR' : 'en-US')}</span>}
                    </div>
                    <div className="admin-promo-actions">
                      <button className={`admin-action-btn ${p.active ? 'admin-action-btn--cancel' : 'admin-action-btn--confirm'}`} onClick={() => handleTogglePromo(p.id)}>
                        {p.active ? t('admin.deactivate') : t('admin.activate')}
                      </button>
                      <button className="admin-action-btn admin-action-btn--delete" onClick={() => handleDeletePromo(p.id)}>
                        <LuTrash2 />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="admin-empty">{t('admin.noPromos')}</p>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════
            Tab: Agencies
           ══════════════════════════════════════ */}
        {activeTab === 'agencies' && (
          <div className="admin-agencies slide-up">
            <h3 className="admin-section-title">{t('admin.manageAgencies')} ({agencies.length})</h3>

            {agencies.map(a => (
              <div key={a.id} className="admin-agency-card">
                {editingAgency === a.id ? (
                  <form className="admin-agency-form" onSubmit={handleAgencySubmit}>
                    <div className="admin-agency-form-row">
                      <div className="form-group" style={{ flex: 2 }}>
                        <label className="form-label"><LuHome size={13} /> {t('admin.name')}</label>
                        <input className="form-input" value={agencyForm.name} onChange={e => setAgencyForm(p => ({ ...p, name: e.target.value }))} required />
                      </div>
                      <div className="form-group" style={{ flex: 3 }}>
                        <label className="form-label"><LuMapPin size={13} /> {t('admin.address')}</label>
                        <input className="form-input" value={agencyForm.address} onChange={e => setAgencyForm(p => ({ ...p, address: e.target.value }))} />
                      </div>
                    </div>
                    <div className="admin-agency-form-row">
                      <div className="form-group" style={{ flex: 1 }}>
                        <label className="form-label"><LuPhone size={13} /> {t('admin.phone')}</label>
                        <input className="form-input" value={agencyForm.phone} onChange={e => setAgencyForm(p => ({ ...p, phone: e.target.value }))} />
                      </div>
                      <div className="form-group" style={{ flex: 1 }}>
                        <label className="form-label"><LuClock4 size={13} /> {t('admin.hours')}</label>
                        <input className="form-input" value={agencyForm.hours} onChange={e => setAgencyForm(p => ({ ...p, hours: e.target.value }))} />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label"><LuImage size={13} /> {t('admin.photo')}</label>
                      <input type="file" accept="image/*" className="form-input" onChange={handleAgencyImageUpload} />
                      <input className="form-input" value={agencyForm.image} onChange={e => setAgencyForm(p => ({ ...p, image: e.target.value }))} placeholder={t('admin.orImageUrl')} style={{ marginTop: '0.5rem' }} />
                    </div>
                    {agencyForm.image && <img src={agencyForm.image} alt="Preview" className="admin-agency-preview" />}
                    <div className="admin-agency-form-actions">
                      <button type="submit" className="admin-action-btn admin-action-btn--confirm">
                        <LuCheck /> {t('admin.save')}
                      </button>
                      <button type="button" className="admin-action-btn admin-action-btn--cancel" onClick={handleCancelAgencyEdit}>
                        <LuX /> {t('admin.cancelAction')}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="admin-agency-display">
                    <img src={a.image} alt={a.name} className="admin-agency-img" />
                    <div className="admin-agency-info">
                      <strong>{a.name}</strong>
                      <span><LuMapPin size={12} /> {a.address}</span>
                      <span><LuPhone size={12} /> {a.phone}</span>
                      <span><LuClock4 size={12} /> {a.hours}</span>
                    </div>
                    <div className="admin-agency-actions">
                      <button className="admin-edit-btn" onClick={() => handleEditAgency(a)}><LuPencil /></button>
                      <button className="admin-delete-btn" onClick={() => handleDeleteAgency(a.id)}><LuTrash2 /></button>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {!editingAgency && (
              <button className="admin-add-btn" style={{ marginTop: '1rem' }} onClick={() => { setEditingAgency('new'); setAgencyForm({ name: '', address: '', phone: '', hours: '', image: '' }); }}>
                <LuPlus /> {t('admin.addAgency')}
              </button>
            )}

            {editingAgency === 'new' && (
              <form className="admin-form slide-up" onSubmit={async (e) => { e.preventDefault(); if (!agencyForm.name) { toast.error(t('admin.agencyRequired')); return; } await agencyService.create(agencyForm); await refreshAgencies(); setEditingAgency(null); setAgencyForm({ name: '', address: '', phone: '', hours: '', image: '' }); toast.success(t('admin.agencyAdded')); }}>
                <h3 className="admin-form-section-title">{t('admin.newAgency')}</h3>
                <div className="admin-form-grid">
                  <div className="form-group"><label className="form-label">{t('admin.formName')}</label><input className="form-input" value={agencyForm.name} onChange={e => setAgencyForm(p => ({ ...p, name: e.target.value }))} required /></div>
                  <div className="form-group"><label className="form-label">{t('admin.address')}</label><input className="form-input" value={agencyForm.address} onChange={e => setAgencyForm(p => ({ ...p, address: e.target.value }))} /></div>
                  <div className="form-group"><label className="form-label">{t('admin.phone')}</label><input className="form-input" value={agencyForm.phone} onChange={e => setAgencyForm(p => ({ ...p, phone: e.target.value }))} /></div>
                  <div className="form-group"><label className="form-label">{t('admin.hours')}</label><input className="form-input" value={agencyForm.hours} onChange={e => setAgencyForm(p => ({ ...p, hours: e.target.value }))} /></div>
                </div>
                <div className="form-group">
                  <label className="form-label">{t('admin.photo')}</label>
                  <input type="file" accept="image/*" className="form-input" onChange={handleAgencyImageUpload} />
                  <input className="form-input" value={agencyForm.image} onChange={e => setAgencyForm(p => ({ ...p, image: e.target.value }))} placeholder={t('admin.orImageUrl')} style={{ marginTop: '0.5rem' }} />
                  {agencyForm.image && <img src={agencyForm.image} alt="Preview" className="admin-agency-preview" />}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button type="submit" className="btn-primary">{t('admin.add')}</button>
                  <button type="button" className="admin-action-btn admin-action-btn--cancel" onClick={handleCancelAgencyEdit}><LuX /> {t('admin.cancelAction')}</button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════
            Tab: Calendar
           ══════════════════════════════════════ */}
        {activeTab === 'calendar' && (
          <div className="admin-calendar slide-up">
            <div className="admin-calendar-header">
              <button className="admin-cal-nav" onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1))}>◀</button>
              <h3 className="admin-section-title" style={{ margin: 0, textTransform: 'capitalize' }}>{calendarData.monthLabel}</h3>
              <button className="admin-cal-nav" onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1))}>▶</button>
            </div>
            <div className="admin-calendar-weekdays">
              {t('admin.weekdays', { returnObjects: true }).map(d => <span key={d}>{d}</span>)}
            </div>
            <div className="admin-calendar-grid">
              {calendarData.days.map((d, i) => (
                <div key={i} className={`admin-cal-day ${d ? '' : 'admin-cal-day--empty'} ${d && d.bookings.length > 0 ? 'admin-cal-day--has-bookings' : ''}`}>
                  {d && (
                    <>
                      <span className="admin-cal-day-num">{d.day}</span>
                      {d.bookings.length > 0 && (
                        <div className="admin-cal-day-dots">
                          {d.bookings.slice(0, 3).map((b, j) => (
                            <span key={j} className={`admin-cal-dot admin-cal-dot--${b.status}`} title={`${b.vehicleName} - ${b.userName || 'Client'}`} />
                          ))}
                          {d.bookings.length > 3 && <span className="admin-cal-more">+{d.bookings.length - 3}</span>}
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
            <div className="admin-cal-legend">
              <span><span className="admin-cal-dot admin-cal-dot--pending" /> {t('status.pending')}</span>
              <span><span className="admin-cal-dot admin-cal-dot--confirmed" /> {t('status.confirmed')}</span>
              <span><span className="admin-cal-dot admin-cal-dot--active" /> {t('status.active')}</span>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════
            Tab: Tracking
           ══════════════════════════════════════ */}
        {activeTab === 'tracking' && (
          <div className="admin-tracking slide-up">
            <h3 className="admin-section-title">{t('admin.trackingMap')}</h3>
            <LocationMap
              locations={allBookings
                .filter(b => b.pickupLocation && (b.status === 'active' || b.status === 'confirmed' || b.status === 'pending'))
                .map(b => ({
                  address: b.pickupLocation,
                  label: `🚗 ${b.vehicleName}`,
                  detail: `👤 ${b.userName || 'Client'} — ${b.pickupLocation}`,
                  type: 'vehicle'
                }))}
              height="350px"
            />
            <h3 className="admin-section-title" style={{ marginTop: '1.5rem' }}>{t('admin.vehicleTracking')}</h3>
            <div className="admin-tracking-list">
              {vehiclesData.map(v => {
                const activeBooking = allBookings.find(b => b.vehicleId === v.id && (b.status === 'active' || b.status === 'confirmed'));
                return (
                  <div key={v.id} className="admin-tracking-card">
                    <img src={v.image} alt={v.name} className="admin-tracking-img" />
                    <div className="admin-tracking-info">
                      <strong>{v.name}</strong>
                      <span className={`admin-tracking-status ${activeBooking ? 'admin-tracking-status--rented' : 'admin-tracking-status--available'}`}>
                        {activeBooking ? t('admin.rented') : t('admin.availableStatus')}
                      </span>
                      {activeBooking && (
                        <div className="admin-tracking-detail">
                          <span>👤 {activeBooking.userName || 'Client'}</span>
                          {activeBooking.pickupLocation && <span>📍 {activeBooking.pickupLocation}</span>}
                          {activeBooking.startDate && <span>📅 {new Date(activeBooking.startDate).toLocaleDateString(i18n.language === 'fr' ? 'fr-FR' : 'en-US')}</span>}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {/* Confirm Modal */}
        <ConfirmModal
          isOpen={confirmModal.open}
          title={confirmModal.title}
          message={confirmModal.message}
          variant={confirmModal.variant}
          onConfirm={confirmModal.onConfirm}
          onCancel={closeConfirm}
        />
      </div>
    </div>
  );
};

export default Admin;
