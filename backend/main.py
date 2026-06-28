from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional

app = FastAPI(title="PahadPulse AI Backend")

# ---- CORS: allow the Next.js frontend to call this API ----
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---- Data model ----
class Forecast(BaseModel):
    id: Optional[int] = None
    product: str
    market: str
    demand_score: int
    predicted_price: float


# ---- In-memory data (Week 5 will move this to a real database) ----
forecasts: list[dict] = [
    {"id": 1, "product": "Apples", "market": "Mussoorie", "demand_score": 82, "predicted_price": 120.0},
    {"id": 2, "product": "Pashmina Shawls", "market": "Almora", "demand_score": 65, "predicted_price": 1500.0},
    {"id": 3, "product": "Rajma (Kidney Beans)", "market": "Chamoli", "demand_score": 90, "predicted_price": 180.0},
]
next_id = 4


# ---- Global error handler ----
@app.exception_handler(Exception)
async def generic_exception_handler(request, exc):
    return JSONResponse(status_code=500, content={"detail": f"Internal server error: {str(exc)}"})


# ---- Routes ----

@app.get("/api/forecasts", status_code=200)
def list_forecasts():
    """GET /api/forecasts — list all forecasts"""
    return forecasts


@app.get("/api/forecasts/search", status_code=200)
def search_forecasts(q: str = Query(..., min_length=1)):
    """GET /api/forecasts/search?q=... — search forecasts by product or market name"""
    results = [
        f for f in forecasts
        if q.lower() in f["product"].lower() or q.lower() in f["market"].lower()
    ]
    return results


@app.get("/api/forecasts/{forecast_id}", status_code=200)
def get_forecast(forecast_id: int):
    """GET /api/forecasts/:id — get a single forecast"""
    for f in forecasts:
        if f["id"] == forecast_id:
            return f
    raise HTTPException(status_code=404, detail="Forecast not found")


@app.post("/api/forecasts", status_code=201)
def create_forecast(forecast: Forecast):
    """POST /api/forecasts — create a forecast"""
    global next_id
    if not forecast.product or not forecast.market:
        raise HTTPException(status_code=400, detail="Product and market are required")

    new_forecast = forecast.dict()
    new_forecast["id"] = next_id
    next_id += 1
    forecasts.append(new_forecast)
    return new_forecast


@app.put("/api/forecasts/{forecast_id}", status_code=200)
def update_forecast(forecast_id: int, forecast: Forecast):
    """PUT /api/forecasts/:id — update an existing forecast"""
    for i, f in enumerate(forecasts):
        if f["id"] == forecast_id:
            updated = forecast.dict()
            updated["id"] = forecast_id
            forecasts[i] = updated
            return updated
    raise HTTPException(status_code=404, detail="Forecast not found")


@app.delete("/api/forecasts/{forecast_id}", status_code=204)
def delete_forecast(forecast_id: int):
    """DELETE /api/forecasts/:id — delete a forecast"""
    for i, f in enumerate(forecasts):
        if f["id"] == forecast_id:
            forecasts.pop(i)
            return
    raise HTTPException(status_code=404, detail="Forecast not found")


@app.get("/")
def root():
    return {"message": "PahadPulse AI backend is running"}
