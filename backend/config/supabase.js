// config/supabase.js
// Supabase Client Initializer

const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Check if credentials exist and are not set to default templates
const isMissingUrl = !supabaseUrl || supabaseUrl === 'your_supabase_project_url' || supabaseUrl.trim() === '';
const isMissingKey = !supabaseKey || supabaseKey === 'your_service_role_key' || supabaseKey.trim() === '';

if (isMissingUrl || isMissingKey) {
  console.error('\n========================================================================');
  console.error('CRITICAL CONFIGURATION ERROR: Supabase environment variables are missing.');
  console.error('Please configure your backend/.env file with valid credentials:');
  if (isMissingUrl) console.error(' - SUPABASE_URL is missing or set to placeholder.');
  if (isMissingKey) console.error(' - SUPABASE_SERVICE_ROLE_KEY is missing or set to placeholder.');
  console.error('========================================================================\n');
  
  // Terminate execution with exit code 1 to indicate startup crash
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
