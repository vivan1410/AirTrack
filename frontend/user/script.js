console.log("AIRTRACK USER SCRIPT LOADED");

/**
 * AirTrack — Passenger Website Logic
 * Handles FIDS boards, watchlist, announcements, and concourse navigation.
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

// Fallback memory state
let memoryFlights = [...seedFlights];
let memoryGates = [...seedGates];
let memoryAnnouncements = [...seedAnnouncements];
let memoryActivityLogs = [...seedActivityLogs];
let memoryWatchedFlights = [];

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
  getWatchedFlights() {
    try {
      const stored = localStorage.getItem('airtrack_watched_flights_v3');
      if (!stored) {
        localStorage.setItem('airtrack_watched_flights_v3', JSON.stringify([]));
        return [];
      }
      return JSON.parse(stored);
    } catch (e) {
      return memoryWatchedFlights;
    }
  },
  saveWatchedFlights(data) {
    try {
      localStorage.setItem('airtrack_watched_flights_v3', JSON.stringify(data));
    } catch (e) {}
    memoryWatchedFlights = data;
  },
  getPassengers() {
    try {
      const stored = localStorage.getItem('airtrack_passengers_v3');
      if (!stored) {
        const seed = [
          { name: "John Passenger", email: "passenger@airtrack.demo", password: "password" }
        ];
        localStorage.setItem('airtrack_passengers_v3', JSON.stringify(seed));
        return seed;
      }
      return JSON.parse(stored);
    } catch (e) {
      return [{ name: "John Passenger", email: "passenger@airtrack.demo", password: "password" }];
    }
  },
  savePassengers(data) {
    try {
      localStorage.setItem('airtrack_passengers_v3', JSON.stringify(data));
    } catch (e) {}
  }
};

// State variables
let flightsData = [];
let gatesData = [];
let announcementsData = [];
let watchedFlights = [];
let passengersData = [];
let lastWatchedGates = {}; // To detect gate changes

// Sync data store
function syncDataStore() {
  flightsData = localDb.getFlights();
  gatesData = localDb.getGates();
  announcementsData = localDb.getAnnouncements();
  watchedFlights = localDb.getWatchedFlights();
  passengersData = localDb.getPassengers();

  // Detect gate changes in watched flights
  detectWatchedGateChanges();
}

// Check for gate changes on watched flights
function detectWatchedGateChanges() {
  const currentWatched = localDb.getWatchedFlights();
  let changedFlight = null;
  let oldGate = "";
  let newGate = "";

  currentWatched.forEach(fNum => {
    const flight = flightsData.find(f => f.flightNumber === fNum);
    if (flight) {
      const gateObj = gatesData.find(g => g.id === flight.gateId);
      const gateNum = gateObj ? gateObj.gateNumber : "None";
      
      if (lastWatchedGates[fNum] !== undefined && lastWatchedGates[fNum] !== gateNum) {
        changedFlight = flight;
        oldGate = lastWatchedGates[fNum];
        newGate = gateNum;
      }
      lastWatchedGates[fNum] = gateNum;
    }
  });

  if (changedFlight) {
    showToast(`WATCHLIST ALERT: Flight ${changedFlight.flightNumber} gate changed from ${oldGate} to ${newGate}!`, 'warning');
  }
}

// 3. PASSENGER UI CONTROLLER & ROUTING
const passengerUI = {
  statusFilter: "all",
  searchQuery: "",
  terminalFilter: "all"
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

function updateTimestamp() {
  const el = document.getElementById('last-updated-time');
  if (el) {
    const now = new Date();
    el.textContent = now.toTimeString().split(' ')[0];
  }
}

function updatePassengerNavbar() {
  const userSessionStr = sessionStorage.getItem('airtrack_user_session');
  const userDisplayName = document.getElementById('user-display-name');
  const avatarLetters = document.getElementById('passenger-avatar-letters');
  const dropName = document.getElementById('drop-passenger-name');
  const dropEmail = document.getElementById('drop-passenger-email');

  if (userSessionStr) {
    try {
      const user = JSON.parse(userSessionStr);
      const displayName = user.name || (user.email ? user.email.split('@')[0] : "Passenger");
      if (userDisplayName) userDisplayName.textContent = displayName;
      if (dropName) dropName.textContent = displayName;
      if (dropEmail) dropEmail.textContent = user.email || "";
      
      if (avatarLetters && displayName) {
        const parts = displayName.trim().split(/\s+/);
        if (parts.length >= 2) {
          avatarLetters.textContent = (parts[0][0] + parts[1][0]).toUpperCase();
        } else {
          avatarLetters.textContent = displayName.substring(0, 2).toUpperCase();
        }
      }
    } catch (e) {
      console.warn("Error parsing user session:", e);
    }
  }
}

window.updatePassengerNavbar = updatePassengerNavbar;
window.addEventListener('user_session_updated', () => updatePassengerNavbar());

function renderAllViews() {
  syncDataStore();
  updatePassengerNavbar();
  updateWelcomeGreeting();
  renderSummaryStats();
  
  if (document.getElementById('overview-watchlist-body')) {
    renderOverviewWatchlist();
  }
  if (document.getElementById('flight-table-body')) {
    renderFlightsTable();
  }
  if (document.getElementById('gates-grid')) {
    renderGatesGrid();
  }
  if (document.getElementById('my-flights-table-body')) {
    renderMyFlightsPage();
  }
  if (document.getElementById('overview-live-tracker')) {
    renderLiveTracker();
  }
  if (document.getElementById('overview-announcements-list')) {
    renderOverviewAnnouncements();
  }
  if (document.getElementById('passenger-airport-header-title')) {
    renderAirportsPage();
  }

  renderAnnouncements();
  renderWatchlist();
}

function updateWelcomeGreeting() {
  const welcomeTitle = document.getElementById('passenger-welcome-title');
  if (welcomeTitle) {
    const userSessionStr = sessionStorage.getItem('airtrack_user_session');
    const name = userSessionStr ? JSON.parse(userSessionStr).name : 'Passenger';
    const hour = new Date().getHours();
    let greeting = 'Good morning';
    if (hour >= 12 && hour < 17) greeting = 'Good afternoon';
    else if (hour >= 17) greeting = 'Good evening';
    welcomeTitle.textContent = `${greeting}, ${name}`;
  }
}

function getActiveAnnouncements() {
  const announcements = (typeof localDb !== 'undefined' && typeof localDb.getAnnouncements === 'function') ? localDb.getAnnouncements() : [];
  const flights = (Array.isArray(window.flightsData) && window.flightsData.length > 0)
    ? window.flightsData
    : ((Array.isArray(flightsData) && flightsData.length > 0) ? flightsData : (typeof localDb !== 'undefined' ? localDb.getFlights() : []));
  
  return announcements.filter(a => {
    if (!a || !a.flightNumber) return true;
    const flight = flights.find(f => f.flightNumber === a.flightNumber);
    if (!flight) return true;
    
    const flightStatus = (flight.status || '').toLowerCase();
    const annType = (a.type || '').toLowerCase();
    
    if (annType === 'delay alert' && (flightStatus === 'on time' || flightStatus === 'on-time' || flightStatus === 'departed')) {
      return false;
    }
    if (annType === 'cancellation' && (flightStatus === 'on time' || flightStatus === 'on-time' || flightStatus === 'boarding')) {
      return false;
    }
    return true;
  });
}

function renderSummaryStats() {
  const totalEl = document.getElementById('stat-total-flights');
  const onTimeEl = document.getElementById('stat-ontime-flights');
  const delayedEl = document.getElementById('stat-delayed-flights');
  const nextNumEl = document.getElementById('stat-next-flight-num');
  const nextTimeEl = document.getElementById('stat-next-flight-time');

  const watched = (typeof localDb !== 'undefined' && typeof localDb.getWatchedFlights === 'function') ? localDb.getWatchedFlights() : [];
  const flights = (Array.isArray(window.flightsData) && window.flightsData.length > 0)
    ? window.flightsData
    : ((Array.isArray(flightsData) && flightsData.length > 0) ? flightsData : (typeof localDb !== 'undefined' ? localDb.getFlights() : []));

  const watchedFlightsList = flights.filter(f => watched.includes(f.flightNumber));
  const activeFlightsList = watched.length > 0 ? watchedFlightsList : flights;

  if (totalEl) totalEl.textContent = activeFlightsList.length;
  if (onTimeEl) {
    onTimeEl.textContent = activeFlightsList.filter(f => {
      const s = (f.status || '').toLowerCase();
      return s === 'on time' || s === 'on-time' || s === 'scheduled';
    }).length;
  }
  if (delayedEl) {
    delayedEl.textContent = activeFlightsList.filter(f => (f.status || '').toLowerCase() === 'delayed').length;
  }

  if (nextNumEl && nextTimeEl) {
    const sorted = [...activeFlightsList].sort((a,b) => (a.estimatedDeparture || '').localeCompare(b.estimatedDeparture || ''));
    const active = sorted.filter(f => !['departed', 'cancelled'].includes((f.status || '').toLowerCase()));
    if (active.length > 0) {
      nextNumEl.textContent = active[0].flightNumber;
      nextTimeEl.textContent = `${active[0].estimatedDeparture || active[0].scheduledDeparture} to ${active[0].destinationCode}`;
    } else {
      nextNumEl.textContent = '—';
      nextTimeEl.textContent = 'No active departures';
    }
  }
}

function renderOverviewWatchlist() {
  const tbody = document.getElementById('overview-watchlist-body');
  if (!tbody) return;

  tbody.innerHTML = '';
  const watched = localDb.getWatchedFlights();
  const list = flightsData.filter(f => watched.includes(f.flightNumber));

  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 2rem 0; font-size: 0.8rem;">Your watchlist is currently empty. Star flights on the Flight Status tab to track them here.</td></tr>`;
    return;
  }

  list.forEach(f => {
    const gateObj = gatesData.find(g => g.id === f.gateId);
    const gateNum = gateObj ? gateObj.gateNumber : '—';
    const tr = document.createElement('tr');
    tr.className = 'clickable-row';
    tr.innerHTML = `
      <td class="font-semibold text-dark">${f.flightNumber}</td>
      <td>${f.airline}</td>
      <td style="font-family: var(--font-mono);">${f.originCode} &rarr; ${f.destinationCode}</td>
      <td style="font-family: var(--font-mono);">${f.estimatedDeparture}</td>
      <td><span class="badge delayed">T${f.terminal || '—'}</span></td>
      <td><span class="badge on-time">${gateNum}</span></td>
      <td><span class="badge ${getStatusClass(f.status)}">${f.status}</span></td>
    `;
    tr.addEventListener('click', () => openFlightModal(f));
    tbody.appendChild(tr);
  });
}

function renderLiveTracker() {
  const container = document.getElementById('overview-live-tracker');
  if (!container) return;

  const watched = localDb.getWatchedFlights();
  const watchedFlightsList = flightsData.filter(f => watched.includes(f.flightNumber));
  const active = watchedFlightsList.filter(f => !['departed', 'cancelled'].includes(f.status.toLowerCase()))
                                    .sort((a,b) => a.estimatedDeparture.localeCompare(b.estimatedDeparture));

  if (active.length === 0) {
    container.innerHTML = `
      <div class="empty-visual-state">
        <i data-lucide="navigation-off" style="width: 24px; height: 24px; color: var(--text-muted); margin-bottom: 0.5rem;"></i>
        <div class="empty-title">Tracker Inactive</div>
        <div class="empty-desc">No active watchlist flights to track. Star a flight to start tracking.</div>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();
    return;
  }

  const flight = active[0];
  const progress = flight.status.toLowerCase() === 'boarding' ? 70 : (flight.status.toLowerCase() === 'delayed' ? 20 : 50);

  container.innerHTML = `
    <div class="live-tracker-panel" style="text-align: left;">
      <div style="font-size: 0.75rem; font-weight: 800; color: var(--accent-blue); text-transform: uppercase; margin-bottom: 0.5rem; letter-spacing: 0.5px;">Tracking Active Departure</div>
      <div class="tracker-route-row">
        <div class="tracker-apt-box">
          <span class="tracker-apt-code">${flight.originCode}</span>
          <span class="tracker-apt-name">${flight.origin.split(' ')[0]}</span>
        </div>
        <div class="tracker-path-bar">
          <div class="tracker-path-fill" style="width: ${progress}%;"></div>
          <div class="tracker-path-plane" style="left: ${progress}%;"><i data-lucide="plane" style="width: 14px; height: 14px;"></i></div>
        </div>
        <div class="tracker-apt-box" style="text-align: right;">
          <span class="tracker-apt-code">${flight.destinationCode}</span>
          <span class="tracker-apt-name">${flight.destination.split(' ')[0]}</span>
        </div>
      </div>
      <div class="tracker-milestones" style="margin-top: 0.5rem;">
        <span>Departing ${flight.scheduledDeparture}</span>
        <span>${flight.status}</span>
        <span>Arriving ${flight.scheduledArrival}</span>
      </div>
    </div>
  `;
  if (window.lucide) window.lucide.createIcons();
}

function renderOverviewAnnouncements() {
  const container = document.getElementById('overview-announcements-list');
  if (!container) return;

  const list = getActiveAnnouncements();
  if (list.length === 0) {
    container.innerHTML = `<div style="font-size: 0.8rem; color: var(--text-muted); padding: 1rem 0; text-align: center;">No travel announcements broadcasted.</div>`;
    return;
  }

  container.innerHTML = '';
  list.slice(0, 3).forEach(a => {
    let severity = 'info';
    let icon = 'info';
    if (a.type.toLowerCase() === 'cancellation') {
      severity = 'critical';
      icon = 'alert-octagon';
    } else if (a.type.toLowerCase() === 'delay alert' || a.type.toLowerCase() === 'gate change') {
      severity = 'warning';
      icon = 'alert-triangle';
    }

    const div = document.createElement('div');
    div.className = `alert-item ${severity}`;
    div.style.padding = '0.65rem 0.85rem';
    div.innerHTML = `
      <div class="alert-icon-box"><i data-lucide="${icon}" style="width: 14px; height: 14px;"></i></div>
      <div class="alert-content">
        <div class="alert-title" style="font-size: 0.7rem;">${a.flightNumber} — ${a.type}</div>
        <div class="alert-body" style="font-size: 0.7rem; color: var(--text-secondary);">${a.message}</div>
      </div>
    `;
    container.appendChild(div);
  });
  if (window.lucide) window.lucide.createIcons();
}

let activeMyFlightsCategory = 'upcoming';

function renderMyFlightsPage() {
  const tbody = document.getElementById('my-flights-table-body');
  const emptyState = document.getElementById('my-flights-empty-state');
  const searchInput = document.getElementById('my-flights-search-input');
  if (!tbody) return;

  const watched = localDb.getWatchedFlights();
  const searchQuery = (searchInput && searchInput.value) ? searchInput.value.trim().toLowerCase() : '';

  let list = flightsData.filter(f => watched.includes(f.flightNumber));

  if (activeMyFlightsCategory === 'upcoming') {
    list = list.filter(f => !['departed', 'cancelled'].includes(f.status.toLowerCase()));
  } else if (activeMyFlightsCategory === 'completed') {
    list = list.filter(f => f.status.toLowerCase() === 'departed');
  } else if (activeMyFlightsCategory === 'cancelled') {
    list = list.filter(f => f.status.toLowerCase() === 'cancelled');
  }

  if (searchQuery) {
    list = list.filter(f => f.flightNumber.toLowerCase().includes(searchQuery) ||
                            f.airline.toLowerCase().includes(searchQuery) ||
                            f.destination.toLowerCase().includes(searchQuery));
  }

  tbody.innerHTML = '';
  if (list.length === 0) {
    if (emptyState) emptyState.style.display = 'block';
    return;
  }
  if (emptyState) emptyState.style.display = 'none';

  list.forEach(f => {
    const gateObj = gatesData.find(g => g.id === f.gateId);
    const gateNum = gateObj ? gateObj.gateNumber : '—';
    const tr = document.createElement('tr');
    tr.className = 'clickable-row';
    tr.innerHTML = `
      <td class="font-semibold text-dark">${f.flightNumber}</td>
      <td>${f.airline}</td>
      <td style="font-family: var(--font-mono);">${f.originCode} &rarr; ${f.destinationCode}</td>
      <td style="font-family: var(--font-mono);">${f.scheduledDeparture}</td>
      <td style="font-family: var(--font-mono);">${f.estimatedDeparture}</td>
      <td><span class="badge delayed">T${f.terminal || '—'}</span></td>
      <td><span class="badge on-time">${gateNum}</span></td>
      <td><span class="badge ${getStatusClass(f.status)}">${f.status}</span></td>
    `;
    tr.addEventListener('click', () => openFlightModal(f));
    tbody.appendChild(tr);
  });
}

function renderAirportsPage() {
  const setIata = document.getElementById('set-iata-code');
  const setTerm = document.getElementById('set-terminals-val');
  const setGates = document.getElementById('set-gates-val');
  const headerTitle = document.getElementById('passenger-airport-header-title');

  const airportName = localStorage.getItem('airtrack_airport_name') || 'Chennai International Airport (MAA)';
  const terminals = localStorage.getItem('airtrack_terminal_count') || '2';

  if (headerTitle) headerTitle.textContent = airportName;
  if (setIata) setIata.textContent = airportName.includes('(') ? airportName.split('(')[1].replace(')', '') : 'MAA';
  if (setTerm) setTerm.textContent = `${terminals} Terminals (Active Operations)`;

  const gates = (Array.isArray(window.gatesData) && window.gatesData.length > 0)
    ? window.gatesData
    : ((Array.isArray(gatesData) && gatesData.length > 0) ? gatesData : (typeof localDb !== 'undefined' ? localDb.getGates() : []));

  const flights = (Array.isArray(window.flightsData) && window.flightsData.length > 0)
    ? window.flightsData
    : ((Array.isArray(flightsData) && flightsData.length > 0) ? flightsData : (typeof localDb !== 'undefined' ? localDb.getFlights() : []));

  if (setGates) setGates.textContent = `${gates.length} Operational Parking Bays allocated`;

  // Dynamic Flight Operations Statistics
  const flightsTotalEl = document.getElementById('stat-airports-flights-today');
  const flightsOntimeEl = document.getElementById('stat-airports-ontime');
  const flightsDelayedEl = document.getElementById('stat-airports-delayed');
  const flightsCancelledEl = document.getElementById('stat-airports-cancelled');

  if (flightsTotalEl && flightsOntimeEl && flightsDelayedEl && flightsCancelledEl) {
    if (Array.isArray(flights) && flights.length > 0) {
      flightsTotalEl.textContent = flights.length;
      
      const onTimeCount = flights.filter(f => {
        const s = (f.status || '').toLowerCase();
        return s === 'on time' || s === 'on-time' || s === 'scheduled' || s === 'boarding';
      }).length;
      flightsOntimeEl.textContent = onTimeCount;

      const delayedCount = flights.filter(f => {
        const s = (f.status || '').toLowerCase();
        return s === 'delayed' || s === 'gate changed';
      }).length;
      flightsDelayedEl.textContent = delayedCount;

      const cancelledCount = flights.filter(f => {
        const s = (f.status || '').toLowerCase();
        return s === 'cancelled';
      }).length;
      flightsCancelledEl.textContent = cancelledCount;
    } else {
      flightsTotalEl.textContent = '--';
      flightsOntimeEl.textContent = '--';
      flightsDelayedEl.textContent = '--';
      flightsCancelledEl.textContent = '--';
    }
  }

  // Dynamic Gate Allocation Statistics
  const gateAvailableEl = document.getElementById('stat-airports-gate-available');
  const gateBoardingEl = document.getElementById('stat-airports-gate-boarding');
  const gateOccupiedEl = document.getElementById('stat-airports-gate-occupied');
  const gateMaintenanceEl = document.getElementById('stat-airports-gate-maintenance');

  if (gateAvailableEl && gateBoardingEl && gateOccupiedEl && gateMaintenanceEl) {
    if (Array.isArray(gates) && gates.length > 0) {
      const avail = gates.filter(g => (g.status || '').toLowerCase() === 'available').length;
      const board = gates.filter(g => (g.status || '').toLowerCase() === 'boarding').length;
      const occ = gates.filter(g => (g.status || '').toLowerCase() === 'occupied').length;
      const maint = gates.filter(g => (g.status || '').toLowerCase() === 'maintenance').length;

      gateAvailableEl.textContent = avail;
      gateBoardingEl.textContent = board;
      gateOccupiedEl.textContent = occ;
      gateMaintenanceEl.textContent = maint;
    } else {
      gateAvailableEl.textContent = '--';
      gateBoardingEl.textContent = '--';
      gateOccupiedEl.textContent = '--';
      gateMaintenanceEl.textContent = '--';
    }
  }

  if (window.lucide) window.lucide.createIcons();
}

function openFlightModal(flight) {
  const modal = document.getElementById('flight-modal');
  const modalBody = document.getElementById('flight-modal-body');
  if (!modal || !modalBody) return;

  const gates = (Array.isArray(window.gatesData) && window.gatesData.length > 0) ? window.gatesData : localDb.getGates();
  const gateObj = gates.find(g => g.id === flight.gateId);
  const gateNum = gateObj ? gateObj.gateNumber : (flight.gateNumber || '—');

  modalBody.innerHTML = `
    <div style="text-align: left; display: flex; flex-direction: column; gap: 1rem;">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span style="font-size: 1.2rem; font-weight: 800; font-family: var(--font-mono); color: var(--primary-navy);">${flight.flightNumber}</span>
        <span class="badge ${getStatusClass(flight.status)}">${flight.status}</span>
      </div>
      <div style="font-size: 0.95rem; font-weight: 600; color: var(--text-main);">${flight.airline}</div>
      <div style="display: flex; align-items: center; justify-content: space-between; background: var(--bg-input); padding: 0.85rem; border-radius: 8px;">
        <div>
          <div style="font-size: 0.65rem; color: var(--text-muted); text-transform: uppercase;">Origin</div>
          <div style="font-size: 1.1rem; font-weight: 800; font-family: var(--font-mono);">${flight.originCode}</div>
          <div style="font-size: 0.75rem; color: var(--text-secondary);">${flight.origin}</div>
        </div>
        <i data-lucide="plane" style="width: 18px; height: 18px; color: var(--accent-blue);"></i>
        <div style="text-align: right;">
          <div style="font-size: 0.65rem; color: var(--text-muted); text-transform: uppercase;">Destination</div>
          <div style="font-size: 1.1rem; font-weight: 800; font-family: var(--font-mono);">${flight.destinationCode}</div>
          <div style="font-size: 0.75rem; color: var(--text-secondary);">${flight.destination}</div>
        </div>
      </div>
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem;">
        <div style="background: var(--bg-input); padding: 0.75rem; border-radius: 6px;">
          <div style="font-size: 0.65rem; color: var(--text-muted);">Scheduled Departure</div>
          <div style="font-weight: 700; font-family: var(--font-mono);">${flight.scheduledDeparture}</div>
        </div>
        <div style="background: var(--bg-input); padding: 0.75rem; border-radius: 6px;">
          <div style="font-size: 0.65rem; color: var(--text-muted);">Estimated Departure</div>
          <div style="font-weight: 700; font-family: var(--font-mono);">${flight.estimatedDeparture || flight.scheduledDeparture}</div>
        </div>
        <div style="background: var(--bg-input); padding: 0.75rem; border-radius: 6px;">
          <div style="font-size: 0.65rem; color: var(--text-muted);">Terminal</div>
          <div style="font-weight: 700;">Terminal ${flight.terminal || '—'}</div>
        </div>
        <div style="background: var(--bg-input); padding: 0.75rem; border-radius: 6px;">
          <div style="font-size: 0.65rem; color: var(--text-muted);">Gate</div>
          <div style="font-weight: 700;">${gateNum}</div>
        </div>
      </div>
    </div>
  `;
  modal.classList.add('active');
  modal.classList.add('show');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  if (window.lucide) window.lucide.createIcons();
}

function renderTravelToolsPage() {
  const passContainer = document.getElementById('boarding-pass-card-container');
  const toolSelect = document.getElementById('tool-flight-select');
  if (!passContainer) return;

  // 1. Get authenticated passenger session
  const userSessionStr = sessionStorage.getItem('airtrack_user_session');
  let userEmail = '';
  let passengerName = 'Passenger';

  if (userSessionStr) {
    try {
      const sess = JSON.parse(userSessionStr);
      userEmail = sess.email || '';
      passengerName = sess.name || (userEmail ? userEmail.split('@')[0] : 'Passenger');
    } catch (e) {}
  }

  // 2. Fetch authenticated passenger's bookings ONLY
  const userBookings = localDb.getBookings(userEmail);
  const flights = (Array.isArray(window.flightsData) && window.flightsData.length > 0)
    ? window.flightsData
    : localDb.getFlights();

  // Populate Flight Delay Checker dropdown (tool-flight-select) if present
  if (toolSelect) {
    const prevVal = toolSelect.value;
    toolSelect.innerHTML = '<option value="">-- Choose Flight to Check --</option>';
    flights.forEach(f => {
      const opt = document.createElement('option');
      opt.value = f.flightNumber;
      opt.textContent = `${f.flightNumber} (${f.originCode} → ${f.destinationCode})`;
      toolSelect.appendChild(opt);
    });
    if (prevVal) toolSelect.value = prevVal;
  }

  // 3. IF USER HAS NO BOOKED FLIGHTS
  if (!userEmail || !userBookings || userBookings.length === 0) {
    passContainer.innerHTML = `
      <div class="empty-visual-state" style="padding: 2.5rem 1.5rem; text-align: center; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 12px; margin-top: 0.5rem;">
        <div style="width: 48px; height: 48px; border-radius: 50%; background: rgba(239,68,68,0.1); color: var(--status-cancelled-text); display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem auto;">
          <i data-lucide="ticket-slash" style="width: 24px; height: 24px;"></i>
        </div>
        <h3 style="font-size: 1.1rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.5rem;">NO BOOKED FLIGHTS</h3>
        <p style="font-size: 0.85rem; color: var(--text-secondary); max-width: 450px; margin: 0 auto 1.5rem auto; line-height: 1.45;">
          You don't currently have any booked flights eligible for a boarding pass.
        </p>
        <div style="display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap;">
          <a href="flight-status.html" class="search-button" style="padding: 0.55rem 1.25rem; font-size: 0.8rem; text-decoration: none; display: inline-flex; align-items: center; gap: 0.4rem; border-radius: 6px;">
            <i data-lucide="clock" style="width: 14px; height: 14px;"></i> View Flight Status
          </a>
          <a href="index.html" class="search-button" style="padding: 0.55rem 1.25rem; font-size: 0.8rem; text-decoration: none; display: inline-flex; align-items: center; gap: 0.4rem; background: transparent; border: 1px solid var(--border-color); color: var(--text-main); border-radius: 6px;">
            <i data-lucide="search" style="width: 14px; height: 14px;"></i> Browse Flights
          </a>
        </div>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();
    return;
  }

  // 4. USER HAS BOOKED FLIGHTS: Render Flight Selection panel & Boarding Pass preview area
  const selectedBookingId = window._selectedBoardingPassBookingId || "";

  let optionsHtml = `<option value="">-- Select a booked flight --</option>`;
  userBookings.forEach(b => {
    const flight = flights.find(f => f.id === b.flightId || f.flightNumber === b.flightNumber);
    if (flight) {
      const isSelected = String(b.id) === String(selectedBookingId);
      optionsHtml += `<option value="${b.id}" ${isSelected ? 'selected' : ''}>${flight.flightNumber} — ${flight.airline} — ${flight.originCode} → ${flight.destinationCode} (${flight.estimatedDeparture || flight.scheduledDeparture})</option>`;
    }
  });

  passContainer.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 1.25rem; margin-top: 0.5rem; text-align: left;">
      <p style="font-size: 0.85rem; color: var(--text-secondary); margin: 0;">
        Select one of your booked flights to generate your boarding pass.
      </p>
      
      <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; align-items: center;">
        <div style="flex: 1; min-width: 260px;">
          <label style="font-size: 0.65rem; color: var(--text-secondary); text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px; display: block; margin-bottom: 4px;">SELECT YOUR FLIGHT</label>
          <select id="boarding-pass-flight-select" class="search-input" style="width: 100%; background: var(--bg-input); border: 1px solid var(--border-color); color: var(--text-main); border-radius: 6px; padding: 0.5rem 0.75rem; height: 44px; font-size: 0.85rem;">
            ${optionsHtml}
          </select>
        </div>
        <div style="align-self: flex-end;">
          <button id="btn-generate-boarding-pass" class="search-button" style="height: 44px; padding: 0 1.25rem; font-size: 0.85rem; font-weight: 700; display: inline-flex; align-items: center; gap: 0.5rem; border-radius: 6px;">
            <i data-lucide="ticket" style="width: 16px; height: 16px;"></i>
            GENERATE BOARDING PASS
          </button>
        </div>
      </div>

      <div id="boarding-pass-display-area" style="margin-top: 0.5rem;">
        <!-- Boarding pass or prompt rendered here -->
      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();

  const selectEl = document.getElementById('boarding-pass-flight-select');
  const genBtn = document.getElementById('btn-generate-boarding-pass');
  const displayArea = document.getElementById('boarding-pass-display-area');

  function renderSelectedPass() {
    const bookingId = window._selectedBoardingPassBookingId;
    if (!bookingId) {
      displayArea.innerHTML = `
        <div class="empty-visual-state" style="padding: 2rem; border: 1px dashed var(--border-color); border-radius: 10px; background: rgba(255,255,255,0.02); text-align: center;">
          <i data-lucide="ticket" style="width: 32px; height: 32px; color: var(--text-muted); margin-bottom: 0.5rem;"></i>
          <div class="empty-title" style="font-size: 0.95rem; font-weight: 700; color: var(--text-main);">Select one of your booked flights</div>
          <div class="empty-desc" style="font-size: 0.8rem; color: var(--text-secondary);">Choose a flight from the dropdown above and click "Generate Boarding Pass" to render your ticket.</div>
        </div>
      `;
      if (window.lucide) window.lucide.createIcons();
      return;
    }

    const booking = userBookings.find(b => String(b.id) === String(bookingId));
    if (!booking) {
      displayArea.innerHTML = `
        <div class="alert-item critical" style="padding: 1rem;">
          <div class="alert-content">
            <div class="alert-title">UNAUTHORIZED BOOKING</div>
            <div class="alert-body">The requested booking is not associated with your passenger account.</div>
          </div>
        </div>
      `;
      return;
    }

    const flight = flights.find(f => f.id === booking.flightId || f.flightNumber === booking.flightNumber);
    if (!flight) {
      displayArea.innerHTML = `<div class="empty-desc">Flight details not found.</div>`;
      return;
    }

    const gates = (Array.isArray(window.gatesData) && window.gatesData.length > 0) ? window.gatesData : localDb.getGates();
    const gateObj = gates.find(g => g.id === flight.gateId);
    const gateNum = gateObj ? gateObj.gateNumber : (flight.gateNumber || '—');

    // IF FLIGHT IS CANCELLED
    if (flight.status.toLowerCase() === 'cancelled') {
      displayArea.innerHTML = `
        <div style="background-color: var(--primary-navy); border: 2px solid var(--status-cancelled-text); border-radius: 12px; overflow: hidden; padding: 1.5rem; text-align: left; box-shadow: var(--shadow-lg);">
          <div style="display: flex; align-items: center; gap: 0.75rem; color: var(--status-cancelled-text); margin-bottom: 1rem; border-bottom: 1px dashed rgba(239,68,68,0.3); padding-bottom: 0.75rem;">
            <i data-lucide="alert-octagon" style="width: 28px; height: 28px; flex-shrink: 0;"></i>
            <div>
              <div style="font-weight: 800; font-size: 1.1rem; letter-spacing: 0.5px;">FLIGHT CANCELLED — BOARDING PASS INVALID</div>
              <div style="font-size: 0.75rem; color: var(--text-secondary); font-family: var(--font-mono);">Booking Ref: ${booking.bookingReference} &bull; Flight: ${flight.flightNumber}</div>
            </div>
          </div>
          <p style="font-size: 0.85rem; color: var(--text-light); line-height: 1.5; margin: 0;">
            Flight <strong>${flight.flightNumber}</strong> from <strong>${flight.origin}</strong> to <strong>${flight.destination}</strong> has been cancelled by airport operations. Your digital boarding pass cannot be used for gate clearance or aircraft boarding. Please contact your airline customer service counter.
          </p>
        </div>
      `;
      if (window.lucide) window.lucide.createIcons();
      return;
    }

    // REAL BOARDING PASS
    displayArea.innerHTML = `
      <div style="background-color: var(--primary-navy); color: white; border-radius: 12px; overflow: hidden; border: 1px solid var(--border-color); text-align: left; box-shadow: var(--shadow-lg);">
        <div style="background-color: var(--bg-nav); padding: 1.25rem 1.5rem; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px dashed rgba(255,255,255,0.15);">
          <div>
            <span style="font-size: 0.65rem; color: var(--accent-cyan); font-weight: 800; letter-spacing: 1px; text-transform: uppercase;">AirTrack Official Boarding Pass</span>
            <div style="font-size: 1.15rem; font-weight: 800; font-family: var(--font-mono);">${flight.flightNumber} &bull; ${flight.airline.toUpperCase()}</div>
          </div>
          <div style="font-size: 0.75rem; color: var(--status-ontime-text); font-weight: 800; border: 1px solid var(--status-ontime-border); background: var(--status-ontime-bg); padding: 2px 8px; border-radius: 4px;">
            ${flight.status.toUpperCase()}
          </div>
        </div>
        
        <div style="padding: 1.5rem; display: flex; flex-direction: column; gap: 1.25rem;">
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem;">
            <div>
              <span style="font-size: 0.65rem; color: rgba(255,255,255,0.5); text-transform: uppercase; display: block; font-weight: 700; letter-spacing: 0.5px;">Passenger Name</span>
              <span style="font-size: 0.95rem; font-weight: 700; color: white;">${passengerName}</span>
            </div>
            <div>
              <span style="font-size: 0.65rem; color: rgba(255,255,255,0.5); text-transform: uppercase; display: block; font-weight: 700; letter-spacing: 0.5px;">Booking Ref</span>
              <span style="font-size: 0.95rem; font-weight: 700; color: var(--accent-cyan); font-family: var(--font-mono);">${booking.bookingReference}</span>
            </div>
            <div>
              <span style="font-size: 0.65rem; color: rgba(255,255,255,0.5); text-transform: uppercase; display: block; font-weight: 700; letter-spacing: 0.5px;">Seat Assignment</span>
              <span style="font-size: 0.95rem; font-weight: 700; color: white; font-family: var(--font-mono);">${booking.seatNumber}</span>
            </div>
          </div>
          
          <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 1rem; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 1rem;">
            <div style="display: flex; flex-direction: column;">
              <span style="font-family: var(--font-mono); font-size: 1.6rem; font-weight: 800; line-height: 1.1;">${flight.originCode}</span>
              <span style="font-size: 0.7rem; color: rgba(255,255,255,0.6);">${flight.origin.split(' ')[0]}</span>
            </div>
            <div style="flex-grow: 1; border-top: 2px dashed rgba(255,255,255,0.15); margin: 0 1.5rem; position: relative;">
              <i data-lucide="plane" style="width: 14px; height: 14px; color: var(--accent-cyan); position: absolute; top: -8px; left: 50%; transform: translateX(-50%) rotate(90deg);"></i>
            </div>
            <div style="display: flex; flex-direction: column; text-align: right;">
              <span style="font-family: var(--font-mono); font-size: 1.6rem; font-weight: 800; line-height: 1.1;">${flight.destinationCode}</span>
              <span style="font-size: 0.7rem; color: rgba(255,255,255,0.6);">${flight.destination.split(' ')[0]}</span>
            </div>
          </div>
          
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 1rem;">
            <div>
              <span style="font-size: 0.65rem; color: rgba(255,255,255,0.5); text-transform: uppercase; display: block; font-weight: 700; letter-spacing: 0.5px;">Estimated</span>
              <span style="font-size: 0.95rem; font-weight: 700; color: white; font-family: var(--font-mono);">${flight.estimatedDeparture || flight.scheduledDeparture}</span>
            </div>
            <div>
              <span style="font-size: 0.65rem; color: rgba(255,255,255,0.5); text-transform: uppercase; display: block; font-weight: 700; letter-spacing: 0.5px;">Terminal</span>
              <span style="font-size: 0.95rem; font-weight: 700; color: white; font-family: var(--font-mono);">Terminal ${flight.terminal || '—'}</span>
            </div>
            <div>
              <span style="font-size: 0.65rem; color: rgba(255,255,255,0.5); text-transform: uppercase; display: block; font-weight: 700; letter-spacing: 0.5px;">Gate</span>
              <span style="font-size: 0.95rem; font-weight: 700; color: white; font-family: var(--font-mono);">${gateNum}</span>
            </div>
          </div>
          
          <div style="display: flex; flex-direction: column; align-items: center; gap: 0.25rem;">
            <div style="background-color: white; padding: 0.5rem 1.5rem; border-radius: 4px; display: flex; gap: 3px; width: fit-content;">
              <div style="width: 2px; height: 35px; background: black;"></div>
              <div style="width: 1px; height: 35px; background: black;"></div>
              <div style="width: 3px; height: 35px; background: black;"></div>
              <div style="width: 1px; height: 35px; background: black;"></div>
              <div style="width: 2px; height: 35px; background: black;"></div>
              <div style="width: 1px; height: 35px; background: black;"></div>
              <div style="width: 4px; height: 35px; background: black;"></div>
              <div style="width: 2px; height: 35px; background: black;"></div>
              <div style="width: 1px; height: 35px; background: black;"></div>
              <div style="width: 3px; height: 35px; background: black;"></div>
              <div style="width: 1px; height: 35px; background: black;"></div>
              <div style="width: 2px; height: 35px; background: black;"></div>
              <div style="width: 1px; height: 35px; background: black;"></div>
              <div style="width: 4px; height: 35px; background: black;"></div>
              <div style="width: 2px; height: 35px; background: black;"></div>
              <div style="width: 1px; height: 35px; background: black;"></div>
              <div style="width: 3px; height: 35px; background: black;"></div>
              <div style="width: 1px; height: 35px; background: black;"></div>
              <div style="width: 2px; height: 35px; background: black;"></div>
            </div>
            <span style="font-size: 0.55rem; color: rgba(255,255,255,0.4); font-family: var(--font-mono); letter-spacing: 3px;">REF:${booking.bookingReference}-SCAN</span>
          </div>
        </div>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();
  }

  // Render initial state
  renderSelectedPass();

  // Event handlers
  if (genBtn && selectEl) {
    genBtn.onclick = function() {
      const val = selectEl.value;
      if (!val) {
        showToast("Please select one of your booked flights first.", "warning");
        return;
      }
      window._selectedBoardingPassBookingId = val;
      renderSelectedPass();
      showToast("Digital Boarding Pass Generated", "success");
    };
  }
}

function renderFlightsTable() {
  const tbody = document.getElementById('flight-table-body');
  const emptyState = document.getElementById('table-empty-state');
  if (!tbody) return;
  
  tbody.innerHTML = '';

  const filtered = flightsData.filter(flight => {
    const matchesStatus = (passengerUI.statusFilter === "all" || flight.status.toLowerCase() === passengerUI.statusFilter);
    const q = passengerUI.searchQuery.toLowerCase().replace(/\s+/g, '');
    const matchesSearch = (!q || 
      flight.flightNumber.toLowerCase().replace(/\s+/g, '').includes(q) ||
      flight.airline.toLowerCase().replace(/\s+/g, '').includes(q) ||
      flight.destination.toLowerCase().replace(/\s+/g, '').includes(q) ||
      flight.destinationCode.toLowerCase().replace(/\s+/g, '').includes(q) ||
      flight.origin.toLowerCase().replace(/\s+/g, '').includes(q) ||
      flight.originCode.toLowerCase().replace(/\s+/g, '').includes(q)
    );
    return matchesStatus && matchesSearch;
  });

  if (filtered.length === 0) {
    if (emptyState) emptyState.style.display = 'block';
    return;
  }
  if (emptyState) emptyState.style.display = 'none';

  filtered.forEach(flight => {
    const isWatched = watchedFlights.includes(flight.flightNumber);
    const gateObj = gatesData.find(g => g.id === flight.gateId);
    const gateNum = gateObj ? gateObj.gateNumber : "—";
    const terminal = flight.terminal || (gateObj ? gateObj.terminal : "—");

    const tr = document.createElement('tr');
    tr.className = 'clickable-row';
    tr.innerHTML = `
      <td>
        <button class="watchlist-btn-icon ${isWatched ? 'active' : ''}" data-fnum="${flight.flightNumber}" title="${isWatched ? 'Remove from Watchlist' : 'Watch Flight'}">
          <i data-lucide="star"></i>
        </button>
        <span class="font-semibold text-dark">${flight.flightNumber}</span>
      </td>
      <td>
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <div class="airline-logo">${flight.airlineCode || flight.airline.substring(0,2).toUpperCase()}</div>
          <span style="font-weight: 500;">${flight.airline}</span>
        </div>
      </td>
      <td>
        <div style="display: flex; flex-direction: column;">
          <span style="font-weight: 600; color: var(--primary-navy);">${flight.destinationCode}</span>
          <span style="font-size: 0.75rem; color: var(--text-muted);">${flight.destination.split(' ')[0]}</span>
        </div>
      </td>
      <td>${flight.scheduledDeparture}</td>
      <td class="${flight.delayMinutes > 0 ? 'text-danger font-semibold' : ''}">${flight.estimatedDeparture}</td>
      <td><span class="badge delayed">T${terminal}</span></td>
      <td><span class="badge on-time">${gateNum}</span></td>
      <td><span class="badge ${getStatusClass(flight.status)}">${flight.status}</span></td>
    `;
    
    tr.addEventListener('click', (e) => {
      if (e.target.closest('.watchlist-btn-icon')) return;
      openFlightModal(flight);
    });

    tbody.appendChild(tr);
  });

  tbody.querySelectorAll('.watchlist-btn-icon').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleWatchFlight(btn.dataset.fnum);
    });
  });
  if (window.lucide) window.lucide.createIcons();
}

function renderGatesGrid() {
  const grid = document.getElementById('gates-grid');
  if (!grid) return;
  
  grid.innerHTML = '';

  const filteredGates = gatesData.filter(gate => {
    return passengerUI.terminalFilter === 'all' || gate.terminal === passengerUI.terminalFilter;
  });

  filteredGates.forEach(gate => {
    const flight = flightsData.find(f => f.gateId === gate.id && !['departed', 'cancelled'].includes(f.status.toLowerCase()));
    
    const div = document.createElement('div');
    div.className = `gate-visual-card ${gate.status.toLowerCase()}`;
    div.style.height = '105px';
    div.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; width:100%;">
        <span class="gate-num">${gate.gateNumber}</span>
        <span class="gate-term">T${gate.terminal}</span>
      </div>
      <div class="gate-status-tag" style="margin-top:0.45rem;">
        ${flight ? `<span style="font-weight:800; font-family:var(--font-mono); color:var(--text-main);">${flight.flightNumber}</span> (${gate.status})` : gate.status}
      </div>
    `;
    grid.appendChild(div);
  });
}

function renderWatchlist() {
  const container = document.getElementById('watchlist-list');
  if (!container) return;

  container.innerHTML = '';
  const watched = localDb.getWatchedFlights();
  
  if (watched.length === 0) {
    container.innerHTML = `
      <div class="empty-visual-state">
        <i data-lucide="star" style="width: 20px; height: 20px; color: var(--text-muted); margin-bottom: 0.25rem; opacity: 0.5;"></i>
        <div class="empty-desc">Star flights on the Status Board to receive gate alerts.</div>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();
    return;
  }

  watched.forEach(fNum => {
    const flight = flightsData.find(f => f.flightNumber === fNum);
    if (!flight) return;

    const gateObj = gatesData.find(g => g.id === flight.gateId);
    const gateNum = gateObj ? gateObj.gateNumber : "—";
    
    const card = document.createElement('div');
    card.className = 'watchlist-item';
    card.style.padding = '0.75rem 0';
    card.style.borderBottom = '1px solid var(--border-color)';
    card.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
        <div class="watchlist-flight-box">
          <span class="watchlist-flight-num">${flight.flightNumber} &bull; ${flight.destinationCode}</span>
          <span class="watchlist-flight-route" style="font-size:0.7rem; color:var(--text-muted);">Est departure: ${flight.estimatedDeparture}</span>
        </div>
        <div style="display:flex; align-items:center; gap:0.5rem;">
          <span class="badge ${getStatusClass(flight.status)}" style="font-size: 0.6rem; padding: 2px 6px;">${flight.status}</span>
          <button class="btn-unwatch" data-fnum="${flight.flightNumber}" style="background: none; border: none; color: var(--status-cancelled-text); cursor: pointer; display: flex; align-items: center; padding:0.25rem;">
            <i data-lucide="star-off" style="width: 14px; height: 14px;"></i>
          </button>
        </div>
      </div>
    `;

    card.querySelector('.btn-unwatch').addEventListener('click', (e) => {
      e.stopPropagation();
      toggleWatchFlight(fNum);
    });

    container.appendChild(card);
  });
  if (window.lucide) window.lucide.createIcons();
}

function renderAnnouncements() {
  const countBadge = document.getElementById('unread-count');
  const modalBody = document.getElementById('announcements-modal-body');

  const announcements = getActiveAnnouncements();
  const unread = announcements.filter(a => a.unread !== false).length;

  if (countBadge) {
    countBadge.textContent = unread;
    if (unread > 0) {
      countBadge.classList.remove('hidden');
      countBadge.style.display = 'flex';
    } else {
      countBadge.classList.add('hidden');
      countBadge.style.display = 'none';
    }
  }

  if (modalBody) {
    modalBody.innerHTML = '';
    if (announcements.length === 0) {
      modalBody.innerHTML = '<p style="text-align: center; color: var(--text-secondary); font-size: 0.8rem;">No announcements broadcasted today.</p>';
    } else {
      announcements.forEach(a => {
        let severity = 'info';
        if (a.type.toLowerCase() === 'cancellation') severity = 'critical';
        else if (a.type.toLowerCase() === 'delay alert' || a.type.toLowerCase() === 'gate change') severity = 'warning';

        const item = document.createElement('div');
        item.className = `alert-item ${severity}`;
        item.innerHTML = `
          <div class="alert-icon-box"><i data-lucide="bell" style="width: 14px; height: 14px;"></i></div>
          <div class="alert-content">
            <div class="alert-title">${a.type} &bull; ${a.flightNumber}</div>
            <div class="alert-body">${a.message}</div>
            <div class="alert-time">${a.time}</div>
          </div>
        `;
        modalBody.appendChild(item);
      });
    }
    if (window.lucide) window.lucide.createIcons();
  }
}

function toggleWatchFlight(fNum) {
  let watched = localDb.getWatchedFlights();
  if (watched.includes(fNum)) {
    watched = watched.filter(num => num !== fNum);
    delete lastWatchedGates[fNum];
    showToast(`Flight ${fNum} removed from watchlist`, 'warning');
  } else {
    watched.push(fNum);
    const flight = flightsData.find(f => f.flightNumber === fNum);
    const gateObj = gatesData.find(g => g.id === flight.gateId);
    lastWatchedGates[fNum] = gateObj ? gateObj.gateNumber : "None";
    showToast(`Watching flight ${fNum}! You will receive gate alerts.`, 'success');
  }
  localDb.saveWatchedFlights(watched);
  renderAllViews();
}

async function fetchPassengerDataFromBackend() {
  const client = (typeof getSupabaseClient === 'function') ? getSupabaseClient() : null;
  if (client) {
    try {
      const { data: sFlights, error: sErr } = await client.from('flights').select('*').order('id', { ascending: true });
      if (!sErr && Array.isArray(sFlights) && sFlights.length > 0) {
        memoryFlights = sFlights.map(f => ({
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
        window.flightsData = memoryFlights;
      }
    } catch (e) {
      console.warn("Passenger Supabase direct query notice:", e);
    }

    try {
      const { data: sGates, error: gErr } = await client.from('gates').select('*').order('id', { ascending: true });
      if (!gErr && Array.isArray(sGates) && sGates.length > 0) {
        memoryGates = sGates.map(g => ({
          id: g.id,
          gateNumber: g.gate_number,
          terminal: g.terminal,
          status: g.status
        }));
        localDb.saveGates(memoryGates);
        gatesData = memoryGates;
        window.gatesData = memoryGates;
      }
    } catch (e) {
      console.warn("Passenger Supabase direct gate query notice:", e);
    }
    syncDataStore();
    renderAllViews();
    if (window.lucide) window.lucide.createIcons();
    return;
  }

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
        window.flightsData = memoryFlights;
        console.log('AIRTRACK PASSENGER FLIGHTS:', memoryFlights);
      }
    }
  } catch (e) {
    console.warn("Passenger flights backend sync notice:", e);
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
        window.gatesData = memoryGates;
      }
    }
  } catch (e) {
    console.warn("Passenger gates backend sync notice:", e);
  }
  syncDataStore();
  renderAllViews();
  if (window.lucide) window.lucide.createIcons();
}

function updateTimestamp() {
  const timestampEl = document.getElementById('last-updated-timestamp') || document.getElementById('live-timestamp');
  if (timestampEl) {
    const now = new Date();
    timestampEl.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}

function closeActiveModals() {
  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.classList.remove('active');
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
  });
  document.body.style.overflow = '';
}

function initPassengerNavbarControls() {
  console.log('AIRTRACK NOTIFICATION READY');
  console.log('AIRTRACK PROFILE READY');

  // 1. Notification Bell
  const openAnnBtn = document.getElementById('passenger-notification-trigger') || document.getElementById('btn-announcements');
  const annModal = document.getElementById('announcements-modal');
  const closeAnnBtn = document.getElementById('passenger-notification-close') || document.getElementById('announcements-modal-close');

  if (openAnnBtn && annModal) {
    openAnnBtn.onclick = function(e) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      console.log('AIRTRACK NOTIFICATION CLICK');
      annModal.classList.add('active');
      annModal.setAttribute('aria-hidden', 'false');

      if (typeof localDb !== 'undefined' && typeof localDb.getAnnouncements === 'function') {
        const announcements = localDb.getAnnouncements();
        announcements.forEach(a => a.unread = false);
        localDb.saveAnnouncements(announcements);
      }
      if (typeof renderAnnouncements === 'function') {
        renderAnnouncements();
      }
      if (window.lucide) window.lucide.createIcons();
    };
  }

  // 2. Notification X Close Button
  if (closeAnnBtn && annModal) {
    closeAnnBtn.onclick = function(e) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      console.log('AIRTRACK NOTIFICATION CLOSE CLICK');
      annModal.classList.remove('active');
      annModal.classList.remove('show');
      annModal.setAttribute('aria-hidden', 'true');
    };
  }

  // 3. Profile Dropdown & Trigger
  const profileTrigger = document.getElementById('passenger-profile-trigger');
  const profileDropdown = document.getElementById('passenger-profile-dropdown') || document.getElementById('passenger-dropdown-menu');

  if (profileTrigger && profileDropdown) {
    profileTrigger.onclick = function(e) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      console.log('AIRTRACK PROFILE CLICK');
      profileDropdown.classList.toggle('show');
    };

    profileDropdown.onclick = function(e) {
      e.stopPropagation();
    };
  }

  // 4. Sign Out button
  const logoutBtn = document.getElementById('btn-passenger-logout') || document.getElementById('btn-user-logout');
  if (logoutBtn) {
    logoutBtn.onclick = function(e) {
      window.handlePassengerSignOut(e);
    };
  }
}

// 8. INITIALIZATION & STORAGE CROSS-TAB EVENT SYNC
async function initPassengerApp() {
  console.log("AIRTRACK USER INIT STARTED");
  closeActiveModals();
  initPassengerNavbarControls();

  localDb.getFlights();
  localDb.getGates();
  localDb.getAnnouncements();
  localDb.getActivityLogs();

  renderAllViews();
  updateTimestamp();
  if (window.lucide) window.lucide.createIcons();

  await fetchPassengerDataFromBackend();
  renderAllViews();
  if (window.lucide) window.lucide.createIcons();

  window.addEventListener('storage', (e) => {
    if (e.key && e.key.startsWith('airtrack_')) {
      console.log(`Cross-tab synchronization: ${e.key}`);
      renderAllViews();
    }
  });

  // Mobile menu toggle
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const navLinks = document.getElementById('nav-links');
  if (mobileMenuToggle && navLinks) {
    mobileMenuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('mobile-open');
    });
  }

  const markReadBtn = document.getElementById('btn-mark-all-read');
  if (markReadBtn) {
    markReadBtn.addEventListener('click', () => {
      const announcements = localDb.getAnnouncements();
      announcements.forEach(a => a.unread = false);
      localDb.saveAnnouncements(announcements);
      renderAnnouncements();
      showToast("All announcements marked read", "success");
    });
  }

  // Gate Map Finder toggle modal
  const gateFinderModal = document.getElementById('gate-finder-modal');
  const openGateFinderBtn = document.getElementById('btn-open-gate-finder');
  const closeGateFinderBtn = document.getElementById('gate-finder-modal-close');
  if (openGateFinderBtn && gateFinderModal) {
    openGateFinderBtn.addEventListener('click', () => {
      gateFinderModal.classList.add('active');
      gateFinderModal.setAttribute('aria-hidden', 'false');
      
      const mapBody = document.getElementById('gate-finder-modal-body');
      if (mapBody) {
        mapBody.innerHTML = `
          <div style="display:flex; flex-direction:column; gap:1rem; text-align:left;">
            <p style="font-size:0.8rem; color:var(--text-secondary); line-height:1.45;">Visual concourse layout maps representing active aircraft allocations.</p>
            <div style="background-color: var(--primary-navy); border-radius: 8px; padding: 1.5rem; text-align: center; border: 1px solid var(--border-color); color: white;">
              <div style="font-weight: 700; font-size: 0.95rem; margin-bottom: 0.5rem; color: var(--accent-cyan);">DOMESTIC TERMINAL 1 (CONCOURSE A)</div>
              <div style="font-family: var(--font-mono); font-size: 1.1rem; letter-spacing: 2px;">[ GATE A01 ] ─── [ GATE A02 ] ─── [ GATE A03 ]</div>
            </div>
            <div style="background-color: var(--primary-navy); border-radius: 8px; padding: 1.5rem; text-align: center; border: 1px solid var(--border-color); color: white;">
              <div style="font-weight: 700; font-size: 0.95rem; margin-bottom: 0.5rem; color: var(--accent-cyan);">INTERNATIONAL TERMINAL 2 (CONCOURSE B)</div>
              <div style="font-family: var(--font-mono); font-size: 1.1rem; letter-spacing: 2px;">[ B01 ] ─── [ B02 ] ─── [ B03 ] ─── [ B04 ] ─── [ B05 ]</div>
            </div>
          </div>
        `;
      }
    });
  }
  if (closeGateFinderBtn) {
    closeGateFinderBtn.addEventListener('click', () => closeActiveModals());
  }

  // Flight search input logic
  initPassengerSearch();

  // Status Filter Pills
  document.querySelectorAll('.filter-pill:not(.gate-filter-pill)').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.filter-pill:not(.gate-filter-pill)').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      passengerUI.statusFilter = pill.dataset.status;
      renderFlightsTable();
    });
  });

  // Gate Terminal Filter Pills
  document.querySelectorAll('#terminal-pills-wrapper .filter-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('#terminal-pills-wrapper .filter-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      passengerUI.terminalFilter = pill.dataset.terminal;
      renderGatesGrid();
    });
  });

  // My Flights Filter category pills
  document.querySelectorAll('#my-flights-filter-pills .filter-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('#my-flights-filter-pills .filter-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeMyFlightsCategory = pill.dataset.category;
      renderMyFlightsPage();
    });
  });

  const myFlightsSearch = document.getElementById('my-flights-search-input');
  if (myFlightsSearch) {
    myFlightsSearch.addEventListener('input', () => renderMyFlightsPage());
  }

  const tableSearch = document.getElementById('table-search-input');
  if (tableSearch) {
    tableSearch.addEventListener('input', () => {
      passengerUI.searchQuery = tableSearch.value;
      renderFlightsTable();
    });
  }

  const toolSelect = document.getElementById('tool-flight-select');
  if (toolSelect) {
    toolSelect.addEventListener('change', () => {
      const delayBox = document.getElementById('tool-delay-result');
      if (!delayBox) return;
      if (!toolSelect.value) {
        delayBox.style.display = 'none';
        return;
      }
      
      const flight = flightsData.find(f => f.flightNumber === toolSelect.value);
      if (flight) {
        delayBox.innerHTML = `
          <div class="alert-content">
            <div class="alert-title">${flight.flightNumber} Delay Analysis</div>
            <div class="alert-body" style="font-size:0.8rem; margin-top:0.25rem;">
              Flight is running with <strong>${flight.delayMinutes} minutes</strong> delay. 
              Estimated departure time is set for <strong>${flight.estimatedDeparture}</strong>.
            </div>
          </div>
        `;
        delayBox.style.display = 'flex';
      }
    });
  }

  // Close modals outside click
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeActiveModals();
      }
    });
  });

  const flightModalClose = document.getElementById('flight-modal-close');
  if (flightModalClose) {
    flightModalClose.addEventListener('click', () => closeActiveModals());
  }

  // Manual refresh button trigger
  document.querySelectorAll('.btn-refresh-trigger').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.classList.add('spinning');
      setTimeout(() => {
        renderAllViews();
        btn.classList.remove('spinning');
        showToast("Passenger boards updated", "success");
      }, 500);
    });
  });

  // Global click diagnostic for event flow verification
  document.addEventListener('click', (e) => {
    console.log('AIRTRACK CLICK:', e.target);
  });

  // Bind logout listener
  const btnUserLogout = document.getElementById('btn-passenger-logout') || document.getElementById('btn-user-logout');
  if (btnUserLogout) {
    btnUserLogout.addEventListener('click', async (e) => {
      await window.handlePassengerSignOut(e);
    });
  }

  console.log('AIRTRACK USER INIT BEFORE END');
  console.log('AIRTRACK USER INIT FINISHED');
}

function handlePassengerFlightSearch(event) {
  if (event) event.preventDefault();

  console.log('AIRTRACK FIND FLIGHT CLICKED');
  console.log('AIRTRACK FIND FLIGHT HANDLER FIRED');

  const input = document.getElementById('search-input');
  const rawQuery = input ? input.value.trim() : '';
  const query = rawQuery.toLowerCase();
  const resultsContainer = document.getElementById('search-results-container');
  const resultsSection = document.getElementById('search-results-section');

  console.log('AIRTRACK FIND FLIGHT:', query);

  if (resultsSection) resultsSection.style.display = 'block';

  if (!query) {
    if (resultsContainer) {
      resultsContainer.innerHTML = `<div class="search-message" style="text-align: center; color: var(--text-muted); padding: 1.25rem 0; font-size: 0.85rem;">Enter a flight number, airport, route, or gate to search.</div>`;
    }
    return;
  }

  // USE THE EXISTING LOADED FLIGHT ARRAY
  const flights = (Array.isArray(window.flightsData) && window.flightsData.length > 0)
    ? window.flightsData
    : ((Array.isArray(flightsData) && flightsData.length > 0)
      ? flightsData
      : (Array.isArray(memoryFlights) ? memoryFlights : []));

  const results = flights.filter(flight => {
    if (!flight) return false;
    const gateObj = (Array.isArray(gatesData) ? gatesData : (typeof seedGates !== 'undefined' ? seedGates : [])).find(g => String(g.id) === String(flight.gateId));
    const gateNum = gateObj ? gateObj.gateNumber : (flight.gateNumber || '');
    const normQuery = query.replace(/[\s-]/g, '');
    const fNumNorm = (flight.flightNumber || '').toLowerCase().replace(/[\s-]/g, '');
    const gateNumNorm = gateNum.toLowerCase().replace(/[\s-]/g, '');

    const searchable = [
      flight.flightNumber,
      flight.airline,
      flight.airlineCode,
      flight.origin,
      flight.originCode,
      flight.destination,
      flight.destinationCode,
      flight.gateId,
      gateNum,
      flight.terminal ? `T${flight.terminal}` : '',
      flight.terminal ? `Terminal ${flight.terminal}` : '',
      `${flight.originCode} ${flight.destinationCode}`,
      `${flight.originCode}→${flight.destinationCode}`,
      `${flight.originCode}->${flight.destinationCode}`,
      flight.status
    ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

    return searchable.includes(query) || 
           (normQuery && fNumNorm.includes(normQuery)) ||
           (normQuery && gateNumNorm && gateNumNorm.includes(normQuery));
  });

  console.log('AIRTRACK SEARCH RESULTS:', results);

  renderPassengerSearchResults(results, resultsContainer, rawQuery);
}

function renderPassengerSearchResults(results, container, query) {
  if (!container) {
    console.error('AIRTRACK: search-results-container NOT FOUND');
    return;
  }
  if (!results || results.length === 0) {
    container.innerHTML = `<div class="search-message" style="text-align: center; color: var(--text-muted); padding: 1.25rem 0; font-size: 0.85rem;">No flights found for "${query}".</div>`;
    return;
  }

  let html = `<div style="display: flex; flex-direction: column; gap: 0.75rem; width: 100%;">`;
  results.forEach(f => {
    const currentWatched = (typeof localDb !== 'undefined' && typeof localDb.getWatchedFlights === 'function') ? localDb.getWatchedFlights() : (Array.isArray(watchedFlights) ? watchedFlights : []);
    const watched = currentWatched.includes(f.flightNumber);
    const gateObj = (Array.isArray(gatesData) ? gatesData : []).find(g => String(g.id) === String(f.gateId));
    const gateNum = gateObj ? gateObj.gateNumber : (f.gateNumber || 'None');
    html += `
      <div style="display: flex; align-items: center; justify-content: space-between; background: var(--bg-card); border: 1px solid var(--border-color); padding: 0.85rem 1.25rem; border-radius: 8px; box-shadow: var(--shadow);">
        <div style="text-align: left;">
          <div style="font-weight: 700; color: var(--primary-navy); font-family: var(--font-mono); font-size: 0.95rem;">${f.flightNumber} &bull; ${f.airline}</div>
          <div style="font-size: 0.82rem; color: var(--text-secondary); margin-top: 4px;">
            ${f.originCode} &rarr; ${f.destinationCode} | Dept: ${f.estimatedDeparture || f.scheduledDeparture} | Gate ${gateNum} | T${f.terminal || '—'}
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <span class="badge ${getStatusClass(f.status)}" style="font-size: 0.7rem;">${f.status}</span>
          <button class="search-button btn-watch-search" data-fnum="${f.flightNumber}" style="padding: 0.4rem 0.85rem; font-size: 0.75rem; width: auto; height: 34px;">
            ${watched ? 'Unwatch' : 'Watch'}
          </button>
        </div>
      </div>
    `;
  });
  html += `</div>`;
  container.innerHTML = html;
  container.querySelectorAll('.btn-watch-search').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleWatchFlight(btn.dataset.fnum);
      handlePassengerFlightSearch(null);
    });
  });
  if (window.lucide) window.lucide.createIcons();
}

function initPassengerSearch() {
  const form = document.getElementById('search-form');
  const btn = document.getElementById('btn-find-flight');
  const input = document.getElementById('search-input');

  if (!form) {
    console.error('AIRTRACK: search-form NOT FOUND');
    return;
  }

  form.removeEventListener('submit', handlePassengerFlightSearch);
  form.addEventListener('submit', handlePassengerFlightSearch);

  if (btn) {
    btn.removeEventListener('click', handlePassengerFlightSearch);
    btn.addEventListener('click', (e) => {
      handlePassengerFlightSearch(e);
    });
  }

  if (input) {
    input.removeEventListener('input', handlePassengerFlightSearch);
    input.addEventListener('input', handlePassengerFlightSearch);
  }

  const urlParams = new URLSearchParams(window.location.search);
  const queryParam = urlParams.get('q');
  if (queryParam && input) {
    input.value = queryParam;
    handlePassengerFlightSearch(null);
  }

  console.log('AIRTRACK FIND FLIGHT HANDLER ATTACHED');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPassengerApp);
} else {
  initPassengerApp();
}

// --- GLOBAL DROPDOWN HANDLERS ---
window.togglePassengerProfileDropdown = function(e) {
  if (e) {
    if (typeof e.preventDefault === 'function') e.preventDefault();
    if (typeof e.stopPropagation === 'function') e.stopPropagation();
  }
  console.log('AIRTRACK PROFILE CLICK');
  const dropdown = document.getElementById('passenger-profile-dropdown') || document.getElementById('passenger-dropdown-menu');
  if (dropdown) {
    dropdown.classList.toggle('show');
  }
};

window.handlePassengerSignOut = async function(e) {
  if (e) {
    if (typeof e.preventDefault === 'function') e.preventDefault();
    if (typeof e.stopPropagation === 'function') e.stopPropagation();
  }
  console.log('AIRTRACK SIGNOUT CLICK');
  const dropdown = document.getElementById('passenger-profile-dropdown') || document.getElementById('passenger-dropdown-menu');
  if (dropdown) dropdown.classList.remove('show');
  
  if (typeof logoutUser === 'function') {
    await logoutUser();
  } else {
    sessionStorage.removeItem('airtrack_user_session');
  }
  if (typeof updatePassengerNavbar === 'function') {
    updatePassengerNavbar();
  }
  if (typeof showToast === 'function') {
    showToast("Signed out successfully", "success");
  }
  setTimeout(() => {
    window.location.href = '/user/login.html';
  }, 300);
};

document.addEventListener('click', (e) => {
  const closeBtn = e.target.closest('#flight-modal-close') || 
                   e.target.closest('#passenger-notification-close') ||
                   e.target.closest('#gate-finder-modal-close') ||
                   e.target.closest('.modal-close-btn');
  if (closeBtn) {
    e.preventDefault();
    e.stopPropagation();
    closeActiveModals();
    return;
  }
  const dropdown = document.getElementById('passenger-profile-dropdown') || document.getElementById('passenger-dropdown-menu');
  const trigger = document.getElementById('passenger-profile-trigger');
  if (dropdown && dropdown.classList.contains('show')) {
    if (trigger && !trigger.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.classList.remove('show');
    }
  }
});

window.handlePassengerFlightSearch = handlePassengerFlightSearch;
window.renderPassengerSearchResults = renderPassengerSearchResults;
window.initPassengerSearch = initPassengerSearch;


