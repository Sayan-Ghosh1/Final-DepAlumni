# Taki Boys Alumni Association Kolkata Portal

Official portal for Taki House Government Sponsored High School for Boys, Kolkata.

---

## 🏗 Architecture Overview

The project is decoupled into two production-ready services:

| Component | Technology | Recommended Host | Why Separated? |
| :--- | :--- | :--- | :--- |
| **Frontend** (`/frontend`) | React 19, Vite, TailwindCSS v4, Lucide Icons, Motion | **Vercel** | Edge CDN with **0s cold start**. Instant loading with no blank/black screen. |
| **Backend** (`/backend`) | Node.js, Express, Supabase JS, CORS | **Render** | Dedicated Web Service running API endpoints, authentication, and Supabase sync. |
| **Database** | PostgreSQL & Auth | **Supabase** | Managed cloud database with real-time updates and RLS. |

---

## ⚡ Why This Solves the "Black Loading Screen / Inactivity" Problem

On Render's free tier, servers go to sleep after 15 minutes of inactivity. When both the frontend and backend were bundled together on Render:
1. Opening the website forced the browser to wait for Render to wake up (50–90 seconds cold start).
2. During this period, the browser had no HTML/JS to render, resulting in a black/blank loading screen.

**With the separated architecture:**
- The **Frontend is deployed on Vercel**, which **never sleeps**. The website UI, branding, navigation, and cached content load **instantly** (under 1 second).
- The **Backend is deployed on Render**, handling `/api/...` requests.
- **Tip to keep Render awake 24/7 on Free Tier:** Use a free uptime monitor like [UptimeRobot](https://uptimerobot.com) or [cron-job.org](https://cron-job.org) to ping your Render health endpoint (`https://your-backend.onrender.com/api/health`) every 10 minutes. This prevents Render from ever sleeping!

---

## 📁 Project Directory Structure

```text
taki-render-main/
├── frontend/                     # React + Vite application (Deploy to Vercel)
│   ├── public/                   # Static assets (logos, favicon)
│   ├── src/                      # Components, pages, styles, and hooks
│   │   ├── components/           # UI components (AdminPanel, CommunityChat, etc.)
│   │   ├── lib/                  # API client and Supabase client
│   │   └── types.ts              # Frontend TypeScript definitions
│   ├── .env.example              # Frontend environment variables template
│   ├── index.html                # App entrypoint with favicon & meta
│   ├── package.json              # Frontend dependencies and scripts
│   ├── tsconfig.json             # TypeScript configuration
│   ├── vercel.json               # Vercel SPA routing configuration
│   └── vite.config.ts            # Vite config with local API proxy
│
├── backend/                      # Express API server (Deploy to Render)
│   ├── types.ts                  # Backend TypeScript definitions
│   ├── server.ts                 # Express server with CORS & Supabase sync
│   ├── .env.example              # Backend environment variables template
│   ├── package.json              # Backend dependencies and scripts
│   ├── render.yaml               # Optional Render Blueprint
│   └── tsconfig.json             # Node.js TypeScript configuration
│
├── supabase_schema.sql           # Database schema for Supabase
└── README.md                     # Deployment guide
```

---

## 🚀 Local Development Setup

You can run both Frontend and Backend concurrently on your computer:

### 1. Start Backend Server
```bash
cd backend
npm install
npm run dev
```
> Backend starts on `http://localhost:5000`. You can test it by opening `http://localhost:5000/api/health`.

### 2. Start Frontend Dev Server
In a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
> Frontend starts on `http://localhost:5173`. Any API calls to `/api/...` are automatically proxied to `http://localhost:5000` via Vite.

---

## 🌐 Deployment Instructions

### Step 1: Deploy Backend to Render

1. Create a free account at [render.com](https://render.com).
2. Push your project to GitHub (or push the `/backend` folder).
3. On Render Dashboard, click **New +** and select **Web Service**.
4. Connect your GitHub repository.
5. Configure the service:
   - **Name**: `taki-alumni-backend`
   - **Root Directory**: `backend` (leave blank if backend is its own repository)
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`
6. Under **Environment Variables**, add:
   - `NODE_ENV` = `production`
   - `SUPABASE_URL` = `https://mxuiikbyhwuzaljajbjo.supabase.co`
   - `SUPABASE_ANON_KEY` = `sb_publishable_LiNqM88RwLOUeHhdFYqGdg_9LM2sone`
7. Click **Create Web Service**.
8. Once deployed, copy your Render backend URL (e.g. `https://taki-alumni-backend.onrender.com`).
   - Test it by visiting `https://taki-alumni-backend.onrender.com/` in your browser. You should see `{"status":"online"}`.

---

### Step 2: Deploy Frontend to Vercel

1. Create a free account at [vercel.com](https://vercel.com).
2. Click **Add New...** > **Project**.
3. Import your GitHub repository.
4. Configure the project:
   - **Root Directory**: Click "Edit" and choose `frontend` (leave blank if frontend is its own repository).
   - **Framework Preset**: `Vite` (detected automatically).
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Under **Environment Variables**, add:
   - `VITE_API_URL` = `https://your-backend-name.onrender.com` *(Paste your Render backend URL from Step 1)*
   - `VITE_SUPABASE_URL` = `https://mxuiikbyhwuzaljajbjo.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = `sb_publishable_LiNqM88RwLOUeHhdFYqGdg_9LM2sone`
6. Click **Deploy**.
7. Your site is live! You get a custom URL like `https://taki-alumni.vercel.app`.

---

### Step 3: Prevent Render Cold Starts (Free Tier Keep-Alive)

Because Render free tier sleeps after 15 minutes of inactivity:
1. Go to [UptimeRobot.com](https://uptimerobot.com) (100% free) or [cron-job.org](https://cron-job.org).
2. Create a new HTTP monitor:
   - **URL**: `https://your-backend-name.onrender.com/api/health`
   - **Monitoring Interval**: Every `10 minutes`
3. This sends a lightweight ping every 10 minutes, keeping your Render backend warm so it **never sleeps**!

---

## 🔒 Security & CORS

The backend includes pre-configured CORS that allows cross-origin requests from any Vercel domain, local development ports, and custom domains with full header credentials support (`Authorization`, `x-admin-role`, `Content-Type`).
