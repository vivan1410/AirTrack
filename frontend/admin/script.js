console.log("AIRTRACK ADMIN SCRIPT LOADED");

/**
 * AirTrack — Admin Operations Control Center Logic
 * Handles Dashboard, CRUD for Flights/Gates/Announcements, Activity Log, and the Simulator.
 */

// 1. HARDCODED SEED DATA
const seedGates = [
  { id: 1, gateNumber: "A01", terminal: "1", status: "Boarding" },
  { id: 2, gateNumber: "A02", terminal: "1", status: "Available" },
  { id: 3, gateNumber: "A03", terminal: "1", status: "Occupied" },
  { id: 4, gateNumber: "B01", terminal: "2", status: "Occupied" },
  { id: 5, gateNumber: "B02", terminal: "2", status: "Available" },
  { id: 6, gateNumber: "B04", terminal: "2", status: "Boarding" },
  { id: 7, gateNumber: "B05", terminal: "2", status: "Maintenance" }
];

const seedFlights = [
  {
    id: 1,
    flightNumber: "AI 539",
    airline: "Air India",
    airlineCode: "AI",
    origin: "Delhi (DEL)",
    originCode: "DEL",
    destination: "Chennai (MAA)",
    destinationCode: "MAA",
    scheduledDeparture: "14:30",
    estimatedDeparture: "15:05",
    scheduledArrival: "17:15",
    estimatedArrival: "17:50",
    gateId: 6,
    terminal: "2",
    status: "Delayed",
    delayMinutes: 35
  },
  {
    id: 2,
    flightNumber: "6E 621",
    airline: "IndiGo",
    airlineCode: "6E",
    origin: "Bengaluru (BLR)",
    originCode: "BLR",
    destination: "Chennai (MAA)",
    destinationCode: "MAA",
    scheduledDeparture: "08:15",
    estimatedDeparture: "08:15",
    scheduledArrival: "09:20",
    estimatedArrival: "09:20",
    gateId: 1,
    terminal: "1",
    status: "On Time",
    delayMinutes: 0
  },
  {
    id: 3,
    flightNumber: "UK 832",
    airline: "Vistara",
    airlineCode: "UK",
    origin: "Mumbai (BOM)",
    originCode: "BOM",
    destination: "Chennai (MAA)",
    destinationCode: "MAA",
    scheduledDeparture: "11:50",
    estimatedDeparture: "12:00",
    scheduledArrival: "13:45",
    estimatedArrival: "13:55",
    gateId: 3,
    terminal: "1",
    status: "Boarding",
    delayMinutes: 10
  },
  {
    id: 4,
    flightNumber: "SG 401",
    airline: "SpiceJet",
    airlineCode: "SG",
    origin: "Chennai (MAA)",
    originCode: "MAA",
    destination: "Delhi (DEL)",
    destinationCode: "DEL",
    scheduledDeparture: "17:10",
    estimatedDeparture: "17:10",
    scheduledArrival: "19:50",
    estimatedArrival: "19:50",
    gateId: 4,
    terminal: "2",
    status: "On Time",
    delayMinutes: 0
  },
  {
    id: 5,
    flightNumber: "EK 542",
    airline: "Emirates",
    airlineCode: "EK",
    origin: "Chennai (MAA)",
    originCode: "MAA",
    destination: "Dubai (DXB)",
    destinationCode: "DXB",
    scheduledDeparture: "09:45",
    estimatedDeparture: "09:45",
    scheduledArrival: "12:15",
    estimatedArrival: "12:15",
    gateId: 5,
    terminal: "2",
    status: "Departed",
    delayMinutes: 0
  },
  {
    id: 6,
    flightNumber: "QR 528",
    airline: "Qatar Airways",
    airlineCode: "QR",
    origin: "Chennai (MAA)",
    originCode: "MAA",
    destination: "Doha (DOH)",
    destinationCode: "DOH",
    scheduledDeparture: "04:10",
    estimatedDeparture: "04:10",
    scheduledArrival: "06:20",
    estimatedArrival: "06:20",
    gateId: 2,
    terminal: "1",
    status: "Departed",
    delayMinutes: 0
  },
  {
    id: 7,
    flightNumber: "AI 440",
    airline: "Air India",
    airlineCode: "AI",
    origin: "Chennai (MAA)",
    originCode: "MAA",
    destination: "Mumbai (BOM)",
    destinationCode: "BOM",
    scheduledDeparture: "19:30",
    estimatedDeparture: "20:15",
    scheduledArrival: "21:20",
    estimatedArrival: "22:05",
    gateId: 6,
    terminal: "2",
    status: "Gate Changed",
    delayMinutes: 45
  },
  {
    id: 8,
    flightNumber: "IX 382",
    airline: "Air India Express",
    airlineCode: "IX",
    origin: "Kolkata (CCU)",
    originCode: "CCU",
    destination: "Chennai (MAA)",
    destinationCode: "MAA",
    scheduledDeparture: "13:00",
    estimatedDeparture: "--:--",
    scheduledArrival: "15:20",
    estimatedArrival: "--:--",
    gateId: null,
    terminal: "1",
    status: "Cancelled",
    delayMinutes: 0
  }
];

const seedAnnouncements = [
  { id: 1, type: 'Gate Change', flightNumber: 'AI 440', message: 'AI 440 has been reassigned from Gate B03 to Gate B04. Please proceed to the updated departure gate.', time: '2 min ago', unread: true },
  { id: 2, type: 'Delay Alert', flightNumber: 'AI 539', message: 'AI 539 to Chennai is currently delayed by 35 minutes. Updated estimated departure: 15:05.', time: '8 min ago', unread: true },
  { id: 3, type: 'Boarding', flightNumber: 'UK 832', message: 'UK 832 to Chennai is now boarding at Gate A03.', time: '15 min ago', unread: true },
  { id: 4, type: 'Cancellation', flightNumber: 'IX 382', message: 'IX 382 from Kolkata to Chennai has been cancelled.', time: '22 min ago', unread: true }
];

const seedActivityLogs = [
  { time: "14:05", type: "Gate Change", flightNumber: "AI 440", description: "AI 440 gate changed B03 → B04" },
  { time: "13:52", type: "Delay Alert", flightNumber: "AI 539", description: "AI 539 delay updated 20 min → 35 min" },
  { time: "13:40", type: "Boarding", flightNumber: "UK 832", description: "UK 832 boarding started" },
  { time: "13:15", type: "Cancellation", flightNumber: "IX 382", description: "IX 382 cancellation recorded" }
];

const seedAdministrators = [
  { id: 1, name: "Vivan Sharma", email: "admin@airtrack.demo", role: "Super Administrator", status: "Active", createdDate: "2026-08-15" },
  { id: 2, name: "John Doe", email: "john.doe@airtrack.demo", role: "Operations Officer", status: "Active", createdDate: "2026-08-20" },
  { id: 3, name: "Jane Smith", email: "jane.smith@airtrack.demo", role: "Operations Officer", status: "Inactive", createdDate: "2026-08-22" }
];

// Memory state fallback
let memoryFlights = [...seedFlights];
let memoryGates = [...seedGates];
let memoryAnnouncements = [...seedAnnouncements];
let memoryActivityLogs = [...seedActivityLogs];
let memoryAdministrators = [...seedAdministrators];

// 2. SHARED DATABASE ACCESS LAYER
const localDb = {
  getFlights() {
    try {
      const stored = localStorage.getItem('airtrack_flights_v3');
      if (!stored) {
        localStorage.setItem('airtrack_flights_v3', JSON.stringify(seedFlights));
        return JSON.parse(JSON.stringify(seedFlights));
      }
      return JSON.parse(stored);
    } catch (e) {
      return memoryFlights;
    }
  },
  saveFlights(flights) {
    try {
      localStorage.setItem('airtrack_flights_v3', JSON.stringify(flights));
    } catch (e) {}
    memoryFlights = flights;
  },
  getGates() {
    try {
      const stored = localStorage.getItem('airtrack_gates_v3');
      if (!stored) {
        localStorage.setItem('airtrack_gates_v3', JSON.stringify(seedGates));
        return JSON.parse(JSON.stringify(seedGates));
      }
      return JSON.parse(stored);
    } catch (e) {
      return memoryGates;
    }
  },
  saveGates(gates) {
    try {
      localStorage.setItem('airtrack_gates_v3', JSON.stringify(gates));
    } catch (e) {}
    memoryGates = gates;
  },
  getAnnouncements() {
    try {
      const stored = localStorage.getItem('airtrack_announcements_v3');
      if (!stored) {
        localStorage.setItem('airtrack_announcements_v3', JSON.stringify(seedAnnouncements));
        return JSON.parse(JSON.stringify(seedAnnouncements));
      }
      return JSON.parse(stored);
    } catch (e) {
      return memoryAnnouncements;
    }
  },
  saveAnnouncements(data) {
    try {
      localStorage.setItem('airtrack_announcements_v3', JSON.stringify(data));
    } catch (e) {}
    memoryAnnouncements = data;
  },
  getActivityLogs() {
    try {
      const stored = localStorage.getItem('airtrack_activity_logs_v3');
      if (!stored) {
        localStorage.setItem('airtrack_activity_logs_v3', JSON.stringify(seedActivityLogs));
        return JSON.parse(JSON.stringify(seedActivityLogs));
      }
      return JSON.parse(stored);
    } catch (e) {
      return memoryActivityLogs;
    }
  },
  saveActivityLogs(data) {
    try {
      localStorage.setItem('airtrack_activity_logs_v3', JSON.stringify(data));
    } catch (e) {}
    memoryActivityLogs = data;
  },
  getAdministrators() {
    try {
      const stored = localStorage.getItem('airtrack_administrators_v3');
      if (!stored) {
        localStorage.setItem('airtrack_administrators_v3', JSON.stringify(seedAdministrators));
        return JSON.parse(JSON.stringify(seedAdministrators));
      }
      return JSON.parse(stored);
    } catch (e) {
      return memoryAdministrators;
    }
  },
  saveAdministrators(data) {
    try {
      localStorage.setItem('airtrack_administrators_v3', JSON.stringify(data));
    } catch (e) {}
    memoryAdministrators = data;
  }
};

// State variables
let flightsData = [];
let gatesData = [];
let announcementsData = [];
let activityLogs = [];
let administratorsData = [];

function syncDataStore() {
  flightsData = localDb.getFlights();
  gatesData = localDb.getGates();
  announcementsData = localDb.getAnnouncements();
  activityLogs = localDb.getActivityLogs();
  administratorsData = localDb.getAdministrators();
}

// 3. ADMIN OPERATIONS CONTROLLER
const adminUI = {
  deleteTarget: null // { type: 'flight'|'gate'|'announcement', id: Number, name: String }
};

// Utilities
function getStatusClass(status) {
  if (!status) return '';
  switch (status.toLowerCase()) {
    case 'on time': return 'on-time';
    case 'boarding': return 'boarding';
    case 'delayed': return 'delayed';
    case 'gate changed': return 'gate-changed';
    case 'departed': return 'departed';
    case 'cancelled': return 'cancelled';
    case 'available': return 'on-time';
    case 'occupied': return 'boarding';
    case 'maintenance': return 'maintenance';
    default: return '';
  }
}

function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  let iconName = 'check-circle';
  if (type === 'error') iconName = 'alert-circle';
  if (type === 'warning') iconName = 'alert-triangle';

  toast.innerHTML = `
    <i data-lucide="${iconName}" style="width: 18px; height: 18px; flex-shrink: 0;"></i>
    <span style="flex-grow: 1;">${message}</span>
  `;
  container.appendChild(toast);
  if (window.lucide) window.lucide.createIcons();

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(15px)';
    setTimeout(() => toast.remove(), 400);
  }, 4500);
}

function addActivityLog(event, flightNumber, description) {
  const logs = localDb.getActivityLogs();
  const now = new Date();
  const timeStr = now.toTimeString().split(' ')[0].substring(0, 5);
  
  logs.unshift({
    time: timeStr,
    type: event,
    flightNumber: flightNumber || '—',
    description: description
  });
  localDb.saveActivityLogs(logs);
}

async function syncFlightToBackend(flight) {
  if (!flight || !flight.id) return;
  const flightId = flight.id;
  const updateFields = {
    flight_number: flight.flightNumber,
    airline: flight.airline,
    airline_code: flight.airlineCode || (flight.airline ? flight.airline.substring(0, 2).toUpperCase() : 'AI'),
    origin: flight.origin,
    origin_code: flight.originCode || (flight.origin ? flight.origin.substring(0, 3).toUpperCase() : 'DEL'),
    destination: flight.destination,
    destination_code: flight.destinationCode || (flight.destination ? flight.destination.substring(0, 3).toUpperCase() : 'MAA'),
    scheduled_departure: flight.scheduledDeparture,
    estimated_departure: flight.estimatedDeparture || flight.scheduledDeparture,
    scheduled_arrival: flight.scheduledArrival || '18:00',
    estimated_arrival: flight.estimatedArrival || flight.scheduledArrival || '18:00',
    terminal: flight.terminal,
    gate_id: flight.gateId || null,
    status: flight.status,
    delay_minutes: Number(flight.delayMinutes) || 0
  };

  // 1. Direct Supabase JS Client Update
  const client = (typeof getSupabaseClient === 'function') ? getSupabaseClient() : null;
  if (client && flightId) {
    try {
      const { error: sErr } = await client.from('flights').update(updateFields).eq('id', flightId);
      if (!sErr) {
        console.log(`[Supabase Direct] Flight ${flight.flightNumber} updated in database: status=${flight.status}`);
      } else {
        console.warn(`[Supabase Direct Error] Flight ${flight.flightNumber}:`, sErr.message);
      }
    } catch (e) {
      console.warn(`[Supabase Direct Exception] Flight ${flight.flightNumber}:`, e);
    }
  }

  // 2. REST API Endpoint Update
  try {
    const targetUrl = getBackendApiUrl(`/api/flights/${flightId}`);
    const res = await fetch(targetUrl, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateFields)
    });
    if (res.ok) {
      console.log(`[REST API Sync] Flight ${flight.flightNumber} updated in DB: status=${flight.status}`);
    }
  } catch (e) {
    console.warn(`[REST API Sync Exception] Flight ${flight.flightNumber}:`, e);
  }
}

async function syncGateToBackend(gate) {
  if (!gate || !gate.id) return;
  const gateId = gate.id;
  const updateFields = {
    gate_number: gate.gateNumber,
    terminal: gate.terminal,
    status: gate.status
  };

  // 1. Direct Supabase Client
  const client = (typeof getSupabaseClient === 'function') ? getSupabaseClient() : null;
  if (client && gateId) {
    try {
      await client.from('gates').update(updateFields).eq('id', gateId);
    } catch (e) {}
  }

  // 2. REST API
  try {
    const targetUrl = getBackendApiUrl(`/api/gates/${gateId}`);
    await fetch(targetUrl, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateFields)
    });
  } catch (e) {}
}

// 4. CENTRAL GATE CHANGE WORKFLOW
async function applyGateChange(flightNum, newGateId) {
  syncDataStore();
  
  const flight = flightsData.find(f => f.flightNumber === flightNum);
  if (!flight) {
    showToast("Flight not found", "error");
    return;
  }

  const newGate = gatesData.find(g => g.id === parseInt(newGateId));
  if (!newGate) {
    showToast("Gate not found", "error");
    return;
  }

  const oldGateId = flight.gateId;
  const oldGate = gatesData.find(g => g.id === oldGateId);
  const oldGateNum = oldGate ? oldGate.gateNumber : "None";

  // 1. Update flight gate and terminal
  flight.gateId = newGate.id;
  flight.terminal = newGate.terminal;
  flight.status = "Gate Changed";

  // 2. Free old gate (if occupied by this flight)
  if (oldGate) {
    oldGate.status = "Available";
  }

  // 3. Occupy new gate
  newGate.status = "Occupied";

  // 4. Create Announcement (shows up in user bell and banner)
  const announcements = localDb.getAnnouncements();
  
  const newAnnouncement = {
    id: announcements.length > 0 ? Math.max(...announcements.map(a => a.id)) + 1 : 1,
    type: "Gate Change",
    flightNumber: flight.flightNumber,
    message: `GATE CHANGE — ${flight.flightNumber} — ${oldGateNum} → ${newGate.gateNumber} — 'Please proceed to the updated gate.'`,
    time: "Just now",
    unread: true
  };
  announcements.unshift(newAnnouncement);

  // 5. Add Activity Log
  addActivityLog("Gate Change", flight.flightNumber, `GATE CHANGE: ${flight.flightNumber} reassigned from Gate ${oldGateNum} to Gate ${newGate.gateNumber}`);

  // 6. Save back to localStorage
  localDb.saveFlights(flightsData);
  localDb.saveGates(gatesData);
  localDb.saveAnnouncements(announcements);

  // 7. Sync to backend REST API database
  await syncFlightToBackend(flight);
  if (oldGate) await syncGateToBackend(oldGate);
  await syncGateToBackend(newGate);

  // 8. Sync views & fire localStorage update event
  showToast(`Gate change applied for ${flight.flightNumber}`, 'success');
  
  // Fire storage event manually so other open tabs sync immediately
  window.dispatchEvent(new Event('storage'));
  renderAllViews();
}

// 5. RENDER PROCEDURES
function updateAdminNavbar() {
  const sessionStr = sessionStorage.getItem('airtrack_admin_session');
  const badgeName = document.getElementById('admin-display-name');
  const badgeRole = document.getElementById('admin-display-role');
  const avatarLetters = document.getElementById('avatar-letters');
  if (sessionStr && (badgeName || badgeRole)) {
    const admin = JSON.parse(sessionStr);
    if (badgeName) badgeName.textContent = admin.name || "Operations Officer";
    if (badgeRole) badgeRole.textContent = admin.role || "Operations Officer";
    if (avatarLetters && admin.name) {
      const parts = admin.name.trim().split(/\s+/);
      if (parts.length >= 2) {
        avatarLetters.textContent = (parts[0][0] + parts[1][0]).toUpperCase();
      } else {
        avatarLetters.textContent = admin.name.substring(0, 2).toUpperCase();
      }
    }
  }
}

function renderAllViews() {
  syncDataStore();
  updateAdminNavbar();
  renderNotifications();
  applyRolePermissions();
  
  if (document.getElementById('admin-kpi-grid')) {
    renderDashboardStats();
    renderGateUtilizationSummary();
    renderOverviewAlerts();
    renderUpcomingDepartures();
  }
  if (document.getElementById('admin-flight-table-body')) {
    renderFlightsTable();
  }
  if (document.getElementById('admin-gate-table-body')) {
    renderGatesTable();
  }
  if (document.getElementById('admin-announcement-table-body')) {
    renderAnnouncementsTable();
  }
  if (document.getElementById('admin-activity-table-body') || document.getElementById('admin-activity-log-table')) {
    renderActivityLogTable();
  }
  if (document.getElementById('admin-table-body') || document.getElementById('admin-administrator-table-body')) {
    renderAdministratorsTable();
  }
  if (document.getElementById('disruption-board-list')) {
    renderDisruptionBoard();
  }
  if (document.getElementById('timeline-board-container')) {
    renderTimelineScheduleBoard();
  }
  if (document.getElementById('simulator-log-body')) {
    renderSimulatorLogs();
  }
  if (document.getElementById('sim-select-flight')) {
    populateSimulatorFlightOptions();
  }
  if (document.getElementById('set-airport-name')) {
    renderSettingsPage();
  }
}

function applyRolePermissions() {
  const sessionStr = sessionStorage.getItem('airtrack_admin_session');
  if (!sessionStr) return;
  const admin = JSON.parse(sessionStr);
  const role = admin.role || 'Operations Officer';

  // 1. Hide navbar links based on role
  const sidebarNav = document.querySelector('.sidebar-nav');
  if (sidebarNav) {
    const isSuper = role === 'Super Administrator';
    const isManager = role === 'Airport Manager';
    const isOfficer = role === 'Operations Officer';
    const isOperator = role === 'Gate Operator';

    const items = sidebarNav.querySelectorAll('.nav-item');
    items.forEach(a => {
      const href = a.getAttribute('href');
      if (href) {
        if (href.includes('administrators')) {
          a.style.display = isSuper ? 'flex' : 'none';
        }
        if (href.includes('announcements')) {
          a.style.display = (isSuper || isManager || isOfficer) ? 'flex' : 'none';
        }
        if (href.includes('activity')) {
          a.style.display = (isSuper || isOfficer) ? 'flex' : 'none';
        }
      }
    });
  }

  // 2. Hide or disable CRUD buttons based on role permissions
  const isSuper = role === 'Super Administrator';
  const isManager = role === 'Airport Manager';
  const isOfficer = role === 'Operations Officer';
  const isOperator = role === 'Gate Operator';

  // Flight CRUD permissions (Super Admin, Airport Manager, Operations Officer)
  const canManageFlights = isSuper || isManager || isOfficer;
  const btnAddFlight = document.getElementById('btn-add-flight');
  if (btnAddFlight) btnAddFlight.style.display = canManageFlights ? 'flex' : 'none';
  document.querySelectorAll('.btn-edit-flight, .btn-delete-flight').forEach(btn => {
    btn.style.display = canManageFlights ? 'inline-block' : 'none';
  });

  // Announcement CRUD permissions (Super Admin, Airport Manager, Operations Officer)
  const canManageAnnouncements = isSuper || isManager || isOfficer;
  const btnAddAnn = document.getElementById('btn-add-announcement');
  if (btnAddAnn) btnAddAnn.style.display = canManageAnnouncements ? 'flex' : 'none';
  document.querySelectorAll('.btn-edit-announcement, .btn-delete-announcement').forEach(btn => {
    btn.style.display = canManageAnnouncements ? 'inline-block' : 'none';
  });

  // Operations Simulator permissions (Super Admin, Operations Officer)
  const canSimulate = isSuper || isOfficer;
  const simPanel = document.getElementById('ops-simulator-panel');
  if (simPanel) simPanel.style.display = canSimulate ? 'block' : 'none';
  const simControls = document.querySelector('.simulator-controls');
  if (simControls) simControls.style.display = canSimulate ? 'flex' : 'none';
}

// RENDER: DASHBOARD STATS
function renderDashboardStats() {
  const totalEl = document.getElementById('kpi-total-flights');
  const delayedEl = document.getElementById('kpi-delayed-flights');
  const boardingEl = document.getElementById('kpi-boarding-flights');
  const cancelledEl = document.getElementById('kpi-cancelled-flights');
  const availEl = document.getElementById('kpi-available-gates');
  const healthBadge = document.getElementById('ops-health-badge');

  const total = flightsData.length;
  const delayed = flightsData.filter(f => f.status.toLowerCase() === 'delayed').length;
  const boarding = flightsData.filter(f => f.status.toLowerCase() === 'boarding').length;
  const cancelled = flightsData.filter(f => f.status.toLowerCase() === 'cancelled').length;
  const availGates = gatesData.filter(g => g.status.toLowerCase() === 'available').length;

  if (totalEl) totalEl.textContent = total;
  if (delayedEl) delayedEl.textContent = delayed;
  if (boardingEl) boardingEl.textContent = boarding;
  if (cancelledEl) cancelledEl.textContent = cancelled;
  if (availEl) availEl.textContent = availGates;

  if (healthBadge) {
    const attention = cancelled > 0 || delayed >= 2;
    if (attention) {
      healthBadge.className = "live-indicator";
      healthBadge.style.backgroundColor = "rgba(239, 68, 68, 0.1)";
      healthBadge.style.border = "1px solid rgba(239, 68, 68, 0.25)";
      healthBadge.style.color = "var(--status-cancelled-text)";
      healthBadge.innerHTML = `
        <div class="live-dot" style="background-color: var(--status-cancelled-text);"></div>
        <span>ATTENTION REQUIRED</span>
      `;
    } else {
      healthBadge.className = "live-indicator";
      healthBadge.style.backgroundColor = "rgba(16, 185, 129, 0.08)";
      healthBadge.style.border = "1px solid rgba(16, 185, 129, 0.15)";
      healthBadge.style.color = "#10b981";
      healthBadge.innerHTML = `
        <div class="live-dot"></div>
        <span>STABLE OPERATIONS</span>
      `;
    }
  }
}

// RENDER: DISRUPTIONS PANEL (Dashboard)
function renderOverviewAlerts() {
  const container = document.getElementById('admin-disruptions-list');
  if (!container) return;

  const disruptions = flightsData.filter(f => ['delayed', 'gate changed', 'cancelled'].includes(f.status.toLowerCase()));
  if (disruptions.length === 0) {
    container.innerHTML = `
      <div style="font-size: 0.8rem; color: var(--text-muted); text-align: center; padding: 1.5rem 0;">
        No operational disruptions reported.
      </div>
    `;
    return;
  }

  container.innerHTML = '';
  disruptions.slice(0, 4).forEach(f => {
    let icon = 'alert-triangle';
    let severity = 'warning';
    let typeName = 'Delay Alert';
    let desc = `${f.flightNumber} is delayed. Est: ${f.estimatedDeparture}.`;

    if (f.status.toLowerCase() === 'cancelled') {
      icon = 'alert-octagon';
      severity = 'critical';
      typeName = 'Cancellation';
      desc = `${f.flightNumber} cancelled.`;
    } else if (f.status.toLowerCase() === 'gate changed') {
      icon = 'git-branch';
      severity = 'info';
      typeName = 'Gate Changed';
      desc = `${f.flightNumber} reassigned gate.`;
    }

    const div = document.createElement('div');
    div.className = `alert-item ${severity}`;
    div.style.padding = '0.65rem 0.85rem';
    div.innerHTML = `
      <div class="alert-icon-box"><i data-lucide="${icon}" style="width: 14px; height: 14px;"></i></div>
      <div class="alert-content">
        <div class="alert-title" style="font-size: 0.75rem;">${f.flightNumber} — ${typeName}</div>
        <div class="alert-body" style="font-size: 0.7rem; color: var(--text-secondary);">${desc}</div>
      </div>
    `;
    container.appendChild(div);
  });
  if (window.lucide) window.lucide.createIcons();
}

// RENDER: UPCOMING DEPARTURES (Dashboard)
function renderUpcomingDepartures() {
  const container = document.getElementById('admin-upcoming-list');
  if (!container) return;

  // Show flights that are not departed or cancelled, sorted
  const activeFlights = flightsData.filter(f => !['departed', 'cancelled'].includes(f.status.toLowerCase()));
  if (activeFlights.length === 0) {
    container.innerHTML = '<p style="text-align: center; font-size: 0.8rem; color: var(--text-light); padding: 1.5rem 0;">No upcoming departures scheduled.</p>';
    return;
  }

  container.innerHTML = '';
  activeFlights.slice(0, 4).forEach(f => {
    const gateObj = gatesData.find(g => g.id === f.gateId);
    const gateNum = gateObj ? gateObj.gateNumber : "None";
    
    const div = document.createElement('div');
    div.className = 'announcement-feed-item';
    div.style.margin = '0 1.5rem 1rem';
    div.innerHTML = `
      <div style="display: flex; justify-content: space-between; font-size: 0.8rem; font-weight: 700; color: var(--primary-navy);">
        <span>${f.flightNumber} to ${f.destinationCode}</span>
        <span style="color: var(--accent-blue);">${f.estimatedDeparture}</span>
      </div>
      <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--text-medium); margin-top: 4px;">
        <span>Airline: ${f.airline}</span>
        <span>Gate: ${gateNum} (Terminal ${f.terminal || '—'})</span>
      </div>
    `;
    container.appendChild(div);
  });
}

// RENDER: GATE UTILIZATION SUMMARY (Dashboard)
function renderGateUtilizationSummary() {
  const container = document.getElementById('admin-gate-util-list');
  if (!container) return;

  container.innerHTML = '';
  gatesData.slice(0, 8).forEach(gate => {
    const flight = flightsData.find(f => f.gateId === gate.id && !['departed', 'cancelled'].includes(f.status.toLowerCase()));
    const statusLower = gate.status.toLowerCase();
    
    const div = document.createElement('div');
    div.className = `gate-visual-card ${statusLower}`;
    div.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; width:100%;">
        <span class="gate-num">${gate.gateNumber}</span>
        <span class="gate-term">T${gate.terminal}</span>
      </div>
      <div class="gate-status-tag">${flight ? flight.flightNumber : gate.status}</div>
    `;
    container.appendChild(div);
  });
}

// RENDER: FLIGHTS TABLE
function renderFlightsTable() {
  const tbody = document.getElementById('admin-flight-table-body');
  if (!tbody) return;

  const searchInput = document.getElementById('flight-search') || document.getElementById('live-search');
  const statusFilter = document.getElementById('flight-status-filter') || document.getElementById('status-filter');
  const terminalFilter = document.getElementById('flight-terminal-filter');

  const searchQuery = searchInput ? searchInput.value.trim().toLowerCase() : '';
  const statusVal = statusFilter ? statusFilter.value : 'All';
  const terminalVal = terminalFilter ? terminalFilter.value : 'All';

  let list = [...flightsData];

  if (searchQuery) {
    list = list.filter(f => f.flightNumber.toLowerCase().includes(searchQuery) ||
                            f.airline.toLowerCase().includes(searchQuery) ||
                            f.destination.toLowerCase().includes(searchQuery) ||
                            f.destinationCode.toLowerCase().includes(searchQuery));
  }

  if (statusVal !== 'All') {
    list = list.filter(f => f.status.toLowerCase() === statusVal.toLowerCase());
  }

  if (terminalVal && terminalVal !== 'All') {
    list = list.filter(f => String(f.terminal) === String(terminalVal));
  }

  list.sort((a, b) => {
    let valA = a[currentSortField] || '';
    let valB = b[currentSortField] || '';
    if (typeof valA === 'string') valA = valA.toLowerCase();
    if (typeof valB === 'string') valB = valB.toLowerCase();

    if (valA < valB) return currentSortOrder === 'asc' ? -1 : 1;
    if (valA > valB) return currentSortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  tbody.innerHTML = '';
  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="10" style="text-align: center; color: var(--text-muted); font-size: 0.8rem; padding: 2rem 0;">No matching flights logged.</td></tr>`;
    return;
  }

  list.forEach(f => {
    const gateObj = gatesData.find(g => g.id === f.gateId);
    const gateNum = gateObj ? gateObj.gateNumber : "None";
    
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="font-bold mono-val">${f.flightNumber}</td>
      <td>${f.airline}</td>
      <td class="mono-val">${f.originCode} &rarr; ${f.destinationCode}</td>
      <td class="mono-val">${f.scheduledDeparture}</td>
      <td class="mono-val ${f.delayMinutes > 0 ? 'text-danger font-semibold' : ''}">${f.estimatedDeparture}</td>
      <td><span class="badge on-time">${gateNum}</span></td>
      <td><span class="badge delayed">T${f.terminal || '—'}</span></td>
      <td><span class="badge ${getStatusClass(f.status)}">${f.status}</span></td>
      <td class="mono-val">${f.delayMinutes > 0 ? `+${f.delayMinutes}m` : '—'}</td>
      <td>
        <div style="display: flex; gap: 0.5rem;">
          <button class="btn-secondary btn-edit-flight" data-id="${f.id}" onclick="openFlightCrudModal('${f.id}')" title="Edit Flight" style="padding: 4px 8px;">
            <i data-lucide="edit-3" style="width: 14px; height: 14px; pointer-events: none;"></i>
          </button>
          <button class="btn-danger btn-delete-flight" data-id="${f.id}" data-name="${f.flightNumber}" onclick="confirmDelete('flight', '${f.id}', '${f.flightNumber}')" title="Delete Flight" style="padding: 4px 8px;">
            <i data-lucide="trash-2" style="width: 14px; height: 14px; pointer-events: none;"></i>
          </button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });

  tbody.querySelectorAll('.btn-edit-flight').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const targetBtn = e.target.closest('.btn-edit-flight') || btn;
      openFlightCrudModal(targetBtn.dataset.id);
    });
  });
  tbody.querySelectorAll('.btn-delete-flight').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const targetBtn = e.target.closest('.btn-delete-flight') || btn;
      confirmDelete('flight', targetBtn.dataset.id, targetBtn.dataset.name);
    });
  });
  if (window.lucide) window.lucide.createIcons();
}

// RENDER: GATES TABLE
function renderGatesTable() {
  const tbody = document.getElementById('admin-gate-table-body');
  if (!tbody) return;

  const searchInput = document.getElementById('gate-search');
  const statusFilter = document.getElementById('gate-status-filter');
  const terminalFilter = document.getElementById('gate-terminal-filter');

  const searchQuery = searchInput ? searchInput.value.trim().toLowerCase() : '';
  const statusVal = statusFilter ? statusFilter.value : 'All';
  const terminalVal = terminalFilter ? terminalFilter.value : 'All';

  let list = [...gatesData];

  if (searchQuery) {
    list = list.filter(g => g.gateNumber.toLowerCase().includes(searchQuery));
  }
  if (statusVal !== 'All') {
    list = list.filter(g => g.status.toLowerCase() === statusVal.toLowerCase());
  }
  if (terminalVal !== 'All') {
    list = list.filter(g => String(g.terminal) === String(terminalVal));
  }

  tbody.innerHTML = '';
  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-muted); font-size: 0.8rem; padding: 2rem 0;">No matching gates allocated.</td></tr>`;
    return;
  }

  list.forEach(g => {
    const flight = flightsData.find(f => f.gateId === g.id && !['departed', 'cancelled'].includes(f.status.toLowerCase()));
    
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="font-bold mono-val">Gate ${g.gateNumber}</td>
      <td>Terminal ${g.terminal}</td>
      <td><span class="badge ${getStatusClass(g.status)}">${g.status}</span></td>
      <td>${flight ? `<span class="font-bold text-main mono-val">${flight.flightNumber}</span> (to ${flight.destinationCode})` : '—'}</td>
      <td>
        <div style="display: flex; gap: 0.5rem;">
          <button class="btn-secondary btn-edit-gate" data-id="${g.id}" onclick="openGateCrudModal('${g.id}')" title="Edit Gate" style="padding: 4px 8px;">
            <i data-lucide="edit-3" style="width: 14px; height: 14px; pointer-events: none;"></i>
          </button>
          <button class="btn-danger btn-delete-gate" data-id="${g.id}" data-name="Gate ${g.gateNumber}" onclick="confirmDelete('gate', '${g.id}', 'Gate ${g.gateNumber}')" title="Delete Gate" style="padding: 4px 8px;">
            <i data-lucide="trash-2" style="width: 14px; height: 14px; pointer-events: none;"></i>
          </button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });

  tbody.querySelectorAll('.btn-edit-gate').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const targetBtn = e.target.closest('.btn-edit-gate') || btn;
      openGateCrudModal(targetBtn.dataset.id);
    });
  });
  tbody.querySelectorAll('.btn-delete-gate').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const targetBtn = e.target.closest('.btn-delete-gate') || btn;
      confirmDelete('gate', targetBtn.dataset.id, targetBtn.dataset.name);
    });
  });
  if (window.lucide) window.lucide.createIcons();
}

// RENDER: ANNOUNCEMENTS TABLE
function renderAnnouncementsTable() {
  const tbody = document.getElementById('admin-announcement-table-body');
  if (!tbody) return;

  const searchInput = document.getElementById('announcement-search');
  const typeFilter = document.getElementById('announcement-type-filter');

  const searchQuery = searchInput ? searchInput.value.trim().toLowerCase() : '';
  const typeVal = typeFilter ? typeFilter.value : 'All';

  let list = [...announcementsData];

  if (searchQuery) {
    list = list.filter(a => a.flightNumber.toLowerCase().includes(searchQuery) ||
                            a.message.toLowerCase().includes(searchQuery));
  }
  if (typeVal !== 'All') {
    list = list.filter(a => a.type.toLowerCase() === typeVal.toLowerCase());
  }

  tbody.innerHTML = '';
  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-muted); font-size: 0.8rem; padding: 2rem 0;">No matching announcements logged.</td></tr>`;
    return;
  }

  list.forEach(a => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><span class="badge on-time" style="font-size:0.7rem; padding: 2px 6px;">${a.type}</span></td>
      <td class="font-bold mono-val">${a.flightNumber}</td>
      <td style="font-size:0.85rem; max-width: 400px; color: var(--text-secondary);">${a.message}</td>
      <td class="mono-val">${a.time}</td>
      <td>
        <div style="display: flex; gap: 0.5rem;">
          <button class="btn-secondary btn-edit-announcement" data-id="${a.id}" onclick="openAnnouncementCrudModal('${a.id}')" title="Edit Announcement" style="padding: 4px 8px;">
            <i data-lucide="edit-3" style="width: 14px; height: 14px; pointer-events: none;"></i>
          </button>
          <button class="btn-danger btn-delete-announcement" data-id="${a.id}" data-name="Announcement #${a.id}" onclick="confirmDelete('announcement', '${a.id}', 'Announcement #${a.id}')" title="Delete Announcement" style="padding: 4px 8px;">
            <i data-lucide="trash-2" style="width: 14px; height: 14px; pointer-events: none;"></i>
          </button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });

  tbody.querySelectorAll('.btn-edit-announcement').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const targetBtn = e.target.closest('.btn-edit-announcement') || btn;
      openAnnouncementCrudModal(targetBtn.dataset.id);
    });
  });
  tbody.querySelectorAll('.btn-delete-announcement').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const targetBtn = e.target.closest('.btn-delete-announcement') || btn;
      confirmDelete('announcement', targetBtn.dataset.id, targetBtn.dataset.name);
    });
  });
  if (window.lucide) window.lucide.createIcons();
}

// RENDER: ACTIVITY LOG TABLE
function renderActivityLogTable() {
  const tbody = document.getElementById('admin-activity-table-body') || document.getElementById('sim-activity-log-body');
  if (!tbody) return;

  const searchInput = document.getElementById('activity-search');
  const typeFilter = document.getElementById('activity-type-filter');

  const searchQuery = searchInput ? searchInput.value.trim().toLowerCase() : '';
  const typeVal = typeFilter ? typeFilter.value : 'All';

  let list = [...activityLogs];

  if (searchQuery) {
    list = list.filter(log => log.flightNumber.toLowerCase().includes(searchQuery) ||
                              log.description.toLowerCase().includes(searchQuery));
  }
  if (typeVal !== 'All') {
    list = list.filter(log => log.type.toLowerCase() === typeVal.toLowerCase());
  }

  tbody.innerHTML = '';
  if (list.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; color: var(--text-muted); font-size: 0.8rem; padding: 2rem 0;">No activities logged.</td></tr>';
    return;
  }

  list.forEach(log => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="mono-val">${log.time}</td>
      <td><span class="badge delayed" style="font-size:0.65rem; padding: 2px 6px;">${log.type}</span></td>
      <td class="font-bold mono-val">${log.flightNumber}</td>
      <td style="font-size: 0.8rem; color: var(--text-secondary);">${log.description}</td>
    `;
    tbody.appendChild(tr);
  });
}

// Fetch administrators dynamically from the database
async function fetchAdministrators() {
  const client = getSupabaseClient();
  if (client) {
    try {
      const { data: { session } } = await client.auth.getSession();
      const token = session ? session.access_token : '';
      const res = await fetch(getBackendApiUrl('/api/admin/administrators'), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const result = await res.json();
        administratorsData = result.administrators;
      } else {
        let errorMsg = "Failed to fetch administrators";
        try {
          const err = await res.json();
          errorMsg = err.error || errorMsg;
        } catch (_) {}
        showToast(errorMsg, "error");
      }
    } catch (e) {
      console.error(e);
      showToast("Error connecting to server", "error");
    }
  } else {
    administratorsData = localDb.getAdministrators();
  }
}

// Fetch flights and gates dynamically from Express backend
async function fetchFlightsAndGatesFromBackend() {
  try {
    const resF = await fetch(getBackendApiUrl('/api/flights'));
    if (resF.ok) {
      const dataF = await resF.json();
      if (dataF.success && Array.isArray(dataF.data) && dataF.data.length > 0) {
        flightsData = dataF.data.map(f => ({
          id: f.id,
          flightNumber: f.flight_number,
          airline: f.airline,
          airlineCode: f.airline_code || f.airline.substring(0, 2).toUpperCase(),
          origin: f.origin,
          originCode: f.origin_code || f.origin.substring(0, 3).toUpperCase(),
          destination: f.destination,
          destinationCode: f.destination_code || f.destination.substring(0, 3).toUpperCase(),
          scheduledDeparture: f.scheduled_departure,
          estimatedDeparture: f.estimated_departure || f.scheduled_departure,
          scheduledArrival: f.scheduled_arrival,
          estimatedArrival: f.estimated_arrival || f.scheduled_arrival,
          terminal: f.terminal,
          gateId: f.gate_id,
          status: f.status,
          delayMinutes: f.delay_minutes || 0
        }));
        localDb.saveFlights(flightsData);
      }
    }
  } catch (e) {
    console.warn("Backend flights fetch warning:", e);
  }

  try {
    const resG = await fetch(getBackendApiUrl('/api/gates'));
    if (resG.ok) {
      const dataG = await resG.json();
      if (dataG.success && Array.isArray(dataG.data) && dataG.data.length > 0) {
        gatesData = dataG.data.map(g => ({
          id: g.id,
          gateNumber: g.gate_number,
          terminal: g.terminal,
          status: g.status
        }));
        localDb.saveGates(gatesData);
      }
    }
  } catch (e) {
    console.warn("Backend gates fetch warning:", e);
  }
}

// RENDER: ADMINISTRATORS TABLE
async function renderAdministratorsTable() {
  const tbody = document.getElementById('admin-table-body') || document.getElementById('admin-administrator-table-body');
  if (!tbody) return;

  const searchInput = document.getElementById('admin-search');
  const statusFilter = document.getElementById('admin-status-filter');

  const searchQuery = searchInput ? searchInput.value.trim().toLowerCase() : '';
  const statusVal = statusFilter ? statusFilter.value : 'All';

  tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 1.5rem 0;">Loading administrative roster...</td></tr>';

  await fetchAdministrators();

  let list = [...administratorsData];

  if (searchQuery) {
    list = list.filter(admin => admin.name.toLowerCase().includes(searchQuery) ||
                                admin.email.toLowerCase().includes(searchQuery));
  }
  if (statusVal !== 'All') {
    list = list.filter(admin => (admin.status || 'inactive').toLowerCase() === statusVal.toLowerCase());
  }

  tbody.innerHTML = '';
  if (list.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 1.5rem 0;">No matching administrators registered.</td></tr>';
    return;
  }

  list.forEach(admin => {
    const tr = document.createElement('tr');
    
    const statusVal = admin.status || 'inactive';
    const statusClass = statusVal.toLowerCase() === 'active' ? 'on-time' : 'cancelled';
    
    const roleVal = admin.role || 'Operations Officer';
    let roleClass = 'delayed'; 
    if (roleVal.toLowerCase() === 'super administrator') roleClass = 'boarding';
    else if (roleVal.toLowerCase() === 'airport manager') roleClass = 'on-time';
    else if (roleVal.toLowerCase() === 'gate operator') roleClass = 'maintenance';

    const dateVal = admin.created_at ? admin.created_at.substring(0, 10) : (admin.createdDate || '—');

    tr.innerHTML = `
      <td class="font-bold text-main">${admin.name}</td>
      <td style="font-weight: 500;">${admin.email}</td>
      <td><span class="badge ${roleClass}" style="font-size: 0.7rem; padding: 2px 8px;">${roleVal}</span></td>
      <td><span class="badge ${statusClass}" style="font-size: 0.7rem; padding: 2px 8px; text-transform: uppercase;">${statusVal}</span></td>
      <td class="mono-val">${dateVal}</td>
      <td>
        <div style="display: flex; gap: 0.5rem;">
          <button class="btn-secondary btn-edit-admin" data-id="${admin.id}" onclick="openAdminCrudModal('${admin.id}')" title="Edit Administrator" style="padding: 4px 8px;">
            <i data-lucide="edit-3" style="width: 14px; height: 14px; pointer-events: none;"></i>
          </button>
          <button class="btn-danger btn-delete-admin" data-id="${admin.id}" data-name="${admin.name}" onclick="confirmDelete('administrator', '${admin.id}', '${admin.name}')" title="Delete Administrator" style="padding: 4px 8px;">
            <i data-lucide="trash-2" style="width: 14px; height: 14px; pointer-events: none;"></i>
          </button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });

  tbody.querySelectorAll('.btn-edit-admin').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const targetBtn = e.target.closest('.btn-edit-admin') || btn;
      openAdminCrudModal(targetBtn.dataset.id);
    });
  });
  tbody.querySelectorAll('.btn-delete-admin').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const targetBtn = e.target.closest('.btn-delete-admin') || btn;
      confirmDelete('administrator', targetBtn.dataset.id, targetBtn.dataset.name);
    });
  });

  if (window.lucide) window.lucide.createIcons();
}

// 6. MODAL UTILITIES
function openFlightModal(flight) {
  const modal = document.getElementById('flight-modal');
  const body = document.getElementById('flight-modal-body');
  if (!modal || !body) return;

  const gateObj = gatesData.find(g => g.id === flight.gateId);
  const gateNum = gateObj ? gateObj.gateNumber : "None";
  const terminal = flight.terminal || (gateObj ? gateObj.terminal : "None");

  body.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
      <h4 style="font-size: 1.2rem; font-weight: 800; color: var(--primary-navy); margin:0;">${flight.flightNumber} Details</h4>
      <span class="status-badge ${getStatusClass(flight.status)}">${flight.status}</span>
    </div>
    <div style="display: flex; flex-direction: column; gap: 0.75rem; background: var(--bg-body); border-radius: 6px; padding: 1rem; border:1px solid var(--border-color);">
      <div>Origin: <strong>${flight.origin} (${flight.originCode})</strong></div>
      <div>Destination: <strong>${flight.destination} (${flight.destinationCode})</strong></div>
      <div>Scheduled Time: <strong>${flight.scheduledDeparture}</strong></div>
      <div>Estimated Time: <strong>${flight.estimatedDeparture}</strong></div>
      <div>Assigned Gate: <strong>Gate ${gateNum} (T${terminal})</strong></div>
      <div>Airline Name: <strong>${flight.airline}</strong></div>
      <div>Delay minutes: <strong>${flight.delayMinutes} min</strong></div>
    </div>
  `;

  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
}

function closeActiveModals() {
  document.querySelectorAll('.modal-overlay').forEach(m => {
    m.classList.remove('active');
    m.setAttribute('aria-hidden', 'true');
  });
}

// 7. FLIGHT ADD/EDIT MODAL
function populateGateOptions(selectId, currentGateId = null) {
  const select = document.getElementById(selectId);
  if (!select) return;

  select.innerHTML = '<option value="">-- No Gate Assigned --</option>';
  gatesData.forEach(g => {
    // Only show available gates, or the currently assigned gate for edit mode
    const isAvail = g.status.toLowerCase() === 'available';
    const isCurrent = g.id === currentGateId;
    if (isAvail || isCurrent) {
      const suffix = isCurrent ? " (Current)" : "";
      select.innerHTML += `<option value="${g.id}">${g.gateNumber} (Terminal ${g.terminal})${suffix}</option>`;
    }
  });
}

function openFlightCrudModal(flightId = null) {
  const modal = document.getElementById('flight-crud-modal');
  const title = document.getElementById('flight-crud-title');
  const form = document.getElementById('flight-crud-form');
  if (!modal || !form) return;

  form.reset();
  document.getElementById('flight-validation-summary').textContent = '';

  if (flightId) {
    // EDIT MODE
    title.textContent = "Edit Flight Schedule";
    const flight = flightsData.find(f => String(f.id) === String(flightId));
    if (!flight) return;

    document.getElementById('flight-form-id').value = flight.id;
    document.getElementById('f-number').value = flight.flightNumber;
    document.getElementById('f-airline').value = flight.airline;
    document.getElementById('f-airline-code').value = flight.airlineCode || '';
    document.getElementById('f-origin').value = flight.origin;
    document.getElementById('f-origin-code').value = flight.originCode || '';
    document.getElementById('f-destination').value = flight.destination;
    document.getElementById('f-destination-code').value = flight.destinationCode || '';
    document.getElementById('f-scheduled-dept').value = flight.scheduledDeparture;
    document.getElementById('f-estimated-dept').value = flight.estimatedDeparture || '';
    document.getElementById('f-scheduled-arrv').value = flight.scheduledArrival;
    document.getElementById('f-estimated-arrv').value = flight.estimatedArrival || '';
    document.getElementById('f-terminal').value = flight.terminal || '';
    document.getElementById('f-status').value = flight.status;
    document.getElementById('f-delay').value = flight.delayMinutes || 0;

    populateGateOptions('f-gate', flight.gateId);
    document.getElementById('f-gate').value = flight.gateId || '';
  } else {
    // ADD MODE
    title.textContent = "Add New Flight Schedule";
    document.getElementById('flight-form-id').value = '';
    populateGateOptions('f-gate');
  }

  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
}

// 8. GATE ADD/EDIT MODAL
function populateFlightOptions(selectId, currentFlightNum = null) {
  const select = document.getElementById(selectId);
  if (!select) return;

  select.innerHTML = '<option value="">-- No Flight Assigned --</option>';
  flightsData.forEach(f => {
    // Flights with no gate, or the currently assigned flight
    const isUnassigned = !f.gateId;
    const isCurrent = f.flightNumber === currentFlightNum;
    if (isUnassigned || isCurrent) {
      const suffix = isCurrent ? " (Current)" : "";
      select.innerHTML += `<option value="${f.flightNumber}">${f.flightNumber} to ${f.destinationCode}${suffix}</option>`;
    }
  });
}

function openGateCrudModal(gateId = null) {
  const modal = document.getElementById('gate-crud-modal');
  const title = document.getElementById('gate-crud-title');
  const form = document.getElementById('gate-crud-form');
  if (!modal || !form) return;

  form.reset();
  document.getElementById('gate-validation-summary').textContent = '';

  if (gateId) {
    title.textContent = "Edit Terminal Gate";
    const gate = gatesData.find(g => String(g.id) === String(gateId));
    if (!gate) return;

    document.getElementById('gate-form-id').value = gate.id;
    document.getElementById('g-number').value = gate.gateNumber;
    document.getElementById('g-terminal').value = gate.terminal;
    document.getElementById('g-status').value = gate.status;

    const assignedFlight = flightsData.find(f => f.gateId === gate.id);
    populateFlightOptions('g-flight', assignedFlight ? assignedFlight.flightNumber : null);
    document.getElementById('g-flight').value = assignedFlight ? assignedFlight.flightNumber : '';
  } else {
    title.textContent = "Add New Boarding Gate";
    document.getElementById('gate-form-id').value = '';
    populateFlightOptions('g-flight');
  }

  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
}

// 9. ANNOUNCEMENT ADD/EDIT MODAL
function populateFlightOptionsForAnnouncements(selectId, currentVal = "") {
  const select = document.getElementById(selectId);
  if (!select) return;
  select.innerHTML = '<option value="">-- General Announcement --</option>';
  flightsData.forEach(f => {
    select.innerHTML += `<option value="${f.flightNumber}">${f.flightNumber} (to ${f.destinationCode})</option>`;
  });
  select.value = currentVal;
}

function openAnnouncementCrudModal(annId = null) {
  const modal = document.getElementById('announcement-crud-modal');
  const title = document.getElementById('announcement-crud-title');
  const form = document.getElementById('announcement-crud-form');
  if (!modal || !form) return;

  form.reset();
  document.getElementById('announcement-validation-summary').textContent = '';

  if (annId) {
    title.textContent = "Edit Broadcast Notice";
    const a = announcementsData.find(ann => String(ann.id) === String(annId));
    if (!a) return;

    document.getElementById('announcement-form-id').value = a.id;
    document.getElementById('a-type').value = a.type;
    populateFlightOptionsForAnnouncements('a-flight', a.flightNumber);
    document.getElementById('a-message').value = a.message;
  } else {
    title.textContent = "Create Broadcast Notice";
    document.getElementById('announcement-form-id').value = '';
    populateFlightOptionsForAnnouncements('a-flight');
  }

  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
}

// 9.5 ADMINISTRATOR ADD/EDIT MODAL
function openAdminCrudModal(adminId = null) {
  const modal = document.getElementById('admin-crud-modal');
  const title = document.getElementById('admin-crud-title') || document.getElementById('admin-modal-title');
  const form = document.getElementById('admin-crud-form');
  if (!modal || !form) return;

  form.reset();
  const valSummary = document.getElementById('admin-validation-summary');
  if (valSummary) {
    valSummary.style.display = 'none';
    valSummary.textContent = '';
  }

  const today = new Date().toISOString().split('T')[0];
  const dateInput = document.getElementById('admin-created-date');
  if (dateInput) dateInput.value = today;

  if (adminId) {
    if (title) title.textContent = "Edit Administrator Profile";
    const admin = administratorsData.find(a => String(a.id) === String(adminId));
    if (!admin) return;

    if (document.getElementById('admin-form-id')) document.getElementById('admin-form-id').value = admin.id;
    if (document.getElementById('admin-name')) document.getElementById('admin-name').value = admin.name;
    if (document.getElementById('admin-email')) document.getElementById('admin-email').value = admin.email;
    if (document.getElementById('admin-role')) document.getElementById('admin-role').value = admin.role || 'Operations Officer';
    if (document.getElementById('admin-status')) document.getElementById('admin-status').value = admin.status;
    if (dateInput) dateInput.value = admin.created_at ? admin.created_at.substring(0, 10) : (admin.createdDate || '');
  } else {
    if (title) title.textContent = "Create Administrator Profile";
    if (document.getElementById('admin-form-id')) document.getElementById('admin-form-id').value = '';
  }

  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
}

// 10. DELETE CONFIRMATION
function confirmDelete(type, id, name) {
  const modal = document.getElementById('delete-confirm-modal') || document.getElementById('confirm-delete-modal');
  const txt = document.getElementById('delete-confirm-prompt') || document.getElementById('delete-confirm-text');
  if (!modal || !txt) return;

  adminUI.deleteTarget = { type, id, name };
  txt.textContent = `Are you sure you want to permanently delete "${name}" from airport records? This action cannot be undone.`;
  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
}

async function executeDeleteTarget() {
  if (!adminUI.deleteTarget) return;
  const { type, id, name } = adminUI.deleteTarget;
  
  syncDataStore();

  if (type === 'flight') {
    // Send backend DELETE API call
    try {
      await fetch(getBackendApiUrl(`/api/flights/${id}`), { method: 'DELETE' });
    } catch (e) {
      console.warn("Flight delete API error:", e);
    }
    
    // If flight was assigned a gate, set gate status back to Available
    const flight = flightsData.find(f => String(f.id) === String(id));
    if (flight && flight.gateId) {
      const gate = gatesData.find(g => String(g.id) === String(flight.gateId));
      if (gate) gate.status = "Available";
    }
    flightsData = flightsData.filter(f => String(f.id) !== String(id));
    localDb.saveFlights(flightsData);
    localDb.saveGates(gatesData);
    addActivityLog("Delete Flight", name, `Flight ${name} deleted from operations board`);
    showToast(`Flight ${name} deleted successfully`, 'warning');
    await fetchFlightsAndGatesFromBackend();
  } else if (type === 'gate') {
    // Send backend DELETE API call
    try {
      await fetch(getBackendApiUrl(`/api/gates/${id}`), { method: 'DELETE' });
    } catch (e) {
      console.warn("Gate delete API error:", e);
    }

    // Free gateId references in flights
    flightsData.forEach(f => {
      if (f.gateId === id) f.gateId = null;
    });
    gatesData = gatesData.filter(g => g.id !== id);
    localDb.saveFlights(flightsData);
    localDb.saveGates(gatesData);
    addActivityLog("Delete Gate", name, `${name} deleted from bay allocations`);
    showToast(`${name} deleted successfully`, 'warning');
    await fetchFlightsAndGatesFromBackend();
  } else if (type === 'announcement') {
    announcementsData = announcementsData.filter(a => a.id !== id);
    localDb.saveAnnouncements(announcementsData);
    showToast("Announcement deleted successfully", "warning");
  } else if (type === 'administrator') {
    const client = getSupabaseClient();
    if (client) {
      try {
        const { data: { session } } = await client.auth.getSession();
        const token = session ? session.access_token : '';
        const targetUrl = getBackendApiUrl(`/api/admin/administrators/${id}`);
        
        console.log(`[Admin CRUD] DELETE ${targetUrl}`);
        const res = await fetch(targetUrl, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        console.log(`[Admin CRUD] Delete status: ${res.status}`);

        if (res.ok) {
          showToast(`Administrator ${name} deleted successfully`, 'warning');
          closeActiveModals();
          window.dispatchEvent(new Event('storage'));
          renderAllViews();
          return;
        } else {
          let errorMsg = "Failed to delete administrator";
          try {
            const err = await res.json();
            console.warn(`[Admin CRUD] Delete failed:`, err);
            errorMsg = err.error || errorMsg;
          } catch (_) {}
          showToast(errorMsg, "error");
          closeActiveModals();
          return;
        }
      } catch (err) {
        console.error(`[Admin CRUD] Delete exception:`, err);
        showToast("Error connecting to server", "error");
        closeActiveModals();
        return;
      }
    } else {
      administratorsData = administratorsData.filter(admin => admin.id !== id);
      localDb.saveAdministrators(administratorsData);
      showToast(`Administrator ${name} deleted successfully`, 'warning');
    }
  }

  closeActiveModals();
  adminUI.deleteTarget = null;
  
  // Trigger tab sync and render
  window.dispatchEvent(new Event('storage'));
  renderAllViews();
}

// 11. CONTROLLED OPERATIONS EVENT SIMULATORS

function populateSimulatorFlightOptions() {
  const select = document.getElementById('sim-select-flight');
  if (!select) return;
  
  const currentVal = select.value;
  select.innerHTML = '<option value="">-- Select a flight... --</option>';
  
  syncDataStore();
  flightsData.forEach(f => {
    select.innerHTML += `<option value="${f.flightNumber}">${f.flightNumber} &mdash; ${f.airline} &mdash; ${f.originCode} &rarr; ${f.destinationCode} (${f.status})</option>`;
  });
  
  if (currentVal && flightsData.some(f => f.flightNumber === currentVal)) {
    select.value = currentVal;
  }
}

function populateSimulatorGateOptions(currentFlightNum) {
  const gateSelect = document.getElementById('sim-input-new-gate');
  if (!gateSelect) return;

  const flight = flightsData.find(f => f.flightNumber === currentFlightNum);
  const currentGateId = flight ? flight.gateId : null;

  gateSelect.innerHTML = '<option value="">-- Select a new gate... --</option>';
  gatesData.forEach(g => {
    if (g.id !== currentGateId) {
      gateSelect.innerHTML += `<option value="${g.id}">Gate ${g.gateNumber} (Terminal ${g.terminal} - ${g.status})</option>`;
    }
  });
}

function updateSimulatorFormState() {
  const flightSelect = document.getElementById('sim-select-flight');
  const eventGroup = document.getElementById('sim-group-event-type');
  const eventSelect = document.getElementById('sim-select-event');
  const detailsPanel = document.getElementById('sim-event-details-panel');

  if (!flightSelect || !eventGroup || !eventSelect || !detailsPanel) return;

  const selectedFlightNum = flightSelect.value;
  if (!selectedFlightNum) {
    eventGroup.style.display = 'none';
    detailsPanel.style.display = 'none';
    eventSelect.value = '';
    return;
  }

  // Flight selected -> show event group
  eventGroup.style.display = 'block';

  const selectedEvent = eventSelect.value;
  if (!selectedEvent) {
    detailsPanel.style.display = 'none';
    return;
  }

  // Both flight & event selected -> update summary & details panel
  const flight = flightsData.find(f => f.flightNumber === selectedFlightNum);
  if (!flight) return;

  const gateObj = gatesData.find(g => g.id === flight.gateId);
  const summaryFlight = document.getElementById('sim-summary-flight-num');
  const summaryStatus = document.getElementById('sim-summary-status');
  const summaryGate = document.getElementById('sim-summary-gate');

  if (summaryFlight) summaryFlight.textContent = flight.flightNumber;
  if (summaryStatus) {
    summaryStatus.textContent = flight.status;
    summaryStatus.className = `badge ${getStatusClass(flight.status)}`;
  }
  if (summaryGate) summaryGate.textContent = gateObj ? `Gate ${gateObj.gateNumber} (T${gateObj.terminal})` : 'Unassigned';

  // Hide all sections then show active section
  document.querySelectorAll('.sim-config-section').forEach(sec => sec.style.display = 'none');
  const activeSec = document.getElementById(`sim-config-${selectedEvent}`);
  if (activeSec) activeSec.style.display = 'block';

  detailsPanel.style.display = 'block';

  // Event specific updates
  if (selectedEvent === 'gate_change') {
    populateSimulatorGateOptions(selectedFlightNum);
  } else if (selectedEvent === 'delay') {
    const timeEl = document.getElementById('sim-delay-current-time');
    if (timeEl) timeEl.textContent = flight.estimatedDeparture || flight.scheduledDeparture || '--:--';
  }

  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }
}

async function runGateChangeSimulation(btn) {
  console.log('AIRTRACK SIMULATOR: GATE CHANGE CLICK');
  syncDataStore();

  const flightSelect = document.getElementById('sim-select-flight');
  const flightNum = flightSelect ? flightSelect.value : '';
  if (!flightNum) {
    showToast("Please select a flight first.", "error");
    return;
  }

  const gateSelect = document.getElementById('sim-input-new-gate');
  const newGateId = gateSelect ? gateSelect.value : '';
  if (!newGateId) {
    showToast("Please select a new gate.", "error");
    return;
  }

  if (btn) btn.disabled = true;
  try {
    await applyGateChange(flightNum, newGateId);
    updateSimulatorFormState();
  } finally {
    if (btn) setTimeout(() => { btn.disabled = false; }, 300);
  }
}

async function runDelaySimulation(btn) {
  console.log('AIRTRACK SIMULATOR: DELAY CLICK');
  syncDataStore();

  const flightSelect = document.getElementById('sim-select-flight');
  const flightNum = flightSelect ? flightSelect.value : '';
  if (!flightNum) {
    showToast("Please select a flight first.", "error");
    return;
  }

  const flight = flightsData.find(f => f.flightNumber === flightNum);
  if (!flight) {
    showToast("Selected flight not found in operations data", "error");
    return;
  }

  const delaySelect = document.getElementById('sim-input-delay-minutes');
  const offset = delaySelect ? parseInt(delaySelect.value) || 30 : 30;

  if (btn) btn.disabled = true;
  try {
    flight.delayMinutes = (flight.delayMinutes || 0) + offset;
    flight.status = "Delayed";

    const parts = (flight.scheduledDeparture || '12:00').split(':');
    let h = parseInt(parts[0]) || 12;
    let m = parseInt(parts[1]) || 0;
    m += flight.delayMinutes;
    if (m >= 60) {
      h += Math.floor(m / 60);
      m = m % 60;
    }
    h = h % 24;
    flight.estimatedDeparture = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;

    const announcements = localDb.getAnnouncements();
    announcements.unshift({
      id: announcements.length > 0 ? Math.max(...announcements.map(a => a.id)) + 1 : 1,
      type: "Delay Alert",
      flightNumber: flight.flightNumber,
      message: `${flight.flightNumber} delayed. Updated estimated departure time: ${flight.estimatedDeparture} (+${offset} min delay).`,
      time: "Just now",
      unread: true
    });

    addActivityLog("Delay Alert", flight.flightNumber, `Departure delayed by ${offset} minutes. Updated departure: ${flight.estimatedDeparture}`);
    
    localDb.saveFlights(flightsData);
    localDb.saveAnnouncements(announcements);

    // Sync update to backend REST API
    await syncFlightToBackend(flight);

    showToast(`Delayed flight ${flight.flightNumber} by +${offset} minutes`, 'warning');
    window.dispatchEvent(new Event('storage'));
    renderAllViews();
    updateSimulatorFormState();
  } finally {
    if (btn) setTimeout(() => { btn.disabled = false; }, 300);
  }
}

async function runBoardingSimulation(btn) {
  console.log('AIRTRACK SIMULATOR: BOARDING CLICK');
  syncDataStore();

  const flightSelect = document.getElementById('sim-select-flight');
  const flightNum = flightSelect ? flightSelect.value : '';
  if (!flightNum) {
    showToast("Please select a flight first.", "error");
    return;
  }

  const flight = flightsData.find(f => f.flightNumber === flightNum);
  if (!flight) {
    showToast("Selected flight not found in operations data", "error");
    return;
  }

  if (btn) btn.disabled = true;
  try {
    flight.status = "Boarding";
    const gate = gatesData.find(g => g.id === flight.gateId);
    if (gate) {
      gate.status = "Boarding";
    }

    const announcements = localDb.getAnnouncements();
    announcements.unshift({
      id: announcements.length > 0 ? Math.max(...announcements.map(a => a.id)) + 1 : 1,
      type: "Boarding",
      flightNumber: flight.flightNumber,
      message: `${flight.flightNumber} to ${flight.destinationCode} is now boarding at Gate ${gate ? gate.gateNumber : '—'}. Please proceed to final gate.`,
      time: "Just now",
      unread: true
    });

    addActivityLog("Boarding Started", flight.flightNumber, `Boarding initiated at Gate ${gate ? gate.gateNumber : '—'}`);
    
    localDb.saveFlights(flightsData);
    if (gate) localDb.saveGates(gatesData);
    localDb.saveAnnouncements(announcements);

    // Sync to backend REST API
    await syncFlightToBackend(flight);
    if (gate) await syncGateToBackend(gate);

    showToast(`Boarding started for flight ${flight.flightNumber}`, 'success');
    window.dispatchEvent(new Event('storage'));
    renderAllViews();
    updateSimulatorFormState();
  } finally {
    if (btn) setTimeout(() => { btn.disabled = false; }, 300);
  }
}

async function runCancellationSimulation(btn) {
  console.log('AIRTRACK SIMULATOR: CANCELLATION CLICK');
  syncDataStore();

  const flightSelect = document.getElementById('sim-select-flight');
  const flightNum = flightSelect ? flightSelect.value : '';
  if (!flightNum) {
    showToast("Please select a flight first.", "error");
    return;
  }

  const flight = flightsData.find(f => f.flightNumber === flightNum);
  if (!flight) {
    showToast("Selected flight not found in operations data", "error");
    return;
  }

  if (btn) btn.disabled = true;
  try {
    const oldGateId = flight.gateId;
    flight.status = "Cancelled";
    flight.gateId = null;

    let oldGate = null;
    if (oldGateId) {
      oldGate = gatesData.find(g => g.id === oldGateId);
      if (oldGate) oldGate.status = "Available";
    }

    const announcements = localDb.getAnnouncements();
    announcements.unshift({
      id: announcements.length > 0 ? Math.max(...announcements.map(a => a.id)) + 1 : 1,
      type: "Cancellation",
      flightNumber: flight.flightNumber,
      message: `${flight.flightNumber} to ${flight.destinationCode} has been cancelled due to operational constraints.`,
      time: "Just now",
      unread: true
    });

    addActivityLog("Cancellation", flight.flightNumber, `Flight ${flight.flightNumber} has been cancelled.`);

    localDb.saveFlights(flightsData);
    if (oldGateId) localDb.saveGates(gatesData);
    localDb.saveAnnouncements(announcements);

    // Sync to backend REST API
    await syncFlightToBackend(flight);
    if (oldGate) await syncGateToBackend(oldGate);

    showToast(`Flight ${flight.flightNumber} cancelled successfully`, 'error');
    window.dispatchEvent(new Event('storage'));
    renderAllViews();
    updateSimulatorFormState();
  } finally {
    if (btn) setTimeout(() => { btn.disabled = false; }, 300);
  }
}

async function runSimulatorReset(btn) {
  console.log('AIRTRACK SIMULATOR: RESET CLICK');
  if (btn) btn.disabled = true;
  try {
    localStorage.removeItem('airtrack_flights_v3');
    localStorage.removeItem('airtrack_gates_v3');
    localStorage.removeItem('airtrack_announcements_v3');
    localStorage.removeItem('airtrack_activity_logs_v3');
    localStorage.removeItem('airtrack_watched_flights_v3');

    // Reset backend REST API database flights/gates to seed values
    for (const seedF of seedFlights) {
      await syncFlightToBackend(seedF);
    }
    for (const seedG of seedGates) {
      await syncGateToBackend(seedG);
    }
    
    showToast("Airport operational environment reset to initial values", "success");
    
    window.dispatchEvent(new Event('storage'));
    setTimeout(() => window.location.reload(), 500);
  } finally {
    if (btn) setTimeout(() => { btn.disabled = false; }, 300);
  }
}

let simulatorListenersBound = false;

function setupSimulators() {
  if (document.getElementById('sim-select-flight')) {
    populateSimulatorFlightOptions();
  }
  if (document.getElementById('disruption-board-list')) {
    renderDisruptionBoard();
  }
  if (document.getElementById('simulator-log-body')) {
    renderSimulatorLogs();
  }

  if (simulatorListenersBound) return;
  simulatorListenersBound = true;

  // Controlled Simulator change events
  const flightSelect = document.getElementById('sim-select-flight');
  const eventSelect = document.getElementById('sim-select-event');

  if (flightSelect) {
    flightSelect.addEventListener('change', () => updateSimulatorFormState());
  }
  if (eventSelect) {
    eventSelect.addEventListener('change', () => updateSimulatorFormState());
  }

  document.addEventListener('click', function(e) {
    const gateBtn = e.target.closest('#btn-sim-gate, .btn-sim-gatechange, .simulate-gate-change');
    if (gateBtn) {
      e.preventDefault();
      runGateChangeSimulation(gateBtn);
      return;
    }

    const delayBtn = e.target.closest('#btn-sim-delay, .btn-sim-delay, .simulate-delay');
    if (delayBtn) {
      e.preventDefault();
      runDelaySimulation(delayBtn);
      return;
    }

    const boardingBtn = e.target.closest('#btn-sim-boarding, .btn-sim-boarding, .simulate-boarding');
    if (boardingBtn) {
      e.preventDefault();
      runBoardingSimulation(boardingBtn);
      return;
    }

    const cancelBtn = e.target.closest('#btn-sim-cancel, .btn-sim-cancellation, .simulate-cancellation, #btn-sim-cancellation');
    if (cancelBtn) {
      e.preventDefault();
      runCancellationSimulation(cancelBtn);
      return;
    }

    const resetBtn = e.target.closest('#btn-sim-reset, .reset-simulator, .reset-action');
    if (resetBtn) {
      e.preventDefault();
      runSimulatorReset(resetBtn);
      return;
    }
  });
}

// --- EXTENDED OPERATIONS RENDERERS ---

let currentSortField = 'flightNumber';
let currentSortOrder = 'asc';

window.toggleSort = function(field) {
  if (currentSortField === field) {
    currentSortOrder = currentSortOrder === 'asc' ? 'desc' : 'asc';
  } else {
    currentSortField = field;
    currentSortOrder = 'asc';
  }
  renderFlightsTable();
};

function renderNotifications() {
  const countBadge = document.getElementById('notification-count');
  const listContainer = document.getElementById('header-notification-list');
  if (!listContainer) return;

  const unread = announcementsData.filter(a => a.unread);
  if (countBadge) {
    if (unread.length > 0) {
      countBadge.style.display = 'flex';
      countBadge.textContent = unread.length;
    } else {
      countBadge.style.display = 'none';
    }
  }

  if (announcementsData.length === 0) {
    listContainer.innerHTML = '<div style="padding: 1rem; text-align: center; color: var(--text-muted); font-size: 0.75rem;">No active bulletins.</div>';
    return;
  }

  listContainer.innerHTML = '';
  announcementsData.slice(0, 5).forEach(ann => {
    const item = document.createElement('div');
    item.className = `notification-item ${ann.unread ? 'unread' : ''}`;
    item.innerHTML = `
      <div style="font-weight: 700; color: var(--text-main); margin-bottom: 2px;">${ann.type} &bull; ${ann.flightNumber}</div>
      <div style="color: var(--text-secondary);">${ann.message}</div>
      <div style="font-size: 0.6rem; color: var(--text-muted); margin-top: 4px; font-family: var(--font-mono);">${ann.time}</div>
    `;
    item.addEventListener('click', () => {
      ann.unread = false;
      localDb.saveAnnouncements(announcementsData);
      window.dispatchEvent(new Event('storage'));
      renderAllViews();
    });
    listContainer.appendChild(item);
  });
}

function renderDisruptionBoard() {
  const container = document.getElementById('disruption-board-list');
  const searchInput = document.getElementById('disruption-search');
  const severityFilter = document.getElementById('disruption-severity-filter');
  if (!container) return;

  const searchQuery = searchInput ? searchInput.value.trim().toLowerCase() : '';
  const severityVal = severityFilter ? severityFilter.value : 'All';

  let list = flightsData.filter(f => ['delayed', 'gate changed', 'cancelled'].includes(f.status.toLowerCase()));

  if (searchQuery) {
    list = list.filter(f => f.flightNumber.toLowerCase().includes(searchQuery) ||
                            f.airline.toLowerCase().includes(searchQuery) ||
                            f.destination.toLowerCase().includes(searchQuery));
  }

  if (severityVal !== 'All') {
    list = list.filter(f => {
      if (severityVal === 'Critical') return f.status.toLowerCase() === 'cancelled';
      if (severityVal === 'Warning') return ['delayed', 'gate changed'].includes(f.status.toLowerCase());
      return true;
    });
  }

  if (list.length === 0) {
    container.innerHTML = `
      <div class="empty-visual-state">
        <i data-lucide="check-circle" style="width: 28px; height: 28px; color: var(--status-ontime-text);"></i>
        <div class="empty-title">Concourse Stable</div>
        <div class="empty-desc">No active delays or cancellations registered.</div>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();
    return;
  }

  container.innerHTML = '';
  list.forEach(f => {
    let icon = 'alert-triangle';
    let severity = 'warning';
    let typeName = 'Delay Alert';
    let desc = `${f.flightNumber} to ${f.destinationCode} is running late. Updated est. departure: ${f.estimatedDeparture} (+${f.delayMinutes}m delay).`;

    if (f.status.toLowerCase() === 'cancelled') {
      icon = 'alert-octagon';
      severity = 'critical';
      typeName = 'Flight Cancellation';
      desc = `${f.flightNumber} to ${f.destinationCode} has been cancelled due to ATC constraints. Gate bay released.`;
    } else if (f.status.toLowerCase() === 'gate changed') {
      icon = 'git-branch';
      severity = 'warning';
      typeName = 'Gate Reassignment';
      const gateObj = gatesData.find(g => g.id === f.gateId);
      desc = `${f.flightNumber} has been reassigned to Gate ${gateObj ? gateObj.gateNumber : '—'}. Please update displays.`;
    }

    const item = document.createElement('div');
    item.className = `alert-item ${severity}`;
    item.innerHTML = `
      <div class="alert-icon-box"><i data-lucide="${icon}"></i></div>
      <div class="alert-content">
        <div class="alert-title">${f.flightNumber} — ${typeName}</div>
        <div class="alert-body">${desc}</div>
        <div class="alert-time">Logged just now &bull; Status: ${f.status}</div>
      </div>
    `;
    container.appendChild(item);
  });
  if (window.lucide) window.lucide.createIcons();
}

let timelineViewMode = 'timeline';

function renderTimelineScheduleBoard() {
  const container = document.getElementById('timeline-board-container');
  if (!container) return;

  if (timelineViewMode === 'list') {
    container.innerHTML = `
      <div class="table-responsive">
        <table class="flight-table">
          <thead>
            <tr>
              <th>Flight</th>
              <th>Airline</th>
              <th>Route</th>
              <th>Scheduled</th>
              <th>Estimated</th>
              <th>Gate</th>
              <th>Terminal</th>
              <th>Status</th>
              <th>Delay</th>
            </tr>
          </thead>
          <tbody id="timeline-list-body"></tbody>
        </table>
      </div>
    `;
    const tbody = document.getElementById('timeline-list-body');
    flightsData.forEach(f => {
      const gateObj = gatesData.find(g => g.id === f.gateId);
      const gateNum = gateObj ? gateObj.gateNumber : '—';
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="font-bold mono-val">${f.flightNumber}</td>
        <td>${f.airline}</td>
        <td class="mono-val">${f.originCode} &rarr; ${f.destinationCode}</td>
        <td class="mono-val">${f.scheduledDeparture}</td>
        <td class="mono-val ${f.delayMinutes > 0 ? 'text-danger font-semibold' : ''}">${f.estimatedDeparture}</td>
        <td><span class="badge on-time">${gateNum}</span></td>
        <td><span class="badge delayed">T${f.terminal || '—'}</span></td>
        <td><span class="badge ${getStatusClass(f.status)}">${f.status}</span></td>
        <td class="mono-val">${f.delayMinutes > 0 ? `+${f.delayMinutes}m` : '—'}</td>
      `;
      tbody.appendChild(tr);
    });
  } else {
    container.innerHTML = `
      <div class="timeline-header-row">
        <div>Time</div>
        <div>Flight / Airline</div>
        <div>Route & Destination</div>
        <div>Gate</div>
        <div>Status</div>
      </div>
      <div id="timeline-rows-wrapper" style="display: flex; flex-direction: column; gap: 0.75rem; margin-top: 0.5rem;"></div>
    `;
    const rowsWrapper = document.getElementById('timeline-rows-wrapper');
    const sorted = [...flightsData].sort((a,b) => a.estimatedDeparture.localeCompare(b.estimatedDeparture));
    sorted.forEach(f => {
      const gateObj = gatesData.find(g => g.id === f.gateId);
      const row = document.createElement('div');
      row.className = 'timeline-row';
      row.innerHTML = `
        <div class="timeline-time-box">${f.estimatedDeparture}</div>
        <div class="timeline-meta">
          <span class="timeline-flight-num">${f.flightNumber}</span>
          <span class="timeline-airline">${f.airline}</span>
        </div>
        <div class="timeline-route">
          <span class="timeline-route-dest">${f.originCode} &rarr; ${f.destinationCode}</span>
          <span class="timeline-route-desc">${f.destination}</span>
        </div>
        <div class="timeline-gate-box">
          <span class="badge on-time" style="font-family:var(--font-mono); font-size:0.75rem; padding: 4px 10px;">Gate ${gateObj ? gateObj.gateNumber : '—'}</span>
        </div>
        <div class="timeline-status-box">
          <span class="badge ${getStatusClass(f.status)}">${f.status}</span>
        </div>
      `;
      rowsWrapper.appendChild(row);
    });
  }
}

function renderSimulatorLogs() {
  const tbody = document.getElementById('simulator-log-body');
  if (!tbody) return;

  tbody.innerHTML = '';
  if (activityLogs.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; color: var(--text-muted); font-size: 0.8rem; padding: 1.5rem 0;">No activities logged.</td></tr>';
    return;
  }

  activityLogs.slice(0, 10).forEach(log => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="mono-val">${log.time}</td>
      <td><span class="badge delayed" style="font-size: 0.65rem;">${log.type}</span></td>
      <td class="font-bold">${log.flightNumber}</td>
      <td style="font-size: 0.8rem; color: var(--text-secondary);">${log.description}</td>
    `;
    tbody.appendChild(tr);
  });
}

function renderSettingsPage() {
  const inputName = document.getElementById('set-airport-name');
  const selectTerminals = document.getElementById('set-terminal-count');
  if (!inputName || !selectTerminals) return;

  inputName.value = localStorage.getItem('airtrack_airport_name') || 'Chennai International Airport (MAA)';
  selectTerminals.value = localStorage.getItem('airtrack_terminal_count') || '2';
}

function updateSidebarToggleIcon() {
  const sidebar = document.querySelector('.sidebar') || document.getElementById('sidebar');
  const toggle = document.getElementById('admin-sidebar-toggle') || document.getElementById('btn-sidebar-toggle');

  if (!sidebar || !toggle) return;

  if (sidebar.classList.contains('collapsed')) {
    toggle.innerHTML = '<i data-lucide="chevron-right"></i>';
    toggle.setAttribute('aria-label', 'Expand sidebar');
    toggle.setAttribute('title', 'Expand sidebar');
  } else {
    toggle.innerHTML = '<i data-lucide="chevron-left"></i>';
    toggle.setAttribute('aria-label', 'Collapse sidebar');
    toggle.setAttribute('title', 'Collapse sidebar');
  }

  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }
}

function initSidebarToggle() {
  const sidebar = document.querySelector('.sidebar') || document.getElementById('sidebar');
  const toggle = document.getElementById('admin-sidebar-toggle') || document.getElementById('btn-sidebar-toggle');

  if (!sidebar || !toggle) return;

  const isCollapsed = localStorage.getItem('airtrack_admin_sidebar_collapsed') === 'true';
  if (isCollapsed) {
    sidebar.classList.add('collapsed');
  } else {
    sidebar.classList.remove('collapsed');
  }

  updateSidebarToggleIcon();

  toggle.onclick = function(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    sidebar.classList.toggle('collapsed');
    const collapsed = sidebar.classList.contains('collapsed');
    console.log('AIRTRACK SIDEBAR TOGGLE:', collapsed);
    localStorage.setItem('airtrack_admin_sidebar_collapsed', collapsed ? 'true' : 'false');

    updateSidebarToggleIcon();
  };

  const hamburgerBtn = document.getElementById('btn-hamburger');
  if (hamburgerBtn && sidebar) {
    hamburgerBtn.onclick = function(e) {
      if (e) e.stopPropagation();
      sidebar.classList.toggle('mobile-open');
    };
    document.addEventListener('click', (e) => {
      if (sidebar.classList.contains('mobile-open') && !sidebar.contains(e.target) && e.target !== hamburgerBtn) {
        sidebar.classList.remove('mobile-open');
      }
    });
  }
}

function initHeaderMenus() {
  const notifBtn = document.getElementById('btn-notification');
  const notifDropdown = document.getElementById('notification-dropdown');
  const profileTrigger = document.getElementById('profile-menu-trigger');
  const profileDropdown = document.getElementById('profile-dropdown-menu');

  if (notifBtn && notifDropdown) {
    notifBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      notifDropdown.style.display = notifDropdown.style.display === 'flex' ? 'none' : 'flex';
      if (profileDropdown) profileDropdown.style.display = 'none';
    });
  }

  if (profileTrigger && profileDropdown) {
    profileTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      profileDropdown.style.display = profileDropdown.style.display === 'flex' ? 'none' : 'flex';
      if (notifDropdown) notifDropdown.style.display = 'none';
    });
  }

  document.addEventListener('click', () => {
    if (notifDropdown) notifDropdown.style.display = 'none';
    if (profileDropdown) profileDropdown.style.display = 'none';
  });

  const btnClear = document.getElementById('btn-clear-notifications');
  if (btnClear) {
    btnClear.addEventListener('click', (e) => {
      e.stopPropagation();
      syncDataStore();
      const announcements = localDb.getAnnouncements();
      announcements.forEach(a => a.unread = false);
      localDb.saveAnnouncements(announcements);
      showToast("Notifications marked as read", "success");
      window.dispatchEvent(new Event('storage'));
      renderAllViews();
    });
  }
}

function highlightActiveSidebar() {
  const currentPath = window.location.pathname;
  document.querySelectorAll('.sidebar-nav .nav-item').forEach(item => {
    const href = item.getAttribute('href');
    if (!href) return;
    const isMatch = (href === currentPath) ||
                    ((currentPath === '/admin/' || currentPath === '/admin/index.html' || currentPath === '/admin') &&
                     (href === '/admin/index.html' || href === '/admin' || href === '/admin/'));
    if (isMatch) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
}




async function fetchFlightsAndGatesFromBackend() {
  try {
    const resF = await fetch(getBackendApiUrl('/api/flights'));
    if (resF.ok) {
      const dataF = await resF.json();
      if (dataF.success && Array.isArray(dataF.data) && dataF.data.length > 0) {
        memoryFlights = dataF.data.map(f => ({
          id: f.id,
          flightNumber: f.flight_number,
          airline: f.airline,
          airlineCode: f.airline_code || f.airline.substring(0, 2).toUpperCase(),
          origin: f.origin,
          originCode: f.origin_code || f.origin.substring(0, 3).toUpperCase(),
          destination: f.destination,
          destinationCode: f.destination_code || f.destination.substring(0, 3).toUpperCase(),
          scheduledDeparture: f.scheduled_departure,
          estimatedDeparture: f.estimated_departure || f.scheduled_departure,
          scheduledArrival: f.scheduled_arrival,
          estimatedArrival: f.estimated_arrival || f.scheduled_arrival,
          gateId: f.gate_id,
          terminal: f.terminal,
          status: f.status,
          delayMinutes: f.delay_minutes || 0
        }));
        localDb.saveFlights(memoryFlights);
        flightsData = memoryFlights;
      }
    }
  } catch (e) {
    console.warn("Admin flights backend sync error:", e);
  }

  try {
    const resG = await fetch(getBackendApiUrl('/api/gates'));
    if (resG.ok) {
      const dataG = await resG.json();
      if (dataG.success && Array.isArray(dataG.data) && dataG.data.length > 0) {
        memoryGates = dataG.data.map(g => ({
          id: g.id,
          gateNumber: g.gate_number,
          terminal: g.terminal,
          status: g.status
        }));
        localDb.saveGates(memoryGates);
        gatesData = memoryGates;
      }
    }
  } catch (e) {
    console.warn("Admin gates backend sync error:", e);
  }
  syncDataStore();
}

// Global click diagnostic for event flow verification
document.addEventListener('click', (e) => {
  console.log('AIRTRACK CLICK:', e.target);

  const editBtn = e.target.closest('.btn-edit-flight') || e.target.closest('.edit-flight-btn');
  if (editBtn) {
    e.preventDefault();
    e.stopPropagation();
    const flightId = editBtn.dataset.id || editBtn.dataset.flightId;
    console.log('AIRTRACK EDIT CLICK:', flightId);
    if (typeof openFlightCrudModal === 'function') {
      openFlightCrudModal(flightId);
    }
    return;
  }

  const deleteBtn = e.target.closest('.btn-delete-flight') || e.target.closest('.delete-flight-btn');
  if (deleteBtn) {
    e.preventDefault();
    e.stopPropagation();
    const flightId = deleteBtn.dataset.id || deleteBtn.dataset.flightId;
    const flightName = deleteBtn.dataset.name || deleteBtn.dataset.flightName || '';
    console.log('AIRTRACK DELETE CLICK:', flightId);
    if (typeof confirmDelete === 'function') {
      confirmDelete('flight', flightId, flightName);
    }
    return;
  }
});

// 12. INITIALIZATION
async function initAdminApp() {
  console.log("AIRTRACK ADMIN INIT START");
  syncDataStore();
  renderAllViews();
  setupSimulators();
  initSidebarToggle();
  initHeaderMenus();
  highlightActiveSidebar();
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }

  await fetchFlightsAndGatesFromBackend();
  renderAllViews();

  // Double check icon initialization on full page load
  window.addEventListener('load', () => {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  });

  // 1. Cross-tab synchronization
  window.addEventListener('storage', (e) => {
    if (e.key && e.key.startsWith('airtrack_')) {
      console.log(`Cross-tab sync for Admin: ${e.key}`);
      renderAllViews();
    }
  });

  // 2. Admin Logout trigger
  const btnLogout = document.getElementById('btn-admin-logout') || document.getElementById('btn-header-logout');
  if (btnLogout) {
    btnLogout.addEventListener('click', async (e) => {
      e.preventDefault();
      await logoutAdmin();
      window.location.href = '/admin/login.html';
    });
  }

  // 3. Flight CRUD Form triggers
  const btnAddFlight = document.getElementById('btn-add-flight');
  if (btnAddFlight) {
    btnAddFlight.addEventListener('click', () => openFlightCrudModal());
  }

  const flightCrudForm = document.getElementById('flight-crud-form');
  if (flightCrudForm) {
    flightCrudForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      syncDataStore();

      const fId = document.getElementById('flight-form-id').value;
      const fNum = document.getElementById('f-number').value.trim();
      const airline = document.getElementById('f-airline').value.trim();
      const code = document.getElementById('f-airline-code').value.trim();
      const origin = document.getElementById('f-origin').value.trim();
      const originCode = document.getElementById('f-origin-code').value.trim();
      const dest = document.getElementById('f-destination').value.trim();
      const destCode = document.getElementById('f-destination-code').value.trim();
      const sched = document.getElementById('f-scheduled-dept').value.trim();
      const est = document.getElementById('f-estimated-dept').value.trim() || sched;
      const schedArr = document.getElementById('f-scheduled-arrv').value.trim();
      const estArr = document.getElementById('f-estimated-arrv').value.trim() || schedArr;
      const terminal = document.getElementById('f-terminal').value.trim();
      const gateIdVal = document.getElementById('f-gate').value;
      const status = document.getElementById('f-status').value;
      const delay = parseInt(document.getElementById('f-delay').value) || 0;

      // Basic validations
      if (!/^[A-Z0-9]{2,3}\s\d{2,4}$/.test(fNum)) {
        document.getElementById('flight-validation-summary').textContent = "Error: Invalid Flight Number format (e.g. AI 539, 6E 621).";
        document.getElementById('flight-validation-summary').style.display = 'block';
        return;
      }

      const parsedGateId = gateIdVal ? parseInt(gateIdVal) : null;
      
      // Synchronous sync with Express backend REST API
      try {
        const targetUrl = fId 
          ? getBackendApiUrl(`/api/flights/${fId}`) 
          : getBackendApiUrl('/api/flights');
        const method = fId ? 'PUT' : 'POST';

        const res = await fetch(targetUrl, {
          method: method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            flight_number: fNum,
            airline: airline,
            airline_code: code,
            origin: origin,
            origin_code: originCode,
            destination: dest,
            destination_code: destCode,
            scheduled_departure: sched,
            estimated_departure: est,
            scheduled_arrival: schedArr,
            estimated_arrival: estArr,
            terminal: terminal,
            gate_id: parsedGateId,
            status: status,
            delay_minutes: delay
          })
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          document.getElementById('flight-validation-summary').textContent = errData.error || "Error saving flight to server.";
          document.getElementById('flight-validation-summary').style.display = 'block';
          return;
        }

        showToast(`Flight ${fNum} ${fId ? 'updated' : 'created'} successfully`, 'success');
        addActivityLog(fId ? "Modify Flight" : "Add Flight", fNum, `Flight ${fNum} schedule ${fId ? 'updated' : 'created'} by dispatcher`);
      } catch (e) {
        console.warn("Flight save API sync error:", e);
      }

      await fetchFlightsAndGatesFromBackend();
      closeActiveModals();
      window.dispatchEvent(new Event('storage'));
      renderAllViews();
    });
  }

  // Close modals inside clicks
  const flightCrudClose = document.getElementById('flight-crud-close');
  if (flightCrudClose) {
    flightCrudClose.addEventListener('click', () => closeActiveModals());
  }
  const btnFlightCancel = document.getElementById('btn-flight-crud-cancel');
  if (btnFlightCancel) {
    btnFlightCancel.addEventListener('click', () => closeActiveModals());
  }

  // 4. Gate CRUD Form triggers
  const btnAddGate = document.getElementById('btn-add-gate');
  if (btnAddGate) {
    btnAddGate.addEventListener('click', () => openGateCrudModal());
  }

  const gateCrudForm = document.getElementById('gate-crud-form');
  if (gateCrudForm) {
    gateCrudForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      syncDataStore();

      const gId = document.getElementById('gate-form-id').value;
      const gNum = document.getElementById('g-number').value.trim();
      const terminal = document.getElementById('g-terminal').value.trim();
      const status = document.getElementById('g-status').value;
      const flightNumVal = document.getElementById('g-flight').value;

      if (!gNum || !terminal) {
        document.getElementById('gate-validation-summary').textContent = "Error: All fields are required.";
        document.getElementById('gate-validation-summary').style.display = 'block';
        return;
      }

      try {
        const targetUrl = gId 
          ? getBackendApiUrl(`/api/gates/${gId}`) 
          : getBackendApiUrl('/api/gates');
        const method = gId ? 'PUT' : 'POST';

        const res = await fetch(targetUrl, {
          method: method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            gate_number: gNum,
            terminal: terminal,
            status: status
          })
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          document.getElementById('gate-validation-summary').textContent = errData.error || "Error saving gate to server.";
          document.getElementById('gate-validation-summary').style.display = 'block';
          return;
        }

        showToast(`Gate ${gNum} ${gId ? 'updated' : 'created'} successfully`, 'success');
        addActivityLog(gId ? "Modify Gate" : "Add Gate", '—', `Gate ${gNum} ${gId ? 'updated' : 'created'}`);
      } catch (e) {
        console.warn("Gate save API sync error:", e);
      }

      await fetchFlightsAndGatesFromBackend();
      closeActiveModals();
      window.dispatchEvent(new Event('storage'));
      renderAllViews();
    });
  }

  const gateCrudClose = document.getElementById('gate-crud-close');
  if (gateCrudClose) {
    gateCrudClose.addEventListener('click', () => closeActiveModals());
  }
  const btnGateCancel = document.getElementById('btn-gate-crud-cancel');
  if (btnGateCancel) {
    btnGateCancel.addEventListener('click', () => closeActiveModals());
  }

  // 5. Announcements CRUD Form triggers
  const btnAddAnn = document.getElementById('btn-add-announcement');
  if (btnAddAnn) {
    btnAddAnn.addEventListener('click', () => openAnnouncementCrudModal());
  }

  const announcementCrudForm = document.getElementById('announcement-crud-form');
  if (announcementCrudForm) {
    announcementCrudForm.addEventListener('submit', (e) => {
      e.preventDefault();
      syncDataStore();

      const aId = document.getElementById('announcement-form-id').value;
      const type = document.getElementById('a-type').value;
      const flightNum = document.getElementById('a-flight').value.trim() || '—';
      const message = document.getElementById('a-message').value.trim();

      if (!message) {
        document.getElementById('announcement-validation-summary').textContent = "Error: Message is required.";
        document.getElementById('announcement-validation-summary').style.display = 'block';
        return;
      }

      if (aId) {
        // Edit
        const a = announcementsData.find(ann => ann.id === parseInt(aId));
        if (a) {
          a.type = type;
          a.flightNumber = flightNum;
          a.message = message;
          showToast("Announcement modified successfully", "success");
        }
      } else {
        // Add
        const newId = announcementsData.length > 0 ? Math.max(...announcementsData.map(an => an.id)) + 1 : 1;
        announcementsData.unshift({
          id: newId,
          type,
          flightNumber: flightNum,
          message,
          time: "Just now",
          unread: true
        });
        showToast("Announcement broadcasted successfully", "success");
      }

      localDb.saveAnnouncements(announcementsData);
      closeActiveModals();
      window.dispatchEvent(new Event('storage'));
      renderAllViews();
    });
  }

  const annCrudClose = document.getElementById('announcement-crud-close');
  if (annCrudClose) {
    annCrudClose.addEventListener('click', () => closeActiveModals());
  }
  const btnAnnCancel = document.getElementById('btn-announcement-crud-cancel');
  if (btnAnnCancel) {
    btnAnnCancel.addEventListener('click', () => closeActiveModals());
  }

  // 6. Administrator CRUD Form triggers
  const btnAddAdmin = document.getElementById('btn-add-admin');
  if (btnAddAdmin) {
    btnAddAdmin.addEventListener('click', () => openAdminCrudModal());
  }

  const adminCrudForm = document.getElementById('admin-crud-form');
  if (adminCrudForm) {
    adminCrudForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      syncDataStore();

      const adminId = document.getElementById('admin-form-id').value;
      const name = document.getElementById('admin-name').value.trim();
      const email = document.getElementById('admin-email').value.trim().toLowerCase();
      const role = document.getElementById('admin-role').value;
      const status = document.getElementById('admin-status').value;
      const createdDate = document.getElementById('admin-created-date').value;

      if (!name || !email) {
        document.getElementById('admin-validation-summary').textContent = "Error: Name and Email are required.";
        document.getElementById('admin-validation-summary').style.display = 'block';
        return;
      }

      const client = getSupabaseClient();
      if (client) {
        try {
          const { data: { session } } = await client.auth.getSession();
          const token = session ? session.access_token : '';
          
          const method = adminId ? 'PATCH' : 'POST';
          const targetUrl = adminId 
            ? getBackendApiUrl(`/api/admin/administrators/${adminId}`) 
            : getBackendApiUrl('/api/admin/administrators');

          console.log(`[Admin CRUD] ${method} ${targetUrl}`);
          const res = await fetch(targetUrl, {
            method: method,
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ name, email, role, status, created_at: createdDate })
          });

          console.log(`[Admin CRUD] Response status: ${res.status}`);

          if (res.ok) {
            let resData = null;
            try {
              resData = await res.json();
              console.log(`[Admin CRUD] Success response:`, resData);
            } catch (_) {}
            showToast(adminId ? "Administrator updated successfully" : "Administrator created successfully", "success");
            closeActiveModals();
            window.dispatchEvent(new Event('storage'));
            renderAllViews();
          } else {
            let errorMsg = "Failed to save administrator";
            try {
              const err = await res.json();
              console.warn(`[Admin CRUD] Save failed:`, err);
              errorMsg = err.error || errorMsg;
            } catch (_) {
              const rawTxt = await res.text();
              console.warn(`[Admin CRUD] Save non-JSON failure:`, rawTxt);
            }
            const valSum = document.getElementById('admin-validation-summary');
            if (valSum) {
              valSum.textContent = errorMsg;
              valSum.style.display = 'block';
            }
            showToast(errorMsg, "error");
          }
        } catch (err) {
          console.error(`[Admin CRUD] Save exception:`, err);
          const valSum = document.getElementById('admin-validation-summary');
          if (valSum) {
            valSum.textContent = "Error connecting to server";
            valSum.style.display = 'block';
          }
          showToast("Error connecting to server", "error");
        }
      } else {
        if (adminId) {
          // Edit Administrator fallback
          const admin = administratorsData.find(a => a.id === parseInt(adminId));
          if (admin) {
            admin.name = name;
            admin.email = email;
            admin.role = role;
            admin.status = status;
            admin.createdDate = createdDate;
            addActivityLog("Modify Admin", '—', `Administrator profile ${name} updated`);
            showToast(`Administrator ${name} updated successfully`, 'success');
          }
        } else {
          // Add Administrator fallback
          const newId = administratorsData.length > 0 ? Math.max(...administratorsData.map(a => a.id)) + 1 : 1;
          const newAdmin = {
            id: newId,
            name,
            email,
            role,
            status,
            createdDate
          };
          administratorsData.push(newAdmin);
          addActivityLog("Create Admin", '—', `Administrator profile ${name} created`);
          showToast(`Administrator ${name} created successfully`, 'success');
        }

        localDb.saveAdministrators(administratorsData);
        closeActiveModals();
        window.dispatchEvent(new Event('storage'));
        renderAllViews();
      }
    });
  }

  const adminCrudClose = document.getElementById('admin-crud-close');
  if (adminCrudClose) {
    adminCrudClose.addEventListener('click', () => closeActiveModals());
  }
  const btnAdminCancel = document.getElementById('btn-admin-crud-cancel');
  if (btnAdminCancel) {
    btnAdminCancel.addEventListener('click', () => closeActiveModals());
  }

  // Delete modal buttons hooks
  const deleteConfirmClose = document.getElementById('delete-confirm-close');
  if (deleteConfirmClose) {
    deleteConfirmClose.addEventListener('click', () => closeActiveModals());
  }
  const btnDeleteCancel = document.getElementById('btn-delete-cancel');
  if (btnDeleteCancel) {
    btnDeleteCancel.addEventListener('click', () => closeActiveModals());
  }
  const btnDeleteConfirm = document.getElementById('btn-delete-confirm');
  if (btnDeleteConfirm) {
    btnDeleteConfirm.addEventListener('click', () => executeDeleteTarget());
  }

  // View Schedule toggle hooks
  const btnViewTimeline = document.getElementById('btn-view-timeline');
  const btnViewList = document.getElementById('btn-view-list');
  if (btnViewTimeline && btnViewList) {
    btnViewTimeline.addEventListener('click', () => {
      timelineViewMode = 'timeline';
      btnViewTimeline.classList.add('active');
      btnViewList.classList.remove('active');
      renderTimelineScheduleBoard();
    });
    btnViewList.addEventListener('click', () => {
      timelineViewMode = 'list';
      btnViewList.classList.add('active');
      btnViewTimeline.classList.remove('active');
      renderTimelineScheduleBoard();
    });
  }

  // Settings page submit hooks
  const settingsForm = document.getElementById('settings-airport-form');
  if (settingsForm) {
    settingsForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameVal = document.getElementById('set-airport-name').value.trim();
      const termVal = document.getElementById('set-terminal-count').value;
      if (nameVal) {
        localStorage.setItem('airtrack_airport_name', nameVal);
        localStorage.setItem('airtrack_terminal_count', termVal);
        showToast("System preferences updated successfully", "success");
        window.dispatchEvent(new Event('storage'));
        renderAllViews();
      }
    });
  }

  // Dynamic filter changes hooks
  const flightSearch = document.getElementById('flight-search') || document.getElementById('live-search');
  if (flightSearch) {
    flightSearch.addEventListener('input', () => {
      if (document.getElementById('admin-flight-table-body')) renderFlightsTable();
    });
  }
  const flightStatusFilter = document.getElementById('flight-status-filter') || document.getElementById('status-filter');
  if (flightStatusFilter) {
    flightStatusFilter.addEventListener('change', () => {
      if (document.getElementById('admin-flight-table-body')) renderFlightsTable();
    });
  }
  const flightTerminalFilter = document.getElementById('flight-terminal-filter');
  if (flightTerminalFilter) {
    flightTerminalFilter.addEventListener('change', () => {
      if (document.getElementById('admin-flight-table-body')) renderFlightsTable();
    });
  }

  const gateSearch = document.getElementById('gate-search');
  if (gateSearch) {
    gateSearch.addEventListener('input', () => renderGatesTable());
  }
  const gateStatusFilter = document.getElementById('gate-status-filter');
  if (gateStatusFilter) {
    gateStatusFilter.addEventListener('change', () => renderGatesTable());
  }
  const gateTerminalFilter = document.getElementById('gate-terminal-filter');
  if (gateTerminalFilter) {
    gateTerminalFilter.addEventListener('change', () => renderGatesTable());
  }

  const announcementSearch = document.getElementById('announcement-search');
  if (announcementSearch) {
    announcementSearch.addEventListener('input', () => renderAnnouncementsTable());
  }
  const announcementTypeFilter = document.getElementById('announcement-type-filter');
  if (announcementTypeFilter) {
    announcementTypeFilter.addEventListener('change', () => renderAnnouncementsTable());
  }

  const activitySearch = document.getElementById('activity-search');
  if (activitySearch) {
    activitySearch.addEventListener('input', () => renderActivityLogTable());
  }
  const activityTypeFilter = document.getElementById('activity-type-filter');
  if (activityTypeFilter) {
    activityTypeFilter.addEventListener('change', () => renderActivityLogTable());
  }

  const adminSearch = document.getElementById('admin-search');
  if (adminSearch) {
    adminSearch.addEventListener('input', () => renderAdministratorsTable());
  }
  const adminStatusFilter = document.getElementById('admin-status-filter');
  if (adminStatusFilter) {
    adminStatusFilter.addEventListener('change', () => renderAdministratorsTable());
  }

  const disruptionSearch = document.getElementById('disruption-search');
  if (disruptionSearch) {
    disruptionSearch.addEventListener('input', () => renderDisruptionBoard());
  }
  const disruptionFilter = document.getElementById('disruption-severity-filter');
  if (disruptionFilter) {
    disruptionFilter.addEventListener('change', () => renderDisruptionBoard());
  }

  // Manual refresh trigger
  document.querySelectorAll('.btn-refresh-trigger').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.classList.add('spinning');
      setTimeout(() => {
        renderAllViews();
        btn.classList.remove('spinning');
        showToast("Operations control matrix synced", "success");
      }, 500);
    });
  });

  const btnFlightCrudCancel = document.getElementById('btn-flight-crud-cancel');
  if (btnFlightCrudCancel) {
    btnFlightCrudCancel.addEventListener('click', () => closeActiveModals());
  }

  console.log('AIRTRACK ADMIN INIT COMPLETE');
  console.log('AIRTRACK ADMIN PAGE READY');
  const loader = document.getElementById('admin-page-loader');
  if (loader) {
    loader.classList.add('hidden');
    setTimeout(() => {
      try { loader.remove(); } catch (e) {}
    }, 200);
  }
}

// Global Window Handler Exports for inline HTML and cross-script calls
window.openFlightCrudModal = openFlightCrudModal;
window.openGateCrudModal = openGateCrudModal;
window.openAnnouncementCrudModal = openAnnouncementCrudModal;
window.openAdminCrudModal = openAdminCrudModal;
window.confirmDelete = confirmDelete;
window.executeDeleteTarget = executeDeleteTarget;
window.closeActiveModals = closeActiveModals;
window.renderAllViews = renderAllViews;
window.updateSidebarToggleIcon = updateSidebarToggleIcon;
window.initSidebarToggle = initSidebarToggle;
window.fetchFlightsAndGatesFromBackend = fetchFlightsAndGatesFromBackend;

// Aliases for explicit function inspection and inline event bindings
window.deleteFlight = function(id, name = 'Flight') {
  confirmDelete('flight', parseInt(id), name);
};
window.deleteGate = function(id, name = 'Gate') {
  confirmDelete('gate', parseInt(id), name);
};
window.handleFlightFormSubmit = async function(e) {
  if (e && typeof e.preventDefault === 'function') e.preventDefault();
  const form = document.getElementById('flight-crud-form');
  if (form) {
    const event = new Event('submit', { cancelable: true });
    form.dispatchEvent(event);
  }
};
window.handleGateFormSubmit = async function(e) {
  if (e && typeof e.preventDefault === 'function') e.preventDefault();
  const form = document.getElementById('gate-crud-form');
  if (form) {
    const event = new Event('submit', { cancelable: true });
    form.dispatchEvent(event);
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAdminApp);
} else {
  initAdminApp();
}
