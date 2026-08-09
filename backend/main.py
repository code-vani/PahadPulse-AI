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
from predict import router as predict_router
from models.forecast import get_forecasts_collection, serialize_forecast

load_dotenv()

app = FastAPI(title="PahadPulse AI Backend")

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

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

app.include_router(auth_router)
app.include_router(ai_router)
app.include_router(predict_router)


class Forecast(BaseModel):
    product: str
    market: str
    demand_score: int
    predicted_price: float


@app.exception_handler(Exception)
async def generic_exception_handler(request, exc):
    return JSONResponse(status_code=500, content={"detail": f"Internal server error: {str(exc)}"})


# ---- Routes — every route below is scoped to the logged-in user's own data ----

@app.get("/api/forecasts", status_code=200)
def list_forecasts(user: dict = Depends(get_current_user)):
    """GET /api/forecasts — list only the current user's forecasts"""
    collection = get_forecasts_collection()
    docs = collection.find({"owner": user["email"]})
    return [serialize_forecast(doc) for doc in docs]


@app.get("/api/forecasts/search", status_code=200)
def search_forecasts(q: str = Query(..., min_length=1), user: dict = Depends(get_current_user)):
    """GET /api/forecasts/search?q=... — search within the current user's own forecasts"""
    collection = get_forecasts_collection()
    regex = {"$regex": q, "$options": "i"}
    docs = collection.find({
        "owner": user["email"],
        "$or": [{"product": regex}, {"market": regex}],
    })
    return [serialize_forecast(doc) for doc in docs]


@app.get("/api/forecasts/{forecast_id}", status_code=200)
def get_forecast(forecast_id: str, user: dict = Depends(get_current_user)):
    """GET /api/forecasts/:id — get a single forecast, only if it belongs to the current user"""
    collection = get_forecasts_collection()
    try:
        oid = ObjectId(forecast_id)
    except InvalidId:
        raise HTTPException(status_code=404, detail="Forecast not found")
    doc = collection.find_one({"_id": oid, "owner": user["email"]})
    if not doc:
        raise HTTPException(status_code=404, detail="Forecast not found")
    return serialize_forecast(doc)


@app.post("/api/forecasts", status_code=201)
def create_forecast(forecast: Forecast, user: dict = Depends(get_current_user)):
    """POST /api/forecasts — create a forecast owned by the current user"""
    if not forecast.product or not forecast.market:
        raise HTTPException(status_code=400, detail="Product and market are required")

    collection = get_forecasts_collection()
    payload = forecast.dict()
    payload["owner"] = user["email"]
    result = collection.insert_one(payload)
    doc = collection.find_one({"_id": result.inserted_id})
    return serialize_forecast(doc)


@app.put("/api/forecasts/{forecast_id}", status_code=200)
def update_forecast(forecast_id: str, forecast: Forecast, user: dict = Depends(get_current_user)):
    """PUT /api/forecasts/:id — update, only if it belongs to the current user"""
    collection = get_forecasts_collection()
    try:
        oid = ObjectId(forecast_id)
    except InvalidId:
        raise HTTPException(status_code=404, detail="Forecast not found")

    result = collection.update_one(
        {"_id": oid, "owner": user["email"]},
        {"$set": forecast.dict()},
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Forecast not found")

    doc = collection.find_one({"_id": oid})
    return serialize_forecast(doc)


@app.delete("/api/forecasts/{forecast_id}", status_code=204)
def delete_forecast(forecast_id: str, user: dict = Depends(get_current_user)):
    """DELETE /api/forecasts/:id — delete, only if it belongs to the current user"""
    collection = get_forecasts_collection()
    try:
        oid = ObjectId(forecast_id)
    except InvalidId:
        raise HTTPException(status_code=404, detail="Forecast not found")

    result = collection.delete_one({"_id": oid, "owner": user["email"]})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Forecast not found")
    return


@app.get("/")
def root():
    return {"message": "PahadPulse AI backend is running"}
