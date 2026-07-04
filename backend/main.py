from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from pydantic import BaseModel
from typing import Optional
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "pahadpulse")

# ---- DB client (created on startup) ----
db_client: AsyncIOMotorClient = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    global db_client
    db_client = AsyncIOMotorClient(MONGO_URI)
    print("✅ Connected to MongoDB")
    # Seed initial data if collection is empty
    collection = db_client[DB_NAME]["forecasts"]
    if await collection.count_documents({}) == 0:
        await collection.insert_many([
            {"product": "Apples", "market": "Mussoorie", "demand_score": 82, "predicted_price": 120.0},
            {"product": "Pashmina Shawls", "market": "Almora", "demand_score": 65, "predicted_price": 1500.0},
            {"product": "Rajma (Kidney Beans)", "market": "Chamoli", "demand_score": 90, "predicted_price": 180.0},
        ])
        print("✅ Seeded initial forecasts")
    yield
    db_client.close()
    print("🔌 MongoDB connection closed")

app = FastAPI(title="PahadPulse AI Backend", lifespan=lifespan)

# ---- CORS ----
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---- Helper: convert MongoDB document to JSON-safe dict ----
def serialize(doc: dict) -> dict:
    doc["id"] = str(doc.pop("_id"))
    return doc

# ---- Pydantic models ----
class ForecastIn(BaseModel):
    product: str
    market: str
    demand_score: int
    predicted_price: float

class ForecastUpdate(BaseModel):
    product: Optional[str] = None
    market: Optional[str] = None
    demand_score: Optional[int] = None
    predicted_price: Optional[float] = None

# ---- Global error handler ----
@app.exception_handler(Exception)
async def generic_exception_handler(request, exc):
    return JSONResponse(status_code=500, content={"detail": f"Internal server error: {str(exc)}"})

# ---- Helper: get collection ----
def get_col():
    return db_client[DB_NAME]["forecasts"]


# ---- Routes ----

@app.get("/")
async def root():
    return {"message": "PahadPulse AI backend is running with MongoDB ✅"}


@app.get("/api/forecasts", status_code=200)
async def list_forecasts():
    """GET /api/forecasts — list all forecasts from MongoDB"""
    col = get_col()
    docs = await col.find().to_list(100)
    return [serialize(d) for d in docs]


@app.get("/api/forecasts/search", status_code=200)
async def search_forecasts(q: str = Query(..., min_length=1)):
    """GET /api/forecasts/search?q=... — search by product or market"""
    col = get_col()
    docs = await col.find({
        "$or": [
            {"product": {"$regex": q, "$options": "i"}},
            {"market": {"$regex": q, "$options": "i"}}
        ]
    }).to_list(100)
    return [serialize(d) for d in docs]


@app.get("/api/forecasts/{forecast_id}", status_code=200)
async def get_forecast(forecast_id: str):
    """GET /api/forecasts/:id — get a single forecast"""
    try:
        oid = ObjectId(forecast_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid forecast ID format")
    col = get_col()
    doc = await col.find_one({"_id": oid})
    if not doc:
        raise HTTPException(status_code=404, detail="Forecast not found")
    return serialize(doc)


@app.post("/api/forecasts", status_code=201)
async def create_forecast(forecast: ForecastIn):
    """POST /api/forecasts — create a new forecast in MongoDB"""
    if not forecast.product or not forecast.market:
        raise HTTPException(status_code=400, detail="Product and market are required")
    col = get_col()
    result = await col.insert_one(forecast.dict())
    doc = await col.find_one({"_id": result.inserted_id})
    return serialize(doc)


@app.put("/api/forecasts/{forecast_id}", status_code=200)
async def update_forecast(forecast_id: str, forecast: ForecastUpdate):
    """PUT /api/forecasts/:id — update a forecast in MongoDB"""
    try:
        oid = ObjectId(forecast_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid forecast ID format")
    col = get_col()
    update_data = {k: v for k, v in forecast.dict().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields provided to update")
    result = await col.update_one({"_id": oid}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Forecast not found")
    doc = await col.find_one({"_id": oid})
    return serialize(doc)


@app.delete("/api/forecasts/{forecast_id}", status_code=204)
async def delete_forecast(forecast_id: str):
    """DELETE /api/forecasts/:id — delete a forecast from MongoDB"""
    try:
        oid = ObjectId(forecast_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid forecast ID format")
    col = get_col()
    result = await col.delete_one({"_id": oid})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Forecast not found")
    return
