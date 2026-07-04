# PahadPulse AI

AI-powered market intelligence and demand forecasting platform for farmers, artisans, and small businesses in Uttarakhand.

## Tech Stack
- **Frontend:** Next.js + Tailwind CSS
- **Backend:** Python/FastAPI
- **Database:** MongoDB (Atlas)

## How to run backend locally

1. Navigate to the backend folder:
   ```
   cd backend
   ```
2. Create a virtual environment and activate it:
   ```
   python -m venv venv
   venv\Scripts\activate      # Windows
   source venv/bin/activate   # Mac/Linux
   ```
3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
4. Copy `.env.example` to `.env` and adjust values if needed.
5. Run the server:
   ```
   uvicorn main:app --reload --port 8000
   ```
6. The API will be available at `http://localhost:8000`.
   Interactive docs: `http://localhost:8000/docs`

## Database Setup
  1. Create a free MongoDB Atlas cluster (M0 tier)
  2. Whitelist your IP in Network Access
  3. Create a database user
  4. Copy connection string into `.env` as MONGO_URI
  5. Run `pip install -r requirements.txt`
  6. Start server: `uvicorn main:app --reload --port 8000`