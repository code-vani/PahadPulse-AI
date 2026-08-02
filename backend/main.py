import os
from fastapi import FastAPI, HTTPException, Query, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional
from dotenv import load_dotenv
from bson import ObjectId
from bson.errors import InvalidId
from slowapi.errors import RateLimitExceeded
from slowapi import _rate_limit_exceeded_handler

from auth import router as auth_router, limiter, get_current_user
from ai import router as ai_router
from models.forecast import get_forecasts_collection, serialize_forecast

load_dotenv()

app = FastAPI(title="PahadPulse AI Backend")

# ---- Rate limiting (auth endpoints) ----
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# ---- CORS: allow the Next.js frontend to call this API ----
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        os.getenv("FRONTEND_ORIGIN", ""),
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---- Auth routes: /api/auth/register, /api/auth/login, /api/auth/me ----
app.include_router(auth_router)
app.include_router(ai_router)


# ---- Data model ----
class Forecast(BaseModel):
    product: str
    market: str
    demand_score: int
    predicted_price: float


# ---- Seed demo data on first run (only if collection is empty) ----
@app.on_event("startup")
def seed_forecasts():
    collection = get_forecasts_collection()
    if collection.count_documents({}) == 0:
        collection.insert_many([
            {"product": "Apples", "market": "Mussoorie", "demand_score": 82, "predicted_price": 120.0},
            {"product": "Pashmina Shawls", "market": "Almora", "demand_score": 65, "predicted_price": 1500.0},
            {"product": "Rajma (Kidney Beans)", "market": "Chamoli", "demand_score": 90, "predicted_price": 180.0},
        ])


# ---- Global error handler ----
@app.exception_handler(Exception)
async def generic_exception_handler(request, exc):
    return JSONResponse(status_code=500, content={"detail": f"Internal server error: {str(exc)}"})


# ---- Routes ----

@app.get("/api/forecasts", status_code=200)
def list_forecasts():
    """GET /api/forecasts — list all forecasts"""
    collection = get_forecasts_collection()
    return [serialize_forecast(doc) for doc in collection.find()]


@app.get("/api/forecasts/search", status_code=200)
def search_forecasts(q: str = Query(..., min_length=1)):
    """GET /api/forecasts/search?q=... — search forecasts by product or market name"""
    collection = get_forecasts_collection()
    regex = {"$regex": q, "$options": "i"}
    docs = collection.find({"$or": [{"product": regex}, {"market": regex}]})
    return [serialize_forecast(doc) for doc in docs]


@app.get("/api/forecasts/{forecast_id}", status_code=200)
def get_forecast(forecast_id: str):
    """GET /api/forecasts/:id — get a single forecast"""
    collection = get_forecasts_collection()
    try:
        doc = collection.find_one({"_id": ObjectId(forecast_id)})
    except InvalidId:
        raise HTTPException(status_code=404, detail="Forecast not found")
    if not doc:
        raise HTTPException(status_code=404, detail="Forecast not found")
    return serialize_forecast(doc)


@app.post("/api/forecasts", status_code=201)
def create_forecast(forecast: Forecast, user: dict = Depends(get_current_user)):
    """POST /api/forecasts — create a forecast (protected: requires JWT)"""
    if not forecast.product or not forecast.market:
        raise HTTPException(status_code=400, detail="Product and market are required")

    collection = get_forecasts_collection()
    result = collection.insert_one(forecast.dict())
    doc = collection.find_one({"_id": result.inserted_id})
    return serialize_forecast(doc)


@app.put("/api/forecasts/{forecast_id}", status_code=200)
def update_forecast(forecast_id: str, forecast: Forecast, user: dict = Depends(get_current_user)):
    """PUT /api/forecasts/:id — update an existing forecast (protected: requires JWT)"""
    collection = get_forecasts_collection()
    try:
        oid = ObjectId(forecast_id)
    except InvalidId:
        raise HTTPException(status_code=404, detail="Forecast not found")

    result = collection.update_one({"_id": oid}, {"$set": forecast.dict()})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Forecast not found")

    doc = collection.find_one({"_id": oid})
    return serialize_forecast(doc)


@app.delete("/api/forecasts/{forecast_id}", status_code=204)
def delete_forecast(forecast_id: str, user: dict = Depends(get_current_user)):
    """DELETE /api/forecasts/:id — delete a forecast (protected: requires JWT)"""
    collection = get_forecasts_collection()
    try:
        oid = ObjectId(forecast_id)
    except InvalidId:
        raise HTTPException(status_code=404, detail="Forecast not found")

    result = collection.delete_one({"_id": oid})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Forecast not found")
    return


@app.get("/")
def root():
    return {"message": "PahadPulse AI backend is running"}