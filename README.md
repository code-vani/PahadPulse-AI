# PahadPulse AI

AI-powered market intelligence and demand forecasting platform for farmers, artisans, and small businesses in Uttarakhand.

## Live Deployment

- **Frontend:** https://pahad-pulse-ai.vercel.app
- **Backend API:** https://pahadpulse-ai.onrender.com

## Tech Stack

- **Frontend:** Next.js (App Router) + Tailwind CSS
- **Backend:** Python + FastAPI
- **Database:** MongoDB Atlas
- **Authentication:** JWT + bcrypt, Google OAuth (NextAuth.js)
- **AI:** Google Gemini API (gemini-3.1-flash-lite)
- **Deployment:** Vercel (frontend) + Render (backend)

## Known Limitations on Free Tier

- Render's free tier spins down after 15 minutes of inactivity — the first request after an idle period may take 30–60 seconds to respond while the server wakes up.
- MongoDB Atlas free tier (M0) has a shared cluster with limited storage and connection limits.
- Gemini API free tier has daily/per-minute rate limits — high traffic may occasionally return a temporary AI service error.

## How to Run Locally

**Backend:**
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

Create `.env` (backend) and `.env.local` (frontend) using the variable names in `.env.example`.

## Features

- Secure user registration/login (JWT + bcrypt) and Google OAuth sign-in
- Full CRUD dashboard for demand forecasts (create, edit, delete, search)
- AI-generated selling recommendations per forecast via Google Gemini
- Responsive UI with loading, error, and empty states
