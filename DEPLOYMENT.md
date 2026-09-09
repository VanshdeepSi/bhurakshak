# BhuRakshak · Production Cloud Deployment Guide

This guide covers deploying the **BhuRakshak Autonomous Landslide Early Warning System** to **Vercel** (Frontend) and **Render** (Backend).

---

## Architecture Summary

- **Frontend**: React 19 + Vite + Tailwind CSS (Hosted on **Vercel** for instant global edge CDN & SSL).
- **Backend**: FastAPI + Uvicorn + SQLite + APScheduler + SMTP (Hosted on **Render** for persistent background worker & ML execution).

---

## 🚀 Option 1: Vercel (Frontend) + Render (Backend) [Recommended]

### Part A: Deploy Backend on Render (5 minutes)

1. Create a free account at [render.com](https://render.com).
2. Push this repository to your GitHub account:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/bhurakshak.git
   git branch -M main
   git push -u origin main
   ```
3. In Render Dashboard, click **New +** > **Web Service**.
4. Select your **bhurakshak** GitHub repository.
5. Configure the service:
   - **Name**: `bhurakshak-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Python 3`
   - **Region**: Oregon (US West) or Singapore / Frankfurt
   - **Branch**: `main` (or `master`)
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Plan**: `Free`
6. Click **Create Web Service**.
7. Once deployed, copy your Render URL (e.g. `https://bhurakshak-backend.onrender.com`).
8. Verify by opening `https://bhurakshak-backend.onrender.com/api/alerts` in your browser.

---

### Part B: Deploy Frontend on Vercel (2 minutes)

1. Create a free account at [vercel.com](https://vercel.com).
2. Click **Add New...** > **Project**.
3. Import your **bhurakshak** repository from GitHub.
4. In Project Configuration:
   - **Root Directory**: Click **Edit** and select `frontend`.
   - **Framework Preset**: `Vite` (automatically detected).
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Expand **Environment Variables**:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://bhurakshak-backend.onrender.com` (your backend URL from Part A).
6. Click **Deploy**.
7. In ~30 seconds, your site is live with a global HTTPS link (e.g. `https://bhurakshak.vercel.app`)!

---

## ⚡ Option 2: All-in-One Deploy via Render Blueprint (`render.yaml`)

If you want both the frontend and backend deployed under a single Render dashboard:

1. Push this repository to GitHub.
2. In Render, click **New +** > **Blueprint**.
3. Connect your repository. Render will automatically read `render.yaml` in the root:
   - Automatically provisions `bhurakshak-backend` (FastAPI).
   - Automatically provisions `bhurakshak-frontend` (Static Site).
   - Automatically binds `VITE_API_URL` between them!
4. Click **Apply**.

---

## 🛠️ Option 3: Local or Docker Self-Hosting

You can also run the production container anywhere using Docker:

```bash
cd backend
docker build -t bhurakshak-api .
docker run -d -p 8000:8000 bhurakshak-api
```

---

## 📧 Post-Deployment: Configure Real SMTP Alerts

Once deployed:
1. Open your live frontend on Vercel (`https://your-app.vercel.app/settings`).
2. Scroll to the **"Real Email Dispatch Relay (SMTP)"** card.
3. Click the **"GMAIL"** preset button.
4. Enter your Gmail address and 16-letter **Google App Password**.
5. Click **"Save Settings"** and **"Send Real Test Email"**.
6. Real landslide evacuation alerts will now deliver directly to citizens' inboxes!
