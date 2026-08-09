# PahadPulse AI

AI-powered market intelligence and demand forecasting platform for farmers, artisans, and small businesses in Uttarakhand.

## Live Demo
🔗 https://pahad-pulse-ai.vercel.app

## Screenshots

![Home Page](./screenshots/home.png)
*Home — hero section with feature highlights*

![Dashboard](./screenshots/dashboard.png)
*Live dashboard — forecasts fetched from the backend, with AI recommendations*

![AI Recommendation](./screenshots/ai-feature.png)
*AI Business Advisor generating a selling recommendation*

## Features

- Secure user registration and login (JWT + bcrypt password hashing)
- One-click Google OAuth sign-in (NextAuth.js)
- Full CRUD dashboard for demand forecasts — create, edit, delete, and search
- AI-generated selling recommendations per forecast, powered by Google Gemini
- Responsive UI with loading, error, and empty states
- React error boundary to prevent blank-screen failures

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js (App Router), React, Tailwind CSS |
| Backend | Python, FastAPI |
| Database | MongoDB Atlas |
| Authentication | JWT, bcrypt, Google OAuth (NextAuth.js) |
| AI | Google Gemini API (gemini-3.1-flash-lite) |
| Deployment | Vercel (frontend), Render (backend) |

## Setup Instructions

**Backend:**
```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
pip install -r requirements.txt
uvicorn main:app --reload
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

**Environment variables required:**

`backend/.env`
```
MONGO_URI=your_mongodb_atlas_connection_string
DB_NAME=pahadpulse
GEMINI_API_KEY=your_gemini_api_key
JWT_SECRET=your_random_secret
FRONTEND_ORIGIN=http://localhost:3000
```

`frontend/.env.local`
```
NEXT_PUBLIC_API_URL=http://localhost:8000
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

## API Documentation

**POST /api/auth/register** — Register a new user
```json
Request:  { "email": "user@example.com", "password": "min8chars" }
Response: { "message": "User registered successfully", "email": "user@example.com" }
```

**POST /api/auth/login** — Log in, returns a JWT
```json
Request:  { "email": "user@example.com", "password": "min8chars" }
Response: { "access_token": "eyJ...", "token_type": "bearer" }
```

**GET /api/forecasts** — List all forecasts (public)
```json
Response: [{ "id": "665f...", "product": "Apples", "market": "Mussoorie", "demand_score": 82, "predicted_price": 120.0 }]
```

**POST /api/forecasts** — Create a forecast (protected, requires JWT)
```json
Request:  { "product": "Apples", "market": "Mussoorie", "demand_score": 82, "predicted_price": 120.0 }
Response: 201 Created — the created forecast document
```

**PUT /api/forecasts/{id}** / **DELETE /api/forecasts/{id}** — Update/delete a forecast (protected)

**POST /api/ai/recommend** — Get an AI-generated selling recommendation
```json
Request:  { "product": "Apples", "market": "Mussoorie", "demand_score": 82, "predicted_price": 120.0 }
Response: { "recommendation": "With a high demand score of 82, now is an excellent time to sell..." }
```

## Architecture / Folder Structure

```
PahadPulse-AI/
├── backend/
│   ├── main.py              # FastAPI app, forecast CRUD routes, CORS
│   ├── auth.py               # Register/login, JWT, bcrypt, rate limiting
│   ├── ai.py                  # Gemini AI recommendation endpoint
│   ├── models/forecast.py    # MongoDB connection + forecast schema helpers
│   └── requirements.txt
├── frontend/
│   ├── app/                   # Next.js App Router pages (home, login, dashboard, about)
│   ├── components/            # Navbar, Hero, Card, AIAdvisor, ConfirmDialog, ErrorBoundary, etc.
│   ├── components/ui/         # Reusable UI library (Button, Input, Modal, Toast, Loader)
│   └── lib/auth.ts            # authFetch helper, login/register/token handling
└── PROMPTS.md                 # AI prompt iteration log (Week 7)
```

## Known Limitations

- Render's free tier spins down after 15 minutes of inactivity — the first request after an idle period may take 30–60 seconds to respond.
- MongoDB Atlas free tier (M0) has limited storage and connection capacity.
- Demand score and predicted price are currently entered manually per forecast rather than computed from a trained model or live market data — a natural next step for the project.
- Gemini API free tier has rate limits; very high traffic may occasionally return a temporary AI service error.

## Credits & Acknowledgements

- Built as part of the AI-Assisted Full Stack Web Development track, Summer Internship Program (SIP) 2026, Technology Business Incubator, Graphic Era University (TBI-GEU).
- AI tools used: Google Gemini API (application feature), Claude (development assistance and debugging throughout the build).
- UI component patterns referenced from the Tailwind CSS and Next.js official documentation.
