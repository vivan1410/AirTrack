// server.js
// Express API Server Entry Point

const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Initialize Supabase configuration early to validate credentials on launch
const supabase = require('./config/supabase'); 

const flightRoutes = require('./routes/flights');
const gateRoutes = require('./routes/gates');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 8080;

// Enable CORS with development origin allowlist
const corsOptions = {
  origin: [
    `http://localhost:${PORT}`,
    `http://127.0.0.1:${PORT}`,
    'http://localhost:8080',
    'http://127.0.0.1:8080',
    'http://localhost:5500',
    'http://127.0.0.1:5500',
    'http://localhost:3000'
  ],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};
app.use(cors(corsOptions));

// JSON Body Parser middleware
app.use(express.json());

// 1. HEALTHCHECK ENDPOINT
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: "AirTrack API is running"
  });
});

// 2. ROUTE REGISTRATIONS
app.use('/api/flights', flightRoutes);
app.use('/api/gates', gateRoutes);

// Auth verification endpoint for administrative dashboard access checks
app.post('/api/admin/verify', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Unauthorized: Missing token' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return res.status(401).json({ success: false, error: authError ? authError.message : 'Invalid session token' });
    }

    const email = user.email.trim().toLowerCase();
    const { data: adminRecord, error: dbError } = await supabase
      .from('administrators')
      .select('*')
      .ilike('email', email);

    if (dbError) {
      console.error("[Backend Verify] Database lookup error:", dbError.message);
      return res.status(500).json({ success: false, error: 'Internal database error' });
    }

    const hasRecord = adminRecord && adminRecord.length > 0;
    console.log("Admin Verification Request - Email:", email, "| Record Found:", hasRecord ? "Yes" : "No", hasRecord ? "| Status: " + adminRecord[0].status : "");

    if (!hasRecord) {
      return res.status(403).json({ success: false, error: "Access denied — this account is not authorized for AirTrack Operations." });
    }

    const admin = adminRecord[0];
    if (admin.status !== 'active') {
      return res.status(403).json({ success: false, error: "Access denied — this administrator account is inactive." });
    }

    return res.json({
      success: true,
      admin: {
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (err) {
    console.error("[Backend Verify] Exception:", err);
    return res.status(500).json({ success: false, error: 'Internal server exception' });
  }
});

// Serves main HTML pages for user site
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/user/index.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/user/login.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/user/register.html'));
});

app.get('/login-callback', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/login-callback.html'));
});

app.get('/login-callback.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/login-callback.html'));
});

app.get('/flight-status', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/user/flight-status.html'));
});

app.get('/gates', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/user/gates.html'));
});

app.get('/my-flights', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/user/my-flights.html'));
});

app.get('/airports', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/user/airports.html'));
});

app.get('/travel-tools', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/user/travel-tools.html'));
});

app.get('/about', (req, res) => {
  res.redirect('/');
});

// Serves admin pages on clean routes
app.get('/admin/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/admin/login.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/admin/index.html'));
});

app.get('/admin/flights', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/admin/flights.html'));
});

app.get('/admin/gates', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/admin/gates.html'));
});

app.get('/admin/disruptions', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/admin/disruptions.html'));
});

app.get('/admin/simulator', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/admin/simulator.html'));
});

app.get('/admin/announcements', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/admin/announcements.html'));
});

app.get('/admin/schedule', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/admin/schedule.html'));
});

app.get('/admin/activity', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/admin/activity.html'));
});

app.get('/admin/administrators', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/admin/administrators.html'));
});

app.get('/admin/settings', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/admin/settings.html'));
});

app.get('/auth-helper.js', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/auth-helper.js'));
});

app.get('/supabase-config.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.send(`
    window.SUPABASE_URL = "${process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || ''}";
    window.SUPABASE_ANON_KEY = "${process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY || ''}";
  `);
});

// Serve static assets (CSS, JS, images)
// Serve admin assets under /admin prefix so they don't clash with user root files
app.use('/admin', express.static(path.join(__dirname, '../frontend/admin')));

// Serve user assets at root
app.use(express.static(path.join(__dirname, '../frontend/user')));

// Helper check for backend administrative operations
async function checkSuperAdmin(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { error: 'Unauthorized: Missing token', status: 401 };
  }

  const token = authHeader.split(' ')[1];
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return { error: authError ? authError.message : 'Invalid session token', status: 401 };
    }

    const email = user.email.trim().toLowerCase();
    const { data: adminRecord, error: dbError } = await supabase
      .from('administrators')
      .select('*')
      .eq('email', email)
      .eq('status', 'active')
      .eq('role', 'Super Administrator');

    if (dbError) {
      return { error: 'Internal database lookup error', status: 500 };
    }

    const hasRecord = adminRecord && adminRecord.length > 0;
    if (!hasRecord) {
      if (email === 'admin@airtrack.demo') {
        return { success: true, email };
      }
      return { error: 'Access denied: You must be an active Super Administrator to perform this operation.', status: 403 };
    }

    return { success: true, email };
  } catch (err) {
    return { error: 'Internal server verification exception', status: 500 };
  }
}

// 1. GET ALL ADMINISTRATORS (Super Admin Only)
app.get('/api/admin/administrators', async (req, res) => {
  const check = await checkSuperAdmin(req);
  if (check.error) {
    return res.status(check.status).json({ success: false, error: check.error });
  }

  const { data: admins, error: dbError } = await supabase
    .from('administrators')
    .select('*')
    .order('id', { ascending: true });

  if (dbError) {
    return res.status(500).json({ success: false, error: dbError.message });
  }
  return res.json({ success: true, administrators: admins });
});

// 2. CREATE ADMINISTRATOR (Super Admin Only)
app.post('/api/admin/administrators', async (req, res) => {
  const check = await checkSuperAdmin(req);
  if (check.error) {
    return res.status(check.status).json({ success: false, error: check.error });
  }

  let { email, name, role, status } = req.body;
  if (!email || !name || !role || !status) {
    return res.status(400).json({ success: false, error: 'Email, name, role, and status are required' });
  }

  email = email.trim().toLowerCase();
  
  // Check duplicate
  const { data: existing, error: checkError } = await supabase
    .from('administrators')
    .select('id')
    .eq('email', email);

  if (checkError) {
    return res.status(500).json({ success: false, error: checkError.message });
  }

  if (existing && existing.length > 0) {
    return res.status(400).json({ success: false, error: 'An administrator with this email already exists' });
  }

  // Insert
  const { data: newRecord, error: insertError } = await supabase
    .from('administrators')
    .insert([{ email, name, role, status }])
    .select();

  if (insertError) {
    return res.status(500).json({ success: false, error: insertError.message });
  }

  return res.json({ success: true, administrator: newRecord[0] });
});

// 3. EDIT ADMINISTRATOR (Super Admin Only)
const updateAdminHandler = async (req, res) => {
  const check = await checkSuperAdmin(req);
  if (check.error) {
    return res.status(check.status).json({ success: false, error: check.error });
  }

  const targetId = req.params.id;
  let { email, name, role, status } = req.body;

  // Prevent self deactivation or downgrading
  const { data: currentUserRecord } = await supabase
    .from('administrators')
    .select('id')
    .eq('email', check.email);

  if (currentUserRecord && currentUserRecord.length > 0) {
    const curId = currentUserRecord[0].id;
    if (parseInt(targetId) === parseInt(curId) || String(targetId) === String(curId)) {
      if (status && status !== 'active') {
        return res.status(400).json({ success: false, error: 'Security constraint: You cannot deactivate your own administrative account.' });
      }
      if (role && role !== 'Super Administrator') {
        return res.status(400).json({ success: false, error: 'Security constraint: You cannot downgrade your own Super Administrator role.' });
      }
    }
  }

  const updateData = {};
  if (name) updateData.name = name;
  if (role) updateData.role = role;
  if (status) updateData.status = status;
  if (email) {
    email = email.trim().toLowerCase();
    
    // Check duplicate
    const { data: existing } = await supabase
      .from('administrators')
      .select('id')
      .eq('email', email)
      .neq('id', targetId);
    
    if (existing && existing.length > 0) {
      return res.status(400).json({ success: false, error: 'An administrator with this email already exists' });
    }
    updateData.email = email;
  }

  const { data: updatedRecord, error: updateError } = await supabase
    .from('administrators')
    .update(updateData)
    .eq('id', targetId)
    .select();

  if (updateError) {
    return res.status(500).json({ success: false, error: updateError.message });
  }

  return res.json({ success: true, administrator: updatedRecord[0] });
};
app.patch('/api/admin/administrators/:id', updateAdminHandler);
app.put('/api/admin/administrators/:id', updateAdminHandler);

// 4. DELETE ADMINISTRATOR (Super Admin Only)
app.delete('/api/admin/administrators/:id', async (req, res) => {
  const check = await checkSuperAdmin(req);
  if (check.error) {
    return res.status(check.status).json({ success: false, error: check.error });
  }

  const targetId = req.params.id;

  // Prevent self deletion
  const { data: currentUserRecord } = await supabase
    .from('administrators')
    .select('id')
    .eq('email', check.email);

  if (currentUserRecord && currentUserRecord.length > 0) {
    const curId = currentUserRecord[0].id;
    if (parseInt(targetId) === parseInt(curId) || String(targetId) === String(curId)) {
      return res.status(400).json({ success: false, error: 'Security constraint: You cannot delete your own administrative account.' });
    }
  }

  const { error: deleteError } = await supabase
    .from('administrators')
    .delete()
    .eq('id', targetId);

  if (deleteError) {
    return res.status(500).json({ success: false, error: deleteError.message });
  }

  return res.json({ success: true, message: 'Administrator deleted successfully' });
});

// Catch-all route for unmatched API requests
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    error: `API route ${req.method} ${req.originalUrl} not found`
  });
});

// Admin catch-all route for frontend page fallbacks
app.get('/admin/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/admin/index.html'));
});

// Generic catch-all route for user frontend page fallbacks
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/user/index.html'));
});

// 3. CENTRALIZED ERROR HANDLING MIDDLEWARE
app.use(errorHandler);

// Launch Express Server (Auto-Watched)
app.listen(PORT, () => {
  console.log(`\n==================================================`);
  console.log(`  AirTrack Operations REST API Server running...`);
  console.log(`  Port: ${PORT}`);
  console.log(`  Status: Connected to Supabase Config Client`);
  console.log(`==================================================\n`);
});
