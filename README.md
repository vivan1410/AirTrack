# AirTrack — Smart Airport Flight & Gate Management System

AirTrack is a professional aviation operations platform that models flight information displays (FIDS), gate bay allocations, operational statistics, and administrative CRUD operations for flights and gates.

---

## 1. System Architecture

AirTrack is structured as a light-weight three-tier cloud-ready web application:

```
[ Passenger & Admin Dashboard ]  (HTML5, Vanilla CSS3, Vanilla JS)
             │
             ▼
    [ REST API Server ]          (Node.js + Express, CORS, dotenv)
             │
             ▼
  [ Supabase Cloud Storage ]     (PostgreSQL Database Engine)
```

During initial local development:
- The **Frontend** runs on a local web server (e.g. `http://localhost:8080`).
- The **Backend API** runs on `http://localhost:5000`.
- The database connects to a PostgreSQL instance hosted in **Supabase** via the `@supabase/supabase-js` API.

---

## 2. Directory Layout

```
AirTrack/
├── frontend/                # Client dashboard code
│   ├── index.html           # Main markup & modal views
│   ├── style.css            # Responsive themes & modals styling
│   └── script.js            # API fetch integrations & state events
│
├── backend/                 # Node.js REST API Server
│   ├── server.js            # Express server entry point
│   ├── .env.example         # Environment template parameters
│   ├── .gitignore           # Ignored folders
│   ├── API_DOCUMENTATION.md # Endpoint specification document
│   ├── config/
│   │   └── supabase.js      # Supabase client credentials initializer
│   ├── routes/
│   │   ├── flights.js       # Flight endpoint mappings
│   │   └── gates.js         # Gate endpoint mappings
│   ├── controllers/
│   │   ├── flightController.js # Flight database handlers & validations
│   │   └── gateController.js   # Gate database handlers & validations
│   └── middleware/
│       └── errorHandler.js  # Global JSON error interceptor
│
└── database/                # Database configurations
    ├── schema.sql           # Tables, constraints, and indexes
    └── seed.sql             # Realism test entries
```

---

## 3. Local Setup Instructions

### Prerequisites
- Node.js (v16.x or higher)
- npm (v8.x or higher)

### Step 1: Database Initialization
1. Create a project in your [Supabase Console](https://supabase.com/).
2. Navigate to the **SQL Editor** in Supabase.
3. Open [database/schema.sql](file:///c:/Users/vivan/OneDrive/Desktop/cloud project/AirTrack/database/schema.sql), copy the content, paste it into the editor, and run it.
4. Open [database/seed.sql](file:///c:/Users/vivan/OneDrive/Desktop/cloud project/AirTrack/database/seed.sql), copy the content, and run it to populate the test data.

### Step 2: Configure Backend Environment
1. Navigate to the `backend/` directory in your terminal.
2. Install node dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to a new file named `.env`:
   ```bash
   cp .env.example .env
   ```
4. Edit the `.env` file to configure your credentials:
   - `SUPABASE_URL`: Your Supabase Project API URL (found under Project Settings -> API).
   - `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase Service Role Secret Key (found under Settings -> API -> `service_role` key).
   - `PORT`: `5000` (or your preferred server port).

### Step 3: Run the Backend API
Start the server in development mode:
```bash
npm run dev
```
Verify startup by opening `http://localhost:5000/api/health` in your browser.

### Step 4: Run the Frontend Client
Serve the `frontend/` folder. For example, using Python or npx:
```bash
npx http-server -p 8080
```
Open `http://localhost:8080` in your web browser.

---

## 4. Environment Variables Specification

The backend server reads the following keys:
| Parameter | Purpose | Value Example |
| :--- | :--- | :--- |
| `PORT` | Listening port of Express server | `5000` |
| `SUPABASE_URL` | Cloud database URL | `https://xxxx.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | Secret service role API key | `eyJhbGciOiJIUzI1NiIsIn...` |

---

## 5. Development Fallback Mode

If the backend server is offline or the environment variables are unconfigured, **the frontend will automatically activate Offline Fallback Mode**:
- Prints a notice: *"Running in local fallback database mode (Backend offline/unconfigured)."*
- Commits CRUD data operations to the browser's local `sessionStorage` arrays to allow client testing.
- Recalculates stats, dynamic analytics, and search queries instantly in-memory.

---

## 6. Future Enhancements
- **Phase 3**: User authentication (OAuth / JWT) for admin credentials security.
- **Phase 4**: Real-time websocket notifications for flight arrivals using Supabase Realtime listeners.
- **Phase 5**: Production server deployment (e.g. Vercel, Render) and domain setup.
