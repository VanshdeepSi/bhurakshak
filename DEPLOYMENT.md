# 🚀 BhuRakshak Production Cloud Deployment Guide

This guide covers deploying the **BhuRakshak Autonomous Landslide Early Warning System** to **Vercel** (Frontend) and **Render** (Backend).

---

## Architecture Summary

- **Frontend**: React 18 + Vite 6 + Tailwind CSS (Hosted on **Vercel** for instant global edge CDN & SSL).
- **Backend**: FastAPI + Uvicorn + SQLite/PostgreSQL + APScheduler + Resend API (Hosted on **Render** for persistent background worker & ML execution).

---

## ⚡ Option 1: Vercel (Frontend) + Render (Backend) [Recommended]

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
   - **Region**: Oregon (US West) or Singapore
   - **Branch**: `main`
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

## 🔄 Keeping Render Awake 24/7 (Preventing Free-Tier Cold Starts)

Render's free tier spins down containers after 15 minutes of inactivity. To ensure zero cold-start latency:
1. **Automated GitHub Action (Included)**: This repository includes `.github/workflows/keep_alive.yml`, which automatically pings the backend every 10 minutes.
2. **Optional External Monitor**: Add a free HTTP monitor at [UptimeRobot.com](https://uptimerobot.com) targeting `https://bhurakshak-backend.onrender.com/api/telemetry/live` every 5 minutes.

---

## 🛠️ Option 2: All-in-One Deploy via Render Blueprint (`render.yaml`)

If you want both frontend and backend under a single Render dashboard:
1. In Render, click **New +** > **Blueprint**.
2. Connect your repository. Render automatically reads `render.yaml`:
   - Provisions `bhurakshak-backend` (FastAPI).
   - Provisions `bhurakshak-frontend` (Static Site).
   - Automatically binds `VITE_API_URL` between them!
3. Click **Apply**.

---

## 🐳 Option 3: Docker Container Deployment

Run the containerized microservice anywhere using Docker:
```bash
cd backend
docker build -t bhurakshak-api .
docker run -d -p 8000:8000 bhurakshak-api
```
