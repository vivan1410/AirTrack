/**
 * AirTrack Shared Authentication Helper
 * Connects Passenger & Admin entry flows to Supabase Client Auth.
 * Automatically falls back to sandbox localStorage when keys are unconfigured.
 */

// Initialize client holder
let supabaseInstance = null;

function getSupabaseClient() {
  if (supabaseInstance) return supabaseInstance;

  const url = window.SUPABASE_URL || "https://fqknwkuujopmyvmvlrmo.supabase.co";
  const key = window.SUPABASE_ANON_KEY || "sb_publishable_gTpkKrVJVbaQs8vcphvEgw_oWCmZDqR";

  // Graceful validation check: assert keys exist and are not set to default placeholder string templates
  const hasUrl = url && url.trim() !== '' && !url.includes('placeholder-url') && !url.includes('your_supabase');
  const hasKey = key && key.trim() !== '' && !key.includes('placeholder_anon') && !key.includes('your_supabase');

  if (!hasUrl || !hasKey) {
    console.warn("Supabase credentials not configured. Running in sandbox offline fallback mode.");
    return null;
  }

  try {
    if (window.supabase) {
      supabaseInstance = window.supabase.createClient(url, key, {
        auth: {
          flowType: 'pkce',
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true
        }
      });
      return supabaseInstance;
    }
  } catch (e) {
    console.error("Error creating Supabase client instance:", e);
  }
  return null;
}

const authDb = {
  getPassengers() {
    try {
      const stored = localStorage.getItem('airtrack_passengers_v3');
      if (!stored) {
        const seed = [
          { name: "John Passenger", email: "user@airtrack.demo", password: "AirTrack@123" }
        ];
        localStorage.setItem('airtrack_passengers_v3', JSON.stringify(seed));
        return seed;
      }
      return JSON.parse(stored);
    } catch (e) {
      return [{ name: "John Passenger", email: "user@airtrack.demo", password: "AirTrack@123" }];
    }
  },
  savePassengers(data) {
    try {
      localStorage.setItem('airtrack_passengers_v3', JSON.stringify(data));
    } catch (e) {}
  }
};

// --- USER AUTHENTICATION ---
function isUserAuthenticated() {
  return sessionStorage.getItem('airtrack_user_session') !== null;
}

async function loginUser(email, password) {
  const client = getSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client.auth.signInWithPassword({ email, password });
      if (error) return { success: false, error: "Invalid email or password." };
      
      const session = data.session;
      sessionStorage.setItem('airtrack_user_session', JSON.stringify({
        name: session.user.user_metadata.full_name || session.user.email.split('@')[0],
        email: session.user.email
      }));
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  } else {
    // Local fallback
    const passengers = authDb.getPassengers();
    const matched = passengers.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (matched) {
      sessionStorage.setItem('airtrack_user_session', JSON.stringify({
        name: matched.name,
        email: matched.email
      }));
      return { success: true, user: matched };
    }
    return { success: false, error: "Invalid email or password." };
  }
}

async function registerUser(name, email, password) {
  if (!name || !email || !password) {
    return { success: false, error: "All fields are required." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, error: "Please enter a valid email address." };
  }
  if (password.length < 6) {
    return { success: false, error: "Password must be at least 6 characters long." };
  }

  const client = getSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name
          }
        }
      });
      if (error) return { success: false, error: error.message };

      // Optional manually insert into profiles table if trigger isn't ready
      try {
        await client.from('profiles').insert([{ id: data.user.id, name, email }]);
      } catch (e) {
        console.warn("Manual profile record insertion skipped (usually handled by postgres auto trigger):", e);
      }

      sessionStorage.setItem('airtrack_user_session', JSON.stringify({
        name,
        email
      }));
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  } else {
    // Local fallback
    const passengers = authDb.getPassengers();
    if (passengers.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, error: "Email is already registered." };
    }
    const newPassenger = { name, email, password };
    passengers.push(newPassenger);
    authDb.savePassengers(passengers);

    sessionStorage.setItem('airtrack_user_session', JSON.stringify({
      name,
      email
    }));
    return { success: true };
  }
}

async function logoutUser() {
  const client = getSupabaseClient();
  if (client) {
    try {
      await client.auth.signOut();
    } catch (e) {}
  }
  sessionStorage.removeItem('airtrack_user_session');
}

async function requireUserAuth() {
  const client = getSupabaseClient();
  if (client) {
    try {
      const { data: { session } } = await client.auth.getSession();
      if (!session) {
        let dest = window.location.pathname + window.location.search;
        if (dest === '/' || dest === '' || dest.includes('login.html')) dest = '/user/index.html';
        sessionStorage.setItem('airtrack_user_redirect_dest', dest);
        window.location.href = '/user/login.html';
      } else {
        const meta = session.user.user_metadata || {};
        const userName = meta.full_name || meta.name || (session.user.email ? session.user.email.split('@')[0] : "Passenger");
        sessionStorage.setItem('airtrack_user_session', JSON.stringify({
          name: userName,
          email: session.user.email
        }));
        if (typeof window.updatePassengerNavbar === 'function') {
          window.updatePassengerNavbar();
        }
        if (typeof updatePassengerNavbar === 'function') {
          updatePassengerNavbar();
        }
        window.dispatchEvent(new CustomEvent('user_session_updated', { detail: { name: userName, email: session.user.email } }));
      }
    } catch (e) {
      console.error("Supabase getSession exception:", e);
      window.location.href = '/user/login.html';
    }
  } else {
    if (!isUserAuthenticated()) {
      let dest = window.location.pathname + window.location.search;
      if (dest === '/' || dest === '' || dest.includes('login.html')) dest = '/user/index.html';
      sessionStorage.setItem('airtrack_user_redirect_dest', dest);
      window.location.href = '/user/login.html';
    }
  }
}

// --- ADMIN AUTHENTICATION ---
function getBackendApiUrl(endpoint) {
  if (window.location.port === '8080' || window.location.port === '5500' || window.location.port === '3000') {
    return 'http://localhost:8099' + endpoint;
  }
  return endpoint;
}

function isAdminAuthenticated() {
  return sessionStorage.getItem('airtrack_admin_session') !== null;
}

async function loginAdmin(email, password) {
  const client = getSupabaseClient();
  const normalizedEmail = email.trim().toLowerCase();
  if (client) {
    try {
      const { data, error } = await client.auth.signInWithPassword({ email: normalizedEmail, password });
      if (error) return { success: false, error: error.message };

      const token = data.session.access_token;
      const verifyRes = await fetch(getBackendApiUrl('/api/admin/verify'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      console.log("Admin Local Sign In: Authenticated email:", email);
      console.log("Normalized email:", normalizedEmail);

      if (verifyRes.ok) {
        const verifyResult = await verifyRes.json();
        console.log("Administrator record found: Yes");
        console.log("Administrator status: active");
        sessionStorage.setItem('airtrack_admin_session', JSON.stringify({
          name: verifyResult.admin.name,
          email: verifyResult.admin.email,
          role: verifyResult.admin.role
        }));
        return { success: true };
      } else {
        const errData = await verifyRes.json();
        console.log("Administrator record check failed:", errData.error);
        await client.auth.signOut();
        return { success: false, error: errData.error || "Access Denied: You are not authorized to access the operations control deck." };
      }
    } catch (e) {
      return { success: false, error: e.message };
    }
  } else {
    // Local fallback
    if (normalizedEmail === 'admin@airtrack.demo' && password === 'AirTrack@123') {
      sessionStorage.setItem('airtrack_admin_session', JSON.stringify({
        name: "Operations Officer",
        email: normalizedEmail,
        role: "Operations Officer"
      }));
      return { success: true };
    }
    return { success: false, error: "Invalid administrator credentials." };
  }
}

async function logoutAdmin() {
  const client = getSupabaseClient();
  if (client) {
    try {
      await client.auth.signOut();
    } catch (e) {}
  }
  sessionStorage.removeItem('airtrack_admin_session');
}

async function requireAdminAuth() {
  const client = getSupabaseClient();
  if (client) {
    try {
      const { data: { session } } = await client.auth.getSession();
      if (!session) {
        sessionStorage.setItem('airtrack_admin_redirect_dest', window.location.pathname + window.location.search);
        window.location.href = '/admin/login.html';
        return;
      }

      const token = session.access_token;
      const verifyRes = await fetch(getBackendApiUrl('/api/admin/verify'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (verifyRes.ok) {
        const verifyResult = await verifyRes.json();
        const role = verifyResult.admin.role;
        sessionStorage.setItem('airtrack_admin_session', JSON.stringify({
          name: verifyResult.admin.name,
          email: verifyResult.admin.email,
          role: role
        }));

        // Role-based page access checks
        const path = window.location.pathname.toLowerCase();
        if (path.includes('administrators') && role !== 'Super Administrator') {
          window.location.href = '/admin/index.html';
          return;
        }
        if (path.includes('flights') && role === 'Gate Operator') {
          window.location.href = '/admin/index.html';
          return;
        }
        if (path.includes('announcements') && role === 'Gate Operator') {
          window.location.href = '/admin/index.html';
          return;
        }
        if (path.includes('activity') && (role === 'Airport Manager' || role === 'Gate Operator')) {
          window.location.href = '/admin/index.html';
          return;
        }
      } else {
        sessionStorage.removeItem('airtrack_admin_session');
        await client.auth.signOut();
        window.location.href = '/admin/login.html?error=denied';
      }
    } catch (e) {
      console.error("Supabase Admin getSession exception:", e);
      window.location.href = '/admin/login.html';
    }
  } else {
    if (!isAdminAuthenticated()) {
      sessionStorage.setItem('airtrack_admin_redirect_dest', window.location.pathname + window.location.search);
      window.location.href = '/admin/login.html';
    } else {
      const sessionStr = sessionStorage.getItem('airtrack_admin_session');
      if (sessionStr) {
        const admin = JSON.parse(sessionStr);
        const role = admin.role;
        const path = window.location.pathname.toLowerCase();
        if (path.includes('administrators') && role !== 'Super Administrator') {
          window.location.href = '/admin/index.html';
          return;
        }
        if (path.includes('flights') && role === 'Gate Operator') {
          window.location.href = '/admin/index.html';
          return;
        }
        if (path.includes('announcements') && role === 'Gate Operator') {
          window.location.href = '/admin/index.html';
          return;
        }
        if (path.includes('activity') && (role === 'Airport Manager' || role === 'Gate Operator')) {
          window.location.href = '/admin/index.html';
          return;
        }
      }
    }
  }
}

// --- GOOGLE OAUTH HELPER ---
async function loginWithGoogleOAuth(role = 'user') {
  const client = getSupabaseClient();
  if (client) {
    sessionStorage.setItem('airtrack_google_login_role', role);
    const redirectUrl = window.location.origin + '/login-callback.html';
    console.log("[OAuth Sign-In Start] Initiating Google OAuth via Supabase Auth...");
    console.log("[OAuth Sign-In Start] Role:", role);
    console.log("[OAuth Sign-In Start] Generated Redirect URL:", redirectUrl);

    const { data, error } = await client.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl
      }
    });
    if (error) {
      console.error("[OAuth Sign-In Error]:", error.message);
      return { success: false, error: error.message };
    }
    return { success: true, url: data?.url };
  }
  return { success: false, error: "Supabase client is unconfigured. Please set valid SUPABASE_URL and SUPABASE_ANON_KEY in your environment." };
}

// Global Window Exports
window.loginWithGoogleOAuth = loginWithGoogleOAuth;
window.requireAdminAuth = requireAdminAuth;
window.requireUserAuth = requireUserAuth;
window.loginUser = loginUser;
window.registerUser = registerUser;
window.logoutUser = logoutUser;
window.loginAdmin = loginAdmin;
window.logoutAdmin = logoutAdmin;
window.getBackendApiUrl = getBackendApiUrl;

